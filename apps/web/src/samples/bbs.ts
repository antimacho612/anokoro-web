import type { SitePage } from "@anokoro/shared";

const post = (no: number, time: string, body: string): string =>
  `<dt>${no} 名前：<font color="#008000"><b>名無しさん</b></font> 投稿日：${time}
<dd>${body}<br><br>`;

const index = `<html>
<head>
<title>ほげほげ掲示板</title>
</head>
<body bgcolor="#EFEFEF" text="#000000" link="#0000FF" vlink="#660099">
<center><font size="5" color="#FF0000"><b>ほげほげ掲示板</b></font><br>
<font size="2">雑談はこちらへどうぞ。荒らしは放置でお願いします。</font></center>
<hr>
<b>■スレッド一覧</b><br>
<font size="2">
1: <a href="thread.html">雑談スレ その12 (128)</a>
2: <a href="question.html">初心者質問スレ (45)</a>
3: <a href="homepage.html">ホームページ作り相談室 (87)</a>
</font>
<hr>
<table border="1" cellspacing="7" cellpadding="3" width="95%" bgcolor="#FFFFFF">
<tr><td>
<b><font size="4" color="#FF0000">【1:128】雑談スレ その12</font></b>
<dl>
${post(126, "2001/11/18 23:02", "テレホタイムになると重いね")}
${post(127, "2001/11/18 23:05", "&gt;&gt;126 みんな同じこと考えてる")}
${post(128, "2001/11/18 23:10", "（´・ω・｀）")}
</dl>
<a href="thread.html">全部読む</a> <a href="thread.html">最新50</a>
</td></tr>
</table>
<hr>
<font size="2"><a href="rule.html">利用規約</a> ｜ この掲示板は見本です。書き込みはできません。</font>
</body>
</html>
`;

const thread = `<html>
<head>
<title>雑談スレ その12</title>
</head>
<body bgcolor="#EFEFEF" text="#000000" link="#0000FF" vlink="#660099">
<a href="index.html">■掲示板に戻る■</a>
<hr>
<font size="4" color="#FF0000"><b>雑談スレ その12</b></font>
<dl>
${post(1, "2001/11/10 21:00", "前スレが埋まったので立てました。まったりいきましょう。")}
${post(2, "2001/11/10 21:03", "&gt;&gt;1 乙")}
${post(3, "2001/11/10 21:15", "ADSLにしたら速くて感動した")}
</dl>
<hr>
<form>
<input type="submit" value="書き込む"> 名前：<input name="name" size="19"> E-mail：<input name="mail" size="19"><br>
<textarea name="body" rows="5" cols="60"></textarea>
</form>
<font size="2">※見本なので書き込みはできません。</font>
</body>
</html>
`;

const rule = `<html>
<head>
<title>利用規約</title>
</head>
<body bgcolor="#EFEFEF" text="#000000" link="#0000FF" vlink="#660099">
<a href="index.html">■掲示板に戻る■</a>
<hr>
<b>■利用規約</b>
<ul>
<li>個人情報を書き込まないでください。
<li>荒らしには反応せず、放置してください。
<li>話題に合ったスレッドに書き込んでください。
<li>sage 進行にご協力ください。
</ul>
</body>
</html>
`;

export const pages: readonly SitePage[] = [
  { path: "index.html", html: index },
  { path: "thread.html", html: thread },
  { path: "rule.html", html: rule },
];
