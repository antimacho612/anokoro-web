import { validateSharedSite, type DecodeResult, type SharedSite } from "./shared-site.ts";

export const MAX_EXPANDED_BYTES = 2 * 1024 * 1024;
export const SHARE_URL_WARN_LENGTH = 8_000;
/** これより長い URL は作らず、ファイルでの共有を案内する */
export const SHARE_URL_MAX_LENGTH = 64 * 1024;

export const SHARE_HASH_PREFIX = "#s=";

function toBase64Url(bytes: Uint8Array): string {
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replaceAll("+", "-").replaceAll("/", "_").replace(/=+$/, "");
}

function fromBase64Url(text: string): Uint8Array<ArrayBuffer> | undefined {
  if (!/^[A-Za-z0-9_-]*$/.test(text)) return undefined;
  try {
    const binary = atob(text.replaceAll("-", "+").replaceAll("_", "/"));
    return Uint8Array.from(binary, (char) => char.charCodeAt(0));
  } catch {
    return undefined;
  }
}

async function readAll(stream: ReadableStream<Uint8Array>, limit: number): Promise<Uint8Array> {
  const reader = stream.getReader();
  const chunks: Uint8Array[] = [];
  let total = 0;
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    total += value.length;
    if (total > limit) {
      await reader.cancel();
      throw new RangeError("too large");
    }
    chunks.push(value);
  }
  const out = new Uint8Array(total);
  let offset = 0;
  for (const chunk of chunks) {
    out.set(chunk, offset);
    offset += chunk.length;
  }
  return out;
}

/** 書き込み側の失敗は読み出し側にも伝わるので、読み出し側だけで扱う */
function transform(
  stream: CompressionStream | DecompressionStream,
  bytes: Uint8Array<ArrayBuffer>,
): ReadableStream<Uint8Array> {
  const writer = stream.writable.getWriter();
  writer.write(bytes).catch(() => undefined);
  writer.close().catch(() => undefined);
  return stream.readable;
}

/** サイトを圧縮して、URL の `#s=` の後ろに置く文字列にする */
export async function encodeSharedSite(site: SharedSite): Promise<string> {
  const json = new TextEncoder().encode(JSON.stringify(site));
  const compressed = transform(new CompressionStream("deflate-raw"), json);
  return toBase64Url(await readAll(compressed, Number.POSITIVE_INFINITY));
}

/** `#s=` の後ろの文字列を展開して検証する。悪意ある入力として扱う */
export async function decodeSharedSite(payload: string): Promise<DecodeResult> {
  if (payload.length > SHARE_URL_MAX_LENGTH) return { ok: false, error: "too-large" };
  const bytes = fromBase64Url(payload);
  if (!bytes || bytes.length === 0) return { ok: false, error: "invalid" };
  let json: Uint8Array;
  try {
    const inflated = transform(new DecompressionStream("deflate-raw"), bytes);
    json = await readAll(inflated, MAX_EXPANDED_BYTES);
  } catch (error) {
    return { ok: false, error: error instanceof RangeError ? "too-large" : "invalid" };
  }
  return parseJsonBytes(json);
}

export function parseJsonBytes(bytes: Uint8Array): DecodeResult {
  try {
    const text = new TextDecoder("utf-8", { fatal: true }).decode(bytes);
    return validateSharedSite(JSON.parse(text));
  } catch {
    return { ok: false, error: "invalid" };
  }
}

/** URL のハッシュ（`#s=…`）から取り出す。共有のハッシュでなければ undefined */
export function payloadFromHash(hash: string): string | undefined {
  return hash.startsWith(SHARE_HASH_PREFIX) ? hash.slice(SHARE_HASH_PREFIX.length) : undefined;
}
