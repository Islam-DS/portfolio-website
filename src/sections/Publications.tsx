"use client";

import { motion } from "framer-motion";
import { ExternalLink } from "lucide-react";
import { publications } from "@/data/publications";
import { SectionWrapper } from "@/components/effects/SectionWrapper";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { PublicationDoi } from "@/components/publications/PublicationDoi";
import { fadeInUp, staggerContainer, viewportOnce } from "@/lib/motion";

export function Publications() {
  return (
    <SectionWrapper id="publications">
      <div className="cinema-container-full">
        <SectionHeading index="04" label="Publications" title="Peer-reviewed contributions" />

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          className="space-y-8"
        >
          {publications.map((pub) => (
            <motion.div
              key={pub.title}
              variants={fadeInUp}
              className="rounded-2xl border border-black/10 bg-cinema-elevated p-8 md:p-12"
            >
              <div className="max-w-3xl">
                <p className="section-label">{pub.type ?? "Conference Paper"} · {pub.year}</p>
                <h3 className="mt-6 font-display text-[38px] font-semibold leading-tight text-cinema-text md:text-[44px]">
                  {pub.title}
                </h3>
                <p className="mt-5 text-[25px] text-cinema-muted">{pub.authors}</p>
                <p className="mt-1 text-[22px] italic text-cinema-muted/70">{pub.venue}</p>
                {pub.abstract && (
                  <p className="mt-5 text-body-lg leading-relaxed text-cinema-muted">{pub.abstract}</p>
                )}

                <div className="mt-8 flex flex-wrap items-center gap-5 border-t border-black/10 pt-6">
                  <p className="text-[17px] text-cinema-muted/60">{pub.tags.join(" · ")}</p>
                  <PublicationDoi doi={pub.doi} link={pub.link} />
                  <a
                    href={pub.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    data-cursor
                    data-cursor-label="Read Paper"
                    className="inline-flex items-center gap-1.5 text-[17px] font-medium text-cinema-text/70 transition-colors hover:text-cinema-text"
                  >
                    View paper <ExternalLink className="h-3.5 w-3.5" />
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
