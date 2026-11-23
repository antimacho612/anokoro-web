import { useRef, type ReactNode } from "react";
import { OnboardingTour } from "../onboarding/OnboardingTour.tsx";
import { useOnboarding } from "../onboarding/onboarding-store.ts";
import { useBoot } from "./boot-store.ts";
import styles from "./BootScreen.module.css";
import { BootScreen } from "./BootScreen.tsx";

type BootGateProps = {
  children: ReactNode;
};

export function BootGate({ children }: BootGateProps) {
  const mode = useBoot((s) => s.mode);
  const isTouring = useOnboarding((s) => s.tour.kind === "touring");
  const kitRoot = useRef<HTMLDivElement>(null);
  const isBooting = mode !== "hidden";
  return (
    <>
      <div ref={kitRoot} className={styles.kit} inert={isBooting || isTouring}>
        {children}
      </div>
      {isBooting && <BootScreen kitRoot={kitRoot} />}
      {!isBooting && <OnboardingTour />}
    </>
  );
}
