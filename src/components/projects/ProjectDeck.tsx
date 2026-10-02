"use client";

import { useEffect, useRef } from "react";
import type { ComponentType } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Dna, FlaskConical, Microscope, Network } from "lucide-react";
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

// Small per-card tilt so the stack reads as a loosely fanned deck rather
// than a perfectly aligned pile — cycled by index, not hand-tuned per card.
const TILTS = [-3, 2, -2, 3, -1, 1];

const AUTO_ADVANCE_MS = 3500;

/**
 * Desktop-only, motion-enabled card deck — one card per project, stacked,
 * matching the reference video's own look. Unlike a scroll-scrubbed
 * stage, this one isn't tied to scroll position: once the deck scrolls
 * into view it autoplays on a timer, looping back to the first project
 * after the last (the video itself loops independent of scroll). Scroll
 * only decides WHEN it runs — ScrollTrigger starts the timer on enter
 * and stops it on leave (no pin), so nothing animates off-screen.
 * Hovering or keyboard-focusing the deck pauses the timer so a visitor
 * has time to actually read a card before it moves on.
 *
 * All six cards sit in the DOM simultaneously, absolutely stacked, and
 * are animated purely via transform/opacity based on distance from the
 * active index: the active card is centered at full size; the next
 * couple of cards peek in from above, progressively smaller and fainter;
 * the card that just lost its turn slides down and fades out. Advancing
 * the active index re-targets every card's animation, so GSAP tweens the
 * next one down into place rather than swapping DOM nodes.
 */
export function ProjectDeck({ projects }: ProjectDeckProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const counterRef = useRef<HTMLSpanElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const isDesktop = window.matchMedia("(min-width: 1024px)").matches;
    if (reducedMotion || !isDesktop) return;

    const section = sectionRef.current;
    const stage = stageRef.current;
    if (!section || !stage) return;

    const cards = gsap.utils.toArray<HTMLElement>("[data-deck-card]", stage);
    const infos = gsap.utils.toArray<HTMLElement>("[data-stage-info]", stage);
    const n = projects.length;

    function roleTarget(delta: number) {
      if (delta === 0) return { x: "0%", y: "0%", scale: 1, autoAlpha: 1, zIndex: 30 };
      if (delta < 0) return { x: "0%", y: "55%", scale: 0.92, autoAlpha: 0, zIndex: 5 };
      const peek = Math.min(delta, 3);
      return {
        x: "0%",
        y: `${-10 - peek * 7}%`,
        scale: 1 - peek * 0.05,
        autoAlpha: peek <= 2 ? 0.85 - peek * 0.3 : 0,
        zIndex: 30 - peek * 5,
      };
    }

    cards.forEach((el, i) => gsap.set(el, roleTarget(i)));
    infos.forEach((el, i) => gsap.set(el, { autoAlpha: i === 0 ? 1 : 0, y: i === 0 ? 0 : 24 }));
    if (counterRef.current) counterRef.current.textContent = "01";
    if (lineRef.current) lineRef.current.style.transform = `scaleY(${1 / n})`;

    let activeIndex = 0;
    function setActive(next: number) {
      if (next === activeIndex) return;
      cards.forEach((el, i) =>
        gsap.to(el, { ...roleTarget(i - next), duration: 0.9, ease: "power3.out" })
      );
      infos.forEach((el, i) => {
        if (i === next) {
          gsap.to(el, { autoAlpha: 1, y: 0, duration: 0.6, ease: "power3.out", delay: 0.12 });
        } else if (i === activeIndex) {
          gsap.to(el, { autoAlpha: 0, y: -20, duration: 0.4, ease: "power2.inOut" });
        } else {
          gsap.set(el, { autoAlpha: 0, y: 20 });
        }
      });
      activeIndex = next;
      if (counterRef.current) counterRef.current.textContent = String(next + 1).padStart(2, "0");
      if (lineRef.current) lineRef.current.style.transform = `scaleY(${(next + 1) / n})`;
    }

    let timer: number | null = null;
    let inView = false;
    function advance() {
      setActive((activeIndex + 1) % n);
    }
    function start() {
      if (timer || !inView) return;
      timer = window.setInterval(advance, AUTO_ADVANCE_MS);
    }
    function stop() {
      if (timer) {
        window.clearInterval(timer);
        timer = null;
      }
    }

    const st = ScrollTrigger.create({
      trigger: section,
      start: "top 75%",
      end: "bottom top",
      onEnter: () => {
        inView = true;
        start();
      },
      onEnterBack: () => {
        inView = true;
        start();
      },
      onLeave: () => {
        inView = false;
        stop();
      },
      onLeaveBack: () => {
        inView = false;
        stop();
      },
    });

    const pause = () => stop();
    const resume = () => start();
    stage.addEventListener("mouseenter", pause);
    stage.addEventListener("mouseleave", resume);
    stage.addEventListener("focusin", pause);
    stage.addEventListener("focusout", resume);

    return () => {
      stop();
      st.kill();
      stage.removeEventListener("mouseenter", pause);
      stage.removeEventListener("mouseleave", resume);
      stage.removeEventListener("focusin", pause);
      stage.removeEventListener("focusout", resume);
    };
  }, [projects]);

  return (
    <div ref={sectionRef} className="cinema-container-full relative py-12">
      <div ref={stageRef} className="grid items-center gap-12 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-5">
          <ProjectProgress total={projects.length} counterRef={counterRef} lineRef={lineRef} />
          <div className="relative mt-8 min-h-[340px]">
            {projects.map((project) => (
              <div key={project.id} data-stage-info className="absolute inset-0">
                <ProjectInfo project={project} />
              </div>
            ))}
          </div>
        </div>

        <div className="relative lg:col-span-7">
          <div className="relative min-h-[460px] w-full lg:min-h-[560px]">
            {projects.map((project, i) => {
              const Icon = TAG_ICON[project.tags[0]] ?? FlaskConical;
              return (
                <div
                  key={project.id}
                  data-deck-card
                  className="absolute inset-x-[6%] top-0 mx-auto max-w-[480px]"
                  style={{ rotate: `${TILTS[i % TILTS.length]}deg` }}
                >
                  <div className="flex flex-col overflow-hidden rounded-[32px] border border-black/10 bg-cinema-elevated shadow-cinema">
                    <div className="relative aspect-[4/3] w-full overflow-hidden">
                      {project.image ? (
                        <img
                          src={project.image}
                          alt={project.imageAlt ?? project.title}
                          loading="lazy"
                          className="absolute inset-0 h-full w-full object-contain p-6 motion-safe:animate-ken-burns"
                        />
                      ) : (
                        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
                          <Icon className="h-9 w-9 text-cinema-muted/50" strokeWidth={1.5} />
                          <span className="font-mono text-[13px] uppercase tracking-[0.18em] text-cinema-muted/50">
                            {project.language}
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="flex items-center justify-between gap-3 border-t border-black/10 px-5 py-4">
                      <span className="rounded-full border border-cinema-gold/30 bg-cinema-elevated px-3 py-1 font-mono text-[12px] uppercase tracking-[0.1em] text-cinema-gold">
                        {project.tags[0]}
                      </span>
                      {project.stat && (
                        <span className="truncate font-display text-[14px] font-semibold text-cinema-text">
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
    </div>
  );
}
