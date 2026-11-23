import type { SiteKindId, Year } from "@anokoro/era-data";
import { QUIZ_PAGES, assembleQuiz } from "@anokoro/quiz";
import { BLANK, TEMPLATE } from "../kit/notepad/templates.ts";

/**
 * その種類と年らしいページのテンプレート。
 * 個人ホームページはプロトタイプのテンプレート、ほかの種類は時代まちがいさがしのお題（仕掛けなし）を使う。
 * お題は年の範囲ごとに作ってあるので、その年までに始まったもののうち、いちばん新しいものを選ぶ
 */
export function siteTemplate(kind: SiteKindId, year: Year): string {
  if (kind === "personal") return TEMPLATE;
  const candidates = QUIZ_PAGES.filter((p) => p.kind === kind && p.years[0] <= year);
  const page = candidates.reduce<(typeof candidates)[number] | undefined>(
    (best, p) => (best === undefined || p.years[0] > best.years[0] ? p : best),
    undefined,
  );
  return page ? assembleQuiz(page).source : BLANK;
}

export { BLANK };
