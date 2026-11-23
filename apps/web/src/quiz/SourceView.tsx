import type { QuizPick, QuizProgress, Question } from "@anokoro/quiz";
import { useEffect, useRef } from "react";
import { SOURCE_FONT_PX, type SourceFontSize } from "../ui/source-font-size.ts";
import styles from "./QuizApp.module.css";

type SourceViewProps = {
  question: Question;
  progress: QuizProgress;
  fontSize: SourceFontSize;
  onPick: (pick: QuizPick) => void;
};

function answerLinesOf(question: Question): readonly number[] {
  return question.kind === "trick" ? question.answerLines : [];
}

/** お題のソースを行番号付きで出す。行を選んで答える。編集はできない */
export function SourceView({ question, progress, fontSize, onPick }: SourceViewProps) {
  const listRef = useRef<HTMLOListElement>(null);
  const lines = question.source.split("\n");
  const missed = new Set(progress.misses.flatMap((m) => (m.kind === "line" ? [m.line] : [])));
  const answers = new Set(progress.kind === "playing" ? [] : answerLinesOf(question));
  const answerClass = progress.kind === "correct" ? styles.lineHit : styles.lineReveal;

  useEffect(() => {
    if (progress.kind !== "failed") return;
    listRef.current?.querySelector(`.${styles.lineReveal}`)?.scrollIntoView({ block: "center" });
  }, [progress.kind]);

  return (
    <ol
      ref={listRef}
      className={`${styles.source} sunken`}
      aria-label="お題のソース"
      style={{ fontSize: SOURCE_FONT_PX[fontSize] }}
    >
      {lines.map((text, i) => {
        const line = i + 1;
        const classes = [
          styles.sourceLine,
          missed.has(line) && styles.lineMiss,
          answers.has(line) && answerClass,
        ]
          .filter(Boolean)
          .join(" ");
        return (
          <li key={line}>
            <button
              type="button"
              className={classes}
              aria-label={`${line} 行目: ${text}`}
              onClick={() => onPick({ kind: "line", line })}
            >
              <span className={styles.lineNumber} aria-hidden="true">
                {line}
              </span>
              <code>{text === "" ? " " : text}</code>
            </button>
          </li>
        );
      })}
    </ol>
  );
}
