"use client";

import type { ComponentType } from "react";
import { motion } from "framer-motion";
import { ArrowUpRight, Dna, FlaskConical, Microscope, Network } from "lucide-react";
import { Project } from "@/data/projects";
import { fadeInUp, viewportOnce } from "@/lib/motion";

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

export function ProjectTile({ project, index }: { project: Project; index: number }) {
  const Icon = TAG_ICON[project.tags[0]] ?? FlaskConical;

  return (
    <motion.a
      href={project.github}
      target="_blank"
      rel="noopener noreferrer"
      data-cursor
      data-cursor-label="View Repo"
      data-tile
      initial="hidden"
      whileInView="visible"
      viewport={viewportOnce}
      variants={fadeInUp}
      transition={{ ...fadeInUp.visible.transition, delay: (index % 3) * 0.06 }}
      className="group relative block overflow-hidden rounded-2xl border border-black/10 bg-cinema-elevated transition-colors duration-300 hover:border-black/20"
    >
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-cinema-deep/20">
        {project.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={project.image}
            alt={project.imageAlt ?? project.title}
            className="absolute inset-0 h-full w-full object-contain p-6 transition-transform duration-500 ease-out group-hover:scale-[1.02]"
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

        <h3 className="font-display text-[28px] font-semibold leading-tight text-cinema-text md:text-[34px]">
          {project.title}
        </h3>

        <p className="line-clamp-3 text-[19px] leading-relaxed text-cinema-muted">
          {project.description}
        </p>

        <p className="mt-1 font-mono text-[14px] text-cinema-muted/50">
          {project.tags.slice(0, 3).join(" · ")}
        </p>
      </div>
    </motion.a>
  );
}
