import { MAX_YEAR, type Source, type Year, type YearRange } from "./years.ts";

const wikipediaJa = (title: string): Source => ({
  title: `Wikipedia: ${title}`,
  url: `https://ja.wikipedia.org/wiki/${title}`,
});

export interface SiteKindEntry {
  label: string;
  /** よく見かけるようになった年 */
  availableFrom: Year;
  /** よく見かけた最後の年。ないものは対象の最終年まで続く */
  endsAfter?: Year;
  sources: readonly Source[];
}

/** サイトの種類（第 1 段階の 6 種類） */
export const SITE_KINDS = {
  personal: {
    label: "個人ホームページ",
    availableFrom: 1995,
    sources: [wikipediaJa("個人サイト")],
  },
  corporate: {
    label: "企業・お店の公式サイト",
    availableFrom: 1996,
    sources: [wikipediaJa("ウェブサイト")],
  },
  portal: {
    label: "ディレクトリ型ポータル",
    availableFrom: 1996,
    endsAfter: 2005,
    sources: [wikipediaJa("ポータルサイト"), wikipediaJa("ディレクトリ型検索エンジン")],
  },
  bbs: {
    label: "掲示板",
    availableFrom: 1996,
    sources: [wikipediaJa("電子掲示板")],
  },
  shop: {
    label: "ネットショップ",
    availableFrom: 1999,
    sources: [wikipediaJa("オンラインショップ")],
  },
  blog: {
    label: "ブログ",
    availableFrom: 2003,
    sources: [wikipediaJa("ブログ")],
  },
} as const satisfies Record<string, SiteKindEntry>;

export type SiteKindId = keyof typeof SITE_KINDS;

export const SITE_KIND_IDS: readonly SiteKindId[] = [
  "personal",
  "corporate",
  "portal",
  "bbs",
  "shop",
  "blog",
];

/** その種類がある年の範囲 */
export function siteKindYears(id: SiteKindId): YearRange {
  const kind: SiteKindEntry = SITE_KINDS[id];
  return [kind.availableFrom, kind.endsAfter ?? MAX_YEAR];
}
