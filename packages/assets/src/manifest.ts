import type { AssetEraId } from "@anokoro/era-data";
import animeArrow from "./svg/anime-arrow.svg?raw";
import animeKiriban from "./svg/anime-kiriban.svg?raw";
import animeUp from "./svg/anime-up.svg?raw";
import animeWelcome from "./svg/anime-welcome.svg?raw";
import badgeBeta from "./svg/badge-beta.svg?raw";
import badgeRss from "./svg/badge-rss.svg?raw";
import bnAd from "./svg/bn-ad.svg?raw";
import bnBlog from "./svg/bn-blog.svg?raw";
import bnHoge from "./svg/bn-hoge.svg?raw";
import bnHogespace from "./svg/bn-hogespace.svg?raw";
import bnLinkfree from "./svg/bn-linkfree.svg?raw";
import bnSurfer from "./svg/bn-surfer.svg?raw";
import broken from "./svg/broken.svg?raw";
import btnBack from "./svg/btn-back.svg?raw";
import btnBbs from "./svg/btn-bbs.svg?raw";
import btnCart from "./svg/btn-cart.svg?raw";
import btnDiary from "./svg/btn-diary.svg?raw";
import btnFlat from "./svg/btn-flat.svg?raw";
import btnGlossy from "./svg/btn-glossy.svg?raw";
import btnHome from "./svg/btn-home.svg?raw";
import btnInquiry from "./svg/btn-inquiry.svg?raw";
import btnLink from "./svg/btn-link.svg?raw";
import btnNext from "./svg/btn-next.svg?raw";
import btnPost from "./svg/btn-post.svg?raw";
import btnProfile from "./svg/btn-profile.svg?raw";
import btnTop from "./svg/btn-top.svg?raw";
import icon2xMenu from "./svg/icon2x-menu.svg?raw";
import icon2xSearch from "./svg/icon2x-search.svg?raw";
import iconBall from "./svg/icon-ball.svg?raw";
import iconBook from "./svg/icon-book.svg?raw";
import iconCart from "./svg/icon-cart.svg?raw";
import iconHome from "./svg/icon-home.svg?raw";
import iconPen from "./svg/icon-pen.svg?raw";
import iconSoftHome from "./svg/icon-soft-home.svg?raw";
import iconSoftMail from "./svg/icon-soft-mail.svg?raw";
import kabe1 from "./svg/kabe1.svg?raw";
import kabe2 from "./svg/kabe2.svg?raw";
import kabeCheck from "./svg/kabe-check.svg?raw";
import kabeCyber from "./svg/kabe-cyber.svg?raw";
import kabeDot from "./svg/kabe-dot.svg?raw";
import kabeLeaf from "./svg/kabe-leaf.svg?raw";
import kabeMarble from "./svg/kabe-marble.svg?raw";
import kabePinstripe from "./svg/kabe-pinstripe.svg?raw";
import kabeSky from "./svg/kabe-sky.svg?raw";
import kabeWashi from "./svg/kabe-washi.svg?raw";
import koji from "./svg/koji.svg?raw";
import line from "./svg/line.svg?raw";
import lineDot from "./svg/line-dot.svg?raw";
import lineFlower from "./svg/line-flower.svg?raw";
import lineHeart from "./svg/line-heart.svg?raw";
import lineShine from "./svg/line-shine.svg?raw";
import lineStar from "./svg/line-star.svg?raw";
import lineWave from "./svg/line-wave.svg?raw";
import logoHogehoge from "./svg/logo-hogehoge.svg?raw";
import mail from "./svg/mail.svg?raw";
import markOsusume from "./svg/mark-osusume.svg?raw";
import markShinchaku from "./svg/mark-shinchaku.svg?raw";
import newMark from "./svg/new.svg?raw";
import pending from "./svg/pending.svg?raw";
import photoCat from "./svg/photo-cat.svg?raw";
import photoFlower from "./svg/photo-flower.svg?raw";
import photoMe from "./svg/photo-me.svg?raw";
import photoSea from "./svg/photo-sea.svg?raw";
import photoWide from "./svg/photo-wide.svg?raw";
import ribbonNew from "./svg/ribbon-new.svg?raw";
import siteIcon from "./svg/site-icon.svg?raw";

/** 素材の権利情報。素材はすべて自作か CC0 に限る */
export interface AssetRights {
  author: string;
  license: "CC0-1.0";
}

export type AssetCategory = "button" | "banner" | "icon" | "line" | "wallpaper" | "photo";

/** 素材集に並ぶ素材 */
export interface AssetEntry extends AssetRights {
  /** ページから参照するファイル名（小文字） */
  name: string;
  category: AssetCategory;
  /** 作風。素材集に並ぶ年はこれで決まる */
  era: AssetEraId;
  /** 読み込みの計算に使う、当時の画像らしい大きさ（バイト） */
  fakeBytes: number;
  svg: string;
}

/** キットが内部で使う画像（素材集には並ばない） */
export interface SystemImage extends AssetRights {
  svg: string;
}

const rights: AssetRights = { author: "anokoro-web", license: "CC0-1.0" };

export const ASSETS: readonly AssetEntry[] = [
  { name: "koji.gif", category: "banner", era: "gif", fakeBytes: 6200, svg: koji, ...rights },
  {
    name: "new.gif",
    category: "icon",
    era: "gif-animation",
    fakeBytes: 1100,
    svg: newMark,
    ...rights,
  },
  { name: "line.gif", category: "line", era: "gif", fakeBytes: 2300, svg: line, ...rights },
  { name: "kabe1.gif", category: "wallpaper", era: "gif", fakeBytes: 3800, svg: kabe1, ...rights },
  { name: "kabe2.gif", category: "wallpaper", era: "gif", fakeBytes: 4500, svg: kabe2, ...rights },
  {
    name: "mail.gif",
    category: "icon",
    era: "gif-animation",
    fakeBytes: 2000,
    svg: mail,
    ...rights,
  },
  {
    name: "btn-home.gif",
    category: "button",
    era: "gif",
    fakeBytes: 1150,
    svg: btnHome,
    ...rights,
  },
  { name: "btn-bbs.gif", category: "button", era: "gif", fakeBytes: 1050, svg: btnBbs, ...rights },
  {
    name: "btn-link.gif",
    category: "button",
    era: "gif",
    fakeBytes: 1100,
    svg: btnLink,
    ...rights,
  },
  {
    name: "btn-diary.gif",
    category: "button",
    era: "gif",
    fakeBytes: 1200,
    svg: btnDiary,
    ...rights,
  },
  {
    name: "btn-profile.gif",
    category: "button",
    era: "gif",
    fakeBytes: 1300,
    svg: btnProfile,
    ...rights,
  },
  { name: "btn-back.gif", category: "button", era: "gif", fakeBytes: 950, svg: btnBack, ...rights },
  { name: "btn-next.gif", category: "button", era: "gif", fakeBytes: 950, svg: btnNext, ...rights },
  { name: "btn-top.gif", category: "button", era: "gif", fakeBytes: 900, svg: btnTop, ...rights },
  {
    name: "btn-inquiry.gif",
    category: "button",
    era: "corporate",
    fakeBytes: 1900,
    svg: btnInquiry,
    ...rights,
  },
  {
    name: "btn-post.gif",
    category: "button",
    era: "bbs",
    fakeBytes: 1000,
    svg: btnPost,
    ...rights,
  },
  {
    name: "btn-cart.gif",
    category: "button",
    era: "shop",
    fakeBytes: 2300,
    svg: btnCart,
    ...rights,
  },
  {
    name: "btn-glossy.png",
    category: "button",
    era: "web2",
    fakeBytes: 6400,
    svg: btnGlossy,
    ...rights,
  },
  {
    name: "btn-flat.png",
    category: "button",
    era: "retina",
    fakeBytes: 3600,
    svg: btnFlat,
    ...rights,
  },
  {
    name: "bn-surfer.gif",
    category: "banner",
    era: "gif",
    fakeBytes: 2400,
    svg: bnSurfer,
    ...rights,
  },
  { name: "bn-hoge.gif", category: "banner", era: "gif", fakeBytes: 2100, svg: bnHoge, ...rights },
  {
    name: "bn-linkfree.gif",
    category: "banner",
    era: "gif",
    fakeBytes: 1300,
    svg: bnLinkfree,
    ...rights,
  },
  {
    name: "bn-hogespace.gif",
    category: "banner",
    era: "gif",
    fakeBytes: 2100,
    svg: bnHogespace,
    ...rights,
  },
  { name: "bn-ad.gif", category: "banner", era: "gif", fakeBytes: 11800, svg: bnAd, ...rights },
  {
    name: "anime-welcome.gif",
    category: "banner",
    era: "gif-animation",
    fakeBytes: 14500,
    svg: animeWelcome,
    ...rights,
  },
  {
    name: "anime-kiriban.gif",
    category: "banner",
    era: "gif-animation",
    fakeBytes: 5200,
    svg: animeKiriban,
    ...rights,
  },
  {
    name: "logo-hogehoge.gif",
    category: "banner",
    era: "corporate",
    fakeBytes: 4100,
    svg: logoHogehoge,
    ...rights,
  },
  { name: "bn-blog.gif", category: "banner", era: "blog", fakeBytes: 2000, svg: bnBlog, ...rights },
  { name: "icon-home.gif", category: "icon", era: "gif", fakeBytes: 650, svg: iconHome, ...rights },
  { name: "icon-book.gif", category: "icon", era: "gif", fakeBytes: 700, svg: iconBook, ...rights },
  { name: "icon-ball.gif", category: "icon", era: "gif", fakeBytes: 380, svg: iconBall, ...rights },
  { name: "icon-pen.gif", category: "icon", era: "gif", fakeBytes: 600, svg: iconPen, ...rights },
  {
    name: "anime-up.gif",
    category: "icon",
    era: "gif-animation",
    fakeBytes: 850,
    svg: animeUp,
    ...rights,
  },
  {
    name: "anime-arrow.gif",
    category: "icon",
    era: "gif-animation",
    fakeBytes: 1200,
    svg: animeArrow,
    ...rights,
  },
  {
    name: "mark-osusume.gif",
    category: "icon",
    era: "portal",
    fakeBytes: 600,
    svg: markOsusume,
    ...rights,
  },
  {
    name: "mark-shinchaku.gif",
    category: "icon",
    era: "portal",
    fakeBytes: 420,
    svg: markShinchaku,
    ...rights,
  },
  {
    name: "icon-cart.gif",
    category: "icon",
    era: "shop",
    fakeBytes: 330,
    svg: iconCart,
    ...rights,
  },
  {
    name: "badge-rss.gif",
    category: "icon",
    era: "blog",
    fakeBytes: 450,
    svg: badgeRss,
    ...rights,
  },
  {
    name: "badge-beta.png",
    category: "icon",
    era: "web2",
    fakeBytes: 5300,
    svg: badgeBeta,
    ...rights,
  },
  {
    name: "icon-soft-home.png",
    category: "icon",
    era: "png-alpha",
    fakeBytes: 4600,
    svg: iconSoftHome,
    ...rights,
  },
  {
    name: "icon-soft-mail.png",
    category: "icon",
    era: "png-alpha",
    fakeBytes: 4300,
    svg: iconSoftMail,
    ...rights,
  },
  {
    name: "ribbon-new.png",
    category: "icon",
    era: "png-alpha",
    fakeBytes: 3100,
    svg: ribbonNew,
    ...rights,
  },
  {
    name: "icon2x-menu.png",
    category: "icon",
    era: "retina",
    fakeBytes: 900,
    svg: icon2xMenu,
    ...rights,
  },
  {
    name: "icon2x-search.png",
    category: "icon",
    era: "retina",
    fakeBytes: 2200,
    svg: icon2xSearch,
    ...rights,
  },
  { name: "line-dot.gif", category: "line", era: "gif", fakeBytes: 350, svg: lineDot, ...rights },
  {
    name: "line-wave.gif",
    category: "line",
    era: "gif",
    fakeBytes: 1100,
    svg: lineWave,
    ...rights,
  },
  {
    name: "line-heart.gif",
    category: "line",
    era: "gif",
    fakeBytes: 1600,
    svg: lineHeart,
    ...rights,
  },
  {
    name: "line-star.gif",
    category: "line",
    era: "gif",
    fakeBytes: 1500,
    svg: lineStar,
    ...rights,
  },
  {
    name: "line-flower.gif",
    category: "line",
    era: "gif",
    fakeBytes: 2200,
    svg: lineFlower,
    ...rights,
  },
  {
    name: "line-shine.png",
    category: "line",
    era: "web2",
    fakeBytes: 900,
    svg: lineShine,
    ...rights,
  },
  {
    name: "kabe-check.gif",
    category: "wallpaper",
    era: "gif",
    fakeBytes: 300,
    svg: kabeCheck,
    ...rights,
  },
  {
    name: "kabe-dot.gif",
    category: "wallpaper",
    era: "gif",
    fakeBytes: 250,
    svg: kabeDot,
    ...rights,
  },
  {
    name: "kabe-sky.gif",
    category: "wallpaper",
    era: "gif",
    fakeBytes: 2600,
    svg: kabeSky,
    ...rights,
  },
  {
    name: "kabe-washi.gif",
    category: "wallpaper",
    era: "gif",
    fakeBytes: 5800,
    svg: kabeWashi,
    ...rights,
  },
  {
    name: "kabe-marble.gif",
    category: "wallpaper",
    era: "gif",
    fakeBytes: 7200,
    svg: kabeMarble,
    ...rights,
  },
  {
    name: "kabe-cyber.gif",
    category: "wallpaper",
    era: "gif",
    fakeBytes: 280,
    svg: kabeCyber,
    ...rights,
  },
  {
    name: "kabe-leaf.gif",
    category: "wallpaper",
    era: "gif",
    fakeBytes: 2100,
    svg: kabeLeaf,
    ...rights,
  },
  {
    name: "kabe-pinstripe.png",
    category: "wallpaper",
    era: "web2",
    fakeBytes: 160,
    svg: kabePinstripe,
    ...rights,
  },
  {
    name: "photo-cat.jpg",
    category: "photo",
    era: "gif",
    fakeBytes: 8900,
    svg: photoCat,
    ...rights,
  },
  {
    name: "photo-sea.jpg",
    category: "photo",
    era: "gif",
    fakeBytes: 7600,
    svg: photoSea,
    ...rights,
  },
  { name: "photo-me.jpg", category: "photo", era: "gif", fakeBytes: 4800, svg: photoMe, ...rights },
  {
    name: "photo-flower.jpg",
    category: "photo",
    era: "gif",
    fakeBytes: 9400,
    svg: photoFlower,
    ...rights,
  },
  {
    name: "photo-wide.jpg",
    category: "photo",
    era: "retina",
    fakeBytes: 168000,
    svg: photoWide,
    ...rights,
  },
];

/** 見つからない画像の代わりに出す壊れた画像アイコン */
export const BROKEN_IMAGE: SystemImage = { svg: broken, ...rights };

/** 回線経由表示で、読み込み中の画像の代わりに出す付箋 */
export const PENDING_IMAGE: SystemImage = { svg: pending, ...rights };

/** タスクバーの左端に出すサイトのアイコン。年によって変えない */
export const SITE_ICON: SystemImage = { svg: siteIcon, ...rights };

/** 素材以外のものの疑似バイト数 */
export const FAKE_BYTES = {
  counter: 2400,
  bgm: 18000,
  missing: 300,
} as const;
