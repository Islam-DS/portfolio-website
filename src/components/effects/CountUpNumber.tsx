"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

interface CountUpNumberProps {
  value: number;
  className?: string;
  prefix?: string;
  suffix?: string;
}

export function CountUpNumber({ value, className, prefix = "", suffix = "" }: CountUpNumberProps) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reducedMotion) {
      el.textContent = `${prefix}${value}${suffix}`;
      return;
    }

    const counter = { n: 0 };
    const st = ScrollTrigger.create({
      trigger: el,
      start: "top 85%",
      once: true,
      onEnter: () => {
        gsap.to(counter, {
          n: value,
          duration: 1.4,
          ease: "power2.out",
          onUpdate: () => {
            el.textContent = `${prefix}${Math.round(counter.n)}${suffix}`;
          },
        });
      },
    });

    return () => st.kill();
  }, [value, prefix, suffix]);

  return (
    <span ref={ref} aria-label={`${prefix}${value}${suffix}`} className={className}>
      {prefix}0{suffix}
    </span>
  );
}
