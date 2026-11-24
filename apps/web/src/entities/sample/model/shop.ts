import type { SampleSite } from "./types.ts";

const index = `<html>
<head>
<title>ほげほげ屋本舗 - おいしいお米の専門店</title>
</head>
<body bgcolor="#FFFFFF" text="#333333" link="#CC0000" vlink="#993300">
<center>
<table border="0" cellpadding="6" cellspacing="0" width="620">
<tr><td bgcolor="#CC0000" align="center"><font size="5" color="#FFFFFF"><b>ほげほげ屋本舗</b></font><br><font size="2" color="#FFFF99">おいしいお米の専門店</font></td></tr>
<tr><td bgcolor="#FFEEEE" align="center"><font size="2"><a href="item.html">新米コシヒカリ</a> ｜ <a href="guide.html">ご利用ガイド</a> ｜ <a href="law.html">特定商取引法に基づく表記</a></font></td></tr>
</table>
<br>
<font size="6" color="#CC0000"><b>★新米入荷しました★</b></font><br>
<font size="4" color="#CC0000"><b>今なら全品送料無料！</b></font><br><br>
<table border="1" cellpadding="8" cellspacing="0" width="560">
<tr>
<td align="center" width="50%"><a href="item.html"><b>新米コシヒカリ 5kg</b></a><br>
<font color="#CC0000" size="5"><b>2,980円</b></font><font size="2">（税込）</font><br>
<font size="2" color="#CC0000"><b>★送料無料★</b></font></td>
<td align="center"><b>無洗米 あきたこまち 5kg</b><br>
<font color="#CC0000" size="5"><b>2,780円</b></font><font size="2">（税込）</font><br>
<font size="2">残りわずか！</font></td>
</tr>
</table>
<br>
<table border="0" width="560"><tr><td bgcolor="#FFFFEE"><font size="2">
<b>■お客様の声</b><br>
「炊きたての香りが全然ちがいます！」（東京都 Ｋ様）<br>
「リピートしています。家族みんな大満足です」（大阪府 Ｍ様）
</font></td></tr></table>
<br>
<font size="1">Copyright (C) 2003 Hogehoge-ya Honpo All Rights Reserved.</font>
</center>
</body>
</html>
`;

const item = `<html>
<head>
<title>新米コシヒカリ 5kg - ほげほげ屋本舗</title>
</head>
<body bgcolor="#FFFFFF" text="#333333" link="#CC0000" vlink="#993300">
<center>
<font size="2"><a href="index.html">トップ</a> &gt; 新米コシヒカリ 5kg</font><br><br>
<font size="5"><b>新米コシヒカリ 5kg</b></font><br>
<font color="#CC0000" size="7"><b>2,980円</b></font><font size="2">（税込）</font><br>
<font size="4" color="#CC0000"><b>★送料無料★</b></font><br><br>
<table border="0" width="500"><tr><td><font size="2">
今年の新米が入荷しました！<br>
契約農家さんが一粒一粒ていねいに育てたお米です。<br>
炊きたてのつやと甘みを、ぜひ一度お試しください。<br><br>
<font color="#CC0000"><b>ご注文はお早めに！数量限定です！</b></font>
</font></td></tr></table>
<br>
<form><input type="submit" value="買い物かごに入れる"></form>
<font size="2">※このお店は見本です。お買い物はできません。</font><br><br>
<a href="index.html">トップページへ戻る</a>
</center>
</body>
</html>
`;

const law = `<html>
<head>
<title>特定商取引法に基づく表記 - ほげほげ屋本舗</title>
</head>
<body bgcolor="#FFFFFF" text="#333333" link="#CC0000" vlink="#993300">
<center>
<font size="4"><b>特定商取引法に基づく表記</b></font><br><br>
<table border="1" cellpadding="6" cellspacing="0" width="520">
<tr><td width="140" bgcolor="#FFEEEE">販売業者</td><td>ほげほげ屋本舗（架空のお店です）</td></tr>
<tr><td bgcolor="#FFEEEE">所在地</td><td>○○県○○市○○町1-2-3</td></tr>
<tr><td bgcolor="#FFEEEE">お支払い方法</td><td>代金引換、郵便振替</td></tr>
<tr><td bgcolor="#FFEEEE">送料</td><td>全品無料</td></tr>
<tr><td bgcolor="#FFEEEE">返品について</td><td>商品到着後7日以内にご連絡ください</td></tr>
</table>
<br>
<a href="index.html">トップページへ戻る</a>
</center>
</body>
</html>
`;

export const shopSample: SampleSite = {
  id: "shop",
  name: "ほげほげ屋本舗",
  year: 2003,
  genre: "shop",
  category: "life",
  description: "赤くて大きな値段と「送料無料」。縦に長いネットショップ",
  pages: [
    { path: "index.html", html: index },
    { path: "item.html", html: item },
    { path: "law.html", html: law },
  ],
};
