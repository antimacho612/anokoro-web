import { describe, expect, test } from "vite-plus/test";
import { createKitStore } from "../store.ts";
import { hasUnreadNews, persistNewsSeen, restoreNewsSeen } from "./news-seen.ts";
import type { NewsEntry } from "./news.ts";

const entry = (date: string): NewsEntry => ({ date, title: date, lines: [] });
const news = [entry("2026-11-22"), entry("2026-10-01")];

function memoryStorage(initial: Record<string, string> = {}) {
  const items = new Map(Object.entries(initial));
  return {
    items,
    access: () => ({
      getItem: (key: string) => items.get(key) ?? null,
      setItem: (key: string, value: string) => void items.set(key, value),
    }),
  };
}

describe("hasUnreadNews", () => {
  test("一度も読んでいなければ未読", () => {
    expect(hasUnreadNews(news, null)).toBe(true);
  });

  test("最新より前の日付までしか読んでいなければ未読", () => {
    expect(hasUnreadNews(news, "2026-10-01")).toBe(true);
  });

  test("最新の日付まで読んでいれば既読", () => {
    expect(hasUnreadNews(news, "2026-11-22")).toBe(false);
  });

  test("お知らせがなければ未読はない", () => {
    expect(hasUnreadNews([], null)).toBe(false);
  });
});

describe("読んだお知らせの保存", () => {
  test("保存した日付を読み戻す", () => {
    const storage = memoryStorage({ "anokoro:news-seen": "2026-10-01" });
    const store = createKitStore();
    restoreNewsSeen(store, storage.access);
    expect(store.getState().newsSeen).toBe("2026-10-01");
  });

  test("読んだら日付を保存する", () => {
    const storage = memoryStorage();
    const store = createKitStore();
    persistNewsSeen(store, storage.access);
    store.getState().markNewsSeen("2026-11-22");
    expect(storage.items.get("anokoro:news-seen")).toBe("2026-11-22");
  });

  test("ストレージが使えなくても例外を投げない", () => {
    const broken = () => {
      throw new Error("blocked");
    };
    const store = createKitStore();
    expect(() => restoreNewsSeen(store, broken)).not.toThrow();
    persistNewsSeen(store, broken);
    expect(() => store.getState().markNewsSeen("2026-11-22")).not.toThrow();
  });
});
