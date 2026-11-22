import { MAX_YEAR, MIN_YEAR } from "@anokoro/era-data";
import { HelpToggle } from "../help/HelpToggle.tsx";
import { useKit } from "../store.ts";
import styles from "./TimeMachineBar.module.css";

export const YEAR_SLIDER_ID = "kit-year-slider";

export function TimeMachineBar() {
  const year = useKit((s) => s.year);
  const setYear = useKit((s) => s.setYear);
  const stepYear = useKit((s) => s.stepYear);

  return (
    <div className={styles.bar} role="group" aria-label="タイムマシン">
      <span className={`${styles.label} dot`}>タイムマシン</span>
      <button
        type="button"
        className="btn"
        onClick={() => stepYear(-1)}
        disabled={year <= MIN_YEAR}
        aria-label="前の年へ"
      >
        ◀
      </button>
      <input
        id={YEAR_SLIDER_ID}
        type="range"
        className={styles.slider}
        min={MIN_YEAR}
        max={MAX_YEAR}
        step={1}
        value={year}
        onChange={(e) => setYear(e.currentTarget.valueAsNumber)}
        aria-label="年"
        aria-valuetext={`${year}年`}
      />
      <button
        type="button"
        className="btn"
        onClick={() => stepYear(1)}
        disabled={year >= MAX_YEAR}
        aria-label="次の年へ"
      >
        ▶
      </button>
      <output className={`${styles.year} sunken dot`} aria-live="polite">
        {year}年
      </output>
      <HelpToggle className={`btn ${styles.help}`}>この年の解説</HelpToggle>
    </div>
  );
}
