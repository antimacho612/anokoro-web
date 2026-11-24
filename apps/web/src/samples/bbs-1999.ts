import type { SitePage } from "@anokoro/shared";

const AD = `<center>
<a href="service.html"><img src="bn-ad.gif" width="468" height="60" alt="広告" border="0"></a><br>
<font size="1">この広告は、無料の<a href="service.html">ほげほげ BBS</a>に表示されています</font>
</center>`;
const BODY = `<body bgcolor="#FFF8F0" text="#5A3A1A" link="#CC6600" vlink="#996633">`;
const STYLE = `<style type="text/css">
.title { font-size: 20px; font-weight: bold; color: #CC6600; }
.small { font-size: 12px; }
</style>`;
const FORM = `<form>
<table border="0" cellpadding="2" cellspacing="0">
<tr><td class="small">おなまえ</td><td><input type="text" name="name" size="20"></td></tr>
<tr><td class="small">Eメール</td><td><input type="text" name="email" size="30"></td></tr>
<tr><td class="small">タイトル</td><td><input type="text" name="title" size="30"> <input type="submit" value="投稿する"> <input type="reset" value="消す"></td></tr>
<tr><td class="small" valign="top">メッセージ</td><td><textarea name="body" rows="5" cols="56"></textarea></td></tr>
<tr><td class="small">URL</td><td><input type="text" name="url" size="40" value="http://"></td></tr>
</table>
</form>`;
const page = (title: string, body: string): string => `<html>
<head>
<title>${title}</title>
${STYLE}
</head>
${BODY}
${AD}
<hr>
${body}
<hr>
<div align="right" class="small"><a href="howto.html">使い方</a> ｜ <a href="kako.html">過去ログ</a> ｜ <a href="index.html">掲示板の最初へ</a><br>
Powered by <a href="service.html">ほげほげ BBS</a></div>
</body>
</html>
`;
const post = (no: number, title: string, name: string, time: string, body: string): string =>
  `<table border="0" cellpadding="6" cellspacing="0" width="100%">
<tr><td bgcolor="#FFE4C4"><b>[${no}] ${title}</b>　投稿者：<b>${name}</b>　<span class="small">投稿日：${time}</span>　<span class="small"><a href="res.html">[返信]</a></span></td></tr>
<tr><td>${body}</td></tr>
</table>
<br>`;

const index = page(
  "ハムスターなかよし掲示板",
  `<center>
<span class="title">ハムスターなかよし掲示板</span><br>
<span class="small">ハムスターを飼っている人も、これから飼いたい人も、気軽に書き込んでね♪</span>
</center>
${FORM}
<hr>
${post(128, "ほお袋がいっぱい", "ハム吉", "1999/10/12(火) 22:15", "ひまわりの種をあげたら、ほお袋がまんまるに。写真を撮ろうとしたら逃げられました（笑）")}
${post(127, "Re: 回し車の音", "ちょこ", "1999/10/12(火) 21:40", "&gt; 夜中にカラカラうるさくて<br>うちは静かなタイプに買いかえました。油をさすのもいいらしいですよ。")}
${post(126, "回し車の音", "ゆう", "1999/10/12(火) 00:32", "夜中にカラカラうるさくて眠れません。みなさんどうしてますか？")}
${post(125, "はじめまして", "ミルク", "1999/10/11(月) 23:58", "テレホタイムにこっそり見ていました。先月からジャンガリアンを飼っています。よろしくお願いします！")}
<center class="small">[<a href="page2.html">次のページ</a>]</center>`,
);

const page2 = page(
  "ハムスターなかよし掲示板（2 ページ目）",
  `${post(124, "Re: 冬の寒さ対策", "ハム吉", "1999/10/10(日) 20:11", "ケージの下にペット用のヒーターを敷いています。")}
${post(123, "冬の寒さ対策", "ちょこ", "1999/10/10(日) 18:05", "そろそろ寒くなってきましたね。みなさんの対策を教えてください。")}
${post(122, "キリ番 12000", "ゆう", "1999/10/09(土) 23:20", "管理人さんのホームページで 12000 を踏みました！ 記念に書き込みです。")}
<center class="small">[<a href="index.html">前のページ</a>] [<a href="kako.html">過去ログ</a>]</center>`,
);

const res = page(
  "返信 - ハムスターなかよし掲示板",
  `<span class="title">記事 [126] への返信</span>
${post(126, "回し車の音", "ゆう", "1999/10/12(火) 00:32", "夜中にカラカラうるさくて眠れません。みなさんどうしてますか？")}
<form>
<table border="0" cellpadding="2" cellspacing="0">
<tr><td class="small">おなまえ</td><td><input type="text" name="name" size="20"></td></tr>
<tr><td class="small">タイトル</td><td><input type="text" name="title" size="30" value="Re: 回し車の音"></td></tr>
<tr><td class="small" valign="top">メッセージ</td><td><textarea name="body" rows="5" cols="56">&gt; 夜中にカラカラうるさくて眠れません。</textarea></td></tr>
</table>
<input type="submit" value="返信する">
</form>`,
);

const kako = page(
  "過去ログ - ハムスターなかよし掲示板",
  `<span class="title">過去ログ</span>
<p class="small">古い書き込みは、ひと月ごとにまとめています。</p>
<ul>
<li>1999 年 9 月（No.86〜121）
<li>1999 年 8 月（No.51〜85）
<li>1999 年 7 月（No.1〜50）
</ul>
<p class="small">過去ログへの書き込みはできません。</p>`,
);

const howto = page(
  "使い方 - ハムスターなかよし掲示板",
  `<span class="title">使い方</span>
<ul>
<li>「おなまえ」と「メッセージ」を書いて「投稿する」を押すと、いちばん上に載ります。
<li>ほかの人の書き込みにお返事するときは、その書き込みの [返信] からどうぞ。
<li>URL を書くと、おなまえの横にホームページへのリンクがつきます。
<li>タグは使えません。
</ul>
<p class="small">管理人：ハム吉（<a href="http://www.hogespace.example/hamukichi/">ハム吉のハムスター日記</a>）</p>`,
);

const service = page(
  "ほげほげ BBS",
  `<span class="title">ほげほげ BBS</span><br>
<p>CGI が置けないホームページにも、かんたんに掲示板をつけられる、レンタル掲示板のサービスです。</p>
<table border="1" cellpadding="6" cellspacing="0">
<tr bgcolor="#FFE4C4"><th></th><th>無料版</th><th>有料版</th></tr>
<tr><td>料金</td><td>無料</td><td>月 200 円から</td></tr>
<tr><td>広告</td><td>掲示板の上に表示</td><td>表示しない</td></tr>
<tr><td>色やタイトル</td><td>変えられる</td><td>変えられる</td></tr>
</table>
<p>申し込むと、掲示板の URL が届きます。自分のホームページから、その URL にリンクするだけで使えます。</p>
<form><input type="submit" value="掲示板を作る（無料）"></form>`,
);

export const pages: readonly SitePage[] = [
  { path: "index.html", html: index },
  { path: "page2.html", html: page2 },
  { path: "res.html", html: res },
  { path: "kako.html", html: kako },
  { path: "howto.html", html: howto },
  { path: "service.html", html: service },
];
