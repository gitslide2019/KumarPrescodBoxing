import { test, expect, Page } from '@playwright/test';

/**
 * Visual Regression Tests - Kumar Prescod Boxing
 * Tests visual consistency for fight posters, hero images, and responsive layouts
 */
test.describe('Visual Regression Testing - Boxing Brand Consistency', () => {
  // Configure visual comparisons for boxing website
  test.use({
    // Use consistent viewport for baseline comparisons
    viewport: { width: 1280, height: 720 }
  });

  test('should maintain homepage hero section visual consistency', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Wait for hero content to fully load
    const heroSection = page.locator('[class*="hero"], section').first();
    await expect(heroSection).toBeVisible();
    
    // Wait for any animations to complete
    await page.waitForTimeout(2000);
    
    // Take screenshot of hero section
    await expect(heroSection).toHaveScreenshot('homepage-hero-section.png', {
      // Boxing-specific visual comparison settings
      threshold: 0.2, // Allow for minor differences in boxing images
      maxDiffPixels: 1000, // Tolerance for dynamic content
      animations: 'disabled' // Disable animations for consistent screenshots
    });
    
    console.log('📸 Homepage hero section visual baseline captured');
  });

  test('should maintain fight record statistics visual layout', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Find statistics section
    const statsSection = page.locator('[data-testid*="stats"], .stats, [class*="stat"]');
    
    if (await statsSection.count() > 0) {
      await expect(statsSection.first()).toBeVisible();
      
      // Wait for stats to load completely
      await page.waitForTimeout(1000);
      
      // Screenshot fight statistics layout
      await expect(statsSection.first()).toHaveScreenshot('fight-statistics-section.png', {
        threshold: 0.1, // Strict comparison for statistics
        maxDiffPixels: 500,
        animations: 'disabled'
      });
      
      console.log('🥊 Fight statistics visual layout captured');
    } else {
      console.log('⚠️ No statistics section found for visual testing');
    }
  });

  test('should maintain training photo gallery layout', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Look for photo gallery
    const photoGallery = page.locator('.gallery, .photo-grid, [data-testid="gallery"]');
    
    if (await photoGallery.count() > 0) {
      const gallery = photoGallery.first();
      await expect(gallery).toBeVisible();
      
      // Wait for images to load
      const images = gallery.locator('img');
      const imageCount = await images.count();
      
      if (imageCount > 0) {
        // Wait for first few images to load
        for (let i = 0; i < Math.min(3, imageCount); i++) {
          await expect(images.nth(i)).toBeVisible();
        }
        
        await page.waitForTimeout(2000); // Allow for all images to load
        
        // Screenshot gallery layout
        await expect(gallery).toHaveScreenshot('training-photo-gallery.png', {
          threshold: 0.3, // Higher tolerance for photo galleries
          maxDiffPixels: 2000,
          animations: 'disabled'
        });
        
        console.log('📷 Training photo gallery layout captured');
      }
    } else {
      // Look for individual training images
      const trainingImages = page.locator('img[src*="training"], img[src*="DSC"]');
      if (await trainingImages.count() > 0) {
        const imagesSection = page.locator(':has(img[src*="training"])').first();
        await expect(imagesSection).toHaveScreenshot('training-images-section.png');
        console.log('📷 Training images section captured');
      }
    }
  });

  test('should maintain fight poster and promotion images consistency', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Look for fight promotion images
    const fightPosters = page.locator('img[src*="fight"], img[src*="IMG_5882"], img[src*="IMG_7202"]');
    const posterCount = await fightPosters.count();
    
    if (posterCount > 0) {
      console.log(`🥊 Found ${posterCount} fight promotion images`);
      
      // Screenshot each poster for consistency
      for (let i = 0; i < Math.min(3, posterCount); i++) {
        const poster = fightPosters.nth(i);
        await expect(poster).toBeVisible();
        
        const src = await poster.getAttribute('src');
        const filename = src?.split('/').pop()?.split('.')[0] || `fight-poster-${i + 1}`;
        
        // Screenshot individual fight poster
        await expect(poster).toHaveScreenshot(`fight-poster-${filename}.png`, {
          threshold: 0.1, // Strict comparison for branded content
          maxDiffPixels: 300
        });
      }
      
      // Screenshot the entire fight promotion section
      const promotionSection = page.locator(':has(img[src*="fight"])').first();
      if (await promotionSection.count() > 0) {
        await expect(promotionSection).toHaveScreenshot('fight-promotion-section.png', {
          threshold: 0.2,
          maxDiffPixels: 1500,
          fullPage: false
        });
      }
    }
  });

  test('should maintain responsive layout consistency on mobile', async ({ page }) => {
    // Test mobile viewport
    await page.setViewportSize({ width: 375, height: 667 }); // iPhone SE
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Wait for mobile layout to settle
    await page.waitForTimeout(1500);
    
    // Screenshot mobile homepage
    await expect(page).toHaveScreenshot('mobile-homepage-layout.png', {
      threshold: 0.2,
      maxDiffPixels: 2000,
      fullPage: true,
      animations: 'disabled'
    });
    
    // Test tablet viewport
    await page.setViewportSize({ width: 768, height: 1024 }); // iPad
    await page.waitForTimeout(1000);
    
    await expect(page).toHaveScreenshot('tablet-homepage-layout.png', {
      threshold: 0.2,
      maxDiffPixels: 2000,
      fullPage: true,
      animations: 'disabled'
    });
    
    console.log('📱 Mobile and tablet layouts captured');
  });

  test('should maintain boxing brand color scheme consistency', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Check key brand elements for color consistency
    const brandElements = page.locator('h1, h2, .logo, [class*="brand"], [class*="primary"]');
    
    if (await brandElements.count() > 0) {
      // Get color information from key elements
      const colorInfo = await brandElements.first().evaluate((el) => {
        const styles = window.getComputedStyle(el);
        return {
          color: styles.color,
          backgroundColor: styles.backgroundColor,
          borderColor: styles.borderColor
        };
      });
      
      console.log('🎨 Brand colors detected:', colorInfo);
      
      // Screenshot brand elements
      await expect(brandElements.first()).toHaveScreenshot('brand-element-colors.png', {
        threshold: 0.1, // Strict for brand consistency
        maxDiffPixels: 200
      });
    }
    
    // Screenshot navigation for brand consistency
    const navigation = page.locator('nav, header');
    if (await navigation.count() > 0) {
      await expect(navigation.first()).toHaveScreenshot('navigation-brand-colors.png', {
        threshold: 0.1,
        maxDiffPixels: 300
      });
    }
  });

  test('should maintain button and CTA visual consistency', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Find important CTAs (ticket buttons, etc.)
    const ctaButtons = page.locator(
      'a[href*="ticket"], button:has-text("ticket"), ' +
      'a:has-text("buy"), button:has-text("shop"), ' +
      '.btn, .button, [class*="cta"]'
    );
    
    const buttonCount = await ctaButtons.count();
    
    if (buttonCount > 0) {
      console.log(`🔘 Found ${buttonCount} CTA buttons for visual testing`);
      
      // Screenshot primary CTA buttons
      for (let i = 0; i < Math.min(5, buttonCount); i++) {
        const button = ctaButtons.nth(i);
        
        if (await button.isVisible()) {
          const buttonText = await button.textContent();
          const cleanText = buttonText?.toLowerCase().replace(/[^a-z0-9]/g, '-') || `button-${i}`;
          
          // Screenshot button in default state
          await expect(button).toHaveScreenshot(`cta-button-${cleanText}.png`, {
            threshold: 0.1,
            maxDiffPixels: 100
          });
          
          // Test hover state if it's not a touch device
          await button.hover();
          await page.waitForTimeout(300);
          
          await expect(button).toHaveScreenshot(`cta-button-${cleanText}-hover.png`, {
            threshold: 0.15,
            maxDiffPixels: 200
          });
        }
      }
    }
  });

  test('should maintain typography consistency across boxing content', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Test different heading levels
    const headingLevels = ['h1', 'h2', 'h3'];
    
    for (const level of headingLevels) {
      const headings = page.locator(level);
      const headingCount = await headings.count();
      
      if (headingCount > 0) {
        const firstHeading = headings.first();
        await expect(firstHeading).toBeVisible();
        
        // Screenshot heading typography
        await expect(firstHeading).toHaveScreenshot(`typography-${level}.png`, {
          threshold: 0.1,
          maxDiffPixels: 200
        });
        
        console.log(`✅ ${level} typography captured`);
      }
    }
    
    // Test paragraph typography
    const paragraphs = page.locator('p').first();
    if (await paragraphs.count() > 0) {
      await expect(paragraphs).toHaveScreenshot('typography-paragraph.png', {
        threshold: 0.1,
        maxDiffPixels: 300
      });
    }
  });

  test('should maintain cross-browser visual consistency', async ({ page, browserName }) => {
    // Skip for webkit due to font rendering differences
    test.skip(browserName === 'webkit', 'Webkit has different font rendering');
    
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    
    // Take browser-specific screenshots
    await expect(page).toHaveScreenshot(`homepage-${browserName}.png`, {
      threshold: 0.3, // Higher tolerance for cross-browser differences
      maxDiffPixels: 5000,
      fullPage: true,
      animations: 'disabled'
    });
    
    console.log(`📸 ${browserName} homepage captured for cross-browser comparison`);
  });

  test('should detect visual regressions in fight card layouts', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Look for fight cards or upcoming fights
    const fightCards = page.locator('.fight-card, [data-testid*="fight"], [class*="upcoming"]');
    
    if (await fightCards.count() > 0) {
      // Screenshot fight card section
      const fightSection = page.locator(':has(.fight-card), :has([data-testid*="fight"])').first();
      if (await fightSection.count() > 0) {
        await expect(fightSection).toHaveScreenshot('fight-cards-layout.png', {
          threshold: 0.2,
          maxDiffPixels: 1000,
          animations: 'disabled'
        });
        
        console.log('🥊 Fight cards layout captured');
      }
    }
    
    // Check for homecoming fight specific layout
    const homecomingSection = page.locator('text=/homecoming/i').locator('xpath=./ancestor::section').first();
    if (await homecomingSection.count() > 0) {
      await expect(homecomingSection).toHaveScreenshot('homecoming-fight-section.png', {
        threshold: 0.2,
        maxDiffPixels: 1500
      });
    }
  });

  test('should maintain footer and contact information layout', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Find footer
    const footer = page.locator('footer, [role="contentinfo"]');
    
    if (await footer.count() > 0) {
      // Scroll footer into view
      await footer.first().scrollIntoViewIfNeeded();
      await page.waitForTimeout(500);
      
      // Screenshot footer layout
      await expect(footer.first()).toHaveScreenshot('footer-layout.png', {
        threshold: 0.15,
        maxDiffPixels: 800,
        animations: 'disabled'
      });
      
      console.log('🦶 Footer layout captured');
    }
  });

  test('should detect visual regressions during hover interactions', async ({ page, isMobile }) => {
    // Skip hover tests on mobile
    test.skip(isMobile, 'Hover interactions not applicable on mobile');
    
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Test hover states on interactive elements
    const interactiveElements = page.locator('a, button, [role="button"]');
    const elementCount = await interactiveElements.count();
    
    if (elementCount > 0) {
      // Test first few interactive elements
      for (let i = 0; i < Math.min(3, elementCount); i++) {
        const element = interactiveElements.nth(i);
        
        if (await element.isVisible()) {
          // Hover over element
          await element.hover();
          await page.waitForTimeout(300);
          
          const elementText = await element.textContent();
          const cleanText = elementText?.toLowerCase().replace(/[^a-z0-9]/g, '-').substring(0, 20) || `element-${i}`;
          
          // Screenshot hover state
          await expect(element).toHaveScreenshot(`hover-state-${cleanText}.png`, {
            threshold: 0.2,
            maxDiffPixels: 300
          });
        }
      }
    }
  });

  test('should maintain visual consistency with loading states', async ({ page }) => {
    // Intercept image requests to simulate slow loading
    await page.route('**/*.{jpg,jpeg,png,webp}', async route => {
      // Delay image loading by 2 seconds
      await new Promise(resolve => setTimeout(resolve, 2000));
      await route.continue();
    });
    
    await page.goto('/');
    
    // Screenshot loading state
    await expect(page).toHaveScreenshot('loading-state.png', {
      threshold: 0.3,
      maxDiffPixels: 3000,
      fullPage: true
    });
    
    // Wait for content to load
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);
    
    // Screenshot loaded state
    await expect(page).toHaveScreenshot('loaded-state.png', {
      threshold: 0.2,
      maxDiffPixels: 2000,
      fullPage: true
    });
    
    console.log('⏳ Loading and loaded states captured');
  });
});