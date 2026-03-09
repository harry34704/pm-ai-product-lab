import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./hooks/**/*.{ts,tsx}",
    "./store/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        background: "hsl(220 22% 8%)",
        foreground: "hsl(214 27% 96%)",
        muted: "hsl(220 18% 16%)",
        card: "hsl(220 20% 11%)",
        border: "hsl(220 16% 22%)",
        primary: "hsl(158 79% 45%)",
        accent: "hsl(191 91% 44%)",
        danger: "hsl(1 70% 55%)"
      },
      fontFamily: {
        display: ["Avenir Next", "Segoe UI", "sans-serif"],
        body: ["IBM Plex Sans", "Aptos", "Segoe UI", "sans-serif"]
      },
      boxShadow: {
        glow: "0 10px 60px rgba(6, 182, 212, 0.16)"
      },
      borderRadius: {
        xl: "1.25rem",
        "2xl": "1.5rem"
      }
    }
  },
  plugins: []
};

export default config;
