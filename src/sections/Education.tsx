"use client";

import { useEffect, useRef } from "react";
import { MapPin, Plane } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { education } from "@/data/education";
import { SectionWrapper } from "@/components/effects/SectionWrapper";
import { SectionHeading } from "@/components/ui/SectionHeading";

// Chronological for the story (school -> university); the data file is
// newest-first.
const legs = [...education].reverse();

const FLAP_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

// Quadratic arc from Dhaka (left) to Almaty (right) in a 1000x170 viewBox.
const ROUTE_D = "M 40 140 Q 500 -50 960 140";
// Tangent at the end of the arc, so the plane sits correctly before JS runs.
const PLANE_END = "translate(960 140) rotate(67.4) translate(-12 -12)";

const city = (location: string) => location.split(",")[0].trim();
const country = (location: string) => location.split(",").pop()?.trim() ?? "";
const COUNTRY_CODE: Record<string, string> = { Bangladesh: "BD", Kazakhstan: "KZ" };

/** Text rendered as split-flap tiles, one tile per character, words kept intact. */
function FlapText({ text }: { text: string }) {
  return (
    <span className="flex flex-wrap gap-x-[0.55em] gap-y-[0.18em]" aria-label={text}>
      {text
        .toUpperCase()
        .split(" ")
        .filter(Boolean)
        .map((word, wi) => (
          <span key={wi} className="flex gap-[0.1em]" aria-hidden>
            {Array.from(word).map((ch, ci) => (
              <span
                key={ci}
                data-flap={ch}
                className="relative inline-flex h-[1.55em] w-[1.12em] items-center justify-center overflow-hidden rounded-[3px] bg-[#1e1d1a] font-mono font-semibold text-[#F5EFE0] shadow-[inset_0_-1px_0_rgba(255,255,255,0.06)] after:absolute after:inset-x-0 after:top-1/2 after:h-px after:bg-black/70"
              >
                {ch}
              </span>
            ))}
          </span>
        ))}
    </span>
  );
}

/**
 * Education as a journey between two countries: a dotted flight route draws
 * itself from Dhaka to Almaty with a plane flying it, an airport departure
 * board flips each letter into place (school first, then university), and an
 * "International Scholar" stamp slams onto the university row. Boarding-pass
 * cards below carry the readable details and campus photos.
 *
 * Every animated element is server-rendered in its finished state, so
 * prefers-reduced-motion simply skips the effect and sees the final page.
 */
export function Education() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const routeRef = useRef<SVGPathElement>(null);
  const planeRef = useRef<SVGGElement>(null);
  const boardRef = useRef<HTMLDivElement>(null);
  const stampRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const section = sectionRef.current;
    const route = routeRef.current;
    const plane = planeRef.current;
    const board = boardRef.current;
    const stamp = stampRef.current;
    if (!section || !route || !plane || !board || !stamp) return;

    const len = route.getTotalLength();
    const placePlane = (p: number) => {
      const d = len * p;
      const a = route.getPointAtLength(d);
      const b = route.getPointAtLength(Math.min(len, d + 1));
      const c = d >= len ? route.getPointAtLength(len - 1) : a;
      const angle = (Math.atan2(b.y - c.y, b.x - c.x) * 180) / Math.PI;
      // lucide's plane glyph points up-right (-45deg), hence the +45.
      plane.setAttribute("transform", `translate(${a.x} ${a.y}) rotate(${angle + 45}) translate(-12 -12)`);
    };

    const rows = gsap.utils.toArray<HTMLElement>("[data-board-row]", board);

    // One schedule for every tile, driven by a single ticker against elapsed
    // time — hundreds of chained setTimeouts drifted badly on slow devices
    // (the board took 2.5x longer than intended).
    type Tile = { el: HTMLElement; start: number; end: number; last: number; done: boolean };
    const tiles: Tile[] = [];
    rows.forEach((row, r) => {
      const rowStart = r === 0 ? 0.5 : 1.3;
      row.querySelectorAll<HTMLElement>("[data-flap]").forEach((el, i) => {
        const start = rowStart + i * 0.022;
        tiles.push({ el, start, end: start + 0.3 + Math.random() * 0.4, last: -1, done: false });
      });
    });

    // Hide everything in its pre-animation state.
    gsap.set(route, { strokeDasharray: len, strokeDashoffset: len });
    placePlane(0);
    tiles.forEach((t) => (t.el.textContent = ""));
    gsap.set(stamp, { autoAlpha: 0 });

    let t0 = 0;
    let remaining = tiles.length;
    const slam = () =>
      gsap
        .timeline()
        .fromTo(
          stamp,
          { autoAlpha: 0, scale: 2.6, rotation: -24 },
          { autoAlpha: 1, scale: 1, rotation: -9, duration: 0.32, ease: "power4.in" }
        )
        .fromTo(board, { x: -6, y: 3 }, { x: 0, y: 0, duration: 0.6, ease: "elastic.out(1, 0.3)" });

    const tick = (time: number) => {
      const now = time - t0;
      for (const t of tiles) {
        if (t.done || now < t.start) continue;
        if (now >= t.end) {
          t.el.textContent = t.el.dataset.flap ?? "";
          t.done = true;
          remaining--;
        } else if (now - t.last >= 0.045) {
          t.el.textContent = FLAP_CHARS[(Math.random() * FLAP_CHARS.length) | 0];
          t.last = now;
        }
      }
      if (remaining === 0) {
        gsap.ticker.remove(tick);
        slam();
      }
    };

    const play = () => {
      t0 = gsap.ticker.time;
      gsap.ticker.add(tick);
      const progress = { p: 0 };
      gsap.to(progress, {
        p: 1,
        duration: 2.4,
        ease: "power1.inOut",
        onUpdate: () => {
          gsap.set(route, { strokeDashoffset: len * (1 - progress.p) });
          placePlane(progress.p);
        },
      });
    };

    const st = ScrollTrigger.create({ trigger: section, start: "top 70%", once: true, onEnter: play });

    return () => {
      st.kill();
      gsap.ticker.remove(tick);
    };
  }, []);

  return (
    <SectionWrapper id="education">
      <div className="cinema-container-full">
        <SectionHeading index="01" label="Education" title="Academic foundation" />
      </div>

      <div ref={sectionRef} className="cinema-container-full">
        {/* Flight route */}
        <div className="mb-10 md:mb-14">
          <svg viewBox="0 0 1000 170" className="h-auto w-full overflow-visible" aria-hidden>
            <path d={ROUTE_D} fill="none" stroke="rgba(24,22,15,0.18)" strokeWidth="2.5" strokeDasharray="2 12" strokeLinecap="round" />
            <path ref={routeRef} d={ROUTE_D} fill="none" stroke="#A97B33" strokeWidth="3" strokeLinecap="round" />
            <circle cx="40" cy="140" r="9" fill="#2F5654" />
            <circle cx="960" cy="140" r="9" fill="#A97B33" />
            <g ref={planeRef} transform={PLANE_END}>
              <circle cx="12" cy="12" r="25" fill="#18160F" />
              <Plane x={0} y={0} width={24} height={24} color="#F7F3E9" strokeWidth={2} />
            </g>
          </svg>
          <div className="mt-3 flex items-start justify-between gap-6">
            {legs.map((leg, i) => (
              <div key={leg.institution} className={i === 1 ? "text-right" : ""}>
                <p className="font-display text-[30px] font-extrabold uppercase leading-none tracking-tight text-cinema-text md:text-[44px]">
                  {city(leg.location)}
                  <span className="ml-2 align-middle font-mono text-[18.5px] font-semibold text-cinema-muted">
                    {COUNTRY_CODE[country(leg.location)] ?? country(leg.location)}
                  </span>
                </p>
                <p className="mt-2 text-[19px] text-cinema-muted md:text-[21.6px]">{leg.degree}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Departure board */}
        <div
          ref={boardRef}
          className="relative rounded-[28px] bg-cinema-ink-deep p-5 text-[15px] shadow-portrait sm:p-8 md:text-[16px] lg:p-10 lg:text-[15px] xl:text-[19px] 2xl:text-[21px]"
        >
          <div className="mb-6 flex items-center justify-between gap-4 border-b border-white/10 pb-5">
            <p className="flex items-center gap-3 font-display text-[24px] font-extrabold uppercase tracking-tight text-[#F5C451] md:text-[30px]">
              <Plane className="h-7 w-7" strokeWidth={2.2} />
              Departures
            </p>
            <p className="hidden font-mono text-[16.5px] uppercase tracking-[0.08em] text-white/60 sm:block">Education</p>
          </div>

          <div className="hidden grid-cols-12 gap-6 pb-3 font-mono text-[16.5px] uppercase tracking-[0.08em] text-white/55 lg:grid">
            <span className="col-span-2">From</span>
            <span className="col-span-4">Institution</span>
            <span className="col-span-3">Programme</span>
            <span className="col-span-3">Status</span>
          </div>

          <div className="space-y-6 lg:space-y-4">
            {legs.map((leg, i) => (
              <div
                key={leg.institution}
                data-board-row
                className="grid grid-cols-1 gap-3 border-t border-white/10 pt-6 first:border-t-0 first:pt-0 lg:grid-cols-12 lg:gap-6 lg:pt-4"
              >
                {[
                  { label: "From", text: city(leg.location), span: "lg:col-span-2" },
                  { label: "Institution", text: leg.institution, span: "lg:col-span-4" },
                  { label: "Programme", text: leg.degree, span: "lg:col-span-3" },
                  { label: "Status", text: leg.period, span: "lg:col-span-3" },
                ].map((field) => (
                  <div key={field.label} className={field.span}>
                    <p className="mb-1.5 font-mono text-[14px] uppercase tracking-[0.08em] text-white/50 lg:hidden">
                      {field.label}
                    </p>
                    <FlapText text={field.text} />
                  </div>
                ))}
                {/* the university row carries the stamp */}
                {i === legs.length - 1 && legs[i].badge && (
                  <span className="sr-only">{legs[i].badge}</span>
                )}
              </div>
            ))}
          </div>

          {legs[legs.length - 1].badge && (
            <div
              ref={stampRef}
              aria-hidden
              className="pointer-events-none absolute -bottom-6 right-4 rotate-[-9deg] rounded-xl border-[3px] border-[#C2412D] px-4 py-2 font-display text-[19px] font-extrabold uppercase leading-tight tracking-tight text-[#C2412D] sm:right-8 md:-bottom-8 md:text-[26px] lg:right-12"
              style={{ boxShadow: "inset 0 0 0 3px rgba(194,65,45,0.25)", background: "rgba(247,243,233,0.94)" }}
            >
              ★ {legs[legs.length - 1].badge} ★
            </div>
          )}
        </div>

        {/* Boarding passes — the readable details */}
        <div className="mt-20 grid grid-cols-1 gap-8 md:grid-cols-2">
          {legs.map((leg, i) => (
            <article
              key={leg.institution}
              className="group flex flex-col overflow-hidden rounded-[28px] border border-black/10 bg-cinema-elevated shadow-cinema transition-transform duration-500 ease-cinema hover:-translate-y-1.5"
            >
              {leg.image && (
                <div className="relative h-56 overflow-hidden md:h-64">
                  {/* plain <img> so the campus GIF keeps animating */}
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={leg.image}
                    alt={`${leg.institution} campus`}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                  <span className="absolute left-5 top-5 rounded-full bg-cinema-ink-deep/85 px-3.5 py-1 font-mono text-[15px] uppercase tracking-[0.08em] text-white">
                    Boarding pass · {String(i + 1).padStart(2, "0")}
                  </span>
                </div>
              )}

              {/* perforation */}
              <div className="relative h-0 border-t-2 border-dashed border-black/15" aria-hidden>
                <span className="absolute -left-3 -top-3 h-6 w-6 rounded-full bg-cinema-navy" />
                <span className="absolute -right-3 -top-3 h-6 w-6 rounded-full bg-cinema-navy" />
              </div>

              <div className="flex flex-1 flex-col p-7 md:p-9">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="font-mono text-[18.9px] text-cinema-soft">{leg.period}</span>
                  {leg.badge && (
                    <span className="rounded-full border border-[#C2412D]/40 px-3 py-0.5 font-mono text-[15px] uppercase tracking-[0.08em] text-[#C2412D]">
                      {leg.badge}
                    </span>
                  )}
                </div>
                <h3 className="mt-4 font-display text-[30px] font-bold leading-tight tracking-tight text-cinema-text lg:text-[38px]">
                  {leg.institution}
                </h3>
                <p className="mt-2 font-serif text-[26px] italic text-cinema-soft">{leg.degree}</p>
                <p className="mt-2 flex items-center gap-2 text-[20px] text-cinema-muted">
                  <MapPin className="h-4 w-4 shrink-0" />
                  {leg.location}
                </p>
                <ul className="mt-6 space-y-2.5 border-t border-black/10 pt-5">
                  {leg.highlights.map((h) => (
                    <li key={h} className="flex gap-3 text-[21.6px] leading-relaxed text-cinema-soft">
                      <span className="mt-3 h-1.5 w-1.5 shrink-0 rounded-full bg-cinema-gold" />
                      {h}
                    </li>
                  ))}
                </ul>
              </div>
            </article>
          ))}
        </div>
      </div>
    </SectionWrapper>
  );
}
