import { storage } from "../../../shared/lib/index.ts";
import { kitStore } from "../../../entities/kit-state/index.ts";
import { FrameSlot, createNetFrameWriter } from "../../../shared/lib/index.ts";
import { createModemPlayer } from "../lib/modem-player.ts";
import { NetController } from "./net-controller.ts";
import { saveLine } from "./net-settings.ts";

export const frameSlot = new FrameSlot();

export const netController = new NetController({
  store: kitStore,
  waitForBlankFrame: () =>
    frameSlot.nextLoadedDocument().then((doc) => (doc ? createNetFrameWriter(doc) : null)),
  modem: createModemPlayer(() => new AudioContext()),
  onLineChange: (key) => saveLine(storage, key),
});
