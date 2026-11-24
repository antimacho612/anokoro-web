import type { SiteKindId, YearRange } from "@anokoro/era-data";
import type { SiteCategoryId, SitePage } from "@anokoro/shared";

/** 運営が作る架空のサイト。閲覧画面で見本として見せ、新しいサイトのテンプレートにもする */
export interface SampleSite {
  id: string;
  name: string;
  /** 作った年から、その種類のテンプレートとして使う最後の年まで */
  years: YearRange;
  genre: SiteKindId;
  category: SiteCategoryId;
  description: string;
  loadPages: () => Promise<readonly SitePage[]>;
}
