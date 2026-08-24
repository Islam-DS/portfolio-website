"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

export function CinematicBackground() {
  const bgRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = bgRef.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: document.documentElement,
        start: "top top",
        end: "bottom bottom",
        scrub: 0.8,
      },
    });
    // The ground cools toward teal through the research sections, then warms
    // back at the close — a slow temperature shift rather than a colour change.
    tl.to(el, { backgroundColor: "#080C0E", ease: "none" })
      .to(el, { backgroundColor: "#0A0C0D", ease: "none" })
      .to(el, { backgroundColor: "#07090A", ease: "none" });

    return () => {
      tl.scrollTrigger?.kill();
      tl.kill();
    };
  }, []);

  return (
    <div
      ref={bgRef}
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-cinema-navy"
      aria-hidden
    >
      <div className="absolute inset-0 bg-hero-mesh" />
      <div className="noise-overlay absolute inset-0" />
    </div>
  );
}
