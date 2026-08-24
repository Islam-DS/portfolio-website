"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { ArrowUpRight, ExternalLink, Github } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Project } from "@/data/projects";
import { PhotoPlaceholder } from "@/components/ui/PhotoPlaceholder";
import { RevealText } from "@/components/effects/RevealText";

interface FeaturedProjectProps {
  project: Project;
}

export function FeaturedProject({ project }: FeaturedProjectProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const imageWrapRef = useRef<HTMLDivElement>(null);
  const imageInnerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const card = cardRef.current;
    const imageWrap = imageWrapRef.current;
    const imageInner = imageInnerRef.current;
    if (!card || !imageWrap || !imageInner) return;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reducedMotion) {
      gsap.set(imageWrap, { clipPath: "inset(0% 0% 0% 0%)" });
      return;
    }

    gsap.set(imageWrap, { clipPath: "inset(0% 0% 100% 0%)" });
    gsap.set(imageInner, { scale: 1.15 });

    const st = ScrollTrigger.create({
      trigger: card,
      start: "top 75%",
      once: true,
      onEnter: () => {
        gsap.to(imageWrap, { clipPath: "inset(0% 0% 0% 0%)", duration: 1.2, ease: "power4.inOut" });
        gsap.to(imageInner, { scale: 1, duration: 1.6, ease: "power3.out" });
      },
    });

    return () => st.kill();
  }, []);

  return (
    <div ref={cardRef} className="relative overflow-hidden rounded-[2rem] bg-cinema-ink">
      <div className="grid gap-0 lg:grid-cols-[1.3fr_1fr] lg:items-stretch">
        <div className="order-2 min-w-0 p-7 sm:p-10 md:p-14 lg:order-1 lg:p-16">
          <span className="font-mono text-[17.55px] font-medium uppercase tracking-[0.2em] text-white/40">
            Flagship Research
          </span>
          <RevealText
            as="h3"
            text={project.title}
            splitBy="word"
            className="mt-6 block font-display text-[34px] font-bold leading-[1.05] tracking-tight text-white sm:text-[46px] md:text-[64.8px] lg:text-[72px] xl:text-[81px]"
          />
          <p className="mt-6 max-w-lg text-body-lg leading-relaxed text-white/55">
            {project.description}
          </p>

          <p className="mt-8 text-[21.6px] text-white/35">
            {project.tags.join(" · ")}
            {project.stars != null ? ` · ${project.stars} stars` : ""}
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-8">
            <a
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              data-cursor
              data-cursor-label="View Repo"
              className="group inline-flex items-center gap-2 text-[24.3px] font-medium text-white transition-colors hover:text-cinema-warm"
            >
              <Github className="h-4 w-4" />
              View repository
              <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>
            {project.demo && (
              <a
                href={project.demo}
                target="_blank"
                rel="noopener noreferrer"
                data-cursor
                data-cursor-label="Live Demo"
                className="inline-flex items-center gap-2 text-[24.3px] font-medium text-cinema-warm transition-colors hover:text-white"
              >
                Live demo <ExternalLink className="h-4 w-4" />
              </a>
            )}
          </div>
        </div>

        <div className="order-1 lg:order-2">
          {project.image ? (
            <div
              ref={imageWrapRef}
              className="group relative aspect-[4/3] w-full overflow-hidden bg-cinema-surface lg:aspect-auto lg:h-full lg:min-h-[420px]"
            >
              <div ref={imageInnerRef} className="absolute inset-0">
                <Image
                  src={project.image}
                  alt={project.imageAlt ?? project.title}
                  fill
                  className="object-contain p-6 transition-transform duration-700 ease-out group-hover:scale-110 lg:p-10"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              </div>
            </div>
          ) : (
            <PhotoPlaceholder
              label={`Add screenshot or figure — ${project.title}`}
              aspect="aspect-[4/3] lg:aspect-auto lg:h-full"
              className="lg:min-h-[420px]"
            />
          )}
        </div>
      </div>
    </div>
  );
}
