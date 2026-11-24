import type { SampleSite } from "./types.ts";

/** 見本サイト。種類ごとに作った年の順に並べる */
export const SAMPLE_SITES: readonly SampleSite[] = [
  {
    id: "hogeta",
    name: "ほげ太のホームページ",
    years: [1995, 1996],
    genre: "personal",
    category: "hobby",
    description: "灰色の背景に見出しと箇条書き。大学の計算機から公開した、はじまりのころのページ",
    loadPages: () => import("./personal-1995.ts").then((m) => m.pages),
  },
  {
    id: "masayan",
    name: "★まさやんのゲーム部屋★",
    years: [1997, 1998],
    genre: "personal",
    category: "game",
    description: "GIF アニメ、流れる文字、カウンター。黒い壁紙に黄色いリンクのゲームサイト",
    loadPages: () => import("./personal-1997.ts").then((m) => m.pages),
  },
  {
    id: "personal",
    name: "☆ねこまるの部屋☆",
    years: [1999, 2002],
    genre: "personal",
    category: "diary",
    description: "キリ番、掲示板、100の質問、BGM。テレホーダイ時代の個人ホームページ",
    loadPages: () => import("./personal-1999.ts").then((m) => m.pages),
  },
  {
    id: "taro",
    name: "☆★たろうのお部屋★☆",
    years: [2003, 2007],
    genre: "personal",
    category: "diary",
    description: "レンタル掲示板、日記ランキング、素材のお礼。作成キットで最初に開くページ",
    loadPages: () => import("./personal-2003.ts").then((m) => m.pages),
  },
  {
    id: "sorairo",
    name: "そらいろ工房",
    years: [2008, 2010],
    genre: "personal",
    category: "hobby",
    description: "CSS のレイアウト、半透明の PNG、バトン。日記はブログに移した手作りのサイト",
    loadPages: () => import("./personal-2008.ts").then((m) => m.pages),
  },
  {
    id: "koharu",
    name: "こはるのベランダ菜園",
    years: [2011, 2015],
    genre: "personal",
    category: "life",
    description: "HTML5 のタグ、角丸と影、小さな画面への対応。SNS でシェアする時代の個人サイト",
    loadPages: () => import("./personal-2011.ts").then((m) => m.pages),
  },
  {
    id: "corporate",
    name: "ほげほげ製菓株式会社",
    years: [2001, 2002],
    genre: "corporate",
    category: "life",
    description: "「ようこそ」、社長あいさつ、推奨環境。地方の会社の公式サイト",
    loadPages: () => import("./corporate.ts").then((m) => m.pages),
  },
  {
    id: "portal",
    name: "ほげナビ",
    years: [1998, 2000],
    genre: "portal",
    category: "other",
    description: "カテゴリをたどってサイトを探す、ディレクトリ型のポータル",
    loadPages: () => import("./portal.ts").then((m) => m.pages),
  },
  {
    id: "bbs",
    name: "ほげほげ掲示板",
    years: [2001, 2004],
    genre: "bbs",
    category: "hobby",
    description: "スレッド、名無しさん、アスキーアート。匿名掲示板の見た目",
    loadPages: () => import("./bbs.ts").then((m) => m.pages),
  },
  {
    id: "shop",
    name: "ほげほげ屋本舗",
    years: [2003, 2005],
    genre: "shop",
    category: "life",
    description: "赤くて大きな値段と「送料無料」。縦に長いネットショップ",
    loadPages: () => import("./shop.ts").then((m) => m.pages),
  },
  {
    id: "blog",
    name: "はなこのおやつ日和",
    years: [2006, 2007],
    genre: "blog",
    category: "life",
    description: "サイドバー、コメント、トラックバック。2000 年代半ばのブログ",
    loadPages: () => import("./blog.ts").then((m) => m.pages),
  },
];

export function findSample(id: string): SampleSite | undefined {
  return SAMPLE_SITES.find((s) => s.id === id);
}

export type { SampleSite };
