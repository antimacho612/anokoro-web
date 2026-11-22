import type { StorageAccess } from "../notepad/draft-storage.ts";
import type { KitStore } from "../store.ts";
import type { NewsEntry } from "./news.ts";

const NEWS_SEEN_KEY = "anokoro:news-seen";

export function hasUnreadNews(news: readonly NewsEntry[], seen: string | null): boolean {
  const latest = news[0]?.date;
  if (latest === undefined) return false;
  return seen === null || latest > seen;
}

export function restoreNewsSeen(store: KitStore, storage: StorageAccess): void {
  try {
    const seen = storage().getItem(NEWS_SEEN_KEY);
    if (seen) store.getState().markNewsSeen(seen);
  } catch {}
}

export function persistNewsSeen(store: KitStore, storage: StorageAccess): () => void {
  return store.subscribe((state, prev) => {
    if (state.newsSeen === prev.newsSeen || state.newsSeen === null) return;
    try {
      storage().setItem(NEWS_SEEN_KEY, state.newsSeen);
    } catch {}
  });
}
