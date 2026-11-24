import type { SitePage } from "@anokoro/shared";

const STYLE = `<style type="text/css">
body { margin: 0; background-color: #EEF3F8; color: #333333; font-family: sans-serif; font-size: 12px; line-height: 150%; }
a { color: #336699; }
#banner { background-color: #6688AA; padding: 16px 20px; }
#banner h1 { margin: 0; font-size: 20px; color: #FFFFFF; }
#banner h1 a { color: #FFFFFF; text-decoration: none; }
#banner p { margin: 0; color: #DDE6F0; }
#content { float: left; width: 520px; padding: 16px; }
#side { margin-left: 552px; padding: 16px 16px 16px 0; }
.date { font-weight: bold; color: #6688AA; border-bottom: 1px solid #AABBCC; margin-bottom: 4px; }
.entry { background-color: #FFFFFF; border: 1px solid #CCD6E0; padding: 10px; margin-bottom: 14px; }
.entry h2 { font-size: 14px; margin: 0 0 6px 0; }
.posted { font-size: 11px; color: #888888; text-align: right; }
.side { background-color: #FFFFFF; border: 1px solid #CCD6E0; padding: 6px; margin-bottom: 10px; }
.side h3 { font-size: 12px; margin: 0 0 4px 0; color: #6688AA; }
.comment { border-top: 1px dotted #AABBCC; padding: 6px 0; }
</style>`;

const SIDE = `<div id="side">
<div class="side"><h3>プロフィール</h3><a href="profile.html">ほげお</a><br>会社員。ブログを始めてみました。</div>
<div class="side"><h3>最近の記事</h3>
<a href="entry1228.html">携帯から投稿してみる</a><br>
クリスマスケーキ<br>
<a href="entry1220.html">ブログはじめました</a>
</div>
<div class="side"><h3>カテゴリ</h3><a href="category.html">日記 (2)</a><br>ブログのこと (1)</div>
<div class="side"><h3>アーカイブ</h3><a href="archive.html">2003年12月</a></div>
<div class="side"><h3>リンク</h3>
<a href="http://www.hogespace.example/hogeo/">前のホームページ</a><br>
<a href="http://blog.hogespace.example/">ほげほげブログ</a>
</div>
<div class="side">
<a href="http://blog.hogespace.example/"><img src="bn-blog.gif" width="88" height="31" alt="ほげほげブログ" border="0"></a>
</div>
</div>`;

const page = (title: string, body: string, side = SIDE): string => `<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=Shift_JIS">
<title>${title}ほげおのブログ</title>
${STYLE}
</head>
<body>
<div id="banner">
<h1><a href="index.html">ほげおのブログ</a></h1>
<p>毎日のことを、少しずつ。</p>
</div>
<div id="content">
${body}
</div>
${side}
</body>
</html>
`;

const ENTRY_1220 = `<div class="date">2003年12月20日</div>
<div class="entry">
<h2>ブログはじめました</h2>
ブログというものを始めてみました。<br>
前のホームページは、HTML を書いて FTP で上げるのが面倒で、更新が止まっていました。<br>
ここなら、文章を書いて「投稿」を押すだけで、トップページも、日付ごとのページも、カテゴリのページもできあがります。<br>
デザインも、テンプレートから選ぶだけ。これなら続けられそうです。
<div class="posted">投稿者 ほげお 23:12 ｜ <a href="entry1220.html">コメント (3)</a> ｜ <a href="entry1220.html">トラックバック (1)</a></div>
</div>`;

const ENTRY_1228 = `<div class="date">2003年12月28日</div>
<div class="entry">
<h2>携帯から投稿してみる</h2>
<img src="photo-sea.jpg" width="160" height="120" alt="冬の海" align="right" hspace="6">
帰省の途中で海に寄りました。携帯で撮った写真をメールで送ると、そのままブログに載るらしい。<br>
ちゃんと載ったかな？
<div class="posted">投稿者 ほげお 14:05 ｜ <a href="entry1228.html">コメント (1)</a> ｜ トラックバック (0)</div>
</div>`;

const index = page(
  "",
  `${ENTRY_1228}
<div class="date">2003年12月24日</div>
<div class="entry">
<h2>クリスマスケーキ</h2>
駅前のケーキ屋さんで、小さいのを買って帰りました。来年はブログを続けるのが目標です。
<div class="posted">投稿者 ほげお 18:40 ｜ コメント (0) ｜ トラックバック (0)</div>
</div>
${ENTRY_1220}`,
);

const entry1220 = page(
  "ブログはじめました - ",
  `${ENTRY_1220}
<div class="entry">
<b>コメント</b>
<div class="comment">ブログ、わたしも気になってました。トラックバックってなんですか？<br><font size="1">Posted by ほげ子 at 2003年12月20日 23:40</font></div>
<div class="comment">&gt; ほげ子さん<br>自分のブログで、ほかの人の記事について書いたときに、その記事に「書きましたよ」と知らせる仕組みだそうです。<br><font size="1">Posted by ほげお at 2003年12月21日 00:15</font></div>
<div class="comment">開設おめでとうございます！<br><font size="1">Posted by つうしん太郎 at 2003年12月21日 09:02</font></div>
</div>
<div class="entry">
<b>トラックバック</b>
<div class="comment"><a href="http://blog.hogespace.example/tsushin/">ブログ、はじめる人が増えてます（つうしん太郎の日々）</a><br><font size="1">Tracked on 2003年12月21日 09:10</font></div>
</div>
<div class="entry">
<b>コメントを書く</b>
<form>
名前：<input type="text" name="author" size="20"><br>
URL：<input type="text" name="url" size="30"><br>
<textarea name="text" rows="4" cols="50"></textarea><br>
<input type="submit" value="投稿する">
</form>
<font size="1">この記事へのトラックバック URL：http://blog.hogespace.example/hogeo/tb/1220</font>
</div>`,
);

const entry1228 = page(
  "携帯から投稿してみる - ",
  `${ENTRY_1228}
<div class="entry">
<b>コメント</b>
<div class="comment">寒そう！ でも写真きれいですね。<br><font size="1">Posted by ほげ子 at 2003年12月28日 15:20</font></div>
</div>`,
);

const archive = page(
  "アーカイブ - ",
  `<div class="entry">
<h2>2003年12月</h2>
<a href="entry1228.html">12月28日　携帯から投稿してみる</a><br>
12月24日　クリスマスケーキ<br>
<a href="entry1220.html">12月20日　ブログはじめました</a>
</div>`,
);

const category = page(
  "カテゴリ「日記」 - ",
  `<div class="entry">
<h2>カテゴリ：日記</h2>
<a href="entry1228.html">携帯から投稿してみる</a>（2003年12月28日）<br>
クリスマスケーキ（2003年12月24日）
</div>
<p>記事を書くときにカテゴリを選んでおくと、ここに自動で並びます。</p>`,
);

const profile = page(
  "プロフィール - ",
  `<div class="entry">
<h2>プロフィール</h2>
<img src="photo-me.jpg" width="96" height="96" alt="ほげお" align="left" hspace="8">
ほげお／会社員。<br>
1998 年から個人のホームページをやっていましたが、2003 年の暮れにブログへ引っ越しました。<br>
前のホームページも、しばらくは残しておきます。
<br clear="all">
</div>
<div class="entry">
<h2>このブログについて</h2>
コメント、トラックバックはお気軽にどうぞ。
</div>`,
);

export const pages: readonly SitePage[] = [
  { path: "index.html", html: index },
  { path: "entry1220.html", html: entry1220 },
  { path: "entry1228.html", html: entry1228 },
  { path: "archive.html", html: archive },
  { path: "category.html", html: category },
  { path: "profile.html", html: profile },
];
