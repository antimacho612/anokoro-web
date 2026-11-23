import { defaultLineForYear } from "@anokoro/era-data";
import { createMemorySiteStore, createUlid, parseSiteId } from "@anokoro/site-store";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "../ui/themes.css";
import "../ui/base.css";
import { persistNewsSeen, restoreNewsSeen } from "../kit/info/news-seen.ts";
import { netController, storage } from "../kit/line/net.ts";
import { restoreSound } from "../kit/line/net-settings.ts";
import { Workspace } from "../kit/sites/workspace.ts";
import { kitStore } from "../kit/store.ts";
import { syncUiTheme } from "../kit/ui-theme/ui-theme-sync.ts";
import { fromShared } from "../site/site-model.ts";
import { ViewApp } from "./ViewApp.tsx";
import { loadViewSource } from "./view-source.ts";

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
