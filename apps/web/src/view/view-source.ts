import {
  DECODE_ERROR_MESSAGES,
  decodeSharedSite,
  payloadFromHash,
  type SharedSite,
} from "@anokoro/share-codec";
import { findSample, type SampleSite } from "../samples/index.ts";

/** 閲覧画面で見るサイト。見本サイトか、URL で共有されたサイト */
export type ViewSource =
  | { kind: "sample"; sample: SampleSite; site: SharedSite }
  | { kind: "shared"; site: SharedSite }
  | { kind: "error"; message: string };

export const SAMPLE_PARAM = "sample";

export function sampleToShared(sample: SampleSite): SharedSite {
  return {
    kind: "anokoro-site",
    v: 1,
    name: sample.name,
    year: sample.year,
    genre: sample.genre,
    category: sample.category,
    pages: sample.pages.map(({ path, html }) => ({ path, html })),
  };
}

/** URL から、閲覧画面で見るサイトを取り出す。共有されたサイトは悪意ある入力として検証する */
export async function loadViewSource(search: string, hash: string): Promise<ViewSource> {
  const sampleId = new URLSearchParams(search).get(SAMPLE_PARAM);
  if (sampleId !== null) {
    const sample = findSample(sampleId);
    if (!sample) return { kind: "error", message: "その見本サイトは見つかりません。" };
    return { kind: "sample", sample, site: sampleToShared(sample) };
  }
  const payload = payloadFromHash(hash);
  if (payload === undefined) {
    return { kind: "error", message: "表示するサイトが指定されていません。" };
  }
  const result = await decodeSharedSite(payload);
  if (!result.ok) return { kind: "error", message: DECODE_ERROR_MESSAGES[result.error] };
  return { kind: "shared", site: result.site };
}

export function sampleUrl(base: string, id: string): string {
  return `${base}view/?${SAMPLE_PARAM}=${encodeURIComponent(id)}`;
}
