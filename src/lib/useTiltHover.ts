import gsap from "gsap";

/**
 * Subtle perspective tilt on hover — gives cards a physical,
 * paper-like feel. Attaches to a list of DOM nodes (from
 * gsap.utils.toArray) rather than being a hook, since these cards
 * come from mapped data rather than one-per-component refs.
 */
export function attachTiltHover(elements: HTMLElement[], amount = 7) {
  if (window.matchMedia("(pointer: coarse), (prefers-reduced-motion: reduce)").matches) {
    return () => {};
  }

  const cleanups = elements.map((el) => {
    gsap.set(el, { transformPerspective: 1000 });
    const setRotateX = gsap.quickTo(el, "rotationX", { duration: 0.5, ease: "power3.out" });
    const setRotateY = gsap.quickTo(el, "rotationY", { duration: 0.5, ease: "power3.out" });
    const setLift = gsap.quickTo(el, "y", { duration: 0.5, ease: "power3.out" });

    const handleMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const relX = (e.clientX - rect.left) / rect.width - 0.5;
      const relY = (e.clientY - rect.top) / rect.height - 0.5;
      setRotateY(relX * amount);
      setRotateX(relY * -amount);
      setLift(-4);
    };
    const handleLeave = () => {
      setRotateX(0);
      setRotateY(0);
      setLift(0);
    };

    el.addEventListener("mousemove", handleMove);
    el.addEventListener("mouseleave", handleLeave);
    return () => {
      el.removeEventListener("mousemove", handleMove);
      el.removeEventListener("mouseleave", handleLeave);
    };
  });

  return () => cleanups.forEach((fn) => fn());
}
