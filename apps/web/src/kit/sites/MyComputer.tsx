import { SITE_KINDS } from "@anokoro/era-data";
import { SITE_CATEGORIES } from "@anokoro/shared";
import type { LocalSite } from "@anokoro/site-store";
import { useState, type KeyboardEvent, type PointerEvent, type ReactNode } from "react";
import {
  canAddPage,
  newPageHtml,
  nextPagePath,
  normalizePagePath,
  pagePathProblem,
} from "../../site/site-model.ts";
import { siteTemplate } from "../../site/templates.ts";
import { ConfirmDialog } from "../../ui/Dialog.tsx";
import { Window } from "../../ui/Window/Window.tsx";
import { slotClass } from "../layout/KitLayout.tsx";
import { useKit } from "../store.ts";
import { FolderIcon, PageIcon } from "./icons.tsx";
import { useWorkspace, workspace } from "./instance.ts";
import styles from "./MyComputer.module.css";
import { NewSiteDialog, PageNameDialog, SiteInfoDialog } from "./SiteDialogs.tsx";
import type { NewSite } from "./workspace.ts";

type Modal =
  | { kind: "new-site" }
  | { kind: "site-info"; site: LocalSite }
  | { kind: "delete-site"; site: LocalSite }
  | { kind: "new-page" }
  | { kind: "rename-page"; path: string }
  | { kind: "delete-page"; path: string };

type IconButtonProps = {
  label: string;
  icon: ReactNode;
  isSelected: boolean;
  onSelect: () => void;
  onOpen: () => void;
};

/** 1 回のクリックで選び、ダブルクリック、Enter、タッチのタップで開く */
function IconButton({ label, icon, isSelected, onSelect, onOpen }: IconButtonProps) {
  const handlePointerUp = (e: PointerEvent<HTMLButtonElement>): void => {
    if (e.pointerType === "touch") onOpen();
  };
  const handleKeyDown = (e: KeyboardEvent<HTMLButtonElement>): void => {
    if (e.key === "Enter") {
      e.preventDefault();
      onOpen();
    }
  };
  return (
    <button
      type="button"
      className={styles.icon}
      aria-pressed={isSelected}
      onClick={onSelect}
      onDoubleClick={onOpen}
      onPointerUp={handlePointerUp}
      onKeyDown={handleKeyDown}
    >
      {icon}
      <span>{label}</span>
    </button>
  );
}

function fallbackSite(year: number): NewSite {
  return {
    name: "マイホームページ",
    year,
    genre: "personal",
    category: "diary",
    pages: [{ path: "index.html", html: siteTemplate("personal", year) }],
  };
}

export function MyComputer() {
  const sites = useWorkspace((s) => s.sites);
  const currentId = useWorkspace((s) => s.currentId);
  const target = useWorkspace((s) => s.target);
  const year = useKit((s) => s.year);
  const pagePath = useKit((s) => s.pagePath);
  const [folderId, setFolderId] = useState<string | null>(null);
  const [selectedPage, setSelectedPage] = useState<string | null>(null);
  const [modal, setModal] = useState<Modal | null>(null);

  const folder = sites.find((s) => s.id === (folderId ?? currentId)) ?? sites[0];
  const isCurrent = folder?.id === currentId;
  const selected = folder?.pages.some((p) => p.path === selectedPage) ? selectedPage : null;
  const close = (): void => setModal(null);

  const selectFolder = (id: string): void => {
    setFolderId(id);
    setSelectedPage(null);
  };

  const openPage = (site: LocalSite, path: string): void => {
    if (site.id === currentId) workspace.openPage(path);
    else workspace.openSite(site.id, path);
    setSelectedPage(path);
  };

  const handleCreate = (site: NewSite): void => {
    close();
    void workspace.createSite(site).then((created) => selectFolder(created.id));
  };

  const confirmDeleteSite = (site: LocalSite): void => {
    close();
    setFolderId(null);
    void workspace.deleteSite(site.id, fallbackSite(year));
  };

  return (
    <Window title="マイコンピュータ" controls={["_", "□", "×"]} className={slotClass.computer}>
      <div className={styles.toolbar}>
        <button type="button" className="btn" onClick={() => setModal({ kind: "new-site" })}>
          新しいサイト
        </button>
      </div>
      {target === "memory" && (
        <p className={styles.notice} role="status">
          このブラウザでは、サイトを保存できません。ページを閉じると消えるので、ファイルに書き出してください。
        </p>
      )}
      <div className={styles.explorer}>
        <div className={`${styles.pane} ${styles.folders} sunken`}>
          <ul className={styles.icons} aria-label="サイト">
            {sites.map((site) => (
              <li key={site.id}>
                <IconButton
                  label={site.name}
                  icon={<FolderIcon isOpen={site.id === folder?.id} />}
                  isSelected={site.id === folder?.id}
                  onSelect={() => selectFolder(site.id)}
                  onOpen={() => {
                    selectFolder(site.id);
                    if (site.id !== currentId) workspace.openSite(site.id);
                  }}
                />
              </li>
            ))}
          </ul>
        </div>
        {folder && (
          <div className={styles.contents}>
            <div className={styles.address}>
              アドレス
              <div className="sunken">{`マイコンピュータ\\${folder.name}`}</div>
            </div>
            <p className={styles.props}>
              {folder.year} 年 ／ {SITE_KINDS[folder.genre].label} ／{" "}
              {SITE_CATEGORIES[folder.category]} ／ {folder.pages.length} ページ
              {isCurrent ? "（作成キットで開いています）" : ""}
            </p>
            <div className={styles.toolbar}>
              <button
                type="button"
                className="btn"
                onClick={() => setModal({ kind: "site-info", site: folder })}
              >
                プロパティ
              </button>
              <button
                type="button"
                className="btn"
                onClick={() => setModal({ kind: "delete-site", site: folder })}
              >
                サイトを削除
              </button>
            </div>
            <div className={`${styles.pane} sunken`}>
              <ul className={styles.icons} aria-label={`${folder.name} のページ`}>
                {folder.pages.map((page) => (
                  <li key={page.path}>
                    <IconButton
                      label={page.path}
                      icon={<PageIcon />}
                      isSelected={
                        selected === page.path || (isCurrent && !selected && page.path === pagePath)
                      }
                      onSelect={() => setSelectedPage(page.path)}
                      onOpen={() => openPage(folder, page.path)}
                    />
                  </li>
                ))}
              </ul>
            </div>
            <div className={styles.toolbar}>
              <button
                type="button"
                className="btn"
                disabled={!isCurrent || !canAddPage(folder)}
                onClick={() => setModal({ kind: "new-page" })}
              >
                新しいページ
              </button>
              <button
                type="button"
                className="btn"
                disabled={!isCurrent || selected === null}
                onClick={() => selected && setModal({ kind: "rename-page", path: selected })}
              >
                名前の変更
              </button>
              <button
                type="button"
                className="btn"
                disabled={!isCurrent || selected === null || folder.pages.length <= 1}
                onClick={() => selected && setModal({ kind: "delete-page", path: selected })}
              >
                ページを削除
              </button>
            </div>
            {!isCurrent && (
              <p className="hint">
                ページをダブルクリックすると、このサイトを作成キットで開きます。
              </p>
            )}
          </div>
        )}
      </div>

      {modal?.kind === "new-site" && (
        <NewSiteDialog initialYear={year} onCreate={handleCreate} onCancel={close} />
      )}
      {modal?.kind === "site-info" && (
        <SiteInfoDialog
          info={modal.site}
          onSave={(info) => {
            close();
            void workspace.updateSiteInfo(modal.site.id, info);
          }}
          onCancel={close}
        />
      )}
      {modal?.kind === "delete-site" && (
        <ConfirmDialog
          title="サイトの削除"
          message={`「${modal.site.name}」を削除しますか？ 元に戻せません。`}
          onConfirm={() => confirmDeleteSite(modal.site)}
          onCancel={close}
        />
      )}
      {modal?.kind === "new-page" && folder && (
        <PageNameDialog
          title="新しいページ"
          initial={nextPagePath(folder)}
          normalize={normalizePagePath}
          validate={(path) => pagePathProblem(folder, path)}
          onSubmit={(path) => {
            close();
            setSelectedPage(path);
            void workspace.addPage(path, newPageHtml(path));
          }}
          onCancel={close}
        />
      )}
      {modal?.kind === "rename-page" && folder && (
        <PageNameDialog
          title="名前の変更"
          initial={modal.path}
          normalize={normalizePagePath}
          validate={(path) => pagePathProblem(folder, path, modal.path)}
          onSubmit={(path) => {
            close();
            setSelectedPage(path);
            void workspace.renamePage(modal.path, path);
          }}
          onCancel={close}
        />
      )}
      {modal?.kind === "delete-page" && (
        <ConfirmDialog
          title="ページの削除"
          message={`${modal.path} を削除しますか？ 元に戻せません。`}
          onConfirm={() => {
            close();
            setSelectedPage(null);
            void workspace.deletePage(modal.path);
          }}
          onCancel={close}
        />
      )}
    </Window>
  );
}
