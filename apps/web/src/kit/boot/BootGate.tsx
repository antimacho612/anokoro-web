import { useRef, type ReactNode } from "react";
import { useBoot } from "./boot-store.ts";
import styles from "./BootScreen.module.css";
import { BootScreen } from "./BootScreen.tsx";

type BootGateProps = {
  children: ReactNode;
};

/** 起動の演出を出している間は、後ろの作成キットを操作できないようにする */
export function BootGate({ children }: BootGateProps) {
  const mode = useBoot((s) => s.mode);
  const kitRoot = useRef<HTMLDivElement>(null);
  const isBooting = mode !== "hidden";
  return (
    <>
      <div ref={kitRoot} className={styles.kit} inert={isBooting}>
        {children}
      </div>
      {isBooting && <BootScreen kitRoot={kitRoot} />}
    </>
  );
}
