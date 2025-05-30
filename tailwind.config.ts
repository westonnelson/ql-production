import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        border: '#E5E7EB',
        input: '#F3F4F6',
        ring: '#00E0FF',
        background: '#FFFFFF',
        foreground: '#111827',
        primary: {
          DEFAULT: '#00E0FF',
          foreground: '#FFFFFF',
        },
        secondary: {
          DEFAULT: '#00E0FF',
          foreground: '#FFFFFF',
        },
        destructive: {
          DEFAULT: '#DC2626',
          foreground: '#FFFFFF',
        },
        muted: {
          DEFAULT: '#F9FAFB',
          foreground: '#6B7280',
        },
        accent: {
          DEFAULT: '#00E0FF',
          foreground: '#FFFFFF',
        },
        popover: {
          DEFAULT: '#FFFFFF',
          foreground: '#111827',
        },
        card: {
          DEFAULT: '#FFFFFF',
          foreground: '#111827',
        },
        dark: {
          DEFAULT: '#0F1218',
          light: '#1A1F2B',
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      borderRadius: {
        lg: '0.75rem',
        md: '0.5rem',
        sm: '0.375rem',
      },
      boxShadow: {
        DEFAULT: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
        md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
        neon: '0 0 5px rgba(0, 224, 255, 0.5), 0 0 10px rgba(0, 224, 255, 0.3), 0 0 15px rgba(0, 224, 255, 0.1)',
      },
    },
  },
  plugins: [],
}
export default config 