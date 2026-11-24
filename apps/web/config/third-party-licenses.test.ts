import { realpathSync } from "node:fs";
import { createRequire } from "node:module";
import { describe, expect, it } from "vite-plus/test";
import { collectNotices, formatNotices } from "./third-party-licenses.ts";

const require = createRequire(import.meta.url);

describe("collectNotices", () => {
  it("node_modules 内のモジュールだけを、パッケージごとにまとめて名前順に並べる", () => {
    const zod = realpathSync(require.resolve("zod"));
    const react = realpathSync(require.resolve("react"));
    const notices = collectNotices([
      zod,
      `${react}?commonjs-proxy`,
      `\0${react}`,
      "/home/user/anokoro-web/apps/web/src/app/kit/main.tsx",
      "\0vite/modulepreload-polyfill.js",
    ]);
    expect(notices.map((n) => [n.name, n.license])).toEqual([
      ["react", "MIT"],
      ["zod", "MIT"],
    ]);
    expect(notices[0]?.text).toMatch(/Copyright \(c\) Meta Platforms/);
  });
});

describe("formatNotices", () => {
  it("パッケージ名、版、ライセンス、LICENSE の本文を並べる", () => {
    const text = formatNotices([
      { name: "a", version: "1.0.0", license: "MIT", text: "MIT License\nCopyright (c) A" },
      { name: "b", version: "2.0.0", license: "ISC", text: null },
    ]);
    expect(text).toContain("a@1.0.0\nLicense: MIT\n\nMIT License\nCopyright (c) A");
    expect(text).toContain("b@2.0.0\nLicense: ISC\n\n(LICENSE ファイルが同梱されていません)");
  });
});
