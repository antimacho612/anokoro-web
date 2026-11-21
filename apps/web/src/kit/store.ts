import { MAX_YEAR, MIN_YEAR, type Year } from "@anokoro/era-data";
import { createStore, useStore, type StoreApi } from "zustand";
import { DEFAULT_YEAR } from "./time-machine/year-param.ts";

export interface KitState {
  year: Year;
  setYear: (year: number) => void;
  stepYear: (delta: number) => void;
}

function clampYear(year: number): Year {
  return Math.min(MAX_YEAR, Math.max(MIN_YEAR, Math.trunc(year)));
}

export type KitStore = StoreApi<KitState>;

export function createKitStore(initialYear: Year = DEFAULT_YEAR): KitStore {
  return createStore<KitState>()((set, get) => ({
    year: clampYear(initialYear),
    setYear: (year) => set({ year: clampYear(year) }),
    stepYear: (delta) => set({ year: clampYear(get().year + delta) }),
  }));
}

export const kitStore: KitStore = createKitStore();

export function useKit<T>(selector: (state: KitState) => T): T {
  return useStore(kitStore, selector);
}
