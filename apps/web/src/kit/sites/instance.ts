import { useStore } from "zustand";
import { storage } from "../line/net.ts";
import { saveLastOpened } from "../notepad/draft-storage.ts";
import { kitStore } from "../store.ts";
import { Workspace, type WorkspaceState } from "./workspace.ts";

export const workspace = new Workspace({
  kit: kitStore,
  rememberLastOpened: (lastOpened) => saveLastOpened(storage, lastOpened),
});

export function useWorkspace<T>(selector: (state: WorkspaceState) => T): T {
  return useStore(workspace.state, selector);
}
