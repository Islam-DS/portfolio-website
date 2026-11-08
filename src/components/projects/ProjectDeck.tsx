"use client";

import { useEffect, useRef } from "react";
import type { ComponentType } from "react";
import gsap from "gsap";
import { ChevronLeft, ChevronRight, Dna, FlaskConical, Microscope, Network } from "lucide-react";
import { Project } from "@/data/projects";
import { ProjectInfo } from "./ProjectInfo";
import { ProjectProgress } from "./ProjectProgress";

interface ProjectDeckProps {
  projects: Project[];
}

const TAG_ICON: Record<string, ComponentType<{ className?: string; strokeWidth?: number }>> = {
  "DNA Methylation": Dna,
  Epigenetics: Dna,
  Genomics: Dna,
  "Graph Learning": Network,
  "Spatial Biology": Network,
  "Computational Pathology": Microscope,
  "Negative Result": Microscope,
};


type Slot = { xPercent: number; yPercent: number; scale: number; opacity: number; zIndex: number };

// Positions along the diagonal, keyed by distance from the active card.
// Cards travel top-left -> bottom-right: enter faded from above, grow into
// the front, then slide off past the bottom-right edge.
const SLOTS: Record<number, Slot> = {
  [-2]: { xPercent: 115, yPercent: 60, scale: 0.92, opacity: 0, zIndex: 1 },
  [-1]: { xPercent: 55, yPercent: 42, scale: 0.92, opacity: 0.9, zIndex: 25 },
  0: { xPercent: 0, yPercent: 0, scale: 1, opacity: 1, zIndex: 30 },
  1: { xPercent: -12, yPercent: -62, scale: 0.84, opacity: 0.95, zIndex: 20 },
  2: { xPercent: -20, yPercent: -108, scale: 0.72, opacity: 0, zIndex: 10 },
};

/**
 * Desktop-only, motion-enabled stacked card animation, modelled on the
 * Taste Skill reference video: one card per project, overlapping along a
 * diagonal. The visitor steps through with previous/next buttons or the
 * arrow keys (no autoplay): the front card slides off the bottom-right, the
 * card behind grows into the front, and the next fades in from the top.
 * Wraps around. The text panel beside it follows the front card.
 * Transform/opacity only; cards leaving past the column's right edge are
 * clipped there (overflow-x only, so nothing is cut off vertically).
 */
export function ProjectDeck({ projects }: ProjectDeckProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const counterRef = useRef<HTMLSpanElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const prevRef = useRef<HTMLButtonElement>(null);
  const nextRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const isDesktop = window.matchMedia("(min-width: 1024px)").matches;
    if (reducedMotion || !isDesktop) return;

    const section = sectionRef.current;
    const stage = stageRef.current;
    if (!section || !stage) return;

    const cards = gsap.utils.toArray<HTMLElement>("[data-stack-card]", stage);
    const infos = gsap.utils.toArray<HTMLElement>("[data-stage-info]", stage);
    const n = projects.length;

    // Wrapped distance in [-2, n-3], so the pile loops without a visible jump.
    function distance(i: number, active: number) {
      const d = (((i - active) % n) + n) % n;
      return d >= n - 2 ? d - n : d;
    }
    function slotFor(d: number): Slot {
      return SLOTS[d] ?? SLOTS[2];
    }

    cards.forEach((el, i) => gsap.set(el, slotFor(distance(i, 0))));
    infos.forEach((el, i) => gsap.set(el, { autoAlpha: i === 0 ? 1 : 0, y: i === 0 ? 0 : 24 }));
    if (counterRef.current) counterRef.current.textContent = "01";
    if (lineRef.current) lineRef.current.style.transform = `scaleY(${1 / n})`;

    let activeIndex = 0;
    function setActive(next: number) {
      const prev = activeIndex;
      if (next === prev) return;

      cards.forEach((el, i) => {
        const from = slotFor(distance(i, prev));
        const to = slotFor(distance(i, next));
        // Hidden -> hidden (wrapping from the bottom back to the top): jump, don't fly across.
        if (from.opacity === 0 && to.opacity === 0) gsap.set(el, to);
        else gsap.to(el, { ...to, duration: 0.75, ease: "power3.inOut" });
      });

      infos.forEach((el, i) => {
        if (i === next) {
          gsap.to(el, { autoAlpha: 1, y: 0, duration: 0.45, ease: "power3.out", delay: 0.2 });
        } else if (i === prev) {
          gsap.to(el, { autoAlpha: 0, y: -20, duration: 0.3, ease: "power2.inOut" });
        } else {
          gsap.set(el, { autoAlpha: 0, y: 20 });
        }
      });

      activeIndex = next;
      if (counterRef.current) counterRef.current.textContent = String(next + 1).padStart(2, "0");
      if (lineRef.current) lineRef.current.style.transform = `scaleY(${(next + 1) / n})`;
    }

    // Visitor-driven: previous / next buttons and arrow keys, no autoplay —
    // a reader should decide how long to look at each project.
    const prevBtn = prevRef.current;
    const nextBtn = nextRef.current;
    const goPrev = () => setActive((activeIndex - 1 + n) % n);
    const goNext = () => setActive((activeIndex + 1) % n);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") goPrev();
      if (e.key === "ArrowRight") goNext();
    };
    prevBtn?.addEventListener("click", goPrev);
    nextBtn?.addEventListener("click", goNext);
    stage.addEventListener("keydown", onKey);

    return () => {
      prevBtn?.removeEventListener("click", goPrev);
      nextBtn?.removeEventListener("click", goNext);
      stage.removeEventListener("keydown", onKey);
    };
  }, [projects]);

  return (
    <div ref={sectionRef} className="cinema-container-full relative py-12">
      <div ref={stageRef} className="grid items-center gap-12 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-5">
          <div className="flex items-center justify-between gap-6">
            <ProjectProgress total={projects.length} counterRef={counterRef} lineRef={lineRef} />
            <div className="flex gap-2.5">
              <button
                ref={prevRef}
                type="button"
                aria-label="Previous project"
                className="flex h-12 w-12 items-center justify-center rounded-full border border-black/20 text-cinema-text transition-colors hover:border-cinema-ink hover:bg-cinema-ink hover:text-white"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                ref={nextRef}
                type="button"
                aria-label="Next project"
                className="flex h-12 w-12 items-center justify-center rounded-full bg-cinema-ink text-white transition-colors hover:bg-cinema-blue"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          </div>
          {/* All panels share one grid cell, so the box is as tall as the longest
              project text instead of a fixed height it could spill out of. */}
          <div className="mt-8 grid">
            {projects.map((project) => (
              <div key={project.id} data-stage-info className="[grid-area:1/1]">
                <ProjectInfo project={project} />
              </div>
            ))}
          </div>
        </div>

        <div className="relative h-[640px] overflow-x-clip lg:col-span-7">
          {projects.map((project, i) => {
            const Icon = TAG_ICON[project.tags[0]] ?? FlaskConical;
            return (
              <div
                key={project.id}
                data-stack-card
                className="absolute left-[8%] top-[30%] w-[76%] max-w-[540px]"
                style={i === 0 ? undefined : { opacity: 0 }}
              >
                <div className="flex flex-col overflow-hidden rounded-[32px] border border-black/10 bg-cinema-elevated shadow-cinema">
                  <div className="relative aspect-[16/10] w-full overflow-hidden">
                    {project.image ? (
                      <img
                        src={project.image}
                        alt={project.imageAlt ?? project.title}
                        loading="lazy"
                        className="absolute inset-0 h-full w-full object-contain p-6 motion-safe:animate-ken-burns"
                      />
                    ) : (
                      <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
                        <Icon className="h-9 w-9 text-cinema-muted/80" strokeWidth={1.5} />
                        <span className="font-mono text-[17.5px] uppercase tracking-[0.08em] text-cinema-muted/80">
                          {project.language}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center justify-between gap-3 border-t border-black/10 px-5 py-4">
                    <span className="shrink-0 rounded-full border border-cinema-gold/30 px-3 py-1 font-mono text-[12px] uppercase tracking-[0.1em] text-cinema-gold">
                      {project.tags[0]}
                    </span>
                    {project.stat && (
                      <span className="truncate font-display text-[16.5px] font-semibold text-cinema-text">
                        {project.stat}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
