---
id: html
title: HTMLの書き方
years: [1995, 2015]
sources:
  - title: RFC 1866 Hypertext Markup Language - 2.0（1995年11月）
    url: https://www.rfc-editor.org/rfc/rfc1866.html
  - title: RFC 1942 HTML Tables（1996年5月）
    url: https://www.rfc-editor.org/rfc/rfc1942.html
  - title: INTERNET Watch（1995年12月）IE 2.0日本語版のβ
    url: https://internet.watch.impress.co.jp/www/search/article/9512/1103.htm
  - title: PC Watch（1996年8月16日）IE 3.0日本語版の公開
    url: https://pc.watch.impress.co.jp/docs/article/960816/ie30w.htm
  - title: W3C HTML 3.2 Reference Specification（1997年1月14日勧告）
    url: https://www.w3.org/TR/2018/SPSD-html32-20180315/
  - title: W3C HTML 4.0 Specification（1997年12月18日勧告）要素の一覧
    url: https://www.w3.org/TR/REC-html40-971218/index/elements.html
  - title: INTERNET Watch（1997年12月19日）HTML 4.0の勧告
    url: https://internet.watch.impress.co.jp/www/article/971219/html40.htm
  - title: W3C XHTML 1.0（2000年1月26日勧告）
    url: https://www.w3.org/TR/2000/REC-xhtml1-20000126/
  - title: ミツエーリンクス（2004年10月22日）「Web標準」の書籍の日本語版
    url: https://mitsue.co.jp/knowledge/column/20041022a.html
  - title: INTERNET Watch（2008年1月24日）HTML 5の最初の草案
    url: https://internet.watch.impress.co.jp/cda/news/2008/01/24/18222.html
  - title: W3C News（2009年7月2日）XHTML 2作業部会の終了
    url: https://www.w3.org/news/2009/xhtml-2-working-group-expected-to-stop-work-end-of-2009-w3c-to-increase-resources-on-html-5
  - title: Google Japan Blog（2009年7月27日）HTML5のコミュニティの発足
    url: https://blog.google/intl/ja-jp/company-news/technology/2009_07_html5/
  - title: W3C News（2011年1月18日）HTML5のロゴ
    url: https://www.w3.org/news/2011/w3c-introduces-an-html5-logo
  - title: gihyo.jp（2012年8月14日）HTML5のカンファレンス
    url: https://gihyo.jp/news/info/2012/08/1401
  - title: W3C プレスリリース（2014年10月28日）HTML5の勧告
    url: https://www.w3.org/ja/press-releases/2014/html5-rec/
---

<!-- years: 1995-1996 -->

#### 表のないHTML 2.0

1995年11月、HTMLの最初のまとまった仕様「HTML 2.0」がRFC 1866として出ました。ここには表（`table`）が入っていません。見出し、段落、リスト、画像、リンクで組み立てる、とても素朴なページが基本でした。

- 表の対応はブラウザによって差があり、IEの日本語版1.0は表を表示できませんでした。1995年12月のIE 2.0日本語版のβでようやく表に対応しています
- <!-- years: 1996- --> 1996年5月、表の仕様は実験的なRFC 1942として別に出ました。画面を分ける `frameset` もNetscape 2.0が始めたもので、IEは1996年8月の3.0で対応しました

<!-- years: 1997-1998 -->

#### 独自タグが標準になる

1997年1月、W3Cが「HTML 3.2」を勧告しました。すでに広く使われていた表、Javaアプレット、画像への文字の回り込み、`font`、`center` を標準に取り込んだものです。`center` はNetscapeが先に入れた独自タグでした。ブラウザ各社が勝手に増やしたタグを、後から仕様が追いかけた形です。

- <!-- years: 1998- --> 1997年12月に勧告された「HTML 4.0」では、`font` や `center` が「非推奨」になり、見た目はスタイルシートで指定する方針が示されました。`blink` と `marquee` は最後まで標準に入っていません。ただ各社の関心はDHTMLに移っていて、作り手の混乱は続くと報じられました

<!-- years: 1999-2008 -->

#### HTML 4.01 とテーブルレイアウト

1999年に勧告されたHTML 4.01が当時の基準です。本来は文書の構造を表す言語ですが、実際には見た目を作る道具として使われていました。代表が「テーブルレイアウト」で、`table` の枠線を消してメニューと本文を横に並べます。CSSでの段組みがブラウザごとにバラバラだったため、確実に同じ見た目にできる方法として広く使われました。

<!-- years: 1996-2005 -->

#### spacer.gif

余白を作るために、1×1ピクセルの透明GIFを `width` と `height` で引き伸ばして置くテクニックがありました。これが通称「spacer.gif」です。

<!-- years: 1999- -->

#### font、center、marquee、blink

`font` や `center` は HTML 4.01 で「非推奨」とされていましたが、ホームページ作成ソフトも個人サイトも普通に使っていました。`marquee`（流れる文字）はIEの独自タグ、`blink`（点滅）はネスケの独自タグです。どちらも本来は片方のブラウザでしか動きませんでした。

<!-- years: 1996-2006 -->

#### フレーム

`frameset` で画面を分割し、左にメニュー、右に本文を出す作りも人気でした。メニューを毎ページ書かなくて済む反面、ブックマークしにくい、検索から来るとメニューが出ないといった欠点がありました。

<!-- years: 2000-2008 -->

#### XHTMLとWeb標準

2000年1月、HTMLをXMLの決まりで書き直した「XHTML 1.0」が勧告されました。タグは小文字で書き、`<br />` のように空の要素も閉じる、属性の値は必ず引用符で囲む、といった厳しめの書き方です。

- <!-- years: 2004- --> 2004年10月ごろ、「Web標準」を説く代表的な洋書の日本語版が出ました。表と `font` で見た目を作るのをやめ、構造はXHTML、見た目はCSSに分ける作り方が、日本語で本格的に紹介されました

<!-- years: -2007 -->

#### HTML5 はまだ先の話

`section` や `article`、`video` といったタグは、HTML5の草案が公開された2008年以降のものです。当時のブラウザは知らないタグを無視して中身だけ表示しました。

<!-- years: 2008-2013 -->

#### HTML5がやってくる

2008年1月、HTML 5の最初の草案が公開されました。`section`、`nav`、`footer`、`figure` など、文書の構造を表す新しい要素が加わっています。

- <!-- years: 2009- --> 2009年7月、W3CはXHTML 2の作業を年末で終え、HTML 5に人を回すと決めました。同じ月、日本の開発者がHTML5を語り合うコミュニティも発足しています
- <!-- years: 2011- --> 2011年1月、W3CがHTML5のロゴを公開しました。CSSやSVGなど新しいWeb技術全体の目印として使えるものです
- <!-- years: 2012- --> 2012年9月、国内のHTML5の開発者が1,000人規模のカンファレンスを開き、申し込み開始から約30時間で満員になりました

<!-- years: 2014- -->

#### HTML5の勧告

2014年10月28日、HTML5がW3Cの勧告になりました。プラグインなしの動画と音声、`canvas` での描画、SVGとMathMLの埋め込み、ルビなどが、正式に標準の仲間入りをしています。
