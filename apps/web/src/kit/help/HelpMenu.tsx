import { useEffect, useId, useRef, useState, type KeyboardEvent } from "react";
import { quizUrl } from "../../quiz/quiz-params.ts";
import { useKit } from "../store.ts";
import styles from "./HelpMenu.module.css";

/**
 * ウィンドウのメニューバーの「ヘルプ(H)」。解説と時代まちがいさがしを選ぶメニューを開く。
 * 解説が開いているときは、押すと解説を閉じる
 */
export function HelpMenu() {
  const helpOpen = useKit((s) => s.helpOpen);
  const openHelp = useKit((s) => s.openHelp);
  const closeHelp = useKit((s) => s.closeHelp);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const rootRef = useRef<HTMLSpanElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLUListElement>(null);
  const menuId = useId();

  useEffect(() => {
    if (!isMenuOpen) return;
    menuRef.current?.querySelector<HTMLElement>("[role=menuitem]")?.focus();
    const handlePointerDown = (e: PointerEvent): void => {
      if (e.target instanceof Node && !rootRef.current?.contains(e.target)) setIsMenuOpen(false);
    };
    document.addEventListener("pointerdown", handlePointerDown);
    return () => document.removeEventListener("pointerdown", handlePointerDown);
  }, [isMenuOpen]);

  const closeMenu = (): void => {
    setIsMenuOpen(false);
    buttonRef.current?.focus();
  };

  const handleButtonClick = (): void => {
    if (helpOpen) closeHelp();
    else setIsMenuOpen((open) => !open);
  };

  const handleOpenHelp = (): void => {
    closeMenu();
    openHelp();
  };

  const handleMenuKeyDown = (e: KeyboardEvent<HTMLUListElement>): void => {
    if (e.key === "Escape") {
      e.preventDefault();
      e.stopPropagation();
      closeMenu();
      return;
    }
    if (e.key !== "ArrowDown" && e.key !== "ArrowUp") return;
    e.preventDefault();
    const items = Array.from(
      menuRef.current?.querySelectorAll<HTMLElement>("[role=menuitem]") ?? [],
    );
    const current = items.findIndex((item) => item === document.activeElement);
    const delta = e.key === "ArrowDown" ? 1 : -1;
    items[(current + delta + items.length) % items.length]?.focus();
  };

  return (
    <span ref={rootRef} className={styles.root}>
      <button
        ref={buttonRef}
        type="button"
        className="menuLink"
        aria-haspopup="menu"
        aria-expanded={isMenuOpen}
        aria-controls={isMenuOpen ? menuId : undefined}
        onClick={handleButtonClick}
      >
        ヘルプ(H)
      </button>
      {isMenuOpen && (
        <ul
          ref={menuRef}
          id={menuId}
          role="menu"
          aria-label="ヘルプ"
          className={styles.menu}
          onKeyDown={handleMenuKeyDown}
        >
          <li role="none">
            <button type="button" role="menuitem" className={styles.item} onClick={handleOpenHelp}>
              この年の解説
            </button>
          </li>
          <li role="none">
            <a role="menuitem" className={styles.item} href={quizUrl(import.meta.env.BASE_URL)}>
              時代まちがいさがし
            </a>
          </li>
        </ul>
      )}
    </span>
  );
}
