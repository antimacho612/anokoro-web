import type { SitePage } from "@anokoro/shared";

const page = (title: string, body: string): string => `<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=Shift_JIS">
<title>${title}</title>
</head>
<body bgcolor="#FFFFFF" text="#333333" link="#FF3399" vlink="#CC3399">
<table width="240" border="0" cellpadding="2" cellspacing="0" align="center"><tr><td>
<font size="2">
${body}
<hr color="#FF99CC">
<center><font size="1">ほげプロフ<br><a href="edit.html">プロフを作る(無料)</a></font></center>
</font>
</td></tr></table>
</body>
</html>
`;

const HEAD = `<center><font color="#FF3399">★ゆいなのプロフ★</font></center>
<hr color="#FF99CC">`;

const qa = (items: readonly (readonly [string, string])[]): string =>
  items.map(([q, a]) => `<font color="#FF3399">${q}</font><br>${a}<br>`).join("\n");

const MENU = `<hr color="#FF99CC">
[1]<a href="index.html" accesskey="1">プロフ(1)</a><br>
[2]<a href="prof2.html" accesskey="2">プロフ(2)</a><br>
[3]<a href="prof3.html" accesskey="3">プロフ(3)</a><br>
[4]<a href="bbs.html" accesskey="4">掲示板</a><br>
[5]<a href="write.html" accesskey="5">掲示板に書く</a>`;

const index = page(
  "ゆいなのプロフ",
  `${HEAD}
見てくれてありがとう♪<br>
掲示板に書いてくれたら絶対返すよ☆
<hr color="#FF99CC">
${qa([
  ["名前", "ゆいな"],
  ["性別", "女"],
  ["誕生日", "8月2日"],
  ["血液型", "O型"],
  ["住んでるところ", "ほげほげ市"],
  ["学年", "中2"],
  ["部活", "吹奏楽部(フルート)"],
  ["好きな食べ物", "いちご、からあげ"],
  ["嫌いな食べ物", "ピーマン"],
  ["好きな色", "ピンク"],
  ["一言", "仲良くしてね♪"],
])}
<font size="1">(1/3)</font>
${MENU}`,
);

const prof2 = page(
  "ゆいなのプロフ(2)",
  `${HEAD}
${qa([
  ["長所", "明るいところ"],
  ["短所", "朝起きられない"],
  ["好きな教科", "音楽"],
  ["嫌いな教科", "数学…"],
  ["好きな動物", "うさぎ"],
  ["好きなテレビ", "音楽番組"],
  ["休みの日は？", "友だちと買い物か、家でごろごろ"],
  ["自分を動物にたとえると？", "ねこってよく言われる"],
  ["宝物", "友だち♪"],
  ["今ほしいもの", "新しいケータイ"],
])}
<font size="1">(2/3)</font>
${MENU}`,
);

const prof3 = page(
  "ゆいなのプロフ(3)",
  `${HEAD}
${qa([
  ["10年後の自分", "音楽の先生になってたい"],
  ["行ってみたい場所", "海外"],
  ["最近うれしかったこと", "部活の発表会がうまくいった"],
  ["最近ハマってること", "プロフ見て回ること"],
  ["このプロフを見た人へ", "掲示板に一言書いてってね☆"],
])}
<font size="1">(3/3) 全部で60問くらいあるよ</font>
${MENU}`,
);

const post = (name: string, date: string, text: string): string =>
  `<font color="#FF3399">${name}</font> <font size="1">${date}</font><br>${text}<br><hr color="#FFCCE5">`;

const bbs = page(
  "ゆいなの掲示板",
  `<center><font color="#FF3399">★ゆいなの掲示板★</font></center>
<hr color="#FF99CC">
[5]<a href="write.html" accesskey="5">書き込む</a>
<hr color="#FF99CC">
${post("まい", "11/03 21:40", 'プロフ見たよ～☆<br>明日の部活がんばろうね♪<br><font color="#999999">&gt;まい 見てくれてありがと！がんばろ～</font>')}
${post("さき", "11/03 19:12", "はじめまして！<br>同じ吹奏楽部です♪<br>うちの学校はクラリネットです！")}
${post("あゆ", "11/02 22:05", "ゆいなのプロフ発見(笑)<br>また学校でね～")}
<font size="1">1-3件目</font>
${MENU}`,
);

const write = page(
  "ゆいなの掲示板に書く",
  `<center><font color="#FF3399">★掲示板に書く★</font></center>
<hr color="#FF99CC">
<form>
名前<br><input type="text" name="name" size="16"><br>
本文<br><textarea name="text" rows="4" cols="16"></textarea><br>
<input type="submit" value="書き込む">
</form>
<font size="1">書き込んだ内容は、だれでも見られます。</font>
${MENU}`,
);

const edit = page(
  "プロフを作る",
  `<center><font color="#FF3399">★プロフを作る★</font></center>
<hr color="#FF99CC">
質問に答えるだけで、自分のプロフができるよ！<br>
答えたくない質問は、空けておいてOK。
<hr color="#FF99CC">
<form>
Q1.名前<br><input type="text" name="q1" size="16"><br>
Q2.誕生日<br><input type="text" name="q2" size="16"><br>
Q3.好きな食べ物<br><input type="text" name="q3" size="16"><br>
Q4.一言<br><input type="text" name="q4" size="16"><br>
<input type="submit" value="次の質問へ">
</form>
<font size="1">質問は全部で60問くらいあります。</font>
${MENU}`,
);

export const pages: readonly SitePage[] = [
  { path: "index.html", html: index },
  { path: "prof2.html", html: prof2 },
  { path: "prof3.html", html: prof3 },
  { path: "bbs.html", html: bbs },
  { path: "write.html", html: write },
  { path: "edit.html", html: edit },
];
