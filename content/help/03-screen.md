---
id: screen
title: 画面と色
years: [1995, 2015]
sources:
  - title: GVU WWW User Survey（1996年10月）画面の解像度
    url: https://sites.cc.gatech.edu/gvu/user_surveys/survey-10-1996/graphs/use/Monitor_Resolution.html
  - title: GVU WWW User Survey（1998年4月）画面の解像度
    url: https://sites.cc.gatech.edu/gvu/user_surveys/survey-1998-04/graphs/technology/q90.htm
  - title: PC Watch（1997年3月13日）読者アンケートの結果
    url: https://pc.watch.impress.co.jp/docs/article/970313/result.htm
  - title: W3C www-htmlメーリングリスト（1996年9月）Netscapeが使う216色
    url: https://lists.w3.org/Archives/Public/www-html/1996Sep/0047.html
  - title: INTERNET Watch（1999年10月18日）ディスプレイ解像度の調査
    url: https://internet.watch.impress.co.jp/www/article/1999/1018/display.htm
  - title: INTERNET Watch（2003年8月8日）1024×768以上が過半数に
    url: https://internet.watch.impress.co.jp/cda/news/2003/08/08/90.html
  - title: StatCounter Global Stats 日本のパソコンの解像度（年別）
    url: https://gs.statcounter.com/chart.php?device=Desktop&device_hidden=desktop&statType_hidden=resolution&region_hidden=JP&granularity=yearly&statType=Screen%20Resolution&region=Japan&fromInt=2012&toInt=2012&fromYear=2012&toYear=2012&csv=1
  - title: Apple（2010年6月7日）iPhone 4の発表
    url: https://www.apple.com/jp/newsroom/2010/06/07Apple-Presents-iPhone-4/
  - title: A List Apart（2010年5月25日）Responsive Web Design
    url: https://alistapart.com/article/responsive-web-design/
  - title: Google ウェブマスター向け公式ブログ（2012年6月6日）スマートフォン向けサイトの作り方
    url: https://developers.google.com/search/blog/2012/06/recommendations-for-building-smartphone?hl=ja
  - title: StatCounter Global Stats 日本のモバイルの解像度（年別）
    url: https://gs.statcounter.com/chart.php?device=Mobile&device_hidden=mobile&statType_hidden=resolution&region_hidden=JP&granularity=yearly&statType=Screen%20Resolution&region=Japan&fromInt=2015&toInt=2015&fromYear=2015&toYear=2015&csv=1
  - title: StatCounter Global Stats 日本の端末の種類の比率（年別）
    url: https://gs.statcounter.com/chart.php?device_hidden=desktop%2Bmobile%2Btablet%2Bconsole&statType_hidden=comparison&region_hidden=JP&granularity=yearly&statType=Desktop%20vs%20Mobile%20vs%20Tablet%20vs%20Console&region=Japan&fromInt=2009&toInt=2015&fromYear=2009&toYear=2015&csv=1
  - title: INTERNET Watch（2014年7月10日）企業サイトのスマートフォン対応率
    url: https://internet.watch.impress.co.jp/docs/news/657253.html
  - title: Google ウェブマスター向け公式ブログ（2015年4月21日）モバイルフレンドリーアップデート
    url: https://developers.google.com/search/blog/2015/04/rolling-out-mobile-friendly-update?hl=ja
  - title: Google Developers Blog（2010年5月19日）Google Font API
    url: https://developers.googleblog.com/2010/05/introducing-google-font-api-google-font.html
  - title: GIGAZINE（2011年7月27日）日本語Webフォントサービスの開始
    url: https://gigazine.net/news/20110727_webfont_fontplus/
  - title: JAGAT（2012年2月29日）書体メーカーのWebフォントサービス
    url: https://jagat.or.jp/past_archives/content/view/5558.html
---

<!-- years: 1996-1998 -->

#### 640×480と256色

画面の広さは人によって大きく違いました。英語圏を中心にした海外の調査では、1996年10月の時点で640×480と800×600がそれぞれ2割弱で並んでいます。640×480の画面で横幅いっぱいに作ったページは、広い画面では左に寄って見えました。

- <!-- years: 1997- --> 1997年春の国内のパソコン誌の読者調査では、ノートパソコンの液晶の27%が640×480以下でした。表示できる色が256色以下の人も、CRTで15%、液晶で27%いました
- <!-- years: 1998- --> 1998年4月の海外の調査では、800×600が28.4%で最も多くなり、640×480は16.6%に減っています

<!-- years: 1999-2009 -->

#### 800×600から1024×768へ

このころのCRTモニターは800×600や1024×768が中心でした。そのため「このサイトは800×600以上で見ると綺麗に見えます」という表記がよく見られます。横幅を760px前後に収めて、左右中央にテーブルを置くレイアウトが定番でした。

- 1999年10月の海外の調査では、閲覧者の54.2%が800×600でした
- <!-- years: 2003- --> 2003年8月の同じ調査で、1024×768以上が57.8%になり、800×600以下を逆転しました。推奨環境も「1024×768以上」に変わっていきます
- <!-- years: 2009- --> StatCounterの集計では、2009年の日本のパソコンでも1024×768が26.5%で首位でした

<!-- years: -2003 -->

#### Webセーフカラー

256色表示の環境もまだ残っていたため、どのOSでもディザ（点々模様）にならない216色の「Webセーフカラー」を使うのが無難とされていました。Netscapeなどが使っていた配色で、`#FF6699` や `#0066CC` のように、各色が 00/33/66/99/CC/FF だけで構成された色です。

<!-- years: -2010 -->

#### フォント

Windowsでは「ＭＳ Ｐゴシック」、Macでは「Osaka」が標準で、日本語のWebフォントは事実上使えませんでした。凝った見出しは、文字を画像にして作るのが普通でした。

<!-- years: 2010- -->

#### 横長の画面と高精細

ノートパソコンの画面は横長になっていきます。StatCounterの集計では、2010年の日本のパソコンは1280×800が首位で、1366×768が伸びてきていました。

- <!-- years: 2012- --> 2012年には1366×768が20.4%で首位になりました
- <!-- years: 2015- --> 2015年は1920×1080（23.9%）と1366×768（23.2%）が並んでいます
- 2010年6月24日に発売されたiPhone 4は、3.5インチに960×640（326ppi）の画素を詰め込んだ高精細な画面を載せました

<!-- years: 2010- -->

#### スマホに合わせる

2010年5月、画面の幅に合わせて段組みを変える「レスポンシブWebデザイン」が提唱されました。伸び縮みするグリッドと画像、画面の幅で切り替えるメディアクエリの3つが柱です。

- <!-- years: 2012- --> 2012年6月、Googleはスマートフォン向けサイトの作り方として、レスポンシブWebデザインを勧めました
- <!-- years: 2013- --> 2012年の日本のスマートフォンの画面は、CSSの幅で320×480のものが43.1%を占めていました（StatCounter調べ）
- <!-- years: 2014- --> 2013年には、日本のページビューの14.1%がスマートフォンなどのモバイルからになりました（StatCounter調べ）。2014年5月の調査でも、スマートフォンに対応した企業サイトは27.3%にとどまります
- <!-- years: 2015- --> 2015年4月21日、Googleはモバイルの検索で、スマートフォンで読みやすいページの順位を上げ始めました

<!-- years: 2010- -->

#### Webフォント

2010年5月、Googleがフォントを配信するサービスを始めました。ただし使えるのは欧文のフォントだけでした。

- <!-- years: 2011- --> 2011年7月、ページで使う文字だけを抜き出して軽くする仕組みで、日本語のWebフォントのサービスが始まりました
- <!-- years: 2012- --> 2012年2月には、大手の書体メーカーも日本語のWebフォントのサービスを始めました
