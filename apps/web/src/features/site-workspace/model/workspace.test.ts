import type { SharedSite } from "@anokoro/share-codec";
import {
  createMemorySiteStore,
  parseSiteId,
  type SiteId,
  type SiteStore,
} from "@anokoro/site-store";
import { afterEach, beforeEach, describe, expect, test, vi } from "vite-plus/test";
import { createSite } from "../../../entities/site/index.ts";
import { createKitStore, type KitStore } from "../../../entities/kit-state/index.ts";
import { Workspace, type LastOpened, type NewSite } from "./workspace.ts";

const testId = (n: number): SiteId => parseSiteId(`01J${String(n).padStart(23, "0")}`);
const SAVED_ID = testId(900);

const FIRST = { name: "マイホームページ", genre: "personal", category: "diary" } as const;

interface Setup {
  kit: KitStore;
  ws: Workspace;
  store: SiteStore;
  remembered: LastOpened[];
}

function setup(
  store: SiteStore = createMemorySiteStore(),
  kit = createKitStore({ year: 2001, source: "<p>kit</p>" }),
): Setup {
  let id = 0;
  const remembered: LastOpened[] = [];
  const ws = new Workspace({
    kit,
    now: () => 1000,
    newId: () => testId(++id),
    rememberLastOpened: (v) => remembered.push(v),
  });
  return { kit, ws, store, remembered };
}

const twoPageSite = createSite({
  id: SAVED_ID,
  name: "保存済み",
  year: 2005,
  genre: "blog",
  category: "music",
  counter: 1234,
  pages: [
    { path: "index.html", html: "<p>top</p>" },
    { path: "diary.html", html: "<p>diary</p>" },
  ],
  now: 1,
});

beforeEach(() => {
  vi.useFakeTimers();
});

afterEach(() => {
  vi.useRealTimers();
});

describe("初めて使うとき", () => {
  test("作成キットに出ている中身で最初のサイトを作る", async () => {
    const { kit, ws, store, remembered } = setup();
    kit.setState({ counter: 50 });
    await ws.init({ open: async () => store, firstSite: FIRST });
    const [site] = await store.list();
    expect(site).toMatchObject({
      id: testId(1),
      name: "マイホームページ",
      year: 2001,
      counter: 50,
      pages: [{ path: "index.html", html: "<p>kit</p>" }],
    });
    expect(ws.state.getState()).toMatchObject({ phase: "ready", currentId: testId(1) });
    expect(remembered).toEqual([{ siteId: testId(1), path: "index.html" }]);
  });

  test("IndexedDB が開けなければメモリに置く", async () => {
    const { ws } = setup();
    await ws.init({
      open: async () => {
        throw new Error("no idb");
      },
      firstSite: FIRST,
    });
    expect(ws.state.getState()).toMatchObject({ phase: "ready", target: "memory" });
    expect(ws.current()?.pages[0]?.html).toBe("<p>kit</p>");
  });
});

describe("保存済みのサイトがあるとき", () => {
  test("前回開いていたページを開き、年とカウンターを合わせる", async () => {
    const store = createMemorySiteStore();
    await store.put(twoPageSite);
    const { kit, ws } = setup(store);
    await ws.init({
      open: async () => store,
      firstSite: FIRST,
      lastOpened: { siteId: SAVED_ID, path: "diary.html" },
    });
    expect(kit.getState()).toMatchObject({
      year: 2005,
      counter: 1234,
      pagePath: "diary.html",
      source: "<p>diary</p>",
    });
  });

  test("URL で年が指定されていれば、サイトの年をそれに合わせて保存する", async () => {
    const store = createMemorySiteStore();
    await store.put(twoPageSite);
    const { kit, ws } = setup(store);
    await ws.init({ open: async () => store, firstSite: FIRST, urlYear: 2010 });
    expect(kit.getState().year).toBe(2010);
    await vi.runAllTimersAsync();
    expect((await store.get(SAVED_ID))?.year).toBe(2010);
  });
});

describe("自動保存", () => {
  async function ready(): Promise<Setup> {
    const store = createMemorySiteStore();
    await store.put(twoPageSite);
    const s = setup(store);
    await s.ws.init({ open: async () => store, firstSite: FIRST });
    return s;
  }

  test("入力が止まって 1 秒後に保存する", async () => {
    const { kit, ws, store } = await ready();
    kit.getState().edit("<p>a</p>");
    expect(ws.state.getState().dirty).toBe(true);
    await vi.advanceTimersByTimeAsync(500);
    kit.getState().edit("<p>ab</p>");
    await vi.advanceTimersByTimeAsync(999);
    expect((await store.get(SAVED_ID))?.pages[0]?.html).toBe("<p>top</p>");
    await vi.advanceTimersByTimeAsync(1);
    expect((await store.get(SAVED_ID))?.pages[0]?.html).toBe("<p>ab</p>");
    expect(ws.state.getState().dirty).toBe(false);
  });

  test("元に戻すと未保存ではなくなる", async () => {
    const { kit, ws } = await ready();
    kit.getState().edit("<p>x</p>");
    kit.getState().edit("<p>top</p>");
    expect(ws.state.getState().dirty).toBe(false);
  });

  test("上書き保存はその場で保存する", async () => {
    const { kit, ws, store } = await ready();
    kit.getState().edit("<p>now</p>");
    await ws.flush();
    expect((await store.get(SAVED_ID))?.pages[0]?.html).toBe("<p>now</p>");
  });

  test("年とカウンターもサイトに保存する", async () => {
    const { kit, store } = await ready();
    kit.getState().setYear(2008);
    kit.setState({ counter: 2000 });
    await vi.runAllTimersAsync();
    expect(await store.get(SAVED_ID)).toMatchObject({ year: 2008, counter: 2000 });
  });

  test("ページを切り替える前に保存する", async () => {
    const { kit, ws, store } = await ready();
    kit.getState().edit("<p>edited</p>");
    ws.openPage("diary.html");
    await ws.flush();
    expect((await store.get(SAVED_ID))?.pages.map((p) => p.html)).toEqual([
      "<p>edited</p>",
      "<p>diary</p>",
    ]);
    expect(kit.getState()).toMatchObject({ pagePath: "diary.html", source: "<p>diary</p>" });
  });
});

describe("リンクと履歴", () => {
  async function ready(): Promise<Setup> {
    const store = createMemorySiteStore();
    await store.put(twoPageSite);
    const s = setup(store);
    await s.ws.init({ open: async () => store, firstSite: FIRST });
    return s;
  }

  test("リンクをたどり、戻ると進む", async () => {
    const { kit, ws } = await ready();
    ws.followLink({ kind: "page", path: "diary.html" });
    ws.followLink({ kind: "missing", url: "http://x/bbs.html" });
    expect(kit.getState().notFoundUrl).toBe("http://x/bbs.html");
    ws.back();
    expect(kit.getState()).toMatchObject({ pagePath: "diary.html", notFoundUrl: null });
    ws.back();
    expect(kit.getState().pagePath).toBe("index.html");
    ws.forward();
    expect(kit.getState().pagePath).toBe("diary.html");
    ws.forward();
    expect(kit.getState().notFoundUrl).toBe("http://x/bbs.html");
  });

  test("ホームで index.html に戻る", async () => {
    const { kit, ws } = await ready();
    ws.openPage("diary.html");
    ws.home();
    expect(kit.getState().pagePath).toBe("index.html");
    expect(kit.getState().history.entries).toHaveLength(3);
  });
});

describe("サイトとページの管理", () => {
  async function ready(): Promise<Setup> {
    const s = setup();
    await s.ws.init({ open: async () => s.store, firstSite: FIRST });
    return s;
  }

  test("新しいサイトを作って開く", async () => {
    const { kit, ws, store } = await ready();
    await ws.createSite({
      name: "新しいサイト",
      year: 2003,
      genre: "shop",
      category: "life",
      pages: [{ path: "index.html", html: "<p>shop</p>" }],
    });
    expect((await store.list()).map((s) => s.name).sort()).toEqual([
      "マイホームページ",
      "新しいサイト",
    ]);
    expect(kit.getState()).toMatchObject({ year: 2003, source: "<p>shop</p>", counter: 774 });
    expect(ws.state.getState().currentId).toBe(testId(2));
  });

  test("ページの追加、名前変更、削除", async () => {
    const { kit, ws } = await ready();
    await ws.addPage("diary.html", "<p>d</p>");
    expect(kit.getState().pagePath).toBe("diary.html");
    await ws.renamePage("diary.html", "nikki.html");
    expect(kit.getState().pagePath).toBe("nikki.html");
    expect(kit.getState().history.entries.at(-1)).toEqual({ kind: "page", path: "nikki.html" });
    await ws.deletePage("nikki.html");
    expect(kit.getState().pagePath).toBe("index.html");
    expect(ws.current()?.pages.map((p) => p.path)).toEqual(["index.html"]);
  });

  test("開いているサイトを消すと、残りのサイトか新しいサイトを開く", async () => {
    const { ws, store } = await ready();
    const fallback: NewSite = {
      ...FIRST,
      name: "代わり",
      year: 1995,
      pages: [{ path: "index.html", html: "" }],
    };
    await ws.deleteSite(testId(1), () => Promise.resolve(fallback));
    expect((await store.list()).map((s) => s.name)).toEqual(["代わり"]);
    expect(ws.current()?.name).toBe("代わり");
  });

  test("共有サイトを新しく、または上書きで取り込む", async () => {
    const { ws, store } = await ready();
    const shared: SharedSite = {
      kind: "anokoro-site",
      v: 1,
      name: "マイホームページ",
      year: 1999,
      genre: "bbs",
      category: "game",
      pages: [{ path: "index.html", html: "<p>shared</p>" }],
    };
    await ws.importShared(shared, { kind: "new" });
    expect(await store.list()).toHaveLength(2);
    await ws.importShared({ ...shared, year: 2000 }, { kind: "overwrite", id: testId(1) });
    const overwritten = await store.get(testId(1));
    expect(overwritten).toMatchObject({ year: 2000, genre: "bbs" });
    expect(ws.state.getState().currentId).toBe(testId(1));
  });

  test("書き出した日時を残す", async () => {
    const { ws, store } = await ready();
    await ws.markExported(testId(1));
    expect((await store.get(testId(1)))?.lastExportedAt).toBe(1000);
  });
});
