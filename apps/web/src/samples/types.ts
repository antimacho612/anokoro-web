import type { SiteKindId, Year } from "@anokoro/era-data";
import type { SiteCategoryId, SitePage } from "@anokoro/shared";

/** 運営が作る架空の見本サイト。サーバーを使わずアプリに同梱する */
export interface SampleSite {
  id: string;
  name: string;
  year: Year;
  genre: SiteKindId;
  category: SiteCategoryId;
  description: string;
  pages: readonly SitePage[];
}
