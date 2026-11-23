import type { TopicId } from "@anokoro/era-checker";
import { generateQuestion, type Question } from "@anokoro/quiz";
import { dailySeed, type LocalDate, type QuizRequest } from "./quiz-params.ts";

export const NO_QUESTION_NOTICE = "この条件の問題はまだありません";

export interface QuizStart {
  question: Question;
  /** 「次の問題」でも保つトピック */
  topic: TopicId | undefined;
  /** URL に書くシード。今日の 1 問では書かない */
  urlSeed: number | null;
  notice: string | null;
}

export interface QuizStartDeps {
  randomSeed: () => number;
  today: LocalDate;
}

/** 新しいシードでランダムに出す。「次の問題」でも使う */
export function randomStart(
  topic: TopicId | undefined,
  { randomSeed }: Pick<QuizStartDeps, "randomSeed">,
): QuizStart {
  const seed = randomSeed();
  const result = generateQuestion(topic === undefined ? { seed } : { seed, topic });
  if (result.ok) return { question: result.question, topic, urlSeed: seed, notice: null };
  const fallback = generateQuestion({ seed });
  if (!fallback.ok) throw new Error("ランダムの問題を作れません");
  return {
    question: fallback.question,
    topic: undefined,
    urlSeed: seed,
    notice: NO_QUESTION_NOTICE,
  };
}

/** URL の指定から最初の問題を決める。作れない条件なら、お知らせを付けてランダムの出題に戻す */
export function startQuiz(request: QuizRequest, deps: QuizStartDeps): QuizStart {
  switch (request.kind) {
    case "daily": {
      const result = generateQuestion({ seed: dailySeed(deps.today) });
      if (!result.ok) return randomStart(undefined, deps);
      return { question: result.question, topic: undefined, urlSeed: null, notice: null };
    }
    case "seeded": {
      const { seed, topic } = request;
      const result = generateQuestion(topic === undefined ? { seed } : { seed, topic });
      if (result.ok) return { question: result.question, topic, urlSeed: seed, notice: null };
      return { ...randomStart(undefined, deps), notice: NO_QUESTION_NOTICE };
    }
    case "random":
      return randomStart(request.topic, deps);
    default: {
      const exhaustive: never = request;
      return exhaustive;
    }
  }
}

/** 32 ビットの乱数のシード */
export function randomSeed(): number {
  return crypto.getRandomValues(new Uint32Array(1))[0] ?? 0;
}
