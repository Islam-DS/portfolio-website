"use client";

import { useState, type ComponentType } from "react";
import { motion } from "framer-motion";
import { ArrowUpRight, BookOpen, Check, Copy, Download, Github, GraduationCap, Linkedin, Mail } from "lucide-react";
import { siteConfig } from "@/data/site";
import { SectionWrapper } from "@/components/effects/SectionWrapper";
import { RevealText } from "@/components/effects/RevealText";
import { fadeInUp, viewportOnce } from "@/lib/motion";

const ACCENT = "#E3B566";

/** Facts a supervisor looks for, all from the CV. */
const DETAILS = [
  { label: "Looking for", value: "MSc research positions" },
  { label: "Graduating", value: "June 2027" },
  { label: "Based in", value: "Almaty, Kazakhstan (UTC+5)" },
  { label: "Research focus", value: "Medical AI · Computational oncology" },
  { label: "Languages", value: "Bengali (native) · English (C1–C2)" },
];

/**
 * Contact for an academic audience: a plain statement of what I'm looking
 * for, email as the primary channel (send or copy), labelled profile links,
 * and an at-a-glance card with the facts a prospective supervisor checks.
 */
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
          text="Interested in working together?"
          splitBy="word"
          emphasisFrom={3}
          emphasisClassName="pr-[0.08em] font-serif font-normal italic tracking-normal text-[#E3B566]"
          className="mt-6 block max-w-4xl font-display text-display-md font-bold leading-[1.05] tracking-tight text-white"
        />

        <motion.p
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          variants={fadeInUp}
          className="mt-6 max-w-3xl text-body-lg text-white/75"
        >
          I&apos;m graduating in June 2027 and looking for MSc research opportunities in medical AI and
          computational oncology — multimodal learning, DNA methylation, and clinical models that hold up under
          honest evaluation. Email is the best way to reach me.
        </motion.p>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          variants={fadeInUp}
          className="mt-12 grid grid-cols-1 gap-6 lg:grid-cols-12"
        >
          {/* Primary: email + links */}
          <div className="rounded-[28px] border border-white/15 bg-white/[0.04] p-7 md:p-10 lg:col-span-7">
            <p className="font-mono text-[15.5px] uppercase tracking-[0.12em] text-white/60">Email</p>
            <p className="mt-3 break-all font-display text-[26px] font-semibold text-white md:text-[34px]">
              {siteConfig.email}
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <a
                href={`mailto:${siteConfig.email}`}
                data-cursor
                className="inline-flex items-center gap-2.5 rounded-full px-6 py-3 text-[19px] font-semibold text-cinema-ink transition-opacity hover:opacity-90"
                style={{ background: ACCENT }}
              >
                <Mail className="h-5 w-5" />
                Send an email
              </a>
              <button
                type="button"
                onClick={handleCopyEmail}
                data-cursor
                className="inline-flex items-center gap-2.5 rounded-full border border-white/25 px-6 py-3 text-[19px] font-medium text-white transition-colors hover:border-white/60"
              >
                {copied ? <Check className="h-5 w-5" style={{ color: ACCENT }} /> : <Copy className="h-5 w-5" />}
                {copied ? "Copied" : "Copy address"}
              </button>
              {siteConfig.cv && (
                <a
                  href={siteConfig.cv}
                  download
                  data-cursor
                  className="inline-flex items-center gap-2.5 rounded-full border border-white/25 px-6 py-3 text-[19px] font-medium text-white transition-colors hover:border-white/60"
                >
                  <Download className="h-5 w-5" />
                  Download CV
                </a>
              )}
            </div>

            <div className="mt-8 border-t border-white/10 pt-7">
              <p className="font-mono text-[15.5px] uppercase tracking-[0.12em] text-white/60">Profiles</p>
              <div className="mt-4 flex flex-wrap gap-3">
                <ProfileLink href={siteConfig.scholar} icon={BookOpen} label="Google Scholar" />
                <ProfileLink href={siteConfig.orcid} icon={GraduationCap} label="ORCID" />
                <ProfileLink href={siteConfig.github} icon={Github} label="GitHub" />
                <ProfileLink href={siteConfig.linkedin} icon={Linkedin} label="LinkedIn" />
              </div>
            </div>
          </div>

          {/* At a glance */}
          <div className="rounded-[28px] border border-white/15 bg-white/[0.04] p-7 md:p-10 lg:col-span-5">
            <p className="font-mono text-[15.5px] uppercase tracking-[0.12em] text-white/60">At a glance</p>
            <dl className="mt-5 divide-y divide-white/10">
              {DETAILS.map((d) => (
                <div key={d.label} className="flex flex-col gap-1 py-4 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6">
                  <dt className="shrink-0 text-[17px] text-white/60">{d.label}</dt>
                  <dd className="text-[19px] font-medium text-white sm:text-right">{d.value}</dd>
                </div>
              ))}
            </dl>
            <p className="mt-5 font-mono text-[15px] uppercase tracking-[0.1em] text-white/55">
              References available upon request
            </p>
          </div>
        </motion.div>
      </div>
    </SectionWrapper>
  );
}

function ProfileLink({
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
      className="group inline-flex items-center gap-2.5 rounded-full border border-white/20 px-5 py-2.5 text-[18px] font-medium text-white/85 transition-colors duration-300 hover:border-[#E3B566] hover:text-[#E3B566]"
    >
      <Icon className="h-5 w-5" />
      {label}
      <ArrowUpRight className="h-4 w-4 opacity-50 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
    </a>
  );
}
