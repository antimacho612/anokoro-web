import { describe, expect, it } from "vite-plus/test";
import { resolveBase } from "./base.ts";

describe("resolveBase", () => {
  it("未指定や空文字なら / を返す", () => {
    expect(resolveBase(undefined)).toBe("/");
    expect(resolveBase("")).toBe("/");
    expect(resolveBase("  ")).toBe("/");
    expect(resolveBase("/")).toBe("/");
  });

  it("前後のスラッシュを補う", () => {
    expect(resolveBase("anokoro-web")).toBe("/anokoro-web/");
    expect(resolveBase("/anokoro-web")).toBe("/anokoro-web/");
    expect(resolveBase("anokoro-web/")).toBe("/anokoro-web/");
    expect(resolveBase("//anokoro-web//")).toBe("/anokoro-web/");
  });

  it("絶対 URL は末尾のスラッシュだけ補う", () => {
    expect(resolveBase("https://example.com/app")).toBe("https://example.com/app/");
  });
});
