import { resolve } from "node:path";
import { siteFavicon } from "@anokoro/assets/vite";
import { helpContent } from "@anokoro/help/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite-plus";
import { resolveBase } from "./config/base.ts";

const root = import.meta.dirname;

export default defineConfig({
  base: resolveBase(process.env.ANOKORO_BASE),
  plugins: [react(), siteFavicon(), helpContent({ dir: resolve(root, "../../content/help") })],
  build: {
    rollupOptions: {
      input: {
        kit: resolve(root, "kit/index.html"),
        view: resolve(root, "view/index.html"),
        quiz: resolve(root, "quiz/index.html"),
      },
    },
  },
  run: {
    tasks: {
      build: {
        command: "vp build",
        // 公開先のパスで出力が変わるため、キャッシュのキーに含める
        cache: { env: ["ANOKORO_BASE"] },
      },
    },
  },
  test: {
    include: ["src/**/*.test.{ts,tsx}", "config/**/*.test.ts"],
    css: { include: [/themes\.css/] },
  },
});
