import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        playfair: ['var(--font-playfair)', 'serif'],
      },
      colors: {
        brand: {
          DEFAULT: '#FF6B35',
          dark: '#e85c28',
          navy: '#0B2545',
        },
      },
      gridTemplateColumns: {
        'seat-4': '1fr 1fr 8px 1fr 1fr',
      },
    },
  },
  plugins: [],
}
export default config
