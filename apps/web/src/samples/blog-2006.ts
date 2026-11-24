import type { SitePage } from "@anokoro/shared";

const STYLE = `<style type="text/css">
body { margin: 0; background-color: #FFF6EE; color: #444444; font-family: sans-serif; font-size: 12px; line-height: 1.6; }
a { color: #C05030; }
#banner { background-color: #E08060; padding: 18px; }
#banner h1 { margin: 0; font-size: 20px; }
#banner h1 a { color: #FFFFFF; text-decoration: none; }
#banner p { margin: 0; color: #FFE8DC; }
#wrap { width: 780px; margin: 0 auto; }
#content { float: left; width: 520px; padding: 12px; }
#side { float: right; width: 220px; padding: 12px 0; }
.entry { background-color: #FFFFFF; border: 1px solid #F0C8B0; padding: 10px; margin-bottom: 12px; }
.entry h2 { font-size: 14px; color: #C05030; margin: 0 0 6px 0; }
.posted { font-size: 10px; color: #888888; text-align: right; }
.sidebox { background-color: #FFFFFF; border: 1px solid #F0C8B0; padding: 6px; margin-bottom: 10px; }
.sidebox > h3 { margin: 0 0 4px 0; font-size: 12px; color: #FFFFFF; background-color: #E08060; padding: 2px 6px; }
.sidebox:hover { border-color: #E08060; }
.comment { border-top: 1px dotted #F0C8B0; padding: 6px 0; }
.parts { text-align: center; background-color: #FFF0F5; border: 1px dashed #E8A0B8; padding: 6px; }
#footer { clear: both; text-align: center; font-size: 10px; color: #999999; padding: 12px; }
</style>`;

const SIDE = `<div id="side">
<div class="sidebox"><h3>プロフィール</h3><img src="photo-me.jpg" width="48" height="48" alt="" align="left" hspace="4"><a href="profile.html">はなこ</a><br>甘いものが好きな会社員です。<br clear="all"></div>
<div class="sidebox"><h3>最近の記事</h3>
<a href="entry1120.html">ホットケーキを焼きました</a><br>
<a href="baton.html">おやつバトンが回ってきました</a><br>
<a href="entry1115.html">駅前のケーキ屋さん</a>
</div>
<div class="sidebox"><h3>最近のコメント</h3>
たろう on <a href="entry1120.html">ホットケーキを焼きました</a><br>
みか on <a href="entry1120.html">ホットケーキを焼きました</a>
</div>
<div class="sidebox"><h3>カテゴリ</h3><a href="category.html">おやつ (24)</a><br>カフェ (9)<br>バトン (3)</div>
<div class="sidebox"><h3>アーカイブ</h3><a href="archive.html">2006年11月</a><br>2006年10月<br>2006年09月</div>
<div class="sidebox"><h3>ブログパーツ</h3>
<div class="parts"><img src="icon-soft-home.png" width="48" height="48" alt=""><br>今日のおやつ占い<br><b>大吉：プリン</b></div>
</div>
<div class="sidebox">
<a href="http://blog.hogespace.example/hanako/index.rdf"><img src="badge-rss.gif" width="80" height="15" alt="RSS" border="0"></a><br>
<a href="http://blog.hogespace.example/"><img src="bn-blog.gif" width="88" height="31" alt="ほげほげブログ" border="0"></a>
</div>
</div>`;

const page = (title: string, body: string): string => `<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title>${title}はなこのおやつ日和</title>
${STYLE}
</head>
<body>
<div id="banner"><h1><a href="index.html">はなこのおやつ日和</a></h1><p>作って、食べて、また作る。</p></div>
<div id="wrap">
<div id="content">
${body}
</div>
${SIDE}
<div id="footer">Powered by ほげほげブログ</div>
</div>
</body>
</html>
`;

const posted = (time: string, comments: number, trackbacks: number, href: string): string =>
  `<div class="posted">投稿者 はなこ ${time} ｜ <a href="${href}">コメント (${comments})</a> ｜ <a href="${href}">トラックバック (${trackbacks})</a></div>`;

const ENTRY_1120 = `<div class="entry">
<h2>2006年11月20日 ホットケーキを焼きました</h2>
<img src="photo-flower.jpg" width="160" height="120" alt="ホットケーキ" align="right" hspace="6">
ふわふわに焼けました。メープルシロップをたっぷりかけて、日曜の朝ごはんにしました。<br>
焼くときは弱火でじっくり、がコツみたいです。<br clear="all">
${posted("21:40", 2, 1, "entry1120.html")}
</div>`;

const ENTRY_1115 = `<div class="entry">
<h2>2006年11月15日 駅前のケーキ屋さん</h2>
モンブランがおいしかったです。栗がごろっと入っていて、甘さはひかえめ。また行きたいです。
${posted("22:15", 0, 0, "entry1115.html")}
</div>`;

const BATON = `<div class="entry">
<h2>2006年11月17日 おやつバトンが回ってきました</h2>
みかさんから「おやつバトン」をいただきました！<br><br>
<b>Q1. 好きなおやつは？</b><br>A. プリン。かためのが好きです。<br>
<b>Q2. 最近作ったおやつは？</b><br>A. さつまいもの蒸しパン。<br>
<b>Q3. おやつの時間は何時？</b><br>A. 平日は 15 時に、会社の机でこっそり。<br>
<b>Q4. 次に回す 3 人</b><br>A. たろうさん、さくらさん、ちょこさん。よろしくお願いします♪
${posted("20:05", 1, 2, "baton.html")}
</div>`;

const COMMENT_FORM = `<div class="entry">
<b>コメントを書く</b>
<form>
名前：<input type="text" name="author" size="20"><br>
URL：<input type="text" name="url" size="30"><br>
<textarea name="text" rows="4" cols="50"></textarea><br>
<input type="submit" value="投稿する">
</form>
<font size="1">トラックバックは、はなこが確認してから表示します。</font>
</div>`;

const index = page("", `${ENTRY_1120}\n${BATON}\n${ENTRY_1115}`);

const entry1120 = page(
  "ホットケーキを焼きました - ",
  `${ENTRY_1120}
<div class="entry">
<b>コメント</b>
<div class="comment">おいしそう！ 今度まねしてみます。<br><font size="1">Posted by みか at 2006年11月20日 22:01</font></div>
<div class="comment">ふわふわですね～。<br><font size="1">Posted by たろう at 2006年11月21日 08:12</font></div>
</div>
<div class="entry">
<b>トラックバック</b>
<div class="comment"><a href="http://blog.hogespace.example/sakura/">日曜の朝ごはん（さくらの台所日記）</a><br><font size="1">Tracked on 2006年11月21日 10:30</font></div>
</div>
${COMMENT_FORM}
<p><a href="index.html">« トップへ戻る</a></p>`,
);

const entry1115 = page(
  "駅前のケーキ屋さん - ",
  `${ENTRY_1115}
${COMMENT_FORM}
<p><a href="index.html">« トップへ戻る</a></p>`,
);

const baton = page(
  "おやつバトンが回ってきました - ",
  `${BATON}
<div class="entry">
<b>コメント</b>
<div class="comment">さっそく答えてくれてありがとう！ かためのプリン、わかります。<br><font size="1">Posted by みか at 2006年11月17日 21:30</font></div>
</div>
<div class="entry">
<b>トラックバック</b>
<div class="comment"><a href="http://blog.hogespace.example/taro/">おやつバトン（たろうのお部屋ブログ）</a><br><font size="1">Tracked on 2006年11月18日 12:00</font></div>
<div class="comment"><a href="http://blog.hogespace.example/choco/">バトン受け取りました（ちょこっと日記）</a><br><font size="1">Tracked on 2006年11月19日 23:45</font></div>
</div>
${COMMENT_FORM}`,
);

const archive = page(
  "2006年11月のアーカイブ - ",
  `<div class="entry">
<h2>2006年11月のアーカイブ</h2>
<a href="entry1120.html">11月20日　ホットケーキを焼きました</a><br>
<a href="baton.html">11月17日　おやつバトンが回ってきました</a><br>
<a href="entry1115.html">11月15日　駅前のケーキ屋さん</a><br>
11月08日　りんごのコンポート<br>
11月03日　文化の日はクッキー
</div>`,
);

const category = page(
  "カテゴリ「おやつ」 - ",
  `<div class="entry">
<h2>カテゴリ：おやつ</h2>
<a href="entry1120.html">ホットケーキを焼きました</a><br>
<a href="entry1115.html">駅前のケーキ屋さん</a><br>
りんごのコンポート<br>
文化の日はクッキー
</div>`,
);

const profile = page(
  "プロフィール - ",
  `<div class="entry">
<h2>プロフィール</h2>
<img src="photo-me.jpg" width="96" height="96" alt="はなこ" align="left" hspace="8">
<b>はなこ</b><br>
甘いものが好きな会社員です。休みの日はおやつを作ったり、カフェめぐりをしています。<br>
コメント、トラックバックはお気軽にどうぞ。バトンも歓迎です。
<br clear="all">
</div>`,
);

export const pages: readonly SitePage[] = [
  { path: "index.html", html: index },
  { path: "entry1120.html", html: entry1120 },
  { path: "entry1115.html", html: entry1115 },
  { path: "baton.html", html: baton },
  { path: "archive.html", html: archive },
  { path: "category.html", html: category },
  { path: "profile.html", html: profile },
];
