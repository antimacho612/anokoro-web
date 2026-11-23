import { SITE_KINDS } from "@anokoro/era-data";
import { MAX_TRIES, remainingTries, type QuizProgress, type Question } from "@anokoro/quiz";
import { Window } from "../ui/Window/Window.tsx";
import styles from "./QuizApp.module.css";

type AnswerWindowProps = {
  question: Question;
  progress: QuizProgress;
  message: string;
  note: string;
  onBlameNet: () => void;
  onOpenHelp: () => void;
  onNext: () => void;
};

export function AnswerWindow({
  question,
  progress,
  message,
  note,
  onBlameNet,
  onOpenHelp,
  onNext,
}: AnswerWindowProps) {
  const remaining = remainingTries(progress);
  const isFinished = progress.kind !== "playing";
  const kindLabel = SITE_KINDS[question.page.kind].label;
  const sourceOnly = question.kind === "trick" && !question.displayable;
  const rule =
    `このページには、${question.year}年にはまだ使えなかった技術が 1 か所だけ混ざっています。` +
    "ページの要素か、ソースの行を選んでください。ページは正しいのに回線だけがおかしいこともあります。" +
    (sourceOnly ? "この問題は、見た目では見分けられません。" : "");

  return (
    <Window title="答え" className={styles.answer}>
      <p className={styles.year}>
        <span className="dot">{question.year}年</span>の{kindLabel}
      </p>
      <p className="hint">{rule}</p>
      <p className={styles.tries} aria-label={`残り ${remaining} 回`}>
        残り
        {Array.from({ length: MAX_TRIES }, (_, i) => (
          <span
            key={i}
            className={i < remaining ? styles.tryLeft : styles.tryUsed}
            aria-hidden="true"
          >
            ●
          </span>
        ))}
      </p>
      <button type="button" className="btn" disabled={isFinished} onClick={onBlameNet}>
        ページではなく回線がおかしい
      </button>
      <div className={`${styles.result} sunken`} role="status" aria-live="polite">
        {message !== "" && <p className={styles.message}>{message}</p>}
        {note !== "" && <p className={styles.note}>{note}</p>}
      </div>
      {isFinished && (
        <div className={styles.actions}>
          <button type="button" className="btn" onClick={onOpenHelp}>
            解説を開く
          </button>
          <button type="button" className="btn" onClick={onNext}>
            次の問題
          </button>
        </div>
      )}
    </Window>
  );
}
