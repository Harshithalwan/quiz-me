import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    fontFamily: {
      sans: ['"PT Sans"', "sans-serif"],
    },
    extend: {
      colors: {
        text: {
          50: "#e9f9fb",
          100: "#d4f4f7",
          200: "#a8e9f0",
          300: "#7ddde8",
          400: "#52d2e0",
          500: "#26c7d9",
          600: "#1f9fad",
          700: "#177782",
          800: "#0f5057",
          900: "#08282b",
          950: "#041416",
        },
        background: {
          50: "#e9f9fb",
          100: "#d3f3f8",
          200: "#a8e7f0",
          300: "#7cdae9",
          400: "#51cee1",
          500: "#25c2da",
          600: "#1e9bae",
          700: "#167483",
          800: "#0f4e57",
          900: "#07272c",
          950: "#041316",
        },
        primary: {
          50: "#e9f9fb",
          100: "#d4f2f7",
          200: "#a9e6ef",
          300: "#7ed9e7",
          400: "#53cddf",
          500: "#28c0d7",
          600: "#209aac",
          700: "#187381",
          800: "#104d56",
          900: "#08262b",
          950: "#041316",
        },
        secondary: {
          50: "#ebf8fa",
          100: "#d7f1f4",
          200: "#afe3e9",
          300: "#87d5de",
          400: "#5fc8d3",
          500: "#37bac8",
          600: "#2c95a0",
          700: "#216f78",
          800: "#164a50",
          900: "#0b2528",
          950: "#051314",
        },
        accent: {
          50: "#fcf0e8",
          100: "#fae1d1",
          200: "#f4c3a4",
          300: "#efa476",
          400: "#ea8648",
          500: "#e4681b",
          600: "#b75315",
          700: "#893e10",
          800: "#5b2a0b",
          900: "#2e1505",
          950: "#170a03",
        },
      },

      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
    },
  },
  plugins: [require("daisyui")],
};
export default config;
