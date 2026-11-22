import type { Warning } from "@anokoro/era-checker";
import { Window } from "../../ui/Window/Window.tsx";
import { slotClass } from "../layout/KitLayout.tsx";
import { useKit } from "../store.ts";
import styles from "./CheckerWindow.module.css";

type CheckerWindowProps = {
  score: number;
  warnings: readonly Warning[];
};

const LEVEL_LABEL: Record<Warning["level"], string> = {
  future: "未来の技術",
  note: "注意",
};

export function CheckerWindow({ score, warnings }: CheckerWindowProps) {
  const year = useKit((s) => s.year);
  const kiriban = useKit((s) => s.kiriban);

  return (
    <Window title={`時代チェッカー - ${year}年モード`} className={slotClass.checker}>
      {kiriban !== null && (
        <div className={styles.kiri} role="alert">
          ★☆ キリ番 {kiriban} ゲット！おめでとうございます！掲示板で報告してね ☆★
        </div>
      )}
      <div className={styles.score}>
        <b className="dot">再現度 {score}%</b>
        <div
          className={`${styles.meter} sunken`}
          role="meter"
          aria-label="再現度"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={score}
        >
          <i style={{ width: `${score}%` }} />
        </div>
      </div>
      <ul className={`${styles.warns} sunken`}>
        {warnings.length === 0 ? (
          <li>
            <span className={`${styles.tag} ${styles.ok}`}>OK</span>
            <span>時代考証バッチリ！{year}年の香りがします。</span>
          </li>
        ) : (
          warnings.map((w) => (
            <li key={`${w.ruleId}:${w.message}`}>
              <span className={`${styles.tag} ${styles[w.level]}`}>{LEVEL_LABEL[w.level]}</span>
              <span className={styles.message}>{w.message}</span>
              {w.count > 1 && <span className={styles.count}>×{w.count}</span>}
            </li>
          ))
        )}
      </ul>
    </Window>
  );
}
