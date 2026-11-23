import { checkEra } from "@anokoro/era-checker";
import { SITE_KIND_IDS, YEARS, inRange, siteKindYears } from "@anokoro/era-data";
import { describe, expect, test } from "vite-plus/test";
import { TEMPLATE } from "../kit/notepad/templates.ts";
import { siteTemplate } from "./templates.ts";

const cases = SITE_KIND_IDS.flatMap((kind) =>
  YEARS.filter((year) => inRange(year, siteKindYears(kind))).map((year) => ({ kind, year })),
);

describe("siteTemplate", () => {
  test.each(cases)("$kind の $year 年のテンプレートは、その年で警告がない", ({ kind, year }) => {
    const { warnings, score } = checkEra(siteTemplate(kind, year), { year, mode: "local" });
    expect(warnings.map((w) => w.ruleId)).toEqual([]);
    expect(score).toBe(100);
  });

  test("個人ホームページは、使える年ならプロトタイプのテンプレート", () => {
    expect(siteTemplate("personal", 2003)).toBe(TEMPLATE);
    expect(siteTemplate("personal", 1995)).not.toBe(TEMPLATE);
    expect(siteTemplate("personal", 2010)).not.toBe(TEMPLATE);
  });

  test("種類ごとに違うテンプレート", () => {
    const pages = new Set(SITE_KIND_IDS.map((kind) => siteTemplate(kind, 2005)));
    expect(pages.size).toBe(SITE_KIND_IDS.length);
  });
});
