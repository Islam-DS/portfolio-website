import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/sections/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Dark ground. Luminous particle work needs darkness to add light to —
        // on the previous cream ground additive blending had nothing to burn against.
        cinema: {
          navy: "#07090A", // page ground (blue-black, biased toward the teal accent)
          deep: "#0B1012", // recessed
          surface: "#0C1112",
          elevated: "#121819", // cards
          border: "rgba(150, 190, 190, 0.14)",
          text: "#E6EDEC",
          muted: "#8A9B99",
          soft: "#C3CFCD",
          blue: "#4FD1C0", // teal signal, lifted so it glows on ink
          "blue-bright": "#6FE3D4",
          cyan: "#4FD1C0",
          violet: "#D2685F",
          purple: "#D2685F",
          gold: "#E0A455",
          warm: "#EFC182",
          // "ink" used to mean inverted-dark on a light page. On a dark page the
          // emphasis device becomes elevation instead, so these read as raised panels.
          ink: "#0D1214",
          "ink-deep": "#05070A",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        display: ["var(--font-display)", "system-ui", "sans-serif"],
        serif: ["var(--font-serif)", "Georgia", "serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      fontSize: {
        // The clamp MINIMUM applies on narrow screens, so it has to be small enough
        // that a single long word still fits a 360px viewport. The maximum is what
        // carries the intended scale on desktop.
        "display-2xl": ["clamp(3.4rem,13vw,17.55rem)", { lineHeight: "0.92", letterSpacing: "-0.045em" }],
        "display-xl": ["clamp(3rem,11vw,12.15rem)", { lineHeight: "0.95", letterSpacing: "-0.04em" }],
        "display-lg": ["clamp(2.6rem,9vw,8.775rem)", { lineHeight: "1", letterSpacing: "-0.03em" }],
        "display-md": ["clamp(2.1rem,6.4vw,6.075rem)", { lineHeight: "1.05", letterSpacing: "-0.02em" }],
        "body-xl": ["clamp(1.86rem,1.62rem+0.81vw,2.36rem)", { lineHeight: "1.65" }],
        "body-lg": ["clamp(1.55rem,1.35rem+0.68vw,2.03rem)", { lineHeight: "1.7" }],
      },
      backgroundImage: {
        "hero-mesh":
          "radial-gradient(ellipse 70% 50% at 78% 8%, rgba(79,209,192,0.10) 0%, transparent 62%), radial-gradient(ellipse 55% 45% at 4% 96%, rgba(224,164,85,0.08) 0%, transparent 58%)",
        "section-glow":
          "radial-gradient(ellipse 100% 60% at 50% -10%, rgba(79,209,192,0.07) 0%, transparent 65%)",
        "card-shine":
          "linear-gradient(135deg, rgba(79,209,192,0.05) 0%, transparent 40%, transparent 60%, rgba(224,164,85,0.04) 100%)",
        "hero-overlay":
          "linear-gradient(115deg, rgba(22,19,16,0.92) 0%, rgba(34,31,26,0.78) 38%, rgba(34,31,26,0.45) 65%, rgba(34,31,26,0.2) 100%)",
      },
      animation: {
        "gradient-flow": "gradient-flow 12s ease infinite",
        float: "float 8s ease-in-out infinite",
        "pulse-glow": "pulse-glow 4s ease-in-out infinite",
        "spin-slow": "spin 20s linear infinite",
      },
      keyframes: {
        "gradient-flow": {
          "0%, 100%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0) scale(1)" },
          "50%": { transform: "translateY(-16px) scale(1.02)" },
        },
        "pulse-glow": {
          "0%, 100%": { opacity: "0.5" },
          "50%": { opacity: "0.85" },
        },
      },
      boxShadow: {
        cinema: "0 24px 70px -30px rgba(0, 0, 0, 0.75)",
        glow: "0 14px 46px -22px rgba(0, 0, 0, 0.7)",
        "glow-cyan": "0 14px 40px -20px rgba(79, 209, 192, 0.26)",
        "glow-violet": "0 14px 40px -20px rgba(210, 104, 95, 0.24)",
        "glow-gold": "0 14px 40px -20px rgba(224, 164, 85, 0.26)",
        portrait: "0 34px 90px -28px rgba(0, 0, 0, 0.85)",
      },
      transitionTimingFunction: {
        cinema: "cubic-bezier(0.16, 1, 0.3, 1)",
      },
    },
  },
  plugins: [],
};

export default config;
