import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "../ui/classic.css";
import { KitApp } from "./KitApp.tsx";
import { loadDraft, persistDraft, type StorageAccess } from "./notepad/draft-storage.ts";
import { kitStore } from "./store.ts";
import { syncYearWithUrl } from "./time-machine/year-url-sync.ts";

const storage: StorageAccess = () => window.localStorage;

syncYearWithUrl(kitStore, window);
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
