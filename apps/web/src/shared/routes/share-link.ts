import {
  SHARE_HASH_PREFIX,
  SHARE_URL_MAX_LENGTH,
  SHARE_URL_WARN_LENGTH,
} from "@anokoro/share-codec";

export type ShareLink =
  | { kind: "ok"; url: string; length: number; isLong: boolean }
  | { kind: "too-long"; length: number };

export interface ShareLinkInput {
  /** 例: https://example.com */
  origin: string;
  /** 例: /anokoro-web/ */
  base: string;
  payload: string;
}

/** 圧縮済みのサイトから共有用の URL を作る。長すぎるときは URL を作らない */
export function buildShareLink({ origin, base, payload }: ShareLinkInput): ShareLink {
  const url = `${origin}${base}view/${SHARE_HASH_PREFIX}${payload}`;
  if (url.length > SHARE_URL_MAX_LENGTH) return { kind: "too-long", length: url.length };
  return { kind: "ok", url, length: url.length, isLong: url.length > SHARE_URL_WARN_LENGTH };
}
