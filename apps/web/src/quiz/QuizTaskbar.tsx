import { Taskbar, taskbarLinkClass } from "../kit/taskbar/Taskbar.tsx";
import { useKit } from "../kit/store.ts";
import { kitUrl } from "./quiz-params.ts";

const BASE = import.meta.env.BASE_URL;

export function QuizTaskbar() {
  const year = useKit((s) => s.year);
  return (
    <Taskbar
      links={
        <>
          <a className={taskbarLinkClass} href={kitUrl(BASE, year)}>
            作成キットへ戻る
          </a>
          <a className={taskbarLinkClass} href={`${BASE}quiz/?daily`}>
            今日の 1 問
          </a>
        </>
      }
      copyLabel="この問題の URL をコピー"
      copiedNotice="この問題のURLをコピーしました"
      yearLabel={`出題年 ${year}年`}
    />
  );
}
