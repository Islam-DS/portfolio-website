"use client";

import { useEffect, useRef } from "react";
import { ExternalLink, MapPin } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { journey } from "@/data/journey";
import { SectionWrapper } from "@/components/effects/SectionWrapper";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { attachTiltHover } from "@/lib/useTiltHover";

const ACCENT: Record<string, { text: string; border: string; bg: string }> = {
  Work: { text: "text-cinema-blue", border: "border-cinema-blue", bg: "bg-cinema-blue" },
  Leadership: { text: "text-cinema-violet", border: "border-cinema-violet", bg: "bg-cinema-violet" },
  Scholarship: { text: "text-cinema-gold", border: "border-cinema-gold", bg: "bg-cinema-gold" },
  Research: { text: "text-cinema-gold", border: "border-cinema-gold", bg: "bg-cinema-gold" },
};

export function Experience() {
  const listRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const list = listRef.current;
    const line = lineRef.current;
    const cards = gsap.utils.toArray<HTMLElement>("[data-journey-card]", list);
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const detachTilt = attachTiltHover(cards, 5);

    if (reducedMotion) {
      gsap.set(cards, { opacity: 1, y: 0 });
      if (line) gsap.set(line, { scaleY: 1 });
      return detachTilt;
    }

    gsap.set(cards, { opacity: 0, y: 32 });
    const cardTriggers = cards.map((card, i) =>
      ScrollTrigger.create({
        trigger: card,
        start: "top 88%",
        once: true,
        onEnter: () =>
          gsap.to(card, { opacity: 1, y: 0, duration: 0.9, ease: "power3.out", delay: (i % 2) * 0.08 }),
      })
    );

    let lineTrigger: ScrollTrigger | undefined;
    if (line && list) {
      gsap.set(line, { scaleY: 0 });
      lineTrigger = ScrollTrigger.create({
        trigger: list,
        start: "top 70%",
        end: "bottom 70%",
        scrub: 0.5,
        onUpdate: (self) => gsap.set(line, { scaleY: self.progress }),
      });
    }

    return () => {
      cardTriggers.forEach((t) => t.kill());
      lineTrigger?.kill();
      detachTilt();
    };
  }, []);

  return (
    <SectionWrapper id="experience">
      <div className="cinema-container-full">
        <SectionHeading
          index="02"
          label="Experience"
          title="The journey so far"
          description="Research, work, scholarship, and leadership — one continuous path, not separate chapters."
        />

        <div ref={listRef} className="relative">
          <div className="absolute left-1/2 top-0 bottom-0 hidden w-px -translate-x-1/2 bg-black/10 lg:block" />
          <div
            ref={lineRef}
            className="absolute left-1/2 top-0 bottom-0 hidden w-px origin-top -translate-x-1/2 bg-cinema-gold lg:block"
          />

          <div className="space-y-8 lg:space-y-4">
            {journey.map((item, i) => {
              const accent = ACCENT[item.type] ?? ACCENT.Work;
              const isLeft = i % 2 === 0;
              const index = String(i + 1).padStart(2, "0");
              return (
                <div key={`${item.title}-${item.organization}`} className="relative lg:py-8">
                  <span
                    className={`absolute left-1/2 top-8 hidden h-3 w-3 -translate-x-1/2 rounded-full border-2 bg-cinema-navy lg:block ${accent.border}`}
                  />
                  {/* step number riding the spine itself — avoids hunting for
                      empty space inside these text-dense cards the way a
                      full watermark letterform needs (that worked for
                      Education's sparser cards, not here) */}
                  <span
                    className={`absolute left-1/2 top-2 hidden -translate-x-1/2 select-none font-mono text-[15px] tracking-wider lg:block ${accent.text}/70`}
                  >
                    {index}
                  </span>

                  <div className="lg:grid lg:grid-cols-2 lg:gap-x-16">
                    <div
                      data-journey-card
                      className={`group relative overflow-hidden rounded-[1.75rem] border border-black/10 bg-cinema-elevated p-7 md:p-8 ${
                        isLeft ? "lg:col-start-1 lg:text-right" : "lg:col-start-2"
                      }`}
                    >
                      {/* thin spine bar, same accent-coding technique as Education —
                          ties each entry's type (Work/Leadership/etc.) to a color
                          that carries through the dot, bullets and watermark below */}
                      <div className={`pointer-events-none absolute inset-x-0 top-0 h-[3px] ${accent.bg}/70`} aria-hidden />

                      <div
                        className={`relative flex items-center gap-3 ${isLeft ? "lg:flex-row-reverse" : ""}`}
                      >
                        <span className="font-mono text-[18.9px] text-cinema-muted">{item.period}</span>
                        <span className={`font-mono text-[16.2px] font-medium uppercase tracking-[0.15em] ${accent.text}`}>
                          {item.type}
                        </span>
                      </div>

                      <h3 className="relative mt-4 font-display text-[32.4px] font-bold text-cinema-text md:text-[40.5px]">
                        {item.title}
                      </h3>
                      <p className="relative mt-2 font-serif text-[24.3px] italic text-cinema-muted">{item.organization}</p>
                      {item.location && (
                        <p
                          className={`relative mt-1 flex items-center gap-2 text-[21.6px] text-cinema-muted/80 ${
                            isLeft ? "lg:flex-row-reverse" : ""
                          }`}
                        >
                          <MapPin className="h-3.5 w-3.5 shrink-0" />
                          {item.location}
                        </p>
                      )}

                      <ul className="relative mt-5 space-y-2">
                        {item.description.map((desc) => (
                          <li
                            key={desc}
                            className={`flex w-full items-start gap-3 text-[21.6px] leading-relaxed text-cinema-muted ${
                              isLeft ? "lg:flex-row-reverse lg:text-right" : ""
                            }`}
                          >
                            <span className={`mt-2.5 h-1 w-1 shrink-0 rounded-full ${accent.bg}`} />
                            <span className="flex-1">{desc}</span>
                          </li>
                        ))}
                      </ul>

                      <div
                        className={`relative mt-5 flex flex-wrap items-center gap-4 border-t border-black/10 pt-4 ${
                          isLeft ? "lg:justify-end" : ""
                        }`}
                      >
                        <p className="text-[18.9px] text-cinema-muted/70">{item.tags.join(" · ")}</p>
                        {item.link && (
                          <a
                            href={item.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 text-[18.9px] font-medium text-cinema-blue hover:text-cinema-blue-bright"
                          >
                            Read paper <ExternalLink className="h-3.5 w-3.5" />
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </SectionWrapper>
  );
}
