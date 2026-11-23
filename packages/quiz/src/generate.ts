import { checkEra, type TopicId } from "@anokoro/era-checker";
import {
  LINES,
  YEARS,
  defaultLineForYear,
  type FeatureId,
  type LineEntry,
  type LineKey,
  type Year,
} from "@anokoro/era-data";
import { createRandom, type Random } from "@anokoro/shared";
import { ANSWER_ATTRIBUTE, assembleQuiz, slotsFor } from "./assemble.ts";
import { pageAvailableIn, trickAvailableIn, trickDisplayable } from "./eligibility.ts";
import { QUIZ_PAGES } from "./pages.ts";
import { QUIZ_TRICKS } from "./tricks.ts";
import type { QuizPage, QuizTrick } from "./types.ts";

/** 回線の問題に使う回線は、出題年の既定の回線よりこの倍率以上速いものに限る */
export const LINE_SPEEDUP_MIN = 10;

/** トピックを指定しないとき、回線の問題を出す割合（回線の問題を出せる年に限る） */
export const LINE_QUESTION_SHARE = 0.05;

/** お題に表示モードで答えられる仕掛けとそうでない仕掛けの両方があるとき、表示モードで答えられる方を選ぶ割合 */
export const DISPLAYABLE_SHARE = 0.7;

interface QuestionBase {
  seed: number;
  year: Year;
  page: QuizPage;
  /** ソース表示モードに出すソース。差し込み口の目印は残らない */
  source: string;
  /** 表示モードで描くソース。答えの要素に ANSWER_ATTRIBUTE が付く */
  displaySource: string;
  /** 表示モードで、年に関係なく描く機能（答えの技術だけ） */
  allowFeatures: readonly FeatureId[];
  lineKey: LineKey;
  topic: TopicId;
}

/** お題に時代外れの技術が 1 つ混ざった問題 */
export interface TrickQuestion extends QuestionBase {
  kind: "trick";
  trick: QuizTrick;
  /** 正解になる行（時代チェッカーの警告の locations の行） */
  answerLines: readonly number[];
  /** 表示モードで要素をクリックして答えられるか。false ならソース表示モードだけで答える */
  displayable: boolean;
  /** 表示モードで正解になる要素を選ぶセレクター */
  answerSelector: string;
}

/** ページは正しく、回線だけが時代に合わない問題 */
export interface LineQuestion extends QuestionBase {
  kind: "line";
  topic: "line";
}

export type Question = TrickQuestion | LineQuestion;

export interface GenerateOptions {
  seed: number;
  /** 指定すると、そのトピックの仕掛けだけから選ぶ。'line' は回線の問題だけ */
  topic?: TopicId;
}

export type GenerateResult =
  | { ok: true; question: Question }
  | { ok: false; reason: "no-question" };

interface TrickCandidate {
  page: QuizPage;
  trick: QuizTrick;
}

/** その年に回線の問題で使える回線 */
export function futureLinesFor(year: Year): LineEntry[] {
  const base = defaultLineForYear(year);
  return LINES.filter(
    (line) =>
      line.availableYears[0] > year && line.bytesPerSec >= base.bytesPerSec * LINE_SPEEDUP_MIN,
  );
}

function trickCandidates(year: Year, topic: TopicId | undefined): TrickCandidate[] {
  if (topic === "line") return [];
  return QUIZ_PAGES.filter((page) => pageAvailableIn(page, year)).flatMap((page) =>
    QUIZ_TRICKS.filter(
      (trick) =>
        (topic === undefined || trick.topic === topic) &&
        trickAvailableIn(trick, year) &&
        slotsFor(page, trick).length > 0,
    ).map((trick) => ({ page, trick })),
  );
}

interface YearOption {
  year: Year;
  tricks: readonly TrickCandidate[];
  line: boolean;
}

const yearOptionsCache = new Map<TopicId | undefined, readonly YearOption[]>();

function yearOptionsFor(topic: TopicId | undefined): readonly YearOption[] {
  const cached = yearOptionsCache.get(topic);
  if (cached !== undefined) return cached;
  const options = YEARS.map((year) => ({
    year,
    tricks: trickCandidates(year, topic),
    line: lineAvailable(year, topic),
  })).filter((o) => o.tricks.length > 0 || o.line);
  yearOptionsCache.set(topic, options);
  return options;
}

function lineAvailable(year: Year, topic: TopicId | undefined): boolean {
  return (
    (topic === undefined || topic === "line") &&
    futureLinesFor(year).length > 0 &&
    QUIZ_PAGES.some((page) => pageAvailableIn(page, year))
  );
}

function pick<T>(random: Random, items: readonly T[]): T {
  const item = items[Math.floor(random() * items.length)];
  if (item === undefined) throw new RangeError("空の候補からは選べません");
  return item;
}

function unique<T>(items: readonly T[]): T[] {
  return [...new Set(items)];
}

/** 問題を出せるトピック。解説の末尾の「この技術でまちがいさがし」を出すかに使う */
export function quizTopics(): ReadonlySet<TopicId> {
  const topics = new Set<TopicId>();
  for (const year of YEARS) {
    for (const { trick } of trickCandidates(year, undefined)) topics.add(trick.topic);
    if (lineAvailable(year, "line")) topics.add("line");
  }
  return topics;
}

function answerSelectorOf(trick: QuizTrick): string {
  return trick.insert.kind === "rule" ? trick.insert.target : `[${ANSWER_ATTRIBUTE}]`;
}

function pickTrick(random: Random, tricks: readonly QuizTrick[]): QuizTrick {
  const displayable = tricks.filter(trickDisplayable);
  const others = tricks.filter((t) => !trickDisplayable(t));
  if (displayable.length === 0 || others.length === 0) return pick(random, tricks);
  return pick(random, random() < DISPLAYABLE_SHARE ? displayable : others);
}

function trickQuestion(
  seed: number,
  random: Random,
  year: Year,
  candidates: readonly TrickCandidate[],
): TrickQuestion {
  const page = pick(random, unique(candidates.map((c) => c.page)));
  const trick = pickTrick(
    random,
    candidates.filter((c) => c.page === page).map((c) => c.trick),
  );
  const slot = pick(random, slotsFor(page, trick)).index;
  const { source } = assembleQuiz(page, { trick, slot });
  const { source: displaySource } = assembleQuiz(page, { trick, slot }, { markAnswer: true });
  const answerLines = unique(
    checkEra(source, { year, mode: "local" })
      .warnings.filter((w) => w.level === "future")
      .flatMap((w) => w.locations.map((loc) => loc.line)),
  );
  return {
    kind: "trick",
    seed,
    year,
    page,
    source,
    displaySource,
    allowFeatures: [trick.feature],
    lineKey: defaultLineForYear(year).key,
    topic: trick.topic,
    trick,
    answerLines,
    displayable: trickDisplayable(trick),
    answerSelector: answerSelectorOf(trick),
  };
}

function lineQuestion(seed: number, random: Random, year: Year): LineQuestion {
  const page = pick(
    random,
    QUIZ_PAGES.filter((p) => pageAvailableIn(p, year)),
  );
  const line = pick(random, futureLinesFor(year));
  const { source } = assembleQuiz(page);
  return {
    kind: "line",
    seed,
    year,
    page,
    source,
    displaySource: source,
    allowFeatures: [],
    lineKey: line.key,
    topic: "line",
  };
}

/**
 * シードと条件から問題を作る。同じシードと条件なら同じ問題を返す。
 * 年を先に等しい確率で選び、その年のお題、仕掛け、差し込み口の順に選ぶ。
 * 仕掛けは、表示モードで答えられるものを DISPLAYABLE_SHARE の割合で選ぶ。
 */
export function generateQuestion({ seed, topic }: GenerateOptions): GenerateResult {
  const normalizedSeed = seed >>> 0;
  const random = createRandom(normalizedSeed);
  const options = yearOptionsFor(topic);
  if (options.length === 0) return { ok: false, reason: "no-question" };

  const { year, tricks, line } = pick(random, options);
  const wantsLine = line && (tricks.length === 0 || random() < LINE_QUESTION_SHARE);
  const question = wantsLine
    ? lineQuestion(normalizedSeed, random, year)
    : trickQuestion(normalizedSeed, random, year, tricks);
  return { ok: true, question };
}
