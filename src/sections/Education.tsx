"use client";

import { useEffect, useRef } from "react";
import { CalendarDays, GraduationCap, MapPin, Plane } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { education } from "@/data/education";
import { siteConfig } from "@/data/site";
import { SectionWrapper } from "@/components/effects/SectionWrapper";
import { SectionHeading } from "@/components/ui/SectionHeading";

// Chronological (school -> university); the data file is newest-first.
const records = [...education].reverse();

const STAMP_COLOR = { scholar: "#C2412D", done: "#2F5654" };

// Quadratic arc from the first record's city (left) to the last (right).
const ROUTE_D = "M 40 140 Q 500 -50 960 140";
// Tangent at the end of the arc, so the plane sits correctly before JS runs.
const PLANE_END = "translate(960 140) rotate(67.4) translate(-12 -12)";
const COUNTRY_CODE: Record<string, string> = { Bangladesh: "BD", Kazakhstan: "KZ" };
const city = (location: string) => location.split(",")[0].trim();
const country = (location: string) => location.split(",").pop()?.trim() ?? "";

/** Dotted route between the two cities with a plane flying it once in view. */
function FlightRoute() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const routeRef = useRef<SVGPathElement>(null);
  const planeRef = useRef<SVGGElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const wrap = wrapRef.current;
    const route = routeRef.current;
    const plane = planeRef.current;
    if (!wrap || !route || !plane) return;

    const len = route.getTotalLength();
    const placePlane = (p: number) => {
      const d = len * p;
      const a = route.getPointAtLength(d);
      const from = route.getPointAtLength(Math.max(0, Math.min(d, len - 1)));
      const to = route.getPointAtLength(Math.min(len, Math.max(d, 1) + 1));
      const angle = (Math.atan2(to.y - from.y, to.x - from.x) * 180) / Math.PI;
      // lucide's plane glyph points up-right (-45deg), hence the +45.
      plane.setAttribute("transform", `translate(${a.x} ${a.y}) rotate(${angle + 45}) translate(-12 -12)`);
    };

    gsap.set(route, { strokeDasharray: len, strokeDashoffset: len });
    placePlane(0);

    const progress = { p: 0 };
    const tween = gsap.to(progress, {
      p: 1,
      duration: 2.2,
      ease: "power1.inOut",
      paused: true,
      onUpdate: () => {
        route.style.strokeDashoffset = String(len * (1 - progress.p));
        placePlane(progress.p);
      },
    });
    const st = ScrollTrigger.create({ trigger: wrap, start: "top 75%", once: true, onEnter: () => tween.play() });
    return () => {
      st.kill();
      tween.kill();
    };
  }, []);

  const [from, to] = [records[0], records[records.length - 1]];

  return (
    <div ref={wrapRef} className="cinema-container-full mb-16 md:mb-20">
      <svg viewBox="0 0 1000 170" className="h-auto w-full overflow-visible" aria-hidden>
        <path d={ROUTE_D} fill="none" stroke="rgba(24,22,15,0.2)" strokeWidth="2.5" strokeDasharray="2 12" strokeLinecap="round" />
        <path ref={routeRef} d={ROUTE_D} fill="none" stroke="#A97B33" strokeWidth="3.5" strokeLinecap="round" />
        <circle cx="40" cy="140" r="10" fill="#2F5654" />
        <circle cx="960" cy="140" r="10" fill="#A97B33" />
        <g ref={planeRef} transform={PLANE_END}>
          <circle cx="12" cy="12" r="25" fill="#18160F" />
          <Plane x={0} y={0} width={24} height={24} color="#F7F3E9" strokeWidth={2} />
        </g>
      </svg>
      <div className="mt-3 flex items-start justify-between gap-6">
        {[from, to].map((rec, i) => (
          <div key={rec.institution} className={i === 1 ? "text-right" : ""}>
            <p className="font-display text-[34px] font-extrabold uppercase leading-none tracking-tight text-cinema-text md:text-[52px]">
              {city(rec.location)}
              <span className="ml-2 align-middle font-mono text-[18.5px] font-semibold text-cinema-muted">
                {COUNTRY_CODE[country(rec.location)] ?? country(rec.location)}
              </span>
            </p>
            <p className="mt-2 text-[19px] text-cinema-muted md:text-[21.6px]">{rec.degree}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * Education as two diplomas: each slides up like a sheet of paper, its
 * details are "written in" line by line, then a rubber stamp slams down —
 * "International Scholar" on the university record, "Completed" on the
 * school. Campus photos are clipped to each sheet like attached polaroids.
 *
 * Wording stays truthful: the BSc is in progress, so nothing claims a
 * degree was awarded — the sheet just records institution, programme,
 * period and highlights from data/education.ts.
 *
 * Server-rendered in the finished state; prefers-reduced-motion skips the
 * effect and sees exactly that.
 */
export function Education() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const section = sectionRef.current;
    if (!section) return;

    const sheets = gsap.utils.toArray<HTMLElement>("[data-diploma]", section);
    const tl = gsap.timeline({ paused: true });

    sheets.forEach((sheet, i) => {
      const lines = sheet.querySelectorAll<HTMLElement>("[data-ink]");
      const stamp = sheet.querySelector<HTMLElement>("[data-stamp]");
      const photo = sheet.querySelector<HTMLElement>("[data-photo]");

      // Rotation lives in GSAP (not a CSS `rotate`) so the shake and the
      // settle compose with it instead of fighting a separate property.
      gsap.set(sheet, { autoAlpha: 0, y: 140, rotation: i === 0 ? -4 : 4 });
      gsap.set(lines, { clipPath: "inset(0 100% 0 0)" });
      if (stamp) gsap.set(stamp, { autoAlpha: 0 });
      if (photo) gsap.set(photo, { autoAlpha: 0, scale: 0.6, rotation: 0 });

      const at = i * 0.35;
      tl.to(sheet, { autoAlpha: 1, y: 0, rotation: i === 0 ? -0.6 : 0.6, duration: 1, ease: "power3.out" }, at).to(
        lines,
        { clipPath: "inset(0 0% 0 0)", duration: 0.55, ease: "power1.inOut", stagger: 0.16 },
        at + 0.75
      );
      if (photo) {
        tl.to(photo, { autoAlpha: 1, scale: 1, rotation: i === 0 ? -7 : 6, duration: 0.6, ease: "back.out(2)" }, at + 0.9);
      }
    });

    // The sheets are taller than the screen, so each stamp gets its own
    // trigger and slams down only once it's actually in view — never after
    // the visitor has already scrolled past it. Waits for the sheet's ink
    // if the visitor scrolls fast.
    const stampTriggers = sheets.map((sheet, i) => {
      const stamp = sheet.querySelector<HTMLElement>("[data-stamp]");
      if (!stamp) return undefined;
      const finalRot = Number(stamp.dataset.rot ?? -8);
      const slam = () =>
        gsap
          .timeline({ delay: Math.max(0, i * 0.35 + 1.6 - tl.time()) })
          .fromTo(
            stamp,
            { autoAlpha: 0, scale: 2.8, rotation: finalRot - 18 },
            { autoAlpha: 1, scale: 1, rotation: finalRot, duration: 0.3, ease: "power4.in" }
          )
          .fromTo(
            sheet,
            { x: i === 0 ? -5 : -9, y: 4 },
            { x: 0, y: 0, duration: 0.7, ease: "elastic.out(1, 0.28)" }
          );
      return ScrollTrigger.create({ trigger: stamp, start: "bottom 88%", once: true, onEnter: slam });
    });

    const st = ScrollTrigger.create({ trigger: section, start: "top 72%", once: true, onEnter: () => tl.play() });
    return () => {
      st.kill();
      stampTriggers.forEach((t) => t?.kill());
      tl.kill();
    };
  }, []);

  return (
    <SectionWrapper id="education">
      <div className="cinema-container-full">
        <SectionHeading index="01" label="Education" title="Academic foundation" emphasis="foundation" />
      </div>

      <FlightRoute />

      {/* At lg the two diplomas share 7 grid rows (CSS subgrid), so the
          title, name, degree, details and highlights line up across both
          sheets no matter how many lines each institution name takes. */}
      <div
        ref={sectionRef}
        className="cinema-container-full grid grid-cols-1 gap-20 overflow-x-clip py-16 lg:grid-cols-2 lg:grid-rows-[repeat(7,auto)] lg:gap-x-12 lg:gap-y-0"
      >
        {records.map((item, i) => {
          const isScholar = Boolean(item.badge);
          const stampText = item.badge ?? item.period;
          const stampColor = isScholar ? STAMP_COLOR.scholar : STAMP_COLOR.done;
          const stampRot = isScholar ? -11 : 9;
          const subgrid = "lg:grid lg:[grid-row:span_7/span_7] lg:[grid-template-rows:subgrid]";
          const pill =
            "inline-flex items-center gap-2 whitespace-nowrap rounded-full border border-cinema-gold/40 bg-white/70 px-3.5 py-1.5 text-[17px] text-cinema-soft sm:px-4 sm:text-[19px]";
          return (
            <article
              key={item.institution}
              data-diploma
              className={`relative rounded-[6px] bg-[#FDFAF2] p-3 shadow-[0_30px_70px_-30px_rgba(24,22,15,0.45),0_2px_6px_rgba(24,22,15,0.08)] sm:p-4 ${subgrid}`}
            >
              {/* double gold frame */}
              <div className={`relative flex h-full flex-col border-[3px] border-cinema-gold/70 p-1.5 ${subgrid}`}>
                <div
                  className={`relative flex h-full flex-col items-center border border-cinema-gold/50 px-6 pb-8 pt-9 text-center sm:px-10 md:px-12 md:pb-10 md:pt-11 lg:justify-items-center ${subgrid}`}
                >
                  {/* corner ornaments */}
                  {["left-2 top-2", "right-2 top-2 rotate-90", "bottom-2 right-2 rotate-180", "bottom-2 left-2 -rotate-90"].map(
                    (pos) => (
                      <span key={pos} aria-hidden className={`absolute ${pos} h-7 w-7 border-l-2 border-t-2 border-cinema-gold/60`} />
                    )
                  )}

                  {/* 1 crest + label */}
                  <div data-ink className="flex items-center justify-center gap-3">
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border-2 border-cinema-gold/60 text-cinema-gold">
                      <GraduationCap className="h-6 w-6" strokeWidth={1.7} />
                    </span>
                    <span className="whitespace-nowrap font-mono text-[14px] font-semibold uppercase tracking-[0.12em] text-cinema-gold sm:text-[17px] sm:tracking-[0.18em]">
                      Academic Record · {String(i + 1).padStart(2, "0")}
                    </span>
                  </div>

                  {/* 2 institution */}
                  <h3
                    data-ink
                    className="mt-5 font-display text-[34px] font-extrabold leading-[1.04] tracking-tight text-cinema-text [text-wrap:balance] md:text-[42px] lg:self-center xl:text-[48px]"
                  >
                    {item.institution}
                  </h3>

                  {/* 3 ornament rule */}
                  <div className="mt-5 flex w-full items-center gap-4" aria-hidden>
                    <span className="h-px flex-1 bg-cinema-gold/50" />
                    <span className="h-2.5 w-2.5 rotate-45 bg-cinema-gold/80" />
                    <span className="h-px flex-1 bg-cinema-gold/50" />
                  </div>

                  {/* 4 student */}
                  <div data-ink className="mt-5">
                    <p className="font-mono text-[15px] font-semibold uppercase tracking-[0.2em] text-cinema-muted">Student</p>
                    <p className="mt-1.5 font-serif text-[46px] italic leading-none text-cinema-text md:text-[54px] xl:text-[60px]">
                      {siteConfig.name}
                    </p>
                  </div>

                  {/* 5 degree */}
                  <p
                    data-ink
                    className="mt-5 font-display text-[24px] font-extrabold uppercase leading-tight tracking-[0.03em] md:text-[28px]"
                    style={{ color: stampColor }}
                  >
                    {item.degree}
                  </p>

                  {/* 6 place + period, side by side */}
                  <div data-ink className="mt-4 flex flex-wrap justify-center gap-2.5">
                    <span className={pill}>
                      <MapPin className="h-4 w-4 shrink-0 text-cinema-gold" />
                      {item.location}
                    </span>
                    <span className={pill}>
                      <CalendarDays className="h-4 w-4 shrink-0 text-cinema-gold" />
                      {item.period}
                    </span>
                  </div>

                  {/* 7 highlights + rubber stamp side by side: the stamp fills the
                      space beside the list instead of taking its own row */}
                  <div className="mt-7 flex w-full flex-col items-center gap-6 border-t border-cinema-gold/30 pt-6 sm:flex-row sm:items-center lg:self-start">
                    <ul className="flex-1 space-y-3 text-left">
                      {item.highlights.map((h) => (
                        <li key={h} data-ink className="flex gap-3 text-[21px] leading-snug text-cinema-soft md:text-[22px]">
                          <span className="mt-[0.5em] h-2 w-2 shrink-0 rotate-45 bg-cinema-gold" />
                          {h}
                        </li>
                      ))}
                    </ul>

                    {/* rotation set by GSAP (data-rot), with the same value inline
                        so the server-rendered final state matches */}
                    <div
                      data-stamp
                      data-rot={stampRot}
                      className="shrink-0 rounded-full border-[4px] p-1.5"
                      style={{
                        color: stampColor,
                        borderColor: stampColor,
                        transform: `rotate(${stampRot}deg)`,
                        background: "rgba(253,250,242,0.6)",
                      }}
                    >
                      <span
                        className="flex h-28 w-28 flex-col items-center justify-center rounded-full border-2 border-dashed px-2 font-display text-[12.5px] font-extrabold uppercase leading-tight tracking-tight md:h-32 md:w-32 md:text-[14px]"
                        style={{ borderColor: stampColor }}
                      >
                        <span aria-hidden>★</span>
                        {stampText}
                        <span aria-hidden>★</span>
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* attached campus photo */}
              {item.image && (
                <figure
                  data-photo
                  className="absolute -top-16 hidden w-32 bg-white p-2 pb-5 shadow-cinema sm:block md:w-36"
                  style={{ [i === 0 ? "left" : "right"]: "-2.25rem", transform: `rotate(${i === 0 ? -7 : 6}deg)` }}
                >
                  <span aria-hidden className="absolute -top-3 left-1/2 h-6 w-3 -ml-1.5 rounded-full border-2 border-cinema-muted/70" />
                  {/* plain <img> so the campus GIF keeps animating */}
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={item.image}
                    alt={`${item.institution} campus`}
                    loading="lazy"
                    className="aspect-square w-full object-cover"
                  />
                </figure>
              )}
            </article>
          );
        })}
      </div>
    </SectionWrapper>
  );
}
