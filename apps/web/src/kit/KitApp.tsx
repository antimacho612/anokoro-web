import { checkEra, type SourceLocation } from "@anokoro/era-checker";
import { useRef } from "react";
import { BrowserWindow } from "./browser/BrowserWindow.tsx";
import { CheckerWindow } from "./checker/CheckerWindow.tsx";
import { HelpWindow } from "./help/HelpWindow.tsx";
import styles from "./KitApp.module.css";
import { KitLayout } from "./layout/KitLayout.tsx";
import { LineWindow } from "./line/LineWindow.tsx";
import { Notepad, insertIntoNotepad, moveNotepadCaret } from "./notepad/Notepad.tsx";
import { PartsBox } from "./parts/PartsBox.tsx";
import { useKit } from "./store.ts";
import { TimeMachineBar } from "./time-machine/TimeMachineBar.tsx";

export function KitApp() {
  const year = useKit((s) => s.year);
  const shownSource = useKit((s) => s.shownSource);
  const counter = useKit((s) => s.counter);
  const replace = useKit((s) => s.replace);
  const notepadRef = useRef<HTMLTextAreaElement>(null);

  const view = checkEra(shownSource, { year, mode: "local", counter });

  const handleInsert = (text: string): void => {
    if (notepadRef.current) insertIntoNotepad(notepadRef.current, text, replace);
  };

  const handleLocate = ({ line, col }: SourceLocation): void => {
    if (notepadRef.current) moveNotepadCaret(notepadRef.current, line, col);
  };

  const left = (
    <>
      <Notepad textareaRef={notepadRef} />
      <PartsBox onInsert={handleInsert} />
    </>
  );

  const right = (
    <>
      <BrowserWindow html={view.html} pageTitle={view.title} />
      <LineWindow />
      <CheckerWindow score={view.score} warnings={view.warnings} onLocate={handleLocate} />
      <HelpWindow />
    </>
  );

  return (
    <>
      <header className={styles.top}>
        <h1 className="dot">あのころ Web ホームページ作成キット</h1>
        <p>
          メモ帳にHTMLを書くと、選んだ年のブラウザでの見え方を再現します。時代に合わないタグやCSSは「時代チェッカー」が見つけて無効化します。
        </p>
      </header>
      <TimeMachineBar />
      <main>
        <KitLayout left={left} right={right} />
      </main>
    </>
  );
}
