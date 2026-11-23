import type { DecodeResult, SharedSite } from "./shared-site.ts";
import { MAX_EXPANDED_BYTES, parseJsonBytes } from "./url-codec.ts";

export const FILE_SUFFIX = ".anokoro.json";

/** ファイルに書く中身。人が読めるように圧縮せず、字下げする */
export function toFileText(site: SharedSite): string {
  return `${JSON.stringify(site, null, 2)}\n`;
}

/** ファイルの中身を検証する。悪意ある入力として扱う */
export function parseFileBytes(bytes: Uint8Array): DecodeResult {
  if (bytes.length > MAX_EXPANDED_BYTES) return { ok: false, error: "too-large" };
  return parseJsonBytes(bytes);
}

const FORBIDDEN_IN_FILE_NAME = new Set(["\\", "/", ":", "*", "?", '"', "<", ">", "|"]);

function isSafeFileNameChar(char: string): boolean {
  return !FORBIDDEN_IN_FILE_NAME.has(char) && char.charCodeAt(0) >= 0x20;
}

/** OS のファイル名に使えない文字を置き換える */
export function fileNameFor(siteName: string): string {
  const replaced = Array.from(siteName, (char) => (isSafeFileNameChar(char) ? char : "_")).join("");
  const safe = replaced.trim().replace(/^\.+/, "");
  return `${safe || "mysite"}${FILE_SUFFIX}`;
}
