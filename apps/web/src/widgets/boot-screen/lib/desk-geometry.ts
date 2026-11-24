export type Point = readonly [number, number];
export type ObjectPoint = Point;
export type ScenePoint = Point;

export interface DeskPlane {
  toScene: (u: number, v: number) => ScenePoint;
  transform: string;
}

interface DeskPlaneOptions {
  x: number;
  y: number;
  angleDeg: number;
  squash: number;
}

const fixed = (n: number): string => n.toFixed(4);

export function deskPlane({ x, y, angleDeg, squash }: DeskPlaneOptions): DeskPlane {
  const rad = (angleDeg * Math.PI) / 180;
  const cos = Math.cos(rad);
  const sin = Math.sin(rad);
  return {
    toScene: (u, v) => [x + cos * u - sin * v, y + squash * (sin * u + cos * v)],
    transform: `matrix(${[cos, squash * sin, -sin, squash * cos, x, y].map(fixed).join(" ")})`,
  };
}

export function roundedRect(
  width: number,
  height: number,
  radius: number,
  steps = 3,
): ObjectPoint[] {
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

export function circle(radius: number, steps = 48): ObjectPoint[] {
  return Array.from({ length: steps }, (_, i): Point => {
    const rad = (i / steps) * Math.PI * 2;
    return [radius * Math.cos(rad), radius * Math.sin(rad)];
  });
}

export interface SideFace {
  points: ScenePoint[];
  lightCosine: number;
}

export function visibleSides(outline: readonly ScenePoint[], depthInScene: number): SideFace[] {
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
          [x1, y1 + depthInScene],
          [x0, y0 + depthInScene],
        ],
        lightCosine: -nx / length,
      },
    ];
  });
}

export function toPoints(points: readonly Point[]): string {
  return points.map(([x, y]) => `${x.toFixed(2)},${y.toFixed(2)}`).join(" ");
}

const channels = (hex: string): number[] =>
  [1, 3, 5].map((i) => Number.parseInt(hex.slice(i, i + 2), 16));

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
