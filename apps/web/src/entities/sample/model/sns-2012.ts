import type { SitePage } from "@anokoro/shared";

const STYLE = `<style>
body { margin: 0; background-color: #F0F2F5; color: #222222; font-family: sans-serif; font-size: 14px; line-height: 1.6; }
a { color: #2D6FB7; text-decoration: none; }
header { background-color: #2D6FB7; color: #FFFFFF; padding: 8px 16px; }
header h1 { display: inline-block; margin: 0; font-size: 20px; }
header h1 a { color: #FFFFFF; }
header nav { float: right; }
header nav a { color: #FFFFFF; margin-left: 12px; }
header nav img { vertical-align: middle; }
.container { max-width: 640px; margin: 0 auto; padding: 12px; }
.card { background-color: #FFFFFF; border-radius: 8px; box-shadow: 0 1px 3px rgba(0, 0, 0, 0.15); padding: 12px 16px; margin-bottom: 12px; }
.who { font-weight: bold; }
.who img { border-radius: 50%; vertical-align: middle; margin-right: 6px; }
.when { font-size: 12px; color: #888888; }
.card figure { margin: 8px 0; }
.card figure img { max-width: 100%; height: auto; border-radius: 6px; }
.actions { border-top: 1px solid #E4E6EB; padding-top: 6px; font-size: 13px; color: #555555; }
.actions span { margin-right: 16px; }
.comment { background-color: #F0F2F5; border-radius: 12px; padding: 6px 10px; margin: 6px 0; }
.cover img { width: 100%; height: auto; border-radius: 8px 8px 0 0; }
.count { display: inline-block; margin-right: 16px; }
footer { text-align: center; font-size: 12px; color: #888888; padding: 16px; }
@media screen and (max-width: 480px) {
  header nav { float: none; display: block; }
  header nav a { margin: 0 12px 0 0; }
  .container { padding: 6px; }
}
</style>`;

const page = (title: string, body: string): string => `<!DOCTYPE html>
<html lang="ja">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${title}ほげらいふ</title>
${STYLE}
</head>
<body>
<header>
<h1><a href="index.html">ほげらいふ</a></h1>
<nav><a href="index.html">ホーム</a><a href="notice.html">お知らせ (3)</a><a href="profile.html">あおい</a><a href="settings.html"><img src="icon2x-menu.png" width="22" height="22" alt="設定"></a></nav>
</header>
<div class="container">
${body}
</div>
<footer>ほげらいふ &copy; 2012</footer>
</body>
</html>
`;

const avatar = (src: string, name: string): string =>
  `<img src="${src}" width="32" height="32" alt="">${name}`;

const POST_PHOTO = `<article class="card">
<div class="who">${avatar("photo-me.jpg", "あおい")}</div>
<div class="when"><time datetime="2012-08-12T18:20">8月12日 18:20</time>・スマートフォンから・友だちまで公開</div>
<p>夕方の海。風が気持ちよかった！</p>
<figure><img src="photo-wide.jpg" width="640" height="360" alt="夕方の海"></figure>
<div class="actions"><span>♡ 24</span><span><a href="post.html">コメント 3</a></span><span>シェア</span></div>
</article>`;

const POST_CAT = `<article class="card">
<div class="who">${avatar("photo-cat.jpg", "さくら")}</div>
<div class="when"><time datetime="2012-08-12T12:05">8月12日 12:05</time>・全体に公開</div>
<p>うちのねこ、ついに 10 さい。おめでとう！</p>
<figure><img src="photo-cat.jpg" width="160" height="120" alt="ねこ"></figure>
<div class="actions"><span>♡ 58</span><span>コメント 12</span><span>シェア</span></div>
</article>`;

const POST_TEXT = `<article class="card">
<div class="who">${avatar("photo-flower.jpg", "ほげ太")}</div>
<div class="when"><time datetime="2012-08-11T22:40">8月11日 22:40</time>・友だちまで公開</div>
<p>新しい駅ビルのカレー屋さん、辛さ 5 倍でも平気だった。次は 10 倍に挑戦します。</p>
<div class="actions"><span>♡ 9</span><span>コメント 4</span><span>シェア</span></div>
</article>`;

const index = page(
  "",
  `<div class="card">
<textarea rows="2" cols="50" placeholder="いまどうしてる？"></textarea><br>
<button type="button">投稿する</button>
</div>
${POST_PHOTO}
${POST_CAT}
${POST_TEXT}`,
);

const post = page(
  "あおいの投稿 - ",
  `${POST_PHOTO}
<div class="card">
<div class="comment"><b>さくら</b>　きれい！ どこの海？<br><span class="when">8月12日 18:40</span></div>
<div class="comment"><b>あおい</b>　ほげほげ海岸だよ。駅から歩いて 10 分。<br><span class="when">8月12日 18:52</span></div>
<div class="comment"><b>ほげ太</b>　今度みんなで行こう<br><span class="when">8月12日 19:30</span></div>
<p><input type="text" size="40" placeholder="コメントする"></p>
</div>
<p><a href="index.html">← ホームへ戻る</a></p>`,
);

const profile = page(
  "あおい - ",
  `<div class="card">
<div class="cover"><img src="photo-wide.jpg" width="640" height="360" alt=""></div>
<p class="who"><img src="photo-me.jpg" width="64" height="64" alt="">あおい</p>
<p>ほげほげ市在住。休みの日は写真を撮りに出かけます。</p>
<p><span class="count"><a href="friends.html"><b>128</b> フォロー</a></span><span class="count"><b>96</b> フォロワー</span></p>
<p><a href="photos.html">写真を見る</a></p>
</div>
${POST_PHOTO}`,
);

const photos = page(
  "あおいの写真 - ",
  `<div class="card">
<h2>写真</h2>
<p>
<a href="post.html"><img src="photo-wide.jpg" width="200" height="113" alt="夕方の海"></a>
<img src="photo-sea.jpg" width="160" height="120" alt="冬の海">
<img src="photo-flower.jpg" width="160" height="120" alt="花">
</p>
</div>`,
);

const friends = page(
  "フォロー中 - ",
  `<div class="card">
<h2>フォロー中（128）</h2>
<p class="who">${avatar("photo-cat.jpg", "さくら")}</p>
<p class="who">${avatar("photo-flower.jpg", "ほげ太")}</p>
<p class="who">${avatar("photo-sea.jpg", "うみの写真部")}</p>
</div>`,
);

const notice = page(
  "お知らせ - ",
  `<div class="card">
<h2>お知らせ</h2>
<p>さくらさんが、あなたの投稿に ♡ をつけました<br><span class="when">8月12日 18:41</span></p>
<p><a href="post.html">ほげ太さんが、あなたの投稿にコメントしました</a><br><span class="when">8月12日 19:30</span></p>
<p>うみの写真部さんが、あなたをフォローしました<br><span class="when">8月11日 09:12</span></p>
</div>`,
);

const settings = page(
  "設定 - ",
  `<div class="card">
<h2>公開範囲の設定</h2>
<p>新しい投稿を見られる人</p>
<p><label><input type="radio" name="scope"> 全体に公開</label><br>
<label><input type="radio" name="scope" checked> 友だちまで</label><br>
<label><input type="radio" name="scope"> 自分だけ</label></p>
<p><button type="button">保存する</button></p>
</div>`,
);

export const pages: readonly SitePage[] = [
  { path: "index.html", html: index },
  { path: "post.html", html: post },
  { path: "profile.html", html: profile },
  { path: "photos.html", html: photos },
  { path: "friends.html", html: friends },
  { path: "notice.html", html: notice },
  { path: "settings.html", html: settings },
];
