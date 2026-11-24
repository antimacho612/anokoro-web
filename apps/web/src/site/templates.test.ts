import { checkEra } from "@anokoro/era-checker";
import { SITE_KIND_IDS, YEARS, inRange, siteKindYears } from "@anokoro/era-data";
import { QUIZ_PAGES, assembleQuiz } from "@anokoro/quiz";
import { describe, expect, test } from "vite-plus/test";
import { TEMPLATE } from "../kit/notepad/templates.ts";
import { BLANK, loadTemplatePages, templatePageHtml, templateSample } from "./templates.ts";

const cases = SITE_KIND_IDS.flatMap((kind) =>
  YEARS.filter((year) => inRange(year, siteKindYears(kind))).map((year) => ({ kind, year })),
);

describe("loadTemplatePages", () => {
  test.each(cases)(
    "$kind の $year 年のテンプレートは、その年で警告がない",
    async ({ kind, year }) => {
      const pages = await loadTemplatePages(kind, year);
      expect(pages.length).toBeGreaterThan(0);
      const problems = pages.flatMap((page) =>
        checkEra(page.html, { year, mode: "local" }).warnings.map(
          (w) => `${page.path} ${w.ruleId}`,
        ),
      );
      expect(problems).toEqual([]);
    },
  );

  test("見本サイトがある年は、その見本サイトのページ一式", async () => {
    const pages = await loadTemplatePages("personal", 2000);
    expect(pages.map((p) => p.path)).toEqual(["index.html", "profile.html", "diary.html"]);
    expect((await loadTemplatePages("personal", 2003))[0]?.html).toBe(TEMPLATE);
  });

  test("見本サイトがない年は、時代まちがいさがしのお題を 1 ページにする", async () => {
    const quizPage = QUIZ_PAGES.find((p) => p.id === "personal-2008");
    if (!quizPage) throw new Error("お題がありません");
    expect(await loadTemplatePages("personal", 2010)).toEqual([
      { path: "index.html", html: assembleQuiz(quizPage).source },
    ]);
  });

  test("種類ごとに違うテンプレート", async () => {
    const tops = await Promise.all(
      SITE_KIND_IDS.map(async (kind) => (await loadTemplatePages(kind, 2005))[0]?.html),
    );
    expect(new Set(tops).size).toBe(SITE_KIND_IDS.length);
  });
});

describe("templateSample", () => {
  test("その種類で、年の範囲に入る見本サイトを選ぶ", () => {
    expect(templateSample("personal", 1999)?.id).toBe("personal");
    expect(templateSample("personal", 2007)?.id).toBe("taro");
    expect(templateSample("personal", 1995)).toBeUndefined();
    expect(templateSample("blog", 2006)?.id).toBe("blog");
  });
});

describe("templatePageHtml", () => {
  const pages = [
    { path: "index.html", html: "<p>top</p>" },
    { path: "diary.html", html: "<p>diary</p>" },
  ];

  test("同じパスのページを返し、なければ最初のページ", () => {
    expect(templatePageHtml(pages, "diary.html")).toBe("<p>diary</p>");
    expect(templatePageHtml(pages, "link.html")).toBe("<p>top</p>");
    expect(templatePageHtml([], "index.html")).toBe(BLANK);
  });
});
