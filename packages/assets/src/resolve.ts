import { ASSETS, type AssetEntry } from "./manifest.ts";

const byName = new Map(ASSETS.map((asset) => [asset.name, asset]));

/** パスの末尾のファイル名を小文字で取り出す（`img/KOJI.GIF` → `koji.gif`） */
export function assetBaseName(ref: string): string {
  return (ref.trim().split(/[/\\]/).pop() ?? "").toLowerCase();
}

/** ページに書かれたファイル名から素材を探す。見つからなければ undefined */
export function findAsset(ref: string): AssetEntry | undefined {
  return byName.get(assetBaseName(ref));
}
