import { useId, useState, type ReactNode, type Ref } from "react";
import styles from "./Window.module.css";

export type TitleControl = "_" | "□" | "×" | "?";

export type WindowProps = {
  title: string;
  controls?: readonly TitleControl[];
  className?: string;
  children?: ReactNode;
  /** 渡すと × を閉じるボタンにする */
  onClose?: () => void;
  role?: "dialog";
  ref?: Ref<HTMLElement>;
  tabIndex?: number;
};

export function Window({
  title,
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
        <h2 id={titleId} className={styles.title}>
          {title}
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
