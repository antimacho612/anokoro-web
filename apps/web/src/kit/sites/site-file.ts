import {
  MAX_EXPANDED_BYTES,
  fileNameFor,
  parseFileBytes,
  toFileText,
  type DecodeResult,
} from "@anokoro/share-codec";
import type { LocalSite } from "@anokoro/site-store";
import { toShared } from "../../site/site-model.ts";

/** 読み込んだファイルを検証する。大きすぎるファイルは中身を読まずに断る */
export async function readSiteFile(file: Blob): Promise<DecodeResult> {
  if (file.size > MAX_EXPANDED_BYTES) return { ok: false, error: "too-large" };
  return parseFileBytes(new Uint8Array(await file.arrayBuffer()));
}

export interface SiteFile {
  name: string;
  blob: Blob;
}

export function siteFile(site: LocalSite): SiteFile {
  return {
    name: fileNameFor(site.name),
    blob: new Blob([toFileText(toShared(site))], { type: "application/json" }),
  };
}

export function downloadFile({ name, blob }: SiteFile): void {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = name;
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 0);
}
