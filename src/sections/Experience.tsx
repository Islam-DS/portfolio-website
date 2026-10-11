"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Building2, MapPin } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { work } from "@/data/journey";
import { SectionWrapper } from "@/components/effects/SectionWrapper";
import { Emphasized } from "@/components/ui/Emphasized";
import { fadeInUp, viewportOnce } from "@/lib/motion";

const TUNNEL_COPIES = 6;
const TUNNEL_LOOP_S = 3.2;
const ACCENT = "#D9F99D";

/**
 * Work experience on a black stage. A kinetic-typography tunnel banner
 * (JOURNEY / EXPERIENCE streaming outward from a vanishing point, modelled
 * on a reference the user supplied) flies each role title out of its centre
 * in turn while the section is on screen. Below it, the roles are laid out
 * like the CV — title, organisation, dates, department, and the CV's own
 * paragraph with its bolded phrases — each revealed as its rule draws in.
 *
 * Tunnel only animates while visible. prefers-reduced-motion gets a static
 * tunnel frame and the list without reveals.
 */
export function Experience() {
  const tunnelRef = useRef<HTMLDivElement>(null);
  const flyerRef = useRef<HTMLParagraphElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const tunnel = tunnelRef.current;
    const flyer = flyerRef.current;
    const list = listRef.current;
    if (!tunnel || !flyer || !list) return;

    const height = tunnel.getBoundingClientRect().height;
    const tunnelTl = gsap.timeline({ paused: true });
    const addStream = (els: HTMLElement[], dir: 1 | -1) =>
      els.forEach((el, i) =>
        tunnelTl.fromTo(
          el,
          { scaleX: 0.06, scaleY: 0.035, y: 0, opacity: 0 },
          {
            scaleX: 2.6,
            scaleY: 1.5,
            y: dir * height * 0.62,
            opacity: 1,
            duration: TUNNEL_LOOP_S,
            ease: "power2.in",
            repeat: -1,
          },
          (i * TUNNEL_LOOP_S) / els.length
        )
      );
    addStream(gsap.utils.toArray<HTMLElement>("[data-tunnel-top]", tunnel), -1);
    addStream(gsap.utils.toArray<HTMLElement>("[data-tunnel-bottom]", tunnel), 1);
    // Mid-stream, so even the static (reduced-motion) frame shows a full tunnel.
    tunnelTl.progress(0.5);

    if (reduced) return () => tunnelTl.kill();

    // Role titles fly out of the tunnel's centre one after another, forever.
    const flyerTl = gsap.timeline({ paused: true, repeat: -1 });
    work.forEach((item) => {
      flyerTl
        .call(() => {
          flyer.textContent = item.title;
        })
        .fromTo(flyer, { scale: 0.12, autoAlpha: 0 }, { scale: 1, autoAlpha: 1, duration: 0.75, ease: "power3.out" })
        .to(flyer, { scale: 2.4, autoAlpha: 0, duration: 0.55, ease: "power2.in" }, "+=1.5");
    });

    const stageSt = ScrollTrigger.create({
      trigger: tunnel,
      start: "top bottom",
      end: "bottom top",
      onToggle: (self) => {
        if (self.isActive) {
          tunnelTl.play();
          flyerTl.play();
        } else {
          tunnelTl.pause();
          flyerTl.pause();
        }
      },
    });

    // CV entries: the rule draws across, then the entry rises in.
    const entries = gsap.utils.toArray<HTMLElement>("[data-work]", list);
    const entrySts = entries.map((entry) => {
      const rule = entry.querySelector<HTMLElement>("[data-rule]");
      const body = entry.querySelectorAll<HTMLElement>("[data-rise]");
      gsap.set(rule, { scaleX: 0, transformOrigin: "left center" });
      gsap.set(body, { autoAlpha: 0, y: 28 });
      return ScrollTrigger.create({
        trigger: entry,
        start: "top 82%",
        once: true,
        onEnter: () =>
          gsap
            .timeline()
            .to(rule, { scaleX: 1, duration: 0.8, ease: "power3.inOut" })
            .to(body, { autoAlpha: 1, y: 0, duration: 0.7, ease: "power3.out", stagger: 0.1 }, "-=0.35"),
      });
    });

    return () => {
      stageSt.kill();
      entrySts.forEach((s) => s.kill());
      tunnelTl.kill();
      flyerTl.kill();
    };
  }, []);

  const wordClass =
    "absolute inset-x-0 top-1/2 -mt-[0.5em] select-none text-center font-display text-[64px] font-extrabold uppercase leading-none tracking-tight text-white opacity-0 md:text-[96px] lg:text-[120px]";

  return (
    <SectionWrapper id="experience" className="overflow-hidden bg-cinema-ink-deep">
      <div className="cinema-container-full">
        <motion.header
          className="mb-14 md:mb-16"
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
          <h2 className="font-display text-display-md font-bold tracking-tight text-white">
            The journey{" "}
            <em className="pr-[0.08em] font-serif font-normal italic tracking-normal" style={{ color: ACCENT }}>
              so far
            </em>
          </h2>
          <p className="mt-6 max-w-2xl text-body-lg text-white/75">
            Research, teaching, and co-founding a school — the work that shaped the path.
          </p>
        </motion.header>

        {/* Tunnel banner */}
        <div
          ref={tunnelRef}
          aria-hidden
          className="relative h-[280px] overflow-hidden rounded-[28px] bg-black md:h-[340px] lg:h-[380px]"
        >
          {Array.from({ length: TUNNEL_COPIES }).map((_, i) => (
            <span key={`t${i}`} data-tunnel-top className={wordClass}>
              Journey
            </span>
          ))}
          {Array.from({ length: TUNNEL_COPIES }).map((_, i) => (
            <span key={`b${i}`} data-tunnel-bottom className={wordClass}>
              Experience
            </span>
          ))}
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_38%_30%_at_50%_50%,rgba(0,0,0,0.96),transparent)]" />
          <div className="absolute inset-0 flex items-center justify-center px-6">
            <p
              ref={flyerRef}
              className="text-center font-display text-[30px] font-extrabold uppercase leading-[1.02] tracking-tight md:text-[44px] lg:text-[56px]"
              style={{ color: ACCENT }}
            >
              {work[0].title}
            </p>
          </div>
        </div>

        {/* CV-style list */}
        <div ref={listRef} className="mt-16 md:mt-20">
          <p className="font-mono text-[17.5px] uppercase tracking-[0.14em] text-white/70">Work experience</p>
          {work.map((item, i) => (
            <article key={item.title} data-work className="relative pt-10 md:pt-12">
              <span data-rule aria-hidden className="absolute inset-x-0 top-0 block h-[2px]" style={{ background: ACCENT }} />
              <div className="grid grid-cols-1 gap-6 pb-12 md:pb-14 lg:grid-cols-12 lg:gap-12">
                <div data-rise className="lg:col-span-5">
                  <div className="flex items-baseline justify-between gap-4 lg:block">
                    <span className="font-mono text-[18.5px]" style={{ color: ACCENT }}>
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="font-mono text-[18.5px] text-white/80 lg:mt-3 lg:block">{item.period}</span>
                  </div>
                  <h3 className="mt-4 font-display text-[30px] font-bold uppercase leading-[1.05] tracking-tight text-white md:text-[38px] xl:text-[44px]">
                    {item.title}
                  </h3>
                  <p className="mt-3 text-[21.6px] leading-snug text-white/85">{item.organization}</p>
                  <div className="mt-3 space-y-1.5 text-[18.5px] text-white/65">
                    {item.department && (
                      <p className="flex items-center gap-2">
                        <Building2 className="h-4 w-4 shrink-0" />
                        Department: {item.department}
                      </p>
                    )}
                    {item.location && (
                      <p className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 shrink-0" />
                        {item.location}
                      </p>
                    )}
                  </div>
                </div>
                <p data-rise className="text-[21.6px] leading-relaxed text-white/75 lg:col-span-7 lg:pt-10">
                  <Emphasized text={item.summary} phrases={item.emphasis} strongClassName="font-semibold text-white" />
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </SectionWrapper>
  );
}
