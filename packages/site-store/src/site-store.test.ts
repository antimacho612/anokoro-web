import "fake-indexeddb/auto";
import { describe, expect, test } from "vite-plus/test";
import { openSiteStore, requestPersistence } from "./site-store.ts";
import type { LocalSite } from "./types.ts";
import { createUlid } from "./ulid.ts";

let dbCount = 0;
const freshStore = () => openSiteStore(`test-${++dbCount}`);

function site(overrides: Partial<LocalSite> = {}): LocalSite {
  return {
    id: "01HXXXXXXXXXXXXXXXXXXXXXXX",
    name: "たろうのお部屋",
    year: 1999,
    genre: "personal",
    category: "diary",
    pages: [{ path: "index.html", html: "<html></html>", updatedAt: 1 }],
    counter: 774,
    createdAt: 1,
    updatedAt: 1,
    ...overrides,
  };
}

describe("openSiteStore", () => {
  test("保存したサイトを読み出せる", async () => {
    const store = await freshStore();
    await store.put(site());
    expect(await store.get(site().id)).toEqual(site());
  });

  test("一覧は更新日時の新しい順", async () => {
    const store = await freshStore();
    await store.put(site({ id: "a", updatedAt: 1 }));
    await store.put(site({ id: "b", updatedAt: 3 }));
    await store.put(site({ id: "c", updatedAt: 2 }));
    expect((await store.list()).map((s) => s.id)).toEqual(["b", "c", "a"]);
  });

  test("同じ id で保存すると上書きする", async () => {
    const store = await freshStore();
    await store.put(site({ name: "前" }));
    await store.put(site({ name: "後" }));
    expect((await store.list()).map((s) => s.name)).toEqual(["後"]);
  });

  test("削除したサイトは読み出せない", async () => {
    const store = await freshStore();
    await store.put(site());
    await store.delete(site().id);
    expect(await store.get(site().id)).toBeUndefined();
    expect(await store.list()).toEqual([]);
  });

  test("壊れたレコードは一覧から飛ばす", async () => {
    const store = await freshStore();
    await store.put(site({ id: "ok" }));
    await store.put({ ...site({ id: "broken" }), pages: [] });
    expect((await store.list()).map((s) => s.id)).toEqual(["ok"]);
    expect(await store.get("broken")).toBeUndefined();
  });

  test("閉じて開き直しても残っている", async () => {
    const name = `test-reopen-${++dbCount}`;
    const first = await openSiteStore(name);
    await first.put(site());
    first.close();
    const second = await openSiteStore(name);
    expect(await second.get(site().id)).toEqual(site());
  });
});

describe("requestPersistence", () => {
  test("断られても例外にしない", async () => {
    expect(await requestPersistence({ persist: async () => false })).toBe(false);
    expect(
      await requestPersistence({
        persist: async () => {
          throw new Error("denied");
        },
      }),
    ).toBe(false);
    expect(await requestPersistence(undefined)).toBe(false);
  });
});

describe("createUlid", () => {
  test("26 文字で、時刻の順に並ぶ", () => {
    const a = createUlid(1_000, () => 0);
    const b = createUlid(2_000, () => 255);
    expect(a).toHaveLength(26);
    expect(a < b).toBe(true);
    expect(a).toMatch(/^[0-9A-HJKMNP-TV-Z]{26}$/);
  });
});
