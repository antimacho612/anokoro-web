import { describe, expect, test } from "vite-plus/test";
import { analyticsTags } from "./analytics.ts";

describe("analyticsTags", () => {
  test("GoatCounter のスクリプトを非同期で読み込み、送り先を属性で渡す", () => {
    expect(analyticsTags()).toEqual([
      {
        tag: "script",
        attrs: {
          "data-goatcounter": "https://anokoro.goatcounter.com/count",
          async: true,
          src: "https://gc.zgo.at/count.js",
        },
        injectTo: "head",
      },
    ]);
  });
});
