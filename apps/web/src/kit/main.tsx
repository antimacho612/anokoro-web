import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "../ui/classic.css";
import { KitApp } from "./KitApp.tsx";
import { kitStore } from "./store.ts";
import { syncYearWithUrl } from "./time-machine/year-url-sync.ts";

syncYearWithUrl(kitStore, window);

const container = document.getElementById("root");
if (container) {
  createRoot(container).render(
    <StrictMode>
      <KitApp />
    </StrictMode>,
  );
}
