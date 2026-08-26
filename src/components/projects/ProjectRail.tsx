"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Project } from "@/data/projects";
import { ProjectCard } from "@/components/projects/ProjectCard";

/**
 * Horizontal project gallery.
 *
 * Native horizontal overflow with scroll-snap rather than a JS carousel, so it
 * keeps trackpad, touch, keyboard and screen-reader behaviour for free. Drag,
 * arrow buttons and a progress bar sit on top of that; Lenis is told to ignore
 * the rail so vertical smooth-scroll never fights the horizontal one.
 */
export function ProjectRail({ projects }: { projects: Project[] }) {
  const railRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);

  const readPosition = useCallback(() => {
    const el = railRef.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    const x = el.scrollLeft;
    setProgress(max > 0 ? x / max : 0);
    setAtStart(x <= 2);
    setAtEnd(x >= max - 2);
  }, []);

  useEffect(() => {
    const el = railRef.current;
    if (!el) return;
    readPosition();
    el.addEventListener("scroll", readPosition, { passive: true });
    window.addEventListener("resize", readPosition);
    return () => {
      el.removeEventListener("scroll", readPosition);
      window.removeEventListener("resize", readPosition);
    };
  }, [readPosition]);

  // pointer drag — desktop users expect to be able to grab a rail like this
  useEffect(() => {
    const el = railRef.current;
    if (!el) return;
    if (window.matchMedia("(pointer: coarse)").matches) return;

    let down = false;
    let startX = 0;
    let startLeft = 0;
    let moved = false;

    const onDown = (e: PointerEvent) => {
      if (e.button !== 0) return;
      // let real controls handle their own clicks
      if ((e.target as HTMLElement).closest("a, button")) return;
      down = true;
      moved = false;
      startX = e.clientX;
      startLeft = el.scrollLeft;
      el.style.cursor = "grabbing";
      el.style.scrollSnapType = "none";
    };
    const onMove = (e: PointerEvent) => {
      if (!down) return;
      const dx = e.clientX - startX;
      if (Math.abs(dx) > 3) moved = true;
      el.scrollLeft = startLeft - dx;
    };
    const onUp = () => {
      if (!down) return;
      down = false;
      el.style.cursor = "";
      el.style.scrollSnapType = "";
      if (moved) {
        const block = (ev: Event) => {
          ev.preventDefault();
          ev.stopPropagation();
        };
        el.addEventListener("click", block, { capture: true, once: true });
        window.setTimeout(
          () => el.removeEventListener("click", block, { capture: true }),
          0
        );
      }
    };

    el.addEventListener("pointerdown", onDown);
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerup", onUp);
    return () => {
      el.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
    };
  }, []);

  const step = (dir: 1 | -1) => {
    const el = railRef.current;
    if (!el) return;
    const card = el.querySelector<HTMLElement>("[data-rail-item]");
    const amount = card ? card.offsetWidth + 32 : el.clientWidth * 0.8;
    el.scrollBy({ left: dir * amount, behavior: "smooth" });
  };

  return (
    <div className="relative">
      <div className="mb-8 flex items-end justify-between gap-6">
        <p className="section-label">More Research</p>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => step(-1)}
            disabled={atStart}
            aria-label="Previous projects"
            data-cursor
            className="flex h-11 w-11 items-center justify-center rounded-full border border-black/15 text-cinema-text transition-all duration-300 hover:border-cinema-blue hover:text-cinema-blue disabled:pointer-events-none disabled:opacity-30"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => step(1)}
            disabled={atEnd}
            aria-label="Next projects"
            data-cursor
            className="flex h-11 w-11 items-center justify-center rounded-full border border-black/15 text-cinema-text transition-all duration-300 hover:border-cinema-blue hover:text-cinema-blue disabled:pointer-events-none disabled:opacity-30"
          >
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* full-bleed track so cards can run past the container edge */}
      <div className="relative -mx-6 md:-mx-10 lg:-mx-14">
        <div
          ref={railRef}
          data-lenis-prevent
          tabIndex={0}
          aria-label="Project gallery, scroll horizontally"
          className="project-rail flex snap-x snap-mandatory gap-8 overflow-x-auto scroll-smooth px-6 pb-4 md:px-10 lg:px-14"
        >
          {projects.map((project, i) => (
            <div
              key={project.id}
              data-rail-item
              className="w-[82vw] shrink-0 snap-start sm:w-[58vw] lg:w-[38vw] xl:w-[30vw]"
            >
              <ProjectCard project={project} index={i} />
            </div>
          ))}
        </div>

        {/* edge fades hint that the track continues */}
        <div
          aria-hidden
          className={`pointer-events-none absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-cinema-navy to-transparent transition-opacity duration-300 ${
            atStart ? "opacity-0" : "opacity-100"
          }`}
        />
        <div
          aria-hidden
          className={`pointer-events-none absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-cinema-navy to-transparent transition-opacity duration-300 ${
            atEnd ? "opacity-0" : "opacity-100"
          }`}
        />
      </div>

      <div className="mt-6 h-px w-full bg-black/10" aria-hidden>
        <div
          className="h-px origin-left bg-cinema-blue transition-transform duration-150 ease-out"
          style={{ transform: `scaleX(${Math.max(0.06, progress || 0.06)})` }}
        />
      </div>
    </div>
  );
}
