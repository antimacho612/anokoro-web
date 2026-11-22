import { systemClock, type Clock, type TimerId } from "./clock.ts";

export type DialupKind = "modem" | "isdn";

export interface DialStep {
  atMs: number;
  message: string;
}

export interface DialSchedule {
  steps: readonly DialStep[];
  connectedAtMs: number;
}

const DIALING = "ダイヤル中...";
const AUTHENTICATING = "ユーザー名とパスワードを確認しています...";
const REGISTERING = "ネットワークにコンピュータを登録しています...";

export const DIAL_SCHEDULES: Record<DialupKind, DialSchedule> = {
  modem: {
    steps: [
      { atMs: 0, message: DIALING },
      { atMs: 2550, message: "呼び出し中..." },
      { atMs: 3750, message: "接続を確立しています..." },
      { atMs: 8900, message: AUTHENTICATING },
      { atMs: 9900, message: REGISTERING },
    ],
    connectedAtMs: 10800,
  },
  isdn: {
    steps: [
      { atMs: 0, message: DIALING },
      { atMs: 600, message: AUTHENTICATING },
      { atMs: 1300, message: REGISTERING },
    ],
    connectedAtMs: 1900,
  },
};

export interface DialOptions {
  kind: DialupKind;
  clock?: Clock;
  onStep?: (step: DialStep) => void;
}

export interface DialHandle {
  /** 切断する。以降 onStep は呼ばれない */
  abort(): void;
  /** 接続できたら true、切断されたら false */
  readonly done: Promise<boolean>;
}

export function dial({ kind, clock = systemClock, onStep = () => {} }: DialOptions): DialHandle {
  const { steps, connectedAtMs } = DIAL_SCHEDULES[kind];
  let resolve!: (connected: boolean) => void;
  const done = new Promise<boolean>((r) => (resolve = r));
  let finished = false;
  const timers: TimerId[] = [];

  const finish = (connected: boolean) => {
    if (finished) return;
    finished = true;
    for (const id of timers) clock.clearTimeout(id);
    resolve(connected);
  };

  for (const step of steps) {
    timers.push(clock.setTimeout(() => onStep(step), step.atMs));
  }
  timers.push(clock.setTimeout(() => finish(true), connectedAtMs));

  return { abort: () => finish(false), done };
}
