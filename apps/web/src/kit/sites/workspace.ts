import type { SiteKindId, Year } from "@anokoro/era-data";
import type { SharedSite } from "@anokoro/share-codec";
import type { SiteCategoryId, SitePage } from "@anokoro/shared";
import {
  createMemorySiteStore,
  createUlid,
  parseSiteId,
  type SiteId,
  type LocalSite,
  type SiteStore,
} from "@anokoro/site-store";
import { createStore, type StoreApi } from "zustand";
import {
  currentEntry,
  goBack,
  goForward,
  pushHistory,
  renameInHistory,
  startHistory,
  type BrowserHistory,
} from "../../site/browser-history.ts";
import type { LinkTarget } from "../../site/link-target.ts";
import {
  INDEX_PAGE,
  addPage,
  createSite,
  deletePage,
  findPage,
  fromShared,
  homePath,
  overwriteWithShared,
  renamePage,
  updatePageHtml,
} from "../../site/site-model.ts";
import type { KitState, KitStore } from "../store.ts";

/** 保存先。IndexedDB が使えなければ、ページを閉じると消えるメモリに置く */
export type SaveTarget = "indexeddb" | "memory";

export interface WorkspaceState {
  phase: "loading" | "ready";
  target: SaveTarget;
  /** 作った順 */
  sites: LocalSite[];
  currentId: SiteId | null;
  dirty: boolean;
}

export interface LastOpened {
  siteId: SiteId;
  path: string;
}

export interface SiteInfo {
  name: string;
  year: Year;
  genre: SiteKindId;
  category: SiteCategoryId;
}

export interface NewSite extends SiteInfo {
  pages: readonly SitePage[];
}

export type ImportMode = { kind: "new" } | { kind: "overwrite"; id: SiteId };

export interface WorkspaceDeps {
  kit: KitStore;
  now?: () => number;
  newId?: () => SiteId;
  /** 入力が止まってから保存するまでの時間 */
  saveDelayMs?: number;
  rememberLastOpened?: (lastOpened: LastOpened) => void;
}

export interface InitOptions {
  open: () => Promise<SiteStore>;
  /** URL で年が指定されていれば、開いたサイトの年をそれに合わせる */
  urlYear?: Year;
  lastOpened?: LastOpened;
  /** サイトが 1 つもないとき、作成キットに出ている中身から作るサイトの名前など */
  firstSite: Omit<SiteInfo, "year">;
}

export const SAVE_DELAY_MS = 1000;

const byCreatedAt = (a: LocalSite, b: LocalSite): number =>
  a.createdAt - b.createdAt || a.id.localeCompare(b.id);

/**
 * ブラウザ内のサイトと、作成キットで開いているページをつなぐ。
 * メモ帳の入力、年、カウンターの変化を見て、開いているサイトに自動で保存する
 */
export class Workspace {
  readonly state: StoreApi<WorkspaceState>;
  readonly #kit: KitStore;
  readonly #now: () => number;
  readonly #newId: () => SiteId;
  readonly #saveDelayMs: number;
  readonly #remember: (lastOpened: LastOpened) => void;
  #store: SiteStore = createMemorySiteStore();
  #timer: ReturnType<typeof setTimeout> | null = null;
  #writing: Promise<void> = Promise.resolve();
  #switching = false;

  constructor({
    kit,
    now = Date.now,
    newId = () => parseSiteId(createUlid()),
    saveDelayMs = SAVE_DELAY_MS,
    rememberLastOpened = () => {},
  }: WorkspaceDeps) {
    this.#kit = kit;
    this.#now = now;
    this.#newId = newId;
    this.#saveDelayMs = saveDelayMs;
    this.#remember = rememberLastOpened;
    this.state = createStore<WorkspaceState>()(() => ({
      phase: "loading",
      target: "indexeddb",
      sites: [],
      currentId: null,
      dirty: false,
    }));
    kit.subscribe((next, prev) => this.#onKitChange(next, prev));
  }

  async init({ open, urlYear, lastOpened, firstSite }: InitOptions): Promise<void> {
    let target: SaveTarget = "indexeddb";
    try {
      this.#store = await open();
    } catch {
      this.#store = createMemorySiteStore();
      target = "memory";
    }
    const saved = await this.#store.list().catch(() => []);
    if (saved.length === 0) {
      await this.#adoptKit(firstSite, target);
      return;
    }
    const remembered = saved.find((s) => s.id === lastOpened?.siteId);
    const site = remembered ?? saved[0];
    if (!site) return;
    this.state.setState({ phase: "ready", target, sites: [...saved].sort(byCreatedAt) });
    const path =
      remembered && lastOpened && findPage(site, lastOpened.path) ? lastOpened.path : undefined;
    this.openSite(site.id, path);
    if (urlYear !== undefined) this.#kit.getState().setYear(urlYear);
  }

  /** 初めて使うときは、作成キットに出ている中身をそのまま最初のサイトにする */
  async #adoptKit(info: Omit<SiteInfo, "year">, target: SaveTarget): Promise<void> {
    const { year, source, counter } = this.#kit.getState();
    const site = createSite({
      ...info,
      id: this.#newId(),
      year,
      counter,
      pages: [{ path: INDEX_PAGE, html: source }],
      now: this.#now(),
    });
    this.state.setState({ phase: "ready", target, sites: [site], currentId: site.id });
    this.#kit.setState({
      pagePath: INDEX_PAGE,
      history: startHistory({ kind: "page", path: INDEX_PAGE }),
      notFoundUrl: null,
    });
    this.#remember({ siteId: site.id, path: INDEX_PAGE });
    await this.#save(this.#mergeKit(site));
  }

  current(): LocalSite | undefined {
    const { sites, currentId } = this.state.getState();
    return sites.find((s) => s.id === currentId);
  }

  #onKitChange(next: KitState, prev: KitState): void {
    if (this.#switching || this.state.getState().phase !== "ready") return;
    const changed =
      next.source !== prev.source || next.year !== prev.year || next.counter !== prev.counter;
    if (!changed) return;
    const site = this.current();
    if (!site) return;
    if (next.source !== prev.source) {
      const saved = findPage(site, next.pagePath)?.html;
      this.state.setState({ dirty: saved !== next.source });
    }
    this.#schedule();
  }

  #schedule(): void {
    if (this.#timer !== null) clearTimeout(this.#timer);
    this.#timer = setTimeout(() => {
      this.#timer = null;
      void this.flush();
    }, this.#saveDelayMs);
  }

  /** 作成キットの中身を、開いているサイトに書き込んだもの */
  #mergeKit(site: LocalSite): LocalSite {
    const { pagePath, source, year, counter } = this.#kit.getState();
    const withHtml = updatePageHtml(site, pagePath, source, this.#now());
    if (withHtml.year === year && withHtml.counter === counter) return withHtml;
    return { ...withHtml, year, counter, updatedAt: this.#now() };
  }

  #replace(site: LocalSite): void {
    this.state.setState(({ sites }) => ({
      sites: sites.some((s) => s.id === site.id)
        ? sites.map((s) => (s.id === site.id ? site : s))
        : [...sites, site],
    }));
  }

  #write(site: LocalSite): void {
    this.#writing = this.#writing.then(() => this.#store.put(site)).catch(() => undefined);
  }

  /** いま開いているサイトを保存する。メモ帳の「上書き保存」でも使う */
  flush(): Promise<void> {
    if (this.#timer !== null) {
      clearTimeout(this.#timer);
      this.#timer = null;
    }
    const site = this.current();
    if (site) {
      const next = this.#mergeKit(site);
      if (next !== site) {
        this.#replace(next);
        this.#write(next);
      }
    }
    this.state.setState({ dirty: false });
    return this.#writing;
  }

  #save(site: LocalSite): Promise<void> {
    this.#replace(site);
    this.#write(site);
    return this.#writing;
  }

  openSite(id: SiteId, path?: string): void {
    void this.flush();
    const site = this.state.getState().sites.find((s) => s.id === id);
    if (!site) return;
    const target = path ?? homePath(site);
    const page = findPage(site, target);
    if (!page) return;
    this.#switching = true;
    try {
      this.state.setState({ currentId: id, dirty: false });
      const kit = this.#kit.getState();
      kit.setYear(site.year);
      this.#kit.setState({ counter: site.counter, lastKiriban: null });
      kit.loadPage({
        path: target,
        html: page.html,
        history: startHistory({ kind: "page", path: target }),
      });
    } finally {
      this.#switching = false;
    }
    this.#remember({ siteId: id, path: target });
  }

  #loadPage(path: string, history: BrowserHistory): boolean {
    const site = this.current();
    const page = site && findPage(site, path);
    if (!site || !page) return false;
    this.#switching = true;
    try {
      this.#kit.getState().loadPage({ path, html: page.html, history });
    } finally {
      this.#switching = false;
    }
    this.state.setState({ dirty: false });
    this.#remember({ siteId: site.id, path });
    return true;
  }

  /** 開いているサイトの別のページをメモ帳で開き、疑似ブラウザの履歴に積む */
  openPage(path: string): void {
    void this.flush();
    this.#loadPage(path, pushHistory(this.#kit.getState().history, { kind: "page", path }));
  }

  followLink(target: LinkTarget): void {
    switch (target.kind) {
      case "page":
        this.openPage(target.path);
        return;
      case "missing":
      case "external": {
        void this.flush();
        const entry = { kind: "missing", url: target.url } as const;
        this.#kit
          .getState()
          .showNotFound(target.url, pushHistory(this.#kit.getState().history, entry));
        return;
      }
      case "hash":
      case "mailto":
      case "none":
        return;
      default: {
        const unreachable: never = target;
        void unreachable;
      }
    }
  }

  #moveInHistory(history: BrowserHistory): void {
    const entry = currentEntry(history);
    if (!entry || history === this.#kit.getState().history) return;
    void this.flush();
    if (entry.kind === "page") {
      if (!this.#loadPage(entry.path, history)) {
        this.#kit.getState().showNotFound(entry.path, history);
      }
    } else {
      this.#kit.getState().showNotFound(entry.url, history);
    }
  }

  back(): void {
    this.#moveInHistory(goBack(this.#kit.getState().history));
  }

  forward(): void {
    this.#moveInHistory(goForward(this.#kit.getState().history));
  }

  home(): void {
    const site = this.current();
    if (site) this.openPage(homePath(site));
  }

  async createSite(input: NewSite): Promise<LocalSite> {
    await this.flush();
    const site = createSite({ ...input, id: this.#newId(), now: this.#now() });
    await this.#save(site);
    this.openSite(site.id);
    return site;
  }

  async updateSiteInfo(id: SiteId, info: Omit<SiteInfo, "year">): Promise<void> {
    await this.flush();
    const site = this.state.getState().sites.find((s) => s.id === id);
    if (!site) return;
    await this.#save({ ...site, ...info, updatedAt: this.#now() });
  }

  /** サイトを消す。開いていたサイトなら、残りのサイトか、新しく作ったサイトを開く */
  async deleteSite(id: SiteId, fallback: NewSite): Promise<void> {
    await this.flush();
    this.state.setState(({ sites }) => ({ sites: sites.filter((s) => s.id !== id) }));
    this.#writing = this.#writing.then(() => this.#store.delete(id)).catch(() => undefined);
    await this.#writing;
    if (this.state.getState().currentId !== id) return;
    const rest = this.state.getState().sites[0];
    if (rest) this.openSite(rest.id);
    else await this.createSite(fallback);
  }

  async addPage(path: string, html: string): Promise<void> {
    await this.flush();
    const site = this.current();
    if (!site) return;
    await this.#save(addPage(site, path, html, this.#now()));
    this.openPage(path);
  }

  async renamePage(from: string, to: string): Promise<void> {
    await this.flush();
    const site = this.current();
    if (!site || from === to) return;
    await this.#save(renamePage(site, from, to, this.#now()));
    const kit = this.#kit.getState();
    this.#kit.setState({
      history: renameInHistory(kit.history, from, to),
      ...(kit.pagePath === from ? { pagePath: to } : {}),
    });
    if (kit.pagePath === from) this.#remember({ siteId: site.id, path: to });
  }

  async deletePage(path: string): Promise<void> {
    await this.flush();
    const site = this.current();
    if (!site) return;
    const next = deletePage(site, path, this.#now());
    if (next === site) return;
    await this.#save(next);
    if (this.#kit.getState().pagePath === path) {
      const home = homePath(next);
      this.#loadPage(home, startHistory({ kind: "page", path: home }));
    }
  }

  async importShared(shared: SharedSite, mode: ImportMode): Promise<LocalSite | undefined> {
    await this.flush();
    const now = this.#now();
    let site: LocalSite;
    if (mode.kind === "new") {
      site = fromShared(shared, this.#newId(), now);
    } else {
      const existing = this.state.getState().sites.find((s) => s.id === mode.id);
      if (!existing) return undefined;
      site = overwriteWithShared(existing, shared, now);
    }
    await this.#save(site);
    this.openSite(site.id);
    return site;
  }

  async markExported(id: SiteId): Promise<void> {
    await this.flush();
    const site = this.state.getState().sites.find((s) => s.id === id);
    if (site) await this.#save({ ...site, lastExportedAt: this.#now() });
  }
}
