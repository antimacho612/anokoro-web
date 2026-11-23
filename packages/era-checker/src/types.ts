import type { FeatureId, Year } from "@anokoro/era-data";

/**
 * 解説トピックの ID。
 * line: 回線事情 / browser: ブラウザ / screen: 画面と色 / html: HTML の書き方 / css: CSS の制約 /
 * js: JavaScript と Flash / image: 画像と素材 / culture: 個人サイト文化 / text: 文字コードと文字化け /
 * timeline: 年表 / corporate: 企業サイトと Flash / portal: ポータルと検索 / bbs: 掲示板文化 /
 * shop: ネット通販 / blog: ブログ
 */
export const TOPIC_IDS = [
  "line",
  "browser",
  "screen",
  "html",
  "css",
  "js",
  "image",
  "culture",
  "text",
  "timeline",
  "corporate",
  "portal",
  "bbs",
  "shop",
  "blog",
] as const;

export type TopicId = (typeof TOPIC_IDS)[number];

/** local: 即時表示 / net: 回線経由表示の準備 / publish: 保存用 */
export type Mode = "local" | "net" | "publish";

export interface CheckOptions {
  year: Year;
  mode: Mode;
  /** local と net で <!--COUNTER--> に入れる数 */
  counter?: number;
  /** 年に関係なく使えるものとして扱う機能。時代まちがいさがしで、答えの技術を表示モードに描くために使う */
  allowFeatures?: readonly FeatureId[];
}

export type WarningLevel = "future" | "note";

/** ソース上の位置（1 始まり） */
export interface SourceLocation {
  line: number;
  col: number;
}

export interface Warning {
  /** ルールの ID（例: 'css.border-radius'） */
  ruleId: string;
  level: WarningLevel;
  message: string;
  topic: TopicId;
  /** 同じ警告が出た回数 */
  count: number;
  /** 出た場所。メモ帳で該当行へ移動するために使う */
  locations: SourceLocation[];
}

/**
 * ページが読み込む素材。
 * net では、要素に付けた `data-anokoro-{img,bg,ctr,bgm}` 属性の値がこの配列の添字になる。
 * resolved は img と background では素材の URL、counter では表示する数字、bgm では表示する文言。
 */
export interface AssetRef {
  name: string;
  resolved: string;
  fakeBytes: number;
  kind: "img" | "background" | "bgm" | "counter";
}

export interface CheckResult {
  html: string;
  /** 未来の技術を先に、出た順に並べたもの */
  warnings: Warning[];
  /** 再現度（0 〜 100） */
  score: number;
  title: string;
  assets: AssetRef[];
}
