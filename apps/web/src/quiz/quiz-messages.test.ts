import { generateQuestion, INITIAL_PROGRESS, judge, type Question } from "@anokoro/quiz";
import { describe, expect, it } from "vite-plus/test";
import { IGNORED_MESSAGE, REPEAT_MESSAGE, messageFor } from "./quiz-messages.ts";

function questionWith(matches: (q: Question) => boolean): Question {
  for (let seed = 0; seed < 5000; seed++) {
    const r = generateQuestion({ seed });
    if (r.ok && matches(r.question)) return r.question;
  }
  throw new Error("条件に合う問題が見つかりません");
}

const trick = questionWith((q) => q.kind === "trick" && q.displayable);
const sourceOnly = questionWith((q) => q.kind === "trick" && !q.displayable);
const line = questionWith((q) => q.kind === "line");

describe("messageFor", () => {
  it("正解なら「正解！」と年の説明", () => {
    const r = judge(trick, INITIAL_PROGRESS, { kind: "element", path: "0", isAnswer: true });
    expect(messageFor(trick, r)).toEqual({
      message: "正解！",
      note: expect.stringMatching(/年から/),
    });
  });

  it("間違えると残りの回数を出し、3 回目で答えを示す", () => {
    const pick = (n: number) => ({ kind: "element", path: String(n), isAnswer: false }) as const;
    const first = judge(trick, INITIAL_PROGRESS, pick(1));
    expect(messageFor(trick, first)).toEqual({ message: "ちがうようです（残り 2 回）", note: "" });
    expect(messageFor(trick, judge(trick, first.progress, pick(1))).message).toBe(REPEAT_MESSAGE);
    const third = judge(trick, judge(trick, first.progress, pick(2)).progress, pick(3));
    expect(messageFor(trick, third).message).toBe("答えはここでした");
  });

  it("回線の問題で 3 回間違えると「答えは回線でした」", () => {
    let progress = INITIAL_PROGRESS;
    let last = judge(line, progress, { kind: "line", line: 1 });
    for (const n of [2, 3]) {
      progress = last.progress;
      last = judge(line, progress, { kind: "line", line: n });
    }
    expect(messageFor(line, last).message).toBe("答えは回線でした");
  });

  it("ソース表示だけの問題で要素を選ぶと案内を出す", () => {
    const r = judge(sourceOnly, INITIAL_PROGRESS, { kind: "element", path: "0", isAnswer: true });
    expect(messageFor(sourceOnly, r).message).toBe(IGNORED_MESSAGE);
  });
});
