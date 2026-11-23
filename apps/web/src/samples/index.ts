import { bbsSample } from "./bbs.ts";
import { blogSample } from "./blog.ts";
import { corporateSample } from "./corporate.ts";
import { personalSample } from "./personal.ts";
import { portalSample } from "./portal.ts";
import { shopSample } from "./shop.ts";
import type { SampleSite } from "./types.ts";

/** 見本サイト。サイトの種類ごとに 1 つ */
export const SAMPLE_SITES: readonly SampleSite[] = [
  personalSample,
  corporateSample,
  portalSample,
  bbsSample,
  shopSample,
  blogSample,
];

export function findSample(id: string): SampleSite | undefined {
  return SAMPLE_SITES.find((s) => s.id === id);
}

export type { SampleSite };
