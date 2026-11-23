import { generateQuestion } from "@anokoro/quiz";
import { describe, expect, it } from "vite-plus/test";
import { dailySeed } from "./quiz-params.ts";
import { NO_QUESTION_NOTICE, startQuiz } from "./quiz-start.ts";

const today = { year: 2026, month: 11, day: 23 };
const deps = { randomSeed: () => 99, today };

describe("startQuiz", () => {
  it("今日の 1 問は日付のシードで出し、URL にシードを書かない", () => {
    const start = startQuiz({ kind: "daily" }, deps);
    expect(start.question.seed).toBe(dailySeed(today));
    expect(start.urlSeed).toBeNull();
  });

  it("シードの指定は同じ問題になる", () => {
    const start = startQuiz({ kind: "seeded", seed: 5, topic: "css" }, deps);
    expect(generateQuestion({ seed: 5, topic: "css" })).toEqual({
      ok: true,
      question: start.question,
    });
    expect(start).toMatchObject({ topic: "css", urlSeed: 5, notice: null });
  });

  it("ランダムは新しいシードを URL に書く", () => {
    const start = startQuiz({ kind: "random", topic: "line" }, deps);
    expect(start).toMatchObject({ topic: "line", urlSeed: 99, notice: null });
    expect(start.question.kind).toBe("line");
  });

  it("問題を作れないトピックは、お知らせを出してランダムに戻す", () => {
    const start = startQuiz({ kind: "random", topic: "text" }, deps);
    expect(start).toMatchObject({ topic: undefined, urlSeed: 99, notice: NO_QUESTION_NOTICE });
    const seeded = startQuiz({ kind: "seeded", seed: 1, topic: "text" }, deps);
    expect(seeded).toMatchObject({ topic: undefined, urlSeed: 99, notice: NO_QUESTION_NOTICE });
  });
});
