import { createStore, useStore, type StoreApi } from "zustand";

export type BootMode = "hidden" | "awaitingPower" | "running";

export interface BootState {
  mode: BootMode;
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
      if (get().mode === "hidden") set({ mode: "awaitingPower", returnFocus });
    },
    start: () => {
      if (get().mode === "awaitingPower") set({ mode: "running" });
    },
    close: () => set({ mode: "hidden", returnFocus: null }),
  }));
}

export const bootStore = createBootStore();

export function useBoot<T>(selector: (state: BootState) => T): T {
  return useStore(bootStore, selector);
}

export function openBootScreen(): void {
  const active = document.activeElement;
  bootStore.getState().open(active instanceof HTMLElement ? active : null);
}
