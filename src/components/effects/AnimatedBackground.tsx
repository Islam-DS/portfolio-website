"use client";



import { motion } from "framer-motion";
import { useMemo } from "react";

export function AnimatedBackground() {
  // Memoize grid lines for performance
  const gridLines = useMemo(() => {
    const lines = [];
    for (let i = 0; i < 20; i++) {
      lines.push(
        <motion.line
          key={"h-" + i}
          x1="0" y1={i * 48} x2="100%" y2={i * 48}
          stroke="rgba(120,180,255,0.07)"
          strokeWidth="1"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ delay: i * 0.12, duration: 2.5, ease: "easeInOut" }}
        />
      );
      lines.push(
        <motion.line
          key={"v-" + i}
          x1={i * 64} y1="0" x2={i * 64} y2="100%"
          stroke="rgba(120,180,255,0.07)"
          strokeWidth="1"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ delay: i * 0.12, duration: 2.5, ease: "easeInOut" }}
        />
      );
    }
    return lines;
  }, []);

  // Neural network node/connection overlay
  const neuralOverlay = useMemo(() => {
    const nodes = [];
    for (let i = 0; i < 7; i++) {
      for (let j = 0; j < 5; j++) {
        nodes.push(
          <motion.circle
            key={`n-${i}-${j}`}
            cx={120 + i * 180}
            cy={160 + j * 120}
            r={7 + ((i + j) % 2) * 2}
            fill="rgba(80,200,255,0.13)"
            style={{ filter: "blur(1.5px)" }}
            animate={{
              r: [7 + ((i + j) % 2) * 2, 11, 7 + ((i + j) % 2) * 2],
              opacity: [0.13, 0.22, 0.13],
            }}
            transition={{ duration: 6 + (i + j) * 0.5, repeat: Infinity, ease: "easeInOut" }}
          />
        );
      }
    }
    return nodes;
  }, []);

  // Data flow lines (animated)
  const dataTrajectories = useMemo(() => {
    return [
      <motion.path
        key="data1"
        d="M 0 300 Q 400 100 900 400 T 1920 200"
        stroke="rgba(56,189,248,0.18)"
        strokeWidth="2.5"
        fill="none"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: [0, 1, 0] }}
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
        style={{ filter: "blur(0.5px)" }}
      />, 
      <motion.path
        key="data2"
        d="M 0 600 Q 700 200 1600 700"
        stroke="rgba(139,92,246,0.13)"
        strokeWidth="2"
        fill="none"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: [0, 1, 0] }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        style={{ filter: "blur(0.7px)" }}
      />
    ];
  }, []);

  // Particle system (subtle, analytical)
  const particles = useMemo(() => {
    return Array.from({ length: 18 }).map((_, i) => (
      <motion.circle
        key={"p-" + i}
        cx={Math.random() * 1920}
        cy={Math.random() * 1080}
        r={1.7 + Math.random() * 1.7}
        fill="rgba(255,255,255,0.10)"
        animate={{
          cy: [Math.random() * 1080, Math.random() * 1080],
          opacity: [0.10, 0.22, 0.10],
        }}
        transition={{ duration: 12 + Math.random() * 8, repeat: Infinity, ease: "easeInOut", delay: i * 0.7 }}
        style={{ filter: "blur(0.5px)" }}
      />
    ));
  }, []);

  return (
    <motion.div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      {/* Layer 1: Cinematic gradients and glows */}
      <motion.div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 70% 20%, rgba(59,130,246,0.22) 0%, transparent 55%), " +
            "radial-gradient(ellipse 60% 50% at 10% 80%, rgba(139,92,246,0.18) 0%, transparent 50%), " +
            "radial-gradient(ellipse 50% 40% at 90% 90%, rgba(56,189,248,0.13) 0%, transparent 45%)",
        }}
        animate={{ opacity: [0.7, 1, 0.7] }}
        transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Layer 2: Analytical grid system */}
      <svg width="100%" height="100%" viewBox="0 0 1920 1080" className="absolute inset-0 w-full h-full" style={{ mixBlendMode: "soft-light" }}>
        {gridLines}
      </svg>

      {/* Layer 3: Neural network overlay */}
      <svg width="100%" height="100%" viewBox="0 0 1920 1080" className="absolute inset-0 w-full h-full" style={{ mixBlendMode: "lighten" }}>
        {neuralOverlay}
      </svg>

      {/* Layer 4: Data trajectories */}
      <svg width="100%" height="100%" viewBox="0 0 1920 1080" className="absolute inset-0 w-full h-full" style={{ mixBlendMode: "screen" }}>
        {dataTrajectories}
      </svg>

      {/* Layer 5: Analytical particles */}
      <svg width="100%" height="100%" viewBox="0 0 1920 1080" className="absolute inset-0 w-full h-full" style={{ mixBlendMode: "overlay" }}>
        {particles}
      </svg>

      {/* Layer 6: Subtle bloom/mesh overlay */}
      <motion.div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 120% 100% at 50% 100%, rgba(59,130,246,0.10) 0%, transparent 80%)",
          filter: "blur(32px)",
        }}
        animate={{ opacity: [0.5, 0.7, 0.5] }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Layer 7: Faint analytical grid (static, for depth) */}
      <div
        className="absolute inset-0 opacity-[0.018]"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.09) 1px, transparent 1px),linear-gradient(90deg, rgba(255,255,255,0.09) 1px, transparent 1px)`,
          backgroundSize: "64px 64px",
        }}
      />
    </motion.div>
  );
}
