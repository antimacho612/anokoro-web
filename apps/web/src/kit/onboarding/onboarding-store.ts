import { createStore, useStore, type StoreApi } from "zustand";
import type { BootState } from "../boot/boot-store.ts";
import {
  markOnboarded,
  shouldAutoShowOnboarding,
  type OnboardingStorages,
} from "./onboarding-session.ts";
import { ONBOARDING_STEPS } from "./onboarding-steps.ts";

export type OnboardingTour =
  | { kind: "hidden" }
  | { kind: "touring"; step: number; returnFocus: HTMLElement | null };

export interface OnboardingState {
  tour: OnboardingTour;
  start: (returnFocus?: HTMLElement | null) => void;
  next: () => void;
  back: () => void;
  close: () => void;
}

const LAST_STEP = ONBOARDING_STEPS.length - 1;

export function createOnboardingStore(): StoreApi<OnboardingState> {
  const moveBy = (tour: OnboardingTour, delta: number): OnboardingTour =>
    tour.kind === "touring"
      ? { ...tour, step: Math.min(LAST_STEP, Math.max(0, tour.step + delta)) }
      : tour;
  return createStore<OnboardingState>()((set) => ({
    tour: { kind: "hidden" },
    start: (returnFocus = null) => set({ tour: { kind: "touring", step: 0, returnFocus } }),
    next: () => set(({ tour }) => ({ tour: moveBy(tour, 1) })),
    back: () => set(({ tour }) => ({ tour: moveBy(tour, -1) })),
    close: () => set({ tour: { kind: "hidden" } }),
  }));
}

export const onboardingStore = createOnboardingStore();

export function useOnboarding<T>(selector: (state: OnboardingState) => T): T {
  return useStore(onboardingStore, selector);
}

export function autoStartOnboardingAfterBoot(
  boot: StoreApi<BootState>,
  onboarding: StoreApi<OnboardingState>,
  storages: OnboardingStorages,
): void {
  if (!shouldAutoShowOnboarding(storages)) return;
  const begin = (): void => {
    markOnboarded(storages.session);
    onboarding.getState().start();
  };
  if (boot.getState().mode === "hidden") {
    begin();
    return;
  }
  const unsubscribe = boot.subscribe((state) => {
    if (state.mode !== "hidden") return;
    unsubscribe();
    begin();
  });
}
