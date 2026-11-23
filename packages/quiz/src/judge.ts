import { FEATURES, getLine, type Year } from "@anokoro/era-data";
import type { Question } from "./generate.ts";

/** 答えられる回数 */
export const MAX_TRIES = 3;

/**
 * 利用者の答え。
 * element: 表示モードで要素を選んだ（path は body からの位置。同じ要素の選び直しを見分ける） /
 * line: ソース表示モードで行を選んだ / net: 「ページではなく回線がおかしい」
 */
export type QuizPick =
  | { kind: "element"; path: string; isAnswer: boolean }
  | { kind: "line"; line: number }
  | { kind: "net" };

export type QuizProgress =
  | { kind: "playing"; misses: readonly QuizPick[] }
  | { kind: "correct"; misses: readonly QuizPick[] }
  | { kind: "failed"; misses: readonly QuizPick[] };

/**
 * correct: 正解 / miss: 間違い（回数を減らした） / repeat: 前と同じ間違い（回数は減らさない） /
 * ignored: この問題では数えない答え方（ソース表示モードだけの問題で要素を選んだ、など） / finished: もう終わっている
 */
export type JudgeOutcome = "correct" | "miss" | "repeat" | "ignored" | "finished";

export interface JudgeResult {
  progress: QuizProgress;
  outcome: JudgeOutcome;
}

export const INITIAL_PROGRESS: QuizProgress = { kind: "playing", misses: [] };

export function pickKey(pick: QuizPick): string {
  switch (pick.kind) {
    case "element":
      return `element:${pick.path}`;
    case "line":
      return `line:${pick.line}`;
    case "net":
      return "net";
    default: {
      const exhaustive: never = pick;
      return exhaustive;
    }
  }
}

export function remainingTries(progress: QuizProgress): number {
  return Math.max(0, MAX_TRIES - progress.misses.length);
}

function isCorrect(question: Question, pick: QuizPick): boolean | "ignored" {
  switch (pick.kind) {
    case "element":
      if (question.kind === "trick" && !question.displayable) return "ignored";
      return question.kind === "trick" && pick.isAnswer;
    case "line":
      return question.kind === "trick" && question.answerLines.includes(pick.line);
    case "net":
      return question.kind === "line";
    default: {
      const exhaustive: never = pick;
      return exhaustive;
    }
  }
}

/** 答えを判定し、次の進み具合を返す */
export function judge(question: Question, progress: QuizProgress, pick: QuizPick): JudgeResult {
  if (progress.kind !== "playing") return { progress, outcome: "finished" };
  const correct = isCorrect(question, pick);
  if (correct === "ignored") return { progress, outcome: "ignored" };
  if (correct)
    return { progress: { kind: "correct", misses: progress.misses }, outcome: "correct" };

  const key = pickKey(pick);
  if (progress.misses.some((m) => pickKey(m) === key)) return { progress, outcome: "repeat" };
  const misses = [...progress.misses, pick];
  const kind = misses.length >= MAX_TRIES ? "failed" : "playing";
  return { progress: { kind, misses }, outcome: "miss" };
}

/** 答え合わせに出す、時代外れだった技術（または回線）のこと */
export interface AnswerFacts {
  /** 技術や回線の名前 */
  label: string;
  /** 使えるようになった年。1995〜2015 年のうちに使えるようにならなかったものは null */
  since: Year | null;
  /** 出題年から使えるようになるまでの年数。since が null なら null */
  yearsEarly: number | null;
  /** 答えのソースの行（前後の空白を除く）。回線の問題では null */
  code: string | null;
}

export function answerFacts(question: Question): AnswerFacts {
  if (question.kind === "line") {
    const line = getLine(question.lineKey);
    const since = line.availableYears[0];
    return { label: line.name, since, yearsEarly: since - question.year, code: null };
  }
  const feature = FEATURES[question.trick.feature];
  const since = feature.availableFrom;
  const lineNumber = question.answerLines[0];
  const code =
    lineNumber === undefined ? null : (question.source.split("\n")[lineNumber - 1]?.trim() ?? null);
  return {
    label: feature.label,
    since,
    yearsEarly: since === null ? null : since - question.year,
    code,
  };
}
