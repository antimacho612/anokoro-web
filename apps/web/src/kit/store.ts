import {
  MAX_YEAR,
  MIN_YEAR,
  resolutionPeriodForYear,
  type Resolution,
  type Year,
} from "@anokoro/era-data";
import { createStore, useStore, type StoreApi } from "zustand";
import { resolutionAfterYearChange } from "./browser/resolution.ts";
import { TEMPLATE } from "./notepad/templates.ts";
import { DEFAULT_YEAR } from "./time-machine/year-param.ts";

export const STATUS_EDITING = "読み込み中...";
export const STATUS_LOCAL = "ローカルのファイルを表示しています";
export const STATUS_START = "ローカルのファイルを表示しています（「更新」で回線経由の読み込み）";

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
  setYear: (year: number) => void;
  stepYear: (delta: number) => void;
  /** メモ帳での入力。表示はまだ更新しない */
  edit: (source: string) => void;
  /** 入力中の HTML でローカル表示を更新する */
  show: () => void;
  /** 中身を差し替えて、すぐにローカル表示を更新する */
  replace: (source: string) => void;
  setResolution: (resolution: Resolution) => void;
}

function clampYear(year: number): Year {
  return Math.min(MAX_YEAR, Math.max(MIN_YEAR, Math.trunc(year)));
}

export type KitStore = StoreApi<KitState>;

export interface KitStoreInit {
  year?: Year;
  source?: string;
}

const INITIAL_COUNTER = 774;

export function createKitStore({
  year = DEFAULT_YEAR,
  source = TEMPLATE,
}: KitStoreInit = {}): KitStore {
  const initialYear = clampYear(year);
  return createStore<KitState>()((set, get) => {
    const moveTo = (next: number): void => {
      const { year: prev, resolution } = get();
      const nextYear = clampYear(next);
      set({ year: nextYear, resolution: resolutionAfterYearChange(prev, nextYear, resolution) });
    };
    return {
      year: initialYear,
      source,
      shownSource: source,
      status: STATUS_START,
      resolution: resolutionPeriodForYear(initialYear).default,
      counter: INITIAL_COUNTER,
      setYear: moveTo,
      stepYear: (delta) => moveTo(get().year + delta),
      edit: (next) => set({ source: next, status: STATUS_EDITING }),
      show: () => set({ shownSource: get().source, status: STATUS_LOCAL }),
      replace: (next) => set({ source: next, shownSource: next }),
      setResolution: (resolution) => set({ resolution }),
    };
  });
}

export const kitStore: KitStore = createKitStore();

export function useKit<T>(selector: (state: KitState) => T): T {
  return useStore(kitStore, selector);
}
