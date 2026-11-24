import type { SitePage } from "@anokoro/shared";

const STYLE = `<style>
body { margin: 0; background-color: #F5F6F7; color: #333333; font-family: sans-serif; font-size: 15px; line-height: 1.7; }
a { color: #0B6BB8; }
header { background-color: #FFFFFF; border-bottom: 3px solid #F08C00; padding: 10px 16px; }
header h1 { margin: 0; font-size: 22px; }
header h1 a { color: #F08C00; text-decoration: none; }
header p { margin: 0; font-size: 12px; color: #888888; }
.container { max-width: 960px; margin: 0 auto; padding: 12px; display: flex; }
.main { flex: 1; margin-right: 16px; }
.side { width: 280px; }
article, .box { background-color: #FFFFFF; border-radius: 6px; box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1); padding: 14px 18px; margin-bottom: 14px; }
article h2 { margin: 0 0 4px 0; font-size: 19px; }
article h2 a { color: #222222; text-decoration: none; }
.meta { font-size: 12px; color: #888888; }
.post { border: 1px solid #E1E8ED; border-radius: 8px; padding: 10px 12px; margin: 10px 0; }
.post .who { font-size: 13px; font-weight: bold; }
.post .who span { font-weight: normal; color: #888888; }
.res { margin: 10px 0; }
.res .name { font-size: 12px; color: #228822; }
.ad { text-align: center; font-size: 11px; color: #999999; margin: 12px 0; }
.box h3 { margin: 0 0 6px 0; font-size: 14px; color: #F08C00; }
.box ul { margin: 0; padding-left: 20px; }
footer { text-align: center; font-size: 12px; color: #888888; padding: 16px; }
@media screen and (max-width: 640px) {
  .container { display: block; }
  .main { margin-right: 0; }
  .side { width: auto; }
}
</style>`;

const SIDE = `<aside class="side">
<div class="box">
<h3>お知らせ</h3>
<a href="notice.html">掲示板のまとめについて</a>
</div>
<div class="box">
<h3>人気の記事</h3>
<ul>
<li><a href="entry-0320.html">雨の日の駅前、みんなの投稿まとめ</a></li>
<li><a href="entry-0315.html">【昔のスレ】はじめて自分で作った料理</a></li>
</ul>
</div>
<div class="box">
<h3>カテゴリ</h3>
<a href="category.html">みんなの投稿</a><br>昔のスレ<br>ニュース
</div>
</aside>`;

const page = (title: string, body: string): string => `<!DOCTYPE html>
<html lang="ja">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${title}ほげほげまとめ</title>
${STYLE}
</head>
<body>
<header>
<h1><a href="index.html">ほげほげまとめ</a></h1>
<p>話題の投稿を、毎日まとめています</p>
</header>
<div class="container">
<div class="main">
${body}
</div>
${SIDE}
</div>
<footer>ほげほげまとめ ｜ <a href="notice.html">掲示板のまとめについて</a></footer>
</body>
</html>
`;

const AD = `<div class="ad">スポンサーリンク<br><img src="bn-ad.gif" width="468" height="60" alt="広告"></div>`;

const post = (name: string, handle: string, text: string): string =>
  `<div class="post"><div class="who">${name} <span>@${handle}</span></div>${text}</div>`;

const summary = (href: string, title: string, date: string, category: string): string =>
  `<article>
<h2><a href="${href}">${title}</a></h2>
<div class="meta">${date} ｜ <a href="category.html">${category}</a></div>
</article>`;

const index = page(
  "",
  `${summary("entry-0320.html", "雨の日の駅前、みんなの投稿まとめ", "2014年03月20日 20:00", "みんなの投稿")}
${summary("entry-0315.html", "【昔のスレ】はじめて自分で作った料理", "2014年03月15日 19:00", "昔のスレ")}
${AD}
${summary("entry-0312.html", "ほげほげ市の新しい駅ビル、春に開業へ", "2014年03月12日 18:00", "ニュース")}`,
);

const entry0320 = page(
  "雨の日の駅前、みんなの投稿まとめ - ",
  `<article>
<h2>雨の日の駅前、みんなの投稿まとめ</h2>
<div class="meta">2014年03月20日 20:00 ｜ <a href="category.html">みんなの投稿</a></div>
<p>短文投稿サービスに公開された、雨の日のようすを集めました。</p>
${post("さくら", "sakura_hoge", "駅前のバス乗り場、傘の行列ができてる")}
${post("ほげ太", "hogeta", "靴の中までびしょびしょ。替えの靴下を買った")}
${AD}
${post("ねこ好き", "neko_suki", "うちのねこ、窓から雨を見てずっと動かない")}
${post("ゆうき", "yuki_bike", "今日は自転車はやめておきます")}
</article>`,
);

const entry0315 = page(
  "【昔のスレ】はじめて自分で作った料理 - ",
  `<article>
<h2>【昔のスレ】はじめて自分で作った料理</h2>
<div class="meta">2014年03月15日 19:00 ｜ 昔のスレ</div>
<p>2011 年のスレッドから、もう一度まとめました。</p>
<div class="res"><div class="name">1：名無しのほげさん：2011/05/14 12:00:01</div>はじめて自分で作った料理ってなに？</div>
<div class="res"><div class="name">3：名無しのほげさん：2011/05/14 12:02:30</div>カップめん（お湯を入れただけ）</div>
<div class="res"><div class="name">6：名無しのほげさん：2011/05/14 12:05:12</div>目玉焼き。黄身がつぶれてスクランブルエッグになった</div>
${AD}
</article>`,
);

const entry0312 = page(
  "ほげほげ市の新しい駅ビル、春に開業へ - ",
  `<article>
<h2>ほげほげ市の新しい駅ビル、春に開業へ</h2>
<div class="meta">2014年03月12日 18:00 ｜ ニュース</div>
<p>ほげほげ新聞によると、駅前の新しい駅ビルが 4 月に開業するそうです。<br>
<a href="http://news.hogehoge.example/2014/03/12/station.html">ほげほげ新聞の記事</a></p>
<p>みんなの反応</p>
${post("ほげ太", "hogeta", "カレー屋さん入るかな")}
${post("さくら", "sakura_hoge", "本屋さんが大きくなるらしい。うれしい")}
${AD}
</article>`,
);

const category = page(
  "カテゴリ「みんなの投稿」 - ",
  `<div class="box">
<h3>カテゴリ：みんなの投稿</h3>
<ul>
<li><a href="entry-0320.html">雨の日の駅前、みんなの投稿まとめ</a>（03月20日）</li>
<li>ホワイトデーのお返し、みんなの投稿まとめ（03月14日）</li>
</ul>
</div>`,
);

const notice = page(
  "掲示板のまとめについて - ",
  `<div class="box">
<h3>掲示板のまとめについて</h3>
<p>匿名掲示板の多くの板で、書き込みの転載が禁止されることになりました。</p>
<p>このため当ブログでは、転載禁止より前のスレッドのまとめと、短文投稿サービスに公開された投稿のまとめに切り替えます。これからもよろしくお願いします。</p>
<p class="meta">2014年03月06日　管理人</p>
</div>`,
);

export const pages: readonly SitePage[] = [
  { path: "index.html", html: index },
  { path: "entry-0320.html", html: entry0320 },
  { path: "entry-0315.html", html: entry0315 },
  { path: "entry-0312.html", html: entry0312 },
  { path: "category.html", html: category },
  { path: "notice.html", html: notice },
];
