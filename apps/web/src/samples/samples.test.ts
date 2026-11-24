import { assetsForYear, findAsset } from "@anokoro/assets";
import { checkEra } from "@anokoro/era-checker";
import {
  SITE_KIND_IDS,
  YEARS,
  inRange,
  siteKindYears,
  type SiteKindId,
  type Year,
} from "@anokoro/era-data";
import { sharedSiteSchema } from "@anokoro/share-codec";
import type { SitePage } from "@anokoro/shared";
import { describe, expect, test } from "vite-plus/test";
import { resolveLink, type LinkTarget } from "../site/link-target.ts";
import { SAMPLE_SITES, type SampleSite } from "./index.ts";

/** 年代ごとのサイトを作り終えた種類 */
const BUILT_KINDS: readonly SiteKindId[] = ["personal", "corporate", "portal", "bbs", "shop"];

const yearsOf = (site: SampleSite): Year[] => YEARS.filter((year) => inRange(year, site.years));

function links(pages: readonly SitePage[]): { from: string; target: LinkTarget }[] {
  const paths = new Set(pages.map((p) => p.path));
  return pages.flatMap((page) =>
    [...page.html.matchAll(/<a href="([^"]+)"/g)].map(([, href]) => ({
      from: page.path,
      target: resolveLink({
        href: href ?? "",
        currentPath: page.path,
        hasPage: (p) => paths.has(p),
        siteRoot: "http://x/",
      }),
    })),
  );
}

describe("見本サイト", () => {
  test("どの種類にも 1 つ以上あり、id が重ならない", () => {
    expect([...new Set(SAMPLE_SITES.map((s) => s.genre))].sort()).toEqual(
      [...SITE_KIND_IDS].sort(),
    );
    expect(new Set(SAMPLE_SITES.map((s) => s.id)).size).toBe(SAMPLE_SITES.length);
  });

  test.each(SAMPLE_SITES)("$id の年は、その種類がある年に収まる", (site) => {
    const [from, to] = site.years;
    expect(from).toBeLessThanOrEqual(to);
    expect(inRange(from, siteKindYears(site.genre))).toBe(true);
    expect(inRange(to, siteKindYears(site.genre))).toBe(true);
  });

  test.each(SAMPLE_SITES)("$id は共有データの形式を満たす", async (site) => {
    const shared = {
      kind: "anokoro-site",
      v: 1,
      name: site.name,
      year: site.years[0],
      genre: site.genre,
      category: site.category,
      pages: await site.loadPages(),
    };
    expect(sharedSiteSchema.safeParse(shared).success).toBe(true);
  });

  test.each(SAMPLE_SITES)("$id のページは、年の範囲のどの年でも警告がない", async (site) => {
    const pages = await site.loadPages();
    const problems = yearsOf(site).flatMap((year) =>
      pages.flatMap((page) =>
        checkEra(page.html, { year, mode: "local" }).warnings.map(
          (w) => `${year} ${page.path} ${w.ruleId}`,
        ),
      ),
    );
    expect(problems).toEqual([]);
  });

  test.each(SAMPLE_SITES)("$id の画像は、年の範囲のどの年でも素材集にある", async (site) => {
    const pages = await site.loadPages();
    const names = new Set(
      pages.flatMap((page) =>
        checkEra(page.html, { year: site.years[0], mode: "local" })
          .assets.filter((a) => a.kind === "img" || a.kind === "background")
          .map((a) => findAsset(a.name)?.name ?? a.name),
      ),
    );
    const problems = yearsOf(site).flatMap((year) => {
      const available = new Set(assetsForYear(year).map((a) => a.name));
      return [...names].filter((name) => !available.has(name)).map((name) => `${year} ${name}`);
    });
    expect(problems).toEqual([]);
  });

  test.each(SAMPLE_SITES)("$id のページは、ほかのページからリンクでたどれる", async (site) => {
    const pages = await site.loadPages();
    const linked = new Set<string>(["index.html"]);
    for (const { target } of links(pages)) if (target.kind === "page") linked.add(target.path);
    expect(pages.map((p) => p.path).filter((p) => !linked.has(p))).toEqual([]);
  });
});

describe.each(BUILT_KINDS)("%s の年代ごとのサイト", (kind) => {
  const sites = SAMPLE_SITES.filter((s) => s.genre === kind);

  test("年の範囲が、その種類がある年をすき間も重なりもなく覆う", () => {
    const covered = sites.flatMap(yearsOf).sort((a, b) => a - b);
    expect(covered).toEqual(YEARS.filter((year) => inRange(year, siteKindYears(kind))));
  });

  test.each(sites)("$id は 6〜12 ページで、サイトの中のリンク先がすべてある", async (site) => {
    const pages = await site.loadPages();
    expect(pages.length).toBeGreaterThanOrEqual(6);
    expect(pages.length).toBeLessThanOrEqual(12);
    const missing = links(pages).flatMap(({ from, target }) =>
      target.kind === "missing" ? [`${from} → ${target.url}`] : [],
    );
    expect(missing).toEqual([]);
  });
});
