import { defineConfig } from "vite-plus";

export default defineConfig({
  fmt: {
    // ゴールデンテストの入力と期待値は手を加えずに比べる
    ignorePatterns: ["packages/era-checker/test/golden/**"],
  },
  lint: {
    jsPlugins: [{ name: "vite-plus", specifier: "vite-plus/oxlint-plugin" }],
    rules: { "vite-plus/prefer-vite-plus-imports": "error" },
    options: { typeAware: true, typeCheck: true },
  },
  run: {
    cache: true,
  },
});
