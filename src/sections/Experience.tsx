"use client";

import { useEffect, useRef } from "react";
import { ExternalLink, MapPin } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { journey } from "@/data/journey";
import { SectionWrapper } from "@/components/effects/SectionWrapper";
import { SectionHeading } from "@/components/ui/SectionHeading";

/**
 * Prototype 1 of a new "visible animation" direction: a pinned,
 * scroll-scrubbed stage (desktop only — pinning doesn't translate well to
 * small screens, so mobile gets a plain stacked list below). As the user
 * scrolls through the section, the stage stays fixed on screen while each
 * entry crossfades and slides in, kinetic-typography style, driven by
 * scroll position rather than a one-shot reveal. Same GSAP/ScrollTrigger
 * stack already used elsewhere on the site, pushed further.
 */
export function Experience() {
  const pinWrapRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const counterRef = useRef<HTMLSpanElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const mobileListRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const isDesktop = window.matchMedia("(min-width: 1024px)").matches;

    // Mobile / reduced-motion: simple fade-up on scroll, same pattern used
    // across the rest of the site. No pinning.
    const mobileCards = gsap.utils.toArray<HTMLElement>("[data-mobile-card]", mobileListRef.current);
    if (reducedMotion || !isDesktop) {
      gsap.set(mobileCards, { opacity: 1, y: 0 });
    } else {
      gsap.set(mobileCards, { opacity: 0, y: 24 });
    }
    const mobileTriggers = !reducedMotion
      ? mobileCards.map((card, i) =>
          ScrollTrigger.create({
            trigger: card,
            start: "top 88%",
            once: true,
            onEnter: () =>
              gsap.to(card, { opacity: 1, y: 0, duration: 0.8, ease: "power3.out", delay: (i % 2) * 0.06 }),
          })
        )
      : [];

    if (reducedMotion || !isDesktop) {
      return () => mobileTriggers.forEach((t) => t.kill());
    }

    // Desktop: pinned, scroll-scrubbed stage.
    const pinWrap = pinWrapRef.current;
    const stage = stageRef.current;
    if (!pinWrap || !stage) return () => mobileTriggers.forEach((t) => t.kill());

    const entries = gsap.utils.toArray<HTMLElement>("[data-stage-entry]", stage);
    gsap.set(entries, { autoAlpha: 0, y: 32 });
    gsap.set(entries[0], { autoAlpha: 1, y: 0 });
    if (counterRef.current) counterRef.current.textContent = "01";

    let activeIndex = 0;
    const setActive = (next: number) => {
      if (next === activeIndex) return;
      const dir = next > activeIndex ? 1 : -1;
      gsap.to(entries[activeIndex], { autoAlpha: 0, y: -24 * dir, duration: 0.45, ease: "power2.inOut" });
      gsap.fromTo(
        entries[next],
        { autoAlpha: 0, y: 32 * dir },
        { autoAlpha: 1, y: 0, duration: 0.55, ease: "power3.out" }
      );
      activeIndex = next;
      if (counterRef.current) counterRef.current.textContent = String(next + 1).padStart(2, "0");
    };

    const st = ScrollTrigger.create({
      trigger: pinWrap,
      start: "top top",
      end: "bottom bottom",
      pin: stage,
      scrub: 0.6,
      onUpdate: (self) => {
        if (progressRef.current) progressRef.current.style.transform = `scaleY(${self.progress})`;
        const next = Math.min(journey.length - 1, Math.floor(self.progress * journey.length));
        setActive(next);
      },
    });

    return () => {
      st.kill();
      mobileTriggers.forEach((t) => t.kill());
    };
  }, []);

  return (
    <SectionWrapper id="experience" className="overflow-visible">
      <div className="cinema-container-full">
        <SectionHeading
          index="02"
          label="Experience"
          title="The journey so far"
          description="Research, work, scholarship, and leadership — one continuous path, not separate chapters."
        />
      </div>

      {/* Desktop: pinned scroll-scrubbed stage */}
      <div ref={pinWrapRef} className="relative hidden lg:block" style={{ height: `${journey.length * 90}vh` }}>
        <div ref={stageRef} className="relative flex h-screen w-full items-center overflow-hidden">
          <div className="cinema-container-full w-full">
            <div className="relative">
              {/* progress rail */}
              <div className="absolute -left-2 top-0 bottom-0 w-px bg-black/10" aria-hidden>
                <div
                  ref={progressRef}
                  className="absolute inset-x-0 top-0 h-full origin-top scale-y-0 bg-cinema-gold"
                />
              </div>

              <div className="mb-10 flex items-baseline gap-3 pl-8">
                <span ref={counterRef} className="font-display text-[22px] font-bold text-cinema-text">
                  01
                </span>
                <span className="font-mono text-[16px] text-cinema-muted/50">/ {String(journey.length).padStart(2, "0")}</span>
                <span className="font-mono text-[14px] uppercase tracking-[0.15em] text-cinema-muted/40">— scroll to explore</span>
              </div>

              <div className="relative min-h-[480px] pl-8">
                {journey.map((item) => (
                  <div key={`${item.title}-${item.organization}`} data-stage-entry className="absolute inset-0">
                    <div className="grid grid-cols-12 gap-x-10">
                      <div className="col-span-7">
                        <div className="flex items-center gap-3">
                          <span className="font-mono text-[17px] text-cinema-muted/70">{item.period}</span>
                          <span className="font-mono text-[15px] uppercase tracking-[0.15em] text-cinema-muted/50">
                            {item.type}
                          </span>
                        </div>
                        <h3 className="mt-5 font-display text-[56px] font-bold leading-[1.05] tracking-tight text-cinema-text xl:text-[68px]">
                          {item.title}
                        </h3>
                        <p className="mt-4 text-[26px] text-cinema-muted">{item.organization}</p>
                        {item.location && (
                          <p className="mt-1 flex items-center gap-2 text-[19px] text-cinema-muted/70">
                            <MapPin className="h-3.5 w-3.5 shrink-0" />
                            {item.location}
                          </p>
                        )}
                      </div>

                      <div className="col-span-5 border-l border-black/10 pl-10">
                        <ul className="space-y-3">
                          {item.description.map((desc) => (
                            <li key={desc} className="text-[19px] leading-relaxed text-cinema-muted">
                              {desc}
                            </li>
                          ))}
                        </ul>
                        <div className="mt-6 flex flex-wrap items-center gap-4 border-t border-black/10 pt-4">
                          <p className="text-[16px] text-cinema-muted/50">{item.tags.join(" · ")}</p>
                          {item.link && (
                            <a
                              href={item.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1.5 text-[16px] font-medium text-cinema-text/70 transition-colors hover:text-cinema-text"
                            >
                              Read paper <ExternalLink className="h-3.5 w-3.5" />
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile / reduced-motion fallback: plain stacked list, no pinning */}
      <div ref={mobileListRef} className="cinema-container-full mt-16 space-y-10 lg:hidden">
        {journey.map((item) => (
          <div key={`${item.title}-${item.organization}`} data-mobile-card className="border-t border-black/10 pt-8 first:border-t-0 first:pt-0">
            <div className="flex items-center gap-3">
              <span className="font-mono text-[16px] text-cinema-muted/70">{item.period}</span>
              <span className="font-mono text-[14px] uppercase tracking-[0.15em] text-cinema-muted/50">{item.type}</span>
            </div>
            <h3 className="mt-3 font-display text-[28px] font-bold leading-tight text-cinema-text">{item.title}</h3>
            <p className="mt-2 text-[20px] text-cinema-muted">{item.organization}</p>
            {item.location && (
              <p className="mt-1 flex items-center gap-2 text-[17px] text-cinema-muted/70">
                <MapPin className="h-3.5 w-3.5 shrink-0" />
                {item.location}
              </p>
            )}
            <ul className="mt-5 space-y-2">
              {item.description.map((desc) => (
                <li key={desc} className="text-[17px] leading-relaxed text-cinema-muted">
                  {desc}
                </li>
              ))}
            </ul>
            <div className="mt-5 flex flex-wrap items-center gap-4">
              <p className="text-[15px] text-cinema-muted/50">{item.tags.join(" · ")}</p>
              {item.link && (
                <a
                  href={item.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-[15px] font-medium text-cinema-text/70"
                >
                  Read paper <ExternalLink className="h-3.5 w-3.5" />
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    </SectionWrapper>
  );
}
