"use client";

import { useEffect, useRef } from "react";
import { GraduationCap, MapPin } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { education } from "@/data/education";
import { siteConfig } from "@/data/site";
import { SectionWrapper } from "@/components/effects/SectionWrapper";
import { SectionHeading } from "@/components/ui/SectionHeading";

// Chronological (school -> university); the data file is newest-first.
const records = [...education].reverse();

const STAMP_COLOR = { scholar: "#C2412D", done: "#2F5654" };

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
        <SectionHeading index="01" label="Education" title="Academic foundation" />
      </div>

      <div ref={sectionRef} className="cinema-container-full grid grid-cols-1 gap-16 overflow-x-clip py-10 lg:grid-cols-2 lg:gap-12">
        {records.map((item, i) => {
          const isScholar = Boolean(item.badge);
          const stampText = item.badge ?? item.period;
          const stampColor = isScholar ? STAMP_COLOR.scholar : STAMP_COLOR.done;
          const stampRot = isScholar ? -11 : 9;
          return (
            <article
              key={item.institution}
              data-diploma
              className="relative rounded-[6px] bg-[#FDFAF2] p-3 shadow-[0_30px_70px_-30px_rgba(24,22,15,0.45),0_2px_6px_rgba(24,22,15,0.08)] sm:p-4"
            >
              {/* double gold frame */}
              <div className="relative flex h-full flex-col border-[3px] border-cinema-gold/70 p-1.5">
                <div className="relative flex h-full flex-col items-center border border-cinema-gold/50 px-6 pb-14 pt-10 text-center sm:px-10 md:px-14 md:pt-14">
                  {/* corner ornaments */}
                  {["left-2 top-2", "right-2 top-2 rotate-90", "bottom-2 right-2 rotate-180", "bottom-2 left-2 -rotate-90"].map(
                    (pos) => (
                      <span key={pos} aria-hidden className={`absolute ${pos} h-6 w-6 border-l-2 border-t-2 border-cinema-gold/60`} />
                    )
                  )}

                  <span className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-cinema-gold/60 text-cinema-gold">
                    <GraduationCap className="h-8 w-8" strokeWidth={1.6} />
                  </span>

                  <p data-ink className="mt-6 font-mono text-[16.5px] uppercase tracking-[0.14em] text-cinema-muted">
                    Academic Record · {String(i + 1).padStart(2, "0")}
                  </p>

                  <h3
                    data-ink
                    className="mt-5 font-display text-[30px] font-bold leading-[1.1] tracking-tight text-cinema-text md:text-[38px] xl:text-[44px]"
                  >
                    {item.institution}
                  </h3>

                  <div className="mt-5 flex w-full items-center gap-4" aria-hidden>
                    <span className="h-px flex-1 bg-cinema-gold/50" />
                    <span className="h-2 w-2 rotate-45 bg-cinema-gold/70" />
                    <span className="h-px flex-1 bg-cinema-gold/50" />
                  </div>

                  <p data-ink className="mt-5 text-[20px] text-cinema-muted">
                    Student
                  </p>
                  <p data-ink className="font-serif text-[40px] italic leading-tight text-cinema-text md:text-[46px]">
                    {siteConfig.name}
                  </p>

                  <p data-ink className="mt-5 font-serif text-[30px] italic text-cinema-soft md:text-[34px]">
                    {item.degree}
                  </p>
                  <p data-ink className="mt-2 flex flex-wrap items-center justify-center gap-x-2 text-[20px] text-cinema-muted">
                    <MapPin className="h-4 w-4 shrink-0" />
                    {item.location} · {item.period}
                  </p>

                  <ul className="mt-8 w-full space-y-3 border-t border-cinema-gold/30 pt-6 text-left">
                    {item.highlights.map((h) => (
                      <li key={h} data-ink className="flex gap-3 text-[21.6px] leading-relaxed text-cinema-soft">
                        <span className="mt-3 h-1.5 w-1.5 shrink-0 rotate-45 bg-cinema-gold" />
                        {h}
                      </li>
                    ))}
                  </ul>

                  {/* signature line + rubber stamp on their own row, so the stamp
                      never sits on top of readable text */}
                  <div className="mt-10 flex w-full items-end justify-between gap-3 sm:gap-6">
                    <div data-ink className="text-left">
                      <span className="block h-px w-20 bg-cinema-text/40 sm:w-40" />
                      <span className="mt-2 block font-mono text-[15px] uppercase tracking-[0.1em] text-cinema-muted">
                        {item.location.split(",")[0]}
                      </span>
                    </div>

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
                        className="flex h-24 w-24 flex-col items-center justify-center rounded-full border-2 border-dashed px-2 font-display text-[11px] font-extrabold uppercase leading-tight tracking-tight sm:h-32 sm:w-32 sm:px-3 sm:text-[13.5px] md:h-36 md:w-36 md:text-[15px]"
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
                  className="absolute -top-8 hidden w-36 bg-white p-2 pb-6 shadow-cinema sm:block md:w-44"
                  style={{ [i === 0 ? "left" : "right"]: "-1.25rem", transform: `rotate(${i === 0 ? -7 : 6}deg)` }}
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
