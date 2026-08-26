"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { ArrowUpRight } from "lucide-react";
import { Project } from "@/data/projects";

/**
 * A large project tile whose thumbnail is a WebGL plane.
 *
 * On hover the image ripples outward from the pointer and lifts slightly
 * toward the camera — a real vertex displacement, so the distortion follows
 * the geometry rather than being a CSS filter faked on top of it.
 *
 * If WebGL is unavailable (or motion is reduced) the plain <img> underneath
 * stays visible and the tile degrades to a normal card.
 */

const VERT = `
  uniform float uHover;
  uniform float uTime;
  uniform vec2  uPointer;
  varying vec2  vUv;

  void main() {
    vUv = uv;
    vec3 p = position;

    // distance from the pointer, in local plane space
    float d = distance(uv, uPointer);
    // ring that travels outward while hovered
    float wave = sin(d * 14.0 - uTime * 3.2) * exp(-d * 3.4);
    p.z += wave * 0.16 * uHover;
    // gentle bulge toward the cursor
    p.z += (1.0 - smoothstep(0.0, 0.75, d)) * 0.1 * uHover;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
  }
`;

const FRAG = `
  uniform sampler2D uTex;
  uniform float uHover;
  uniform float uTime;
  uniform vec2  uPointer;
  uniform float uHasTex;
  varying vec2  vUv;

  void main() {
    vec2 uv = vUv;

    // refract the sample point along the same wave, and split the channels a
    // touch so the ripple reads as glass rather than a wobble
    float d = distance(uv, uPointer);
    float wave = sin(d * 14.0 - uTime * 3.2) * exp(-d * 3.4);
    vec2 off = normalize(uv - uPointer + 1e-5) * wave * 0.018 * uHover;

    float r = texture2D(uTex, uv - off * 1.25).r;
    float g = texture2D(uTex, uv - off).g;
    float b = texture2D(uTex, uv - off * 0.75).b;
    vec4 col = vec4(r, g, b, 1.0);

    // when there is no image, fall back to the paper tone so the tile still reads
    vec4 paper = vec4(0.937, 0.925, 0.886, 1.0);
    col = mix(paper, col, uHasTex);

    gl_FragColor = col;
  }
`;

export function ProjectTile({ project, index }: { project: Project; index: number }) {
  const hostRef = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    if (!project.image) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let width = host.clientWidth;
    let height = host.clientHeight;
    if (width === 0 || height === 0) return;

    const canvas = document.createElement("canvas");
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    } catch {
      return;
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setSize(width, height);
    canvas.style.position = "absolute";
    canvas.style.inset = "0";
    canvas.style.width = "100%";
    canvas.style.height = "100%";
    host.appendChild(canvas);

    const scene = new THREE.Scene();
    // orthographic-ish framing: plane exactly fills the viewport at z=0
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 20);
    camera.position.z = 2.4;
    const visH = 2 * Math.tan((45 * Math.PI) / 180 / 2) * camera.position.z;
    const visW = visH * (width / height);

    const uniforms = {
      uTex: { value: null as THREE.Texture | null },
      uHover: { value: 0 },
      uTime: { value: 0 },
      uPointer: { value: new THREE.Vector2(0.5, 0.5) },
      uHasTex: { value: 0 },
    };

    const geo = new THREE.PlaneGeometry(visW, visH, 48, 48);
    const mat = new THREE.ShaderMaterial({
      vertexShader: VERT,
      fragmentShader: FRAG,
      uniforms,
      transparent: true,
    });
    const mesh = new THREE.Mesh(geo, mat);
    scene.add(mesh);

    let disposed = false;
    const loader = new THREE.TextureLoader();
    loader.load(
      project.image,
      (tex) => {
        if (disposed) return;
        tex.colorSpace = THREE.SRGBColorSpace;
        tex.minFilter = THREE.LinearFilter;
        uniforms.uTex.value = tex;
        uniforms.uHasTex.value = 1;
        setReady(true);
      },
      undefined,
      () => {
        /* leave the plain <img> showing */
      }
    );

    const pointer = new THREE.Vector2(0.5, 0.5);
    let hoverTarget = 0;

    const onMove = (e: PointerEvent) => {
      const r = host.getBoundingClientRect();
      pointer.set((e.clientX - r.left) / r.width, 1 - (e.clientY - r.top) / r.height);
    };
    const onEnter = () => (hoverTarget = 1);
    const onLeave = () => (hoverTarget = 0);
    host.addEventListener("pointermove", onMove, { passive: true });
    host.addEventListener("pointerenter", onEnter);
    host.addEventListener("pointerleave", onLeave);

    let raf = 0;
    let onScreen = true;
    let docVisible = true;
    const io = new IntersectionObserver(([e]) => (onScreen = e.isIntersecting), {
      threshold: 0.02,
    });
    io.observe(host);
    const onVis = () => (docVisible = document.visibilityState === "visible");
    document.addEventListener("visibilitychange", onVis);

    const clock = new THREE.Clock();
    const tick = () => {
      raf = requestAnimationFrame(tick);
      if (!onScreen || !docVisible) return;
      // idle tiles cost nothing once the ripple has fully settled
      if (hoverTarget === 0 && uniforms.uHover.value < 0.001) {
        uniforms.uHover.value = 0;
        renderer.render(scene, camera);
        return;
      }
      uniforms.uTime.value = clock.getElapsedTime();
      uniforms.uHover.value += (hoverTarget - uniforms.uHover.value) * 0.08;
      uniforms.uPointer.value.lerp(pointer, 0.12);
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
      disposed = true;
      cancelAnimationFrame(raf);
      io.disconnect();
      ro.disconnect();
      document.removeEventListener("visibilitychange", onVis);
      host.removeEventListener("pointermove", onMove);
      host.removeEventListener("pointerenter", onEnter);
      host.removeEventListener("pointerleave", onLeave);
      uniforms.uTex.value?.dispose();
      geo.dispose();
      mat.dispose();
      renderer.dispose();
      if (canvas.parentNode === host) host.removeChild(canvas);
    };
  }, [project.image]);

  return (
    <a
      href={project.github}
      target="_blank"
      rel="noopener noreferrer"
      data-cursor
      data-cursor-label="View Repo"
      data-tile
      className="group relative block overflow-hidden rounded-[1.75rem] border border-black/10 bg-cinema-elevated transition-shadow duration-500 hover:shadow-cinema"
    >
      <div
        ref={hostRef}
        className="relative aspect-[16/10] w-full overflow-hidden bg-cinema-deep/30"
      >
        {/* real <img> underneath: it is what shows before the texture loads,
            on reduced-motion, and if WebGL is unavailable */}
        {project.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={project.image}
            alt={project.imageAlt ?? project.title}
            className={`absolute inset-0 h-full w-full object-contain p-5 transition-opacity duration-500 ${
              ready ? "opacity-0" : "opacity-100"
            }`}
            loading="lazy"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="font-mono text-[13px] uppercase tracking-[0.18em] text-cinema-muted/60">
              {project.language ?? "Repository"}
            </span>
          </div>
        )}
      </div>

      <div className="flex flex-col gap-3 p-7 md:p-8">
        <div className="flex items-center justify-between gap-4">
          <span className="font-mono text-[15px] uppercase tracking-[0.16em] text-cinema-muted/70">
            {String(index + 1).padStart(2, "0")} · {project.language}
          </span>
          <ArrowUpRight className="h-5 w-5 shrink-0 text-cinema-muted transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-cinema-blue" />
        </div>

        <h3 className="font-display text-[28px] font-semibold leading-tight text-cinema-text transition-colors duration-300 group-hover:text-cinema-blue md:text-[34px]">
          {project.title}
        </h3>

        <p className="line-clamp-3 text-[19px] leading-relaxed text-cinema-muted">
          {project.description}
        </p>

        <p className="mt-1 font-mono text-[14px] text-cinema-muted/60">
          {project.tags.slice(0, 3).join(" · ")}
        </p>
      </div>
    </a>
  );
}
