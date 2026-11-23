import {
  categorySchema,
  genreSchema,
  pagePathSchema,
  siteNameSchema,
  yearSchema,
} from "@anokoro/shared";
import { z } from "zod";
import { siteIdSchema } from "./site-id.ts";
import type { LocalSite } from "./types.ts";

const timestamp = z.number().int().nonnegative();

export const localSiteSchema = z.object({
  id: siteIdSchema,
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
