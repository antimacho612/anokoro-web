/**
 * 解説トピックの ID。
 * line: 回線事情 / browser: ブラウザ / screen: 画面と色 / html: HTML の書き方 / css: CSS の制約 /
 * js: JavaScript と Flash / image: 画像と素材 / culture: 個人サイト文化 / text: 文字コードと文字化け /
 * timeline: 年表 / corporate: 企業サイトと Flash / portal: ポータルと検索 / bbs: 掲示板文化 /
 * shop: ネット通販 / blog: ブログ / mobile: ケータイとスマホ / media: 音と動画 / tools: 作り方の道具 /
 * textsite: テキストサイト
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
  "mobile",
  "media",
  "tools",
  "textsite",
] as const;

export type TopicId = (typeof TOPIC_IDS)[number];
