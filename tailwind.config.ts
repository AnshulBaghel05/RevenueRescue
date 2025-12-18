import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Base Colors
        black: '#0A0A0A',
        gray: {
          900: '#171717',
          800: '#1F1F1F',
          700: '#2A2A2A',
          600: '#3F3F3F',
          500: '#6B6B6B',
          400: '#8F8F8F',
          300: '#B8B8B8',
          200: '#E0E0E0',
          100: '#F5F5F5',
        },
        // Brand Colors
        primary: {
          DEFAULT: '#2B44E7',
          light: '#4D63F0',
          dark: '#1E30B8',
          glow: 'rgba(43, 68, 231, 0.4)',
        },
        secondary: {
          DEFAULT: '#7C3AED',
          light: '#9F67FF',
          dark: '#5B21B6',
        },
        accent: {
          DEFAULT: '#00E5FF',
          light: '#4DFFFF',
          dark: '#00B8D4',
        },
        // Grade Colors
        grade: {
          a: '#10B981',
          b: '#3B82F6',
          c: '#F59E0B',
          d: '#F97316',
          f: '#EF4444',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      fontSize: {
        'xs': '0.75rem',
        'sm': '0.875rem',
        'base': '1rem',
        'lg': '1.125rem',
        'xl': '1.25rem',
        '2xl': '1.5rem',
        '3xl': '1.875rem',
        '4xl': '2.25rem',
        '5xl': '3rem',
        '6xl': '3.75rem',
        '7xl': '4.5rem',
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
      },
      boxShadow: {
        'sm': '0 1px 2px rgba(0, 0, 0, 0.5)',
        'md': '0 4px 6px rgba(0, 0, 0, 0.5)',
        'lg': '0 10px 15px rgba(0, 0, 0, 0.6)',
        'xl': '0 20px 25px rgba(0, 0, 0, 0.7)',
        'glow-primary': '0 0 20px rgba(43, 68, 231, 0.4)',
        'glow-accent': '0 0 20px rgba(0, 229, 255, 0.4)',
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(135deg, #2B44E7 0%, #7C3AED 100%)',
        'gradient-accent': 'linear-gradient(135deg, #00E5FF 0%, #2B44E7 100%)',
        'gradient-hero': 'linear-gradient(180deg, #171717 0%, #0A0A0A 100%)',
      },
      animation: {
        'fadeIn': 'fadeIn 0.3s ease-out',
        'fadeInUp': 'fadeInUp 0.5s ease-out',
        'slideInRight': 'slideInRight 0.4s ease-out',
        'pulse-slow': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glow': 'glow 2s ease-in-out infinite',
        'rotate': 'rotate 1s linear infinite',
        'scaleIn': 'scaleIn 0.3s ease-out',
      },
      keyframes: {
        fadeIn: {
          'from': { opacity: '0' },
          'to': { opacity: '1' },
        },
        fadeInUp: {
          'from': { opacity: '0', transform: 'translateY(20px)' },
          'to': { opacity: '1', transform: 'translateY(0)' },
        },
        slideInRight: {
          'from': { opacity: '0', transform: 'translateX(-20px)' },
          'to': { opacity: '1', transform: 'translateX(0)' },
        },
        glow: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(43, 68, 231, 0.4)' },
          '50%': { boxShadow: '0 0 40px rgba(43, 68, 231, 0.4)' },
        },
        rotate: {
          'from': { transform: 'rotate(0deg)' },
          'to': { transform: 'rotate(360deg)' },
        },
        scaleIn: {
          'from': { opacity: '0', transform: 'scale(0.9)' },
          'to': { opacity: '1', transform: 'scale(1)' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
