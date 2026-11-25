import type { HtmlTagDescriptor, Plugin } from "vite-plus";
import { GOATCOUNTER_ENDPOINT, GOATCOUNTER_SCRIPT } from "./analytics.ts";

const ANALYTICS_SCRIPT_ORIGIN = new URL(GOATCOUNTER_SCRIPT).origin;
const ANALYTICS_ENDPOINT_ORIGIN = new URL(GOATCOUNTER_ENDPOINT).origin;

/**
 * GitHub Pages ではレスポンスヘッダーを付けられないため、`meta` 要素で CSP を指定する。
 * `meta` の CSP では `frame-ancestors` が効かない（https://www.w3.org/TR/CSP3/#meta-element）
 * GoatCounter はスクリプトの配信元と、計測の送り先（`img` か `sendBeacon`）を許可する必要がある
 * （https://www.goatcounter.com/help/csp）
 */
export const APP_CSP = [
  "default-src 'self'",
  `script-src 'self' ${ANALYTICS_SCRIPT_ORIGIN}`,
  "style-src 'self' 'unsafe-inline'",
  `img-src 'self' data: blob: ${ANALYTICS_ENDPOINT_ORIGIN}`,
  "media-src 'self' blob:",
  `connect-src 'self' ${ANALYTICS_ENDPOINT_ORIGIN}`,
  "frame-src 'self'",
  "base-uri 'none'",
  "form-action 'self'",
].join("; ");

export const APP_REFERRER_POLICY = "strict-origin-when-cross-origin";

export function securityMetaTags(): HtmlTagDescriptor[] {
  return [
    {
      tag: "meta",
      attrs: { "http-equiv": "Content-Security-Policy", content: APP_CSP },
      injectTo: "head-prepend",
    },
    {
      tag: "meta",
      attrs: { name: "referrer", content: APP_REFERRER_POLICY },
      injectTo: "head-prepend",
    },
  ];
}

/**
 * 本番ビルドの各 HTML の `head` の先頭に CSP と Referrer-Policy の `meta` を置く。
 * 開発サーバーは React Fast Refresh のインラインスクリプトを使うため、ビルドだけに適用する
 * （https://vite.dev/guide/features#content-security-policy-csp）
 */
export function securityMeta(): Plugin {
  return {
    name: "anokoro:security-meta",
    apply: "build",
    transformIndexHtml: () => securityMetaTags(),
  };
}
