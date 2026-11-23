import {
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
  useSyncExternalStore,
  type CSSProperties,
} from "react";
import { environmentItems } from "../boot/era-info.ts";
import { slotClass } from "../layout/KitLayout.tsx";
import { storage } from "../line/net.ts";
import { useKit } from "../store.ts";
import { placeBubble, type BubblePlacement, type Rect, type Size } from "./bubble-placement.ts";
import { turnOffOnboarding } from "./onboarding-session.ts";
import { ONBOARDING_STEPS, type TourTarget } from "./onboarding-steps.ts";
import { onboardingStore, useOnboarding } from "./onboarding-store.ts";
import styles from "./OnboardingTour.module.css";

const NARROW_QUERY = "(max-width: 860px)";
const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";
const GAP = 16;
const SCROLL_OFFSET = 56;
const SPOTLIGHT_PADDING = 6;
const TYPE_INTERVAL_MS = 18;

function targetElement(target: TourTarget): HTMLElement | null {
  const selector =
    target === "timeMachine"
      ? '[role="group"][aria-label="タイムマシン"]'
      : `.${CSS.escape(slotClass[target])}`;
  return document.querySelector<HTMLElement>(selector);
}

function notepadTextarea(): HTMLElement | null {
  return document.querySelector<HTMLElement>(`.${CSS.escape(slotClass.notepad)} textarea`);
}

function useMediaQuery(query: string): boolean {
  return useSyncExternalStore(
    (onChange) => {
      const list = window.matchMedia(query);
      list.addEventListener("change", onChange);
      return () => list.removeEventListener("change", onChange);
    },
    () => window.matchMedia(query).matches,
  );
}

function useTargetRect(target: TourTarget | null, isReducedMotion: boolean): Rect | null {
  const [rect, setRect] = useState<Rect | null>(null);
  useLayoutEffect(() => {
    const element = target ? targetElement(target) : null;
    if (!element) {
      setRect(null);
      return;
    }
    const update = (): void => {
      const { top, left, width, height } = element.getBoundingClientRect();
      setRect({ top, left, width, height });
    };
    window.scrollTo({
      top: element.getBoundingClientRect().top + window.scrollY - SCROLL_OFFSET,
      behavior: isReducedMotion ? "instant" : "smooth",
    });
    update();
    const observer = new ResizeObserver(update);
    observer.observe(element);
    window.addEventListener("scroll", update, { passive: true, capture: true });
    window.addEventListener("resize", update);
    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", update, { capture: true });
      window.removeEventListener("resize", update);
    };
  }, [target, isReducedMotion]);
  return rect;
}

function spotlightStyle(rect: Rect | null): CSSProperties {
  if (rect === null) {
    return { top: "50%", left: "50%", width: 0, height: 0 };
  }
  return {
    top: rect.top - SPOTLIGHT_PADDING,
    left: rect.left - SPOTLIGHT_PADDING,
    width: rect.width + SPOTLIGHT_PADDING * 2,
    height: rect.height + SPOTLIGHT_PADDING * 2,
  };
}

function FlipNumber({ value, label }: { value: number; label: string }) {
  const digits = String(value).padStart(2, "0").split("");
  return (
    <span className={styles.flip} aria-label={label}>
      {digits.map((digit, i) => (
        <span key={`${i}-${digit}`} className={styles.digit} aria-hidden="true">
          {digit}
        </span>
      ))}
    </span>
  );
}

type TypedTextProps = {
  id: string;
  text: string;
  isInstant: boolean;
};

/** 1 文字ずつ打ち出す。まだ出ていない文字も透明にして置き、吹き出しの大きさと読み上げを変えない */
function TypedText({ id, text, isInstant }: TypedTextProps) {
  const [count, setCount] = useState(isInstant ? text.length : 0);
  useEffect(() => {
    if (isInstant) return;
    const timer = window.setInterval(() => {
      setCount((c) => {
        if (c >= text.length) window.clearInterval(timer);
        return Math.min(c + 1, text.length);
      });
    }, TYPE_INTERVAL_MS);
    return () => window.clearInterval(timer);
  }, [text, isInstant]);
  const shown = isInstant ? text.length : count;
  return (
    <p id={id} className={styles.body}>
      {text.slice(0, shown)}
      {shown < text.length && <span className={styles.cursor} aria-hidden="true" />}
      <span className={styles.unshown}>{text.slice(shown)}</span>
    </p>
  );
}

export function OnboardingTour() {
  const tour = useOnboarding((s) => s.tour);
  return tour.kind === "touring" ? (
    <TourView step={tour.step} returnFocus={tour.returnFocus} />
  ) : null;
}

type TourViewProps = {
  step: number;
  /** 閉じたときにフォーカスを戻す先。null ならメモ帳 */
  returnFocus: HTMLElement | null;
};

function TourView({ step, returnFocus }: TourViewProps) {
  const year = useKit((s) => s.year);
  const current = ONBOARDING_STEPS[step];
  const total = ONBOARDING_STEPS.length;
  const isFirst = step === 0;
  const isLast = step === total - 1;
  const isNarrow = useMediaQuery(NARROW_QUERY);
  const isReducedMotion = useMediaQuery(REDUCED_MOTION_QUERY);
  const rect = useTargetRect(current?.target ?? null, isReducedMotion);
  const [bubbleSize, setBubbleSize] = useState<Size | null>(null);
  const [dontShowAgain, setDontShowAgain] = useState(false);
  const dialogRef = useRef<HTMLDivElement>(null);
  const titleId = useId();
  const bodyId = useId();

  useEffect(() => () => (returnFocus ?? notepadTextarea())?.focus(), [returnFocus]);

  useEffect(() => {
    dialogRef.current?.focus();
  }, [step]);

  useLayoutEffect(() => {
    const dialog = dialogRef.current;
    if (dialog) setBubbleSize({ width: dialog.offsetWidth, height: dialog.offsetHeight });
  }, [step, isNarrow]);

  const finish = (): void => {
    if (isLast && dontShowAgain) turnOffOnboarding(storage);
    onboardingStore.getState().close();
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent): void => {
      if (e.key !== "Escape") return;
      e.preventDefault();
      finish();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  });

  if (!current) return null;

  const placement: BubblePlacement | null =
    rect === null
      ? null
      : isNarrow
        ? { kind: "docked" }
        : bubbleSize &&
          placeBubble({
            target: rect,
            bubble: bubbleSize,
            viewport: { width: window.innerWidth, height: window.innerHeight },
            gap: GAP,
          });

  const bubbleClass = [
    styles.bubble,
    rect === null && styles.centered,
    placement?.kind === "docked" && styles.docked,
    rect !== null && placement === null && styles.measuring,
  ]
    .filter(Boolean)
    .join(" ");
  const bubbleStyle =
    placement?.kind === "floating" ? { top: placement.top, left: placement.left } : undefined;
  const spotlightClass = [styles.spotlight, rect !== null && styles.locked]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={styles.root} data-onboarding>
      <div className={spotlightClass} style={spotlightStyle(rect)}>
        <span className={styles.corner} />
        <span className={styles.corner} />
        <span className={styles.corner} />
        <span className={styles.corner} />
      </div>
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={bodyId}
        tabIndex={-1}
        className={bubbleClass}
        style={bubbleStyle}
      >
        <div key={step} className={styles.screen}>
          <p className={styles.meta}>
            <span className={styles.signal} aria-hidden="true" />
            <span className={styles.metaLabel}>案内</span>
            <span className={styles.counter}>
              <FlipNumber value={step + 1} label={`${total} 手順中 ${step + 1} 番目`} />
              <span className={styles.of} aria-hidden="true">
                / {String(total).padStart(2, "0")}
              </span>
            </span>
          </p>
          {isFirst && <p className={styles.arrival}>{year} 年に到着</p>}
          <h2 id={titleId} className={styles.title}>
            {current.title}
          </h2>
          <TypedText id={bodyId} text={current.body} isInstant={isReducedMotion} />
          {isFirst && (
            <dl className={styles.environment}>
              {environmentItems(year).map((item) => (
                <div key={item.label}>
                  <dt>{item.label}</dt>
                  <dd>{item.value}</dd>
                </div>
              ))}
            </dl>
          )}
          {isLast && (
            <label className={styles.check}>
              <input
                type="checkbox"
                checked={dontShowAgain}
                onChange={(e) => setDontShowAgain(e.currentTarget.checked)}
              />
              次回から表示しない
            </label>
          )}
        </div>
        <div className={styles.actions}>
          {!isLast && (
            <button type="button" className={styles.skip} onClick={finish}>
              スキップ
              <span className={styles.key} aria-hidden="true">
                Esc
              </span>
            </button>
          )}
          <span className={styles.spacer} />
          {!isFirst && (
            <button
              type="button"
              className={styles.secondary}
              onClick={() => onboardingStore.getState().back()}
            >
              戻る
            </button>
          )}
          {isLast ? (
            <button type="button" className={styles.primary} onClick={finish}>
              はじめる
            </button>
          ) : (
            <button
              type="button"
              className={styles.primary}
              onClick={() => onboardingStore.getState().next()}
            >
              次へ
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
