import type { SiteKindId, Year } from "@anokoro/era-data";
import type { SharedSite } from "@anokoro/share-codec";
import { MAX_PAGES, PAGE_PATH_PATTERN, type SiteCategoryId, type SitePage } from "@anokoro/shared";
import type { LocalPage, LocalSite } from "@anokoro/site-store";

export const INDEX_PAGE = "index.html";
export const INITIAL_COUNTER = 774;

export interface NewSiteInput {
  id: string;
  name: string;
  year: Year;
  genre: SiteKindId;
  category: SiteCategoryId;
  pages: readonly SitePage[];
  counter?: number;
  now: number;
}

export function createSite({
  id,
  name,
  year,
  genre,
  category,
  pages,
  counter = INITIAL_COUNTER,
  now,
}: NewSiteInput): LocalSite {
  return {
    id,
    name,
    year,
    genre,
    category,
    pages: pages.map((p) => ({ path: p.path, html: p.html, updatedAt: now })),
    counter,
    createdAt: now,
    updatedAt: now,
  };
}

export function findPage(site: LocalSite, path: string): LocalPage | undefined {
  return site.pages.find((p) => p.path === path);
}

/** 最初に開くページ。index.html がなければ先頭のページ */
export function homePath(site: LocalSite): string {
  return findPage(site, INDEX_PAGE)?.path ?? site.pages[0]?.path ?? INDEX_PAGE;
}

export function updatePageHtml(
  site: LocalSite,
  path: string,
  html: string,
  now: number,
): LocalSite {
  const page = findPage(site, path);
  if (!page || page.html === html) return site;
  return {
    ...site,
    pages: site.pages.map((p) => (p.path === path ? { ...p, html, updatedAt: now } : p)),
    updatedAt: now,
  };
}

/** ページ名として使えない理由。使えるなら null */
export function pagePathProblem(site: LocalSite, path: string, except?: string): string | null {
  if (!PAGE_PATH_PATTERN.test(path)) {
    return "ファイル名は半角の小文字、数字、- と _ で 32 文字まで、最後に .html を付けてください。";
  }
  if (path !== except && findPage(site, path)) return `${path} はもうあります。`;
  return null;
}

/** 入力したページ名を整える。拡張子がなければ .html を付ける */
export function normalizePagePath(input: string): string {
  const trimmed = input.trim().toLowerCase();
  return trimmed.endsWith(".html") ? trimmed : `${trimmed}.html`;
}

/** 新しいページの名前の候補（page1.html、page2.html…） */
export function nextPagePath(site: LocalSite): string {
  for (let n = 1; ; n++) {
    const path = `page${n}.html`;
    if (!findPage(site, path)) return path;
  }
}

/** 新しく足したページの中身 */
export function newPageHtml(path: string): string {
  return `<html>
<head>
<title>${path.replace(/\.html$/, "")}</title>
</head>
<body>

<a href="index.html">トップへ戻る</a>
</body>
</html>`;
}

export function canAddPage(site: LocalSite): boolean {
  return site.pages.length < MAX_PAGES;
}

export function addPage(site: LocalSite, path: string, html: string, now: number): LocalSite {
  return {
    ...site,
    pages: [...site.pages, { path, html, updatedAt: now }],
    updatedAt: now,
  };
}

export function renamePage(site: LocalSite, from: string, to: string, now: number): LocalSite {
  return {
    ...site,
    pages: site.pages.map((p) => (p.path === from ? { ...p, path: to, updatedAt: now } : p)),
    updatedAt: now,
  };
}

/** 最後の 1 ページは消せない */
export function deletePage(site: LocalSite, path: string, now: number): LocalSite {
  if (site.pages.length <= 1) return site;
  return { ...site, pages: site.pages.filter((p) => p.path !== path), updatedAt: now };
}

export function toShared(site: LocalSite): SharedSite {
  return {
    kind: "anokoro-site",
    v: 1,
    name: site.name,
    year: site.year,
    genre: site.genre,
    category: site.category,
    pages: site.pages.map(({ path, html }) => ({ path, html })),
  };
}

export function fromShared(shared: SharedSite, id: string, now: number): LocalSite {
  return createSite({ ...shared, id, now });
}

/** 取り込むサイトと同じものがすでにあるか。名前で見分ける */
export function findSameSite(
  sites: readonly LocalSite[],
  shared: SharedSite,
): LocalSite | undefined {
  return sites.find((s) => s.name === shared.name);
}

/** 上書きで取り込む。id、作成日時、カウンター、書き出し日時は残す */
export function overwriteWithShared(site: LocalSite, shared: SharedSite, now: number): LocalSite {
  return {
    ...createSite({ ...shared, id: site.id, counter: site.counter, now }),
    createdAt: site.createdAt,
    ...(site.lastExportedAt === undefined ? {} : { lastExportedAt: site.lastExportedAt }),
  };
}

/** 書き出しをすすめるまでの日数 */
export const EXPORT_REMINDER_DAYS = 7;
const DAY_MS = 24 * 60 * 60 * 1000;

/** ファイルへの保存をすすめるか。書き出したことがなければ作成日から数える */
export function needsExportReminder(site: LocalSite, now: number): boolean {
  const since = site.lastExportedAt ?? site.createdAt;
  return now - since >= EXPORT_REMINDER_DAYS * DAY_MS;
}
