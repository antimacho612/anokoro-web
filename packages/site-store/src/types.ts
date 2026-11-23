import type { SiteKindId, Year } from "@anokoro/era-data";
import type { SiteCategoryId } from "@anokoro/shared";
import type { SiteId } from "./site-id.ts";

export interface LocalPage {
  /** index.html など */
  path: string;
  /** 書いたままのソース */
  html: string;
  updatedAt: number;
}

export interface LocalSite {
  id: SiteId;
  name: string;
  year: Year;
  genre: SiteKindId;
  category: SiteCategoryId;
  pages: LocalPage[];
  counter: number;
  createdAt: number;
  updatedAt: number;
  /** 最後にファイルへ書き出した日時 */
  lastExportedAt?: number;
}
