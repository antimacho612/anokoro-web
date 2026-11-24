import type { SitePage } from "@anokoro/shared";

const STYLE = `<style type="text/css">
body { margin: 0; background: #E9EEF2 url(kabe-pinstripe.png); color: #333333; font-family: sans-serif; font-size: 12px; line-height: 1.6; }
a { color: #1E5A8C; }
a:hover { color: #D9600F; }
#wrap { width: 900px; margin: 0 auto; background-color: #FFFFFF; }
#header { height: 70px; padding: 0 20px; border-bottom: 4px solid #2E7D32; }
#header h1 { float: left; margin: 18px 0 0 0; font-size: 22px; color: #2E7D32; }
#header p { float: right; margin: 26px 0 0 0; }
#gnav { margin: 0; padding: 0; background-color: #2E7D32; list-style: none; height: 32px; }
#gnav > li { float: left; }
#gnav > li > a { display: block; padding: 7px 18px; color: #FFFFFF; text-decoration: none; }
#gnav > li > a:hover { background-color: #43A047; }
#main { float: left; width: 620px; padding: 20px; }
#side { float: right; width: 200px; padding: 20px 20px 20px 0; }
h2 { margin: 0 0 10px 0; padding: 6px 10px; font-size: 15px; background-color: #F1F8E9; border-left: 6px solid #2E7D32; }
.news dt { float: left; width: 90px; color: #666666; }
.news dd { margin: 0 0 6px 90px; }
.banner { margin-bottom: 12px; padding: 10px; border: 1px solid #C8E6C9; background-color: #FAFFF5; }
#footer { clear: both; padding: 14px; text-align: center; font-size: 11px; color: #666666; background-color: #EEEEEE; }
table.spec { border-collapse: collapse; width: 100%; }
table.spec th, table.spec td { border: 1px solid #C8E6C9; padding: 6px; text-align: left; }
table.spec th { width: 140px; background-color: #F1F8E9; }
</style>`;

const page = (
  title: string,
  body: string,
): string => `<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title>${title}ほげほげ住宅株式会社</title>
${STYLE}
</head>
<body>
<div id="wrap">
<div id="header">
<h1>ほげほげ住宅</h1>
<p>家族の笑顔が育つ家　フリーダイヤル 0120-000-000</p>
</div>
<ul id="gnav">
<li><a href="index.html">ホーム</a></li>
<li><a href="lineup.html">商品ラインナップ</a></li>
<li><a href="modelhouse.html">モデルハウス</a></li>
<li><a href="company.html">会社情報</a></li>
<li><a href="news.html">ニュース</a></li>
<li><a href="contact.html">資料請求・お問い合わせ</a></li>
</ul>
<div id="main">
${body}
</div>
<div id="side">
<div class="banner">
<img src="icon-soft-home.png" width="48" height="48" alt="" align="left">
<b>モデルハウス<br>見学受付中</b><br>
<a href="modelhouse.html">ご予約はこちら</a>
</div>
<div class="banner">
<a href="contact.html"><img src="btn-glossy.png" width="140" height="36" alt="資料請求" border="0"></a><br>
カタログを無料でお送りします
</div>
<div class="banner">
<img src="badge-rss.gif" width="80" height="15" alt="RSS"><br>
ニュースは RSS でもお届けしています
</div>
</div>
<div id="footer">
<a href="privacy.html">個人情報保護方針</a> ｜ <a href="sitemap.html">サイトマップ</a> ｜ 推奨環境：ネットサーファー 6.0 以上、1024×768 以上<br>
Copyright (C) 2006 Hogehoge Jutaku Co., Ltd. All Rights Reserved.
</div>
</div>
</body>
</html>
`;

const index = page(
  "",
  `<h2>あたらしい暮らしを、ほげほげ住宅と</h2>
<p>
<img src="photo-flower.jpg" width="160" height="120" alt="" align="right" hspace="8">
ほげほげ住宅は、地元の木と職人の手で、長く住める家をつくっています。<br>
2006 年秋の新商品「ひだまりの家」は、南向きの大きな窓と、家族が集まる広いリビングが自慢です。
</p>
<h2>ニュース</h2>
<dl class="news">
<dt>2006.11.10</dt><dd><img src="ribbon-new.png" width="32" height="32" alt="NEW" align="right">新商品「ひだまりの家」を発売しました</dd>
<dt>2006.10.21</dt><dd>ほげほげ展示場で秋の見学会を行いました</dd>
<dt>2006.09.01</dt><dd>ホームページをリニューアルしました</dd>
</dl>
<p><a href="news.html">ニュースの一覧へ</a></p>`,
);

const news = page(
  "ニュース - ",
  `<h2>ニュース</h2>
<dl class="news">
<dt>2006.11.10</dt><dd>新商品「ひだまりの家」を発売しました</dd>
<dt>2006.10.21</dt><dd>ほげほげ展示場で秋の見学会を行いました。ご来場ありがとうございました</dd>
<dt>2006.09.01</dt><dd>ホームページをリニューアルしました。ニュースを RSS で配信します</dd>
<dt>2006.04.01</dt><dd>北部営業所を開設しました</dd>
<dt>2005.04.01</dt><dd><a href="privacy.html">個人情報保護方針</a>を定めました</dd>
</dl>`,
);

const lineup = page(
  "商品ラインナップ - ",
  `<h2>商品ラインナップ</h2>
<table class="spec">
<tr><th>ひだまりの家</th><td>南向きの大開口と吹き抜けのリビング。2006 年秋の新商品です</td></tr>
<tr><th>木の香の家</th><td>地元の杉を柱と床にたっぷり使った、木造二階建て</td></tr>
<tr><th>ふたり暮らしの平屋</th><td>段差のない平屋。将来の暮らしも見すえた間取りです</td></tr>
</table>
<p>くわしいカタログは、<a href="contact.html">資料請求</a>から無料でお取り寄せいただけます。</p>`,
);

const modelhouse = page(
  "モデルハウス - ",
  `<h2>モデルハウス見学のご案内</h2>
<p>
<img src="photo-sea.jpg" width="160" height="120" alt="" align="left" hspace="8">
ほげほげ展示場で、「ひだまりの家」と「木の香の家」をご覧いただけます。<br>
営業時間：10:00〜18:00（水曜定休）<br>
所在地：ほげほげ市みどり町 8-1（ほげほげ駅から車で 10 分）
</p>
<p style="clear: both;">見学のご予約は、<a href="contact.html">お問い合わせフォーム</a>か、フリーダイヤル 0120-000-000 で承ります。</p>`,
);

const company = page(
  "会社情報 - ",
  `<h2>会社概要</h2>
<table class="spec">
<tr><th>商号</th><td>ほげほげ住宅株式会社</td></tr>
<tr><th>設立</th><td>1982年6月</td></tr>
<tr><th>本社</th><td>ほげほげ県ほげほげ市中央 3-3-3</td></tr>
<tr><th>事業内容</th><td>木造住宅の設計、施工、リフォーム</td></tr>
<tr><th>従業員数</th><td>86名（2006年4月現在）</td></tr>
</table>
<h2>沿革</h2>
<p>
1982年　ほげほげ市で創業<br>
1995年　ほげほげ展示場を開設<br>
2006年　北部営業所を開設
</p>`,
);

const privacy = page(
  "個人情報保護方針 - ",
  `<h2>個人情報保護方針</h2>
<p>ほげほげ住宅株式会社は、お客様の個人情報を大切に扱うため、次のとおり取り組みます。</p>
<p>
1. 資料請求やお問い合わせでお預かりした個人情報は、資料の送付とご連絡のためだけに使います。<br>
2. 法令に定める場合を除き、ご本人の同意なく第三者に提供しません。<br>
3. 個人情報の開示、訂正、削除のご依頼には、ご本人であることを確かめたうえでお応えします。<br>
4. お問い合わせフォームの通信は、SSL で暗号化しています。
</p>
<p>制定：2005年4月1日</p>`,
);

const contact = page(
  "資料請求・お問い合わせ - ",
  `<h2>資料請求・お問い合わせ</h2>
<p>カタログのご請求、モデルハウス見学のご予約はこちらから。<a href="privacy.html">個人情報保護方針</a>をご確認のうえ、お送りください。</p>
<form>
<table class="spec">
<tr><th>ご用件</th><td>
<input type="radio" name="type" value="catalog" checked> カタログ請求
<input type="radio" name="type" value="visit"> 見学の予約
<input type="radio" name="type" value="other"> そのほか
</td></tr>
<tr><th>お名前</th><td><input type="text" name="name" size="30"></td></tr>
<tr><th>ご住所</th><td><input type="text" name="address" size="50"></td></tr>
<tr><th>メールアドレス</th><td><input type="text" name="email" size="40"></td></tr>
<tr><th>ご質問</th><td><textarea name="body" cols="50" rows="5"></textarea></td></tr>
</table>
<p><label><input type="checkbox" name="agree"> 個人情報保護方針に同意する</label></p>
<p><input type="submit" value="入力内容を確認する"></p>
</form>`,
);

const sitemap = page(
  "サイトマップ - ",
  `<h2>サイトマップ</h2>
<ul>
<li><a href="index.html">ホーム</a></li>
<li><a href="lineup.html">商品ラインナップ</a></li>
<li><a href="modelhouse.html">モデルハウス</a></li>
<li><a href="company.html">会社情報</a></li>
<li><a href="news.html">ニュース</a></li>
<li><a href="contact.html">資料請求・お問い合わせ</a></li>
<li><a href="privacy.html">個人情報保護方針</a></li>
</ul>`,
);

export const pages: readonly SitePage[] = [
  { path: "index.html", html: index },
  { path: "news.html", html: news },
  { path: "lineup.html", html: lineup },
  { path: "modelhouse.html", html: modelhouse },
  { path: "company.html", html: company },
  { path: "privacy.html", html: privacy },
  { path: "contact.html", html: contact },
  { path: "sitemap.html", html: sitemap },
];
