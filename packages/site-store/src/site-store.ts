import { openDB, type DBSchema, type IDBPDatabase } from "idb";
import { localSiteSchema } from "./schema.ts";
import type { LocalSite } from "./types.ts";

export const DB_NAME = "anokoro";
const DB_VERSION = 1;
const SITES = "sites";

interface AnokoroDb extends DBSchema {
  sites: { key: string; value: LocalSite };
}

export interface SiteStore {
  /** 更新日時の新しい順。読めないレコードは飛ばす */
  list(): Promise<LocalSite[]>;
  get(id: string): Promise<LocalSite | undefined>;
  put(site: LocalSite): Promise<void>;
  delete(id: string): Promise<void>;
  close(): void;
}

function parse(record: unknown): LocalSite | undefined {
  const result = localSiteSchema.safeParse(record);
  return result.success ? result.data : undefined;
}

function wrap(db: IDBPDatabase<AnokoroDb>): SiteStore {
  return {
    async list() {
      const records: unknown[] = await db.getAll(SITES);
      return records
        .map(parse)
        .filter((site) => site !== undefined)
        .sort((a, b) => b.updatedAt - a.updatedAt);
    },
    async get(id) {
      return parse(await db.get(SITES, id));
    },
    async put(site) {
      await db.put(SITES, site);
    },
    async delete(id) {
      await db.delete(SITES, id);
    },
    close() {
      db.close();
    },
  };
}

/** IndexedDB を開く。使えない環境では例外を投げる */
export async function openSiteStore(name: string = DB_NAME): Promise<SiteStore> {
  const db = await openDB<AnokoroDb>(name, DB_VERSION, {
    upgrade(database) {
      database.createObjectStore(SITES, { keyPath: "id" });
    },
  });
  return wrap(db);
}

/** 永続化を依頼する。断られても、使えなくても false を返して続ける */
export async function requestPersistence(
  storage: Pick<StorageManager, "persist"> | undefined = globalThis.navigator?.storage,
): Promise<boolean> {
  try {
    return (await storage?.persist()) ?? false;
  } catch {
    return false;
  }
}

/** IndexedDB が使えない環境で使う、ページを閉じると消える保存先 */
export function createMemorySiteStore(): SiteStore {
  const sites = new Map<string, LocalSite>();
  return {
    async list() {
      return [...sites.values()].sort((a, b) => b.updatedAt - a.updatedAt);
    },
    async get(id) {
      return sites.get(id);
    },
    async put(site) {
      sites.set(site.id, structuredClone(site));
    },
    async delete(id) {
      sites.delete(id);
    },
    close() {},
  };
}
