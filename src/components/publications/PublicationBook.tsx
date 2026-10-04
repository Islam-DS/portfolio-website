"use client";

import { Fragment, useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Check, Copy, ExternalLink } from "lucide-react";
import type { Publication } from "@/data/publications";
import { PublicationDoi } from "./PublicationDoi";

const COVERS = [
  { bg: "#1E3A38", spine: "#132826" },
  { bg: "#4A2424", spine: "#321717" },
];

function citationFor(pub: Publication) {
  const pages = pub.pages ? `, pp. ${pub.pages}` : "";
  return `${pub.authors} (${pub.year}). ${pub.title}. ${pub.venue}${pages}. https://doi.org/${pub.doi}`;
}

/** Wraps every verbatim occurrence of a highlight phrase in a <mark>. */
function Highlighted({ text, phrases }: { text: string; phrases?: string[] }) {
  const found = (phrases ?? []).filter((p) => text.includes(p));
  if (!found.length) return <>{text}</>;
  const escaped = found.map((p) => p.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
  const parts = text.split(new RegExp(`(${escaped.join("|")})`));
  return (
    <>
      {parts.map((part, i) =>
        found.includes(part) ? (
          <mark
            key={i}
            data-hl
            className="rounded-[3px] bg-no-repeat px-[0.08em] text-inherit [box-decoration-break:clone] [-webkit-box-decoration-break:clone]"
            style={{
              backgroundImage:
                "linear-gradient(transparent 14%, rgba(245,196,81,0.6) 14%, rgba(245,196,81,0.6) 90%, transparent 90%)",
              backgroundSize: "100% 100%",
              backgroundColor: "transparent",
            }}
          >
            {part}
          </mark>
        ) : (
          <Fragment key={i}>{part}</Fragment>
        )
      )}
    </>
  );
}

/** Deterministic, decorative barcode derived from the DOI's characters. */
function DoiBarcode({ doi }: { doi: string }) {
  const bars = Array.from(doi.replace(/\W/g, "")).map((c) => (c.charCodeAt(0) % 3) + 1);
  return (
    <span aria-hidden className="flex h-10 items-stretch gap-[2px]">
      {bars.map((w, i) => (
        <span key={i} className="bg-white/85" style={{ width: w }} />
      ))}
    </span>
  );
}

function CiteBlock({ pub }: { pub: Publication }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    await navigator.clipboard.writeText(citationFor(pub));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <div>
      <p className="font-mono text-[16.5px] uppercase tracking-[0.1em] text-cinema-gold">
        Cite this paper
      </p>
      <p className="mt-4 font-serif text-[22px] italic leading-snug text-cinema-soft [overflow-wrap:anywhere] md:text-[24px]">
        {citationFor(pub)}
      </p>
      <div className="mt-6 flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={copy}
          data-cursor
          className="inline-flex items-center gap-2 rounded-full bg-cinema-ink-deep px-5 py-2.5 text-[17.5px] font-semibold text-white transition-transform duration-300 hover:-translate-y-0.5"
        >
          {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
          {copied ? "Copied!" : "Copy citation"}
        </button>
        <a
          href={pub.link}
          target="_blank"
          rel="noopener noreferrer"
          data-cursor
          data-cursor-label="Read Paper"
          className="inline-flex items-center gap-2 rounded-full border border-black/15 px-5 py-2.5 text-[17.5px] font-semibold text-cinema-text transition-colors hover:bg-black/5"
        >
          View paper <ExternalLink className="h-4 w-4" />
        </a>
      </div>
      <div className="mt-5">
        <PublicationDoi doi={pub.doi} link={pub.link} />
      </div>
    </div>
  );
}

/**
 * One publication as a book. Desktop: a closed cover sits over the right
 * page and swings open to the left when scrolled into view (3D rotateY),
 * revealing a "Cite this paper" inside cover on the left and the paper on
 * the right, whose key phrases are then swept with a highlighter.
 * Below lg there's no flip: cover and page stack, highlighter still sweeps.
 *
 * Highlights are only phrases that appear verbatim in the real title or
 * abstract (see data/publications.ts); nothing is paraphrased or invented.
 */
export function PublicationBook({ pub, index }: { pub: Publication; index: number }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const coverRef = useRef<HTMLDivElement>(null);
  const cover = COVERS[index % COVERS.length];

  useEffect(() => {
    const root = rootRef.current;
    const coverEl = coverRef.current;
    if (!root || !coverEl) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const desktop = window.matchMedia("(min-width: 1024px)").matches;
    const marks = gsap.utils.toArray<HTMLElement>("[data-hl]", root);

    if (reduced) {
      if (desktop) gsap.set(coverEl, { rotationY: -180 });
      return;
    }

    gsap.set(marks, { backgroundSize: "0% 100%" });
    if (desktop) gsap.set(coverEl, { rotationY: 0, transformOrigin: "left center" });

    const tl = gsap.timeline({ paused: true });
    if (desktop) tl.to(coverEl, { rotationY: -180, duration: 1.5, ease: "power3.inOut" });
    tl.to(marks, { backgroundSize: "100% 100%", duration: 0.55, ease: "power2.out", stagger: 0.3 }, desktop ? "-=0.2" : 0);

    const st = ScrollTrigger.create({ trigger: root, start: "top 60%", once: true, onEnter: () => tl.play() });
    return () => {
      st.kill();
      tl.kill();
    };
  }, []);

  const type = pub.type ?? "Conference Paper";

  return (
    <div ref={rootRef} className="relative grid grid-cols-1 lg:grid-cols-2 lg:[perspective:2600px]">
      {/* Cover — closed over the right page; its back is the inside cover. */}
      <div
        ref={coverRef}
        data-book-cover
        className="relative z-10 lg:absolute lg:inset-y-0 lg:left-1/2 lg:w-1/2 lg:[transform-style:preserve-3d]"
      >
        {/* front */}
        <div
          className="relative flex h-full min-h-[420px] flex-col overflow-hidden rounded-l-md rounded-r-[22px] p-8 text-white shadow-portrait md:p-12 lg:absolute lg:inset-0 lg:[backface-visibility:hidden]"
          style={{ background: cover.bg }}
        >
          <span aria-hidden className="absolute inset-y-0 left-0 w-4" style={{ background: cover.spine }} />
          <span aria-hidden className="absolute inset-y-0 left-4 w-px bg-white/15" />
          <div className="relative flex h-full flex-col pl-4">
            <p className="font-mono text-[16.5px] uppercase tracking-[0.12em] text-white/70">
              {type} · {pub.year}
            </p>
            <h3 className="mt-8 font-display text-[32px] font-extrabold leading-[1.08] tracking-tight md:text-[40px] xl:text-[46px]">
              {pub.title}
            </h3>
            <p className="mt-6 text-[20px] text-white/80">{pub.authors}</p>
            <div className="mt-auto flex items-end justify-between gap-6 pt-10">
              <p className="max-w-[60%] text-[16.5px] leading-snug text-white/65">
                {pub.venue}
                {pub.pages && <> · pp. {pub.pages}</>}
              </p>
              <DoiBarcode doi={pub.doi} />
            </div>
          </div>
        </div>

        {/* back = inside cover (desktop only, faces the visitor once open) */}
        <div
          className="absolute inset-0 hidden rounded-l-[22px] rounded-r-md bg-[#EFE7D3] p-10 shadow-cinema lg:flex lg:flex-col lg:justify-between lg:[backface-visibility:hidden] lg:[transform:rotateY(180deg)] xl:p-14"
        >
          {/* bookplate */}
          <div aria-hidden className="flex items-baseline gap-3 text-cinema-gold">
            <span className="font-mono text-[15px] uppercase tracking-[0.12em]">No.</span>
            <span className="font-serif text-[120px] italic leading-[0.8]">{String(index + 1).padStart(2, "0")}</span>
          </div>
          <CiteBlock pub={pub} />
        </div>
      </div>

      {/* Right page */}
      <article className="relative rounded-b-[22px] bg-[#FDFAF2] p-8 shadow-cinema md:p-12 lg:col-start-2 lg:rounded-l-md lg:rounded-r-[22px] xl:p-14">
        {/* Below lg the cover sits directly above this page and already shows
            the title, authors and venue, so it isn't repeated here. */}
        <div className="mb-8 hidden lg:block">
          <p className="font-mono text-[16.5px] uppercase tracking-[0.12em] text-cinema-muted">
            {type} · {pub.year}
          </p>
          <h3 className="mt-5 font-display text-[28px] font-bold leading-[1.15] tracking-tight text-cinema-text md:text-[34px]">
            <Highlighted text={pub.title} phrases={pub.highlights} />
          </h3>
          <p className="mt-5 text-[21.6px] text-cinema-soft">{pub.authors}</p>
          <p className="mt-1 text-[19px] italic text-cinema-muted">
            {pub.venue}
            {pub.pages && <span className="not-italic"> · pp. {pub.pages}</span>}
          </p>
        </div>

        {pub.abstract && (
          <>
            <p className="font-mono text-[15px] uppercase tracking-[0.12em] text-cinema-gold">Abstract</p>
            <p className="mt-3 text-[21.6px] leading-relaxed text-cinema-soft">
              <Highlighted text={pub.abstract} phrases={pub.highlights} />
            </p>
          </>
        )}

        <p
          className={`text-[18.5px] text-cinema-muted ${
            pub.abstract ? "mt-8 border-t border-black/10 pt-5" : "lg:border-t lg:border-black/10 lg:pt-5"
          }`}
        >
          {pub.tags.join(" · ")}
        </p>

        {/* below lg the inside cover isn't shown, so the citation lives here */}
        <div className="mt-8 border-t border-black/10 pt-8 lg:hidden">
          <CiteBlock pub={pub} />
        </div>
      </article>
    </div>
  );
}
