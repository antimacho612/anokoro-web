import { checkEra, type AssetRef } from "@anokoro/era-checker";
import { getLine, type LineEntry, type LineKey } from "@anokoro/era-data";
import {
  dial,
  loadPage,
  systemClock,
  type Clock,
  type DialHandle,
  type LoadEvent,
  type LoadHandle,
} from "@anokoro/netsim";
import { isKiriban } from "@anokoro/shared";
import { PSEUDO_HOST, SITE_ROOT } from "../../../shared/config/index.ts";
import type { KitStore } from "../../../entities/kit-state/index.ts";
import type { NetFrameWriter } from "../../../shared/lib/index.ts";
import type { ModemSound } from "../lib/modem-player.ts";

export const STATUS_DIAL_START = "ダイヤルアップ接続を開始します...";
export const STATUS_STOPPED = "中止しました";
export const STATUS_HUNG_UP = "切断しました";

export interface NetControllerDeps {
  store: KitStore;
  waitForBlankFrame: () => Promise<NetFrameWriter | null>;
  modem: ModemSound;
  onLineChange?: (key: LineKey) => void;
  clock?: Clock;
  now?: () => number;
}

export function connectedMessage(line: LineEntry): string {
  return `${line.connectedLabel ?? line.name} で接続しました`;
}

function htmlBytesOf(source: string): number {
  return new TextEncoder().encode(source).length;
}

export class NetController {
  readonly #store: KitStore;
  readonly #waitForBlankFrame: () => Promise<NetFrameWriter | null>;
  readonly #modem: ModemSound;
  readonly #onLineChange: (key: LineKey) => void;
  readonly #clock: Clock;
  readonly #now: () => number;
  #dialHandle: DialHandle | null = null;
  #dialing: Promise<boolean> | null = null;
  #load: LoadHandle | null = null;
  #page: NetFrameWriter | null = null;
  #generation = 0;

  constructor(deps: NetControllerDeps) {
    this.#store = deps.store;
    this.#waitForBlankFrame = deps.waitForBlankFrame;
    this.#modem = deps.modem;
    this.#onLineChange = deps.onLineChange ?? (() => {});
    this.#clock = deps.clock ?? systemClock;
    this.#now = deps.now ?? Date.now;
  }

  stopOnEditOrYearChange(): () => void {
    return this.#store.subscribe((state, prev) => {
      if (state.year !== prev.year) {
        if (state.connection !== "offline") this.hangup();
        else this.#cancelLoad();
      } else if (state.source !== prev.source) {
        this.#cancelLoad();
      }
    });
  }

  #line(): LineEntry {
    return getLine(this.#store.getState().lineKey);
  }

  #setStatus(status: string): void {
    this.#store.setState({ status });
  }

  connectByUser(): void {
    void this.#connect().then((ok) => {
      if (ok) this.#setStatus(connectedMessage(this.#line()));
    });
  }

  /**
   * ダイヤルする。接続音を鳴らすため、クリックの処理中に同期で呼び始める
   * （出典: https://developer.mozilla.org/en-US/docs/Web/Media/Guides/Autoplay）
   */
  #connect(): Promise<boolean> {
    const line = this.#line();
    const { connection, sound } = this.#store.getState();
    if (line.dial === "always" || connection === "online") return Promise.resolve(true);
    if (this.#dialing) return this.#dialing;

    this.#store.setState({ connection: "dialing", dialMessage: "" });
    if (line.dial === "modem" && sound) this.#modem.play();
    const handle = dial({
      kind: line.dial,
      clock: this.#clock,
      onStep: ({ message }) => this.#store.setState({ dialMessage: message, status: message }),
    });
    this.#dialHandle = handle;
    this.#dialing = handle.done.then((connected) => {
      if (this.#dialHandle !== handle) return false;
      this.#dialHandle = null;
      this.#dialing = null;
      if (connected) {
        this.#store.setState({ connection: "online", connectedAtMs: this.#now(), dialMessage: "" });
      }
      return connected;
    });
    return this.#dialing;
  }

  hangup(): void {
    this.#dialHandle?.abort();
    this.#dialHandle = null;
    this.#dialing = null;
    this.#modem.stop();
    this.#store.setState({ connection: "offline", connectedAtMs: null, dialMessage: "" });
    this.#cancelLoad(STATUS_HUNG_UP);
  }

  changeLine(key: LineKey): void {
    if (this.#store.getState().connection !== "offline") this.hangup();
    this.#store.setState({ lineKey: key });
    this.#onLineChange(key);
  }

  stop(): void {
    this.#cancelLoad(STATUS_STOPPED);
  }

  #cancelLoad(message?: string): void {
    this.#generation++;
    this.#load?.abort();
    this.#load = null;
    const page = this.#page;
    this.#page = null;
    if (!this.#store.getState().loading) return;
    page?.close();
    this.#store.setState({
      loading: false,
      progressRatio: 0,
      adLoading: false,
      ...(message === undefined ? {} : { status: message }),
    });
  }

  async reload(): Promise<void> {
    this.#cancelLoad();
    const generation = this.#generation;
    const isCurrent = () => generation === this.#generation;
    this.#store.setState({ loading: true, progressRatio: 0 });

    if (this.#line().dial !== "always" && this.#store.getState().connection !== "online") {
      this.#setStatus(STATUS_DIAL_START);
      const connected = await this.#connect();
      if (!isCurrent()) return;
      if (!connected) {
        this.#store.setState({ loading: false });
        return;
      }
    }

    const line = this.#line();
    const { source, year, counter: prevCounter, netFrameKey, pagePath } = this.#store.getState();
    const counter = prevCounter + 1;
    const lastKiriban = isKiriban(counter) ? counter : null;
    this.#store.setState({
      counter,
      lastKiriban,
      shownSource: source,
      ...(lastKiriban === null ? {} : { status: `キリ番 ${lastKiriban} を踏みました！` }),
    });
    const result = checkEra(source, { year, mode: "net", counter });

    const blankFrame = this.#waitForBlankFrame();
    this.#store.setState({ display: "net", netFrameKey: netFrameKey + 1 });
    const page = await blankFrame;
    if (!isCurrent()) return;
    if (!page) {
      this.#store.setState({ loading: false, display: "local" });
      return;
    }
    this.#page = page;

    let written = 0;
    const writeUpTo = (fraction: number): void => {
      const next = Math.floor(result.html.length * fraction);
      page.write(result.html.slice(written, next));
      written = next;
    };
    const assetAt = (index: number): AssetRef | undefined => result.assets[index];

    const apply = (event: LoadEvent): void => {
      switch (event.type) {
        case "connecting":
          this.#setStatus(`サイト ${PSEUDO_HOST} に接続しています...`);
          break;
        case "waiting":
          this.#setStatus("Web サイトが見つかりました。応答を待っています...");
          break;
        case "html-start":
          page.open();
          this.#store.setState({
            adLoading: true,
            status: `ページ ${SITE_ROOT}${pagePath} を開いています...`,
          });
          break;
        case "html":
          writeUpTo(event.fraction);
          break;
        case "html-done":
          writeUpTo(1);
          page.close();
          break;
        case "asset-start":
        case "asset-progress":
        case "asset-done": {
          if (event.target.kind === "ad") {
            if (event.type === "asset-done") this.#store.setState({ adLoading: false });
            break;
          }
          const index = event.target.index;
          const asset = assetAt(index);
          if (!asset) break;
          if (event.type === "asset-start") page.assetStart(index, asset);
          else if (event.type === "asset-progress")
            page.assetProgress(index, asset, event.fraction);
          else page.assetDone(index, asset);
          break;
        }
        case "status":
          this.#setStatus(
            `（残り ${event.remaining} 項目）${SITE_ROOT}${event.name} をダウンロードしています...`,
          );
          break;
        case "progress":
          this.#store.setState({ progressRatio: event.loadedBytes / event.totalBytes });
          break;
        case "complete": {
          this.#load = null;
          this.#page = null;
          const lastLoad = {
            elapsedMs: event.elapsedMs,
            totalBytes: event.totalBytes,
            lineName: line.name,
          };
          this.#store.setState({
            loading: false,
            progressRatio: 0,
            lastLoad,
            ...(lastKiriban === null ? { status: completeMessage(event.elapsedMs) } : {}),
          });
          break;
        }
        case "aborted":
          break;
      }
    };

    this.#load = loadPage({
      line,
      htmlBytes: htmlBytesOf(source),
      assets: result.assets,
      clock: this.#clock,
      onEvent: (event) => {
        if (isCurrent()) apply(event);
      },
    });
  }
}

export function formatSeconds(ms: number): string {
  return (ms / 1000).toFixed(1);
}

export function completeMessage(elapsedMs: number): string {
  return `ページが表示されました（${formatSeconds(elapsedMs)}秒）`;
}
