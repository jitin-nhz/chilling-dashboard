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
        "bg-base": "#F4F6F8",
        "bg-card": "#FFFFFF",
        "bg-elevated": "#F0F2F5",
        "border-subtle": "#E0E4EA",
        "text-muted": "#64748B",
      },
      fontFamily: {
        mono: ["JetBrains Mono", "IBM Plex Mono", "ui-monospace", "monospace"],
      },
    },
  },
  plugins: [],
};
export default config;
