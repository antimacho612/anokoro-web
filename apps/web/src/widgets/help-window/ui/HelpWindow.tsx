import { Suspense, lazy } from "react";
import { useKit } from "../../../entities/kit-state/index.ts";

const HelpDialog = lazy(() => import("./HelpDialog.tsx").then((m) => ({ default: m.HelpDialog })));

export function HelpWindow() {
  const helpOpen = useKit((s) => s.helpOpen);
  if (!helpOpen) return null;
  return (
    <Suspense fallback={null}>
      <HelpDialog />
    </Suspense>
  );
}
