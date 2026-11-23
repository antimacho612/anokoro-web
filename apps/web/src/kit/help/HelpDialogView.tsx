import type { TopicId } from "@anokoro/era-checker";
import { resolveTopic, topicHtml, topicsForYear } from "@anokoro/help";
import type { Year } from "@anokoro/era-data";
import { useEffect, useRef, type ReactNode } from "react";
import { topics } from "virtual:anokoro-help";
import { Window } from "../../ui/Window/Window.tsx";
import { useDialogFocus } from "../../ui/Window/useDialogFocus.ts";
import styles from "./HelpWindow.module.css";

type HelpDialogViewProps = {
  year: Year;
  wantedTopic: TopicId | null;
  onSelectTopic: (topic: TopicId) => void;
  onClose: () => void;
  /** 本文の末尾に足すもの。表示中のトピックを受け取る */
  footer?: (topic: TopicId) => ReactNode;
};

/** 解説のダイアログ。選んだ年までの内容だけを出す */
export function HelpDialogView({
  year,
  wantedTopic,
  onSelectTopic,
  onClose,
  footer,
}: HelpDialogViewProps) {
  const dialogRef = useRef<HTMLElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);

  const shown = topicsForYear(topics, year);
  const topic = resolveTopic(topics, year, wantedTopic);

  useDialogFocus(dialogRef, onClose);

  useEffect(() => {
    if (bodyRef.current) bodyRef.current.scrollTop = 0;
  }, [topic?.id]);

  return (
    <Window
      ref={dialogRef}
      role="dialog"
      tabIndex={-1}
      title="ヘルプ - あのころのWeb解説"
      controls={["?", "×"]}
      className={styles.dialog}
      onClose={onClose}
    >
      <div className={styles.tabs} role="group" aria-label="解説のトピック">
        {shown.map((t) => (
          <button
            key={t.id}
            type="button"
            className={t.id === topic?.id ? "btn on" : "btn"}
            aria-pressed={t.id === topic?.id}
            onClick={() => onSelectTopic(t.id)}
          >
            {t.title}
          </button>
        ))}
      </div>
      {topic && (
        <div
          ref={bodyRef}
          className={`${styles.body} sunken`}
          data-topic={topic.id}
          aria-label={topic.title}
          role="document"
          tabIndex={0}
        >
          <h3>{topic.title}</h3>
          <div dangerouslySetInnerHTML={{ __html: topicHtml(topic, year) }} />
          {footer?.(topic.id)}
        </div>
      )}
    </Window>
  );
}
