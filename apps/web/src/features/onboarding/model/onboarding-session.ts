import type { StorageAccess } from "../../../shared/lib/index.ts";

export const ONBOARDED_KEY = "anokoro:onboarded";
export const ONBOARDING_OFF_KEY = "anokoro:onboarding-off";

export interface OnboardingStorages {
  session: StorageAccess;
  local: StorageAccess;
}

function isFlagSet(storage: StorageAccess, key: string): boolean {
  try {
    return storage().getItem(key) === "1";
  } catch {
    return false;
  }
}

function setFlag(storage: StorageAccess, key: string): void {
  try {
    storage().setItem(key, "1");
  } catch {}
}

export function shouldAutoShowOnboarding({ session, local }: OnboardingStorages): boolean {
  return !isFlagSet(session, ONBOARDED_KEY) && !isFlagSet(local, ONBOARDING_OFF_KEY);
}

export function markOnboarded(session: StorageAccess): void {
  setFlag(session, ONBOARDED_KEY);
}

export function turnOffOnboarding(local: StorageAccess): void {
  setFlag(local, ONBOARDING_OFF_KEY);
}
