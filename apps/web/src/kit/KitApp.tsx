import { checkEra, type SourceLocation } from "@anokoro/era-checker";
import { useRef } from "react";
import { BrowserWindow } from "./browser/BrowserWindow.tsx";
import { CheckerWindow } from "./checker/CheckerWindow.tsx";
import { HelpWindow } from "./help/HelpWindow.tsx";
import { InfoWindow } from "./info/InfoWindow.tsx";
import styles from "./KitApp.module.css";
import { KitLayout } from "./layout/KitLayout.tsx";
import { LineWindow } from "./line/LineWindow.tsx";
import { Notepad, insertIntoNotepad, moveNotepadCaret } from "./notepad/Notepad.tsx";
import { PartsBox } from "./parts/PartsBox.tsx";
import { MyComputer } from "./sites/MyComputer.tsx";
import { workspace } from "./sites/instance.ts";
import { useKit } from "./store.ts";
import { NOT_FOUND_TITLE, notFoundPage } from "../site/not-found-page.ts";
import { KitTaskbar } from "./taskbar/KitTaskbar.tsx";
import { TimeMachineBar } from "./time-machine/TimeMachineBar.tsx";

export function KitApp() {
  const year = useKit((s) => s.year);
  const shownSource = useKit((s) => s.shownSource);
  const counter = useKit((s) => s.counter);
  const replace = useKit((s) => s.replace);
  const notFoundUrl = useKit((s) => s.notFoundUrl);
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
      <MyComputer />
      <Notepad textareaRef={notepadRef} />
      <PartsBox onInsert={handleInsert} />
    </>
  );

  const right = (
    <>
      <BrowserWindow
        html={notFoundUrl === null ? view.html : notFoundPage(notFoundUrl)}
        pageTitle={notFoundUrl === null ? view.title : NOT_FOUND_TITLE}
        navigator={workspace}
      />
      <LineWindow />
      <CheckerWindow score={view.score} warnings={view.warnings} onLocate={handleLocate} />
      <HelpWindow />
      <InfoWindow />
    </>
  );

  return (
    <>
      <KitTaskbar />
      <header className={styles.top}>
        <h1 className="dot">あのころ Web 作成キット</h1>
      </header>
      <TimeMachineBar />
      <main>
        <KitLayout left={left} right={right} />
      </main>
    </>
  );
}
