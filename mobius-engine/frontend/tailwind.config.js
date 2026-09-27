/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        stark: {
          bg: "#070b12",
          panel: "rgba(11, 18, 30, 0.85)",
          cyan: "#00f0ff",
          cyanGlow: "rgba(0, 240, 255, 0.3)",
          amber: "#f59e0b",
          amberGlow: "rgba(245, 158, 11, 0.3)",
          crimson: "#ef4444",
          crimsonGlow: "rgba(239, 68, 68, 0.3)",
          purple: "#c084fc",
          purpleGlow: "rgba(192, 132, 252, 0.3)",
        },
      },
      fontFamily: {
        mono: ['"JetBrains Mono"', 'Consolas', 'monospace'],
        sans: ['"Inter"', 'system-ui', 'sans-serif'],
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'scanline': 'scanline 6s linear infinite',
      },
      keyframes: {
        scanline: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(1000%)' },
        },
      },
    },
  },
  plugins: [],
}

