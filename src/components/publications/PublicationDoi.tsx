"use client";

import { useSyncExternalStore } from "react";

interface PublicationDoiProps {
  doi: string;
  link: string;
}

function subscribe() {
  return () => {};
}

function getClientSnapshot() {
  return true;
}

function getServerSnapshot() {
  return false;
}

/**
 * Renders DOI only after hydration so browser extensions (citation
 * managers that scan for DOI text) cannot cause server/client HTML
 * mismatches on the initial paint.
 */
export function PublicationDoi({ doi, link }: PublicationDoiProps) {
  const hydrated = useSyncExternalStore(subscribe, getClientSnapshot, getServerSnapshot);

  const label = `DOI: ${doi}`;
  // DOIs are one long unbreakable token — allow it to wrap or it forces
  // horizontal page scroll on narrow screens.
  const className =
    "break-all font-mono text-[16.2px] text-cinema-muted transition-colors hover:text-cinema-cyan sm:text-[18.9px]";

  if (!hydrated) {
    return (
      <span className={`${className} select-none`} aria-hidden suppressHydrationWarning>
        {label}
      </span>
    );
  }

  return (
    <a
      href={link}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
      suppressHydrationWarning
    >
      {label}
    </a>
  );
}
