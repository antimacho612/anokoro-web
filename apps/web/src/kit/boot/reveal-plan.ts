export interface Rect {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface RevealStep {
  /** 枠線が広がり始める時刻（デスクトップが現れる場面の始まりから） */
  startMs: number;
  /** ウィンドウを見せ始める時刻 */
  showMs: number;
}

export interface OutlineFrame {
  rect: Rect;
  alpha: number;
}

export const REVEAL_TIMING = {
  firstMs: 120,
  staggerMaxMs: 55,
  spreadMs: 330,
  growMs: 180,
  showMs: 140,
  trail: 3,
  trailGapMs: 35,
} as const;

export function revealSchedule(count: number): RevealStep[] {
  const { firstMs, staggerMaxMs, spreadMs, growMs } = REVEAL_TIMING;
  const stagger = count > 1 ? Math.min(staggerMaxMs, spreadMs / (count - 1)) : 0;
  return Array.from({ length: count }, (_, i) => {
    const startMs = firstMs + i * stagger;
    return { startMs, showMs: startMs + growMs };
  });
}

/** 画面の上から順、同じ高さなら左から順 */
export function readingOrder(rects: readonly Rect[]): number[] {
  return rects
    .map((rect, index) => ({ rect, index }))
    .sort((a, b) => a.rect.y - b.rect.y || a.rect.x - b.rect.x)
    .map(({ index }) => index);
}

export function isOnScreen(rect: Rect, viewportWidth: number, viewportHeight: number): boolean {
  return (
    rect.width > 0 &&
    rect.height > 0 &&
    rect.x < viewportWidth &&
    rect.y < viewportHeight &&
    rect.x + rect.width > 0 &&
    rect.y + rect.height > 0
  );
}

const lerp = (a: number, b: number, t: number): number => a + (b - a) * t;
const easeOut = (t: number): number => 1 - (1 - t) ** 2;

function between(from: Rect, to: Rect, t: number): Rect {
  return {
    x: lerp(from.x, to.x, t),
    y: lerp(from.y, to.y, t),
    width: lerp(from.width, to.width, t),
    height: lerp(from.height, to.height, t),
  };
}

/** 古い OS のウィンドウを開くときのように、origin から各ウィンドウへ広がる枠線 */
export function outlinesAt(
  targets: readonly Rect[],
  schedule: readonly RevealStep[],
  origin: Rect,
  elapsedMs: number,
): OutlineFrame[] {
  const { growMs, trail, trailGapMs } = REVEAL_TIMING;
  const frames: OutlineFrame[] = [];
  targets.forEach((target, i) => {
    const step = schedule[i];
    if (!step) return;
    for (let k = 0; k < trail; k++) {
      const t = (elapsedMs - step.startMs - k * trailGapMs) / growMs;
      if (t <= 0 || t >= 1) continue;
      frames.push({ rect: between(origin, target, easeOut(t)), alpha: 0.9 - k * 0.28 });
    }
  });
  return frames;
}
