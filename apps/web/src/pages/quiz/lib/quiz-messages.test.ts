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

describe("messageFor", () => {
  it("正解したら途中の一言は出さない（結果の欄に出す）", () => {
    const r = judge(trick, INITIAL_PROGRESS, { kind: "element", path: "0", isAnswer: true });
    expect(messageFor(r)).toBe("");
  });

  it("間違えると残りの回数を出し、3 回目は結果の欄に任せる", () => {
    const pick = (n: number) => ({ kind: "element", path: String(n), isAnswer: false }) as const;
    const first = judge(trick, INITIAL_PROGRESS, pick(1));
    expect(messageFor(first)).toBe("ちがうようです（残り 2 回）");
    expect(messageFor(judge(trick, first.progress, pick(1)))).toBe(REPEAT_MESSAGE);
    const third = judge(trick, judge(trick, first.progress, pick(2)).progress, pick(3));
    expect(third.progress.kind).toBe("failed");
    expect(messageFor(third)).toBe("");
  });

  it("ソース表示だけの問題で要素を選ぶと案内を出す", () => {
    const r = judge(sourceOnly, INITIAL_PROGRESS, { kind: "element", path: "0", isAnswer: true });
    expect(messageFor(r)).toBe(IGNORED_MESSAGE);
  });
});
