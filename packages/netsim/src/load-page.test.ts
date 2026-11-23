import { getLine } from "@anokoro/era-data";
import { describe, expect, it } from "vite-plus/test";
import {
  AD_BANNER,
  ManualClock,
  loadPage,
  simulateLoad,
  type LoadAsset,
  type LoadEvent,
  type LoadTarget,
} from "./index.ts";
import { TICK_MS } from "./load-page.ts";

const SLOW = { bytesPerSec: 1000, latencyMs: 100 };
const SLOW_BYTES_PER_TICK = (SLOW.bytesPerSec * TICK_MS) / 1000;

const img = (name: string, fakeBytes: number): LoadAsset => ({ name, fakeBytes, kind: "img" });

const key = (t: LoadTarget) => (t.kind === "ad" ? "ad" : `#${t.index}`);

function times(events: LoadEvent[], type: "asset-start" | "asset-done"): Record<string, number> {
  const out: Record<string, number> = {};
  for (const e of events) if (e.type === type) out[key(e.target)] = e.at;
  return out;
}

describe("接続と HTML の流し込み", () => {
  it("応答遅延の 3 倍と 2 倍＋100ms を待ってから流し込む", () => {
    const events = simulateLoad({
      line: { bytesPerSec: 3000, latencyMs: 400 },
      htmlBytes: 10,
      assets: [],
    });
    expect(events.find((e) => e.type === "connecting")?.at).toBe(0);
    expect(events.find((e) => e.type === "waiting")?.at).toBe(1200);
    expect(events.find((e) => e.type === "html-start")?.at).toBe(2100);
  });

  it("ティックごとに実効速度 × 0.1 秒ぶん進む", () => {
    const events = simulateLoad({ line: SLOW, htmlBytes: 250, assets: [] });
    const html = events.filter((e) => e.type === "html");
    expect(html.map((e) => [e.at, e.bytes, e.fraction])).toEqual([
      [600, 100, 0.4],
      [700, 200, 0.8],
      [800, 250, 1],
    ]);
    expect(events.find((e) => e.type === "html-done")?.at).toBe(900);
  });
});

describe("素材の読み込み", () => {
  it("広告バナーを先頭に、文書順に読み込む", () => {
    const events = simulateLoad({
      line: SLOW,
      htmlBytes: 0,
      assets: [img("a.gif", 100), img("b.gif", 100)],
    });
    const starts = events.filter((e) => e.type === "asset-start").map((e) => key(e.target));
    expect(starts).toEqual(["ad", "#0", "#1"]);
  });

  it("同時に読み込むのは 2 件までで、3 件目は先に終わった枠が空いてから始める", () => {
    const events = simulateLoad({
      line: SLOW,
      htmlBytes: 0,
      assets: [img("a.gif", 200), img("b.gif", 200), img("c.gif", 200)],
    });
    const open = new Set<string>();
    let peak = 0;
    for (const e of events) {
      if (e.type === "asset-start") open.add(key(e.target));
      if (e.type === "asset-done") open.delete(key(e.target));
      peak = Math.max(peak, open.size);
    }
    expect(peak).toBe(2);

    const start = times(events, "asset-start");
    const done = times(events, "asset-done");
    expect(start["#1"]).toBeGreaterThan(done["#0"]!);
  });

  it("転送中の件数で帯域を等分し、終わった分の帯域は残りが使う", () => {
    const events = simulateLoad({
      line: SLOW,
      htmlBytes: 0,
      assets: [img("a.gif", 1000)],
    });
    const at = (t: number, k: string) =>
      events.find((e) => e.type === "asset-progress" && e.at === t && key(e.target) === k);
    const shared = SLOW_BYTES_PER_TICK / 2;
    const sharedTicks = 1000 / shared;
    expect(at(600, "ad")).toMatchObject({ fraction: shared / AD_BANNER.fakeBytes });
    expect(at(600, "#0")).toMatchObject({ fraction: shared / 1000 });
    const doneAt = 600 + (sharedTicks - 1) * TICK_MS;
    expect(times(events, "asset-done")["#0"]).toBe(doneAt);
    expect(at(doneAt + TICK_MS, "ad")).toMatchObject({
      fraction: (sharedTicks * shared + SLOW_BYTES_PER_TICK) / AD_BANNER.fakeBytes,
    });
  });

  it("カウンターは CGI の待ちとして 1,200ms 遅れて転送を始める", () => {
    const run = (kind: LoadAsset["kind"]) =>
      times(
        simulateLoad({ line: SLOW, htmlBytes: 0, assets: [{ name: "x", fakeBytes: 100, kind }] }),
        "asset-start",
      )["#0"]!;
    expect(run("img")).toBe(600);
    expect(run("counter") - run("img")).toBe(1200);
  });

  it("ステータスには残りの項目数と、転送中の項目を出す", () => {
    const events = simulateLoad({ line: SLOW, htmlBytes: 0, assets: [img("a.gif", 100)] });
    const first = events.find((e) => e.type === "status");
    expect(first).toMatchObject({ remaining: 2, name: AD_BANNER.name, current: { kind: "ad" } });
  });
});

describe("完了", () => {
  it("経過時間と合計バイト数を返す", () => {
    const events = simulateLoad({ line: SLOW, htmlBytes: 0, assets: [] });
    const done = events.find((e) => e.type === "asset-done");
    const adTicks = AD_BANNER.fakeBytes / SLOW_BYTES_PER_TICK;
    expect(done?.at).toBe(600 + (adTicks - 1) * TICK_MS);
    expect(events.at(-1)).toEqual({
      type: "complete",
      at: 12600,
      elapsedMs: 12600,
      totalBytes: 12000,
    });
  });

  it("最後の進捗は全体の 100%", () => {
    const events = simulateLoad({
      line: getLine("m56"),
      htmlBytes: 3000,
      assets: [img("a.gif", 6200)],
    });
    const last = events.filter((e) => e.type === "progress").at(-1);
    expect(last).toMatchObject({ loadedBytes: 21200, totalBytes: 21200 });
  });

  it("進捗は最初から全体量で数え、後ろに戻らない", () => {
    const events = simulateLoad({
      line: getLine("m56"),
      htmlBytes: 3000,
      assets: [img("a.gif", 6200)],
    });
    const progress = events.filter((e) => e.type === "progress");
    expect(new Set(progress.map((e) => e.totalBytes))).toEqual(new Set([21200]));
    const loaded = progress.map((e) => e.loadedBytes);
    expect(loaded).toEqual([...loaded].sort((a, b) => a - b));
  });

  it("done は完了の結果で解決する", async () => {
    const clock = new ManualClock();
    const handle = loadPage({ line: SLOW, htmlBytes: 0, assets: [], clock });
    clock.runAll();
    await expect(handle.done).resolves.toEqual({
      status: "complete",
      elapsedMs: 12600,
      totalBytes: 12000,
    });
  });
});

describe("中止", () => {
  it("中止すると以降のイベントは出ず、タイマーも残らない", async () => {
    const clock = new ManualClock();
    const events: LoadEvent[] = [];
    const handle = loadPage({
      line: SLOW,
      htmlBytes: 500,
      assets: [img("a.gif", 100)],
      clock,
      onEvent: (e) => events.push(e),
    });
    clock.advance(750);
    handle.abort();
    const count = events.length;
    clock.runAll();

    expect(events.at(-1)).toEqual({ type: "aborted", at: 750 });
    expect(events.length).toBe(count);
    expect(clock.pending).toBe(0);
    expect(events.filter((e) => e.type === "html").map((e) => e.bytes)).toEqual([100, 200]);
    await expect(handle.done).resolves.toEqual({ status: "aborted" });
  });

  it("完了後の中止は何もしない", () => {
    const clock = new ManualClock();
    const events: LoadEvent[] = [];
    const handle = loadPage({
      line: SLOW,
      htmlBytes: 0,
      assets: [],
      clock,
      onEvent: (e) => events.push(e),
    });
    clock.runAll();
    handle.abort();
    expect(events.at(-1)?.type).toBe("complete");
  });
});
