import { inRange, type SiteKindId, type Year } from "@anokoro/era-data";
import type { SitePage } from "@anokoro/shared";
import { BLANK, INDEX_PAGE } from "../../site/@x/sample.ts";
import { SAMPLE_SITES } from "./catalog.ts";
import type { SampleSite } from "./types.ts";

export function templateSample(kind: SiteKindId, year: Year): SampleSite | undefined {
  return SAMPLE_SITES.find((s) => s.genre === kind && inRange(year, s.years));
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

export function templatePageHtml(pages: readonly SitePage[], path: string): string {
  return (pages.find((p) => p.path === path) ?? pages[0])?.html ?? BLANK;
}
