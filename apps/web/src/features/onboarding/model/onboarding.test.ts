import { describe, expect, test } from "vite-plus/test";
import { createBootStore } from "../../../entities/boot/index.ts";
import {
  ONBOARDED_KEY,
  ONBOARDING_OFF_KEY,
  markOnboarded,
  shouldAutoShowOnboarding,
  turnOffOnboarding,
} from "./onboarding-session.ts";
import { autoStartOnboardingAfterBoot, createOnboardingStore } from "./onboarding-store.ts";
import { ONBOARDING_STEPS } from "./onboarding-steps.ts";

function memoryStorage(initial: Record<string, string> = {}) {
  const items = new Map(Object.entries(initial));
  return {
    items,
    access: () => ({
      getItem: (key: string) => items.get(key) ?? null,
      setItem: (key: string, value: string) => void items.set(key, value),
    }),
  };
}

const broken = () => {
  throw new Error("SecurityError");
};

describe("オンボーディングを自動で出すかの判定", () => {
  test("キーは anokoro: で始まる", () => {
    expect(ONBOARDED_KEY.startsWith("anokoro:")).toBe(true);
    expect(ONBOARDING_OFF_KEY.startsWith("anokoro:")).toBe(true);
  });

  test("このセッションでまだ出しておらず、表示しない設定もなければ出す", () => {
    const session = memoryStorage();
    const local = memoryStorage();
    expect(shouldAutoShowOnboarding({ session: session.access, local: local.access })).toBe(true);
  });

  test("このセッションで出したら、もう出さない", () => {
    const session = memoryStorage();
    const local = memoryStorage();
    markOnboarded(session.access);
    expect(session.items.get(ONBOARDED_KEY)).toBe("1");
    expect(shouldAutoShowOnboarding({ session: session.access, local: local.access })).toBe(false);
  });

  test("「次回から表示しない」を選んでいれば、新しいセッションでも出さない", () => {
    const session = memoryStorage();
    const local = memoryStorage();
    turnOffOnboarding(local.access);
    expect(local.items.get(ONBOARDING_OFF_KEY)).toBe("1");
    expect(shouldAutoShowOnboarding({ session: session.access, local: local.access })).toBe(false);
  });

  test("ストレージを読めなければ出し、書けなくても例外を投げない", () => {
    expect(shouldAutoShowOnboarding({ session: broken, local: broken })).toBe(true);
    expect(() => markOnboarded(broken)).not.toThrow();
    expect(() => turnOffOnboarding(broken)).not.toThrow();
  });
});

describe("起動演出の後の自動表示", () => {
  const setup = (
    initial: { session?: Record<string, string>; local?: Record<string, string> } = {},
  ) => {
    const session = memoryStorage(initial.session);
    const local = memoryStorage(initial.local);
    const boot = createBootStore();
    const onboarding = createOnboardingStore();
    return {
      session,
      local,
      boot,
      onboarding,
      storages: { session: session.access, local: local.access },
    };
  };

  test("起動演出がなければ、すぐに出して記録する", () => {
    const { session, boot, onboarding, storages } = setup();
    autoStartOnboardingAfterBoot(boot, onboarding, storages);
    expect(onboarding.getState().tour).toEqual({ kind: "touring", step: 0, returnFocus: null });
    expect(session.items.get(ONBOARDED_KEY)).toBe("1");
  });

  test("起動演出の間は出さず、終わってから出す", () => {
    const { boot, onboarding, storages } = setup();
    boot.getState().open();
    autoStartOnboardingAfterBoot(boot, onboarding, storages);
    boot.getState().start();
    expect(onboarding.getState().tour.kind).toBe("hidden");
    boot.getState().close();
    expect(onboarding.getState().tour).toEqual({ kind: "touring", step: 0, returnFocus: null });
  });

  test("起動演出を飛ばして閉じても出す", () => {
    const { boot, onboarding, storages } = setup();
    boot.getState().open();
    autoStartOnboardingAfterBoot(boot, onboarding, storages);
    boot.getState().close();
    expect(onboarding.getState().tour).toEqual({ kind: "touring", step: 0, returnFocus: null });
  });

  test("あとから起動演出を開き直しても、もう一度は出さない", () => {
    const { boot, onboarding, storages } = setup();
    boot.getState().open();
    autoStartOnboardingAfterBoot(boot, onboarding, storages);
    boot.getState().close();
    onboarding.getState().close();
    boot.getState().open();
    boot.getState().close();
    expect(onboarding.getState().tour.kind).toBe("hidden");
  });

  test("このセッションで出していれば出さない", () => {
    const { boot, onboarding, storages } = setup({ session: { [ONBOARDED_KEY]: "1" } });
    autoStartOnboardingAfterBoot(boot, onboarding, storages);
    expect(onboarding.getState().tour.kind).toBe("hidden");
  });

  test("「次回から表示しない」を選んでいれば出さない", () => {
    const { boot, onboarding, storages } = setup({ local: { [ONBOARDING_OFF_KEY]: "1" } });
    autoStartOnboardingAfterBoot(boot, onboarding, storages);
    expect(onboarding.getState().tour.kind).toBe("hidden");
  });
});

describe("ツアーの手順の移動", () => {
  test("次へと戻るで手順を移り、最初と最後より先へは行かない", () => {
    const store = createOnboardingStore();
    store.getState().start();
    store.getState().back();
    expect(store.getState().tour).toEqual({ kind: "touring", step: 0, returnFocus: null });
    for (let i = 0; i < ONBOARDING_STEPS.length + 2; i++) store.getState().next();
    expect(store.getState().tour).toMatchObject({ step: ONBOARDING_STEPS.length - 1 });
    store.getState().back();
    expect(store.getState().tour).toMatchObject({ step: ONBOARDING_STEPS.length - 2 });
  });

  test("閉じたあとに次へを押しても、ツアーは始まらない", () => {
    const store = createOnboardingStore();
    store.getState().start();
    store.getState().close();
    store.getState().next();
    expect(store.getState().tour.kind).toBe("hidden");
  });

  test("最初と最後は画面の中央に出し、途中はウィンドウを強調する", () => {
    expect(ONBOARDING_STEPS).toHaveLength(7);
    expect(ONBOARDING_STEPS[0]?.target).toBeNull();
    expect(ONBOARDING_STEPS.at(-1)?.target).toBeNull();
    expect(ONBOARDING_STEPS.slice(1, -1).map((s) => s.target)).toEqual([
      "timeMachine",
      "notepad",
      "browser",
      "checker",
      "line",
    ]);
  });
});
