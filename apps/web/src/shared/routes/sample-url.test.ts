import { expect, test } from "vite-plus/test";
import { sampleUrl } from "./sample-url.ts";

test("見本サイトの URL", () => {
  expect(sampleUrl("/anokoro-web/", "blog")).toBe("/anokoro-web/view/?sample=blog");
});
