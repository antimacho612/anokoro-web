import type { StorageAccess } from "../notepad/draft-storage.ts";

export const BOOTED_KEY = "anokoro:booted";

export const browserSession: StorageAccess = () => window.sessionStorage;

export function hasBooted(storage: StorageAccess): boolean {
  try {
    return storage().getItem(BOOTED_KEY) === "1";
  } catch {
    return false;
  }
}

export function markBooted(storage: StorageAccess): void {
  try {
    storage().setItem(BOOTED_KEY, "1");
  } catch {}
}
