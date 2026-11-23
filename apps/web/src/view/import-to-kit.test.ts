import { createMemorySiteStore } from "@anokoro/site-store";
import { describe, expect, test } from "vite-plus/test";
import type { StorageAccess } from "../kit/notepad/draft-storage.ts";
import { personalSample } from "../samples/personal.ts";
import { importToKit } from "./import-to-kit.ts";
import { sampleToShared } from "./view-source.ts";

describe("importToKit", () => {
  test("新しいサイトとして保存し、次に作成キットで開くページにする", async () => {
    const store = createMemorySiteStore();
    const data = new Map<string, string>();
    const storage: StorageAccess = () => ({
      getItem: (k) => data.get(k) ?? null,
      setItem: (k, v) => void data.set(k, v),
    });
    await importToKit(sampleToShared(personalSample), {
      open: async () => store,
      storage,
      now: 5,
      newId: "new1",
    });
    expect(await store.get("new1")).toMatchObject({
      name: "☆ねこまるの部屋☆",
      year: 1999,
      createdAt: 5,
    });
    expect(JSON.parse(data.get("anokoro:draft") ?? "")).toEqual({
      siteId: "new1",
      path: "index.html",
    });
  });
});
