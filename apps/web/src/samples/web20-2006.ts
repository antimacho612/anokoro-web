import type { SitePage } from "@anokoro/shared";

const STYLE = `<style type="text/css">
body { margin: 0; background-color: #FFFFFF; color: #445555; font-family: sans-serif; font-size: 13px; line-height: 160%; }
a { color: #2E8FCF; }
a:hover { color: #FF7A30; }
#head { background-color: #F4FAF0; background-image: url(kabe-pinstripe.png); border-bottom: 1px solid #D7E9CC; }
#head .in { width: 760px; margin: 0 auto; padding: 12px 0 8px 0; }
#logo { font-size: 36px; font-weight: bold; color: #6BB33A; }
#logo a { color: #6BB33A; text-decoration: none; }
#nav a { font-size: 14px; font-weight: bold; margin-right: 18px; text-decoration: none; }
#wrap { width: 760px; margin: 0 auto; padding: 8px 0 16px 0; }
.catch { font-size: 30px; font-weight: bold; color: #334444; text-align: center; margin: 24px 0 8px 0; }
.lead { font-size: 15px; text-align: center; color: #778888; margin: 0 0 16px 0; }
.r1, .r2, .r3, .r4 { display: block; height: 1px; overflow: hidden; background-color: #EAF5FC; }
.r1 { margin: 0 5px; }
.r2 { margin: 0 3px; }
.r3 { margin: 0 2px; }
.r4 { margin: 0 1px; height: 2px; }
.box { margin-bottom: 12px; }
.box .in { background-color: #EAF5FC; padding: 8px 16px; }
.green .r1, .green .r2, .green .r3, .green .r4, .green .in { background-color: #EEF8E6; }
h2 { font-size: 20px; color: #6BB33A; margin: 20px 0 8px 0; }
.col { float: left; width: 360px; margin-right: 20px; text-align: center; }
.clear { clear: both; }
.meta { font-size: 11px; color: #99AAAA; }
.t1 { font-size: 26px; }
.t2 { font-size: 20px; }
.t3 { font-size: 15px; }
.t4 { font-size: 12px; }
pre { background-color: #F7F7F7; border: 1px solid #DDDDDD; padding: 8px; font-size: 12px; }
#foot { clear: both; border-top: 1px solid #D7E9CC; text-align: center; font-size: 11px; color: #99AAAA; padding: 16px; }
</style>`;

const TOP = `<b class="r1"></b><b class="r2"></b><b class="r3"></b><b class="r4"></b>`;
const BOTTOM = `<b class="r4"></b><b class="r3"></b><b class="r2"></b><b class="r1"></b>`;
const box = (content: string, tone = ""): string =>
  `<div class="box${tone}">${TOP}<div class="in">${content}</div>${BOTTOM}</div>`;

const page = (
  title: string,
  body: string,
): string => `<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title>${title}ほげメモ β</title>
${STYLE}
</head>
<body>
<div id="head"><div class="in">
<span id="logo"><a href="index.html">ほげメモ</a></span>
<img src="badge-beta.png" width="64" height="64" alt="beta" align="top"><br>
<span id="nav"><a href="tour.html">ほげメモとは</a><a href="tags.html">人気のタグ</a><a href="api.html">API</a><a href="news.html">お知らせ</a><a href="faq.html">よくある質問</a><a href="signup.html">新規登録</a></span>
</div></div>
<div id="wrap">
${body}
</div>
<div id="foot">&copy; 2006 ほげほげ株式会社 ｜ ほげメモは、まだベータ版です</div>
</body>
</html>
`;

const SIGNUP_BUTTON = `<p align="center"><a href="signup.html"><img src="btn-glossy.png" width="140" height="36" alt="無料で登録する" border="0"></a><br>
<a href="signup.html"><b>無料で登録する</b></a>（30 秒で終わります）</p>`;

const index = page(
  "",
  `<p class="catch">メモを、みんなで育てよう。</p>
<p class="lead">ほげメモは、ブラウザだけで使える無料のメモ帳です。<br>
タグをつけて、公開して、みんなのメモとつながろう。</p>
${SIGNUP_BUTTON}
<div class="col"><img src="icon-soft-home.png" width="48" height="48" alt=""><br>
<b>どこからでも同じメモ</b><br>メモはサーバーに保存。会社でも家でも、同じメモが開けます。</div>
<div class="col"><img src="icon-soft-mail.png" width="48" height="48" alt=""><br>
<b>メールで投稿</b><br>携帯電話からメールを送るだけで、メモが増えます。</div>
<div class="clear"></div>
<h2>みんなの新着メモ</h2>
${box(`<a href="memo.html">駅前の喫茶店、ナポリタンがおいしい</a>　<span class="meta">by さくら ｜ タグ：カフェ ランチ</span><br>
読みたい本リスト 2006 秋　<span class="meta">by ほげ太 ｜ タグ：本</span><br>
自転車通勤で使える道　<span class="meta">by ゆうき ｜ タグ：自転車 地図</span>`)}
<h2>人気のタグ</h2>
${box(`<a href="tags.html">カフェ</a>　ランチ　本　自転車　レシピ　旅行　<a href="tags.html">もっと見る</a>`, " green")}`,
);

const tour = page(
  "ほげメモとは - ",
  `<p class="catch">ほげメモでできること</p>
${box(`<b>フォルダではなく、タグで整理</b><br>
メモにはタグをいくつでもつけられます。「カフェ」と「ランチ」の両方に入るメモも、迷わずしまえます。`)}
${box(`<b>公開して、みんなと共有</b><br>
メモは「公開」にすると、だれでも読めるようになります。同じタグをつけた人のメモも見られます。`)}
${box(`<b>地図とつなげる</b><br>
地図のサービスが公開している API を使って、メモに場所をつけ、地図の上に並べられます。`)}
${box(
  `<b>RSS で読む</b><br>
タグごとに RSS を用意しています。好きなタグの新しいメモを、RSS リーダーで受け取れます。`,
  " green",
)}
${SIGNUP_BUTTON}`,
);

const signup = page(
  "新規登録 - ",
  `<p class="catch">新規登録（無料）</p>
${box(`<form>
<p>ニックネーム<br><input type="text" name="nick" size="30"></p>
<p>メールアドレス<br><input type="text" name="mail" size="40"></p>
<p><input type="checkbox" name="agree"> 利用規約に同意します</p>
<p><input type="submit" value="登録する"></p>
</form>
<span class="meta">登録すると、ログインのための確認メールが届きます。</span>`)}
<p>使い方は<a href="tour.html">ほげメモとは</a>、わからないことは<a href="faq.html">よくある質問</a>をどうぞ。</p>`,
);

const tags = page(
  "人気のタグ - ",
  `<h2>人気のタグ</h2>
${box(`<p align="center"><a href="memo.html" class="t1">カフェ</a>　<span class="t3">旅行</span>　<span class="t2">ランチ</span>　<span class="t4">映画</span>　<span class="t2">本</span>　<span class="t3">自転車</span>　<span class="t4">ねこ</span>　<span class="t3">レシピ</span>　<span class="t4">音楽</span>　<span class="t4">地図</span></p>`)}
<p>たくさんの人が使っているタグほど、大きな文字で表示しています。</p>`,
);

const memo = page(
  "駅前の喫茶店、ナポリタンがおいしい - ",
  `<h2>駅前の喫茶店、ナポリタンがおいしい</h2>
<span class="meta">by さくら ｜ 2006年11月18日 ｜ タグ：<a href="tags.html">カフェ</a> ランチ ｜ 公開</span>
${box(`駅前の喫茶店のナポリタンが、昔ながらの味でおいしい。<br>
・平日のランチは 11 時半から<br>
・食後のコーヒーつき 650 円<br>
・土曜は混むので早めに`)}
<p>このメモをブックマークした人：12 人</p>
<h2>このメモを見た人は、こんなメモも見ています</h2>
${box(
  `パン屋さんめぐりの記録　<span class="meta">by ちょこ</span><br>
商店街の古本屋さんリスト　<span class="meta">by ほげ太</span>`,
  " green",
)}
<h2>ブログに貼る</h2>
<p>下のコードをコピーして、ブログに貼りつけてください。</p>
<textarea rows="2" cols="70">&lt;a href="http://hogememo.example/sakura/1118"&gt;駅前の喫茶店、ナポリタンがおいしい&lt;/a&gt;</textarea>`,
);

const api = page(
  "API - ",
  `<h2>開発者のかたへ：ほげメモ API（ベータ版）</h2>
<p>ほげメモの公開メモを、ほかのサービスから読み出せる API を公開しました。地図や写真のサービスと組み合わせて、新しい使い方を作ってみてください。</p>
${box(`<b>タグで公開メモを探す</b>
<pre>http://api.hogememo.example/v1/memos?tag=カフェ&amp;key=（あなたのキー）</pre>
<b>返ってくるデータ（XML）</b>
<pre>&lt;memos&gt;
  &lt;memo id="1118"&gt;
    &lt;title&gt;駅前の喫茶店、ナポリタンがおいしい&lt;/title&gt;
    &lt;tags&gt;カフェ ランチ&lt;/tags&gt;
  &lt;/memo&gt;
&lt;/memos&gt;</pre>`)}
<p>キーは、<a href="signup.html">登録</a>したあとに発行できます。仕様はベータ版のあいだ、変わることがあります。</p>`,
);

const news = page(
  "お知らせ - ",
  `<h2>お知らせ</h2>
${box(`<img src="ribbon-new.png" width="64" height="64" alt="NEW" align="right">
<b>2006/11/20</b>　<a href="api.html">API</a> を公開しました。マッシュアップ大歓迎です。<br>
<b>2006/10/16</b>　登録ユーザーが 1 万人を超えました。ありがとうございます！<br>
<b>2006/09/25</b>　タグを入力するときに、候補を出すようにしました。<br>
<b>2006/09/01</b>　ほげメモ β を公開しました。<br clear="all">`)}`,
);

const faq = page(
  "よくある質問 - ",
  `<h2>よくある質問</h2>
${box(`<b>Q. 「β」ってなんですか？</b><br>
A. まだ作っている途中、という意味です。使いながらみなさんの声を聞いて、どんどん直していきます。`)}
${box(`<b>Q. お金はかかりますか？</b><br>
A. 無料です。`)}
${box(
  `<b>Q. 携帯電話から見られますか？</b><br>
A. いまはメールでの投稿だけできます。携帯電話で読める画面は準備中です。`,
  " green",
)}`,
);

export const pages: readonly SitePage[] = [
  { path: "index.html", html: index },
  { path: "tour.html", html: tour },
  { path: "signup.html", html: signup },
  { path: "tags.html", html: tags },
  { path: "memo.html", html: memo },
  { path: "api.html", html: api },
  { path: "news.html", html: news },
  { path: "faq.html", html: faq },
];
