import { describe, expect, it } from "vite-plus/test";
import { toDataUri } from "./data-uri.ts";
import { SITE_ICON } from "./manifest.ts";
import { faviconTags } from "./vite-plugin.ts";

describe("faviconTags", () => {
  it("タスクバーと同じサイトのアイコンを favicon として head に入れる", () => {
    expect(faviconTags()).toEqual([
      {
        tag: "link",
        attrs: { rel: "icon", type: "image/svg+xml", href: toDataUri(SITE_ICON.svg) },
        injectTo: "head",
      },
    ]);
  });
});
