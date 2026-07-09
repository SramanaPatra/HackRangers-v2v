/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        blossom: {
          DEFAULT: "#D6336C",
          light: "#F06595",
          dark: "#A61E4D",
        },
        petal: {
          DEFAULT: "#FFE9F0",
          soft: "#FFF3F7",
        },
        ink: {
          DEFAULT: "#4A1D2E",
          light: "#7A3A50",
        },
        cream: "#FFF9F6",
        sage: {
          DEFAULT: "#7C9885",
          light: "#A9C2AF",
          dark: "#56715D",
        },
        spark: {
          DEFAULT: "#E8A33D",
          light: "#F4C778",
        },
        butter: "#FDF6E2",
        sage2: "#E2F0D9",
        powder: "#FCE4EC",
        sky: "#E3F2FD",
        softred: "#FFEBEE",
        peach: "#FFF3E0",
      },
      fontFamily: {
        display: ["Fraunces", "serif"],
        body: ["Manrope", "sans-serif"],
        mono: ["IBM Plex Mono", "monospace"],
      },
      borderRadius: {
        card: "24px",
        bloom: "50%",
      },
      boxShadow: {
        soft: "0 8px 30px -8px rgba(74, 29, 46, 0.15)",
        lift: "0 12px 40px -10px rgba(214, 51, 108, 0.25)",
      },
      keyframes: {
        breathe: {
          "0%, 100%": { transform: "scale(0.85)", opacity: "0.7" },
          "50%": { transform: "scale(1.15)", opacity: "1" },
        },
        driftIn: {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        breathe: "breathe 8s ease-in-out infinite",
        driftIn: "driftIn 0.5s ease-out forwards",
      },
    },
  },
  plugins: [],
};