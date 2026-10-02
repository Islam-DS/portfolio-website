"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

/**
 * Site-wide 3D backdrop: a large, softly-lit surface that undulates behind
 * every section.
 *
 * Constraints that shape it:
 *  - Text sits on top of this everywhere, so contrast has to stay very low.
 *    Form is carried by shading against the paper, never by colour.
 *  - The ground is cream, so this is lit geometry, not emissive particles —
 *    additive light has nothing to burn against on a light background.
 *  - Scroll advances the wave phase and swings the camera, so the surface is
 *    never the same twice down the page instead of looping in place.
 */

const SEG = 56; // grid resolution — keep modest, normals are recomputed per frame

export function SceneBackground() {
  const hostRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let width = window.innerWidth;
    let height = window.innerHeight;

    const canvas = document.createElement("canvas");
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        canvas,
        alpha: true,
        antialias: false,
        powerPreference: "low-power",
      });
    } catch {
      return; // no WebGL — the flat cream background stands on its own
    }
    // A soft, half-opacity backdrop gains nothing from retina resolution;
    // rendering below 1x keeps the GPU from competing with scrolling.
    renderer.setPixelRatio(0.75);
    renderer.setSize(width, height);
    canvas.style.position = "absolute";
    canvas.style.inset = "0";
    canvas.style.width = "100%";
    canvas.style.height = "100%";
    host.appendChild(canvas);

    const scene = new THREE.Scene();
    // Steep look-down so the surface fills the frame. A shallower angle shows the
    // plane's far edge, which reads as a hard horizon — a dune, not a backdrop.
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 220);
    camera.position.set(0, 13, 7);
    camera.lookAt(0, 0, -1);

    const geo = new THREE.PlaneGeometry(120, 120, SEG, SEG);
    geo.rotateX(-Math.PI / 2);

    const mat = new THREE.MeshStandardMaterial({
      color: 0xf6f1e5,
      roughness: 1,
      metalness: 0,
      flatShading: true,
    });
    // Waves are displaced in the vertex shader rather than on the CPU: the old
    // per-frame loop over every vertex plus computeVertexNormals() ran on the
    // main thread and stalled scrolling. flatShading derives face normals from
    // screen-space derivatives, so no normals need recomputing at all.
    const uniforms = { uTime: { value: 0 }, uDrift: { value: 0 } };
    mat.onBeforeCompile = (shader) => {
      shader.uniforms.uTime = uniforms.uTime;
      shader.uniforms.uDrift = uniforms.uDrift;
      shader.vertexShader = shader.vertexShader
        .replace("#include <common>", "#include <common>\nuniform float uTime;\nuniform float uDrift;")
        .replace(
          "#include <begin_vertex>",
          `vec3 transformed = vec3(position);
          float wz = position.z + uDrift;
          transformed.y =
            sin(position.x * 0.42 + uTime * 0.22) * 1.1 +
            sin(wz * 0.36 - uTime * 0.17) * 1.3 +
            sin((position.x + wz) * 0.26 + uTime * 0.13) * 0.8;`
        );
    };
    const mesh = new THREE.Mesh(geo, mat);
    scene.add(mesh);

    // warm key from the upper left, cool bounce from the other side, so ridges
    // pick up a faint gold edge and troughs go slightly teal
    const key = new THREE.DirectionalLight(0xfff4e0, 2.0);
    key.position.set(-8, 11, 6);
    scene.add(key);
    const fill = new THREE.DirectionalLight(0x2f5654, 0.55);
    fill.position.set(9, 3, -5);
    scene.add(fill);
    scene.add(new THREE.HemisphereLight(0xf7f3e9, 0xc7a86f, 0.85));

    const mouse = { x: 0, y: 0, tx: 0, ty: 0 };
    const coarse = window.matchMedia("(pointer: coarse)").matches;
    const onMove = (e: MouseEvent) => {
      mouse.tx = (e.clientX / window.innerWidth - 0.5) * 2;
      mouse.ty = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    if (!coarse) window.addEventListener("mousemove", onMove, { passive: true });

    let scrollN = 0; // 0..1 down the document
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      scrollN = max > 0 ? window.scrollY / max : 0;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    let raf = 0;
    let docVisible = true;
    const onVis = () => (docVisible = document.visibilityState === "visible");
    document.addEventListener("visibilitychange", onVis);

    const clock = new THREE.Clock();
    let scrollEased = scrollN;
    let lastRender = -1;

    const tick = () => {
      raf = requestAnimationFrame(tick);
      if (!docVisible) return;

      const t = clock.getElapsedTime();
      // The waves move slowly enough that 30fps is indistinguishable from 60,
      // and it halves the GPU time competing with scroll.
      if (t - lastRender < 1 / 30) return;
      lastRender = t;
      // easing factors doubled to keep the same feel at the halved frame rate
      scrollEased += (scrollN - scrollEased) * 0.1;
      mouse.x += (mouse.tx - mouse.x) * 0.06;
      mouse.y += (mouse.ty - mouse.y) * 0.06;

      // scroll pushes the wave field forward so the surface keeps changing
      uniforms.uTime.value = t;
      uniforms.uDrift.value = scrollEased * 26;

      camera.position.x = mouse.x * 1.6;
      camera.position.y = 13 - mouse.y * 0.8 - scrollEased * 1.2;
      camera.lookAt(0, 0, -1);

      renderer.render(scene, camera);
    };
    tick();

    const onResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      document.removeEventListener("visibilitychange", onVis);
      geo.dispose();
      mat.dispose();
      renderer.dispose();
      if (canvas.parentNode === host) host.removeChild(canvas);
    };
  }, []);

  return (
    <div
      ref={hostRef}
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-[5] opacity-[0.5]"
    />
  );
}
