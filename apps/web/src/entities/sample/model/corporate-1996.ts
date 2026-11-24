import type { SitePage } from "@anokoro/shared";

const BODY = `<body bgcolor="#FFFFFF" text="#000000" link="#0000CC" vlink="#660099">`;
const header = (title: string): string => `<center>
<img src="logo-hogehoge.gif" width="200" height="50" alt="ほげほげ電機"><br>
<font size="5"><b>${title}</b></font>
</center>
<hr>`;
const FOOTER = `<hr>
<center>
<font size="2">
[<a href="index.html">ホーム</a>]
[<a href="products.html">製品紹介</a>]
[<a href="news.html">ニュース</a>]
[<a href="shops.html">取扱店</a>]
[<a href="access.html">所在地</a>]
[<a href="contact.html">お問い合わせ</a>]<br>
Copyright (C) 1996 Hogehoge Denki Co., Ltd.
</font>
</center>
</body>
</html>
`;

const index = `<html>
<head>
<title>ほげほげ電機 ホームページ</title>
</head>
${BODY}
${header("ほげほげ電機 ホームページ")}
<center>
<marquee width="560" scrollamount="3"><font color="#CC0000">新製品「ほげほげラジカセ HR-7」発売のお知らせ</font></marquee>
</center>
<p>
このたび、ほげほげ電機はインターネットにホームページを開設いたしました。<br>
製品の情報や新製品のお知らせを、いち早くお届けしてまいります。
</p>
<table border="1" cellpadding="6" cellspacing="0" width="600">
<tr bgcolor="#CCDDFF">
<th>ご案内</th>
<th>内容</th>
</tr>
<tr>
<td><a href="products.html">製品紹介</a></td>
<td>ラジカセ、電気ポット、扇風機などの製品をご紹介します</td>
</tr>
<tr>
<td><a href="news.html">ニュース</a> <img src="new.gif" width="38" height="14"></td>
<td>新製品の発売や、展示会のお知らせです</td>
</tr>
<tr>
<td><a href="shops.html">取扱店</a></td>
<td>ほげほげ電機の製品を扱っているお店の一覧です</td>
</tr>
<tr>
<td><a href="access.html">所在地</a></td>
<td>本社と営業所の住所、電話番号</td>
</tr>
<tr>
<td><a href="contact.html">お問い合わせ</a></td>
<td>製品についてのご質問は、電子メールでも受け付けております</td>
</tr>
</table>
<p><font size="2">ホームページ開設日：1996年10月1日</font></p>
${FOOTER}`;

const products = `<html>
<head>
<title>製品紹介 - ほげほげ電機</title>
</head>
${BODY}
${header("製品紹介")}
<table border="1" cellpadding="6" cellspacing="0" width="600">
<tr bgcolor="#CCDDFF"><th>製品名</th><th>型番</th><th>特長</th><th>希望小売価格</th></tr>
<tr><td>ほげほげラジカセ <img src="new.gif" width="38" height="14"></td><td>HR-7</td><td>CD とカセットの両方を再生。重さ 3.2kg</td><td>29,800 円</td></tr>
<tr><td>電気ポット ほげぽっと</td><td>HP-22</td><td>2.2 リットル。保温は 3 段階</td><td>12,800 円</td></tr>
<tr><td>リビング扇風機</td><td>HF-30</td><td>首振りとタイマーつき</td><td>9,800 円</td></tr>
</table>
<p>
<font size="2">※価格には消費税を含みません。製品の写真は準備中です。</font>
</p>
${FOOTER}`;

const news = `<html>
<head>
<title>ニュース - ほげほげ電機</title>
</head>
${BODY}
${header("ニュース")}
<dl>
<dt><b>1996年11月15日</b> <img src="new.gif" width="38" height="14">
<dd>新製品「ほげほげラジカセ HR-7」を発売しました。
<dt><b>1996年10月20日</b>
<dd>ほげほげ見本市（ほげほげ市民会館）に出展しました。ご来場ありがとうございました。
<dt><b>1996年10月1日</b>
<dd>ホームページを開設しました。
</dl>
${FOOTER}`;

const shops = `<html>
<head>
<title>取扱店 - ほげほげ電機</title>
</head>
${BODY}
${header("取扱店")}
<p>ほげほげ電機の製品は、次のお店でお求めいただけます。</p>
<table border="1" cellpadding="6" cellspacing="0" width="600">
<tr bgcolor="#CCDDFF"><th>地域</th><th>店名</th><th>電話番号</th></tr>
<tr><td>北部</td><td>ほげほげ電器 北店</td><td>0000-11-1111</td></tr>
<tr><td>中部</td><td>でんきの ほげ屋</td><td>0000-22-2222</td></tr>
<tr><td>南部</td><td>ほげほげ電器 南店</td><td>0000-33-3333</td></tr>
</table>
<p><font size="2">このほかのお店については、<a href="access.html">最寄りの営業所</a>までお問い合わせください。</font></p>
${FOOTER}`;

const access = `<html>
<head>
<title>所在地 - ほげほげ電機</title>
</head>
${BODY}
${header("所在地")}
<h3>本社</h3>
<p>
〒000-0000 ほげほげ県ほげほげ市中央 1-2-3<br>
電話 0000-00-0000　FAX 0000-00-0001<br>
ほげほげ駅から徒歩 10 分
</p>
<h3>営業所</h3>
<ul>
<li>北部営業所　電話 0000-44-4444
<li>南部営業所　電話 0000-55-5555
</ul>
<p><font size="2">地図は準備中です。お越しの際はお電話でお問い合わせください。</font></p>
${FOOTER}`;

const contact = `<html>
<head>
<title>お問い合わせ - ほげほげ電機</title>
</head>
${BODY}
${header("お問い合わせ")}
<p>
製品についてのご質問、ご意見は、次の宛先まで電子メールでお送りください。<br>
担当者から、数日のうちにお返事いたします。
</p>
<center>
<a href="mailto:info@hogehoge-denki.example"><img src="btn-inquiry.gif" width="120" height="28" alt="お問い合わせ" border="0"></a><br>
<font size="2">info@hogehoge-denki.example</font>
</center>
<p>
<font size="2">お急ぎの方は、お客様相談室（電話 0000-00-0002、平日 9 時〜17 時）をご利用ください。</font>
</p>
${FOOTER}`;

export const pages: readonly SitePage[] = [
  { path: "index.html", html: index },
  { path: "products.html", html: products },
  { path: "news.html", html: news },
  { path: "shops.html", html: shops },
  { path: "access.html", html: access },
  { path: "contact.html", html: contact },
];
