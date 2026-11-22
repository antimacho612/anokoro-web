import type { ReactNode } from "react";
import { useKit } from "../store.ts";

type HelpToggleProps = {
  className: string;
  children: ReactNode;
};

/** 開いているトピックのままヘルプを開閉するボタン */
export function HelpToggle({ className, children }: HelpToggleProps) {
  const helpOpen = useKit((s) => s.helpOpen);
  const toggleHelp = useKit((s) => s.toggleHelp);
  return (
    <button
      type="button"
      className={className}
      aria-haspopup="dialog"
      aria-expanded={helpOpen}
      onClick={toggleHelp}
    >
      {children}
    </button>
  );
}
