"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

interface RevealTextProps {
  text: string;
  className?: string;
  splitBy?: "char" | "word";
  trigger?: "scroll" | "manual";
  play?: boolean;
  delay?: number;
  as?: "span" | "h1" | "h2" | "h3" | "p";
  /** Word index (0-based) to start applying emphasisClassName from, through the end of the text. */
  emphasisFrom?: number;
  emphasisClassName?: string;
}

export function RevealText({
  text,
  className,
  splitBy = "word",
  trigger = "scroll",
  play = true,
  delay = 0,
  as: Tag = "span",
  emphasisFrom,
  emphasisClassName,
}: RevealTextProps) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const units = el.querySelectorAll<HTMLElement>("[data-unit]");
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reducedMotion) {
      gsap.set(units, { opacity: 1, yPercent: 0 });
      return;
    }

    gsap.set(units, { opacity: 0, yPercent: 100 });

    const runAnim = () => {
      gsap.to(units, {
        opacity: 1,
        yPercent: 0,
        duration: 1,
        stagger: splitBy === "char" ? 0.018 : 0.06,
        ease: "power4.out",
        delay,
      });
    };

    if (trigger === "scroll") {
      const st = ScrollTrigger.create({
        trigger: el,
        start: "top 88%",
        once: true,
        onEnter: runAnim,
      });
      return () => st.kill();
    }

    if (play) runAnim();
  }, [text, splitBy, trigger, play, delay]);

  const words = text.split(" ");

  return (
    <Tag ref={ref as never} className={className} aria-label={text}>
      {splitBy === "char"
        ? words.flatMap((word, wi) => [
            <span key={`w-${wi}`} className="inline-block whitespace-nowrap">
              {Array.from(word).map((ch, ci) => (
                <span key={ci} className="inline-block overflow-hidden align-top" aria-hidden>
                  <span data-unit className="inline-block">
                    {ch}
                  </span>
                </span>
              ))}
            </span>,
            wi < words.length - 1 ? " " : null,
          ])
        : words.flatMap((unit, i) => [
            <span key={i} className="inline-block overflow-hidden align-top" aria-hidden>
              <span
                data-unit
                className={
                  emphasisFrom != null && i >= emphasisFrom && emphasisClassName
                    ? `inline-block ${emphasisClassName}`
                    : "inline-block"
                }
              >
                {unit}
              </span>
            </span>,
            i < words.length - 1 ? " " : null,
          ])}
    </Tag>
  );
}
