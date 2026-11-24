import { quizTopics } from "@anokoro/quiz";
import type { TopicId } from "@anokoro/era-checker";
import { quizUrl } from "../../../shared/routes/index.ts";
import { useKit } from "../../../entities/kit-state/index.ts";
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

export function HelpWindow() {
  const helpOpen = useKit((s) => s.helpOpen);
  return helpOpen ? <HelpDialog /> : null;
}

function HelpDialog() {
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
