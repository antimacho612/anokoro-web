import { gzipSync } from "node:zlib";
import type { Plugin } from "vite-plus";

export interface BudgetChunk {
  fileName: string;
  name: string;
  code: string;
  isEntry: boolean;
  /** 静的に読み込むチャンクのファイル名 */
  imports: readonly string[];
}

export interface InitialJs {
  page: string;
  gzipBytes: number;
}

function staticClosure(
  entry: BudgetChunk,
  byFile: ReadonlyMap<string, BudgetChunk>,
): BudgetChunk[] {
  const seen = new Map<string, BudgetChunk>();
  const visit = (chunk: BudgetChunk): void => {
    if (seen.has(chunk.fileName)) return;
    seen.set(chunk.fileName, chunk);
    for (const file of chunk.imports) {
      const next = byFile.get(file);
      if (next) visit(next);
    }
  };
  visit(entry);
  return [...seen.values()];
}

/** ページごとの、最初の表示で読み込む JS の量。遅延読み込みのチャンクは数えない */
export function initialJsSizes(chunks: readonly BudgetChunk[]): InitialJs[] {
  const byFile = new Map(chunks.map((c) => [c.fileName, c]));
  return chunks
    .filter((c) => c.isEntry)
    .map((entry) => ({
      page: entry.name,
      gzipBytes: staticClosure(entry, byFile).reduce((sum, c) => sum + gzipSync(c.code).length, 0),
    }));
}

export function formatKB(bytes: number): string {
  return `${(bytes / 1024).toFixed(1)}KB`;
}

/** 最初の表示で読み込む JS が上限を超えたら、ビルドを失敗させる */
export function bundleBudget({ limitBytes }: { limitBytes: number }): Plugin {
  return {
    name: "anokoro:bundle-budget",
    apply: "build",
    generateBundle(_options, bundle) {
      const chunks = Object.values(bundle).flatMap((output) =>
        output.type === "chunk" ? [output] : [],
      );
      const over = initialJsSizes(chunks).filter((s) => s.gzipBytes > limitBytes);
      if (over.length === 0) return;
      const pages = over.map((s) => `${s.page}: ${formatKB(s.gzipBytes)}`).join("、");
      this.error(
        `最初の表示で読み込む JS が上限（圧縮後 ${formatKB(limitBytes)}）を超えました。${pages}`,
      );
    },
  };
}
