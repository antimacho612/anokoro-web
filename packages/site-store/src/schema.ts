import {
  categorySchema,
  genreSchema,
  pagePathSchema,
  siteNameSchema,
  yearSchema,
} from "@anokoro/shared";
import { z } from "zod";
import type { LocalSite } from "./types.ts";

const timestamp = z.number().int().nonnegative();

/** 自分で保存したデータでも、古い版や壊れたレコードを読み飛ばすために検証する */
export const localSiteSchema = z.object({
  id: z.string().min(1),
  name: siteNameSchema,
  year: yearSchema,
  genre: genreSchema,
  category: categorySchema,
  pages: z.array(z.object({ path: pagePathSchema, html: z.string(), updatedAt: timestamp })).min(1),
  counter: z.number().int().nonnegative(),
  createdAt: timestamp,
  updatedAt: timestamp,
  lastExportedAt: timestamp.optional(),
}) satisfies z.ZodType<LocalSite, unknown>;
