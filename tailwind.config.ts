import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        green: {
          50:  "#f0faf4",
          100: "#dcf5e7",
          200: "#b9e9cf",
          300: "#85d5a8",
          400: "#4db87b",
          500: "#2d9b5a",
          600: "#237d48",
          700: "#1d643a",
          800: "#1a5030",
          900: "#164229",
          950: "#0b2b1c",
        },
        accent: "#f4a226",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
      boxShadow: {
        soft:          "0 2px 12px rgba(0,0,0,.06)",
        card:          "0 4px 24px rgba(0,0,0,.08)",
        "card-hover":  "0 8px 40px rgba(0,0,0,.14)",
        "green-glow":  "0 0 40px rgba(35,125,72,.4)",
        "green-sm":    "0 0 18px rgba(35,125,72,.25)",
      },
      animation: {
        "fade-in":     "fadeIn .4s ease both",
        "slide-up":    "slideUp .55s cubic-bezier(.22,1,.36,1) both",
        "slide-left":  "slideLeft .55s cubic-bezier(.22,1,.36,1) both",
        "float":       "float 7s ease-in-out infinite",
        "float-slow":  "float 11s ease-in-out infinite",
        "float-fast":  "float 4s ease-in-out infinite",
        "sway":        "sway 3.5s ease-in-out infinite",
        "morph":       "morph 12s ease-in-out infinite",
        "shimmer":     "shimmer 2.5s linear infinite",
        "pulse-green": "pulseGreen 2.5s ease-in-out infinite",
        "bounce-soft": "bounceSoft 3s ease-in-out infinite",
        "scale-in":    "scaleIn .35s cubic-bezier(.34,1.56,.64,1) both",
        "spin-slow":   "spin 10s linear infinite",
        "wiggle":      "wiggle .45s ease-in-out",
      },
      keyframes: {
        fadeIn:    { from: { opacity: "0" }, to: { opacity: "1" } },
        slideUp:   { from: { opacity: "0", transform: "translateY(24px)" }, to: { opacity: "1", transform: "translateY(0)" } },
        slideLeft: { from: { opacity: "0", transform: "translateX(-24px)" }, to: { opacity: "1", transform: "translateX(0)" } },
        float: {
          "0%, 100%": { transform: "translateY(0px) rotate(0deg)" },
          "33%":      { transform: "translateY(-16px) rotate(5deg)" },
          "66%":      { transform: "translateY(-9px) rotate(-3deg)" },
        },
        sway: {
          "0%, 100%": { transform: "rotate(-6deg)" },
          "50%":      { transform: "rotate(6deg)" },
        },
        morph: {
          "0%, 100%": { borderRadius: "62% 38% 46% 54%/60% 44% 56% 40%" },
          "33%":      { borderRadius: "40% 60% 65% 35%/45% 60% 40% 55%" },
          "66%":      { borderRadius: "55% 45% 35% 65%/55% 40% 60% 45%" },
        },
        shimmer: {
          "0%":   { backgroundPosition: "-500px 0" },
          "100%": { backgroundPosition: "500px 0" },
        },
        pulseGreen: {
          "0%, 100%": { boxShadow: "0 0 0 0 rgba(35,125,72,.4)" },
          "50%":      { boxShadow: "0 0 0 14px rgba(35,125,72,0)" },
        },
        bounceSoft: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%":      { transform: "translateY(-8px)" },
        },
        scaleIn: {
          from: { opacity: "0", transform: "scale(0.88)" },
          to:   { opacity: "1", transform: "scale(1)" },
        },
        wiggle: {
          "0%, 100%": { transform: "rotate(-4deg)" },
          "50%":      { transform: "rotate(4deg)" },
        },
      },
    },
  },
  plugins: [],
};
export default config;
