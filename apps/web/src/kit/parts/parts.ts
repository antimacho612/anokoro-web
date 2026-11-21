import type { AssetEntry } from "@anokoro/assets";
import { FEATURES, featureStatus, type FeatureId, type Year } from "@anokoro/era-data";

export interface Part {
  label: string;
  code: string;
  tip: string;
  /** パーツが頼る機能。その機能が使えない年は灰色にする。なければどの年でも使える */
  feature?: FeatureId;
}

export const PARTS: readonly Part[] = [
  {
    label: "マーキー",
    code: `<marquee behavior="alternate"><font color="#FF00FF">★☆★ ようこそ ★☆★</font></marquee>\n`,
    tip: "IE独自のタグ。流れる文字は個人サイトの華でした",
    feature: "html.marquee",
  },
  {
    label: "点滅文字",
    code: `<blink><font color="#FF0000">重要なお知らせ</font></blink>`,
    tip: "ネスケ独自のタグで、IEでは点滅しませんでした（このキットではどちらでも点滅させています）",
    feature: "html.blink",
  },
  {
    label: "カウンター",
    code: `あなたは <!--COUNTER--> 人目のお客様です。`,
    tip: "当時はCGIで数字の画像を出すのが一般的。「更新」すると数字が遅れて出てくるのはそのためです",
  },
  {
    label: "キリ番告知",
    code: `<font color="#FF0000">★キリ番 1000 を踏んだ方は掲示板で報告してね！踏み逃げ禁止！</font><br>\n`,
    tip: "「踏み逃げ禁止」までがお約束でした",
  },
  {
    label: "2カラム表",
    code: `<table border="0" width="600" cellpadding="4" cellspacing="0">\n<tr>\n<td width="150" bgcolor="#EEEEFF" valign="top">メニュー</td>\n<td valign="top">本文</td>\n</tr>\n</table>\n`,
    tip: 'border="0" のテーブルで段組みするのが、2000年代の王道レイアウトです',
    feature: "html.table-bgcolor",
  },
  {
    label: "相互リンク",
    code: `<a href="http://www.example.com/~hana/">はなのホームページ</a> <font size="1">（相互リンク）</font><br>\n`,
    tip: "サイト同士でリンクを張り合うのが交流の基本でした",
  },
  {
    label: "更新履歴",
    code: `<b>■更新履歴</b><br>\n<font size="2">2003/11/18 ○○を更新<img src="new.gif"></font><br>\n`,
    tip: "更新日とNEW!を並べて、常連さんに更新を知らせていました",
  },
  {
    label: "推奨環境",
    code: `<font size="1">このサイトはIE6.0／800×600以上でご覧ください</font>`,
    tip: "IE6と800×600が、事実上の基準でした",
  },
  {
    label: "2020年代のコード（違反例）",
    code: `<section style="display:flex; gap:16px; border-radius:12px; box-shadow:0 2px 8px rgba(0,0,0,.2)">\n  <article>モダンなカード</article>\n</section>\n<style>\n  .card > p { transition: all .3s; }\n  @media (max-width: 600px) { body { font-size: 14px; } }\n</style>\n`,
    tip: "時代チェッカーがどう反応するか試してみてください。各警告の「解説」から背景を読めます",
  },
];

export type PartAvailability = { usable: true } | { usable: false; label: string };

/** 選んだ年にそのパーツを使えるか。使えなければ「1996年から」のような表示を添える */
export function partAvailability(part: Part, year: Year): PartAvailability {
  if (!part.feature) return { usable: true };
  const status = featureStatus(part.feature, year);
  if (status === "available" || status === "outdated") return { usable: true };
  const from = FEATURES[part.feature].availableFrom;
  return { usable: false, label: from === null ? "まだ使えません" : `${from}年から` };
}

/** 素材集の素材をクリックしたときに入れる文字列 */
export function assetSnippet(asset: AssetEntry): string {
  if (asset.kind === "wallpaper") return ` background="${asset.name}"`;
  if (asset.name === "line.gif") return `<img src="line.gif" width="400" height="8"><br>\n`;
  return `<img src="${asset.name}">`;
}
