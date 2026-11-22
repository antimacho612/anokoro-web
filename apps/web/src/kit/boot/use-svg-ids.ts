import { useId } from "react";

export type Paint = (name: string) => string;

export interface SvgIds {
  /** 同じページに複数あってもぶつからない id */
  id: (name: string) => string;
  /** その id を参照する `url(#…)` */
  paint: Paint;
}

export function useSvgIds(): SvgIds {
  const uid = useId().replace(/[^\w-]/g, "");
  return {
    id: (name) => `${uid}-${name}`,
    paint: (name) => `url(#${uid}-${name})`,
  };
}
