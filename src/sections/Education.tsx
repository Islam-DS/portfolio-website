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
    <SectionWrapper id="education">
      <div className="cinema-container-full">
        <SectionHeading index="01" label="Education" title="Academic foundation" />
      </div>

      {/* Near edge-to-edge split-screen: a direct child of the section (not
          .cinema-container), so this grid runs almost the full width of the
          page rather than the site's ~1920px content cap — only the small
          .cinema-edge inset keeps it just off the exact browser edge.
          University is always column one (left), school always column two
          (right) — the source order in @/data/education already matches
          that. */}
      <div className="cinema-edge">
        <div ref={gridRef} className="relative grid w-full grid-cols-1 border-y border-black/10 md:grid-cols-2">
        {education.map((item, i) => {
          const accent = i === 0 ? "gold" : "blue";
          return (
            <div
              key={item.institution}
              data-edu-card
              className={`group relative flex min-h-[560px] flex-col justify-center overflow-hidden border-black/10 bg-cinema-elevated p-8 sm:p-12 md:min-h-[680px] md:p-16 lg:p-20 ${
                i === 0 ? "border-b md:border-b-0 md:border-r" : ""
              }`}
            >
              {/* thin spine bar — a small, quiet color cue that ties this column's
                  accent (gold for the scholarship, teal for the school) through the
                  underline, bullets and watermark below */}
              <div
                className={`pointer-events-none absolute inset-x-0 top-0 z-[1] h-[3px] ${
                  accent === "gold" ? "bg-cinema-gold/70" : "bg-cinema-blue/70"
                }`}
                aria-hidden
              />

              {item.image && (
                <div className="pointer-events-none absolute inset-0" aria-hidden>
                  {/* Real, animated campus photography — a plain <img> (not next/image)
                      so the GIF keeps animating rather than being frozen by optimization.
                      Below md the column is a single full-width block and the text runs
                      edge to edge over it, so it stays a flat, mostly-hidden backdrop.
                      At md+, an SVG turbulence mask (public/images/dissolve-mask.svg)
                      dissolves the photo's left edge into true transparency through a
                      jagged, hand-torn boundary — not a straight CSS gradient line — so
                      the text side reads as clean card, not a washed-over photo, while
                      the photo itself stays sharp and fully visible on the right. */}
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={item.image}
                    alt=""
                    className="h-full w-full scale-105 object-cover opacity-[0.5] transition-all duration-700 ease-out group-hover:scale-110 group-hover:opacity-[0.6] md:hidden"
                  />
                  <div className="absolute inset-0 bg-cinema-elevated/70 md:hidden" />

                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={item.image}
                    alt=""
                    style={{
                      maskImage: "url('/images/dissolve-mask.svg')",
                      maskSize: "100% 100%",
                      maskRepeat: "no-repeat",
                      WebkitMaskImage: "url('/images/dissolve-mask.svg')",
                      WebkitMaskSize: "100% 100%",
                      WebkitMaskRepeat: "no-repeat",
                    }}
                    className="hidden h-full w-full scale-105 object-cover opacity-[0.92] transition-all duration-700 ease-out group-hover:scale-110 group-hover:opacity-100 md:block"
                  />
                </div>
              )}

              {/* oversized monogram watermark, faint — same technique as the
                  Publications section's numeral, reused here as the institution's
                  initial for a quiet, premium editorial signature */}
              <span
                aria-hidden
                className={`pointer-events-none absolute -bottom-12 -right-4 z-[1] select-none font-display text-[13rem] font-bold leading-none md:-bottom-20 md:-right-8 md:text-[19rem] ${
                  accent === "gold" ? "text-cinema-gold/[0.07]" : "text-cinema-blue/[0.07]"
                }`}
              >
                {item.institution.charAt(0)}
              </span>

              <div className="relative z-10 flex max-w-xl flex-col [text-shadow:0_1px_10px_rgba(255,252,244,0.8)]">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <span className="font-mono text-[18.9px] text-cinema-soft">{item.period}</span>
                  {item.badge && (
                    <span
                      className={`rounded-full border px-3 py-1 font-mono text-[16.2px] uppercase tracking-[0.12em] backdrop-blur-sm ${
                        accent === "gold"
                          ? "border-cinema-gold/30 bg-cinema-elevated/60 text-cinema-gold"
                          : "border-black/10 bg-cinema-elevated/60 text-cinema-muted"
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </div>

                <h3 className="mt-6 font-display text-[30px] font-bold leading-tight text-cinema-text sm:text-[34px] lg:text-[42px] xl:text-[48.6px]">
                  {item.institution}
                </h3>
                <span
                  className={`mt-5 block h-[2px] w-14 rounded-full ${
                    accent === "gold" ? "bg-cinema-gold" : "bg-cinema-blue"
                  }`}
                  aria-hidden
                />
                <p className="mt-4 font-serif text-[27px] italic text-cinema-soft">{item.degree}</p>
                <p className="mt-3 flex items-center gap-2 text-[21.6px] text-cinema-soft/85">
                  <MapPin className="h-4 w-4 shrink-0" />
                  {item.location}
                </p>

                <ul className="mt-8 space-y-3 border-t border-black/20 pt-6">
                  {item.highlights.map((highlight) => (
                    <li key={highlight} className="flex gap-3 text-[24.3px] leading-relaxed text-cinema-soft">
                      <span
                        className={`mt-2.5 h-1 w-1 shrink-0 rounded-full ${
                          accent === "gold" ? "bg-cinema-gold" : "bg-cinema-blue"
                        }`}
                      />
                      {highlight}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          );
        })}

        {/* small inlaid ornament where the two columns meet — desktop only */}
        <div
          className="pointer-events-none absolute left-1/2 top-1/2 z-20 hidden h-3 w-3 -translate-x-1/2 -translate-y-1/2 rotate-45 border border-cinema-gold/50 bg-cinema-surface md:block"
          aria-hidden
        />
        </div>
      </div>
    </SectionWrapper>
  );
}
