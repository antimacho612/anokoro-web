/**
 * キリ番かどうか。
 * 100 以上で先頭以外がすべて 0、111 以上で全桁が同じ、1234 のような 1 から始まる連番のいずれか。
 */
export function isKiriban(n: number): boolean {
  if (!Number.isSafeInteger(n) || n < 100) return false;
  const digits = String(n);
  const [head, ...rest] = digits;
  if (rest.every((d) => d === "0")) return true;
  if (rest.every((d) => d === head)) return true;
  return digits.length >= 4 && "123456789".startsWith(digits);
}
