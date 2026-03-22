import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#0A7B8C",
        accent: "#F0A500",
        "surface-low": "#E8F5F0",
        success: "#2ECC71",
        warning: "#F39C12",
        danger: "#E74C3C",
        "neutral-900": "#1A1A2E",
        "neutral-100": "#F4F6F8",
        "bg-base": "#0F0F1A",
        "bg-card": "#16162A",
        "bg-elevated": "#1E1E35",
        "border-subtle": "#2A2A45",
        "text-muted": "#8888A8",
      },
      fontFamily: {
        mono: ["JetBrains Mono", "IBM Plex Mono", "ui-monospace", "monospace"],
      },
    },
  },
  plugins: [],
};
export default config;
