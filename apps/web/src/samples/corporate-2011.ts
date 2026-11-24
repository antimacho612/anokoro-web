import type { SitePage } from "@anokoro/shared";

const STYLE = `<style>
body { margin: 0; background-color: #FBF6EE; color: #4A3B2C; font-family: sans-serif; font-size: 15px; line-height: 1.8; }
a { color: #B5651D; }
header { background-color: #FFFFFF; border-bottom: 3px solid #E0B97B; padding: 14px 24px; }
header h1 { margin: 0; font-size: 26px; color: #8B5A2B; }
header p { margin: 0; font-size: 13px; color: #9C8A74; }
nav { background-color: #8B5A2B; padding: 8px 24px; }
nav a { color: #FFFFFF; margin-right: 20px; text-decoration: none; }
.container { max-width: 900px; margin: 0 auto; padding: 16px; }
.hero img { width: 100%; height: auto; border-radius: 10px; }
section, aside { background-color: #FFFFFF; border-radius: 10px; box-shadow: 0 2px 6px rgba(74, 59, 44, 0.18); padding: 16px 22px; margin-bottom: 18px; }
section h2, aside h2 { margin-top: 0; font-size: 19px; color: #8B5A2B; border-bottom: 2px dotted #E0B97B; padding-bottom: 4px; }
.date { font-size: 12px; color: #9C8A74; margin-right: 8px; }
.items { list-style: none; margin: 0; padding: 0; }
.items li { padding: 8px 0; border-bottom: 1px solid #F0E4D2; }
.price { float: right; font-weight: bold; color: #B5651D; }
.notice { background-color: rgba(224, 185, 123, 0.2); border-radius: 6px; padding: 8px 12px; }
table.info { border-collapse: collapse; width: 100%; }
table.info th, table.info td { border-bottom: 1px solid #F0E4D2; padding: 8px; text-align: left; vertical-align: top; }
table.info th { width: 130px; color: #8B5A2B; }
footer { text-align: center; font-size: 12px; color: #9C8A74; padding: 24px; }
@media screen and (max-width: 640px) {
  header, nav { padding-left: 12px; padding-right: 12px; }
  nav a { display: inline-block; margin: 4px 12px 4px 0; }
  .container { padding: 8px; }
  table.info th { width: 90px; }
}
</style>`;

const page = (title: string, body: string): string => `<!DOCTYPE html>
<html lang="ja">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${title}パン工房こむぎ</title>
${STYLE}
</head>
<body>
<header>
<h1>パン工房こむぎ</h1>
<p>毎朝 7 時に焼き上がる、町のちいさなパン屋さん</p>
</header>
<nav>
<a href="index.html">ホーム</a>
<a href="menu.html">パンのご紹介</a>
<a href="shop.html">店舗案内</a>
<a href="news.html">お知らせ</a>
<a href="recruit.html">スタッフ募集</a>
</nav>
<div class="container">
${body}
</div>
<footer>
<a href="contact.html">お問い合わせ</a> ｜ <a href="privacy.html">プライバシーポリシー</a><br>
&copy; 2011 パン工房こむぎ
</footer>
</body>
</html>
`;

const index = page(
  "",
  `<figure class="hero">
<img src="photo-wide.jpg" width="1280" height="720" alt="焼きたてのパンが並ぶ店内">
</figure>
<section>
<h2>お知らせ</h2>
<p><span class="date"><time datetime="2011-10-01">2011.10.01</time></span>秋の新作「さつまいもとくるみのパン」が登場しました</p>
<p><span class="date"><time datetime="2011-09-15">2011.09.15</time></span>ホームページをリニューアルしました。小さな画面でも見やすくなりました</p>
<p><a href="news.html">お知らせの一覧へ</a></p>
</section>
<aside>
<h2>焼き上がりの時間をお知らせしています</h2>
<p>
<img src="icon2x-search.png" width="44" height="44" alt="" align="left" hspace="8">
その日の焼き上がり時間や売り切れのお知らせは、<a href="http://sns.hogehoge.example/komugi">公式 SNS アカウント</a>でお届けしています。<br>
フォローしていただくと、焼きたてに間に合います。
</p>
</aside>`,
);

const menu = page(
  "パンのご紹介 - ",
  `<section>
<h2>定番のパン</h2>
<ul class="items">
<li><span class="price">180 円</span>こむぎ食パン（ハーフ）<br><small>北海道産の小麦だけで焼いた、もちもちの食パン</small></li>
<li><span class="price">150 円</span>塩バターロール<br><small>いちばん人気。焼きたては外がカリッとしています</small></li>
<li><span class="price">200 円</span>カレーパン<br><small>ひき肉と野菜をじっくり煮込んだ自家製カレー入り</small></li>
<li><span class="price">160 円</span>メロンパン<br><small>クッキー生地はサクサク、中はふんわり</small></li>
</ul>
</section>
<section>
<h2>季節のパン</h2>
<ul class="items">
<li><span class="price">220 円</span>さつまいもとくるみのパン<br><small>10 月から 11 月までの限定です</small></li>
</ul>
<p class="notice">価格はすべて税込です。焼き上がりの時間は日によって変わります。</p>
</section>`,
);

const shop = page(
  "店舗案内 - ",
  `<section>
<h2>店舗案内</h2>
<table class="info">
<tr><th>住所</th><td>ほげほげ市さくら町 2-7-1</td></tr>
<tr><th>営業時間</th><td>7:00〜19:00（売り切れしだい閉店）</td></tr>
<tr><th>定休日</th><td>月曜日、第 3 火曜日</td></tr>
<tr><th>電話</th><td>0000-66-7777</td></tr>
<tr><th>駐車場</th><td>3 台（お店の裏手）</td></tr>
</table>
</section>
<section>
<h2>アクセス</h2>
<p>
ほげほげ駅の東口から、さくら通りをまっすぐ歩いて 5 分。郵便局の向かいです。<br>
地図アプリでは「パン工房こむぎ」で検索してください。
</p>
<p><img src="photo-flower.jpg" width="160" height="120" alt="お店の前の花だん"></p>
</section>`,
);

const news = page(
  "お知らせ - ",
  `<section>
<h2>お知らせ</h2>
<p><span class="date"><time datetime="2011-10-01">2011.10.01</time></span>秋の新作「さつまいもとくるみのパン」が登場しました</p>
<p><span class="date"><time datetime="2011-09-15">2011.09.15</time></span>ホームページをリニューアルしました。小さな画面でも見やすくなりました</p>
<p><span class="date"><time datetime="2011-08-10">2011.08.10</time></span>8 月 14 日から 16 日まで、夏休みをいただきます</p>
<p><span class="date"><time datetime="2011-06-01">2011.06.01</time></span>公式 SNS アカウントで、焼き上がりのお知らせを始めました</p>
<p><span class="date"><time datetime="2011-04-01">2011.04.01</time></span>開店 5 周年を迎えました。いつもありがとうございます</p>
</section>`,
);

const recruit = page(
  "スタッフ募集 - ",
  `<section>
<h2>スタッフ募集</h2>
<p>いっしょにパンを焼いてくれる仲間を探しています。未経験の方も歓迎します。</p>
<table class="info">
<tr><th>職種</th><td>製造スタッフ（早朝）、販売スタッフ</td></tr>
<tr><th>勤務時間</th><td>製造 5:00〜10:00、販売 10:00〜19:00 のうち 4 時間から</td></tr>
<tr><th>時給</th><td>800 円から（研修期間あり）</td></tr>
<tr><th>応募方法</th><td>お電話（0000-66-7777）か、<a href="contact.html">お問い合わせフォーム</a>からご連絡ください</td></tr>
</table>
</section>`,
);

const contact = page(
  "お問い合わせ - ",
  `<section>
<h2>お問い合わせ</h2>
<p>ご予約、ご質問、スタッフ募集への応募はこちらから。<a href="privacy.html">プライバシーポリシー</a>をご確認のうえお送りください。</p>
<form>
<p>ご用件<br>
<select name="type">
<option>パンのご予約</option><option>スタッフ募集への応募</option><option>そのほか</option>
</select>
</p>
<p>お名前<br><input type="text" name="name" size="30"></p>
<p>メールアドレス<br><input type="text" name="email" size="40"></p>
<p>内容<br><textarea name="message" cols="50" rows="6"></textarea></p>
<p><input type="submit" value="送信する"></p>
</form>
<p class="notice">パンのご予約は、受け取りの前日 17 時までにお願いします。</p>
</section>`,
);

const privacy = page(
  "プライバシーポリシー - ",
  `<section>
<h2>プライバシーポリシー</h2>
<p>パン工房こむぎは、お客様からお預かりした個人情報を、次のとおり大切に扱います。</p>
<p>
1. お問い合わせでお預かりした個人情報は、お返事とご予約の確認のためだけに使います。<br>
2. 法令に定める場合を除き、ご本人の同意なく第三者に提供しません。<br>
3. 個人情報の確認や削除をご希望の方は、店頭かお電話でお申し出ください。
</p>
<p>制定：2011年9月15日</p>
</section>`,
);

export const pages: readonly SitePage[] = [
  { path: "index.html", html: index },
  { path: "menu.html", html: menu },
  { path: "shop.html", html: shop },
  { path: "news.html", html: news },
  { path: "recruit.html", html: recruit },
  { path: "contact.html", html: contact },
  { path: "privacy.html", html: privacy },
];
