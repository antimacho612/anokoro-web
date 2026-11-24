import { checkEra, type SourceLocation } from "@anokoro/era-checker";
import { useRef } from "react";
import { BrowserWindow } from "../../../widgets/browser-window/index.ts";
import { CheckerWindow } from "../../../widgets/checker-window/index.ts";
import { HelpWindow } from "../../../widgets/help-window/index.ts";
import { InfoWindow } from "../../../widgets/info-window/index.ts";
import styles from "./KitApp.module.css";
import { KitLayout } from "../../../shared/ui/kit-layout/index.ts";
import { LineWindow } from "../../../widgets/line-window/index.ts";
import { Notepad, insertIntoNotepad, moveNotepadCaret } from "../../../widgets/notepad/index.ts";
import { PartsBox } from "../../../widgets/parts-box/index.ts";
import { MyComputer } from "../../../widgets/my-computer/index.ts";
import { workspace } from "../../../features/site-workspace/index.ts";
import { useKit } from "../../../entities/kit-state/index.ts";
import { NOT_FOUND_TITLE, notFoundPage } from "../../../entities/site/index.ts";
import { KitTaskbar } from "./KitTaskbar.tsx";
import { TimeMachineBar } from "../../../widgets/time-machine-bar/index.ts";

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
