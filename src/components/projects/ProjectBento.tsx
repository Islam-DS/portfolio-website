"use client";

import type { ComponentType, CSSProperties } from "react";
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

interface CardPosition {
  top?: string;
  bottom?: string;
  left?: string;
  right?: string;
  width?: string;
  rotate: number;
}

export interface BentoLayout {
  image: CardPosition;
  stat: CardPosition;
  pills: CardPosition;
}

/**
 * Three hand-tuned arrangements, cycled by project index (see ProjectStage)
 * so consecutive projects never share a composition — each card type
 * (image / stat / pills) lands in a different corner with a different tilt
 * each time, the way the Taste Skill reference varies its own layered
 * cards from section to section.
 */
export const BENTO_LAYOUTS: BentoLayout[] = [
  {
    image: { top: "4%", left: "16%", width: "56%", rotate: -2 },
    stat: { top: "0%", right: "0%", width: "30%", rotate: 4 },
    pills: { bottom: "2%", left: "0%", rotate: -3 },
  },
  {
    image: { top: "12%", right: "6%", width: "58%", rotate: 2 },
    stat: { bottom: "4%", left: "0%", width: "28%", rotate: -3 },
    pills: { top: "0%", right: "4%", rotate: 4 },
  },
  {
    image: { top: "2%", left: "2%", width: "54%", rotate: -3 },
    stat: { top: "10%", right: "0%", width: "32%", rotate: 3 },
    pills: { bottom: "0%", right: "16%", rotate: -2 },
  },
];

function cornerStyle(pos: CardPosition): CSSProperties {
  return {
    top: pos.top,
    bottom: pos.bottom,
    left: pos.left,
    right: pos.right,
    width: pos.width,
    rotate: `${pos.rotate}deg`,
  };
}

/** Real project photo/chart — the only heterogeneous card type that
 * carries a continuous Ken Burns drift, clipped by its own rounded card. */
export function ProjectImageCard({ project, layout }: { project: Project; layout: BentoLayout }) {
  const Icon = TAG_ICON[project.tags[0]] ?? FlaskConical;
  return (
    <div data-bento-image className="absolute" style={{ ...cornerStyle(layout.image), zIndex: 10 }}>
      <div className="transition-transform duration-700 ease-cinema hover:-translate-y-1.5 hover:scale-[1.015]">
        <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[32px] border border-black/10 bg-cinema-elevated shadow-cinema">
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
      </div>
    </div>
  );
}

/** A real headline number pulled from the project's own description
 * (project.stat), styled as the dark pull-quote card — mirrors the
 * reference's dark text-only "We build systems" card. Renders nothing
 * if a project has no genuine stat rather than inventing one. */
export function ProjectStatCard({ project, layout }: { project: Project; layout: BentoLayout }) {
  if (!project.stat) {
    return <div data-bento-stat className="absolute h-0 w-0" style={cornerStyle(layout.stat)} />;
  }
  return (
    <div data-bento-stat className="absolute" style={{ ...cornerStyle(layout.stat), zIndex: 20 }}>
      <div className="transition-transform duration-700 ease-cinema hover:-translate-y-1.5 hover:scale-[1.02]">
        <div className="rounded-[28px] border border-white/10 bg-cinema-ink-deep p-6 shadow-cinema">
          <p className="font-mono text-[12px] uppercase tracking-[0.18em] text-white/40">{project.tags[0]}</p>
          <p className="mt-3 font-display text-[22px] font-bold leading-tight text-white">{project.stat}</p>
        </div>
      </div>
    </div>
  );
}

/** Floating tag pills — subtle bob via the site's existing `float`
 * keyframe, paused on hover. */
export function ProjectPillsCard({ project, layout }: { project: Project; layout: BentoLayout }) {
  return (
    <div
      data-bento-pills
      className="absolute flex flex-wrap gap-2"
      style={{ ...cornerStyle(layout.pills), width: "min(13rem, 48%)", zIndex: 15 }}
    >
      {project.tags.slice(0, 2).map((tag, i) => (
        <span
          key={tag}
          style={{ animationDelay: `${i * 0.6}s` }}
          className="rounded-full border border-cinema-gold/30 bg-cinema-elevated/80 px-3.5 py-1.5 font-mono text-[13px] uppercase tracking-[0.1em] text-cinema-gold shadow-glow backdrop-blur-sm transition-transform duration-300 hover:scale-105 motion-safe:animate-float hover:[animation-play-state:paused]"
        >
          {tag}
        </span>
      ))}
    </div>
  );
}
