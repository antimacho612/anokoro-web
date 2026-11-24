import { TEMPLATE } from "../kit/notepad/templates.ts";
import type { SampleSite } from "./types.ts";

/** 見本サイト。種類ごとに作った年の順に並べる */
export const SAMPLE_SITES: readonly SampleSite[] = [
  {
    id: "personal",
    name: "☆ねこまるの部屋☆",
    years: [1999, 2002],
    genre: "personal",
    category: "diary",
    description: "カウンター、キリ番、工事中。テレホーダイ時代の個人ホームページ",
    loadPages: () => import("./personal.ts").then((m) => m.pages),
  },
  {
    id: "taro",
    name: "☆★たろうのお部屋★☆",
    years: [2003, 2007],
    genre: "personal",
    category: "diary",
    description: "流れる文字と点滅、キリ番の報告。作成キットで最初に開くページ",
    loadPages: () => Promise.resolve([{ path: "index.html", html: TEMPLATE }]),
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
