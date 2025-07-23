import { test, expect, Page } from '@playwright/test';
import { performanceUtils } from '../utils/performance';
import { boxingAssertions } from '../utils/boxing-assertions';

/**
 * Homepage Hero Section Tests - Kumar Prescod Boxing
 * Tests the critical first impression for boxing fans
 */
test.describe('Homepage Hero Section - Boxing Fan Experience', () => {
  let performanceMetrics: any;

  test.beforeEach(async ({ page }) => {
    // Navigate to homepage and start performance monitoring
    performanceMetrics = await performanceUtils.startMonitoring(page);
    await page.goto('/');
  });

  test.afterEach(async ({ page }) => {
    // Capture performance metrics for boxing-specific analysis
    const metrics = await performanceUtils.captureMetrics(page, performanceMetrics);
    await test.info().attach('performance-metrics', {
      body: JSON.stringify(metrics),
      contentType: 'application/json'
    });
  });

  test('should load hero section with Kumar\'s branding under 3 seconds', async ({ page }) => {
    const startTime = Date.now();
    
    // Wait for hero section to be visible
    await expect(page.locator('section').first()).toBeVisible();
    
    // Check for Kumar's name and boxing branding
    await expect(page.locator('h1, h2')).toContainText(/Kumar Prescod|The Raw One/i);
    
    // Verify boxing-themed gradient background loads
    const heroSection = page.locator('[class*="hero"], [class*="gradient"]').first();
    await expect(heroSection).toBeVisible();
    
    // Performance assertion for boxing fans on mobile
    const loadTime = Date.now() - startTime;
    expect(loadTime).toBeLessThan(3000);
    
    // Check Core Web Vitals specific to boxing content
    const vitals = await page.evaluate(() => {
      return new Promise((resolve) => {
        new PerformanceObserver((list) => {
          const entries = list.getEntries();
          resolve(entries.map(entry => ({
            name: entry.name,
            value: entry.value || entry.duration,
            entryType: entry.entryType
          })));
        }).observe({ entryTypes: ['largest-contentful-paint', 'first-input', 'layout-shift'] });
        
        // Fallback if no entries yet
        setTimeout(() => resolve([]), 1000);
      });
    });
    
    console.log('🥊 Hero section Core Web Vitals:', vitals);
  });

  test('should display fight statistics prominently', async ({ page }) => {
    // Look for Kumar's fight record in hero area
    const statsSection = page.locator('[data-testid="stats-section"], .stats, [class*="stats"]');
    await expect(statsSection).toBeVisible({ timeout: 10000 });
    
    // Verify key boxing statistics are displayed
    await boxingAssertions.assertFightRecord(page, {
      wins: 3,
      losses: 0,
      draws: 0,
      knockoutPercentage: 100
    });
    
    // Check for professional record display
    const recordText = page.locator('text=/3-0|perfect|undefeated/i');
    await expect(recordText.first()).toBeVisible();
    
    // Verify knockout percentage is highlighted for boxing fans
    const koPercentage = page.locator('text=/100%|knockout/i');
    await expect(koPercentage.first()).toBeVisible();
  });

  test('should show upcoming homecoming fight prominently', async ({ page }) => {
    // Look for homecoming fight promotion
    const fightPromo = page.locator('text=/homecoming|august 16|oakland/i');
    await expect(fightPromo.first()).toBeVisible();
    
    // Check for fight date display
    await expect(page.locator('text=/aug.*16|august.*16|8.*16/i')).toBeVisible();
    
    // Verify ticket purchase CTA is prominent
    const ticketButton = page.locator('a[href*="ticket"], button:has-text("ticket"), a:has-text("ticket")');
    await expect(ticketButton.first()).toBeVisible();
    
    // Test ticket button accessibility for screen readers
    const ticketLink = ticketButton.first();
    await expect(ticketLink).toHaveAttribute('href');
    const href = await ticketLink.getAttribute('href');
    expect(href).toBeTruthy();
  });

  test('should load background video without blocking content', async ({ page }) => {
    // Check if hero background video exists
    const backgroundVideo = page.locator('video[autoplay], video[data-autoplay]');
    
    if (await backgroundVideo.count() > 0) {
      // Video should not block other content loading
      await expect(page.locator('h1, h2').first()).toBeVisible({ timeout: 5000 });
      
      // Video should load without errors
      const videoElement = backgroundVideo.first();
      const videoError = await videoElement.evaluate((video: HTMLVideoElement) => {
        return video.error ? video.error.message : null;
      });
      expect(videoError).toBeNull();
      
      // Video should be muted for autoplay compliance
      const isMuted = await videoElement.evaluate((video: HTMLVideoElement) => video.muted);
      expect(isMuted).toBeTruthy();
    }
  });

  test('should display social media links for boxing fans', async ({ page }) => {
    // Look for social media links in hero or nearby section
    const socialLinks = page.locator('a[href*="instagram"], a[href*="twitter"], a[href*="youtube"]');
    
    // At least one social media link should be present
    await expect(socialLinks.first()).toBeVisible();
    
    // Check social links open in new tab
    const instagramLink = page.locator('a[href*="instagram"]');
    if (await instagramLink.count() > 0) {
      await expect(instagramLink.first()).toHaveAttribute('target', '_blank');
      await expect(instagramLink.first()).toHaveAttribute('rel', /noopener/);
    }
  });

  test('should be accessible to screen readers for fight stats', async ({ page }) => {
    // Check for proper heading structure
    const mainHeading = page.locator('h1').first();
    await expect(mainHeading).toBeVisible();
    
    // Verify fight statistics have proper labels
    const statsElements = page.locator('[data-testid="stats"] *:has-text("wins"), *:has-text("losses"), *:has-text("knockouts")');
    
    if (await statsElements.count() > 0) {
      // Stats should have accessible labels or aria-labels
      for (let i = 0; i < await statsElements.count(); i++) {
        const element = statsElements.nth(i);
        const hasAccessibleName = await element.evaluate((el) => {
          return !!(el.getAttribute('aria-label') || el.getAttribute('aria-labelledby') || el.textContent?.trim());
        });
        expect(hasAccessibleName).toBeTruthy();
      }
    }
  });

  test('should handle mobile boxing fan interactions', async ({ page, isMobile }) => {
    if (!isMobile) {
      test.skip('Mobile-specific test');
    }
    
    // Test touch interactions for boxing fans on mobile
    const ctaButton = page.locator('a:has-text("ticket"), button:has-text("ticket")').first();
    
    if (await ctaButton.count() > 0) {
      // Button should be large enough for touch (44px minimum)
      const buttonSize = await ctaButton.boundingBox();
      expect(buttonSize?.height).toBeGreaterThanOrEqual(44);
      expect(buttonSize?.width).toBeGreaterThanOrEqual(44);
      
      // Test touch interaction
      await ctaButton.tap();
      
      // Should navigate or show interaction feedback
      await page.waitForTimeout(1000); // Allow for navigation or modal
    }
  });

  test('should load fight promotion images efficiently', async ({ page }) => {
    // Look for fight promotion images
    const fightImages = page.locator('img[src*="fight"], img[src*="IMG_5882"], img[src*="IMG_7202"]');
    
    if (await fightImages.count() > 0) {
      // Images should load within reasonable time
      await expect(fightImages.first()).toBeVisible({ timeout: 10000 });
      
      // Check image optimization
      for (let i = 0; i < Math.min(3, await fightImages.count()); i++) {
        const img = fightImages.nth(i);
        const imgSrc = await img.getAttribute('src');
        
        if (imgSrc) {
          // Verify image exists and loads
          const response = await page.request.get(imgSrc);
          expect(response.status()).toBe(200);
          
          // Check for lazy loading attribute
          const hasLazyLoading = await img.getAttribute('loading');
          if (i > 0) { // First image shouldn't be lazy loaded
            expect(hasLazyLoading).toBe('lazy');
          }
        }
      }
    }
  });

  test('should show proper error handling for missing content', async ({ page }) => {
    // Test graceful degradation when images or videos fail to load
    await page.route('**/*.{jpg,jpeg,png,mp4,webm}', route => {
      // Simulate network issues during fight night traffic
      if (Math.random() < 0.3) { // 30% failure rate
        route.abort();
      } else {
        route.continue();
      }
    });
    
    await page.reload();
    
    // Page should still be functional
    await expect(page.locator('h1, h2').first()).toBeVisible({ timeout: 15000 });
    
    // Essential content should still be displayed
    await expect(page.locator('text=/Kumar Prescod|boxing|fighter/i')).toBeVisible();
    
    // Navigation should still work
    const navigation = page.locator('nav, header');
    if (await navigation.count() > 0) {
      await expect(navigation.first()).toBeVisible();
    }
  });
});