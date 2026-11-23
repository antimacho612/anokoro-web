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
  /** この種類の解説トピックの ID */
  topic: string;
  sources: readonly Source[];
}

/** サイトの種類（第 1 段階の 6 種類） */
export const SITE_KINDS = {
  personal: {
    label: "個人ホームページ",
    availableFrom: 1995,
    topic: "culture",
    sources: [wikipediaJa("個人サイト")],
  },
  corporate: {
    label: "企業・お店の公式サイト",
    availableFrom: 1996,
    topic: "corporate",
    sources: [
      {
        title: "総務省: 平成27年版 情報通信白書 企業ホームページの普及",
        url: "https://www.soumu.go.jp/johotsusintokei/whitepaper/ja/h27/html/nc121220.html",
      },
    ],
  },
  portal: {
    label: "ディレクトリ型ポータル",
    availableFrom: 1996,
    endsAfter: 2005,
    topic: "portal",
    sources: [
      {
        title: "LINEヤフー: 沿革（Yahoo! JAPAN）",
        url: "https://www.lycorp.co.jp/ja/company/history/yahoo/",
      },
      {
        title: "ヤフー: 検索結果表示の刷新（2005年10月3日）",
        url: "https://www.lycorp.co.jp/news/archive/Y/ja/ja20051003_A.pdf",
      },
    ],
  },
  bbs: {
    label: "掲示板",
    availableFrom: 1996,
    topic: "bbs",
    sources: [
      {
        title: "INTERNET Watch: ホームページに掲示板を設置する方法（1999年6月21日）",
        url: "https://internet.watch.impress.co.jp/www/article/1999/0621/special.htm",
      },
      {
        title: "総務省: 令和元年版 情報通信白書 インターネット上のコミュニケーションの変遷",
        url: "https://www.soumu.go.jp/johotsusintokei/whitepaper/ja/r01/html/nd111120.html",
      },
    ],
  },
  shop: {
    label: "ネットショップ",
    availableFrom: 1999,
    topic: "shop",
    sources: [
      {
        title: "Wayback Machine: 楽天市場のトップページ（1999年4月27日）",
        url: "https://web.archive.org/web/19990427022639/http://www.rakuten.co.jp:80/",
      },
      {
        title: "ASCII: Yahoo!ショッピングの開設（1999年9月10日）",
        url: "https://ascii.jp/elem/000/000/305/305123/",
      },
    ],
  },
  blog: {
    label: "ブログ",
    availableFrom: 2003,
    topic: "blog",
    sources: [
      {
        title: "INTERNET Watch: ココログの開始（2003年12月2日）",
        url: "https://internet.watch.impress.co.jp/cda/news/2003/12/02/1331.html",
      },
      {
        title: "INTERNET Watch: livedoor Blog の正式開始（2003年12月19日）",
        url: "https://internet.watch.impress.co.jp/cda/news/2003/12/19/1575.html",
      },
    ],
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

export function isSiteKindId(value: unknown): value is SiteKindId {
  return typeof value === "string" && Object.hasOwn(SITE_KINDS, value);
}
