import { checkEra } from "@anokoro/era-checker";
import { SITE_KIND_IDS, YEARS, siteKindYears, inRange, type Year } from "@anokoro/era-data";
import { describe, expect, it } from "vite-plus/test";
import { assembleQuiz, listSlots, slotsFor } from "./assemble.ts";
import { pageAvailableIn, trickAvailableIn } from "./eligibility.ts";
import { QUIZ_PAGES } from "./pages.ts";
import { QUIZ_TRICKS } from "./tricks.ts";
import type { QuizPage } from "./types.ts";

const yearsOf = (page: QuizPage): Year[] => YEARS.filter((y) => pageAvailableIn(page, y));

describe("お題", () => {
  it("ID が重ならない", () => {
    const ids = QUIZ_PAGES.map((p) => p.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it.each(QUIZ_PAGES.map((p) => [p.id, p] as const))(
    "%s: 年の範囲がサイトの種類がある年に収まる",
    (_id, page) => {
      const kindYears = siteKindYears(page.kind);
      expect(inRange(page.years[0], kindYears)).toBe(true);
      expect(inRange(page.years[1], kindYears)).toBe(true);
      expect(page.years[0]).toBeLessThanOrEqual(page.years[1]);
    },
  );

  it.each(SITE_KIND_IDS)("%s: その種類がある年はどれもお題が 1 つだけある", (kind) => {
    for (const year of YEARS) {
      const count = QUIZ_PAGES.filter((p) => p.kind === kind && pageAvailableIn(p, year)).length;
      expect(count, `${year} 年`).toBe(inRange(year, siteKindYears(kind)) ? 1 : 0);
    }
  });

  it.each(QUIZ_PAGES.map((p) => [p.id, p] as const))(
    "%s: 疑似 URL のホストは .example",
    (_id, page) => {
      expect(new URL(page.url).hostname).toMatch(/\.example$/);
    },
  );

  it.each(QUIZ_PAGES.map((p) => [p.id, p] as const))(
    "%s: 差し込み口があり、組み立てると目印が残らない",
    (_id, page) => {
      expect(listSlots(page).length).toBeGreaterThan(0);
      expect(assembleQuiz(page).source).not.toContain("{{quiz:");
    },
  );
});

describe("仕掛け", () => {
  it("ID が重ならない", () => {
    const ids = QUIZ_TRICKS.map((t) => t.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it.each(QUIZ_TRICKS.map((t) => [t.id, t] as const))(
    "%s: 出題できる年とお題の組み合わせが 1 つ以上ある",
    (_id, trick) => {
      const usable = QUIZ_PAGES.some(
        (page) =>
          slotsFor(page, trick).length > 0 &&
          yearsOf(page).some((year) => trickAvailableIn(trick, year)),
      );
      expect(usable).toBe(true);
    },
  );
});

describe("お題と仕掛けの検査", () => {
  it.each(QUIZ_PAGES.map((p) => [p.id, p] as const))(
    "%s: 仕掛けを入れなければ、使える年で警告ゼロ",
    (_id, page) => {
      const { source } = assembleQuiz(page);
      for (const year of yearsOf(page)) {
        const { warnings } = checkEra(source, { year, mode: "local" });
        expect(warnings, `${year} 年`).toEqual([]);
      }
    },
  );

  it.each(QUIZ_PAGES.map((p) => [p.id, p] as const))(
    "%s: 仕掛けを入れると警告がちょうど 1 件で、ルールとトピックと行が仕掛けと一致する",
    (_id, page) => {
      for (const year of yearsOf(page)) {
        for (const trick of QUIZ_TRICKS.filter((t) => trickAvailableIn(t, year))) {
          for (const slot of slotsFor(page, trick)) {
            const label = `${year} 年、仕掛け ${trick.id}、差し込み口 ${slot.index}`;
            const { source, answerLine } = assembleQuiz(page, { trick, slot: slot.index });
            const { warnings } = checkEra(source, { year, mode: "local" });
            expect(warnings, label).toHaveLength(1);
            const [warning] = warnings;
            expect(warning?.level, label).toBe("future");
            expect(warning?.ruleId, label).toBe(trick.ruleId);
            expect(warning?.topic, label).toBe(trick.topic);
            expect(warning?.locations.length, label).toBeGreaterThan(0);
            for (const loc of warning?.locations ?? []) expect(loc.line, label).toBe(answerLine);
          }
        }
      }
    },
  );
});
