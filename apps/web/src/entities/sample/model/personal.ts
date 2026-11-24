import type { SampleSite } from "./types.ts";

const index = `<html>
<head>
<title>☆ねこまるの部屋☆</title>
</head>
<body bgcolor="#FFFFFF" background="kabe2.gif" text="#333333" link="#0066CC" vlink="#9933CC">
<center>
<font size="5" color="#FF6699"><b>☆ねこまるの部屋☆</b></font><br>
<font size="2">ねこと音楽と、ときどき日記。</font><br>
<img src="line.gif" width="400" height="8"><br>
あなたは <!--COUNTER--> 人目のお客様です♪<br>
<font size="2" color="#FF0000">キリ番 1000 を踏んだ方は掲示板で報告してね！踏み逃げ禁止！</font>
<br><br>
<table border="1" cellpadding="6" cellspacing="0" width="480" bgcolor="#FFFFEE">
<tr>
<td width="140" valign="top" bgcolor="#FFE0EE">
<b>■メニュー</b><br>
<a href="profile.html">プロフィール</a><br>
<a href="diary.html">日記</a> <img src="new.gif"><br>
<a href="bbs.html">掲示板</a><br>
<a href="link.html">リンク</a>
</td>
<td valign="top">
<b>■更新履歴</b><br>
<font size="2">
1999/06/20 日記を更新しました<br>
1999/06/12 プロフィールを作りました<br>
1999/06/01 サイト開設！
</font>
<br><br>
<img src="koji.gif"><br>
<font size="2">掲示板とリンクは工事中です…</font>
</td>
</tr>
</table>
<br>
<img src="mail.gif"> <a href="mailto:nekomaru@example.com">メールはこちら</a><br>
<font size="1" color="#999999">Since 1999.06.01 / リンクフリーです</font>
</center>
</body>
</html>
`;

const profile = `<html>
<head>
<title>プロフィール</title>
</head>
<body bgcolor="#FFFFFF" background="kabe2.gif" text="#333333" link="#0066CC" vlink="#9933CC">
<center>
<font size="4" color="#FF6699"><b>■プロフィール■</b></font><br>
<img src="line.gif" width="400" height="8"><br>
<table border="1" cellpadding="4" cellspacing="0" width="400" bgcolor="#FFFFFF">
<tr><td width="120" bgcolor="#FFE0EE">ハンドル</td><td>ねこまる</td></tr>
<tr><td bgcolor="#FFE0EE">住んでいる所</td><td>関東のどこか</td></tr>
<tr><td bgcolor="#FFE0EE">好きなもの</td><td>ねこ、ギター、カレー</td></tr>
<tr><td bgcolor="#FFE0EE">ひとこと</td><td>メールや掲示板の書き込み、お待ちしています！</td></tr>
</table>
<br>
<a href="index.html">トップへ戻る</a>
</center>
</body>
</html>
`;

const diary = `<html>
<head>
<title>日記</title>
</head>
<body bgcolor="#FFFFFF" background="kabe2.gif" text="#333333" link="#0066CC" vlink="#9933CC">
<center>
<font size="4" color="#FF6699"><b>■ねこまる日記■</b></font><br>
<img src="line.gif" width="400" height="8">
</center>
<blockquote>
<b>6月20日（日）</b> <img src="new.gif"><br>
ホームページのカウンターが500を超えました！見に来てくれる皆さん、ありがとう。<br>
今日はうちのねこが、窓の外の鳥をずっと見ていました。<br><br>
<b>6月15日（火）</b><br>
テレホタイムになると回線がつながりにくいです…。23時ちょうどにダイヤルしても話し中ばかり。<br><br>
<b>6月12日（土）</b><br>
プロフィールを作りました。<a href="profile.html">こちら</a>からどうぞ。
</blockquote>
<center><a href="index.html">トップへ戻る</a></center>
</body>
</html>
`;

export const personalSample: SampleSite = {
  id: "personal",
  name: "☆ねこまるの部屋☆",
  year: 1999,
  genre: "personal",
  category: "diary",
  description: "カウンター、キリ番、工事中。テレホーダイ時代の個人ホームページ",
  pages: [
    { path: "index.html", html: index },
    { path: "profile.html", html: profile },
    { path: "diary.html", html: diary },
  ],
};
