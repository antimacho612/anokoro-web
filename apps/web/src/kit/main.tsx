import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "../ui/themes.css";
import "../ui/base.css";
import { KitApp } from "./KitApp.tsx";
import { loadDraft, persistDraft, type StorageAccess } from "./notepad/draft-storage.ts";
import { kitStore } from "./store.ts";
import { syncYearWithUrl } from "./time-machine/year-url-sync.ts";
import { syncUiTheme } from "./ui-theme/ui-theme-sync.ts";

const storage: StorageAccess = () => window.localStorage;

syncYearWithUrl(kitStore, window);
syncUiTheme(kitStore, document.documentElement);
const draft = loadDraft(storage);
if (draft !== undefined) kitStore.getState().replace(draft);
persistDraft(kitStore, storage);

const container = document.getElementById("root");
if (container) {
  createRoot(container).render(
    <StrictMode>
      <KitApp />
    </StrictMode>,
  );
}
