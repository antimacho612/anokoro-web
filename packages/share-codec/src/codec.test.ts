import { describe, expect, test } from "vite-plus/test";
import { fileNameFor, parseFileBytes, toFileText } from "./file-codec.ts";
import type { SharedSite } from "./shared-site.ts";
import {
  MAX_EXPANDED_BYTES,
  decodeSharedSite,
  encodeSharedSite,
  payloadFromHash,
} from "./url-codec.ts";

const site: SharedSite = {
  kind: "anokoro-site",
  v: 1,
  name: "☆★たろうのお部屋★☆",
  year: 2001,
  genre: "personal",
  category: "diary",
  pages: [
    {
      path: "index.html",
      html: '<html><body>ようこそ！<a href="diary.html">日記</a></body></html>',
    },
    { path: "diary.html", html: "<html><body>きょうは🍙をたべた</body></html>" },
  ],
};

async function compress(text: string): Promise<string> {
  const stream = new Blob([text]).stream().pipeThrough(new CompressionStream("deflate-raw"));
  const bytes = new Uint8Array(await new Response(stream).arrayBuffer());
  let binary = "";
  for (const b of bytes) binary += String.fromCharCode(b);
  return btoa(binary).replaceAll("+", "-").replaceAll("/", "_").replace(/=+$/, "");
}

describe("URL の符号化", () => {
  test("往復で一致する", async () => {
    const payload = await encodeSharedSite(site);
    expect(payload).toMatch(/^[A-Za-z0-9_-]+$/);
    expect(await decodeSharedSite(payload)).toEqual({ ok: true, site });
  });

  test("未知の種類とカテゴリは既定に読み替える", async () => {
    const payload = await compress(JSON.stringify({ ...site, genre: "sns", category: "x" }));
    const result = await decodeSharedSite(payload);
    expect(result.ok && result.site.genre).toBe("personal");
    expect(result.ok && result.site.category).toBe("other");
  });

  test.each([
    ["空", ""],
    ["base64url でない文字", "abc+/="],
    ["deflate でない", "AAAAAAAA"],
  ])("壊れた入力（%s）を拒む", async (_, payload) => {
    expect(await decodeSharedSite(payload)).toEqual({ ok: false, error: "invalid" });
  });

  test("JSON でない、形式が違う入力を拒む", async () => {
    expect(await decodeSharedSite(await compress("not json"))).toEqual({
      ok: false,
      error: "invalid",
    });
    expect(await decodeSharedSite(await compress(JSON.stringify({ ...site, kind: "x" })))).toEqual({
      ok: false,
      error: "invalid",
    });
    expect(await decodeSharedSite(await compress(JSON.stringify({ ...site, pages: [] })))).toEqual({
      ok: false,
      error: "invalid",
    });
    expect(
      await decodeSharedSite(
        await compress(JSON.stringify({ ...site, pages: [{ path: "../x.html", html: "" }] })),
      ),
    ).toEqual({ ok: false, error: "invalid" });
  });

  test("未知の版は区別して返す", async () => {
    expect(await decodeSharedSite(await compress(JSON.stringify({ ...site, v: 2 })))).toEqual({
      ok: false,
      error: "unknown-version",
    });
  });

  test("展開後に 2MB を超える入力（圧縮爆弾）を拒む", async () => {
    const bomb = JSON.stringify({ ...site, pad: "a".repeat(MAX_EXPANDED_BYTES + 1) });
    const payload = await compress(bomb);
    expect(payload.length).toBeLessThan(10_000);
    expect(await decodeSharedSite(payload)).toEqual({ ok: false, error: "too-large" });
  });

  test("長すぎる URL は展開する前に拒む", async () => {
    expect(await decodeSharedSite("A".repeat(64 * 1024 + 1))).toEqual({
      ok: false,
      error: "too-large",
    });
  });

  test("ハッシュから取り出す", () => {
    expect(payloadFromHash("#s=abc")).toBe("abc");
    expect(payloadFromHash("#x=abc")).toBeUndefined();
    expect(payloadFromHash("")).toBeUndefined();
  });
});

describe("ファイル", () => {
  const bytes = (text: string) => new TextEncoder().encode(text);

  test("往復で一致する", () => {
    expect(parseFileBytes(bytes(toFileText(site)))).toEqual({ ok: true, site });
  });

  test("壊れた、大きすぎる、新しい版のファイルを拒む", () => {
    expect(parseFileBytes(bytes("{"))).toEqual({ ok: false, error: "invalid" });
    expect(parseFileBytes(new Uint8Array([0xff, 0xfe]))).toEqual({ ok: false, error: "invalid" });
    expect(parseFileBytes(new Uint8Array(MAX_EXPANDED_BYTES + 1))).toEqual({
      ok: false,
      error: "too-large",
    });
    expect(parseFileBytes(bytes(JSON.stringify({ ...site, v: 3 })))).toEqual({
      ok: false,
      error: "unknown-version",
    });
  });

  test("ファイル名に使えない文字を置き換える", () => {
    expect(fileNameFor('たろう/の:お部屋\\"\t')).toBe("たろう_の_お部屋___.anokoro.json");
    expect(fileNameFor("..")).toBe("mysite.anokoro.json");
  });
});
