import type { SitePage } from "@anokoro/shared";
import { TEMPLATE } from "../kit/notepad/templates.ts";

const head = (title: string): string => `<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=Shift_JIS">
<title>${title} - ☆★たろうのお部屋★☆</title>
</head>
<body bgcolor="#FFFFFF" background="kabe1.gif" text="#333333" link="#0000FF" vlink="#800080">
<center>
<font size="4" color="#FF6699"><b>☆ ${title} ☆</b></font><br>
<img src="line.gif" width="400" height="8"><br>
</center>`;
const BACK = `<br>
<center>
<a href="index.html">トップへ戻る</a><br>
<font size="1" color="#999999">Since 2003.11.01</font>
</center>
</body>
</html>
`;

const profile = `${head("プロフィール")}
<center>
<table border="1" cellpadding="6" cellspacing="0" width="450" bgcolor="#FFFFEE">
<tr><td width="130" bgcolor="#CCEEFF">ハンドル</td><td>たろう</td></tr>
<tr><td bgcolor="#CCEEFF">お仕事</td><td>会社員 2 年目（営業です）</td></tr>
<tr><td bgcolor="#CCEEFF">好きなもの</td><td>写真、ラーメン屋めぐり、サッカー観戦</td></tr>
<tr><td bgcolor="#CCEEFF">ネット環境</td><td>ADSL にしました！もう電話代を気にしなくていい♪</td></tr>
<tr><td bgcolor="#CCEEFF">ケータイ</td><td>カメラつきに買い替えました。日記の写真はたまにこれで撮ってます</td></tr>
</table>
<br>
<img src="photo-me.jpg" width="96" height="96"><br>
<font size="2">本人です（ちょっとだけ写りがいいのを選びました）</font>
</center>
${BACK}`;

const diary = `${head("たろう日記")}
<blockquote>
<b>11月18日（火）</b> <img src="new.gif"><br>
カウンターが 600 を超えました。日記ランキングから来てくれる人が多いみたいです。<br>
777 を踏んだ方は<a href="bbs.html">掲示板</a>で報告してくださいね！<br><br>
<b>11月15日（土）</b><br>
デジカメを持って紅葉を見に行きました。<a href="album.html">アルバム</a>に写真をのせたので見てください。<br><br>
<b>11月10日（月）</b><br>
<a href="link.html">リンク</a>に 3 件追加しました。相互リンクしてくださった皆さん、ありがとうございます。<br><br>
<b>11月3日（月）</b><br>
文化の日。一日じゅう HTML とにらめっこして、メニューの色を変えました。<br><br>
<b>11月1日（土）</b><br>
ホームページを開設しました！無料スペースは 12MB もあるので、写真もどんどんのせていきます。
</blockquote>
${BACK}`;

const bbs = `${head("たろうの掲示板")}
<center>
<font size="2">感想、キリ番の報告、相互リンクのお願い、お気軽にどうぞ。</font>
<form>
<table border="1" cellpadding="3" cellspacing="0" bgcolor="#FFFFEE">
<tr><td bgcolor="#CCEEFF">名前</td><td><input type="text" name="name" size="20"></td></tr>
<tr><td bgcolor="#CCEEFF">E-mail</td><td><input type="text" name="email" size="30"></td></tr>
<tr><td bgcolor="#CCEEFF">URL</td><td><input type="text" name="url" size="40" value="http://"></td></tr>
<tr><td bgcolor="#CCEEFF">内容</td><td><textarea name="body" cols="44" rows="5"></textarea></td></tr>
<tr><td colspan="2" align="center"><input type="submit" value="投稿する"> <input type="reset" value="リセット"></td></tr>
</table>
</form>
</center>
<table border="0" cellpadding="6" cellspacing="0" width="100%">
<tr><td bgcolor="#CCEEFF"><b>[3] はじめまして</b>　投稿者：ゆき　2003/11/17(Mon) 23:12</td></tr>
<tr><td bgcolor="#FFFFFF">
日記ランキングから来ました。ラーメン屋めぐりの日記、おもしろかったです！<br>
また遊びに来ます。<br>
<font color="#800080">＞ゆきさん　ありがとうございます！おすすめのお店があったら教えてください。（たろう）</font>
</td></tr>
<tr><td bgcolor="#CCEEFF"><b>[2] 相互リンクのお願い</b>　投稿者：じろう　2003/11/09(Sun) 21:30</td></tr>
<tr><td bgcolor="#FFFFFF">
「じろうの写真館」の管理人です。よろしければ相互リンクをお願いします。<br>
<font color="#800080">＞じろうさん　喜んで！リンクに追加しました。（たろう）</font>
</td></tr>
<tr><td bgcolor="#CCEEFF"><b>[1] 開設おめでとう！</b>　投稿者：はなこ　2003/11/01(Sat) 22:05</td></tr>
<tr><td bgcolor="#FFFFFF">
開設おめでとうございます♪ 一番乗りでした！
</td></tr>
</table>
<center><font size="1" color="#999999">無料レンタル掲示板 - ほげスペース</font></center>
${BACK}`;

const link = `${head("リンク")}
<blockquote>
<b>■相互リンク</b><br>
<a href="http://www.hogespace.example/jiro/"><img src="bn-hoge.gif" width="88" height="31" border="0" alt="じろうの写真館"></a>
<a href="http://www.hogespace.example/hanako/"><img src="bn-surfer.gif" width="88" height="31" border="0" alt="はなこの部屋"></a><br>
<a href="http://www.hogespace.example/yuki/">ゆきのラーメン日記</a> - 食べ歩きの写真がすごい<br>
<br>
<b>■素材をお借りしたサイト</b><br>
<a href="http://www.hogespace.example/sozai/">ほげほげ素材館</a> - 壁紙とラインをお借りしています<br>
<br>
<b>■参加しているランキング</b><br>
<a href="http://www.hogehoge.example/ranking/">ほげほげ日記ランキング</a> - 気に入ったら投票してね！<br>
<br>
<b>■このサイトについて</b><br>
リンクフリーです。バナーはお持ち帰りでお願いします。<br>
<img src="bn-linkfree.gif" width="88" height="31" alt="リンクフリー"><br>
更新は、ほげほげアンテナでもチェックできます。
</blockquote>
${BACK}`;

const album = `${head("アルバム")}
<center>
<font size="2">デジカメとケータイで撮った写真です。小さくしてあります。</font><br><br>
<table border="1" cellpadding="6" cellspacing="0" bgcolor="#FFFFEE">
<tr>
<td align="center"><img src="photo-flower.jpg" width="160" height="120"><br><font size="2">公園の花（11/15）</font></td>
<td align="center"><img src="photo-sea.jpg" width="160" height="120"><br><font size="2">帰りに寄った海（11/15）</font></td>
</tr>
<tr>
<td align="center"><img src="photo-cat.jpg" width="160" height="120"><br><font size="2">実家のねこ（11/3）</font></td>
<td align="center"><img src="koji.gif"><br><font size="2">ラーメンの写真は工事中…</font></td>
</tr>
</table>
<br>
<font size="2">写真の無断転載はご遠慮ください。</font><br>
<a href="diary.html">日記へ戻る</a>
</center>
${BACK}`;

export const pages: readonly SitePage[] = [
  { path: "index.html", html: TEMPLATE },
  { path: "profile.html", html: profile },
  { path: "diary.html", html: diary },
  { path: "bbs.html", html: bbs },
  { path: "link.html", html: link },
  { path: "album.html", html: album },
];
