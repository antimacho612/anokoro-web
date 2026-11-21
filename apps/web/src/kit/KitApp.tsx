import { checkEra } from "@anokoro/era-checker";
import { useRef } from "react";
import { Window } from "../ui/Window/Window.tsx";
import { BrowserWindow } from "./browser/BrowserWindow.tsx";
import { CheckerWindow } from "./checker/CheckerWindow.tsx";
import styles from "./KitApp.module.css";
import { KitLayout, slotClass } from "./layout/KitLayout.tsx";
import { Notepad, insertIntoNotepad } from "./notepad/Notepad.tsx";
import { PartsBox } from "./parts/PartsBox.tsx";
import { useKit } from "./store.ts";
import { TimeMachineBar } from "./time-machine/TimeMachineBar.tsx";

function Pending() {
  return <p className="hint">準備中です。</p>;
}

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

  const left = (
    <>
      <Notepad textareaRef={notepadRef} />
      <PartsBox onInsert={handleInsert} />
    </>
  );

  const right = (
    <>
      <BrowserWindow html={view.html} pageTitle={view.title} />
      <Window title="回線とダイヤルアップ接続" className={slotClass.line}>
        <Pending />
      </Window>
      <CheckerWindow score={view.score} warnings={view.warnings} />
      <Window title="ヘルプ - あのころのWeb解説" controls={["?", "×"]} className={slotClass.help}>
        <Pending />
      </Window>
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
