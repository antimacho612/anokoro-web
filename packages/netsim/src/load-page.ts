import { ManualClock, systemClock, type Clock, type TimerId } from "./clock.ts";

export const TICK_MS = 100;
export const MAX_CONNECTIONS = 2;
export const CGI_WAIT_MS = 1200;
export const AD_BANNER = { name: "ad/banner_468x60.gif", fakeBytes: 12000 } as const;

export interface LineSpeed {
  /** 実効速度（バイト/秒） */
  bytesPerSec: number;
  /** 応答遅延（ms） */
  latencyMs: number;
}

/** era-checker の AssetRef と同じ形。kind が counter のものは CGI として扱う */
export interface LoadAsset {
  name: string;
  fakeBytes: number;
  kind: "img" | "background" | "bgm" | "counter";
}

/** index は LoadOptions.assets の添字 */
export type LoadTarget = { kind: "ad" } | { kind: "asset"; index: number };

export type LoadEvent =
  | { type: "connecting"; at: number }
  | { type: "waiting"; at: number }
  | { type: "html-start"; at: number }
  /** fraction は元のソースのバイト数で数えた進捗。置換後の HTML も同じ割合まで書く */
  | { type: "html"; at: number; bytes: number; fraction: number }
  | { type: "html-done"; at: number }
  | { type: "asset-start"; at: number; target: LoadTarget }
  | { type: "asset-progress"; at: number; target: LoadTarget; fraction: number }
  | { type: "asset-done"; at: number; target: LoadTarget }
  /** 素材の読み込み中、ティックごとに出す。current はステータスバーに出す項目 */
  | { type: "status"; at: number; remaining: number; current: LoadTarget; name: string }
  | { type: "progress"; at: number; loadedBytes: number; totalBytes: number }
  | { type: "complete"; at: number; elapsedMs: number; totalBytes: number }
  | { type: "aborted"; at: number };

export interface LoadOptions {
  line: LineSpeed;
  /** 元のソースのバイト数 */
  htmlBytes: number;
  /** 文書順の素材 */
  assets: readonly LoadAsset[];
  clock?: Clock;
  onEvent?: (event: LoadEvent) => void;
}

export type LoadOutcome =
  | { status: "complete"; elapsedMs: number; totalBytes: number }
  | { status: "aborted" };

export interface LoadHandle {
  /** 打ち切る。表示はその時点のまま残す前提で、以降のイベントは aborted だけ */
  abort(): void;
  readonly done: Promise<LoadOutcome>;
}

type ItemState = "wait" | "conn" | "xfer" | "done";

interface QueueItem {
  target: LoadTarget;
  name: string;
  bytes: number;
  waitMs: number;
  doneBytes: number;
  state: ItemState;
}

export function loadPage(options: LoadOptions): LoadHandle {
  const { line, htmlBytes, assets } = options;
  const clock = options.clock ?? systemClock;
  const emit = options.onEvent ?? (() => {});
  const perTick = (line.bytesPerSec * TICK_MS) / 1000;
  const t0 = clock.now();

  const queue: QueueItem[] = [
    {
      target: { kind: "ad" },
      name: AD_BANNER.name,
      bytes: AD_BANNER.fakeBytes,
      waitMs: line.latencyMs,
      doneBytes: 0,
      state: "wait",
    },
    ...assets.map((a, index): QueueItem => ({
      target: { kind: "asset", index },
      name: a.name,
      bytes: a.fakeBytes,
      waitMs: line.latencyMs + (a.kind === "counter" ? CGI_WAIT_MS : 0),
      doneBytes: 0,
      state: "wait",
    })),
  ];
  const totalBytes = htmlBytes + queue.reduce((n, x) => n + x.bytes, 0);

  let timer: TimerId | null = null;
  let finished = false;
  let resolve!: (outcome: LoadOutcome) => void;
  const done = new Promise<LoadOutcome>((r) => (resolve = r));

  const later = (ms: number, fn: () => void) => {
    timer = clock.setTimeout(() => {
      timer = null;
      fn();
    }, ms);
  };

  const finish = (outcome: LoadOutcome) => {
    finished = true;
    resolve(outcome);
  };

  let htmlGot = 0;
  const htmlTick = () => {
    if (htmlGot >= htmlBytes) {
      emit({ type: "html-done", at: clock.now() });
      assetTick();
      return;
    }
    htmlGot = Math.min(htmlBytes, htmlGot + perTick);
    const at = clock.now();
    emit({ type: "html", at, bytes: htmlGot, fraction: htmlGot / htmlBytes });
    emit({ type: "progress", at, loadedBytes: htmlGot, totalBytes });
    later(TICK_MS, htmlTick);
  };

  const assetTick = () => {
    const at = clock.now();
    const active = queue.filter((x) => x.state === "conn" || x.state === "xfer");
    for (const x of queue) {
      if (active.length >= MAX_CONNECTIONS) break;
      if (x.state === "wait") {
        x.state = "conn";
        active.push(x);
      }
    }
    for (const x of active) {
      if (x.state !== "conn") continue;
      x.waitMs -= TICK_MS;
      if (x.waitMs <= 0) {
        x.state = "xfer";
        emit({ type: "asset-start", at, target: x.target });
      }
    }
    const transferring = active.filter((x) => x.state === "xfer");
    for (const x of transferring) {
      x.doneBytes = Math.min(x.bytes, x.doneBytes + perTick / transferring.length);
      emit({ type: "asset-progress", at, target: x.target, fraction: x.doneBytes / x.bytes });
      if (x.doneBytes >= x.bytes) {
        x.state = "done";
        emit({ type: "asset-done", at, target: x.target });
      }
    }
    const left = queue.filter((x) => x.state !== "done");
    const current = left.find((x) => x.state === "xfer") ?? left[0];
    if (current) {
      emit({
        type: "status",
        at,
        remaining: left.length,
        current: current.target,
        name: current.name,
      });
    }
    const loaded = htmlBytes + queue.reduce((n, x) => n + x.doneBytes, 0);
    emit({ type: "progress", at, loadedBytes: loaded, totalBytes });
    later(TICK_MS, left.length > 0 ? assetTick : complete);
  };

  const complete = () => {
    const at = clock.now();
    const elapsedMs = at - t0;
    emit({ type: "complete", at, elapsedMs, totalBytes });
    finish({ status: "complete", elapsedMs, totalBytes });
  };

  emit({ type: "connecting", at: t0 });
  later(line.latencyMs * 3, () => {
    emit({ type: "waiting", at: clock.now() });
    later(line.latencyMs * 2 + TICK_MS, () => {
      emit({ type: "html-start", at: clock.now() });
      htmlTick();
    });
  });

  return {
    abort() {
      if (finished) return;
      if (timer !== null) clock.clearTimeout(timer);
      timer = null;
      emit({ type: "aborted", at: clock.now() });
      finish({ status: "aborted" });
    },
    done,
  };
}

/** 時計を最後まで進め、読み込みで出るイベントをすべて返す */
export function simulateLoad(options: Omit<LoadOptions, "clock" | "onEvent">): LoadEvent[] {
  const clock = new ManualClock();
  const events: LoadEvent[] = [];
  loadPage({ ...options, clock, onEvent: (e) => events.push(e) });
  clock.runAll();
  return events;
}
