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

  test("スクリプトは同じオリジンと GoatCounter の配信元のファイルだけを許す", () => {
    expect(APP_CSP).toContain("script-src 'self' https://gc.zgo.at;");
    expect(APP_CSP).not.toContain("unsafe-eval");
    expect(APP_CSP).toContain("base-uri 'none'");
  });

  test("計測の送り先は GoatCounter のサイトだけを許す", () => {
    expect(APP_CSP).toContain("connect-src 'self' https://anokoro.goatcounter.com;");
    expect(APP_CSP).toContain("img-src 'self' data: blob: https://anokoro.goatcounter.com;");
  });
});
