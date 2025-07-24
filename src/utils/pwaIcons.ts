/**
 * PWA Icon Generation Utility
 * Generates boxing-themed icons for different device types and contexts
 */

export interface PWAIconConfig {
  size: number;
  purpose: 'any' | 'maskable' | 'monochrome';
  format: 'png' | 'svg' | 'ico';
  background?: string;
  foreground?: string;
}

export const iconSizes = [
  16, 32, 48, 72, 96, 128, 144, 152, 192, 256, 384, 512
];

export const iconConfigs: PWAIconConfig[] = [
  // Standard icons
  { size: 16, purpose: 'any', format: 'ico' },
  { size: 32, purpose: 'any', format: 'ico' },
  { size: 48, purpose: 'any', format: 'png' },
  { size: 72, purpose: 'any', format: 'png' },
  { size: 96, purpose: 'any', format: 'png' },
  { size: 128, purpose: 'any', format: 'png' },
  { size: 144, purpose: 'any', format: 'png' },
  { size: 152, purpose: 'any', format: 'png' },
  { size: 192, purpose: 'any', format: 'png' },
  { size: 256, purpose: 'any', format: 'png' },
  { size: 384, purpose: 'any', format: 'png' },
  { size: 512, purpose: 'any', format: 'png' },
  
  // Maskable icons (Android adaptive icons)
  { size: 192, purpose: 'maskable', format: 'png', background: '#dc2626', foreground: '#ffffff' },
  { size: 512, purpose: 'maskable', format: 'png', background: '#dc2626', foreground: '#ffffff' },
  
  // Monochrome icons
  { size: 192, purpose: 'monochrome', format: 'png', foreground: '#ffffff' },
  { size: 512, purpose: 'monochrome', format: 'png', foreground: '#ffffff' }
];

/**
 * Generate SVG boxing glove icon
 */
export const generateBoxingGloveSVG = (
  size: number, 
  background = '#dc2626', 
  foreground = '#ffffff',
  purpose: 'any' | 'maskable' | 'monochrome' = 'any'
): string => {
  const padding = purpose === 'maskable' ? size * 0.1 : 0;
  const gloveSize = size - (padding * 2);
  const centerX = size / 2;
  const centerY = size / 2;
  
  // Adjust colors based on purpose
  const bgColor = purpose === 'monochrome' ? 'transparent' : background;
  const fgColor = purpose === 'monochrome' ? foreground : foreground;
  
  return `
    <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <style>
          .boxing-glove { fill: ${fgColor}; }
          .background { fill: ${bgColor}; }
          .accent { fill: ${purpose === 'monochrome' ? fgColor : '#f59e0b'}; }
        </style>
      </defs>
      
      ${purpose !== 'monochrome' ? `<rect class="background" width="100%" height="100%" rx="${purpose === 'maskable' ? size * 0.1 : 0}"/>` : ''}
      
      <g transform="translate(${centerX}, ${centerY})">
        <!-- Boxing Glove Main Body -->
        <ellipse class="boxing-glove" 
                 cx="0" cy="0" 
                 rx="${gloveSize * 0.3}" ry="${gloveSize * 0.35}"
                 transform="rotate(-15)"/>
        
        <!-- Glove Thumb -->
        <ellipse class="boxing-glove" 
                 cx="${-gloveSize * 0.15}" cy="${-gloveSize * 0.1}" 
                 rx="${gloveSize * 0.12}" ry="${gloveSize * 0.18}"
                 transform="rotate(-30)"/>
        
        <!-- Glove Cuff -->
        <rect class="accent" 
              x="${-gloveSize * 0.25}" y="${gloveSize * 0.2}" 
              width="${gloveSize * 0.5}" height="${gloveSize * 0.08}"
              rx="${gloveSize * 0.02}"/>
              
        <!-- Boxing Laces -->
        <path class="accent" 
              d="M ${-gloveSize * 0.08} ${-gloveSize * 0.15} 
                 L ${gloveSize * 0.08} ${-gloveSize * 0.05}
                 M ${-gloveSize * 0.08} ${-gloveSize * 0.05} 
                 L ${gloveSize * 0.08} ${gloveSize * 0.05}
                 M ${-gloveSize * 0.08} ${gloveSize * 0.05} 
                 L ${gloveSize * 0.08} ${gloveSize * 0.15}"
              stroke="${purpose === 'monochrome' ? fgColor : '#f59e0b'}" 
              stroke-width="${size / 100}" 
              fill="none"/>
      </g>
    </svg>
  `.trim();
};

/**
 * Generate boxing-themed favicon
 */
export const generateFaviconSVG = (size: number = 32): string => {
  return generateBoxingGloveSVG(size, '#dc2626', '#ffffff', 'any');
};

/**
 * Generate Apple Touch Icon
 */
export const generateAppleTouchIconSVG = (size: number = 180): string => {
  return `
    <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="bgGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#dc2626;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#991b1b;stop-opacity:1" />
        </linearGradient>
        <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="2" dy="2" stdDeviation="3" flood-color="#000000" flood-opacity="0.3"/>
        </filter>
      </defs>
      
      <!-- iOS rounded rectangle background -->
      <rect width="100%" height="100%" rx="${size * 0.2237}" fill="url(#bgGradient)"/>
      
      <!-- Boxing gloves (pair) -->
      <g transform="translate(${size * 0.5}, ${size * 0.5})">
        <!-- Left glove -->
        <g transform="translate(${-size * 0.15}, 0) rotate(-20)" filter="url(#shadow)">
          <ellipse fill="#ffffff" cx="0" cy="0" rx="${size * 0.12}" ry="${size * 0.15}"/>
          <ellipse fill="#ffffff" cx="${-size * 0.06}" cy="${-size * 0.04}" rx="${size * 0.05}" ry="${size * 0.08}"/>
          <rect fill="#f59e0b" x="${-size * 0.1}" y="${size * 0.08}" width="${size * 0.2}" height="${size * 0.03}" rx="${size * 0.01}"/>
        </g>
        
        <!-- Right glove -->
        <g transform="translate(${size * 0.15}, 0) rotate(20)" filter="url(#shadow)">
          <ellipse fill="#ffffff" cx="0" cy="0" rx="${size * 0.12}" ry="${size * 0.15}"/>
          <ellipse fill="#ffffff" cx="${size * 0.06}" cy="${-size * 0.04}" rx="${size * 0.05}" ry="${size * 0.08}"/>
          <rect fill="#f59e0b" x="${-size * 0.1}" y="${size * 0.08}" width="${size * 0.2}" height="${size * 0.03}" rx="${size * 0.01}"/>
        </g>
        
        <!-- Initials -->
        <text x="0" y="${size * 0.2}" 
              text-anchor="middle" 
              font-family="Arial Black, sans-serif" 
              font-size="${size * 0.08}" 
              font-weight="bold" 
              fill="#f59e0b">KP</text>
      </g>
    </svg>
  `.trim();
};

/**
 * Generate Windows tile icon
 */
export const generateWindowsTileSVG = (size: number = 270): string => {
  return `
    <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="tileGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#0f172a;stop-opacity:1" />
          <stop offset="50%" style="stop-color:#1e293b;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#334155;stop-opacity:1" />
        </linearGradient>
      </defs>
      
      <!-- Windows tile background -->
      <rect width="100%" height="100%" fill="url(#tileGradient)"/>
      
      <!-- Boxing ring -->
      <rect x="${size * 0.1}" y="${size * 0.1}" 
            width="${size * 0.8}" height="${size * 0.8}" 
            fill="none" 
            stroke="#dc2626" 
            stroke-width="${size * 0.01}"/>
      
      <!-- Boxing glove in center -->
      <g transform="translate(${size * 0.5}, ${size * 0.5})">
        <ellipse fill="#dc2626" cx="0" cy="0" rx="${size * 0.15}" ry="${size * 0.18}"/>
        <ellipse fill="#dc2626" cx="${-size * 0.08}" cy="${-size * 0.05}" rx="${size * 0.06}" ry="${size * 0.09}"/>
        <rect fill="#f59e0b" x="${-size * 0.12}" y="${size * 0.1}" width="${size * 0.24}" height="${size * 0.04}" rx="${size * 0.01}"/>
        
        <!-- Champion text -->
        <text x="0" y="${size * 0.25}" 
              text-anchor="middle" 
              font-family="Arial, sans-serif" 
              font-size="${size * 0.06}" 
              font-weight="bold" 
              fill="#f59e0b">BOXER</text>
      </g>
    </svg>
  `.trim();
};

/**
 * Generate PWA splash screen
 */
export const generateSplashScreenSVG = (width: number, height: number): string => {
  const centerX = width / 2;
  const centerY = height / 2;
  const gloveSize = Math.min(width, height) * 0.2;
  
  return `
    <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="splashGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#1e293b;stop-opacity:1" />
          <stop offset="50%" style="stop-color:#0f172a;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#000000;stop-opacity:1" />
        </linearGradient>
        <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
          <feMerge> 
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>
      
      <!-- Background -->
      <rect width="100%" height="100%" fill="url(#splashGradient)"/>
      
      <!-- Main boxing glove -->
      <g transform="translate(${centerX}, ${centerY - gloveSize * 0.5})">
        <ellipse fill="#dc2626" cx="0" cy="0" rx="${gloveSize * 0.3}" ry="${gloveSize * 0.35}" filter="url(#glow)"/>
        <ellipse fill="#dc2626" cx="${-gloveSize * 0.15}" cy="${-gloveSize * 0.1}" rx="${gloveSize * 0.12}" ry="${gloveSize * 0.18}"/>
        <rect fill="#f59e0b" x="${-gloveSize * 0.25}" y="${gloveSize * 0.2}" width="${gloveSize * 0.5}" height="${gloveSize * 0.08}" rx="${gloveSize * 0.02}"/>
      </g>
      
      <!-- App name -->
      <text x="${centerX}" y="${centerY + gloveSize * 0.8}" 
            text-anchor="middle" 
            font-family="Arial Black, sans-serif" 
            font-size="${Math.min(width, height) * 0.08}" 
            font-weight="bold" 
            fill="#f59e0b" 
            filter="url(#glow)">
        KUMAR PRESCOD
      </text>
      
      <text x="${centerX}" y="${centerY + gloveSize * 1.2}" 
            text-anchor="middle" 
            font-family="Arial, sans-serif" 
            font-size="${Math.min(width, height) * 0.04}" 
            fill="#ffffff" 
            opacity="0.8">
        Professional Boxer
      </text>
      
      <!-- Boxing ring decoration -->
      <rect x="${width * 0.05}" y="${height * 0.05}" 
            width="${width * 0.9}" height="${height * 0.9}" 
            fill="none" 
            stroke="#dc2626" 
            stroke-width="2" 
            opacity="0.3"/>
    </svg>
  `.trim();
};

/**
 * Convert SVG to data URL
 */
export const svgToDataUrl = (svg: string): string => {
  const encoded = encodeURIComponent(svg);
  return `data:image/svg+xml,${encoded}`;
};

/**
 * Generate all PWA icons configuration for manifest
 */
export const generateIconsManifest = (): Array<{
  src: string;
  sizes: string;
  type: string;
  purpose?: string;
}> => {
  const icons: Array<{
    src: string;
    sizes: string;
    type: string;
    purpose?: string;
  }> = [];
  
  // Standard icons
  iconSizes.forEach(size => {
    icons.push({
      src: `/icons/icon-${size}x${size}.png`,
      sizes: `${size}x${size}`,
      type: 'image/png',
      purpose: 'any'
    });
  });
  
  // Maskable icons
  [192, 512].forEach(size => {
    icons.push({
      src: `/icons/icon-${size}x${size}-maskable.png`,
      sizes: `${size}x${size}`,
      type: 'image/png',
      purpose: 'maskable'
    });
  });
  
  // Apple touch icons
  [120, 152, 167, 180].forEach(size => {
    icons.push({
      src: `/icons/apple-touch-icon-${size}x${size}.png`,
      sizes: `${size}x${size}`,
      type: 'image/png'
    });
  });
  
  return icons;
};

/**
 * Generate boxing-themed notification icon
 */
export const generateNotificationIconSVG = (size: number = 64): string => {
  return `
    <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
      <circle cx="${size/2}" cy="${size/2}" r="${size/2 - 2}" fill="#dc2626"/>
      <g transform="translate(${size/2}, ${size/2})">
        <ellipse fill="#ffffff" cx="0" cy="0" rx="${size * 0.15}" ry="${size * 0.18}"/>
        <ellipse fill="#ffffff" cx="${-size * 0.08}" cy="${-size * 0.05}" rx="${size * 0.06}" ry="${size * 0.09}"/>
        <rect fill="#f59e0b" x="${-size * 0.12}" y="${size * 0.1}" width="${size * 0.24}" height="${size * 0.04}" rx="${size * 0.01}"/>
      </g>
    </svg>
  `.trim();
};