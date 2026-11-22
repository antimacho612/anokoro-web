import { defineConfig } from "vite-plus";

export default defineConfig({
  fmt: {
    // ゴールデンテストの入力と期待値は手を加えずに比べる
    ignorePatterns: ["packages/era-checker/test/golden/**", ".claude/**"],
  },
  lint: {
    jsPlugins: [
      { name: "vite-plus", specifier: "vite-plus/oxlint-plugin" },
      { name: "eslint-comments", specifier: "@eslint-community/eslint-plugin-eslint-comments" },
    ],
    rules: {
      "vite-plus/prefer-vite-plus-imports": "error",
      "typescript/ban-ts-comment": [
        "error",
        {
          "ts-ignore": true,
          "ts-nocheck": true,
          "ts-expect-error": "allow-with-description",
          minimumDescriptionLength: 5,
        },
      ],
      "eslint-comments/require-description": "error",
    },
    options: { typeAware: true, typeCheck: true, reportUnusedDisableDirectives: "error" },
  },
  test: {
    exclude: ["**/node_modules/**", "**/dist/**", "apps/web/e2e/**", ".claude/**"],
    css: { include: [/themes\.css/] },
  },
  run: {
    cache: true,
  },
});
