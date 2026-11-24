import { defaultLineForYear } from "@anokoro/era-data";
import { createMemorySiteStore, createUlid, parseSiteId } from "@anokoro/site-store";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "../../shared/styles/themes.css";
import "../../shared/styles/base.css";
import { persistNewsSeen, restoreNewsSeen } from "../../features/news/index.ts";
import { netController } from "../../features/dialup/index.ts";
import { storage } from "../../shared/lib/index.ts";
import { restoreSound } from "../../features/dialup/index.ts";
import { Workspace } from "../../features/site-workspace/index.ts";
import { kitStore } from "../../entities/kit-state/index.ts";
import { syncUiTheme } from "../lib/ui-theme-sync.ts";
import { fromShared } from "../../entities/site/index.ts";
import { ViewApp } from "../../pages/view/index.ts";
import { loadViewSource } from "../../pages/view/index.ts";

syncUiTheme(kitStore, document.documentElement);
restoreSound(kitStore, storage);
restoreNewsSeen(kitStore, storage);
persistNewsSeen(kitStore, storage);
netController.stopOnEditOrYearChange();
window.addEventListener("hashchange", () => window.location.reload());

const viewer = new Workspace({ kit: kitStore });

async function start(): Promise<void> {
  const source = await loadViewSource(window.location.search, window.location.hash);
  if (source.kind !== "error") {
    const store = createMemorySiteStore();
    await store.put(fromShared(source.site, parseSiteId(createUlid()), Date.now()));
    await viewer.init({
      open: async () => store,
      firstSite: {
        name: source.site.name,
        genre: source.site.genre,
        category: source.site.category,
      },
    });
    kitStore.setState({ lineKey: defaultLineForYear(source.site.year).key });
    document.title = `${source.site.name} - あのころ Web`;
  }
  const container = document.getElementById("root");
  if (container) {
    createRoot(container).render(
      <StrictMode>
        <ViewApp source={source} navigator={viewer} />
      </StrictMode>,
    );
  }
}

void start();
