import { MAX_YEAR, MIN_YEAR, isSiteKindId, type SiteKindId } from "@anokoro/era-data";
import { z } from "zod";

/** ページのファイル名。サイト内リンクの解決とファイル名の衝突を単純にするため、小文字の英数字に限る */
export const PAGE_PATH_PATTERN = /^[a-z0-9_-]{1,32}\.html$/;
export const MAX_PAGE_BYTES = 100 * 1024;
export const MAX_PAGES = 50;
export const MAX_SITE_BYTES = 1024 * 1024;
export const MAX_SITE_NAME_LENGTH = 64;

export const SITE_CATEGORIES = {
  diary: "日記",
  illust: "イラスト",
  game: "ゲーム",
  music: "音楽",
  hobby: "趣味",
  pet: "ペット",
  travel: "旅行",
  novel: "小説・創作",
  life: "暮らし",
  other: "その他",
} as const;

export type SiteCategoryId = keyof typeof SITE_CATEGORIES;

export const SITE_CATEGORY_IDS = Object.keys(SITE_CATEGORIES) as SiteCategoryId[];

export function isSiteCategoryId(value: unknown): value is SiteCategoryId {
  return typeof value === "string" && Object.hasOwn(SITE_CATEGORIES, value);
}

export interface SitePage {
  path: string;
  html: string;
}

const encoder = new TextEncoder();

export function utf8Bytes(text: string): number {
  return encoder.encode(text).length;
}

export function siteBytes(pages: readonly SitePage[]): number {
  return pages.reduce((sum, page) => sum + utf8Bytes(page.html), 0);
}

export const yearSchema = z.number().int().min(MIN_YEAR).max(MAX_YEAR);

export const siteNameSchema = z.string().trim().min(1).max(MAX_SITE_NAME_LENGTH);

export const pagePathSchema = z.string().regex(PAGE_PATH_PATTERN);

/** 未知の種類は個人ホームページとして読む */
export const genreSchema = z
  .string()
  .transform((value): SiteKindId => (isSiteKindId(value) ? value : "personal"));

/** 未知のカテゴリは「その他」として読む */
export const categorySchema = z
  .string()
  .transform((value): SiteCategoryId => (isSiteCategoryId(value) ? value : "other"));

const pageSchema = z.object({
  path: pagePathSchema,
  html: z.string().refine((html) => utf8Bytes(html) <= MAX_PAGE_BYTES, {
    message: "1 ページは 100KB までです",
  }),
});

export const sitePagesSchema = z
  .array(pageSchema)
  .min(1)
  .max(MAX_PAGES)
  .refine((pages) => new Set(pages.map((p) => p.path)).size === pages.length, {
    message: "同じ名前のページがあります",
  })
  .refine((pages) => siteBytes(pages) <= MAX_SITE_BYTES, {
    message: "サイト全体で 1MB までです",
  });
