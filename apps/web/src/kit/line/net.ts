import type { StorageAccess } from "../notepad/draft-storage.ts";
import { kitStore } from "../store.ts";
import { FrameSlot, createNetFrameWriter } from "./frame-page.ts";
import { createModemPlayer } from "./modem-player.ts";
import { NetController } from "./net-controller.ts";
import { saveLine } from "./net-settings.ts";

export const storage: StorageAccess = () => window.localStorage;

export const frameSlot = new FrameSlot();

export const netController = new NetController({
  store: kitStore,
  waitForBlankFrame: () =>
    frameSlot.nextLoadedDocument().then((doc) => (doc ? createNetFrameWriter(doc) : null)),
  modem: createModemPlayer(() => new AudioContext()),
  onLineChange: (key) => saveLine(storage, key),
});
