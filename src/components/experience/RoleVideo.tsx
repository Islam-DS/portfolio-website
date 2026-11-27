"use client";

import { useEffect, useRef } from "react";
import { Video } from "lucide-react";

/**
 * Short silent montage from a role. Plays (muted, looping) only while on
 * screen; people who prefer reduced motion get the poster and controls.
 */
export function RoleVideo({
  src,
  poster,
  label,
  caption,
  landscape,
}: {
  src: string;
  poster: string;
  label: string;
  caption: string;
  landscape?: boolean;
}) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      v.controls = true;
      return;
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) v.play().catch(() => {});
        else v.pause();
      },
      { threshold: 0.4 }
    );
    io.observe(v);
    return () => io.disconnect();
  }, []);

  return (
    <figure className="mt-8">
      <p className="mb-4 flex items-center gap-2 font-mono text-[15.5px] uppercase tracking-[0.1em] text-white/60">
        <Video className="h-4 w-4" /> {label}
      </p>
      <video
        ref={ref}
        poster={poster}
        muted
        loop
        playsInline
        preload="metadata"
        aria-label={caption}
        className={`${landscape ? "aspect-[4/3] max-w-[600px]" : "aspect-[4/5] max-w-[420px]"} w-full rounded-2xl border border-white/15 bg-black object-cover`}
      >
        {/* WebM (VP9) is smaller; MP4 (H.264) covers Safari and older browsers. */}
        <source src={src.replace(/\.mp4$/, ".webm")} type="video/webm" />
        <source src={src} type="video/mp4" />
      </video>
      <figcaption className="mt-3 text-[17px] text-white/60">{caption}</figcaption>
    </figure>
  );
}
