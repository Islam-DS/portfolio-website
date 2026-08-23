"use client";

import { cn } from "@/lib/utils";

interface SectionWrapperProps {
  id: string;
  children: React.ReactNode;
  className?: string;
}

export function SectionWrapper({ id, children, className }: SectionWrapperProps) {
  return (
    <section id={id} className={cn("relative scroll-mt-24 py-28 md:py-36 lg:py-44", className)}>
      {children}
    </section>
  );
}
