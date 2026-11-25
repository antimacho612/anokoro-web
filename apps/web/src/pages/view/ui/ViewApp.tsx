import { checkEra } from "@anokoro/era-checker";
import { SITE_KINDS } from "@anokoro/era-data";
import { SITE_CATEGORIES } from "@anokoro/shared";
import { openSiteStore } from "@anokoro/site-store";
import { useState } from "react";
import { BrowserWindow } from "../../../widgets/browser-window/index.ts";
import { HelpButton } from "../../../features/help/index.ts";
import { HelpWindow } from "../../../widgets/help-window/index.ts";
import { InfoWindow } from "../../../widgets/info-window/index.ts";
import { LineWindow } from "../../../widgets/line-window/index.ts";
import { storage } from "../../../shared/lib/index.ts";
import type { Workspace } from "../../../features/site-workspace/index.ts";
import { useKit } from "../../../entities/kit-state/index.ts";
import { Taskbar, taskbarLinkClass } from "../../../widgets/taskbar/index.ts";
import { TimeMachineBar } from "../../../widgets/time-machine-bar/index.ts";
import { NOT_FOUND_TITLE, notFoundPage } from "../../../entities/site/index.ts";
import { kindTopic } from "../../../entities/site/index.ts";
import { Window } from "../../../shared/ui/window/index.ts";
import { importToKit } from "../lib/import-to-kit.ts";
import type { ViewSource } from "../model/view-source.ts";
import { RepositoryLink } from "../../../shared/ui/repository-link/index.ts";
import styles from "./ViewApp.module.css";

const BASE = import.meta.env.BASE_URL;

type ViewAppProps = {
  source: ViewSource;
  navigator: Workspace;
};

type ImportState = { kind: "idle" } | { kind: "working" } | { kind: "failed" };

function ViewTaskbar() {
  const year = useKit((s) => s.year);
  return (
    <Taskbar
      links={
        <a className={taskbarLinkClass} href={`${BASE}kit/`}>
          作成キットへ
        </a>
      }
      copyLabel="このページの URL をコピー"
      copiedNotice="このページのURLをコピーしました"
      yearLabel={`${year}年`}
    />
  );
}

export function ViewApp({ source, navigator }: ViewAppProps) {
  if (source.kind === "error") {
    return (
      <>
        <ViewTaskbar />
        <main className={styles.errorMain}>
          <Window title="ネットサーファー" controls={["×"]}>
            <p className={styles.error} role="alert">
              {source.message}
            </p>
            <p className={styles.error}>
              <a href={`${BASE}kit/`}>作成キットへ</a>
            </p>
          </Window>
        </main>
      </>
    );
  }
  return <SiteView source={source} navigator={navigator} />;
}

function SiteView({
  source,
  navigator,
}: {
  source: Exclude<ViewSource, { kind: "error" }>;
  navigator: Workspace;
}) {
  const year = useKit((s) => s.year);
  const shownSource = useKit((s) => s.shownSource);
  const counter = useKit((s) => s.counter);
  const notFoundUrl = useKit((s) => s.notFoundUrl);
  const [importState, setImportState] = useState<ImportState>({ kind: "idle" });
  const { site } = source;

  const view = checkEra(shownSource, { year, mode: "local", counter });

  const handleImport = (): void => {
    setImportState({ kind: "working" });
    importToKit(site, { open: () => openSiteStore(), storage })
      .then(() => window.location.assign(`${BASE}kit/`))
      .catch(() => setImportState({ kind: "failed" }));
  };

  return (
    <>
      <ViewTaskbar />
      <header className={styles.top}>
        <h1 className="dot">{site.name}</h1>
        <RepositoryLink />
      </header>
      <TimeMachineBar />
      <main className={styles.layout}>
        <BrowserWindow
          html={notFoundUrl === null ? view.html : notFoundPage(notFoundUrl)}
          pageTitle={notFoundUrl === null ? view.title : NOT_FOUND_TITLE}
          navigator={navigator}
        />
        <div className={styles.side}>
          <Window title="このサイトについて">
            <dl className={styles.props}>
              <dt>サイト名</dt>
              <dd>{site.name}</dd>
              <dt>サイトの年</dt>
              <dd>{site.year} 年</dd>
              <dt>種類</dt>
              <dd>
                {SITE_KINDS[site.genre].label} <HelpButton topic={kindTopic(site.genre)} />
              </dd>
              <dt>カテゴリ</dt>
              <dd>{SITE_CATEGORIES[site.category]}</dd>
              <dt>ページ数</dt>
              <dd>{site.pages.length}</dd>
            </dl>
            {source.kind === "sample" ? (
              <p className="hint">見本サイト：{source.sample.description}</p>
            ) : (
              <p className="hint">
                共有されたサイトです。スクリプトは動かさず、時代チェッカーを通して表示しています。
              </p>
            )}
            <p className={styles.actions}>
              <button
                type="button"
                className="btn"
                disabled={importState.kind === "working"}
                onClick={handleImport}
              >
                キットに取り込む
              </button>
            </p>
            {importState.kind === "failed" && (
              <p className={styles.error} role="alert">
                このブラウザでは保存できないため、取り込めませんでした。
              </p>
            )}
          </Window>
          <LineWindow />
        </div>
      </main>
      <HelpWindow />
      <InfoWindow screen="view" />
    </>
  );
}
