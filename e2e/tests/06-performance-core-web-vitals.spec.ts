import { test, expect, Page } from '@playwright/test';
import { performanceUtils } from '../utils/performance';

/**
 * Performance & Core Web Vitals Tests - Kumar Prescod Boxing
 * Tests performance metrics critical for boxing fans accessing during fight events
 */
test.describe('Performance & Core Web Vitals - Boxing Fan Experience', () => {
  let performanceMetrics: any;

  test.beforeEach(async ({ page }) => {
    // Start performance monitoring before navigation
    performanceMetrics = await performanceUtils.startMonitoring(page);
  });

  test.afterEach(async ({ page }) => {
    // Capture and attach performance metrics to test results
    const metrics = await performanceUtils.captureMetrics(page, performanceMetrics);
    await test.info().attach('performance-metrics', {
      body: JSON.stringify(metrics, null, 2),
      contentType: 'application/json'
    });
    
    // Generate performance report
    const report = performanceUtils.generatePerformanceReport(metrics);
    await test.info().attach('performance-report', {
      body: JSON.stringify(report, null, 2),
      contentType: 'application/json'
    });
  });

  test('should meet Core Web Vitals thresholds for boxing content', async ({ page }) => {
    const startTime = Date.now();
    
    // Navigate to homepage
    await page.goto('/');
    
    // Wait for initial content to load
    await page.waitForLoadState('networkidle', { timeout: 30000 });
    
    // Monitor Core Web Vitals for 10 seconds
    const vitals = await performanceUtils.monitorCoreWebVitals(page, 10000);
    
    // Verify Largest Contentful Paint (LCP) - Critical for boxing hero content
    if (vitals.LCP) {
      expect(vitals.LCP).toBeLessThan(2500); // Good LCP threshold
      console.log(`🥊 LCP: ${Math.round(vitals.LCP)}ms (threshold: <2500ms)`);
    }
    
    // Verify First Input Delay (FID) - Important for boxing fan interactions
    if (vitals.FID) {
      expect(vitals.FID).toBeLessThan(100); // Good FID threshold
      console.log(`⚡ FID: ${Math.round(vitals.FID)}ms (threshold: <100ms)`);
    }
    
    // Verify Cumulative Layout Shift (CLS) - Critical for boxing stats display
    if (vitals.CLS) {
      expect(vitals.CLS).toBeLessThan(0.1); // Good CLS threshold
      console.log(`📐 CLS: ${vitals.CLS.toFixed(3)} (threshold: <0.1)`);
    }
    
    // Overall page load time should be reasonable for boxing fans
    const totalLoadTime = Date.now() - startTime;
    expect(totalLoadTime).toBeLessThan(5000); // 5 seconds max
    console.log(`⏱️ Total load time: ${totalLoadTime}ms`);
  });

  test('should optimize boxing media loading performance', async ({ page }) => {
    await page.goto('/');
    
    // Test training image loading performance
    const trainingImages = page.locator('img[src*="training"], img[src*="DSC"]');
    
    if (await trainingImages.count() > 0) {
      const imageLoadStart = Date.now();
      
      // First 3 images should load quickly (above-the-fold)
      for (let i = 0; i < Math.min(3, await trainingImages.count()); i++) {
        const img = trainingImages.nth(i);
        await expect(img).toBeVisible({ timeout: 8000 });
      }
      
      const imageLoadTime = Date.now() - imageLoadStart;
      expect(imageLoadTime).toBeLessThan(8000); // 8 seconds for boxing media
      console.log(`🖼️ Boxing images load time: ${imageLoadTime}ms`);
    }
    
    // Test fight video performance
    const fightVideos = page.locator('video, iframe[src*="youtube"]');
    
    if (await fightVideos.count() > 0) {
      const videoLoadStart = Date.now();
      
      // Videos should be ready to play
      const firstVideo = fightVideos.first();
      await expect(firstVideo).toBeVisible({ timeout: 10000 });
      
      if (await firstVideo.evaluate(el => el.tagName.toLowerCase() === 'video')) {
        // Check video readiness
        const canPlay = await firstVideo.evaluate((video: HTMLVideoElement) => {
          return video.readyState >= 2; // HAVE_CURRENT_DATA
        });
        
        if (!canPlay) {
          // Wait for video to be ready
          await firstVideo.evaluate((video: HTMLVideoElement) => {
            return new Promise((resolve) => {
              if (video.readyState >= 2) {
                resolve(true);
              } else {
                video.addEventListener('canplay', () => resolve(true), { once: true });
                setTimeout(() => resolve(false), 5000); // 5 second timeout
              }
            });
          });
        }
      }
      
      const videoLoadTime = Date.now() - videoLoadStart;
      expect(videoLoadTime).toBeLessThan(10000); // 10 seconds for video readiness
      console.log(`🎬 Boxing video load time: ${videoLoadTime}ms`);
    }
  });

  test('should handle 3G network conditions for fight night traffic', async ({ page }) => {
    // Simulate 3G network conditions
    await performanceUtils.simulateSlowNetwork(page, '3G');
    
    const startTime = Date.now();
    await page.goto('/');
    
    // Essential boxing content should still load reasonably on 3G
    await expect(page.locator('h1, h2').first()).toBeVisible({ timeout: 15000 });
    
    // Check for Kumar's name and basic info
    await expect(page.locator('text=/Kumar Prescod|boxer|fighter/i')).toBeVisible({ timeout: 10000 });
    
    // Fight record should be accessible
    const fightRecord = page.locator('text=/3-0|perfect|undefeated/i');
    if (await fightRecord.count() > 0) {
      await expect(fightRecord.first()).toBeVisible({ timeout: 12000 });
    }
    
    const totalLoadTime = Date.now() - startTime;
    expect(totalLoadTime).toBeLessThan(15000); // 15 seconds on 3G
    console.log(`📱 3G load time: ${totalLoadTime}ms`);
  });

  test('should optimize resource loading and caching', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Check for resource optimization
    const resourceMetrics = await page.evaluate(() => {
      const resources = performance.getEntriesByType('resource');
      return {
        totalResources: resources.length,
        images: resources.filter(r => r.initiatorType === 'img').length,
        scripts: resources.filter(r => r.initiatorType === 'script').length,
        styles: resources.filter(r => r.initiatorType === 'css').length,
        totalTransferSize: resources.reduce((sum, r) => sum + (r.transferSize || 0), 0)
      };
    });
    
    console.log(`📊 Resource metrics:`, resourceMetrics);
    
    // Reasonable limits for boxing website
    expect(resourceMetrics.totalResources).toBeLessThan(100); // Not too many resources
    expect(resourceMetrics.totalTransferSize).toBeLessThan(5 * 1024 * 1024); // <5MB total
    
    // Check for compression and optimization
    const compressionCheck = await page.evaluate(() => {
      const responses = performance.getEntriesByType('resource');
      return responses.some(r => r.name.includes('.webp') || r.name.includes('.avif'));
    });
    
    if (compressionCheck) {
      console.log('✅ Modern image formats detected');
    }
  });

  test('should maintain performance during user interactions', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Test navigation performance
    const navigationLinks = page.locator('nav a, header a');
    
    if (await navigationLinks.count() > 0) {
      const navStartTime = Date.now();
      
      // Click first navigation link
      const firstNavLink = navigationLinks.first();
      await firstNavLink.click();
      await page.waitForLoadState('networkidle', { timeout: 10000 });
      
      const navTime = Date.now() - navStartTime;
      expect(navTime).toBeLessThan(5000); // 5 seconds for navigation
      console.log(`🧭 Navigation time: ${navTime}ms`);
    }
    
    // Test scroll performance with boxing content
    const scrollStartTime = Date.now();
    
    // Scroll through page content
    await page.evaluate(() => {
      window.scrollTo(0, document.body.scrollHeight / 2);
    });
    await page.waitForTimeout(1000);
    
    await page.evaluate(() => {
      window.scrollTo(0, document.body.scrollHeight);
    });
    await page.waitForTimeout(1000);
    
    const scrollTime = Date.now() - scrollStartTime;
    expect(scrollTime).toBeLessThan(3000); // Smooth scrolling
    console.log(`📜 Scroll performance: ${scrollTime}ms`);
  });

  test('should optimize font loading for boxing branding', async ({ page }) => {
    await page.goto('/');
    
    // Check for font loading optimization
    const fontMetrics = await page.evaluate(() => {
      const fonts = document.fonts;
      return {
        fontsLoaded: fonts.size,
        fontsReady: fonts.status === 'loaded'
      };
    });
    
    console.log(`🔤 Font metrics:`, fontMetrics);
    
    // Text should be readable during font loading (no FOIT)
    const headingText = page.locator('h1, h2').first();
    await expect(headingText).toBeVisible();
    
    // Check for font-display optimization
    const fontOptimization = await page.evaluate(() => {
      const stylesheets = Array.from(document.styleSheets);
      let hasSwapOptimization = false;
      
      try {
        stylesheets.forEach(sheet => {
          if (sheet.cssRules) {
            Array.from(sheet.cssRules).forEach(rule => {
              if (rule.type === CSSRule.FONT_FACE_RULE) {
                const fontFaceRule = rule as CSSFontFaceRule;
                if (fontFaceRule.style.fontDisplay === 'swap') {
                  hasSwapOptimization = true;
                }
              }
            });
          }
        });
      } catch (e) {
        // Cross-origin stylesheets may not be accessible
      }
      
      return hasSwapOptimization;
    });
    
    if (fontOptimization) {
      console.log('✅ Font-display: swap optimization detected');
    }
  });

  test('should handle image lazy loading for boxing galleries', async ({ page }) => {
    await page.goto('/');
    
    // Check for lazy loading implementation
    const lazyImages = page.locator('img[loading="lazy"]');
    const totalImages = page.locator('img');
    
    const lazyCount = await lazyImages.count();
    const totalCount = await totalImages.count();
    
    console.log(`🖼️ Image loading: ${lazyCount} lazy / ${totalCount} total`);
    
    if (totalCount > 3) {
      // Should have some lazy loaded images
      expect(lazyCount).toBeGreaterThan(0);
      
      // Test lazy loading behavior
      const lastImage = totalImages.last();
      
      // Scroll to trigger lazy loading
      await lastImage.scrollIntoViewIfNeeded();
      await page.waitForTimeout(1000);
      
      // Image should now be visible
      await expect(lastImage).toBeVisible();
    }
  });

  test('should optimize JavaScript loading and execution', async ({ page }) => {
    const startTime = Date.now();
    
    await page.goto('/');
    
    // Measure JavaScript execution time
    const jsMetrics = await page.evaluate(() => {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      const scripts = performance.getEntriesByType('resource').filter(r => r.initiatorType === 'script');
      
      return {
        domInteractive: navigation.domInteractive,
        domComplete: navigation.domComplete,
        scriptCount: scripts.length,
        totalScriptSize: scripts.reduce((sum, s) => sum + (s.transferSize || 0), 0)
      };
    });
    
    console.log(`⚙️ JavaScript metrics:`, jsMetrics);
    
    // JavaScript shouldn't block initial rendering
    expect(jsMetrics.domInteractive).toBeLessThan(3000); // DOM interactive <3s
    expect(jsMetrics.totalScriptSize).toBeLessThan(1024 * 1024); // <1MB of JS
    
    // Page should be interactive quickly
    const interactiveTime = Date.now() - startTime;
    expect(interactiveTime).toBeLessThan(5000);
  });

  test('should maintain performance on mobile devices', async ({ page, isMobile }) => {
    if (!isMobile) {
      // Simulate mobile viewport
      await page.setViewportSize({ width: 375, height: 667 });
    }
    
    // Simulate mobile CPU throttling
    const client = await page.context().newCDPSession(page);
    await client.send('Emulation.setCPUThrottlingRate', { rate: 4 });
    
    const startTime = Date.now();
    await page.goto('/');
    
    // Mobile users should get essential boxing content quickly
    await expect(page.locator('h1, h2').first()).toBeVisible({ timeout: 8000 });
    
    // Check for mobile-specific optimizations
    const mobileOptimizations = await page.evaluate(() => {
      return {
        hasViewportMeta: !!document.querySelector('meta[name="viewport"]'),
        hasTouchOptimization: window.matchMedia('(pointer: coarse)').matches,
        devicePixelRatio: window.devicePixelRatio
      };
    });
    
    console.log(`📱 Mobile optimizations:`, mobileOptimizations);
    expect(mobileOptimizations.hasViewportMeta).toBeTruthy();
    
    const mobileLoadTime = Date.now() - startTime;
    expect(mobileLoadTime).toBeLessThan(8000); // 8 seconds on mobile
    console.log(`📱 Mobile load time: ${mobileLoadTime}ms`);
    
    // Disable CPU throttling
    await client.send('Emulation.setCPUThrottlingRate', { rate: 1 });
  });

  test('should optimize for fight night traffic spikes', async ({ page }) => {
    // Simulate multiple concurrent page loads (fight night scenario)
    const loadPromises = [];
    const concurrent = 3; // Simulate 3 concurrent users
    
    for (let i = 0; i < concurrent; i++) {
      const newPage = await page.context().newPage();
      const loadPromise = performanceUtils.startMonitoring(newPage)
        .then(() => newPage.goto('/'))
        .then(() => newPage.waitForLoadState('networkidle'))
        .then(() => newPage.close());
      
      loadPromises.push(loadPromise);
    }
    
    const startTime = Date.now();
    
    // Wait for all concurrent loads to complete
    await Promise.all(loadPromises);
    
    const concurrentLoadTime = Date.now() - startTime;
    expect(concurrentLoadTime).toBeLessThan(15000); // 15 seconds for concurrent loads
    console.log(`🥊 Concurrent load test (${concurrent} users): ${concurrentLoadTime}ms`);
    
    // Original page should still be responsive
    await expect(page.locator('h1, h2').first()).toBeVisible();
  });

  test('should handle offline scenarios gracefully', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Ensure page is loaded first
    await expect(page.locator('h1, h2').first()).toBeVisible();
    
    // Simulate offline condition
    await page.context().setOffline(true);
    
    // Page should still function with cached content
    const offlineCheck = await page.evaluate(() => {
      return {
        hasServiceWorker: 'serviceWorker' in navigator,
        cacheStorage: 'caches' in window,
        isOnline: navigator.onLine
      };
    });
    
    console.log(`📡 Offline capabilities:`, offlineCheck);
    
    // Essential elements should still be visible
    await expect(page.locator('text=/Kumar Prescod|boxer/i')).toBeVisible();
    
    // Re-enable network
    await page.context().setOffline(false);
  });
});