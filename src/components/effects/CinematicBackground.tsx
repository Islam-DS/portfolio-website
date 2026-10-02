/**
 * Static paper ground behind every section. It used to scrub its background
 * colour with scroll, which repainted this full-screen layer on every scroll
 * frame for a barely visible tint change — removed for smoothness.
 */
export function CinematicBackground() {
  return (
    <div
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-cinema-navy"
      aria-hidden
    >
      <div className="absolute inset-0 bg-hero-mesh" />
      <div className="noise-overlay absolute inset-0" />
    </div>
  );
}
