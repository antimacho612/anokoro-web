import type { SitePage } from "@anokoro/shared";

const STYLE = `<style type="text/css">
body { margin: 0; background: #F4F1EA url(kabe-pinstripe.png); color: #4A4238; font-family: sans-serif; font-size: 12px; line-height: 1.6; }
a { color: #8C5A2B; }
a:hover { color: #C0392B; }
#wrap { width: 920px; margin: 0 auto; background-color: #FFFFFF; }
#header { padding: 14px 20px; border-bottom: 3px solid #8C5A2B; }
#header h1 { margin: 0; font-size: 22px; color: #8C5A2B; }
#header p { margin: 0; color: #9A8F80; }
#side { float: left; width: 180px; padding: 16px; }
#side h3 { margin: 0 0 6px 0; padding: 4px 8px; font-size: 12px; color: #FFFFFF; background-color: #8C5A2B; }
#side ul { margin: 0 0 16px 0; padding: 0; list-style: none; }
#side ul > li { border-bottom: 1px dotted #D8CFC2; padding: 4px 6px; }
#side ul > li:hover { background-color: #FBF6EE; }
#main { float: right; width: 680px; padding: 16px 20px 16px 0; }
h2 { margin: 0 0 10px 0; padding: 4px 8px; font-size: 15px; border-bottom: 2px solid #D8CFC2; }
.items { width: 100%; border-collapse: collapse; }
.items td { width: 33%; padding: 8px; text-align: center; vertical-align: top; }
.price { color: #C0392B; font-weight: bold; font-size: 14px; }
.free { color: #FFFFFF; background-color: #C0392B; padding: 1px 4px; font-size: 11px; }
.stars { color: #E0A020; }
table.spec { border-collapse: collapse; width: 100%; }
table.spec th, table.spec td { border: 1px solid #D8CFC2; padding: 6px; text-align: left; }
table.spec th { width: 140px; background-color: #FBF6EE; }
#footer { clear: both; padding: 12px; text-align: center; font-size: 11px; color: #9A8F80; border-top: 1px solid #D8CFC2; }
</style>`;

const page = (
  title: string,
  body: string,
): string => `<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title>${title}雑貨と暮らしの店 ほげほげ</title>
${STYLE}
</head>
<body>
<div id="wrap">
<div id="header">
<h1>雑貨と暮らしの店 ほげほげ</h1>
<p>毎日つかう道具を、すこしだけ気持ちよく。　3,980 円以上で送料無料</p>
</div>
<div id="side">
<h3>カテゴリ</h3>
<ul>
<li><a href="category.html">キッチン雑貨</a></li>
<li>テーブルウェア</li>
<li>収納とインテリア</li>
<li>ギフトセット</li>
</ul>
<h3>ご案内</h3>
<ul>
<li><a href="guide.html">ご利用ガイド</a></li>
<li><a href="review.html">お客様のレビュー</a></li>
<li><a href="cart.html"><img src="icon-cart.gif" width="24" height="20" alt="" border="0" align="absmiddle"> 買い物かご</a></li>
</ul>
<p><a href="http://blog.hogespace.example/zakka-hogehoge/"><img src="bn-blog.gif" width="88" height="31" alt="店長ブログ" border="0"></a><br>店長ブログも毎日更新中</p>
<p><img src="badge-rss.gif" width="80" height="15" alt="RSS"> 新商品のお知らせ</p>
</div>
<div id="main">
${body}
</div>
<div id="footer">
<a href="guide.html">ご利用ガイド</a> ｜ <a href="law.html">特定商取引法に基づく表記</a> ｜ <a href="mailto:info@zakka-hogehoge.example">お問い合わせ</a><br>
Copyright (C) 2008 Zakka Hogehoge. All Rights Reserved.
</div>
</div>
</body>
</html>
`;
const CART = `<form><p>数量 <input type="text" name="qty" size="3" value="1"> <input type="submit" value="かごに入れる"></p></form>`;

const index = page(
  "",
  `<h2>新着アイテム <img src="ribbon-new.png" width="32" height="32" alt="NEW" align="absmiddle"></h2>
<table class="items">
<tr>
<td><a href="item.html"><img src="photo-flower.jpg" width="160" height="120" alt="ほうろうのミルクパン" border="0"></a><br><a href="item.html">ほうろうのミルクパン</a><br><span class="price">2,940 円</span></td>
<td><img src="photo-sea.jpg" width="160" height="120" alt="ガラスの保存びん"><br>ガラスの保存びん 3 個組<br><span class="price">1,890 円</span></td>
<td><img src="photo-cat.jpg" width="160" height="120" alt="ねこの箸置き"><br>ねこの箸置き<br><span class="price">630 円</span></td>
</tr>
</table>
<h2>売れ筋ランキング</h2>
<ol>
<li><a href="item.html">ほうろうのミルクパン</a>（<span class="stars">★★★★★</span> レビュー 48 件）</li>
<li>木のカッティングボード（<span class="stars">★★★★☆</span> レビュー 31 件）</li>
<li>ガラスの保存びん 3 個組（<span class="stars">★★★★☆</span> レビュー 22 件）</li>
</ol>
<h2>お知らせ</h2>
<p>
2008.11.20　冬のギフトのご注文を受け付けています。ラッピングは無料です<br>
2008.11.01　<a href="category.html">キッチン雑貨</a>に新しい商品を 12 点追加しました
</p>`,
);

const category = page(
  "キッチン雑貨 - ",
  `<p><a href="index.html">トップ</a> &gt; キッチン雑貨</p>
<h2>キッチン雑貨（24 件）</h2>
<p>並べかえ：新着順 ｜ 価格の安い順 ｜ レビューの多い順</p>
<table class="items">
<tr>
<td><a href="item.html"><img src="photo-flower.jpg" width="160" height="120" alt="ほうろうのミルクパン" border="0"></a><br><a href="item.html">ほうろうのミルクパン</a><br><span class="price">2,940 円</span></td>
<td><img src="photo-sea.jpg" width="160" height="120" alt="ガラスの保存びん"><br>ガラスの保存びん 3 個組<br><span class="price">1,890 円</span></td>
<td><img src="photo-cat.jpg" width="160" height="120" alt="木のカッティングボード"><br>木のカッティングボード<br><span class="price">3,150 円</span></td>
</tr>
</table>
<p>1 ｜ 2 ｜ 3 ｜ 次へ</p>`,
);

const item = page(
  "ほうろうのミルクパン - ",
  `<p><a href="index.html">トップ</a> &gt; <a href="category.html">キッチン雑貨</a> &gt; ほうろうのミルクパン</p>
<h2>ほうろうのミルクパン</h2>
<p><img src="photo-flower.jpg" width="160" height="120" alt="ほうろうのミルクパン" align="left" hspace="12">
<span class="price">2,940 円</span>（税込） <span class="free">3,980 円以上で送料無料</span><br>
<span class="stars">★★★★★</span> <a href="review.html">レビュー 48 件</a><br><br>
ミルクをあたためたり、少しのスープを作ったり。白いほうろうは、においが移りにくく、洗うのもかんたんです。<br>
在庫：あり（ご注文から 2 営業日以内に発送）
</p>
<div style="clear: both;"></div>
${CART}
<table class="spec">
<tr><th>サイズ</th><td>直径 14cm、深さ 7cm</td></tr>
<tr><th>容量</th><td>約 800ml</td></tr>
<tr><th>素材</th><td>ほうろう、木（取っ手）</td></tr>
<tr><th>ギフト</th><td>ラッピング無料。のし、メッセージカードも承ります</td></tr>
</table>`,
);

const review = page(
  "お客様のレビュー - ",
  `<h2>お客様のレビュー</h2>
<dl>
<dt><span class="stars">★★★★★</span> 毎朝つかっています（ほげ子さん・30 代）</dt>
<dd><a href="item.html">ほうろうのミルクパン</a>　白がかわいくて、キッチンに出しっぱなしにしています。</dd>
<dt><span class="stars">★★★★☆</span> 贈り物に（まめさん・40 代）</dt>
<dd>木のカッティングボード　ラッピングがていねいで喜ばれました。届くまでに少し時間がかかったので★ 4 つ。</dd>
<dt><span class="stars">★★★★★</span> リピートです（ちょこさん・20 代）</dt>
<dd>ガラスの保存びん 3 個組　サイズちがいで使いやすいです。</dd>
</dl>
<p>レビューを書いてくださった方には、次回使える 100 円分のクーポンをお送りしています。</p>`,
);

const cart = page(
  "買い物かご - ",
  `<h2>買い物かご</h2>
<form>
<table class="spec">
<tr><th>商品</th><th>価格</th><th>数量</th><th>小計</th></tr>
<tr><td>ほうろうのミルクパン</td><td>2,940 円</td><td><input type="text" name="qty" size="3" value="1"></td><td>2,940 円</td></tr>
<tr><td colspan="3">送料（あと 1,040 円で無料）</td><td>500 円</td></tr>
<tr><td colspan="3"><b>合計（税込）</b></td><td><span class="price">3,440 円</span></td></tr>
</table>
<p><input type="submit" value="数量を変える"> <input type="submit" value="ご注文の手続きへ"></p>
</form>
<p>ご注文の手続きのページは、SSL で暗号化されています。</p>`,
);

const guide = page(
  "ご利用ガイド - ",
  `<h2>ご利用ガイド</h2>
<table class="spec">
<tr><th>お支払い方法</th><td>クレジットカード、代金引換、銀行振込、コンビニ払い</td></tr>
<tr><th>送料</th><td>全国一律 500 円。3,980 円以上のお買い上げで無料</td></tr>
<tr><th>発送</th><td>ご注文から 2 営業日以内。お届けの日時を指定できます</td></tr>
<tr><th>ラッピング</th><td>無料。ご注文の際に「ギフト」をお選びください</td></tr>
<tr><th>会員登録</th><td>しなくてもお買い物できます。登録すると、次回からお届け先の入力がかんたんになります</td></tr>
</table>`,
);

const law = page(
  "特定商取引法に基づく表記 - ",
  `<h2>特定商取引法に基づく表記</h2>
<table class="spec">
<tr><th>販売業者</th><td>雑貨と暮らしの店 ほげほげ（架空のお店です）</td></tr>
<tr><th>運営責任者</th><td>ほげ野 ほげ美</td></tr>
<tr><th>所在地</th><td>ほげほげ県ほげほげ市 本町 5-6-7</td></tr>
<tr><th>電話番号</th><td>0000-55-4321（平日 10 時〜17 時）</td></tr>
<tr><th>販売価格</th><td>各商品のページに表示（税込）</td></tr>
<tr><th>商品代金以外の費用</th><td>送料 500 円（3,980 円以上で無料）、代金引換の手数料 315 円</td></tr>
<tr><th>返品について</th><td>商品到着後 7 日以内に、未使用のものに限り承ります</td></tr>
</table>`,
);

export const pages: readonly SitePage[] = [
  { path: "index.html", html: index },
  { path: "category.html", html: category },
  { path: "item.html", html: item },
  { path: "review.html", html: review },
  { path: "cart.html", html: cart },
  { path: "guide.html", html: guide },
  { path: "law.html", html: law },
];
