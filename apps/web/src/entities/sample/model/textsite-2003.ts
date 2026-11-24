import type { SitePage } from "@anokoro/shared";

const STYLE = `<style type="text/css">
body { margin: 0; background-color: #F0F0E8; color: #222222; font-size: 12px; line-height: 160%; }
a { color: #0044AA; }
a:hover { color: #CC3300; background-color: #FFFFCC; }
#head { background-color: #334455; color: #FFFFFF; padding: 8px 12px; }
#head a { color: #FFFFFF; text-decoration: none; }
.menu { background-color: #FFFFFF; border: 1px solid #AAAAAA; padding: 6px; margin-bottom: 8px; }
.menu b { color: #334455; }
.main { background-color: #FFFFFF; border: 1px solid #AAAAAA; padding: 10px; }
.day { font-size: 14px; font-weight: bold; color: #334455; border-left: 6px solid #334455; padding-left: 6px; margin: 12px 0 6px 0; }
.via { font-size: 10px; color: #888888; }
.cm { color: #AA3300; }
</style>`;

const SIDE = `<div class="menu"><b>■メニュー</b><br>
<a href="index.html">今日のニュース</a><br>
<a href="log.html">過去ログ</a><br>
<a href="zatsubun.html">雑文</a><br>
<a href="tarekomi.html">ネタ募集</a><br>
<a href="link.html">リンク</a><br>
<a href="about.html">このサイトについて</a>
</div>
<div class="menu"><b>■カウンター</b><br>
<!--COUNTER--><br>
<span class="via">（2001年10月から）</span>
</div>
<div class="menu"><b>■ランキング</b><br>
面白かったら一票を。<br>
<a href="http://rank.hogespace.example/news/vote?id=hogekichi">ランキングに投票</a>
</div>
<div class="menu">
<img src="bn-hoge.gif" width="88" height="31" alt="ほげほげニュース"><br>
<span class="via">リンクフリー。バナーは保存してお使いください</span>
</div>`;

const page = (title: string, body: string): string => `<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=Shift_JIS">
<title>${title}ほげほげニュース</title>
${STYLE}
</head>
<body>
<div id="head"><font size="5"><b><a href="index.html">ほげほげニュース</a></b></font>　気になったページと、ときどき雑文</div>
<table width="760" border="0" cellpadding="8" cellspacing="0">
<tr>
<td width="160" valign="top">${SIDE}</td>
<td valign="top"><div class="main">
${body}
</div></td>
</tr>
</table>
</body>
</html>
`;

const item = (href: string, title: string, via: string, comment: string): string =>
  `・<a href="${href}">${title}</a> <span class="via">（${via}）</span><br>　<span class="cm">${comment}</span><br>`;

const NEWS_0612 = `<div class="day">2003年6月12日（木）</div>
${item("http://www.hogespace.example/kansatsu/0612.html", "駅の伝言板に書かれていた一番長い文章", "ほげスペース観察記", "最後まで読んだ駅員さんもえらい")}
${item("http://www.hogespace.example/nekomaru/diary.html", "ねこが自動ドアを開ける瞬間の写真", "ねこまるの部屋", "3 枚目の得意げな顔")}
${item("http://news.hogehoge.example/2003/06/12/umbrella.html", "ほげほげ駅の忘れ物の傘、ひと月で 300 本", "ほげほげ新聞", "うちの 4 本もここにいるのかもしれない")}
${item("http://www.hogespace.example/flash/", "Flash アニメ「ほげ山さんの一日」新作公開", "ほげ Flash 工房", "回線が細い人は、夜中にどうぞ")}
・<a href="zatsubun1.html">雑文「エレベーターの『閉』ボタン」</a>を書きました <img src="new.gif" width="38" height="14" alt="NEW"><br>`;

const NEWS_0611 = `<div class="day">2003年6月11日（水）</div>
${item("http://www.hogespace.example/surfer/0611.html", "通勤電車の網棚に置かれていたもの・6 月編", "ネットサーファー日誌", "今月はスイカ 1 玉")}
${item("http://www.hogespace.example/vending/", "全国の変わった自動販売機の写真集", "自販機あつめ", "おでんの缶の横に、なぜか長靴")}
${item("http://news.hogehoge.example/2003/06/11/city.html", "ほげほげ市役所、エレベーターの「閉」ボタンを使えるように", "ほげほげ新聞", "押す派には朗報")}`;

const index = page(
  "",
  `${NEWS_0612}
<p>タレコミ、ありがとうございます。いただいたネタは、<a href="tarekomi.html">ネタ募集</a>のページの決まりにそって紹介しています。</p>
<p align="right"><a href="news-0611.html">きのうのニュース</a> ｜ <a href="log.html">過去ログ</a></p>`,
);

const news0611 = page(
  "2003年6月11日 - ",
  `${NEWS_0611}
<p align="right"><a href="index.html">今日のニュースへ</a> ｜ <a href="log.html">過去ログ</a></p>`,
);

const log = page(
  "過去ログ - ",
  `<b>過去ログ</b><br>
毎日のニュースを日付ごとに残しています。
<ul>
<li><a href="index.html">2003年6月12日（木）</a></li>
<li><a href="news-0611.html">2003年6月11日（水）</a></li>
<li>2003年6月10日（火）</li>
<li>2003年6月9日（月）</li>
<li>2003年5月の分</li>
<li>2003年4月の分</li>
</ul>`,
);

const zatsubun = page(
  "雑文 - ",
  `<b>雑文</b><br>
ニュースのあいまに書いている、少し長めの文章です。
<ul>
<li><a href="zatsubun1.html">エレベーターの『閉』ボタン</a>（2003/06/12）</li>
<li>自分の声を録音して聞いてはいけない（2003/05/20）</li>
<li>レシートを財布にためる人の言い分（2003/04/08）</li>
</ul>`,
);

const zatsubun1 = page(
  "エレベーターの『閉』ボタン - ",
  `<b><font size="4">エレベーターの『閉』ボタン</font></b><br>
<span class="via">2003年6月12日</span>
<p>エレベーターに乗ると、人は二つに分かれる。<br>
すぐに「閉」を押す人と、押さない人だ。</p>
<p>押す人は、たぶん 1 秒でも早く着きたいわけではない。<br>
「閉」を押すことで、このエレベーターを自分が動かしている、という気持ちになりたいのだと思う。</p>
<p>押さない人は、逆に「待つ」ことを選んでいる。<br>
走ってくる人がいるかもしれない。閉まりかけた扉に手をはさむ人がいるかもしれない。その人のための 3 秒だ。</p>
<p>ぼくはどちらかというと押す人だ。<br>
ただし、だれかと乗っているときは押さない。押すところを見られるのが、なんとなく恥ずかしいからだ。<br>
この話を友人にしたら、「それは押す人より面倒くさい」と言われた。</p>
<p align="right"><a href="zatsubun.html">雑文の一覧へ</a> ｜ <a href="index.html">今日のニュースへ</a></p>`,
);

const tarekomi = page(
  "ネタ募集 - ",
  `<b>ネタ募集</b>
<p>面白いページ、変わったニュースを見つけたら教えてください。<br>
自分のサイトの更新のお知らせも歓迎です。</p>
<ul>
<li>ページのアドレスと、ひとことを書いて<a href="mailto:hogekichi@hogespace.example">メール</a>で送ってください</li>
<li>紹介するときは、ページのアドレスと、教えてくれた方のお名前（ハンドル）を書きます。お名前を出したくない方は、そう書いてください</li>
<li>紹介するかどうかは、管理人が決めます。全部は紹介できません。ごめんなさい</li>
</ul>`,
);

const link = page(
  "リンク - ",
  `<b>リンク</b>
<p><b>■毎日見ているところ</b><br>
<a href="http://www.hogespace.example/surfer/">ネットサーファー日誌</a>　通勤電車の観察記録<br>
<a href="http://www.hogespace.example/kansatsu/">ほげスペース観察記</a>　どうでもいいことを、とことん<br>
<a href="http://www.hogespace.example/nekomaru/">ねこまるの部屋</a>　ねこと日記</p>
<p><b>■アンテナ</b><br>
更新を確かめるのは、<a href="http://antenna.hogehoge.example/hogekichi/">ほげほげアンテナ</a>に頼りきりです。登録したサイトを自動で回って、更新された順に並べてくれます。</p>`,
);

const about = page(
  "このサイトについて - ",
  `<b>このサイトについて</b>
<p>管理人のほげ吉です。<br>
毎日ほかのサイトを見て回って、面白かったページをひとことつきで紹介しています。ときどき自分でも雑文を書きます。</p>
<p>2001年10月に始めました。平日は夜 11 時ごろに更新します。</p>
<p>リンクはご自由にどうぞ。<br>
アンテナへの登録も歓迎です。ニュースは毎日このトップページに書き足していくので、トップページのアドレスで登録してください。</p>`,
);

export const pages: readonly SitePage[] = [
  { path: "index.html", html: index },
  { path: "news-0611.html", html: news0611 },
  { path: "log.html", html: log },
  { path: "zatsubun.html", html: zatsubun },
  { path: "zatsubun1.html", html: zatsubun1 },
  { path: "tarekomi.html", html: tarekomi },
  { path: "link.html", html: link },
  { path: "about.html", html: about },
];
