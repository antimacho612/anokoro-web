import type { SitePage } from "@anokoro/shared";

const STYLE = `<style>
body { margin: 0; background-color: #F7F3EE; color: #3B2F26; font-family: sans-serif; font-size: 15px; line-height: 1.8; }
a { color: #A0522D; transition: color 0.2s; }
a:hover { color: #6B3410; }
header { background: linear-gradient(#5A3A22, #3B2414); color: #FFFFFF; padding: 16px 24px; }
header h1 { margin: 0; font-size: 26px; text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5); }
header p { margin: 0; font-size: 13px; color: #E8D6C3; }
nav { background-color: #FFFFFF; border-bottom: 1px solid #E5DACE; padding: 8px 24px; }
nav a { margin-right: 18px; text-decoration: none; }
.container { max-width: 960px; margin: 0 auto; padding: 16px; }
.hero img { width: 100%; height: auto; border-radius: 8px; }
section { background-color: #FFFFFF; border-radius: 8px; box-shadow: 0 1px 4px rgba(0, 0, 0, 0.12); padding: 16px 22px; margin-bottom: 18px; }
section h2 { margin-top: 0; font-size: 19px; border-left: 5px solid #A0522D; padding-left: 10px; }
.cards { list-style: none; margin: 0; padding: 0; }
.cards li { display: inline-block; vertical-align: top; width: 30%; margin: 0 1% 16px 0; }
.cards img { width: 100%; height: auto; border-radius: 6px; }
.price { color: #B03A2E; font-weight: bold; }
.badge { display: inline-block; background-color: #B03A2E; color: #FFFFFF; font-size: 12px; padding: 0 8px; border-radius: 10px; }
.button { display: inline-block; background-color: #A0522D; color: #FFFFFF; padding: 8px 24px; border: none; border-radius: 20px; font-size: 15px; }
.stars { color: #E0A020; }
table.spec { border-collapse: collapse; width: 100%; }
table.spec th, table.spec td { border-bottom: 1px solid #EFE6DC; padding: 8px; text-align: left; vertical-align: top; }
table.spec th { width: 30%; color: #6B4A33; }
input[type="text"], input[type="email"], textarea { width: 100%; max-width: 420px; padding: 6px; border: 1px solid #CBB9A6; border-radius: 4px; font-size: 15px; }
footer { text-align: center; font-size: 12px; color: #8A7A6B; padding: 24px; }
@media screen and (max-width: 640px) {
  header, nav { padding-left: 12px; padding-right: 12px; }
  nav a { display: inline-block; margin: 4px 12px 4px 0; }
  .container { padding: 8px; }
  .cards li { width: 100%; margin-right: 0; }
}
</style>`;

const page = (title: string, body: string): string => `<!DOCTYPE html>
<html lang="ja">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${title}ほげほげ珈琲ロースター</title>
${STYLE}
</head>
<body>
<header>
<h1>ほげほげ珈琲ロースター</h1>
<p>注文を受けてから焼く、自家焙煎のコーヒー豆</p>
</header>
<nav>
<a href="index.html">ホーム</a>
<a href="beans.html">コーヒー豆</a>
<a href="guide.html">ご利用ガイド</a>
<a href="cart.html">カート</a>
<a href="contact.html">お問い合わせ</a>
</nav>
<div class="container">
${body}
</div>
<footer>
<a href="guide.html">ご利用ガイド</a> ｜ <a href="law.html">特定商取引法に基づく表記</a> ｜ <a href="contact.html">お問い合わせ</a><br>
&copy; 2012 ほげほげ珈琲ロースター
</footer>
</body>
</html>
`;

const card = (img: string, name: string, price: string, href = ""): string =>
  `<li><img src="${img}" width="160" height="120" alt="${name}"><br>${href ? `<a href="${href}">${name}</a>` : name}<br><span class="price">${price}</span></li>`;

const index = page(
  "",
  `<figure class="hero">
<img src="photo-wide.jpg" width="1280" height="720" alt="焙煎機と、焼き上がったコーヒー豆">
</figure>
<section>
<h2>今月のおすすめ</h2>
<ul class="cards">
${card("photo-flower.jpg", "ほげほげブレンド 200g", "1,050 円", "item.html")}
${card("photo-sea.jpg", "深煎り マンデリン 200g", "1,260 円")}
${card("photo-cat.jpg", "カフェインレス 200g", "1,260 円")}
</ul>
<p><a href="beans.html">コーヒー豆の一覧へ</a></p>
</section>
<section>
<h2>お知らせ</h2>
<p><time datetime="2012-10-01">2012.10.01</time>　メッセージアプリの公式アカウントを始めました。焙煎の予定とセールのお知らせをお届けします</p>
<p><time datetime="2012-09-15">2012.09.15</time>　スマートフォンからも見やすく、買いやすくなりました</p>
</section>
<section>
<h2>公式アカウントで、焼きたての日をお知らせ</h2>
<p>
<img src="icon2x-search.png" width="44" height="44" alt="" align="left" hspace="8">
メッセージアプリで「ほげほげ珈琲ロースター」を探して、友だちに追加してください。<br>
焙煎の日とセールの情報が、いち早く届きます。
</p>
</section>`,
);

const beans = page(
  "コーヒー豆 - ",
  `<section>
<h2>コーヒー豆</h2>
<p>すべて 200g です。ご注文をいただいてから焙煎し、2 日以内に発送します。</p>
<ul class="cards">
${card("photo-flower.jpg", "ほげほげブレンド", "1,050 円", "item.html")}
${card("photo-sea.jpg", "深煎り マンデリン", "1,260 円")}
${card("photo-cat.jpg", "カフェインレス", "1,260 円")}
${card("photo-me.jpg", "浅煎り エチオピア", "1,365 円")}
</ul>
</section>`,
);

const item = page(
  "ほげほげブレンド - ",
  `<section>
<h2>ほげほげブレンド 200g <span class="badge">人気 No.1</span></h2>
<p><img src="photo-flower.jpg" width="160" height="120" alt="ほげほげブレンド" align="left" hspace="12">
<span class="price">1,050 円</span>（税込）<br>
<span class="stars">★★★★★</span> レビュー 126 件<br>
苦みと甘みのバランスがよい、お店の看板ブレンドです。毎朝の一杯にどうぞ。</p>
<form>
<p>豆の状態
<select name="grind"><option>豆のまま</option><option>中挽き（ドリップ用）</option><option>細挽き</option></select></p>
<p><input type="submit" class="button" value="カートに入れる"></p>
</form>
<table class="spec">
<tr><th>焙煎</th><td>中深煎り</td></tr>
<tr><th>味わい</th><td>苦み ★★★☆☆　酸味 ★★☆☆☆　コク ★★★★☆</td></tr>
<tr><th>定期便</th><td>毎月お届けする定期便なら 10% 引き</td></tr>
</table>
</section>
<section>
<h2>お客様のレビュー</h2>
<p><span class="stars">★★★★★</span> 届いた日に開けると、部屋中がいい香りに。（ゆずさん）</p>
<p><span class="stars">★★★★☆</span> 定期便で頼んでいます。スマホから注文できるので楽です。（たけさん）</p>
</section>`,
);

const cart = page(
  "カート - ",
  `<section>
<h2>カート</h2>
<table class="spec">
<tr><th>ほげほげブレンド 200g（中挽き）</th><td>1,050 円 × 2</td></tr>
<tr><th>送料</th><td>無料（3,000 円以上で無料。メール便は全国 180 円）</td></tr>
<tr><th>合計（税込）</th><td><span class="price">2,280 円</span></td></tr>
</table>
<form>
<p><input type="submit" class="button" value="ご購入の手続きへ"></p>
</form>
<p>お支払いの画面は、SSL で暗号化されています。</p>
</section>`,
);

const guide = page(
  "ご利用ガイド - ",
  `<section>
<h2>ご利用ガイド</h2>
<table class="spec">
<tr><th>お支払い方法</th><td>クレジットカード、代金引換、コンビニ払い</td></tr>
<tr><th>送料</th><td>全国一律 500 円。3,000 円以上で無料。豆 2 袋までならメール便 180 円</td></tr>
<tr><th>発送</th><td>ご注文から焙煎して、2 日以内に発送します</td></tr>
<tr><th>スマートフォン</th><td>スマートフォンからも、パソコンと同じようにご注文いただけます</td></tr>
</table>
</section>`,
);

const law = page(
  "特定商取引法に基づく表記 - ",
  `<section>
<h2>特定商取引法に基づく表記</h2>
<table class="spec">
<tr><th>販売業者</th><td>ほげほげ珈琲ロースター（架空のお店です）</td></tr>
<tr><th>運営責任者</th><td>ほげ川 ほげ平</td></tr>
<tr><th>所在地</th><td>ほげほげ県ほげほげ市 港町 9-8</td></tr>
<tr><th>電話番号</th><td>0000-22-3344</td></tr>
<tr><th>販売価格</th><td>各商品のページに表示（税込）</td></tr>
<tr><th>商品代金以外の費用</th><td>送料（3,000 円以上で無料）、代金引換の手数料 315 円</td></tr>
<tr><th>返品について</th><td>焙煎した食品のため、商品の不良をのぞき返品はお受けできません</td></tr>
</table>
</section>`,
);

const contact = page(
  "お問い合わせ - ",
  `<section>
<h2>お問い合わせ</h2>
<p>ご注文や豆についてのご質問は、こちらからどうぞ。2 営業日以内にお返事します。</p>
<form>
<p>お名前<br><input type="text" name="name" placeholder="例：ほげ山 ほげ子" required></p>
<p>メールアドレス<br><input type="email" name="email" placeholder="例：hoge@example.com" required></p>
<p>内容<br><textarea name="message" rows="6" required></textarea></p>
<p><input type="submit" class="button" value="送信する"></p>
</form>
</section>`,
);

export const pages: readonly SitePage[] = [
  { path: "index.html", html: index },
  { path: "beans.html", html: beans },
  { path: "item.html", html: item },
  { path: "cart.html", html: cart },
  { path: "guide.html", html: guide },
  { path: "law.html", html: law },
  { path: "contact.html", html: contact },
];
