export const REPOSITORY_URL = "https://github.com/antimacho612/anokoro-web";
export const DISCUSSIONS_URL = `${REPOSITORY_URL}/discussions`;

export type IssueTemplate = "era-accuracy" | "bug" | "feature";

export const SCREEN_LABELS = {
  kit: "作成キット",
  quiz: "時代まちがいさがし",
  view: "サイトの表示",
} as const;

export type Screen = keyof typeof SCREEN_LABELS;

/**
 * Issue フォームの入力欄は、欄の `id` をクエリに付けると初期値を入れられる
 * （https://docs.github.com/en/issues/tracking-your-work-with-issues/using-issues/creating-an-issue#creating-an-issue-from-a-url-query）
 */
export function newIssueUrl(
  template: IssueTemplate,
  context: { year: number; screen: Screen },
): string {
  const params = new URLSearchParams({
    template: `${template}.yml`,
    year: String(context.year),
    screen: SCREEN_LABELS[context.screen],
  });
  return `${REPOSITORY_URL}/issues/new?${params}`;
}
