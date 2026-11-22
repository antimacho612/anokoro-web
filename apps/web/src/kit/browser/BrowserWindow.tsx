import { formatResolution, resolutionPeriodForYear } from "@anokoro/era-data";
import { useEffect, useState, type RefCallback } from "react";
import { Window } from "../../ui/Window/Window.tsx";
import { slotClass } from "../layout/KitLayout.tsx";
import { BLANK_PAGE } from "../line/frame-page.ts";
import { frameSlot, netController } from "../line/net.ts";
import { useKit } from "../store.ts";
import styles from "./BrowserWindow.module.css";
import { SITE_ROOT } from "./pseudo-url.ts";
import { findResolution, resolutionValue } from "./resolution.ts";
import { stageLayout } from "./stage-layout.ts";

type BrowserWindowProps = {
  html: string;
  pageTitle: string;
};

/** 表示領域の幅を見張る。縮小率の計算に使う */
function useElementWidth(): [RefCallback<HTMLElement>, number] {
  const [element, setElement] = useState<HTMLElement | null>(null);
  const [width, setWidth] = useState(0);
  useEffect(() => {
    if (!element) return;
    const observer = new ResizeObserver(() => setWidth(element.clientWidth));
    observer.observe(element);
    return () => observer.disconnect();
  }, [element]);
  return [setElement, width];
}

function AdBanner({ isLoading }: { isLoading: boolean }) {
  if (isLoading) return <span className={styles.adLoading}>広告を読み込んでいます...</span>;
  return (
    <>
      <span className={styles.adLogo}>ほげスペース</span>
      <span>
        無料で<b>50MB</b>！ホームページを作ろう♪
      </span>
      <span className={styles.adLink}>今すぐ登録</span>
    </>
  );
}

export function BrowserWindow({ html, pageTitle }: BrowserWindowProps) {
  const year = useKit((s) => s.year);
  const status = useKit((s) => s.status);
  const resolution = useKit((s) => s.resolution);
  const setResolution = useKit((s) => s.setResolution);
  const display = useKit((s) => s.display);
  const netFrameKey = useKit((s) => s.netFrameKey);
  const isLoading = useKit((s) => s.loading);
  const progressRatio = useKit((s) => s.progressRatio);
  const isAdLoading = useKit((s) => s.adLoading);
  const [viewportRef, viewportWidth] = useElementWidth();

  const candidates = resolutionPeriodForYear(year).candidates;
  const layout = stageLayout(resolution, viewportWidth);
  const title = `${pageTitle || "無題"} - ネットサーファー`;
  const isNet = display === "net";

  const handleResolutionChange = (value: string): void => {
    const next = findResolution(year, value);
    if (next) setResolution(next);
  };

  const handleReload = (): void => {
    void netController.reload();
  };

  return (
    <Window title={title} controls={["_", "□", "×"]} className={slotClass.browser}>
      <div className="menubar">
        <span>ファイル(F)</span>
        <span>編集(E)</span>
        <span>表示(V)</span>
        <span>お気に入り(A)</span>
        <span>ツール(T)</span>
        <span>ヘルプ(H)</span>
      </div>
      <div className={styles.navrow}>
        <button type="button" className="btn" disabled>
          ← 戻る
        </button>
        <button type="button" className="btn" disabled>
          進む →
        </button>
        <button
          type="button"
          className="btn"
          disabled={!isLoading}
          onClick={() => netController.stop()}
        >
          中止
        </button>
        <button type="button" className="btn" onClick={handleReload}>
          更新
        </button>
        <button type="button" className="btn" disabled>
          ホーム
        </button>
        <label className={styles.res}>
          画面:
          <select
            value={resolutionValue(resolution)}
            onChange={(e) => handleResolutionChange(e.currentTarget.value)}
          >
            {candidates.map((r) => (
              <option key={resolutionValue(r)} value={resolutionValue(r)}>
                {formatResolution(r)}
              </option>
            ))}
          </select>
        </label>
      </div>
      <div className={styles.addr}>
        アドレス(D)
        <div className={`${styles.addrBox} sunken`}>{`${SITE_ROOT}index.html`}</div>
        <button type="button" className="btn" onClick={handleReload}>
          移動
        </button>
      </div>
      <div
        ref={viewportRef}
        className={`${styles.viewport} sunken`}
        style={{ height: layout.viewportHeight }}
      >
        <div
          className={styles.stage}
          style={{
            width: layout.stageWidth,
            height: layout.stageHeight,
            left: layout.left,
            transform: `scale(${layout.scale})`,
          }}
        >
          <div className={styles.adbar}>
            <AdBanner isLoading={isAdLoading} />
          </div>
          <iframe
            key={isNet ? `net-${netFrameKey}` : "local"}
            ref={frameSlot.attach}
            className={styles.frame}
            sandbox="allow-same-origin"
            title="プレビュー"
            srcDoc={isNet ? BLANK_PAGE : html}
            style={{ width: layout.stageWidth, height: layout.frameHeight }}
          />
        </div>
      </div>
      <div className={styles.statusbar}>
        <div className={styles.statusMain} role="status">
          {status}
        </div>
        {isLoading && (
          <div
            className={`${styles.pbar} sunken`}
            role="progressbar"
            aria-label="読み込みの進み具合"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={Math.round(progressRatio * 100)}
          >
            <i style={{ width: `${progressRatio * 100}%` }} />
          </div>
        )}
        <div>🌐 インターネット</div>
      </div>
    </Window>
  );
}
