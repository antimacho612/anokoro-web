import { findAsset } from "@anokoro/assets";
import { checkEra } from "@anokoro/era-checker";
import type { Year } from "@anokoro/era-data";
import { siteBytes, type SitePage } from "@anokoro/shared";

const CACHE_LIMIT = 100;
const imageCache = new Map<string, readonly string[]>();

function imageNames(html: string, year: Year): readonly string[] {
  const cached = imageCache.get(html);
  if (cached) return cached;
  const names = checkEra(html, { year, mode: "local" })
    .assets.filter((a) => a.kind === "img" || a.kind === "background")
    .map((a) => a.name);
  if (imageCache.size >= CACHE_LIMIT) imageCache.clear();
  imageCache.set(html, names);
  return names;
}

/** サイトが使う容量。全ページの HTML と、ページが読み込む素材の疑似バイト数。同じ素材は 1 回だけ数える */
export function siteUsageBytes(pages: readonly SitePage[], year: Year): number {
  const assets = new Map<string, number>();
  for (const page of pages) {
    for (const name of imageNames(page.html, year)) {
      const asset = findAsset(name);
      if (asset) assets.set(asset.name, asset.fakeBytes);
    }
  }
  return [...assets.values()].reduce((sum, bytes) => sum + bytes, siteBytes(pages));
}
