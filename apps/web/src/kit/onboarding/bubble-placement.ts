export interface Rect {
  top: number;
  left: number;
  width: number;
  height: number;
}

export interface Size {
  width: number;
  height: number;
}

export type BubblePlacement = { kind: "docked" } | { kind: "floating"; top: number; left: number };

interface PlaceBubbleInput {
  target: Rect;
  bubble: Size;
  viewport: Size;
  gap: number;
}

const clamp = (value: number, min: number, max: number): number =>
  Math.min(Math.max(value, min), Math.max(min, max));

/** 対象の右、左、下、上の順に、画面に収まる場所を探す。どこにも収まらなければ画面の下端に置く */
export function placeBubble({ target, bubble, viewport, gap }: PlaceBubbleInput): BubblePlacement {
  const sideTop = clamp(target.top, gap, viewport.height - bubble.height - gap);
  const stackLeft = clamp(target.left, gap, viewport.width - bubble.width - gap);

  const right = target.left + target.width + gap;
  if (right + bubble.width <= viewport.width - gap) {
    return { kind: "floating", top: sideTop, left: right };
  }
  const left = target.left - gap - bubble.width;
  if (left >= gap) {
    return { kind: "floating", top: sideTop, left };
  }
  const below = target.top + target.height + gap;
  if (below + bubble.height <= viewport.height - gap) {
    return { kind: "floating", top: below, left: stackLeft };
  }
  const above = target.top - gap - bubble.height;
  if (above >= gap) {
    return { kind: "floating", top: above, left: stackLeft };
  }
  return { kind: "docked" };
}
