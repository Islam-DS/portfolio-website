"use client";

import type { RefObject } from "react";

interface ProjectProgressProps {
  total: number;
  counterRef: RefObject<HTMLSpanElement | null>;
  lineRef: RefObject<HTMLDivElement | null>;
}

/** "01 / 06" plus a vertical line that fills with scroll progress — the
 * line's fill is driven imperatively by GSAP every scroll tick (too
 * frequent for React state), so it's exposed via a ref rather than a
 * progress prop. */
export function ProjectProgress({ total, counterRef, lineRef }: ProjectProgressProps) {
  return (
    <div className="flex items-center gap-4" role="status" aria-live="polite">
      <div className="relative h-10 w-px shrink-0 bg-black/10">
        <div ref={lineRef} className="absolute inset-x-0 top-0 h-full origin-top scale-y-0 bg-cinema-gold" />
      </div>
      <div className="flex items-baseline gap-2">
        <span ref={counterRef} className="font-display text-[20px] font-bold text-cinema-text">
          01
        </span>
        <span className="font-mono text-[17.5px] text-cinema-muted/80">/ {String(total).padStart(2, "0")}</span>
      </div>
    </div>
  );
}
