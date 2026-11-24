import type { SitePage } from "@anokoro/shared";

const HEAD = (title: string): string => `<html>
<head>
<title>${title}</title>
<style type="text/css">
a { text-decoration: none; }
.small { font-size: 12px; }
</style>
</head>
<body bgcolor="#FFFFFF" text="#000000" link="#0000CC" vlink="#551A8B">`;
const SEARCH = `<form>
<input type="text" name="p" size="32"> <input type="submit" value="検索">
<span class="small">例：<a href="search.html">音楽</a> ｜ <a href="help.html">ヘルプ</a></span>
</form>`;
const page = (
  title: string,
  crumbs: string,
  body: string,
): string => `${HEAD(`${title} - ほげナビ`)}
<table border="0" cellpadding="2" cellspacing="0" width="100%">
<tr><td><font size="5" color="#CC0000"><b>ほげナビ</b></font></td><td align="right">${SEARCH}</td></tr>
</table>
<span class="small"><a href="index.html">トップ</a> &gt; ${crumbs}</span>
<hr size="1">
${body}
<hr size="1">
<span class="small"><a href="add.html">サイトの登録</a> ｜ <a href="help.html">ヘルプ</a><br>
Copyright (C) 1998 HogeNavi</span>
</body>
</html>
`;
const site = (name: string, path: string, text: string, mark = ""): string =>
  `<li><a href="http://www.hogespace.example/${path}/">${name}</a>${mark} - ${text}`;
const OSUSUME = ` <img src="mark-osusume.gif" width="48" height="16" alt="おすすめ">`;

const index = `${HEAD("ほげナビ")}
<center>
<table border="0" cellpadding="4" width="600">
<tr><td align="center" bgcolor="#FFEEEE"><font size="6" color="#CC0000"><b>ほげナビ</b></font><br><font size="2">日本語のホームページを探すなら</font></td></tr>
</table>
${SEARCH}
<table border="0" cellpadding="6" width="600">
<tr>
<td valign="top" width="50%">
<b><a href="hobby.html">趣味とスポーツ</a></b><br>
<span class="small"><a href="music.html">音楽</a>、釣り、ゲーム...</span><br><br>
<b><a href="computer.html">コンピュータとインターネット</a></b><br>
<span class="small">ソフトウェア、ホームページ作成...</span>
</td>
<td valign="top" width="50%">
<b><a href="arts.html">芸術と人文</a></b><br>
<span class="small">文学、写真、美術館...</span><br><br>
<b><a href="area.html">地域情報</a></b><br>
<span class="small">都道府県、観光、グルメ...</span>
</td>
</tr>
</table>
<table border="0" cellpadding="6" width="600">
<tr><td bgcolor="#F0F0FF" class="small">
<b>今週のおすすめ</b>${OSUSUME}<br>
<a href="http://www.hogespace.example/tsuri/">日曜釣り師</a> - 近所の川での釣果報告<br>
<a href="http://www.hogespace.example/cake/">手作りケーキの部屋</a> - 写真つきのレシピがたくさん<br>
あなたのホームページを載せませんか？ <a href="add.html">ご登録はこちら</a>（審査があります）
</td></tr>
</table>
<span class="small">Copyright (C) 1998 HogeNavi</span>
</center>
</body>
</html>
`;

const hobby = page(
  "趣味とスポーツ",
  "趣味とスポーツ",
  `<b>カテゴリ</b>
<ul>
<li><a href="music.html">音楽</a> (1,204)
<li>釣り (312)
<li>ゲーム (2,087)
<li>鉄道 (455)
</ul>
<b>登録サイト</b>
<ul>
${site("ねこまるの部屋", "nekomaru", "ねこと音楽と日記のホームページ")}
${site("日曜釣り師", "tsuri", "近所の川での釣果報告", OSUSUME)}
${site("★まさやんのゲーム部屋★", "masayan", "攻略情報と、ゲームの感想")}
</ul>`,
);

const music = page(
  "音楽",
  `<a href="hobby.html">趣味とスポーツ</a> &gt; 音楽`,
  `<b>カテゴリ</b>
<ul>
<li>楽器 (233)
<li>バンド (518)
<li>作曲と打ち込み (96)
</ul>
<b>登録サイト</b>
<ul>
${site("打ち込み工房", "midi", "自作の曲をたくさん公開しています", OSUSUME)}
${site("ピアノ日記", "piano", "大人になってから始めたピアノの練習の記録")}
${site("ほげほげ吹奏楽団", "suisogaku", "演奏会のお知らせと団員募集")}
</ul>`,
);

const computer = page(
  "コンピュータとインターネット",
  "コンピュータとインターネット",
  `<b>カテゴリ</b>
<ul>
<li>ホームページ作成 (642)
<li>ソフトウェア (1,530)
<li>プロバイダ (287)
</ul>
<b>登録サイト</b>
<ul>
${site("HTML のおけいこ", "html", "タグの使い方を例つきで説明", OSUSUME)}
${site("フリーソフトの小部屋", "soft", "自作の便利なソフトを置いています")}
${site("CGI 入門", "cgi", "カウンターと掲示板を設置するまで")}
</ul>`,
);

const arts = page(
  "芸術と人文",
  "芸術と人文",
  `<b>カテゴリ</b>
<ul>
<li>文学 (874)
<li>写真 (392)
<li>美術館 (61)
</ul>
<b>登録サイト</b>
<ul>
${site("ほげほげ短歌会", "tanka", "会員の短歌と、毎月の歌会のお知らせ")}
${site("風景写真館", "fukei", "四季の山と海の写真", OSUSUME)}
</ul>`,
);

const area = page(
  "地域情報",
  "地域情報",
  `<b>カテゴリ</b>
<ul>
<li>ほげほげ県 (420)
<li>ふがふが県 (173)
<li>観光 (958)
<li>グルメ (611)
</ul>
<b>登録サイト</b>
<ul>
${site("ほげほげ市 観光ガイド", "kanko", "名所と祭り、おみやげの紹介")}
${site("ほげほげラーメン探訪", "ramen", "市内のラーメン屋を食べ歩き", OSUSUME)}
</ul>`,
);

const search = page(
  "「音楽」の検索結果",
  "検索結果",
  `<b>「音楽」の検索結果</b>
<p class="small">カテゴリ 2 件、登録サイト 3 件が見つかりました。</p>
<b>カテゴリ</b>
<ul>
<li><a href="music.html">趣味とスポーツ &gt; 音楽</a>
<li><a href="arts.html">芸術と人文</a> &gt; 音楽史
</ul>
<b>登録サイト</b>
<ul>
${site("打ち込み工房", "midi", "自作の曲をたくさん公開しています", OSUSUME)}
${site("ピアノ日記", "piano", "大人になってから始めたピアノの練習の記録")}
${site("ねこまるの部屋", "nekomaru", "ねこと音楽と日記のホームページ")}
</ul>`,
);

const add = page(
  "サイトの登録",
  "サイトの登録",
  `<b>サイトの登録について</b>
<p class="small">ほげナビに載せるサイトは、編集部が一つずつ見て選んでいます。登録の申請をいただいても、掲載をお約束するものではありません。<br>
申請の前に、載せたいカテゴリを選んでおいてください。</p>
<form>
<table border="0" cellpadding="2">
<tr><td>サイト名</td><td><input name="title" size="40"></td></tr>
<tr><td>URL</td><td><input name="url" size="40" value="http://"></td></tr>
<tr><td>カテゴリ</td><td><input name="category" size="40"></td></tr>
<tr><td>紹介文</td><td><textarea name="comment" rows="3" cols="40"></textarea></td></tr>
</table>
<input type="submit" value="申請する">
</form>`,
);

const help = page(
  "ヘルプ",
  "ヘルプ",
  `<b>ほげナビの使い方</b>
<p class="small">
<b>カテゴリをたどる</b>：トップページから、知りたい分野のカテゴリを順に選んでいくと、その分野のサイトが並んでいます。<br>
<b>キーワードで探す</b>：検索窓にことばを入れると、カテゴリの名前と、登録サイトの名前と紹介文から探します。<br>
<img src="mark-osusume.gif" width="48" height="16" alt="おすすめ"> の印は、編集部のおすすめです。
</p>`,
);

export const pages: readonly SitePage[] = [
  { path: "index.html", html: index },
  { path: "hobby.html", html: hobby },
  { path: "music.html", html: music },
  { path: "computer.html", html: computer },
  { path: "arts.html", html: arts },
  { path: "area.html", html: area },
  { path: "search.html", html: search },
  { path: "add.html", html: add },
  { path: "help.html", html: help },
];
