import { ManualClock } from "@anokoro/netsim";
import { describe, expect, it } from "vite-plus/test";
import { createKitStore, type KitStore } from "../store.ts";
import type { NetFrameWriter } from "./frame-page.ts";
import { NetController } from "./net-controller.ts";

const SOURCE =
  '<html><head><title>t</title></head><body background="kabe1.gif">あなたは <!--COUNTER--> 人目<img src="koji.gif"></body></html>';

function recordingPage() {
  const calls: string[] = [];
  let html = "";
  const page: NetFrameWriter = {
    open: () => calls.push("open"),
    write: (chunk) => void (html += chunk),
    close: () => calls.push("close"),
    assetStart: (i, a) => calls.push(`start:${i}:${a.kind}`),
    assetProgress: () => {},
    assetDone: (i, a) => calls.push(`done:${i}:${a.kind}:${a.resolved.slice(0, 6)}`),
  };
  return { page, calls, html: () => html };
}

const flush = () => new Promise<void>((resolve) => setTimeout(resolve, 0));

function setup(year: number, store: KitStore = createKitStore({ year, source: SOURCE })) {
  const clock = new ManualClock();
  const recorder = recordingPage();
  const modem = { played: 0, stopped: 0 };
  const statuses: string[] = [];
  store.subscribe((s, p) => {
    if (s.status !== p.status) statuses.push(s.status);
  });
  const controller = new NetController({
    store,
    clock,
    now: () => 1_000_000,
    waitForBlankFrame: () => Promise.resolve(recorder.page),
    modem: { play: () => void modem.played++, stop: () => void modem.stopped++ },
  });
  controller.stopOnEditOrYearChange();
  const runAll = async () => {
    for (let i = 0; i < 100 && (clock.pending > 0 || i === 0); i++) {
      await flush();
      clock.runAll();
      await flush();
    }
  };
  return { store, clock, recorder, modem, statuses, controller, runAll };
}

describe("常時接続の回線", () => {
  it("ダイヤルせずに読み込み、完了を記録する", async () => {
    const { store, recorder, modem, statuses, controller, runAll } = setup(2003);
    void controller.reload();
    expect(store.getState().loading).toBe(true);
    await runAll();
    const state = store.getState();
    expect(state).toMatchObject({
      loading: false,
      display: "net",
      counter: 775,
      lastKiriban: null,
    });
    expect(state.lastLoad?.lineName).toBe("ADSL 12M");
    expect(modem.played).toBe(0);
    expect(statuses[0]).toBe("サイト www.hogespace.example に接続しています...");
    expect(statuses).toContain("Web サイトが見つかりました。応答を待っています...");
    expect(statuses.at(-1)).toMatch(/^ページが表示されました（\d+\.\d秒）$/);
    expect(recorder.html()).toContain('data-anokoro-ctr="1"');
    expect(recorder.html().endsWith("</html>")).toBe(true);
    expect(recorder.calls.slice(0, 2)).toEqual(["open", "close"]);
    expect(recorder.calls).toEqual(
      expect.arrayContaining([
        "start:2:img",
        "done:0:background:data:i",
        "done:1:counter:000775",
        "done:2:img:data:i",
      ]),
    );
  });
});

describe("ダイヤルアップ", () => {
  it("未接続で更新すると、接続音を鳴らしてダイヤルしてから読み込む", async () => {
    const { store, modem, statuses, controller, runAll } = setup(1997);
    void controller.reload();
    expect(statuses[0]).toBe("ダイヤルアップ接続を開始します...");
    expect(store.getState().connection).toBe("dialing");
    expect(modem.played).toBe(1);
    await runAll();
    expect(statuses).toContain("呼び出し中...");
    expect(store.getState()).toMatchObject({
      connection: "online",
      connectedAtMs: 1_000_000,
      loading: false,
    });
  });

  it("接続音が OFF なら鳴らさない。ISDN は鳴らさない", () => {
    const off = setup(1997);
    off.store.getState().setSound(false);
    off.controller.connectByUser();
    expect(off.modem.played).toBe(0);

    const isdn = setup(1997);
    isdn.controller.changeLine("isdn");
    isdn.controller.connectByUser();
    expect(isdn.modem.played).toBe(0);
  });

  it("接続ボタンで接続すると、速度を知らせる", async () => {
    const { store, statuses, controller, runAll } = setup(2000);
    controller.connectByUser();
    await runAll();
    expect(store.getState().connection).toBe("online");
    expect(statuses.at(-1)).toBe("64Kbps で接続しました");
  });

  it("ダイヤル中に切断すると、接続音も読み込みも止めて未接続に戻る", async () => {
    const { store, clock, modem, controller, runAll } = setup(1997);
    void controller.reload();
    clock.advance(3000);
    controller.hangup();
    await runAll();
    expect(modem.stopped).toBe(1);
    expect(store.getState()).toMatchObject({
      connection: "offline",
      loading: false,
      status: "切断しました",
      counter: 774,
    });
  });

  it("回線を切り替えると切断する", async () => {
    const { store, controller, runAll } = setup(2000);
    controller.connectByUser();
    await runAll();
    controller.changeLine("m56");
    expect(store.getState()).toMatchObject({ connection: "offline", lineKey: "m56" });
  });

  it("年を変えると切断する", async () => {
    const { store, controller, runAll } = setup(2000);
    controller.connectByUser();
    await runAll();
    store.getState().setYear(2000 - 1);
    expect(store.getState().connection).toBe("offline");
  });
});

describe("打ち切り", () => {
  it("中止すると、途中の表示を残して止まる", async () => {
    const { store, clock, recorder, controller } = setup(2003);
    void controller.reload();
    await flush();
    clock.advance(400);
    controller.stop();
    clock.runAll();
    expect(store.getState()).toMatchObject({
      loading: false,
      status: "中止しました",
      display: "net",
      lastLoad: null,
    });
    expect(recorder.calls).toContain("close");
  });

  it("編集すると、読み込みを打ち切る", async () => {
    const { store, clock, controller } = setup(2003);
    void controller.reload();
    await flush();
    clock.advance(400);
    store.getState().edit(SOURCE + "!");
    clock.runAll();
    expect(store.getState()).toMatchObject({ loading: false, status: "読み込み中..." });
  });

  it("読み込み中にもう一度更新すると、古い読み込みは止まる", async () => {
    const { store, controller, runAll } = setup(2003);
    void controller.reload();
    await flush();
    void controller.reload();
    await runAll();
    expect(store.getState()).toMatchObject({ counter: 776, loading: false, netFrameKey: 2 });
  });
});

describe("キリ番", () => {
  it("キリ番を踏むと記録し、完了の文言で上書きしない", async () => {
    const store = createKitStore({ year: 2003, source: SOURCE });
    store.setState({ counter: 776 });
    const { statuses, controller, runAll } = setup(2003, store);
    void controller.reload();
    await runAll();
    expect(store.getState().lastKiriban).toBe(777);
    expect(statuses).toContain("キリ番 777 を踏みました！");
    expect(statuses.at(-1)).not.toMatch(/^ページが表示されました/);

    void controller.reload();
    await runAll();
    expect(store.getState().lastKiriban).toBeNull();
  });
});
