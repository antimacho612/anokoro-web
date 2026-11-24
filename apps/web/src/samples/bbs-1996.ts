import type { SitePage } from "@anokoro/shared";

const BODY = `<body bgcolor="#FFFFF0" text="#000000" link="#0000CC" vlink="#663399">`;
const MENU = `<font size="2">[<a href="index.html">会議室の一覧</a>] [<a href="post.html">発言する</a>] [<a href="help.html">使い方</a>] [<a href="rule.html">会議室のお約束</a>]</font>`;
const page = (title: string, body: string): string => `<html>
<head>
<title>${title} - ほげほげ Web 会議室</title>
</head>
${BODY}
${MENU}
<hr>
${body}
<hr>
${MENU}
</body>
</html>
`;
const row = (no: string, title: string, name: string, time: string, href = ""): string =>
  `<tr><td align="right">${no}</td><td>${href ? `<a href="${href}">${title}</a>` : title}</td><td>${name}</td><td>${time}</td></tr>`;
const LIST_HEAD = `<table border="1" cellpadding="3" cellspacing="0" width="100%">
<tr bgcolor="#DDDDBB"><th>番号</th><th>題名</th><th>ハンドル名</th><th>日時</th></tr>`;

const index = `<html>
<head>
<title>ほげほげ Web 会議室</title>
</head>
${BODY}
<center>
<font size="6"><b>ほげほげ Web 会議室</b></font><br>
<font size="2">パソコン通信の会議室のように、話題ごとの部屋で発言できます</font>
</center>
<hr>
<b>■お知らせ</b>
<ul>
<li>1996/11/01 「趣味の会議室」を開きました <img src="new.gif" width="38" height="14" alt="NEW">
<li>1996/10/15 ほげほげ Web 会議室を始めました
</ul>
<b>■会議室の一覧</b>
<table border="1" cellpadding="4" cellspacing="0" width="100%">
<tr bgcolor="#DDDDBB"><th>会議室</th><th>内容</th><th>発言数</th><th>最後の発言</th></tr>
<tr><td><a href="pc.html">パソコン初心者の会議室</a></td><td>パソコンとインターネットの、はじめの一歩</td><td align="right">48</td><td>1996/11/12 23:41</td></tr>
<tr><td><a href="hobby.html">趣味の会議室</a></td><td>釣り、鉄道、音楽など、趣味の話ならなんでも</td><td align="right">17</td><td>1996/11/12 22:05</td></tr>
</table>
<p>
<font size="2">
はじめての方は、<a href="help.html">使い方</a>と<a href="rule.html">会議室のお約束</a>を読んでから発言してください。<br>
発言はだれでも読めます。電話番号や住所は書かないでください。
</font>
</p>
<hr>
${MENU}
</body>
</html>
`;

const pc = page(
  "パソコン初心者の会議室",
  `<font size="5"><b>パソコン初心者の会議室</b></font><br>
<font size="2">パソコンとインターネットの、はじめの一歩を話しましょう。</font>
${LIST_HEAD}
${row("0048", "Re: モデムがつながりません", "ほげ子", "1996/11/12 23:41", "msg.html")}
${row("0047", "Re: モデムがつながりません", "つうしん太郎", "1996/11/12 22:58", "msg.html")}
${row("0046", "モデムがつながりません", "はじめて", "1996/11/12 21:30", "msg.html")}
${row("0045", "ホームページの作り方の本", "ほげ太", "1996/11/11 20:12")}
${row("0044", "Re: 日本語が化けます", "シスオペ", "1996/11/10 09:03")}
${row("0043", "日本語が化けます", "ねこ好き", "1996/11/09 23:55")}
</table>
<p><font size="2">古い発言は 1 か月ごとにまとめて残しています。</font></p>`,
);

const msg = page(
  "モデムがつながりません",
  `<font size="2"><a href="pc.html">パソコン初心者の会議室</a> の発言</font>
<pre>
番号 0046  題名 モデムがつながりません
ハンドル名 はじめて  1996/11/12 21:30

はじめまして。先週パソコンを買ったばかりです。
説明書のとおりにつないだのですが、ダイヤルの音がしたあと
「ピーガー」と鳴って、そのまま切れてしまいます。
どこを見ればいいでしょうか。
</pre>
<hr>
<pre>
番号 0047  題名 Re: モデムがつながりません
ハンドル名 つうしん太郎  1996/11/12 22:58

&gt; 「ピーガー」と鳴って、そのまま切れてしまいます。

つながりかけてはいるようです。プロバイダの電話番号と、
ユーザー名の書きまちがいがないか、もう一度見てみてください。
</pre>
<hr>
<pre>
番号 0048  題名 Re: モデムがつながりません
ハンドル名 ほげ子  1996/11/12 23:41

わたしも最初、同じでした。ユーザー名の大文字と小文字を
まちがえていました。夜 11 時すぎは混んでいて、話し中に
なることもあるので、時間をずらすのもおすすめです。
</pre>
<p>[<a href="pc.html">発言の一覧へ</a>] [<a href="post.html">この発言に返事を書く</a>]</p>`,
);

const hobby = page(
  "趣味の会議室",
  `<font size="5"><b>趣味の会議室</b></font><br>
<font size="2">釣り、鉄道、音楽など、趣味の話ならなんでもどうぞ。</font>
${LIST_HEAD}
${row("0017", "Re: 冬の渓流", "日曜釣り師", "1996/11/12 22:05")}
${row("0016", "冬の渓流", "やまめ", "1996/11/12 19:40")}
${row("0015", "ローカル線の写真", "ほげ太", "1996/11/10 21:18")}
${row("0014", "好きな曲を教えてください", "ぴあの", "1996/11/08 23:02")}
</table>
<p><font size="2">新しい話題は、<a href="post.html">発言する</a>から題名をつけて書いてください。</font></p>`,
);

const post = page(
  "発言する",
  `<font size="5"><b>発言する</b></font>
<form>
<table border="0" cellpadding="3">
<tr><td>会議室</td><td>
<select name="room"><option>パソコン初心者の会議室</option><option>趣味の会議室</option></select>
</td></tr>
<tr><td>ハンドル名</td><td><input type="text" name="handle" size="20"></td></tr>
<tr><td>題名</td><td><input type="text" name="title" size="40"></td></tr>
<tr><td valign="top">本文</td><td><textarea name="body" rows="8" cols="60"></textarea></td></tr>
</table>
<input type="submit" value="発言する"> <input type="reset" value="書き直す">
</form>
<p><font size="2">ほかの発言への返事は、題名に「Re:」をつけてください。</font></p>`,
);

const help = page(
  "使い方",
  `<font size="5"><b>使い方</b></font>
<dl>
<dt><b>読む</b>
<dd>会議室の一覧から部屋を選ぶと、発言が番号の順に並んでいます。題名を選ぶと本文が読めます。
<dt><b>発言する</b>
<dd>「発言する」から、ハンドル名、題名、本文を書いて送ります。発言には番号がつきます。
<dt><b>返事を書く</b>
<dd>題名に「Re:」をつけると、どの発言への返事かがわかります。引用は「&gt;」をつけて、必要なところだけにしてください。
</dl>`,
);

const rule = page(
  "会議室のお約束",
  `<font size="5"><b>会議室のお約束</b></font>
<ol>
<li>ハンドル名は、いつも同じものを使ってください。
<li>ほかの人の悪口や、宣伝の発言はしないでください。
<li>電話番号、住所、メールアドレスなどは書かないでください。
<li>長い文は、ほどよく改行すると読みやすくなります。
<li>お約束を守らない発言は、シスオペ（管理人）が消すことがあります。
</ol>
<p><font size="2">シスオペへの連絡は <a href="mailto:sysop@hogekaigi.example">sysop@hogekaigi.example</a> まで。</font></p>`,
);

export const pages: readonly SitePage[] = [
  { path: "index.html", html: index },
  { path: "pc.html", html: pc },
  { path: "msg.html", html: msg },
  { path: "hobby.html", html: hobby },
  { path: "post.html", html: post },
  { path: "help.html", html: help },
  { path: "rule.html", html: rule },
];
