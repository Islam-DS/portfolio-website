"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { ExternalLink } from "lucide-react";
import { publications } from "@/data/publications";
import { SectionWrapper } from "@/components/effects/SectionWrapper";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { PublicationDoi } from "@/components/publications/PublicationDoi";
import { fadeInUp, staggerContainer, viewportOnce } from "@/lib/motion";
import { attachTiltHover } from "@/lib/useTiltHover";
import gsap from "gsap";

export function Publications() {
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const cards = gsap.utils.toArray<HTMLElement>("[data-pub-card]", listRef.current);
    return attachTiltHover(cards, 4);
  }, []);

  return (
    <SectionWrapper id="publications">
      <div className="cinema-container">
        <SectionHeading index="05" label="Publications" title="Peer-reviewed contributions" />

        <motion.div
          ref={listRef}
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          className="space-y-10"
        >
          {publications.map((pub) => (
            <motion.div
              key={pub.title}
              data-pub-card
              variants={fadeInUp}
              className="relative overflow-hidden rounded-[2rem] border border-black/10 bg-cinema-elevated p-8 md:p-14"
            >
              <span
                aria-hidden
                className="pointer-events-none absolute -top-10 right-4 select-none font-display text-[12.15rem] font-bold leading-none text-cinema-violet/10 md:-top-14 md:right-8 md:text-[17.55rem]"
              >
                {pub.year}
              </span>

              <div className="relative max-w-3xl">
                <p className="section-label">Conference Paper · {pub.year}</p>
                <h3 className="mt-6 font-display text-[40.5px] font-bold leading-tight text-cinema-text md:text-[48.6px]">
                  {pub.title}
                </h3>
                <p className="mt-5 text-[27px] text-cinema-muted">{pub.authors}</p>
                <p className="mt-1 text-[24.3px] italic text-cinema-muted/70">{pub.venue}</p>
                {pub.abstract && (
                  <p className="mt-5 text-body-lg leading-relaxed text-cinema-muted">{pub.abstract}</p>
                )}

                <div className="mt-8 flex flex-wrap items-center gap-5 border-t border-black/10 pt-6">
                  <p className="text-[18.9px] text-cinema-muted/70">{pub.tags.join(" · ")}</p>
                  <PublicationDoi doi={pub.doi} link={pub.link} />
                  <a
                    href={pub.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    data-cursor
                    data-cursor-label="Read Paper"
                    className="inline-flex items-center gap-1.5 text-[18.9px] font-medium text-cinema-violet hover:text-cinema-text"
                  >
                    View on IEEE Xplore <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </SectionWrapper>
  );
}
