"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

const PARTICLE_COUNT = 2600;
// cinema.blue / blue-bright and cinema.gold / warm, as 0-1 rgb
const TEAL: [number, number, number] = [0.184, 0.337, 0.329];
const TEAL_BRIGHT: [number, number, number] = [0.239, 0.443, 0.427];
const GOLD: [number, number, number] = [0.663, 0.482, 0.2];
const WARM: [number, number, number] = [0.784, 0.604, 0.325];

function fibonacciSphere(count: number, radius: number) {
  const points = new Float32Array(count * 3);
  const goldenAngle = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < count; i++) {
    const y = 1 - (i / (count - 1)) * 2;
    const r = Math.sqrt(1 - y * y);
    const theta = goldenAngle * i;
    const x = Math.cos(theta) * r;
    const z = Math.sin(theta) * r;
    const jitter = 0.94 + Math.random() * 0.12;
    points[i * 3] = x * radius * jitter;
    points[i * 3 + 1] = y * radius * jitter;
    points[i * 3 + 2] = z * radius * jitter;
  }
  return points;
}

function scatterField(count: number, spread: number) {
  const points = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    // biased toward a thin disc so it reads as a starfield, not a cube
    const r = Math.pow(Math.random(), 0.5) * spread;
    const theta = Math.random() * Math.PI * 2;
    const y = (Math.random() - 0.5) * spread * 0.6;
    points[i * 3] = Math.cos(theta) * r;
    points[i * 3 + 1] = y;
    points[i * 3 + 2] = Math.sin(theta) * r;
  }
  return points;
}

export function HeroParticleField({ className }: { className?: string }) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const canvas = document.createElement("canvas");
    let width = container.clientWidth;
    let height = container.clientHeight;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 100);
    camera.position.z = 9;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    } catch {
      return; // no WebGL support — Hero still works fine without this layer
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setSize(width, height);
    container.appendChild(canvas);
    canvas.style.position = "absolute";
    canvas.style.inset = "0";

    const scatter = scatterField(PARTICLE_COUNT, 7.5);
    const orb = fibonacciSphere(PARTICLE_COUNT, 2.1);
    const current = new Float32Array(scatter);

    const colors = new Float32Array(PARTICLE_COUNT * 3);
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const isLeft = scatter[i * 3] < 0;
      const bright = Math.random() > 0.6;
      const c = isLeft ? (bright ? TEAL_BRIGHT : TEAL) : bright ? WARM : GOLD;
      colors[i * 3] = c[0];
      colors[i * 3 + 1] = c[1];
      colors[i * 3 + 2] = c[2];
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(current, 3));
    geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

    // A soft radial-gradient sprite (instead of the default hard square dot)
    // plus additive blending is what makes the particles read as a glowing
    // swarm — dense clusters (like the orb) brighten where dots overlap.
    const spriteCanvas = document.createElement("canvas");
    spriteCanvas.width = 64;
    spriteCanvas.height = 64;
    const sctx = spriteCanvas.getContext("2d")!;
    const gradient = sctx.createRadialGradient(32, 32, 0, 32, 32, 32);
    gradient.addColorStop(0, "rgba(255,255,255,1)");
    gradient.addColorStop(0.4, "rgba(255,255,255,0.6)");
    gradient.addColorStop(1, "rgba(255,255,255,0)");
    sctx.fillStyle = gradient;
    sctx.fillRect(0, 0, 64, 64);
    const spriteTexture = new THREE.CanvasTexture(spriteCanvas);

    const material = new THREE.PointsMaterial({
      size: 0.11,
      map: spriteTexture,
      vertexColors: true,
      transparent: true,
      opacity: 0.9,
      sizeAttenuation: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });

    const points = new THREE.Points(geometry, material);
    scene.add(points);

    let morphT = 0; // 0 = scattered starfield, 1 = orb
    let targetMorphT = 0;
    let rafId = 0;
    let visible = true;
    let clock = 0;

    const io = new IntersectionObserver(
      ([entry]) => {
        targetMorphT = entry.isIntersecting ? 1 : 0;
      },
      { threshold: 0.15 }
    );
    io.observe(container);

    const handleVisibility = () => {
      visible = document.visibilityState === "visible";
    };
    document.addEventListener("visibilitychange", handleVisibility);

    const posAttr = geometry.getAttribute("position") as THREE.BufferAttribute;

    const tick = () => {
      rafId = requestAnimationFrame(tick);
      if (!visible) return;

      morphT += (targetMorphT - morphT) * 0.03;
      clock += 0.0035;

      for (let i = 0; i < PARTICLE_COUNT; i++) {
        const ix = i * 3;
        const sx = scatter[ix];
        const sy = scatter[ix + 1];
        const sz = scatter[ix + 2];
        const ox = orb[ix];
        const oy = orb[ix + 1];
        const oz = orb[ix + 2];
        current[ix] = sx + (ox - sx) * morphT;
        current[ix + 1] = sy + (oy - sy) * morphT;
        current[ix + 2] = sz + (oz - sz) * morphT;
      }
      posAttr.needsUpdate = true;

      points.rotation.y = clock;
      points.rotation.x = Math.sin(clock * 0.4) * 0.08;

      renderer.render(scene, camera);
    };
    tick();

    const resizeObserver = new ResizeObserver(() => {
      width = container.clientWidth;
      height = container.clientHeight;
      if (width === 0 || height === 0) return;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    });
    resizeObserver.observe(container);

    return () => {
      cancelAnimationFrame(rafId);
      io.disconnect();
      resizeObserver.disconnect();
      document.removeEventListener("visibilitychange", handleVisibility);
      geometry.dispose();
      material.dispose();
      spriteTexture.dispose();
      renderer.dispose();
      container.removeChild(canvas);
    };
  }, []);

  return <div ref={containerRef} className={className} aria-hidden />;
}
