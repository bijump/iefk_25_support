import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        neon: {
          green: '#39ff14',
          blue: '#00ffff',
          pink: '#ff00ff',
          yellow: '#e9ff00',
          orange: '#ff4500',
        },
      },
    },
  },
  plugins: [],
} satisfies Config;
