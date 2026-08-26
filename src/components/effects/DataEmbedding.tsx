"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

/**
 * A 3D embedding that resolves out of noise — the defining move of the field.
 *
 * Points begin as an unstructured cloud (raw high-dimensional expression data),
 * converge into five separated clusters (the PAM50 breast-cancer subtypes from
 * the BRCA project), hold, then dissolve back. It is the same operation as a
 * UMAP/t-SNE projection: structure emerging from something that looked random.
 *
 * Rendered as lit instanced spheres rather than glowing points, because the
 * page ground is cream — solid shaded geometry reads on paper, additive light
 * does not.
 */

const COUNT = 620;
const CLUSTERS = 5;
const CYCLE = 19; // seconds for one noise -> structure -> noise loop

// PAM50 subtypes, coloured from the site palette
const CLUSTER_COLORS = [
  0x2f5654, // teal        — Luminal A
  0x3d716d, // teal bright — Luminal B
  0xa97b33, // gold        — HER2-enriched
  0x7a3434, // maroon      — Basal-like
  0x6e6656, // muted       — Normal-like
];

const CLUSTER_CENTERS: [number, number, number][] = [
  [-1.35, 0.62, 0.35],
  [1.18, 0.95, -0.42],
  [1.42, -0.72, 0.55],
  [-0.95, -1.05, -0.62],
  [0.05, 0.1, 1.35],
];

function smoothstep(a: number, b: number, x: number) {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
}

export function DataEmbedding({ className }: { className?: string }) {
  const hostRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let width = host.clientWidth;
    let height = host.clientHeight;
    if (width === 0 || height === 0) return;

    const canvas = document.createElement("canvas");
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    } catch {
      return; // no WebGL — page is fine without this layer
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setSize(width, height);
    canvas.style.position = "absolute";
    canvas.style.inset = "0";
    canvas.style.width = "100%";
    canvas.style.height = "100%";
    host.appendChild(canvas);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    camera.position.set(0, 0, 7.6);

    // ---- point positions: noise state and resolved-cluster state
    const noise = new Float32Array(COUNT * 3);
    const structured = new Float32Array(COUNT * 3);
    const assign = new Int32Array(COUNT);

    for (let i = 0; i < COUNT; i++) {
      // unstructured: uniform inside a ball
      const u = Math.random();
      const r = 2.55 * Math.cbrt(u);
      const th = Math.random() * Math.PI * 2;
      const ph = Math.acos(2 * Math.random() - 1);
      noise[i * 3] = r * Math.sin(ph) * Math.cos(th);
      noise[i * 3 + 1] = r * Math.sin(ph) * Math.sin(th);
      noise[i * 3 + 2] = r * Math.cos(ph);

      // resolved: gaussian around one of the subtype centres
      const c = i % CLUSTERS;
      assign[i] = c;
      const [cx, cy, cz] = CLUSTER_CENTERS[c];
      const spread = 0.34;
      const g = () =>
        (Math.random() + Math.random() + Math.random() - 1.5) * spread * 1.4;
      structured[i * 3] = cx + g();
      structured[i * 3 + 1] = cy + g();
      structured[i * 3 + 2] = cz + g();
    }

    // ---- instanced spheres, lit like small physical beads on paper
    const geo = new THREE.SphereGeometry(0.062, 12, 10);
    const mat = new THREE.MeshStandardMaterial({ roughness: 0.55, metalness: 0.05 });
    const mesh = new THREE.InstancedMesh(geo, mat, COUNT);
    mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);

    const color = new THREE.Color();
    for (let i = 0; i < COUNT; i++) {
      color.setHex(CLUSTER_COLORS[assign[i]]);
      mesh.setColorAt(i, color);
    }
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
    scene.add(mesh);

    const key = new THREE.DirectionalLight(0xfff6e6, 2.1);
    key.position.set(-3.6, 5.2, 4.4);
    scene.add(key);
    scene.add(new THREE.HemisphereLight(0xf7f3e9, 0xc9ab7a, 1.0));
    const rim = new THREE.DirectionalLight(0x2f5654, 0.7);
    rim.position.set(4.4, -1.4, -3.0);
    scene.add(rim);

    // ---- interaction
    const tiltTo = { x: 0, y: 0 };
    const tilt = { x: 0, y: 0 };
    const coarse = window.matchMedia("(pointer: coarse)").matches;
    const onMove = (e: MouseEvent) => {
      const r = host.getBoundingClientRect();
      tiltTo.x = ((e.clientX - r.left) / r.width - 0.5) * 0.85;
      tiltTo.y = ((e.clientY - r.top) / r.height - 0.5) * 0.5;
    };
    const onLeave = () => {
      tiltTo.x = 0;
      tiltTo.y = 0;
    };
    if (!coarse) {
      window.addEventListener("mousemove", onMove, { passive: true });
      host.addEventListener("mouseleave", onLeave);
    }

    let raf = 0;
    let onScreen = true;
    let docVisible = true;
    const clock = new THREE.Clock();

    const io = new IntersectionObserver(([e]) => (onScreen = e.isIntersecting), {
      threshold: 0.02,
    });
    io.observe(host);
    const onVis = () => (docVisible = document.visibilityState === "visible");
    document.addEventListener("visibilitychange", onVis);

    const dummy = new THREE.Object3D();

    const tick = () => {
      raf = requestAnimationFrame(tick);
      if (!onScreen || !docVisible) return;

      const t = clock.getElapsedTime();
      const p = (t % CYCLE) / CYCLE;

      // trapezoid: converge, hold structured, disperse, hold noise
      const m =
        smoothstep(0.06, 0.34, p) - smoothstep(0.68, 0.92, p);

      tilt.x += (tiltTo.x - tilt.x) * 0.05;
      tilt.y += (tiltTo.y - tilt.y) * 0.05;

      for (let i = 0; i < COUNT; i++) {
        const i3 = i * 3;
        // a touch of per-point drift so the cloud never feels frozen
        const d = Math.sin(t * 0.6 + i * 0.7) * 0.018;
        dummy.position.set(
          noise[i3] + (structured[i3] - noise[i3]) * m + d,
          noise[i3 + 1] + (structured[i3 + 1] - noise[i3 + 1]) * m + d,
          noise[i3 + 2] + (structured[i3 + 2] - noise[i3 + 2]) * m
        );
        // points grow slightly as they resolve — signal gaining confidence
        const s = 0.78 + m * 0.42;
        dummy.scale.setScalar(s);
        dummy.updateMatrix();
        mesh.setMatrixAt(i, dummy.matrix);
      }
      mesh.instanceMatrix.needsUpdate = true;

      mesh.rotation.y = t * 0.14 + tilt.x;
      mesh.rotation.x = Math.sin(t * 0.22) * 0.14 + tilt.y;

      renderer.render(scene, camera);
    };
    tick();

    const ro = new ResizeObserver(() => {
      width = host.clientWidth;
      height = host.clientHeight;
      if (width === 0 || height === 0) return;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    });
    ro.observe(host);

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      ro.disconnect();
      document.removeEventListener("visibilitychange", onVis);
      window.removeEventListener("mousemove", onMove);
      host.removeEventListener("mouseleave", onLeave);
      geo.dispose();
      mat.dispose();
      mesh.dispose();
      renderer.dispose();
      if (canvas.parentNode === host) host.removeChild(canvas);
    };
  }, []);

  return (
    <div
      ref={hostRef}
      className={className}
      aria-hidden
      style={{
        WebkitMaskImage: "radial-gradient(closest-side, #000 62%, transparent 100%)",
        maskImage: "radial-gradient(closest-side, #000 62%, transparent 100%)",
      }}
    />
  );
}
