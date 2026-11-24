import { useEffect, useState, type RefCallback } from "react";

export function useElementWidth(): [RefCallback<HTMLElement>, number] {
  const [element, setElement] = useState<HTMLElement | null>(null);
  const [width, setWidth] = useState(0);
  useEffect(() => {
    if (!element) return;
    const observer = new ResizeObserver(() => setWidth(element.clientWidth));
    observer.observe(element);
    return () => observer.disconnect();
  }, [element]);
  return [setElement, width];
}
