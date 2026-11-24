import type { SitePage } from "@anokoro/shared";

const index = `<html>
<head>
<title>ほげほげ製菓株式会社</title>
</head>
<body bgcolor="#FFFFFF" text="#000000" link="#003399" vlink="#663399">
<center>
<table border="0" cellpadding="0" cellspacing="0" width="640">
<tr><td bgcolor="#8B4513" height="60" align="center"><font size="6" color="#FFFFFF"><b>ほげほげ製菓</b></font></td></tr>
<tr><td bgcolor="#F5DEB3" align="center"><font size="2">
<a href="company.html">会社案内</a> ｜ <a href="products.html">商品紹介</a> ｜ <a href="recruit.html">採用情報</a> ｜ <a href="mailto:info@hogehoge-seika.example">お問い合わせ</a>
</font></td></tr>
</table>
<br>
<font size="5" color="#8B4513"><b>ようこそ ほげほげ製菓のホームページへ</b></font><br><br>
<table border="0" cellpadding="8" width="600">
<tr>
<td valign="top" width="60%">
<b>■新着情報</b><br>
<font size="2">
2001.10.01 秋の新商品「くりまんじゅう」を発売しました <img src="new.gif"><br>
2001.07.15 ホームページをリニューアルしました<br>
2001.04.01 新入社員を迎えました
</font>
</td>
<td valign="top" bgcolor="#FFF8DC">
<b>■社長あいさつ</b><br>
<font size="2">創業以来五十年、地元の素材にこだわったお菓子づくりを続けてまいりました。これからもどうぞよろしくお願い申し上げます。<br><a href="company.html">続きを読む</a></font>
</td>
</tr>
</table>
<hr width="600">
<font size="1">推奨環境：画面 800×600 以上でご覧ください<br>
最終更新日：2001年10月1日<br>
Copyright (C) 2001 Hogehoge Seika Co., Ltd. All Rights Reserved.</font>
</center>
</body>
</html>
`;

const company = `<html>
<head>
<title>会社案内 - ほげほげ製菓株式会社</title>
</head>
<body bgcolor="#FFFFFF" text="#000000" link="#003399" vlink="#663399">
<center>
<font size="5" color="#8B4513"><b>会社案内</b></font>
<hr width="600">
<table border="1" cellpadding="6" cellspacing="0" width="560">
<tr><td width="140" bgcolor="#F5DEB3">会社名</td><td>ほげほげ製菓株式会社（架空の会社です）</td></tr>
<tr><td bgcolor="#F5DEB3">創業</td><td>昭和26年</td></tr>
<tr><td bgcolor="#F5DEB3">事業内容</td><td>和菓子・洋菓子の製造、販売</td></tr>
<tr><td bgcolor="#F5DEB3">従業員数</td><td>120名</td></tr>
</table>
<br>
<table border="0" width="560"><tr><td><font size="2">
<b>■社長あいさつ</b><br>
創業以来五十年、地元の素材にこだわったお菓子づくりを続けてまいりました。インターネットを通じて、より多くの皆様に私どものお菓子を知っていただければ幸いです。
</font></td></tr></table>
<br>
<a href="index.html">トップページへ</a>
</center>
</body>
</html>
`;

const products = `<html>
<head>
<title>商品紹介 - ほげほげ製菓株式会社</title>
</head>
<body bgcolor="#FFFFFF" text="#000000" link="#003399" vlink="#663399">
<center>
<font size="5" color="#8B4513"><b>商品紹介</b></font>
<hr width="600">
<table border="0" cellpadding="8" width="560">
<tr>
<td bgcolor="#FFF8DC" valign="top"><b>くりまんじゅう</b> <img src="new.gif"><br><font size="2">秋の新商品。大粒の栗をまるごと包みました。</font></td>
<td bgcolor="#FFF8DC" valign="top"><b>ほげほげせんべい</b><br><font size="2">創業以来のロングセラー。しょうゆ味としお味。</font></td>
</tr>
</table>
<p><font size="2">お求めは県内の取扱店、または本店売店で。</font></p>
<a href="index.html">トップページへ</a>
</center>
</body>
</html>
`;

export const pages: readonly SitePage[] = [
  { path: "index.html", html: index },
  { path: "company.html", html: company },
  { path: "products.html", html: products },
];
