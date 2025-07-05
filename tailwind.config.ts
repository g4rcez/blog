import typographyPlugin from "@tailwindcss/typography";
import { type Config } from "tailwindcss";

export default {
    content: ["./src/**/*.{js,jsx,ts,tsx,md,mjs}"],
    darkMode: "selector",
    theme: {
        fontSize: {
            xs: ["0.75rem", { lineHeight: "1rem" }],
            sm: ["0.875rem", { lineHeight: "1.5rem" }],
            base: ["1rem", { lineHeight: "2rem" }],
            lg: ["1.125rem", { lineHeight: "1.75rem" }],
            xl: ["1.25rem", { lineHeight: "2rem" }],
            "2xl": ["1.5rem", { lineHeight: "2.5rem" }],
            "3xl": ["2rem", { lineHeight: "2.5rem" }],
            "4xl": ["2.5rem", { lineHeight: "3rem" }],
            "5xl": ["3rem", { lineHeight: "3.5rem" }],
            "6xl": ["3.75rem", { lineHeight: "1" }],
            "7xl": ["4.5rem", { lineHeight: "1" }],
            "8xl": ["6rem", { lineHeight: "1" }],
            "9xl": ["8rem", { lineHeight: "1" }],
        },
        extend: {
            maxWidth: { "8xl": "88rem" },
            colors: {
                typography: "#aeaeae",
                primary: {
                    darkest: "oklch(12.9% 0.042 264.695)",
                    darker: "oklch(13% 0.028 261.692)",
                    DEFAULT: "#1e3a8a",
                    btn: "oklch(50% 0.134 242.749)",
                    "btn-hover": "oklch(39.1% 0.09 240.876)",
                    "btn-text": "#ffffff",
                },
                secondary: {
                    darker: "oklch(20.8% 0.042 265.755)",
                    DEFAULT: "oklch(21% 0.034 264.665)",
                    btn: "oklch(21% 0.034 264.665)",
                    "btn-hover": "oklch(21% 0.034 264.665)",
                    "btn-text": "#ffffff",
                },
                glow: {
                    left: "#93c5fd",
                    middle: "#93c5fd",
                    right: "#60a5fa",
                    divider: "oklch(27.9% 0.041 260.031)",
                    light: "#ffffff",
                    glass: "#121212"
                }
            },
            fontFamily: {
                sans: "var(--font-inter)",
                display: ["var(--font-lexend)", { fontFeatureSettings: '"ss01"' }],
            },
        },
    },
    plugins: [typographyPlugin],
} satisfies Config;
