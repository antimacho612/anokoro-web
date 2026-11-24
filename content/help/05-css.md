---
id: css
title: CSSの制約
years: [1995, 2015]
sources:
  - title: W3C HTML 3.2 Reference Specification（1997年1月14日勧告）
    url: https://www.w3.org/TR/2018/SPSD-html32-20180315/
  - title: Håkon Wium Lie, Bert Bos「Cascading Style Sheets」第20章 CSSの歴史
    url: https://www.w3.org/Style/LieBos2e/history/
  - title: W3C CSS1（1996年12月17日勧告）
    url: https://www.w3.org/TR/REC-CSS1-961217
  - title: W3C CSS2（1998年5月12日勧告）
    url: https://www.w3.org/TR/1998/REC-CSS2-19980512/
  - title: W3C HTML 4.0 Specification（1997年12月18日勧告）要素の一覧
    url: https://www.w3.org/TR/REC-html40-971218/index/elements.html
  - title: 日本マイクロソフト（2011年4月25日）IE9日本語版の提供開始
    url: https://news.microsoft.com/ja-jp/2011/04/25/110425-internet-explorer-9/
  - title: "IEBlog（2010年3月19日）The CSS Corner: About CSS Corners"
    url: https://learn.microsoft.com/en-us/archive/blogs/ie/the-css-corner-about-css-corners
  - title: W3C CSS WG Blog（2012年2月19日）ベンダープレフィックスをめぐる議論
    url: https://www.w3.org/blog/CSS/2012/02/19/resolutions-24
  - title: Twitter 開発者ブログ（2011年8月19日）Bootstrapの公開
    url: https://cybercemetery.unt.edu/oilspill/20130105045109mp_/https://dev.twitter.com/blog/bootstrap-twitter
  - title: W3C Media Queries（2012年6月19日勧告）
    url: https://www.w3.org/TR/2012/REC-css3-mediaqueries-20120619/
  - title: "Can I use: CSS Flexible Box Layout Module"
    url: https://caniuse.com/flexbox
  - title: 窓の杜（2013年11月8日）Windows 7向けIE11
    url: https://forest.watch.impress.co.jp/docs/news/20131108_622701.html
---

<!-- years: 1995-1997 -->

#### タグで飾る

スタイルシートが使えるようになる前は、見た目もHTMLのタグで指定しました。文字の大きさや色は `font`、中央寄せは `center`、太字は `b` です。`center` はもともとNetscapeが独自に入れたタグでした。

- <!-- years: 1997- --> 1997年1月のHTML 3.2で、`font` と `center` が正式に標準に入りました

<!-- years: 1995-2000 -->

#### 壁紙と文字色

ページ全体の見た目は `body` タグの属性で決めました。`background` に画像を指定するとタイル状に敷き詰められた「壁紙」になり、`bgcolor` で背景色、`text` で文字の色、`link` と `vlink` で未訪問と訪問済みのリンクの色を変えます。柄の目立つ壁紙の上では文字が読みにくくなるので、文字色との組み合わせには気をつかいました。

<!-- years: 1996-1997 -->

#### スタイルシートの始まり

1996年8月に出たIE 3は、CSSに対応した最初の市販のブラウザでした。文字の色や背景、フォントの指定はおおむね効きましたが、余白や枠線などの箱の扱いはまだ多くが動きませんでした。

- <!-- years: 1997- --> 1996年12月、CSS1がW3Cの勧告になりました
- <!-- years: 1997- --> 1997年のNetscape 4もCSSに対応しましたが、使えないプロパティが多く、中途半端なものでした。Netscapeは独自のスタイルシート「JSSS」も推していました

<!-- years: 1998-2000 -->

#### CSS2とIE4

1998年5月、絶対配置や固定配置を含むCSS2が勧告されました。一方でIE4もCSS1を完全には満たしておらず、1998年11月には標準化を求める団体がIEのCSSの問題点を公表しています。1997年12月のHTML 4.0で `font` や `center` が非推奨になり、見た目はスタイルシートへ、という流れははっきりしていましたが、現実のブラウザはまだ追いついていませんでした。

<!-- years: 1998-2008 -->

#### CSSはあったが、思い通りには動かない

CSS2 は1998年に勧告されていましたが、ブラウザの実装はバグだらけで、書いた通りに表示される保証はありませんでした。そのため、文字の色や大きさ、リンクの装飾くらいにとどめて、レイアウトはテーブルで組むのが安全策でした。

<!-- years: 2001-2012 -->

#### IE6でできなかったこと

- 子セレクタ `>`、属性セレクタ `[ ]`、`:first-child` などが使えない
- `:hover` は `a` タグにしか効かない。メニューのロールオーバーはJavaScriptで画像を差し替えていました
- `max-width`、`min-height`、`position:fixed` が効かない
- PNGの半透明が表示できない（独自の filter で無理やり対応する裏技がありました）

<!-- years: 1997-2012 -->

#### 角丸と影は画像で

`border-radius` も `box-shadow` もないので、角丸のボックスは四隅に角の画像を置いたテーブルで作り、影は影入りの画像を用意していました。

- <!-- years: 2011- --> IEが `border-radius` に対応したのは、2011年4月に日本語版が出たIE9からです。古いIEを使う人が残っている間は、画像の角丸も手放せませんでした

<!-- years: 2000-2006 -->

#### IEだけの楽しみ

IEでは `scrollbar-face-color` などの独自プロパティでスクロールバーの色を変えられ、個人サイトでパステルカラーのスクロールバーが流行しました。

<!-- years: 2010-2013 -->

#### ベンダープレフィックス

`border-radius` は、Firefoxが2004年から `-moz-border-radius`、Safariが `-webkit-border-radius` という、ブラウザごとの接頭辞（ベンダープレフィックス）付きで先に実装していました。仕様が固まってきた2010年3月、OperaとIE9のプレビュー版が接頭辞なしで実装します。同じ指定を接頭辞を変えて何行も書くのが、このころのCSSの風景でした。

- <!-- years: 2012- --> 2012年2月、スマートフォンでWebKitのブラウザがほとんどを占めた結果、ほかのブラウザにも `-webkit-` 付きのプロパティを実装せよという圧力がかかっていることが、W3CのCSSの作業部会で議題になりました

<!-- years: 2011- -->

#### CSSフレームワーク

2011年8月、CSSフレームワーク「Bootstrap」が公開されました。用意されたクラス名を付けるだけで、グリッドの段組みやボタン、フォームの見た目が整います。

- <!-- years: 2012- --> 2012年6月、画面の幅などで指定を切り替えるメディアクエリがW3Cの勧告になりました

<!-- years: 2013- -->

#### flexで段組み

`display: flex` を使うと、要素を横に並べたり、中央にそろえたりが数行で書けます。2012年ごろから一部のブラウザで使えるようになり、2013年11月にWindows 7向けにも出たIE11で、主なブラウザがそろいました。`float` やテーブルで段組みを組む工夫は、ここから少しずつ要らなくなっていきます。
