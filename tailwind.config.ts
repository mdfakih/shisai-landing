import type { Config } from "tailwindcss";
import animate from "tailwindcss-animate";

export default {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: { DEFAULT: "1.25rem", md: "2rem", xl: "2.5rem" },
      screens: { "2xl": "1360px" },
    },
    extend: {
      fontFamily: {
        sans: ["Archivo", "ui-sans-serif", "system-ui", "Segoe UI", "Roboto", "Helvetica Neue", "Arial", "sans-serif"],
        mono: ["ui-monospace", "SFMono-Regular", "Menlo", "Consolas", "Liberation Mono", "monospace"],
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        surface: "hsl(var(--surface))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
          bright: "hsl(var(--primary-bright))",
          deep: "hsl(var(--primary-deep))",
          hover: "hsl(var(--primary-hover))",
        },
        steel: {
          DEFAULT: "hsl(var(--steel))",
          light: "hsl(var(--steel-light))",
          dark: "hsl(var(--steel-dark))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      letterSpacing: {
        tightest: "-0.04em",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        marquee: {
          "0%": { transform: "translate3d(0,0,0)" },
          "100%": { transform: "translate3d(-50%,0,0)" },
        },
        float: {
          "0%, 100%": { transform: "translate3d(0,0,0)" },
          "50%": { transform: "translate3d(0,-10px,0)" },
        },
        sheen: {
          "0%": { transform: "translateX(-120%) skewX(-18deg)" },
          "100%": { transform: "translateX(220%) skewX(-18deg)" },
        },
        "pulse-ring": {
          "0%": { transform: "scale(0.9)", opacity: "0.7" },
          "100%": { transform: "scale(1.8)", opacity: "0" },
        },
        // Swipe hint: hand presses at +d, drags to -d, lifts. Trail and peek share the timing.
        "swipe-hand": {
          "0%": { transform: "translateX(var(--swipe-d))", opacity: "0" },
          "15%": { transform: "translateX(var(--swipe-d)) scale(0.9)", opacity: "1" },
          "60%": { transform: "translateX(calc(var(--swipe-d) * -1)) scale(0.9)", opacity: "1" },
          "78%, 100%": { transform: "translateX(calc(var(--swipe-d) * -1))", opacity: "0" },
        },
        "swipe-trail": {
          "0%, 15%": { transform: "scaleX(0)", opacity: "1" },
          "60%": { transform: "scaleX(1)", opacity: "1" },
          "78%, 100%": { transform: "scaleX(1)", opacity: "0" },
        },
        "swipe-peek": {
          "0%, 15%": { transform: "translateX(0)" },
          "60%": { transform: "translateX(-28px)" },
          "85%, 100%": { transform: "translateX(0)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        marquee: "marquee var(--marquee-duration, 40s) linear infinite",
        float: "float 7s ease-in-out infinite",
        sheen: "sheen 1.1s cubic-bezier(0.2, 0.7, 0.2, 1)",
        "pulse-ring": "pulse-ring 1.8s cubic-bezier(0.2, 0.6, 0.3, 1) infinite",
        "swipe-hand": "swipe-hand 1.9s cubic-bezier(0.45, 0, 0.25, 1) infinite",
        "swipe-trail": "swipe-trail 1.9s cubic-bezier(0.45, 0, 0.25, 1) infinite",
        "swipe-peek": "swipe-peek 1.9s cubic-bezier(0.45, 0, 0.25, 1) 2",
      },
    },
  },
  plugins: [animate],
} satisfies Config;
