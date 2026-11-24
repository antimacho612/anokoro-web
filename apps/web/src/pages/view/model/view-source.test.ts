import { encodeSharedSite, type SharedSite } from "@anokoro/share-codec";
import { describe, expect, test } from "vite-plus/test";
import { findSample } from "../../../entities/sample/index.ts";
import { loadSampleSite, loadViewSource } from "./view-source.ts";

async function personalSite(): Promise<SharedSite> {
  const sample = findSample("personal");
  if (!sample) throw new Error("見本サイトがありません");
  return loadSampleSite(sample);
}

describe("loadViewSource", () => {
  test("見本サイトを id で開く", async () => {
    const source = await loadViewSource("?sample=personal", "");
    expect(source).toMatchObject({
      kind: "sample",
      site: { name: "☆ねこまるの部屋☆", year: 1999 },
    });
  });

  test("共有されたサイトを展開する", async () => {
    const site = await personalSite();
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
