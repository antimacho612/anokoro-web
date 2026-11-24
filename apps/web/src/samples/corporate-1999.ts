import type { SitePage } from "@anokoro/shared";

const BODY = `<body bgcolor="#FFFFFF" text="#000000" link="#003399" vlink="#663399">`;
const NAV = `<table border="0" cellpadding="0" cellspacing="0" width="640">
<tr><td bgcolor="#8B4513" height="60" align="center"><font size="6" color="#FFFFFF"><b>ほげほげ製菓</b></font></td></tr>
<tr><td bgcolor="#F5DEB3" align="center"><font size="2">
<a href="index.html">トップ</a> ｜ <a href="company.html">会社案内</a> ｜ <a href="products.html">商品紹介</a> ｜ <a href="shop.html">取扱店</a> ｜ <a href="recruit.html">採用情報</a> ｜ <a href="enquete.html">アンケート</a>
</font></td></tr>
</table>`;
const page = (title: string, body: string): string => `<html>
<head>
<title>${title}ほげほげ製菓株式会社</title>
</head>
${BODY}
<center>
${NAV}
<br>
${body}
<hr width="600">
<font size="1"><a href="env.html">推奨環境</a> ｜ <a href="mailto:info@hogehoge-seika.example">お問い合わせ</a><br>
Copyright (C) 1999 Hogehoge Seika Co., Ltd. All Rights Reserved.</font>
</center>
</body>
</html>
`;
const heading = (title: string): string =>
  `<font size="5" color="#8B4513"><b>${title}</b></font>
<hr width="600">`;

const index = page(
  "",
  `<font size="5" color="#8B4513"><b>ようこそ ほげほげ製菓のホームページへ</b></font><br><br>
<table border="0" cellpadding="8" width="600">
<tr>
<td valign="top" width="60%">
<b>■新着情報</b><br>
<font size="2">
1999.10.01 秋の新商品「くりまんじゅう」を発売しました <img src="new.gif"><br>
1999.09.10 <a href="enquete.html">アンケート</a>を始めました。抽選でお菓子をプレゼント！<br>
1999.07.15 ホームページをリニューアルしました<br>
1999.04.01 新入社員を迎えました
</font>
</td>
<td valign="top" bgcolor="#FFF8DC">
<b>■社長あいさつ</b><br>
<font size="2">創業以来およそ半世紀、地元の素材にこだわったお菓子づくりを続けてまいりました。これからもどうぞよろしくお願い申し上げます。<br><a href="company.html">続きを読む</a></font>
</td>
</tr>
</table>
<br>
<font size="1">推奨環境：画面 800×600 以上でご覧ください<br>
最終更新日：1999年10月1日</font>`,
);

const company = page(
  "会社案内 - ",
  `${heading("会社案内")}
<table border="1" cellpadding="6" cellspacing="0" width="560">
<tr><td width="140" bgcolor="#F5DEB3">会社名</td><td>ほげほげ製菓株式会社</td></tr>
<tr><td bgcolor="#F5DEB3">創業</td><td>昭和26年</td></tr>
<tr><td bgcolor="#F5DEB3">所在地</td><td>ほげほげ県ほげほげ市本町 4-5-6</td></tr>
<tr><td bgcolor="#F5DEB3">事業内容</td><td>和菓子・洋菓子の製造、販売</td></tr>
<tr><td bgcolor="#F5DEB3">従業員数</td><td>120名</td></tr>
</table>
<br>
<table border="0" width="560"><tr><td><font size="2">
<b>■社長あいさつ</b><br>
創業以来およそ半世紀、地元の素材にこだわったお菓子づくりを続けてまいりました。<br>
インターネットを通じて、より多くの皆様に私どものお菓子を知っていただければ幸いです。<br>
<div align="right">代表取締役社長　ほげ山 ほげ男</div>
</font></td></tr></table>`,
);

const products = page(
  "商品紹介 - ",
  `${heading("商品紹介")}
<table border="0" cellpadding="8" width="560">
<tr>
<td bgcolor="#FFF8DC" valign="top"><b>くりまんじゅう</b> <img src="new.gif"><br><font size="2">秋の新商品。大粒の栗をまるごと包みました。</font></td>
<td bgcolor="#FFF8DC" valign="top"><b>ほげほげせんべい</b><br><font size="2">創業以来のロングセラー。しょうゆ味としお味。</font></td>
</tr>
<tr>
<td bgcolor="#FFF8DC" valign="top"><b>ほげほげカステラ</b><br><font size="2">地元の卵を使った、しっとり焼き上げのカステラ。</font></td>
<td bgcolor="#FFF8DC" valign="top"><b>季節の上生菓子</b><br><font size="2">本店売店だけで販売しています。</font></td>
</tr>
</table>
<p><font size="2">お求めは<a href="shop.html">取扱店</a>、または本店売店で。</font></p>`,
);

const shop = page(
  "取扱店 - ",
  `${heading("取扱店")}
<table border="1" cellpadding="6" cellspacing="0" width="560">
<tr bgcolor="#F5DEB3"><th>店名</th><th>住所</th><th>電話</th></tr>
<tr><td>本店売店</td><td>ほげほげ市本町 4-5-6</td><td>0000-12-3456</td></tr>
<tr><td>ほげほげ駅 おみやげ館</td><td>ほげほげ市駅前 1-1</td><td>0000-12-0000</td></tr>
<tr><td>ほげほげ百貨店 地下 1 階</td><td>ほげほげ市中町 2-3</td><td>0000-12-1111</td></tr>
</table>
<p><font size="2">通信販売は行っておりません。ご了承ください。</font></p>`,
);

const recruit = page(
  "採用情報 - ",
  `${heading("採用情報")}
<table border="1" cellpadding="6" cellspacing="0" width="560">
<tr><td width="140" bgcolor="#F5DEB3">募集職種</td><td>製造スタッフ、売店スタッフ</td></tr>
<tr><td bgcolor="#F5DEB3">応募資格</td><td>2000年3月に高校・大学を卒業見込みの方</td></tr>
<tr><td bgcolor="#F5DEB3">応募方法</td><td>履歴書を総務部あてにご郵送ください</td></tr>
</table>
<p><font size="2">会社見学も受け付けております。総務部（電話 0000-12-3456）までご連絡ください。</font></p>`,
);

const enquete = page(
  "アンケート - ",
  `${heading("アンケート")}
<font size="2">ご回答いただいた方の中から、抽選で 10 名様に季節のお菓子をお送りします。</font>
<form>
<table border="1" cellpadding="6" cellspacing="0" width="560">
<tr><td width="160" bgcolor="#F5DEB3">お名前</td><td><input type="text" name="name" size="30"></td></tr>
<tr><td bgcolor="#F5DEB3">ご住所</td><td><input type="text" name="address" size="40"></td></tr>
<tr><td bgcolor="#F5DEB3">年代</td><td>
<select name="age">
<option>10代</option><option>20代</option><option>30代</option><option>40代</option><option>50代以上</option>
</select>
</td></tr>
<tr><td bgcolor="#F5DEB3">好きな商品</td><td>
<input type="checkbox" name="like" value="kuri">くりまんじゅう
<input type="checkbox" name="like" value="senbei">ほげほげせんべい
<input type="checkbox" name="like" value="castella">カステラ
</td></tr>
<tr><td bgcolor="#F5DEB3">ホームページは</td><td>
<input type="radio" name="hp" value="good">見やすい
<input type="radio" name="hp" value="normal">ふつう
<input type="radio" name="hp" value="bad">見にくい
</td></tr>
<tr><td bgcolor="#F5DEB3">ご意見</td><td><textarea name="opinion" cols="40" rows="4"></textarea></td></tr>
</table>
<br>
<input type="submit" value="送信する"> <input type="reset" value="書き直す">
</form>`,
);

const env = page(
  "推奨環境 - ",
  `${heading("推奨環境")}
<table border="0" width="560"><tr><td><font size="2">
このホームページは、次の環境でご覧いただくことをおすすめします。<br><br>
<b>■ブラウザ</b><br>
ネットサーファー 4.0 以上<br><br>
<b>■画面の大きさ</b><br>
800×600 以上<br><br>
これより古いブラウザでは、表の色や文字の大きさが正しく表示されない場合があります。
</font></td></tr></table>`,
);

export const pages: readonly SitePage[] = [
  { path: "index.html", html: index },
  { path: "company.html", html: company },
  { path: "products.html", html: products },
  { path: "shop.html", html: shop },
  { path: "recruit.html", html: recruit },
  { path: "enquete.html", html: enquete },
  { path: "env.html", html: env },
];
