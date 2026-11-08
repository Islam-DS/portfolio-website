"use client";

import { useState, type ComponentType } from "react";
import { motion } from "framer-motion";
import { ArrowUpRight, BookOpen, Check, Copy, Github, GraduationCap, Linkedin } from "lucide-react";
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
      <div className="cinema-container-full">
        <motion.p
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          variants={fadeInUp}
          className="section-label !text-white/70"
        >
          06 — Contact
        </motion.p>

        <RevealText
          as="h2"
          text="Let's build the future together."
          splitBy="word"
          emphasisFrom={4}
          emphasisClassName="pr-[0.08em] font-serif font-normal italic tracking-normal text-[#E3B566]"
          className="mt-8 block max-w-3xl font-display text-display-lg font-bold leading-[1.05] tracking-tight text-white"
        />

        <motion.p
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          variants={fadeInUp}
          className="mt-8 max-w-xl text-body-xl text-white/75"
        >
          Graduating in June 2027 and looking for MSc research opportunities in
          medical AI and computational oncology — multimodal learning, DNA
          methylation, and clinical models that hold up under honest evaluation.
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
              className="group inline-flex max-w-full items-center gap-3 break-all text-left text-[22px] font-medium text-white transition-colors hover:text-cinema-warm sm:text-[28px] md:text-[40.5px]"
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
          className="mt-8 flex flex-wrap items-center gap-8 text-white/75"
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
          className="mt-14 flex flex-wrap gap-3"
        >
          <SocialLink href={siteConfig.scholar} icon={BookOpen} label="Google Scholar" />
          <SocialLink href={siteConfig.orcid} icon={GraduationCap} label="ORCID" />
          <SocialLink href={siteConfig.github} icon={Github} label="GitHub" />
          <SocialLink href={siteConfig.linkedin} icon={Linkedin} label="LinkedIn" />
        </motion.div>

        <motion.p
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          variants={fadeInUp}
          className="mt-10 font-mono text-[16.5px] uppercase tracking-[0.1em] text-white/60"
        >
          References available upon request
        </motion.p>
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
      data-cursor
      className="group inline-flex items-center gap-2.5 rounded-full border border-white/20 px-5 py-2.5 text-[18.5px] font-medium text-white/85 transition-colors duration-300 hover:border-cinema-warm hover:text-cinema-warm"
    >
      <Icon className="h-5 w-5" />
      {label}
      <ArrowUpRight className="h-4 w-4 opacity-50 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
    </a>
  );
}
