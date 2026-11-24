import type { SitePage } from "@anokoro/shared";

const STYLE = `<style type="text/css">
body { font-size: 13px; }
td { font-size: 13px; }
.title { font-size: 18px; font-weight: bold; color: #336633; }
.price { font-size: 16px; font-weight: bold; color: #CC0000; }
.step { font-size: 12px; color: #666666; }
.now { font-weight: bold; color: #336633; }
</style>`;
const page = (title: string, body: string): string => `<html>
<head>
<title>${title}ほげほげ茶舗 オンラインショップ</title>
${STYLE}
</head>
<body bgcolor="#FFFFF5" text="#333333" link="#336633" vlink="#666633">
<center>
<table border="0" cellpadding="4" cellspacing="0" width="600">
<tr><td bgcolor="#336633"><font size="5" color="#FFFFFF"><b>ほげほげ茶舗</b></font> <font color="#CCFFCC">創業明治三十年 お茶の専門店</font></td></tr>
<tr><td bgcolor="#E6F0D8" align="center">
<a href="index.html">トップ</a> ｜ <a href="list.html">商品一覧</a> ｜ <a href="cart.html"><img src="icon-cart.gif" width="24" height="20" alt="" border="0" align="absmiddle">買い物かご</a> ｜ <a href="ssl.html">安全なお買い物</a> ｜ <a href="about.html">お店について</a>
</td></tr>
</table>
<br>
<table border="0" cellpadding="0" cellspacing="0" width="580"><tr><td>
${body}
</td></tr></table>
<hr width="600">
<font size="1">ご注文・お問い合わせ：<a href="mailto:shop@hogehoge-chaho.example">shop@hogehoge-chaho.example</a>　電話 0000-88-1234（平日 9 時〜18 時）<br>
Copyright (C) 1999 Hogehoge Chaho. All Rights Reserved.</font>
</center>
</body>
</html>
`;
const steps = (now: number): string =>
  `<p class="step">${["買い物かご", "お客様の情報", "ご注文の確認", "受付完了"]
    .map((s, i) => (i + 1 === now ? `<span class="now">${i + 1}. ${s}</span>` : `${i + 1}. ${s}`))
    .join(" → ")}</p>`;
const CART_BUTTON = `<form><input type="submit" value="買い物かごへ"></form>`;

const index = page(
  "",
  `<center>
<span class="title">ようこそ、ほげほげ茶舗のオンラインショップへ</span><br><br>
<img src="photo-flower.jpg" width="160" height="120" alt="茶畑の花"><br><br>
店頭でおなじみのお茶を、インターネットでもご注文いただけるようになりました。<br>
ご注文は 24 時間受け付けています。
</center>
<br>
<table border="1" cellpadding="6" cellspacing="0" width="100%">
<tr bgcolor="#E6F0D8"><td colspan="2"><b>■おすすめの商品</b> <img src="mark-osusume.gif" width="48" height="16" alt="おすすめ"></td></tr>
<tr>
<td width="50%"><a href="item.html"><b>新茶 ほげ露 100g</b></a> <img src="new.gif" width="38" height="14" alt="NEW"><br><span class="price">1,500 円</span></td>
<td><b>ほうじ茶 200g</b><br><span class="price">800 円</span></td>
</tr>
</table>
<p>
<b>■お知らせ</b><br>
1999.11.01 オンラインショップを開店しました<br>
1999.11.01 クレジットカードでのお支払いは、<a href="ssl.html">SSL</a> で暗号化してお送りいただけます
</p>`,
);

const list = page(
  "商品一覧 - ",
  `<span class="title">商品一覧</span>
<table border="1" cellpadding="6" cellspacing="0" width="100%">
<tr bgcolor="#E6F0D8"><th>商品名</th><th>内容量</th><th>価格</th><th></th></tr>
<tr><td><a href="item.html">新茶 ほげ露</a></td><td>100g</td><td><span class="price">1,500 円</span></td><td><a href="cart.html"><img src="btn-cart.gif" width="140" height="28" alt="買い物かごへ" border="0"></a></td></tr>
<tr><td>深むし煎茶 みどり</td><td>100g</td><td><span class="price">1,000 円</span></td><td><a href="cart.html"><img src="btn-cart.gif" width="140" height="28" alt="買い物かごへ" border="0"></a></td></tr>
<tr><td>ほうじ茶</td><td>200g</td><td><span class="price">800 円</span></td><td><a href="cart.html"><img src="btn-cart.gif" width="140" height="28" alt="買い物かごへ" border="0"></a></td></tr>
<tr><td>贈答用 詰め合わせ</td><td>3 本入り</td><td><span class="price">3,500 円</span></td><td><a href="cart.html"><img src="btn-cart.gif" width="140" height="28" alt="買い物かごへ" border="0"></a></td></tr>
</table>
<p>価格は消費税別です。送料は全国一律 500 円、5,000 円以上のお買い上げで無料です。</p>`,
);

const item = page(
  "新茶 ほげ露 - ",
  `<a href="list.html">商品一覧</a> &gt; 新茶 ほげ露<br><br>
<table border="0" cellpadding="6" cellspacing="0" width="100%">
<tr>
<td valign="top"><img src="photo-flower.jpg" width="160" height="120" alt="新茶 ほげ露"></td>
<td valign="top">
<span class="title">新茶 ほげ露 100g</span><br>
<span class="price">1,500 円</span>（消費税別）<br><br>
ほげほげ山のふもとで、春いちばんに摘んだ新芽だけを使いました。<br>
さわやかな香りと、ほのかな甘みが特長です。<br><br>
${CART_BUTTON}
</td>
</tr>
</table>`,
);

const cart = page(
  "買い物かご - ",
  `<span class="title">買い物かご</span>
${steps(1)}
<form>
<table border="1" cellpadding="6" cellspacing="0" width="100%">
<tr bgcolor="#E6F0D8"><th>商品名</th><th>価格</th><th>数量</th><th>小計</th></tr>
<tr><td>新茶 ほげ露 100g</td><td>1,500 円</td><td><input type="text" name="qty" size="3" value="2"></td><td>3,000 円</td></tr>
<tr><td colspan="3" align="right">送料</td><td>500 円</td></tr>
<tr><td colspan="3" align="right"><b>合計（消費税別）</b></td><td><span class="price">3,500 円</span></td></tr>
</table>
<p><input type="submit" value="数量を変える"></p>
</form>
<p><a href="list.html">お買い物を続ける</a> ｜ <a href="order.html"><b>ご注文の手続きへ進む</b></a></p>`,
);

const order = page(
  "お客様の情報 - ",
  `<span class="title">お客様の情報</span>
${steps(2)}
<p>このページの通信は <a href="ssl.html">SSL</a> で暗号化されています。</p>
<form>
<table border="1" cellpadding="6" cellspacing="0" width="100%">
<tr><td width="140" bgcolor="#E6F0D8">お名前</td><td><input type="text" name="name" size="30"></td></tr>
<tr><td bgcolor="#E6F0D8">ご住所</td><td>〒<input type="text" name="zip" size="8"><br><input type="text" name="address" size="50"></td></tr>
<tr><td bgcolor="#E6F0D8">電話番号</td><td><input type="text" name="tel" size="20"></td></tr>
<tr><td bgcolor="#E6F0D8">メールアドレス</td><td><input type="text" name="email" size="40"></td></tr>
<tr><td bgcolor="#E6F0D8">お支払い方法</td><td>
<input type="radio" name="pay" value="cod" checked>代金引換
<input type="radio" name="pay" value="postal">郵便振替
<input type="radio" name="pay" value="card">クレジットカード
</td></tr>
</table>
</form>
<p><a href="cart.html">買い物かごに戻る</a> ｜ <a href="confirm.html"><b>確認画面へ進む</b></a></p>`,
);

const confirm = page(
  "ご注文の確認 - ",
  `<span class="title">ご注文の確認</span>
${steps(3)}
<table border="1" cellpadding="6" cellspacing="0" width="100%">
<tr><td width="140" bgcolor="#E6F0D8">ご注文の商品</td><td>新茶 ほげ露 100g × 2</td></tr>
<tr><td bgcolor="#E6F0D8">合計</td><td>3,500 円（送料込み、消費税別）</td></tr>
<tr><td bgcolor="#E6F0D8">お届け先</td><td>ほげほげ県ほげほげ市 ○○町 1-2-3　ほげ山 ほげ子 様</td></tr>
<tr><td bgcolor="#E6F0D8">お支払い方法</td><td>代金引換</td></tr>
</table>
<p>この内容でよろしければ、「注文する」を押してください。</p>
<p><a href="order.html">入力に戻る</a> ｜ <a href="thanks.html"><b>注文する</b></a></p>`,
);

const thanks = page(
  "ご注文の受付 - ",
  `<span class="title">ご注文を受け付けました</span>
${steps(4)}
<p>
ご注文ありがとうございました。<br>
ご注文の内容を、メールでお送りしました。届かない場合はお手数ですが、お電話でお問い合わせください。<br>
商品は 3 日ほどでお届けします。
</p>
<p><a href="index.html">トップページへ戻る</a></p>`,
);

const ssl = page(
  "安全なお買い物 - ",
  `<span class="title">安全なお買い物のために</span>
<p>
当店のご注文のページでは、SSL という仕組みで、お客様の情報を暗号化してお送りいただいています。<br>
お名前やご住所、クレジットカードの番号が、途中で読み取られることはありません。
</p>
<p>
暗号化されたページを開くと、ブラウザの下の方に鍵の印が表示されます。<br>
古いブラウザでは暗号化が使えないことがあります。その場合は、代金引換か郵便振替をお選びください。
</p>`,
);

const about = page(
  "お店について - ",
  `<span class="title">お店について（通信販売についての表示）</span>
<table border="1" cellpadding="6" cellspacing="0" width="100%">
<tr><td width="140" bgcolor="#E6F0D8">販売者</td><td>ほげほげ茶舗（代表 ほげ山 茶太郎）</td></tr>
<tr><td bgcolor="#E6F0D8">所在地</td><td>ほげほげ県ほげほげ市 茶町 3-1</td></tr>
<tr><td bgcolor="#E6F0D8">電話番号</td><td>0000-88-1234</td></tr>
<tr><td bgcolor="#E6F0D8">商品の価格</td><td>各商品のページに表示しています（消費税別）</td></tr>
<tr><td bgcolor="#E6F0D8">送料</td><td>全国一律 500 円。5,000 円以上のお買い上げで無料</td></tr>
<tr><td bgcolor="#E6F0D8">お支払い方法</td><td>代金引換、郵便振替、クレジットカード</td></tr>
<tr><td bgcolor="#E6F0D8">お届けの時期</td><td>ご注文から 3 日ほど</td></tr>
<tr><td bgcolor="#E6F0D8">返品について</td><td>商品の不良に限り、到着から 7 日以内にご連絡ください</td></tr>
</table>`,
);

export const pages: readonly SitePage[] = [
  { path: "index.html", html: index },
  { path: "list.html", html: list },
  { path: "item.html", html: item },
  { path: "cart.html", html: cart },
  { path: "order.html", html: order },
  { path: "confirm.html", html: confirm },
  { path: "thanks.html", html: thanks },
  { path: "ssl.html", html: ssl },
  { path: "about.html", html: about },
];
