/** @type {import('tailwindcss').Config} */
const { designTokens } = require('./src/styles/design-tokens.ts');

module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Boxing brand colors from design tokens
        boxing: {
          red: designTokens.colors.primary.boxing_red,
          gold: designTokens.colors.primary.championship_gold,
          black: designTokens.colors.primary.knockout_black,
          white: designTokens.colors.primary.victory_white,
        },
        
        // Semantic colors
        semantic: designTokens.colors.semantic,
        
        // Gray scale
        gray: designTokens.colors.gray,
        
        // Boxing-specific status colors
        'fight-status': designTokens.boxing.status,
        
        // Weight class colors
        'weight-class': designTokens.boxing.weightClasses,
        
        // Training intensity colors
        'training-intensity': designTokens.boxing.intensity,
        
        // Legacy colors (keeping for compatibility)
        primary: {
          50: '#fef2f2',
          100: '#fee2e2',
          200: '#fecaca',
          300: '#fca5a5',
          400: '#f87171',
          500: '#ef4444',
          600: '#dc2626',
          700: '#b91c1c',
          800: '#991b1b',
          900: '#7f1d1d',
        },
        secondary: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
        },
        gold: {
          50: '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#f59e0b',
          600: '#d97706',
          700: '#b45309',
          800: '#92400e',
          900: '#78350f',
        }
      },
      fontFamily: {
        'sans': designTokens.typography.fonts.body,
        'display': designTokens.typography.fonts.display,
        'mono': designTokens.typography.fonts.mono,
      },
      fontSize: designTokens.typography.sizes,
      fontWeight: designTokens.typography.weights,
      lineHeight: designTokens.typography.lineHeights,
      spacing: designTokens.spacing,
      borderRadius: designTokens.borderRadius,
      boxShadow: {
        ...designTokens.shadows,
        boxing: designTokens.shadows.boxing,
        gold: designTokens.shadows.gold,
      },
      // Boxing-specific gradient backgrounds
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'hero-boxing': designTokens.colors.gradients.hero,
        'victory-boxing': designTokens.colors.gradients.victory,
        'knockout-boxing': designTokens.colors.gradients.knockout,
      },
      
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'bounce-slow': 'bounce 2s infinite',
        'fade-in': 'fadeIn 0.5s ease-in-out',
        
        // Boxing-specific animations with design token timing
        'knockout': `punch-impact ${designTokens.boxing.animations.knockout} cubic-bezier(0.4, 0, 0.2, 1)`,
        'boxing-entrance': `boxing-entrance ${designTokens.boxing.animations.slow} cubic-bezier(0.4, 0, 0.2, 1)`,
        'championship-pulse': `championship-pulse 3s ease-in-out infinite`,
        'slide-up': 'slideUp 0.5s ease-out',
        'slide-down': 'slideDown 0.5s ease-out',
        'scale-in': 'scaleIn 0.3s ease-out',
        'gradient-shift': 'gradient-shift 4s ease infinite',
        'shimmer': 'shimmer 1.5s infinite',
        'float': 'float 3s ease-in-out infinite',
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
        'bounce-in': 'bounce-in 0.6s ease-out',
        'slide-in-left': 'slide-in-left 0.6s ease-out',
        'slide-in-right': 'slide-in-right 0.6s ease-out',
        'fade-in-up': 'fade-in-up 0.6s ease-out',
        'typing': 'typing 3.5s steps(40, end)',
        'blink': 'blink 1s infinite',
        'championship-glow': 'championship-glow 4s ease infinite',
        'punch-impact': 'punch-impact 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
        'boxing-entrance': 'boxing-entrance 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
        'championship-pulse': 'championship-pulse 3s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.9)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        'gradient-shift': {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0) rotate(0deg)' },
          '50%': { transform: 'translateY(-10px) rotate(2deg)' },
        },
        'pulse-glow': {
          '0%, 100%': { 
            boxShadow: '0 0 5px rgb(220 38 38 / 0.5), 0 0 10px rgb(220 38 38 / 0.3), 0 0 15px rgb(220 38 38 / 0.1)',
          },
          '50%': {
            boxShadow: '0 0 20px rgb(220 38 38 / 0.8), 0 0 30px rgb(220 38 38 / 0.6), 0 0 40px rgb(220 38 38 / 0.4)',
          },
        },
        'bounce-in': {
          '0%': { opacity: '0', transform: 'scale(0.3)' },
          '50%': { opacity: '1', transform: 'scale(1.05)' },
          '70%': { transform: 'scale(0.9)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        'slide-in-left': {
          '0%': { opacity: '0', transform: 'translateX(-50px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        'slide-in-right': {
          '0%': { opacity: '0', transform: 'translateX(50px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        'fade-in-up': {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        typing: {
          from: { width: '0' },
          to: { width: '100%' },
        },
        blink: {
          '0%, 50%': { borderColor: 'transparent' },
          '51%, 100%': { borderColor: 'rgb(220 38 38)' },
        },
        'championship-glow': {
          '0%, 100%': { 
            backgroundPosition: '0% 50%',
            filter: 'brightness(1) saturate(1)',
          },
          '50%': { 
            backgroundPosition: '100% 50%',
            filter: 'brightness(1.2) saturate(1.3)',
          },
        },
        'punch-impact': {
          '0%': { transform: 'scale(1) rotate(0deg)' },
          '25%': { transform: 'scale(0.95) rotate(-1deg)' },
          '50%': { transform: 'scale(1.05) rotate(1deg)' },
          '75%': { transform: 'scale(0.98) rotate(-0.5deg)' },
          '100%': { transform: 'scale(1) rotate(0deg)' },
        },
        'boxing-entrance': {
          '0%': { 
            opacity: '0',
            transform: 'translateY(50px) scale(0.8) rotate(-5deg)',
          },
          '50%': { 
            opacity: '0.8',
            transform: 'translateY(-10px) scale(1.05) rotate(2deg)',
          },
          '100%': { 
            opacity: '1',
            transform: 'translateY(0) scale(1) rotate(0deg)',
          },
        },
        'championship-pulse': {
          '0%, 100%': { 
            boxShadow: '0 0 20px rgba(220, 38, 38, 0.3), 0 0 40px rgba(245, 158, 11, 0.2)',
            transform: 'scale(1)',
          },
          '50%': { 
            boxShadow: '0 0 30px rgba(220, 38, 38, 0.6), 0 0 60px rgba(245, 158, 11, 0.4)',
            transform: 'scale(1.02)',
          },
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
    },
  },
  plugins: [],
} 