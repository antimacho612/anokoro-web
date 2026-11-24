import type { SitePage } from "@anokoro/shared";

const BODY = `<body bgcolor="#FFFFFF" text="#000000" link="#0000CC" vlink="#551A8B">`;
const SEARCH = `<form>
<input type="text" name="q" size="30"> <input type="submit" value="検索"><br>
<font size="2">例：<a href="search.html">釣り</a></font>
</form>`;
const page = (title: string, path: string, body: string): string => `<html>
<head>
<title>${title} - ほげほげサーチ</title>
</head>
${BODY}
<font size="2"><a href="index.html">ほげほげサーチ</a> : ${path}</font>
<hr>
${body}
<hr>
<center>${SEARCH}</center>
<font size="2">[<a href="index.html">トップ</a>] [<a href="news.html">ニュースと天気</a>] [<a href="help.html">使い方</a>] [<a href="about.html">ほげほげサーチについて</a>]</font>
</body>
</html>
`;
const site = (name: string, path: string, text: string, mark = ""): string =>
  `<li><a href="http://www.hogespace.example/${path}/">${name}</a>${mark} - ${text}`;
const OSUSUME = ` <img src="mark-osusume.gif" width="48" height="16" alt="おすすめ">`;

const index = `<html>
<head>
<title>ほげほげサーチ</title>
</head>
${BODY}
<center>
<font size="7" color="#006633"><b>ほげほげサーチ</b></font><br>
<font size="2">日本語のホームページを、キーワードとジャンルで探せます</font>
${SEARCH}
<table border="1" cellpadding="8" cellspacing="0" width="560">
<tr bgcolor="#DDEEDD">
<td width="50%"><b><a href="computer.html">コンピュータとインターネット</a></b><br><font size="2">パソコン、通信、ホームページの作り方</font></td>
<td width="50%"><b><a href="hobby.html">趣味とスポーツ</a></b><br><font size="2">釣り、鉄道、音楽、野球</font></td>
</tr>
<tr bgcolor="#DDEEDD">
<td><b><a href="area.html">地域の情報</a></b><br><font size="2">都道府県、市町村、観光</font></td>
<td><b><a href="news.html">ニュースと天気</a></b> <img src="new.gif" width="38" height="14" alt="NEW"><br><font size="2">今日のできごと、全国の天気</font></td>
</tr>
</table>
<p><font size="2">登録しているホームページ：15,214 件（1996年11月1日現在）</font></p>
<font size="2">[<a href="help.html">使い方</a>] [<a href="about.html">ほげほげサーチについて</a>]</font>
</center>
</body>
</html>
`;

const computer = page(
  "コンピュータとインターネット",
  "コンピュータとインターネット",
  `<h2>コンピュータとインターネット</h2>
<b>ジャンル</b>
<ul>
<li>ホームページの作り方 (48)
<li>パソコン通信 (126)
<li>ソフトウェア (312)
</ul>
<b>ホームページ</b>
<ul>
${site("はじめての HTML 教室", "html", "タグの意味を一つずつ。初めての人向け", OSUSUME)}
${site("ほげほげ大学 計算機センター", "keisan", "利用案内と、ネットワークの使い方")}
${site("モデムの部屋", "modem", "モデムの設定と、つながらないときの対処")}
</ul>`,
);

const hobby = page(
  "趣味とスポーツ",
  "趣味とスポーツ",
  `<h2>趣味とスポーツ</h2>
<b>ジャンル</b>
<ul>
<li>釣り (31)
<li>鉄道 (57)
<li>音楽 (204)
<li>野球 (88)
</ul>
<b>ホームページ</b>
<ul>
${site("日曜釣り師", "tsuri", "近くの川と海での釣りの記録", OSUSUME)}
${site("ほげ太のホームページ", "hogeta", "鉄道と写真の趣味の部屋")}
${site("ローカル線の旅", "local", "全国のローカル線の乗りある記")}
</ul>`,
);

const area = page(
  "地域の情報",
  "地域の情報",
  `<h2>地域の情報</h2>
<b>都道府県</b>
<ul>
<li>ほげほげ県 (42)
<li>ふがふが県 (17)
</ul>
<b>ホームページ</b>
<ul>
${site("ほげほげ市 観光案内", "kanko", "名所と祭りの紹介", OSUSUME)}
${site("ほげほげ商店街", "shotengai", "商店街のお店の紹介と、売り出しのお知らせ")}
</ul>`,
);

const search = page(
  "「釣り」の検索結果",
  "検索結果",
  `<h2>「釣り」の検索結果</h2>
<b>一致したジャンル（1 件）</b>
<ul>
<li><a href="hobby.html">趣味とスポーツ</a> : 釣り
</ul>
<b>一致したホームページ（3 件）</b>
<ul>
${site("日曜釣り師", "tsuri", "近くの川と海での釣りの記録", OSUSUME)}
${site("ほげほげ渓流会", "keiryu", "渓流釣りの仲間の集まり")}
${site("釣り船 ほげ丸", "hogemaru", "ほげほげ港から出る釣り船の案内")}
</ul>`,
);

const news = page(
  "ニュースと天気",
  "ニュースと天気",
  `<h2>ニュースと天気</h2>
<b>今日のニュース（11月1日）</b>
<ul>
<li>ほげほげ市で秋祭り、3 日間で 5 万人
<li>ほげほげ線に新しい駅、来年春に開業
<li>ほげほげ県の米、今年は豊作の見込み
</ul>
<b>全国の天気</b>
<table border="1" cellpadding="4" cellspacing="0">
<tr bgcolor="#DDEEDD"><th>地方</th><th>今日</th><th>明日</th></tr>
<tr><td>北のほう</td><td>くもり</td><td>雪</td></tr>
<tr><td>まんなか</td><td>晴れ</td><td>晴れ</td></tr>
<tr><td>南のほう</td><td>雨</td><td>くもり</td></tr>
</table>`,
);

const help = page(
  "使い方",
  "使い方",
  `<h2>使い方</h2>
<b>キーワードで探す</b>
<p>知りたいことばを入れて「検索」を押してください。ジャンルの名前と、ホームページの名前と紹介文から探します。</p>
<b>ジャンルでたどる</b>
<p>トップページのジャンルを選び、さらに細かいジャンルへと順にたどってください。ことばが思いつかないときに便利です。</p>
<b>検索のこつ</b>
<p>ことばは短めに入れてください。見つからないときは、別の言い方でも試してみてください。</p>`,
);

const about = page(
  "ほげほげサーチについて",
  "ほげほげサーチについて",
  `<h2>ほげほげサーチについて</h2>
<p>
ほげほげサーチは、日本語のホームページを探すための案内所です。<br>
載せるホームページは、編集の担当者が一つずつ見て、ジャンルに分けています。<br>
ホームページの数は毎日増えていて、まだすべてを載せることはできていません。
</p>
<p>
<img src="mark-osusume.gif" width="48" height="16" alt="おすすめ"> は、担当者が特におもしろいと思ったホームページの印です。
</p>
<p><font size="2">ご意見は <a href="mailto:info@hogesearch.example">info@hogesearch.example</a> まで。</font></p>`,
);

export const pages: readonly SitePage[] = [
  { path: "index.html", html: index },
  { path: "computer.html", html: computer },
  { path: "hobby.html", html: hobby },
  { path: "area.html", html: area },
  { path: "search.html", html: search },
  { path: "news.html", html: news },
  { path: "help.html", html: help },
  { path: "about.html", html: about },
];
