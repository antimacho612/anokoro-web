import { z } from "zod";

const ULID_PATTERN = /^[0-9A-HJKMNP-TV-Z]{26}$/;

/** ULID（Crockford の base32 で 26 文字） */
export type SiteId = string & { readonly __brand: "SiteId" };

export function isSiteId(input: string): input is SiteId {
  return ULID_PATTERN.test(input);
}

export function parseSiteId(input: string): SiteId {
  if (!isSiteId(input)) throw new RangeError(`サイトの ID ではありません: ${input}`);
  return input;
}

export const siteIdSchema = z.custom<SiteId>(
  (value) => typeof value === "string" && isSiteId(value),
);
