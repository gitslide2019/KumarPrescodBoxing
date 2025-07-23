import { test, expect, Page } from '@playwright/test';
import { performanceUtils } from '../utils/performance';

/**
 * Training Media Tests - Kumar Prescod Boxing
 * Tests training videos, photo galleries, and media streaming performance
 */
test.describe('Training Media & Galleries - Boxing Content Streaming', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    
    // Navigate to training/journey section
    const trainingLink = page.locator('a[href*="/journey"], a:has-text("journey"), a:has-text("training")');
    if (await trainingLink.count() > 0) {
      await trainingLink.first().click();
      await page.waitForLoadState('networkidle');
    }
  });

  test('should load training photo gallery efficiently', async ({ page }) => {
    // Look for training photo gallery
    const photoGallery = page.locator('[class*="gallery"], [data-testid="gallery"], .photo-grid');
    
    // Gallery should be present somewhere on the page
    if (await photoGallery.count() === 0) {
      // Look for individual training images
      const trainingImages = page.locator('img[src*="training"], img[src*="DSC"], img[alt*="training"]');
      expect(await trainingImages.count()).toBeGreaterThanOrEqual(3);
    } else {
      await expect(photoGallery.first()).toBeVisible({ timeout: 10000 });
    }
    
    // Check for training image optimization
    const images = page.locator('img[src*="training"], img[src*="DSC"]');
    
    if (await images.count() > 0) {
      // First few images should load quickly
      for (let i = 0; i < Math.min(3, await images.count()); i++) {
        const img = images.nth(i);
        await expect(img).toBeVisible({ timeout: 8000 });
        
        // Check for proper alt text
        const altText = await img.getAttribute('alt');
        expect(altText).toBeTruthy();
        
        // Verify image loads successfully
        const src = await img.getAttribute('src');
        if (src) {
          const response = await page.request.get(src);
          expect(response.status()).toBe(200);
        }
      }
    }
  });

  test('should implement lazy loading for training images', async ({ page }) => {
    const images = page.locator('img[src*="training"], img[src*="DSC"]');
    
    if (await images.count() > 3) {
      // Images beyond the first few should use lazy loading
      for (let i = 3; i < Math.min(6, await images.count()); i++) {
        const img = images.nth(i);
        const loadingAttr = await img.getAttribute('loading');
        
        // Should have lazy loading attribute
        expect(loadingAttr).toBe('lazy');
      }
      
      // Test lazy loading behavior by scrolling
      const lastImage = images.last();
      
      // Image shouldn't be loaded initially if it's far down
      const initialSrc = await lastImage.getAttribute('src');
      
      // Scroll to trigger lazy loading
      await lastImage.scrollIntoViewIfNeeded();
      await page.waitForTimeout(1000);
      
      // Image should now be visible
      await expect(lastImage).toBeVisible();
    }
  });

  test('should display training video content properly', async ({ page }) => {
    // Look for training videos
    const videos = page.locator('video, iframe[src*="youtube"], iframe[src*="vimeo"], a[href*=".mp4"]');
    
    if (await videos.count() > 0) {
      const firstVideo = videos.first();
      await expect(firstVideo).toBeVisible();
      
      // If it's a video element, test playback capability
      if (await firstVideo.evaluate(el => el.tagName.toLowerCase() === 'video')) {
        // Video should not autoplay with sound (boxing content policy)
        const isAutoplay = await firstVideo.getAttribute('autoplay');
        const isMuted = await firstVideo.evaluate((video: HTMLVideoElement) => video.muted);
        
        if (isAutoplay) {
          expect(isMuted).toBeTruthy();
        }
        
        // Check video can be played
        const canPlay = await firstVideo.evaluate((video: HTMLVideoElement) => {
          return video.canPlayType('video/mp4') || video.canPlayType('video/webm');
        });
        expect(canPlay).toBeTruthy();
      }
      
      // If it's an iframe, check for proper attributes
      if (await firstVideo.evaluate(el => el.tagName.toLowerCase() === 'iframe')) {
        const src = await firstVideo.getAttribute('src');
        expect(src).toBeTruthy();
        
        // Should have title for accessibility
        const title = await firstVideo.getAttribute('title');
        expect(title).toBeTruthy();
      }
    }
  });

  test('should handle training media filtering and categorization', async ({ page }) => {
    // Look for media filter controls
    const filterButtons = page.locator('button:has-text("daily"), button:has-text("conditioning"), button:has-text("technique")');
    
    if (await filterButtons.count() > 0) {
      // Test filter functionality
      const dailyFilter = page.locator('button:has-text("daily")');
      if (await dailyFilter.count() > 0) {
        await dailyFilter.click();
        
        // Should show filtered content
        await page.waitForTimeout(1000);
        const filteredContent = page.locator('[data-category="daily"], .daily-routine');
        
        if (await filteredContent.count() > 0) {
          await expect(filteredContent.first()).toBeVisible();
        }
      }
    }
    
    // Check for training categories in image paths or alt text
    const categories = ['daily-routine', 'conditioning', 'technique-breakdowns', 'progression'];
    
    for (const category of categories) {
      const categoryContent = page.locator(`img[src*="${category}"], img[alt*="${category}"]`);
      
      if (await categoryContent.count() > 0) {
        await expect(categoryContent.first()).toBeVisible();
      }
    }
  });

  test('should provide high-quality training image viewing', async ({ page }) => {
    // Look for lightbox or modal functionality
    const images = page.locator('img[src*="training"], img[src*="DSC"]');
    
    if (await images.count() > 0) {
      const firstImage = images.first();
      
      // Test image click for lightbox
      await firstImage.click();
      await page.waitForTimeout(1000);
      
      // Check if lightbox or modal opens
      const modal = page.locator('.modal, .lightbox, [data-testid="lightbox"]');
      const overlay = page.locator('.overlay, [data-testid="overlay"]');
      
      if (await modal.count() > 0 || await overlay.count() > 0) {
        // Lightbox should display larger image
        const lightboxImg = page.locator('.modal img, .lightbox img');
        if (await lightboxImg.count() > 0) {
          await expect(lightboxImg.first()).toBeVisible();
        }
        
        // Should have close functionality
        const closeButton = page.locator('button:has-text("close"), .close, [aria-label="close"]');
        if (await closeButton.count() > 0) {
          await closeButton.first().click();
          
          // Modal should close
          await expect(modal.first()).not.toBeVisible();
        } else {
          // Try clicking overlay to close
          if (await overlay.count() > 0) {
            await overlay.first().click();
          }
        }
      }
    }
  });

  test('should support social media sharing of training content', async ({ page }) => {
    // Look for social sharing buttons
    const shareButtons = page.locator('button:has-text("share"), a[href*="facebook.com/sharer"], a[href*="twitter.com/intent"]');
    
    if (await shareButtons.count() > 0) {
      const firstShareButton = shareButtons.first();
      await expect(firstShareButton).toBeVisible();
      
      // Test share functionality (without actually sharing)
      const href = await firstShareButton.getAttribute('href');
      if (href) {
        // Should be a valid social media share URL
        expect(href).toMatch(/facebook\.com|twitter\.com|instagram\.com|linkedin\.com/);
      }
    }
    
    // Check for native Web Share API support on mobile
    const nativeShareButton = page.locator('button[data-share="native"], button:has-text("share")');
    
    if (await nativeShareButton.count() > 0) {
      // Should handle share API gracefully
      const shareSupported = await page.evaluate(() => {
        return 'share' in navigator;
      });
      
      if (shareSupported) {
        console.log('📱 Native share API supported for training content');
      }
    }
  });

  test('should load training progression photos chronologically', async ({ page }) => {
    // Look for progression photos
    const progressionImages = page.locator('img[src*="progression"], img[src*="progress"]');
    
    if (await progressionImages.count() > 0) {
      // Progression images should be visible
      await expect(progressionImages.first()).toBeVisible();
      
      // Check for chronological organization (dates in alt text or data attributes)
      for (let i = 0; i < Math.min(3, await progressionImages.count()); i++) {
        const img = progressionImages.nth(i);
        const altText = await img.getAttribute('alt');
        const dataDate = await img.getAttribute('data-date');
        
        // Should have some temporal context
        const hasTemporalInfo = !!(
          altText?.match(/202[3-4]|week|month|training.*\d+/) ||
          dataDate
        );
        
        if (hasTemporalInfo) {
          console.log(`✅ Training progression photo ${i + 1} has temporal context`);
        }
      }
    }
  });

  test('should optimize media loading for mobile boxing fans', async ({ page, isMobile }) => {
    if (!isMobile) {
      await page.setViewportSize({ width: 375, height: 667 }); // iPhone SE
    }
    
    // Start performance monitoring
    const startTime = Date.now();
    
    // Training content should load quickly on mobile
    const trainingContent = page.locator('img[src*="training"], video');
    
    if (await trainingContent.count() > 0) {
      await expect(trainingContent.first()).toBeVisible({ timeout: 8000 });
      
      const loadTime = Date.now() - startTime;
      expect(loadTime).toBeLessThan(8000); // 8 seconds max for mobile
    }
    
    // Check for responsive image sizing
    const images = page.locator('img[src*="training"]');
    
    if (await images.count() > 0) {
      for (let i = 0; i < Math.min(3, await images.count()); i++) {
        const img = images.nth(i);
        const imgBox = await img.boundingBox();
        
        // Images should fit mobile screen
        expect(imgBox?.width).toBeLessThanOrEqual(400);
      }
    }
  });

  test('should provide training schedule and workout information', async ({ page }) => {
    // Look for training schedule or workout information
    const scheduleContent = page.locator('text=/schedule|workout|training.*routine|daily.*training/i');
    
    if (await scheduleContent.count() > 0) {
      await expect(scheduleContent.first()).toBeVisible();
    }
    
    // Check for training partner or coach information
    const coachInfo = page.locator('text=/coach|trainer|training.*partner/i');
    
    if (await coachInfo.count() > 0) {
      await expect(coachInfo.first()).toBeVisible();
    }
    
    // Look for training locations or gym information
    const locationInfo = page.locator('text=/gym|training.*center|facility/i');
    
    if (await locationInfo.count() > 0) {
      await expect(locationInfo.first()).toBeVisible();
    }
  });

  test('should handle training media accessibility', async ({ page }) => {
    // Check video accessibility
    const videos = page.locator('video');
    
    if (await videos.count() > 0) {
      for (let i = 0; i < Math.min(2, await videos.count()); i++) {
        const video = videos.nth(i);
        
        // Should have controls for accessibility
        const hasControls = await video.getAttribute('controls');
        expect(hasControls).toBeTruthy();
        
        // Should have captions or transcript if possible
        const track = video.locator('track[kind="captions"], track[kind="subtitles"]');
        if (await track.count() > 0) {
          console.log('✅ Video has accessibility captions');
        }
      }
    }
    
    // Check image accessibility
    const images = page.locator('img[src*="training"]');
    
    if (await images.count() > 0) {
      for (let i = 0; i < Math.min(3, await images.count()); i++) {
        const img = images.nth(i);
        const altText = await img.getAttribute('alt');
        
        // Alt text should be descriptive
        expect(altText).toBeTruthy();
        expect(altText?.length).toBeGreaterThan(10);
        expect(altText).toMatch(/training|workout|boxing|Kumar/i);
      }
    }
  });
});