import { remainingTries, type JudgeResult } from "@anokoro/quiz";

export const IGNORED_MESSAGE = "この問題は表示では見分けられません。ソース表示で行を選んでください";
export const REPEAT_MESSAGE = "そこはもう選びました";

/**
 * 答えている途中に、答えのウィンドウに出す一言。
 * 終わったとき（正解、3 回の間違い）は結果の欄に出すので空にする
 */
export function messageFor({ progress, outcome }: JudgeResult): string {
  switch (outcome) {
    case "miss":
      return progress.kind === "failed"
        ? ""
        : `ちがうようです（残り ${remainingTries(progress)} 回）`;
    case "repeat":
      return REPEAT_MESSAGE;
    case "ignored":
      return IGNORED_MESSAGE;
    case "correct":
    case "finished":
      return "";
    default: {
      const exhaustive: never = outcome;
      return exhaustive;
    }
  }
}
