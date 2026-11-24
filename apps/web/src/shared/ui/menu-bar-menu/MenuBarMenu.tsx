import { useEffect, useId, useRef, useState, type KeyboardEvent, type ReactNode } from "react";
import styles from "./MenuBarMenu.module.css";

export const menuItemClass = styles.item;

type MenuBarMenuProps = {
  label: string;
  menuLabel: string;
  /** メニューを開く前に呼ぶ。true を返すとメニューを開かない */
  onBeforeOpen?: () => boolean;
  /** close を呼ぶとメニューを閉じ、ボタンにフォーカスを戻す */
  children: (close: () => void) => ReactNode;
};

/** ウィンドウのメニューバーのドロップダウン。項目は role="menuitem" などを付けて children で渡す */
export function MenuBarMenu({ label, menuLabel, onBeforeOpen, children }: MenuBarMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const rootRef = useRef<HTMLSpanElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLUListElement>(null);
  const menuId = useId();

  useEffect(() => {
    if (!isOpen) return;
    const items = menuItems(menuRef.current);
    (items.find((item) => item.getAttribute("aria-checked") === "true") ?? items[0])?.focus();
    const handlePointerDown = (e: PointerEvent): void => {
      if (e.target instanceof Node && !rootRef.current?.contains(e.target)) setIsOpen(false);
    };
    document.addEventListener("pointerdown", handlePointerDown);
    return () => document.removeEventListener("pointerdown", handlePointerDown);
  }, [isOpen]);

  const close = (): void => {
    setIsOpen(false);
    buttonRef.current?.focus();
  };

  const handleButtonClick = (): void => {
    if (!isOpen && onBeforeOpen?.()) return;
    setIsOpen((open) => !open);
  };

  const handleMenuKeyDown = (e: KeyboardEvent<HTMLUListElement>): void => {
    if (e.key === "Escape") {
      e.preventDefault();
      e.stopPropagation();
      close();
      return;
    }
    if (e.key !== "ArrowDown" && e.key !== "ArrowUp") return;
    e.preventDefault();
    const items = menuItems(menuRef.current);
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
        aria-expanded={isOpen}
        aria-controls={isOpen ? menuId : undefined}
        onClick={handleButtonClick}
      >
        {label}
      </button>
      {isOpen && (
        <ul
          ref={menuRef}
          id={menuId}
          role="menu"
          aria-label={menuLabel}
          className={styles.menu}
          onKeyDown={handleMenuKeyDown}
        >
          {children(close)}
        </ul>
      )}
    </span>
  );
}

function menuItems(menu: HTMLUListElement | null): HTMLElement[] {
  return Array.from(menu?.querySelectorAll<HTMLElement>("[role^=menuitem]") ?? []);
}
