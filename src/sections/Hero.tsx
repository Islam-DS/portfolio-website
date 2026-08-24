"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import gsap from "gsap";
import { RevealText } from "@/components/effects/RevealText";
import { CountUpNumber } from "@/components/effects/CountUpNumber";
import { ParticlePortrait } from "@/components/effects/ParticlePortrait";
import { Magnetic } from "@/components/ui/Magnetic";
import { fadeInUp, viewportOnce } from "@/lib/motion";

export function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const leftMetaRef = useRef<HTMLDivElement>(null);
  const rightMetaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const leftMeta = leftMetaRef.current;
    const rightMeta = rightMetaRef.current;
    if (!leftMeta || !rightMeta) return;

    if (reducedMotion) {
      gsap.set([leftMeta, rightMeta], { opacity: 1, y: 0 });
      return;
    }

    // The flanking words settle in after the particle cloud has begun to
    // assemble, so the portrait reads as the thing that arrives first.
    gsap.set([leftMeta, rightMeta], { opacity: 0, y: 18 });
    const tl = gsap.timeline({ delay: 1.5 });
    tl.to([leftMeta, rightMeta], {
      opacity: 1,
      y: 0,
      duration: 0.9,
      ease: "power3.out",
      stagger: 0.14,
    });

    return () => {
      tl.kill();
    };
  }, []);

  return (
    <section
      id="top"
      ref={sectionRef}
      className="relative overflow-hidden pt-40 pb-20 lg:pt-48"
    >
      <div className="cinema-container relative z-10 text-center">
        <RevealText
          as="p"
          text="International Government Scholar — AI Research"
          className="section-label block justify-center"
          splitBy="word"
          trigger="manual"
          delay={0.3}
        />

        <div className="mt-8">
          <RevealText
            as="h1"
            text="Mahbubul Islam"
            splitBy="char"
            trigger="manual"
            delay={0.55}
            className="block font-display text-display-md font-bold tracking-tight text-cinema-text md:text-display-lg"
          />
        </div>
      </div>

      <div className="cinema-container relative z-10 mt-10 lg:mt-14">
        <div className="grid gap-10 lg:grid-cols-12 lg:items-center lg:gap-4">
          <div ref={leftMetaRef} className="order-2 lg:order-1 lg:col-span-3">
            <p className="font-display text-[40.5px] font-bold leading-none tracking-tight text-cinema-text md:text-[48.6px] lg:text-[56px]">
              researcher
            </p>
            <p className="mt-5 max-w-xs text-body-lg leading-relaxed text-cinema-muted">
              AI researcher specialising in medical imaging, oncology, and
              privacy-preserving federated learning.
            </p>
          </div>

          <div className="order-1 lg:order-2 lg:col-span-6">
            <ParticlePortrait
              className="relative mx-auto aspect-[5/4] w-full max-w-2xl overflow-visible lg:max-w-none"
              fallbackSrc="/images/hero-artwork.png"
              fallbackAlt="Mahbubul Islam — AI Researcher"
            />
          </div>

          <div ref={rightMetaRef} className="order-3 lg:col-span-3 lg:text-right">
            <p className="font-mono text-[40.5px] font-bold leading-none tracking-tight text-cinema-text md:text-[48.6px] lg:text-[52px]">
              &lt;engineer&gt;
            </p>
            <p className="mt-5 max-w-xs text-body-lg leading-relaxed text-cinema-muted lg:ml-auto">
              Machine learning engineer who ships reproducible,
              production-grade pipelines.
            </p>
          </div>
        </div>
      </div>

      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={viewportOnce}
        variants={fadeInUp}
        className="cinema-container relative z-10 mt-16 lg:mt-20"
      >
        <div className="flex flex-col items-center gap-10 border-t border-white/10 pt-10 sm:flex-row sm:justify-center sm:gap-16">
          <div className="flex items-center gap-8">
            <Magnetic>
              <a
                href="#projects"
                data-cursor
                className="group inline-flex items-center gap-2 text-[24.3px] font-medium text-cinema-text transition-colors hover:text-cinema-blue"
              >
                Explore the research
                <span className="inline-block transition-transform duration-300 group-hover:translate-x-1">→</span>
              </a>
            </Magnetic>
            <a
              href="#contact"
              data-cursor
              className="text-[24.3px] font-medium text-cinema-muted transition-colors hover:text-cinema-text"
            >
              Get in touch
            </a>
          </div>

          <div className="flex items-center gap-10">
            <div>
              <CountUpNumber value={3} suffix="+" className="font-display text-[40.5px] font-bold text-cinema-text" />
              <p className="mt-1 text-[21.6px] text-cinema-muted">Research domains</p>
            </div>
            <div>
              <CountUpNumber value={2} className="font-display text-[40.5px] font-bold text-cinema-text" />
              <p className="mt-1 text-[21.6px] text-cinema-muted">Countries · one path</p>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="cinema-container relative z-10">
        <div className="flex items-center justify-center gap-3 border-t border-white/10 py-8 text-[21.6px] text-cinema-muted">
          <span className="h-1.5 w-1.5 rounded-full bg-cinema-blue" />
          Currently — Research Assistant, Artificial Intelligence &amp; Robotics Laboratory
        </div>
      </div>
    </section>
  );
}
