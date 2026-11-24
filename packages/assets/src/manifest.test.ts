import { readdirSync, readFileSync } from "node:fs";
import { describe, expect, it } from "vite-plus/test";
import { YEARS } from "@anokoro/era-data";
import { assetSize, assetsForYear } from "./catalog.ts";
import { ASSETS, BROKEN_IMAGE, FAKE_BYTES, PENDING_IMAGE, SITE_ICON } from "./manifest.ts";
import { toDataUri } from "./data-uri.ts";
import { assetBaseName, findAsset } from "./resolve.ts";

const svgDir = new URL("./svg/", import.meta.url);
const all = [...ASSETS, BROKEN_IMAGE, PENDING_IMAGE, SITE_ICON];
const svgFileOf = (name: string): string => name.replace(/\.(gif|jpg|png)$/, ".svg");

describe("素材マニフェスト", () => {
  it("ファイル名は小文字で重複しない", () => {
    const names = ASSETS.map((a) => a.name);
    expect(new Set(names).size).toBe(names.length);
    for (const name of names) expect(name).toBe(name.toLowerCase());
  });

  it("ファイル名の拡張子は gif、jpg、png のどれか", () => {
    for (const { name } of ASSETS) expect(name).toMatch(/^[a-z0-9-]+\.(gif|jpg|png)$/);
  });

  it("svg ディレクトリのファイルとマニフェストが一致する", () => {
    const files = readdirSync(svgDir)
      .filter((f) => f.endsWith(".svg"))
      .sort();
    const expected = [
      ...ASSETS.map((a) => svgFileOf(a.name)),
      "broken.svg",
      "pending.svg",
      "site-icon.svg",
    ].sort();
    expect(files).toEqual(expected);
    for (const asset of ASSETS) {
      const file = readFileSync(new URL(svgFileOf(asset.name), svgDir), "utf8");
      expect(asset.svg).toBe(file);
    }
  });

  it("すべての素材に作者と CC0 のライセンスがある", () => {
    for (const entry of all) {
      expect(entry.author).not.toBe("");
      expect(entry.license).toBe("CC0-1.0");
    }
  });

  it("実体は script や外部参照を含まない SVG", () => {
    for (const { svg } of all) {
      expect(svg.trim()).toMatch(
        /^<svg xmlns="http:\/\/www\.w3\.org\/2000\/svg"[^>]*>[\s\S]*<\/svg>$/,
      );
      expect(svg).not.toMatch(/<script|on\w+=|href=|<foreignObject/i);
    }
  });

  it("素材は 50 点以上あり、どれも大きさを持つ", () => {
    expect(ASSETS.length).toBeGreaterThanOrEqual(50);
    for (const asset of ASSETS) expect(assetSize(asset), asset.name).toBeDefined();
  });

  it("疑似バイト数は 100 バイトから 200KB までの整数", () => {
    for (const { name, fakeBytes } of ASSETS) {
      expect(Number.isInteger(fakeBytes), name).toBe(true);
      expect(fakeBytes, name).toBeGreaterThanOrEqual(100);
      expect(fakeBytes, name).toBeLessThanOrEqual(200_000);
    }
  });

  it("プロトタイプにあった素材の疑似バイト数は変えない", () => {
    const original = ["koji.gif", "new.gif", "line.gif", "kabe1.gif", "kabe2.gif", "mail.gif"];
    const bytes = ASSETS.filter((a) => original.includes(a.name)).map((a) => [a.name, a.fakeBytes]);
    expect(Object.fromEntries(bytes)).toEqual({
      "koji.gif": 6200,
      "new.gif": 1100,
      "line.gif": 2300,
      "kabe1.gif": 3800,
      "kabe2.gif": 4500,
      "mail.gif": 2000,
    });
    expect(FAKE_BYTES).toEqual({ counter: 2400, bgm: 18000, missing: 300 });
  });
});

describe("findAsset", () => {
  it("末尾のファイル名を小文字で照合する", () => {
    expect(assetBaseName(" img/sub\\KOJI.GIF ")).toBe("koji.gif");
    expect(findAsset("images/Koji.gif")?.name).toBe("koji.gif");
    expect(findAsset("kabe1.gif")?.category).toBe("wallpaper");
  });

  it("見つからなければ undefined", () => {
    expect(findAsset("unknown.gif")).toBeUndefined();
    expect(findAsset("")).toBeUndefined();
    expect(findAsset("koji.gif/")).toBeUndefined();
  });
});

describe("toDataUri", () => {
  it("プロトタイプと同じ形式で符号化する", () => {
    const svg = '<svg xmlns="http://www.w3.org/2000/svg"><text>#&</text></svg>';
    expect(toDataUri(svg)).toBe(`data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`);
  });
});

describe("assetsForYear", () => {
  it("どの年にもボタン、バナー、アイコン、ライン、壁紙、写真がそろう", () => {
    for (const year of YEARS) {
      const categories = new Set(assetsForYear(year).map((a) => a.category));
      expect([...categories].sort(), `${year}`).toEqual(
        ["banner", "button", "icon", "line", "photo", "wallpaper"].sort(),
      );
    }
  });

  it("1995 年には GIF アニメ、PNG、高精細向けの素材が並ばない", () => {
    const eras = new Set(assetsForYear(1995).map((a) => a.era));
    for (const era of ["gif-animation", "png-alpha", "web2", "retina"] as const) {
      expect(eras.has(era), era).toBe(false);
    }
    expect(assetsForYear(1995).every((a) => !a.name.endsWith(".png"))).toBe(true);
  });

  it("どの素材も、いずれかの年の素材集に並ぶ", () => {
    const shown = new Set(YEARS.flatMap((year) => assetsForYear(year).map((a) => a.name)));
    expect([...shown].sort()).toEqual(ASSETS.map((a) => a.name).sort());
  });

  it("サイトの種類が廃れた年には、その種類の素材が並ばない", () => {
    expect(assetsForYear(2005).some((a) => a.era === "portal")).toBe(true);
    expect(assetsForYear(2006).some((a) => a.era === "portal")).toBe(false);
  });
});

describe("assetSize", () => {
  it("svg 要素の width と height を読む", () => {
    const line = ASSETS.find((a) => a.name === "line.gif");
    expect(line && assetSize(line)).toEqual({ width: 400, height: 8 });
  });
});
