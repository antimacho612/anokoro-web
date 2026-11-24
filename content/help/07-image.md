---
id: image
title: 画像と素材
years: [1995, 2015]
sources:
  - title: Unisysの声明（GIFとLZWの特許について、League for Programming Freedomによる転載）
    url: https://groups.csail.mit.edu/mac/projects/lpf/Patents/Gif/unisys.html
  - title: INTERNET Watch（1996年1月30日）GIFアニメーション
    url: https://internet.watch.impress.co.jp/www/search/article/9601/3004.htm
  - title: W3C PNG Specification Version 1.0（1996年10月1日勧告）
    url: https://www.w3.org/TR/REC-png-961001
  - title: "@IT（2009年6月8日）CSSスプライトで表示を速くする"
    url: https://atmarkit.itmedia.co.jp/fwcr/design/benkyo/htmltuning03/01.html
  - title: Apple（2010年6月7日）iPhone 4の発表
    url: https://www.apple.com/jp/newsroom/2010/06/07Apple-Presents-iPhone-4/
  - title: "@IT（2013年8月29日）Retinaディスプレイと画像"
    url: https://atmarkit.itmedia.co.jp/ait/articles/1308/29/news004.html
  - title: IEBlog（2010年3月18日）IE9のSVG対応
    url: https://learn.microsoft.com/en-us/archive/blogs/ie/svg-in-ie9-roadmap
  - title: 日本マイクロソフト（2011年4月25日）IE9日本語版の提供開始
    url: https://news.microsoft.com/ja-jp/2011/04/25/110425-internet-explorer-9/
---

#### GIFとJPEG

イラストやボタンは256色までのGIF、写真はJPEGという使い分けが基本です。GIFは色数を減らすほどファイルが小さくなるので、少しでも軽くしようと、ボタンやロゴの色を限界まで削る人もいました。

<!-- years: 1995-1998 -->

#### GIFの特許をめぐる最初の騒ぎ

GIFの圧縮方式（LZW）には米Unisysの特許があり、パソコン通信の会社への通知をきっかけに、GIFが使えなくなるのではと騒ぎになりました。Unisysは、営利のソフトウェアにはライセンスが必要だが、非営利のソフトやフリーウェア、ほとんどのWebサイトには必要ない、と説明しています。

<!-- years: 1996- -->

#### GIFアニメ

GIFは1つのファイルに複数のコマを持てます。1996年1月、Netscape 2.0のβ版で、JavaもShockwaveも使わずにGIFのコマが順に動くことが紹介され、作るためのソフトもWindowsとMacにありました。やがて「NEW!」の点滅や工事中の看板など、GIFアニメが大量に作られていきます。

<!-- years: 1997- -->

#### PNG

1996年10月、新しい画像の形式「PNG」がW3Cの勧告になりました。GIFを置き換えることが最初の目的で、特許に縛られない形式として作られています。フルカラーも、半透明も扱えます。

- <!-- years: 2006- --> ただしIE6はPNGの半透明をそのままでは表示できず、本格的に使えるようになったのは2006年のIE7からでした

<!-- years: 1999- -->

#### GIF特許騒動

1999年、Unisysが、Webサイト側からも特許料を徴収するライセンス形態を発表して騒ぎになりました。これがPNGの普及を後押しします。

- <!-- years: 2003- --> LZWの特許は、米国で2003年6月20日に失効しました
- <!-- years: 2004- --> 日本では2004年6月20日に失効しています

<!-- years: 1997- -->

#### 素材サイトの文化

壁紙、アイコン、ライン、ボタンなどを無料配布する「素材サイト」がたくさんありました。利用規約には「お持ち帰りOK、加工OK、リンクは任意」「直リンク禁止」といった項目が並び、素材を使ったら素材サイトのバナーを貼るのが礼儀でした。

<!-- years: 2009- -->

#### CSSスプライト

ボタンやアイコンなどの小さな画像をたくさん使うと、そのたびに読み込みが発生してページが重くなります。そこで、小さな画像を1枚にまとめておき、CSSの `background-position` で必要な部分だけを見せる「CSSスプライト」が、表示を速くする手法として国内でも解説されるようになりました。

<!-- years: 2010- -->

#### Retinaと SVG

2010年6月のiPhone 4は、それまでの4倍の画素を持つ高精細な画面を載せました。CSSの1ピクセルを2×2の画素で描くため、普通の画像はぼやけて見えます。

- <!-- years: 2011- --> 拡大しても崩れないベクター形式の画像「SVG」は、2011年4月に日本語版が出たIE9で、ようやくIEでも表示できるようになりました
- <!-- years: 2013- --> 縦横2倍の大きさの画像を用意して半分の大きさで表示する対策が、高精細な画面向けの作法として解説されるようになりました
