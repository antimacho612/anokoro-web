import { TOPIC_IDS, type TopicId } from "@anokoro/era-checker";
import type { Year } from "@anokoro/era-data";

/**
 * URL で指定する出題。
 * daily: 今日の 1 問 / seeded: シードで決まる問題 / random: ランダム
 */
export type QuizRequest =
  | { kind: "daily" }
  | { kind: "seeded"; seed: number; topic?: TopicId }
  | { kind: "random"; topic?: TopicId };

const MAX_SEED = 0xffffffff;

function isTopicId(value: string): value is TopicId {
  return TOPIC_IDS.some((id) => id === value);
}

function parseSeed(raw: string | null): number | undefined {
  if (raw === null || !/^\d{1,10}$/.test(raw)) return undefined;
  const seed = Number(raw);
  return seed <= MAX_SEED ? seed : undefined;
}

/** URL の検索部分を読む。不正な topic や seed は無視する */
export function parseQuizRequest(search: string): QuizRequest {
  const params = new URLSearchParams(search);
  if (params.has("daily")) return { kind: "daily" };
  const rawTopic = params.get("topic");
  const topic = rawTopic !== null && isTopicId(rawTopic) ? rawTopic : undefined;
  const seed = parseSeed(params.get("seed"));
  const withTopic = topic === undefined ? {} : { topic };
  return seed === undefined
    ? { kind: "random", ...withTopic }
    : { kind: "seeded", seed, ...withTopic };
}

export interface LocalDate {
  year: number;
  /** 1 〜 12 */
  month: number;
  day: number;
}

/** 今日の 1 問のシード。同じ日付なら同じ値 */
export function dailySeed({ year, month, day }: LocalDate): number {
  return year * 10000 + month * 100 + day;
}

export function localDateOf(date: Date): LocalDate {
  return { year: date.getFullYear(), month: date.getMonth() + 1, day: date.getDate() };
}

export interface QuizUrlOptions {
  seed?: number;
  topic?: TopicId;
}

/** 時代まちがいさがしの URL。base は Vite の BASE_URL */
export function quizUrl(base: string, { seed, topic }: QuizUrlOptions = {}): string {
  const params = new URLSearchParams();
  if (topic !== undefined) params.set("topic", topic);
  if (seed !== undefined) params.set("seed", String(seed));
  const query = params.toString();
  return `${base}quiz/${query === "" ? "" : `?${query}`}`;
}

/** その年の作成キットの URL */
export function kitUrl(base: string, year: Year): string {
  return `${base}kit/?year=${year}`;
}
