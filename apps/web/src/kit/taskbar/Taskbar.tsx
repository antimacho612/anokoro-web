import { SITE_ICON, toDataUri } from "@anokoro/assets";
import { useEffect, useRef, useState } from "react";
import { HelpToggle } from "../help/HelpToggle.tsx";
import { hasUnreadNews } from "../info/news-seen.ts";
import { NEWS } from "../info/news.ts";
import { useKit } from "../store.ts";
import { YEAR_SLIDER_ID } from "../time-machine/TimeMachineBar.tsx";
import styles from "./Taskbar.module.css";

const SITE_ICON_SRC = toDataUri(SITE_ICON.svg);
const NOTICE_MS = 3000;

function focusYearSlider(): void {
  const slider = document.getElementById(YEAR_SLIDER_ID);
  if (!slider) return;
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  slider.scrollIntoView({ block: "center", behavior: reduceMotion ? "auto" : "smooth" });
  slider.focus({ preventScroll: true });
}

export function Taskbar() {
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
      showNotice(`${year}年のURLをコピーしました`);
    } catch {
      showNotice("URLをコピーできませんでした");
    }
  };

  const hasUnread = hasUnreadNews(NEWS, newsSeen);
  const buttonClass = `btn ${styles.item}`;

  return (
    <nav className={styles.bar} aria-label="タスクバー">
      <img className={styles.icon} src={SITE_ICON_SRC} alt="あのころ Web" width={24} height={24} />
      <div className={styles.items}>
        <button type="button" className={buttonClass} onClick={() => openInfo("usage")}>
          使い方
        </button>
        <HelpToggle className={buttonClass}>解説</HelpToggle>
        <button type="button" className={buttonClass} onClick={() => openInfo("news")}>
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
        <button type="button" className={buttonClass} onClick={() => openInfo("about")}>
          このサイトについて
        </button>
        <button type="button" className={buttonClass} onClick={() => void handleCopyUrl()}>
          この年の URL をコピー
        </button>
      </div>
      <div className={`${styles.tray} sunken`}>
        <output className={styles.notice} aria-live="polite">
          {notice}
        </output>
        <button
          type="button"
          className={`${styles.trayButton} dot`}
          aria-label={`${year}年（タイムマシンへ移動）`}
          onClick={focusYearSlider}
        >
          {year}年
        </button>
      </div>
    </nav>
  );
}
