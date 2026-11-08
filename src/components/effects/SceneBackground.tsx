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

    // Render at the screen's size once so the baked image covers any window.
    const width = Math.max(window.screen.width, window.innerWidth);
    const height = Math.max(window.screen.height, window.innerHeight);

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
    renderer.setPixelRatio(1);
    renderer.setSize(width, height, false);

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

    // Baked ONCE into a flat image, then WebGL is shut down. A live WebGL
    // canvas — even one that never re-renders — sat as a translucent
    // full-screen layer the browser re-blended on every scroll frame, which
    // was the site's main source of lag (~33-180ms frames without GPU
    // compositing). Here the waves are rendered a single time, composited
    // onto the cream ground at the old 50% strength in a 2D canvas, and set
    // as one opaque background image: the cheapest layer a browser can draw.
    uniforms.uTime.value = 6;
    uniforms.uDrift.value = 4;
    renderer.render(scene, camera);

    const flat = document.createElement("canvas");
    flat.width = width;
    flat.height = height;
    const ctx = flat.getContext("2d");
    let cancelled = false;
    if (ctx) {
      ctx.fillStyle = "#F7F3E9";
      ctx.fillRect(0, 0, width, height);
      ctx.globalAlpha = 0.5;
      ctx.drawImage(canvas, 0, 0, width, height);
      flat.toBlob(
        (blob) => {
          if (!blob || cancelled) return;
          host.style.backgroundImage = `url(${URL.createObjectURL(blob)})`;
        },
        "image/jpeg",
        0.9
      );
    }

    geo.dispose();
    mat.dispose();
    renderer.dispose();
    renderer.forceContextLoss();

    return () => {
      cancelled = true;
      const url = host.style.backgroundImage.match(/url\("?(blob:[^")]+)"?\)/)?.[1];
      if (url) URL.revokeObjectURL(url);
      host.style.backgroundImage = "";
    };
  }, []);

  return (
    <div
      ref={hostRef}
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-[5] bg-cover bg-center"
    />
  );
}
