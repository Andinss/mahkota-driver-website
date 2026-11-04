import type { Config } from "tailwindcss";
import plugin from "tailwindcss/plugin";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  safelist: [
    // Layout
    "w",
    "sec",
    "sf",
    "nv2",
    "c",
    "on",
    "dn",
    "open",
    "in",
    // Text & Button
    "y",
    "lead",
    "ey",
    "btn",
    "bd",
    "bo",
    "by",
    "sm",
    // Home Sections
    "hero",
    "hg",
    "txs",
    "tx",
    "ln",
    "sub",
    "cta",
    "trio",
    "stgs",
    "stg",
    "yc",
    "sky",
    "carimg",
    "ch",
    "ctl",
    "dots",
    "ar",
    "ab",
    "ph",
    "ck",
    "stats",
    "stat",
    "sx",
    "g3",
    "card",
    "ib",
    "why2",
    "wy",
    "wyl",
    "wyr",
    "wi",
    "wn",
    "fh",
    "lk",
    "tabs",
    "grid",
    "car",
    "cp",
    "bs",
    "cf",
    "go",
    "steps",
    "kt",
    "wa",
    "ktg",
    "kti",
    "so",
    // Layout Components
    "nb",
    "lg",
    "hm",
    "mm",
    "fo",
    // About Page
    "pg",
    "bk",
    "rv",
    "pgx",
    "pgh",
    "pgv",
    "pgi",
    "pgc",
    "c1",
    "c2",
    "pgb",
    "pgt",
    "pga",
    "km",
    "kg",
    "kc",
    "kn",
    "pgs",
    "pgz",
  ],
  theme: {
    extend: {
      colors: {
        // PALET WARNA EMAS & HITAM
        bg: "#FBF7EF", // Background putih tulang
        surf: "#FFFFFF", // Surface putih
        ink: "#1C1C1F", // Teks Hitam Pekat
        mu: "#6B6B6B", // Abu-abu
        ln: "#E8E2D2", // Garis border krem
        y: {
          DEFAULT: "#A9822E", // EMAS UTAMA
          light: "#C9A354", // Emas terang
          dark: "#8A691F", // Emas gelap
        },
        navy: "#1C1C1F", // Hitam untuk section gelap (Armada, Footer)
        nc: "#2A2A2E",
        gold: {
          DEFAULT: "#A9822E",
          light: "#C9A354",
          dark: "#8A691F",
        },
        brand: {
          black: "#1C1C1F",
          dark: "#2A2A2E",
          card: "#3A3A3E",
        },
      },
      fontFamily: {
        heading: ["var(--font-inter)", "system-ui", "sans-serif"],
        body: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
      boxShadow: {
        sm: "0 1px 2px 0 rgba(28, 28, 31, 0.05)",
        DEFAULT:
          "0 4px 6px -1px rgba(28, 28, 31, 0.05), 0 2px 4px -1px rgba(28, 28, 31, 0.03)",
        md: "0 10px 15px -3px rgba(28, 28, 31, 0.05), 0 4px 6px -2px rgba(28, 28, 31, 0.025)",
        lg: "0 20px 25px -5px rgba(28, 28, 31, 0.05), 0 10px 10px -5px rgba(28, 28, 31, 0.02)",
        xl: "0 25px 50px -12px rgba(28, 28, 31, 0.1)",
      },
      borderRadius: {
        "2xl": "1rem",
        "3xl": "1.5rem",
        "4xl": "2rem",
      },
    },
  },
  plugins: [
    plugin(function ({ addVariant }) {
      addVariant("coarse-pointer", "@media (pointer: coarse)");
    }),
  ],
};

export default config;
