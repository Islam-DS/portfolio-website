"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

export function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(false);
  const [pressed, setPressed] = useState(false);
  const [tracking, setTracking] = useState(false);
  const [label, setLabel] = useState<string | null>(null);

  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reducedMotion) return;

    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    const setDotX = gsap.quickTo(dot, "x", { duration: 0.1, ease: "power3.out" });
    const setDotY = gsap.quickTo(dot, "y", { duration: 0.1, ease: "power3.out" });
    const setRingX = gsap.quickTo(ring, "x", { duration: 0.45, ease: "power3.out" });
    const setRingY = gsap.quickTo(ring, "y", { duration: 0.45, ease: "power3.out" });

    // Only hide the native cursor once we've actually seen a real mouse
    // move — this way a device that mis-reports its pointer type (or any
    // future browser quirk) can never leave the visitor with no cursor at
    // all. Touch input never fires mousemove, so it naturally stays off.
    let started = false;
    const handleMove = (e: MouseEvent) => {
      if (!started) {
        started = true;
        gsap.set([dot, ring], { x: e.clientX, y: e.clientY });
        document.body.classList.add("custom-cursor-active");
        setTracking(true);
      }
      setDotX(e.clientX);
      setDotY(e.clientY);
      setRingX(e.clientX);
      setRingY(e.clientY);
    };

    const handleOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const labelEl = target.closest<HTMLElement>("[data-cursor-label]");
      setLabel(labelEl ? labelEl.dataset.cursorLabel ?? null : null);
      setActive(!!target.closest("a, button, [data-cursor]"));
    };

    const handleDown = () => setPressed(true);
    const handleUp = () => setPressed(false);

    window.addEventListener("mousemove", handleMove);
    window.addEventListener("mouseover", handleOver);
    window.addEventListener("mousedown", handleDown);
    window.addEventListener("mouseup", handleUp);

    return () => {
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("mouseover", handleOver);
      window.removeEventListener("mousedown", handleDown);
      window.removeEventListener("mouseup", handleUp);
      document.body.classList.remove("custom-cursor-active");
    };
  }, []);

  const ringSize = pressed ? (active ? 44 : 22) : active ? 60 : 36;

  return (
    <>
      <div
        ref={dotRef}
        className="pointer-events-none fixed left-0 top-0 z-[9999] -translate-x-1/2 -translate-y-1/2 rounded-full bg-cinema-text transition-[width,height,opacity] duration-150 ease-out"
        style={{
          width: pressed ? 7 : 10,
          height: pressed ? 7 : 10,
          opacity: tracking && !label ? 1 : 0,
        }}
        aria-hidden
      />
      <div
        ref={ringRef}
        className="pointer-events-none fixed left-0 top-0 z-[9999] flex -translate-x-1/2 -translate-y-1/2 items-center justify-center whitespace-nowrap rounded-full transition-[width,height,padding,opacity,background-color,border-color] duration-200 ease-out"
        style={
          label
            ? {
                padding: "9px 20px",
                opacity: tracking ? 1 : 0,
                backgroundColor: "rgba(230,237,236,0.94)",
                border: "1px solid rgba(255,255,255,0.18)",
                backdropFilter: "blur(8px)",
                boxShadow: "0 10px 30px -12px rgba(0,0,0,0.8)",
              }
            : {
                width: ringSize,
                height: ringSize,
                padding: 0,
                opacity: tracking ? (pressed ? 1 : active ? 1 : 0.7) : 0,
                backgroundColor: "transparent",
                border: `2px solid ${pressed ? "#E6EDEC" : "rgba(230,237,236,0.6)"}`,
              }
        }
        aria-hidden
      >
        {label && (
          <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.12em] text-cinema-ink">
            {label}
          </span>
        )}
      </div>
    </>
  );
}
