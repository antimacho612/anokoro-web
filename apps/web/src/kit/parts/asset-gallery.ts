import { assetSize, assetsForYear, type AssetCategory, type AssetEntry } from "@anokoro/assets";
import { assetEraYears, type Year } from "@anokoro/era-data";

/** 素材集の素材をクリックしたときに入れる文字列。高精細向けの素材は半分の大きさで貼る */
export function assetSnippet(asset: AssetEntry): string {
  if (asset.category === "wallpaper") return ` background="${asset.name}"`;
  const size = assetSize(asset);
  if (!size) return `<img src="${asset.name}">`;
  if (asset.category === "line") {
    return `<img src="${asset.name}" width="${size.width}" height="${size.height}"><br>\n`;
  }
  if (asset.era === "retina") {
    return `<img src="${asset.name}" width="${size.width / 2}" height="${size.height / 2}">`;
  }
  return `<img src="${asset.name}">`;
}

export interface AssetGroup {
  category: AssetCategory;
  label: string;
  assets: readonly AssetEntry[];
}

const ASSET_CATEGORIES: readonly { category: AssetCategory; label: string }[] = [
  { category: "button", label: "ボタン" },
  { category: "banner", label: "バナー" },
  { category: "icon", label: "アイコン・マーク" },
  { category: "line", label: "ライン" },
  { category: "wallpaper", label: "壁紙" },
  { category: "photo", label: "写真の代わり" },
];

const eraStart = (asset: AssetEntry): number => assetEraYears(asset.era)?.[0] ?? 0;

/** 選んだ年の素材集を種類ごとに分け、新しい作風の素材から並べる */
export function assetGroups(year: Year): AssetGroup[] {
  const shown = assetsForYear(year);
  return ASSET_CATEGORIES.map(({ category, label }) => ({
    category,
    label,
    assets: shown
      .filter((asset) => asset.category === category)
      .toSorted((a, b) => eraStart(b) - eraStart(a)),
  })).filter((group) => group.assets.length > 0);
}

/** 素材の疑似バイト数を「6.1KB」の形で表す */
export function assetBytesLabel(asset: AssetEntry): string {
  return `${(asset.fakeBytes / 1024).toFixed(1)}KB`;
}
