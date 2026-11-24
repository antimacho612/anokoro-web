import type { SitePage } from "@anokoro/shared";

const BODY = `<body bgcolor="#EFEFEF" text="#000000" link="#0000FF" vlink="#660099">`;
const name = (sage: boolean): string =>
  sage
    ? `<a href="mailto:sage"><b>名無しさん</b></a>`
    : `<font color="#008000"><b>名無しさん</b></font>`;
const post = (no: number, time: string, body: string, sage = false): string =>
  `<dt>${no} 名前：${name(sage)} 投稿日：${time}
<dd>${body}<br><br>`;
const FORM = `<form>
<input type="submit" value="書き込む"> 名前：<input type="text" name="name" size="19"> E-mail：<input type="text" name="mail" size="19"><br>
<textarea name="body" rows="5" cols="64"></textarea>
</form>`;
const thread = (title: string, posts: string): string => `<html>
<head>
<title>${title}</title>
</head>
${BODY}
<a href="index.html">■掲示板に戻る■</a> <a href="subback.html">スレッド一覧</a>
<hr>
<font size="4" color="#FF0000"><b>${title}</b></font>
<dl>
${posts}
</dl>
<hr>
${FORM}
</body>
</html>
`;
const sub = (path: string, n: number, title: string, count: number): string =>
  `${n}: <a href="${path}">${title} (${count})</a>`;

const THREADS = [
  sub("thread.html", 1, "雑談スレ その34", 412),
  sub("homepage.html", 2, "ホームページ作り相談室 Part8", 236),
  sub("question.html", 3, "初心者質問スレ その21", 87),
  sub("aa.html", 4, "（´・ω・｀）を語るスレ", 151),
];

const index = `<html>
<head>
<title>ほげほげ掲示板＠雑談</title>
</head>
${BODY}
<center><font size="5" color="#FF0000"><b>ほげほげ掲示板＠雑談</b></font><br>
<font size="2">雑談はこちらへどうぞ。荒らしは放置でお願いします。</font></center>
<hr>
<table border="1" cellspacing="7" cellpadding="3" width="95%" bgcolor="#CCFFCC" align="center">
<tr><td><font size="2">
<b>ローカルルール</b><br>
・個人情報を書き込まないこと<br>
・荒らしには反応しないこと（放置が一番）<br>
・くわしくは<a href="rule.html">利用規約</a>を読んでください
</font></td></tr>
</table>
<br>
<font size="2">${THREADS.join("　")}<br>
<a href="subback.html">スレッド一覧はこちら</a>　<a href="kako.html">過去ログ倉庫</a></font>
<hr>
<table border="1" cellspacing="7" cellpadding="3" width="95%" bgcolor="#FFFFFF" align="center">
<tr><td>
<b><font size="4" color="#FF0000">【1:412】雑談スレ その34</font></b>
<dl>
${post(410, "2003/11/18 23:02", "ADSL にしてから、つなぎっぱなしが当たり前になったな")}
${post(411, "2003/11/18 23:05", "&gt;&gt;410 電話代を気にしなくていいのは大きい", true)}
${post(412, "2003/11/18 23:10", "（´・ω・｀）")}
</dl>
<a href="thread.html">全部読む</a> <a href="thread.html">最新50</a> <a href="thread.html">1-100</a>
</td></tr>
</table>
<br>
<table border="1" cellspacing="7" cellpadding="3" width="95%" bgcolor="#FFFFFF" align="center">
<tr><td>
<b><font size="4" color="#FF0000">【2:236】ホームページ作り相談室 Part8</font></b>
<dl>
${post(235, "2003/11/18 22:40", "テーブルじゃなくて CSS で段組みするのって難しくない？")}
${post(236, "2003/11/18 22:51", "&gt;&gt;235 ブラウザごとに表示がずれるから、慣れるまで大変", true)}
</dl>
<a href="homepage.html">全部読む</a> <a href="homepage.html">最新50</a>
</td></tr>
</table>
<hr>
<font size="2"><a href="rule.html">利用規約</a> ｜ この掲示板は見本です。書き込みはできません。</font>
</body>
</html>
`;

const subback = `<html>
<head>
<title>スレッド一覧 - ほげほげ掲示板＠雑談</title>
</head>
${BODY}
<a href="index.html">■掲示板に戻る■</a>
<hr>
<b>スレッド一覧</b>
<p><font size="2">新しく書き込みがあったスレッドが上に来ます。</font></p>
<font size="2">
${THREADS.join("<br>\n")}<br>
5: 今日の晩ごはんを報告するスレ (544)<br>
6: 深夜に起きている人の数 → (98)<br>
7: 昔のゲームを語ろう その5 (320)
</font>
<hr>
<font size="2">古いスレッドは<a href="kako.html">過去ログ倉庫</a>にあります。</font>
</body>
</html>
`;

const threadPage = thread(
  "雑談スレ その34",
  [
    post(
      1,
      "2003/11/10 21:00",
      "前スレが埋まったので立てました。まったりいきましょう。<br>前スレは過去ログ倉庫へ。",
    ),
    post(2, "2003/11/10 21:03", "&gt;&gt;1 乙", true),
    post(3, "2003/11/10 21:15", "2 ゲット……できなかった"),
    post(4, "2003/11/10 21:20", "&gt;&gt;3 （´・ω・｀）ｼｮﾎﾞｰﾝ", true),
    post(410, "2003/11/18 23:02", "ADSL にしてから、つなぎっぱなしが当たり前になったな"),
    post(411, "2003/11/18 23:05", "&gt;&gt;410 電話代を気にしなくていいのは大きい", true),
    post(412, "2003/11/18 23:10", "（´・ω・｀）"),
  ].join("\n"),
);

const homepage = thread(
  "ホームページ作り相談室 Part8",
  [
    post(
      1,
      "2003/10/02 20:00",
      "ホームページ作りの疑問はここで。<br>質問の前に、使っているブラウザとエディタを書くと答えてもらいやすいです。",
    ),
    post(2, "2003/10/02 20:12", "&gt;&gt;1 乙です"),
    post(233, "2003/11/18 21:58", "カウンターって今でも付けたほうがいい？", true),
    post(
      234,
      "2003/11/18 22:05",
      "&gt;&gt;233 好きにすればいい。キリ番の報告がうれしいなら付ければ",
    ),
    post(235, "2003/11/18 22:40", "テーブルじゃなくて CSS で段組みするのって難しくない？"),
    post(
      236,
      "2003/11/18 22:51",
      "&gt;&gt;235 ブラウザごとに表示がずれるから、慣れるまで大変",
      true,
    ),
  ].join("\n"),
);

const question = thread(
  "初心者質問スレ その21",
  [
    post(
      1,
      "2003/11/01 12:00",
      "初心者の質問はこちらへ。<br>回答する人は、やさしく教えてあげてください。",
    ),
    post(85, "2003/11/18 19:22", "名前の欄に何も書かないと「名無しさん」になるの？"),
    post(
      86,
      "2003/11/18 19:30",
      "&gt;&gt;85 そう。E-mail の欄に sage と入れると、スレッドが上に来ないよ",
      true,
    ),
    post(87, "2003/11/18 19:41", "&gt;&gt;86 ありがとう！ やってみます"),
  ].join("\n"),
);

const aa = thread(
  "（´・ω・｀）を語るスレ",
  [
    post(1, "2003/09/20 00:10", "（´・ω・｀）について語るスレです。"),
    post(2, "2003/09/20 00:12", "（´・ω・｀）ｼｮﾎﾞｰﾝ"),
    post(3, "2003/09/20 00:20", "顔文字は、フォントが変わるとくずれるから注意な", true),
    post(150, "2003/11/18 23:30", "（｀・ω・´）ｼｬｷｰﾝ"),
    post(151, "2003/11/18 23:31", "&gt;&gt;150 元気になったｗ"),
  ].join("\n"),
);

const rule = `<html>
<head>
<title>利用規約 - ほげほげ掲示板＠雑談</title>
</head>
${BODY}
<a href="index.html">■掲示板に戻る■</a>
<hr>
<b>■利用規約</b>
<ul>
<li>個人情報を書き込まないでください。
<li>荒らしには反応せず、放置してください。
<li>話題に合ったスレッドに書き込んでください。新しいスレッドを立てる前に、<a href="subback.html">スレッド一覧</a>で同じ話題がないか探してください。
<li>sage 進行にご協力ください。
<li>書き込みの削除は、削除依頼スレッドでお願いします。
</ul>
</body>
</html>
`;

const kako = `<html>
<head>
<title>過去ログ倉庫 - ほげほげ掲示板＠雑談</title>
</head>
${BODY}
<a href="index.html">■掲示板に戻る■</a>
<hr>
<b>■過去ログ倉庫</b>
<p><font size="2">書き込みがいっぱいになったスレッドは、ここに移します。過去ログには書き込めません。</font></p>
<font size="2">
・雑談スレ その33<br>
・雑談スレ その32<br>
・ホームページ作り相談室 Part7<br>
・初心者質問スレ その20
</font>
</body>
</html>
`;

export const pages: readonly SitePage[] = [
  { path: "index.html", html: index },
  { path: "subback.html", html: subback },
  { path: "thread.html", html: threadPage },
  { path: "homepage.html", html: homepage },
  { path: "question.html", html: question },
  { path: "aa.html", html: aa },
  { path: "rule.html", html: rule },
  { path: "kako.html", html: kako },
];
