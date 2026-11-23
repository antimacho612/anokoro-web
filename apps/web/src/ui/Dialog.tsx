import { useRef, type ReactNode } from "react";
import styles from "./Dialog.module.css";
import { Window } from "./Window/Window.tsx";
import { useDialogFocus } from "./Window/useDialogFocus.ts";

export const dialogClass = {
  body: styles.body,
  buttons: styles.buttons,
  field: styles.field,
  error: styles.error,
};

type DialogProps = {
  title: string;
  onClose: () => void;
  size?: "normal" | "wide";
  children: ReactNode;
};

/** 画面に重ねて出すウィンドウ風の確認や入力のダイアログ。ブラウザ標準の confirm の代わりに使う */
export function Dialog({ title, onClose, size = "normal", children }: DialogProps) {
  const dialogRef = useRef<HTMLElement>(null);
  useDialogFocus(dialogRef, onClose);
  return (
    <div className={styles.backdrop}>
      <Window
        ref={dialogRef}
        role="dialog"
        tabIndex={-1}
        title={title}
        controls={["×"]}
        className={`${styles.dialog} ${size === "wide" ? styles.wide : ""}`}
        onClose={onClose}
      >
        {children}
      </Window>
    </div>
  );
}

type ConfirmDialogProps = {
  title?: string;
  message: ReactNode;
  confirmLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
};

export function ConfirmDialog({
  title = "確認",
  message,
  confirmLabel = "はい(Y)",
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  return (
    <Dialog title={title} onClose={onCancel}>
      <div className={styles.body}>{message}</div>
      <div className={styles.buttons}>
        <button type="button" className="btn" onClick={onConfirm}>
          {confirmLabel}
        </button>
        <button type="button" className="btn" onClick={onCancel}>
          いいえ(N)
        </button>
      </div>
    </Dialog>
  );
}
