import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./hooks/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#F7F8FC",
        foreground: "#101828",
        sidebar: "#1A1F36",
        coral: "#FF6B6B",
        muted: "#F1F5F9",
        border: "#E5E7EB",
        success: "#16A34A",
        warning: "#F59E0B",
        danger: "#DC2626",
      },
      borderRadius: {
        xl: "1rem",
        "2xl": "1.25rem"
      },
      boxShadow: {
        soft: "0 12px 32px rgba(17, 24, 39, 0.08)"
      },
      backgroundImage: {
        fabric: "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.18) 1px, transparent 0)"
      }
    }
  },
  plugins: []
};

export default config;
