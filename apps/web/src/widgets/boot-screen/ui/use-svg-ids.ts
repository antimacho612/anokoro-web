import { useId } from "react";

export type Paint = (name: string) => string;

export interface SvgIds {
  id: (name: string) => string;
  paint: Paint;
}

export function useSvgIds(): SvgIds {
  const uid = useId().replace(/[^\w-]/g, "");
  return {
    id: (name) => `${uid}-${name}`,
    paint: (name) => `url(#${uid}-${name})`,
  };
}
