import { assetSize, assetsForYear, type AssetCategory, type AssetEntry } from "@anokoro/assets";
import type { TopicId } from "@anokoro/era-checker";
import {
  FEATURES,
  assetEraYears,
  featureStatus,
  type FeatureId,
  type SiteKindId,
  type Year,
} from "@anokoro/era-data";

export interface Part {
  label: string;
  code: string;
  tip: string;
  tipTopic: TopicId;
  /** パーツが頼る機能。その機能が使えない年は灰色にする。なければどの年でも使える */
  feature?: FeatureId;
  /** その種類のサイトでだけ出すパーツ。なければどの種類でも出す */
  kinds?: readonly SiteKindId[];
}

export const PARTS: readonly Part[] = [
  {
    label: "ようこそ",
    code: `<center><font size="5" color="#003399"><b>ようこそ ほげほげ商事のホームページへ</b></font></center>
`,
    tip: "トップに「ようこそ」と大きく書くのが、企業サイトの第一声でした",
    tipTopic: "corporate",
    kinds: ["corporate"],
  },
  {
    label: "最終更新日",
    code: `<hr>
<font size="2">最終更新日：2003年11月18日<br>Copyright (C) Hogehoge Co., Ltd. All Rights Reserved.</font>
`,
    tip: "ページの下に最終更新日と著作権表示を置くのが決まりごとでした",
    tipTopic: "corporate",
    kinds: ["corporate"],
  },
  {
    label: "カテゴリ一覧",
    code: `<table border="0" cellpadding="4" width="500">
<tr>
<td><b><a href="art.html">芸術と人文</a></b><br><font size="2">文学、写真、美術館...</font></td>
<td><b><a href="hobby.html">趣味とスポーツ</a></b><br><font size="2">音楽、釣り、ゲーム...</font></td>
</tr>
</table>
`,
    tip: "カテゴリをたどってサイトを探すのが、ディレクトリ型の使い方でした",
    tipTopic: "portal",
    kinds: ["portal"],
  },
  {
    label: "サイト登録",
    code: `<font size="2">あなたのホームページを載せませんか？ <a href="regist.html">ご登録はこちら</a></font><br>
`,
    tip: "登録されるとアクセスが一気に増えるので、申請する人が絶えませんでした",
    tipTopic: "portal",
    kinds: ["portal"],
  },
  {
    label: "書き込み",
    code: `<dl>
<dt>1 名前：<b>名無しさん</b> 投稿日：2003/11/18 21:40
<dd>はじめまして。いつも見ています。<br><br>
</dl>
`,
    tip: "名前の欄を空にすると「名無しさん」と表示されるのが、匿名掲示板の作法でした",
    tipTopic: "bbs",
    kinds: ["bbs"],
  },
  {
    label: "スレッド一覧",
    code: `<b>■スレッド一覧</b><br>
<font size="2">1: <a href="#1">雑談スレ (128)</a> 2: <a href="#2">初心者質問スレ (45)</a></font><br>
`,
    tip: "話題ごとのスレッドに書き込みが積み重なっていきました",
    tipTopic: "bbs",
    kinds: ["bbs"],
  },
  {
    label: "値段",
    code: `<font color="#CC0000" size="6"><b>1,980円</b></font><font size="2">（税込）</font> <font color="#CC0000"><b>★送料無料★</b></font><br>
`,
    tip: "赤くて大きな値段と「送料無料」が、ネットショップの顔でした",
    tipTopic: "shop",
    kinds: ["shop"],
  },
  {
    label: "特定商取引法",
    code: `<font size="2"><a href="law.html">特定商取引法に基づく表記</a> ｜ <a href="guide.html">ご利用ガイド</a></font><br>
`,
    tip: "通信販売では、販売者の名前や連絡先などを表示することが法律で決められています",
    tipTopic: "shop",
    kinds: ["shop"],
  },
  {
    label: "記事の終わり",
    code: `<div align="right"><font size="1">投稿者 はなこ 21:40 ｜ <a href="comment.html">コメント (3)</a> ｜ <a href="tb.html">トラックバック (1)</a></font></div>
`,
    tip: "記事の下には、コメントとトラックバックの件数が並びました",
    tipTopic: "blog",
    kinds: ["blog"],
  },
  {
    label: "最近の記事",
    code: `<b>最近の記事</b><br>
<font size="2"><a href="1120.html">ホットケーキを焼きました</a><br>
<a href="1115.html">駅前のケーキ屋さん</a></font><br>
`,
    tip: "サイドバーにはプロフィール、カレンダー、最近の記事などが並びました",
    tipTopic: "blog",
    kinds: ["blog"],
  },
  {
    label: "マーキー",
    code: `<marquee behavior="alternate"><font color="#FF00FF">★☆★ ようこそ ★☆★</font></marquee>\n`,
    tip: "IE独自のタグ。流れる文字は個人サイトの華でした",
    tipTopic: "html",
    feature: "html.marquee",
  },
  {
    label: "点滅文字",
    code: `<blink><font color="#FF0000">重要なお知らせ</font></blink>`,
    tip: "ネスケ独自のタグで、IEでは点滅しませんでした（このキットではどちらでも点滅させています）",
    tipTopic: "html",
    feature: "html.blink",
  },
  {
    label: "カウンター",
    code: `あなたは <!--COUNTER--> 人目のお客様です。`,
    tip: "当時はCGIで数字の画像を出すのが一般的。「更新」すると数字が遅れて出てくるのはそのためです",
    tipTopic: "culture",
  },
  {
    label: "キリ番告知",
    code: `<font color="#FF0000">★キリ番 1000 を踏んだ方は掲示板で報告してね！踏み逃げ禁止！</font><br>\n`,
    tip: "「踏み逃げ禁止」までがお約束でした",
    tipTopic: "culture",
  },
  {
    label: "2カラム表",
    code: `<table border="0" width="600" cellpadding="4" cellspacing="0">\n<tr>\n<td width="150" bgcolor="#EEEEFF" valign="top">メニュー</td>\n<td valign="top">本文</td>\n</tr>\n</table>\n`,
    tip: 'border="0" のテーブルで段組みするのが、2000年代の王道レイアウトです',
    tipTopic: "html",
    feature: "html.table-bgcolor",
  },
  {
    label: "相互リンク",
    code: `<a href="http://www.example.com/~hana/">はなのホームページ</a> <font size="1">（相互リンク）</font><br>\n`,
    tip: "サイト同士でリンクを張り合うのが交流の基本でした",
    tipTopic: "culture",
  },
  {
    label: "更新履歴",
    code: `<b>■更新履歴</b><br>\n<font size="2">2003/11/18 ○○を更新<img src="new.gif"></font><br>\n`,
    tip: "更新日とNEW!を並べて、常連さんに更新を知らせていました",
    tipTopic: "culture",
  },
  {
    label: "推奨環境",
    code: `<font size="1">このサイトはIE6.0／800×600以上でご覧ください</font>`,
    tip: "IE6と800×600が、事実上の基準でした",
    tipTopic: "browser",
  },
  {
    label: "2020年代のコード（違反例）",
    code: `<section style="display:flex; gap:16px; border-radius:12px; box-shadow:0 2px 8px rgba(0,0,0,.2)">\n  <article>モダンなカード</article>\n</section>\n<style>\n  .card > p { transition: all .3s; }\n  @media (max-width: 600px) { body { font-size: 14px; } }\n</style>\n`,
    tip: "時代チェッカーがどう反応するか試してみてください。各警告の「解説」から背景を読めます",
    tipTopic: "css",
  },
];

/** そのサイトの種類で出すパーツ。種類に合わせたパーツを先に並べる */
export function partsForKind(kind: SiteKindId): Part[] {
  const own = PARTS.filter((p) => p.kinds?.includes(kind));
  const common = PARTS.filter((p) => p.kinds === undefined);
  return [...own, ...common];
}

export type PartAvailability = { usable: true } | { usable: false; label: string };

/** 選んだ年にそのパーツを使えるか。使えなければ「1996年から」のような表示を添える */
export function partAvailability(part: Part, year: Year): PartAvailability {
  if (!part.feature) return { usable: true };
  const status = featureStatus(part.feature, year);
  if (status === "available" || status === "outdated") return { usable: true };
  const from = FEATURES[part.feature].availableFrom;
  return { usable: false, label: from === null ? "まだ使えません" : `${from}年から` };
}

/** 素材集の素材をクリックしたときに入れる文字列。高精細向けの素材は半分の大きさで貼る */
export function assetSnippet(asset: AssetEntry): string {
  if (asset.category === "wallpaper") return ` background="${asset.name}"`;
  const size = assetSize(asset);
  if (!size) return `<img src="${asset.name}">`;
  if (asset.category === "line") {
    return `<img src="${asset.name}" width="${size.width}" height="${size.height}"><br>\n`;
  }
  if (asset.era === "retina") {
    return `<img src="${asset.name}" width="${size.width / 2}" height="${size.height / 2}">`;
  }
  return `<img src="${asset.name}">`;
}

export interface AssetGroup {
  category: AssetCategory;
  label: string;
  assets: readonly AssetEntry[];
}

const ASSET_CATEGORIES: readonly { category: AssetCategory; label: string }[] = [
  { category: "button", label: "ボタン" },
  { category: "banner", label: "バナー" },
  { category: "icon", label: "アイコン・マーク" },
  { category: "line", label: "ライン" },
  { category: "wallpaper", label: "壁紙" },
  { category: "photo", label: "写真の代わり" },
];

const eraStart = (asset: AssetEntry): number => assetEraYears(asset.era)?.[0] ?? 0;

/** 選んだ年の素材集を種類ごとに分け、新しい作風の素材から並べる */
export function assetGroups(year: Year): AssetGroup[] {
  const shown = assetsForYear(year);
  return ASSET_CATEGORIES.map(({ category, label }) => ({
    category,
    label,
    assets: shown
      .filter((asset) => asset.category === category)
      .toSorted((a, b) => eraStart(b) - eraStart(a)),
  })).filter((group) => group.assets.length > 0);
}

/** 素材の疑似バイト数を「6.1KB」の形で表す */
export function assetBytesLabel(asset: AssetEntry): string {
  return `${(asset.fakeBytes / 1024).toFixed(1)}KB`;
}
