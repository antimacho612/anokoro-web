import styles from "./BootScreen.module.css";
import { DeskKeyboard } from "./DeskKeyboard.tsx";
import { CdCase, Disc, FloppyStack, Lamp, LampBeam, MouseArea, Mug } from "./DeskProps.tsx";
import { useSvgIds, type Paint } from "./use-svg-ids.ts";

/** 絵の座標系。モニターとキーボードがこの枠に収まり、壁、机、小物は枠の外まで描く */
export const SCENE = { width: 760, height: 700 } as const;
/** ブラウン管のガラス面 */
export const GLASS = { x: 140, y: 90, width: 480, height: 360, radius: 14 } as const;
/** 電源ボタンの中心と、ボタンの頭の半径 */
export const POWER = { cx: 612, cy: 503, r: 20 } as const;

const DESK_TOP = 480;
const FAR = 2400;

function Defs({ id }: { id: (name: string) => string }) {
  return (
    <defs>
      <linearGradient
        id={id("wall")}
        x1="0"
        y1={-900}
        x2="0"
        y2={DESK_TOP}
        gradientUnits="userSpaceOnUse"
      >
        <stop offset="0" stopColor="#111216" />
        <stop offset="1" stopColor="#25272d" />
      </linearGradient>
      <radialGradient
        id={id("wallLamp")}
        cx="0"
        cy="0"
        r="1"
        gradientUnits="userSpaceOnUse"
        gradientTransform="translate(-210 180) scale(980 760)"
      >
        <stop offset="0" stopColor="#ffc787" stopOpacity="0.34" />
        <stop offset="0.35" stopColor="#ffb877" stopOpacity="0.13" />
        <stop offset="1" stopColor="#ffb877" stopOpacity="0" />
      </radialGradient>
      <linearGradient
        id={id("desk")}
        x1="0"
        y1={DESK_TOP}
        x2="0"
        y2="980"
        gradientUnits="userSpaceOnUse"
      >
        <stop offset="0" stopColor="#80593b" />
        <stop offset="0.18" stopColor="#634229" />
        <stop offset="0.62" stopColor="#3c281a" />
        <stop offset="1" stopColor="#24170f" />
      </linearGradient>
      <radialGradient
        id={id("deskLamp")}
        cx="0"
        cy="0"
        r="1"
        gradientUnits="userSpaceOnUse"
        gradientTransform="translate(-90 600) scale(820 230)"
      >
        <stop offset="0" stopColor="#ffd09a" stopOpacity="0.3" />
        <stop offset="0.5" stopColor="#ffc285" stopOpacity="0.1" />
        <stop offset="1" stopColor="#ffc285" stopOpacity="0" />
      </radialGradient>
      <pattern id={id("grain")} width="560" height="23" patternUnits="userSpaceOnUse">
        <path
          d="M0 4C140 2 300 7 560 4"
          stroke="#000"
          strokeOpacity="0.2"
          strokeWidth="1.1"
          fill="none"
        />
        <path d="M0 10C180 12 330 8 560 10" stroke="#ffe2c0" strokeOpacity="0.07" fill="none" />
        <path
          d="M0 16C120 15 380 19 560 16"
          stroke="#000"
          strokeOpacity="0.12"
          strokeWidth="0.8"
          fill="none"
        />
        <path d="M0 20C220 21 360 19 560 20" stroke="#ffe2c0" strokeOpacity="0.05" fill="none" />
      </pattern>

      <linearGradient id={id("caseTop")} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#d9d2bd" />
        <stop offset="1" stopColor="#f2eddf" />
      </linearGradient>
      <linearGradient id={id("bezel")} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#f1ebda" />
        <stop offset="0.45" stopColor="#e2dac4" />
        <stop offset="1" stopColor="#cbc2a7" />
      </linearGradient>
      <linearGradient id={id("bezelEdge")} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#c9c0a5" />
        <stop offset="1" stopColor="#968d72" />
      </linearGradient>
      <linearGradient id={id("bezelSide")} x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stopColor="#fff" stopOpacity="0.16" />
        <stop offset="0.4" stopColor="#fff" stopOpacity="0" />
        <stop offset="1" stopColor="#3a3020" stopOpacity="0.12" />
      </linearGradient>
      <linearGradient id={id("recessTop")} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#7d7662" />
        <stop offset="1" stopColor="#5d5848" />
      </linearGradient>
      <linearGradient id={id("recessBottom")} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#c2baa0" />
        <stop offset="1" stopColor="#ddd5bd" />
      </linearGradient>
      <radialGradient id={id("glass")} cx="0.5" cy="0.45" r="0.62">
        <stop offset="0" stopColor="#1e2724" />
        <stop offset="0.6" stopColor="#0f1412" />
        <stop offset="1" stopColor="#060807" />
      </radialGradient>
      <radialGradient id={id("glassEdge")} cx="0.5" cy="0.5" r="0.72">
        <stop offset="0.72" stopColor="#000" stopOpacity="0" />
        <stop offset="1" stopColor="#000" stopOpacity="0.55" />
      </radialGradient>
      <linearGradient id={id("powerWell")} x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#7f7861" />
        <stop offset="1" stopColor="#ddd5bc" />
      </linearGradient>
      <linearGradient id={id("smallButton")} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#f2ecdb" />
        <stop offset="1" stopColor="#bcb398" />
      </linearGradient>
      <linearGradient id={id("neck")} x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stopColor="#8d856c" />
        <stop offset="0.35" stopColor="#bdb498" />
        <stop offset="1" stopColor="#8a8269" />
      </linearGradient>
      <linearGradient id={id("baseTop")} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#f0eadb" />
        <stop offset="1" stopColor="#cfc7ad" />
      </linearGradient>

      <filter id={id("soft")} x="-30%" y="-30%" width="160%" height="160%">
        <feGaussianBlur stdDeviation="5" />
      </filter>
      <filter id={id("softer")} x="-30%" y="-30%" width="160%" height="160%">
        <feGaussianBlur stdDeviation="16" />
      </filter>
      <clipPath id={id("recess")}>
        <rect x="122" y="74" width="516" height="394" rx="18" />
      </clipPath>
    </defs>
  );
}

function Room({ paint }: { paint: Paint }) {
  return (
    <g>
      <rect
        x={-FAR}
        y={-FAR}
        width={FAR * 2 + SCENE.width}
        height={FAR + DESK_TOP}
        fill={paint("wall")}
      />
      <rect
        x={-FAR}
        y={-FAR}
        width={FAR * 2 + SCENE.width}
        height={FAR + DESK_TOP}
        fill={paint("wallLamp")}
      />
      <rect
        x={-FAR}
        y={DESK_TOP - 34}
        width={FAR * 2 + SCENE.width}
        height="34"
        fill="#000"
        opacity="0.22"
        filter={paint("soft")}
      />
      <rect x={-FAR} y={DESK_TOP} width={FAR * 2 + SCENE.width} height={FAR} fill={paint("desk")} />
      <rect
        x={-FAR}
        y={DESK_TOP}
        width={FAR * 2 + SCENE.width}
        height={FAR}
        fill={paint("grain")}
      />
      <rect
        x={-FAR}
        y={DESK_TOP}
        width={FAR * 2 + SCENE.width}
        height={FAR}
        fill={paint("deskLamp")}
      />
      <rect
        x={-FAR}
        y={DESK_TOP}
        width={FAR * 2 + SCENE.width}
        height="1.5"
        fill="#b08660"
        opacity="0.7"
      />
    </g>
  );
}

function KeyboardCable() {
  return (
    <g fill="none" strokeLinecap="round">
      <path d="M380 610C380 598 392 592 420 588" stroke="#7d765f" strokeWidth="4.6" />
      <path d="M380 610C380 598 392 592 420 588" stroke="#cfc7ad" strokeWidth="2.6" />
    </g>
  );
}

/** モニターが壁と机に落とす影。小物より奥にある */
function MonitorShadow({ paint }: { paint: Paint }) {
  return (
    <g>
      <rect
        x="122"
        y="36"
        width="610"
        height="452"
        rx="30"
        fill="#000"
        opacity="0.34"
        filter={paint("softer")}
      />
      <ellipse
        cx="640"
        cy="512"
        rx="150"
        ry="26"
        fill="#000"
        opacity="0.3"
        filter={paint("softer")}
      />
    </g>
  );
}

function Monitor({ paint, isPoweredOn }: { paint: Paint; isPoweredOn: boolean }) {
  const grille = Array.from({ length: 40 }, (_, i) => ({
    x: 300 + (i % 10) * 7,
    y: 492 + Math.floor(i / 10) * 7,
  }));
  const osd = ["◀", "▶", "▼", "▲"];
  return (
    <g>
      <ellipse
        cx="392"
        cy="592"
        rx="178"
        ry="15"
        fill="#000"
        opacity="0.55"
        filter={paint("soft")}
      />
      <ellipse cx="380" cy="582" rx="152" ry="20" fill="#a1987d" />
      <ellipse cx="380" cy="577" rx="148" ry="17" fill={paint("baseTop")} />
      <path
        d="M246 572Q380 556 514 572"
        fill="none"
        stroke="#fff"
        strokeOpacity="0.55"
        strokeWidth="1.2"
      />
      <path d="M316 536H444L456 572Q380 580 304 572Z" fill={paint("neck")} />
      <path d="M316 536H444L447 546H313Z" fill="#000" opacity="0.25" />

      <path d="M104 40H656L590 6Q587 3 582 3H178Q173 3 170 6Z" fill={paint("caseTop")} />
      <path d="M104 40H656" stroke="#fffdf6" strokeWidth="1.2" />
      {Array.from({ length: 9 }, (_, i) => (
        <rect
          key={i}
          x={238 + i * 32}
          y="13"
          width="24"
          height="3"
          rx="1.2"
          fill="#8a836d"
          opacity="0.75"
        />
      ))}
      {Array.from({ length: 9 }, (_, i) => (
        <rect
          key={i}
          x={234 + i * 33}
          y="22"
          width="25"
          height="3.4"
          rx="1.3"
          fill="#8a836d"
          opacity="0.8"
        />
      ))}

      <rect x="77" y="38" width="606" height="504" rx="24" fill={paint("bezelEdge")} />
      <rect x="81" y="40" width="598" height="498" rx="22" fill={paint("bezel")} />
      <rect x="81" y="40" width="598" height="498" rx="22" fill={paint("bezelSide")} />
      <path d="M103 41.4H657" stroke="#fffdf6" strokeWidth="1.6" />
      <path d="M82.6 64V514" stroke="#fff" strokeOpacity="0.55" strokeWidth="1.2" />
      <path d="M103 536.6H657" stroke="#8f876d" strokeWidth="1.4" />

      <rect x="122" y="74" width="516" height="394" rx="18" fill="#3e3b31" />
      <g clipPath={paint("recess")}>
        <polygon points="118,70 642,70 620,90 140,90" fill={paint("recessTop")} />
        <polygon points="140,450 620,450 642,472 118,472" fill={paint("recessBottom")} />
        <polygon points="118,70 140,90 140,450 118,472" fill="#aaa288" />
        <polygon points="642,70 620,90 620,450 642,472" fill="#958d73" />
      </g>
      <rect
        x="122"
        y="74"
        width="516"
        height="394"
        rx="18"
        fill="none"
        stroke="#fffbef"
        strokeOpacity="0.5"
        strokeWidth="1"
        transform="translate(0.5 1)"
      />
      <rect
        x={GLASS.x - 1.5}
        y={GLASS.y - 1.5}
        width={GLASS.width + 3}
        height={GLASS.height + 3}
        rx={GLASS.radius + 1}
        fill="#141310"
      />
      <rect
        x={GLASS.x}
        y={GLASS.y}
        width={GLASS.width}
        height={GLASS.height}
        rx={GLASS.radius}
        fill={paint("glass")}
      />
      <rect
        x={GLASS.x}
        y={GLASS.y}
        width={GLASS.width}
        height={GLASS.height}
        rx={GLASS.radius}
        fill={paint("glassEdge")}
      />

      <text x="133" y="507" className={styles.brandEmboss}>
        あのころ Web
      </text>
      <text x="132" y="506" className={styles.brand}>
        あのころ Web
      </text>
      <text x="132" y="523" className={styles.model}>
        タイムマシン 1995–2015
      </text>
      {grille.map(({ x, y }) => (
        <g key={`${x}-${y}`}>
          <circle cx={x} cy={y + 0.7} r="1.8" fill="#fff" opacity="0.6" />
          <circle cx={x} cy={y} r="1.8" fill="#6f6955" />
        </g>
      ))}
      {osd.map((symbol, i) => (
        <g key={symbol}>
          <text x={410 + i * 26} y="495" className={styles.printed}>
            {symbol}
          </text>
          <rect x={400 + i * 26} y="499.5" width="20" height="8" rx="3" fill="#8f876d" />
          <rect
            x={400 + i * 26}
            y="498.5"
            width="20"
            height="8"
            rx="3"
            fill={paint("smallButton")}
          />
        </g>
      ))}
      <circle cx="568" cy="503" r="5.6" fill="#6d6754" />
      <circle cx="568" cy="503" r="3.6" fill={isPoweredOn ? "#7dff8c" : "#ffa425"} />
      <circle
        cx="568"
        cy="503"
        r="9"
        fill={isPoweredOn ? "#7dff8c" : "#ffa425"}
        opacity="0.28"
        filter={paint("soft")}
      />
      <circle cx="566.8" cy="501.8" r="1.1" fill="#fff" opacity="0.8" />
      <circle cx={POWER.cx} cy={POWER.cy} r="26" fill={paint("powerWell")} />
      <circle cx={POWER.cx} cy={POWER.cy} r="23" fill="#7a735d" />
      <text x={POWER.cx} y="535" className={styles.printed}>
        電源
      </text>
    </g>
  );
}

/** 起動前の机。モニター、キーボード、マウス、小物 */
export function DeskIllustration({ isPoweredOn }: { isPoweredOn: boolean }) {
  const { id, paint } = useSvgIds();
  return (
    <svg
      className={styles.illustration}
      viewBox={`0 0 ${SCENE.width} ${SCENE.height}`}
      preserveAspectRatio="xMidYMid meet"
      aria-hidden="true"
      focusable="false"
    >
      <Defs id={id} />
      <Room paint={paint} />
      <MonitorShadow paint={paint} />
      <Lamp />
      <CdCase />
      <Disc />
      <FloppyStack />
      <Mug />
      <MouseArea />
      <LampBeam />
      <KeyboardCable />
      <Monitor paint={paint} isPoweredOn={isPoweredOn} />
      <DeskKeyboard isPoweredOn={isPoweredOn} />
    </svg>
  );
}
