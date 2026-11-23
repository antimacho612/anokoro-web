import { checkEra, type TopicId } from "@anokoro/era-checker";
import { FEATURES, YEARS, defaultLineForYear, featureStatus, getLine } from "@anokoro/era-data";
import { describe, expect, it } from "vite-plus/test";
import { ANSWER_ATTRIBUTE, assembleQuiz, slotsFor } from "./assemble.ts";
import { pageAvailableIn, trickAvailableIn, trickDisplayable } from "./eligibility.ts";
import {
  LINE_SPEEDUP_MIN,
  futureLinesFor,
  generateQuestion,
  quizTopics,
  type Question,
} from "./generate.ts";
import { QUIZ_PAGES } from "./pages.ts";
import { QUIZ_TRICKS } from "./tricks.ts";

const SEEDS = Array.from({ length: 600 }, (_, i) => i * 7919 + 1);

function questionOf(seed: number, topic?: TopicId): Question {
  const result = generateQuestion(topic === undefined ? { seed } : { seed, topic });
  if (!result.ok) throw new Error(`シード ${seed} で問題を作れません`);
  return result.question;
}

describe("generateQuestion", () => {
  it("同じシードと条件なら同じ問題を返す", () => {
    for (const seed of SEEDS.slice(0, 50)) {
      expect(generateQuestion({ seed })).toEqual(generateQuestion({ seed }));
      expect(generateQuestion({ seed, topic: "css" })).toEqual(
        generateQuestion({ seed, topic: "css" }),
      );
    }
  });

  it("シードが違えば、いろいろな問題が出る", () => {
    const keys = new Set(
      SEEDS.map((seed) => {
        const q = questionOf(seed);
        return `${q.year}-${q.page.id}-${q.kind === "trick" ? q.trick.id : q.lineKey}`;
      }),
    );
    expect(keys.size).toBeGreaterThan(200);
  });

  it("シードは 32 ビットの符号なし整数にそろえる", () => {
    expect(generateQuestion({ seed: -1 })).toEqual(generateQuestion({ seed: 0xffffffff }));
  });

  it.each(SEEDS)("シード %i: 出題の規則を守る", (seed) => {
    const q = questionOf(seed);
    expect(pageAvailableIn(q.page, q.year)).toBe(true);
    expect(q.source).not.toContain("{{quiz:");
    expect(q.source).not.toContain(ANSWER_ATTRIBUTE);

    if (q.kind === "line") {
      const line = getLine(q.lineKey);
      expect(line.availableYears[0]).toBeGreaterThan(q.year);
      expect(line.bytesPerSec).toBeGreaterThanOrEqual(
        defaultLineForYear(q.year).bytesPerSec * LINE_SPEEDUP_MIN,
      );
      expect(q.topic).toBe("line");
      expect(checkEra(q.source, { year: q.year, mode: "local" }).warnings).toEqual([]);
      return;
    }

    expect(trickAvailableIn(q.trick, q.year)).toBe(true);
    expect(featureStatus(q.trick.feature, q.year)).toBe("future");
    expect(q.topic).toBe(q.trick.topic);
    expect(q.lineKey).toBe(defaultLineForYear(q.year).key);
    expect(q.displayable).toBe(trickDisplayable(q.trick));

    const { warnings } = checkEra(q.source, { year: q.year, mode: "local" });
    expect(warnings).toHaveLength(1);
    expect(q.answerLines).toEqual(warnings[0]?.locations.map((l) => l.line));
  });
});

describe("表示モード", () => {
  it("表示モードで出せる仕掛けは、描く年で警告が消え、答えの目印が残る", () => {
    for (const year of YEARS) {
      for (const page of QUIZ_PAGES.filter((p) => pageAvailableIn(p, year))) {
        const tricks = QUIZ_TRICKS.filter((t) => trickDisplayable(t) && trickAvailableIn(t, year));
        for (const trick of tricks) {
          const renderYear = Math.max(year, FEATURES[trick.feature].availableFrom ?? year);
          for (const slot of slotsFor(page, trick)) {
            const label = `${year} 年、${page.id}、${trick.id}、差し込み口 ${slot.index}`;
            const placement = { trick, slot: slot.index };
            const { source } = assembleQuiz(page, placement, { markAnswer: true });
            const result = checkEra(source, { year: renderYear, mode: "net" });
            expect(
              result.warnings.filter((w) => w.level === "future"),
              label,
            ).toEqual([]);
            expect(result.html, label).toContain(ANSWER_ATTRIBUTE);
          }
        }
      }
    }
  });
});

describe("トピックの指定", () => {
  it.each(["css", "html", "js"] as const)("%s: そのトピックの仕掛けだけから選ぶ", (topic) => {
    for (const seed of SEEDS.slice(0, 100)) {
      const q = questionOf(seed, topic);
      expect(q.kind).toBe("trick");
      expect(q.topic).toBe(topic);
    }
  });

  it("line を指定すると回線の問題だけを出す", () => {
    for (const seed of SEEDS.slice(0, 100)) expect(questionOf(seed, "line").kind).toBe("line");
  });

  it("仕掛けのないトピックはエラーを返す", () => {
    expect(generateQuestion({ seed: 1, topic: "text" })).toEqual({
      ok: false,
      reason: "no-question",
    });
  });

  it("問題を出せるトピックを返す", () => {
    expect([...quizTopics()].sort()).toEqual(["css", "html", "js", "line"]);
  });
});

describe("回線の問題", () => {
  it("トピックを指定しなくても、ときどき出る", () => {
    const lines = SEEDS.map((seed) => questionOf(seed)).filter((q) => q.kind === "line");
    expect(lines.length).toBeGreaterThan(0);
    expect(lines.length).toBeLessThan(SEEDS.length / 4);
  });

  it("出題年にまだ選べず、既定の回線よりずっと速い回線を使う", () => {
    expect(futureLinesFor(1997).map((l) => l.key)).toEqual(["adsl1", "adsl12", "hikari"]);
    expect(futureLinesFor(2000).map((l) => l.key)).toEqual(["adsl1", "adsl12", "hikari"]);
    expect(futureLinesFor(2001)).toEqual([]);
    expect(futureLinesFor(2010)).toEqual([]);
  });
});
