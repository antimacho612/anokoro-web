import { gzipSync } from "node:zlib";
import { describe, expect, it } from "vite-plus/test";
import { initialJsSizes, type BudgetChunk } from "./bundle-budget.ts";

const chunk = (fileName: string, imports: string[], isEntry = false): BudgetChunk => ({
  fileName,
  name: fileName.replace(/\.js$/, ""),
  code: `console.log(${JSON.stringify(fileName.repeat(20))});`,
  isEntry,
  imports,
});

const gz = (c: BudgetChunk): number => gzipSync(c.code).length;

describe("initialJsSizes", () => {
  it("入口ごとに、静的に読み込むチャンクをたどって 1 回ずつ数える", () => {
    const shared = chunk("shared.js", []);
    const theme = chunk("theme.js", ["shared.js"]);
    const kit = chunk("kit.js", ["shared.js", "theme.js"], true);
    const view = chunk("view.js", ["shared.js"], true);
    const lazy = chunk("help.js", ["shared.js"]);
    expect(initialJsSizes([shared, theme, kit, view, lazy])).toEqual([
      { page: "kit", gzipBytes: gz(kit) + gz(shared) + gz(theme) },
      { page: "view", gzipBytes: gz(view) + gz(shared) },
    ]);
  });

  it("読み込み先が循環していても止まる", () => {
    const a = chunk("a.js", ["b.js"], true);
    const b = chunk("b.js", ["a.js"]);
    expect(initialJsSizes([a, b])).toEqual([{ page: "a", gzipBytes: gz(a) + gz(b) }]);
  });
});
