import { useEffect, useState, type KeyboardEvent, type RefObject } from "react";
import { flushSync } from "react-dom";
import { Window } from "../../ui/Window/Window.tsx";
import { HelpToggle } from "../help/HelpToggle.tsx";
import { slotClass } from "../layout/KitLayout.tsx";
import { useKit } from "../store.ts";
import styles from "./Notepad.module.css";
import { BLANK, TEMPLATE } from "./templates.ts";
import { byteLength, formatUsage, insertText, offsetOf } from "./text-edit.ts";

/** 入力が止まってからローカル表示を更新するまでの時間 */
const SHOW_DELAY_MS = 350;

interface PendingConfirm {
  message: string;
  source: string;
}

const RESET: PendingConfirm = {
  message: "いま書いている内容は消えます。テンプレートに戻しますか？",
  source: TEMPLATE,
};
const CLEAR: PendingConfirm = {
  message: "いま書いている内容は消えます。白紙から書きますか？",
  source: BLANK,
};

/** メモ帳の選択範囲に text を入れ、カーソルを挿入した文字の後ろに置く */
export function insertIntoNotepad(
  textarea: HTMLTextAreaElement,
  text: string,
  apply: (source: string) => void,
): void {
  const { value, caret } = insertText(
    textarea.value,
    textarea.selectionStart,
    textarea.selectionEnd,
    text,
  );
  flushSync(() => apply(value));
  textarea.focus();
  textarea.setSelectionRange(caret, caret);
}

/** メモ帳の line 行 col 桁にカーソルを置き、その行が見えるようにする */
export function moveNotepadCaret(textarea: HTMLTextAreaElement, line: number, col: number): void {
  const offset = offsetOf(textarea.value, line, col);
  textarea.blur();
  textarea.setSelectionRange(offset, offset);
  textarea.focus();
}

type NotepadProps = {
  textareaRef: RefObject<HTMLTextAreaElement | null>;
};

export function Notepad({ textareaRef }: NotepadProps) {
  const source = useKit((s) => s.source);
  const shownSource = useKit((s) => s.shownSource);
  const edit = useKit((s) => s.edit);
  const show = useKit((s) => s.show);
  const replace = useKit((s) => s.replace);
  const [wrap, setWrap] = useState(true);
  const [confirm, setConfirm] = useState<PendingConfirm | null>(null);

  useEffect(() => {
    if (source === shownSource) return;
    const timer = setTimeout(show, SHOW_DELAY_MS);
    return () => clearTimeout(timer);
  }, [source, shownSource, show]);

  const onKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>): void => {
    if (e.key !== "Tab") return;
    e.preventDefault();
    insertIntoNotepad(e.currentTarget, "\t", edit);
  };

  const accept = (): void => {
    if (confirm) replace(confirm.source);
    setConfirm(null);
  };

  return (
    <Window title="index.html - メモ帳" controls={["_", "□", "×"]} className={slotClass.notepad}>
      <div className="menubar">
        <span>ファイル(F)</span>
        <span>編集(E)</span>
        <span>書式(O)</span>
        <HelpToggle className="menuLink">ヘルプ(H)</HelpToggle>
        <label>
          <input
            type="checkbox"
            checked={wrap}
            onChange={(e) => setWrap(e.currentTarget.checked)}
          />
          右端で折り返す
        </label>
      </div>
      <textarea
        ref={textareaRef}
        className={`${styles.src} sunken`}
        style={{ whiteSpace: wrap ? "pre-wrap" : "pre" }}
        wrap={wrap ? "soft" : "off"}
        value={source}
        onChange={(e) => edit(e.currentTarget.value)}
        onKeyDown={onKeyDown}
        spellCheck={false}
        autoCapitalize="off"
        autoComplete="off"
        aria-label="HTML"
      />
      <div className={styles.toolrow}>
        <button type="button" className="btn" onClick={() => setConfirm(RESET)}>
          テンプレートに戻す
        </button>
        <button type="button" className="btn" onClick={() => setConfirm(CLEAR)}>
          白紙から書く
        </button>
        <span className={styles.size}>{formatUsage(byteLength(source))}</span>
      </div>
      {confirm && (
        <div className="group" role="alertdialog" aria-label="確認">
          <b>確認</b>
          <p className={styles.confirmMessage}>{confirm.message}</p>
          <div className={styles.confirmButtons}>
            <button type="button" className="btn" onClick={accept}>
              はい(Y)
            </button>
            <button type="button" className="btn" onClick={() => setConfirm(null)}>
              いいえ(N)
            </button>
          </div>
        </div>
      )}
    </Window>
  );
}
