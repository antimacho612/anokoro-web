---
id: text
title: 文字コードと文字化け
years: [1995, 2015]
sources:
  - title: RFC 1468 Japanese Character Encoding for Internet Messages（1993年6月）
    url: https://www.rfc-editor.org/rfc/rfc1468.html
  - title: IANA Character Sets
    url: https://www.iana.org/assignments/character-sets/character-sets.xhtml
  - title: INTERNET Watch（1996年2月）Netscape Navigator 2.0正式版の2バイト文字
    url: https://internet.watch.impress.co.jp/www/search/article/9602/0503.htm
  - title: RFC 2070 Internationalization of the Hypertext Markup Language（1997年1月）
    url: https://www.rfc-editor.org/rfc/rfc2070.html
  - title: INTERNET Watch（1998年5月25日）文字化けの原因
    url: https://internet.watch.impress.co.jp/www/article/980525/mojibake.htm
  - title: ITmedia（2008年11月21日）iPhone 3Gの絵文字対応
    url: https://www.itmedia.co.jp/mobile/articles/0811/21/news151.html
  - title: BCN（2011年12月29日）au版iPhone 4Sの絵文字
    url: https://www.bcnretail.com/market/detail/111229_21737.html
  - title: Google 公式ブログ（2010年1月28日）Unicode nearing 50% of the web
    url: https://googleblog.blogspot.com/2010/01/unicode-nearing-50-of-web.html
  - title: Unicode Consortium（2010年10月11日）Unicode 6.0の公開
    url: https://www.unicode.org/announcements/pr-6.0.html
  - title: INTERNET Watch（2012年2月6日）UTF-8が6割を超える
    url: https://internet.watch.impress.co.jp/docs/news/510091.html
---

<!-- years: 1995-2000 -->

#### JIS、シフトJIS、EUC

日本語をコンピューターで表す方法（文字コード）は、1つではありませんでした。メールやニュースでは、7ビットで送れる「JIS」（ISO-2022-JP）が標準で、日本のネットの草分けのころから使われています。Webのページでは「シフトJIS」や「EUC-JP」も使われました。EUC-JPはUNIXの世界で標準化されたものです。

- <!-- years: 1996- --> 1996年2月に出たNetscape 2.0の正式版でも、日本語のような2バイト文字の扱いにはバグが残っていました
- <!-- years: 1997- --> 1997年1月のHTMLの国際化の仕様では、文字コードはサーバーが送る情報を最優先し、`meta` タグの指定はあくまで補助とされました
- <!-- years: 1998- --> 1998年5月の記事は、半角カナはJISに含まれないのでメールで化ける、丸数字はWindowsとMacで別の記号になる、と文字化けの原因を解説しています

<!-- years: -2009 -->

#### Shift_JIS が標準

日本語のページはShift_JISで書くのが一般的で、ほかにEUC-JPやJISも使われていました。`meta` タグで文字コードを指定し忘れると、ブラウザが自動判別に失敗して「文字化け」することがよくありました。ブラウザの「表示 → エンコード」メニューで手動で切り替えるのは、当時のネットユーザーの基本技能です。

<!-- years: -2009 -->

#### 機種依存文字

①や㈱、ローマ数字のⅠⅡなどはWindowsでしか正しく表示されず、Macでは別の文字に化けました。「機種依存文字は使わないように」は、掲示板の注意書きの定番でした。

<!-- years: -2009 -->

#### 半角カナ

半角カタカナはメールやシステムによって化けることがあり、ネットでは使わないのが無難とされていました。

<!-- years: 2008- -->

#### 絵文字とスマホ

ケータイの絵文字は、会社ごとに形も文字コードも違いました。2008年11月、iPhone 3Gがソフトウェアの更新で絵文字に対応します。ただし使えるのはiPhone用のアドレスのメールとSMSだけで、ほかの会社のケータイとやりとりすると、絵文字は正しく表示されませんでした。

- <!-- years: 2011- --> 2011年12月、別の会社から出たiPhone 4Sでは、その会社のメールで絵文字が事実上使えず、2012年1月末までに対応すると発表されました

<!-- years: 2010- -->

#### Unicodeが半分に

世界中の文字を1つの表にまとめた「Unicode」が広まっていきます。2010年1月、Googleの集計で、Web上のページのうちUnicodeで書かれたものが50%に迫りました。日本語のページでShift_JISがどれだけ残っていたかは分かりませんが、世界の流れははっきりしていました。

- 2010年10月に公開されたUnicode 6.0には、日本のケータイで使われてきた絵文字などの記号が数百収録されました
- <!-- years: 2012- --> 2012年1月には、Googleの集計でUTF-8が6割を超えました
