import { quizUrl } from "../../quiz/quiz-params.ts";
import { openBootScreen } from "../boot/boot-store.ts";
import { useKit } from "../store.ts";
import { YEAR_SLIDER_ID } from "../time-machine/TimeMachineBar.tsx";
import { Taskbar, taskbarItemClass, taskbarLinkClass } from "./Taskbar.tsx";

function focusYearSlider(): void {
  const slider = document.getElementById(YEAR_SLIDER_ID);
  if (!slider) return;
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  slider.scrollIntoView({ block: "center", behavior: reduceMotion ? "auto" : "smooth" });
  slider.focus({ preventScroll: true });
}

export function KitTaskbar() {
  const year = useKit((s) => s.year);
  return (
    <Taskbar
      links={
        <a className={taskbarLinkClass} href={quizUrl(import.meta.env.BASE_URL)}>
          まちがいさがし
        </a>
      }
      tools={
        <button type="button" className={taskbarItemClass} onClick={openBootScreen}>
          起動をもう一度見る
        </button>
      }
      copyLabel="この年の URL をコピー"
      copiedNotice={`${year}年のURLをコピーしました`}
      onYearClick={focusYearSlider}
      yearLabel={`${year}年（タイムマシンへ移動）`}
    />
  );
}
