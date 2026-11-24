import { useId, useState, type ReactNode, type Ref } from "react";
import styles from "./Window.module.css";

export type TitleControl = "_" | "□" | "×" | "?";

export type WindowProps = {
  title: string;
  /** タイトルの前に付ける印（未保存の * など）。ウィンドウの名前には含めない */
  titleMark?: string;
  controls?: readonly TitleControl[];
  className?: string;
  children?: ReactNode;
  onClose?: () => void;
  role?: "dialog";
  ref?: Ref<HTMLElement>;
  tabIndex?: number;
};

export function Window({
  title,
  titleMark,
  controls = ["_", "×"],
  className,
  children,
  onClose,
  role,
  ref,
  tabIndex,
}: WindowProps) {
  const titleId = useId();
  const bodyId = useId();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const classes = [styles.win, isCollapsed && styles.collapsed, className]
    .filter(Boolean)
    .join(" ");
  return (
    <section
      ref={ref}
      role={role}
      tabIndex={tabIndex}
      className={classes}
      aria-labelledby={titleId}
    >
      <div className={styles.titlebar}>
        <h2 className={styles.title}>
          {titleMark && <span aria-hidden="true">{titleMark}</span>}
          <span id={titleId}>{title}</span>
        </h2>
        <span className={styles.controls}>
          {controls.map((control) =>
            control === "_" ? (
              <button
                key={control}
                type="button"
                className={styles.control}
                aria-label={isCollapsed ? "元に戻す" : "最小化"}
                aria-expanded={!isCollapsed}
                aria-controls={bodyId}
                onClick={() => setIsCollapsed((c) => !c)}
              >
                {control}
              </button>
            ) : control === "×" && onClose ? (
              <button
                key={control}
                type="button"
                className={`${styles.control} ${styles.close}`}
                aria-label="閉じる"
                onClick={onClose}
              >
                {control}
              </button>
            ) : (
              <i
                key={control}
                className={control === "×" ? `${styles.control} ${styles.close}` : styles.control}
                aria-hidden="true"
              >
                {control}
              </i>
            ),
          )}
        </span>
      </div>
      <div id={bodyId} className={styles.body} hidden={isCollapsed}>
        {children}
      </div>
    </section>
  );
}
