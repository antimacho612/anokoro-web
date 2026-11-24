import { hostingSpaceForYear, type Year } from "@anokoro/era-data";
import type { SitePage } from "@anokoro/shared";
import { useEffect, useMemo, useState, type KeyboardEvent, type RefObject } from "react";
import { flushSync } from "react-dom";
import { FontSizeMenu } from "../../../features/source-font-size/index.ts";
import { SOURCE_FONT_PX, useSourceFontSize } from "../../../features/source-font-size/index.ts";
import { Window } from "../../../shared/ui/window/index.ts";
import { HelpMenu } from "../../../features/help/index.ts";
import { slotClass } from "../../../shared/ui/kit-layout/index.ts";
import { useKit } from "../../../entities/kit-state/index.ts";
import styles from "./Notepad.module.css";
import {
  normalizePagePath,
  nextPagePath,
  newPageHtml,
  pagePathProblem,
  canAddPage,
} from "../../../entities/site/index.ts";
import { siteUsageBytes } from "../../../entities/site/index.ts";
import { loadTemplatePages, templatePageHtml } from "../../../entities/sample/index.ts";
import { menuItemClass, MenuBarMenu } from "../../../shared/ui/menu-bar-menu/index.ts";
import { useWorkspace, workspace } from "../../../features/site-workspace/index.ts";
import { PageNameDialog } from "../../../features/site-workspace/index.ts";
import { BLANK } from "../../../entities/site/index.ts";
import { formatUsage, insertText, offsetOf } from "../lib/text-edit.ts";

/** 入力が止まってからローカル表示を更新するまでの時間 */
const SHOW_DELAY_MS = 350;

interface PendingConfirm {
  message: string;
  source: Promise<string>;
}

type SiteUsageProps = {
  pages: readonly SitePage[];
  year: Year;
};

function SiteUsage({ pages, year }: SiteUsageProps) {
  const bytes = useMemo(() => siteUsageBytes(pages, year), [pages, year]);
  const limit = hostingSpaceForYear(year).bytes;
  const isOver = bytes > limit;
  return (
    <span className={isOver ? `${styles.size} ${styles.over}` : styles.size}>
      {formatUsage(bytes, limit)}
      {isOver && <span className={styles.overNote}>容量オーバー（当時なら公開できません）</span>}
    </span>
  );
}

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

export function moveNotepadCaret(textarea: HTMLTextAreaElement, line: number, col: number): void {
  placeCaretAndScrollByRefocus(textarea, offsetOf(textarea.value, line, col));
}

function placeCaretAndScrollByRefocus(textarea: HTMLTextAreaElement, offset: number): void {
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
  const [fontSize, setFontSize] = useSourceFontSize();
  const [confirm, setConfirm] = useState<PendingConfirm | null>(null);
  const [isNaming, setIsNaming] = useState(false);
  const pagePath = useKit((s) => s.pagePath);
  const year = useKit((s) => s.year);
  const isDirty = useWorkspace((s) => s.dirty);
  const site = useWorkspace((s) => s.sites.find((x) => x.id === s.currentId));
  const usagePages = useMemo(
    () => [
      ...(site?.pages ?? []).filter((p) => p.path !== pagePath),
      { path: pagePath, html: shownSource },
    ],
    [site, pagePath, shownSource],
  );

  const askReset = (): void =>
    setConfirm({
      message: "いま書いている内容は消えます。テンプレートに戻しますか？",
      source: loadTemplatePages(site?.genre ?? "personal", year).then((pages) =>
        templatePageHtml(pages, pagePath),
      ),
    });
  const askClear = (): void =>
    setConfirm({
      message: "いま書いている内容は消えます。白紙から書きますか？",
      source: Promise.resolve(BLANK),
    });

  useEffect(() => {
    if (source === shownSource) return;
    const timer = setTimeout(show, SHOW_DELAY_MS);
    return () => clearTimeout(timer);
  }, [source, shownSource, show]);

  const onKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>): void => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "s") {
      e.preventDefault();
      void workspace.flush();
      return;
    }
    if (e.key !== "Tab") return;
    e.preventDefault();
    insertIntoNotepad(e.currentTarget, "\t", edit);
  };

  const accept = (): void => {
    if (confirm) void confirm.source.then(replace, () => undefined);
    setConfirm(null);
  };

  return (
    <Window
      title={`${pagePath} - メモ帳`}
      titleMark={isDirty ? "*" : undefined}
      controls={["_", "□", "×"]}
      className={slotClass.notepad}
    >
      <div className="menubar">
        <MenuBarMenu label="ファイル(F)" menuLabel="ファイル">
          {(close) => (
            <>
              <li role="none">
                <button
                  type="button"
                  role="menuitem"
                  className={menuItemClass}
                  disabled={!site || !canAddPage(site)}
                  onClick={() => {
                    close();
                    setIsNaming(true);
                  }}
                >
                  新規(N)...
                </button>
              </li>
              {site?.pages.map((page) => (
                <li role="none" key={page.path}>
                  <button
                    type="button"
                    role="menuitem"
                    className={menuItemClass}
                    onClick={() => {
                      close();
                      workspace.openPage(page.path);
                    }}
                  >
                    開く(O)：{page.path}
                  </button>
                </li>
              ))}
              <li role="none">
                <button
                  type="button"
                  role="menuitem"
                  className={menuItemClass}
                  onClick={() => {
                    close();
                    void workspace.flush();
                  }}
                >
                  上書き保存(S)
                </button>
              </li>
            </>
          )}
        </MenuBarMenu>
        <span>編集(E)</span>
        <span>書式(O)</span>
        <FontSizeMenu size={fontSize} onChange={setFontSize} />
        <HelpMenu />
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
        style={{ whiteSpace: wrap ? "pre-wrap" : "pre", fontSize: SOURCE_FONT_PX[fontSize] }}
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
        <button type="button" className="btn" onClick={askReset}>
          テンプレートに戻す
        </button>
        <button type="button" className="btn" onClick={askClear}>
          白紙から書く
        </button>
        <SiteUsage pages={usagePages} year={year} />
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
      {isNaming && site && (
        <PageNameDialog
          title="新しいページ"
          initial={nextPagePath(site)}
          normalize={normalizePagePath}
          validate={(path) => pagePathProblem(site, path)}
          onSubmit={(path) => {
            setIsNaming(false);
            void workspace.addPage(path, newPageHtml(path));
          }}
          onCancel={() => setIsNaming(false)}
        />
      )}
    </Window>
  );
}
