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
        cinema: {
          navy: "#F7F3E9",
          deep: "#EEE6D4",
          surface: "#FCFAF4",
          elevated: "#FFFFFF",
          border: "rgba(24, 22, 15, 0.09)",
          text: "#18160F",
          muted: "#6E6656",
          soft: "#332F24",
          blue: "#2F5654",
          "blue-bright": "#3D716D",
          cyan: "#2F5654",
          violet: "#7A3434",
          purple: "#7A3434",
          gold: "#A97B33",
          warm: "#C89A53",
          ink: "#1B1914",
          "ink-deep": "#100F0B",
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
        // that a single long word still fits a 360px viewport. The maximum carries
        // the intended scale on desktop.
        "display-2xl": ["clamp(3.4rem,13vw,17.55rem)", { lineHeight: "0.92", letterSpacing: "-0.045em" }],
        "display-xl": ["clamp(3rem,11vw,12.15rem)", { lineHeight: "0.95", letterSpacing: "-0.04em" }],
        "display-lg": ["clamp(2.6rem,9vw,8.775rem)", { lineHeight: "1", letterSpacing: "-0.03em" }],
        "display-md": ["clamp(2.1rem,6.4vw,6.075rem)", { lineHeight: "1.05", letterSpacing: "-0.02em" }],
        "body-xl": ["clamp(1.86rem,1.62rem+0.81vw,2.36rem)", { lineHeight: "1.65" }],
        "body-lg": ["clamp(1.55rem,1.35rem+0.68vw,2.03rem)", { lineHeight: "1.7" }],
      },
      backgroundImage: {
        "hero-mesh":
          "radial-gradient(ellipse 70% 50% at 80% 10%, rgba(47,86,84,0.05) 0%, transparent 60%), radial-gradient(ellipse 50% 40% at 0% 100%, rgba(184,132,60,0.06) 0%, transparent 55%)",
        "section-glow":
          "radial-gradient(ellipse 100% 60% at 50% -10%, rgba(47,86,84,0.05) 0%, transparent 65%)",
        "card-shine":
          "linear-gradient(135deg, rgba(47,86,84,0.04) 0%, transparent 40%, transparent 60%, rgba(184,132,60,0.03) 100%)",
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
        cinema: "0 20px 60px -28px rgba(24, 22, 15, 0.22)",
        glow: "0 12px 40px -20px rgba(24, 22, 15, 0.18)",
        "glow-cyan": "0 12px 32px -18px rgba(47, 86, 84, 0.2)",
        "glow-violet": "0 12px 32px -18px rgba(122, 52, 52, 0.2)",
        "glow-gold": "0 12px 32px -18px rgba(169, 123, 51, 0.22)",
        portrait: "0 30px 80px -24px rgba(16, 15, 11, 0.4)",
      },
      transitionTimingFunction: {
        cinema: "cubic-bezier(0.16, 1, 0.3, 1)",
      },
    },
  },
  plugins: [],
};

export default config;
