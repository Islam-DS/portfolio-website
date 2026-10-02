"use client";

import type { ComponentType } from "react";
import { Dna, FlaskConical, Microscope, Network } from "lucide-react";
import { Project } from "@/data/projects";

const TAG_ICON: Record<string, ComponentType<{ className?: string; strokeWidth?: number }>> = {
  "DNA Methylation": Dna,
  Epigenetics: Dna,
  Genomics: Dna,
  "Graph Learning": Network,
  "Spatial Biology": Network,
  "Computational Pathology": Microscope,
  "Negative Result": Microscope,
};

/**
 * The single visual element reused for every role in the pinned stage
 * (main and peek) — only its transform/scale differs between roles, not
 * its appearance, so the "peek becoming main" transition reads as one
 * element growing into place rather than two different-looking things
 * swapping.
 */
export function ProjectVisual({ project }: { project: Project }) {
  const Icon = TAG_ICON[project.tags[0]] ?? FlaskConical;
  return (
    <div className="relative h-full w-full overflow-hidden rounded-2xl border border-black/10 bg-cinema-elevated shadow-cinema">
      {project.image ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={project.image}
          alt={project.imageAlt ?? project.title}
          className="absolute inset-0 h-full w-full object-contain p-6"
          loading="lazy"
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
  );
}
