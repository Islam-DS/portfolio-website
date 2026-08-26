"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { RevealText } from "@/components/effects/RevealText";
import { CountUpNumber } from "@/components/effects/CountUpNumber";
import { DataEmbedding } from "@/components/effects/DataEmbedding";
import { Magnetic } from "@/components/ui/Magnetic";
import { fadeInUp, viewportOnce } from "@/lib/motion";

export function Hero() {
  const [artworkFailed, setArtworkFailed] = useState(false);
  const [photoFailed, setPhotoFailed] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const imageWrapRef = useRef<HTMLDivElement>(null);
  const zoomGroupRef = useRef<HTMLDivElement>(null);
  const bgLayerRef = useRef<HTMLDivElement>(null);
  const midLayerRef = useRef<HTMLDivElement>(null);
  const fgLayerRef = useRef<HTMLDivElement>(null);
  const leftMetaRef = useRef<HTMLDivElement>(null);
  const rightMetaRef = useRef<HTMLDivElement>(null);

  const activeSrc = !artworkFailed ? "/images/hero-artwork.png" : !photoFailed ? "/images/mahbubul.png" : null;

  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const imageWrap = imageWrapRef.current;
    const zoomGroup = zoomGroupRef.current;
    const leftMeta = leftMetaRef.current;
    const rightMeta = rightMetaRef.current;
    if (!imageWrap || !zoomGroup || !leftMeta || !rightMeta) return;

    if (reducedMotion) {
      gsap.set([imageWrap, leftMeta, rightMeta], { clipPath: "inset(0% 0% 0% 0%)", opacity: 1, y: 0 });
      return;
    }

    gsap.set(imageWrap, { clipPath: "inset(0% 0% 0% 100%)" });
    gsap.set(zoomGroup, { scale: 1.25 });
    gsap.set([leftMeta, rightMeta], { opacity: 0, y: 16 });

    const tl = gsap.timeline({ delay: 0.9, defaults: { ease: "power4.out" } });
    tl.to(imageWrap, { clipPath: "inset(0% 0% 0% 0%)", duration: 1.4 })
      .to(zoomGroup, { scale: 1, duration: 1.8, ease: "power3.out" }, "<")
      .to([leftMeta, rightMeta], { opacity: 1, y: 0, duration: 0.8, stagger: 0.15 }, "-=0.6");

    // Scroll-linked depth: the image drifts at a different rate while the
    // hero is in view — the only motion tied to scroll position itself.
    const st = ScrollTrigger.create({
      trigger: sectionRef.current,
      start: "top top",
      end: "bottom top",
      scrub: 0.6,
      onUpdate: (self) => {
        gsap.set(imageWrap, { yPercent: self.progress * 12 });
      },
    });

    return () => {
      tl.kill();
      st.kill();
    };
  }, []);

  // Depth-layered parallax: the card tilts as a whole while the background
  // echo, main image, and clipped subject strip drift at three different
  // rates — the mismatch is what reads as real depth rather than a flat tilt.
  useEffect(() => {
    const el = imageWrapRef.current;
    const bg = bgLayerRef.current;
    const mid = midLayerRef.current;
    const fg = fgLayerRef.current;
    if (!el || !bg || !mid || !fg) return;
    if (window.matchMedia("(pointer: coarse), (prefers-reduced-motion: reduce)").matches) return;

    gsap.set(el, { transformPerspective: 1000 });
    const setRotateX = gsap.quickTo(el, "rotationX", { duration: 0.6, ease: "power3.out" });
    const setRotateY = gsap.quickTo(el, "rotationY", { duration: 0.6, ease: "power3.out" });
    const setBgX = gsap.quickTo(bg, "x", { duration: 0.8, ease: "power3.out" });
    const setBgY = gsap.quickTo(bg, "y", { duration: 0.8, ease: "power3.out" });
    const setFgX = gsap.quickTo(fg, "x", { duration: 0.35, ease: "power3.out" });
    const setFgY = gsap.quickTo(fg, "y", { duration: 0.35, ease: "power3.out" });

    const handleMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const relX = (e.clientX - rect.left) / rect.width - 0.5;
      const relY = (e.clientY - rect.top) / rect.height - 0.5;
      setRotateY(relX * 6);
      setRotateX(relY * -6);
      setBgX(relX * -16);
      setBgY(relY * -16);
      setFgX(relX * 24);
      setFgY(relY * 24);
    };
    const handleLeave = () => {
      setRotateX(0);
      setRotateY(0);
      setBgX(0);
      setBgY(0);
      setFgX(0);
      setFgY(0);
    };

    el.addEventListener("mousemove", handleMove);
    el.addEventListener("mouseleave", handleLeave);
    return () => {
      el.removeEventListener("mousemove", handleMove);
      el.removeEventListener("mouseleave", handleLeave);
    };
  }, []);

  return (
    <section id="top" ref={sectionRef} className="relative overflow-hidden pt-40 pb-20 lg:pt-48">
      {/* Sits behind the portrait (z-0 vs z-10) so it reads as depth. The caption
          matters: an abstract form is decoration, a labelled embedding is a claim. */}
      <DataEmbedding className="pointer-events-none absolute left-[33%] top-[19%] z-0 hidden h-[65%] w-[28%] lg:block" />
      <p className="pointer-events-none absolute left-[10%] top-[70%] z-0 hidden w-[25%] font-mono text-[13px] leading-relaxed tracking-[0.06em] text-cinema-muted/65 lg:block">
        PAM50 subtype embedding — five clusters
        <br />
        resolving from high-dimensional expression data
      </p>

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

      <div className="cinema-container relative z-10 mt-16 lg:mt-20">
        <div className="grid gap-10 lg:grid-cols-12 lg:items-center lg:gap-6">
          <div ref={leftMetaRef} className="order-2 lg:order-1 lg:col-span-4">
            <p className="font-display text-[40.5px] font-bold leading-none tracking-tight text-cinema-text md:text-[48.6px] lg:text-[64.8px]">
              researcher
            </p>
            <p className="mt-5 max-w-xs text-body-lg leading-relaxed text-cinema-muted">
              AI researcher specialising in medical imaging, oncology, and
              privacy-preserving federated learning.
            </p>
          </div>

          <div className="order-1 lg:order-2 lg:col-span-4">
            <div
              ref={imageWrapRef}
              className="relative mx-auto aspect-[16/13] w-full max-w-xl overflow-hidden lg:max-w-none"
              style={{ transformStyle: "preserve-3d" }}
            >
              {activeSrc ? (
                <div ref={zoomGroupRef} className="absolute inset-0">
                  <div ref={bgLayerRef} className="absolute -inset-6">
                    <Image
                      src={activeSrc}
                      alt=""
                      fill
                      aria-hidden
                      className="scale-110 object-cover object-top opacity-60 blur-[3px] saturate-[0.7]"
                      sizes="(max-width: 1024px) 100vw, 50vw"
                    />
                  </div>

                  <div ref={midLayerRef} className="absolute inset-0">
                    <Image
                      src={activeSrc}
                      alt="Mahbubul Islam — AI Researcher"
                      fill
                      priority
                      className="object-cover object-top"
                      sizes="(max-width: 1024px) 100vw, 50vw"
                      onError={() => (artworkFailed ? setPhotoFailed(true) : setArtworkFailed(true))}
                    />
                  </div>

                  <div
                    ref={fgLayerRef}
                    className="pointer-events-none absolute inset-0 [clip-path:inset(0_22%_0_28%)] drop-shadow-[0_20px_44px_rgba(16,15,11,0.28)]"
                  >
                    <Image
                      src={activeSrc}
                      alt=""
                      fill
                      aria-hidden
                      className="object-cover object-top"
                      sizes="(max-width: 1024px) 100vw, 50vw"
                    />
                  </div>
                </div>
              ) : (
                <div className="flex h-full min-h-[420px] items-center justify-center bg-cinema-deep">
                  <span className="font-display text-[97.2px] font-bold text-black/10">MI</span>
                </div>
              )}
            </div>
          </div>

          <div ref={rightMetaRef} className="order-3 lg:col-span-4 lg:text-right">
            <p className="font-mono text-[40.5px] font-bold leading-none tracking-tight text-cinema-text md:text-[48.6px] lg:text-[64.8px]">
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
        <div className="flex flex-col items-center gap-10 border-t border-black/10 pt-10 sm:flex-row sm:justify-center sm:gap-16">
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
        <div className="flex items-center justify-center gap-3 border-t border-black/10 py-8 text-[21.6px] text-cinema-muted">
          <span className="h-1.5 w-1.5 rounded-full bg-cinema-blue" />
          Currently — Research Assistant, Artificial Intelligence &amp; Robotics Laboratory
        </div>
      </div>
    </section>
  );
}
