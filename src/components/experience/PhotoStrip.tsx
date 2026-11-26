"use client";

import { useCallback, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Camera, ChevronLeft, ChevronRight, X } from "lucide-react";
import type { WorkPhoto } from "@/data/journey";

/** Thumbnail path next to the full image: foo.jpg -> foo-thumb.jpg */
const thumbOf = (src: string) => src.replace(/(\.\w+)$/, "-thumb$1");

/**
 * Photos from a role, as evidence. The thumbnails deal out from a stack once
 * (a short flip-through), then a click opens a full-size viewer with captions.
 */
export function PhotoStrip({
  photos,
  accent,
  label = "From the classroom",
  tone = "dark",
}: {
  photos: WorkPhoto[];
  accent: string;
  label?: string;
  /** Background the strip sits on. */
  tone?: "dark" | "light";
}) {
  const light = tone === "light";
  const [open, setOpen] = useState<number | null>(null);
  const reduce = useReducedMotion();
  const n = photos.length;

  const close = useCallback(() => setOpen(null), []);
  const step = useCallback((d: number) => setOpen((i) => (i === null ? i : (i + d + n) % n)), [n]);

  useEffect(() => {
    if (open === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
    };
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, close, step]);

  return (
    <div className="mt-8">
      <p
        className={`mb-4 flex items-center gap-2 font-mono text-[15.5px] uppercase tracking-[0.1em] ${
          light ? "text-cinema-muted" : "text-white/60"
        }`}
      >
        <Camera className="h-4 w-4" /> {label}
      </p>
      <ul className="grid max-w-[640px] grid-cols-3 gap-3">
        {photos.map((p, i) => (
          <motion.li
            key={p.src}
            initial={reduce ? false : { opacity: 0, x: `${-(i * 100 + i * 4)}%`, rotate: (i - 1) * 7, scale: 0.92 }}
            whileInView={{ opacity: 1, x: "0%", rotate: 0, scale: 1 }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{ duration: 0.7, delay: 0.15 + (n - 1 - i) * 0.12, ease: [0.16, 1, 0.3, 1] }}
            style={{ zIndex: n - i }}
            className="relative"
          >
            <button
              type="button"
              onClick={() => setOpen(i)}
              aria-label={`Open photo: ${p.caption}`}
              className={`group block w-full overflow-hidden rounded-2xl border ${
                light ? "border-black/10 bg-black/5 shadow-cinema" : "border-white/15 bg-white/5"
              }`}
            >
              <img
                src={thumbOf(p.src)}
                alt={p.alt}
                loading="lazy"
                className="aspect-[4/3] w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </button>
          </motion.li>
        ))}
      </ul>

      {typeof document !== "undefined" &&
        createPortal(
          <AnimatePresence>
            {open !== null && (
              <motion.div
                key="viewer"
                role="dialog"
                aria-modal="true"
                aria-label="Photo viewer"
                className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black/90 p-4 md:p-10"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={close}
              >
                <button
                  type="button"
                  onClick={close}
                  aria-label="Close"
                  className="absolute right-4 top-4 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20"
                >
                  <X className="h-6 w-6" />
                </button>
                <motion.img
                  key={photos[open].src}
                  src={photos[open].src}
                  alt={photos[open].alt}
                  initial={{ opacity: 0, scale: 0.97 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.25 }}
                  onClick={(e) => e.stopPropagation()}
                  className="max-h-[78vh] max-w-full rounded-2xl object-contain"
                />
                <div className="mt-5 flex items-center gap-5" onClick={(e) => e.stopPropagation()}>
                  {n > 1 && (
                    <button
                      type="button"
                      onClick={() => step(-1)}
                      aria-label="Previous photo"
                      className="flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20"
                    >
                      <ChevronLeft className="h-6 w-6" />
                    </button>
                  )}
                  <p className="max-w-xl text-center text-[19px] text-white/85">
                    {photos[open].caption}
                    <span className="ml-3 font-mono text-[15.5px] text-white/50">
                      {open + 1} / {n}
                    </span>
                  </p>
                  {n > 1 && (
                    <button
                      type="button"
                      onClick={() => step(1)}
                      aria-label="Next photo"
                      className="flex h-12 w-12 items-center justify-center rounded-full text-cinema-ink"
                      style={{ background: accent }}
                    >
                      <ChevronRight className="h-6 w-6" />
                    </button>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>,
          document.body
        )}
    </div>
  );
}
