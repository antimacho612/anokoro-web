import type { Year } from "@anokoro/era-data";
import type { Part, PartBase } from "./parts.ts";

const WEEK_HEADER = ["日", "月", "火", "水", "木", "金", "土"];

/** 選んだ年の 11 月のカレンダー */
function novemberCalendar(year: Year): string {
  const firstDay = new Date(Date.UTC(year, 10, 1)).getUTCDay();
  const cells = [
    ...Array.from({ length: firstDay }, () => "&nbsp;"),
    ...Array.from({ length: 30 }, (_, i) =>
      i + 1 === 18 ? `<a href="1118.html">18</a>` : `${i + 1}`,
    ),
  ];
  const rows = Array.from({ length: Math.ceil(cells.length / 7) }, (_, row) =>
    cells.slice(row * 7, row * 7 + 7),
  );
  const head = WEEK_HEADER.map((day) => `<td align="center">${day}</td>`).join("");
  const body = rows
    .map((row) => `<tr>${row.map((cell) => `<td align="right">${cell}</td>`).join("")}</tr>`)
    .join("\n");
  return `<table border="0" cellspacing="0" cellpadding="2">
<tr><td colspan="7" align="center"><b>${year}年11月</b></td></tr>
<tr>${head}</tr>
${body}
</table>
`;
}

export const PARTS: readonly Part[] = [
  {
    label: "ようこそ",
    code: `<center><font size="5" color="#003399"><b>ようこそ ほげほげ商事のホームページへ</b></font></center>
`,
    tip: "トップに「ようこそ」と大きく書くのが、企業サイトの第一声でした",
    tipTopic: "corporate",
    era: { kind: "siteKind", siteKind: "corporate" },
    category: "notice",
    kinds: ["corporate"],
  },
  {
    label: "最終更新日",
    code: `<hr>
<font size="2">最終更新日：{{year}}年11月18日<br>Copyright (C) {{year}} Hogehoge Co., Ltd. All Rights Reserved.</font>
`,
    tip: "ページの下に最終更新日と著作権表示を置くのが決まりごとでした",
    tipTopic: "corporate",
    era: { kind: "siteKind", siteKind: "corporate" },
    category: "notice",
    kinds: ["corporate"],
  },
  {
    label: "新着情報",
    code: `<b>■新着情報</b><br>
<font size="2">{{year}}.11.18 冬季休業のお知らせを掲載しました<br>
{{year}}.11.01 新製品「ほげほげ 2」を発売しました</font><br>
`,
    tip: "日付と一行のお知らせを新しい順に並べる欄です。いちばん上の日付で、更新が止まっていないかが分かります",
    tipTopic: "corporate",
    era: { kind: "siteKind", siteKind: "corporate" },
    category: "notice",
    kinds: ["corporate"],
  },
  {
    label: "所在地",
    code: `<address>ほげほげ商事株式会社<br>
〒100-0000 東京都ほげ区ほげ 1-2-3<br>
TEL 03-0000-0000 ／ FAX 03-0000-0001</address>
`,
    tip: "address は、連絡先を書くための HTML のタグです",
    tipTopic: "corporate",
    era: { kind: "siteKind", siteKind: "corporate" },
    category: "notice",
    kinds: ["corporate"],
  },
  {
    label: "お問い合わせフォーム",
    code: `<form>
お名前：<input type="text" name="name" size="30"><br>
メールアドレス：<input type="text" name="mail" size="30"><br>
お問い合わせ内容：<br>
<textarea name="body" rows="5" cols="50"></textarea><br>
<input type="submit" value="送信する"> <input type="reset" value="消す">
</form>
`,
    tip: "フォームの中身を送るには CGI が必要でした。このキットでは送信できません",
    tipTopic: "corporate",
    era: { kind: "siteKind", siteKind: "corporate" },
    category: "social",
    kinds: ["corporate"],
  },
  {
    label: "イントロの SKIP",
    code: `<center>
<font size="2">このサイトをご覧になるにはプラグインが必要です。</font><br>
<a href="top.html">SKIP &gt;&gt;</a>
</center>
`,
    tip: "トップで Flash のイントロが流れ、「SKIP」で飛ばせる作りが企業サイトでよく見られました",
    tipTopic: "corporate",
    era: { kind: "trend", trend: "flash-intro" },
    category: "media",
    kinds: ["corporate"],
  },
  {
    label: "ご利用環境",
    code: `<b>■ご利用環境</b><br>
<font size="2">当サイトは、ネットサーファーの最新版、画面の大きさ {{resolution}} 以上でご覧いただくことをおすすめします。<br>
お申し込みのページは SSL で暗号化しています。</font><br>
`,
    tip: "おすすめのブラウザと画面の大きさ、SSL の説明を 1 ページにまとめる企業サイトがありました",
    tipTopic: "corporate",
    era: { kind: "trend", trend: "recommended-env" },
    category: "notice",
    kinds: ["corporate", "shop"],
  },
  {
    label: "プライバシーポリシー",
    code: `<font size="2"><a href="privacy.html">個人情報の取り扱いについて（プライバシーポリシー）</a></font><br>
`,
    tip: "2005年4月に個人情報保護法が全面施行され、方針を掲げるサイトが増えました",
    tipTopic: "corporate",
    era: { kind: "trend", trend: "privacy-policy" },
    category: "notice",
    kinds: ["corporate", "shop"],
  },
  {
    label: "公式アカウント",
    code: `<font size="2">ほげほげ商事は SNS の公式アカウントでも、新着情報をお知らせしています。</font><br>
`,
    tip: "東日本大震災の直後には、官公庁や企業が SNS の公式アカウントで情報を出し続けました",
    tipTopic: "corporate",
    era: { kind: "trend", trend: "sns-official" },
    category: "social",
    kinds: ["corporate", "shop"],
  },
  {
    label: "カテゴリ一覧",
    code: `<table border="0" cellpadding="4" width="500">
<tr>
<td><b><a href="art.html">芸術と人文</a></b><br><font size="2">文学、写真、美術館...</font></td>
<td><b><a href="hobby.html">趣味とスポーツ</a></b><br><font size="2">音楽、釣り、ゲーム...</font></td>
</tr>
</table>
`,
    tip: "カテゴリをたどってサイトを探すのが、ディレクトリ型の使い方でした",
    tipTopic: "portal",
    era: { kind: "siteKind", siteKind: "portal" },
    category: "navi",
    kinds: ["portal"],
  },
  {
    label: "サイト登録",
    code: `<font size="2">あなたのホームページを載せませんか？ <a href="regist.html">ご登録はこちら</a></font><br>
`,
    tip: "登録されるとアクセスが一気に増えるので、申請する人が絶えませんでした",
    tipTopic: "portal",
    era: { kind: "siteKind", siteKind: "portal" },
    category: "social",
    kinds: ["portal"],
  },
  {
    label: "検索窓",
    code: `<form>
<input type="text" name="p" size="30"> <input type="submit" value="検索">
</form>
`,
    tip: "キーワードで探す窓と、カテゴリをたどる一覧が、同じページに並んでいました",
    tipTopic: "portal",
    era: { kind: "siteKind", siteKind: "portal" },
    category: "navi",
    kinds: ["portal"],
  },
  {
    label: "新着サイト",
    code: `<img src="mark-shinchaku.gif"> <b>新着サイト</b> <font size="2">（{{year}}年11月18日 更新）</font><br>
<font size="2"><a href="new.html">ほげの部屋</a> - 猫と旅行の写真日記</font><br>
`,
    tip: "新しく登録されたサイトの一覧は、見に来る人の多い人気の欄でした",
    tipTopic: "portal",
    era: { kind: "siteKind", siteKind: "portal" },
    category: "notice",
    kinds: ["portal"],
  },
  {
    label: "今週のおすすめ",
    code: `<img src="mark-osusume.gif"> <b>今週のおすすめ</b><br>
<font size="2"><a href="pick.html">はなのホームページ</a> - 手作りお菓子のレシピ集</font><br>
`,
    tip: "1998年の大手無料ホームページのトップには、お薦めのホームページを紹介する欄がありました",
    tipTopic: "portal",
    era: { kind: "siteKind", siteKind: "portal" },
    category: "notice",
    kinds: ["portal"],
  },
  {
    label: "アクセスランキング",
    code: `<b>アクセスランキング</b><br>
<font size="2">1. <a href="r1.html">ほげの部屋</a>（12,345 アクセス）<br>
2. <a href="r2.html">はなのホームページ</a>（9,876 アクセス）<br>
3. <a href="r3.html">ほげほげ釣り日記</a>（5,432 アクセス）</font><br>
`,
    tip: "1998年の大手無料ホームページのトップには、独自のアクセスランキングが載っていました",
    tipTopic: "portal",
    era: { kind: "siteKind", siteKind: "portal" },
    category: "social",
    kinds: ["portal"],
  },
  {
    label: "書き込み",
    code: `<dl>
<dt>1 名前：<b>名無しさん</b> 投稿日：{{yy}}/11/18 21:40
<dd>はじめまして。いつも見ています。<br><br>
</dl>
`,
    tip: "名前の欄を空にすると「名無しさん」と表示されるのが、匿名掲示板の作法でした",
    tipTopic: "bbs",
    era: { kind: "siteKind", siteKind: "bbs" },
    category: "social",
    kinds: ["bbs"],
  },
  {
    label: "スレッド一覧",
    code: `<b>■スレッド一覧</b><br>
<font size="2">1: <a href="#1">雑談スレ (128)</a> 2: <a href="#2">初心者質問スレ (45)</a></font><br>
`,
    tip: "話題ごとのスレッドに書き込みが積み重なっていきました",
    tipTopic: "bbs",
    era: { kind: "siteKind", siteKind: "bbs" },
    category: "navi",
    kinds: ["bbs"],
  },
  {
    label: "投稿フォーム",
    code: `<form>
名前：<input type="text" name="name" size="20"> E-mail：<input type="text" name="mail" size="20"><br>
<textarea name="body" rows="4" cols="60"></textarea><br>
<input type="submit" value="書き込む">
</form>
`,
    tip: "書き込みを受け取るには CGI が必要でした。このキットでは書き込めません",
    tipTopic: "bbs",
    era: { kind: "siteKind", siteKind: "bbs" },
    category: "social",
    kinds: ["bbs"],
  },
  {
    label: "削除の方針",
    code: `<font color="#CC0000" size="2">※荒らしや宣伝の書き込みは、管理人の判断で削除します。</font><br>
`,
    tip: "誰でも書ける掲示板では、管理人が書き込みを消して場を保っていました",
    tipTopic: "bbs",
    era: { kind: "siteKind", siteKind: "bbs" },
    category: "notice",
    kinds: ["bbs"],
  },
  {
    label: "過去ログ",
    code: `<font size="2"><a href="log.html">過去ログ倉庫</a>（1〜500）</font><br>
`,
    tip: "書き込みが増えると、古いものを別のページに移して残しました",
    tipTopic: "bbs",
    era: { kind: "siteKind", siteKind: "bbs" },
    category: "navi",
    kinds: ["bbs"],
  },
  {
    label: "値段",
    code: `<font color="#CC0000" size="6"><b>1,980円</b></font><font size="2">（税込）</font> <font color="#CC0000"><b>★送料無料★</b></font><br>
`,
    tip: "赤くて大きな値段と「送料無料」が、ネットショップの顔でした",
    tipTopic: "shop",
    era: { kind: "siteKind", siteKind: "shop" },
    category: "deco",
    kinds: ["shop"],
  },
  {
    label: "特定商取引法",
    code: `<font size="2"><a href="law.html">特定商取引法に基づく表記</a> ｜ <a href="guide.html">ご利用ガイド</a></font><br>
`,
    tip: "通信販売では、販売者の名前や連絡先などを表示することが法律で決められています",
    tipTopic: "shop",
    era: { kind: "siteKind", siteKind: "shop" },
    category: "notice",
    kinds: ["shop"],
  },
  {
    label: "買い物かご",
    code: `<a href="cart.html"><img src="btn-cart.gif" border="0"></a><br>
`,
    tip: "1999年のモールでは、「買い物篭へ」のボタンから注文の画面に進みました",
    tipTopic: "shop",
    era: { kind: "siteKind", siteKind: "shop" },
    category: "navi",
    kinds: ["shop"],
  },
  {
    label: "商品の表",
    code: `<table border="1" cellpadding="6" cellspacing="0">
<tr>
<td><img src="photo-flower.jpg" width="160" height="120"></td>
<td valign="top"><b>季節の花束</b><br><font color="#CC0000"><b>3,980円</b></font><br><img src="icon-cart.gif"> <a href="cart.html">かごに入れる</a></td>
</tr>
</table>
`,
    tip: "写真、商品名、値段、かごに入れるリンクを表の中に並べました",
    tipTopic: "shop",
    era: { kind: "siteKind", siteKind: "shop" },
    category: "layout",
    kinds: ["shop"],
  },
  {
    label: "ポイント",
    code: `<font color="#FF6600"><b>★ポイント10倍★</b></font> <font color="#CC0000" size="2">残りわずか！</font><br>
`,
    tip: "目立つ色の宣伝文句を重ねて、売り場のにぎやかさを出しました",
    tipTopic: "shop",
    era: { kind: "siteKind", siteKind: "shop" },
    category: "deco",
    kinds: ["shop"],
  },
  {
    label: "お支払い方法",
    code: `<b>■お支払い方法</b><br>
<font size="2">代金引換 ／ 銀行振込 ／ クレジットカード（SSL で暗号化して送信します）</font><br>
`,
    tip: "顔の見えない買い物の不安を減らすため、支払い方法を詳しく書きました",
    tipTopic: "shop",
    era: { kind: "siteKind", siteKind: "shop" },
    category: "notice",
    kinds: ["shop"],
  },
  {
    label: "記事の終わり",
    code: `<div align="right"><font size="1">投稿者 はなこ 21:40 ｜ <a href="comment.html">コメント (3)</a> ｜ <a href="tb.html">トラックバック (1)</a></font></div>
`,
    tip: "記事の下には、コメントとトラックバックの件数が並びました",
    tipTopic: "blog",
    era: { kind: "trend", trend: "trackback" },
    category: "social",
    kinds: ["blog"],
  },
  {
    label: "最近の記事",
    code: `<b>最近の記事</b><br>
<font size="2"><a href="1120.html">ホットケーキを焼きました</a><br>
<a href="1115.html">駅前のケーキ屋さん</a></font><br>
`,
    tip: "サイドバーにはプロフィール、カレンダー、最近の記事などが並びました",
    tipTopic: "blog",
    era: { kind: "siteKind", siteKind: "blog" },
    category: "navi",
    kinds: ["blog"],
  },
  {
    label: "カレンダー",
    code: novemberCalendar,
    tip: "記事を書いた日にリンクが付くカレンダーです。曜日は選んだ年に合わせています",
    tipTopic: "blog",
    era: { kind: "siteKind", siteKind: "blog" },
    category: "navi",
    kinds: ["blog"],
  },
  {
    label: "カテゴリとアーカイブ",
    code: `<b>カテゴリー</b><br>
<font size="2"><a href="cat1.html">日記 (42)</a><br><a href="cat2.html">おやつ (15)</a></font><br>
<b>月別アーカイブ</b><br>
<font size="2"><a href="{{year}}11.html">{{year}}年11月 (5)</a><br><a href="{{year}}10.html">{{year}}年10月 (12)</a></font><br>
`,
    tip: "記事はカテゴリと月ごとに自動で整理され、サイドバーから読めました",
    tipTopic: "blog",
    era: { kind: "siteKind", siteKind: "blog" },
    category: "navi",
    kinds: ["blog"],
  },
  {
    label: "RSS",
    code: `<a href="index.rdf"><img src="badge-rss.gif" border="0"></a><br>
`,
    tip: "2004年には RSS を配信するブログサービスが始まり、更新をまとめて読めるようになりました",
    tipTopic: "blog",
    era: { kind: "trend", trend: "rss" },
    category: "social",
    kinds: ["blog"],
  },
  {
    label: "ブログパーツ",
    code: `<table border="1" cellpadding="4" cellspacing="0" width="160">
<tr><td align="center" bgcolor="#F0FFF0"><font size="2">ほげっち（3さい）<br>きょうのきぶん：ごきげん<br>なでた回数：128</font></td></tr>
</table>
`,
    tip: "2006年ごろ、タグを貼るだけで置けるブログパーツが広まりました。このキットでは見た目だけです",
    tipTopic: "blog",
    era: { kind: "trend", trend: "blog-parts" },
    category: "deco",
    kinds: ["blog"],
  },
  {
    label: "バトン",
    code: `<b>■好きな食べ物バトン</b><br>
Q1. 好きな食べ物は？<br>A. ホットケーキ<br>
Q2. 苦手な食べ物は？<br>A. セロリ<br>
次に回す人：ほげさん、はなこさん<br>
`,
    tip: "質問に答えて、次に回す相手を指名するのがバトンです。2006年の調査では、知っている人は約3分の1でした",
    tipTopic: "blog",
    era: { kind: "trend", trend: "baton" },
    category: "social",
    kinds: ["blog"],
  },
  {
    label: "雑文の見出し",
    code: `<b>■{{year}}年7月10日</b><br>
<font size="3"><b>自動改札とのたたかい</b></font><br>
定期券を入れたら、目の前で扉が閉まった。もう一回入れる。閉まる。<br>
三回目、何も考えずに歩いたら、すっと通れた。<br>
`,
    tip: "人気のテキストサイトは、ほぼ毎日更新されていました。日付と小見出しをつけて、短い文章を書き足していきます",
    tipTopic: "textsite",
    era: { kind: "siteKind", siteKind: "textsite" },
    category: "layout",
    kinds: ["textsite"],
  },
  {
    label: "読み物の目次",
    code: `<b>■読み物</b>
<dl>
<dt><a href="yomimono1.html">駅そば全制覇の旅（前編）</a></dt>
<dd><font size="2">駅の立ち食いそばを、端から全部食べてみました</font></dd>
<dt><a href="yomimono2.html">目覚まし時計を5個かけた男の朝</a></dt>
<dd><font size="2">5個でも起きられない。では何個なら起きられるのか</font></dd>
</dl>
`,
    tip: "日記とは別に、長めの「読み物」を目次にまとめました。読み物を集めたランキングもありました",
    tipTopic: "textsite",
    era: { kind: "siteKind", siteKind: "textsite" },
    category: "navi",
    kinds: ["textsite"],
  },
  {
    label: "メールのお返事",
    code: `<b>■メールのお返事</b><br>
<b>&gt; 電車の中で読んで吹き出しました。（Aさん）</b><br>
ありがとうございます。電車の中で読むのは、やめたほうがいいと思います。<br>
`,
    tip: "人気のテキストサイトには、読者からたくさんのメールが届きました",
    tipTopic: "textsite",
    era: { kind: "siteKind", siteKind: "textsite" },
    category: "social",
    kinds: ["textsite"],
  },
  {
    label: "個人ニュース",
    code: `<b>■{{year}}年6月12日</b><br>
・<a href="http://www.example.com/kansatsu/0612.html">駅の伝言板に書かれていた一番長い文章</a>（ほげスペース観察記）<br>
　<font color="#AA3300">最後まで読んだ駅員さんもえらい</font><br>
`,
    tip: "ほかのサイトの更新や話題を、ひとことを添えて紹介する個人ニュースサイトが、2001年にはありました",
    tipTopic: "textsite",
    era: { kind: "trend", trend: "personal-news" },
    category: "social",
    kinds: ["textsite"],
  },
  {
    label: "素材の一覧",
    code: `<table border="0" cellpadding="6" cellspacing="0">
<tr align="center">
<td><img src="icon-home.gif"><br><font size="1">No.01 おうち</font></td>
<td><img src="icon-book.gif"><br><font size="1">No.02 ほん</font></td>
<td><img src="icon-pen.gif"><br><font size="1">No.03 えんぴつ</font></td>
</tr>
</table>
<font size="2">保存するときは、画像の上で右クリックしてね</font><br>
`,
    tip: "素材サイトは、背景やアイコンなど、ページを飾る画像を無料で配っていました",
    tipTopic: "material",
    era: { kind: "siteKind", siteKind: "material" },
    category: "media",
    kinds: ["material"],
  },
  {
    label: "ご利用のお約束",
    code: `<b>★ご利用のお約束</b><br>
<font size="2">・素材はすべて無料です<br>
・直リンクは禁止です。保存して、ご自分のスペースに上げてから使ってね<br>
・使うときは、利用報告板でひとこと教えてもらえるとうれしいです</font><br>
`,
    tip: "素材サイトの画像をそのまま表示させる直リンクは、サーバーが重くなるので、しないものとされていました",
    tipTopic: "material",
    era: { kind: "siteKind", siteKind: "material" },
    category: "notice",
    kinds: ["material"],
  },
  {
    label: "利用報告",
    code: `<table border="1" cellpadding="4" cellspacing="0" width="400">
<tr><td bgcolor="#FFE8F2"><b>借ります♪</b>　<font size="2">みゆ　{{year}}/08/21</font></td></tr>
<tr><td><font size="2">ハートのラインを借ります！ とってもかわいいです。<br>
<font color="#E05090">＞管理人より：ご報告ありがとうございます！</font></font></td></tr>
</table>
`,
    tip: "素材を使う人は「借ります」とひとこと報告しました。人気のサイトには毎日たくさんの報告が届きました",
    tipTopic: "material",
    era: { kind: "siteKind", siteKind: "material" },
    category: "social",
    kinds: ["material"],
  },
  {
    label: "素材ランキング",
    code: `<font size="2">素材サイトのランキングに参加しています。</font><br>
<a href="http://www.example.com/sozai-rank/"><img src="bn-hogespace.gif" border="0"></a><br>
`,
    tip: "素材サイトが約300も登録するランキングがあったと、当時の管理人が振り返っています",
    tipTopic: "material",
    era: { kind: "trend", trend: "ranking" },
    category: "social",
    kinds: ["material"],
  },
  {
    label: "ベータ版のバッジ",
    code: `<font size="6" color="#6BB33A"><b>ほげメモ</b></font> <img src="badge-beta.png" align="top"><br>
`,
    tip: "「ベータ版」の表示も、Web 2.0 風の特徴の一つに数えられました",
    tipTopic: "web20",
    era: { kind: "siteKind", siteKind: "web20" },
    category: "deco",
    kinds: ["web20"],
  },
  {
    label: "大きなキャッチコピー",
    code: `<p align="center" style="font-size: 30px; font-weight: bold; color: #334444;">メモを、みんなで育てよう。</p>
<p align="center" style="font-size: 15px; color: #778888;">ブラウザだけで使える、無料のメモ帳です。</p>
`,
    tip: "大きな文字と、白ややわらかい色の背景、中央寄せのすっきりした配置が、Web 2.0 風のデザインの特徴でした",
    tipTopic: "web20",
    era: { kind: "siteKind", siteKind: "web20" },
    category: "layout",
    kinds: ["web20"],
  },
  {
    label: "つやつやの登録ボタン",
    code: `<p align="center"><a href="signup.html"><img src="btn-glossy.png" border="0" alt="無料で登録する"></a><br>
<a href="signup.html"><b>無料で登録する</b></a>（30 秒で終わります）</p>
`,
    tip: "つやつやした光沢や、ボタンのような見た目も、Web 2.0 風の特徴でした",
    tipTopic: "web20",
    era: { kind: "siteKind", siteKind: "web20" },
    category: "navi",
    kinds: ["web20"],
  },
  {
    label: "線で丸めた角の箱",
    code: `<div>
<b style="display: block; height: 1px; overflow: hidden; margin: 0 5px; background-color: #EAF5FC;"></b>
<b style="display: block; height: 1px; overflow: hidden; margin: 0 3px; background-color: #EAF5FC;"></b>
<b style="display: block; height: 1px; overflow: hidden; margin: 0 2px; background-color: #EAF5FC;"></b>
<b style="display: block; height: 2px; overflow: hidden; margin: 0 1px; background-color: #EAF5FC;"></b>
<div style="background-color: #EAF5FC; padding: 8px 16px;">お知らせ：API を公開しました</div>
<b style="display: block; height: 2px; overflow: hidden; margin: 0 1px; background-color: #EAF5FC;"></b>
<b style="display: block; height: 1px; overflow: hidden; margin: 0 2px; background-color: #EAF5FC;"></b>
<b style="display: block; height: 1px; overflow: hidden; margin: 0 3px; background-color: #EAF5FC;"></b>
<b style="display: block; height: 1px; overflow: hidden; margin: 0 5px; background-color: #EAF5FC;"></b>
</div>
`,
    tip: "このころのブラウザの多くは、CSS で角丸を描けません。この箱は、幅を少しずつ変えた細い線を重ねて、角を丸く見せています",
    tipTopic: "web20",
    era: { kind: "siteKind", siteKind: "web20" },
    category: "deco",
    kinds: ["web20"],
  },
  {
    label: "足あと",
    code: `<b>■足あと</b><br>
<font size="2">{{year}}年06月12日 22:41　さくら<br>
{{year}}年06月12日 22:03　ほげ太<br>
{{year}}年06月12日 19:15　ねこ太郎</font><br>
`,
    tip: "SNS には、自分のページを見に来た人が新しい順に一覧で出る「足あと」の機能がありました",
    tipTopic: "sns",
    era: { kind: "siteKind", siteKind: "sns" },
    category: "social",
    kinds: ["sns"],
  },
  {
    label: "コミュニティの一覧",
    code: `<b>■コミュニティ（3）</b><br>
<font size="2"><a href="community.html">ねこと暮らす</a><br>
ほげほげ市に住んでいる人<br>
駅前の喫茶店が好き</font><br>
`,
    tip: "SNS の自分のページには、プロフィール、日記、友だちの一覧、参加しているコミュニティが並びました",
    tipTopic: "sns",
    era: { kind: "siteKind", siteKind: "sns" },
    category: "navi",
    kinds: ["sns"],
  },
  {
    label: "プロフの質問",
    code: `<font color="#FF3399">名前</font><br>ゆいな<br>
<font color="#FF3399">好きな食べ物</font><br>いちご、からあげ<br>
<font color="#FF3399">一言</font><br>仲良くしてね♪<br>
`,
    tip: "ケータイのプロフは、60問ほどの質問への答えと、個人用の掲示板が並ぶだけのページでした",
    tipTopic: "sns",
    era: { kind: "siteKind", siteKind: "sns" },
    category: "layout",
    kinds: ["sns"],
  },
  {
    label: "招待状",
    code: `<b>■友だちを招待する</b><br>
<font size="2">このSNSは招待制です。招待状を送った人だけが登録できます。</font>
<form>
メールアドレス：<input type="text" name="mail" size="30">
<input type="submit" value="招待状を送る">
</form>
`,
    tip: "国内で大きな SNS も、2010年3月までは、招待状がないと登録できない招待制でした",
    tipTopic: "sns",
    era: { kind: "trend", trend: "sns-invitation" },
    category: "social",
    kinds: ["sns"],
  },
  {
    label: "スレッドの抜き出し",
    code: `<div><font size="2" color="#228822">1：名無しのほげさん：{{year}}/08/12 18:20:11</font><br>
<b><font color="#1A5DAB">駅前の喫茶店のナポリタン、今日から復活してた</font></b></div>
<div><font size="2" color="#228822">2：名無しのほげさん：{{year}}/08/12 18:21:40</font><br>
まじかよ</div>
`,
    tip: "まとめブログは、掲示板のスレッドから書き込みを選んで抜き出し、話題ごとに1つの記事にしました",
    tipTopic: "matome",
    era: { kind: "siteKind", siteKind: "matome" },
    category: "layout",
    kinds: ["matome"],
  },
  {
    label: "記事の中の広告",
    code: `<p align="center"><font size="1" color="#999999">スポンサーリンク</font><br>
<img src="bn-ad.gif"></p>
`,
    tip: "まとめブログの多くは、アフィリエイト広告や検索連動広告で収入を得ていました",
    tipTopic: "matome",
    era: { kind: "siteKind", siteKind: "matome" },
    category: "notice",
    kinds: ["matome"],
  },
  {
    label: "投稿のまとめ",
    code: `<div style="border: 1px solid #E1E8ED; border-radius: 8px; padding: 10px 12px; margin: 10px 0;"><b>さくら</b> <font color="#888888">@sakura_hoge</font><br>
駅前のバス乗り場、傘の行列ができてる</div>
`,
    tip: "2014年に掲示板の人気の板が転載禁止を決めると、まとめサイトは短文投稿サービスの書き込みもまとめるようになりました",
    tipTopic: "matome",
    era: { kind: "trend", trend: "repost-ban" },
    category: "social",
    kinds: ["matome"],
  },
  {
    label: "昔のスレのまとめ",
    code: `<b>【昔のスレ】はじめて自分で作った料理</b><br>
<font size="2">転載禁止より前の、2011年のスレッドからまとめました。</font><br>
`,
    tip: "転載禁止のあと、まとめサイトは昔のスレッドを掘り起こしてまとめることもありました",
    tipTopic: "matome",
    era: { kind: "trend", trend: "repost-ban" },
    category: "navi",
    kinds: ["matome"],
  },

  {
    label: "マーキー",
    code: `<marquee behavior="alternate"><font color="#FF00FF">★☆★ ようこそ ★☆★</font></marquee>
`,
    tip: "IE独自のタグ。流れる文字は個人サイトの華でした",
    tipTopic: "html",
    era: { kind: "feature", feature: "html.marquee" },
    category: "deco",
  },
  {
    label: "点滅文字",
    code: `<blink><font color="#FF0000">重要なお知らせ</font></blink>`,
    tip: "ネスケ独自のタグで、IEでは点滅しませんでした（このキットではどちらでも点滅させています）",
    tipTopic: "html",
    era: { kind: "feature", feature: "html.blink" },
    category: "deco",
  },
  {
    label: "大きな見出し",
    code: `<center><font size="7" color="#FF6600"><b>ほげの部屋</b></font></center>
`,
    tip: "font の size は 1〜7 の 7 段階で、7 がいちばん大きい文字です",
    tipTopic: "html",
    era: { kind: "feature", feature: "html.basic" },
    category: "deco",
  },
  {
    label: "虹色の文字",
    code: `<font color="#FF0000">ほ</font><font color="#FF9900">げ</font><font color="#CCCC00">の</font><font color="#00CC00">部</font><font color="#0066FF">屋</font><font color="#9900CC">へ</font><font color="#FF00CC">ようこそ</font><br>
`,
    tip: "1 文字ずつ font で色を変えると、ソースは長くなりますが目立ちました",
    tipTopic: "html",
    era: { kind: "feature", feature: "html.basic" },
    category: "deco",
  },
  {
    label: "記号の飾り線",
    code: `<center>☆・‥…━━━━━━━━━━━━━━━…‥・☆</center>
`,
    tip: "記号を並べて線の代わりにすると、画像を読み込まずに済みます",
    tipTopic: "text",
    era: { kind: "feature", feature: "html.basic" },
    category: "deco",
  },
  {
    label: "水平線",
    code: `<hr size="4" width="80%" noshade>
`,
    tip: "hr の size、width、noshade で、線の太さや長さ、影の有無を変えられます",
    tipTopic: "html",
    era: { kind: "feature", feature: "html.basic" },
    category: "deco",
  },
  {
    label: "NEW! の印",
    code: `<font size="2">日記を更新しました</font><img src="new.gif"><br>
`,
    tip: "更新した項目の横に、点滅する NEW! の GIF アニメを付けました",
    tipTopic: "image",
    era: { kind: "trend", trend: "gif-animation" },
    category: "deco",
  },
  {
    label: "色付きの見出し帯",
    code: `<table width="100%" cellpadding="3" cellspacing="0">
<tr><td bgcolor="#FFCC99"><b>■ プロフィール</b></td></tr>
</table>
`,
    tip: "表のセルに背景色を付けて、見出しの帯にしました",
    tipTopic: "html",
    era: { kind: "feature", feature: "html.table-bgcolor" },
    category: "deco",
  },
  {
    label: "スタイルの見出し",
    code: `<h2 style="color: #336699; border-bottom: 2px solid #336699;">プロフィール</h2>
`,
    tip: "style 属性を使うと、見出しに色や下線を付けられます",
    tipTopic: "css",
    era: { kind: "feature", feature: "css.basic" },
    category: "deco",
  },
  {
    label: "下線のないリンク",
    code: `<style type="text/css">
a { text-decoration: none; }
a:hover { color: #FF6600; text-decoration: underline; }
</style>
`,
    tip: "リンクの下線を消し、マウスを乗せたときだけ色を変える書き方です",
    tipTopic: "css",
    era: { kind: "feature", feature: "css.basic" },
    category: "deco",
  },
  {
    label: "顔文字",
    code: `<font size="2">今日も見に来てくれてありがとう(^-^)/</font><br>
`,
    tip: "横に倒して見る :-) と違い、正面から見る (^-^) の形が日本の顔文字です",
    tipTopic: "text",
    era: { kind: "feature", feature: "html.basic" },
    category: "deco",
  },
  {
    label: "角丸の箱",
    code: `<div style="border: 1px solid #99CCFF; border-radius: 8px; padding: 8px;">お知らせ：ブログを始めました</div>
`,
    tip: "それまで画像で作っていた丸い角を、CSS だけで描けるようになりました",
    tipTopic: "css",
    era: { kind: "feature", feature: "css.border-radius" },
    category: "deco",
  },
  {
    label: "影付きの箱",
    code: `<div style="border: 1px solid #CCCCCC; box-shadow: 2px 2px 6px #999999; padding: 8px;">今日のひとこと</div>
`,
    tip: "影も画像を重ねて作っていましたが、CSS で付けられるようになりました",
    tipTopic: "css",
    era: { kind: "feature", feature: "css.box-shadow" },
    category: "deco",
  },
  {
    label: "グラデーションのボタン",
    code: `<a href="entry.html" style="padding: 6px 16px; color: #FFFFFF; background: linear-gradient(#66CCFF, #3399CC); border-radius: 4px;">詳しく見る</a>
`,
    tip: "グラデーションも、画像を使わずに CSS で描けるようになりました",
    tipTopic: "css",
    era: { kind: "feature", feature: "css.gradient" },
    category: "deco",
  },
  {
    label: "文字の影",
    code: `<h1 style="color: #FFFFFF; text-shadow: 1px 1px 3px #333333;">ほげの部屋</h1>
`,
    tip: "text-shadow で、白い文字にも影を付けて読みやすくできます",
    tipTopic: "css",
    era: { kind: "feature", feature: "css.text-shadow" },
    category: "deco",
  },

  {
    label: "2カラム表",
    code: `<table border="0" width="600" cellpadding="4" cellspacing="0">
<tr>
<td width="150" bgcolor="#EEEEFF" valign="top">メニュー</td>
<td valign="top">本文</td>
</tr>
</table>
`,
    tip: 'border="0" のテーブルで段組みするのが、2000年代の王道レイアウトです',
    tipTopic: "html",
    era: { kind: "feature", feature: "html.table-bgcolor" },
    category: "layout",
  },
  {
    label: "3カラム表",
    code: `<table border="0" width="760" cellpadding="4" cellspacing="0">
<tr>
<td width="150" bgcolor="#EEEEFF" valign="top">メニュー</td>
<td valign="top">本文</td>
<td width="150" bgcolor="#FFFFEE" valign="top">お知らせ</td>
</tr>
</table>
`,
    tip: "画面が広くなると、左右にメニューとお知らせを置く 3 段組みも使われました",
    tipTopic: "screen",
    era: { kind: "feature", feature: "html.table-bgcolor" },
    category: "layout",
  },
  {
    label: "真ん中の枠",
    code: `<table width="600" align="center" border="0">
<tr><td>
ここに本文
</td></tr>
</table>
`,
    tip: "画面の大きさがまちまちなので、表の幅を決めて真ん中に置くと崩れにくくなりました",
    tipTopic: "screen",
    era: { kind: "feature", feature: "html.basic" },
    category: "layout",
  },
  {
    label: "写真の回り込み",
    code: `<img src="photo-cat.jpg" width="160" height="120" align="left" hspace="8" vspace="4">
うちの猫です。日なたで寝てばかりいます。
<br clear="all">
`,
    tip: "img の align で文章を回り込ませ、br の clear で回り込みを止めます",
    tipTopic: "html",
    era: { kind: "feature", feature: "html.basic" },
    category: "layout",
  },
  {
    label: "CSS の段組み",
    code: `<div style="float: left; width: 180px;">メニュー</div>
<div style="margin-left: 200px;">本文</div>
`,
    tip: "表を使わず、float で段組みする書き方です",
    tipTopic: "css",
    era: { kind: "feature", feature: "css.basic" },
    category: "layout",
  },
  {
    label: "HTML5 の構造",
    code: `<header><h1>ほげの部屋</h1></header>
<nav><a href="index.html">HOME</a> | <a href="diary.html">日記</a></nav>
<footer>Copyright (C) {{year}} ほげ</footer>
`,
    tip: "HTML5 では、header や nav、footer で、ページの部品の役割を書けるようになりました",
    tipTopic: "html",
    era: { kind: "feature", feature: "html5.semantic" },
    category: "layout",
  },

  {
    label: "画像のメニュー",
    code: `<a href="index.html"><img src="btn-home.gif" border="0"></a>
<a href="diary.html"><img src="btn-diary.gif" border="0"></a>
<a href="bbs.html"><img src="btn-bbs.gif" border="0"></a>
<a href="link.html"><img src="btn-link.gif" border="0"></a><br>
`,
    tip: 'a で囲んだ画像には青い枠が付くので、border="0" で消しました',
    tipTopic: "html",
    era: { kind: "feature", feature: "html.basic" },
    category: "navi",
  },
  {
    label: "文字のメニュー",
    code: `[ <a href="index.html">HOME</a> | <a href="profile.html">PROFILE</a> | <a href="diary.html">DIARY</a> | <a href="bbs.html">BBS</a> | <a href="link.html">LINK</a> ]<br>
`,
    tip: "文字だけのメニューなら、画像を読み込む時間がかかりません",
    tipTopic: "line",
    era: { kind: "feature", feature: "html.basic" },
    category: "navi",
  },
  {
    label: "ページの先頭へ",
    code: `<div align="right"><a href="#top">▲ページの先頭へ</a></div>
`,
    tip: "長いページでは、先頭に戻るリンクをところどころに置きました",
    tipTopic: "html",
    era: { kind: "feature", feature: "html.basic" },
    category: "navi",
  },
  {
    label: "戻るボタン",
    code: `<a href="index.html"><img src="btn-back.gif" border="0"></a><br>
`,
    tip: "どのページからもトップに戻れるように、ページの下に戻るボタンを置きました",
    tipTopic: "html",
    era: { kind: "feature", feature: "html.basic" },
    category: "navi",
  },
  {
    label: "ページ内の目次",
    code: `<a href="#prof">■自己紹介</a> <a href="#like">■好きなもの</a><br>
<a name="prof"></a><b>自己紹介</b><br>
`,
    tip: "a の name 属性で印を付けると、# でその場所へ飛べます",
    tipTopic: "html",
    era: { kind: "feature", feature: "html.basic" },
    category: "navi",
  },
  {
    label: "相互リンク",
    code: `<a href="http://www.example.com/~hana/">はなのホームページ</a> <font size="1">（相互リンク）</font><br>
`,
    tip: "サイト同士でリンクを張り合うのが交流の基本でした",
    tipTopic: "culture",
    era: { kind: "trend", trend: "homepage-staples" },
    category: "navi",
  },
  {
    label: "リンク集",
    code: `<b>■リンク集</b>
<ul>
<li><a href="http://www.example.com/~hana/">はなのホームページ</a> - お菓子作りの日記
<li><a href="http://www.example.com/~tsuri/">ほげほげ釣り日記</a> - 週末の釣りの記録
</ul>
`,
    tip: "1999年の雑誌でも、リンク集はホームページに付ける機能の一つに挙げられていました",
    tipTopic: "culture",
    era: { kind: "trend", trend: "homepage-staples" },
    category: "navi",
  },
  {
    label: "リンク用バナー",
    code: `<img src="bn-hoge.gif" width="88" height="31"><br>
<font size="2">リンクのときはこのバナーをお使いください。直リンクはご遠慮ください。</font><br>
`,
    tip: "相互リンクのために、自分のサイトの小さなバナーを配るサイトがありました",
    tipTopic: "culture",
    era: { kind: "trend", trend: "homepage-staples" },
    category: "navi",
  },
  {
    label: "新しいウィンドウで開く",
    code: `<a href="http://www.example.com/" target="_blank">ほげほげ（新しいウィンドウで開きます）</a><br>
`,
    tip: 'target="_blank" を付けると、リンク先を新しいウィンドウで開きます',
    tipTopic: "html",
    era: { kind: "feature", feature: "html.basic" },
    category: "navi",
  },

  {
    label: "カウンター",
    code: `あなたは <!--COUNTER--> 人目のお客様です。`,
    tip: "当時はCGIで数字の画像を出すのが一般的。「更新」すると数字が遅れて出てくるのはそのためです",
    tipTopic: "culture",
    era: { kind: "trend", trend: "counter" },
    category: "social",
  },
  {
    label: "キリ番告知",
    code: `<font color="#FF0000">★キリ番 1000 を踏んだ方は掲示板で報告してね！踏み逃げ禁止！</font><br>
`,
    tip: "「踏み逃げ禁止」までがお約束でした",
    tipTopic: "culture",
    era: { kind: "trend", trend: "kiriban" },
    category: "social",
  },
  {
    label: "キリ番ゲッター",
    code: `<b>■キリ番ゲッター</b><br>
<font size="2">1000 hit ……… はなこさん<br>
2000 hit ……… ほげほげさん</font><br>
`,
    tip: "キリ番を踏んで報告してくれた人の名前を、トップに記録しておく慣習がありました",
    tipTopic: "culture",
    era: { kind: "trend", trend: "kiriban" },
    category: "social",
  },
  {
    label: "ゲストブック",
    code: `<a href="guest.html"><img src="btn-bbs.gif" border="0"></a> <font size="2">来てくれたら足あとを残してね♪</font><br>
`,
    tip: "1999年には、無料スペースに付いてくるゲストブックや、レンタル掲示板を置くのが手軽な方法でした",
    tipTopic: "bbs",
    era: { kind: "trend", trend: "guestbook" },
    category: "social",
  },
  {
    label: "感想は掲示板へ",
    code: `<font size="2">感想は <a href="bbs.html">掲示板</a> か <a href="mailto:hoge@example.com">メール</a> でどうぞ！</font><br>
`,
    tip: "訪れた人とのやりとりは、掲示板とメールが中心でした",
    tipTopic: "culture",
    era: { kind: "trend", trend: "guestbook" },
    category: "social",
  },
  {
    label: "メールのリンク",
    code: `<a href="mailto:hoge@example.com"><img src="mail.gif" border="0"> メールはこちら</a><br>
`,
    tip: "mailto: のリンクを押すと、見ている人のメールソフトが開きます",
    tipTopic: "html",
    era: { kind: "trend", trend: "gif-animation" },
    category: "social",
  },
  {
    label: "感想フォーム",
    code: `<form>
感想をどうぞ：<br>
<textarea name="msg" rows="3" cols="40"></textarea><br>
<input type="submit" value="送る">
</form>
`,
    tip: "フォームの中身を送るには、プロバイダが用意した CGI などが必要でした",
    tipTopic: "tools",
    era: { kind: "trend", trend: "cgi-tools" },
    category: "social",
  },
  {
    label: "アンケート",
    code: `<form>
<b>好きな季節は？</b><br>
<input type="radio" name="q" value="1">春
<input type="radio" name="q" value="2">夏
<input type="radio" name="q" value="3">秋
<input type="radio" name="q" value="4">冬
<input type="submit" value="投票">
</form>
`,
    tip: "1999年ごろには、アンケートやチャットの CGI が配られていて、自分のスペースに置けました",
    tipTopic: "tools",
    era: { kind: "trend", trend: "cgi-tools" },
    category: "social",
  },
  {
    label: "チャットの案内",
    code: `<font size="2">チャットは毎晩 23 時からにぎわっています。<a href="chat.html">チャットルームへ</a></font><br>
`,
    tip: "テレホーダイが使える夜 11 時を過ぎると、チャットや掲示板がにぎわいました",
    tipTopic: "line",
    era: { kind: "trend", trend: "cgi-tools" },
    category: "social",
  },
  {
    label: "日記",
    code: `<b>{{year}}年11月18日（{{weekday}}）</b><br>
今日は駅前のケーキ屋さんに行きました。モンブランがおいしかったです。<br>
`,
    tip: "2000年ごろには、ブラウザや携帯から書ける日記サービスが人気を集めていました。曜日は選んだ年に合わせています",
    tipTopic: "culture",
    era: { kind: "trend", trend: "diary" },
    category: "social",
  },
  {
    label: "ランキング参加",
    code: `<a href="http://www.example.com/rank/"><img src="bn-hogespace.gif" border="0"></a><br>
<font size="2">↑ランキングに参加中。押してもらえるとうれしいです</font><br>
`,
    tip: "2001年に紹介された人気の個人サイトは、どれも読み物のランキングサイトに参加していました",
    tipTopic: "culture",
    era: { kind: "trend", trend: "ranking" },
    category: "social",
  },
  {
    label: "アンテナ",
    code: `<font size="2">更新のチェックには <a href="http://www.example.com/antenna/">アンテナ</a> が便利です</font><br>
`,
    tip: "2002年5月、登録したサイトを巡回して更新を知らせるアンテナのサービスが始まりました",
    tipTopic: "culture",
    era: { kind: "trend", trend: "antenna" },
    category: "social",
  },
  {
    label: "共有のリンク",
    code: `<font size="2">この記事が気に入ったら、SNS で共有してね</font> <a href="http://www.example.com/share">[共有する]</a><br>
`,
    tip: "2009〜2010年ごろ、ボタン一つで記事を広める仕組みが SNS に入りました",
    tipTopic: "culture",
    era: { kind: "trend", trend: "sns-button" },
    category: "social",
  },

  {
    label: "更新履歴",
    code: `<b>■更新履歴</b><br>
<font size="2">{{year}}/11/18 日記を更新<img src="new.gif"></font><br>
`,
    tip: "更新日とNEW!を並べて、常連さんに更新を知らせていました",
    tipTopic: "culture",
    era: { kind: "trend", trend: "homepage-staples" },
    category: "notice",
  },
  {
    label: "推奨環境",
    code: `<font size="1">このサイトは、ネットサーファー／{{resolution}}以上でご覧ください</font>
`,
    tip: "見え方が環境で変わるので、作者が確かめたブラウザと画面の大きさを書き添えました。画面の大きさは選んだ年に合わせています",
    tipTopic: "browser",
    era: { kind: "trend", trend: "recommended-env" },
    category: "notice",
  },
  {
    label: "工事中",
    code: `<center><font color="#FF6600"><b>★ただいま工事中です★</b></font><br>
<font size="2">完成まで、もうしばらくお待ちください</font></center>
`,
    tip: "作りかけのページに「工事中」の看板を出しておくのもお約束です",
    tipTopic: "culture",
    era: { kind: "feature", feature: "html.basic" },
    category: "notice",
  },
  {
    label: "最終更新",
    code: `<div align="right"><font size="1">Last Update {{year}}/11/18</font></div>
`,
    tip: "最後に更新した日を書いておくと、見に来た人が新しい記事があるかを確かめられます",
    tipTopic: "culture",
    era: { kind: "feature", feature: "html.basic" },
    category: "notice",
  },
  {
    label: "著作権表示",
    code: `<center><font size="1">Copyright (C) {{year}} ほげ All Rights Reserved.</font></center>
`,
    tip: "ページの最後に、作った年と作者の名前を書きました",
    tipTopic: "culture",
    era: { kind: "feature", feature: "html.basic" },
    category: "notice",
  },
  {
    label: "無断転載禁止",
    code: `<font size="2" color="#CC0000">当サイトの文章と画像の無断転載を禁止します。</font><br>
`,
    tip: "自分で描いた絵や写真を勝手に使われないように、注意書きを置きました",
    tipTopic: "culture",
    era: { kind: "feature", feature: "html.basic" },
    category: "notice",
  },
  {
    label: "移転のお知らせ",
    code: `<center><b>サイトを移転しました</b><br>
<a href="http://www.example.com/~hoge/">新しいアドレス</a>へ、ブックマークの変更をお願いします。</center>
`,
    tip: "プロバイダを変えるとホームページのアドレスも変わるので、古い場所に案内を残しました",
    tipTopic: "culture",
    era: { kind: "feature", feature: "html.basic" },
    category: "notice",
  },
  {
    label: "閉鎖のお知らせ",
    code: `<center>当サイトは {{year}}年12月31日をもちまして閉鎖いたします。<br>
長い間ありがとうございました。</center>
`,
    tip: "閉じるときは、日付を決めてお知らせを出しました",
    tipTopic: "culture",
    era: { kind: "feature", feature: "html.basic" },
    category: "notice",
  },
  {
    label: "文字コードの指定",
    code: `<meta http-equiv="Content-Type" content="text/html; charset=Shift_JIS">
`,
    tip: "head の中に文字コードを書いておくと、文字化けを防げます",
    tipTopic: "text",
    era: { kind: "feature", feature: "html.basic" },
    category: "notice",
  },
  {
    label: "直リンク禁止",
    code: `<font size="2">素材の直リンクは禁止です。ダウンロードしてからお使いください。</font><br>
`,
    tip: "素材を配るサイトは、サーバーが重くなる直リンクを嫌いました",
    tipTopic: "image",
    era: { kind: "trend", trend: "material-site" },
    category: "notice",
  },
  {
    label: "素材のお礼",
    code: `<font size="2">素材をお借りしています：<a href="http://www.example.com/sozai/">ほげ素材館</a></font><br>
`,
    tip: "背景やアイコンを無料で配る素材サイトが、個人サイトの飾りを支えていました",
    tipTopic: "image",
    era: { kind: "trend", trend: "material-site" },
    category: "notice",
  },

  {
    label: "BGM",
    code: `<bgsound src="bgm.mid" loop="infinite">
<font size="2">♪BGM：オルゴール「ほげのワルツ」</font><br>
`,
    tip: "1999年ごろの個人サイトでは、オルゴール調の BGM が流れることがよくありました",
    tipTopic: "media",
    era: { kind: "trend", trend: "bgm" },
    category: "media",
  },
  {
    label: "GIF アニメの看板",
    code: `<center><img src="anime-welcome.gif"></center>
`,
    tip: "何枚かの絵を 1 つの GIF にまとめると、プラグインなしで動きを付けられます",
    tipTopic: "image",
    era: { kind: "trend", trend: "gif-animation" },
    category: "media",
  },
  {
    label: "動画",
    code: `<video src="movie.mp4" width="320" height="240" controls></video>
`,
    tip: "HTML5 の video で、プラグインなしで動画を置けるようになりました",
    tipTopic: "media",
    era: { kind: "feature", feature: "html5.video" },
    category: "media",
  },

  {
    label: "ケータイ版の入口",
    code: `<a href="i/index.html">ケータイ版はこちら</a><br>
`,
    tip: "1999年2月に i モードが始まり、ケータイ向けの小さなページを別に用意するサイトが出てきました",
    tipTopic: "mobile",
    era: { kind: "trend", trend: "keitai" },
    category: "mobile",
  },
  {
    label: "数字キーのメニュー",
    code: `<a href="diary.html" accesskey="1">1.日記</a><br>
<a href="bbs.html" accesskey="2">2.掲示板</a><br>
`,
    tip: "accesskey を付けると、ケータイの数字のボタンでリンクを選べます",
    tipTopic: "mobile",
    era: { kind: "trend", trend: "keitai" },
    category: "mobile",
  },
  {
    label: "画面の幅に合わせる",
    code: `<meta name="viewport" content="width=device-width, initial-scale=1">
`,
    tip: "スマートフォンで、画面の幅に合わせてページを表示させる指定です",
    tipTopic: "mobile",
    era: { kind: "trend", trend: "smartphone" },
    category: "mobile",
  },
  {
    label: "幅で切り替える CSS",
    code: `<style type="text/css">
@media (max-width: 640px) {
  .side { display: none; }
}
</style>
`,
    tip: "画面の幅で CSS を切り替え、狭い画面では 1 列にする作り方です",
    tipTopic: "css",
    era: { kind: "feature", feature: "css.media-queries" },
    category: "mobile",
  },
  {
    label: "スマホ版との切り替え",
    code: `<font size="2">表示：<a href="sp/index.html">スマートフォン</a> ｜ パソコン</font><br>
`,
    tip: "2012年、スマートフォン向けのページの作り方として、1 つのページを幅で切り替える方法が勧められました",
    tipTopic: "mobile",
    era: { kind: "trend", trend: "smartphone" },
    category: "mobile",
  },
];

/** どの年でも試せる、時代チェッカーの反応を見るためのパーツ */
export const MODERN_CODE_PART: PartBase = {
  label: "2020年代のコード（違反例）",
  code: `<section style="display:flex; gap:16px; border-radius:12px; box-shadow:0 2px 8px rgba(0,0,0,.2)">
  <article>モダンなカード</article>
</section>
<style>
  .card > p { transition: all .3s; }
  @media (max-width: 600px) { body { font-size: 14px; } }
</style>
`,
  tip: "時代チェッカーがどう反応するか試してみてください。各警告の「解説」から背景を読めます",
  tipTopic: "css",
};
