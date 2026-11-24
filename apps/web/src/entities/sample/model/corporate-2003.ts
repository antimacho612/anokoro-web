import type { SitePage } from "@anokoro/shared";

const STYLE = `<style type="text/css">
body { margin: 0; font-size: 12px; color: #333333; }
td { font-size: 12px; line-height: 150%; }
a { color: #0055AA; text-decoration: none; }
a:hover { color: #FF6600; text-decoration: underline; }
.title { font-size: 16px; font-weight: bold; color: #0077BB; border-bottom: 2px solid #0077BB; }
</style>`;

const page = (title: string, body: string): string => `<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=Shift_JIS">
<title>${title}ほげほげトラベル</title>
${STYLE}
</head>
<body bgcolor="#FFFFFF">
<center>
<table border="0" cellpadding="0" cellspacing="0" width="760">
<tr>
<td bgcolor="#0077BB" height="56"><font size="5" color="#FFFFFF"><b>&nbsp;ほげほげトラベル</b></font><font color="#CCEEFF">　ゆったり、ほげほげ旅</font></td>
</tr>
<tr>
<td bgcolor="#DDEEFF" height="24">
&nbsp;<a href="top.html">ホーム</a> ｜ <a href="tour.html">ツアー一覧</a> ｜ <a href="company.html">会社概要</a> ｜ <a href="contact.html">お問い合わせ</a> ｜ <a href="sitemap.html">サイトマップ</a>
</td>
</tr>
</table>
<table border="0" cellpadding="12" cellspacing="0" width="760">
<tr><td valign="top">
${body}
</td></tr>
</table>
<table border="0" cellpadding="6" cellspacing="0" width="760">
<tr><td bgcolor="#EEEEEE" align="center">
<a href="env.html">ご利用環境</a> ｜ <a href="sitemap.html">サイトマップ</a><br>
Copyright (C) 2003 Hogehoge Travel Co., Ltd. All rights reserved.
</td></tr>
</table>
</center>
</body>
</html>
`;

const intro = `<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=Shift_JIS">
<title>ほげほげトラベル</title>
${STYLE}
</head>
<body bgcolor="#003355" text="#FFFFFF" link="#FFFFFF" vlink="#FFFFFF">
<center>
<br><br><br>
<table border="0" cellpadding="0" cellspacing="0" width="600" height="300">
<tr><td align="center" bgcolor="#0077BB">
<font size="7"><b>ほげほげトラベル</b></font><br><br>
<font size="4">海へ、山へ、まだ見ぬ町へ。</font><br><br>
<img src="photo-sea.jpg" width="160" height="120" alt="">
</td></tr>
</table>
<br>
<a href="top.html">▶ SKIP</a><br><br>
<font size="1" color="#99BBDD">
動きのあるイントロをご覧になるには、プラグインが必要です。<br>
プラグインをお持ちでない方も、「SKIP」からホームページをご覧いただけます。
</font>
</center>
</body>
</html>
`;

const top = page(
  "",
  `<table border="0" cellpadding="0" cellspacing="0" width="100%">
<tr>
<td valign="top" width="480">
<div class="title">おすすめツアー</div>
<p>
<img src="mark-osusume.gif" width="48" height="16"> <a href="tour.html">冬の温泉めぐり 2 日間</a>　19,800 円から<br>
<img src="mark-osusume.gif" width="48" height="16"> <a href="tour.html">南の島でのんびり 4 日間</a>　59,800 円から<br>
<img src="mark-shinchaku.gif" width="32" height="14"> <a href="tour.html">ほげほげ高原 スキーツアー</a>　12,800 円から
</p>
<div class="title">新着情報</div>
<p>
2003.11.20　冬のツアーの受付を始めました<br>
2003.10.01　ホームページをリニューアルしました<br>
2003.10.01　<a href="contact.html">お問い合わせフォーム</a>は SSL で暗号化しています
</p>
</td>
<td valign="top" width="240" bgcolor="#F3F8FC">
<b>■ほげほげトラベルとは</b><br>
ほげほげ県で 30 年、地元の旅行会社です。少人数でゆったり回るツアーが人気です。<br><br>
<img src="photo-flower.jpg" width="160" height="120" alt="高原の花"><br>
<font size="1">ほげほげ高原の初夏</font>
</td>
</tr>
</table>`,
);

const tour = page(
  "ツアー一覧 - ",
  `<div class="title">ツアー一覧</div>
<br>
<table border="1" bordercolor="#99BBDD" cellpadding="6" cellspacing="0" width="100%">
<tr bgcolor="#DDEEFF"><th>ツアー名</th><th>日数</th><th>出発日</th><th>旅行代金（おひとり）</th></tr>
<tr><td>冬の温泉めぐり</td><td>2 日間</td><td>12月〜2月の毎週土曜日</td><td><font color="#CC0000"><b>19,800 円</b></font>から</td></tr>
<tr><td>南の島でのんびり</td><td>4 日間</td><td>1月10日、1月24日</td><td><font color="#CC0000"><b>59,800 円</b></font>から</td></tr>
<tr><td>ほげほげ高原 スキーツアー</td><td>日帰り</td><td>12月20日から毎日</td><td><font color="#CC0000"><b>12,800 円</b></font>から</td></tr>
</table>
<p>お申し込みは、<a href="contact.html">お問い合わせフォーム</a>か、お電話（0000-77-7777）で承ります。</p>`,
);

const company = page(
  "会社概要 - ",
  `<div class="title">会社概要</div>
<br>
<table border="1" bordercolor="#99BBDD" cellpadding="6" cellspacing="0" width="100%">
<tr><td width="140" bgcolor="#DDEEFF">商号</td><td>ほげほげトラベル株式会社</td></tr>
<tr><td bgcolor="#DDEEFF">設立</td><td>1973年4月</td></tr>
<tr><td bgcolor="#DDEEFF">所在地</td><td>ほげほげ県ほげほげ市駅前 2-2-2</td></tr>
<tr><td bgcolor="#DDEEFF">事業内容</td><td>国内旅行、海外旅行の企画と販売</td></tr>
<tr><td bgcolor="#DDEEFF">従業員数</td><td>35名</td></tr>
</table>`,
);

const env = page(
  "ご利用環境 - ",
  `<div class="title">ご利用環境</div>
<p>当ホームページを快適にご覧いただくために、次の環境をおすすめします。</p>
<table border="1" bordercolor="#99BBDD" cellpadding="6" cellspacing="0" width="100%">
<tr><td width="160" bgcolor="#DDEEFF">ブラウザ</td><td>ネットサーファー 5.0 以上</td></tr>
<tr><td bgcolor="#DDEEFF">画面の大きさ</td><td>800×600 以上</td></tr>
<tr><td bgcolor="#DDEEFF">プラグイン</td><td>トップページのイントロをご覧になるには、プラグインが必要です</td></tr>
</table>
<div class="title" style="margin-top: 16px;">SSL について</div>
<p>
お問い合わせフォームでは、お客様の情報を守るため、SSL という仕組みで通信を暗号化しています。<br>
古いブラウザでは、証明書についての警告が表示されたり、フォームが使えなかったりする場合があります。その際はブラウザを新しくしてください。
</p>`,
);

const contact = page(
  "お問い合わせ - ",
  `<div class="title">お問い合わせ</div>
<p>ツアーのお申し込み、ご質問はこちらのフォームからどうぞ。<font color="#CC0000">*</font> は必ずご記入ください。</p>
<form>
<table border="1" bordercolor="#99BBDD" cellpadding="6" cellspacing="0" width="100%">
<tr><td width="160" bgcolor="#DDEEFF">お名前 <font color="#CC0000">*</font></td><td><input type="text" name="name" size="30"></td></tr>
<tr><td bgcolor="#DDEEFF">メールアドレス <font color="#CC0000">*</font></td><td><input type="text" name="email" size="40"></td></tr>
<tr><td bgcolor="#DDEEFF">ご希望のツアー</td><td>
<select name="tour">
<option>冬の温泉めぐり</option><option>南の島でのんびり</option><option>ほげほげ高原 スキーツアー</option><option>そのほか</option>
</select>
</td></tr>
<tr><td bgcolor="#DDEEFF">ご質問</td><td><textarea name="body" cols="44" rows="5"></textarea></td></tr>
</table>
<p align="center"><input type="submit" value="確認画面へ"></p>
</form>
<p><font size="1">このページは SSL で暗号化されています。お預かりした情報は、ご連絡以外には使いません。</font></p>`,
);

const sitemap = page(
  "サイトマップ - ",
  `<div class="title">サイトマップ</div>
<ul>
<li><a href="index.html">イントロ</a></li>
<li><a href="top.html">ホーム</a>
<ul>
<li><a href="tour.html">ツアー一覧</a></li>
<li><a href="company.html">会社概要</a></li>
<li><a href="contact.html">お問い合わせ</a></li>
<li><a href="env.html">ご利用環境</a></li>
</ul>
</li>
</ul>`,
);

export const pages: readonly SitePage[] = [
  { path: "index.html", html: intro },
  { path: "top.html", html: top },
  { path: "tour.html", html: tour },
  { path: "company.html", html: company },
  { path: "env.html", html: env },
  { path: "contact.html", html: contact },
  { path: "sitemap.html", html: sitemap },
];
