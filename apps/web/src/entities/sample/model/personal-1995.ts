import type { SitePage } from "@anokoro/shared";

const BODY = `<body bgcolor="#C0C0C0" text="#000000" link="#0000EE" vlink="#551A8B">`;
const FOOTER = `<hr>
<a href="index.html">もくじへ戻る</a>
</body>
</html>
`;

const index = `<html>
<head>
<title>ほげ太のホームページ</title>
</head>
${BODY}
<h1>ほげ太のホームページ</h1>
<p>
ようこそ。ここは、ほげほげ大学 工学部 3 年の ほげ太 が作っている個人のページです。<br>
研究室の計算機を借りて、1995 年 11 月 23 日に公開しました。
</p>
<hr>
<h2>もくじ</h2>
<ul>
<li><a href="profile.html">自己紹介</a>
<li><a href="hobby.html">趣味の部屋（鉄道と写真）</a>
<li><a href="book.html">最近読んだ本</a>
<li><a href="link.html">お気に入りのページ</a>
<li><a href="whatsnew.html">更新の記録</a>
</ul>
<hr>
<h2>お知らせ</h2>
<p>
<img src="koji.gif" width="120" height="40" alt="工事中"><br>
趣味の部屋はまだ工事中です。写真を取り込むのに時間がかかっています。
</p>
<hr>
<p>
<font size="2">
日本語が読めないときは、ブラウザの文字コードを「日本語（自動判別）」にしてみてください。<br>
感想やまちがいの指摘は、メールでいただけるとうれしいです。
</font>
</p>
<address>
ほげ太 / <a href="mailto:hogeta@hogehoge.example">hogeta@hogehoge.example</a>
</address>
</body>
</html>
`;

const profile = `<html>
<head>
<title>自己紹介 - ほげ太のホームページ</title>
</head>
${BODY}
<h1>自己紹介</h1>
<img src="photo-me.jpg" width="96" height="96" alt="ほげ太の写真" align="left" hspace="8">
<p>
はじめまして。ほげ太です。<br>
ほげほげ大学の工学部で、通信の勉強をしています。
</p>
<br clear="all">
<table border="1" cellpadding="4">
<tr><th>名前</th><td>ほげ太（本名はないしょ）</td></tr>
<tr><th>生まれ</th><td>1974 年、ほげほげ県</td></tr>
<tr><th>好きなもの</th><td>鉄道、写真、カレーライス</td></tr>
<tr><th>使っている機械</th><td>研究室のワークステーションと、家のパソコン（モデムは 14.4kbps）</td></tr>
</table>
<h2>インターネットをはじめたきっかけ</h2>
<p>
研究室の先輩に「世界中のページが見られるぞ」と教えてもらったのが始まりです。<br>
最初に見たのは海外の大学のページでした。文字と写真が少しずつ表示されるのを、ずっと眺めていました。<br>
自分でも何か出してみたくなって、HTML の本を読みながらこのページを作りました。
</p>
${FOOTER}`;

const hobby = `<html>
<head>
<title>趣味の部屋 - ほげ太のホームページ</title>
</head>
${BODY}
<h1>趣味の部屋（鉄道と写真）</h1>
<p>
休みの日は、カメラを持ってローカル線に乗りに行きます。<br>
撮った写真をスキャナで取り込んで、少しずつ載せていきます。
</p>
<h2>海の見える駅</h2>
<img src="photo-sea.jpg" width="160" height="120" alt="海の写真"><br>
夏に行った、海沿いの小さな駅のそばの景色です。1 時間に 1 本しか列車が来ません。
<h2>線路わきの花</h2>
<img src="photo-flower.jpg" width="160" height="120" alt="花の写真"><br>
列車を待つあいだに撮りました。
<hr>
<p>
<img src="koji.gif" width="120" height="40" alt="工事中"><br>
写真は 1 枚 8KB くらいまで小さくしています。モデムの方にも見てもらいたいので、これ以上は増やしません。
</p>
${FOOTER}`;

const book = `<html>
<head>
<title>最近読んだ本 - ほげ太のホームページ</title>
</head>
${BODY}
<h1>最近読んだ本</h1>
<dl>
<dt><b>『はじめての HTML』</b>
<dd>このページを作るときに読みました。タグの意味がひととおり載っていて、手元に置いています。
<dt><b>『ローカル線の旅 全国版』</b>
<dd>時刻表とにらめっこしながら、次の旅の計画を立てています。
<dt><b>『計算機ネットワーク入門』</b>
<dd>授業の教科書です。難しいけれど、ページが届くしくみが少しわかりました。
</dl>
<p>
おすすめの本があったら、メールで教えてください。
</p>
${FOOTER}`;

const link = `<html>
<head>
<title>お気に入りのページ - ほげ太のホームページ</title>
</head>
${BODY}
<h1>お気に入りのページ</h1>
<p>よく見に行くページです。</p>
<ul>
<li><a href="http://www.hogehoge.example/">ほげほげ大学</a> - 大学の案内のページ
<li><a href="http://www.netsurfer.example/">ネットサーファー</a> - このページを見ているブラウザ
<li><a href="http://www.hogespace.example/tetsudo/">鉄道写真の部屋</a> - きれいな写真がたくさんあります
<li><a href="http://www.hogehoge.example/weather/">ほげほげ天気</a> - 出かける前に見ます
</ul>
<p>
<font size="2">このページにリンクするときは、メールで一言くださるとうれしいです。</font>
</p>
${FOOTER}`;

const whatsnew = `<html>
<head>
<title>更新の記録 - ほげ太のホームページ</title>
</head>
${BODY}
<h1>更新の記録</h1>
<ul>
<li>1995/12/17　「最近読んだ本」を作りました
<li>1995/12/10　「お気に入りのページ」に 2 件足しました
<li>1995/12/03　自己紹介に写真を載せました
<li>1995/11/23　ホームページを公開しました
</ul>
${FOOTER}`;

export const pages: readonly SitePage[] = [
  { path: "index.html", html: index },
  { path: "profile.html", html: profile },
  { path: "hobby.html", html: hobby },
  { path: "book.html", html: book },
  { path: "link.html", html: link },
  { path: "whatsnew.html", html: whatsnew },
];
