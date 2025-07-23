/**
 * Performance Optimization Utilities
 * Implementing boxing website best practices from Context7 research
 */

// Image optimization for boxing media (photos, fight posters, training videos)
export const imageOptimization = {
  // Responsive image sizing for boxing content
  generateSrcSet: (baseUrl: string, sizes: number[] = [400, 800, 1200, 1920]) => {
    return sizes.map(size => `${baseUrl}?w=${size}&q=85 ${size}w`).join(', ');
  },

  // Optimize boxing photos for different use cases
  getOptimizedImageUrl: (
    url: string, 
    width?: number, 
    height?: number, 
    quality: number = 85,
    format: 'webp' | 'avif' | 'jpg' = 'webp'
  ) => {
    const params = new URLSearchParams();
    if (width) params.append('w', width.toString());
    if (height) params.append('h', height.toString());
    params.append('q', quality.toString());
    params.append('f', format);
    
    return `${url}?${params.toString()}`;
  },

  // Lazy loading configuration for fight galleries
  lazyLoadConfig: {
    root: null,
    rootMargin: '50px 0px',
    threshold: 0.01
  },

  // Preload critical boxing images (hero, upcoming fight poster)
  preloadCriticalImages: () => {
    const criticalImages = [
      '/images/kumar-prescod-hero.webp',
      '/images/fights/homecoming-poster.webp',
      '/images/logo.webp'
    ];

    criticalImages.forEach(src => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'image';
      link.href = src;
      document.head.appendChild(link);
    });
  }
};

// Video optimization for training and fight content
export const videoOptimization = {
  // Generate video poster images
  generatePosterImage: (videoUrl: string) => {
    return videoUrl.replace(/\.(mp4|mov|avi)$/, '_poster.jpg');
  },

  // Optimize video loading for fight highlights
  getVideoConfig: (isMobile: boolean = false) => ({
    preload: 'metadata' as const,
    controls: true,
    playsInline: true,
    width: isMobile ? '100%' : 'auto',
    height: isMobile ? 'auto' : '400',
    poster: true
  }),

  // Video format priorities for boxing content
  getVideoSources: (baseUrl: string) => [
    { src: `${baseUrl}.webm`, type: 'video/webm' },
    { src: `${baseUrl}.mp4`, type: 'video/mp4' },
    { src: `${baseUrl}.mov`, type: 'video/quicktime' }
  ]
};

// Code splitting for boxing website sections
export const codeSplitting = {
  // Lazy load non-critical pages
  lazyPages: {
    Shop: () => import('../pages/Shop'),
    Podcast: () => import('../pages/Podcast'), 
    Journey: () => import('../pages/Journey'),
    AdminDashboard: () => import('../pages/admin/AdminDashboard'),
    MemberDashboard: () => import('../pages/member/MemberDashboard')
  },

  // Lazy load heavy components
  lazyComponents: {
    PhotoGallery: () => import('../components/common/PhotoGallery'),
    VideoPlayer: () => import('../components/common/VideoPlayer'),
    SocialFeed: () => import('../components/sections/SocialFeed')
  }
};

// Web Vitals optimization for boxing content
export const webVitals = {
  // Core Web Vitals thresholds
  thresholds: {
    LCP: 2500, // Largest Contentful Paint
    FID: 100,  // First Input Delay  
    CLS: 0.1   // Cumulative Layout Shift
  },

  // Monitor performance for boxing-specific content
  measureBoxingContentPerformance: () => {
    if ('web-vital' in window) {
      // Measure fight poster loading time
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.name.includes('fight-poster') || entry.name.includes('hero-image')) {
            console.log(`Boxing content loaded: ${entry.name} in ${entry.duration}ms`);
          }
        }
      });
      observer.observe({ entryTypes: ['resource'] });
    }
  }
};

// Caching strategies for boxing data
export const caching = {
  // Cache fight records and news articles
  cacheConfig: {
    fightRecords: { ttl: 3600000, key: 'kumar-fight-records' }, // 1 hour
    newsArticles: { ttl: 1800000, key: 'kumar-news' },         // 30 minutes
    trainingData: { ttl: 900000, key: 'kumar-training' },      // 15 minutes  
    staticContent: { ttl: 86400000, key: 'kumar-static' }      // 24 hours
  },

  // Service Worker for boxing content
  serviceWorkerConfig: {
    staticAssets: [
      '/images/logo.webp',
      '/images/kumar-prescod-hero.webp',
      '/fonts/inter-var.woff2',
      '/fonts/bebas-neue.woff2'
    ],
    dynamicCaching: [
      '/api/fights',
      '/api/news',
      '/api/training'
    ]
  }
};

// Font optimization for boxing website
export const fontOptimization = {
  // Preload critical fonts
  preloadFonts: () => {
    const fonts = [
      { href: '/fonts/inter-var.woff2', family: 'Inter' },
      { href: '/fonts/bebas-neue.woff2', family: 'Bebas Neue' }
    ];

    fonts.forEach(font => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'font';
      link.type = 'font/woff2';
      link.crossOrigin = 'anonymous';
      link.href = font.href;
      document.head.appendChild(link);
    });
  },

  // Font display strategies
  fontDisplay: {
    primary: 'swap',      // Inter for body text
    display: 'fallback'   // Bebas Neue for headings
  }
};

// Analytics optimization for boxing events
export const analyticsOptimization = {
  // Track boxing-specific events
  boxingEvents: {
    fightView: 'view_fight_details',
    ticketClick: 'click_buy_tickets',
    trainingView: 'view_training_content',
    newsRead: 'read_news_article',
    socialShare: 'share_boxing_content',
    videoPlay: 'play_fight_video'
  },

  // Enhanced ecommerce for ticket and merchandise sales
  ecommerce: {
    trackTicketPurchase: (fightId: string, ticketType: string, price: number) => ({
      event: 'purchase',
      ecommerce: {
        transaction_id: `ticket_${Date.now()}`,
        value: price,
        currency: 'USD',
        items: [{
          item_id: `ticket_${fightId}`,
          item_name: `${ticketType} Ticket`,
          category: 'Boxing Tickets',
          quantity: 1,
          price: price
        }]
      }
    }),

    trackMerchandisePurchase: (itemId: string, itemName: string, price: number) => ({
      event: 'purchase', 
      ecommerce: {
        transaction_id: `merch_${Date.now()}`,
        value: price,
        currency: 'USD',
        items: [{
          item_id: itemId,
          item_name: itemName,
          category: 'Boxing Merchandise',
          quantity: 1,
          price: price
        }]
      }
    })
  }
};

// Mobile optimization for boxing fans
export const mobileOptimization = {
  // Touch-friendly interface for mobile boxing fans
  touchOptimization: {
    minTouchTarget: 44, // 44px minimum touch target
    tapDelay: 300,      // Tap delay for better responsiveness
    swipeThreshold: 50  // Swipe gesture threshold
  },

  // Mobile-specific boxing content
  mobileContent: {
    heroImageSizes: '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw',
    fightPosterSizes: '(max-width: 768px) 90vw, (max-width: 1200px) 45vw, 30vw',
    trainingPhotoSizes: '(max-width: 768px) 50vw, 25vw'
  },

  // Progressive Web App features
  pwaConfig: {
    name: 'Kumar Prescod Boxing',
    short_name: 'The Raw One',
    description: 'Official app for Kumar Prescod professional boxer',
    theme_color: '#DC2626',
    background_color: '#1F2937',
    display: 'standalone',
    orientation: 'portrait'
  }
};

// SEO optimization utilities
export const seoOptimization = {
  // Generate meta tags for boxing content
  generateMetaTags: (page: string, data: any = {}) => {
    const baseMeta = {
      charset: 'utf-8',
      viewport: 'width=device-width, initial-scale=1',
      robots: 'index, follow, max-image-preview:large',
      author: 'Kumar Prescod Boxing Team',
      generator: 'Kumar Prescod Official Website'
    };

    return { ...baseMeta, ...data };
  },

  // Structured data for boxing events
  generateJsonLd: (type: 'fight' | 'athlete' | 'organization', data: any) => {
    const schemas = {
      fight: '@type": "SportsEvent"',
      athlete: '@type": "Person"',
      organization: '@type": "Organization"'
    };

    return {
      '@context': 'https://schema.org',
      [schemas[type]]: true,
      ...data
    };
  }
};

// Error handling and monitoring
export const errorHandling = {
  // Boxing-specific error tracking
  trackBoxingErrors: (error: Error, context: string) => {
    console.error(`Boxing website error in ${context}:`, error);
    
    // Track specific boxing-related errors
    if (context.includes('fight') || context.includes('ticket')) {
      // Send to error tracking service
      // analytics.track('boxing_error', { context, error: error.message });
    }
  },

  // Graceful degradation for boxing features
  gracefulDegradation: {
    videoFallback: '/images/video-fallback.jpg',
    imageFallback: '/images/image-fallback.jpg',
    offline: {
      title: 'You\'re offline',
      message: 'Check back when you\'re connected to see the latest from The Raw One'
    }
  }
};

export type PerformanceConfig = {
  images: typeof imageOptimization;
  videos: typeof videoOptimization;
  caching: typeof caching;
  analytics: typeof analyticsOptimization;
};