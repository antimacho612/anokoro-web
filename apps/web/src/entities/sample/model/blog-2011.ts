import type { SitePage } from "@anokoro/shared";

const STYLE = `<style>
body { margin: 0; background-color: #F4F6F2; color: #333333; font-family: sans-serif; font-size: 15px; line-height: 1.9; }
a { color: #3A7D5C; }
header { background-color: #FFFFFF; border-bottom: 1px solid #DDE3D8; padding: 18px 24px; }
header h1 { margin: 0; font-size: 24px; }
header h1 a { color: #2F4F3F; text-decoration: none; }
header p { margin: 0; font-size: 13px; color: #7A8A7F; }
.container { max-width: 960px; margin: 0 auto; padding: 16px; }
.main { float: left; width: 66%; }
.side { float: right; width: 30%; }
article, .box { background-color: #FFFFFF; border-radius: 6px; box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12); padding: 18px 22px; margin-bottom: 18px; }
article h2 { margin: 0 0 4px 0; font-size: 20px; }
article h2 a { color: #2F4F3F; text-decoration: none; }
.meta { font-size: 12px; color: #8A968D; }
figure { margin: 0 0 8px 0; }
figure img { max-width: 100%; height: auto; border-radius: 4px; }
.tag { display: inline-block; background-color: #E6F0EA; color: #3A7D5C; border-radius: 10px; padding: 0 10px; font-size: 12px; margin-right: 4px; }
.share { font-size: 13px; background-color: rgba(58, 125, 92, 0.08); border-radius: 4px; padding: 6px 10px; }
.box h3 { margin: 0 0 8px 0; font-size: 14px; color: #3A7D5C; }
.box ol, .box ul { margin: 0; padding-left: 20px; }
.comment { border-top: 1px solid #EEF1EC; padding: 8px 0; }
.comment .meta { display: block; }
footer { clear: both; text-align: center; font-size: 12px; color: #8A968D; padding: 24px; }
@media screen and (max-width: 640px) {
  header { padding: 12px; }
  .container { padding: 8px; }
  .main, .side { float: none; width: auto; }
}
</style>`;

const SIDE = `<aside class="side">
<div class="box">
<h3>このブログについて</h3>
<img src="photo-me.jpg" width="48" height="48" alt="" align="left" hspace="6">
<a href="about.html">ゆうき</a>／会社員。休日は自転車で近所を走っています。
</div>
<div class="box">
<h3>人気の記事</h3>
<ol>
<li><a href="entry-0710.html">はじめての 100km ライド</a></li>
<li><a href="entry-0702.html">スマホで走ったルートを記録する</a></li>
</ol>
</div>
<div class="box">
<h3>カテゴリ</h3>
<a href="tag.html"><span class="tag">自転車</span></a><span class="tag">カフェ</span><span class="tag">道具</span>
</div>
<div class="box">
<h3>アーカイブ</h3>
<a href="archive.html">2011年7月</a><br>2011年6月
</div>
</aside>`;

const page = (title: string, body: string): string => `<!DOCTYPE html>
<html lang="ja">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${title}週末サイクリング日記</title>
${STYLE}
</head>
<body>
<header>
<h1><a href="index.html">週末サイクリング日記</a></h1>
<p>近所から、ちょっと遠くまで。自転車で走った記録です</p>
</header>
<div class="container">
<div class="main">
${body}
</div>
${SIDE}
</div>
<footer>
<a href="about.html">このブログについて</a> ｜ <a href="archive.html">記事の一覧</a><br>
&copy; 2011 週末サイクリング日記
</footer>
</body>
</html>
`;

const SHARE = `<p class="share">この記事が役に立ったら <a href="http://sns.hogehoge.example/share?url=http://blog.hogespace.example/yuki/">SNS でシェア</a></p>`;

const ENTRY_0710 = `<article>
<h2><a href="entry-0710.html">はじめての 100km ライド</a></h2>
<p class="meta"><time datetime="2011-07-10">2011年7月10日</time>　<span class="tag">自転車</span></p>
<figure><img src="photo-wide.jpg" width="640" height="360" alt="海沿いの道"></figure>
<p>朝 6 時に家を出て、海沿いの道をひたすら南へ。折り返して戻ってきたら、ちょうど 100km でした。<br>
途中のパン屋さんで食べたカレーパンが、今日いちばんのごほうび。</p>
${SHARE}
</article>`;

const ENTRY_0702 = `<article>
<h2><a href="entry-0702.html">スマホで走ったルートを記録する</a></h2>
<p class="meta"><time datetime="2011-07-02">2011年7月2日</time>　<span class="tag">道具</span></p>
<p>スマホを買いかえたので、走ったルートを地図に記録するアプリを入れてみました。<br>
距離も速さも自動で出るので、もう手帳にメモしなくていいみたいです。</p>
${SHARE}
</article>`;

const COMMENTS = (items: string): string => `<div class="box">
<h3>コメント</h3>
${items}
<form>
<p>名前<br><input type="text" name="author" size="30"></p>
<p>コメント<br><textarea name="text" rows="4" cols="50"></textarea></p>
<p><input type="submit" value="コメントする"></p>
</form>
</div>`;

const index = page("", `${ENTRY_0710}\n${ENTRY_0702}`);

const entry0710 = page(
  "はじめての 100km ライド - ",
  `${ENTRY_0710}
${COMMENTS(`<div class="comment"><span class="meta">たけ　2011年7月10日 21:15</span>おつかれさまでした！ 海沿いの道、気持ちよさそうですね。</div>
<div class="comment"><span class="meta">ゆうき　2011年7月10日 22:02</span>&gt; たけさん　ありがとうございます。向かい風だけがつらかったです。</div>`)}
<p><a href="entry-0702.html">« 前の記事：スマホで走ったルートを記録する</a></p>`,
);

const entry0702 = page(
  "スマホで走ったルートを記録する - ",
  `${ENTRY_0702}
${COMMENTS(`<div class="comment"><span class="meta">ちょこ　2011年7月3日 08:40</span>わたしも同じアプリを使っています。電池の減りが早いので気をつけて！</div>`)}
<p><a href="entry-0710.html">次の記事：はじめての 100km ライド »</a></p>`,
);

const archive = page(
  "記事の一覧 - ",
  `<div class="box">
<h3>2011年7月</h3>
<ul>
<li><a href="entry-0710.html">はじめての 100km ライド</a>（7月10日）</li>
<li><a href="entry-0702.html">スマホで走ったルートを記録する</a>（7月2日）</li>
</ul>
<h3>2011年6月</h3>
<ul>
<li>雨の日は室内でローラー（6月25日）</li>
<li>ブログを引っ越しました（6月18日）</li>
</ul>
</div>`,
);

const tag = page(
  "カテゴリ「自転車」 - ",
  `<div class="box">
<h3>カテゴリ：自転車</h3>
<ul>
<li><a href="entry-0710.html">はじめての 100km ライド</a></li>
<li>雨の日は室内でローラー</li>
</ul>
</div>`,
);

const about = page(
  "このブログについて - ",
  `<article>
<h2>このブログについて</h2>
<p><img src="photo-me.jpg" width="96" height="96" alt="ゆうき" align="left" hspace="12">
ゆうき／会社員。自転車歴 2 年。<br>
6 月に、前のブログサービスからこちらへ引っ越してきました。トラックバックは受け付けていません。感想はコメントか SNS でどうぞ。</p>
<p>新しい記事は SNS でもお知らせしています。スマホからも読みやすいように作っています。</p>
</article>`,
);

export const pages: readonly SitePage[] = [
  { path: "index.html", html: index },
  { path: "entry-0710.html", html: entry0710 },
  { path: "entry-0702.html", html: entry0702 },
  { path: "archive.html", html: archive },
  { path: "tag.html", html: tag },
  { path: "about.html", html: about },
];
