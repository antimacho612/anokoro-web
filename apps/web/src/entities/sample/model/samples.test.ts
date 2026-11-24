import { checkEra } from "@anokoro/era-checker";
import { SITE_KIND_IDS, SITE_KINDS } from "@anokoro/era-data";
import { sharedSiteSchema } from "@anokoro/share-codec";
import { describe, expect, test } from "vite-plus/test";
import { resolveLink } from "../../site/@x/sample.ts";
import { SAMPLE_SITES } from "./catalog.ts";

const pages = SAMPLE_SITES.flatMap((site) => site.pages.map((page) => ({ site, page })));

describe("見本サイト", () => {
  test("第 1 段階の種類ごとに 1 つずつある", () => {
    expect(SAMPLE_SITES.map((s) => s.genre).sort()).toEqual([...SITE_KIND_IDS].sort());
    expect(new Set(SAMPLE_SITES.map((s) => s.id)).size).toBe(SAMPLE_SITES.length);
  });

  test.each(SAMPLE_SITES)("$id はその種類がある年のサイトで、共有データの形式を満たす", (site) => {
    expect(site.year).toBeGreaterThanOrEqual(SITE_KINDS[site.genre].availableFrom);
    const shared = { kind: "anokoro-site", v: 1, ...site };
    expect(sharedSiteSchema.safeParse(shared).success).toBe(true);
  });

  test.each(pages)("$site.id/$page.path はその年で警告がない", ({ site, page }) => {
    const { warnings, score } = checkEra(page.html, { year: site.year, mode: "local" });
    expect(warnings.map((w) => w.ruleId)).toEqual([]);
    expect(score).toBe(100);
  });

  test.each(SAMPLE_SITES)("$id のページは、ほかのページからリンクでたどれる", (site) => {
    const paths = new Set(site.pages.map((p) => p.path));
    const linked = new Set<string>(["index.html"]);
    for (const page of site.pages) {
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
