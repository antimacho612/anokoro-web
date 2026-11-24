import type { SitePage } from "@anokoro/shared";

const BODY = `<body bgcolor="#FFFFFF" text="#333333" link="#CC0000" vlink="#993300">`;
const HEADER = `<table border="0" cellpadding="6" cellspacing="0" width="620">
<tr><td bgcolor="#CC0000" align="center"><font size="5" color="#FFFFFF"><b>ほげほげ屋本舗</b></font><br><font size="2" color="#FFFF99">おいしいお米の専門店</font></td></tr>
<tr><td bgcolor="#FFEEEE" align="center"><font size="2">
<a href="index.html">トップ</a> ｜ <a href="item.html">新米コシヒカリ</a> ｜ <a href="item2.html">無洗米</a> ｜ <a href="voice.html">お客様の声</a> ｜ <a href="guide.html">ご利用ガイド</a> ｜ <a href="cart.html"><img src="icon-cart.gif" width="24" height="20" alt="" border="0" align="absmiddle">買い物かご</a>
</font></td></tr>
</table>`;
const FOOTER = `<br>
<table border="0" cellpadding="6" cellspacing="0" width="620">
<tr><td bgcolor="#FFEEEE" align="center"><font size="2">
<a href="guide.html">ご利用ガイド</a> ｜ <a href="law.html">特定商取引法に基づく表記</a> ｜ <a href="voice.html">お客様の声</a>
</font></td></tr>
</table>
<font size="1">Copyright (C) 2003 Hogehoge-ya Honpo All Rights Reserved.</font>
</center>
</body>
</html>
`;
const page = (title: string, body: string): string => `<html>
<head>
<title>${title}ほげほげ屋本舗 - おいしいお米の専門店</title>
</head>
${BODY}
<center>
${HEADER}
<br>
${body}
${FOOTER}`;
const CART = `<form><input type="submit" value="買い物かごに入れる"></form>
<a href="cart.html"><img src="btn-cart.gif" width="140" height="28" alt="買い物かごへ" border="0"></a>`;
const voices = `「炊きたての香りが全然ちがいます！」（東京都 Ｋ様）<br>
「リピートしています。家族みんな大満足です」（大阪府 Ｍ様）<br>
「届くのが早くてびっくり。また頼みます」（福岡県 Ｓ様）`;

const index = page(
  "",
  `<font size="6" color="#CC0000"><b>★新米入荷しました★</b></font><br>
<font size="4" color="#CC0000"><b>今なら全品送料無料！</b></font><br>
<font size="3" color="#FF6600"><b>さらに今週はポイント 5 倍！</b></font><br><br>
<table border="1" cellpadding="8" cellspacing="0" width="560">
<tr>
<td align="center" width="50%"><a href="item.html"><b>新米コシヒカリ 5kg</b></a><br>
<img src="photo-flower.jpg" width="160" height="120" alt="田んぼ"><br>
<font color="#CC0000" size="5"><b>2,980円</b></font><font size="2">（税込）</font><br>
<font size="2" color="#CC0000"><b>★送料無料★</b></font></td>
<td align="center"><a href="item2.html"><b>無洗米 あきたこまち 5kg</b></a><br>
<img src="photo-sea.jpg" width="160" height="120" alt="産地の風景"><br>
<font color="#CC0000" size="5"><b>2,780円</b></font><font size="2">（税込）</font><br>
<font size="2" color="#CC0000"><b>残りわずか！</b></font></td>
</tr>
</table>
<br>
<table border="0" width="560"><tr><td bgcolor="#FFFFEE"><font size="2">
<b>■お客様の声</b><br>
${voices}<br>
<a href="voice.html">もっと読む</a>
</font></td></tr></table>
<br>
<table border="0" width="560"><tr><td><font size="2">
<b>■店長より</b><br>
<img src="photo-me.jpg" width="96" height="96" alt="店長" align="left" hspace="8">
はじめまして、店長のほげ田です。<br>
実家の田んぼのお米を、もっとたくさんの人に食べてほしくてお店を始めました。<br>
ご質問はお気軽にメールでどうぞ！
</font></td></tr></table>`,
);

const item = page(
  "新米コシヒカリ 5kg - ",
  `<font size="2"><a href="index.html">トップ</a> &gt; 新米コシヒカリ 5kg</font><br><br>
<font size="5"><b>新米コシヒカリ 5kg</b></font><br>
<img src="photo-flower.jpg" width="160" height="120" alt="田んぼ"><br>
<font color="#CC0000" size="7"><b>2,980円</b></font><font size="2">（税込）</font><br>
<font size="4" color="#CC0000"><b>★送料無料★</b></font>　<font size="3" color="#FF6600"><b>ポイント 5 倍</b></font><br><br>
${CART}
<br><br>
<table border="0" width="500"><tr><td><font size="2">
<font size="4" color="#CC0000"><b>今年の新米が入荷しました！</b></font><br><br>
契約農家さんが一粒一粒ていねいに育てたお米です。<br>
炊きたてのつやと甘みを、ぜひ一度お試しください。<br><br>
<font size="4" color="#CC0000"><b>ここがちがう！ 3 つのこだわり</b></font><br><br>
<b>その 1　土づくり</b><br>
田植えの前に、たい肥をたっぷり入れて土を育てます。<br><br>
<b>その 2　精米したてをお届け</b><br>
ご注文をいただいてから精米します。だから香りがちがいます。<br><br>
<b>その 3　生産者の顔が見える</b><br>
田んぼの様子は、店長日記でもお伝えしています。<br><br>
<font color="#CC0000"><b>ご注文はお早めに！ 数量限定です！</b></font>
</font></td></tr></table>
<br>
<table border="1" cellpadding="6" cellspacing="0" width="500">
<tr><td width="120" bgcolor="#FFEEEE"><font size="2">産地</font></td><td><font size="2">ほげほげ県ほげほげ町</font></td></tr>
<tr><td bgcolor="#FFEEEE"><font size="2">内容量</font></td><td><font size="2">5kg</font></td></tr>
<tr><td bgcolor="#FFEEEE"><font size="2">発送</font></td><td><font size="2">ご注文から 2〜3 日</font></td></tr>
</table>
<br>
${CART}
<br><br>
<table border="0" width="500"><tr><td bgcolor="#FFFFEE"><font size="2">
<b>■この商品を買ったお客様の声</b><br>
${voices}
</font></td></tr></table>`,
);

const item2 = page(
  "無洗米 あきたこまち 5kg - ",
  `<font size="2"><a href="index.html">トップ</a> &gt; 無洗米 あきたこまち 5kg</font><br><br>
<font size="5"><b>無洗米 あきたこまち 5kg</b></font><br>
<img src="photo-sea.jpg" width="160" height="120" alt="産地の風景"><br>
<font color="#CC0000" size="7"><b>2,780円</b></font><font size="2">（税込）</font><br>
<font size="4" color="#CC0000"><b>★送料無料★</b></font>　<font size="3" color="#CC0000"><b>残りわずか！</b></font><br><br>
${CART}
<br><br>
<table border="0" width="500"><tr><td><font size="2">
とがずにそのまま炊けるので、忙しい朝にぴったり。<br>
お水の量はふつうのお米より少し多めにしてください。
</font></td></tr></table>`,
);

const voice = page(
  "お客様の声 - ",
  `<font size="5"><b>お客様の声</b></font><br>
<font size="2">たくさんのお便りをありがとうございます！</font><br><br>
<table border="1" cellpadding="8" cellspacing="0" width="560">
<tr><td><font size="2"><b>★★★★★</b>　東京都 Ｋ様<br>炊きたての香りが全然ちがいます！ もうスーパーのお米には戻れません。</font></td></tr>
<tr><td><font size="2"><b>★★★★★</b>　大阪府 Ｍ様<br>リピートしています。家族みんな大満足です。</font></td></tr>
<tr><td><font size="2"><b>★★★★☆</b>　福岡県 Ｓ様<br>届くのが早くてびっくり。袋がもう少し丈夫だとうれしいです。</font></td></tr>
<tr><td bgcolor="#FFFFEE"><font size="2"><b>店長より</b>：Ｓ様、ご意見ありがとうございます。次の入荷分から、厚手の袋に変えました！</font></td></tr>
</table>`,
);

const cart = page(
  "買い物かご - ",
  `<font size="5"><b>買い物かご</b></font><br><br>
<form>
<table border="1" cellpadding="6" cellspacing="0" width="560">
<tr bgcolor="#FFEEEE"><th>商品</th><th>価格</th><th>数量</th><th>小計</th></tr>
<tr><td>新米コシヒカリ 5kg</td><td>2,980円</td><td><input type="text" name="qty" size="3" value="1"></td><td>2,980円</td></tr>
<tr><td colspan="3" align="right">送料</td><td><font color="#CC0000"><b>無料</b></font></td></tr>
<tr><td colspan="3" align="right"><b>合計（税込）</b></td><td><font color="#CC0000" size="4"><b>2,980円</b></font></td></tr>
<tr><td colspan="3" align="right">今回もらえるポイント</td><td>145 ポイント</td></tr>
</table>
<p><input type="submit" value="ご注文の手続きへ"></p>
</form>
<font size="2">ご注文のページは SSL で暗号化されています。</font>`,
);

const guide = page(
  "ご利用ガイド - ",
  `<font size="5"><b>ご利用ガイド</b></font><br><br>
<table border="1" cellpadding="6" cellspacing="0" width="560">
<tr><td width="140" bgcolor="#FFEEEE">ご注文の流れ</td><td>商品を買い物かごに入れる → お客様の情報を入力 → 確認 → 完了。確認のメールが届きます</td></tr>
<tr><td bgcolor="#FFEEEE">お支払い方法</td><td>クレジットカード、代金引換、銀行振込</td></tr>
<tr><td bgcolor="#FFEEEE">送料</td><td>全品無料（沖縄・離島は別途）</td></tr>
<tr><td bgcolor="#FFEEEE">お届け</td><td>ご注文から 2〜3 日。日時の指定もできます</td></tr>
<tr><td bgcolor="#FFEEEE">ポイント</td><td>お買い上げ 100 円ごとに 1 ポイント。キャンペーン中は 5 倍です</td></tr>
</table>`,
);

const law = page(
  "特定商取引法に基づく表記 - ",
  `<font size="4"><b>特定商取引法に基づく表記</b></font><br><br>
<table border="1" cellpadding="6" cellspacing="0" width="520">
<tr><td width="140" bgcolor="#FFEEEE">販売業者</td><td>ほげほげ屋本舗（架空のお店です）</td></tr>
<tr><td bgcolor="#FFEEEE">運営責任者</td><td>ほげ田 ほげ男</td></tr>
<tr><td bgcolor="#FFEEEE">所在地</td><td>○○県○○市○○町1-2-3</td></tr>
<tr><td bgcolor="#FFEEEE">電話番号</td><td>0000-99-8765</td></tr>
<tr><td bgcolor="#FFEEEE">販売価格</td><td>各商品のページに表示（税込）</td></tr>
<tr><td bgcolor="#FFEEEE">お支払い方法</td><td>クレジットカード、代金引換、銀行振込</td></tr>
<tr><td bgcolor="#FFEEEE">送料</td><td>全品無料（沖縄・離島は別途）</td></tr>
<tr><td bgcolor="#FFEEEE">返品について</td><td>商品到着後 7 日以内にご連絡ください</td></tr>
</table>`,
);

export const pages: readonly SitePage[] = [
  { path: "index.html", html: index },
  { path: "item.html", html: item },
  { path: "item2.html", html: item2 },
  { path: "voice.html", html: voice },
  { path: "cart.html", html: cart },
  { path: "guide.html", html: guide },
  { path: "law.html", html: law },
];
