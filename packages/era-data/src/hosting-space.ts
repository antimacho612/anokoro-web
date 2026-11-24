import { inRange, type Source, type Year, type YearRange } from "./years.ts";

const MB = 1024 * 1024;

/** 無料ホームページの容量の相場。年ごとの大手の無料会員の容量に合わせる */
export interface HostingSpacePeriod {
  years: YearRange;
  bytes: number;
  sources: readonly [Source, ...Source[]];
}

export const HOSTING_SPACE_PERIODS: readonly HostingSpacePeriod[] = [
  {
    years: [1995, 1998],
    bytes: 2 * MB,
    sources: [
      {
        title: "IIJ（1996年11月5日）個人向け定額接続とホームページ開設スペース",
        url: "https://www-w.iw.iij.ad.jp/news/pressrelease/1996/pdf/iij4u.pdf",
      },
      {
        title: "INTERNET Watch（1997年6月16日）無料ホームページの日本語版",
        url: "https://internet.watch.impress.co.jp/www/article/970616/geocity.htm",
      },
      {
        title: "Wayback Machine: 大手無料ホームページの FAQ（1998年1月24日）",
        url: "https://web.archive.org/web/19980124021236/http://www.geocities.co.jp:80/join/geoplus/plusfaq.html",
      },
    ],
  },
  {
    years: [1999, 2003],
    bytes: 12 * MB,
    sources: [
      {
        title: "INTERNET Watch（1999年10月21日）12MB の無料ホームページ",
        url: "https://internet.watch.impress.co.jp/www/article/1999/1021/trij.htm",
      },
      {
        title: "INTERNET Watch（2000年3月27日）無料ホームページの比較",
        url: "https://internet.watch.impress.co.jp/www/article/2000/0327/special.htm",
      },
    ],
  },
  {
    years: [2004, 2015],
    bytes: 50 * MB,
    sources: [
      {
        title: "INTERNET Watch（2004年10月5日）無料会員の容量を50MBに",
        url: "https://internet.watch.impress.co.jp/cda/news/2004/10/05/4867.html",
      },
      {
        title: "INTERNET Watch（2008年7月30日）無料50MBと有料の容量",
        url: "https://internet.watch.impress.co.jp/cda/news/2008/07/30/20428.html",
      },
    ],
  },
];

export function hostingSpaceForYear(year: Year): HostingSpacePeriod {
  const period = HOSTING_SPACE_PERIODS.find((p) => inRange(year, p.years));
  if (!period) throw new Error(`${year} 年の容量の相場がありません`);
  return period;
}

export function formatBytes(bytes: number): string {
  if (bytes >= MB) return `${trimZero((bytes / MB).toFixed(1))}MB`;
  return `${(bytes / 1024).toFixed(1)}KB`;
}

function trimZero(value: string): string {
  return value.endsWith(".0") ? value.slice(0, -2) : value;
}
