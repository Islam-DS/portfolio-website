"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { ArrowUpRight, ExternalLink, GitBranch, Star } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Project } from "@/data/projects";
import { PhotoPlaceholder } from "@/components/ui/PhotoPlaceholder";
import { TerminalPreview } from "@/components/ui/TerminalPreview";

interface ProjectCardProps {
  project: Project;
  index: number;
}

export function ProjectCard({ project, index }: ProjectCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const imageWrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const card = cardRef.current;
    const imageWrap = imageWrapRef.current;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    gsap.set(card, reducedMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 28 });
    if (imageWrap) {
      gsap.set(imageWrap, reducedMotion ? { clipPath: "inset(0 0% 0 0)" } : { clipPath: "inset(0 0 100% 0)" });
    }
    if (reducedMotion || !card) return;

    const st = ScrollTrigger.create({
      trigger: card,
      start: "top 88%",
      once: true,
      onEnter: () => {
        gsap.to(card, { opacity: 1, y: 0, duration: 0.8, ease: "power3.out", delay: (index % 2) * 0.1 });
        if (imageWrap) {
          gsap.to(imageWrap, {
            clipPath: "inset(0 0 0% 0)",
            duration: 1,
            ease: "power4.inOut",
            delay: (index % 2) * 0.1 + 0.1,
          });
        }
      },
    });

    return () => st.kill();
  }, [index]);

  return (
    <div
      ref={cardRef}
      className="group flex flex-col overflow-hidden rounded-[1.75rem] border border-white/10 bg-cinema-elevated"
    >
      {project.image ? (
        <div ref={imageWrapRef} className="relative aspect-[16/10] w-full overflow-hidden bg-cinema-deep/40">
          <Image
            src={project.image}
            alt={project.imageAlt ?? project.title}
            fill
            className="object-contain p-4"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        </div>
      ) : project.codeDemo ? (
        <TerminalPreview command={project.codeDemo.command} output={project.codeDemo.output} bare />
      ) : (
        <PhotoPlaceholder label={`Add screenshot — ${project.title}`} aspect="aspect-[16/10]" bare />
      )}

      <div className="flex flex-1 flex-col p-7 md:p-8">
        <div className="flex items-center gap-4 text-[18.9px] text-cinema-muted">
          <span className="flex items-center gap-1.5">
            <GitBranch className="h-3.5 w-3.5" />
            {project.language}
          </span>
          {project.stars != null && (
            <span className="flex items-center gap-1.5">
              <Star className="h-3.5 w-3.5" />
              {project.stars}
            </span>
          )}
        </div>

        <h3 className="mt-3 font-display text-[32.4px] font-semibold text-cinema-text transition-colors group-hover:text-cinema-blue">
          {project.title}
        </h3>
        <p className="mt-3 text-[24.3px] leading-relaxed text-cinema-muted">{project.description}</p>

        <p className="mt-4 text-[18.9px] text-cinema-muted/70">{project.tags.join(" · ")}</p>

        <div className="mt-6 flex flex-wrap items-center gap-6 border-t border-white/10 pt-5">
          <a
            href={project.github}
            target="_blank"
            rel="noopener noreferrer"
            data-cursor
            data-cursor-label="View Repo"
            className="inline-flex items-center gap-1.5 text-[18.9px] font-medium text-cinema-text transition-colors hover:text-cinema-blue"
          >
            View repository
            <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </a>
          {project.demo && (
            <a
              href={project.demo}
              target="_blank"
              rel="noopener noreferrer"
              data-cursor
              data-cursor-label="Live Demo"
              className="inline-flex items-center gap-1.5 text-[18.9px] font-medium text-cinema-gold transition-colors hover:text-cinema-text"
            >
              Live demo <ExternalLink className="h-3.5 w-3.5" />
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
