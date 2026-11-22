import { createStore, useStore, type StoreApi } from "zustand";

/** hidden: 出していない / power: 電源ボタンを待っている / running: 演出中 */
export type BootMode = "hidden" | "power" | "running";

export interface BootState {
  mode: BootMode;
  /** 閉じたあとにフォーカスを戻す先 */
  returnFocus: HTMLElement | null;
  open: (returnFocus?: HTMLElement | null) => void;
  start: () => void;
  close: () => void;
}

export function createBootStore(): StoreApi<BootState> {
  return createStore<BootState>()((set, get) => ({
    mode: "hidden",
    returnFocus: null,
    open: (returnFocus = null) => {
      if (get().mode === "hidden") set({ mode: "power", returnFocus });
    },
    start: () => {
      if (get().mode === "power") set({ mode: "running" });
    },
    close: () => set({ mode: "hidden", returnFocus: null }),
  }));
}

export const bootStore = createBootStore();

export function useBoot<T>(selector: (state: BootState) => T): T {
  return useStore(bootStore, selector);
}

/** 起動の演出をもう一度見せる。メニューなどから呼ぶ */
export function openBootScreen(): void {
  const active = document.activeElement;
  bootStore.getState().open(active instanceof HTMLElement ? active : null);
}
