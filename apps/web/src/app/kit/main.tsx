import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "../../shared/styles/themes.css";
import "../../shared/styles/base.css";
import { persistNewsSeen, restoreNewsSeen } from "../../features/news/index.ts";
import { BootGate } from "../../pages/kit/index.ts";
import { hasBooted } from "../../entities/boot/index.ts";
import { browserSession } from "../../shared/lib/index.ts";
import { bootStore } from "../../entities/boot/index.ts";
import { KitApp } from "../../pages/kit/index.ts";
import { netController } from "../../features/dialup/index.ts";
import { storage } from "../../shared/lib/index.ts";
import { persistNetSettings, restoreNetSettings } from "../../features/dialup/index.ts";
import { openSiteStore, requestPersistence } from "@anokoro/site-store";
import { loadDraft } from "../../features/site-workspace/index.ts";
import { autoStartOnboardingAfterBoot, onboardingStore } from "../../features/onboarding/index.ts";
import { workspace } from "../../features/site-workspace/index.ts";
import { kitStore } from "../../entities/kit-state/index.ts";
import { hasYearParam } from "../../shared/routes/index.ts";
import { syncYearWithUrl } from "../lib/year-url-sync.ts";
import { syncUiTheme } from "../lib/ui-theme-sync.ts";

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
