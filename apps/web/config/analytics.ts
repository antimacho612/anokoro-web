import type { HtmlTagDescriptor, Plugin } from "vite-plus";

export const GOATCOUNTER_ENDPOINT = "https://anokoro.goatcounter.com/count";
export const GOATCOUNTER_SCRIPT = "https://gc.zgo.at/count.js";

export function analyticsTags(): HtmlTagDescriptor[] {
  return [
    {
      tag: "script",
      attrs: { "data-goatcounter": GOATCOUNTER_ENDPOINT, async: true, src: GOATCOUNTER_SCRIPT },
      injectTo: "head",
    },
  ];
}

/** 本番ビルドの各 HTML に GoatCounter の計測スクリプトを置く。開発中のアクセスは数えない。 */
export function analytics(): Plugin {
  return {
    name: "anokoro:analytics",
    apply: "build",
    transformIndexHtml: () => analyticsTags(),
  };
}
