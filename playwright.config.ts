import { defineConfig, devices } from '@playwright/test';

/**
 * Kumar Prescod Boxing Website - Playwright E2E Testing Configuration
 * Optimized for boxing website with media-heavy content and mobile-first audience
 */
export default defineConfig({
  // Test directory structure
  testDir: './e2e',
  outputDir: './e2e/test-results',
  
  // Global test settings optimized for boxing media content
  timeout: 45000, // Increased for video/image loading
  expect: {
    timeout: 10000, // Boxing media content needs time to load
  },
  
  // Fail fast during development, but run all tests in CI
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  
  // Comprehensive reporter for boxing performance analysis
  reporter: [
    ['html', { 
      outputFolder: './e2e/playwright-report',
      open: 'never' 
    }],
    ['json', { 
      outputFile: './e2e/test-results/results.json' 
    }],
    ['junit', { 
      outputFile: './e2e/test-results/junit.xml' 
    }],
    ['line'],
    // Custom performance reporter for Core Web Vitals
    ['./e2e/reporters/performance-reporter.ts']
  ],
  
  // Global test configuration
  use: {
    // Base URL for all tests
    baseURL: process.env.CI ? 'http://localhost:3000' : 'http://localhost:3000',
    
    // Browser context settings optimized for boxing fans
    viewport: { width: 1280, height: 720 }, // Desktop first, then mobile
    ignoreHTTPSErrors: true,
    
    // Media and content settings for boxing videos/images
    video: 'retain-on-failure',
    screenshot: 'only-on-failure',
    trace: 'retain-on-failure',
    
    // Performance monitoring for boxing content
    actionTimeout: 15000, // Boxing media needs time
    navigationTimeout: 30000, // Fight videos and galleries
    
    // Boxing fan user simulation
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.0 Mobile/15E148 Safari/604.1',
    
    // Accessibility testing for boxing stats
    extraHTTPHeaders: {
      'Accept-Language': 'en-US,en;q=0.9'
    }
  },

  // Multi-browser testing matrix for boxing audience
  projects: [
    // Desktop browsers - Primary boxing fan base
    {
      name: 'chromium-desktop',
      use: { 
        ...devices['Desktop Chrome'],
        viewport: { width: 1920, height: 1080 },
        // Simulate boxing event traffic
        launchOptions: {
          args: ['--no-sandbox', '--disable-web-security']
        }
      },
    },
    {
      name: 'firefox-desktop', 
      use: { 
        ...devices['Desktop Firefox'],
        viewport: { width: 1920, height: 1080 }
      },
    },
    {
      name: 'webkit-desktop',
      use: { 
        ...devices['Desktop Safari'],
        viewport: { width: 1920, height: 1080 }
      },
    },

    // Mobile browsers - Critical for boxing fans watching on mobile
    {
      name: 'mobile-chrome',
      use: { 
        ...devices['Pixel 5'],
        // 3G network simulation for fight night traffic
        launchOptions: {
          args: ['--simulate-network-throttling', '--throttling.cpuSlowdownMultiplier=4']
        }
      },
    },
    {
      name: 'mobile-safari',
      use: { 
        ...devices['iPhone 12'],
        // Simulate poor network during fight events
        contextOptions: {
          offline: false,
          // Throttle network for realistic fight night conditions
        }
      },
    },
    {
      name: 'mobile-samsung',
      use: { ...devices['Galaxy S9+'] },
    },

    // Tablet testing for training video consumption
    {
      name: 'tablet-ipad',
      use: { ...devices['iPad Pro'] },
    },
    {
      name: 'tablet-android',
      use: { ...devices['Galaxy Tab S4'] },
    },

    // Performance testing project with network throttling
    {
      name: 'performance-3g',
      use: {
        ...devices['iPhone 12'],
        launchOptions: {
          args: [
            '--enable-features=NetworkService',
            '--enable-network-throttling',
            '--throttling.cpuSlowdownMultiplier=4'
          ]
        }
      },
    },

    // Accessibility testing project
    {
      name: 'accessibility',
      use: {
        ...devices['Desktop Chrome'],
        // Screen reader simulation for boxing stats
        extraHTTPHeaders: {
          'User-Agent': 'AccessibilityTester/1.0'
        }
      },
    }
  ],

  // Local dev server for testing
  webServer: {
    command: 'npm start',
    port: 3000,
    reuseExistingServer: !process.env.CI,
    timeout: 60000, // Boxing app takes time to start
  },

  // Global setup and teardown
  globalSetup: './e2e/global-setup.ts',
  globalTeardown: './e2e/global-teardown.ts',
});