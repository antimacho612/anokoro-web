import type { Source, Year } from "./years.ts";

/**
 * 作り方や飾りの流行。機能年表と違い、使えた年ではなく、よく使われた年を持つ。
 * 年は根拠の記事が示す時期に合わせる。廃れた年は根拠があるときだけ持つ。
 */
export interface TrendEntry {
  label: string;
  from: Year;
  /** この年を最後に廃れた */
  until?: Year;
  sources: readonly [Source, ...Source[]];
}

export const TRENDS = {
  "gif-animation": {
    label: "GIF アニメ",
    from: 1996,
    sources: [
      {
        title: "INTERNET Watch（1996年1月30日）GIFアニメーション",
        url: "https://internet.watch.impress.co.jp/www/search/article/9601/3004.htm",
      },
    ],
  },
  counter: {
    label: "アクセスカウンター",
    from: 1997,
    sources: [
      {
        title: "INTERNET Watch（1997年12月18日）広告付きのアクセスカウンター",
        url: "https://internet.watch.impress.co.jp/www/article/971218/startp.htm",
      },
      {
        title: "インターネットマガジン（1998年8月号）プロバイダのホームページサービス比較",
        url: "https://web.archive.org/web/20120308050827/http://i.impressrd.jp/files/images/bn/pdf/im199808-244-homepage.pdf",
      },
    ],
  },
  "flash-intro": {
    label: "Flash のイントロ",
    from: 1997,
    until: 2011,
    sources: [
      {
        title: "INTERNET Watch（1997年5月14日）Flash 2J の発表",
        url: "https://internet.watch.impress.co.jp/www/article/970514/fl2.htm",
      },
      {
        title: "INTERNET Watch（2011年11月10日）モバイル向け Flash Player の開発終了",
        url: "https://internet.watch.impress.co.jp/docs/news/489824.html",
      },
    ],
  },
  kiriban: {
    label: "キリ番",
    from: 1998,
    sources: [
      {
        title: "ITmedia（2016年12月8日）キリ番の思い出",
        url: "https://www.itmedia.co.jp/pcuser/spv/1612/08/news014.html",
      },
      {
        title: "インターネットマガジン（1998年8月号）プロバイダのホームページサービス比較",
        url: "https://web.archive.org/web/20120308050827/http://i.impressrd.jp/files/images/bn/pdf/im199808-244-homepage.pdf",
      },
    ],
  },
  guestbook: {
    label: "掲示板とゲストブック",
    from: 1998,
    sources: [
      {
        title: "インターネットマガジン（1998年8月号）プロバイダのホームページサービス比較",
        url: "https://web.archive.org/web/20120308050827/http://i.impressrd.jp/files/images/bn/pdf/im199808-244-homepage.pdf",
      },
      {
        title: "INTERNET Watch（1999年6月21日）ホームページに掲示板を設置する方法",
        url: "https://internet.watch.impress.co.jp/www/article/1999/0621/special.htm",
      },
    ],
  },
  "homepage-staples": {
    label: "日記やリンク集のそろったホームページ",
    from: 1999,
    sources: [
      {
        title: "インターネットマガジン（1999年9月号）コミュニティ型サービス",
        url: "https://web.archive.org/web/20120307043401/http://i.impressrd.jp/files/images/bn/pdf/im199909-196-community.pdf",
      },
    ],
  },
  "cgi-tools": {
    label: "チャットやアンケートの CGI",
    from: 1999,
    sources: [
      {
        title: "INTERNET Watch（1999年8月9日）チャットを設置する方法",
        url: "https://internet.watch.impress.co.jp/www/article/1999/0809/special.htm",
      },
      {
        title: "INTERNET Watch（1999年12月20日）配布 CGI の 2000 年問題",
        url: "https://internet.watch.impress.co.jp/www/article/1999/1220/cgiy2k.htm",
      },
    ],
  },
  bgm: {
    label: "BGM",
    from: 1999,
    until: 2009,
    sources: [
      {
        title: "ITmedia（2016年5月13日）1999年ごろの個人サイト",
        url: "https://www.itmedia.co.jp/pcuser/articles/1605/13/news012.html",
      },
      {
        title: "W3C: HTML5 草案（2010年10月19日）使ってはならない要素",
        url: "https://www.w3.org/TR/2010/WD-html5-20101019/obsolete.html",
      },
    ],
  },
  keitai: {
    label: "ケータイ向けのページ",
    from: 1999,
    sources: [
      {
        title: "INTERNET Watch（1999年1月25日）i モードの発表",
        url: "https://internet.watch.impress.co.jp/www/article/1999/0125/docomo.htm",
      },
    ],
  },
  diary: {
    label: "日記",
    from: 2000,
    sources: [
      {
        title: "INTERNET Watch（2000年4月3日）日記サービスの特集",
        url: "https://internet.watch.impress.co.jp/www/article/2000/0403/special.htm",
      },
    ],
  },
  "recommended-env": {
    label: "推奨環境の表記",
    from: 2000,
    sources: [
      {
        title: "Wayback Machine: 航空会社の「ご利用環境」（2003年12月26日）",
        url: "https://web.archive.org/web/20031226184619/http://www.ana.co.jp/common/user_env.html",
      },
      {
        title: "INTERNET Watch（1999年10月18日）画面解像度の調査",
        url: "https://internet.watch.impress.co.jp/www/article/1999/1018/display.htm",
      },
    ],
  },
  "material-site": {
    label: "素材サイト",
    from: 2000,
    until: 2008,
    sources: [
      {
        title: "ねとらぼ（2019年9月21日）素材屋の元管理人の回顧",
        url: "https://nlab.itmedia.co.jp/cont/articles/3295709/",
      },
    ],
  },
  ranking: {
    label: "ランキングへの参加",
    from: 2001,
    sources: [
      {
        title: "INTERNET Watch（2001年7月30日）人気の個人サイト",
        url: "https://internet.watch.impress.co.jp/www/article/2001/0730/megahit.htm",
      },
    ],
  },
  "personal-news": {
    label: "個人ニュースサイト",
    from: 2001,
    sources: [
      {
        title: "ねとらぼ（2017年5月3日）個人ニュースサイトとFlashの時代の回顧",
        url: "https://nlab.itmedia.co.jp/cont/articles/3266637/",
      },
    ],
  },
  antenna: {
    label: "アンテナ",
    from: 2002,
    sources: [
      {
        title: "ITmedia（2004年4月19日）更新を知らせるアンテナ",
        url: "https://www.itmedia.co.jp/news/articles/0404/19/news013.html",
      },
    ],
  },
  trackback: {
    label: "トラックバック",
    from: 2003,
    until: 2010,
    sources: [
      {
        title: "INTERNET Watch（2003年12月2日）国内のブログサービスの開始",
        url: "https://internet.watch.impress.co.jp/cda/news/2003/12/02/1331.html",
      },
      {
        title: "ITmedia（2011年11月25日）トラックバックのない新しいブログ",
        url: "https://www.itmedia.co.jp/news/article/1111/25/1111125058/",
      },
    ],
  },
  rss: {
    label: "RSS",
    from: 2004,
    sources: [
      {
        title: "INTERNET Watch（2004年3月9日）RSS を配信するブログサービス",
        url: "https://internet.watch.impress.co.jp/cda/news/2004/03/09/2377.html",
      },
    ],
  },
  "privacy-policy": {
    label: "プライバシーポリシー",
    from: 2005,
    sources: [
      {
        title: "総務省: 平成18年版 情報通信白書 個人情報保護法への対応",
        url: "https://www.soumu.go.jp/johotsusintokei/whitepaper/ja/h18/html/i1d15000.html",
      },
    ],
  },
  web2: {
    label: "Web 2.0 のころの作風",
    from: 2005,
    sources: [
      {
        title: "総務省: 令和元年版 情報通信白書 第1部第1章第1節",
        url: "https://www.soumu.go.jp/johotsusintokei/whitepaper/ja/r01/pdf/n1100000.pdf",
      },
    ],
  },
  "blog-parts": {
    label: "ブログパーツ",
    from: 2006,
    sources: [
      {
        title: "ITmedia（2006年5月12日）ブログパーツの広まり",
        url: "https://www.itmedia.co.jp/enterprise/spv/0605/12/news040_2.html",
      },
    ],
  },
  baton: {
    label: "バトン",
    from: 2006,
    sources: [
      {
        title: "ITmedia（2006年9月17日）ブログのバトン",
        url: "https://www.itmedia.co.jp/enterprise/articles/0609/17/news001.html",
      },
    ],
  },
  retina: {
    label: "高精細な画面",
    from: 2010,
    sources: [
      {
        title: "Apple（2010年6月7日）iPhone 4の発表",
        url: "https://www.apple.com/jp/newsroom/2010/06/07Apple-Presents-iPhone-4/",
      },
    ],
  },
  "sns-button": {
    label: "SNS で広める",
    from: 2010,
    sources: [
      {
        title: "総務省: 令和元年版 情報通信白書 第1部第1章第1節",
        url: "https://www.soumu.go.jp/johotsusintokei/whitepaper/ja/r01/pdf/n1100000.pdf",
      },
    ],
  },
  "sns-official": {
    label: "企業の SNS 公式アカウント",
    from: 2011,
    sources: [
      {
        title: "ITmedia（2011年3月18日）震災と公式アカウント",
        url: "https://www.itmedia.co.jp/news/article/1103/18/1110318090/",
      },
      {
        title: "INTERNET Watch（2011年4月27日）企業の Facebook ページ",
        url: "https://internet.watch.impress.co.jp/docs/special/442486.html",
      },
    ],
  },
  smartphone: {
    label: "スマートフォン向けのページ",
    from: 2012,
    sources: [
      {
        title:
          "Google ウェブマスター向け公式ブログ（2012年6月6日）スマートフォン向けサイトの作り方",
        url: "https://developers.google.com/search/blog/2012/06/recommendations-for-building-smartphone?hl=ja",
      },
    ],
  },
} as const satisfies Record<string, TrendEntry>;

export type TrendId = keyof typeof TRENDS;
