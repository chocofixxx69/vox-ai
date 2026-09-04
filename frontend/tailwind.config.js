/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // "Humanized" Professional Palette
        // Primary: Deep, trustworthy Medical Blue
        primary: {
          50: '#f0f9ff', // Lightest Alice Blue
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9', // Sky/Blue base
          600: '#0284c7', // Main Action Blue (Trust)
          700: '#0369a1', // Hover state
          800: '#075985',
          900: '#0c4a6e', // Deep Navy for text/footers
          950: '#082f49',
        },
        // Secondary/Accent: Soft Teal (Calming, Healing)
        accent: {
          50: '#f0fdfa',
          100: '#ccfbf1',
          500: '#14b8a6', // Teal
          600: '#0d9488',
        },
        // Neutrals: Warm Greys (Sand/Slate mix) for a more "human" feel than cold grays
        slate: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569', // Body text
          700: '#334155',
          800: '#1e293b', // Headings
          900: '#0f172a',
          950: '#020617',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 4px 20px -2px rgba(0, 0, 0, 0.05)',
        'glow': '0 0 15px rgba(14, 165, 233, 0.3)',
      }
    },
  },
  plugins: [],
}