const CROCKFORD = "0123456789ABCDEFGHJKMNPQRSTVWXYZ";

/** 0 以上 256 未満の整数を返す */
export type RandomByte = () => number;

const cryptoByte: RandomByte = () => crypto.getRandomValues(new Uint8Array(1))[0] ?? 0;

/** ULID（時刻 48 ビット + 乱数 80 ビット、Crockford の base32 で 26 文字） */
export function createUlid(
  nowMs: number = Date.now(),
  randomByte: RandomByte = cryptoByte,
): string {
  let time = "";
  let rest = Math.floor(nowMs);
  for (let i = 0; i < 10; i++) {
    time = CROCKFORD[rest % 32] + time;
    rest = Math.floor(rest / 32);
  }
  let random = "";
  for (let i = 0; i < 16; i++) random += CROCKFORD[randomByte() % 32];
  return time + random;
}
