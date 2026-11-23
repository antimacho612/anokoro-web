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
import { openSiteStore, requestPersistence } from "@anokoro/site-store";
import { loadDraft } from "./notepad/draft-storage.ts";
import { autoStartOnboardingAfterBoot, onboardingStore } from "./onboarding/onboarding-store.ts";
import { workspace } from "./sites/instance.ts";
import { kitStore } from "./store.ts";
import { hasYearParam } from "./time-machine/year-param.ts";
import { syncYearWithUrl } from "./time-machine/year-url-sync.ts";
import { syncUiTheme } from "./ui-theme/ui-theme-sync.ts";

const urlHasYear = hasYearParam(window.location.search);
syncYearWithUrl(kitStore, window);
syncUiTheme(kitStore, document.documentElement);
const draft = loadDraft(storage);
if (draft.kind === "legacy-html") kitStore.getState().replace(draft.html);
restoreNetSettings(kitStore, storage);
persistNetSettings(kitStore, storage);
restoreNewsSeen(kitStore, storage);
persistNewsSeen(kitStore, storage);
netController.stopOnEditOrYearChange();
void workspace.init({
  open: () => openSiteStore(),
  ...(urlHasYear ? { urlYear: kitStore.getState().year } : {}),
  ...(draft.kind === "last-opened" ? { lastOpened: draft.lastOpened } : {}),
  firstSite: { name: "マイホームページ", genre: "personal", category: "diary" },
});
void requestPersistence();
document.addEventListener("visibilitychange", () => {
  if (document.visibilityState === "hidden") void workspace.flush();
});
if (!hasBooted(browserSession)) bootStore.getState().open();
autoStartOnboardingAfterBoot(bootStore, onboardingStore, {
  session: browserSession,
  local: storage,
});

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
