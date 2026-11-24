import type { SitePage } from "@anokoro/shared";

const STYLE = `<style type="text/css">
body { margin: 8px; font-size: 13px; }
td { font-size: 13px; line-height: 140%; }
a { color: #0033CC; }
a:hover { color: #FF3300; }
.box { border: 1px solid #99AACC; }
.head { background-color: #DDE6F5; font-weight: bold; color: #1A3A7A; }
.small { font-size: 11px; color: #555555; }
</style>`;
const SEARCH = `<form>
<input type="text" name="p" size="36"> <input type="submit" value="検索">
<input type="radio" name="t" value="cat" checked>カテゴリ
<input type="radio" name="t" value="web">ウェブ全体
<span class="small">例：<a href="search.html">温泉</a></span>
</form>`;
const page = (title: string, body: string): string => `<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=Shift_JIS">
<title>${title} - ほげほげネット</title>
${STYLE}
</head>
<body bgcolor="#FFFFFF">
<table border="0" cellpadding="2" cellspacing="0" width="100%">
<tr>
<td><a href="index.html"><font size="5" color="#1A3A7A"><b>ほげほげネット</b></font></a></td>
<td align="right">${SEARCH}</td>
</tr>
</table>
<table border="0" cellpadding="4" cellspacing="0" width="100%"><tr><td class="head">
<a href="news.html">ニュース</a> ｜ <a href="weather.html">天気</a> ｜ <a href="mail.html">メール</a> ｜ <a href="auction.html">オークション</a> ｜ <a href="help.html">ヘルプ</a>
</td></tr></table>
<br>
${body}
<hr size="1">
<center class="small"><a href="add.html">サイトの登録</a> ｜ <a href="help.html">ヘルプ</a><br>Copyright (C) 2001 Hogehoge Net Inc. All rights reserved.</center>
</body>
</html>
`;
const site = (name: string, path: string, text: string, mark = ""): string =>
  `<li><a href="http://www.hogespace.example/${path}/">${name}</a>${mark} - ${text}`;
const OSUSUME = ` <img src="mark-osusume.gif" width="48" height="16" alt="おすすめ">`;
const category = (name: string, subs: string): string =>
  `<b>${name}</b><br><span class="small">${subs}</span>`;

const index = `<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=Shift_JIS">
<title>ほげほげネット</title>
${STYLE}
</head>
<body bgcolor="#FFFFFF">
<center>
<font size="6" color="#1A3A7A"><b>ほげほげネット</b></font><br>
<span class="small">さがす、読む、つながる。インターネットの入口</span>
${SEARCH}
<table border="0" cellpadding="0" cellspacing="6" width="760">
<tr>
<td valign="top" width="130">
<table class="box" border="0" cellpadding="4" cellspacing="0" width="100%">
<tr><td class="head">サービス</td></tr>
<tr><td>
<img src="icon-book.gif" width="16" height="16" alt=""> <a href="news.html">ニュース</a><br>
<img src="icon-ball.gif" width="16" height="16" alt=""> <a href="weather.html">天気</a><br>
<img src="icon-pen.gif" width="16" height="16" alt=""> <a href="mail.html">無料メール</a><br>
<img src="icon-home.gif" width="16" height="16" alt=""> <a href="auction.html">オークション</a> <img src="new.gif" width="38" height="14" alt="NEW">
</td></tr>
</table>
</td>
<td valign="top">
<table class="box" border="0" cellpadding="6" cellspacing="0" width="100%">
<tr><td class="head" colspan="2">カテゴリ</td></tr>
<tr>
<td valign="top" width="50%">
<b><a href="hobby.html">趣味とスポーツ</a></b><br><span class="small">旅行、音楽、ゲーム、釣り...</span><br><br>
${category("コンピュータとインターネット", "ソフトウェア、ホームページ作成...")}<br><br>
${category("ビジネスと経済", "企業、ショッピング...")}
</td>
<td valign="top" width="50%">
${category("地域情報", "都道府県、観光、グルメ...")}<br><br>
${category("芸術と人文", "文学、写真、美術館...")}<br><br>
<b><a href="news.html">ニュース</a>と<a href="weather.html">天気</a></b><br><span class="small">新聞、テレビ、天気予報...</span>
</td>
</tr>
</table>
</td>
<td valign="top" width="200">
<table class="box" border="0" cellpadding="4" cellspacing="0" width="100%">
<tr><td class="head">ニュース <span class="small">10月15日 9時更新</span></td></tr>
<tr><td>
・<a href="news.html">ほげほげ空港、新しい国際線が就航</a><br>
・<a href="news.html">ほげほげ市の人口、30 万人を突破</a><br>
・<a href="news.html">高校野球、ほげほげ商が初優勝</a>
</td></tr>
<tr><td class="head">今日の天気</td></tr>
<tr><td><a href="weather.html">ほげほげ市</a>：晴れのちくもり　22℃／14℃</td></tr>
</table>
</td>
</tr>
</table>
</center>
<hr size="1">
<center class="small"><a href="add.html">サイトの登録</a> ｜ <a href="help.html">ヘルプ</a><br>Copyright (C) 2001 Hogehoge Net Inc. All rights reserved.</center>
</body>
</html>
`;

const hobby = page(
  "趣味とスポーツ",
  `<span class="small"><a href="index.html">トップ</a> &gt; 趣味とスポーツ</span>
<table class="box" border="0" cellpadding="6" cellspacing="0" width="100%">
<tr><td class="head">カテゴリ</td></tr>
<tr><td>
旅行 (4,812)　音楽 (9,330)　ゲーム (12,075)　釣り (1,486)　アウトドア (2,203)　ペット (3,917)
</td></tr>
<tr><td class="head">登録サイト</td></tr>
<tr><td>
<ul>
${site("ほげほげ温泉ナビ", "onsen", "全国の日帰り温泉をクチコミつきで紹介", OSUSUME)}
${site("日曜釣り師", "tsuri", "近所の川での釣果報告")}
${site("☆ねこまるの部屋☆", "nekomaru", "ねこと音楽と日記のホームページ")}
${site("アウトドア入門", "outdoor", "キャンプ道具のそろえ方")}
</ul>
</td></tr>
</table>
<p class="small">このカテゴリに載せたいサイトがあれば、<a href="add.html">サイトの登録</a>からお知らせください。</p>`,
);

const search = page(
  "「温泉」の検索結果",
  `<b>「温泉」の検索結果</b>
<table class="box" border="0" cellpadding="6" cellspacing="0" width="100%">
<tr><td class="head">カテゴリ（3 件）</td></tr>
<tr><td>
<a href="hobby.html">趣味とスポーツ</a> &gt; 旅行 &gt; 温泉<br>
地域情報 &gt; ほげほげ県 &gt; 観光 &gt; 温泉<br>
ビジネスと経済 &gt; 企業 &gt; 旅館とホテル
</td></tr>
<tr><td class="head">登録サイト（2 件）</td></tr>
<tr><td>
<ul>
${site("ほげほげ温泉ナビ", "onsen", "全国の日帰り温泉をクチコミつきで紹介", OSUSUME)}
${site("ほげほげ温泉郷 観光協会", "onsenkyo", "宿の一覧と、季節の催し")}
</ul>
</td></tr>
<tr><td class="head">ウェブページ（12,480 件中 1〜3 件目）</td></tr>
<tr><td>
<a href="http://www.hogespace.example/yu/diary/0912.html">湯けむり日記 9 月 12 日</a><br>
<span class="small">…週末は山あいの温泉へ。露天風呂から紅葉がよく見えました…</span><br>
<a href="http://www.hogehoge.example/ryokan/">旅館ほげの湯</a><br>
<span class="small">…源泉かけ流しの温泉と、地元の食材の料理でおもてなし…</span><br>
<a href="http://www.hogespace.example/kenko/onsen.html">温泉の入り方 10 か条</a><br>
<span class="small">…温泉に入る前には、水を一杯飲んで…</span>
</td></tr>
</table>
<p class="small">カテゴリと登録サイトで見つからないときは、検索窓の下の「ウェブ全体」を選ぶと、ウェブページの中のことばからも探します。</p>`,
);

const news = page(
  "ニュース",
  `<table class="box" border="0" cellpadding="6" cellspacing="0" width="100%">
<tr><td class="head">国内</td></tr>
<tr><td>
・ほげほげ空港、新しい国際線が就航（10月15日 8時）<br>
・ほげほげ市の人口、30 万人を突破（10月14日 17時）
</td></tr>
<tr><td class="head">経済</td></tr>
<tr><td>
・ほげほげ銀行、インターネットでの振り込みを始める（10月15日 7時）
</td></tr>
<tr><td class="head">スポーツ</td></tr>
<tr><td>
・高校野球、ほげほげ商が初優勝（10月14日 18時）
</td></tr>
</table>
<p class="small">記事は各新聞社と通信社から提供を受けています。</p>`,
);

const weather = page(
  "天気",
  `<table class="box" border="1" cellpadding="6" cellspacing="0" width="100%">
<tr class="head"><td>地域</td><td>今日</td><td>最高／最低</td><td>降水確率</td><td>明日</td></tr>
<tr><td>ほげほげ市</td><td>晴れのちくもり</td><td>22℃／14℃</td><td>20%</td><td>雨</td></tr>
<tr><td>ふがふが市</td><td>くもり</td><td>19℃／12℃</td><td>40%</td><td>雨のちくもり</td></tr>
<tr><td>ぴよぴよ町</td><td>晴れ</td><td>24℃／15℃</td><td>10%</td><td>晴れ</td></tr>
</table>
<p class="small">10月15日 5時発表</p>`,
);

const mail = page(
  "無料メール",
  `<b>ほげほげネット メール</b>
<p>
ブラウザから読み書きできる、無料のメールです。<br>
学校や会社、まんが喫茶など、どこのパソコンからでも自分のメールが読めます。
</p>
<ul>
<li>登録は無料。名前とメールアドレスを決めるだけ
<li>プロバイダを変えても、アドレスはそのまま
<li>ほげほげネットのオークションにも、このアドレスで参加できます
</ul>
<form><input type="submit" value="無料で登録する"></form>`,
);

const auction = page(
  "オークション",
  `<b>ほげほげネット オークション</b> <img src="new.gif" width="38" height="14" alt="NEW">
<p class="small">使わなくなったものを出品したり、ほしいものを入札したり。個人どうしで売り買いできます。</p>
<table class="box" border="1" cellpadding="6" cellspacing="0" width="100%">
<tr class="head"><td>商品</td><td>現在の価格</td><td>入札</td><td>残り時間</td></tr>
<tr><td>ゲーム機（箱と説明書あり）</td><td>8,500 円</td><td>14</td><td>1 日</td></tr>
<tr><td>ほげほげ社の電気ポット</td><td>1,200 円</td><td>3</td><td>3 時間</td></tr>
<tr><td>鉄道写真の写真集 10 冊</td><td>3,000 円</td><td>6</td><td>2 日</td></tr>
</table>
<p class="small">参加には <a href="mail.html">ほげほげネット メール</a>のアドレスが必要です。</p>`,
);

const add = page(
  "サイトの登録",
  `<b>サイトの登録</b>
<p>
ほげほげネットのカテゴリに載せたいサイトを、このフォームからお知らせください。<br>
編集部がサイトを一つずつ拝見して、掲載するかを決めます。審査には 2〜3 週間かかります。<br>
掲載しなかった場合のご連絡はしていません。ご了承ください。
</p>
<form>
<table class="box" border="0" cellpadding="6" cellspacing="0">
<tr><td class="head">サイト名</td><td><input type="text" name="title" size="40"></td></tr>
<tr><td class="head">URL</td><td><input type="text" name="url" size="40" value="http://"></td></tr>
<tr><td class="head">カテゴリ</td><td><input type="text" name="category" size="40"></td></tr>
<tr><td class="head">紹介文（50 字まで）</td><td><textarea name="comment" cols="40" rows="3"></textarea></td></tr>
<tr><td class="head">連絡先メール</td><td><input type="text" name="email" size="40"></td></tr>
</table>
<p><input type="submit" value="申請する"></p>
</form>`,
);

const help = page(
  "ヘルプ",
  `<b>ほげほげネットで探す</b>
<p>
<b>カテゴリ</b>：編集部が選んで分類したサイトから探します。分野がはっきりしているときに向いています。<br>
<b>ウェブ全体</b>：ロボットが集めたウェブページの中身から探します。カテゴリに載っていないページも見つかります。<br>
検索窓の下で、どちらから探すかを選べます。<br><br>
<img src="mark-osusume.gif" width="48" height="16" alt="おすすめ"> の印は、編集部のおすすめです。
</p>`,
);

export const pages: readonly SitePage[] = [
  { path: "index.html", html: index },
  { path: "hobby.html", html: hobby },
  { path: "search.html", html: search },
  { path: "news.html", html: news },
  { path: "weather.html", html: weather },
  { path: "mail.html", html: mail },
  { path: "auction.html", html: auction },
  { path: "add.html", html: add },
  { path: "help.html", html: help },
];
