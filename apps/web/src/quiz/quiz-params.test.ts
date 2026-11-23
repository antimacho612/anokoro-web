import { describe, expect, it } from "vite-plus/test";
import { dailySeed, kitUrl, localDateOf, parseQuizRequest, quizUrl } from "./quiz-params.ts";

describe("parseQuizRequest", () => {
  it("何もなければランダム", () => {
    expect(parseQuizRequest("")).toEqual({ kind: "random" });
  });

  it("daily があれば今日の 1 問", () => {
    expect(parseQuizRequest("?daily")).toEqual({ kind: "daily" });
    expect(parseQuizRequest("?daily&seed=3&topic=css")).toEqual({ kind: "daily" });
  });

  it("seed と topic を読む", () => {
    expect(parseQuizRequest("?seed=42")).toEqual({ kind: "seeded", seed: 42 });
    expect(parseQuizRequest("?topic=css&seed=4294967295")).toEqual({
      kind: "seeded",
      seed: 4294967295,
      topic: "css",
    });
    expect(parseQuizRequest("?topic=line")).toEqual({ kind: "random", topic: "line" });
  });

  it("不正な topic と seed は無視する", () => {
    expect(parseQuizRequest("?topic=evil&seed=-1")).toEqual({ kind: "random" });
    expect(parseQuizRequest("?seed=4294967296")).toEqual({ kind: "random" });
    expect(parseQuizRequest("?seed=1e3")).toEqual({ kind: "random" });
    expect(parseQuizRequest("?topic=__proto__")).toEqual({ kind: "random" });
  });
});

describe("dailySeed", () => {
  it("同じ日付なら同じ、違う日付なら違う", () => {
    const today = { year: 2026, month: 11, day: 23 };
    expect(dailySeed(today)).toBe(dailySeed({ ...today }));
    expect(dailySeed(today)).not.toBe(dailySeed({ ...today, day: 24 }));
  });

  it("端末の日付（年月日）を使う", () => {
    expect(localDateOf(new Date(2026, 0, 2, 23, 59))).toEqual({ year: 2026, month: 1, day: 2 });
  });
});

describe("URL", () => {
  it("base の下の quiz と kit を指す", () => {
    expect(quizUrl("/")).toBe("/quiz/");
    expect(quizUrl("/anokoro-web/", { topic: "css", seed: 7 })).toBe(
      "/anokoro-web/quiz/?topic=css&seed=7",
    );
    expect(kitUrl("/", 2003)).toBe("/kit/?year=2003");
  });
});
