import type { SharedSite } from "@anokoro/share-codec";
import { parseSiteId, type SiteId } from "@anokoro/site-store";
import { describe, expect, test } from "vite-plus/test";
import {
  addPage,
  createSite,
  deletePage,
  fromShared,
  homePath,
  needsExportReminder,
  nextPagePath,
  normalizePagePath,
  overwriteWithShared,
  pagePathProblem,
  renamePage,
  toShared,
  updatePageHtml,
} from "./site-model.ts";

const testId = (n: number): SiteId => parseSiteId(`01J${String(n).padStart(23, "0")}`);

const DAY = 24 * 60 * 60 * 1000;

const base = createSite({
  id: testId(1),
  name: "たろうのお部屋",
  year: 2001,
  genre: "personal",
  category: "diary",
  pages: [
    { path: "index.html", html: "<p>top</p>" },
    { path: "diary.html", html: "<p>diary</p>" },
  ],
  now: 100,
});

describe("ページの操作", () => {
  test("中身を書き換えると更新日時が進み、同じ中身なら元のまま", () => {
    const next = updatePageHtml(base, "diary.html", "<p>new</p>", 200);
    expect(next.pages[1]).toEqual({ path: "diary.html", html: "<p>new</p>", updatedAt: 200 });
    expect(next.updatedAt).toBe(200);
    expect(updatePageHtml(base, "diary.html", "<p>diary</p>", 200)).toBe(base);
    expect(updatePageHtml(base, "none.html", "x", 200)).toBe(base);
  });

  test("追加、名前変更、削除", () => {
    const added = addPage(base, nextPagePath(base), "", 200);
    expect(added.pages.map((p) => p.path)).toEqual(["index.html", "diary.html", "page1.html"]);
    expect(nextPagePath(added)).toBe("page2.html");
    const renamed = renamePage(added, "page1.html", "link.html", 300);
    expect(renamed.pages.map((p) => p.path)).toEqual(["index.html", "diary.html", "link.html"]);
    const deleted = deletePage(renamed, "index.html", 400);
    expect(deleted.pages.map((p) => p.path)).toEqual(["diary.html", "link.html"]);
    expect(homePath(deleted)).toBe("diary.html");
  });

  test("最後の 1 ページは消せない", () => {
    const one = deletePage(base, "diary.html", 200);
    expect(deletePage(one, "index.html", 300)).toBe(one);
  });

  test("ページ名を検査する", () => {
    expect(normalizePagePath(" Diary ")).toBe("diary.html");
    expect(pagePathProblem(base, "link.html")).toBeNull();
    expect(pagePathProblem(base, "diary.html")).toMatch("もうあります");
    expect(pagePathProblem(base, "diary.html", "diary.html")).toBeNull();
    expect(pagePathProblem(base, "日記.html")).toMatch("半角");
  });
});

describe("共有データとの変換", () => {
  test("往復で中身が一致する", () => {
    const shared = toShared(base);
    expect(shared).toEqual({
      kind: "anokoro-site",
      v: 1,
      name: "たろうのお部屋",
      year: 2001,
      genre: "personal",
      category: "diary",
      pages: [
        { path: "index.html", html: "<p>top</p>" },
        { path: "diary.html", html: "<p>diary</p>" },
      ],
    });
    expect(toShared(fromShared(shared, testId(2), 500))).toEqual(shared);
  });

  test("上書きでは id、作成日時、カウンターを残す", () => {
    const shared: SharedSite = {
      ...toShared(base),
      year: 2005,
      pages: [{ path: "index.html", html: "x" }],
    };
    const next = overwriteWithShared({ ...base, counter: 999, lastExportedAt: 150 }, shared, 600);
    expect(next).toMatchObject({
      id: testId(1),
      counter: 999,
      createdAt: 100,
      updatedAt: 600,
      year: 2005,
      lastExportedAt: 150,
    });
    expect(next.pages).toEqual([{ path: "index.html", html: "x", updatedAt: 600 }]);
  });
});

describe("保存の案内", () => {
  test("最後の書き出しから 7 日たつとすすめる", () => {
    expect(needsExportReminder(base, 100 + 7 * DAY - 1)).toBe(false);
    expect(needsExportReminder(base, 100 + 7 * DAY)).toBe(true);
    const exported = { ...base, lastExportedAt: 100 + 7 * DAY };
    expect(needsExportReminder(exported, 100 + 8 * DAY)).toBe(false);
  });
});
