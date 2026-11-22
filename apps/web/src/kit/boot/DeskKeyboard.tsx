import { toPoints, type Point } from "./desk-geometry.ts";
import {
  KEYBOARD_DEPTH,
  KEYBOARD_LAMPS,
  KEYBOARD_WIDTH,
  KEYS,
  type KeySpec,
} from "./keyboard-layout.ts";
import { useSvgIds, type Paint } from "./use-svg-ids.ts";

/** キーの並ぶ面。奥ほど狭く見える台形 */
const KEY_AREA = {
  farY: 619,
  nearY: 681,
  farLeft: 117,
  farRight: 643,
  nearLeft: 94,
  nearRight: 666,
};

/** 刻印の奥行きの縮み方 */
const LEGEND_SQUASH = 0.52;

const lerp = (a: number, b: number, t: number): number => a + (b - a) * t;

function keyPoint(u: number, v: number): Point {
  const t = v / KEYBOARD_DEPTH;
  const left = lerp(KEY_AREA.farLeft, KEY_AREA.nearLeft, t);
  const right = lerp(KEY_AREA.farRight, KEY_AREA.nearRight, t);
  return [lerp(left, right, u / KEYBOARD_WIDTH), lerp(KEY_AREA.farY, KEY_AREA.nearY, t)];
}

const project = (points: readonly Point[]): string =>
  toPoints(points.map(([u, v]) => keyPoint(u, v)));

interface Inset {
  left: number;
  right: number;
  far: number;
  near: number;
}

/** キーの根元。隣のキーとのすき間を残す */
const FOOTPRINT: Inset = { left: 0.045, right: 0.045, far: 0.05, near: 0.03 };
/** キーの頭。手前ほど側面が見えるので、手前を大きく削る */
const TOP_FACE: Inset = { left: 0.17, right: 0.17, far: 0.1, near: 0.36 };

type Quad = [Point, Point, Point, Point];

function rectCorners({ x, y, w, h }: KeySpec, inset: Inset): Quad {
  const x0 = x + inset.left;
  const x1 = x + w - inset.right;
  const y0 = y + inset.far;
  const y1 = y + h - inset.near;
  return [
    [x0, y0],
    [x1, y0],
    [x1, y1],
    [x0, y1],
  ];
}

function keyOutline(spec: KeySpec, inset: Inset): Point[] {
  const { x, y, w, h, notch } = spec;
  if (notch === undefined) return rectCorners(spec, inset);
  const x0 = x + inset.left;
  const x1 = x + w - inset.right;
  const y0 = y + inset.far;
  const y1 = y + h - inset.near;
  const xn = x + notch + inset.left;
  const ym = y + 1 - inset.near;
  return [
    [x0, y0],
    [x1, y0],
    [x1, y1],
    [xn, y1],
    [xn, ym],
    [x0, ym],
  ];
}

function legendTransform([x, y]: Point): string {
  return `translate(${x.toFixed(2)} ${y.toFixed(2)}) scale(1 ${LEGEND_SQUASH})`;
}

function Legends({ spec }: { spec: KeySpec }) {
  const { x, y, w, label, kana } = spec;
  if (!label) return null;
  if (kana !== undefined) {
    return (
      <>
        <text
          transform={legendTransform(keyPoint(x + TOP_FACE.left + 0.09, y + TOP_FACE.far + 0.17))}
          fontSize="5"
          fill="#48433a"
          dominantBaseline="central"
        >
          {label}
        </text>
        <text
          transform={legendTransform(
            keyPoint(x + w - TOP_FACE.right - 0.07, y + 1 - TOP_FACE.near - 0.13),
          )}
          fontSize="4.3"
          fill="#8a4532"
          textAnchor="end"
          dominantBaseline="central"
        >
          {kana}
        </text>
      </>
    );
  }
  const [lx] = keyPoint(x, y + 0.5);
  const [rx] = keyPoint(x + 1, y + 0.5);
  const fontSize = Math.min(4.8, ((rx - lx) * 0.9 * w) / Math.max(1, label.length * 0.62));
  const faceMiddle = TOP_FACE.far + (1 - TOP_FACE.far - TOP_FACE.near) / 2;
  return (
    <text
      transform={legendTransform(keyPoint(x + w / 2, y + Math.min(spec.h, 1) * faceMiddle))}
      fontSize={fontSize.toFixed(2)}
      fill="#4c473b"
      textAnchor="middle"
      dominantBaseline="central"
    >
      {label}
    </text>
  );
}

/** 長方形のキーの、左右の側面。左は明かりを受ける */
function skirtSides(spec: KeySpec): { lit: Quad; dark: Quad } {
  const [b0, b1, b2, b3] = rectCorners(spec, FOOTPRINT);
  const [t0, t1, t2, t3] = rectCorners(spec, TOP_FACE);
  return { lit: [b0, t0, t3, b3], dark: [t1, b1, b2, t2] };
}

function Key({ spec, paint }: { spec: KeySpec; paint: Paint }) {
  const isMod = spec.tone === "mod";
  const top = keyOutline(spec, TOP_FACE);
  const sides = spec.notch === undefined ? skirtSides(spec) : null;
  const rim = [top[top.length - 1], top[0], top[1]].filter((p) => p !== undefined);
  return (
    <g>
      <polygon
        points={project(keyOutline(spec, FOOTPRINT))}
        fill={paint(isMod ? "skirtMod" : "skirtAlpha")}
        stroke="#6c6550"
        strokeWidth="0.45"
        strokeLinejoin="round"
      />
      {sides && (
        <>
          <polygon points={project(sides.lit)} fill="#fff" opacity="0.2" />
          <polygon points={project(sides.dark)} fill="#000" opacity="0.1" />
        </>
      )}
      <polygon points={project(top)} fill={paint(isMod ? "topMod" : "topAlpha")} />
      <polyline
        points={project(rim)}
        fill="none"
        stroke="#fffdf5"
        strokeOpacity="0.8"
        strokeWidth="0.55"
        strokeLinejoin="round"
      />
      <Legends spec={spec} />
    </g>
  );
}

const CASE_TOP =
  "M112 606H648Q657 606 659 613L686 684Q688 691 679 691H81Q72 691 74 684L101 613Q103 606 112 606Z";
const CASE_FRONT =
  "M74 684L72 694Q71 700 80 700H680Q689 700 688 694L686 684Q688 691 679 691H81Q72 691 74 684Z";

/** 起動前の机に置くキーボード。電源が入ると Num Lock の灯がつく */
export function DeskKeyboard({ isPoweredOn }: { isPoweredOn: boolean }) {
  const { id, paint } = useSvgIds();
  return (
    <g>
      <defs>
        <linearGradient id={id("case")} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ece6d4" />
          <stop offset="1" stopColor="#d2caaf" />
        </linearGradient>
        <linearGradient id={id("front")} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#c4bb9f" />
          <stop offset="1" stopColor="#8f866b" />
        </linearGradient>
        <linearGradient id={id("plate")} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#6f6852" />
          <stop offset="1" stopColor="#9b9379" />
        </linearGradient>
        <linearGradient id={id("topAlpha")} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#e4ddc8" />
          <stop offset="1" stopColor="#faf6ea" />
        </linearGradient>
        <linearGradient id={id("topMod")} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#cdc5ae" />
          <stop offset="1" stopColor="#e3dcc7" />
        </linearGradient>
        <linearGradient id={id("skirtAlpha")} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#dcd4be" />
          <stop offset="1" stopColor="#a39a7f" />
        </linearGradient>
        <linearGradient id={id("skirtMod")} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#c6bea5" />
          <stop offset="1" stopColor="#8f866b" />
        </linearGradient>
        <filter id={id("soft")} x="-10%" y="-30%" width="120%" height="160%">
          <feGaussianBlur stdDeviation="5" />
        </filter>
        <filter id={id("glow")} x="-100%" y="-100%" width="300%" height="300%">
          <feGaussianBlur stdDeviation="1.6" />
        </filter>
      </defs>

      <path
        d={CASE_TOP}
        fill="#000"
        opacity="0.5"
        transform="translate(9 10)"
        filter={paint("soft")}
      />
      <path d={CASE_FRONT} fill={paint("front")} />
      <path d={CASE_TOP} fill={paint("case")} />
      <path d="M112 606.8H648" stroke="#fffdf4" strokeWidth="1.3" />
      <path d="M75 684.6L102 613.4" stroke="#fffdf4" strokeOpacity="0.6" strokeWidth="1" />
      <path d="M685 684.6L658 613.4" stroke="#6d654f" strokeOpacity="0.35" strokeWidth="1" />
      <path d="M80 691H680" stroke="#fffdf4" strokeOpacity="0.55" strokeWidth="0.9" />
      <text x="122" y="614.4" fontSize="5.4" fontWeight="700" fill="#a49b80">
        あのころ Web
      </text>

      <polygon
        points={project([
          [-0.14, -0.12],
          [KEYBOARD_WIDTH + 0.14, -0.12],
          [KEYBOARD_WIDTH + 0.14, KEYBOARD_DEPTH + 0.06],
          [-0.14, KEYBOARD_DEPTH + 0.06],
        ])}
        fill={paint("plate")}
      />
      <polygon
        points={project([
          [-0.14, -0.12],
          [KEYBOARD_WIDTH + 0.14, -0.12],
          [KEYBOARD_WIDTH + 0.14, 0.04],
          [-0.14, 0.04],
        ])}
        fill="#000"
        opacity="0.25"
      />
      {KEYS.map((spec) => (
        <Key key={`${spec.x}-${spec.y}`} spec={spec} paint={paint} />
      ))}

      {KEYBOARD_LAMPS.map(({ x, y }, i) => {
        const isLit = isPoweredOn && i === 0;
        const [cx, cy] = keyPoint(x, y);
        return (
          <g key={x}>
            {isLit && (
              <ellipse
                cx={cx}
                cy={cy}
                rx="4"
                ry="2.6"
                fill="#8dff7c"
                opacity="0.6"
                filter={paint("glow")}
              />
            )}
            <rect
              x={cx - 2.4}
              y={cy - 1.3}
              width="4.8"
              height="2.6"
              rx="1"
              fill={isLit ? "#b6ff9e" : "#36513a"}
              stroke="#4f4a3c"
              strokeWidth="0.4"
            />
          </g>
        );
      })}
    </g>
  );
}
