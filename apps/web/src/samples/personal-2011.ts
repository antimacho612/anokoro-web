import type { SitePage } from "@anokoro/shared";

const STYLE = `<style>
body { margin: 0; background-color: #F6F3EA; color: #3D3A33; font-family: sans-serif; font-size: 15px; line-height: 1.8; }
a { color: #4F8A3C; }
header { background-color: #FFFFFF; border-bottom: 1px solid #E2DCCB; padding: 16px 24px; }
header h1 { margin: 0; font-size: 24px; color: #4F8A3C; }
header p { margin: 0; font-size: 13px; color: #8A846F; }
nav { background-color: #4F8A3C; padding: 8px 24px; }
nav a { color: #FFFFFF; margin-right: 18px; text-decoration: none; }
.container { max-width: 880px; margin: 0 auto; padding: 16px; }
.hero img { width: 100%; height: auto; border-radius: 8px; }
article, aside { background-color: #FFFFFF; border-radius: 8px; box-shadow: 0 1px 4px rgba(0, 0, 0, 0.15); padding: 16px 20px; margin-bottom: 16px; }
article h2, aside h2 { margin-top: 0; font-size: 18px; border-left: 5px solid #8CC46E; padding-left: 8px; }
.date { font-size: 12px; color: #8A846F; }
.share { font-size: 13px; background-color: rgba(140, 196, 110, 0.15); border-radius: 4px; padding: 6px 10px; }
.faq dt { font-weight: bold; color: #4F8A3C; }
.faq dd { margin: 0 0 12px 0; }
footer { text-align: center; font-size: 12px; color: #8A846F; padding: 24px; }
@media screen and (max-width: 640px) {
  header, nav { padding-left: 12px; padding-right: 12px; }
  nav a { display: inline-block; margin: 4px 10px 4px 0; }
  .container { padding: 8px; }
}
</style>`;

const page = (title: string, body: string): string => `<!DOCTYPE html>
<html lang="ja">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${title}こはるのベランダ菜園</title>
${STYLE}
</head>
<body>
<header>
<h1>こはるのベランダ菜園</h1>
<p>マンションのベランダで、野菜とハーブを育てています</p>
</header>
<nav>
<a href="index.html">ホーム</a>
<a href="diary.html">栽培日記</a>
<a href="recipe.html">収穫レシピ</a>
<a href="about.html">プロフィール</a>
<a href="faq.html">よくある質問</a>
<a href="link.html">リンク</a>
</nav>
<div class="container">
${body}
</div>
<footer>
<a href="contact.html">お問い合わせ</a><br>
&copy; 2011 こはるのベランダ菜園
</footer>
</body>
</html>
`;

const index = page(
  "",
  `<figure class="hero">
<img src="photo-wide.jpg" width="1280" height="720" alt="ベランダのプランター">
</figure>
<article>
<h2>ミニトマトが色づきました</h2>
<p class="date"><time datetime="2011-06-19">2011.06.19</time></p>
<p>
5 月に植えたミニトマトが、やっと赤くなってきました。<br>
ベランダでも、日当たりと水やりに気をつければ、ちゃんと実がなります。くわしくは<a href="diary.html">栽培日記</a>で。
</p>
<p class="share">この記事が気に入ったら <a href="http://sns.hogehoge.example/share?url=http://www.hogespace.example/koharu/">SNS でシェア</a></p>
</article>
<aside>
<h2>このサイトについて</h2>
<p>
<img src="icon2x-menu.png" width="44" height="44" alt="" align="left" hspace="8">
はじめての方は<a href="faq.html">よくある質問</a>からどうぞ。<br>
小さな画面でも読みやすいように作っています。
</p>
</aside>`,
);

const diary = page(
  "栽培日記 - ",
  `<article>
<h2>ミニトマトが色づきました</h2>
<p class="date"><time datetime="2011-06-19">2011.06.19</time></p>
<p>一番花から 6 週間。毎朝ベランダに出るのが楽しみです。</p>
</article>
<article>
<h2>バジルを摘心しました</h2>
<p class="date"><time datetime="2011-06-12">2011.06.12</time></p>
<p>先っぽを摘むと、わき芽が増えてこんもり育ちます。摘んだ葉は<a href="recipe.html">ジェノベーゼ</a>に。</p>
</article>
<article>
<h2>プランターを並べかえ</h2>
<p class="date"><time datetime="2011-06-05">2011.06.05</time></p>
<p>夏の日ざしに備えて、背の高いトマトを奥に、ハーブを手前に置きなおしました。</p>
</article>
<article>
<h2>ベランダ菜園、はじめます</h2>
<p class="date"><time datetime="2011-04-29">2011.04.29</time></p>
<p>ホームセンターでプランターと土を買ってきました。今年は自分で育てた野菜を食べるのが目標です。</p>
</article>`,
);

const recipe = page(
  "収穫レシピ - ",
  `<article>
<h2>バジルのジェノベーゼ</h2>
<p>
材料：バジルの葉 30g、松の実 大さじ 1、にんにく 1 かけ、オリーブオイル 大さじ 4、塩 少々<br>
1. 材料をすべてすり鉢かミキサーでなめらかにします<br>
2. ゆでたパスタとからめたらできあがり
</p>
</article>
<article>
<h2>ミニトマトのマリネ</h2>
<p>
材料：ミニトマト 10 個、酢 大さじ 2、オリーブオイル 大さじ 1、はちみつ 小さじ 1<br>
湯むきしたミニトマトを、合わせた調味料に半日つけるだけ。冷やすとおいしいです。
</p>
</article>`,
);

const about = page(
  "プロフィール - ",
  `<article>
<h2>プロフィール</h2>
<p>
<img src="photo-me.jpg" width="96" height="96" alt="こはる" align="left" hspace="12">
こはる／会社員。ベランダ菜園 1 年目です。<br>
日記は SNS にも少しずつ書いています。プランター 6 つで、どこまで収穫できるか挑戦中。
</p>
</article>`,
);

const faq = page(
  "よくある質問 - ",
  `<article class="faq">
<h2>よくある質問</h2>
<dl>
<dt>Q. ベランダでも野菜は育ちますか？</dt>
<dd>A. 日が 4 時間以上当たれば、ミニトマトやハーブは十分に育ちます。</dd>
<dt>Q. 写真を使ってもいいですか？</dt>
<dd>A. 個人のブログで、このサイトへのリンクを付けていただければどうぞ。</dd>
<dt>Q. リンクしてもいいですか？</dt>
<dd>A. はい、ご自由にどうぞ。<a href="link.html">リンク</a>のページもご覧ください。</dd>
</dl>
</article>`,
);

const link = page(
  "リンク - ",
  `<article>
<h2>リンク</h2>
<p>
<a href="http://www.hogespace.example/herb/">ハーブのある暮らし</a> - 育て方がとても丁寧<br>
<a href="http://blog.hogespace.example/yasai/">ひよこ豆の家庭菜園ブログ</a> - 同じ年に始めた仲間です<br>
<a href="http://www.hogehoge.example/seed/">ほげほげ種苗</a> - 種はいつもここで
</p>
<p><img src="btn-flat.png" width="160" height="44" alt="このサイトのバナー"></p>
<p>このサイトはリンクフリーです。</p>
</article>`,
);

const contact = page(
  "お問い合わせ - ",
  `<article>
<h2>お問い合わせ</h2>
<p>ご感想やご質問はこちらからどうぞ。お返事には数日かかることがあります。</p>
<form>
<p>お名前<br><input type="text" name="name" size="30"></p>
<p>メールアドレス<br><input type="text" name="email" size="40"></p>
<p>内容<br><textarea name="message" cols="50" rows="6"></textarea></p>
<p><input type="submit" value="送信する"></p>
</form>
</article>`,
);

export const pages: readonly SitePage[] = [
  { path: "index.html", html: index },
  { path: "diary.html", html: diary },
  { path: "recipe.html", html: recipe },
  { path: "about.html", html: about },
  { path: "faq.html", html: faq },
  { path: "link.html", html: link },
  { path: "contact.html", html: contact },
];
