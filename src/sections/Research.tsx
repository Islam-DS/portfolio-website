"use client";

import { motion } from "framer-motion";
import { Activity, Dna, MessageSquareText, ShieldCheck } from "lucide-react";
import { fadeInUp, staggerContainer, viewportOnce } from "@/lib/motion";

/** Each area cites work that is on this site or in the CV — nothing aspirational. */
const AREAS = [
  {
    icon: ShieldCheck,
    title: "Trustworthy evaluation",
    evidence:
      "Subgroup bias audits, label-construction circularity, and pre-registered studies reported even when the result is null.",
  },
  {
    icon: MessageSquareText,
    title: "LLMs & retrieval-augmented generation",
    evidence:
      "RetractionBench: medical RAG answers cited the retracted source in 79% of responses even with the retraction notice in context.",
  },
  {
    icon: Activity,
    title: "Multimodal & signal data",
    evidence:
      "Ultrasound + clinical fusion for pediatric appendicitis (AUC 0.896), EEG-based cognitive state sensing, and federated learning across heterogeneous data (IEEE AIEEE 2026).",
  },
  {
    icon: Dna,
    title: "Health & genomic data",
    evidence:
      "DNA-methylation age prediction, EVOFLUx-based cancer evolution (TCGA-KIRC → CPTAC-CCRCC), and a bibliometric review of 960 cell-type deconvolution studies.",
  },
];

/** Ongoing research. Unfinished work: describe the question and approach,
 * not results that may still change. */
const ONGOING = [
  {
    title: "When does combining RNA and DNA methylation improve cell-type deconvolution?",
    since: "In progress",
    detail:
      "Every tumour sample is a mix of cancer, immune and stromal cells, and that mix shapes prognosis. It can be read from a sample's gene expression or from its DNA methylation, and more and more studies now measure both. So it seems obvious that two views should beat one. But should they? Two omics can disagree, and they can also be wrong in the same way. I am building GateDecon, a model that decides for each sample and each cell type how much to trust each omic, to find out when combining them truly helps and when it cannot.",
  },
  {
    title: "EVOFLUx-based epigenetic cancer evolution & prognostic biomarker development",
    since: "Undergraduate thesis",
    detail:
      "TCGA-KIRC → CPTAC-CCRCC: a Bayesian methylation-based framework inferring 10 patient-level cancer evolutionary parameters from 450K DNA methylation, followed by an EVOFLUx-derived prognostic biomarker and external validation.",
  },
  {
    title: "Cross-country differences in the labour force participation of migrant women",
    since: "In progress",
    detail:
      "Do migrant women work or look for work as often as migrant men, and as often as women born in the same country? I am comparing these gaps across countries using ILOSTAT labour data and the UN DESA International Migrant Stock.",
  },
];

const FACTS = ["BSc Data Science · Al-Farabi KazNU", "GPA 3.82 / 4.00", "IELTS 7.0", "Graduating June 2027", "Seeking MSc research positions"];

/**
 * A short research statement for academic readers, placed straight after
 * the hero: what the work is about, with evidence for each area, and the
 * key facts a supervisor checks first.
 */
export function Research() {
  return (
    <section id="research" className="relative scroll-mt-24 py-24 md:py-28">
      <div className="cinema-container-full">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16">
          <motion.div
            className="lg:col-span-5"
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
            variants={fadeInUp}
          >
            <p className="section-label">Research interests</p>
            <h2 className="mt-6 font-display text-[44px] font-bold leading-[1.04] tracking-tight text-cinema-text md:text-[60px]">
              Does the result{" "}
              <em className="pr-[0.08em] font-serif font-normal italic tracking-normal text-cinema-gold">hold up?</em>
            </h2>
            <p className="mt-6 text-body-lg text-cinema-muted">
              I build machine-learning models on real-world data — clinical, genomic, EEG signals, text, and labour
              statistics — and I care
              as much about whether a finding survives honest evaluation as about the finding itself.
            </p>
          </motion.div>

          <motion.ul
            className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:col-span-7"
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
            variants={staggerContainer}
          >
            {AREAS.map(({ icon: Icon, title, evidence }) => (
              <motion.li
                key={title}
                variants={fadeInUp}
                className="rounded-[24px] border border-black/10 bg-cinema-elevated p-6 shadow-cinema md:p-7"
              >
                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-cinema-gold/10 text-cinema-gold">
                  <Icon className="h-6 w-6" strokeWidth={1.8} />
                </span>
                <h3 className="mt-5 font-display text-[23px] font-bold leading-tight tracking-tight text-cinema-text">
                  {title}
                </h3>
                <p className="mt-2.5 text-[18.5px] leading-snug text-cinema-muted">{evidence}</p>
              </motion.li>
            ))}
          </motion.ul>
        </div>

        <motion.div
          className="mt-16"
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          variants={fadeInUp}
        >
          <p className="section-label flex items-center gap-3">
            <span className="relative flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full rounded-full bg-cinema-blue opacity-60 motion-safe:animate-ping" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-cinema-blue" />
            </span>
            Currently working on
          </p>
          <ul className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-3">
            {ONGOING.map((o) => (
              <li key={o.title} className="rounded-[24px] border border-cinema-blue/25 bg-white/70 p-6 md:p-7">
                <p className="font-mono text-[15.5px] uppercase tracking-[0.06em] text-cinema-blue">{o.since}</p>
                <h3 className="mt-2 font-display text-[22px] font-bold leading-tight tracking-tight text-cinema-text md:text-[24px]">
                  {o.title}
                </h3>
                <p className="mt-2.5 text-[18.5px] leading-snug text-cinema-muted">{o.detail}</p>
              </li>
            ))}
          </ul>
        </motion.div>

        <motion.ul
          className="mt-14 flex flex-wrap gap-3 border-t border-black/10 pt-8"
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          variants={fadeInUp}
        >
          {FACTS.map((f, i) => (
            <li
              key={f}
              className={`rounded-full px-5 py-2 text-[18.5px] font-medium ${
                i === FACTS.length - 1
                  ? "bg-cinema-ink text-white"
                  : "border border-black/15 bg-white/60 text-cinema-soft"
              }`}
            >
              {f}
            </li>
          ))}
        </motion.ul>
      </div>
    </section>
  );
}
