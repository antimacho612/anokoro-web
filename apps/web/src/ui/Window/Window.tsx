import { useId, type ReactNode } from "react";
import styles from "./Window.module.css";

export type TitleControl = "_" | "□" | "×" | "?";

export type WindowProps = {
  title: string;
  controls?: readonly TitleControl[];
  className?: string;
  children?: ReactNode;
};

export function Window({ title, controls = ["_", "×"], className, children }: WindowProps) {
  const titleId = useId();
  return (
    <section
      className={className ? `${styles.win} ${className}` : styles.win}
      aria-labelledby={titleId}
    >
      <div className={styles.titlebar}>
        <h2 id={titleId} className={styles.title}>
          {title}
        </h2>
        <span className={styles.controls} aria-hidden="true">
          {controls.map((control) => (
            <i key={control} className={control === "×" ? styles.close : undefined}>
              {control}
            </i>
          ))}
        </span>
      </div>
      <div className={styles.body}>{children}</div>
    </section>
  );
}
