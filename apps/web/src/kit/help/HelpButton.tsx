import type { TopicId } from "@anokoro/era-checker";
import { useKit } from "../store.ts";
import styles from "./HelpButton.module.css";

type HelpButtonProps = {
  topic: TopicId;
};

export function HelpButton({ topic }: HelpButtonProps) {
  const openHelp = useKit((s) => s.openHelp);
  return (
    <button type="button" className={`btn ${styles.button}`} onClick={() => openHelp(topic)}>
      解説
    </button>
  );
}
