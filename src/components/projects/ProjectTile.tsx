"use client";

import { useEffect, useRef } from "react";
import type { ComponentType } from "react";
import { motion } from "framer-motion";
import { ArrowUpRight, Dna, FlaskConical, Microscope, Network } from "lucide-react";
import { Project } from "@/data/projects";
import { viewportOnce } from "@/lib/motion";
import { attachTiltHover } from "@/lib/useTiltHover";

/** Rough tag -> icon mapping for projects that don't have a result image yet
 * — a quiet, single-tone placeholder instead of a bare centered label.
 * Falls back to a generic flask icon for tags not listed here. */
const TAG_ICON: Record<string, ComponentType<{ className?: string; strokeWidth?: number }>> = {
  "DNA Methylation": Dna,
  Epigenetics: Dna,
  Genomics: Dna,
  "Graph Learning": Network,
  "Spatial Biology": Network,
  "Computational Pathology": Microscope,
  "Negative Result": Microscope,
};

// Local to this component (not the shared fadeInUp) — a touch more dramatic
// than the plain fade-up used elsewhere, since a grid of landing-page-style
// tiles reads better with a bit of scale-in pop.
const tileReveal = {
  hidden: { opacity: 0, y: 36, scale: 0.96 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] as const },
  },
};

export function ProjectTile({ project, index }: { project: Project; index: number }) {
  const Icon = TAG_ICON[project.tags[0]] ?? FlaskConical;
  const tileRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    if (!tileRef.current) return;
    return attachTiltHover([tileRef.current], 4);
  }, []);

  return (
    <motion.a
      ref={tileRef}
      href={project.github}
      target="_blank"
      rel="noopener noreferrer"
      data-cursor
      data-cursor-label="View Repo"
      data-tile
      initial="hidden"
      whileInView="visible"
      viewport={viewportOnce}
      variants={tileReveal}
      transition={{ ...tileReveal.visible.transition, delay: (index % 3) * 0.08 }}
      className="group relative block overflow-hidden rounded-2xl border border-black/10 bg-cinema-elevated transition-colors duration-300 hover:border-black/20 hover:shadow-cinema"
    >
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-cinema-deep/20">
        {project.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={project.image}
            alt={project.imageAlt ?? project.title}
            className="absolute inset-0 h-full w-full object-contain p-6 transition-transform duration-500 ease-out group-hover:scale-[1.04]"
            loading="lazy"
          />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
            <Icon className="h-7 w-7 text-cinema-muted/50" strokeWidth={1.5} />
            <span className="font-mono text-[13px] uppercase tracking-[0.18em] text-cinema-muted/50">
              {project.language ?? "Repository"}
            </span>
          </div>
        )}
      </div>

      <div className="flex flex-col gap-3 p-7 md:p-8">
        <div className="flex items-center justify-between gap-4">
          <span className="font-mono text-[15px] uppercase tracking-[0.16em] text-cinema-muted/60">
            {String(index + 1).padStart(2, "0")} · {project.language}
          </span>
          <ArrowUpRight className="h-5 w-5 shrink-0 text-cinema-muted/60 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
        </div>

        <h3 className="line-clamp-2 font-display text-[28px] font-semibold leading-tight text-cinema-text md:text-[34px]">
          {project.title}
        </h3>

        <p className="line-clamp-3 text-[19px] leading-relaxed text-cinema-muted">
          {project.description}
        </p>

        <p className="mt-1 truncate font-mono text-[14px] text-cinema-muted/50">
          {project.tags.slice(0, 3).join(" · ")}
        </p>
      </div>
    </motion.a>
  );
}
