"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { ExternalLink, MapPin, X } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { journey } from "@/data/journey";
import { SectionWrapper } from "@/components/effects/SectionWrapper";
import { fadeInUp, viewportOnce } from "@/lib/motion";

const TUNNEL_COPIES = 6;
const TUNNEL_LOOP_S = 3.2;

/**
 * "The journey so far" as a kinetic-typography tunnel (modelled on a
 * reference the user supplied): the words JOURNEY / EXPERIENCE stream
 * outward from a vanishing point on a black stage. Once the section comes
 * into view, each experience — oldest first — emerges from the centre of
 * the tunnel, then shrinks and drops into its slot in a brick tower, so the
 * tower builds bottom-up until all of them stand stacked (newest on top).
 * Bricks are buttons; clicking one opens that experience's full details.
 *
 * Desktop + motion only. Mobile and prefers-reduced-motion skip the tunnel
 * and show the finished tower straight away, still clickable.
 */
export function Experience() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const tunnelRef = useRef<HTMLDivElement>(null);
  const flyerRef = useRef<HTMLDivElement>(null);
  const flyerTitleRef = useRef<HTMLParagraphElement>(null);
  const flyerMetaRef = useRef<HTMLParagraphElement>(null);
  const hintRef = useRef<HTMLParagraphElement>(null);
  const towerRef = useRef<HTMLDivElement>(null);
  const [selected, setSelected] = useState<number | null>(null);

  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const isDesktop = window.matchMedia("(min-width: 1024px)").matches;
    if (reducedMotion || !isDesktop) return;

    const section = sectionRef.current;
    const tunnel = tunnelRef.current;
    const flyer = flyerRef.current;
    const tower = towerRef.current;
    if (!section || !tunnel || !flyer || !tower) return;

    const bricks = gsap.utils.toArray<HTMLElement>("[data-brick]", tower);
    const topWords = gsap.utils.toArray<HTMLElement>("[data-tunnel-top]", tunnel);
    const bottomWords = gsap.utils.toArray<HTMLElement>("[data-tunnel-bottom]", tunnel);

    // Endless tunnel: each copy flies from the vanishing point outward,
    // accelerating like real perspective, staggered so the stream is continuous.
    const tunnelTl = gsap.timeline({ paused: true });
    const addStream = (els: HTMLElement[], dir: 1 | -1) => {
      els.forEach((el, i) => {
        tunnelTl.fromTo(
          el,
          { scaleX: 0.06, scaleY: 0.035, y: 0, opacity: 0 },
          {
            scaleX: 2.6,
            scaleY: 1.5,
            y: dir * 300,
            opacity: 1,
            duration: TUNNEL_LOOP_S,
            ease: "power2.in",
            repeat: -1,
          },
          (i * TUNNEL_LOOP_S) / els.length
        );
      });
    };
    addStream(topWords, -1);
    addStream(bottomWords, 1);
    // Start mid-stream so the tunnel is already full on first sight.
    tunnelTl.progress(0.5);

    gsap.set(bricks, { autoAlpha: 0 });
    // Centred via GSAP, not a CSS translate — GSAP would read a CSS
    // translate(-50%) as a pixel offset and then overwrite it with x/y.
    gsap.set(flyer, { xPercent: -50, yPercent: -50, autoAlpha: 0 });
    if (hintRef.current) gsap.set(hintRef.current, { autoAlpha: 0 });

    // Oldest first: journey is newest-first, so walk it backwards.
    const order = journey.map((_, i) => i).reverse();
    const buildTl = gsap.timeline({ paused: true, delay: 0.4 });
    order.forEach((idx) => {
      const item = journey[idx];
      const brick = bricks[idx];
      buildTl
        .call(() => {
          if (flyerTitleRef.current) flyerTitleRef.current.textContent = item.title;
          if (flyerMetaRef.current) flyerMetaRef.current.textContent = item.period;
          gsap.set(flyer, { x: 0, y: 0, scale: 0.12, autoAlpha: 0 });
        })
        .to(flyer, { scale: 1, autoAlpha: 1, duration: 0.75, ease: "power3.out" })
        .to({}, { duration: 0.45 })
        .add(() => {
          // Measured at fly time so it stays correct after resizes.
          const f = flyer.getBoundingClientRect();
          const b = brick.getBoundingClientRect();
          gsap.to(flyer, {
            x: b.left + b.width / 2 - (f.left + f.width / 2),
            y: b.top + b.height / 2 - (f.top + f.height / 2),
            scale: Math.min(1, b.width / f.width),
            autoAlpha: 0,
            duration: 0.7,
            ease: "power2.inOut",
          });
          gsap.fromTo(
            brick,
            { autoAlpha: 0, y: -48 },
            { autoAlpha: 1, y: 0, duration: 0.55, ease: "bounce.out", delay: 0.5 }
          );
        })
        .to({}, { duration: 1.1 });
    });
    if (hintRef.current) buildTl.to(hintRef.current, { autoAlpha: 1, duration: 0.6 });

    const st = ScrollTrigger.create({
      trigger: section,
      start: "top 70%",
      end: "bottom top",
      onToggle: (self) => (self.isActive ? tunnelTl.play() : tunnelTl.pause()),
      onEnter: () => buildTl.play(),
    });

    return () => {
      st.kill();
      tunnelTl.kill();
      buildTl.kill();
    };
  }, []);

  useEffect(() => {
    if (selected === null) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setSelected(null);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [selected]);

  const detail = selected !== null ? journey[selected] : null;

  return (
    <SectionWrapper id="experience" className="overflow-hidden bg-cinema-ink-deep">
      <div className="cinema-container-full">
        <motion.header
          className="mb-16 md:mb-20"
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          variants={fadeInUp}
        >
          <div className="mb-6 flex items-center gap-3">
            <span className="font-mono text-[18.9px] text-white/60">02</span>
            <span className="h-px w-8 bg-white/25" />
            <span className="section-label !text-white/80">Experience</span>
          </div>
          <h2 className="font-display text-display-md font-bold tracking-tight text-white">The journey so far</h2>
          <p className="mt-6 max-w-2xl text-body-lg text-white/75">
            Research, work, scholarship, and leadership — one continuous path, not separate chapters.
          </p>
        </motion.header>
      </div>

      <div ref={sectionRef} className="cinema-container-full grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-14">
        {/* Tunnel stage (desktop) + details panel */}
        <div className="relative order-2 lg:order-1 lg:col-span-7 lg:h-[620px]">
          <div
            ref={tunnelRef}
            aria-hidden
            className="absolute inset-0 hidden overflow-hidden rounded-[28px] bg-black lg:block"
          >
            {Array.from({ length: TUNNEL_COPIES }).map((_, i) => (
              <span
                key={`t${i}`}
                data-tunnel-top
                className="absolute inset-x-0 top-1/2 -mt-[0.5em] select-none text-center font-display text-[110px] font-extrabold uppercase leading-none tracking-tight text-white opacity-0"
              >
                Journey
              </span>
            ))}
            {Array.from({ length: TUNNEL_COPIES }).map((_, i) => (
              <span
                key={`b${i}`}
                data-tunnel-bottom
                className="absolute inset-x-0 top-1/2 -mt-[0.5em] select-none text-center font-display text-[110px] font-extrabold uppercase leading-none tracking-tight text-white opacity-0"
              >
                Experience
              </span>
            ))}
            {/* fade the tunnel's centre so the flyer reads against it */}
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_32%_26%_at_50%_50%,rgba(0,0,0,0.95),transparent)]" />
          </div>

          <div
            ref={flyerRef}
            aria-hidden
            className="pointer-events-none absolute left-1/2 top-1/2 z-10 hidden w-[80%] text-center lg:block"
          >
            <p ref={flyerMetaRef} className="font-mono text-[18.5px] uppercase tracking-[0.08em] text-white/70" />
            <p
              ref={flyerTitleRef}
              className="mt-2 font-display text-[44px] font-extrabold uppercase leading-[1.02] tracking-tight text-[#D9F99D] xl:text-[52px]"
            />
          </div>

          <p
            ref={hintRef}
            className="pointer-events-none absolute inset-x-0 top-1/2 z-10 hidden -translate-y-1/2 text-center font-display text-[34px] font-extrabold uppercase tracking-tight text-[#D9F99D] lg:block"
          >
            Click a brick to open it →
          </p>

          {detail && (
            <div
              role="dialog"
              aria-label={`${detail.title} — details`}
              className="relative z-20 rounded-[28px] border border-white/15 bg-cinema-ink p-8 lg:absolute lg:inset-0 lg:overflow-y-auto lg:p-12"
            >
              <button
                type="button"
                onClick={() => setSelected(null)}
                aria-label="Close details"
                className="absolute right-5 top-5 rounded-full border border-white/20 p-2 text-white/80 transition-colors hover:bg-white/10 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
              <div className="flex flex-wrap items-center gap-3 pr-12">
                <span className="font-mono text-[18.5px] text-white/75">{detail.period}</span>
                <span className="rounded-full border border-[#D9F99D]/40 px-3 py-0.5 font-mono text-[16.5px] uppercase tracking-[0.08em] text-[#D9F99D]">
                  {detail.type}
                </span>
              </div>
              <h3 className="mt-5 font-display text-[40px] font-bold leading-[1.05] tracking-tight text-white xl:text-[52px]">
                {detail.title}
              </h3>
              <p className="mt-3 text-[24px] text-white/85">{detail.organization}</p>
              {detail.location && (
                <p className="mt-1 flex items-center gap-2 text-[19px] text-white/70">
                  <MapPin className="h-4 w-4 shrink-0" />
                  {detail.location}
                </p>
              )}
              <ul className="mt-7 space-y-3 border-t border-white/10 pt-6">
                {detail.description.map((d) => (
                  <li key={d} className="flex gap-3 text-[20px] leading-relaxed text-white/85">
                    <span className="mt-3 h-1.5 w-1.5 shrink-0 rounded-full bg-[#D9F99D]" />
                    {d}
                  </li>
                ))}
              </ul>
              <div className="mt-7 flex flex-wrap items-center gap-4">
                <p className="text-[18.5px] text-white/65">{detail.tags.join(" · ")}</p>
                {detail.link && (
                  <a
                    href={detail.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-[18.5px] font-medium text-[#D9F99D] hover:underline"
                  >
                    Read paper <ExternalLink className="h-4 w-4" />
                  </a>
                )}
              </div>
            </div>
          )}
        </div>

        {/* The tower — newest on top, built bottom-up by the animation */}
        <div ref={towerRef} className="order-1 flex flex-col gap-2.5 lg:order-2 lg:col-span-5">
          {journey.map((item, i) => {
            const isOpen = selected === i;
            return (
              <button
                key={`${item.title}-${item.organization}`}
                type="button"
                data-brick
                onClick={() => setSelected(isOpen ? null : i)}
                aria-expanded={isOpen}
                className={`group flex w-full items-center gap-5 rounded-2xl border px-6 py-4 text-left transition-colors duration-300 ${
                  isOpen
                    ? "border-[#D9F99D] bg-[#D9F99D] text-cinema-ink-deep"
                    : "border-white/15 bg-white/[0.06] text-white hover:border-white/40 hover:bg-white/[0.12]"
                }`}
              >
                <span
                  className={`shrink-0 font-mono text-[17.5px] ${isOpen ? "text-cinema-ink-deep/70" : "text-white/60"}`}
                >
                  {item.period.slice(0, 4)}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block font-display text-[21px] font-bold leading-tight lg:truncate">{item.title}</span>
                  <span
                    className={`mt-0.5 block text-[17px] lg:truncate ${isOpen ? "text-cinema-ink-deep/75" : "text-white/70"}`}
                  >
                    {item.organization}
                  </span>
                </span>
                <span
                  aria-hidden
                  className={`shrink-0 text-[22px] transition-transform duration-300 group-hover:translate-x-1 ${
                    isOpen ? "text-cinema-ink-deep" : "text-white/50"
                  }`}
                >
                  →
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </SectionWrapper>
  );
}
