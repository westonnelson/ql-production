/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: '#00E0FF',
          light: '#33E6FF',
          dark: '#00B3CC',
        },
        primary: {
          DEFAULT: '#00E0FF',
          light: '#33E6FF',
          dark: '#00B3CC',
          foreground: '#FFFFFF',
        },
        border: {
          DEFAULT: '#E5E7EB',
        },
        input: {
          DEFAULT: '#F3F4F6',
        },
        ring: {
          DEFAULT: '#00E0FF',
        },
        background: '#FFFFFF',
        foreground: '#111827',
        muted: {
          DEFAULT: '#F3F4F6',
          foreground: '#6B7280',
        },
        card: {
          DEFAULT: '#FFFFFF',
          foreground: '#111827',
        },
        gradient: {
          start: '#0F1218',
          end: '#1A1F2B',
        }
      },
      boxShadow: {
        neon: '0 0 5px rgba(0, 224, 255, 0.5), 0 0 10px rgba(0, 224, 255, 0.3), 0 0 15px rgba(0, 224, 255, 0.1)',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
  ],
} 