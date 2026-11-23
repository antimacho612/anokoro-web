import type { ReactNode } from "react";
import styles from "./KitLayout.module.css";

export type KitSlot = "computer" | "notepad" | "parts" | "browser" | "line" | "checker";

/** 1 列表示のときの並び順をスロットのクラスで決める */
export const slotClass: Record<KitSlot, string> = {
  computer: styles.computer,
  notepad: styles.notepad,
  parts: styles.parts,
  browser: styles.browser,
  line: styles.line,
  checker: styles.checker,
};

type KitLayoutProps = {
  left: ReactNode;
  right: ReactNode;
};

export function KitLayout({ left, right }: KitLayoutProps) {
  return (
    <div className={styles.layout}>
      <div className={styles.col}>{left}</div>
      <div className={styles.col}>{right}</div>
    </div>
  );
}
