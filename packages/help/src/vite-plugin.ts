import { relative, resolve } from "node:path";
import type { Plugin } from "vite-plus";
import { loadHelpTopics } from "./load.ts";

export const HELP_MODULE_ID = "virtual:anokoro-help";
const RESOLVED_ID = `\0${HELP_MODULE_ID}`;

export interface HelpContentOptions {
  dir: string;
}

export function helpContent({ dir }: HelpContentOptions): Plugin {
  const root = resolve(dir);
  const isHelpFile = (file: string): boolean => {
    const path = relative(root, resolve(file));
    return (
      path.endsWith(".md") && !path.startsWith("..") && !path.includes("/") && !path.includes("\\")
    );
  };
  return {
    name: "anokoro-help",
    resolveId(id) {
      return id === HELP_MODULE_ID ? RESOLVED_ID : undefined;
    },
    load(id) {
      if (id !== RESOLVED_ID) return undefined;
      const { topics, files } = loadHelpTopics(root);
      for (const file of files) this.addWatchFile(file);
      return `export const topics = ${JSON.stringify(topics)};\n`;
    },
    configureServer(server) {
      server.watcher.add(root);
      const reloadOnFileListChange = (file: string): void => {
        if (!isHelpFile(file)) return;
        const mod = server.moduleGraph.getModuleById(RESOLVED_ID);
        if (mod) server.moduleGraph.invalidateModule(mod);
        server.ws.send({ type: "full-reload" });
      };
      server.watcher.on("add", reloadOnFileListChange);
      server.watcher.on("unlink", reloadOnFileListChange);
    },
  };
}
