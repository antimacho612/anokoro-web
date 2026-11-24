import { encodeSharedSite } from "@anokoro/share-codec";
import type { LocalSite } from "@anokoro/site-store";
import { useEffect, useState } from "react";
import { toShared } from "../../../entities/site/index.ts";
import { Dialog, dialogClass } from "../../../shared/ui/dialog/index.ts";
import { buildShareLink, type ShareLink } from "../../../shared/routes/index.ts";
import styles from "./MyComputer.module.css";

type ShareState = { kind: "working" } | { kind: "ready"; link: ShareLink } | { kind: "failed" };

type CopyState = "idle" | "copied" | "failed";

type ShareDialogProps = {
  site: LocalSite;
  onClose: () => void;
};

const FILE_HINT = "マイコンピュータの「フロッピーに保存」でファイルにして渡してください。";

export function ShareDialog({ site, onClose }: ShareDialogProps) {
  const [state, setState] = useState<ShareState>({ kind: "working" });
  const [copy, setCopy] = useState<CopyState>("idle");

  useEffect(() => {
    let isCurrent = true;
    encodeSharedSite(toShared(site))
      .then((payload) => {
        const link = buildShareLink({
          origin: window.location.origin,
          base: import.meta.env.BASE_URL,
          payload,
        });
        if (isCurrent) setState({ kind: "ready", link });
      })
      .catch(() => {
        if (isCurrent) setState({ kind: "failed" });
      });
    return () => {
      isCurrent = false;
    };
  }, [site]);

  const handleCopy = async (url: string): Promise<void> => {
    try {
      await navigator.clipboard.writeText(url);
      setCopy("copied");
    } catch {
      setCopy("failed");
    }
  };

  const shareUrl = state.kind === "ready" && state.link.kind === "ok" ? state.link.url : null;

  return (
    <Dialog title="URL で共有" size="wide" onClose={onClose}>
      <div className={dialogClass.body}>
        <p>
          「{site.name}」のページをまとめて URL に入れます。データはこの URL
          の中だけにあり、サーバーには送りません。
        </p>
        {state.kind === "working" && <p role="status">URL を作っています…</p>}
        {state.kind === "failed" && (
          <p className={dialogClass.error} role="alert">
            このブラウザでは URL を作れませんでした。{FILE_HINT}
          </p>
        )}
        {state.kind === "ready" && state.link.kind === "too-long" && (
          <p className={dialogClass.error} role="alert">
            サイトが大きすぎて URL にできません（{state.link.length.toLocaleString("ja-JP")}{" "}
            文字）。{FILE_HINT}
          </p>
        )}
        {state.kind === "ready" && state.link.kind === "ok" && (
          <>
            <textarea
              className={styles.shareUrl}
              aria-label="共有用の URL"
              readOnly
              value={state.link.url}
              onFocus={(e) => e.currentTarget.select()}
            />
            <p>{state.link.length.toLocaleString("ja-JP")} 文字</p>
            {state.link.isLong && (
              <p className={dialogClass.error} role="alert">
                SNS やチャットでは途中で切れるかもしれません。{FILE_HINT}
              </p>
            )}
          </>
        )}
        {copy === "copied" && <p role="status">URL をコピーしました。</p>}
        {copy === "failed" && (
          <p className={dialogClass.error} role="alert">
            コピーできませんでした。URL を選んでコピーしてください。
          </p>
        )}
      </div>
      <div className={dialogClass.buttons}>
        {shareUrl !== null && (
          <button type="button" className="btn" onClick={() => void handleCopy(shareUrl)}>
            コピー
          </button>
        )}
        <button type="button" className="btn" onClick={onClose}>
          閉じる
        </button>
      </div>
    </Dialog>
  );
}
