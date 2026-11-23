import { answerNote, remainingTries, type JudgeResult, type Question } from "@anokoro/quiz";

export const IGNORED_MESSAGE = "この問題は表示では見分けられません。ソース表示で行を選んでください";
export const REPEAT_MESSAGE = "そこはもう選びました";

export interface QuizMessage {
  message: string;
  /** 答え合わせの説明。終わったときだけ */
  note: string;
}

/** 判定の結果から、答えのウィンドウに出す文言を決める */
export function messageFor(question: Question, { progress, outcome }: JudgeResult): QuizMessage {
  switch (outcome) {
    case "correct":
      return { message: "正解！", note: answerNote(question) };
    case "miss":
      if (progress.kind === "failed") {
        const where = question.kind === "line" ? "答えは回線でした" : "答えはここでした";
        return { message: where, note: answerNote(question) };
      }
      return { message: `ちがうようです（残り ${remainingTries(progress)} 回）`, note: "" };
    case "repeat":
      return { message: REPEAT_MESSAGE, note: "" };
    case "ignored":
      return { message: IGNORED_MESSAGE, note: "" };
    case "finished":
      return { message: "", note: "" };
    default: {
      const exhaustive: never = outcome;
      return exhaustive;
    }
  }
}
