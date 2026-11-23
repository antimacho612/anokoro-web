import { MAX_EXPANDED_BYTES } from "@anokoro/share-codec";
import { describe, expect, test } from "vite-plus/test";
import { createSite, toShared } from "../../site/site-model.ts";
import { readSiteFile, siteFile } from "./site-file.ts";

const site = createSite({
  id: "s1",
  name: "ねこ/の部屋",
  year: 2001,
  genre: "personal",
  category: "pet",
  pages: [{ path: "index.html", html: "<p>にゃー</p>" }],
  now: 0,
});

describe("サイトのファイル", () => {
  test("書き出したファイルを読み込むと同じサイトになる", async () => {
    const file = siteFile(site);
    expect(file.name).toBe("ねこ_の部屋.anokoro.json");
    expect(await readSiteFile(file.blob)).toEqual({ ok: true, site: toShared(site) });
  });

  test("形式が違うファイルは断る", async () => {
    expect(await readSiteFile(new Blob(['{"kind":"other"}']))).toEqual({
      ok: false,
      error: "invalid",
    });
  });

  test("大きすぎるファイルは読まずに断る", async () => {
    const huge = new Blob([new Uint8Array(MAX_EXPANDED_BYTES + 1)]);
    expect(await readSiteFile(huge)).toEqual({ ok: false, error: "too-large" });
  });
});
