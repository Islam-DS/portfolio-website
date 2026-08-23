"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

export function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(false);
  const [pressed, setPressed] = useState(false);
  const [tracking, setTracking] = useState(false);

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
        className="pointer-events-none fixed left-0 top-0 z-[9999] -translate-x-1/2 -translate-y-1/2 rounded-full bg-black transition-[width,height,opacity] duration-150 ease-out"
        style={{ width: pressed ? 7 : 10, height: pressed ? 7 : 10, opacity: tracking ? 1 : 0 }}
        aria-hidden
      />
      <div
        ref={ringRef}
        className="pointer-events-none fixed left-0 top-0 z-[9999] -translate-x-1/2 -translate-y-1/2 rounded-full border-2 transition-[width,height,opacity,border-color] duration-200 ease-out"
        style={{
          width: ringSize,
          height: ringSize,
          opacity: tracking ? (pressed ? 1 : active ? 1 : 0.7) : 0,
          borderColor: pressed ? "#000" : "rgba(0,0,0,0.55)",
        }}
        aria-hidden
      />
    </>
  );
}
