import type { SiteKindId, Year } from "@anokoro/era-data";
import {
  categorySchema,
  genreSchema,
  siteNameSchema,
  sitePagesSchema,
  yearSchema,
  type SiteCategoryId,
  type SitePage,
} from "@anokoro/shared";
import { z } from "zod";

export const SHARED_KIND = "anokoro-site";
export const SHARED_VERSION = 1;

/** URL とファイルで共有するサイト一式 */
export interface SharedSite {
  kind: typeof SHARED_KIND;
  v: typeof SHARED_VERSION;
  name: string;
  year: Year;
  genre: SiteKindId;
  category: SiteCategoryId;
  pages: SitePage[];
}

export const sharedSiteSchema = z.object({
  kind: z.literal(SHARED_KIND),
  v: z.literal(SHARED_VERSION),
  name: siteNameSchema,
  year: yearSchema,
  genre: genreSchema,
  category: categorySchema,
  pages: sitePagesSchema,
}) satisfies z.ZodType<SharedSite, unknown>;

/** 形式の目印だけを見る。版の違いを「壊れている」と区別するため */
const envelopeSchema = z.object({ kind: z.literal(SHARED_KIND), v: z.unknown() });

export type DecodeError =
  /** 形式が違う、壊れている */
  | "invalid"
  /** 大きすぎる */
  | "too-large"
  /** 新しい版で作られた */
  | "unknown-version";

export type DecodeResult = { ok: true; site: SharedSite } | { ok: false; error: DecodeError };

export function validateSharedSite(value: unknown): DecodeResult {
  const envelope = envelopeSchema.safeParse(value);
  if (!envelope.success) return { ok: false, error: "invalid" };
  if (envelope.data.v !== SHARED_VERSION) return { ok: false, error: "unknown-version" };
  const result = sharedSiteSchema.safeParse(value);
  return result.success ? { ok: true, site: result.data } : { ok: false, error: "invalid" };
}

export const DECODE_ERROR_MESSAGES: Record<DecodeError, string> = {
  invalid: "サイトのデータが壊れているか、形式が違います。",
  "too-large": "サイトのデータが大きすぎるため開けません。",
  "unknown-version": "新しい版で作られたサイトです。",
};
