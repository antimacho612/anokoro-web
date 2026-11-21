import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { ViewApp } from "./ViewApp.tsx";

const container = document.getElementById("root");
if (container) {
  createRoot(container).render(
    <StrictMode>
      <ViewApp />
    </StrictMode>,
  );
}
