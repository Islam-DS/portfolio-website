"use client";

import { ArrowUpRight, ExternalLink } from "lucide-react";
import { Project } from "@/data/projects";

/** Text panel for the pinned stage — title/category/description/links.
 * No year field: none of the curated projects have reliable date data,
 * so it's left out rather than guessed. */
export function ProjectInfo({ project }: { project: Project }) {
  const category = project.tags[0] ?? project.language;
  return (
    <div>
      <p className="font-mono text-[15px] uppercase tracking-[0.15em] text-cinema-muted/60">
        {category} · {project.language}
      </p>
      <h3 className="mt-5 font-display text-[38px] font-bold leading-[1.08] text-cinema-text xl:text-[48px]">
        {project.title}
      </h3>
      <p className="mt-5 max-w-xl text-[19px] leading-relaxed text-cinema-muted">{project.description}</p>
      <p className="mt-5 font-mono text-[14px] text-cinema-muted/50">{project.tags.join(" · ")}</p>

      <div className="mt-7 flex flex-wrap items-center gap-6 border-t border-black/10 pt-6">
        <a
          href={project.github}
          target="_blank"
          rel="noopener noreferrer"
          data-cursor
          data-cursor-label="View Repo"
          className="inline-flex items-center gap-1.5 text-[17px] font-medium text-cinema-text transition-colors hover:text-cinema-blue"
        >
          View repository <ArrowUpRight className="h-4 w-4" />
        </a>
        {project.demo && (
          <a
            href={project.demo}
            target="_blank"
            rel="noopener noreferrer"
            data-cursor
            data-cursor-label="Live Demo"
            className="inline-flex items-center gap-1.5 text-[17px] font-medium text-cinema-gold transition-colors hover:text-cinema-text"
          >
            Live demo <ExternalLink className="h-4 w-4" />
          </a>
        )}
      </div>
    </div>
  );
}
