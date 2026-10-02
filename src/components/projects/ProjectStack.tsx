"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { Project } from "@/data/projects";

interface ProjectStackProps {
  projects: Project[];
}

// Base position for each card in the stack — mirrors the overlapping,
// slightly-tilted cluster from the reference (tasteskill.dev's hero): a
// large card up top, a second one cutting across it lower-left, a third
// peeking out lower-right. Hand-tuned, not a formula, since the whole
// point is that it reads as a loose stack of photos, not a grid.
const LAYOUT = [
  { top: "2%", left: "8%", width: "62%", rotate: -3, z: 30 },
  { top: "34%", left: "0%", width: "56%", rotate: 4, z: 20 },
  { top: "52%", left: "40%", width: "54%", rotate: -5, z: 10 },
];

export function ProjectStack({ projects }: ProjectStackProps) {
  const cards = projects.slice(0, 3);
  const hostRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const els = gsap.utils.toArray<HTMLElement>("[data-stack-card]", host);
    const tweens = els.map((el, i) => {
      const baseRotate = LAYOUT[i]?.rotate ?? 0;
      return gsap.to(el, {
        y: "+=16",
        rotate: baseRotate + (i % 2 === 0 ? 1.5 : -1.5),
        duration: 3.4 + i * 0.6,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        delay: i * 0.4,
      });
    });

    return () => tweens.forEach((t) => t.kill());
  }, []);

  return (
    <div ref={hostRef} className="relative mx-auto aspect-[4/3] w-full max-w-xl lg:mx-0 lg:max-w-none">
      {cards.map((project, i) => {
        const pos = LAYOUT[i];
        if (!pos) return null;
        return (
          <a
            key={project.id}
            href={project.github}
            target="_blank"
            rel="noopener noreferrer"
            data-stack-card
            data-cursor
            data-cursor-label="View Repo"
            className="group absolute overflow-hidden rounded-2xl border border-black/10 bg-cinema-elevated shadow-cinema transition-transform duration-300 hover:z-40 hover:scale-[1.03]"
            style={{
              top: pos.top,
              left: pos.left,
              width: pos.width,
              transform: `rotate(${pos.rotate}deg)`,
              zIndex: pos.z,
            }}
          >
            <div className="relative aspect-[16/11] w-full overflow-hidden bg-cinema-deep/20">
              {project.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={project.image}
                  alt={project.imageAlt ?? project.title}
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />
              ) : (
                <div className="absolute inset-0 bg-cinema-deep/10" />
              )}
            </div>
            <div className="p-4">
              <p className="line-clamp-1 font-display text-[16px] font-semibold text-cinema-text">
                {project.title}
              </p>
            </div>
          </a>
        );
      })}
    </div>
  );
}
