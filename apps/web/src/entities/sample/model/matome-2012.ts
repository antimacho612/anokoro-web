import type { SitePage } from "@anokoro/shared";

const STYLE = `<style>
body { margin: 0; background-color: #F3F3F3; color: #333333; font-family: sans-serif; font-size: 14px; line-height: 1.7; }
a { color: #1A5DAB; }
header { background-color: #C8102E; padding: 10px 16px; }
header h1 { margin: 0; font-size: 24px; }
header h1 a { color: #FFFFFF; text-decoration: none; text-shadow: 1px 1px 0 rgba(0, 0, 0, 0.3); }
header p { margin: 0; color: #FFE0E0; font-size: 12px; }
.container { width: 960px; margin: 0 auto; }
.main { float: left; width: 640px; padding: 12px 0; }
.side { float: right; width: 300px; padding: 12px 0; }
article, .box { background-color: #FFFFFF; border: 1px solid #DDDDDD; border-radius: 4px; padding: 12px 16px; margin-bottom: 12px; }
article h2 { margin: 0 0 4px 0; font-size: 18px; }
article h2 a { color: #222222; text-decoration: none; }
.meta { font-size: 12px; color: #888888; }
.res { margin: 10px 0; }
.res .name { font-size: 12px; color: #228822; }
.res .body { margin-left: 8px; }
.res.op .body { font-weight: bold; color: #1A5DAB; }
.ad { text-align: center; font-size: 11px; color: #999999; margin: 12px 0; }
.box h3 { margin: 0 0 6px 0; font-size: 14px; border-left: 4px solid #C8102E; padding-left: 6px; }
.box ol, .box ul { margin: 0; padding-left: 20px; }
footer { clear: both; text-align: center; font-size: 12px; color: #888888; padding: 16px; }
</style>`;

const SIDE = `<aside class="side">
<div class="box">
<h3>このブログについて</h3>
掲示板の面白い書き込みを、毎日まとめています。<a href="about.html">くわしく</a>
</div>
<div class="box">
<h3>人気の記事</h3>
<ol>
<li><a href="entry-0812.html">駅前の喫茶店のナポリタンが復活した件</a></li>
<li><a href="entry-0811.html">ねこが箱に入る理由、ついに判明か</a></li>
<li><a href="entry-0810.html">休みの日って何してる？</a></li>
</ol>
</div>
<div class="box">
<h3>カテゴリ</h3>
<a href="category.html">グルメ</a>（128）<br>動物（96）<br>雑談（302）
</div>
<div class="ad">スポンサーリンク<br><img src="bn-ad.gif" width="300" height="38" alt="広告"></div>
</aside>`;

const page = (title: string, body: string): string => `<!DOCTYPE html>
<html lang="ja">
<head>
<meta charset="UTF-8">
<title>${title}ほげほげ速報</title>
${STYLE}
</head>
<body>
<header>
<h1><a href="index.html">ほげほげ速報</a></h1>
<p>掲示板の話題を、毎日まとめてお届け</p>
</header>
<div class="container">
<div class="main">
${body}
</div>
${SIDE}
</div>
<footer>ほげほげ速報 ｜ <a href="about.html">このブログについて</a></footer>
</body>
</html>
`;

const AD = `<div class="ad">スポンサーリンク<br><img src="bn-ad.gif" width="468" height="60" alt="広告"></div>`;

const res = (no: number, time: string, id: string, text: string, op = false): string =>
  `<div class="res${op ? " op" : ""}"><div class="name">${no}：名無しのほげさん：2012/08/12 ${time} ID:${id}</div><div class="body">${text}</div></div>`;

const RELATED = `<div class="box">
<h3>関連記事</h3>
<ul>
<li><a href="entry-0811.html">ねこが箱に入る理由、ついに判明か</a></li>
<li><a href="entry-0810.html">休みの日って何してる？</a></li>
</ul>
</div>`;

const COMMENTS = (items: string): string => `<div class="box">
<h3>コメント</h3>
${items}
<form>
<p>名前<br><input type="text" name="name" size="20"></p>
<p><textarea name="text" rows="3" cols="50"></textarea></p>
<p><input type="submit" value="コメントする"></p>
</form>
</div>`;

const summary = (
  href: string,
  title: string,
  date: string,
  category: string,
  comments: number,
): string =>
  `<article>
<h2><a href="${href}">${title}</a></h2>
<div class="meta">${date} ｜ <a href="category.html">${category}</a> ｜ コメント（${comments}）</div>
</article>`;

const index = page(
  "",
  `${summary("entry-0812.html", "駅前の喫茶店のナポリタンが復活した件", "2012年08月12日 21:00", "グルメ", 58)}
${summary("entry-0811.html", "ねこが箱に入る理由、ついに判明か", "2012年08月11日 20:30", "動物", 102)}
${AD}
${summary("entry-0810.html", "休みの日って何してる？", "2012年08月10日 19:00", "雑談", 41)}`,
);

const entry0812 = page(
  "駅前の喫茶店のナポリタンが復活した件 - ",
  `<article>
<h2>駅前の喫茶店のナポリタンが復活した件</h2>
<div class="meta">2012年08月12日 21:00 ｜ <a href="category.html">グルメ</a></div>
${res(1, "18:20:11", "abcd1234", "去年やめたナポリタン、今日から復活してた", true)}
${res(2, "18:21:40", "efgh5678", "まじかよ")}
${res(5, "18:23:02", "ijkl9012", "あそこのは鉄板で出てくるやつだっけ")}
${res(8, "18:24:15", "abcd1234", "&gt;&gt;5<br>そう。下に卵が敷いてある", true)}
${AD}
${res(12, "18:30:48", "mnop3456", "明日行くわ")}
${res(20, "18:41:09", "qrst7890", "喫茶店のナポリタンって、なんであんなにうまいんだろうな")}
</article>
${RELATED}
${COMMENTS(`<p class="meta">1. 名無しさん　2012年08月12日 21:15</p><p>今度行ってみよう</p>`)}`,
);

const entry0811 = page(
  "ねこが箱に入る理由、ついに判明か - ",
  `<article>
<h2>ねこが箱に入る理由、ついに判明か</h2>
<div class="meta">2012年08月11日 20:30 ｜ 動物</div>
${res(1, "17:02:33", "uvwx1234", "うちのねこ、通販の箱を開けたら中身より先に入った", true)}
${res(3, "17:03:50", "yzab5678", "全国共通やな")}
${res(7, "17:06:12", "cdef9012", "せまいところが落ち着くらしいぞ")}
${res(11, "17:10:45", "uvwx1234", "&gt;&gt;7<br>なるほど。でも箱が小さすぎて半分はみ出てる", true)}
${AD}
</article>
${RELATED}`,
);

const entry0810 = page(
  "休みの日って何してる？ - ",
  `<article>
<h2>休みの日って何してる？</h2>
<div class="meta">2012年08月10日 19:00 ｜ 雑談</div>
${res(1, "12:00:01", "ghij1234", "最近、休みの日に何もしてないことに気づいた", true)}
${res(4, "12:03:22", "klmn5678", "昼まで寝て、夕方に後悔する")}
${res(9, "12:08:40", "opqr9012", "自転車で知らない町まで行く")}
${AD}
</article>
${RELATED}`,
);

const category = page(
  "カテゴリ「グルメ」 - ",
  `<div class="box">
<h3>カテゴリ：グルメ</h3>
<ul>
<li><a href="entry-0812.html">駅前の喫茶店のナポリタンが復活した件</a>（08月12日）</li>
<li>カレーの辛さ、どこまでいける？（08月05日）</li>
<li>夏はそうめん派？冷やし中華派？（07月28日）</li>
</ul>
</div>`,
);

const about = page(
  "このブログについて - ",
  `<div class="box">
<h3>このブログについて</h3>
<p>匿名掲示板の書き込みから、面白い話題を選んでまとめています。</p>
<p>記事の内容に問題がある場合は、メールでご連絡ください。確認して対応します。</p>
<p>このブログには広告が入っています。</p>
</div>`,
);

export const pages: readonly SitePage[] = [
  { path: "index.html", html: index },
  { path: "entry-0812.html", html: entry0812 },
  { path: "entry-0811.html", html: entry0811 },
  { path: "entry-0810.html", html: entry0810 },
  { path: "category.html", html: category },
  { path: "about.html", html: about },
];
