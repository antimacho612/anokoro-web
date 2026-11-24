import type { SitePage } from "@anokoro/shared";

const BODY = `<body bgcolor="#FFFFFF" background="kabe2.gif" text="#333333" link="#0066CC" vlink="#9933CC">`;
const heading = (title: string): string => `<center>
<font size="4" color="#FF6699"><b>■${title}■</b></font><br>
<img src="line.gif" width="400" height="8">
</center>`;
const BACK = `<center><a href="index.html">トップへ戻る</a></center>
</body>
</html>
`;

const index = `<html>
<head>
<title>☆ねこまるの部屋☆</title>
</head>
${BODY}
<center>
<font size="5" color="#FF6699"><b>☆ねこまるの部屋☆</b></font><br>
<font size="2">ねこと音楽と、ときどき日記。</font><br>
<img src="line.gif" width="400" height="8"><br>
あなたは <!--COUNTER--> 人目のお客様です♪<br>
<font size="2" color="#FF0000">キリ番 1000 を踏んだ方は掲示板で報告してね！踏み逃げ禁止！</font>
<br><br>
<table border="1" cellpadding="6" cellspacing="0" width="480" bgcolor="#FFFFEE">
<tr>
<td width="140" valign="top" bgcolor="#FFE0EE">
<b>■メニュー</b><br>
<a href="profile.html">プロフィール</a><br>
<a href="diary.html">日記</a> <img src="new.gif"><br>
<a href="bbs.html">掲示板</a><br>
<a href="q100.html">100の質問</a><br>
<a href="kiriban.html">キリ番の記録</a><br>
<a href="link.html">リンク</a>
</td>
<td valign="top">
<b>■更新履歴</b><br>
<font size="2">
1999/06/20 日記を更新しました<br>
1999/06/18 100の質問に答えました<br>
1999/06/12 プロフィールを作りました<br>
1999/06/05 掲示板を置きました<br>
1999/06/01 サイト開設！
</font>
<br><br>
<img src="koji.gif"><br>
<font size="2">チャットのページは工事中です…</font>
</td>
</tr>
</table>
<br>
<font size="2">♪BGM：ねこのワルツ（自作です）</font><br>
<embed src="neko.mid" autostart="true" loop="true" width="145" height="60"><br>
<br>
<img src="mail.gif"> <a href="mailto:nekomaru@example.com">メールはこちら</a><br>
<font size="1" color="#999999">Since 1999.06.01 / リンクフリーです</font>
</center>
</body>
</html>
`;

const profile = `<html>
<head>
<title>プロフィール</title>
</head>
${BODY}
${heading("プロフィール")}
<center>
<table border="1" cellpadding="4" cellspacing="0" width="400" bgcolor="#FFFFFF">
<tr><td width="120" bgcolor="#FFE0EE">ハンドル</td><td>ねこまる</td></tr>
<tr><td bgcolor="#FFE0EE">住んでいる所</td><td>関東のどこか</td></tr>
<tr><td bgcolor="#FFE0EE">好きなもの</td><td>ねこ、ギター、カレー</td></tr>
<tr><td bgcolor="#FFE0EE">うちのねこ</td><td>みけ（3 さい・女の子）</td></tr>
<tr><td bgcolor="#FFE0EE">ひとこと</td><td>メールや掲示板の書き込み、お待ちしています！</td></tr>
</table>
<br>
<img src="photo-cat.jpg" width="160" height="120"><br>
<font size="2">みけです。ひなたぼっこが大好き。</font><br>
<br>
もっと知りたい方は <a href="q100.html">100の質問</a> へどうぞ♪<br>
<br>
</center>
${BACK}`;

const diary = `<html>
<head>
<title>日記</title>
</head>
${BODY}
${heading("ねこまる日記")}
<blockquote>
<b>6月20日（日）</b> <img src="new.gif"><br>
ホームページのカウンターが500を超えました！見に来てくれる皆さん、ありがとう。<br>
500 番はみかんさんでした。<a href="kiriban.html">キリ番の記録</a>にのせました。<br>
今日はうちのねこが、窓の外の鳥をずっと見ていました。<br><br>
<b>6月18日（金）</b><br>
よそのサイトで見かけた「100の質問」に答えてみました。思ったより時間がかかった…。<br><br>
<b>6月15日（火）</b><br>
テレホタイムになると回線がつながりにくいです…。23時ちょうどにダイヤルしても話し中ばかり。<br><br>
<b>6月12日（土）</b><br>
プロフィールを作りました。<a href="profile.html">こちら</a>からどうぞ。<br><br>
<b>6月5日（土）</b><br>
無料の掲示板を借りて、<a href="bbs.html">掲示板</a>を置きました。だれか書き込んでくれるかな？
</blockquote>
${BACK}`;

const bbs = `<html>
<head>
<title>ねこまる掲示板</title>
</head>
${BODY}
${heading("ねこまる掲示板")}
<center>
<font size="2">キリ番の報告、相互リンクのお願い、ただのおしゃべり、なんでもどうぞ♪</font>
<form>
<table border="0" cellpadding="2" bgcolor="#FFE0EE">
<tr><td>おなまえ</td><td><input type="text" name="name" size="20"></td></tr>
<tr><td>メール</td><td><input type="text" name="email" size="30"></td></tr>
<tr><td>タイトル</td><td><input type="text" name="subject" size="30"></td></tr>
<tr><td>コメント</td><td><textarea name="comment" cols="40" rows="4"></textarea></td></tr>
<tr><td colspan="2" align="center"><input type="submit" value="書き込む"> <input type="reset" value="消す"></td></tr>
</table>
</form>
</center>
<hr>
<b><font color="#FF6699">■ 500 踏みました！</font></b><br>
<font size="2">投稿者：みかん　1999/06/20(Sun) 23:41</font>
<blockquote>
はじめまして！500 番を踏んだので報告します♪<br>
みけちゃん、かわいいですね。また来ます！
<blockquote><font color="#9933CC">
＞みかんさん<br>
キリ番の報告ありがとうございます！キリ番の記録にのせておきますね。（ねこまる）
</font></blockquote>
</blockquote>
<hr>
<b><font color="#FF6699">■ 相互リンクのお願い</font></b><br>
<font size="2">投稿者：しろくま　1999/06/14(Mon) 23:58</font>
<blockquote>
しろくまの部屋の管理人です。ねこの写真のページを作っています。<br>
よかったら相互リンクしていただけませんか？
<blockquote><font color="#9933CC">
＞しろくまさん<br>
もちろんです！リンクのページに追加しました。（ねこまる）
</font></blockquote>
</blockquote>
<hr>
${BACK}`;

const q100 = `<html>
<head>
<title>100の質問</title>
</head>
${BODY}
${heading("ねこまるに100の質問")}
<blockquote>
<font size="2">ほかのサイトで見つけた質問に答えています。まだ 15 問目までです…。</font><br><br>
<b>Q1. お名前は？</b><br>A. ねこまるです。<br><br>
<b>Q2. 名前の由来は？</b><br>A. うちのねこが丸まって寝ているところから。<br><br>
<b>Q3. ホームページを作ったきっかけは？</b><br>A. みけの写真を見てもらいたくて！<br><br>
<b>Q4. パソコン歴は？</b><br>A. 1 年くらい。HTML は本を見ながら覚えました。<br><br>
<b>Q5. 好きな音楽は？</b><br>A. アコースティックギターの曲。自分でも少し弾きます。<br><br>
<b>Q6. よく見るサイトは？</b><br>A. ねこのサイトと、素材を配っているサイト。<br><br>
<b>Q7. ネットはいつつなぐ？</b><br>A. もちろんテレホタイム（夜 11 時から）です。<br><br>
<b>Q8. 好きな食べ物は？</b><br>A. カレー。辛口派です。<br><br>
<b>Q9. ねこ派？いぬ派？</b><br>A. 聞くまでもなく、ねこ派！<br><br>
<b>Q10. 最近うれしかったことは？</b><br>A. 掲示板に初めて書き込みがあったこと。<br><br>
<b>Q11. 最近こまったことは？</b><br>A. 電話代の請求書を見たとき…。<br><br>
<b>Q12. 将来の夢は？</b><br>A. ねこと一緒に、のんびり暮らすこと。<br><br>
<b>Q13. 自分を動物にたとえると？</b><br>A. やっぱり、ねこ。<br><br>
<b>Q14. このサイトの自慢は？</b><br>A. 自作の BGM です♪<br><br>
<b>Q15. 見てくれた人にひとこと！</b><br>A. 最後まで読んでくれてありがとう！<a href="bbs.html">掲示板</a>に足あとを残してね。<br><br>
<font size="2">（つづきは、そのうち答えます）</font>
</blockquote>
${BACK}`;

const kiriban = `<html>
<head>
<title>キリ番の記録</title>
</head>
${BODY}
${heading("キリ番の記録")}
<center>
<img src="anime-kiriban.gif" width="120" height="24"><br>
<font size="2">キリ番を踏んだ方のお名前です。報告してくれた皆さん、ありがとう！</font><br><br>
<table border="1" cellpadding="4" cellspacing="0" width="360" bgcolor="#FFFFFF">
<tr bgcolor="#FFE0EE"><th>番号</th><th>お名前</th><th>日にち</th></tr>
<tr><td align="center">500</td><td>みかんさん</td><td>1999/06/20</td></tr>
<tr><td align="center">300</td><td>しろくまさん</td><td>1999/06/14</td></tr>
<tr><td align="center">100</td><td>ぽちさん</td><td>1999/06/08</td></tr>
</table>
<br>
<font size="2" color="#FF0000">次のキリ番は 777 と 1000 です。踏んだら<a href="bbs.html">掲示板</a>で教えてね！</font><br>
<br>
</center>
${BACK}`;

const link = `<html>
<head>
<title>リンク</title>
</head>
${BODY}
${heading("リンク")}
<blockquote>
<b>◆相互リンク</b><br>
<a href="http://www.hogespace.example/shirokuma/">しろくまの部屋</a> - ねこの写真がいっぱい<br>
<a href="http://www.hogespace.example/mikan/">みかんの小部屋</a> - イラストと日記<br>
<br>
<b>◆よく行くところ</b><br>
<a href="http://www.hogespace.example/"><img src="bn-hogespace.gif" width="88" height="31" border="0" alt="ほげスペース"></a>
<a href="http://www.netsurfer.example/"><img src="bn-surfer.gif" width="88" height="31" border="0" alt="ネットサーファー"></a><br>
<br>
<b>◆このサイトへのリンク</b><br>
リンクフリーです。トップページ（index.html）にお願いします。<br>
報告は<a href="bbs.html">掲示板</a>でしてもらえるとうれしいです。<br>
<img src="bn-linkfree.gif" width="88" height="31" alt="リンクフリー">
</blockquote>
${BACK}`;

export const pages: readonly SitePage[] = [
  { path: "index.html", html: index },
  { path: "profile.html", html: profile },
  { path: "diary.html", html: diary },
  { path: "bbs.html", html: bbs },
  { path: "q100.html", html: q100 },
  { path: "kiriban.html", html: kiriban },
  { path: "link.html", html: link },
];
