import type { SitePage } from "@anokoro/shared";

const index = `<html>
<head>
<title>ほげナビ</title>
</head>
<body bgcolor="#FFFFFF" text="#000000" link="#0000CC" vlink="#551A8B">
<center>
<table border="0" cellpadding="4" width="600">
<tr><td align="center" bgcolor="#FFEEEE"><font size="6" color="#CC0000"><b>ほげナビ</b></font><br><font size="2">日本語のホームページを探すなら</font></td></tr>
</table>
<br>
<table border="0" cellpadding="6" width="600">
<tr>
<td valign="top" width="50%">
<b><a href="hobby.html">趣味とスポーツ</a></b><br>
<font size="2">音楽、釣り、ゲーム...</font><br><br>
<b><a href="computer.html">コンピュータとインターネット</a></b><br>
<font size="2">ソフトウェア、ホームページ作成...</font>
</td>
<td valign="top" width="50%">
<b><a href="arts.html">芸術と人文</a></b><br>
<font size="2">文学、写真、美術館...</font><br><br>
<b><a href="area.html">地域情報</a></b><br>
<font size="2">都道府県、観光、グルメ...</font>
</td>
</tr>
</table>
<table border="0" cellpadding="6" width="600">
<tr><td bgcolor="#F0F0FF"><font size="2">
<img src="new.gif"> 今週の新着サイト：釣りの日記、手作りケーキの部屋、鉄道写真館<br>
あなたのホームページを載せませんか？ <a href="add.html">ご登録はこちら</a>（審査があります）
</font></td></tr>
</table>
<font size="1">Copyright (C) 1998 HogeNavi</font>
</center>
</body>
</html>
`;

const hobby = `<html>
<head>
<title>趣味とスポーツ - ほげナビ</title>
</head>
<body bgcolor="#FFFFFF" text="#000000" link="#0000CC" vlink="#551A8B">
<font size="2"><a href="index.html">ほげナビ</a> &gt; 趣味とスポーツ</font>
<hr>
<b>カテゴリ</b>
<ul>
<li><a href="music.html">音楽</a> (1,204)
<li><a href="fishing.html">釣り</a> (312)
<li><a href="game.html">ゲーム</a> (2,087)
</ul>
<b>登録サイト</b>
<ul>
<li><a href="index.html">ねこまるの部屋</a> - ねこと音楽と日記のホームページ。
<li><a href="index.html">日曜釣り師</a> - 近所の川での釣果報告。 <img src="new.gif">
</ul>
<hr>
<font size="2"><a href="add.html">このカテゴリにサイトを登録する</a></font>
</body>
</html>
`;

const add = `<html>
<head>
<title>サイトの登録 - ほげナビ</title>
</head>
<body bgcolor="#FFFFFF" text="#000000" link="#0000CC" vlink="#551A8B">
<font size="2"><a href="index.html">ほげナビ</a> &gt; サイトの登録</font>
<hr>
<b>サイトの登録について</b>
<p><font size="2">ほげナビに載せるサイトは、編集部が一つずつ見て選んでいます。登録の申請をいただいても、掲載をお約束するものではありません。</font></p>
<form>
<table border="0" cellpadding="2">
<tr><td>サイト名</td><td><input name="title" size="40"></td></tr>
<tr><td>URL</td><td><input name="url" size="40" value="http://"></td></tr>
<tr><td>紹介文</td><td><textarea name="comment" rows="3" cols="40"></textarea></td></tr>
</table>
<input type="submit" value="申請する">
</form>
<font size="2">※このページは見本です。申請はできません。</font>
</body>
</html>
`;

export const pages: readonly SitePage[] = [
  { path: "index.html", html: index },
  { path: "hobby.html", html: hobby },
  { path: "add.html", html: add },
];
