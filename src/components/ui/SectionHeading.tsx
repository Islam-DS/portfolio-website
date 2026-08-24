"use client";

import { motion } from "framer-motion";
import { fadeInUp, viewportOnce } from "@/lib/motion";
import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  index: string;
  label: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  className?: string;
}

export function SectionHeading({
  index,
  label,
  title,
  description,
  align = "left",
  className,
}: SectionHeadingProps) {
  const isCenter = align === "center";

  return (
    <motion.header
      className={cn(
        "mb-16 md:mb-24",
        isCenter && "mx-auto max-w-4xl text-center",
        className
      )}
      initial="hidden"
      whileInView="visible"
      viewport={viewportOnce}
      variants={fadeInUp}
    >
      <div
        className={cn(
          "mb-6 flex items-center gap-3",
          isCenter && "justify-center"
        )}
      >
        <span className="font-mono text-[18.9px] text-cinema-muted/60">{index}</span>
        <span className="h-px w-8 bg-white/15" />
        <span className="section-label">{label}</span>
      </div>
      <h2 className="font-display text-display-md font-bold tracking-tight text-cinema-text">
        {title}
      </h2>
      {description && (
        <p
          className={cn(
            "mt-6 max-w-2xl text-body-lg text-cinema-muted",
            isCenter && "mx-auto"
          )}
        >
          {description}
        </p>
      )}
    </motion.header>
  );
}
