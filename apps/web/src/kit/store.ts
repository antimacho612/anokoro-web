import type { TopicId } from "@anokoro/era-checker";
import {
  MAX_YEAR,
  MIN_YEAR,
  defaultLineForYear,
  resolutionPeriodForYear,
  type LineKey,
  type Resolution,
  type Year,
} from "@anokoro/era-data";
import { createStore, useStore, type StoreApi } from "zustand";
import { resolutionAfterYearChange } from "./browser/resolution.ts";
import { lineAfterYearChange } from "./line/line-choice.ts";
import { TEMPLATE } from "./notepad/templates.ts";
import { DEFAULT_YEAR } from "./time-machine/year-param.ts";

export const STATUS_EDITING = "読み込み中...";
export const STATUS_LOCAL = "ローカルのファイルを表示しています";
export const STATUS_START = "ローカルのファイルを表示しています（「更新」で回線経由の読み込み）";

export type DialupConnection = "offline" | "dialing" | "online";

export type Display = "local" | "net";

export interface LastLoad {
  elapsedMs: number;
  totalBytes: number;
  lineName: string;
}

export interface KitState {
  year: Year;
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
  /** ヘルプで開いているトピック。null は既定のトピック */
  helpTopic: TopicId | null;
  helpOpen: boolean;
  setYear: (year: number) => void;
  stepYear: (delta: number) => void;
  /** メモ帳での入力。表示はまだ更新しない */
  edit: (source: string) => void;
  /** 入力中の HTML でローカル表示を更新する */
  show: () => void;
  /** 中身を差し替えて、すぐにローカル表示を更新する */
  replace: (source: string) => void;
  setResolution: (resolution: Resolution) => void;
  setSound: (sound: boolean) => void;
  /** ヘルプのタブを切り替える */
  selectHelpTopic: (topic: TopicId) => void;
  /** ヘルプを開く。topic を渡すとそのトピックにする */
  openHelp: (topic?: TopicId) => void;
  closeHelp: () => void;
  toggleHelp: () => void;
}

function clampYear(year: number): Year {
  return Math.min(MAX_YEAR, Math.max(MIN_YEAR, Math.trunc(year)));
}

export type KitStore = StoreApi<KitState>;

export interface KitStoreInit {
  year?: Year;
  source?: string;
}

export const INITIAL_COUNTER = 774;

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
      helpTopic: null,
      helpOpen: false,
      setYear: moveTo,
      stepYear: (delta) => moveTo(get().year + delta),
      edit: (next) => set({ source: next, status: STATUS_EDITING }),
      show: () => set({ shownSource: get().source, status: STATUS_LOCAL, display: "local" }),
      replace: (next) => set({ source: next, shownSource: next, display: "local" }),
      setResolution: (resolution) => set({ resolution }),
      setSound: (sound) => set({ sound }),
      selectHelpTopic: (helpTopic) => set({ helpTopic }),
      openHelp: (topic) =>
        set(({ helpTopic }) => ({ helpTopic: topic ?? helpTopic, helpOpen: true })),
      closeHelp: () => set({ helpOpen: false }),
      toggleHelp: () => set(({ helpOpen }) => ({ helpOpen: !helpOpen })),
    };
  });
}

export const kitStore: KitStore = createKitStore();

export function useKit<T>(selector: (state: KitState) => T): T {
  return useStore(kitStore, selector);
}
