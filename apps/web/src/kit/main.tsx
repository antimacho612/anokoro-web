import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "../ui/themes.css";
import "../ui/base.css";
import { persistNewsSeen, restoreNewsSeen } from "./info/news-seen.ts";
import { BootGate } from "./boot/BootGate.tsx";
import { browserSession, hasBooted } from "./boot/boot-session.ts";
import { bootStore } from "./boot/boot-store.ts";
import { KitApp } from "./KitApp.tsx";
import { netController, storage } from "./line/net.ts";
import { persistNetSettings, restoreNetSettings } from "./line/net-settings.ts";
import { loadDraft, persistDraft } from "./notepad/draft-storage.ts";
import { kitStore } from "./store.ts";
import { syncYearWithUrl } from "./time-machine/year-url-sync.ts";
import { syncUiTheme } from "./ui-theme/ui-theme-sync.ts";

syncYearWithUrl(kitStore, window);
syncUiTheme(kitStore, document.documentElement);
const draft = loadDraft(storage);
if (draft !== undefined) kitStore.getState().replace(draft);
persistDraft(kitStore, storage);
restoreNetSettings(kitStore, storage);
persistNetSettings(kitStore, storage);
restoreNewsSeen(kitStore, storage);
persistNewsSeen(kitStore, storage);
netController.stopOnEditOrYearChange();
if (!hasBooted(browserSession)) bootStore.getState().open();

const container = document.getElementById("root");
if (container) {
  createRoot(container).render(
    <StrictMode>
      <BootGate>
        <KitApp />
      </BootGate>
    </StrictMode>,
  );
}
