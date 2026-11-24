import { quizUrl } from "../../../shared/routes/index.ts";
import { openBootScreen } from "../../../entities/boot/index.ts";
import { useKit } from "../../../entities/kit-state/index.ts";
import { YEAR_SLIDER_ID } from "../../../widgets/time-machine-bar/index.ts";
import { Taskbar, taskbarItemClass, taskbarLinkClass } from "../../../widgets/taskbar/index.ts";

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
