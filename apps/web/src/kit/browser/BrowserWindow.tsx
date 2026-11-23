import { formatResolution, resolutionPeriodForYear } from "@anokoro/era-data";
import { useElementWidth } from "../../ui/use-element-width.ts";
import { Window } from "../../ui/Window/Window.tsx";
import { HelpMenu } from "../help/HelpMenu.tsx";
import { slotClass } from "../layout/KitLayout.tsx";
import { BLANK_PAGE } from "../line/frame-page.ts";
import { frameSlot, netController } from "../line/net.ts";
import { kitStore, useKit } from "../store.ts";
import styles from "./BrowserWindow.module.css";
import { canGoBack, canGoForward } from "../../site/browser-history.ts";
import { captureLinks } from "../../site/link-capture.ts";
import { resolveLink } from "../../site/link-target.ts";
import { findPage } from "../../site/site-model.ts";
import type { Workspace } from "../sites/workspace.ts";
import { SITE_ROOT } from "./pseudo-url.ts";
import { findResolution, resolutionValue } from "./resolution.ts";
import { stageLayout } from "./stage-layout.ts";

/** 疑似ブラウザのページ移動。作成キットでも閲覧画面でも、開いているサイトの中を動く */
export type BrowserNavigator = Pick<
  Workspace,
  "back" | "forward" | "home" | "followLink" | "current"
>;

type BrowserWindowProps = {
  html: string;
  pageTitle: string;
  navigator: BrowserNavigator;
};

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

export function BrowserWindow({ html, pageTitle, navigator }: BrowserWindowProps) {
  const year = useKit((s) => s.year);
  const status = useKit((s) => s.status);
  const resolution = useKit((s) => s.resolution);
  const setResolution = useKit((s) => s.setResolution);
  const display = useKit((s) => s.display);
  const netFrameKey = useKit((s) => s.netFrameKey);
  const isLoading = useKit((s) => s.loading);
  const progressRatio = useKit((s) => s.progressRatio);
  const isAdLoading = useKit((s) => s.adLoading);
  const pagePath = useKit((s) => s.pagePath);
  const notFoundUrl = useKit((s) => s.notFoundUrl);
  const history = useKit((s) => s.history);
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

  const reloadIfNet = (): void => {
    if (isNet) void netController.reload();
  };

  const handleFrameLoad = (frame: HTMLIFrameElement): void => {
    const doc = frame.contentDocument;
    if (!doc) return;
    captureLinks(doc, (href) => {
      const site = navigator.current();
      const target = resolveLink({
        href,
        currentPath: pagePath,
        hasPage: (path) => site !== undefined && findPage(site, path) !== undefined,
        siteRoot: SITE_ROOT,
      });
      if (target.kind === "hash") return false;
      navigator.followLink(target);
      if (target.kind === "page") reloadIfNet();
      return true;
    });
  };

  const go = (move: () => void): void => {
    move();
    if (kitStore.getState().notFoundUrl === null) reloadIfNet();
  };

  const address = notFoundUrl ?? `${SITE_ROOT}${pagePath}`;

  return (
    <Window title={title} controls={["_", "□", "×"]} className={slotClass.browser}>
      <div className="menubar">
        <span>ファイル(F)</span>
        <span>編集(E)</span>
        <span>表示(V)</span>
        <span>お気に入り(A)</span>
        <span>ツール(T)</span>
        <HelpMenu />
      </div>
      <div className={styles.navrow}>
        <button
          type="button"
          className="btn"
          disabled={!canGoBack(history)}
          onClick={() => go(() => navigator.back())}
        >
          ← 戻る
        </button>
        <button
          type="button"
          className="btn"
          disabled={!canGoForward(history)}
          onClick={() => go(() => navigator.forward())}
        >
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
        <button type="button" className="btn" onClick={() => go(() => navigator.home())}>
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
        <div className={`${styles.addrBox} sunken`} data-testid="address">
          {address}
        </div>
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
            onLoad={(e) => handleFrameLoad(e.currentTarget)}
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
