"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronDown, MapPin } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { volunteering } from "@/data/volunteering";
import { SectionWrapper } from "@/components/effects/SectionWrapper";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Emphasized } from "@/components/ui/Emphasized";
import { PhotoStrip } from "@/components/experience/PhotoStrip";

const ACCENT = "#B23A2A";

/** First sentence of the CV paragraph; the rest opens on demand. */
function splitSummary(text: string) {
  // A full stop followed by a capital letter, so "M.A.D. (" isn't a break.
  const m = /\.\s+(?=[A-Z])/.exec(text);
  return m ? [text.slice(0, m.index + 1), text.slice(m.index + m[0].length)] : [text, ""];
}

/**
 * Volunteering as a timeline: a rail down the left fills in as the visitor
 * scrolls (scrubbed), each role's node pops when reached, and the entry —
 * big year range, organisation, role, the CV's paragraph with its bolded
 * phrases — rises in. Content is transcribed from the CV (data/volunteering).
 */
export function Volunteering() {
  const listRef = useRef<HTMLDivElement>(null);
  const fillRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState<string | null>(null);

  // Opening an entry changes the page height below it; re-measure triggers.
  const firstRender = useRef(true);
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    ScrollTrigger.refresh();
  }, [open]);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const list = listRef.current;
    const fill = fillRef.current;
    if (!list || !fill) return;

    gsap.set(fill, { scaleY: 0, transformOrigin: "top center" });
    const railSt = ScrollTrigger.create({
      trigger: list,
      start: "top 70%",
      end: "bottom 70%",
      scrub: 0.4,
      onUpdate: (self) => gsap.set(fill, { scaleY: self.progress }),
    });

    const entries = gsap.utils.toArray<HTMLElement>("[data-vol]", list);
    const entrySts = entries.map((entry) => {
      const node = entry.querySelector<HTMLElement>("[data-node]");
      const body = entry.querySelectorAll<HTMLElement>("[data-rise]");
      gsap.set(node, { scale: 0 });
      gsap.set(body, { autoAlpha: 0, y: 32 });
      return ScrollTrigger.create({
        trigger: entry,
        start: "top 70%",
        once: true,
        onEnter: () =>
          gsap
            .timeline()
            .to(node, { scale: 1, duration: 0.5, ease: "back.out(3)" })
            .to(body, { autoAlpha: 1, y: 0, duration: 0.75, ease: "power3.out", stagger: 0.12 }, "-=0.3"),
      });
    });

    return () => {
      railSt.kill();
      entrySts.forEach((s) => s.kill());
    };
  }, []);

  return (
    <SectionWrapper id="volunteering">
      <div className="cinema-container-full">
        <SectionHeading
          index="05"
          label="Volunteering"
          title="Giving back"
          emphasis="back"
          description="Community service and student leadership in Dhaka, Bangladesh — since 2016."
        />

        <div ref={listRef} className="relative pl-10 md:pl-16">
          {/* rail */}
          <div aria-hidden className="absolute bottom-0 left-[11px] top-3 w-[3px] rounded-full bg-black/10 md:left-[19px]">
            <div ref={fillRef} className="h-full w-full rounded-full" style={{ background: ACCENT }} />
          </div>

          <div className="space-y-14 md:space-y-16">
            {volunteering.map((item) => {
              const [lead, rest] = splitSummary(item.summary);
              const isOpen = open === item.organization;
              return (
              <article key={item.organization} data-vol className="relative">
                <span
                  data-node
                  aria-hidden
                  className="absolute -left-10 top-3 h-[25px] w-[25px] rounded-full border-[5px] bg-cinema-navy md:-left-16 md:h-[41px] md:w-[41px] md:border-[7px]"
                  style={{ borderColor: ACCENT }}
                />

                <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:gap-12">
                  <div data-rise className="lg:col-span-4">
                    <p className="flex flex-wrap items-baseline gap-x-3">
                      <span className="font-display text-[56px] font-extrabold leading-none tracking-tight md:text-[64px]" style={{ color: ACCENT }}>
                        {item.startYear}
                      </span>
                      <span className="font-serif text-[34px] italic leading-none text-cinema-soft md:text-[38px]">
                        to {item.endYear === "Now" ? "present" : item.endYear}
                      </span>
                    </p>
                    <p className="mt-4 font-mono text-[17.5px] uppercase tracking-[0.08em] text-cinema-muted">{item.period}</p>
                    <p className="mt-1.5 flex items-center gap-2 text-[19px] text-cinema-muted">
                      <MapPin className="h-4 w-4 shrink-0" />
                      {item.location}
                    </p>
                  </div>

                  <div className="lg:col-span-8">
                    <h3
                      data-rise
                      className="font-display text-[32px] font-bold leading-[1.08] tracking-tight text-cinema-text md:text-[42px]"
                    >
                      {item.organization}
                    </h3>
                    <p data-rise className="mt-4">
                      <span
                        className="inline-block rounded-full border-2 px-4 py-1.5 font-mono text-[16.5px] font-semibold uppercase tracking-[0.06em]"
                        style={{ borderColor: `${ACCENT}55`, color: ACCENT }}
                      >
                        {item.role}
                      </span>
                    </p>
                    <div data-rise className="mt-6 text-[21.6px] leading-relaxed text-cinema-soft md:text-[23px]">
                      <p>
                        <Emphasized text={lead} phrases={item.emphasis} strongClassName="font-semibold text-cinema-text" />
                      </p>
                      {rest && isOpen && (
                        <p className="mt-4">
                          <Emphasized text={rest} phrases={item.emphasis} strongClassName="font-semibold text-cinema-text" />
                        </p>
                      )}
                      {rest && (
                        <button
                          type="button"
                          aria-expanded={isOpen}
                          onClick={() => setOpen(isOpen ? null : item.organization)}
                          className="mt-4 inline-flex items-center gap-1.5 font-mono text-[16.5px] font-semibold uppercase tracking-[0.08em] transition-opacity hover:opacity-70"
                          style={{ color: ACCENT }}
                        >
                          {isOpen ? "Show less" : "Read more"}
                          <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? "rotate-180" : ""}`} />
                        </button>
                      )}
                    </div>
                    {item.photos && item.photos.length > 0 && (
                      <div data-rise>
                        <PhotoStrip photos={item.photos} accent={ACCENT} label="Photos" tone="light" />
                      </div>
                    )}
                  </div>
                </div>
              </article>
              );
            })}
          </div>
        </div>
      </div>
    </SectionWrapper>
  );
}
