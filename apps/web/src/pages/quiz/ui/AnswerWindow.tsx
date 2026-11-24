import { MAX_YEAR, SITE_KINDS } from "@anokoro/era-data";
import {
  MAX_TRIES,
  answerFacts,
  remainingTries,
  type QuizProgress,
  type Question,
} from "@anokoro/quiz";
import { Window } from "../../../shared/ui/window/index.ts";
import styles from "./QuizApp.module.css";

type AnswerWindowProps = {
  question: Question;
  progress: QuizProgress;
  message: string;
  onBlameNet: () => void;
  onOpenHelp: () => void;
  onNext: () => void;
};

type FinishedProgress = Exclude<QuizProgress, { kind: "playing" }>;

function verdictOf(question: Question, progress: FinishedProgress): { title: string; sub: string } {
  if (progress.kind === "failed") {
    return {
      title: question.kind === "line" ? "答えは回線でした" : "答えはここでした",
      sub: `${MAX_TRIES} 回とも外れました`,
    };
  }
  const tries = progress.misses.length + 1;
  return tries === 1
    ? { title: "一発正解！", sub: "1 回目で見つけました" }
    : { title: "正解！", sub: `${tries} 回目で見つけました` };
}

function sinceText(question: Question): string {
  const { since, yearsEarly } = answerFacts(question);
  if (since === null) return `${MAX_YEAR}年になっても、まだふつうには使えませんでした`;
  if (question.kind === "line") {
    return `${since}年から。${question.year}年にはまだ選べませんでした`;
  }
  return `${since}年から。${question.year}年より ${yearsEarly} 年先の技術でした`;
}

type ResultCardProps = {
  question: Question;
  progress: FinishedProgress;
};

function ResultCard({ question, progress }: ResultCardProps) {
  const { label, code } = answerFacts(question);
  const { title, sub } = verdictOf(question, progress);
  const isCorrect = progress.kind === "correct";
  return (
    <div className={isCorrect ? styles.cardCorrect : styles.cardFailed}>
      <div className={styles.verdict}>
        <span className={isCorrect ? styles.markCorrect : styles.markFailed} aria-hidden="true">
          {isCorrect ? "" : "×"}
        </span>
        <div className={styles.verdictText}>
          <p className={styles.verdictTitle}>{title}</p>
          <p className={styles.verdictSub}>{sub}</p>
        </div>
      </div>
      <dl className={styles.facts}>
        <dt>{question.kind === "line" ? "時代外れだった回線" : "時代外れだった技術"}</dt>
        <dd className={styles.factLabel}>{label}</dd>
        <dt>使えるようになった年</dt>
        <dd>{sinceText(question)}</dd>
        {code !== null && (
          <>
            <dt>答えの行</dt>
            <dd>
              <code className={styles.factCode}>{code}</code>
            </dd>
          </>
        )}
      </dl>
    </div>
  );
}

export function AnswerWindow({
  question,
  progress,
  message,
  onBlameNet,
  onOpenHelp,
  onNext,
}: AnswerWindowProps) {
  const remaining = remainingTries(progress);
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
      <p className={styles.rule}>{rule}</p>
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
      <button
        type="button"
        className="btn"
        disabled={progress.kind !== "playing"}
        onClick={onBlameNet}
      >
        ページではなく回線がおかしい
      </button>
      <div className={styles.result} role="status" aria-live="polite">
        {progress.kind === "playing" ? (
          message !== "" && <p className={`${styles.message} sunken`}>{message}</p>
        ) : (
          <ResultCard question={question} progress={progress} />
        )}
      </div>
      {progress.kind !== "playing" && (
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
