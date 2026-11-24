import type { SitePage } from "@anokoro/shared";

const STYLE = `<style type="text/css">
body { margin: 0; background-color: #E8F1F5; color: #333333; font-family: sans-serif; font-size: 13px; line-height: 1.6; }
a { color: #1D6FA5; }
#wrap { max-width: 860px; margin: 0 auto; background-color: #FFFFFF; border-left: 1px solid #C5D9E3; border-right: 1px solid #C5D9E3; }
#header { padding: 14px 20px; background-color: #1D6FA5; color: #FFFFFF; }
#header h1 { margin: 0; font-size: 22px; }
#header p { margin: 0; font-size: 12px; }
#menu { margin: 0; padding: 6px 20px; background-color: #D6E8F2; list-style: none; }
#menu > li { display: inline; margin-right: 16px; }
#content { padding: 16px 20px; }
h2 { font-size: 16px; padding: 4px 8px; border-left: 5px solid #1D6FA5; background-color: #F2F7FA; }
.notice { padding: 8px 12px; border: 1px solid #F0C36D; background-color: #FFF9E6; }
.notice p:before { content: "■ "; color: #E0A020; }
table.threads { width: 100%; border-collapse: collapse; }
table.threads th { background-color: #D6E8F2; text-align: left; padding: 6px; }
table.threads td { border-bottom: 1px solid #E3ECF1; padding: 6px; }
table.threads tr:hover td { background-color: #F5FAFD; }
.post { border-bottom: 1px dotted #C5D9E3; padding: 8px 0; }
.post .head { color: #666666; font-size: 12px; }
.post .head b { color: #1D6FA5; }
#footer { padding: 12px 20px; font-size: 11px; color: #777777; text-align: center; border-top: 1px solid #C5D9E3; }
</style>`;

const page = (
  title: string,
  body: string,
): string => `<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title>${title}ほげほげ釣り広場</title>
${STYLE}
</head>
<body>
<div id="wrap">
<div id="header">
<h1>ほげほげ釣り広場</h1>
<p>川でも海でも。釣り好きが集まる情報交換の掲示板</p>
</div>
<ul id="menu">
<li><a href="index.html">スレッド一覧</a></li>
<li><a href="new.html">新しいスレッドを作る</a></li>
<li><a href="rule.html">利用規約</a></li>
<li><a href="faq.html">よくある質問</a></li>
</ul>
<div id="content">
${body}
</div>
<div id="footer">
<a href="rule.html">利用規約</a> ｜ <a href="faq.html">よくある質問</a> ｜ 管理人への連絡は<a href="mailto:admin@hogetsuri.example">こちら</a><br>
Copyright (C) 2009 ほげほげ釣り広場
</div>
</div>
</body>
</html>
`;

const post = (no: number, name: string, time: string, body: string): string => `<div class="post">
<div class="head">${no}. <b>${name}</b>　${time}</div>
<div>${body}</div>
</div>`;

const REPLY = `<h2>このスレッドに書き込む</h2>
<form>
<p>名前（空欄なら「釣り人さん」）<br><input type="text" name="name" size="24"></p>
<p>本文<br><textarea name="body" rows="5" cols="60"></textarea></p>
<p><input type="submit" value="書き込む"></p>
</form>`;

const index = page(
  "",
  `<div class="notice">
<p>はじめての方は、<a href="rule.html">利用規約</a>と<a href="faq.html">よくある質問</a>をお読みください。</p>
<p>釣り場の場所は、立入禁止の場所をのぞいて書き込んでかまいません。</p>
</div>
<form>
<p><input type="text" name="q" size="30"> <input type="submit" value="スレッドを検索"></p>
</form>
<h2>スレッド一覧</h2>
<table class="threads">
<tr><th>スレッド</th><th>返信</th><th>最終更新</th></tr>
<tr><td><a href="river.html">ほげほげ川の釣果報告 その5</a> <img src="ribbon-new.png" width="32" height="32" alt="NEW" align="absmiddle"></td><td>186</td><td>2009/06/14 21:42</td></tr>
<tr><td><a href="sea.html">ほげほげ港の堤防釣り</a></td><td>73</td><td>2009/06/14 18:05</td></tr>
<tr><td>初心者の質問はこちら</td><td>412</td><td>2009/06/13 22:30</td></tr>
<tr><td>仕掛けと道具の話</td><td>255</td><td>2009/06/12 23:11</td></tr>
<tr><td>雑談（釣り以外もOK）</td><td>931</td><td>2009/06/12 20:47</td></tr>
</table>
<p><a href="new.html"><img src="btn-glossy.png" width="140" height="36" alt="新しいスレッドを作る" border="0"></a></p>`,
);

const river = page(
  "ほげほげ川の釣果報告 その5 - ",
  `<h2>ほげほげ川の釣果報告 その5</h2>
${post(1, "やまめ", "2009/05/20 20:00", "前のスレッドがいっぱいになったので立てました。川の釣果はこちらへどうぞ。<br>場所、時間、仕掛け、釣れた数を書いてもらえると、みんなの参考になります。")}
${post(184, "日曜釣り師", "2009/06/14 19:12", "今朝 5 時から中流の橋の下で。ウグイが 8 匹、ヤマメが 1 匹でした。")}
${post(185, "釣り人さん", "2009/06/14 20:30", "&gt;&gt;184 ヤマメいいですね！ 水の濁りはどうでしたか？")}
${post(186, "日曜釣り師", "2009/06/14 21:42", "&gt;&gt;185 雨の次の日だったので少し濁っていました。写真はブログに載せました。")}
<p><img src="photo-sea.jpg" width="160" height="120" alt="川の写真"></p>
${REPLY}`,
);

const sea = page(
  "ほげほげ港の堤防釣り - ",
  `<h2>ほげほげ港の堤防釣り</h2>
${post(1, "うみかぜ", "2009/04/02 21:00", "ほげほげ港の堤防で釣りをする人の情報交換スレッドです。")}
${post(71, "釣り人さん", "2009/06/13 22:15", "週末はアジがよく釣れていました。サビキで 30 匹くらい。")}
${post(72, "うみかぜ", "2009/06/14 07:40", "&gt;&gt;71 朝のうちが勝負ですね。駐車場は 6 時には満車でした。")}
${post(73, "釣り人さん", "2009/06/14 18:05", "ゴミは持ち帰りましょう。堤防が釣り禁止になったら困るので。")}
${REPLY}`,
);

const newThread = page(
  "新しいスレッドを作る - ",
  `<h2>新しいスレッドを作る</h2>
<p>同じ話題のスレッドがないか、<a href="index.html">スレッド一覧</a>で確かめてから作ってください。</p>
<form>
<p>スレッドのタイトル<br><input type="text" name="title" size="50"></p>
<p>名前<br><input type="text" name="name" size="24"></p>
<p>最初の書き込み<br><textarea name="body" rows="6" cols="60"></textarea></p>
<p><input type="submit" value="スレッドを作る"></p>
</form>`,
);

const rule = page(
  "利用規約 - ",
  `<h2>利用規約</h2>
<ol>
<li>ほかの人の悪口、個人情報、宣伝の書き込みは禁止です。</li>
<li>立入禁止の場所や、釣りが禁止されている場所の情報は書かないでください。</li>
<li>書き込みをほかの掲示板やブログに転載するときは、このサイトの名前とアドレスを書いてください。</li>
<li>規約に反する書き込みは、管理人が削除します。</li>
</ol>`,
);

const faq = page(
  "よくある質問 - ",
  `<h2>よくある質問</h2>
<dl>
<dt><b>Q. 会員登録は必要ですか？</b></dt>
<dd>A. いりません。名前も空欄のままで書き込めます。</dd>
<dt><b>Q. 写真は載せられますか？</b></dt>
<dd>A. この掲示板には載せられません。ブログやアルバムのサービスに載せて、アドレスを書いてください。</dd>
<dt><b>Q. ブログや SNS とはどう使い分けていますか？</b></dt>
<dd>A. 日記はブログや SNS で書く人が多くなりました。ここでは、釣り場や仕掛けの情報を、みんなで残していくことを大切にしています。</dd>
</dl>
<p><img src="icon-soft-mail.png" width="48" height="48" alt="" align="left"> そのほかのご質問は、<a href="mailto:admin@hogetsuri.example">管理人へのメール</a>でどうぞ。</p>`,
);

export const pages: readonly SitePage[] = [
  { path: "index.html", html: index },
  { path: "river.html", html: river },
  { path: "sea.html", html: sea },
  { path: "new.html", html: newThread },
  { path: "rule.html", html: rule },
  { path: "faq.html", html: faq },
];
