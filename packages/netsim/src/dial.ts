import { systemClock, type Clock, type TimerId } from "./clock.ts";

/** 常時接続はダイヤルしない */
export type DialupKind = "modem" | "isdn";

export interface DialStep {
  /** ダイヤル開始からの経過（ms） */
  at: number;
  message: string;
}

export interface DialSchedule {
  steps: readonly DialStep[];
  /** 接続済みになる経過（ms） */
  connectedAt: number;
}

const DIALING = "ダイヤル中...";
const AUTHENTICATING = "ユーザー名とパスワードを確認しています...";
const REGISTERING = "ネットワークにコンピュータを登録しています...";

export const DIAL_SCHEDULES: Record<DialupKind, DialSchedule> = {
  modem: {
    steps: [
      { at: 0, message: DIALING },
      { at: 2550, message: "呼び出し中..." },
      { at: 3750, message: "接続を確立しています..." },
      { at: 8900, message: AUTHENTICATING },
      { at: 9900, message: REGISTERING },
    ],
    connectedAt: 10800,
  },
  isdn: {
    steps: [
      { at: 0, message: DIALING },
      { at: 600, message: AUTHENTICATING },
      { at: 1300, message: REGISTERING },
    ],
    connectedAt: 1900,
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
  const { steps, connectedAt } = DIAL_SCHEDULES[kind];
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
    timers.push(clock.setTimeout(() => onStep(step), step.at));
  }
  timers.push(clock.setTimeout(() => finish(true), connectedAt));

  return { abort: () => finish(false), done };
}
