"use client";

import { motion } from "framer-motion";

const PATH = "M -40 340 C 220 420, 420 60, 680 130 C 920 190, 1080 20, 1340 90";

export function JourneyPath() {
  return (
    <svg
      className="pointer-events-none absolute inset-0 h-full w-full"
      viewBox="0 0 1300 460"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden
    >
      <motion.path
        d={PATH}
        stroke="rgba(201,154,70,0.35)"
        strokeWidth="1.5"
        strokeDasharray="2 10"
        strokeLinecap="round"
        fill="none"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 2.2, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
      />

      {/* endpoint markers */}
      <g>
        <circle cx="-40" cy="340" r="5" fill="#C99A46" />
        <circle cx="-40" cy="340" r="10" fill="none" stroke="#C99A46" strokeOpacity="0.4" strokeWidth="1" />
        <text x="-40" y="368" textAnchor="middle" fill="rgba(255,255,255,0.55)" fontSize="13" fontFamily="var(--font-sans)">
          Dhaka
        </text>
      </g>
      <g>
        <circle cx="1340" cy="90" r="5" fill="#C99A46" />
        <circle cx="1340" cy="90" r="10" fill="none" stroke="#C99A46" strokeOpacity="0.4" strokeWidth="1" />
        <text x="1300" y="70" textAnchor="middle" fill="rgba(255,255,255,0.55)" fontSize="13" fontFamily="var(--font-sans)">
          Almaty
        </text>
      </g>

      {/* traveling pulse */}
      <motion.circle
        r="4"
        fill="#E0B978"
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 1, 1, 0] }}
        transition={{ duration: 6, delay: 2.6, repeat: Infinity, ease: "linear" }}
      >
        <animateMotion
          dur="6s"
          begin="2.6s"
          repeatCount="indefinite"
          path={PATH}
        />
      </motion.circle>
      <motion.circle
        r="9"
        fill="none"
        stroke="#E0B978"
        strokeWidth="1"
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 0.5, 0.5, 0] }}
        transition={{ duration: 6, delay: 2.6, repeat: Infinity, ease: "linear" }}
      >
        <animateMotion
          dur="6s"
          begin="2.6s"
          repeatCount="indefinite"
          path={PATH}
        />
      </motion.circle>
    </svg>
  );
}
