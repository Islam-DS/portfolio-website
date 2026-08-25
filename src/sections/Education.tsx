"use client";

import { useEffect, useRef } from "react";
import { MapPin } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { education } from "@/data/education";
import { SectionWrapper } from "@/components/effects/SectionWrapper";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { attachTiltHover } from "@/lib/useTiltHover";

export function Education() {
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const cards = gsap.utils.toArray<HTMLElement>("[data-edu-card]", gridRef.current);
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const detachTilt = attachTiltHover(cards, 5);

    if (reducedMotion) {
      gsap.set(cards, { opacity: 1, y: 0 });
      return detachTilt;
    }

    gsap.set(cards, { opacity: 0, y: 32 });
    const triggers = cards.map((card, i) =>
      ScrollTrigger.create({
        trigger: card,
        start: "top 85%",
        once: true,
        onEnter: () =>
          gsap.to(card, { opacity: 1, y: 0, duration: 0.9, ease: "power3.out", delay: i * 0.1 }),
      })
    );

    return () => {
      triggers.forEach((t) => t.kill());
      detachTilt();
    };
  }, []);

  return (
    <SectionWrapper id="education" className="bg-cinema-deep/70">
      <div className="cinema-container">
        <SectionHeading index="02" label="Education" title="Academic foundation" />

        <div ref={gridRef} className="grid gap-6 md:grid-cols-2 md:gap-8">
          {education.map((item, i) => (
            <div
              key={item.institution}
              data-edu-card
              className="relative flex min-w-0 flex-col rounded-[1.75rem] border border-black/10 bg-cinema-elevated p-6 sm:p-8 md:p-10"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <span className="font-mono text-[18.9px] text-cinema-muted">{item.period}</span>
                {item.badge && (
                  <span
                    className={`rounded-full border px-3 py-1 font-mono text-[16.2px] uppercase tracking-[0.12em] ${
                      i === 0
                        ? "border-cinema-gold/30 text-cinema-gold"
                        : "border-black/10 text-cinema-muted"
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </div>

              <h3 className="mt-6 font-display text-[30px] font-bold leading-tight text-cinema-text sm:text-[34px] lg:text-[42px] xl:text-[48.6px]">
                {item.institution}
              </h3>
              <p className="mt-2 text-[27px] text-cinema-muted">{item.degree}</p>
              <p className="mt-3 flex items-center gap-2 text-[21.6px] text-cinema-muted/80">
                <MapPin className="h-4 w-4 shrink-0" />
                {item.location}
              </p>

              <ul className="mt-8 space-y-3 border-t border-black/10 pt-6">
                {item.highlights.map((highlight) => (
                  <li key={highlight} className="flex gap-3 text-[24.3px] leading-relaxed text-cinema-muted">
                    <span className="mt-2.5 h-1 w-1 shrink-0 rounded-full bg-cinema-blue" />
                    {highlight}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </SectionWrapper>
  );
}
