import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: "#06111f",
        panel: "#0d1628",
        panelSoft: "#101d35",
        line: "rgba(148, 163, 184, 0.16)",
        electric: "#3cc8ff",
        mint: "#4ce2c6",
        gold: "#f7c66d",
      },
      boxShadow: {
        glow: "0 24px 60px rgba(18, 124, 255, 0.18)",
      },
    },
  },
};

export default config;
