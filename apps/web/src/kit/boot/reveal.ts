import {
  REVEAL_TIMING,
  isOnScreen,
  outlinesAt,
  readingOrder,
  revealSchedule,
  type OutlineFrame,
  type Rect,
} from "./reveal-plan.ts";

export interface RevealRun {
  outlinesAt(elapsedMs: number): OutlineFrame[];
  cancel(): void;
}

/** 作成キットの直下の帯と、main の中のウィンドウ */
function revealTargets(root: HTMLElement): HTMLElement[] {
  const blocks = [...root.children].flatMap((child) =>
    child.tagName === "MAIN" ? [...child.querySelectorAll("section")] : [child],
  );
  const elements = blocks.filter((el): el is HTMLElement => el instanceof HTMLElement);
  return elements.filter((el) => !elements.some((other) => other !== el && other.contains(el)));
}

function toRect({ x, y, width, height }: DOMRect): Rect {
  return { x, y, width, height };
}

export function startReveal(root: HTMLElement): RevealRun {
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const candidates = revealTargets(root)
    .map((el) => ({ el, rect: toRect(el.getBoundingClientRect()) }))
    .filter(({ rect }) => isOnScreen(rect, vw, vh));
  const targets = readingOrder(candidates.map((c) => c.rect)).map((i) => candidates[i]!);
  const schedule = revealSchedule(targets.length);
  const animations = targets.flatMap(({ el }, i) =>
    typeof el.animate === "function"
      ? [
          el.animate([{ opacity: 0 }, { opacity: 1 }], {
            delay: schedule[i]!.showMs,
            duration: REVEAL_TIMING.showMs,
            easing: "ease-out",
            fill: "backwards",
          }),
        ]
      : [],
  );
  const origin: Rect = { x: vw / 2, y: vh / 2, width: 0, height: 0 };
  const rects = targets.map((t) => t.rect);
  return {
    outlinesAt: (elapsedMs) => outlinesAt(rects, schedule, origin, elapsedMs),
    cancel: () => {
      for (const animation of animations) animation.cancel();
    },
  };
}
