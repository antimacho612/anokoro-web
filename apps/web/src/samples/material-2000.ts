import type { SitePage } from "@anokoro/shared";

const STYLE = `<style type="text/css">
body { font-size: 12px; line-height: 150%; }
a { color: #E05090; text-decoration: none; }
a:hover { color: #FF9900; text-decoration: underline; }
.no { font-size: 10px; color: #999999; }
</style>`;

const MENU = `<font size="2">
<a href="index.html">トップ</a> ♪ <a href="kiyaku.html">お約束</a> ♪ <a href="kabe.html">壁紙</a> ♪ <a href="line.html">ライン</a> ♪ <a href="icon.html">アイコン・ボタン</a> ♪ <a href="anime.html">動く素材</a> ♪ <a href="bbs.html">利用報告板</a> ♪ <a href="link.html">リンク</a>
</font>`;

const page = (title: string, body: string): string => `<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=Shift_JIS">
<title>${title}☆ほげ素材館☆</title>
${STYLE}
</head>
<body bgcolor="#FFF5FA" background="kabe-dot.gif" text="#666666">
<center>
<font size="5" color="#E05090"><b>☆ほげ素材館☆</b></font><br>
${MENU}<br>
<img src="line-heart.gif" width="400" height="12"><br>
${body}
<br>
<img src="line-heart.gif" width="400" height="12"><br>
<font size="1" color="#999999">素材の直リンクは禁止です／Since 2000.06.01</font>
</center>
</body>
</html>
`;

const heading = (title: string): string =>
  `<table border="0" cellpadding="4" cellspacing="0" width="480"><tr><td bgcolor="#FFD6E8" align="center"><font color="#E05090"><b>♪${title}♪</b></font></td></tr></table>`;

const index = page(
  "",
  `<img src="anime-welcome.gif" width="200" height="40" alt="ようこそ"><br>
<font size="2">かわいい壁紙・ライン・アイコンを配っています♪</font><br>
あなたは <!--COUNTER--> 人目のお客様です<br>
<br>
<table border="0" cellpadding="8" cellspacing="0" width="480" bgcolor="#FFFFFF">
<tr><td align="center">
<font color="#FF3366"><b>ご利用の前に、かならず<a href="kiyaku.html">お約束</a>を読んでね！</b></font><br>
<font size="2">素材はすべて無料です。直リンクはしないでね。</font>
</td></tr>
</table>
<br>
${heading("更新履歴")}
<table border="0" cellpadding="4" cellspacing="0" width="480" bgcolor="#FFFFFF">
<tr><td><font size="2">
2000/08/20　<a href="line.html">ライン</a>に「おほしさま」を追加しました <img src="new.gif" width="38" height="14" alt="NEW"><br>
2000/08/12　<a href="kabe.html">壁紙</a>を 2 つ追加しました<br>
2000/07/30　<a href="anime.html">動く素材</a>のページを作りました<br>
2000/07/15　<a href="bbs.html">利用報告板</a>を置きました<br>
2000/06/01　開館しました！
</font></td></tr>
</table>`,
);

const kiyaku = page(
  "お約束 - ",
  `${heading("ご利用のお約束")}
<table border="0" cellpadding="8" cellspacing="0" width="480" bgcolor="#FFFFFF">
<tr><td><font size="2">
<b>★素材はすべて無料です</b><br>
個人のホームページなら、どなたでもお使いいただけます。<br>
<br>
<b>★直リンクは禁止です</b><br>
このサイトの画像を、そのままあなたのページに表示させないでください。こちらのサーバーが重くなってしまいます。<br>
画像の上で右クリックして保存してから、<b>ご自分のスペースに上げて</b>お使いください。<br>
<br>
<b>★「借ります」のひとことがうれしいです</b><br>
使ってくださるときは、<a href="bbs.html">利用報告板</a>でひとこと教えてもらえると、管理人がとってもよろこびます（なくても大丈夫です）。
</font></td></tr>
</table>`,
);

const kabeCell = (file: string, no: string, name: string): string =>
  `<td align="center" valign="top"><table border="1" cellpadding="0" cellspacing="0"><tr><td background="${file}" width="120" height="60"><br></td></tr></table><span class="no">${no} ${name}</span></td>`;

const kabe = page(
  "壁紙 - ",
  `${heading("壁紙")}
<font size="2">ページの背景に敷きつめて使う画像です。<br>
保存するときは、↓の小さい画像を右クリックしてね。</font><br>
<table border="0" cellpadding="6" cellspacing="0" width="480" bgcolor="#FFFFFF">
<tr>${kabeCell("kabe-dot.gif", "No.01", "みずたま")}${kabeCell("kabe-check.gif", "No.02", "チェック")}${kabeCell("kabe-sky.gif", "No.03", "あおぞら")}</tr>
<tr>
<td align="center"><img src="kabe-dot.gif" width="24" height="24" alt="No.01"></td>
<td align="center"><img src="kabe-check.gif" width="32" height="32" alt="No.02"></td>
<td align="center"><img src="kabe-sky.gif" width="80" height="80" alt="No.03"></td>
</tr>
</table>`,
);

const lineItem = (file: string, height: number, no: string, name: string): string =>
  `<img src="${file}" width="400" height="${height}" alt="${name}"><br><span class="no">${no} ${name}</span><br><br>`;

const line = page(
  "ライン - ",
  `${heading("ライン")}
<font size="2">文章の区切りに使ってね。幅は 400 ピクセルです。</font><br><br>
<table border="0" cellpadding="8" cellspacing="0" width="480" bgcolor="#FFFFFF">
<tr><td align="center">
${lineItem("line-star.gif", 14, "No.05", "おほしさま")}${lineItem("line-heart.gif", 12, "No.04", "ハート")}${lineItem("line-flower.gif", 14, "No.03", "おはな")}${lineItem("line-wave.gif", 10, "No.02", "なみなみ")}${lineItem("line-dot.gif", 6, "No.01", "てんてん")}
</td></tr>
</table>`,
);

const icon = page(
  "アイコン・ボタン - ",
  `${heading("アイコン")}
<table border="0" cellpadding="8" cellspacing="0" width="480" bgcolor="#FFFFFF">
<tr align="center">
<td><img src="icon-home.gif" width="32" height="32" alt="おうち"><br><span class="no">おうち</span></td>
<td><img src="icon-book.gif" width="32" height="32" alt="ほん"><br><span class="no">ほん</span></td>
<td><img src="icon-pen.gif" width="32" height="32" alt="えんぴつ"><br><span class="no">えんぴつ</span></td>
<td><img src="icon-ball.gif" width="14" height="14" alt="まる"><br><span class="no">まる</span></td>
</tr>
</table>
<br>
${heading("ボタン")}
<table border="0" cellpadding="8" cellspacing="0" width="480" bgcolor="#FFFFFF">
<tr align="center">
<td><img src="btn-home.gif" width="88" height="24" alt="HOME"></td>
<td><img src="btn-diary.gif" width="88" height="24" alt="DIARY"></td>
<td><img src="btn-bbs.gif" width="88" height="24" alt="BBS"></td>
</tr>
<tr align="center">
<td><img src="btn-profile.gif" width="88" height="24" alt="PROFILE"></td>
<td><img src="btn-link.gif" width="88" height="24" alt="LINK"></td>
<td><img src="btn-top.gif" width="80" height="24" alt="TOP"></td>
</tr>
</table>
<font size="2">メニューにならべると、おそろいになります♪</font>`,
);

const anime = page(
  "動く素材 - ",
  `${heading("動く素材")}
<font size="2">GIF アニメです。使いすぎるとページが重くなるので、ほどほどにね。</font><br><br>
<table border="0" cellpadding="8" cellspacing="0" width="480" bgcolor="#FFFFFF">
<tr align="center">
<td><img src="new.gif" width="38" height="14" alt="NEW"><br><span class="no">NEW</span></td>
<td><img src="mail.gif" width="26" height="18" alt="メール"><br><span class="no">メール</span></td>
<td><img src="anime-up.gif" width="30" height="14" alt="UP"><br><span class="no">UP</span></td>
<td><img src="anime-arrow.gif" width="24" height="16" alt="やじるし"><br><span class="no">やじるし</span></td>
</tr>
<tr align="center">
<td colspan="2"><img src="anime-welcome.gif" width="200" height="40" alt="ようこそ"></td>
<td colspan="2"><img src="anime-kiriban.gif" width="120" height="24" alt="キリ番"></td>
</tr>
</table>`,
);

const post = (title: string, name: string, date: string, text: string, reply: string): string =>
  `<table border="0" cellpadding="6" cellspacing="0" width="480" bgcolor="#FFFFFF">
<tr><td bgcolor="#FFE8F2"><b>${title}</b>　<font size="2">${name}　${date}</font></td></tr>
<tr><td><font size="2">${text}<br><br><font color="#E05090">＞管理人より：${reply}</font></font></td></tr>
</table><br>`;

const bbs = page(
  "利用報告板 - ",
  `${heading("利用報告板")}
<font size="2">素材を使ってくださった方は、ひとことどうぞ♪</font><br><br>
<form>
<table border="0" cellpadding="4" cellspacing="0" width="480" bgcolor="#FFFFFF">
<tr><td>おなまえ</td><td><input type="text" name="name" size="20"></td></tr>
<tr><td>タイトル</td><td><input type="text" name="title" size="30"></td></tr>
<tr><td>メッセージ</td><td><textarea name="text" rows="3" cols="40"></textarea></td></tr>
<tr><td colspan="2" align="center"><input type="submit" value="書きこむ"></td></tr>
</table>
</form>
${post("借ります♪", "みゆ", "2000/08/21", "ハートのラインと、みずたまの壁紙を借ります！ とってもかわいいです。", "ご報告ありがとうございます！ 大事に使ってくださいね☆")}
${post("借りました", "なな", "2000/08/19", "アイコンを日記のページで使わせてもらいました。", "ありがとうございます☆")}
${post("画像が出ません…", "あい", "2000/08/15", "壁紙のアドレスをそのまま書いたのですが、うまく出ないときがあります。", "直リンクはできないんです、ごめんなさい。画像を保存して、ご自分のスペースに上げてから使ってくださいね。")}`,
);

const link = page(
  "リンク - ",
  `${heading("当館のバナー")}
<table border="0" cellpadding="8" cellspacing="0" width="480" bgcolor="#FFFFFF">
<tr><td align="center">
<img src="bn-hoge.gif" width="88" height="31" alt="ほげ素材館"> <img src="bn-linkfree.gif" width="88" height="31" alt="リンクフリー"><br>
<font size="2">リンクはご自由にどうぞ。バナーは保存してお使いください（直リンク禁止です）。</font>
</td></tr>
</table>
<br>
${heading("素材のおともだち")}
<table border="0" cellpadding="8" cellspacing="0" width="480" bgcolor="#FFFFFF">
<tr><td><font size="2">
<a href="http://www.hogespace.example/ichigo/">いちご素材店</a>　…　パステルの壁紙がいっぱい<br>
<a href="http://www.hogespace.example/hoshizora/">ほしぞら工房</a>　…　キラキラのラインとアイコン<br>
<a href="http://www.hogespace.example/nekomaru/">ねこまるの部屋</a>　…　素材を使ってくださっています
</font></td></tr>
</table>`,
);

export const pages: readonly SitePage[] = [
  { path: "index.html", html: index },
  { path: "kiyaku.html", html: kiyaku },
  { path: "kabe.html", html: kabe },
  { path: "line.html", html: line },
  { path: "icon.html", html: icon },
  { path: "anime.html", html: anime },
  { path: "bbs.html", html: bbs },
  { path: "link.html", html: link },
];
