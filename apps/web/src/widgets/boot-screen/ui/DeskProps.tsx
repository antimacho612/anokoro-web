import type { ReactElement } from "react";
import {
  circle,
  deskPlane,
  mixColor,
  roundedRect,
  toPoints,
  visibleSides,
  type DeskPlane,
  type Point,
} from "../lib/desk-geometry.ts";
import { useSvgIds, type Paint } from "./use-svg-ids.ts";

const DESK_DEPTH_SQUASH = 0.44;

const shift =
  (dx: number, dy: number) =>
  ([x, y]: Point): Point => [x + dx, y + dy];

type SlabProps = {
  outline: readonly Point[];
  depth: number;
  lit: string;
  shaded: string;
};

function Slab({ outline, depth, lit, shaded }: SlabProps) {
  return (
    <g>
      <polygon points={toPoints(outline.map(shift(0, depth)))} fill={mixColor(shaded, lit, 0.5)} />
      {visibleSides(outline, depth).map((side) => {
        const fill = mixColor(shaded, lit, (side.lightCosine + 1) / 2);
        const points = toPoints(side.points);
        return (
          <polygon
            key={points}
            points={points}
            fill={fill}
            stroke={fill}
            strokeWidth="0.4"
            strokeLinejoin="round"
          />
        );
      })}
    </g>
  );
}

function starPoints(cx: number, cy: number, outer: number, inner: number, spikes: number): string {
  return toPoints(
    Array.from({ length: spikes * 2 }, (_, i): Point => {
      const r = i % 2 === 0 ? outer : inner;
      const rad = (i / (spikes * 2)) * Math.PI * 2 - Math.PI / 2;
      return [cx + r * Math.cos(rad), cy + r * Math.sin(rad)];
    }),
  );
}

const LAMP_PIVOT: Point = [-300, 540];
const LAMP_ELBOW: Point = [-336, 330];
const LAMP_HEAD: Point = [-222, 202];

function along(from: Point, to: Point) {
  const [x0, y0] = from;
  const [x1, y1] = to;
  const length = Math.hypot(x1 - x0, y1 - y0);
  const dx = (x1 - x0) / length;
  const dy = (y1 - y0) / length;
  return (t: number, side: number): Point => [
    x0 + dx * length * t - dy * side,
    y0 + dy * length * t + dx * side,
  ];
}

function Rods({ from, to, gap }: { from: Point; to: Point; gap: number }) {
  const at = along(from, to);
  return (
    <g strokeLinecap="round">
      {[-gap / 2, gap / 2].map((side) => {
        const [x0, y0] = at(0, side);
        const [x1, y1] = at(1, side);
        return (
          <g key={side}>
            <line x1={x0} y1={y0} x2={x1} y2={y1} stroke="#16171a" strokeWidth="3.4" />
            <line
              x1={x0 - 0.8}
              y1={y0 - 0.4}
              x2={x1 - 0.8}
              y2={y1 - 0.4}
              stroke="#8d929c"
              strokeOpacity="0.75"
              strokeWidth="0.9"
            />
          </g>
        );
      })}
    </g>
  );
}

function Spring({
  from,
  to,
  offset,
  turns,
}: {
  from: Point;
  to: Point;
  offset: number;
  turns: number;
}) {
  const at = along(from, to);
  const start = 0.16;
  const end = 0.64;
  const pitch = (end - start) / turns;
  const coils = Array.from({ length: turns }, (_, i) => {
    const [x0, y0] = at(start + i * pitch, offset - 2);
    const [x1, y1] = at(start + (i + 0.85) * pitch, offset + 2);
    return `M${x0.toFixed(2)} ${y0.toFixed(2)}L${x1.toFixed(2)} ${y1.toFixed(2)}`;
  }).join("");
  const edge = (side: number): string => {
    const [x0, y0] = at(start, offset + side);
    const [x1, y1] = at(end, offset + side);
    return `M${x0} ${y0}L${x1} ${y1}`;
  };
  const hook = (t: number): string => {
    const [x0, y0] = at(t, 0);
    const [x1, y1] = at(t, offset);
    return `M${x0} ${y0}L${x1} ${y1}`;
  };
  return (
    <g fill="none" strokeLinecap="round">
      <path d={edge(-2) + edge(2)} stroke="#1d1f23" strokeWidth="1.2" />
      <path d={coils} stroke="#1d1f23" strokeWidth="1.5" />
      <path d={coils} stroke="#b9bfc8" strokeWidth="0.7" />
      <path d={hook(start - 0.03) + hook(end + 0.03)} stroke="#8f959e" strokeWidth="0.9" />
    </g>
  );
}

function Knob({ at: [cx, cy], r, paint }: { at: Point; r: number; paint: Paint }) {
  return (
    <g>
      {Array.from({ length: 20 }, (_, i) => {
        const rad = (i / 20) * Math.PI * 2;
        return (
          <line
            key={i}
            x1={cx + r * Math.cos(rad)}
            y1={cy + r * Math.sin(rad)}
            x2={cx + (r + 1.3) * Math.cos(rad)}
            y2={cy + (r + 1.3) * Math.sin(rad)}
            stroke="#3a3d43"
            strokeWidth="0.9"
          />
        );
      })}
      <circle cx={cx} cy={cy} r={r} fill={paint("knob")} stroke="#0c0d0f" strokeWidth="0.8" />
      <circle cx={cx} cy={cy} r={r * 0.42} fill="#9aa0a9" />
      <line
        x1={cx - r * 0.3}
        y1={cy + r * 0.18}
        x2={cx + r * 0.3}
        y2={cy - r * 0.18}
        stroke="#2b2d32"
        strokeWidth="0.9"
      />
    </g>
  );
}

export function Lamp() {
  const { id, paint } = useSvgIds();
  return (
    <g>
      <defs>
        <linearGradient id={id("metal")} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#5a5e66" />
          <stop offset="0.35" stopColor="#30333a" />
          <stop offset="1" stopColor="#16171b" />
        </linearGradient>
        <linearGradient id={id("baseSide")} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#3d4047" />
          <stop offset="0.2" stopColor="#6d727b" />
          <stop offset="0.32" stopColor="#2c2f35" />
          <stop offset="1" stopColor="#111215" />
        </linearGradient>
        <radialGradient id={id("baseTop")} cx="0.38" cy="0.35" r="0.75">
          <stop offset="0" stopColor="#5b6068" />
          <stop offset="0.55" stopColor="#2d3036" />
          <stop offset="1" stopColor="#1a1b1f" />
        </radialGradient>
        <radialGradient id={id("knob")} cx="0.35" cy="0.3" r="0.8">
          <stop offset="0" stopColor="#6e737c" />
          <stop offset="1" stopColor="#1c1e22" />
        </radialGradient>
        <linearGradient
          id={id("shade")}
          x1="-56"
          y1="0"
          x2="56"
          y2="0"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0" stopColor="#0f1012" />
          <stop offset="0.22" stopColor="#2c2f35" />
          <stop offset="0.32" stopColor="#80858f" />
          <stop offset="0.4" stopColor="#383b42" />
          <stop offset="0.78" stopColor="#1a1b1f" />
          <stop offset="1" stopColor="#2a2c31" />
        </linearGradient>
        <radialGradient id={id("inside")} cx="0.5" cy="0.4" r="0.6">
          <stop offset="0" stopColor="#fffbea" />
          <stop offset="0.55" stopColor="#ffe6b3" />
          <stop offset="1" stopColor="#d9a86a" />
        </radialGradient>
        <radialGradient id={id("bulb")} cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset="0.6" stopColor="#fff3d1" />
          <stop offset="1" stopColor="#ffe2a4" stopOpacity="0" />
        </radialGradient>
        <radialGradient id={id("glow")} cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#fff2d2" stopOpacity="0.85" />
          <stop offset="0.4" stopColor="#ffd796" stopOpacity="0.35" />
          <stop offset="1" stopColor="#ffbf6b" stopOpacity="0" />
        </radialGradient>
        <filter id={id("soft")} x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="5" />
        </filter>
      </defs>

      <path
        d="M-340 554C-372 550 -404 562 -470 557"
        fill="none"
        stroke="#0e0f11"
        strokeWidth="2.6"
        strokeLinecap="round"
      />
      <ellipse
        cx="-290"
        cy="571"
        rx="72"
        ry="13"
        fill="#000"
        opacity="0.55"
        filter={paint("soft")}
      />
      <path
        d="M-350 556V566A50 11 0 0 0 -250 566V556A50 11 0 0 1 -350 556Z"
        fill={paint("baseSide")}
      />
      <path d="M-350 566A50 11 0 0 0 -250 566" fill="none" stroke="#060607" strokeWidth="2.4" />
      <ellipse cx="-300" cy="556" rx="50" ry="11" fill={paint("baseTop")} />
      <ellipse
        cx="-300"
        cy="556"
        rx="48.6"
        ry="10.2"
        fill="none"
        stroke="#9aa0a9"
        strokeOpacity="0.45"
        strokeWidth="0.8"
      />
      <ellipse cx="-300" cy="555" rx="28" ry="5.6" fill="none" stroke="#000" strokeOpacity="0.35" />
      <rect
        x="-275"
        y="553.4"
        width="14"
        height="6.4"
        rx="1.8"
        fill="#09090b"
        stroke="#41444b"
        strokeWidth="0.6"
      />
      <rect x="-274" y="554" width="6.6" height="3.4" rx="1" fill="#6a6f78" />

      <path
        d="M-226 190C-262 236 -322 292 -334 336C-334 420 -312 494 -304 536"
        fill="none"
        stroke="#0c0d0f"
        strokeWidth="1.4"
      />
      <path d="M-308 557L-305 536H-295L-292 557Z" fill={paint("metal")} />
      <Rods from={LAMP_PIVOT} to={LAMP_ELBOW} gap={6} />
      <Spring from={LAMP_PIVOT} to={LAMP_ELBOW} offset={-7} turns={26} />
      <Rods from={LAMP_ELBOW} to={LAMP_HEAD} gap={5} />
      <Spring from={LAMP_ELBOW} to={LAMP_HEAD} offset={6} turns={20} />
      <Knob at={LAMP_PIVOT} r={5.5} paint={paint} />
      <Knob at={LAMP_ELBOW} r={7.5} paint={paint} />

      <g transform="translate(-218 196) rotate(-38)">
        <rect x="-7.5" y="-31" width="15" height="19" rx="2.4" fill={paint("metal")} />
        <rect x="-3" y="-37" width="6" height="7" rx="1.4" fill="#0d0e10" />
        <path d="M-24 -14L24 -14L56 46L-56 46Z" fill={paint("shade")} />
        <ellipse cx="0" cy="-14" rx="24" ry="5.5" fill="#24262b" />
        <path
          d="M-24 -14A24 5.5 0 0 1 24 -14"
          fill="none"
          stroke="#8a8f99"
          strokeOpacity="0.7"
          strokeWidth="0.9"
        />
        {[-12, -4, 4, 12].map((x) => (
          <g key={x}>
            <rect x={x - 2} y="-8" width="4" height="10" rx="2" fill="#050506" />
            <path
              d={`M${x - 2} 1.6H${x + 2}`}
              stroke="#7d828c"
              strokeOpacity="0.6"
              strokeWidth="0.6"
            />
          </g>
        ))}
        <path
          d="M-34.6 10A34.6 7.6 0 0 0 34.6 10"
          fill="none"
          stroke="#70757f"
          strokeOpacity="0.8"
          strokeWidth="1"
        />
        <ellipse cx="0" cy="46" rx="56" ry="12" fill={paint("inside")} />
        <circle cx="0" cy="40" r="16" fill={paint("bulb")} />
        <ellipse cx="0" cy="46" rx="56" ry="12" fill="none" stroke="#3b3e45" strokeWidth="3.2" />
        <path
          d="M-56 47A56 12 0 0 0 56 47"
          fill="none"
          stroke="#c4c9d1"
          strokeOpacity="0.75"
          strokeWidth="1"
        />
        <ellipse cx="0" cy="62" rx="130" ry="80" fill={paint("glow")} />
      </g>
      <Knob at={LAMP_HEAD} r={5} paint={paint} />
    </g>
  );
}

export function LampBeam() {
  const { id, paint } = useSvgIds();
  return (
    <g>
      <defs>
        <linearGradient
          id={id("beam")}
          x1="-190"
          y1="232"
          x2="40"
          y2="610"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0" stopColor="#ffe3ad" stopOpacity="0.16" />
          <stop offset="0.55" stopColor="#ffd393" stopOpacity="0.05" />
          <stop offset="1" stopColor="#ffd393" stopOpacity="0" />
        </linearGradient>
        <filter id={id("blur")} x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="7" />
        </filter>
      </defs>
      <polygon
        points="-236,268 -144,196 170,540 -130,664"
        fill={paint("beam")}
        filter={paint("blur")}
      />
    </g>
  );
}

const CD_PLANE = deskPlane({ x: -50, y: 555, angleDeg: 8, squash: DESK_DEPTH_SQUASH });
const CD_CASE: readonly Point[] = roundedRect(176, 154, 2.5, 2);

type TileProps = { x: number; y: number; paint: Paint };

function SampleTiles({ x, y, paint }: TileProps) {
  const size = { w: 33, h: 22 };
  const tiles: readonly ((tx: number, ty: number) => ReactElement)[] = [
    (tx, ty) => (
      <g>
        <rect x={tx + 3} y={ty + 7} width={size.w - 6} height="3.4" fill={paint("rainbow")} />
        <rect x={tx + 3} y={ty + 13} width={size.w - 6} height="1.6" fill={paint("rainbow")} />
      </g>
    ),
    (tx, ty) => (
      <g>
        <rect x={tx + 5} y={ty + 5} width={size.w - 10} height="12" rx="2" fill="#e8322b" />
        <text
          x={tx + size.w / 2}
          y={ty + 11.5}
          fontSize="8.5"
          fontWeight="800"
          fill="#fff"
          textAnchor="middle"
          dominantBaseline="central"
        >
          NEW!
        </text>
      </g>
    ),
    (tx, ty) => (
      <polygon
        points={starPoints(tx + size.w / 2, ty + 11.5, 9, 3.8, 5)}
        fill="#ffd23c"
        stroke="#d98a00"
        strokeWidth="0.8"
      />
    ),
    (tx, ty) => (
      <path
        d={`M${tx + 16.5} ${ty + 18}C${tx + 6} ${ty + 11} ${tx + 9} ${ty + 3} ${tx + 16.5} ${ty + 8}C${tx + 24} ${ty + 3} ${tx + 27} ${ty + 11} ${tx + 16.5} ${ty + 18}Z`}
        fill="#ff6fa8"
        stroke="#d63b7a"
        strokeWidth="0.7"
      />
    ),
    (tx, ty) => (
      <g>
        {["#2f6fe0", "#e33b3b", "#2fa84f"].map((color, i) => (
          <g key={color}>
            <circle cx={tx + 8 + i * 8.5} cy={ty + 11} r="3.6" fill={color} />
            <circle cx={tx + 6.8 + i * 8.5} cy={ty + 9.8} r="1.2" fill="#fff" opacity="0.8" />
          </g>
        ))}
      </g>
    ),
    (tx, ty) => (
      <path
        d={`M${tx + 6} ${ty + 8}H${tx + 18}V${ty + 4}L${tx + 27} ${ty + 11}L${tx + 18} ${ty + 18}V${ty + 14}H${tx + 6}Z`}
        fill="#2fa84f"
        stroke="#1d6e33"
        strokeWidth="0.7"
      />
    ),
    (tx, ty) => (
      <g>
        <rect x={tx + 3} y={ty + 5} width={size.w - 6} height="12" fill="#111" />
        <text
          x={tx + size.w / 2}
          y={ty + 11.5}
          fontSize="8.5"
          fontWeight="700"
          fill="#6dff73"
          textAnchor="middle"
          dominantBaseline="central"
          fontFamily="var(--boot-mono)"
        >
          0123
        </text>
      </g>
    ),
    (tx, ty) => (
      <g clipPath={paint("tileClip")} transform={`translate(${tx} ${ty})`}>
        <rect x="3" y="5" width={size.w - 6} height="12" fill="#ffd400" />
        {[0, 8, 16, 24, 32].map((s) => (
          <polygon
            key={s}
            points={`${s - 6},17 ${s - 2},17 ${s + 6},5 ${s + 2},5`}
            fill="#1b1b1b"
          />
        ))}
      </g>
    ),
  ];
  return (
    <g>
      {tiles.map((draw, i) => {
        const tx = x + (i % 4) * (size.w + 4);
        const ty = y + Math.floor(i / 4) * (size.h + 4);
        return (
          <g key={`${tx}-${ty}`}>
            <rect
              x={tx}
              y={ty}
              width={size.w}
              height={size.h}
              fill="#fdfcf6"
              stroke="#b9bdd8"
              strokeWidth="0.6"
            />
            {draw(tx, ty)}
          </g>
        );
      })}
    </g>
  );
}

function CdInsert({ paint }: { paint: Paint }) {
  const rays = [-62, -40, -18, 4, 26, 48, 70, 92];
  return (
    <g>
      <rect x="-72" y="-72" width="155" height="144" fill={paint("art")} />
      <g clipPath={paint("insertClip")} fill="#fff" opacity="0.13">
        {rays.map((deg) => {
          const a = (deg * Math.PI) / 180;
          const b = ((deg + 7) * Math.PI) / 180;
          return (
            <polygon
              key={deg}
              points={`56,-50 ${56 + 200 * Math.cos(a)},${-50 + 200 * Math.sin(a)} ${56 + 200 * Math.cos(b)},${-50 + 200 * Math.sin(b)}`}
            />
          );
        })}
      </g>
      <text x="-63" y="-53" fontSize="12" fontWeight="700" fill="#ffe680">
        ホームページ
      </text>
      <text
        x="-65"
        y="-15"
        fontSize="36"
        fontWeight="800"
        fill="#fff"
        stroke="#0b1846"
        strokeWidth="4"
        strokeLinejoin="round"
        paintOrder="stroke"
      >
        素材集
      </text>
      <g transform="rotate(-12 61 -50)">
        <polygon
          points={starPoints(61, -50, 20, 15, 14)}
          fill="#ffd43b"
          stroke="#d88a00"
          strokeWidth="1"
        />
        <text
          x="61"
          y="-50"
          fontSize="11"
          fontWeight="800"
          fill="#c62a1d"
          textAnchor="middle"
          dominantBaseline="central"
        >
          Vol.2
        </text>
      </g>
      <SampleTiles x={-66} y={-2} paint={paint} />
      <rect x="-72" y="52" width="155" height="20" fill="#0b1846" opacity="0.6" />
      <text x="-64" y="65.5" fontSize="10" fontWeight="700" fill="#fff">
        画像 3000 点を収録
      </text>
    </g>
  );
}

export function CdCase() {
  const { id, paint } = useSvgIds();
  const outline = CD_CASE.map(([u, v]) => CD_PLANE.toScene(u, v));
  return (
    <g>
      <defs>
        <linearGradient id={id("art")} x1="0" y1="0" x2="0.4" y2="1">
          <stop offset="0" stopColor="#13246a" />
          <stop offset="0.5" stopColor="#2c64cf" />
          <stop offset="1" stopColor="#7c3ab0" />
        </linearGradient>
        <linearGradient id={id("rainbow")} x1="0" y1="0" x2="1" y2="0">
          {["#e53935", "#fb8c00", "#fdd835", "#43a047", "#1e88e5", "#8e24aa"].map((color, i) => (
            <stop key={color} offset={i / 5} stopColor={color} />
          ))}
        </linearGradient>
        <linearGradient id={id("glare")} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#fff" stopOpacity="0.2" />
          <stop offset="0.3" stopColor="#fff" stopOpacity="0.04" />
          <stop offset="0.62" stopColor="#fff" stopOpacity="0" />
          <stop offset="1" stopColor="#fff" stopOpacity="0.08" />
        </linearGradient>
        <clipPath id={id("insertClip")}>
          <rect x="-72" y="-72" width="155" height="144" />
        </clipPath>
        <clipPath id={id("tileClip")}>
          <rect x="3" y="5" width="27" height="12" />
        </clipPath>
        <filter id={id("soft")} x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="5" />
        </filter>
      </defs>

      <polygon
        points={toPoints(outline.map(shift(9, 12)))}
        fill="#000"
        opacity="0.5"
        filter={paint("soft")}
      />
      <Slab outline={outline} depth={8} lit="#8a929d" shaded="#202327" />
      <polyline
        points={toPoints(outline.map(shift(0, 8)))}
        fill="none"
        stroke="#000"
        strokeOpacity="0.5"
        strokeWidth="0.8"
      />
      <g transform={CD_PLANE.transform}>
        <polygon points={toPoints(CD_CASE)} fill="#101215" />
        <CdInsert paint={paint} />
        <rect x="-88" y="-77" width="14" height="154" fill="#cdd9e6" opacity="0.16" />
        {Array.from({ length: 26 }, (_, i) => -74 + i * 5.9).map((y) => (
          <path key={y} d={`M-87 ${y}H-75`} stroke="#fff" strokeOpacity="0.16" strokeWidth="0.8" />
        ))}
        <rect x="-88" y="-77" width="9" height="16" rx="1.5" fill="#dfe8f2" opacity="0.35" />
        <rect x="-88" y="61" width="9" height="16" rx="1.5" fill="#dfe8f2" opacity="0.35" />
        <path d="M-74 -77V77" stroke="#fff" strokeOpacity="0.35" strokeWidth="0.8" />
        <rect x="81" y="-42" width="4" height="15" rx="1" fill="#e9f0f7" opacity="0.5" />
        <rect x="81" y="27" width="4" height="15" rx="1" fill="#e9f0f7" opacity="0.5" />
        <polygon points={toPoints(CD_CASE)} fill={paint("glare")} />
        <path d="M-38 -77H4L-88 60V8Z" fill="#fff" opacity="0.08" />
        <polygon
          points={toPoints(CD_CASE)}
          fill="none"
          stroke="#f1f6fb"
          strokeOpacity="0.6"
          strokeWidth="1.1"
        />
      </g>
    </g>
  );
}

const DISC_PLANE = deskPlane({ x: -178, y: 630, angleDeg: 0, squash: DESK_DEPTH_SQUASH });
const DISC_R = 70;

export function Disc() {
  const { id, paint } = useSvgIds();
  const wedges = 24;
  const outline = circle(DISC_R, 64).map(([u, v]) => DISC_PLANE.toScene(u, v));
  return (
    <g>
      <defs>
        <radialGradient id={id("base")} cx="0.5" cy="0.5" r="0.5">
          <stop offset="0.3" stopColor="#c7cdd4" />
          <stop offset="0.7" stopColor="#e4e8ed" />
          <stop offset="1" stopColor="#b8bfc8" />
        </radialGradient>
        <linearGradient id={id("sheen")} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0.15" stopColor="#fff" stopOpacity="0" />
          <stop offset="0.42" stopColor="#fff" stopOpacity="0.55" />
          <stop offset="0.5" stopColor="#fff" stopOpacity="0" />
          <stop offset="0.8" stopColor="#000" stopOpacity="0.12" />
        </linearGradient>
        <filter id={id("smooth")} x="-10%" y="-10%" width="120%" height="120%">
          <feGaussianBlur stdDeviation="3" />
        </filter>
        <filter id={id("soft")} x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="4" />
        </filter>
        <mask id={id("hole")}>
          <circle r={DISC_R} fill="#fff" />
          <circle r="7.5" fill="#000" />
        </mask>
      </defs>

      <polygon
        points={toPoints(outline.map(shift(6, 7)))}
        fill="#000"
        opacity="0.45"
        filter={paint("soft")}
      />
      <Slab outline={outline} depth={1.8} lit="#eef1f4" shaded="#737a83" />
      <g transform={DISC_PLANE.transform} mask={paint("hole")}>
        <circle r={DISC_R} fill={paint("base")} />
        <g opacity="0.5" filter={paint("smooth")}>
          {Array.from({ length: wedges }, (_, i) => {
            const a0 = (i / wedges) * Math.PI * 2;
            const a1 = ((i + 1.05) / wedges) * Math.PI * 2;
            const p = (r: number, a: number): string =>
              `${(r * Math.cos(a)).toFixed(2)} ${(r * Math.sin(a)).toFixed(2)}`;
            return (
              <path
                key={i}
                d={`M${p(22, a0)}L${p(66, a0)}A66 66 0 0 1 ${p(66, a1)}L${p(22, a1)}A22 22 0 0 0 ${p(22, a0)}Z`}
                fill={`hsl(${(i * 30 + 200) % 360} 95% 62%)`}
              />
            );
          })}
        </g>
        <circle r={DISC_R} fill={paint("sheen")} />
        <circle r="58" fill="none" stroke="#fff" strokeOpacity="0.3" strokeWidth="0.6" />
        <circle r="22" fill="#d4d9df" />
        <circle r="17.5" fill="#dfe5ec" opacity="0.55" />
        <circle r="17.5" fill="none" stroke="#fff" strokeOpacity="0.7" strokeWidth="0.8" />
        <circle r="12.5" fill="none" stroke="#9ca5af" strokeWidth="1.4" />
        <circle r={DISC_R - 0.6} fill="none" stroke="#fff" strokeOpacity="0.8" strokeWidth="0.9" />
      </g>
      <ellipse
        cx={DISC_PLANE.toScene(0, 0)[0]}
        cy={DISC_PLANE.toScene(0, 0)[1]}
        rx="7.5"
        ry={7.5 * DESK_DEPTH_SQUASH}
        fill="none"
        stroke="#3b2a1c"
        strokeOpacity="0.6"
        strokeWidth="0.8"
      />
    </g>
  );
}

const FLOPPY_W = 120;
const FLOPPY_H = 125;
const FLOPPY_CHAMFER = 7;
const FLOPPY_THICKNESS = 5;

const FLOPPY_OUTLINE: readonly Point[] = [
  [FLOPPY_W / 2 - FLOPPY_CHAMFER, -FLOPPY_H / 2],
  [FLOPPY_W / 2, -FLOPPY_H / 2 + FLOPPY_CHAMFER],
  ...roundedRect(FLOPPY_W, FLOPPY_H, 3, 3).slice(4),
];

type FloppyProps = {
  plane: DeskPlane;
  body: string;
  label: string;
  accent: string;
  paint: Paint;
};

function Floppy({ plane, body, label, accent, paint }: FloppyProps) {
  const outline = FLOPPY_OUTLINE.map(([u, v]) => plane.toScene(u, v));
  const top = -FLOPPY_H / 2;
  return (
    <g>
      <Slab
        outline={outline}
        depth={FLOPPY_THICKNESS}
        lit={mixColor(body, "#ffffff", 0.22)}
        shaded={mixColor(body, "#000000", 0.55)}
      />
      <g transform={plane.transform}>
        <polygon points={toPoints(FLOPPY_OUTLINE)} fill={body} />
        <polygon points={toPoints(FLOPPY_OUTLINE)} fill={paint("sheen")} />
        <rect x="-36" y={top} width="82" height="44" fill="#000" opacity="0.2" />
        <path d={`M-36 ${top + 44}H46`} stroke="#fff" strokeOpacity="0.14" strokeWidth="0.8" />
        <rect x="-27" y={top} width="56" height="41" fill={paint("shutter")} />
        <rect
          x="-25.4"
          y={top + 1.6}
          width="52.8"
          height="37.4"
          fill="none"
          stroke="#fff"
          strokeOpacity="0.4"
          strokeWidth="0.8"
        />
        <rect x="-27" y={top + 40} width="56" height="1.4" fill="#000" opacity="0.4" />
        <rect x="-1" y={top + 6} width="15" height="28" rx="1.2" fill="#2a1f17" />
        <rect x="-1" y={top + 6} width="15" height="28" rx="1.2" fill={paint("media")} />
        <path d={`M-1 ${top + 6.4}H14`} stroke="#000" strokeOpacity="0.6" strokeWidth="0.9" />
        <path
          d={`M-50.6 ${top + 22.8}L-46 ${top + 13.6}L-41.4 ${top + 22.8}Z`}
          fill="#000"
          opacity="0.4"
        />
        <path
          d={`M-51 ${top + 22}L-46 ${top + 12}L-41 ${top + 22}Z`}
          fill={mixColor(body, "#ffffff", 0.3)}
        />
        <rect x="-51.5" y="-12" width="103" height="74.5" rx="2" fill="#000" opacity="0.22" />
        <rect x="-49" y="-10" width="98" height="72.5" fill="#f5f0e2" />
        <rect x="-49" y="-10" width="98" height="9" fill={accent} />
        <text x="-45" y="-3.2" fontSize="6.4" fontWeight="700" fill="#fff">
          2HD 1.44MB
        </text>
        <path d="M-45 16H45M-45 28H45M-45 40H45M-45 52H45" stroke="#a3bddc" strokeWidth="0.8" />
        <text
          x="-38"
          y="24"
          fontSize="18"
          fontWeight="700"
          fill="#1f3f98"
          transform="skewX(-10)"
          letterSpacing="1"
        >
          {label}
        </text>
        <rect x="-57" y="47" width="6" height="9" fill="#09090a" />
        <rect x="51" y="47" width="6" height="9" fill="#09090a" />
        <rect x="51.6" y="47.6" width="4.8" height="4.2" fill="#3a3a40" />
        <polyline
          points={toPoints([
            [-FLOPPY_W / 2, FLOPPY_H / 2 - 3],
            [-FLOPPY_W / 2, top + 3],
            [-FLOPPY_W / 2 + 3, top],
            [FLOPPY_W / 2 - FLOPPY_CHAMFER, top],
          ])}
          fill="none"
          stroke="#fff"
          strokeOpacity="0.3"
          strokeWidth="1"
        />
      </g>
    </g>
  );
}

const FLOPPIES = [
  { x: -312, y: 683, angle: -16, body: "#263a60", label: "日記", accent: "#e0a43a" },
  { x: -307, y: 676, angle: -5, body: "#1c1c1f", label: "素材", accent: "#4f95d6" },
  { x: -316, y: 669, angle: -11, body: "#7a2c31", label: "HP 1", accent: "#58b46a" },
] as const;

export function FloppyStack() {
  const { id, paint } = useSvgIds();
  return (
    <g>
      <defs>
        <linearGradient id={id("shutter")} x1="0" y1="0" x2="1" y2="0.3">
          <stop offset="0" stopColor="#eef1f4" />
          <stop offset="0.45" stopColor="#b7bec7" />
          <stop offset="0.55" stopColor="#d4d9df" />
          <stop offset="1" stopColor="#8d949e" />
        </linearGradient>
        <linearGradient id={id("media")} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#6a5040" stopOpacity="0.7" />
          <stop offset="0.5" stopColor="#2a1f17" stopOpacity="0" />
        </linearGradient>
        <linearGradient id={id("sheen")} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#fff" stopOpacity="0.14" />
          <stop offset="0.5" stopColor="#fff" stopOpacity="0" />
          <stop offset="1" stopColor="#000" stopOpacity="0.15" />
        </linearGradient>
        <filter id={id("soft")} x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="5" />
        </filter>
      </defs>
      <ellipse
        cx="-302"
        cy="692"
        rx="76"
        ry="18"
        fill="#000"
        opacity="0.5"
        filter={paint("soft")}
      />
      {FLOPPIES.map(({ x, y, angle, body, label, accent }) => (
        <Floppy
          key={label}
          plane={deskPlane({ x, y, angleDeg: angle, squash: DESK_DEPTH_SQUASH })}
          body={body}
          label={label}
          accent={accent}
          paint={paint}
        />
      ))}
    </g>
  );
}

const MUG = { cx: 752, rimY: 470, rx: 34, ry: 9.5, height: 78 } as const;

export function Mug() {
  const { id, paint } = useSvgIds();
  const { cx, rimY, rx, ry, height } = MUG;
  const bottom = rimY + height;
  const left = cx - rx;
  const right = cx + rx;
  const frontArc = (y: number): string => `M${left} ${y}A${rx} ${ry} 0 0 0 ${right} ${y}`;
  const body = `M${left} ${rimY}V${bottom}A${rx} ${ry} 0 0 0 ${right} ${bottom}V${rimY}A${rx} ${ry} 0 0 1 ${left} ${rimY}Z`;
  const foot = `M${left} ${bottom - 7}A${rx} ${ry} 0 0 0 ${right} ${bottom - 7}V${bottom}A${rx} ${ry} 0 0 1 ${left} ${bottom}Z`;
  const handle = `M${right - 4} ${rimY + 14}C${right + 25} ${rimY + 7} ${right + 28} ${rimY + 59} ${right - 4} ${rimY + 57}`;
  const specks = Array.from({ length: 46 }, (_, i) => {
    const r = Math.sqrt((i + 0.5) / 46) * 0.92;
    const a = i * 2.39996;
    return {
      x: cx + 2 + 50 * r * Math.cos(a),
      y: bottom + 1 + 13 * r * Math.sin(a),
      size: 0.5 + (i % 3) * 0.25,
    };
  });
  return (
    <g>
      <defs>
        <linearGradient
          id={id("shade")}
          x1={left}
          y1="0"
          x2={right}
          y2="0"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0" stopColor="#000" stopOpacity="0.4" />
          <stop offset="0.1" stopColor="#000" stopOpacity="0.05" />
          <stop offset="0.2" stopColor="#fff" stopOpacity="0.16" />
          <stop offset="0.26" stopColor="#fff" stopOpacity="0.45" />
          <stop offset="0.31" stopColor="#fff" stopOpacity="0.1" />
          <stop offset="0.5" stopColor="#000" stopOpacity="0" />
          <stop offset="0.82" stopColor="#000" stopOpacity="0.34" />
          <stop offset="0.95" stopColor="#000" stopOpacity="0.46" />
          <stop offset="1" stopColor="#000" stopOpacity="0.28" />
        </linearGradient>
        <linearGradient
          id={id("handle")}
          x1={right - 4}
          y1="0"
          x2={right + 26}
          y2="0"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0" stopColor="#4d977f" />
          <stop offset="0.45" stopColor="#2c6656" />
          <stop offset="1" stopColor="#153a30" />
        </linearGradient>
        <linearGradient id={id("inside")} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#b9ad93" />
          <stop offset="1" stopColor="#f1e9d6" />
        </linearGradient>
        <radialGradient id={id("coffee")} cx="0.45" cy="0.5" r="0.55">
          <stop offset="0" stopColor="#3b2213" />
          <stop offset="0.8" stopColor="#24140a" />
          <stop offset="1" stopColor="#6a3f1f" />
        </radialGradient>
        <radialGradient id={id("cork")} cx="0.4" cy="0.4" r="0.7">
          <stop offset="0" stopColor="#c99a66" />
          <stop offset="1" stopColor="#9c6d43" />
        </radialGradient>
        <clipPath id={id("body")}>
          <path d={body} />
        </clipPath>
        <clipPath id={id("opening")}>
          <ellipse cx={cx} cy={rimY + 0.6} rx={rx - 3} ry={ry - 2.4} />
        </clipPath>
        <filter id={id("haze")} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="3" />
        </filter>
        <filter id={id("soft")} x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="3.5" />
        </filter>
      </defs>

      <ellipse cx={cx + 2} cy={bottom + 4} rx="50" ry="13" fill="#5b3d22" />
      <ellipse cx={cx + 2} cy={bottom + 1} rx="50" ry="13" fill={paint("cork")} />
      {specks.map(({ x, y, size }) => (
        <circle
          key={`${x.toFixed(1)}-${y.toFixed(1)}`}
          cx={x}
          cy={y}
          r={size}
          fill="#6b4524"
          opacity="0.55"
        />
      ))}
      <path
        d={`M${cx - 48} ${bottom + 1}A50 13 0 0 1 ${cx + 52} ${bottom + 1}`}
        fill="none"
        stroke="#e2bd8c"
        strokeOpacity="0.5"
        strokeWidth="0.8"
      />
      <ellipse
        cx={cx + 10}
        cy={bottom + 2}
        rx="38"
        ry="8"
        fill="#000"
        opacity="0.55"
        filter={paint("soft")}
      />

      <path d={handle} fill="none" stroke="#0f2b23" strokeWidth="11.5" strokeLinecap="round" />
      <path
        d={handle}
        fill="none"
        stroke={paint("handle")}
        strokeWidth="8.4"
        strokeLinecap="round"
      />
      <path
        d={handle}
        fill="none"
        stroke="#a7dcc7"
        strokeOpacity="0.45"
        strokeWidth="1.4"
        strokeLinecap="round"
        transform="translate(-1.6 -1.8)"
      />

      <path d={body} fill="#2f6b5a" />
      <g clipPath={paint("body")}>
        <path d={frontArc(rimY + 11)} fill="none" stroke="#efe5cc" strokeWidth="2.6" />
        <path d={frontArc(rimY + 16)} fill="none" stroke="#efe5cc" strokeWidth="1.2" />
        <path d={foot} fill="#cdb894" />
        <path d={frontArc(bottom - 7)} fill="none" stroke="#163d33" strokeWidth="1.2" />
        <rect
          x={left}
          y={rimY - ry}
          width={rx * 2}
          height={height + ry * 2}
          fill={paint("shade")}
        />
        <ellipse cx={left + rx * 0.5} cy={rimY + 22} rx="2" ry="6.5" fill="#fff" opacity="0.65" />
      </g>
      <path
        d={frontArc(rimY)}
        fill="none"
        stroke="#7cbba6"
        strokeOpacity="0.55"
        strokeWidth="0.8"
      />

      <ellipse cx={cx} cy={rimY} rx={rx} ry={ry} fill="#3d7d6a" />
      <ellipse cx={cx} cy={rimY + 0.6} rx={rx - 3} ry={ry - 2.4} fill={paint("inside")} />
      <g clipPath={paint("opening")}>
        <ellipse cx={cx} cy={rimY + 7.4} rx={rx - 4.6} ry={ry - 3.2} fill={paint("coffee")} />
        <ellipse cx={cx - 9} cy={rimY + 5.8} rx="7" ry="1.3" fill="#fff" opacity="0.3" />
      </g>
      <path
        d={`M${left + 0.6} ${rimY}A${rx} ${ry} 0 0 1 ${right - 0.6} ${rimY}`}
        fill="none"
        stroke="#bfe8d8"
        strokeOpacity="0.55"
        strokeWidth="0.9"
      />

      <g fill="none" stroke="#fff" strokeLinecap="round" filter={paint("haze")}>
        <path
          d={`M${cx - 7} ${rimY - 2}C${cx - 17} ${rimY - 22} ${cx + 5} ${rimY - 34} ${cx - 5} ${rimY - 60}`}
          strokeOpacity="0.07"
          strokeWidth="7"
        />
        <path
          d={`M${cx + 8} ${rimY - 3}C${cx + 17} ${rimY - 20} ${cx} ${rimY - 36} ${cx + 11} ${rimY - 54}`}
          strokeOpacity="0.05"
          strokeWidth="5"
        />
      </g>
    </g>
  );
}

const PAD_PLANE = deskPlane({ x: 842, y: 648, angleDeg: -5, squash: DESK_DEPTH_SQUASH });
const PAD: readonly Point[] = roundedRect(250, 214, 12, 4);
const MOUSE = { x: 848, y: 630, angle: -7 } as const;

const MOUSE_SHELL: readonly Point[] = Array.from({ length: 72 }, (_, i): Point => {
  const t = (i / 72) * Math.PI * 2;
  const c = Math.cos(t);
  const s = Math.sin(t);
  const a = 28 + 2 * s;
  const b = 21.5 - 2.5 * s;
  const n = 3;
  return [a * Math.sign(c) * Math.abs(c) ** (2 / n), b * Math.sign(s) * Math.abs(s) ** (2 / n)];
});

function placeMouse([u, v]: Point): Point {
  const rad = (MOUSE.angle * Math.PI) / 180;
  return [
    MOUSE.x + u * Math.cos(rad) - v * Math.sin(rad),
    MOUSE.y + u * Math.sin(rad) + v * Math.cos(rad),
  ];
}

const STARS: readonly (readonly [number, number, number])[] = [
  [-102, -86, 1.4],
  [-74, -58, 1],
  [-46, -92, 1.8],
  [-18, -66, 1.1],
  [14, -94, 1.3],
  [36, -46, 1],
  [-92, -30, 1.2],
  [-58, -18, 0.9],
  [104, -18, 1.1],
  [112, -86, 1.5],
  [-24, -34, 0.8],
  [8, -18, 1.2],
  [58, -88, 0.9],
  [92, -46, 0.8],
];

function MousePad({ paint }: { paint: Paint }) {
  const outline = PAD.map(([u, v]) => PAD_PLANE.toScene(u, v));
  return (
    <g>
      <polygon
        points={toPoints(outline.map(shift(7, 9)))}
        fill="#000"
        opacity="0.45"
        filter={paint("soft")}
      />
      <Slab outline={outline} depth={3.6} lit="#4b516a" shaded="#101219" />
      <g transform={PAD_PLANE.transform}>
        <polygon points={toPoints(PAD)} fill={paint("sky")} />
        <g clipPath={paint("padClip")}>
          {STARS.map(([x, y, r]) => (
            <circle key={`${x}-${y}`} cx={x} cy={y} r={r} fill="#fff8d8" opacity="0.85" />
          ))}
          {[
            [-46, -92],
            [112, -86],
          ].map(([x = 0, y = 0]) => (
            <path
              key={`${x}-${y}`}
              d={`M${x} ${y - 6}L${x + 1} ${y - 1}L${x + 6} ${y}L${x + 1} ${y + 1}L${x} ${y + 6}L${x - 1} ${y + 1}L${x - 6} ${y}L${x - 1} ${y - 1}Z`}
              fill="#fff8d8"
              opacity="0.7"
            />
          ))}
          <path d="M70 -84A18 18 0 1 0 82 -52A14 14 0 1 1 70 -84Z" fill="#fff1bd" />
          <path d="M-125 58C-84 30 -42 50 -2 40C38 30 80 22 125 46V107H-125Z" fill="#1d2550" />
          <path d="M-125 84C-72 60 -22 80 30 70C70 62 100 74 125 70V107H-125Z" fill="#121735" />
          <path d="M-70 62V50L-61 43L-52 50V62Z" fill="#0d112a" />
          <rect x="-64" y="52" width="4" height="4" fill="#ffd56b" />
          <rect
            x="-121"
            y="-103"
            width="242"
            height="206"
            rx="9"
            fill="none"
            stroke="#a9b4d8"
            strokeOpacity="0.5"
            strokeWidth="1.6"
            strokeDasharray="4 3"
          />
        </g>
        <polygon
          points={toPoints(PAD)}
          fill="none"
          stroke="#fff"
          strokeOpacity="0.1"
          strokeWidth="2"
        />
      </g>
    </g>
  );
}

function MouseBody({ paint }: { paint: Paint }) {
  const outline = MOUSE_SHELL.map(placeMouse);
  const [tailX, tailY] = placeMouse([0, -31]);
  const cable = `M${tailX} ${tailY}C${tailX - 3} ${tailY - 22} ${tailX - 46} ${tailY - 24} 750 568S690 540 668 531`;
  return (
    <g>
      <path d={cable} fill="none" stroke="#7d755f" strokeWidth="3.6" strokeLinecap="round" />
      <path d={cable} fill="none" stroke="#d6cdb3" strokeWidth="2" strokeLinecap="round" />
      <path
        d={cable}
        fill="none"
        stroke="#fffaf0"
        strokeOpacity="0.6"
        strokeWidth="0.7"
        strokeLinecap="round"
        transform="translate(-0.6 -0.6)"
      />
      <polygon
        points={toPoints(outline.map(shift(8, 11)))}
        fill="#000"
        opacity="0.5"
        filter={paint("soft")}
      />
      <polygon
        points={toPoints(outline.map(shift(1, 10)))}
        fill="#000"
        opacity="0.45"
        filter={paint("tight")}
      />
      <Slab outline={outline} depth={10} lit="#ddd5bd" shaded="#867d63" />
      <g transform={`translate(${MOUSE.x} ${MOUSE.y}) rotate(${MOUSE.angle})`}>
        <path d="M-3.4 -23L-2.6 -31H2.6L3.4 -23Z" fill="#a99f83" />
        <polygon points={toPoints(MOUSE_SHELL)} fill={paint("shell")} />
        <g clipPath={paint("shellClip")}>
          <path d="M-32 -28H32V-5Q0 -10 -32 -5Z" fill="#000" opacity="0.04" />
          <path d="M-32 -5Q0 -10 32 -5" fill="none" stroke="#8a8168" strokeWidth="1.1" />
          <path
            d="M-32 -4Q0 -9 32 -4"
            fill="none"
            stroke="#fffaf0"
            strokeOpacity="0.85"
            strokeWidth="0.7"
          />
          <path d="M0 -28V-7.6" stroke="#8a8168" strokeWidth="1" />
          <path d="M0.9 -28V-7.6" stroke="#fffaf0" strokeOpacity="0.7" strokeWidth="0.6" />
          <ellipse
            cx="-9"
            cy="5"
            rx="7"
            ry="9"
            fill="#fff"
            opacity="0.5"
            transform="rotate(-24 -9 5)"
            filter={paint("tight")}
          />
        </g>
        <polygon points={toPoints(MOUSE_SHELL)} fill="none" stroke="#a0977c" strokeWidth="0.8" />
      </g>
    </g>
  );
}

export function MouseArea() {
  const { id, paint } = useSvgIds();
  return (
    <g>
      <defs>
        <linearGradient id={id("sky")} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#141a44" />
          <stop offset="0.6" stopColor="#2b2f6e" />
          <stop offset="1" stopColor="#4a3878" />
        </linearGradient>
        <radialGradient id={id("shell")} cx="0.42" cy="0.45" r="0.68" fx="0.36" fy="0.36">
          <stop offset="0" stopColor="#fffbef" />
          <stop offset="0.38" stopColor="#ece5cf" />
          <stop offset="0.78" stopColor="#d1c8ac" />
          <stop offset="1" stopColor="#b2a88b" />
        </radialGradient>
        <clipPath id={id("padClip")}>
          <polygon points={toPoints(PAD)} />
        </clipPath>
        <clipPath id={id("shellClip")}>
          <polygon points={toPoints(MOUSE_SHELL)} />
        </clipPath>
        <filter id={id("soft")} x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="4.5" />
        </filter>
        <filter id={id("tight")} x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="2" />
        </filter>
      </defs>
      <MousePad paint={paint} />
      <MouseBody paint={paint} />
    </g>
  );
}
