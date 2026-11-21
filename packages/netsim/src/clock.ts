export type TimerId = number;

/** 読み込みの時間を進める時計。テストでは ManualClock に差し替える */
export interface Clock {
  now(): number;
  setTimeout(fn: () => void, ms: number): TimerId;
  clearTimeout(id: TimerId): void;
}

export const systemClock: Clock = {
  now: () => performance.now(),
  setTimeout: (fn, ms) => globalThis.setTimeout(fn, ms) as unknown as TimerId,
  clearTimeout: (id) => globalThis.clearTimeout(id),
};

interface Timer {
  id: TimerId;
  at: number;
  fn: () => void;
}

/** 手で進める時計。同じ時刻のタイマーは登録順に実行する */
export class ManualClock implements Clock {
  #now: number;
  #nextId = 1;
  #timers: Timer[] = [];

  constructor(start = 0) {
    this.#now = start;
  }

  now(): number {
    return this.#now;
  }

  setTimeout(fn: () => void, ms: number): TimerId {
    const id = this.#nextId++;
    this.#timers.push({ id, at: this.#now + Math.max(0, ms), fn });
    return id;
  }

  clearTimeout(id: TimerId): void {
    this.#timers = this.#timers.filter((t) => t.id !== id);
  }

  get pending(): number {
    return this.#timers.length;
  }

  /** ms だけ進め、その間に期限が来たタイマーを実行する */
  advance(ms: number): void {
    this.#runUntil(this.#now + ms);
  }

  /** タイマーがなくなるまで進める */
  runAll(limit = 1_000_000): void {
    for (let i = 0; this.#timers.length > 0; i++) {
      if (i >= limit) throw new Error("ManualClock.runAll: タイマーが終わりません");
      this.#runUntil(this.#earliest()!.at);
    }
  }

  #earliest(): Timer | undefined {
    let first: Timer | undefined;
    for (const t of this.#timers) if (!first || t.at < first.at) first = t;
    return first;
  }

  #runUntil(end: number): void {
    for (;;) {
      const next = this.#earliest();
      if (!next || next.at > end) break;
      this.#timers = this.#timers.filter((t) => t !== next);
      this.#now = next.at;
      next.fn();
    }
    this.#now = end;
  }
}
