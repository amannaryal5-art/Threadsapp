import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./hooks/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
    "./store/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: "1rem",
        lg: "1.5rem"
      },
      screens: {
        "2xl": "1440px"
      }
    },
    extend: {
      colors: {
        primary: "#FF6B6B",
        secondary: "#1A1F36",
        background: "#F8F8F8",
        surface: "#FFFFFF",
        success: "#22C55E",
        error: "#EF4444",
        sale: "#EF4444",
        new: "#8B5CF6"
      },
      boxShadow: {
        card: "0 10px 35px rgba(26, 31, 54, 0.08)",
        soft: "0 8px 24px rgba(26, 31, 54, 0.06)"
      },
      keyframes: {
        shimmer: {
          "0%": { backgroundPosition: "-468px 0" },
          "100%": { backgroundPosition: "468px 0" }
        },
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" }
        },
        bounceSoft: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-4px)" }
        }
      },
      animation: {
        shimmer: "shimmer 1.6s linear infinite",
        marquee: "marquee 24s linear infinite",
        bounceSoft: "bounceSoft 0.45s ease"
      },
      backgroundImage: {
        shimmer: "linear-gradient(to right, #f4f4f4 8%, #ececec 18%, #f4f4f4 33%)"
      }
    }
  },
  plugins: []
};

export default config;
