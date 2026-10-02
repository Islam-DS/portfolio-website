"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Project } from "@/data/projects";
import { BENTO_LAYOUTS, ProjectImageCard, ProjectPillsCard, ProjectStatCard } from "./ProjectBento";
import { ProjectInfo } from "./ProjectInfo";
import { ProjectProgress } from "./ProjectProgress";

interface ProjectStageProps {
  projects: Project[];
}

/**
 * Desktop-only, motion-enabled pinned Bento showcase. The section is held
 * in place (via GSAP's `pin`) for a scroll distance proportional to the
 * project count; scroll position alone determines which project is active.
 *
 * Each project contributes three heterogeneous cards (its real result
 * image, a real headline stat pulled from its own description, and its
 * tag pills — see ProjectBento) laid out in one of three rest-position
 * presets (BENTO_LAYOUTS, cycled by index). Every card from every project
 * sits in the DOM simultaneously, absolutely positioned, and is animated
 * purely via transform/opacity based on its distance from the active
 * index — but each of the three card types gets its OWN entry/exit
 * direction (image from the right, stat from the top, pills from the
 * left) so the composition doesn't just slide uniformly; it rearranges,
 * per the brief.
 *   delta  0  -> active: full size, at rest, fully visible
 *   delta  1  -> entering: small, offset in its own direction, still visible
 *   delta <0  -> retired: faded out, exited in its own direction
 *   delta >=2 -> waiting off-stage, invisible
 * Advancing the active index re-targets every card's animation to its new
 * role; GSAP tweens it there smoothly rather than swapping DOM nodes.
 *
 * Mounted even on screens/pointer settings where it's not shown (CSS
 * handles visibility — see ProjectsSection) so there's no hydration
 * mismatch; this effect itself still guards against doing any work when
 * the stage isn't the active experience.
 */
export function ProjectStage({ projects }: ProjectStageProps) {
  const pinWrapRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const counterRef = useRef<HTMLSpanElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const isDesktop = window.matchMedia("(min-width: 1024px)").matches;
    if (reducedMotion || !isDesktop) return;

    const pinWrap = pinWrapRef.current;
    const stage = stageRef.current;
    if (!pinWrap || !stage) return;

    const images = gsap.utils.toArray<HTMLElement>("[data-bento-image]", stage);
    const stats = gsap.utils.toArray<HTMLElement>("[data-bento-stat]", stage);
    const pills = gsap.utils.toArray<HTMLElement>("[data-bento-pills]", stage);
    const infos = gsap.utils.toArray<HTMLElement>("[data-stage-info]", stage);
    const n = projects.length;

    // Each card type gets its own entry/exit direction so the whole
    // composition rearranges rather than sliding uniformly.
    function roleTarget(cardType: "image" | "stat" | "pills", delta: number) {
      if (delta === 0) return { x: "0%", y: "0%", scale: 1, autoAlpha: 1, zIndex: 30 };
      if (delta === 1) {
        if (cardType === "image") return { x: "16%", y: "10%", scale: 0.82, autoAlpha: 0.85, zIndex: 20 };
        if (cardType === "stat") return { x: "0%", y: "-38%", scale: 0.72, autoAlpha: 0.2, zIndex: 20 };
        return { x: "-32%", y: "10%", scale: 0.78, autoAlpha: 0.2, zIndex: 20 };
      }
      if (delta < 0) {
        if (cardType === "image") return { x: "-20%", y: "-8%", scale: 0.84, autoAlpha: 0, zIndex: 5 };
        if (cardType === "stat") return { x: "0%", y: "-28%", scale: 0.78, autoAlpha: 0, zIndex: 5 };
        return { x: "22%", y: "16%", scale: 0.8, autoAlpha: 0, zIndex: 5 };
      }
      if (cardType === "image") return { x: "22%", y: "16%", scale: 0.78, autoAlpha: 0, zIndex: 1 };
      if (cardType === "stat") return { x: "0%", y: "-32%", scale: 0.74, autoAlpha: 0, zIndex: 1 };
      return { x: "-24%", y: "8%", scale: 0.78, autoAlpha: 0, zIndex: 1 };
    }

    images.forEach((el, i) => gsap.set(el, roleTarget("image", i)));
    stats.forEach((el, i) => gsap.set(el, roleTarget("stat", i)));
    pills.forEach((el, i) => gsap.set(el, roleTarget("pills", i)));
    infos.forEach((el, i) => gsap.set(el, { autoAlpha: i === 0 ? 1 : 0, y: i === 0 ? 0 : 24 }));
    if (counterRef.current) counterRef.current.textContent = "01";

    let activeIndex = 0;
    function setActive(next: number) {
      if (next === activeIndex) return;
      images.forEach((el, i) =>
        gsap.to(el, { ...roleTarget("image", i - next), duration: 0.85, ease: "power3.out" })
      );
      stats.forEach((el, i) =>
        gsap.to(el, { ...roleTarget("stat", i - next), duration: 0.85, ease: "power3.out" })
      );
      pills.forEach((el, i) =>
        gsap.to(el, { ...roleTarget("pills", i - next), duration: 0.85, ease: "power3.out" })
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
    }

    const st = ScrollTrigger.create({
      trigger: pinWrap,
      start: "top top",
      end: "bottom bottom",
      pin: stage,
      scrub: 0.6,
      onUpdate: (self) => {
        if (lineRef.current) lineRef.current.style.transform = `scaleY(${self.progress})`;
        const next = Math.min(n - 1, Math.floor(self.progress * n));
        setActive(next);
      },
    });

    return () => st.kill();
  }, [projects]);

  return (
    <div ref={pinWrapRef} className="relative" style={{ height: `${projects.length * 100}vh` }}>
      <div ref={stageRef} className="relative flex h-screen w-full items-center overflow-hidden">
        <div className="cinema-container-full w-full">
          <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-16">
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
                  const layout = BENTO_LAYOUTS[i % BENTO_LAYOUTS.length];
                  return (
                    <div key={project.id} className="contents">
                      <ProjectImageCard project={project} layout={layout} />
                      <ProjectStatCard project={project} layout={layout} />
                      <ProjectPillsCard project={project} layout={layout} />
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
