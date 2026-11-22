export type Point = readonly [number, number];

/** 机に寝かせて置いた物の面。斜め上から見るので、奥行きが縮んで見える */
export interface DeskPlane {
  /** 物の中心を原点に、物の向きに沿った座標を、絵の座標へ写す */
  at: (u: number, v: number) => Point;
  /** 物の座標で描いた図形を、机に置いた形にする SVG の transform */
  transform: string;
}

interface DeskPlaneOptions {
  x: number;
  y: number;
  /** 机の上での向き（度） */
  angle: number;
  /** 奥行きの縮み方 */
  squash: number;
}

const fixed = (n: number): string => n.toFixed(4);

export function deskPlane({ x, y, angle, squash }: DeskPlaneOptions): DeskPlane {
  const rad = (angle * Math.PI) / 180;
  const cos = Math.cos(rad);
  const sin = Math.sin(rad);
  return {
    at: (u, v) => [x + cos * u - sin * v, y + squash * (sin * u + cos * v)],
    transform: `matrix(${[cos, squash * sin, -sin, squash * cos, x, y].map(fixed).join(" ")})`,
  };
}

/** 中心を原点にした、角の丸い長方形の輪郭。見た目で時計回り */
export function roundedRect(width: number, height: number, radius: number, steps = 3): Point[] {
  const hw = width / 2;
  const hh = height / 2;
  const r = Math.min(radius, hw, hh);
  const corners: readonly (readonly [number, number, number])[] = [
    [hw - r, -hh + r, -90],
    [hw - r, hh - r, 0],
    [-hw + r, hh - r, 90],
    [-hw + r, -hh + r, 180],
  ];
  return corners.flatMap(([cx, cy, from]) =>
    Array.from({ length: steps + 1 }, (_, i): Point => {
      const rad = ((from + (90 * i) / steps) * Math.PI) / 180;
      return [cx + r * Math.cos(rad), cy + r * Math.sin(rad)];
    }),
  );
}

/** 中心を原点にした円の輪郭。見た目で時計回り */
export function circle(radius: number, steps = 48): Point[] {
  return Array.from({ length: steps }, (_, i): Point => {
    const rad = (i / steps) * Math.PI * 2;
    return [radius * Math.cos(rad), radius * Math.sin(rad)];
  });
}

export interface SideFace {
  points: Point[];
  /** 左上の明かりへの向き。-1 で背を向け、1 で正面から受ける */
  light: number;
}

/**
 * 厚みのある板を斜め上から見たときに、手前に見える側面。
 * 輪郭は絵の座標で渡し、厚みは絵の上での下向きの長さ
 */
export function visibleSides(outline: readonly Point[], depth: number): SideFace[] {
  const area = outline.reduce((sum, [x0, y0], i) => {
    const [x1, y1] = outline[(i + 1) % outline.length] ?? [x0, y0];
    return sum + x0 * y1 - x1 * y0;
  }, 0);
  const winding = area >= 0 ? 1 : -1;
  return outline.flatMap(([x0, y0], i): SideFace[] => {
    const [x1, y1] = outline[(i + 1) % outline.length] ?? [x0, y0];
    const nx = (y1 - y0) * winding;
    const ny = -(x1 - x0) * winding;
    const length = Math.hypot(nx, ny);
    if (length === 0 || ny / length <= 0.001) return [];
    return [
      {
        points: [
          [x0, y0],
          [x1, y1],
          [x1, y1 + depth],
          [x0, y0 + depth],
        ],
        light: -nx / length,
      },
    ];
  });
}

export function toPoints(points: readonly Point[]): string {
  return points.map(([x, y]) => `${x.toFixed(2)},${y.toFixed(2)}`).join(" ");
}

const channels = (hex: string): number[] =>
  [1, 3, 5].map((i) => Number.parseInt(hex.slice(i, i + 2), 16));

/** `#rrggbb` どうしを混ぜる。t が 0 なら from、1 なら to */
export function mixColor(from: string, to: string, t: number): string {
  const a = channels(from);
  const b = channels(to);
  return `#${a
    .map((c, i) =>
      Math.round(c + ((b[i] ?? c) - c) * t)
        .toString(16)
        .padStart(2, "0"),
    )
    .join("")}`;
}
