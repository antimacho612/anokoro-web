import { ASSETS, type AssetEntry } from "@anokoro/assets";
import { describe, expect, it } from "vite-plus/test";
import { checkEra } from "@anokoro/era-checker";
import { SITE_KINDS, SITE_KIND_IDS } from "@anokoro/era-data";
import { PARTS, assetSnippet, partAvailability, partsForKind, type Part } from "./parts.ts";

function part(label: string): Part {
  const found = PARTS.find((p) => p.label === label);
  if (!found) throw new Error(label);
  return found;
}

function asset(name: string): AssetEntry {
  const found = ASSETS.find((a) => a.name === name);
  if (!found) throw new Error(name);
  return found;
}

describe("partAvailability", () => {
  it("機能年表で使えない年は使えず、使える年を添える", () => {
    expect(partAvailability(part("マーキー"), 1995)).toEqual({
      usable: false,
      label: "1996年から",
    });
    expect(partAvailability(part("2カラム表"), 1995)).toEqual({
      usable: false,
      label: "1996年から",
    });
    expect(partAvailability(part("マーキー"), 1996)).toEqual({ usable: true });
  });

  it("古い書き方になった年でも使える", () => {
    expect(partAvailability(part("点滅文字"), 2015)).toEqual({ usable: true });
  });

  it("機能を持たないパーツはどの年でも使える", () => {
    expect(partAvailability(part("2020年代のコード（違反例）"), 1995)).toEqual({ usable: true });
  });
});

describe("assetSnippet", () => {
  it("壁紙は background 属性、ほかは img 要素で入れる", () => {
    expect(assetSnippet(asset("kabe1.gif"))).toBe(' background="kabe1.gif"');
    expect(assetSnippet(asset("new.gif"))).toBe('<img src="new.gif">');
    expect(assetSnippet(asset("line.gif"))).toBe(
      '<img src="line.gif" width="400" height="8"><br>\n',
    );
  });
});

describe("種類ごとのパーツ", () => {
  it("その種類のパーツを先に並べ、ほかの種類のパーツは出さない", () => {
    const shop = partsForKind("shop");
    expect(shop.slice(0, 2).map((p) => p.label)).toEqual(["値段", "特定商取引法"]);
    expect(shop.some((p) => p.kinds?.includes("blog"))).toBe(false);
    expect(shop.some((p) => p.label === "マーキー")).toBe(true);
  });

  it.each(SITE_KIND_IDS)("%s のパーツは、その種類がある年から警告なしで使える", (kind) => {
    const from = SITE_KINDS[kind].availableFrom;
    for (const p of PARTS.filter((x) => x.kinds?.includes(kind))) {
      const html = `<html><body>${p.code}</body></html>`;
      for (const year of [from, 2015]) {
        expect(checkEra(html, { year, mode: "local" }).warnings.map((w) => w.ruleId)).toEqual([]);
      }
    }
  });
});
