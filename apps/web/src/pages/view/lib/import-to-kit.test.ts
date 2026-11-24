import { createMemorySiteStore, parseSiteId, type SiteId } from "@anokoro/site-store";
import { describe, expect, test } from "vite-plus/test";
import type { SharedSite } from "@anokoro/share-codec";
import type { StorageAccess } from "../../../shared/lib/index.ts";
import { findSample } from "../../../entities/sample/index.ts";
import { importToKit } from "./import-to-kit.ts";
import { loadSampleSite } from "../model/view-source.ts";

async function personalSite(): Promise<SharedSite> {
  const sample = findSample("personal");
  if (!sample) throw new Error("見本サイトがありません");
  return loadSampleSite(sample);
}

const testId = (n: number): SiteId => parseSiteId(`01J${String(n).padStart(23, "0")}`);

describe("importToKit", () => {
  test("新しいサイトとして保存し、次に作成キットで開くページにする", async () => {
    const store = createMemorySiteStore();
    const data = new Map<string, string>();
    const storage: StorageAccess = () => ({
      getItem: (k) => data.get(k) ?? null,
      setItem: (k, v) => void data.set(k, v),
    });
    await importToKit(await personalSite(), {
      open: async () => store,
      storage,
      now: 5,
      newId: testId(1),
    });
    expect(await store.get(testId(1))).toMatchObject({
      name: "☆ねこまるの部屋☆",
      year: 1999,
      createdAt: 5,
    });
    expect(JSON.parse(data.get("anokoro:draft") ?? "")).toEqual({
      siteId: testId(1),
      path: "index.html",
    });
  });
});
