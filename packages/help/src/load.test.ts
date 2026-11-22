import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, expect, test } from "vite-plus/test";
import { loadHelpTopics } from "./load.ts";

let dir: string | undefined;

afterEach(() => {
  if (dir) rmSync(dir, { recursive: true, force: true });
});

test("タブはファイル名の順に並ぶ", () => {
  dir = mkdtempSync(join(tmpdir(), "anokoro-help-"));
  for (const [name, id] of [
    ["02-css.md", "css"],
    ["10-timeline.md", "timeline"],
    ["01-line.md", "line"],
  ]) {
    writeFileSync(
      join(dir, name),
      `---\nid: ${id}\ntitle: ${id}\nyears: [1995, 2015]\n---\n\n本文\n`,
    );
  }
  expect(loadHelpTopics(dir).topics.map((t) => t.id)).toEqual(["line", "css", "timeline"]);
});
