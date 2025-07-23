import { chromium, FullConfig } from '@playwright/test';

/**
 * Global setup for Kumar Prescod Boxing E2E tests
 * Prepares test environment for boxing website testing
 */
async function globalSetup(config: FullConfig) {
  console.log('🥊 Setting up Kumar Prescod Boxing E2E Tests...');
  
  // Launch browser for setup tasks
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();
  
  try {
    // Pre-warm the application for faster test execution
    console.log('🔥 Pre-warming boxing website...');
    await page.goto('http://localhost:3000');
    await page.waitForLoadState('networkidle');
    
    // Pre-load critical boxing assets
    console.log('🏋️ Pre-loading boxing media assets...');
    const criticalAssets = [
      '/images/training/daily-routine/', // Training photos
      '/videos/homepage-background.mp4', // Hero video
      '/fights/2025-08-16-oakland/', // Fight promotion photos
    ];
    
    for (const asset of criticalAssets) {
      try {
        await page.goto(`http://localhost:3000${asset}`, { waitUntil: 'load', timeout: 5000 });
      } catch (error) {
        console.log(`⚠️ Could not pre-load asset: ${asset}`);
      }
    }
    
    // Setup performance monitoring baseline
    console.log('📊 Establishing performance baselines...');
    const performanceMetrics = await page.evaluate(() => ({
      timing: performance.timing,
      navigation: performance.navigation,
      memory: (performance as any).memory
    }));
    
    // Store baseline metrics for comparison
    const fs = require('fs');
    const path = require('path');
    const metricsPath = path.join(__dirname, 'fixtures', 'baseline-metrics.json');
    fs.writeFileSync(metricsPath, JSON.stringify(performanceMetrics, null, 2));
    
    console.log('✅ Boxing website E2E setup complete!');
    
  } catch (error) {
    console.error('❌ Global setup failed:', error);
    throw error;
  } finally {
    await context.close();
    await browser.close();
  }
}

export default globalSetup;