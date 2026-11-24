import { assetEraYears, inRange, type Year } from "@anokoro/era-data";
import { ASSETS, type AssetEntry } from "./manifest.ts";

export interface AssetSize {
  width: number;
  height: number;
}

/** 選んだ年の素材集に並ぶ素材。作風がまだない年には出さない */
export function assetsForYear(year: Year): readonly AssetEntry[] {
  return ASSETS.filter((asset) => {
    const years = assetEraYears(asset.era);
    return years !== undefined && inRange(year, years);
  });
}

/** svg 要素の width と height。どちらかがなければ undefined */
export function assetSize(asset: AssetEntry): AssetSize | undefined {
  const root = /^<svg\b[^>]*>/.exec(asset.svg.trim())?.[0] ?? "";
  const width = Number(/\swidth="(\d+)"/.exec(root)?.[1]);
  const height = Number(/\sheight="(\d+)"/.exec(root)?.[1]);
  return width > 0 && height > 0 ? { width, height } : undefined;
}
