import { useCallback, useMemo, useRef, useEffect, useState } from "react";

export interface VirtualItem {
  index: number;
  offsetTop: number;
}

interface UseVirtualizerOptions {
  itemCount: number;
  itemHeight: number;
  overscan?: number;
}

export function useVirtualizer({
  itemCount,
  itemHeight,
  overscan = 5,
}: UseVirtualizerOptions) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollTop, setScrollTop] = useState(0);
  const [containerHeight, setContainerHeight] = useState(0);
  const rafId = useRef(0);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setContainerHeight(entry.contentRect.height);
      }
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const onScroll = useCallback(() => {
    if (rafId.current) return;
    rafId.current = requestAnimationFrame(() => {
      const el = containerRef.current;
      if (el) setScrollTop(el.scrollTop);
      rafId.current = 0;
    });
  }, []);

  useEffect(() => {
    return () => {
      if (rafId.current) cancelAnimationFrame(rafId.current);
    };
  }, []);

  const { totalHeight, virtualItems } = useMemo(() => {
    const total = itemCount * itemHeight;
    if (containerHeight === 0) return { totalHeight: total, virtualItems: [] as VirtualItem[] };

    const startIndex = Math.max(
      0,
      Math.floor(scrollTop / itemHeight) - overscan
    );
    const endIndex = Math.min(
      itemCount - 1,
      Math.ceil((scrollTop + containerHeight) / itemHeight) + overscan
    );

    const items: VirtualItem[] = [];
    for (let i = startIndex; i <= endIndex; i++) {
      items.push({ index: i, offsetTop: i * itemHeight });
    }
    return { totalHeight: total, virtualItems: items };
  }, [scrollTop, containerHeight, itemCount, itemHeight, overscan]);

  return { containerRef, onScroll, totalHeight, virtualItems };
}
