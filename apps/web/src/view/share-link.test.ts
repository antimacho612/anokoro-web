import { SHARE_URL_MAX_LENGTH, SHARE_URL_WARN_LENGTH } from "@anokoro/share-codec";
import { describe, expect, test } from "vite-plus/test";
import { buildShareLink } from "./share-link.ts";

const origin = "https://example.com";
const base = "/anokoro-web/";
const prefixLength = `${origin}${base}view/#s=`.length;

describe("buildShareLink", () => {
  test("閲覧画面の # 以降にデータを置く", () => {
    expect(buildShareLink({ origin, base, payload: "abc" })).toEqual({
      kind: "ok",
      url: "https://example.com/anokoro-web/view/#s=abc",
      length: prefixLength + 3,
      isLong: false,
    });
  });

  test("8,000 文字を超えると長いと知らせる", () => {
    const atLimit = "a".repeat(SHARE_URL_WARN_LENGTH - prefixLength);
    expect(buildShareLink({ origin, base, payload: atLimit })).toMatchObject({ isLong: false });
    expect(buildShareLink({ origin, base, payload: `${atLimit}a` })).toMatchObject({
      isLong: true,
    });
  });

  test("64KB を超えると URL を作らない", () => {
    const atLimit = "a".repeat(SHARE_URL_MAX_LENGTH - prefixLength);
    expect(buildShareLink({ origin, base, payload: atLimit })).toMatchObject({ kind: "ok" });
    expect(buildShareLink({ origin, base, payload: `${atLimit}a` })).toEqual({
      kind: "too-long",
      length: SHARE_URL_MAX_LENGTH + 1,
    });
  });
});
