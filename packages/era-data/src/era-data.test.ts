import { describe, expect, it } from "vite-plus/test";
import {
  FEATURES,
  LINES,
  MAX_YEAR,
  MIN_YEAR,
  RESOLUTION_PERIODS,
  YEARS,
  defaultLineForYear,
  featureStatus,
  formatResolution,
  getLine,
  isLineKey,
  isYear,
  linesForYear,
  resolutionPeriodForYear,
  SITE_KINDS,
  SITE_KIND_IDS,
  siteKindYears,
  UI_THEMES,
  uiThemeForYear,
  ASSET_ERAS,
  TRENDS,
  eraRefYears,
  type TrendEntry,
  type TrendId,
  assetEraSources,
  assetEraYears,
  type AssetEraId,
  type FeatureEntry,
  type SiteKindEntry,
  type Source,
  HOSTING_SPACE_PERIODS,
  formatBytes,
  hostingSpaceForYear,
} from "./index.ts";

function expectSources(sources: readonly Source[]): void {
  expect(sources.length).toBeGreaterThan(0);
  for (const { title, url } of sources) {
    expect(title).not.toBe("");
    expect(new URL(url).protocol).toBe("https:");
  }
}

const inYears = (year: number): boolean => year >= MIN_YEAR && year <= MAX_YEAR;

describe("年", () => {
  it("1995 〜 2015 年を 1 年刻みで持つ", () => {
    expect(YEARS[0]).toBe(1995);
    expect(YEARS.at(-1)).toBe(2015);
    expect(YEARS).toHaveLength(21);
  });

  it("isYear は範囲内の整数だけを受け付ける", () => {
    expect(isYear(1995)).toBe(true);
    expect(isYear(2015)).toBe(true);
    expect(isYear(1994)).toBe(false);
    expect(isYear(2016)).toBe(false);
    expect(isYear(2003.5)).toBe(false);
    expect(isYear("2003")).toBe(false);
  });
});

describe("機能年表", () => {
  const entries = Object.entries(FEATURES) as [string, FeatureEntry][];

  it.each(entries)("%s: 年の並びが正しく、根拠がある", (_id, f) => {
    if (f.availableFrom !== null) expect(inYears(f.availableFrom)).toBe(true);
    if (f.partialFrom !== undefined) {
      expect(inYears(f.partialFrom)).toBe(true);
      if (f.availableFrom !== null) expect(f.partialFrom).toBeLessThan(f.availableFrom);
    }
    if (f.outdatedFrom !== undefined) {
      expect(f.availableFrom).not.toBeNull();
      expect(f.outdatedFrom).toBeGreaterThan(f.availableFrom ?? Infinity);
      expect(inYears(f.outdatedFrom)).toBe(true);
    }
    expectSources(f.sources);
  });

  it("featureStatus は年で判定する", () => {
    expect(featureStatus("css.border-radius", 2003)).toBe("future");
    expect(featureStatus("css.border-radius", 2008)).toBe("partial");
    expect(featureStatus("css.border-radius", 2011)).toBe("available");
    expect(featureStatus("html.marquee", 1995)).toBe("future");
    expect(featureStatus("html.marquee", 2003)).toBe("available");
    expect(featureStatus("html.marquee", 2008)).toBe("outdated");
    expect(featureStatus("css.grid", MAX_YEAR)).toBe("future");
    expect(featureStatus("css.flex", 2012)).toBe("partial");
    expect(featureStatus("css.flex", 2013)).toBe("available");
  });
});

describe("回線", () => {
  it("回線定義はプロトタイプと同じ", () => {
    expect(
      LINES.map(({ key, name, bytesPerSec, latencyMs, dial, connectedLabel }) => [
        key,
        name,
        bytesPerSec,
        latencyMs,
        dial,
        connectedLabel,
      ]),
    ).toEqual([
      ["m28", "28.8kモデム", 3000, 400, "modem", "28.8Kbps"],
      ["m56", "56kモデム", 4500, 300, "modem", "53.3Kbps"],
      ["isdn", "ISDN 64k", 7600, 150, "isdn", "64Kbps"],
      ["adsl1", "ADSL 1.5M", 110000, 60, "always", null],
      ["adsl12", "ADSL 12M", 500000, 40, "always", null],
      ["hikari", "光ファイバー 100M", 3000000, 15, "always", null],
    ]);
  });

  it.each(LINES.map((l) => [l.key, l] as const))("%s: 年が範囲内で根拠がある", (_key, line) => {
    const [availableFrom, availableUntil] = line.availableYears;
    expect(inYears(availableFrom)).toBe(true);
    expect(inYears(availableUntil)).toBe(true);
    expect(availableFrom).toBeLessThanOrEqual(availableUntil);
    if (line.defaultYears) {
      const [from, to] = line.defaultYears;
      expect(from).toBeGreaterThanOrEqual(availableFrom);
      expect(to).toBeLessThanOrEqual(availableUntil);
      expect(from).toBeLessThanOrEqual(to);
      expect(inYears(to)).toBe(true);
    }
    expectSources(line.sources);
  });

  it.each(YEARS)("%i 年: 既定の回線がちょうど 1 つあり、選べる回線に含まれる", (year) => {
    const defaults = LINES.filter(
      (l) => l.defaultYears && year >= l.defaultYears[0] && year <= l.defaultYears[1],
    );
    expect(defaults).toHaveLength(1);
    expect(linesForYear(year)).toContain(defaultLineForYear(year));
  });

  it("年ごとに選べる回線と既定が変わる", () => {
    expect(linesForYear(1995).map((l) => l.key)).toEqual(["m28", "isdn"]);
    expect(linesForYear(2000).map((l) => l.key)).toEqual(["m28", "m56", "isdn"]);
    expect(linesForYear(2003).map((l) => l.key)).toEqual([
      "m56",
      "isdn",
      "adsl1",
      "adsl12",
      "hikari",
    ]);
    expect(linesForYear(2007).map((l) => l.key)).toEqual(["m56", "adsl12", "hikari"]);
    expect(linesForYear(2015).map((l) => l.key)).toEqual(["adsl12", "hikari"]);
    expect(defaultLineForYear(1995).key).toBe("m28");
    expect(defaultLineForYear(2000).key).toBe("isdn");
    expect(defaultLineForYear(2003).key).toBe("adsl12");
    expect(defaultLineForYear(2015).key).toBe("hikari");
  });

  it("キーの検証", () => {
    expect(isLineKey("m56")).toBe(true);
    expect(isLineKey("toString")).toBe(false);
    expect(getLine("isdn").name).toBe("ISDN 64k");
  });
});

describe("解像度", () => {
  it("期間がすき間も重なりもなく全年を覆う", () => {
    const covered = RESOLUTION_PERIODS.flatMap(({ years: [from, to] }) =>
      Array.from({ length: to - from + 1 }, (_, i) => from + i),
    );
    expect(covered).toEqual(YEARS);
  });

  it.each(RESOLUTION_PERIODS.map((p) => [p.years.join("〜"), p] as const))(
    "%s: 既定値が候補に含まれ、根拠がある",
    (_label, period) => {
      expect(period.candidates).toContainEqual(period.default);
      expectSources(period.sources);
    },
  );

  it("年から候補と既定値を引ける", () => {
    const p2003 = resolutionPeriodForYear(2003);
    expect(p2003.candidates.map(formatResolution)).toEqual(["640×480", "800×600", "1024×768"]);
    expect(formatResolution(p2003.default)).toBe("800×600");
    expect(formatResolution(resolutionPeriodForYear(1995).default)).toBe("640×480");
    // @ts-expect-error 型を通らない呼び出し元（JS や未検証の入力）からの範囲外の年を確かめる
    expect(() => resolutionPeriodForYear(2016)).toThrow();
  });
});

describe("作成キットの外観", () => {
  it("最初の行が最初の年から始まり、古い順に並ぶ", () => {
    expect(UI_THEMES[0]?.from).toBe(MIN_YEAR);
    const froms = UI_THEMES.map((t) => t.from);
    expect(froms).toEqual([...new Set(froms)].sort((a, b) => a - b));
    expect(froms.every(inYears)).toBe(true);
  });

  it.each(UI_THEMES.map((t) => [t.id, t] as const))("%s: 根拠がある", (_id, theme) => {
    expectSources(theme.sources);
  });

  it("年から外観を引ける", () => {
    expect(uiThemeForYear(1995).id).toBe("gray-bevel");
    expect(uiThemeForYear(1997).id).toBe("gray-bevel");
    expect(uiThemeForYear(1998).id).toBe("gray-gradient");
    expect(uiThemeForYear(2001).id).toBe("blue-round");
    expect(uiThemeForYear(2006).id).toBe("blue-round");
    expect(uiThemeForYear(2007).id).toBe("glass");
    expect(uiThemeForYear(2011).id).toBe("glass");
    expect(uiThemeForYear(2012).id).toBe("flat-bold");
    expect(uiThemeForYear(2015).id).toBe("flat-thin");
    // @ts-expect-error 型を通らない呼び出し元（JS や未検証の入力）からの範囲外の年を確かめる
    expect(() => uiThemeForYear(1994)).toThrow();
  });
});

describe("サイトの種類", () => {
  it("一覧がすべての種類を 1 回ずつ持つ", () => {
    expect([...SITE_KIND_IDS].sort()).toEqual(Object.keys(SITE_KINDS).sort());
  });

  it.each(SITE_KIND_IDS)("%s: 年の範囲が対象の年に収まり、根拠がある", (id) => {
    const kind: SiteKindEntry = SITE_KINDS[id];
    const [from, to] = siteKindYears(id);
    expect(from).toBe(kind.availableFrom);
    expect(inYears(from)).toBe(true);
    expect(inYears(to)).toBe(true);
    expect(from).toBeLessThanOrEqual(to);
    expectSources(kind.sources);
  });

  it("ディレクトリ型ポータルとテキストサイトは 2005 年まで、素材サイトは 2008 年まで、Web 2.0 風は 2009 年まで、ブログと SNS は 2015 年まで", () => {
    expect(siteKindYears("portal")).toEqual([1996, 2005]);
    expect(siteKindYears("textsite")).toEqual([2000, 2005]);
    expect(siteKindYears("material")).toEqual([2000, 2008]);
    expect(siteKindYears("web20")).toEqual([2006, 2009]);
    expect(siteKindYears("blog")).toEqual([2003, 2015]);
    expect(siteKindYears("sns")).toEqual([2005, 2015]);
  });
});

describe("素材の作風", () => {
  const ids = Object.keys(ASSET_ERAS) as AssetEraId[];

  it.each(ids)("%s: 年の範囲が対象の年に収まり、根拠がある", (id) => {
    const years = assetEraYears(id);
    expect(years).toBeDefined();
    const [from, to] = years ?? [0, 0];
    expect(inYears(from)).toBe(true);
    expect(inYears(to)).toBe(true);
    expect(from).toBeLessThanOrEqual(to);
    expectSources(assetEraSources(id));
  });

  it("機能年表とサイトの種類の年に従う", () => {
    expect(assetEraYears("gif")).toEqual([1995, 2015]);
    expect(assetEraYears("gif-animation")).toEqual([1996, 2015]);
    expect(assetEraYears("png-alpha")).toEqual([FEATURES["css.png-alpha"].availableFrom, 2015]);
    expect(assetEraYears("portal")).toEqual(siteKindYears("portal"));
    expect(assetEraYears("retina")).toEqual([2010, 2015]);
  });
});

describe("流行", () => {
  const ids = Object.keys(TRENDS).filter((id): id is TrendId => Object.hasOwn(TRENDS, id));

  it.each(ids)("%s: 年が対象の年に収まり、根拠がある", (id) => {
    const trend: TrendEntry = TRENDS[id];
    expect(inYears(trend.from)).toBe(true);
    if (trend.until !== undefined) {
      expect(inYears(trend.until)).toBe(true);
      expect(trend.from).toBeLessThanOrEqual(trend.until);
    }
    expectSources(trend.sources);
  });

  it("機能年表の行は、古い書き方になる前の年までをよく使われた年にする", () => {
    expect(eraRefYears({ kind: "feature", feature: "html.marquee" })).toEqual([1996, 2007]);
    expect(eraRefYears({ kind: "feature", feature: "html.basic" })).toEqual([1995, 2015]);
    expect(eraRefYears({ kind: "feature", feature: "html5.math" })).toBeUndefined();
    expect(eraRefYears({ kind: "trend", trend: "trackback" })).toEqual([2003, 2010]);
    expect(eraRefYears({ kind: "trend", trend: "rss" })).toEqual([2004, 2015]);
  });
});

describe("無料ホームページの容量", () => {
  it("期間がすき間も重なりもなく全年を覆い、根拠がある", () => {
    const covered = HOSTING_SPACE_PERIODS.flatMap(({ years: [from, to] }) =>
      Array.from({ length: to - from + 1 }, (_, i) => from + i),
    );
    expect(covered).toEqual(YEARS);
    for (const period of HOSTING_SPACE_PERIODS) expectSources(period.sources);
  });

  it("年とともに増える", () => {
    expect(YEARS.map((year) => formatBytes(hostingSpaceForYear(year).bytes))).toEqual([
      ...Array<string>(4).fill("2MB"),
      ...Array<string>(5).fill("12MB"),
      ...Array<string>(12).fill("50MB"),
    ]);
  });

  it("1MB より小さければ KB で表示する", () => {
    expect(formatBytes(0)).toBe("0.0KB");
    expect(formatBytes(1536)).toBe("1.5KB");
    expect(formatBytes(1.5 * 1024 * 1024)).toBe("1.5MB");
  });
});
