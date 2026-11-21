import type { KitStore } from "../store.ts";

const DRAFT_KEY = "anokoro:draft";

/** localStorage の取得そのものが例外を投げる環境があるため、取得を関数で受け取る */
export type StorageAccess = () => Pick<Storage, "getItem" | "setItem">;

/** 保存した下書き。なければ、空なら、読めなければ undefined */
export function loadDraft(storage: StorageAccess): string | undefined {
  try {
    return storage().getItem(DRAFT_KEY) || undefined;
  } catch {
    return undefined;
  }
}

function saveDraft(storage: StorageAccess, text: string): void {
  try {
    storage().setItem(DRAFT_KEY, text);
  } catch {
    // 容量超過やストレージの無効化では保存をあきらめる
  }
}

/** ローカル表示を更新するたびに下書きを保存する。戻り値で購読を解除する */
export function persistDraft(store: KitStore, storage: StorageAccess): () => void {
  return store.subscribe((state, prev) => {
    if (state.shownSource !== prev.shownSource) saveDraft(storage, state.shownSource);
  });
}
