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
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      fontFamily: {
        sans: ["var(--font-pixels)"],
        pixel: ["var(--font-pixels)"],
        vt323: ["var(--font-vt323)"],
      },
      backgroundImage: {
        'main': "url('/background/main.png')",
        'bottom': "url('/background/bottom.png')",
      },
    },
  },
  plugins: [],
};
export default config;
