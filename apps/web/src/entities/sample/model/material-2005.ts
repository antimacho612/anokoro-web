import type { SitePage } from "@anokoro/shared";

const STYLE = `<style type="text/css">
body { margin: 0; background-color: #F2F7FB; background-image: url(kabe-pinstripe.png); color: #445566; font-family: sans-serif; font-size: 12px; line-height: 160%; }
a { color: #2A7AB8; }
a:hover { color: #E0605A; }
#wrap { width: 760px; margin: 0 auto; background-color: #FFFFFF; border-left: 1px solid #C8D8E6; border-right: 1px solid #C8D8E6; }
#head { padding: 18px 20px 8px 20px; }
#head h1 { margin: 0; font-size: 22px; color: #2A7AB8; }
#head p { margin: 0; color: #8899AA; }
#menu { float: left; width: 160px; padding: 12px 0 12px 20px; }
#menu a { display: block; padding: 3px 0; }
#main { margin-left: 200px; padding: 12px 20px 20px 0; }
h2 { font-size: 14px; color: #FFFFFF; background-color: #6FA8D6; padding: 4px 8px; margin: 12px 0 8px 0; }
.box { border: 1px solid #C8D8E6; background-color: #FAFCFE; padding: 8px 10px; margin-bottom: 10px; }
.item { float: left; width: 160px; text-align: center; margin: 0 8px 12px 0; }
.no { font-size: 10px; color: #8899AA; }
.clear { clear: both; }
#foot { clear: both; text-align: center; font-size: 10px; color: #8899AA; padding: 10px; }
</style>`;

const page = (title: string, body: string): string => `<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=Shift_JIS">
<title>${title}ほげほげ素材工房</title>
${STYLE}
</head>
<body>
<div id="wrap">
<div id="head">
<h1>ほげほげ素材工房</h1>
<p>つやつやボタンと、すっきりライン</p>
</div>
<img src="line-shine.png" width="400" height="6" alt="">
<div id="menu">
<a href="index.html">トップ</a>
<a href="guide.html">ご利用ガイド</a>
<a href="button.html">ボタン</a>
<a href="line.html">ライン</a>
<a href="kabe.html">背景</a>
<a href="icon.html">アイコン</a>
<a href="bbs.html">利用報告</a>
<a href="link.html">リンク</a>
</div>
<div id="main">
${body}
</div>
<div id="foot">素材の直リンクは禁止です ｜ &copy; 2005 ほげほげ素材工房</div>
</div>
</body>
</html>
`;

const index = page(
  "",
  `<h2>お知らせ</h2>
<div class="box">
ご利用の前に、<a href="guide.html">ご利用ガイド</a>を読んでください。素材は無料です。直リンクはご遠慮ください。
</div>
<h2>新着素材</h2>
<div class="box">
2005/05/14　<a href="button.html">ボタン</a>に、つやつやボタンを追加しました<br>
2005/05/02　<a href="kabe.html">背景</a>に、細いストライプを追加しました<br>
2005/04/20　<a href="line.html">ライン</a>に、光るラインを追加しました<br>
2005/04/01　サイトを作り替えました。古い素材は、しばらく<a href="icon.html">アイコン</a>のページに残しています
</div>
<h2>ランキング</h2>
<div class="box">
素材サイトのランキングに参加しています。気に入ってもらえたら、一票お願いします。<br>
<a href="http://rank.hogespace.example/sozai/vote?id=hogekobo">素材ランキングに投票する</a>
</div>`,
);

const guide = page(
  "ご利用ガイド - ",
  `<h2>ご利用ガイド</h2>
<div class="box">
<b>無料です</b><br>
個人のホームページやブログで、自由にお使いください。<br><br>
<b>直リンクは禁止です</b><br>
画像はかならず保存して、ご自分のスペースに上げてからお使いください。こちらの画像をそのまま表示させると、サーバーが重くなってしまいます。<br><br>
<b>利用報告</b><br>
お使いいただけるときは、<a href="bbs.html">利用報告</a>で「借ります」と教えてもらえるとうれしいです。報告は自由です。
</div>`,
);

const button = page(
  "ボタン - ",
  `<h2>つやつやボタン</h2>
<div class="item"><img src="btn-glossy.png" width="140" height="36" alt="つやつやボタン"><br><span class="no">No.20 つやつやボタン（NEW）</span></div>
<div class="clear"></div>
<div class="box">上半分に光が当たったような、つやのあるボタンです。文字は入っていないので、お好きな文字を重ねてください。</div>
<h2>ふつうのボタン</h2>
<div class="item"><img src="btn-home.gif" width="88" height="24" alt="HOME"><br><span class="no">No.01 HOME</span></div>
<div class="item"><img src="btn-diary.gif" width="88" height="24" alt="DIARY"><br><span class="no">No.02 DIARY</span></div>
<div class="item"><img src="btn-link.gif" width="88" height="24" alt="LINK"><br><span class="no">No.03 LINK</span></div>
<div class="clear"></div>`,
);

const line = page(
  "ライン - ",
  `<h2>ライン</h2>
<div class="box">
<img src="line-shine.png" width="400" height="6" alt="光るライン"><br><span class="no">No.12 光るライン（NEW）</span><br><br>
<img src="line-dot.gif" width="400" height="6" alt="てんてん"><br><span class="no">No.11 てんてん</span><br><br>
<img src="line-wave.gif" width="400" height="10" alt="なみなみ"><br><span class="no">No.10 なみなみ</span>
</div>
<div class="box">幅はすべて 400 ピクセルです。</div>`,
);

const kabe = page(
  "背景 - ",
  `<h2>背景</h2>
<div class="item"><img src="kabe-pinstripe.png" width="6" height="6" alt="ストライプ"><br><span class="no">No.08 ほそいストライプ（NEW）</span></div>
<div class="item"><img src="kabe-washi.gif" width="64" height="64" alt="わし"><br><span class="no">No.07 わし</span></div>
<div class="item"><img src="kabe-marble.gif" width="64" height="64" alt="マーブル"><br><span class="no">No.06 マーブル</span></div>
<div class="clear"></div>
<div class="box">このサイトの背景も No.08 です。小さな画像を、ページいっぱいにしきつめて使います。</div>`,
);

const icon = page(
  "アイコン - ",
  `<h2>アイコン</h2>
<div class="item"><img src="icon-home.gif" width="32" height="32" alt="おうち"><br><span class="no">おうち</span></div>
<div class="item"><img src="icon-book.gif" width="32" height="32" alt="ほん"><br><span class="no">ほん</span></div>
<div class="item"><img src="icon-pen.gif" width="32" height="32" alt="えんぴつ"><br><span class="no">えんぴつ</span></div>
<div class="clear"></div>
<div class="box">作り替える前の素材です。しばらく置いておきます。</div>`,
);

const report = (name: string, date: string, text: string): string =>
  `<div class="box"><b>${name}</b> <span class="no">${date}</span><br>${text}<br><span class="no">＞ありがとうございます！</span></div>`;

const bbs = page(
  "利用報告 - ",
  `<h2>利用報告</h2>
<form>
名前：<input type="text" name="name" size="20"><br>
URL：<input type="text" name="url" size="30"><br>
<textarea name="text" rows="3" cols="50"></textarea><br>
<input type="submit" value="報告する">
</form>
${report("さくら", "2005/05/15 22:10", "つやつやボタンを、ブログのメニューに借ります。")}
${report("みなと", "2005/05/14 19:42", "光るライン、借りました！")}
${report("ちょこ", "2005/05/10 08:05", "ストライプの背景を借ります。")}`,
);

const link = page(
  "リンク - ",
  `<h2>バナー</h2>
<div class="box">
<img src="bn-hoge.gif" width="88" height="31" alt="ほげほげ素材工房"><br>
リンクはご自由にどうぞ。バナーは保存してお使いください。
</div>
<h2>素材サイト</h2>
<div class="box">
<a href="http://www.hogespace.example/ichigo/">いちご素材店</a><br>
<a href="http://www.hogespace.example/hoshizora/">ほしぞら工房</a><br>
<a href="http://rank.hogespace.example/sozai/">素材ランキング</a>
</div>`,
);

export const pages: readonly SitePage[] = [
  { path: "index.html", html: index },
  { path: "guide.html", html: guide },
  { path: "button.html", html: button },
  { path: "line.html", html: line },
  { path: "kabe.html", html: kabe },
  { path: "icon.html", html: icon },
  { path: "bbs.html", html: bbs },
  { path: "link.html", html: link },
];
