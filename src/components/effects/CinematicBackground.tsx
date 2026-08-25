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
    tl.to(el, { backgroundColor: "#F5EEDA", ease: "none" })
      .to(el, { backgroundColor: "#EFEDE0", ease: "none" })
      .to(el, { backgroundColor: "#F7F3E9", ease: "none" });

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
