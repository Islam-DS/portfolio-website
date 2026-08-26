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
      renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    } catch {
      return; // no WebGL — the flat cream background stands on its own
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75));
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
    const base = Float32Array.from(
      (geo.attributes.position as THREE.BufferAttribute).array
    );
    const pos = geo.attributes.position as THREE.BufferAttribute;

    const mat = new THREE.MeshStandardMaterial({
      color: 0xf6f1e5,
      roughness: 1,
      metalness: 0,
      flatShading: true,
    });
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

    const tick = () => {
      raf = requestAnimationFrame(tick);
      if (!docVisible) return;

      const t = clock.getElapsedTime();
      scrollEased += (scrollN - scrollEased) * 0.05;
      mouse.x += (mouse.tx - mouse.x) * 0.03;
      mouse.y += (mouse.ty - mouse.y) * 0.03;

      // scroll pushes the wave field forward so the surface keeps changing
      const drift = scrollEased * 26;

      for (let i = 0; i < pos.count; i++) {
        const i3 = i * 3;
        const x = base[i3];
        const z = base[i3 + 2] + drift;
        // Shading comes from SLOPE, not height — long gentle waves read as a flat
        // field however tall they are. Shorter wavelengths give the normals
        // something to vary against.
        const y =
          Math.sin(x * 0.42 + t * 0.22) * 1.1 +
          Math.sin(z * 0.36 - t * 0.17) * 1.3 +
          Math.sin((x + z) * 0.26 + t * 0.13) * 0.8;
        pos.setY(i, y);
      }
      pos.needsUpdate = true;
      geo.computeVertexNormals();

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
