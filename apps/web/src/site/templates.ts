import type { TopicId } from "@anokoro/era-checker";
import { SITE_KINDS, inRange, type SiteKindId, type Year, type YearRange } from "@anokoro/era-data";
import { QUIZ_PAGES, assembleQuiz } from "@anokoro/quiz";
import { BLANK, TEMPLATE } from "../kit/notepad/templates.ts";

/** プロトタイプのテンプレートが、その年の技術だけで書けている年 */
export const PROTOTYPE_TEMPLATE_YEARS: YearRange = [1996, 2007];

function quizTemplate(kind: SiteKindId, year: Year): string | undefined {
  const candidates = QUIZ_PAGES.filter((p) => p.kind === kind && p.years[0] <= year);
  const page = candidates.reduce<(typeof candidates)[number] | undefined>(
    (best, p) => (best === undefined || p.years[0] > best.years[0] ? p : best),
    undefined,
  );
  return page && assembleQuiz(page).source;
}

/**
 * その種類と年らしいページのテンプレート。
 * 個人ホームページは、使える年ならプロトタイプのテンプレートを使う。
 * それ以外は、時代まちがいさがしのお題（仕掛けなし）のうち、その年までに始まったいちばん新しいものを使う
 */
export function siteTemplate(kind: SiteKindId, year: Year): string {
  if (kind === "personal" && inRange(year, PROTOTYPE_TEMPLATE_YEARS)) return TEMPLATE;
  return quizTemplate(kind, year) ?? BLANK;
}

/** サイトの種類の解説トピック */
export function kindTopic(kind: SiteKindId): TopicId {
  return SITE_KINDS[kind].topic;
}

export { BLANK };
