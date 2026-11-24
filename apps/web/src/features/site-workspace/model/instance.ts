import { useStore } from "zustand";
import { storage } from "../../../shared/lib/index.ts";
import { saveLastOpened } from "../lib/draft-storage.ts";
import { kitStore } from "../../../entities/kit-state/index.ts";
import { Workspace, type WorkspaceState } from "./workspace.ts";

export const workspace = new Workspace({
  kit: kitStore,
  rememberLastOpened: (lastOpened) => saveLastOpened(storage, lastOpened),
});

export function useWorkspace<T>(selector: (state: WorkspaceState) => T): T {
  return useStore(workspace.state, selector);
}
