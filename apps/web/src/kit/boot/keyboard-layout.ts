export type KeyUnits = number;

export interface KeySpec {
  x: KeyUnits;
  y: KeyUnits;
  w: KeyUnits;
  h: KeyUnits;
  label: string;
  kana?: string;
  tone: "alpha" | "mod";
  notchWidth?: KeyUnits;
}

export interface KeyPart {
  x: KeyUnits;
  y: KeyUnits;
  w: KeyUnits;
  h: KeyUnits;
}

type KeyDef = readonly [label: string, width: number, tone?: "mod", kana?: string];

export const KEYBOARD_WIDTH = 23;
export const KEYBOARD_DEPTH = 6.15;
export const MAIN_BLOCK_WIDTH = 15;
const FUNCTION_ROW_HEIGHT = 0.8;
const MAIN_ROW_TOP = 1.15;
const NAV_LEFT = 15.5;
const NUMPAD_LEFT = 19;

function row(y: number, defs: readonly KeyDef[], left = 0): KeySpec[] {
  let x = left;
  return defs.map(([label, w, tone, kana]) => {
    const key: KeySpec = { x, y, w, h: 1, label, tone: tone ?? "alpha", ...(kana && { kana }) };
    x += w;
    return key;
  });
}

const singles = (labels: string): KeyDef[] => labels.split("").map((label) => [label, 1] as const);

/** かなの並びは JIS X 6002 による */
const withKana = (labels: string, kana: string): KeyDef[] =>
  labels.split("").map((label, i) => [label, 1, undefined, kana[i]] as const);

const ENTER_WIDTH = 1.5;
const ENTER_NOTCH = 0.25;

const MAIN_ROWS: readonly (readonly KeyDef[])[] = [
  [
    ["半/全", 1, "mod"],
    ...withKana("1234567890-^¥", "ぬふあうえおやゆよわほへー"),
    ["BS", 1, "mod"],
  ],
  [["Tab", 1.5, "mod"], ...withKana("QWERTYUIOP@[", "たていすかんなにらせ゛゜")],
  [["Caps", 1.75, "mod"], ...withKana("ASDFGHJKL;:]", "ちとしはきくまのりれけむ")],
  [
    ["Shift", 2.25, "mod"],
    ...withKana("ZXCVBNM,./\\", "つさそひこみもねるめろ"),
    ["Shift", 1.75, "mod"],
  ],
  [
    ["Ctrl", 1.5, "mod"],
    ["Alt", 1.25, "mod"],
    ["無変換", 1.25, "mod"],
    ["", 5],
    ["変換", 1.25, "mod"],
    ["かな", 1.25, "mod"],
    ["Alt", 1.25, "mod"],
    ["Ctrl", 2.25, "mod"],
  ],
];

function functionRow(): KeySpec[] {
  const fKeys = (from: number, left: number): KeySpec[] =>
    Array.from({ length: 4 }, (_, i) => ({
      x: left + i,
      y: 0,
      w: 1,
      h: FUNCTION_ROW_HEIGHT,
      label: `F${from + i}`,
      tone: "mod" as const,
    }));
  return [
    { x: 0, y: 0, w: 1, h: FUNCTION_ROW_HEIGHT, label: "Esc", tone: "mod" },
    ...fKeys(1, 2),
    ...fKeys(5, 6.5),
    ...fKeys(9, 11),
    ...["PrtSc", "ScrLk", "Pause"].map((label, i) => ({
      x: NAV_LEFT + i,
      y: 0,
      w: 1,
      h: FUNCTION_ROW_HEIGHT,
      label,
      tone: "mod" as const,
    })),
  ];
}

function navCluster(): KeySpec[] {
  const y = (r: number) => MAIN_ROW_TOP + r;
  return [
    ...row(
      y(0),
      [
        ["Ins", 1, "mod"],
        ["Home", 1, "mod"],
        ["PgUp", 1, "mod"],
      ],
      NAV_LEFT,
    ),
    ...row(
      y(1),
      [
        ["Del", 1, "mod"],
        ["End", 1, "mod"],
        ["PgDn", 1, "mod"],
      ],
      NAV_LEFT,
    ),
    ...row(y(3), [["↑", 1, "mod"]], NAV_LEFT + 1),
    ...row(
      y(4),
      [
        ["←", 1, "mod"],
        ["↓", 1, "mod"],
        ["→", 1, "mod"],
      ],
      NAV_LEFT,
    ),
  ];
}

function numpad(): KeySpec[] {
  const y = (r: number) => MAIN_ROW_TOP + r;
  const tall = (label: string, r: number): KeySpec => ({
    x: NUMPAD_LEFT + 3,
    y: y(r),
    w: 1,
    h: 2,
    label,
    tone: "mod",
  });
  return [
    ...row(
      y(0),
      [
        ["Num", 1, "mod"],
        ["/", 1, "mod"],
        ["*", 1, "mod"],
        ["-", 1, "mod"],
      ],
      NUMPAD_LEFT,
    ),
    ...row(y(1), singles("789"), NUMPAD_LEFT),
    tall("+", 1),
    ...row(y(2), singles("456"), NUMPAD_LEFT),
    ...row(y(3), singles("123"), NUMPAD_LEFT),
    tall("Enter", 3),
    ...row(
      y(4),
      [
        ["0", 2],
        [".", 1],
      ],
      NUMPAD_LEFT,
    ),
  ];
}

const ENTER: KeySpec = {
  x: MAIN_BLOCK_WIDTH - ENTER_WIDTH,
  y: MAIN_ROW_TOP + 1,
  w: ENTER_WIDTH,
  h: 2,
  label: "Enter",
  tone: "mod",
  notchWidth: ENTER_NOTCH,
};

export const KEYS: readonly KeySpec[] = [
  ...functionRow(),
  ...MAIN_ROWS.flatMap((defs, r) => row(MAIN_ROW_TOP + r, defs)),
  ENTER,
  ...navCluster(),
  ...numpad(),
].toSorted((a, b) => a.y - b.y);

export const KEYBOARD_LAMPS: readonly { x: number; y: number }[] = [0, 1, 2].map((i) => ({
  x: NUMPAD_LEFT + 0.5 + i * 1.2,
  y: FUNCTION_ROW_HEIGHT / 2,
}));

export function keyParts({ x, y, w, h, notchWidth }: KeySpec): KeyPart[] {
  if (notchWidth === undefined) return [{ x, y, w, h }];
  return [
    { x, y, w, h: 1 },
    { x: x + notchWidth, y: y + 1, w: w - notchWidth, h: h - 1 },
  ];
}
