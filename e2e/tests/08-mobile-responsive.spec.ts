import { test, expect, Page } from '@playwright/test';
import { performanceUtils } from '../utils/performance';

/**
 * Mobile Responsive Tests - Kumar Prescod Boxing
 * Tests mobile responsive behavior optimized for boxing fans accessing during fight events
 */
test.describe('Mobile Responsive Design - Boxing Fan Mobile Experience', () => {
  // Common mobile viewport sizes for boxing fans
  const mobileViewports = [
    { name: 'iPhone SE', width: 375, height: 667 },
    { name: 'iPhone 12', width: 390, height: 844 },
    { name: 'Samsung Galaxy S21', width: 360, height: 800 },
    { name: 'iPhone 12 Pro Max', width: 428, height: 926 }
  ];

  test.beforeEach(async ({ page }) => {
    // Set initial mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
  });

  test('should adapt to various mobile screen sizes for boxing content', async ({ page }) => {
    for (const viewport of mobileViewports) {
      console.log(`📱 Testing ${viewport.name} (${viewport.width}x${viewport.height})`);
      
      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      await page.goto('/');
      await page.waitForLoadState('networkidle');
      
      // Essential boxing content should be visible
      await expect(page.locator('h1, h2').first()).toBeVisible();
      
      // Check if content fits within viewport
      const mainContent = page.locator('main, body > div').first();
      if (await mainContent.count() > 0) {
        const contentBox = await mainContent.boundingBox();
        
        if (contentBox) {
          // Content should not exceed viewport width
          expect(contentBox.width).toBeLessThanOrEqual(viewport.width + 20); // 20px tolerance
          
          // No horizontal scrolling should be needed
          const hasHorizontalScroll = await page.evaluate(() => {
            return document.documentElement.scrollWidth > document.documentElement.clientWidth;
          });
          
          if (hasHorizontalScroll) {
            console.warn(`⚠️ Horizontal scroll detected on ${viewport.name}`);
          }
        }
      }
      
      // Boxing-specific content should be readable
      const fightRecord = page.locator('text=/3-0|perfect|undefeated/i');
      if (await fightRecord.count() > 0) {
        await expect(fightRecord.first()).toBeVisible();
      }
    }
  });

  test('should provide touch-friendly boxing interaction elements', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Check interactive elements for touch accessibility
    const interactiveElements = page.locator('button, a, input, [role="button"], [tabindex="0"]');
    const elementCount = await interactiveElements.count();
    
    if (elementCount > 0) {
      for (let i = 0; i < Math.min(10, elementCount); i++) {
        const element = interactiveElements.nth(i);
        
        if (await element.isVisible()) {
          const elementBox = await element.boundingBox();
          
          if (elementBox) {
            // Touch targets should be at least 44x44px (WCAG guideline)
            expect(elementBox.height).toBeGreaterThanOrEqual(44);
            expect(elementBox.width).toBeGreaterThanOrEqual(44);
            
            // Test touch interaction
            try {
              await element.tap({ timeout: 1000 });
              console.log(`✅ Touch interaction successful for element ${i + 1}`);
            } catch (error) {
              console.log(`⚠️ Touch interaction failed for element ${i + 1}: ${error}`);
            }
          }
        }
      }
    }
    
    // Test specific boxing interactions
    const ticketButton = page.locator('a[href*="ticket"], button:has-text("ticket")');
    if (await ticketButton.count() > 0) {
      const buttonBox = await ticketButton.first().boundingBox();
      expect(buttonBox?.height).toBeGreaterThanOrEqual(48); // Larger for important CTA
      expect(buttonBox?.width).toBeGreaterThanOrEqual(120); // Wide enough for text
    }
  });

  test('should optimize boxing images for mobile viewing', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Check boxing image optimization
    const boxingImages = page.locator('img[src*="training"], img[src*="fight"], img[src*="DSC"]');
    const imageCount = await boxingImages.count();
    
    if (imageCount > 0) {
      console.log(`🖼️ Testing ${imageCount} boxing images for mobile optimization`);
      
      for (let i = 0; i < Math.min(5, imageCount); i++) {
        const img = boxingImages.nth(i);
        
        if (await img.isVisible()) {
          const imgBox = await img.boundingBox();
          
          if (imgBox) {
            // Images should fit mobile screen
            expect(imgBox.width).toBeLessThanOrEqual(400); // Max mobile width
            
            // Check for responsive image attributes
            const srcset = await img.getAttribute('srcset');
            const sizes = await img.getAttribute('sizes');
            
            if (srcset) {
              console.log(`✅ Image ${i + 1} has responsive srcset`);
            }
            
            if (sizes) {
              console.log(`✅ Image ${i + 1} has sizes attribute`);
            }
            
            // Check loading optimization
            const loading = await img.getAttribute('loading');
            if (i > 0 && loading === 'lazy') {
              console.log(`✅ Image ${i + 1} uses lazy loading`);
            }
          }
        }
      }
    }
  });

  test('should provide mobile-optimized navigation for boxing sections', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Look for mobile navigation elements
    const mobileNav = page.locator(
      '[data-testid="mobile-nav"], .mobile-menu, .hamburger, ' +
      'button[aria-label*="menu"], button[aria-label*="navigation"]'
    );
    
    if (await mobileNav.count() > 0) {
      const navButton = mobileNav.first();
      await expect(navButton).toBeVisible();
      
      // Mobile nav button should be touch-friendly
      const navBox = await navButton.boundingBox();
      expect(navBox?.height).toBeGreaterThanOrEqual(44);
      expect(navBox?.width).toBeGreaterThanOrEqual(44);
      
      // Test mobile navigation functionality
      await navButton.tap();
      await page.waitForTimeout(500);
      
      // Navigation menu should appear
      const navMenu = page.locator('.nav-menu, .mobile-menu-open, [data-open="true"]');
      if (await navMenu.count() > 0) {
        await expect(navMenu.first()).toBeVisible();
        console.log('✅ Mobile navigation menu opens successfully');
        
        // Check for boxing-specific navigation items
        const boxingNavItems = navMenu.locator('a:has-text("fights"), a:has-text("training"), a:has-text("record")');
        if (await boxingNavItems.count() > 0) {
          console.log(`🥊 Found ${await boxingNavItems.count()} boxing navigation items`);
        }
        
        // Close navigation
        await navButton.tap();
        await page.waitForTimeout(500);
      }
    } else {
      // Check if desktop navigation adapts to mobile
      const desktopNav = page.locator('nav a, header a');
      if (await desktopNav.count() > 0) {
        // Navigation items should be stacked or hidden on mobile
        const firstNavItem = desktopNav.first();
        const navStyles = await firstNavItem.evaluate((el) => {
          const styles = window.getComputedStyle(el);
          return {
            display: styles.display,
            visibility: styles.visibility,
            fontSize: styles.fontSize
          };
        });
        
        console.log('📱 Desktop navigation styles on mobile:', navStyles);
      }
    }
  });

  test('should optimize boxing statistics display for mobile', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Find boxing statistics
    const statsSection = page.locator('[data-testid*="stats"], .stats, [class*="stat"]');
    
    if (await statsSection.count() > 0) {
      const stats = statsSection.first();
      await expect(stats).toBeVisible();
      
      const statsBox = await stats.boundingBox();
      
      if (statsBox) {
        // Stats should fit mobile screen
        expect(statsBox.width).toBeLessThanOrEqual(380);
        
        // Stats should be readable on mobile
        const statItems = stats.locator('*:has-text("wins"), *:has-text("losses"), *:has-text("knockouts")');
        const statCount = await statItems.count();
        
        if (statCount > 0) {
          for (let i = 0; i < Math.min(3, statCount); i++) {
            const statItem = statItems.nth(i);
            
            // Text should be large enough for mobile
            const fontSize = await statItem.evaluate((el) => {
              return parseInt(window.getComputedStyle(el).fontSize);
            });
            
            expect(fontSize).toBeGreaterThanOrEqual(14); // Minimum readable size
            
            // Stats should be properly spaced for touch
            const itemBox = await statItem.boundingBox();
            if (itemBox) {
              expect(itemBox.height).toBeGreaterThanOrEqual(20);
            }
          }
        }
      }
    }
    
    // Check fight record display on mobile
    const fightRecord = page.locator('text=/3-0|perfect record|undefeated/i');
    if (await fightRecord.count() > 0) {
      const recordElement = fightRecord.first();
      const recordBox = await recordElement.boundingBox();
      
      if (recordBox) {
        // Fight record should be prominently displayed
        expect(recordBox.width).toBeGreaterThan(100);
        expect(recordBox.height).toBeGreaterThan(30);
      }
    }
  });

  test('should handle mobile video content for boxing fans', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Find video content
    const videos = page.locator('video, iframe[src*="youtube"], iframe[src*="vimeo"]');
    const videoCount = await videos.count();
    
    if (videoCount > 0) {
      console.log(`🎬 Testing ${videoCount} videos for mobile optimization`);
      
      for (let i = 0; i < Math.min(3, videoCount); i++) {
        const video = videos.nth(i);
        
        if (await video.isVisible()) {
          const videoBox = await video.boundingBox();
          
          if (videoBox) {
            // Videos should fit mobile screen
            expect(videoBox.width).toBeLessThanOrEqual(380);
            
            // Aspect ratio should be maintained
            const aspectRatio = videoBox.width / videoBox.height;
            expect(aspectRatio).toBeGreaterThan(0.5); // Not too tall
            expect(aspectRatio).toBeLessThan(3); // Not too wide
            
            const tagName = await video.evaluate(el => el.tagName.toLowerCase());
            
            if (tagName === 'video') {
              // Native video should have controls
              const hasControls = await video.getAttribute('controls');
              expect(hasControls).toBeTruthy();
              
              // Check for mobile-friendly video settings
              const videoAttributes = await video.evaluate((vid: HTMLVideoElement) => ({
                preload: vid.preload,
                muted: vid.muted,
                autoplay: vid.autoplay,
                playsinline: vid.hasAttribute('playsinline')
              }));
              
              // Mobile videos should play inline (iOS requirement)
              if (!videoAttributes.playsinline) {
                console.warn('⚠️ Video missing playsinline attribute for iOS');
              }
              
              console.log(`📱 Video ${i + 1} mobile attributes:`, videoAttributes);
            }
          }
        }
      }
    }
  });

  test('should optimize text readability for mobile boxing fans', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Check text elements for mobile readability
    const textElements = page.locator('h1, h2, h3, p, a, span').first();
    const elementCount = await textElements.count();
    
    if (elementCount > 0) {
      for (let i = 0; i < Math.min(10, elementCount); i++) {
        const element = textElements.nth(i);
        
        if (await element.isVisible()) {
          const textStyles = await element.evaluate((el) => {
            const styles = window.getComputedStyle(el);
            return {
              fontSize: parseInt(styles.fontSize),
              lineHeight: styles.lineHeight,
              fontWeight: styles.fontWeight,
              color: styles.color,
              textAlign: styles.textAlign
            };
          });
          
          const tagName = await element.evaluate(el => el.tagName.toLowerCase());
          
          // Font size requirements based on element type
          const minFontSizes = {
            'h1': 24,
            'h2': 20,
            'h3': 18,
            'p': 16,
            'a': 16,
            'span': 14
          };
          
          const minSize = minFontSizes[tagName] || 14;
          expect(textStyles.fontSize).toBeGreaterThanOrEqual(minSize);
          
          console.log(`📱 ${tagName} mobile text: ${textStyles.fontSize}px (min: ${minSize}px)`);
        }
      }
    }
    
    // Check specific boxing content readability
    const boxingText = page.locator('text=/Kumar Prescod|The Raw One|Professional Boxer/i');
    if (await boxingText.count() > 0) {
      const mainText = boxingText.first();
      const textBox = await mainText.boundingBox();
      
      if (textBox) {
        // Main boxing text should be prominent
        expect(textBox.height).toBeGreaterThan(20);
        
        const fontSize = await mainText.evaluate((el) => {
          return parseInt(window.getComputedStyle(el).fontSize);
        });
        
        expect(fontSize).toBeGreaterThanOrEqual(18); // Prominent text
      }
    }
  });

  test('should provide mobile-optimized forms and inputs', async ({ page }) => {
    await page.goto('/');
    
    // Look for form elements
    const formElements = page.locator('input, select, textarea, button[type="submit"]');
    const formCount = await formElements.count();
    
    if (formCount > 0) {
      console.log(`📋 Testing ${formCount} form elements for mobile optimization`);
      
      for (let i = 0; i < Math.min(5, formCount); i++) {
        const element = formElements.nth(i);
        
        if (await element.isVisible()) {
          const elementBox = await element.boundingBox();
          
          if (elementBox) {
            // Form elements should be touch-friendly
            expect(elementBox.height).toBeGreaterThanOrEqual(44);
            
            const tagName = await element.evaluate(el => el.tagName.toLowerCase());
            const type = await element.getAttribute('type');
            
            if (tagName === 'input') {
              // Check mobile-optimized input attributes
              const mobileAttributes = await element.evaluate((input) => ({
                inputMode: input.getAttribute('inputmode'),
                autocomplete: input.getAttribute('autocomplete'),
                pattern: input.getAttribute('pattern'),
                placeholder: input.getAttribute('placeholder')
              }));
              
              console.log(`📱 Input[${type}] mobile attributes:`, mobileAttributes);
              
              // Email inputs should trigger email keyboard
              if (type === 'email' && !mobileAttributes.inputMode) {
                console.warn('⚠️ Email input missing inputmode="email"');
              }
              
              // Phone inputs should trigger numeric keyboard
              if (type === 'tel' && !mobileAttributes.inputMode) {
                console.warn('⚠️ Tel input missing inputmode="tel"');
              }
            }
          }
        }
      }
    }
  });

  test('should handle orientation changes for boxing content', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Test portrait orientation (default)
    await page.setViewportSize({ width: 375, height: 667 });
    await expect(page.locator('h1, h2').first()).toBeVisible();
    
    // Switch to landscape orientation
    await page.setViewportSize({ width: 667, height: 375 });
    await page.waitForTimeout(1000); // Allow for reflow
    
    // Content should still be accessible in landscape
    await expect(page.locator('h1, h2').first()).toBeVisible();
    
    // Check if boxing stats are still readable
    const statsSection = page.locator('[data-testid*="stats"], .stats, [class*="stat"]');
    if (await statsSection.count() > 0) {
      await expect(statsSection.first()).toBeVisible();
    }
    
    // Fight record should remain visible
    const fightRecord = page.locator('text=/3-0|perfect|undefeated/i');
    if (await fightRecord.count() > 0) {
      await expect(fightRecord.first()).toBeVisible();
    }
    
    // Navigation should adapt to landscape
    const navigation = page.locator('nav, header');
    if (await navigation.count() > 0) {
      const navBox = await navigation.first().boundingBox();
      if (navBox) {
        // Navigation shouldn't take up too much vertical space in landscape
        expect(navBox.height).toBeLessThan(200);
      }
    }
    
    console.log('✅ Boxing content adapts to landscape orientation');
  });

  test('should optimize for mobile performance during fight events', async ({ page }) => {
    // Simulate mobile device with limited resources
    const client = await page.context().newCDPSession(page);
    await client.send('Emulation.setCPUThrottlingRate', { rate: 4 }); // 4x CPU slowdown
    
    // Simulate 3G network for fight night traffic
    await performanceUtils.simulateSlowNetwork(page, '3G');
    
    const startTime = Date.now();
    await page.goto('/');
    
    // Critical boxing content should load quickly even on slow mobile
    await expect(page.locator('text=/Kumar|boxer|fighter/i')).toBeVisible({ timeout: 12000 });
    
    // Fight record should be accessible
    const fightRecord = page.locator('text=/3-0|perfect|undefeated/i');
    if (await fightRecord.count() > 0) {
      await expect(fightRecord.first()).toBeVisible({ timeout: 10000 });
    }
    
    // Ticket button should be accessible (important during fight events)
    const ticketButton = page.locator('a[href*="ticket"], button:has-text("ticket")');
    if (await ticketButton.count() > 0) {
      await expect(ticketButton.first()).toBeVisible({ timeout: 8000 });
    }
    
    const loadTime = Date.now() - startTime;
    expect(loadTime).toBeLessThan(12000); // 12 seconds max on slow mobile
    console.log(`📱 Slow mobile load time: ${loadTime}ms`);
    
    // Reset throttling
    await client.send('Emulation.setCPUThrottlingRate', { rate: 1 });
  });

  test('should provide accessible mobile interactions for boxing fans', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Test swipe gestures for galleries if present
    const gallery = page.locator('.gallery, .photo-grid, [data-testid="gallery"]');
    if (await gallery.count() > 0) {
      const galleryBox = await gallery.first().boundingBox();
      
      if (galleryBox) {
        // Test horizontal swipe
        await page.mouse.move(galleryBox.x + 50, galleryBox.y + galleryBox.height / 2);
        await page.mouse.down();
        await page.mouse.move(galleryBox.x + galleryBox.width - 50, galleryBox.y + galleryBox.height / 2);
        await page.mouse.up();
        
        await page.waitForTimeout(500);
        console.log('✅ Gallery swipe gesture tested');
      }
    }
    
    // Test pull-to-refresh if implemented
    const pullToRefreshArea = page.locator('body, main, [data-pulltorefresh]');
    if (await pullToRefreshArea.count() > 0) {
      // Simulate pull down gesture
      await page.mouse.move(200, 100);
      await page.mouse.down();
      await page.mouse.move(200, 200);
      await page.waitForTimeout(500);
      await page.mouse.up();
      
      console.log('✅ Pull-to-refresh gesture tested');
    }
    
    // Test mobile share functionality
    const shareButton = page.locator('button:has-text("share"), [data-action="share"]');
    if (await shareButton.count() > 0) {
      // Check if Web Share API is available
      const hasNativeShare = await page.evaluate(() => {
        return 'share' in navigator;
      });
      
      if (hasNativeShare) {
        console.log('📱 Native mobile sharing available');
      }
      
      await shareButton.first().tap();
      await page.waitForTimeout(1000);
    }
  });

  test('should handle mobile app-like features for boxing fans', async ({ page }) => {
    await page.goto('/');
    
    // Check for PWA features
    const pwaFeatures = await page.evaluate(() => {
      return {
        hasManifest: !!document.querySelector('link[rel="manifest"]'),
        hasServiceWorker: 'serviceWorker' in navigator,
        hasAppInstallPrompt: 'onbeforeinstallprompt' in window,
        canShare: 'share' in navigator,
        hasFullscreen: 'requestFullscreen' in document.documentElement
      };
    });
    
    console.log('📱 PWA features detected:', pwaFeatures);
    
    if (pwaFeatures.hasManifest) {
      // Check manifest for boxing app details
      const manifestLink = page.locator('link[rel="manifest"]');
      const manifestHref = await manifestLink.getAttribute('href');
      
      if (manifestHref) {
        const manifestResponse = await page.request.get(manifestHref);
        if (manifestResponse.ok()) {
          const manifest = await manifestResponse.json();
          
          // Manifest should have boxing-related info
          expect(manifest.name || manifest.short_name).toMatch(/Kumar|Prescod|Boxing/i);
          
          console.log('✅ Boxing PWA manifest validated');
        }
      }
    }
    
    // Check for mobile notifications setup
    if (pwaFeatures.hasServiceWorker) {
      const notificationPermission = await page.evaluate(() => {
        return 'Notification' in window ? Notification.permission : 'unavailable';
      });
      
      console.log(`🔔 Notification permission: ${notificationPermission}`);
    }
    
    // Test fullscreen capability for fight videos
    if (pwaFeatures.hasFullscreen) {
      console.log('✅ Fullscreen API available for boxing videos');
    }
  });
});