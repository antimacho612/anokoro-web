import type { TopicId } from "@anokoro/era-checker";
import { SITE_KINDS, inRange, type SiteKindId, type Year } from "@anokoro/era-data";
import type { SitePage } from "@anokoro/shared";
import { BLANK } from "../kit/notepad/templates.ts";
import { SAMPLE_SITES, type SampleSite } from "../samples/index.ts";
import { INDEX_PAGE } from "./site-model.ts";

/** その種類と年のテンプレートにする見本サイト。年が重なるときは、あとから作ったものを選ぶ */
export function templateSample(kind: SiteKindId, year: Year): SampleSite | undefined {
  return SAMPLE_SITES.filter((s) => s.genre === kind && inRange(year, s.years)).reduce<
    SampleSite | undefined
  >((best, s) => (best === undefined || s.years[0] > best.years[0] ? s : best), undefined);
}

async function quizTemplate(kind: SiteKindId, year: Year): Promise<string | undefined> {
  const { QUIZ_PAGES, assembleQuiz } = await import("@anokoro/quiz");
  const candidates = QUIZ_PAGES.filter((p) => p.kind === kind && p.years[0] <= year);
  const page = candidates.reduce<(typeof candidates)[number] | undefined>(
    (best, p) => (best === undefined || p.years[0] > best.years[0] ? p : best),
    undefined,
  );
  return page && assembleQuiz(page).source;
}

/**
 * その種類と年らしいサイトのページ。
 * 見本サイトがない年は、時代まちがいさがしのお題（仕掛けなし）のうち、その年までに始まったいちばん新しいものを 1 ページにする
 */
export async function loadTemplatePages(
  kind: SiteKindId,
  year: Year,
): Promise<readonly SitePage[]> {
  const sample = templateSample(kind, year);
  if (sample) return sample.loadPages();
  const html = (await quizTemplate(kind, year)) ?? BLANK;
  return [{ path: INDEX_PAGE, html }];
}

/** 「テンプレートに戻す」で入れるページ。同じパスのページがなければ最初のページ */
export function templatePageHtml(pages: readonly SitePage[], path: string): string {
  return (pages.find((p) => p.path === path) ?? pages[0])?.html ?? BLANK;
}

export function kindTopic(kind: SiteKindId): TopicId {
  return SITE_KINDS[kind].topic;
}

export { BLANK };
