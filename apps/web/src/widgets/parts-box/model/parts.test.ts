import { describe, expect, it } from "vite-plus/test";
import { checkEra } from "@anokoro/era-checker";
import { SITE_KIND_IDS, YEARS, eraRefYears, siteKindYears, type Year } from "@anokoro/era-data";
import { MODERN_CODE_PART, PARTS } from "./part-list.ts";
import { partCode, partShelf, partStatus, partsForKind, type Part } from "./parts.ts";

function part(label: string): Part {
  const found = PARTS.find((p) => p.label === label);
  if (!found) throw new Error(label);
  return found;
}

const warningsOf = (html: string, year: Year): string[] =>
  checkEra(`<html><body>${html}</body></html>`, { year, mode: "local" }).warnings.map(
    (w) => w.ruleId,
  );

describe("パーツの品ぞろえ", () => {
  it("80 個以上あり、名前が重ならない", () => {
    expect(PARTS.length).toBeGreaterThanOrEqual(80);
    const labels = [...PARTS.map((p) => p.label), MODERN_CODE_PART.label];
    expect(new Set(labels).size).toBe(labels.length);
  });

  it.each(SITE_KIND_IDS)(
    "%s のサイトでは、その種類がある年ならどの年でも 15 個以上がよく使われている",
    (kind) => {
      const [from, to] = siteKindYears(kind);
      for (const year of YEARS.filter((y) => from <= y && y <= to)) {
        const popular = partShelf(kind, year).popular.flatMap((g) => g.parts);
        expect(popular.length, `${year}`).toBeGreaterThanOrEqual(15);
      }
    },
  );

  it("どのパーツにも、よく使われた年がある", () => {
    for (const p of PARTS) expect(eraRefYears(p.era), p.label).toBeDefined();
  });

  it.each(PARTS.map((p) => [p.label, p] as const))(
    "%s は、よく使われた年なら警告なしで使える",
    (_, p) => {
      const [from, to] = eraRefYears(p.era) ?? [0, -1];
      for (const year of YEARS.filter((y) => from <= y && y <= to)) {
        expect(warningsOf(partCode(p, year), year), `${year}`).toEqual([]);
      }
    },
  );

  it("違反例のパーツは、どの年でも警告が出る", () => {
    for (const year of YEARS) {
      expect(warningsOf(partCode(MODERN_CODE_PART, year), year).length).toBeGreaterThan(0);
    }
  });
});

describe("partStatus", () => {
  it("よく使われる前の年は、使える年を添えて灰色にする", () => {
    expect(partStatus(part("マーキー"), 1995)).toEqual({ kind: "future", label: "1996年から" });
    expect(partStatus(part("2カラム表"), 1995)).toEqual({ kind: "future", label: "1996年から" });
    expect(partStatus(part("RSS"), 2003)).toEqual({ kind: "future", label: "2004年から" });
    expect(partStatus(part("マーキー"), 1996)).toEqual({ kind: "popular" });
  });

  it("流行が過ぎた年は、最後の年を添える", () => {
    expect(partStatus(part("点滅文字"), 2015)).toEqual({ kind: "past", label: "〜2007年" });
    expect(partStatus(part("記事の終わり"), 2011)).toEqual({ kind: "past", label: "〜2010年" });
  });
});

describe("partCode", () => {
  it("日付と解像度を選んだ年に合わせる", () => {
    expect(partCode(part("更新履歴"), 1999)).toContain("1999/11/18");
    expect(partCode(part("書き込み"), 2003)).toContain("投稿日：03/11/18");
    expect(partCode(part("日記"), 2003)).toContain("2003年11月18日（火）");
    expect(partCode(part("日記"), 2008)).toContain("2008年11月18日（火）");
    expect(partCode(part("日記"), 2012)).toContain("2012年11月18日（日）");
    expect(partCode(part("推奨環境"), 2000)).toContain("800×600以上");
    expect(partCode(part("推奨環境"), 2006)).toContain("1024×768以上");
  });

  it("カレンダーは選んだ年の 11 月 1 日の曜日から始まる", () => {
    const firstRow = (year: Year): string =>
      partCode(part("カレンダー"), year)
        .split("\n")
        .find((line) => line.includes(">1<")) ?? "";
    expect(firstRow(2003).match(/&nbsp;/g)?.length).toBe(6);
    expect(firstRow(2006).match(/&nbsp;/g)?.length).toBe(3);
    expect(partCode(part("カレンダー"), 2006)).toContain("2006年11月");
  });

  it("置き換えの印を残さない", () => {
    for (const p of PARTS) expect(partCode(p, 2005), p.label).not.toContain("{{");
  });
});

describe("partShelf", () => {
  it("その種類のパーツを先に並べ、ほかの種類のパーツは出さない", () => {
    const shop = partsForKind("shop");
    const own = shop.filter((p) => p.kinds?.includes("shop"));
    expect(shop.slice(0, own.length)).toEqual(own);
    expect(shop.some((p) => p.kinds !== undefined && !p.kinds.includes("shop"))).toBe(false);

    const shelf = partShelf("shop", 2003);
    expect(shelf.popular[0]?.label).toBe("ネットショップのパーツ");
    expect(shelf.popular[0]?.parts.map((p) => p.label)).toContain("値段");
  });

  it("流行の前後のパーツを分ける", () => {
    const shelf = partShelf("personal", 2010);
    const popular = shelf.popular.flatMap((g) => g.parts.map((p) => p.label));
    expect(popular).toContain("共有のリンク");
    expect(shelf.past.map((x) => x.part.label)).toContain("BGM");
    expect(shelf.future.map((x) => x.part.label)).toContain("画面の幅に合わせる");
    expect(popular).not.toContain("BGM");
  });
});
