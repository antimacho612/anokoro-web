import type { SitePage } from "@anokoro/shared";

const style = (extra: string): string => `<style type="text/css">
body { margin: 0; background-color: #FFF6EE; color: #444444; font-size: 12px; }
#banner { background-color: #E08060; color: #FFFFFF; padding: 18px; font-size: 20px; font-weight: bold; }
#banner a { color: #FFFFFF; text-decoration: none; }
.entry { background-color: #FFFFFF; border: 1px solid #F0C8B0; padding: 10px; margin-bottom: 12px; }
h2 { font-size: 14px; color: #C05030; margin: 0 0 6px; }
${extra}
</style>`;

const head = (title: string, extra: string): string => `<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title>${title}</title>
${style(extra)}
</head>`;

const banner = `<div id="banner"><a href="index.html">はなこのおやつ日和</a></div>`;

const index = `<html>
${head(
  "はなこのおやつ日和",
  `#content { width: 500px; float: left; padding: 12px; }
#side { margin-left: 536px; padding: 12px; }
.posted { font-size: 10px; color: #888888; text-align: right; }
.sidebox { background-color: #FFFFFF; border: 1px solid #F0C8B0; padding: 6px; margin-bottom: 10px; }`,
)}
<body>
${banner}
<div id="content">
<div class="entry">
<h2>2006年11月20日 ホットケーキを焼きました</h2>
ふわふわに焼けました。メープルシロップをたっぷりかけて、日曜の朝ごはんにしました。
<div class="posted">投稿者 はなこ 21:40 ｜ <a href="entry1120.html">コメント (2)</a> ｜ <a href="entry1120.html">トラックバック (1)</a></div>
</div>
<div class="entry">
<h2>2006年11月15日 駅前のケーキ屋さん</h2>
モンブランがおいしかったです。また行きたいです。
<div class="posted">投稿者 はなこ 22:15 ｜ コメント (0) ｜ トラックバック (0)</div>
</div>
</div>
<div id="side">
<div class="sidebox"><b>プロフィール</b><br><a href="profile.html">はなこ</a><br>甘いものが好きな会社員です。</div>
<div class="sidebox"><b>最近の記事</b><br><a href="entry1120.html">ホットケーキを焼きました</a><br>駅前のケーキ屋さん</div>
<div class="sidebox"><b>カテゴリ</b><br>おやつ (24)<br>カフェ (9)</div>
</div>
</body>
</html>
`;

const entry = `<html>
${head(
  "ホットケーキを焼きました - はなこのおやつ日和",
  `#content { width: 500px; padding: 12px; }
.comment { border-top: 1px dotted #F0C8B0; padding: 6px 0; }`,
)}
<body>
${banner}
<div id="content">
<div class="entry">
<h2>2006年11月20日 ホットケーキを焼きました</h2>
ふわふわに焼けました。メープルシロップをたっぷりかけて、日曜の朝ごはんにしました。<br>
焼くときは弱火でじっくり、がコツみたいです。
</div>
<div class="entry">
<b>コメント</b>
<div class="comment">おいしそう！今度まねしてみます。<br><font size="1">Posted by みか at 2006年11月20日 22:01</font></div>
<div class="comment">ふわふわですね～。<br><font size="1">Posted by たろう at 2006年11月21日 08:12</font></div>
</div>
<div class="entry">
<b>トラックバック</b>
<div class="comment">日曜の朝ごはん（さくらの台所日記）<br><font size="1">Tracked on 2006年11月21日 10:30</font></div>
</div>
<a href="index.html">« トップへ戻る</a>
</div>
</body>
</html>
`;

const profile = `<html>
${head("プロフィール - はなこのおやつ日和", "#content { width: 500px; padding: 12px; }")}
<body>
${banner}
<div id="content">
<div class="entry">
<b>はなこ</b><br>
甘いものが好きな会社員です。休みの日はおやつを作ったり、カフェめぐりをしています。<br>
コメント、トラックバックはお気軽にどうぞ。
</div>
<p><a href="index.html">« トップへ戻る</a></p>
</div>
</body>
</html>
`;

export const pages: readonly SitePage[] = [
  { path: "index.html", html: index },
  { path: "entry1120.html", html: entry },
  { path: "profile.html", html: profile },
];
