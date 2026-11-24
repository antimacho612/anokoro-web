import type { SharedSite } from "@anokoro/share-codec";
import { createUlid, parseSiteId, type SiteId, type SiteStore } from "@anokoro/site-store";
import { saveLastOpened } from "../../../features/site-workspace/index.ts";
import { type StorageAccess } from "../../../shared/lib/index.ts";
import { fromShared, homePath } from "../../../entities/site/index.ts";

export interface ImportToKitDeps {
  open: () => Promise<SiteStore>;
  storage: StorageAccess;
  now?: number;
  newId?: SiteId;
}

/**
 * 閲覧中のサイトを、自分のマイコンピュータに新しいサイトとしてコピーする。
 * 作成キットを開くと、そのサイトが開くようにしておく
 */
export async function importToKit(
  site: SharedSite,
  { open, storage, now = Date.now(), newId = parseSiteId(createUlid(now)) }: ImportToKitDeps,
): Promise<void> {
  const store = await open();
  try {
    const local = fromShared(site, newId, now);
    await store.put(local);
    saveLastOpened(storage, { siteId: local.id, path: homePath(local) });
  } finally {
    store.close();
  }
}
