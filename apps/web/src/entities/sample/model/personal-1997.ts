import type { SitePage } from "@anokoro/shared";

const BODY = `<body bgcolor="#000033" background="kabe-cyber.gif" text="#FFFFFF" link="#FFFF00" vlink="#FF99FF" alink="#FF0000">`;
const BACK = `<hr>
<center><a href="index.html"><img src="btn-top.gif" width="80" height="24" alt="トップへ" border="0"></a></center>
</body>
</html>
`;

const index = `<html>
<head>
<title>★まさやんのゲーム部屋★</title>
</head>
${BODY}
<center>
<img src="anime-welcome.gif" width="200" height="40" alt="ようこそ"><br>
<font size="6" color="#00FFFF"><b>★まさやんのゲーム部屋★</b></font><br>
<marquee scrollamount="5"><font color="#FFFF00">ゲームの感想と裏ワザなら、まさやんにおまかせ！ 相互リンクも大募集中！</font></marquee>
<img src="line-star.gif" width="400" height="14"><br>
あなたは <!--COUNTER--> 人目の勇者です。<br>
<br>
<table border="2" cellpadding="6" cellspacing="2" width="420" bgcolor="#000066">
<tr>
<td align="center" bgcolor="#3333AA"><b>メニュー</b></td>
</tr>
<tr>
<td>
<img src="anime-arrow.gif" width="24" height="16"> <a href="profile.html">まさやんってどんな人？</a><br>
<img src="anime-arrow.gif" width="24" height="16"> <a href="review.html">ゲームの感想</a> <img src="new.gif" width="38" height="14"><br>
<img src="anime-arrow.gif" width="24" height="16"> <a href="urawaza.html">裏ワザ・小ネタ集</a><br>
<img src="anime-arrow.gif" width="24" height="16"> <a href="link.html">リンク</a><br>
<img src="anime-arrow.gif" width="24" height="16"> <a href="history.html">更新履歴</a>
</td>
</tr>
</table>
<br>
<table border="0" cellpadding="4" width="420">
<tr>
<td bgcolor="#330033">
<img src="mark-shinchaku.gif" width="32" height="14"> <font size="2">8/24　「ほげほげレーサー」の感想をのせました！</font><br>
<img src="mark-shinchaku.gif" width="32" height="14"> <font size="2">8/17　裏ワザを 3 つ追加しました</font>
</td>
</tr>
</table>
<br>
<img src="mail.gif" width="26" height="18"> <a href="mailto:masayan@hogespace.example">感想や裏ワザはメールで送ってね！</a><br>
<br>
<font size="2" color="#AAAAAA">Since 1997.07.20</font>
</center>
</body>
</html>
`;

const profile = `<html>
<head>
<title>まさやんってどんな人？</title>
</head>
${BODY}
<center>
<font size="5" color="#00FFFF"><b>まさやんってどんな人？</b></font><br>
<img src="line-star.gif" width="400" height="14">
</center>
<br>
<table border="1" cellpadding="4" cellspacing="0" width="100%" bgcolor="#000066">
<tr><td width="120" bgcolor="#3333AA">なまえ</td><td>まさやん</td></tr>
<tr><td bgcolor="#3333AA">としごろ</td><td>高校 2 年生</td></tr>
<tr><td bgcolor="#3333AA">好きなゲーム</td><td>RPG とレース。いちばんは「ほげほげクエスト III」</td></tr>
<tr><td bgcolor="#3333AA">パソコン歴</td><td>半年。おこづかいをためてモデムを買いました（28.8kbps）</td></tr>
<tr><td bgcolor="#3333AA">ひとこと</td><td>電話代が親にバレないよう、夜 11 時を過ぎてからつないでいます</td></tr>
</table>
${BACK}`;

const review = `<html>
<head>
<title>ゲームの感想</title>
</head>
${BODY}
<center>
<font size="5" color="#00FFFF"><b>ゲームの感想</b></font><br>
<img src="line-star.gif" width="400" height="14">
</center>
<h3><font color="#FFCC00">■ほげほげレーサー</font> <img src="new.gif" width="38" height="14"></h3>
<p>
コースが 12 本もあって、夏休みじゅう遊べます。<br>
雨のコースでスリップするのがリアルで、何回もやり直しました。<br>
おすすめ度：<font color="#FFFF00">★★★★☆</font>
</p>
<h3><font color="#FFCC00">■ほげほげクエスト III</font></h3>
<p>
ぼくの中では史上最高の RPG です。仲間が増えていくところで泣きそうになりました。<br>
ラスボスはレベル 40 あれば勝てます。<br>
おすすめ度：<font color="#FFFF00">★★★★★</font>
</p>
<h3><font color="#FFCC00">■まじかる☆ほげ</font></h3>
<p>
落ちものパズルです。友だちと対戦すると止まりません。<br>
おすすめ度：<font color="#FFFF00">★★★☆☆</font>
</p>
${BACK}`;

const urawaza = `<html>
<head>
<title>裏ワザ・小ネタ集</title>
</head>
${BODY}
<center>
<font size="5" color="#00FFFF"><b>裏ワザ・小ネタ集</b></font><br>
<img src="line-star.gif" width="400" height="14">
</center>
<p><font color="#FF6666">※自分でためしたものだけ書いています。セーブしてからためしてね！</font></p>
<table border="1" cellpadding="4" cellspacing="0" width="100%" bgcolor="#000066">
<tr bgcolor="#3333AA"><th>ゲーム</th><th>やりかた</th><th>どうなる？</th></tr>
<tr><td>ほげほげクエスト III</td><td>最初の町の井戸を 3 回しらべる</td><td>薬草が 1 つもらえる</td></tr>
<tr><td>ほげほげクエスト III</td><td>名前を「ほげほげ」にする</td><td>宿屋の主人のセリフが変わる</td></tr>
<tr><td>ほげほげレーサー</td><td>タイトル画面で L と R を押しながらスタート</td><td>隠しコースが選べる</td></tr>
</table>
<p>
新しい裏ワザを見つけたら、<a href="mailto:masayan@hogespace.example">メール</a>で教えてください。のせるときは名前も書きます！
</p>
${BACK}`;

const link = `<html>
<head>
<title>リンク</title>
</head>
${BODY}
<center>
<font size="5" color="#00FFFF"><b>リンク</b></font><br>
<img src="line-star.gif" width="400" height="14">
</center>
<p>相互リンクしてくれているサイトです。バナーをクリックしてね。</p>
<center>
<a href="http://www.hogespace.example/game/hoge/"><img src="bn-hoge.gif" width="88" height="31" alt="ほげほげゲーム館" border="0"></a>
<a href="http://www.netsurfer.example/"><img src="bn-surfer.gif" width="88" height="31" alt="ネットサーファー" border="0"></a>
<a href="http://www.hogespace.example/"><img src="bn-hogespace.gif" width="88" height="31" alt="ほげスペース" border="0"></a>
</center>
<p>
<img src="icon-ball.gif" width="14" height="14"> <a href="http://www.hogespace.example/game/kouryaku/">ほげほげ攻略ページ</a> - 攻略がとても詳しい！<br>
<img src="icon-ball.gif" width="14" height="14"> <a href="http://www.hogespace.example/game/race/">レースゲームの部屋</a> - タイムアタックの記録がすごい
</p>
<p>
<font color="#FFCC00">相互リンクしてくれる方は、メールで URL を送ってください。</font>
</p>
${BACK}`;

const history = `<html>
<head>
<title>更新履歴</title>
</head>
${BODY}
<center>
<font size="5" color="#00FFFF"><b>更新履歴</b></font><br>
<img src="line-star.gif" width="400" height="14">
</center>
<p>
1997/08/24　ゲームの感想に「ほげほげレーサー」を追加<br>
1997/08/17　裏ワザを 3 つ追加<br>
1997/08/10　リンクに 2 サイト追加<br>
1997/08/02　カウンターをつけました<br>
1997/07/20　まさやんのゲーム部屋、オープン！
</p>
${BACK}`;

export const pages: readonly SitePage[] = [
  { path: "index.html", html: index },
  { path: "profile.html", html: profile },
  { path: "review.html", html: review },
  { path: "urawaza.html", html: urawaza },
  { path: "link.html", html: link },
  { path: "history.html", html: history },
];
