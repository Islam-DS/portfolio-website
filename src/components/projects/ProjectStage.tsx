"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Project } from "@/data/projects";
import { ProjectVisual } from "./ProjectVisual";
import { ProjectInfo } from "./ProjectInfo";
import { ProjectProgress } from "./ProjectProgress";

interface ProjectStageProps {
  projects: Project[];
}

/**
 * Desktop-only, motion-enabled pinned showcase. The section is held in
 * place (position fixed, via GSAP's `pin`) for a scroll distance
 * proportional to the project count; scroll position alone (not time,
 * not arbitrary wheel-event math) determines which project is active.
 *
 * Every project's visual sits in the DOM simultaneously, absolutely
 * positioned, and is animated purely via transform/opacity (scale, x, y,
 * autoAlpha) based on its distance from the active index:
 *   delta  0  -> "main": full size, centered, fully visible
 *   delta  1  -> "peek": small, offset into the corner, fully visible
 *   delta <0  -> "retired": faded out, shifted left (just exited)
 *   delta >=2 -> waiting off-stage, invisible
 * Advancing the active index re-targets every element's animation to its
 * new role; GSAP tweens it there smoothly, which is what makes the
 * "peek" card visually grow into the "main" slot — same element, new
 * target, not a swap.
 *
 * Mounted even on screens/pointer settings where it's not shown (CSS
 * handles visibility — see ProjectsSection) so there's no hydration
 * mismatch; this effect itself still guards against doing any work
 * when the stage isn't the active experience.
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

    const visuals = gsap.utils.toArray<HTMLElement>("[data-stage-visual]", stage);
    const infos = gsap.utils.toArray<HTMLElement>("[data-stage-info]", stage);
    const n = projects.length;

    function roleTarget(delta: number) {
      if (delta === 0) return { x: "0%", y: "0%", scale: 1, autoAlpha: 1, zIndex: 30 };
      if (delta === 1) return { x: "27%", y: "36%", scale: 0.48, autoAlpha: 1, zIndex: 20 };
      if (delta < 0) return { x: "-16%", y: "-10%", scale: 0.8, autoAlpha: 0, zIndex: 5 };
      return { x: "34%", y: "42%", scale: 0.4, autoAlpha: 0, zIndex: 1 };
    }

    visuals.forEach((el, i) => gsap.set(el, roleTarget(i)));
    infos.forEach((el, i) => gsap.set(el, { autoAlpha: i === 0 ? 1 : 0, y: i === 0 ? 0 : 24 }));
    if (counterRef.current) counterRef.current.textContent = "01";

    let activeIndex = 0;
    function setActive(next: number) {
      if (next === activeIndex) return;
      visuals.forEach((el, i) =>
        gsap.to(el, { ...roleTarget(i - next), duration: 0.85, ease: "power3.out" })
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
              <div className="relative aspect-[4/3] w-full">
                {projects.map((project) => (
                  <div key={project.id} data-stage-visual className="absolute left-0 top-0 h-[58%] w-[58%]">
                    <ProjectVisual project={project} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
