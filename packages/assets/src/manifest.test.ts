import { readdirSync, readFileSync } from "node:fs";
import { describe, expect, it } from "vite-plus/test";
import { ASSETS, BROKEN_IMAGE, FAKE_BYTES, PENDING_IMAGE, SITE_ICON } from "./manifest.ts";
import { assetBaseName, findAsset, toDataUri } from "./resolve.ts";

const svgDir = new URL("./svg/", import.meta.url);
const all = [...ASSETS, BROKEN_IMAGE, PENDING_IMAGE, SITE_ICON];

describe("素材マニフェスト", () => {
  it("ファイル名は小文字で重複しない", () => {
    const names = ASSETS.map((a) => a.name);
    expect(new Set(names).size).toBe(names.length);
    for (const name of names) expect(name).toBe(name.toLowerCase());
  });

  it("svg ディレクトリのファイルとマニフェストが一致する", () => {
    const files = readdirSync(svgDir)
      .filter((f) => f.endsWith(".svg"))
      .sort();
    const expected = [
      ...ASSETS.map((a) => a.name.replace(/\.gif$/, ".svg")),
      "broken.svg",
      "pending.svg",
      "site-icon.svg",
    ].sort();
    expect(files).toEqual(expected);
    for (const asset of ASSETS) {
      const file = readFileSync(new URL(asset.name.replace(/\.gif$/, ".svg"), svgDir), "utf8");
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

  it("疑似バイト数はプロトタイプと同じ", () => {
    expect(Object.fromEntries(ASSETS.map((a) => [a.name, a.fakeBytes]))).toEqual({
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
    expect(findAsset("kabe1.gif")?.kind).toBe("wallpaper");
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
