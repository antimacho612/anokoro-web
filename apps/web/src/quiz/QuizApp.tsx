import { INITIAL_PROGRESS, judge, type QuizPick, type QuizProgress } from "@anokoro/quiz";
import { useState } from "react";
import { HelpWindow } from "../kit/help/HelpWindow.tsx";
import { InfoWindow } from "../kit/info/InfoWindow.tsx";
import { useKit } from "../kit/store.ts";
import { AnswerWindow } from "./AnswerWindow.tsx";
import { PageWindow, type ViewMode } from "./PageWindow.tsx";
import styles from "./QuizApp.module.css";
import { messageFor } from "./quiz-messages.ts";
import { quizUrl } from "./quiz-params.ts";
import { randomSeed, randomStart, type QuizStart } from "./quiz-start.ts";
import { QuizTaskbar } from "./QuizTaskbar.tsx";

const BASE = import.meta.env.BASE_URL;

type QuizAppProps = {
  initial: QuizStart;
};

function initialMode({ question }: QuizStart): ViewMode {
  return question.kind === "trick" && !question.displayable ? "source" : "display";
}

function noticeMessage({ notice }: QuizStart): string {
  return notice ?? "";
}

export function QuizApp({ initial }: QuizAppProps) {
  const [start, setStart] = useState(initial);
  const [progress, setProgress] = useState<QuizProgress>(INITIAL_PROGRESS);
  const [mode, setMode] = useState<ViewMode>(() => initialMode(initial));
  const [message, setMessage] = useState(() => noticeMessage(initial));
  const setYear = useKit((s) => s.setYear);
  const openHelp = useKit((s) => s.openHelp);
  const closeHelp = useKit((s) => s.closeHelp);
  const { question } = start;

  const handlePick = (pick: QuizPick): void => {
    const result = judge(question, progress, pick);
    setProgress(result.progress);
    if (result.outcome !== "finished") setMessage(messageFor(result));
  };

  const handleNext = (): void => {
    const next = randomStart(start.topic, { randomSeed });
    if (next.urlSeed !== null) {
      const url = quizUrl(BASE, { seed: next.urlSeed, topic: next.topic });
      window.history.replaceState(null, "", url);
    }
    setStart(next);
    setProgress(INITIAL_PROGRESS);
    setMode(initialMode(next));
    setMessage(noticeMessage(next));
    setYear(next.question.year);
    closeHelp();
  };

  return (
    <>
      <QuizTaskbar />
      <header className={styles.top}>
        <h1 className="dot">時代まちがいさがし</h1>
      </header>
      <main className={styles.layout}>
        <PageWindow
          key={`${question.seed}-${question.page.id}`}
          question={question}
          progress={progress}
          mode={mode}
          onModeChange={setMode}
          onPick={handlePick}
        />
        <AnswerWindow
          question={question}
          progress={progress}
          message={message}
          onBlameNet={() => handlePick({ kind: "net" })}
          onOpenHelp={() => openHelp(question.topic)}
          onNext={handleNext}
        />
      </main>
      <HelpWindow />
      <InfoWindow />
    </>
  );
}
