import { Taskbar, taskbarLinkClass } from "../../../widgets/taskbar/index.ts";
import { useKit } from "../../../entities/kit-state/index.ts";
import { kitUrl } from "../../../shared/routes/index.ts";

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
