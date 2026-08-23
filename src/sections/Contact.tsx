"use client";

import { useState, type ComponentType } from "react";
import { motion } from "framer-motion";
import { Check, Copy, Github, Linkedin, GraduationCap } from "lucide-react";
import { siteConfig } from "@/data/site";
import { SectionWrapper } from "@/components/effects/SectionWrapper";
import { RevealText } from "@/components/effects/RevealText";
import { Magnetic } from "@/components/ui/Magnetic";
import { fadeInUp, viewportOnce } from "@/lib/motion";

export function Contact() {
  const [copied, setCopied] = useState(false);

  async function handleCopyEmail() {
    await navigator.clipboard.writeText(siteConfig.email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <SectionWrapper id="contact" className="bg-cinema-ink">
      <div className="cinema-container">
        <motion.p
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          variants={fadeInUp}
          className="section-label !text-white/40"
        >
          06 — Contact
        </motion.p>

        <RevealText
          as="h2"
          text="Let's build the future together."
          splitBy="char"
          className="mt-8 block max-w-3xl font-display text-display-lg font-bold leading-[1.05] tracking-tight text-white"
        />

        <motion.p
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          variants={fadeInUp}
          className="mt-8 max-w-xl text-body-xl leading-relaxed text-white/50"
        >
          Open to research collaborations, speaking engagements, and transformative
          AI projects.
        </motion.p>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          variants={fadeInUp}
          className="mt-14 flex flex-wrap items-center gap-x-10 gap-y-6 border-t border-white/10 pt-10"
        >
          <Magnetic strength={0.25}>
            <button
              type="button"
              onClick={handleCopyEmail}
              data-cursor
              className="group inline-flex items-center gap-3 text-[32.4px] font-medium text-white transition-colors hover:text-cinema-warm md:text-[40.5px]"
            >
              {siteConfig.email}
              {copied ? (
                <Check className="h-5 w-5 text-cinema-warm" />
              ) : (
                <Copy className="h-5 w-5 opacity-0 transition-opacity group-hover:opacity-60" />
              )}
            </button>
          </Magnetic>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          variants={fadeInUp}
          className="mt-8 flex flex-wrap items-center gap-8 text-white/50"
        >
          <a href={siteConfig.whatsapp} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
            WhatsApp
          </a>
          <span className="text-white/20">·</span>
          <p>{siteConfig.location}</p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          variants={fadeInUp}
          className="mt-16 flex gap-6"
        >
          <SocialLink href={siteConfig.github} icon={Github} label="GitHub" />
          <SocialLink href={siteConfig.linkedin} icon={Linkedin} label="LinkedIn" />
          <SocialLink href={siteConfig.orcid} icon={GraduationCap} label="ORCID" />
        </motion.div>
      </div>
    </SectionWrapper>
  );
}

function SocialLink({
  href,
  icon: Icon,
  label,
}: {
  href: string;
  icon: ComponentType<{ className?: string }>;
  label: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="text-white/40 transition-colors hover:text-white"
    >
      <Icon className="h-5 w-5" />
    </a>
  );
}
