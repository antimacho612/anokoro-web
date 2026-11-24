import { resolutionPeriodForYear } from "@anokoro/era-data";
import type { LoadHandle } from "@anokoro/netsim";
import type { QuizPick, QuizProgress, Question } from "@anokoro/quiz";
import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { useElementWidth } from "../../../shared/lib/index.ts";
import {
  SOURCE_FONT_SIZES,
  SOURCE_FONT_SIZE_LABELS,
  useSourceFontSize,
} from "../../../features/source-font-size/index.ts";
import { Window } from "../../../shared/ui/window/index.ts";
import { browserFrameStyles as browserStyles } from "../../../shared/ui/browser-frame/index.ts";
import { stageLayout } from "../../../shared/ui/browser-frame/index.ts";
import { BLANK_PAGE, createNetFrameWriter } from "../../../shared/lib/index.ts";
import { elementPath, findByPath } from "../lib/element-path.ts";
import styles from "./QuizApp.module.css";
import { startQuizLoad } from "../model/quiz-loader.ts";
import { SourceView } from "./SourceView.tsx";

export type ViewMode = "display" | "source";

type PageWindowProps = {
  question: Question;
  progress: QuizProgress;
  mode: ViewMode;
  onModeChange: (mode: ViewMode) => void;
  onPick: (pick: QuizPick) => void;
};

const MARK_STYLE_ID = "anokoro-quiz-style";
const MISS = "data-quiz-miss";
const FOCUS = "data-quiz-focus";
const HIT = "data-quiz-hit";
const REVEAL = "data-quiz-reveal";

const MARK_STYLE =
  "html{cursor:pointer}" +
  `[${MISS}]{outline:3px solid #e00000 !important;outline-offset:1px}` +
  `[${FOCUS}]{outline:3px dashed #0050ff !important;outline-offset:1px}` +
  `[${HIT}]{outline:4px solid #00a000 !important;outline-offset:2px}` +
  `[${REVEAL}]{outline:4px solid #ff00cc !important;outline-offset:2px;animation:__quiz 0.8s steps(1) 5}` +
  "@keyframes __quiz{50%{outline-color:transparent}}" +
  `@media (prefers-reduced-motion:reduce){[${REVEAL}]{animation:none}}`;

const SKIPPED_TAGS = new Set(["BR", "STYLE", "TITLE", "META", "LINK", "SCRIPT"]);

function pickableElements(doc: Document): Element[] {
  return Array.from(doc.body.querySelectorAll("*")).filter(
    (el) => !SKIPPED_TAGS.has(el.tagName) && el.getClientRects().length > 0,
  );
}

function ensureMarkStyle(doc: Document): void {
  if (doc.getElementById(MARK_STYLE_ID) || !doc.head) return;
  const style = doc.createElement("style");
  style.id = MARK_STYLE_ID;
  style.textContent = MARK_STYLE;
  doc.head.append(style);
}

function clearMark(doc: Document, name: string): void {
  for (const el of Array.from(doc.querySelectorAll(`[${name}]`))) el.removeAttribute(name);
}

function scrollToElement(el: Element): void {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  el.scrollIntoView({ block: "center", behavior: reduceMotion ? "auto" : "smooth" });
}

function applyMarks(doc: Document, question: Question, progress: QuizProgress): void {
  if (!doc.body) return;
  ensureMarkStyle(doc);
  clearMark(doc, MISS);
  clearMark(doc, HIT);
  clearMark(doc, REVEAL);
  for (const miss of progress.misses) {
    if (miss.kind === "element") findByPath<Element>(doc.body, miss.path)?.setAttribute(MISS, "");
  }
  if (question.kind !== "trick" || progress.kind === "playing") return;
  const answers = Array.from(doc.body.querySelectorAll(question.answerSelector));
  const mark = progress.kind === "correct" ? HIT : REVEAL;
  for (const answer of answers) answer.setAttribute(mark, "");
  const [first] = answers;
  if (progress.kind === "failed" && first) scrollToElement(first);
}

export function PageWindow({ question, progress, mode, onModeChange, onPick }: PageWindowProps) {
  const [loadKey, setLoadKey] = useState(0);
  const [status, setStatus] = useState("");
  const [progressRatio, setProgressRatio] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [focusLabel, setFocusLabel] = useState("");
  const [fontSize, setFontSize] = useSourceFontSize();
  const [viewportRef, viewportWidth] = useElementWidth();
  const docRef = useRef<Document | null>(null);
  const handleRef = useRef<LoadHandle | null>(null);
  const startedKeyRef = useRef<string | null>(null);
  const focusIndexRef = useRef(-1);
  const latest = useRef({ question, progress, onPick });

  useEffect(() => {
    latest.current = { question, progress, onPick };
  });

  const frameKey = `${question.seed}-${question.page.id}-${loadKey}`;
  const resolution = resolutionPeriodForYear(question.year).default;
  const layout = stageLayout(resolution, viewportWidth);

  useEffect(
    () => () => {
      handleRef.current?.abort();
      handleRef.current = null;
      docRef.current = null;
    },
    [frameKey],
  );

  useEffect(() => {
    if (docRef.current) applyMarks(docRef.current, question, progress);
  }, [question, progress]);

  const pickElement = (doc: Document, el: Element): void => {
    if (el === doc.body || el === doc.documentElement) return;
    const path = elementPath<Element>(doc.body, el);
    if (path === undefined) return;
    const { question: q } = latest.current;
    const isAnswer = q.kind === "trick" && el.closest(q.answerSelector) !== null;
    latest.current.onPick({ kind: "element", path, isAnswer });
  };

  const attachClicks = (doc: Document): void => {
    doc.addEventListener("click", (e) => {
      e.preventDefault();
      const view = doc.defaultView;
      if (view && e.target instanceof view.Element) pickElement(doc, e.target);
    });
  };

  const handleFrameLoad = (frame: HTMLIFrameElement): void => {
    if (startedKeyRef.current === frameKey) return;
    const doc = frame.contentDocument;
    if (!doc) return;
    startedKeyRef.current = frameKey;
    focusIndexRef.current = -1;
    setFocusLabel("");
    setIsLoading(true);
    setProgressRatio(0);
    handleRef.current = startQuizLoad({
      question,
      writer: createNetFrameWriter(doc),
      onStatus: setStatus,
      onProgress: setProgressRatio,
      onOpen: () => {
        docRef.current = doc;
        attachClicks(doc);
      },
      onHtmlDone: () => {
        const { question: q, progress: p } = latest.current;
        applyMarks(doc, q, p);
      },
      onComplete: () => {
        handleRef.current = null;
        setIsLoading(false);
        setProgressRatio(0);
      },
    });
  };

  const handleReload = (): void => {
    handleRef.current?.abort();
    setLoadKey((k) => k + 1);
  };

  const handleStop = (): void => {
    handleRef.current?.abort();
    handleRef.current = null;
    setIsLoading(false);
    setStatus("中止しました");
  };

  const handleViewportKeyDown = (e: KeyboardEvent<HTMLDivElement>): void => {
    const doc = docRef.current;
    if (!doc?.body) return;
    const delta =
      e.key === "ArrowDown" || e.key === "ArrowRight"
        ? 1
        : e.key === "ArrowUp" || e.key === "ArrowLeft"
          ? -1
          : 0;
    if (delta !== 0) {
      e.preventDefault();
      const elements = pickableElements(doc);
      if (elements.length === 0) return;
      const next = (focusIndexRef.current + delta + elements.length) % elements.length;
      focusIndexRef.current = next;
      clearMark(doc, FOCUS);
      const el = elements[next];
      if (!el) return;
      el.setAttribute(FOCUS, "");
      el.scrollIntoView({ block: "nearest" });
      setFocusLabel(`選択中: <${el.tagName.toLowerCase()}>`);
      return;
    }
    if (e.key === "Enter") {
      const el = pickableElements(doc)[focusIndexRef.current];
      if (!el) return;
      e.preventDefault();
      pickElement(doc, el);
    }
  };

  const isDisplay = mode === "display";

  return (
    <Window title={`${question.page.url} - ネットサーファー`} controls={["_", "□", "×"]}>
      <div className={browserStyles.navrow}>
        <div className={styles.modeSwitch} role="group" aria-label="表示の切り替え">
          <button
            type="button"
            className={isDisplay ? "btn on" : "btn"}
            aria-pressed={isDisplay}
            onClick={() => onModeChange("display")}
          >
            表示
          </button>
          <button
            type="button"
            className={isDisplay ? "btn" : "btn on"}
            aria-pressed={!isDisplay}
            onClick={() => onModeChange("source")}
          >
            ソース
          </button>
        </div>
        {!isDisplay && (
          <div className={styles.modeSwitch} role="group" aria-label="文字の大きさ">
            文字
            {SOURCE_FONT_SIZES.map((option) => (
              <button
                key={option}
                type="button"
                className={option === fontSize ? "btn on" : "btn"}
                aria-pressed={option === fontSize}
                aria-label={`文字の大きさ：${SOURCE_FONT_SIZE_LABELS[option]}`}
                onClick={() => setFontSize(option)}
              >
                {SOURCE_FONT_SIZE_LABELS[option]}
              </button>
            ))}
          </div>
        )}
        <button type="button" className="btn" disabled={!isLoading} onClick={handleStop}>
          中止
        </button>
        <button type="button" className="btn" onClick={handleReload}>
          更新
        </button>
      </div>
      <div className={browserStyles.addr}>
        アドレス(D)
        <div className={`${browserStyles.addrBox} sunken`}>{question.page.url}</div>
      </div>
      <div
        ref={viewportRef}
        className={`${browserStyles.viewport} ${styles.viewport} sunken`}
        style={{ height: layout.viewportHeight }}
        hidden={!isDisplay}
        role="group"
        aria-label="お題のページ。矢印キーで要素を選び、Enter で答える"
        tabIndex={0}
        onKeyDown={handleViewportKeyDown}
      >
        <div
          className={browserStyles.stage}
          style={{
            width: layout.stageWidth,
            height: layout.stageHeight,
            left: layout.left,
            transform: `scale(${layout.scale})`,
          }}
        >
          <iframe
            key={frameKey}
            className={browserStyles.frame}
            sandbox="allow-same-origin"
            title="お題のページ"
            srcDoc={BLANK_PAGE}
            onLoad={(e) => handleFrameLoad(e.currentTarget)}
            style={{ width: layout.stageWidth, height: layout.stageHeight }}
          />
        </div>
      </div>
      {!isDisplay && (
        <SourceView question={question} progress={progress} fontSize={fontSize} onPick={onPick} />
      )}
      <div className={browserStyles.statusbar}>
        <div className={browserStyles.statusMain} role="status">
          {isDisplay && focusLabel !== "" ? focusLabel : status}
        </div>
        {isLoading && (
          <div
            className={`${browserStyles.pbar} sunken`}
            role="progressbar"
            aria-label="読み込みの進み具合"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={Math.round(progressRatio * 100)}
          >
            <i style={{ width: `${progressRatio * 100}%` }} />
          </div>
        )}
        <div>🌐 インターネット</div>
      </div>
    </Window>
  );
}
