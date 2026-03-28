import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        syne: ["Syne", "sans-serif"],
        mono: ["DM Mono", "monospace"],
      },
      colors: {
        cream: {
          50:  "#fdfaf4",
          100: "#f5f0e8",
          200: "#ede8de",
          300: "#e0d8c8",
        },
        ink: {
          DEFAULT: "#1a1208",
          soft:    "#3a2e1e",
          muted:   "rgba(26,18,8,0.45)",
        },
        maroon: {
          DEFAULT: "#c0392b",
          light:   "rgba(192,57,43,0.12)",
          border:  "rgba(192,57,43,0.25)",
        },
      },
    },
  },
  plugins: [],
};

export default config;