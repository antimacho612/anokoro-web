import { quizTopics } from "@anokoro/quiz";
import type { TopicId } from "@anokoro/era-checker";
import { quizUrl } from "../../quiz/quiz-params.ts";
import { useKit } from "../store.ts";
import { HelpDialogView } from "./HelpDialogView.tsx";
import styles from "./HelpWindow.module.css";

const QUIZ_TOPICS = quizTopics();

function QuizLink({ topic }: { topic: TopicId }) {
  if (!QUIZ_TOPICS.has(topic)) return null;
  return (
    <p className={styles.quizLink}>
      <a className="btn" href={quizUrl(import.meta.env.BASE_URL, { topic })}>
        この技術でまちがいさがし
      </a>
    </p>
  );
}

export function HelpDialog() {
  const year = useKit((s) => s.year);
  const wantedHelpTopic = useKit((s) => s.wantedHelpTopic);
  const selectHelpTopic = useKit((s) => s.selectHelpTopic);
  const closeHelp = useKit((s) => s.closeHelp);

  return (
    <HelpDialogView
      year={year}
      wantedTopic={wantedHelpTopic}
      onSelectTopic={selectHelpTopic}
      onClose={closeHelp}
      footer={(topic) => <QuizLink topic={topic} />}
    />
  );
}
