"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { navLinks } from "@/data/site";

export function SectionProgress() {
  const lineRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState("");

  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const line = lineRef.current;

    const handleScroll = () => {
      const sections = navLinks.map((l) => l.href.replace("#", ""));
      for (const id of [...sections].reverse()) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= 140) {
          setActive(id);
          break;
        }
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    let st: ScrollTrigger | undefined;
    if (line) {
      if (reducedMotion) {
        gsap.set(line, { scaleY: 1 });
      } else {
        gsap.set(line, { scaleY: 0 });
        st = ScrollTrigger.create({
          trigger: document.documentElement,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.3,
          onUpdate: (self) => gsap.set(line, { scaleY: self.progress }),
        });
      }
    }

    return () => {
      window.removeEventListener("scroll", handleScroll);
      st?.kill();
    };
  }, []);

  return (
    <nav
      aria-label="Section navigation"
      className="pointer-events-none fixed right-6 top-1/2 z-30 hidden -translate-y-1/2 xl:block"
    >
      <div className="pointer-events-auto relative flex flex-col items-center gap-6 py-2">
        <div className="absolute left-1/2 top-0 bottom-0 w-px -translate-x-1/2 bg-black/10" />
        <div
          ref={lineRef}
          className="absolute left-1/2 top-0 bottom-0 w-px origin-top -translate-x-1/2 bg-cinema-blue"
        />
        {navLinks.map((link) => {
          const id = link.href.replace("#", "");
          const isActive = active === id;
          return (
            <a
              key={link.href}
              href={link.href}
              data-cursor
              className="group relative z-10 flex items-center py-1"
              aria-label={link.label}
              aria-current={isActive ? "true" : undefined}
            >
              <span
                className={`block rounded-full transition-all duration-300 ${
                  isActive
                    ? "h-2.5 w-2.5 bg-cinema-blue"
                    : "h-1.5 w-1.5 bg-cinema-muted/50 group-hover:bg-cinema-muted"
                }`}
              />
              <span className="pointer-events-none absolute right-full mr-3 whitespace-nowrap rounded-full bg-cinema-ink px-3 py-1 font-mono text-[11px] uppercase tracking-[0.1em] text-white opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                {link.label}
              </span>
            </a>
          );
        })}
      </div>
    </nav>
  );
}
