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

/** ダイヤルアップ回線の状態。常時接続の回線では使わない */
export type Connection = "offline" | "dialing" | "online";

/** local: メモ帳の内容を即時表示 / net: 回線経由で読み込んだ表示 */
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
  /** 直前の読み込みで踏んだキリ番 */
  kiriban: number | null;
  lineKey: LineKey;
  connection: Connection;
  /** 接続済みになった時刻（Date.now() の値） */
  connectedAt: number | null;
  /** ダイヤル中の表示 */
  dialMessage: string;
  sound: boolean;
  display: Display;
  /** 回線経由表示を始めるたびに増やし、疑似ブラウザの iframe を作り直す */
  netGeneration: number;
  loading: boolean;
  /** 読み込みの進捗（0 〜 1） */
  progress: number;
  /** 広告バナーを読み込み中か */
  adLoading: boolean;
  lastLoad: LastLoad | null;
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
      kiriban: null,
      lineKey: defaultLineForYear(initialYear).key,
      connection: "offline",
      connectedAt: null,
      dialMessage: "",
      sound: true,
      display: "local",
      netGeneration: 0,
      loading: false,
      progress: 0,
      adLoading: false,
      lastLoad: null,
      setYear: moveTo,
      stepYear: (delta) => moveTo(get().year + delta),
      edit: (next) => set({ source: next, status: STATUS_EDITING }),
      show: () => set({ shownSource: get().source, status: STATUS_LOCAL, display: "local" }),
      replace: (next) => set({ source: next, shownSource: next, display: "local" }),
      setResolution: (resolution) => set({ resolution }),
      setSound: (sound) => set({ sound }),
    };
  });
}

export const kitStore: KitStore = createKitStore();

export function useKit<T>(selector: (state: KitState) => T): T {
  return useStore(kitStore, selector);
}
