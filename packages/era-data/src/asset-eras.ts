import { FEATURES, type FeatureId } from "./features.ts";
import { SITE_KINDS, siteKindYears, type SiteKindId } from "./site-kinds.ts";
import { MAX_YEAR, type Source, type Year, type YearRange } from "./years.ts";

/**
 * 素材の作風が、いつから似合うか。
 * since: 年を直接持つ / feature: 機能年表の行に従う / siteKind: サイトの種類の年に従う
 */
export type AssetEraEntry = { label: string } & (
  | { kind: "since"; from: Year; sources: readonly [Source, ...Source[]] }
  | { kind: "feature"; feature: FeatureId }
  | { kind: "siteKind"; siteKind: SiteKindId }
);

export const ASSET_ERAS = {
  gif: { label: "GIF と JPEG の画像", kind: "feature", feature: "html.basic" },
  "gif-animation": {
    label: "GIF アニメ",
    kind: "since",
    from: 1996,
    sources: [
      {
        title: "INTERNET Watch（1996年1月30日）GIFアニメーション",
        url: "https://internet.watch.impress.co.jp/www/search/article/9601/3004.htm",
      },
    ],
  },
  portal: { label: "ディレクトリ型ポータルの飾り", kind: "siteKind", siteKind: "portal" },
  corporate: { label: "企業サイトの部品", kind: "siteKind", siteKind: "corporate" },
  bbs: { label: "掲示板の部品", kind: "siteKind", siteKind: "bbs" },
  shop: { label: "ネットショップの部品", kind: "siteKind", siteKind: "shop" },
  blog: { label: "ブログの部品", kind: "siteKind", siteKind: "blog" },
  web2: {
    label: "Web 2.0 のころの作風",
    kind: "since",
    from: 2005,
    sources: [
      {
        title: "総務省: 令和元年版 情報通信白書 第1部第1章第1節",
        url: "https://www.soumu.go.jp/johotsusintokei/whitepaper/ja/r01/pdf/n1100000.pdf",
      },
    ],
  },
  "png-alpha": { label: "半透明の PNG", kind: "feature", feature: "css.png-alpha" },
  retina: {
    label: "高精細な画面向けの 2 倍の画像",
    kind: "since",
    from: 2010,
    sources: [
      {
        title: "Apple（2010年6月7日）iPhone 4の発表",
        url: "https://www.apple.com/jp/newsroom/2010/06/07Apple-Presents-iPhone-4/",
      },
    ],
  },
} as const satisfies Record<string, AssetEraEntry>;

export type AssetEraId = keyof typeof ASSET_ERAS;

/** その作風が似合う年の範囲。機能年表でまだ使えない機能に従うものは undefined */
export function assetEraYears(id: AssetEraId): YearRange | undefined {
  const era: AssetEraEntry = ASSET_ERAS[id];
  switch (era.kind) {
    case "since":
      return [era.from, MAX_YEAR];
    case "feature": {
      const from = FEATURES[era.feature].availableFrom;
      return from === null ? undefined : [from, MAX_YEAR];
    }
    case "siteKind":
      return siteKindYears(era.siteKind);
    default: {
      const _exhaustive: never = era;
      return _exhaustive;
    }
  }
}

/** その作風の根拠 */
export function assetEraSources(id: AssetEraId): readonly Source[] {
  const era: AssetEraEntry = ASSET_ERAS[id];
  switch (era.kind) {
    case "since":
      return era.sources;
    case "feature":
      return FEATURES[era.feature].sources;
    case "siteKind":
      return SITE_KINDS[era.siteKind].sources;
    default: {
      const _exhaustive: never = era;
      return _exhaustive;
    }
  }
}
