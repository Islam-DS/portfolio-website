"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";

/**
 * The hero portrait, reconstructed from the artwork's own pixels.
 *
 * A small JPEG is sampled on the client: pixels darker than the near-white
 * studio background become particles, each keeping its source colour (so the
 * teal/gold/red paint strokes survive) lifted toward the accent palette so it
 * burns against the ink ground. The cloud assembles on load, breathes, pushes
 * away from the cursor, and disperses as the hero scrolls away.
 */

const SRC = "/images/hero-sample.jpg";
const SAMPLE_STEP = 2; // px between candidate samples
const MAX_POINTS = 22000;
const LUMA_CUTOFF = 0.78; // above this = studio background, dropped
const SAT_KEEP = 0.22; // bright but saturated (paint strokes) are kept anyway

interface Props {
  className?: string;
  /** Rendered underneath as a graceful fallback when WebGL is unavailable. */
  fallbackSrc?: string;
  fallbackAlt?: string;
}

export function ParticlePortrait({ className, fallbackSrc, fallbackAlt }: Props) {
  const hostRef = useRef<HTMLDivElement>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let disposed = false;
    let cleanup: (() => void) | null = null;

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = SRC;

    img.onerror = () => setFailed(true);
    img.onload = () => {
      if (disposed) return;

      // ---- sample the artwork -------------------------------------------------
      const sc = document.createElement("canvas");
      const iw = img.naturalWidth;
      const ih = img.naturalHeight;
      sc.width = iw;
      sc.height = ih;
      const sctx = sc.getContext("2d", { willReadFrequently: true });
      if (!sctx) return setFailed(true);
      sctx.drawImage(img, 0, 0);

      let data: Uint8ClampedArray;
      try {
        data = sctx.getImageData(0, 0, iw, ih).data;
      } catch {
        return setFailed(true); // tainted canvas — fall back to the flat image
      }

      const picked: { x: number; y: number; r: number; g: number; b: number }[] = [];
      for (let y = 0; y < ih; y += SAMPLE_STEP) {
        for (let x = 0; x < iw; x += SAMPLE_STEP) {
          const i = (y * iw + x) * 4;
          const r = data[i] / 255;
          const g = data[i + 1] / 255;
          const b = data[i + 2] / 255;
          const luma = 0.2126 * r + 0.7152 * g + 0.0722 * b;
          const sat = Math.max(r, g, b) - Math.min(r, g, b);
          if (luma > LUMA_CUTOFF && sat < SAT_KEEP) continue; // background
          picked.push({ x, y, r, g, b });
        }
      }
      if (!picked.length) return setFailed(true);

      // even thin-out to the budget, so density stays uniform
      const stride = Math.max(1, Math.ceil(picked.length / MAX_POINTS));
      const pts = picked.filter((_, i) => i % stride === 0);
      const COUNT = pts.length;

      // ---- three.js scene -----------------------------------------------------
      let W = host.clientWidth;
      let H = host.clientHeight;
      if (W === 0 || H === 0) return;

      const canvas = document.createElement("canvas");
      let renderer: THREE.WebGLRenderer;
      try {
        renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
      } catch {
        return setFailed(true);
      }
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      renderer.setSize(W, H);
      canvas.style.cssText = "position:absolute;inset:0;width:100%;height:100%;";
      host.appendChild(canvas);

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(46, W / H, 0.1, 100);
      camera.position.z = 10;

      // Frame to the SUBJECT, not the source file. The artwork has a lot of empty
      // studio background; mapping the full image would leave the figure small and
      // floating. Using the bounding box of kept pixels auto-fills the stage.
      let minX = iw;
      let maxX = 0;
      let minY = ih;
      let maxY = 0;
      for (const p of pts) {
        if (p.x < minX) minX = p.x;
        if (p.x > maxX) maxX = p.x;
        if (p.y < minY) minY = p.y;
        if (p.y > maxY) maxY = p.y;
      }
      const bw = Math.max(1, maxX - minX);
      const bh = Math.max(1, maxY - minY);
      const worldH = 8.4;
      const worldW = worldH * (bw / bh);

      const target = new Float32Array(COUNT * 3);
      const scatter = new Float32Array(COUNT * 3);
      const current = new Float32Array(COUNT * 3);
      const colors = new Float32Array(COUNT * 3);
      const seeds = new Float32Array(COUNT);

      for (let i = 0; i < COUNT; i++) {
        const p = pts[i];
        const i3 = i * 3;
        const bx = (p.x - minX) / bw;
        const by = (p.y - minY) / bh;
        target[i3] = (bx - 0.5) * worldW;
        target[i3 + 1] = -(by - 0.5) * worldH;
        target[i3 + 2] = (Math.random() - 0.5) * 0.55;

        // start as a wide drifting field that collapses into the portrait
        const a = Math.random() * Math.PI * 2;
        const rad = 7 + Math.random() * 10;
        scatter[i3] = Math.cos(a) * rad;
        scatter[i3 + 1] = Math.sin(a) * rad * 0.7;
        scatter[i3 + 2] = (Math.random() - 0.5) * 9;

        current[i3] = scatter[i3];
        current[i3 + 1] = scatter[i3 + 1];
        current[i3 + 2] = scatter[i3 + 2];

        // Every particle has to EMIT, regardless of how dark its source pixel was —
        // the subject wears a black suit, and mapping emission from source luminance
        // would make most of the figure invisible against the ink ground. Position
        // carries the likeness; colour carries the lighting design.
        const lum = 0.2126 * p.r + 0.7152 * p.g + 0.0722 * p.b;
        const sat = Math.max(p.r, p.g, p.b) - Math.min(p.r, p.g, p.b);
        if (sat > 0.16) {
          // real paint stroke — keep its hue, normalise to full brightness
          const m = Math.max(p.r, p.g, p.b) || 1;
          colors[i3] = Math.min(1, (p.r / m) * 0.98);
          colors[i3 + 1] = Math.min(1, (p.g / m) * 0.98);
          colors[i3 + 2] = Math.min(1, (p.b / m) * 0.98);
        } else {
          // neutral (suit, face, grid marks) — teal key left, amber rim right,
          // with luminance only modulating slightly around a bright floor
          const warm = (p.x - minX) / bw > 0.58;
          const base = 0.78 + lum * 0.28;
          colors[i3] = base * (warm ? 1.0 : 0.36);
          colors[i3 + 1] = base * (warm ? 0.72 : 0.92);
          colors[i3 + 2] = base * (warm ? 0.38 : 0.85);
        }
        seeds[i] = Math.random() * Math.PI * 2;
      }

      const geometry = new THREE.BufferGeometry();
      geometry.setAttribute("position", new THREE.BufferAttribute(current, 3));
      geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

      // soft round sprite — square points read as noise, not light
      const sp = document.createElement("canvas");
      sp.width = sp.height = 64;
      const spx = sp.getContext("2d")!;
      const grad = spx.createRadialGradient(32, 32, 0, 32, 32, 32);
      grad.addColorStop(0, "rgba(255,255,255,1)");
      grad.addColorStop(0.45, "rgba(255,255,255,0.9)");
      grad.addColorStop(0.75, "rgba(255,255,255,0.28)");
      grad.addColorStop(1, "rgba(255,255,255,0)");
      spx.fillStyle = grad;
      spx.fillRect(0, 0, 64, 64);
      const sprite = new THREE.CanvasTexture(sp);

      const material = new THREE.PointsMaterial({
        size: 0.09,
        map: sprite,
        vertexColors: true,
        transparent: true,
        opacity: 1,
        sizeAttenuation: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      });

      const points = new THREE.Points(geometry, material);
      scene.add(points);

      const posAttr = geometry.getAttribute("position") as THREE.BufferAttribute;

      // ---- interaction state --------------------------------------------------
      let assemble = 0; // 0 = scattered, 1 = portrait
      let assembleTarget = reduced ? 1 : 0;
      let disperse = 0; // scroll-driven, pushes back apart
      const mouse = new THREE.Vector3(9999, 9999, 0);
      const tilt = { x: 0, y: 0 };
      const tiltTo = { x: 0, y: 0 };
      let clock = 0;
      let raf = 0;
      let inView = true;
      let pageVisible = true;

      if (reduced) {
        current.set(target);
        posAttr.needsUpdate = true;
        renderer.render(scene, camera);
      } else {
        // small delay so the assembly reads as an entrance
        setTimeout(() => {
          assembleTarget = 1;
        }, 350);
      }

      const io = new IntersectionObserver(
        ([e]) => {
          inView = e.isIntersecting;
        },
        { threshold: 0.02 }
      );
      io.observe(host);

      const onVis = () => {
        pageVisible = document.visibilityState === "visible";
      };
      document.addEventListener("visibilitychange", onVis);

      const onMove = (e: MouseEvent) => {
        const r = host.getBoundingClientRect();
        const nx = ((e.clientX - r.left) / r.width) * 2 - 1;
        const ny = -(((e.clientY - r.top) / r.height) * 2 - 1);
        // unproject onto the z=0 plane the portrait sits on
        const v = new THREE.Vector3(nx, ny, 0.5).unproject(camera);
        const dir = v.sub(camera.position).normalize();
        const dist = -camera.position.z / dir.z;
        mouse.copy(camera.position).add(dir.multiplyScalar(dist));
        tiltTo.y = nx * 0.16;
        tiltTo.x = -ny * 0.1;
      };
      const onLeave = () => {
        mouse.set(9999, 9999, 0);
        tiltTo.x = 0;
        tiltTo.y = 0;
      };
      window.addEventListener("mousemove", onMove);
      host.addEventListener("mouseleave", onLeave);

      const onScroll = () => {
        const r = host.getBoundingClientRect();
        // 0 while the portrait is in place, ramps up as it leaves the top
        const past = Math.max(0, -r.top) / Math.max(1, r.height);
        disperse = Math.min(1, past * 1.35);
      };
      window.addEventListener("scroll", onScroll, { passive: true });
      onScroll();

      const tick = () => {
        raf = requestAnimationFrame(tick);
        if (!inView || !pageVisible) return;

        clock += 0.0042;
        assemble += (assembleTarget - assemble) * 0.028;
        tilt.x += (tiltTo.x - tilt.x) * 0.06;
        tilt.y += (tiltTo.y - tilt.y) * 0.06;

        const rep = 1.15; // cursor push radius, world units
        for (let i = 0; i < COUNT; i++) {
          const i3 = i * 3;
          const s = seeds[i];

          // breathing drift around the target position
          const bx = Math.sin(clock * 1.5 + s) * 0.045;
          const by = Math.cos(clock * 1.25 + s) * 0.045;
          const bz = Math.sin(clock + s) * 0.09;

          let tx = target[i3] + bx;
          let ty = target[i3 + 1] + by;
          let tz = target[i3 + 2] + bz;

          // blend between the wide field and the assembled portrait
          tx = scatter[i3] + (tx - scatter[i3]) * assemble;
          ty = scatter[i3 + 1] + (ty - scatter[i3 + 1]) * assemble;
          tz = scatter[i3 + 2] + (tz - scatter[i3 + 2]) * assemble;

          // scroll dispersal — outward along its own radius
          if (disperse > 0.001) {
            tx += tx * disperse * 1.5;
            ty += ty * disperse * 1.5;
            tz += (2 + s) * disperse * 1.2;
          }

          // cursor repulsion
          if (mouse.x < 9000) {
            const dx = current[i3] - mouse.x;
            const dy = current[i3 + 1] - mouse.y;
            const d2 = dx * dx + dy * dy;
            if (d2 < rep * rep) {
              const d = Math.sqrt(d2) || 0.0001;
              const f = (1 - d / rep) * 0.85;
              tx += (dx / d) * f;
              ty += (dy / d) * f;
            }
          }

          current[i3] += (tx - current[i3]) * 0.12;
          current[i3 + 1] += (ty - current[i3 + 1]) * 0.12;
          current[i3 + 2] += (tz - current[i3 + 2]) * 0.12;
        }
        posAttr.needsUpdate = true;

        points.rotation.x = tilt.x;
        points.rotation.y = tilt.y;
        material.opacity = 1 - disperse * 0.85;

        renderer.render(scene, camera);
      };
      if (!reduced) tick();

      const ro = new ResizeObserver(() => {
        W = host.clientWidth;
        H = host.clientHeight;
        if (!W || !H) return;
        camera.aspect = W / H;
        camera.updateProjectionMatrix();
        renderer.setSize(W, H);
      });
      ro.observe(host);

      // hint to the page that particles took over from the flat image
      host.dataset.particles = "on";

      cleanup = () => {
        cancelAnimationFrame(raf);
        io.disconnect();
        ro.disconnect();
        document.removeEventListener("visibilitychange", onVis);
        window.removeEventListener("mousemove", onMove);
        window.removeEventListener("scroll", onScroll);
        host.removeEventListener("mouseleave", onLeave);
        geometry.dispose();
        material.dispose();
        sprite.dispose();
        renderer.dispose();
        if (canvas.parentNode === host) host.removeChild(canvas);
        delete host.dataset.particles;
      };
    };

    return () => {
      disposed = true;
      img.onload = null;
      img.onerror = null;
      cleanup?.();
    };
  }, []);

  return (
    <div ref={hostRef} className={className} aria-hidden>
      {failed && fallbackSrc && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={fallbackSrc}
          alt={fallbackAlt ?? ""}
          className="absolute inset-0 h-full w-full object-contain"
        />
      )}
    </div>
  );
}
