import { useRef } from "react";
import { Window } from "../../../shared/ui/window/index.ts";
import { useDialogFocus } from "../../../shared/ui/window/index.ts";
import { useKit, type InfoDialog } from "../../../entities/kit-state/index.ts";
import { AboutContent } from "./AboutContent.tsx";
import styles from "./InfoWindow.module.css";
import { NewsContent } from "./NewsContent.tsx";
import { UsageContent } from "./UsageContent.tsx";

export const INFO_TITLES: Record<InfoDialog, string> = {
  usage: "使い方 - あのころ Web",
  news: "お知らせ・更新情報",
  about: "このサイトについて",
};

export function InfoWindow() {
  const infoDialog = useKit((s) => s.infoDialog);
  return infoDialog ? <InfoDialogView key={infoDialog} dialog={infoDialog} /> : null;
}

function InfoDialogView({ dialog }: { dialog: InfoDialog }) {
  const closeInfo = useKit((s) => s.closeInfo);
  const dialogRef = useRef<HTMLElement>(null);
  useDialogFocus(dialogRef, closeInfo);

  return (
    <Window
      ref={dialogRef}
      role="dialog"
      tabIndex={-1}
      title={INFO_TITLES[dialog]}
      controls={["×"]}
      className={styles.dialog}
      onClose={closeInfo}
    >
      <div className={`${styles.body} sunken`} role="document" tabIndex={0}>
        {dialog === "usage" && <UsageContent />}
        {dialog === "news" && <NewsContent />}
        {dialog === "about" && <AboutContent />}
      </div>
    </Window>
  );
}
