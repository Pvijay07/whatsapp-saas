/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#3b82f6", // Soft blue accent for active states
          container: "#2563eb",
          fixed: "#dbeafe",
          "fixed-dim": "#bfdbfe",
        },
        secondary: {
          DEFAULT: "#94a3b8",
          container: "#64748b",
          "fixed-dim": "#475569",
        },
        tertiary: {
          DEFAULT: "#cbd5e1",
          container: "#94a3b8",
          "fixed-dim": "#64748b",
        },
        background: "#121316", // Deep charcoal black for dashboard
        "on-background": "#ffffff",
        surface: {
          DEFAULT: "#181a1f", 
          dim: "#121316",
          bright: "#21232a",
          "container-lowest": "#111111",
          "container-low": "#181a1f",
          container: "#21232a",
          "container-high": "#2d2f36",
          "container-highest": "#3f414a",
        },
        "on-surface": "#ffffff",
        "on-surface-variant": "#94a3b8",
        "inverse-surface": "#ffffff",
        "inverse-on-surface": "#121316",
        outline: {
          DEFAULT: "#3f414a",
          variant: "#2d2f36",
        },
        error: {
          DEFAULT: "#ef4444",
          container: "#7f1d1d",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "Inter", "sans-serif"],
        headline: ["var(--font-sans)", "Inter", "sans-serif"], // Keep sans for dashboard
        mono: ["var(--font-mono)", "JetBrains Mono", "monospace"],
      },
      keyframes: {
        "fade-in-up": {
          "0%": { opacity: "0", transform: "translateY(15px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
      },
      animation: {
        "fade-in-up": "fade-in-up 0.4s ease-out forwards",
        "fade-in": "fade-in 0.3s ease-out forwards",
      },
    },
  },
  plugins: [],
};
