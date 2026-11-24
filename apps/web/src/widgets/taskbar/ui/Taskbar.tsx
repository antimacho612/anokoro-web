import { SITE_ICON, toDataUri } from "@anokoro/assets";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { HelpToggle } from "../../../features/help/index.ts";
import { hasUnreadNews } from "../../../features/news/index.ts";
import { NEWS } from "../../../features/news/index.ts";
import { useKit } from "../../../entities/kit-state/index.ts";
import styles from "./Taskbar.module.css";

const SITE_ICON_SRC = toDataUri(SITE_ICON.svg);
const NOTICE_MS = 3000;

export const taskbarItemClass = `btn ${styles.item}`;
export const taskbarLinkClass = `${taskbarItemClass} ${styles.link}`;

type TaskbarProps = {
  /** 「解説」の後ろに置く、画面ごとのリンク */
  links: ReactNode;
  /** 「このサイトについて」の後ろに置く、画面ごとのボタン */
  tools?: ReactNode;
  copyLabel: string;
  copiedNotice: string;
  /** 右端の年を押したとき。省くと年はボタンにしない */
  onYearClick?: () => void;
  yearLabel: string;
};

/** 画面の上端の帯。作成キットと時代まちがいさがしで共有する */
export function Taskbar({
  links,
  tools,
  copyLabel,
  copiedNotice,
  onYearClick,
  yearLabel,
}: TaskbarProps) {
  const year = useKit((s) => s.year);
  const newsSeen = useKit((s) => s.newsSeen);
  const openInfo = useKit((s) => s.openInfo);
  const [notice, setNotice] = useState("");
  const noticeTimer = useRef<number | undefined>(undefined);

  useEffect(() => () => window.clearTimeout(noticeTimer.current), []);

  const showNotice = (text: string): void => {
    setNotice(text);
    window.clearTimeout(noticeTimer.current);
    noticeTimer.current = window.setTimeout(() => setNotice(""), NOTICE_MS);
  };

  const handleCopyUrl = async (): Promise<void> => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      showNotice(copiedNotice);
    } catch {
      showNotice("URLをコピーできませんでした");
    }
  };

  const hasUnread = hasUnreadNews(NEWS, newsSeen);

  return (
    <nav className={styles.bar} aria-label="タスクバー">
      <img className={styles.icon} src={SITE_ICON_SRC} alt="あのころ Web" width={24} height={24} />
      <div className={styles.items}>
        <button type="button" className={taskbarItemClass} onClick={() => openInfo("usage")}>
          使い方
        </button>
        <HelpToggle className={taskbarItemClass}>解説</HelpToggle>
        {links}
        <button type="button" className={taskbarItemClass} onClick={() => openInfo("news")}>
          お知らせ・更新情報
          {hasUnread && (
            <>
              <span className={styles.unread} aria-hidden="true">
                ●
              </span>
              <span className={styles.srOnly}>（未読あり）</span>
            </>
          )}
        </button>
        <button type="button" className={taskbarItemClass} onClick={() => openInfo("about")}>
          このサイトについて
        </button>
        {tools}
        <button type="button" className={taskbarItemClass} onClick={() => void handleCopyUrl()}>
          {copyLabel}
        </button>
      </div>
      <div className={`${styles.tray} sunken`}>
        <output className={styles.notice} aria-live="polite">
          {notice}
        </output>
        {onYearClick ? (
          <button
            type="button"
            className={`${styles.trayButton} dot`}
            aria-label={yearLabel}
            onClick={onYearClick}
          >
            {year}年
          </button>
        ) : (
          <span className={`${styles.trayYear} dot`} aria-label={yearLabel}>
            {year}年
          </span>
        )}
      </div>
    </nav>
  );
}
