import type { SiteKindId, Year } from "@anokoro/era-data";
import type { SiteCategoryId } from "@anokoro/shared";

export interface LocalPage {
  /** index.html など */
  path: string;
  /** 書いたままのソース */
  html: string;
  updatedAt: number;
}

export interface LocalSite {
  /** ULID */
  id: string;
  name: string;
  year: Year;
  genre: SiteKindId;
  category: SiteCategoryId;
  pages: LocalPage[];
  /** ローカルカウンター */
  counter: number;
  createdAt: number;
  updatedAt: number;
  /** 最後にファイルへ書き出した日時 */
  lastExportedAt?: number;
}
