import { useRef, type ReactNode } from "react";
import { OnboardingTour } from "../../../widgets/onboarding-tour/index.ts";
import { useOnboarding } from "../../../features/onboarding/index.ts";
import { useBoot } from "../../../entities/boot/index.ts";
import styles from "./BootGate.module.css";
import { BootScreen } from "../../../widgets/boot-screen/index.ts";

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
