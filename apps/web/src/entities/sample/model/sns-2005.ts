import type { SitePage } from "@anokoro/shared";

const STYLE = `<style type="text/css">
body { margin: 0; background-color: #EEF2F5; color: #333333; font-size: 12px; line-height: 150%; }
a { color: #1F5F8B; }
a:hover { color: #D0502A; }
#bar { background-color: #2F6F8F; padding: 6px 12px; }
#bar b { color: #FFFFFF; font-size: 16px; }
#bar a { color: #DDEEFF; margin-left: 12px; }
.box { background-color: #FFFFFF; border: 1px solid #B8C8D4; margin-bottom: 8px; }
.box h3 { margin: 0; padding: 3px 8px; font-size: 12px; color: #FFFFFF; background-color: #5A8FAF; }
.box .in { padding: 6px 8px; }
.small { font-size: 10px; color: #888888; }
.cm { border-top: 1px dotted #B8C8D4; padding: 6px 0; }
</style>`;

const page = (title: string, body: string): string => `<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=Shift_JIS">
<title>${title}ほげほげSNS</title>
${STYLE}
</head>
<body>
<div id="bar"><b>ほげほげSNS</b>
<a href="index.html">ホーム</a><a href="profile.html">プロフィール</a><a href="diary.html">日記</a><a href="ashiato.html">足あと</a><a href="friends.html">友だち</a><a href="community.html">コミュニティ</a><a href="invite.html">友だちを招待</a>
</div>
<table width="760" border="0" cellpadding="8" cellspacing="0" align="center"><tr><td>
${body}
</td></tr></table>
<p align="center" class="small">ほげほげSNS は招待制です。招待された人だけが登録できます</p>
</body>
</html>
`;

const box = (title: string, content: string): string =>
  `<div class="box"><h3>${title}</h3><div class="in">${content}</div></div>`;

const ME = box(
  "みかん",
  `<img src="photo-cat.jpg" width="120" height="90" alt="みかんの写真"><br>
女性・東京都<br>
<a href="profile.html">プロフィールを見る</a>`,
);

const FRIENDS = box(
  "友だち（6 人）",
  `<a href="friends.html">さくら</a>、<a href="friends.html">ほげ太</a>、<a href="friends.html">ちょこ</a>、<a href="friends.html">ゆうき</a>、<a href="friends.html">たけ</a>、<a href="friends.html">みどり</a>`,
);

const COMMUNITIES = box(
  "コミュニティ（3）",
  `<a href="community.html">ねこと暮らす</a><br>
ほげほげ市に住んでいる人<br>
駅前の喫茶店が好き`,
);

const twoColumns = (
  left: string,
  right: string,
): string => `<table width="100%" border="0" cellpadding="0" cellspacing="0"><tr>
<td width="180" valign="top">${left}</td>
<td width="12"></td>
<td valign="top">${right}</td>
</tr></table>`;

const index = page(
  "",
  twoColumns(
    `${ME}${FRIENDS}${COMMUNITIES}`,
    `${box(
      "お知らせ",
      `今日の足あと：<a href="ashiato.html">4 人</a><br>
新しいコメントが 2 件あります（<a href="diary-0612.html">ねこが箱に入った</a>）`,
    )}
${box(
  "友だちの最新日記",
  `06月12日　<a href="diary-0612.html">ねこが箱に入った</a>（みかん）<br>
06月12日　雨の日は読書（さくら）<br>
06月11日　自転車を買った（ゆうき）<br>
06月10日　カレー作りました（ほげ太）`,
)}
${box(
  "コミュニティの最新書き込み",
  `06月12日　<a href="community.html">うちの子自慢</a>（ねこと暮らす）`,
)}`,
  ),
);

const profile = page(
  "プロフィール - ",
  twoColumns(
    ME,
    box(
      "プロフィール",
      `<table border="0" cellpadding="4" cellspacing="0" width="100%">
<tr><td width="100" bgcolor="#EEF2F5">ニックネーム</td><td>みかん</td></tr>
<tr><td bgcolor="#EEF2F5">性別</td><td>女性</td></tr>
<tr><td bgcolor="#EEF2F5">現住所</td><td>東京都</td></tr>
<tr><td bgcolor="#EEF2F5">趣味</td><td>ねこ、読書、喫茶店めぐり</td></tr>
<tr><td bgcolor="#EEF2F5">自己紹介</td><td>ねこ 2 匹と暮らしています。<br>さくらちゃんに招待してもらって始めました。よろしくお願いします。</td></tr>
</table>`,
    ),
  ),
);

const diary = page(
  "日記 - ",
  twoColumns(
    ME,
    box(
      "みかんの日記",
      `<a href="diary-0612.html">ねこが箱に入った</a>（06月12日）コメント 3<br>
梅雨入りしたらしい（06月08日）コメント 1<br>
はじめての日記（06月01日）コメント 4`,
    ),
  ),
);

const diary0612 = page(
  "ねこが箱に入った - ",
  twoColumns(
    ME,
    `${box(
      "2005年06月12日　ねこが箱に入った",
      `通販の段ボールを開けたとたん、2 匹そろって箱に入りました。<br>
中身より箱のほうがうれしいみたい。`,
    )}
${box(
  "コメント",
  `<div class="cm"><a href="friends.html">さくら</a> <span class="small">06月12日 21:40</span><br>うちの子もです！ 箱、なんであんなに好きなんだろう。</div>
<div class="cm"><a href="friends.html">ほげ太</a> <span class="small">06月12日 22:05</span><br>写真見たい～</div>
<div class="cm"><a href="profile.html">みかん</a> <span class="small">06月12日 22:30</span><br>&gt; ほげ太さん　こんど撮ってのせますね。</div>
<form>
<textarea name="text" rows="3" cols="50"></textarea><br>
<input type="submit" value="コメントを書く">
</form>`,
)}`,
  ),
);

const ashiato = page(
  "足あと - ",
  twoColumns(
    ME,
    box(
      "足あと",
      `あなたのページを見に来た人です（新しい順）。<br><br>
06月12日 22:41　<a href="friends.html">さくら</a><br>
06月12日 22:03　<a href="friends.html">ほげ太</a><br>
06月12日 19:15　ねこ太郎（友だちではありません）<br>
06月12日 08:02　<a href="friends.html">ちょこ</a><br>
06月11日 23:30　<a href="friends.html">さくら</a>`,
    ),
  ),
);

const friends = page(
  "友だち - ",
  twoColumns(
    ME,
    box(
      "友だち（6 人）",
      `<table border="0" cellpadding="4" cellspacing="0" width="100%">
<tr><td width="80"><b>さくら</b></td><td>大学からの友だち。ほげほげSNS に招待してくれた人です。</td></tr>
<tr><td><b>ほげ太</b></td><td>会社の同期。カレーにうるさい。</td></tr>
<tr><td><b>ちょこ</b></td><td>ねこのコミュニティで知り合いました。</td></tr>
<tr><td><b>ゆうき</b></td><td>高校の同級生。最近、自転車にはまっているらしい。</td></tr>
<tr><td><b>たけ</b></td><td>ゆうきくんの友だち。</td></tr>
<tr><td><b>みどり</b></td><td>近所の喫茶店仲間。</td></tr>
</table>`,
    ),
  ),
);

const community = page(
  "ねこと暮らす - ",
  twoColumns(
    box(
      "ねこと暮らす",
      `メンバー 1,284 人<br>
ねこと暮らしている人、ねこが好きな人のコミュニティです。`,
    ),
    box(
      "トピック",
      `<div class="cm"><b>うちの子自慢</b>（書き込み 352）<br><span class="small">最新：06月12日　ちょこ「箱に入るのは全国共通ですね」</span></div>
<div class="cm"><b>はじめまして・自己紹介</b>（書き込み 1,020）</div>
<div class="cm"><b>動物病院の情報</b>（書き込み 88）</div>`,
    ),
  ),
);

const invite = page(
  "友だちを招待 - ",
  twoColumns(
    ME,
    box(
      "友だちを招待する",
      `ほげほげSNS は招待制です。招待状を送った人だけが登録できます。<br><br>
<form>
招待する人のメールアドレス<br><input type="text" name="mail" size="40"><br>
ひとこと<br><textarea name="text" rows="3" cols="50">ねこの写真、ここにのせてるよ。よかったら登録してみて！</textarea><br>
<input type="submit" value="招待状を送る">
</form>`,
    ),
  ),
);

export const pages: readonly SitePage[] = [
  { path: "index.html", html: index },
  { path: "profile.html", html: profile },
  { path: "diary.html", html: diary },
  { path: "diary-0612.html", html: diary0612 },
  { path: "ashiato.html", html: ashiato },
  { path: "friends.html", html: friends },
  { path: "community.html", html: community },
  { path: "invite.html", html: invite },
];
