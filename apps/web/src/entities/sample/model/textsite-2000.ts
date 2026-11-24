import type { SitePage } from "@anokoro/shared";

const STYLE = `<style type="text/css">
body { font-size: 13px; line-height: 170%; }
a:hover { color: #FF6600; }
.date { font-weight: bold; color: #555555; border-bottom: 1px solid #999999; margin-top: 16px; }
.title { font-size: 15px; font-weight: bold; }
.small { font-size: 11px; color: #777777; }
</style>`;

const MENU = `<font size="2">
<a href="index.html">トップ</a> ｜ <a href="zakki.html">雑記</a> ｜ <a href="yomimono.html">読み物</a> ｜ <a href="log.html">過去ログ</a> ｜ <a href="mail.html">メールのお返事</a> ｜ <a href="http://bbs.hogespace.example/hogeyama/">掲示板</a> ｜ <a href="link.html">リンク</a> ｜ <a href="about.html">このサイトについて</a>
</font>`;

const page = (title: string, body: string): string => `<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=Shift_JIS">
<title>${title}ほげほげ雑記帳</title>
${STYLE}
</head>
<body bgcolor="#FFFFFF" text="#333333" link="#0033CC" vlink="#663399">
<table width="600" border="0" cellpadding="0" cellspacing="0" align="center"><tr><td>
<b><font size="5">ほげほげ雑記帳</font></b><br>
<span class="small">どうでもいいことを、どうでもよくない熱さで書くサイト</span>
<hr size="1" noshade>
${MENU}
<hr size="1" noshade>
${body}
<hr size="1" noshade>
<span class="small">文章の無断転載はご遠慮ください。感想は <a href="mailto:hogeyama@hogespace.example">hogeyama@hogespace.example</a> まで。</span>
</td></tr></table>
</body>
</html>
`;

const ENTRY_0710 = `<div class="date">2000年7月10日（月）</div>
<span class="title">自動改札とのたたかい</span><br>
定期券を入れたら、目の前で扉が閉まった。<br>
もう一回入れる。閉まる。後ろに並んだ人の視線が背中に刺さる。<br>
三回目、何も考えずに歩いたら、すっと通れた。<br>
勝因は「迷いのなさ」だと思う。人生もたぶんそう。<br>
<br>
駅員さんいわく、定期の期限が昨日で切れていたそうです。迷いとか関係なかった。`;

const ENTRY_0708 = `<div class="date">2000年7月8日（土）</div>
<span class="title">扇風機を出した</span><br>
押し入れから扇風機を出したら、羽根に「強は壊れています」と書いた紙が貼ってあった。<br>
去年の自分の字だ。ありがとう去年の自分。でも直しておいてほしかった。<br>
<br>
読み物に「駅そば全制覇の旅（前編）」を追加しました。後編はおなかの具合しだいです。`;

const ENTRY_0705 = `<div class="date">2000年7月5日（水）</div>
<span class="title">メールのお返事</span><br>
「目覚まし時計」の話に、思ったよりたくさんメールをいただきました。<br>
ひとつずつ返していると朝になるので、<a href="mail.html">お返事のページ</a>を作りました。<br>
ちなみに目覚ましは、いまは 3 個に減らしています。`;

const ENTRY_0702 = `<div class="date">2000年7月2日（日）</div>
<span class="title">百円ショップで二時間</span><br>
電池を買いに入って、出てきたら二時間たっていた。<br>
買ったもの：電池、ザル、なぜか木製のアヒル。<br>
アヒルはいまモニタの上からこちらを見ています。`;

const index = page(
  "",
  `<center>
<a href="http://www.hogespace.example/"><img src="bn-ad.gif" width="468" height="60" border="0" alt="広告"></a><br>
<span class="small">あなたは <!--COUNTER--> 人目の読者です（2000年4月1日から）</span>
</center>
<div class="date">更新履歴</div>
<font size="2">
2000/07/10　<a href="zakki.html">雑記</a>を更新<br>
2000/07/08　<a href="yomimono1.html">読み物「駅そば全制覇の旅（前編）」</a>を追加 <img src="new.gif" width="38" height="14" alt="NEW"><br>
2000/07/05　<a href="mail.html">メールのお返事</a>のページを作りました<br>
2000/07/02　雑記を更新
</font>
${ENTRY_0710}
<p align="right"><a href="zakki.html">今月の雑記をまとめて読む</a></p>`,
);

const zakki = page(
  "雑記（2000年7月） - ",
  `<b>雑記　2000年7月</b>
${ENTRY_0710}
${ENTRY_0708}
${ENTRY_0705}
${ENTRY_0702}
<p align="right"><a href="zakki-200006.html">先月の雑記へ</a></p>`,
);

const zakki200006 = page(
  "雑記（2000年6月） - ",
  `<b>雑記　2000年6月</b>
<div class="date">2000年6月25日（日）</div>
<span class="title">傘の行方</span><br>
今年に入ってなくした傘が 4 本になった。<br>
どこかに、ぼくの傘だけが集まる場所があるはずだ。いつか見つけて、まとめて取り返したい。
<div class="date">2000年6月18日（日）</div>
<span class="title">実家の冷蔵庫</span><br>
実家に帰ったら、冷蔵庫の奥から見たことのない瓶が出てきた。<br>
あまりに面白かったので、<a href="yomimono.html">読み物</a>にしました。
<div class="date">2000年6月10日（土）</div>
<span class="title">カウンターが 1 万を超えました</span><br>
開設して 2 か月と少し。毎日読みに来てくださる皆さん、ありがとうございます。<br>
キリ番の報告は要りません。そのかわり、面白かったら知り合いに教えてあげてください。
<p align="right"><a href="zakki.html">今月の雑記へ</a> ｜ <a href="log.html">過去ログの一覧</a></p>`,
);

const yomimono = page(
  "読み物 - ",
  `<b>読み物</b><br>
<font size="2">雑記よりちょっと長めの文章です。新しい順に並べています。</font>
<dl>
<dt><a href="yomimono1.html">駅そば全制覇の旅（前編）</a>　<span class="small">2000/07/08</span></dt>
<dd>ほげほげ線の駅にある立ち食いそばを、端から全部食べてみました。</dd>
<dt>実家の冷蔵庫の奥を調査する　<span class="small">2000/06/18</span></dt>
<dd>賞味期限が昭和の瓶との出会い。</dd>
<dt>目覚まし時計を 5 個かけた男の朝　<span class="small">2000/05/27</span></dt>
<dd>5 個かけても起きられない。では何個なら起きられるのか。</dd>
<dt>近所の自動販売機を全部調べる　<span class="small">2000/04/30</span></dt>
<dd>半径 500m の自販機、全 31 台の品ぞろえと値段の記録。</dd>
</dl>`,
);

const yomimono1 = page(
  "駅そば全制覇の旅（前編） - ",
  `<b><font size="4">駅そば全制覇の旅（前編）</font></b><br>
<span class="small">2000年7月8日</span>
<p>ほげほげ線には、立ち食いそば屋のある駅が 8 つある。<br>
ある日ふと、全部食べたらどうなるのだろうと思った。どうにもならない気もするが、思ってしまったものはしかたがない。</p>
<p><b>1 軒目：始発駅</b><br>
朝 7 時。かけそば 280 円。湯気の向こうで、おじさんたちが無言ですすっている。<br>
ここではしゃべってはいけない気がして、ぼくも無言ですすった。おいしかった。</p>
<p><b>2 軒目：となりの駅</b><br>
同じ値段、同じつゆの色。ただし、ねぎが多い。<br>
ねぎの量だけで店の個性を出してくるところに、職人の意地を見た。たぶん気のせいだ。</p>
<p><b>3 軒目：乗りかえの駅</b><br>
ここで、おなかが「もういい」と言いはじめる。<br>
しかし企画はまだ半分も終わっていない。ぼくはおなかの声を聞かなかったことにして、天ぷらそばを頼んだ。</p>
<p><b>4 軒目：……</b><br>
4 軒目の記憶は、あまりない。気がついたら家で寝ていた。<br>
残り 4 軒は後編で。おなかの具合しだいなので、いつになるかはわかりません。</p>
<p align="right"><a href="yomimono.html">読み物の目次へ</a></p>
<font size="2">感想は、メールか<a href="http://bbs.hogespace.example/hogeyama/">掲示板</a>でどうぞ。いただいたメールは、<a href="mail.html">お返事のページ</a>で紹介することがあります。</font>`,
);

const log = page(
  "過去ログ - ",
  `<b>過去ログ</b><br>
<font size="2">雑記を月ごとにまとめています。</font>
<ul>
<li><a href="zakki.html">2000年7月</a></li>
<li><a href="zakki-200006.html">2000年6月</a></li>
<li>2000年5月</li>
<li>2000年4月（4月1日 開設）</li>
</ul>`,
);

const mail = page(
  "メールのお返事 - ",
  `<b>メールのお返事</b><br>
<font size="2">いただいたメールの一部を、お名前を伏せて紹介しています。紹介されたくない方は、メールにそう書いてください。</font>
<div class="date">2000年7月5日</div>
<b>&gt; 目覚まし時計の話、電車の中で読んで吹き出しました。（A さん）</b><br>
ありがとうございます。電車の中で読むのは、やめたほうがいいと思います。
<div class="date">2000年7月5日</div>
<b>&gt; 5 個でも起きられないなら、6 個目は枕の下に入れるといいですよ。（B さん）</b><br>
入れてみました。音がこもって、いちばん聞こえない目覚ましになりました。
<div class="date">2000年7月4日</div>
<b>&gt; 自販機の調査、うちの近所でもやってみました。（C さん）</b><br>
仲間がいてうれしいです。31 台に勝てましたか。`,
);

const link = page(
  "リンク - ",
  `<b>リンク</b><br>
<font size="2">よく読みに行くサイトです。どこも毎日の更新が楽しみです。</font>
<ul>
<li><a href="http://www.hogespace.example/surfer/">ネットサーファー日誌</a>　──　毎日の通勤電車を観察した文章が絶品。</li>
<li><a href="http://www.hogespace.example/nekomaru/">ねこまるの部屋</a>　──　ねこと音楽と日記。ねこの写真に癒やされます。</li>
<li><a href="http://www.hogespace.example/kansatsu/">ほげスペース観察記</a>　──　身の回りのどうでもいいことを、とことん調べるサイト。</li>
</ul>
<div class="date">このサイトへのリンク</div>
<font size="2">リンクはご自由にどうぞ。バナーもお使いください（直接リンクはしないでください）。</font><br>
<img src="bn-hoge.gif" width="88" height="31" alt="ほげほげ雑記帳"> <img src="bn-linkfree.gif" width="88" height="31" alt="リンクフリー">`,
);

const about = page(
  "このサイトについて - ",
  `<b>このサイトについて</b>
<p>管理人のほげ山です。会社員です。<br>
2000年4月1日に開設しました。毎日なにかしら書くのを目標にしています。</p>
<p>ページはテキストエディタで HTML を書いて、夜に FTP で上げています。<br>
なので、更新はだいたい夜中の 1 時ごろです。</p>
<p>文章の無断転載はご遠慮ください。リンクはご自由にどうぞ。<br>
感想、ツッコミ、ネタの提供は、<img src="mail.gif" alt=""> <a href="mailto:hogeyama@hogespace.example">メール</a>か<a href="http://bbs.hogespace.example/hogeyama/">掲示板</a>へ。</p>`,
);

export const pages: readonly SitePage[] = [
  { path: "index.html", html: index },
  { path: "zakki.html", html: zakki },
  { path: "zakki-200006.html", html: zakki200006 },
  { path: "yomimono.html", html: yomimono },
  { path: "yomimono1.html", html: yomimono1 },
  { path: "log.html", html: log },
  { path: "mail.html", html: mail },
  { path: "link.html", html: link },
  { path: "about.html", html: about },
];
