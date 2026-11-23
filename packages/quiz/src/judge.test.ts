import { FEATURES } from "@anokoro/era-data";
import { describe, expect, it } from "vite-plus/test";
import {
  generateQuestion,
  type LineQuestion,
  type Question,
  type TrickQuestion,
} from "./generate.ts";
import {
  INITIAL_PROGRESS,
  answerFacts,
  judge,
  remainingTries,
  type QuizProgress,
} from "./judge.ts";

function findQuestion<T extends Question>(matches: (q: Question) => q is T): T {
  for (let seed = 0; seed < 5000; seed++) {
    const r = generateQuestion({ seed });
    if (r.ok && matches(r.question)) return r.question;
  }
  throw new Error("条件に合う問題が見つかりません");
}

const isDisplayable = (q: Question): q is TrickQuestion => q.kind === "trick" && q.displayable;
const isSourceOnly = (q: Question): q is TrickQuestion => q.kind === "trick" && !q.displayable;
const isLine = (q: Question): q is LineQuestion => q.kind === "line";

const displayable = findQuestion(isDisplayable);
const sourceOnly = findQuestion(isSourceOnly);
const lineQuestion = findQuestion(isLine);
const hasStartYear = (q: Question): q is TrickQuestion =>
  q.kind === "trick" && FEATURES[q.trick.feature].availableFrom !== null;
const noStartYear = (q: Question): q is TrickQuestion =>
  q.kind === "trick" && FEATURES[q.trick.feature].availableFrom === null;
const answerLine = displayable.answerLines[0] ?? 0;
const wrongLine = (n: number): number => answerLine + 100 + n;

describe("judge", () => {
  it("答えの要素か、その内側を選べば正解", () => {
    const r = judge(displayable, INITIAL_PROGRESS, { kind: "element", path: "0", isAnswer: true });
    expect(r.outcome).toBe("correct");
    expect(r.progress.kind).toBe("correct");
  });

  it("答えの行を選べば正解", () => {
    const r = judge(displayable, INITIAL_PROGRESS, { kind: "line", line: answerLine });
    expect(r.outcome).toBe("correct");
  });

  it("間違えると残りが減り、3 回で終わる", () => {
    let progress: QuizProgress = INITIAL_PROGRESS;
    for (const n of [1, 2, 3]) {
      const r = judge(displayable, progress, { kind: "line", line: wrongLine(n) });
      expect(r.outcome).toBe("miss");
      expect(remainingTries(r.progress)).toBe(3 - n);
      progress = r.progress;
    }
    expect(progress.kind).toBe("failed");
    const after = judge(displayable, progress, { kind: "line", line: answerLine });
    expect(after.outcome).toBe("finished");
  });

  it("同じ場所をもう一度選んでも回数を減らさない", () => {
    const pick = { kind: "element", path: "1.2", isAnswer: false } as const;
    const first = judge(displayable, INITIAL_PROGRESS, pick);
    const again = judge(displayable, first.progress, pick);
    expect(again.outcome).toBe("repeat");
    expect(remainingTries(again.progress)).toBe(2);
  });

  it("ソース表示モードだけの問題では、要素を選んでも数えない", () => {
    const r = judge(sourceOnly, INITIAL_PROGRESS, { kind: "element", path: "0", isAnswer: true });
    expect(r.outcome).toBe("ignored");
    expect(r.progress).toBe(INITIAL_PROGRESS);
  });

  it("「回線がおかしい」は回線の問題のときだけ正解", () => {
    expect(judge(lineQuestion, INITIAL_PROGRESS, { kind: "net" }).outcome).toBe("correct");
    expect(judge(displayable, INITIAL_PROGRESS, { kind: "net" }).outcome).toBe("miss");
    const element = { kind: "element", path: "0", isAnswer: false } as const;
    expect(judge(lineQuestion, INITIAL_PROGRESS, element).outcome).toBe("miss");
  });
});

describe("answerFacts", () => {
  it("技術の名前、使えるようになった年、何年早いか、答えの行を返す", () => {
    const q = findQuestion(hasStartYear);
    const facts = answerFacts(q);
    const since = FEATURES[q.trick.feature].availableFrom;
    expect(facts.label).toBe(FEATURES[q.trick.feature].label);
    expect(facts.since).toBe(since);
    expect(facts.yearsEarly).toBe((since ?? 0) - q.year);
    expect(facts.yearsEarly).toBeGreaterThan(0);
    expect(facts.code).toBe(q.source.split("\n")[(q.answerLines[0] ?? 0) - 1]?.trim());
  });

  it("2015 年までに使えるようにならなかった技術は、年を null にする", () => {
    const facts = answerFacts(findQuestion(noStartYear));
    expect(facts.since).toBeNull();
    expect(facts.yearsEarly).toBeNull();
  });

  it("回線の問題は回線の名前と年を返し、答えの行はない", () => {
    const facts = answerFacts(lineQuestion);
    expect(facts.since).toBeGreaterThan(lineQuestion.year);
    expect(facts.code).toBeNull();
  });
});
