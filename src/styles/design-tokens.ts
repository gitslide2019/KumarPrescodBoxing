/**
 * Design System Tokens for Kumar Prescod Boxing Website
 * Generated from Figma MCP Server integration
 */

export const designTokens = {
  colors: {
    // Primary Boxing Brand Colors
    primary: {
      boxing_red: '#DC2626',
      championship_gold: '#F59E0B', 
      knockout_black: '#1F2937',
      victory_white: '#FFFFFF',
    },
    
    // Semantic Colors
    semantic: {
      success: '#10B981',
      warning: '#F59E0B',
      error: '#EF4444', 
      info: '#3B82F6',
    },
    
    // Gradients
    gradients: {
      hero: 'linear-gradient(135deg, #DC2626 0%, #B91C1C 100%)',
      victory: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
      knockout: 'linear-gradient(135deg, #1F2937 0%, #111827 100%)',
    },
    
    // Gray Scale
    gray: {
      50: '#F9FAFB',
      100: '#F3F4F6',
      200: '#E5E7EB',
      300: '#D1D5DB',
      400: '#9CA3AF',
      500: '#6B7280',
      600: '#4B5563',
      700: '#374151',
      800: '#1F2937',
      900: '#111827',
    },
  },
  
  typography: {
    // Font Families
    fonts: {
      display: ['Bebas Neue', 'cursive'],
      body: ['Inter', 'sans-serif'],
      mono: ['JetBrains Mono', 'monospace'],
    },
    
    // Font Sizes
    sizes: {
      xs: '0.75rem',    // 12px
      sm: '0.875rem',   // 14px
      base: '1rem',     // 16px
      lg: '1.125rem',   // 18px
      xl: '1.25rem',    // 20px
      '2xl': '1.5rem',  // 24px
      '3xl': '1.875rem', // 30px
      '4xl': '2.25rem', // 36px
      '5xl': '3rem',    // 48px
      '6xl': '3.75rem', // 60px
      '7xl': '4.5rem',  // 72px
    },
    
    // Font Weights
    weights: {
      light: 300,
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
      extrabold: 800,
      black: 900,
    },
    
    // Line Heights
    lineHeights: {
      tight: 1.25,
      snug: 1.375,
      normal: 1.5,
      relaxed: 1.625,
      loose: 2,
    },
  },
  
  spacing: {
    0: '0',
    px: '1px',
    0.5: '0.125rem', // 2px
    1: '0.25rem',    // 4px
    1.5: '0.375rem', // 6px
    2: '0.5rem',     // 8px
    2.5: '0.625rem', // 10px
    3: '0.75rem',    // 12px
    3.5: '0.875rem', // 14px
    4: '1rem',       // 16px
    5: '1.25rem',    // 20px
    6: '1.5rem',     // 24px
    7: '1.75rem',    // 28px
    8: '2rem',       // 32px
    9: '2.25rem',    // 36px
    10: '2.5rem',    // 40px
    11: '2.75rem',   // 44px
    12: '3rem',      // 48px
    14: '3.5rem',    // 56px
    16: '4rem',      // 64px
    20: '5rem',      // 80px
    24: '6rem',      // 96px
    28: '7rem',      // 112px
    32: '8rem',      // 128px
  },
  
  breakpoints: {
    mobile: '390px',
    tablet: '768px', 
    desktop: '1024px',
    wide: '1440px',
    ultrawide: '1920px',
  },
  
  shadows: {
    sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    DEFAULT: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
    md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
    lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
    xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
    '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)',
    boxing: '0 8px 32px rgb(220 38 38 / 0.12)', // Red shadow for boxing elements
    gold: '0 8px 32px rgb(245 158 11 / 0.12)',  // Gold shadow for achievements
  },
  
  borderRadius: {
    none: '0',
    sm: '0.125rem',   // 2px
    DEFAULT: '0.25rem', // 4px
    md: '0.375rem',   // 6px
    lg: '0.5rem',     // 8px
    xl: '0.75rem',    // 12px
    '2xl': '1rem',    // 16px
    '3xl': '1.5rem',  // 24px
    full: '9999px',
  },
  
  // Boxing-specific tokens
  boxing: {
    // Fight status colors
    status: {
      win: '#10B981',
      loss: '#EF4444', 
      draw: '#6B7280',
      upcoming: '#3B82F6',
      cancelled: '#EF4444',
    },
    
    // Weight class colors
    weightClasses: {
      heavyweight: '#DC2626',
      lightHeavyweight: '#EA580C',
      middleweight: '#D97706',
      welterweight: '#CA8A04',
      lightweight: '#65A30D',
      featherweight: '#16A34A',
      bantamweight: '#059669',
      flyweight: '#0D9488',
    },
    
    // Training intensity colors
    intensity: {
      low: '#10B981',
      medium: '#F59E0B',
      high: '#EF4444',
      extreme: '#DC2626',
    },
    
    // Animation durations
    animations: {
      fast: '150ms',
      normal: '300ms',
      slow: '500ms',
      knockout: '1000ms', // For knockout animations
    },
  },
} as const;

// Type definitions for design tokens
export type DesignTokens = typeof designTokens;
export type ColorTokens = typeof designTokens.colors;
export type TypographyTokens = typeof designTokens.typography;
export type SpacingTokens = typeof designTokens.spacing;
export type BoxingTokens = typeof designTokens.boxing;