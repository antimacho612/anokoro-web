import type { TopicId } from "@anokoro/era-checker";
import {
  clampYear,
  defaultLineForYear,
  resolutionPeriodForYear,
  type LineKey,
  type Resolution,
  type Year,
} from "@anokoro/era-data";
import { createStore, useStore, type StoreApi } from "zustand";
import { startHistory, type BrowserHistory } from "../site/browser-history.ts";
import { INDEX_PAGE, INITIAL_COUNTER } from "../site/site-model.ts";
import { resolutionAfterYearChange } from "./browser/resolution.ts";
import { lineAfterYearChange } from "./line/line-choice.ts";
import { TEMPLATE } from "./notepad/templates.ts";
import { DEFAULT_YEAR } from "./time-machine/year-param.ts";

export const STATUS_EDITING = "読み込み中...";
export const STATUS_LOCAL = "ローカルのファイルを表示しています";
export const STATUS_START = "ローカルのファイルを表示しています（「更新」で回線経由の読み込み）";

export type DialupConnection = "offline" | "dialing" | "online";

export type Display = "local" | "net";

export type InfoDialog = "usage" | "news" | "about";

export interface LastLoad {
  elapsedMs: number;
  totalBytes: number;
  lineName: string;
}

export interface KitState {
  year: Year;
  /** メモ帳で開いているページ */
  pagePath: string;
  history: BrowserHistory;
  /** 疑似ブラウザで開けなかった URL。開けたページを表示しているときは null */
  notFoundUrl: string | null;
  /** メモ帳に書かれている HTML */
  source: string;
  /** ローカル表示に使っている HTML。入力が止まってから source に追いつく */
  shownSource: string;
  /** 疑似ブラウザのステータスバー */
  status: string;
  resolution: Resolution;
  /** <!--COUNTER--> に入れる数 */
  counter: number;
  lastKiriban: number | null;
  lineKey: LineKey;
  connection: DialupConnection;
  connectedAtMs: number | null;
  dialMessage: string;
  sound: boolean;
  display: Display;
  netFrameKey: number;
  loading: boolean;
  progressRatio: number;
  adLoading: boolean;
  lastLoad: LastLoad | null;
  wantedHelpTopic: TopicId | null;
  helpOpen: boolean;
  infoDialog: InfoDialog | null;
  newsSeen: string | null;
  setYear: (year: number) => void;
  stepYear: (delta: number) => void;
  /** メモ帳での入力。表示はまだ更新しない */
  edit: (source: string) => void;
  /** 入力中の HTML でローカル表示を更新する */
  show: () => void;
  /** 中身を差し替えて、すぐにローカル表示を更新する */
  replace: (source: string) => void;
  /** 別のページをメモ帳と疑似ブラウザで開く */
  loadPage: (page: { path: string; html: string; history: BrowserHistory }) => void;
  showNotFound: (url: string, history: BrowserHistory) => void;
  setResolution: (resolution: Resolution) => void;
  setSound: (sound: boolean) => void;
  selectHelpTopic: (topic: TopicId) => void;
  openHelp: (topic?: TopicId) => void;
  closeHelp: () => void;
  toggleHelp: () => void;
  openInfo: (dialog: InfoDialog) => void;
  closeInfo: () => void;
  markNewsSeen: (date: string) => void;
}

export type KitStore = StoreApi<KitState>;

export interface KitStoreInit {
  year?: Year;
  source?: string;
}

export function createKitStore({
  year = DEFAULT_YEAR,
  source = TEMPLATE,
}: KitStoreInit = {}): KitStore {
  const initialYear = clampYear(year);
  return createStore<KitState>()((set, get) => {
    const moveTo = (next: number): void => {
      const { year: prev, resolution, lineKey } = get();
      const nextYear = clampYear(next);
      if (nextYear === prev) return;
      set({
        year: nextYear,
        resolution: resolutionAfterYearChange(prev, nextYear, resolution),
        lineKey: lineAfterYearChange(prev, nextYear, lineKey),
        display: "local",
      });
    };
    return {
      year: initialYear,
      pagePath: INDEX_PAGE,
      history: startHistory({ kind: "page", path: INDEX_PAGE }),
      notFoundUrl: null,
      source,
      shownSource: source,
      status: STATUS_START,
      resolution: resolutionPeriodForYear(initialYear).default,
      counter: INITIAL_COUNTER,
      lastKiriban: null,
      lineKey: defaultLineForYear(initialYear).key,
      connection: "offline",
      connectedAtMs: null,
      dialMessage: "",
      sound: true,
      display: "local",
      netFrameKey: 0,
      loading: false,
      progressRatio: 0,
      adLoading: false,
      lastLoad: null,
      wantedHelpTopic: null,
      helpOpen: false,
      infoDialog: null,
      newsSeen: null,
      setYear: moveTo,
      stepYear: (delta) => moveTo(get().year + delta),
      edit: (next) => set({ source: next, status: STATUS_EDITING }),
      show: () =>
        set({
          shownSource: get().source,
          status: STATUS_LOCAL,
          display: "local",
          notFoundUrl: null,
        }),
      replace: (next) => set({ source: next, shownSource: next, display: "local" }),
      loadPage: ({ path, html, history }) =>
        set({
          pagePath: path,
          history,
          notFoundUrl: null,
          source: html,
          shownSource: html,
          status: STATUS_LOCAL,
          display: "local",
        }),
      showNotFound: (notFoundUrl, history) =>
        set({ notFoundUrl, history, status: "ページが見つかりません", display: "local" }),
      setResolution: (resolution) => set({ resolution }),
      setSound: (sound) => set({ sound }),
      selectHelpTopic: (wantedHelpTopic) => set({ wantedHelpTopic }),
      openHelp: (topic) =>
        set(({ wantedHelpTopic }) => ({
          wantedHelpTopic: topic ?? wantedHelpTopic,
          helpOpen: true,
          infoDialog: null,
        })),
      closeHelp: () => set({ helpOpen: false }),
      toggleHelp: () =>
        set(({ helpOpen, infoDialog }) => ({
          helpOpen: !helpOpen,
          infoDialog: helpOpen ? infoDialog : null,
        })),
      openInfo: (infoDialog) => set({ infoDialog, helpOpen: false }),
      closeInfo: () => set({ infoDialog: null }),
      markNewsSeen: (newsSeen) => set({ newsSeen }),
    };
  });
}

export const kitStore: KitStore = createKitStore();

export function useKit<T>(selector: (state: KitState) => T): T {
  return useStore(kitStore, selector);
}
