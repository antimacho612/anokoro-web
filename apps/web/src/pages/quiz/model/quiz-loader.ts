import { checkEra } from "@anokoro/era-checker";
import { getLine } from "@anokoro/era-data";
import { loadPage, systemClock, type Clock, type LoadHandle } from "@anokoro/netsim";
import type { Question } from "@anokoro/quiz";
import type { NetFrameWriter } from "../../../shared/lib/index.ts";
import { completeMessage } from "../../../features/dialup/index.ts";

export const QUIZ_COUNTER = 1234;

export interface QuizLoadCallbacks {
  onStatus: (status: string) => void;
  onProgress: (ratio: number) => void;
  /** 文書を開き直した直後。クリックの受け付けはここから付け直す */
  onOpen: () => void;
  onHtmlDone: () => void;
  onComplete: () => void;
}

export interface QuizLoadOptions extends QuizLoadCallbacks {
  question: Question;
  writer: NetFrameWriter;
  clock?: Clock;
}

function hostOf(url: string): string {
  return new URL(url).host;
}

function directoryOf(url: string): string {
  return url.slice(0, url.lastIndexOf("/") + 1);
}

/**
 * お題を問題の回線で読み込み、iframe に少しずつ書く。回線名は出さない。
 * ダイヤルの手順は省き、読み込みだけを再現する
 */
export function startQuizLoad({
  question,
  writer,
  clock = systemClock,
  onStatus,
  onProgress,
  onOpen,
  onHtmlDone,
  onComplete,
}: QuizLoadOptions): LoadHandle {
  const result = checkEra(question.displaySource, {
    year: question.year,
    allowFeatures: question.allowFeatures,
    mode: "net",
    counter: QUIZ_COUNTER,
  });
  const host = hostOf(question.page.url);
  const directory = directoryOf(question.page.url);
  let written = 0;
  const writeUpTo = (fraction: number): void => {
    const next = Math.floor(result.html.length * fraction);
    writer.write(result.html.slice(written, next));
    written = next;
  };

  return loadPage({
    line: getLine(question.lineKey),
    htmlBytes: new TextEncoder().encode(question.source).length,
    assets: result.assets,
    clock,
    onEvent: (event) => {
      switch (event.type) {
        case "connecting":
          onStatus(`サイト ${host} に接続しています...`);
          break;
        case "waiting":
          onStatus("Web サイトが見つかりました。応答を待っています...");
          break;
        case "html-start":
          writer.open();
          onOpen();
          onStatus(`ページ ${question.page.url} を開いています...`);
          break;
        case "html":
          writeUpTo(event.fraction);
          break;
        case "html-done":
          writeUpTo(1);
          writer.close();
          onHtmlDone();
          break;
        case "asset-start":
        case "asset-progress":
        case "asset-done": {
          if (event.target.kind === "ad") break;
          const index = event.target.index;
          const asset = result.assets[index];
          if (!asset) break;
          if (event.type === "asset-start") writer.assetStart(index, asset);
          else if (event.type === "asset-progress")
            writer.assetProgress(index, asset, event.fraction);
          else writer.assetDone(index, asset);
          break;
        }
        case "status":
          onStatus(
            `（残り ${event.remaining} 項目）${directory}${event.name} をダウンロードしています...`,
          );
          break;
        case "progress":
          onProgress(event.loadedBytes / event.totalBytes);
          break;
        case "complete":
          onStatus(completeMessage(event.elapsedMs));
          onComplete();
          break;
        case "aborted":
          break;
      }
    },
  });
}
