import { checkEra } from "@anokoro/era-checker";
import { SITE_KIND_IDS, YEARS, inRange, siteKindYears } from "@anokoro/era-data";
import { sharedSiteSchema } from "@anokoro/share-codec";
import { describe, expect, test } from "vite-plus/test";
import { resolveLink } from "../site/link-target.ts";
import { SAMPLE_SITES } from "./index.ts";

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
    const problems = YEARS.filter((year) => inRange(year, site.years)).flatMap((year) =>
      pages.flatMap((page) =>
        checkEra(page.html, { year, mode: "local" }).warnings.map(
          (w) => `${year} ${page.path} ${w.ruleId}`,
        ),
      ),
    );
    expect(problems).toEqual([]);
  });

  test.each(SAMPLE_SITES)("$id のページは、ほかのページからリンクでたどれる", async (site) => {
    const pages = await site.loadPages();
    const paths = new Set(pages.map((p) => p.path));
    const linked = new Set<string>(["index.html"]);
    for (const page of pages) {
      for (const [, href] of page.html.matchAll(/<a href="([^"]+)"/g)) {
        const target = resolveLink({
          href: href ?? "",
          currentPath: page.path,
          hasPage: (p) => paths.has(p),
          siteRoot: "http://x/",
        });
        if (target.kind === "page") linked.add(target.path);
      }
    }
    expect([...paths].filter((p) => !linked.has(p))).toEqual([]);
  });
});
