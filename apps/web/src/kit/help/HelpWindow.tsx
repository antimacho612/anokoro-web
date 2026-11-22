import { resolveTopic, topicHtml, topicsForYear } from "@anokoro/help";
import { useEffect, useRef } from "react";
import { topics } from "virtual:anokoro-help";
import { Window } from "../../ui/Window/Window.tsx";
import { useKit } from "../store.ts";
import styles from "./HelpWindow.module.css";

export function HelpWindow() {
  const helpOpen = useKit((s) => s.helpOpen);
  return helpOpen ? <HelpDialog /> : null;
}

function HelpDialog() {
  const year = useKit((s) => s.year);
  const wantedHelpTopic = useKit((s) => s.wantedHelpTopic);
  const selectHelpTopic = useKit((s) => s.selectHelpTopic);
  const closeHelp = useKit((s) => s.closeHelp);
  const dialogRef = useRef<HTMLElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);

  const shown = topicsForYear(topics, year);
  const topic = resolveTopic(topics, year, wantedHelpTopic);

  useEffect(() => {
    const opener = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    dialogRef.current?.focus();
    return () => opener?.focus();
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent): void => {
      if (e.key === "Escape") closeHelp();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [closeHelp]);

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
      onClose={closeHelp}
    >
      <div className={styles.tabs} role="group" aria-label="解説のトピック">
        {shown.map((t) => (
          <button
            key={t.id}
            type="button"
            className={t.id === topic?.id ? "btn on" : "btn"}
            aria-pressed={t.id === topic?.id}
            onClick={() => selectHelpTopic(t.id)}
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
        </div>
      )}
    </Window>
  );
}
