import broken from "./svg/broken.svg?raw";
import kabe1 from "./svg/kabe1.svg?raw";
import kabe2 from "./svg/kabe2.svg?raw";
import koji from "./svg/koji.svg?raw";
import line from "./svg/line.svg?raw";
import mail from "./svg/mail.svg?raw";
import newMark from "./svg/new.svg?raw";
import pending from "./svg/pending.svg?raw";

/** 素材の権利情報。素材はすべて自作か CC0 に限る */
export interface AssetRights {
  author: string;
  license: "CC0-1.0";
}

/** 素材集に並ぶ素材 */
export interface AssetEntry extends AssetRights {
  /** ページから参照するファイル名（小文字） */
  name: string;
  /** image: img 要素で貼る / wallpaper: body の background に指定する */
  kind: "image" | "wallpaper";
  /** 読み込みの計算に使う、当時の GIF らしい大きさ（バイト） */
  fakeBytes: number;
  /** 実体の SVG */
  svg: string;
}

/** キットが内部で使う画像（素材集には並ばない） */
export interface SystemImage extends AssetRights {
  svg: string;
}

const rights: AssetRights = { author: "anokoro-web", license: "CC0-1.0" };

export const ASSETS: readonly AssetEntry[] = [
  { name: "koji.gif", kind: "image", fakeBytes: 6200, svg: koji, ...rights },
  { name: "new.gif", kind: "image", fakeBytes: 1100, svg: newMark, ...rights },
  { name: "line.gif", kind: "image", fakeBytes: 2300, svg: line, ...rights },
  { name: "kabe1.gif", kind: "wallpaper", fakeBytes: 3800, svg: kabe1, ...rights },
  { name: "kabe2.gif", kind: "wallpaper", fakeBytes: 4500, svg: kabe2, ...rights },
  { name: "mail.gif", kind: "image", fakeBytes: 2000, svg: mail, ...rights },
];

/** 見つからない画像の代わりに出す壊れた画像アイコン */
export const BROKEN_IMAGE: SystemImage = { svg: broken, ...rights };

/** 回線経由表示で、読み込み中の画像の代わりに出す付箋 */
export const PENDING_IMAGE: SystemImage = { svg: pending, ...rights };

/** 素材以外のものの疑似バイト数 */
export const FAKE_BYTES = {
  counter: 2400,
  bgm: 18000,
  missing: 300,
} as const;
