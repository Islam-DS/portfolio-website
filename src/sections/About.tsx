"use client";

import { motion } from "framer-motion";
import { SectionWrapper } from "@/components/effects/SectionWrapper";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { RevealText } from "@/components/effects/RevealText";
import { fadeInUp, viewportOnce } from "@/lib/motion";

const QUOTE = "“The most meaningful AI doesn't replace clinicians — it amplifies human judgment.”";

export function About() {
  return (
    <SectionWrapper id="about">
      <div className="cinema-container">
        <SectionHeading
          index="01"
          label="About"
          title="Engineering intelligence for medicine"
        />

        <div className="grid gap-16 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-7">
            <RevealText
              as="p"
              text={QUOTE}
              splitBy="word"
              emphasisFrom={9}
              emphasisClassName="not-italic text-cinema-blue"
              className="font-serif text-[48.6px] italic leading-[1.35] text-cinema-soft md:text-[64.8px] lg:text-[4.3875rem]"
            />
          </div>

          <motion.div
            className="lg:col-span-4 lg:col-start-9"
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
            variants={fadeInUp}
          >
            <p className="text-body-lg leading-relaxed text-cinema-muted">
              I am <span className="font-medium text-cinema-text">Mahbubul Islam</span> — an
              AI researcher and Data Science student building intelligent systems for
              oncology, medical imaging, and computational biology.
            </p>
            <p className="mt-6 text-body-lg leading-relaxed text-cinema-muted">
              At{" "}
              <span className="text-cinema-text">Al-Farabi Kazakh National University</span>,
              as an International Government Scholar, I advance multimodal fusion and
              privacy-preserving federated learning at the Artificial Intelligence &amp;
              Robotics Laboratory.
            </p>

            <div className="mt-10 space-y-4 border-t border-white/10 pt-8">
              <div className="flex items-baseline gap-3">
                <span className="font-display text-[27px] text-cinema-violet">01</span>
                <p className="text-[24.3px] text-cinema-soft">Oncology &amp; Medical AI</p>
              </div>
              <div className="flex items-baseline gap-3">
                <span className="font-display text-[27px] text-cinema-gold">02</span>
                <p className="text-[24.3px] text-cinema-soft">Global Scholar — Bangladesh to Kazakhstan</p>
              </div>
              <div className="flex items-baseline gap-3">
                <span className="font-display text-[27px] text-cinema-blue">03</span>
                <p className="text-[24.3px] text-cinema-soft">Reproducible research &amp; computational biology</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </SectionWrapper>
  );
}
