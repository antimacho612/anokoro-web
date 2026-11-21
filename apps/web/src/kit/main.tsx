import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { KitApp } from "./KitApp.tsx";

const container = document.getElementById("root");
if (container) {
  createRoot(container).render(
    <StrictMode>
      <KitApp />
    </StrictMode>,
  );
}
