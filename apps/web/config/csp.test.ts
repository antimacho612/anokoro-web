import { describe, expect, test } from "vite-plus/test";
import { APP_CSP, securityMetaTags } from "./csp.ts";

describe("securityMetaTags", () => {
  test("head の先頭に CSP と Referrer-Policy を置く", () => {
    expect(securityMetaTags()).toEqual([
      {
        tag: "meta",
        attrs: { "http-equiv": "Content-Security-Policy", content: APP_CSP },
        injectTo: "head-prepend",
      },
      {
        tag: "meta",
        attrs: { name: "referrer", content: "strict-origin-when-cross-origin" },
        injectTo: "head-prepend",
      },
    ]);
  });

  test("スクリプトは同じオリジンのファイルだけを許す", () => {
    expect(APP_CSP).toContain("script-src 'self';");
    expect(APP_CSP).not.toContain("unsafe-eval");
    expect(APP_CSP).toContain("base-uri 'none'");
  });
});
