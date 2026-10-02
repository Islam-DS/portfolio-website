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

const AUTO_ADVANCE_MS = 3500;
const ROW_H = 76;
const ROW_GAP = 10;
const BODY_H = 340;
const PULL_PX = -24;

/**
 * Desktop-only, motion-enabled filing cabinet: one drawer per project,
 * stacked top to bottom. Every few seconds the next drawer is pulled out
 * sideways — its front shifts out a little and its body (the project's
 * image and headline stat) slides out of the cabinet's left edge — while
 * the previous drawer slides shut. Loops after the last drawer.
 *
 * Drawer bodies live in a clipping strip that ends exactly at the
 * cabinet's left edge, so sliding a body to xPercent 100 tucks it "inside"
 * the cabinet; only transforms animate. Runs only while the section is on
 * screen (ScrollTrigger enter/leave, no pin) and pauses while the visitor
 * hovers or keyboard-focuses it.
 */
export function ProjectDeck({ projects }: ProjectDeckProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const counterRef = useRef<HTMLSpanElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);

  const n = projects.length;
  const cabinetH = n * ROW_H + (n - 1) * ROW_GAP;

  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const isDesktop = window.matchMedia("(min-width: 1024px)").matches;
    if (reducedMotion || !isDesktop) return;

    const section = sectionRef.current;
    const stage = stageRef.current;
    if (!section || !stage) return;

    const fronts = gsap.utils.toArray<HTMLElement>("[data-drawer-front]", stage);
    const marks = gsap.utils.toArray<HTMLElement>("[data-drawer-mark]", stage);
    const bodies = gsap.utils.toArray<HTMLElement>("[data-drawer-body]", stage);
    const infos = gsap.utils.toArray<HTMLElement>("[data-stage-info]", stage);

    fronts.forEach((el, i) => gsap.set(el, { x: i === 0 ? PULL_PX : 0 }));
    marks.forEach((el, i) => gsap.set(el, { opacity: i === 0 ? 1 : 0 }));
    // The SSR translateX(100%) only prevents a pre-hydration flash; GSAP
    // would parse it as a pixel offset and stack xPercent on top, so clear it.
    gsap.set(bodies, { clearProps: "transform" });
    bodies.forEach((el, i) => gsap.set(el, { xPercent: i === 0 ? 0 : 100 }));
    infos.forEach((el, i) => gsap.set(el, { autoAlpha: i === 0 ? 1 : 0, y: i === 0 ? 0 : 24 }));
    if (counterRef.current) counterRef.current.textContent = "01";
    if (lineRef.current) lineRef.current.style.transform = `scaleY(${1 / n})`;

    let activeIndex = 0;
    function setActive(next: number) {
      const prev = activeIndex;
      if (next === prev) return;

      gsap.to(bodies[prev], { xPercent: 100, duration: 0.55, ease: "power2.in" });
      gsap.to(fronts[prev], { x: 0, duration: 0.5, ease: "power2.inOut" });
      gsap.to(marks[prev], { opacity: 0, duration: 0.3 });

      gsap.to(fronts[next], { x: PULL_PX, duration: 0.5, ease: "power3.out", delay: 0.35 });
      gsap.to(marks[next], { opacity: 1, duration: 0.3, delay: 0.35 });
      gsap.fromTo(
        bodies[next],
        { xPercent: 100 },
        { xPercent: 0, duration: 0.8, ease: "power3.out", delay: 0.4 }
      );

      infos.forEach((el, i) => {
        if (i === next) {
          gsap.to(el, { autoAlpha: 1, y: 0, duration: 0.6, ease: "power3.out", delay: 0.4 });
        } else if (i === prev) {
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
    let hovered = false;
    function start() {
      if (timer || !inView || hovered) return;
      timer = window.setInterval(() => setActive((activeIndex + 1) % n), AUTO_ADVANCE_MS);
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

    const pause = () => {
      hovered = true;
      stop();
    };
    const resume = () => {
      hovered = false;
      start();
    };
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
  }, [projects, n]);

  return (
    <div ref={sectionRef} className="cinema-container-full relative py-12">
      <div ref={stageRef} className="grid items-center gap-12 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-5">
          <ProjectProgress total={n} counterRef={counterRef} lineRef={lineRef} />
          <div className="relative mt-8 min-h-[340px]">
            {projects.map((project) => (
              <div key={project.id} data-stage-info className="absolute inset-0">
                <ProjectInfo project={project} />
              </div>
            ))}
          </div>
        </div>

        <div className="relative lg:col-span-7" style={{ height: cabinetH }}>
          {/* Drawer bodies: clipped at the cabinet's left edge so a closed drawer is tucked inside it. */}
          <div className="absolute inset-y-0 left-0 right-[40%] overflow-hidden">
            {projects.map((project, i) => {
              const Icon = TAG_ICON[project.tags[0]] ?? FlaskConical;
              const rowCenter = i * (ROW_H + ROW_GAP) + ROW_H / 2;
              const top = Math.min(Math.max(rowCenter - BODY_H / 2, 0), cabinetH - BODY_H);
              return (
                <div
                  key={project.id}
                  data-drawer-body
                  className="absolute right-0 w-full max-w-[420px]"
                  style={{ top, height: BODY_H, transform: i === 0 ? undefined : "translateX(100%)" }}
                >
                  <div className="flex h-full flex-col overflow-hidden rounded-l-[28px] border border-r-0 border-black/10 bg-cinema-elevated shadow-cinema">
                    <div className="relative flex-1 overflow-hidden">
                      {project.image ? (
                        <img
                          src={project.image}
                          alt={project.imageAlt ?? project.title}
                          loading="lazy"
                          className="absolute inset-0 h-full w-full object-contain p-5 motion-safe:animate-ken-burns"
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
                    <div className="flex items-center justify-between gap-3 border-t border-black/10 px-5 py-3.5">
                      <span className="shrink-0 rounded-full border border-cinema-gold/30 px-3 py-1 font-mono text-[12px] uppercase tracking-[0.1em] text-cinema-gold">
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

          {/* The cabinet: drawer fronts stacked top to bottom. */}
          <div className="absolute inset-y-0 right-0 z-10 flex w-[40%] flex-col" style={{ gap: ROW_GAP }}>
            {projects.map((project, i) => (
              <div
                key={project.id}
                data-drawer-front
                className="relative flex shrink-0 items-center gap-4 overflow-hidden rounded-2xl border border-black/10 bg-cinema-elevated px-5 shadow-cinema"
                style={{ height: ROW_H, transform: i === 0 ? `translateX(${PULL_PX}px)` : undefined }}
              >
                <span
                  data-drawer-mark
                  className="absolute inset-y-0 left-0 w-1 bg-cinema-gold"
                  style={{ opacity: i === 0 ? 1 : 0 }}
                />
                <span className="font-mono text-[13px] text-cinema-muted/60">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="min-w-0 flex-1 truncate font-display text-[15px] font-semibold text-cinema-text">
                  {project.title}
                </span>
                <span className="h-1.5 w-8 shrink-0 rounded-full bg-black/15" aria-hidden />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
