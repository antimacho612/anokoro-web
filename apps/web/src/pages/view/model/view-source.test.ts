import { encodeSharedSite } from "@anokoro/share-codec";
import { describe, expect, test } from "vite-plus/test";
import { personalSample } from "../../../entities/sample/index.ts";
import { loadViewSource, sampleToShared } from "./view-source.ts";

describe("loadViewSource", () => {
  test("見本サイトを id で開く", async () => {
    const source = await loadViewSource("?sample=personal", "");
    expect(source).toMatchObject({
      kind: "sample",
      site: { name: "☆ねこまるの部屋☆", year: 1999 },
    });
  });

  test("共有されたサイトを展開する", async () => {
    const site = sampleToShared(personalSample);
    const source = await loadViewSource("", `#s=${await encodeSharedSite(site)}`);
    expect(source).toEqual({ kind: "shared", site });
  });

  test.each([
    ["?sample=none", "", "その見本サイトは見つかりません。"],
    ["", "", "表示するサイトが指定されていません。"],
    ["", "#s=!!!", "サイトのデータが壊れているか、形式が違います。"],
  ])("開けないときは理由を返す（%s %s）", async (search, hash, message) => {
    expect(await loadViewSource(search, hash)).toEqual({ kind: "error", message });
  });
});
