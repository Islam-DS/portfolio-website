"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Building2, ChevronDown, MapPin } from "lucide-react";
import { work, type WorkItem } from "@/data/journey";
import { SectionWrapper } from "@/components/effects/SectionWrapper";
import { CountUpNumber } from "@/components/effects/CountUpNumber";
import { Emphasized } from "@/components/ui/Emphasized";
import { fadeInUp, viewportOnce } from "@/lib/motion";

const ACCENT = "#D9F99D";

/** Role details: meta, short points, and the full CV paragraph behind a toggle. */
function RoleDetail({ item, compact }: { item: WorkItem; compact?: boolean }) {
  const [open, setOpen] = useState(false);
  return (
    <div>
      {!compact && (
        <>
          <p className="font-mono text-[18.5px] text-white/75">{item.period}</p>
          <h3 className="mt-3 font-display text-[34px] font-bold uppercase leading-[1.02] tracking-tight text-white md:text-[46px] xl:text-[54px]">
            {item.title}
          </h3>
        </>
      )}
      <p className={`${compact ? "" : "mt-3 "}text-[22px] leading-snug text-white/85`}>{item.organization}</p>
      <div className="mt-3 flex flex-wrap gap-2.5">
        {item.department && (
          <span className="inline-flex items-center gap-2 rounded-full border border-white/15 px-3.5 py-1 text-[17px] text-white/75">
            <Building2 className="h-4 w-4 shrink-0" />
            {item.department}
          </span>
        )}
        {item.location && (
          <span className="inline-flex items-center gap-2 rounded-full border border-white/15 px-3.5 py-1 text-[17px] text-white/75">
            <MapPin className="h-4 w-4 shrink-0" />
            {item.location}
          </span>
        )}
      </div>

      <ul className="mt-8 space-y-4">
        {item.points.map((p) => (
          <li key={p} className="flex gap-4 text-[21.6px] leading-snug text-white/90 md:text-[23px]">
            <span className="mt-[0.45em] h-2.5 w-2.5 shrink-0 rotate-45" style={{ background: ACCENT }} />
            {p}
          </li>
        ))}
      </ul>

      {item.summary.length > 80 && (
        <div className="mt-8 border-t border-white/10 pt-5">
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            aria-expanded={open}
            className="inline-flex items-center gap-2 font-mono text-[16.5px] uppercase tracking-[0.1em] transition-opacity hover:opacity-80"
            style={{ color: ACCENT }}
          >
            {open ? "Hide full description" : "Read full description"}
            <ChevronDown className={`h-4 w-4 transition-transform duration-300 ${open ? "rotate-180" : ""}`} />
          </button>
          <AnimatePresence initial={false}>
            {open && (
              <motion.p
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                className="overflow-hidden text-[20px] leading-relaxed text-white/70"
              >
                <span className="block pt-4">
                  <Emphasized text={item.summary} phrases={item.emphasis} strongClassName="font-semibold text-white" />
                </span>
              </motion.p>
            )}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}

/**
 * Work experience on a black stage. Each role leads with its headline number from the CV (counting up)
 * on the left, and the selected role's short points sit in a panel on the
 * right, with the CV's full paragraph behind "Read full description".
 * Below lg the cards stack, each with its own details.
 */
export function Experience() {
  const [active, setActive] = useState(0);

  return (
    <SectionWrapper id="experience" className="overflow-hidden bg-cinema-ink-deep">
      <div className="cinema-container-full">
        <motion.header
          className="mb-12"
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          variants={fadeInUp}
        >
          <div className="mb-6 flex items-center gap-3">
            <span className="font-mono text-[18.9px] text-white/60">03</span>
            <span className="h-px w-8 bg-white/25" />
            <span className="section-label !text-white/80">Experience</span>
          </div>
          <h2 className="font-display text-display-md font-bold tracking-tight text-white">
            The journey{" "}
            <em className="pr-[0.08em] font-serif font-normal italic tracking-normal" style={{ color: ACCENT }}>
              so far
            </em>
          </h2>
        </motion.header>

        <div className="grid grid-cols-1 gap-5 lg:grid-cols-12 lg:gap-10">
          {/* Role cards */}
          <div className="flex flex-col gap-5 lg:col-span-5" role="tablist" aria-label="Roles">
            {work.map((item, i) => {
              const isActive = active === i;
              return (
                <div key={item.title}>
                  <button
                    type="button"
                    role="tab"
                    aria-selected={isActive}
                    onClick={() => setActive(i)}
                    onMouseEnter={() => setActive(i)}
                    className={`group relative w-full overflow-hidden rounded-[24px] border p-6 text-left transition-colors duration-300 md:p-7 ${
                      isActive
                        ? "border-transparent bg-white/[0.09]"
                        : "border-white/10 bg-white/[0.03] hover:border-white/25"
                    }`}
                  >
                    <span
                      aria-hidden
                      className="absolute inset-y-0 left-0 w-1.5 origin-top transition-transform duration-500"
                      style={{ background: ACCENT, transform: `scaleY(${isActive ? 1 : 0})` }}
                    />
                    <span className="flex flex-col gap-1 sm:flex-row sm:items-end sm:gap-4">
                      <CountUpNumber
                        value={item.stat.value}
                        suffix={item.stat.suffix}
                        className="whitespace-nowrap font-display text-[60px] font-extrabold leading-none tracking-tight text-[#D9F99D] md:text-[72px]"
                      />
                      <span className="text-[18px] leading-tight text-white/70 sm:mb-2 sm:max-w-[11rem]">{item.stat.label}</span>
                    </span>
                    <span className="mt-4 block font-display text-[22px] font-bold uppercase leading-tight tracking-tight text-white md:text-[24px]">
                      {item.title}
                    </span>
                    <span className="mt-1 flex flex-wrap justify-between gap-x-4 text-[17px] text-white/60">
                      <span>{item.organization.split(" · ").pop()}</span>
                      <span className="font-mono">{item.period}</span>
                    </span>
                  </button>

                  {/* Details inline below lg */}
                  <div className="px-2 pb-6 pt-8 lg:hidden">
                    <RoleDetail item={item} compact />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Detail panel (lg) */}
          <div className="hidden lg:col-span-7 lg:block">
            <div className="sticky top-28 rounded-[28px] border border-white/10 bg-white/[0.04] p-10 xl:p-12">
              <AnimatePresence mode="wait">
                <motion.div
                  key={active}
                  role="tabpanel"
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                >
                  <RoleDetail item={work[active]} />
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </SectionWrapper>
  );
}
