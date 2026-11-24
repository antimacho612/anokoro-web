import type { SitePage } from "@anokoro/shared";

const STYLE = `<style type="text/css">
body { margin: 0; background: #EEF3F7 url(kabe-pinstripe.png); color: #444444; font-family: sans-serif; font-size: 13px; line-height: 1.6; }
a { color: #3377AA; }
a:hover { color: #FF7733; }
#wrap { width: 780px; margin: 0 auto; background-color: #FFFFFF; border-left: 1px solid #CCDDEE; border-right: 1px solid #CCDDEE; }
#header { background-color: #7FB2D9; padding: 18px 20px; color: #FFFFFF; }
#header h1 { margin: 0; font-size: 24px; letter-spacing: 2px; }
#header p { margin: 4px 0 0 0; font-size: 12px; }
#menu { float: left; width: 170px; padding: 16px 0 16px 16px; }
#menu ul { margin: 0; padding: 0; list-style: none; }
#menu li { margin-bottom: 6px; padding: 4px 8px; background-color: #F3F8FC; border-left: 4px solid #7FB2D9; }
#menu li:hover { background-color: #E3EEF7; }
#main { margin-left: 200px; padding: 16px 20px; }
#main h2 { margin: 0 0 8px 0; padding: 4px 8px; font-size: 15px; color: #3377AA; border-bottom: 2px dotted #7FB2D9; }
.box { margin-bottom: 18px; }
.gallery img { margin: 0 8px 8px 0; border: 4px solid #F3F8FC; }
#footer { clear: both; padding: 10px; text-align: center; font-size: 11px; color: #888888; background-color: #F3F8FC; }
</style>`;

const MENU = `<div id="menu">
<ul>
<li><img src="icon-soft-home.png" width="16" height="16" alt=""> <a href="index.html">トップ</a></li>
<li><a href="about.html">このサイトについて</a></li>
<li><a href="gallery.html">作品ギャラリー</a></li>
<li><a href="howto.html">作り方メモ</a></li>
<li><a href="baton.html">バトン</a></li>
<li><a href="link.html">リンク</a></li>
</ul>
<p><a href="http://blog.hogespace.example/sorairo/"><img src="bn-blog.gif" width="88" height="31" border="0" alt="日記はブログで"></a></p>
<p><img src="icon-soft-mail.png" width="16" height="16" alt=""> <a href="mailto:sorairo@hogespace.example">メール</a></p>
</div>`;

const page = (title: string, body: string): string => `<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title>${title}そらいろ工房</title>
${STYLE}
</head>
<body>
<div id="wrap">
<div id="header">
<h1>そらいろ工房</h1>
<p>布小物とビーズアクセサリーの手作り日記</p>
</div>
${MENU}
<div id="main">
${body}
</div>
<div id="footer">
Copyright (C) 2008 そらいろ工房 All Rights Reserved.<br>
推奨環境：1024×768 以上／ネットサーファー 7 以上
</div>
</div>
</body>
</html>
`;

const index = page(
  "",
  `<div class="box">
<h2>ようこそ</h2>
<p>
そらいろ工房へようこそ！<br>
布小物やビーズのアクセサリーを、休みの日にこつこつ作っています。<br>
作ったものは<a href="gallery.html">作品ギャラリー</a>で、作り方は<a href="howto.html">作り方メモ</a>で紹介しています。
</p>
</div>
<div class="box">
<h2>更新情報</h2>
<p>
<img src="ribbon-new.png" width="32" height="32" alt="NEW"> 2008.10.26　ギャラリーに「秋色のがま口」を追加しました<br>
2008.10.19　作り方メモに「ビーズのストラップ」を追加しました<br>
2008.10.12　<a href="baton.html">手作りバトン</a>に答えました<br>
2008.10.05　リンクを整理しました<br>
2008.09.14　サイトをリニューアルしました
</p>
</div>
<div class="box">
<h2>お知らせ</h2>
<p>
日々のことは<a href="http://blog.hogespace.example/sorairo/">ブログ</a>に書いています。更新のお知らせは RSS でも受け取れます。<br>
<img src="badge-rss.gif" width="80" height="15" alt="RSS"><br>
携帯からはこちら：http://m.hogespace.example/sorairo/
</p>
</div>`,
);

const about = page(
  "このサイトについて - ",
  `<div class="box">
<h2>このサイトについて</h2>
<p>
手作りが好きな会社員「そら」の個人サイトです。2005 年に開設し、2008 年 9 月に CSS でレイアウトを作り直しました。<br>
以前はテーブルでレイアウトしていましたが、文字の大きさを変えても崩れにくくなりました。
</p>
</div>
<div class="box">
<h2>作品の写真について</h2>
<p>
作品の写真の無断転載、作品をまねた販売はご遠慮ください。<br>
作り方メモを見て作ったものを、ブログで紹介してくださるのは大歓迎です！
</p>
</div>
<div class="box">
<h2>管理人</h2>
<p>
<img src="photo-me.jpg" width="96" height="96" alt="そら" align="left" hspace="8">
そら／会社員。休みの日は手芸店めぐり。<br>
好きな色は空の色。最近はがま口づくりに夢中です。
</p>
</div>`,
);

const gallery = page(
  "作品ギャラリー - ",
  `<div class="box">
<h2>作品ギャラリー</h2>
<p>最近作ったものです。</p>
<div class="gallery">
<img src="photo-flower.jpg" width="160" height="120" alt="花のブローチ">
<img src="photo-cat.jpg" width="160" height="120" alt="ねこのマスコット">
<img src="photo-sea.jpg" width="160" height="120" alt="海色のビーズ">
</div>
<p>
左から「花のブローチ」「ねこのマスコット」「海色のビーズのネックレス」です。<br>
<img src="ribbon-new.png" width="32" height="32" alt="NEW"> 新作の「秋色のがま口」は、写真を撮りなおしてから載せます。
</p>
</div>`,
);

const howto = page(
  "作り方メモ - ",
  `<div class="box">
<h2>ビーズのストラップ</h2>
<p>
用意するもの：丸小ビーズ（2 色）、テグス 30cm、ストラップ金具<br>
1. テグスにビーズを 6 つ通して輪にします<br>
2. 輪をつなげながら、好きな長さまで編みます<br>
3. 最後に金具を通して、テグスを 2 回結んだらできあがり！
</p>
</div>
<div class="box">
<h2>はぎれのコースター</h2>
<p>
用意するもの：はぎれ 2 枚（12cm 角）、キルト芯<br>
1. はぎれを中表に合わせ、キルト芯を重ねて縫います<br>
2. 返し口から表に返して、まわりにステッチをかけます
</p>
</div>
<p><img src="btn-glossy.png" width="140" height="36" alt="もっと見る"> つづきは少しずつ追加します。</p>`,
);

const baton = page(
  "バトン - ",
  `<div class="box">
<h2>手作りバトン</h2>
<p>ブログ仲間のまゆさんから回ってきました。</p>
<p>
<b>Q. 手作りを始めたきっかけは？</b><br>
A. 母がミシンを使っているのを見て、まねしたくなりました。<br>
<b>Q. いちばん好きな素材は？</b><br>
A. リネンです。使うほどやわらかくなるところが好き。<br>
<b>Q. 作ってみたいものは？</b><br>
A. 大きなトートバッグ！<br>
<b>Q. 次にバトンを回す人</b><br>
A. 受け取ってくれる方がいたら、ご自由にどうぞ♪
</p>
</div>`,
);

const link = page(
  "リンク - ",
  `<div class="box">
<h2>リンク</h2>
<p>
<a href="http://www.hogespace.example/mayu/">まゆのちくちく日記</a> - バトンをくれたまゆさんのサイト<br>
<a href="http://www.hogespace.example/beads/">ビーズの小箱</a> - 作り方がとてもわかりやすい<br>
<a href="http://www.hogehoge.example/shugei/">ほげほげ手芸店</a> - いつも布を買っているお店
</p>
</div>
<div class="box">
<h2>このサイトへのリンク</h2>
<p>
リンクはご自由にどうぞ。URL は http://www.hogespace.example/sorairo/ です。<br>
<img src="line-shine.png" width="400" height="6" alt="">
</p>
</div>`,
);

export const pages: readonly SitePage[] = [
  { path: "index.html", html: index },
  { path: "about.html", html: about },
  { path: "gallery.html", html: gallery },
  { path: "howto.html", html: howto },
  { path: "baton.html", html: baton },
  { path: "link.html", html: link },
];
