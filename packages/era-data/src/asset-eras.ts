import { eraRefSources, eraRefYears, type EraRef } from "./era-refs.ts";
import type { Source, YearRange } from "./years.ts";

/** 素材の作風が、いつから似合うか */
export type AssetEraEntry = { label: string } & EraRef;

export const ASSET_ERAS = {
  gif: { label: "GIF と JPEG の画像", kind: "feature", feature: "html.basic" },
  "gif-animation": { label: "GIF アニメ", kind: "trend", trend: "gif-animation" },
  portal: { label: "ディレクトリ型ポータルの飾り", kind: "siteKind", siteKind: "portal" },
  corporate: { label: "企業サイトの部品", kind: "siteKind", siteKind: "corporate" },
  bbs: { label: "掲示板の部品", kind: "siteKind", siteKind: "bbs" },
  shop: { label: "ネットショップの部品", kind: "siteKind", siteKind: "shop" },
  blog: { label: "ブログの部品", kind: "siteKind", siteKind: "blog" },
  web2: { label: "Web 2.0 のころの作風", kind: "trend", trend: "web2" },
  "png-alpha": { label: "半透明の PNG", kind: "feature", feature: "css.png-alpha" },
  retina: { label: "高精細な画面向けの 2 倍の画像", kind: "trend", trend: "retina" },
} as const satisfies Record<string, AssetEraEntry>;

export type AssetEraId = keyof typeof ASSET_ERAS;

/** その作風が似合う年の範囲。機能年表でまだ使えない機能に従うものは undefined */
export function assetEraYears(id: AssetEraId): YearRange | undefined {
  return eraRefYears(ASSET_ERAS[id]);
}

/** その作風の根拠 */
export function assetEraSources(id: AssetEraId): readonly Source[] {
  return eraRefSources(ASSET_ERAS[id]);
}
