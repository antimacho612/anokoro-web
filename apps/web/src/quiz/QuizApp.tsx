import { uiThemeForYear } from "@anokoro/era-data";
import { INITIAL_PROGRESS, judge, type QuizPick, type QuizProgress } from "@anokoro/quiz";
import { useEffect, useState } from "react";
import { HelpDialogView } from "../kit/help/HelpDialogView.tsx";
import { AnswerWindow } from "./AnswerWindow.tsx";
import { PageWindow, type ViewMode } from "./PageWindow.tsx";
import styles from "./QuizApp.module.css";
import { messageFor, type QuizMessage } from "./quiz-messages.ts";
import { kitUrl, quizUrl } from "./quiz-params.ts";
import { randomSeed, randomStart, type QuizStart } from "./quiz-start.ts";

const BASE = import.meta.env.BASE_URL;

type QuizAppProps = {
  initial: QuizStart;
};

function initialMode({ question }: QuizStart): ViewMode {
  return question.kind === "trick" && !question.displayable ? "source" : "display";
}

function noticeMessage({ notice }: QuizStart): QuizMessage {
  return { message: notice ?? "", note: "" };
}

export function QuizApp({ initial }: QuizAppProps) {
  const [start, setStart] = useState(initial);
  const [progress, setProgress] = useState<QuizProgress>(INITIAL_PROGRESS);
  const [mode, setMode] = useState<ViewMode>(() => initialMode(initial));
  const [message, setMessage] = useState<QuizMessage>(() => noticeMessage(initial));
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [helpTopic, setHelpTopic] = useState(initial.question.topic);
  const { question } = start;

  useEffect(() => {
    document.documentElement.dataset.uiTheme = uiThemeForYear(question.year).id;
  }, [question.year]);

  const handlePick = (pick: QuizPick): void => {
    const result = judge(question, progress, pick);
    setProgress(result.progress);
    if (result.outcome !== "finished") setMessage(messageFor(question, result));
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
    setHelpTopic(next.question.topic);
    setIsHelpOpen(false);
  };

  const handleOpenHelp = (): void => {
    setHelpTopic(question.topic);
    setIsHelpOpen(true);
  };

  return (
    <>
      <header className={styles.top}>
        <h1 className="dot">時代まちがいさがし</h1>
        <nav className={styles.links} aria-label="ほかの画面へ">
          <a className="btn" href={kitUrl(BASE, question.year)}>
            作成キットへ戻る
          </a>
          <a className="btn" href={`${BASE}quiz/?daily`}>
            今日の 1 問
          </a>
        </nav>
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
          message={message.message}
          note={message.note}
          onBlameNet={() => handlePick({ kind: "net" })}
          onOpenHelp={handleOpenHelp}
          onNext={handleNext}
        />
      </main>
      {isHelpOpen && (
        <HelpDialogView
          year={question.year}
          wantedTopic={helpTopic}
          onSelectTopic={setHelpTopic}
          onClose={() => setIsHelpOpen(false)}
        />
      )}
    </>
  );
}
