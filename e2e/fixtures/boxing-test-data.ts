/**
 * Boxing Test Data - Kumar Prescod Boxing Website
 * Shared test data and fixtures for E2E testing
 */

export const kumarPrescod = {
  name: 'Kumar Prescod',
  nickname: 'The Raw One',
  age: 18,
  hometown: 'Oakland, CA',
  weightClass: 'Light Heavyweight',
  stance: 'Orthodox',
  
  record: {
    wins: 3,
    losses: 0,
    draws: 0,
    knockouts: 3,
    knockoutPercentage: 100
  },
  
  fights: [
    {
      opponent: 'Miguel Rodriguez',
      nickname: 'The Hurricane',
      date: '2024-06-15',
      venue: 'San Francisco Armory',
      result: 'Win',
      method: 'KO',
      round: 1,
      time: '2:45'
    },
    {
      opponent: 'James Thompson',
      nickname: 'Iron Jaw',
      date: '2024-09-21',
      venue: 'Oakland-Alameda County Coliseum',
      result: 'Win',
      method: 'TKO',
      round: 3,
      time: '3:00'
    },
    {
      opponent: 'Derek Williams',
      nickname: 'D-Train',
      date: '2024-12-20',
      venue: 'MGM Grand Garden Arena',
      result: 'Win',
      method: 'KO',
      round: 2,
      time: '1:32'
    }
  ],
  
  upcomingFight: {
    date: '2025-08-16',
    venue: 'Oakland Arena',
    title: 'Homecoming Fight - The Raw One Returns',
    opponent: 'TBA'
  }
};

export const testViewports = {
  mobile: {
    iPhone_SE: { width: 375, height: 667 },
    iPhone_12: { width: 390, height: 844 },
    iPhone_12_Pro_Max: { width: 428, height: 926 },
    Samsung_Galaxy_S21: { width: 360, height: 800 }
  },
  tablet: {
    iPad: { width: 768, height: 1024 },
    iPad_Pro: { width: 1024, height: 1366 },
    Galaxy_Tab_S4: { width: 712, height: 1138 }
  },
  desktop: {
    Small: { width: 1280, height: 720 },
    Medium: { width: 1440, height: 900 },
    Large: { width: 1920, height: 1080 },
    Ultra_Wide: { width: 2560, height: 1440 }
  }
};

export const performanceThresholds = {
  coreWebVitals: {
    LCP: {
      good: 2500,
      needsImprovement: 4000
    },
    FID: {
      good: 100,
      needsImprovement: 300
    },
    CLS: {
      good: 0.1,
      needsImprovement: 0.25
    }
  },
  
  boxingSpecific: {
    fightRecordLoadTime: 3000,
    trainingMediaLoadTime: 5000,
    fightVideosLoadTime: 8000,
    heroSectionLoadTime: 2000,
    ticketPurchaseFlowTime: 2000
  },
  
  network: {
    totalPageSize: 5 * 1024 * 1024, // 5MB
    imageOptimizationTarget: 0.7, // 70% should use modern formats
    lazyLoadingTarget: 0.8 // 80% of images should be lazy loaded
  }
};

export const accessibilityStandards = {
  wcag: {
    level: 'AA',
    contrastRatio: {
      normal: 4.5,
      large: 3.0
    },
    touchTargetSize: {
      minimum: 44, // 44x44px
      recommended: 48 // 48x48px
    }
  },
  
  boxingSpecific: {
    fightStatsAccessibility: [
      'Wins should have proper label',
      'Losses should have proper label', 
      'Knockouts should have proper label',
      'Fight record should be screen reader accessible'
    ],
    
    requiredAltTexts: [
      /training|workout|boxing|Kumar/i,
      /fight|bout|match|boxing/i,
      /promotion|poster|event/i
    ]
  }
};

export const socialMediaUrls = {
  instagram: 'https://instagram.com/kumarprescod',
  twitter: 'https://twitter.com/kumarprescod', 
  youtube: 'https://youtube.com/@kumarprescod',
  tiktok: 'https://tiktok.com/@kumarprescod'
};

export const expectedContent = {
  homepage: {
    title: /Kumar Prescod.*Professional Boxer.*Oakland/i,
    keywords: [
      'Kumar Prescod',
      'The Raw One',
      'Professional Boxer',
      'Oakland',
      'Boxing',
      '3-0',
      'Undefeated',
      'Perfect Record'
    ]
  },
  
  fightRecord: {
    mustContain: [
      '3-0',
      'Perfect',
      'Undefeated',
      '100%',
      'Knockout'
    ],
    
    opponents: [
      'Miguel Rodriguez',
      'James Thompson', 
      'Derek Williams'
    ],
    
    venues: [
      'San Francisco Armory',
      'Oakland-Alameda County Coliseum',
      'MGM Grand Garden Arena'
    ]
  },
  
  homecomingFight: {
    date: 'August 16',
    venue: 'Oakland Arena',
    keywords: [
      'Homecoming',
      'The Raw One Returns',
      'Straight Outta Oakland'
    ]
  }
};

export const testImages = {
  fightPromotion: [
    '/fights/2025-08-16-oakland/IMG_5882.jpg',
    '/fights/2025-08-16-oakland/IMG_7202.jpeg'
  ],
  
  training: [
    '/images/training/daily-routine/',
    '/images/training/equipment/',
    '/images/training/progression/'
  ],
  
  portraits: [
    '/images/portraits/action-portraits/',
    '/images/portraits/professional/',
    '/images/portraits/brand-photos/'
  ]
};

export const networkConditions = {
  '2G': {
    downloadThroughput: 250 * 1024,
    uploadThroughput: 50 * 1024,
    latency: 300
  },
  '3G': {
    downloadThroughput: 1.5 * 1024 * 1024,
    uploadThroughput: 750 * 1024,
    latency: 150
  },
  '4G': {
    downloadThroughput: 4 * 1024 * 1024,
    uploadThroughput: 3 * 1024 * 1024,
    latency: 20
  },
  'WiFi': {
    downloadThroughput: 30 * 1024 * 1024,
    uploadThroughput: 15 * 1024 * 1024,
    latency: 2
  }
};

export const boxingTestScenarios = {
  fightNightTraffic: {
    description: 'Simulate high traffic during fight events',
    concurrentUsers: 5,
    networkCondition: '3G',
    expectedLoadTime: 8000
  },
  
  mobileBoxingFan: {
    description: 'Typical mobile boxing fan accessing during commute',
    viewport: testViewports.mobile.iPhone_12,
    networkCondition: '4G',
    expectedLoadTime: 5000
  },
  
  ticketPurchaseRush: {
    description: 'Ticket purchasing during high-demand periods',
    viewport: testViewports.mobile.iPhone_12,
    networkCondition: '3G',
    expectedFlowTime: 10000
  }
};

export const visualRegressionConfig = {
  thresholds: {
    hero: 0.2,
    statistics: 0.1,
    gallery: 0.3,
    fightPosters: 0.1,
    buttons: 0.1,
    typography: 0.1
  },
  
  maxDiffPixels: {
    hero: 1000,
    statistics: 500,
    gallery: 2000,
    fightPosters: 300,
    buttons: 100,
    typography: 200
  }
};

export const mockApiResponses = {
  fightStats: {
    totalFights: 3,
    wins: 3,
    losses: 0,
    draws: 0,
    knockoutPercentage: 100,
    averageRoundsPerFight: 2.0
  },
  
  upcomingEvents: [
    {
      id: 'homecoming-2025',
      date: '2025-08-16',
      title: 'Homecoming Fight',
      venue: 'Oakland Arena',
      ticketsAvailable: true
    }
  ]
};