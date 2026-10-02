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

// Seconds each project spends passing through the front of the orbit.
const SECONDS_PER_PROJECT = 3.5;
const FRONT_ANGLE = Math.PI / 2;
const MIN_SCALE = 0.42;
const MIN_OPACITY = 0.18;
const MAX_TILT_DEG = 7;

/**
 * Desktop-only, motion-enabled "solar system": one card per project, all
 * travelling continuously around an elliptical orbit. The card at the
 * bottom of the ellipse is closest to the viewer (full size, on top);
 * cards toward the top recede (smaller, fainter, behind), so the ring
 * reads as a tilted orbit rather than a flat circle. Whichever card is
 * nearest the front is the active project, and the text panel beside the
 * orbit swaps to it.
 *
 * Motion is a single rotation value advanced every frame on GSAP's ticker
 * — it only runs while the section is on screen (ScrollTrigger enter/
 * leave, no pin), and freezes in place while the visitor hovers or
 * keyboard-focuses the deck so they can read a card.
 */
export function ProjectDeck({ projects }: ProjectDeckProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const orbitRef = useRef<HTMLDivElement>(null);
  const counterRef = useRef<HTMLSpanElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const isDesktop = window.matchMedia("(min-width: 1024px)").matches;
    if (reducedMotion || !isDesktop) return;

    const section = sectionRef.current;
    const stage = stageRef.current;
    const orbit = orbitRef.current;
    if (!section || !stage || !orbit) return;

    const cards = gsap.utils.toArray<HTMLElement>("[data-deck-card]", orbit);
    const infos = gsap.utils.toArray<HTMLElement>("[data-stage-info]", stage);
    const n = projects.length;
    const slot = (2 * Math.PI) / n;
    const angularSpeed = slot / SECONDS_PER_PROJECT;

    let radiusX = 0;
    let radiusY = 0;
    function measure() {
      const rect = orbit!.getBoundingClientRect();
      radiusX = rect.width * 0.34;
      radiusY = rect.height * 0.3;
    }
    measure();

    let rotation = 0;
    function place() {
      cards.forEach((el, i) => {
        const angle = FRONT_ANGLE + slot * i - rotation;
        const depth = (1 + Math.sin(angle)) / 2;
        gsap.set(el, {
          x: Math.cos(angle) * radiusX,
          y: Math.sin(angle) * radiusY,
          scale: MIN_SCALE + depth * (1 - MIN_SCALE),
          rotation: -Math.cos(angle) * MAX_TILT_DEG,
          opacity: MIN_OPACITY + depth * (1 - MIN_OPACITY),
          zIndex: Math.round(depth * 100),
        });
      });
    }

    gsap.set(cards, { xPercent: -50, yPercent: -50 });
    place();
    infos.forEach((el, i) => gsap.set(el, { autoAlpha: i === 0 ? 1 : 0, y: i === 0 ? 0 : 24 }));
    if (counterRef.current) counterRef.current.textContent = "01";
    if (lineRef.current) lineRef.current.style.transform = `scaleY(${1 / n})`;

    let activeIndex = 0;
    function setActive(next: number) {
      if (next === activeIndex) return;
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

    let paused = false;
    function tick(_time: number, deltaMs: number) {
      if (paused) return;
      rotation += angularSpeed * (deltaMs / 1000);
      place();
      setActive(Math.round(rotation / slot) % n);
    }

    let running = false;
    function start() {
      if (running) return;
      running = true;
      gsap.ticker.add(tick);
    }
    function stop() {
      if (!running) return;
      running = false;
      gsap.ticker.remove(tick);
    }

    const st = ScrollTrigger.create({
      trigger: section,
      start: "top 75%",
      end: "bottom top",
      onEnter: start,
      onEnterBack: start,
      onLeave: stop,
      onLeaveBack: stop,
    });

    const pause = () => {
      paused = true;
    };
    const resume = () => {
      paused = false;
    };
    const onResize = () => {
      measure();
      place();
    };
    orbit.addEventListener("mouseenter", pause);
    orbit.addEventListener("mouseleave", resume);
    stage.addEventListener("focusin", pause);
    stage.addEventListener("focusout", resume);
    window.addEventListener("resize", onResize);

    return () => {
      stop();
      st.kill();
      orbit.removeEventListener("mouseenter", pause);
      orbit.removeEventListener("mouseleave", resume);
      stage.removeEventListener("focusin", pause);
      stage.removeEventListener("focusout", resume);
      window.removeEventListener("resize", onResize);
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
          <div ref={orbitRef} className="relative h-[600px] w-full">
            {projects.map((project) => {
              const Icon = TAG_ICON[project.tags[0]] ?? FlaskConical;
              return (
                <div
                  key={project.id}
                  data-deck-card
                  className="absolute left-1/2 top-1/2 w-[52%] max-w-[400px]"
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
