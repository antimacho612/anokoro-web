import { useEffect } from "react";
import { useKit } from "../store.ts";
import { NEWS } from "./news.ts";

export function NewsContent() {
  const markNewsSeen = useKit((s) => s.markNewsSeen);

  useEffect(() => {
    const latest = NEWS[0];
    if (latest) markNewsSeen(latest.date);
  }, [markNewsSeen]);

  return (
    <>
      <h3>お知らせ・更新情報</h3>
      {NEWS.map((entry) => (
        <article key={`${entry.date}-${entry.title}`}>
          <h4>
            <time dateTime={entry.date}>{entry.date.replaceAll("-", "/")}</time>
            {entry.title}
          </h4>
          {entry.lines.map((line) => (
            <p key={line}>{line}</p>
          ))}
        </article>
      ))}
    </>
  );
}
