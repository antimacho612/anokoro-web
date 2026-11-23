import { readFileSync } from "node:fs";
import type { HtmlTagDescriptor, Plugin } from "vite-plus";
import { toDataUri } from "./data-uri.ts";

const SITE_ICON_FILE = new URL("./svg/site-icon.svg", import.meta.url);

/** favicon の link 要素。タスクバーと同じサイトのアイコンを data URI で埋め込む */
export function faviconTags(): HtmlTagDescriptor[] {
  const svg = readFileSync(SITE_ICON_FILE, "utf8");
  return [
    {
      tag: "link",
      attrs: { rel: "icon", type: "image/svg+xml", href: toDataUri(svg) },
      injectTo: "head",
    },
  ];
}

export function siteFavicon(): Plugin {
  return { name: "anokoro-site-favicon", transformIndexHtml: faviconTags };
}
