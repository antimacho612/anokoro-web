import { isLineKey, type LineKey } from "@anokoro/era-data";
import type { StorageAccess } from "../notepad/draft-storage.ts";
import type { KitStore } from "../store.ts";
import { isLineSelectable } from "./line-choice.ts";

const LINE_KEY = "anokoro:line";
const SOUND_KEY = "anokoro:sound";
const COUNTER_KEY = "anokoro:counter";

function read(storage: StorageAccess, key: string): string | null {
  try {
    return storage().getItem(key);
  } catch {
    return null;
  }
}

function write(storage: StorageAccess, key: string, value: string): void {
  try {
    storage().setItem(key, value);
  } catch {}
}

export function restoreNetSettings(store: KitStore, storage: StorageAccess): void {
  const { year } = store.getState();
  const line = read(storage, LINE_KEY);
  if (isLineKey(line) && isLineSelectable(year, line)) store.setState({ lineKey: line });
  const sound = read(storage, SOUND_KEY);
  if (sound === "on" || sound === "off") store.setState({ sound: sound === "on" });
  const counter = Number(read(storage, COUNTER_KEY) ?? Number.NaN);
  if (Number.isSafeInteger(counter) && counter >= 0) store.setState({ counter });
}

export function saveLine(storage: StorageAccess, key: LineKey): void {
  write(storage, LINE_KEY, key);
}

export function persistNetSettings(store: KitStore, storage: StorageAccess): () => void {
  return store.subscribe((state, prev) => {
    if (state.sound !== prev.sound) write(storage, SOUND_KEY, state.sound ? "on" : "off");
    if (state.counter !== prev.counter) write(storage, COUNTER_KEY, String(state.counter));
  });
}
