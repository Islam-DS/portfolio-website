"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

/**
 * A single matte form resting on the page, lit and casting a real shadow.
 *
 * This is deliberately NOT emissive. Additive/glowing geometry needs a dark
 * ground to burn against; lit solid geometry catches light instead, which is
 * why it belongs on the cream palette. The whole effect is one mesh, one key
 * light, and a shadow-catching plane.
 */
export function ClayInstrument({ className }: { className?: string }) {
  const hostRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let width = host.clientWidth;
    let height = host.clientHeight;
    if (width === 0 || height === 0) return;

    let renderer: THREE.WebGLRenderer;
    const canvas = document.createElement("canvas");
    try {
      renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    } catch {
      return; // no WebGL — the page is fine without this layer
    }

    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setSize(width, height);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    canvas.style.position = "absolute";
    canvas.style.inset = "0";
    canvas.style.width = "100%";
    canvas.style.height = "100%";
    host.appendChild(canvas);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 100);
    camera.position.set(0, 0.9, 7.4);
    camera.lookAt(0, -0.1, 0);

    // ---- the form: an icosphere pushed around by a few low-frequency waves,
    // so it reads as something scanned rather than a primitive.
    const geo = new THREE.IcosahedronGeometry(1.55, 24);
    const pos = geo.attributes.position as THREE.BufferAttribute;
    const v = new THREE.Vector3();
    for (let i = 0; i < pos.count; i++) {
      v.fromBufferAttribute(pos, i);
      const n = v.clone().normalize();
      const d =
        0.17 * Math.sin(2.6 * n.x + 1.1) * Math.cos(2.1 * n.y) +
        0.12 * Math.sin(3.1 * n.y + 0.4) * Math.cos(2.4 * n.z) +
        0.08 * Math.cos(3.6 * n.z - 0.9);
      v.copy(n).multiplyScalar(1.55 + d);
      pos.setXYZ(i, v.x, v.y, v.z);
    }
    geo.computeVertexNormals();

    const mat = new THREE.MeshStandardMaterial({
      color: 0xefe8d9, // barely above the paper — form is read by shading, not colour
      roughness: 0.96,
      metalness: 0,
      flatShading: false,
    });
    const mesh = new THREE.Mesh(geo, mat);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    mesh.position.y = 0.15;
    scene.add(mesh);

    // ---- shadow catcher: invisible plane that only renders the shadow,
    // so the form appears to sit on the page itself.
    const floor = new THREE.Mesh(
      new THREE.PlaneGeometry(24, 24),
      new THREE.ShadowMaterial({ opacity: 0.17 })
    );
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = -1.95;
    floor.receiveShadow = true;
    scene.add(floor);

    // ---- lighting: key from upper-left-front, warm bounce from the paper below
    const key = new THREE.DirectionalLight(0xfff6e6, 1.85);
    key.position.set(-4.2, 6.4, 4.6);
    key.castShadow = true;
    key.shadow.mapSize.set(1024, 1024);
    key.shadow.camera.near = 1;
    key.shadow.camera.far = 22;
    key.shadow.camera.left = -6;
    key.shadow.camera.right = 6;
    key.shadow.camera.top = 6;
    key.shadow.camera.bottom = -6;
    key.shadow.bias = -0.0012;
    key.shadow.radius = 9;
    scene.add(key);

    // hemisphere fill: sky is the cream page, ground bounces a little warmth back up
    scene.add(new THREE.HemisphereLight(0xf7f3e9, 0xc9ab7a, 0.8));
    // subtle teal rim from behind-right to keep it from going flat
    const rim = new THREE.DirectionalLight(0x2f5654, 0.85);
    rim.position.set(5.2, -1.2, -3.4);
    scene.add(rim);

    // ---- interaction
    const tiltTo = { x: 0, y: 0 };
    const tilt = { x: 0, y: 0 };
    const coarse = window.matchMedia("(pointer: coarse)").matches;
    const onMove = (e: MouseEvent) => {
      const r = host.getBoundingClientRect();
      tiltTo.x = ((e.clientX - r.left) / r.width - 0.5) * 0.9;
      tiltTo.y = ((e.clientY - r.top) / r.height - 0.5) * 0.55;
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
    let t = 0;

    const io = new IntersectionObserver(([e]) => (onScreen = e.isIntersecting), {
      threshold: 0.02,
    });
    io.observe(host);
    const onVis = () => (docVisible = document.visibilityState === "visible");
    document.addEventListener("visibilitychange", onVis);

    const tick = () => {
      raf = requestAnimationFrame(tick);
      if (!onScreen || !docVisible) return;

      t += 0.0022;
      tilt.x += (tiltTo.x - tilt.x) * 0.05;
      tilt.y += (tiltTo.y - tilt.y) * 0.05;

      mesh.rotation.y = t + tilt.x;
      mesh.rotation.x = Math.sin(t * 0.7) * 0.09 + tilt.y;
      mesh.position.y = 0.15 + Math.sin(t * 1.6) * 0.07; // slow breathing lift

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
      floor.geometry.dispose();
      (floor.material as THREE.Material).dispose();
      renderer.dispose();
      if (canvas.parentNode === host) host.removeChild(canvas);
    };
  }, []);

  return (
    <div
      ref={hostRef}
      className={className}
      aria-hidden
      // Feather the edges so the cast shadow can never hard-clip against the
      // canvas bounds — without this the shadow reads as a grey rectangle.
      style={{
        WebkitMaskImage: "radial-gradient(closest-side, #000 58%, transparent 100%)",
        maskImage: "radial-gradient(closest-side, #000 58%, transparent 100%)",
      }}
    />
  );
}
