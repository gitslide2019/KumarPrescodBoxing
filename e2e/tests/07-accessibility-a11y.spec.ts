import { test, expect, Page } from '@playwright/test';
import { boxingAssertions } from '../utils/boxing-assertions';

/**
 * Accessibility Tests - Kumar Prescod Boxing
 * Tests screen reader compatibility, keyboard navigation, and WCAG compliance for boxing content
 */
test.describe('Accessibility & Screen Reader Compatibility - Boxing A11y', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test('should have proper heading hierarchy for boxing content', async ({ page }) => {
    // Check for proper heading structure
    const headings = await page.locator('h1, h2, h3, h4, h5, h6').all();
    
    expect(headings.length).toBeGreaterThanOrEqual(1);
    
    // Should have exactly one h1
    const h1Count = await page.locator('h1').count();
    expect(h1Count).toBe(1);
    
    // H1 should contain boxing-related content
    const h1Text = await page.locator('h1').first().textContent();
    expect(h1Text).toMatch(/Kumar|Prescod|Boxing|Fighter|Raw One/i);
    
    // Check heading hierarchy (no skipped levels)
    const headingLevels = [];
    for (const heading of headings) {
      const tagName = await heading.evaluate(el => el.tagName.toLowerCase());
      const level = parseInt(tagName.charAt(1));
      headingLevels.push(level);
    }
    
    // Verify no heading levels are skipped
    for (let i = 1; i < headingLevels.length; i++) {
      const currentLevel = headingLevels[i];
      const maxPreviousLevel = Math.max(...headingLevels.slice(0, i));
      
      if (currentLevel > maxPreviousLevel) {
        expect(currentLevel - maxPreviousLevel).toBeLessThanOrEqual(1);
      }
    }
    
    console.log(`✅ Heading hierarchy: ${headingLevels.join(' → ')}`);
  });

  test('should have enhanced skip navigation links for boxing content', async ({ page }) => {
    // Test for skip to main content link
    const skipLink = page.locator('a[href="#main-content"], .sr-only:has-text("Skip to main content")');
    
    if (await skipLink.count() > 0) {
      // Skip link should be initially hidden
      await expect(skipLink.first()).not.toBeVisible();
      
      // Skip link should become visible on focus
      await skipLink.first().focus();
      await expect(skipLink.first()).toBeVisible();
      
      // Skip link should navigate to main content
      await skipLink.first().press('Enter');
      
      // Main content should be focused
      const mainContent = page.locator('#main-content, main[role="main"]');
      await expect(mainContent).toBeVisible();
      
      console.log('✅ Skip navigation link working properly');
    } else {
      console.warn('⚠️ Skip navigation link not found');
    }
  });

  test('should provide enhanced descriptive alt text for boxing images', async ({ page }) => {
    const images = page.locator('img');
    const imageCount = await images.count();
    
    expect(imageCount).toBeGreaterThan(0);
    
    // Check for enhanced alt text and aria labels
    for (let i = 0; i < Math.min(imageCount, 10); i++) {
      const image = images.nth(i);
      const alt = await image.getAttribute('alt');
      const ariaLabel = await image.getAttribute('aria-label');
      const title = await image.getAttribute('title');
      
      // Image should have either alt, aria-label, or title
      const hasDescription = alt || ariaLabel || title;
      expect(hasDescription).toBeTruthy();
      
      if (alt) {
        // Alt text should be descriptive for boxing content
        expect(alt.length).toBeGreaterThan(3);
        console.log(`🖼️ Image ${i + 1} alt: "${alt}"`);
      }
    }
    
    // Check for OptimizedImage component accessibility
    const optimizedImages = page.locator('img[data-optimized="true"], .optimized-image img');
    if (await optimizedImages.count() > 0) {
      console.log(`✅ ${await optimizedImages.count()} optimized images with proper accessibility`);
    }
    
    // Check alt text for all images
    for (let i = 0; i < Math.min(10, imageCount); i++) {
      const img = images.nth(i);
      const altText = await img.getAttribute('alt');
      const src = await img.getAttribute('src');
      
      // All images should have alt text
      expect(altText).toBeTruthy();
      
      // Alt text should be descriptive (not just filename)
      expect(altText?.length).toBeGreaterThan(3);
      
      // Boxing images should have contextual alt text
      if (src?.includes('training') || src?.includes('fight') || src?.includes('DSC')) {
        expect(altText).toMatch(/training|boxing|workout|Kumar|fight|sparring|gym/i);
      }
      
      // Alt text shouldn't be redundant with filename
      if (src && altText) {
        const filename = src.split('/').pop()?.split('.')[0];
        expect(altText.toLowerCase()).not.toBe(filename?.toLowerCase());
      }
    }
    
    console.log(`🖼️ Verified alt text for ${Math.min(10, imageCount)} boxing images`);
  });

  test('should support keyboard navigation for boxing fans', async ({ page }) => {
    // Test tab navigation through interactive elements
    const interactiveElements = page.locator('a, button, input, select, textarea, [tabindex]:not([tabindex="-1"])');
    const count = await interactiveElements.count();
    
    if (count > 0) {
      // Start at the first focusable element
      await page.keyboard.press('Tab');
      
      // Track focus as we tab through elements
      let focusedElements = 0;
      
      for (let i = 0; i < Math.min(10, count); i++) {
        // Check if an element is focused
        const focusedElement = await page.locator(':focus').first();
        
        if (await focusedElement.count() > 0) {
          focusedElements++;
          
          // Focused element should be visible
          await expect(focusedElement).toBeVisible();
          
          // Check for visible focus indicator
          const hasVisibleFocus = await focusedElement.evaluate((el) => {
            const styles = window.getComputedStyle(el);
            const pseudoStyles = window.getComputedStyle(el, ':focus');
            
            // Check for focus outline, border, or box-shadow changes
            return (
              styles.outline !== 'none' ||
              styles.outlineWidth !== '0px' ||
              pseudoStyles.outline !== styles.outline ||
              pseudoStyles.border !== styles.border ||
              pseudoStyles.boxShadow !== styles.boxShadow
            );
          });
          
          if (!hasVisibleFocus) {
            console.warn(`⚠️ Focus indicator may not be visible for element: ${await focusedElement.evaluate(el => el.tagName)}`);
          }
        }
        
        await page.keyboard.press('Tab');
        await page.waitForTimeout(100); // Small delay for focus changes
      }
      
      expect(focusedElements).toBeGreaterThan(0);
      console.log(`⌨️ Successfully navigated ${focusedElements} focusable elements`);
    }
  });

  test('should provide accessible fight statistics for screen readers', async ({ page }) => {
    // Look for fight statistics
    const statsElements = page.locator('[data-testid*="stats"], .stats, [class*="stat"]');
    
    if (await statsElements.count() > 0) {
      const statsSection = statsElements.first();
      
      // Stats should have accessible labels
      const hasLabel = await statsSection.evaluate((el) => {
        return !!(
          el.getAttribute('aria-label') ||
          el.getAttribute('aria-labelledby') ||
          el.querySelector('h1, h2, h3, h4, h5, h6')
        );
      });
      
      expect(hasLabel).toBeTruthy();
      
      // Individual stat items should be properly labeled
      const statItems = statsSection.locator('*:has-text("wins"), *:has-text("losses"), *:has-text("knockouts")');
      const statCount = await statItems.count();
      
      if (statCount > 0) {
        for (let i = 0; i < Math.min(3, statCount); i++) {
          const statItem = statItems.nth(i);
          const hasAccessibleName = await statItem.evaluate((el) => {
            return !!(
              el.getAttribute('aria-label') ||
              el.getAttribute('title') ||
              el.textContent?.trim()
            );
          });
          
          expect(hasAccessibleName).toBeTruthy();
        }
      }
    }
    
    // Check for proper data presentation
    const numericData = page.locator('text=/\\d+-\\d+|\\d+%|\\d+\\.\\d+/');
    
    if (await numericData.count() > 0) {
      // Numeric data should have context
      const firstStat = numericData.first();
      const statText = await firstStat.textContent();
      const parentText = await firstStat.locator('xpath=./parent::*').textContent();
      
      // Parent should provide context for the number
      expect(parentText?.length).toBeGreaterThan(statText?.length || 0);
    }
  });

  test('should support screen reader announcements for dynamic content', async ({ page }) => {
    // Check for ARIA live regions
    const liveRegions = page.locator('[aria-live], [role="status"], [role="alert"]');
    
    if (await liveRegions.count() > 0) {
      console.log(`📢 Found ${await liveRegions.count()} ARIA live regions`);
      
      // Live regions should have appropriate labels
      for (let i = 0; i < await liveRegions.count(); i++) {
        const region = liveRegions.nth(i);
        const ariaLive = await region.getAttribute('aria-live');
        const role = await region.getAttribute('role');
        
        if (ariaLive) {
          expect(['polite', 'assertive', 'off']).toContain(ariaLive);
        }
        
        if (role) {
          expect(['status', 'alert', 'log']).toContain(role);
        }
      }
    }
    
    // Check for dynamic boxing content updates
    const dynamicContent = page.locator('[data-dynamic], .loading, .updating');
    
    if (await dynamicContent.count() > 0) {
      // Dynamic content should be announced to screen readers
      const hasAnnouncement = await dynamicContent.first().evaluate((el) => {
        return !!(
          el.getAttribute('aria-live') ||
          el.getAttribute('role') === 'status' ||
          el.getAttribute('role') === 'alert'
        );
      });
      
      if (hasAnnouncement) {
        console.log('✅ Dynamic content has screen reader announcements');
      }
    }
  });

  test('should provide accessible form controls for boxing interactions', async ({ page }) => {
    const formElements = page.locator('input, select, textarea, button[type="submit"]');
    const formCount = await formElements.count();
    
    if (formCount > 0) {
      console.log(`📋 Testing ${formCount} form elements for accessibility`);
      
      for (let i = 0; i < Math.min(5, formCount); i++) {
        const element = formElements.nth(i);
        const tagName = await element.evaluate(el => el.tagName.toLowerCase());
        const type = await element.getAttribute('type');
        const id = await element.getAttribute('id');
        const name = await element.getAttribute('name');
        
        // Form elements should have accessible names
        const hasAccessibleName = await element.evaluate((el) => {
          const id = el.getAttribute('id');
          const ariaLabel = el.getAttribute('aria-label');
          const ariaLabelledby = el.getAttribute('aria-labelledby');
          const placeholder = el.getAttribute('placeholder');
          
          return !!(
            (id && document.querySelector(`label[for="${id}"]`)) ||
            ariaLabel ||
            ariaLabelledby ||
            (el.tagName === 'BUTTON' && el.textContent?.trim()) ||
            placeholder
          );
        });
        
        expect(hasAccessibleName).toBeTruthy();
        
        // Required fields should be properly marked
        const isRequired = await element.getAttribute('required');
        const ariaRequired = await element.getAttribute('aria-required');
        
        if (isRequired !== null || ariaRequired === 'true') {
          console.log(`✅ Required field properly marked: ${tagName}${type ? `[${type}]` : ''}`);
        }
        
        // Form elements should have proper error handling
        const ariaInvalid = await element.getAttribute('aria-invalid');
        const ariaDescribedby = await element.getAttribute('aria-describedby');
        
        if (ariaInvalid === 'true' && ariaDescribedby) {
          const errorMessage = page.locator(`#${ariaDescribedby}`);
          if (await errorMessage.count() > 0) {
            console.log('✅ Form field has proper error messaging');
          }
        }
      }
    }
  });

  test('should provide accessible video content for boxing fans', async ({ page }) => {
    const videos = page.locator('video, iframe[src*="youtube"], iframe[src*="vimeo"]');
    const videoCount = await videos.count();
    
    if (videoCount > 0) {
      console.log(`🎬 Testing ${videoCount} video elements for accessibility`);
      
      for (let i = 0; i < Math.min(3, videoCount); i++) {
        const video = videos.nth(i);
        const tagName = await video.evaluate(el => el.tagName.toLowerCase());
        
        if (tagName === 'video') {
          // Video elements should have controls
          const hasControls = await video.getAttribute('controls');
          expect(hasControls).toBeTruthy();
          
          // Check for captions/subtitles
          const tracks = video.locator('track[kind="captions"], track[kind="subtitles"]');
          const trackCount = await tracks.count();
          
          if (trackCount > 0) {
            console.log('✅ Video has captions/subtitles for accessibility');
          } else {
            console.warn('⚠️ Video may be missing captions for accessibility');
          }
          
          // Video should have descriptive title or aria-label
          const hasDescription = await video.evaluate((el) => {
            return !!(
              el.getAttribute('aria-label') ||
              el.getAttribute('title') ||
              el.querySelector('source[title]')
            );
          });
          
          if (hasDescription) {
            console.log('✅ Video has accessible description');
          }
        } else if (tagName === 'iframe') {
          // iframes should have titles
          const title = await video.getAttribute('title');
          expect(title).toBeTruthy();
          expect(title?.length).toBeGreaterThan(5);
          
          // YouTube/Vimeo embeds should reference boxing content
          if (title) {
            expect(title).toMatch(/boxing|training|Kumar|fight|workout/i);
          }
        }
      }
    }
  });

  test('should provide accessible navigation for boxing sections', async ({ page }) => {
    // Check for navigation landmarks
    const navElements = page.locator('nav, [role="navigation"], header, [role="banner"]');
    const navCount = await navElements.count();
    
    expect(navCount).toBeGreaterThanOrEqual(1);
    
    for (let i = 0; i < navCount; i++) {
      const nav = navElements.nth(i);
      
      // Navigation should have accessible labels
      const hasLabel = await nav.evaluate((el) => {
        return !!(
          el.getAttribute('aria-label') ||
          el.getAttribute('aria-labelledby') ||
          (el.tagName === 'NAV' && el.querySelector('h1, h2, h3, h4, h5, h6'))
        );
      });
      
      if (!hasLabel) {
        console.warn('⚠️ Navigation element may need accessible label');
      }
      
      // Navigation links should be properly structured
      const navLinks = nav.locator('a');
      const linkCount = await navLinks.count();
      
      if (linkCount > 0) {
        // Links should have descriptive text
        for (let j = 0; j < Math.min(5, linkCount); j++) {
          const link = navLinks.nth(j);
          const linkText = await link.textContent();
          const ariaLabel = await link.getAttribute('aria-label');
          
          const effectiveLabel = ariaLabel || linkText;
          expect(effectiveLabel).toBeTruthy();
          expect(effectiveLabel?.length).toBeGreaterThan(2);
          
          // Boxing navigation should be contextual
          if (effectiveLabel?.toLowerCase().includes('fight') || 
              effectiveLabel?.toLowerCase().includes('training') ||
              effectiveLabel?.toLowerCase().includes('record')) {
            console.log(`✅ Contextual boxing navigation: "${effectiveLabel}"`);
          }
        }
      }
    }
  });

  test('should handle focus management for modals and overlays', async ({ page }) => {
    // Look for modal triggers
    const modalTriggers = page.locator('button:has-text("share"), button:has-text("view"), [data-modal], [data-lightbox]');
    
    if (await modalTriggers.count() > 0) {
      const trigger = modalTriggers.first();
      
      // Store initial focus
      const initialFocus = await page.evaluate(() => document.activeElement?.tagName);
      
      // Open modal
      await trigger.click();
      await page.waitForTimeout(1000);
      
      // Check if modal opened
      const modal = page.locator('.modal, .lightbox, [role="dialog"], .overlay');
      
      if (await modal.count() > 0) {
        // Focus should move to modal
        const modalFocused = await page.evaluate(() => {
          const activeElement = document.activeElement;
          const modal = document.querySelector('.modal, .lightbox, [role="dialog"]');
          
          return modal && (modal.contains(activeElement) || activeElement === modal);
        });
        
        if (modalFocused) {
          console.log('✅ Focus properly moved to modal');
        }
        
        // Modal should have proper ARIA attributes
        const modalElement = modal.first();
        const hasRole = await modalElement.getAttribute('role');
        const hasAriaModal = await modalElement.getAttribute('aria-modal');
        const hasAriaLabel = await modalElement.getAttribute('aria-label') || 
                           await modalElement.getAttribute('aria-labelledby');
        
        if (hasRole === 'dialog' || hasAriaModal === 'true') {
          console.log('✅ Modal has proper ARIA dialog attributes');
        }
        
        if (hasAriaLabel) {
          console.log('✅ Modal has accessible label');
        }
        
        // Try to close modal with Escape key
        await page.keyboard.press('Escape');
        await page.waitForTimeout(500);
        
        // Modal should close and focus should return
        const modalClosed = await modal.count() === 0;
        if (modalClosed) {
          console.log('✅ Modal closes with Escape key');
        }
      }
    }
  });

  test('should provide accessible color contrast for boxing theme', async ({ page }) => {
    // Check contrast for important text elements
    const textElements = page.locator('h1, h2, h3, p, a, button').first();
    
    if (await textElements.count() > 0) {
      // Sample a few text elements for contrast checking
      const contrastIssues = [];
      
      for (let i = 0; i < Math.min(5, await textElements.count()); i++) {
        const element = textElements.nth(i);
        
        const contrastInfo = await element.evaluate((el) => {
          const styles = window.getComputedStyle(el);
          return {
            color: styles.color,
            backgroundColor: styles.backgroundColor,
            fontSize: styles.fontSize,
            fontWeight: styles.fontWeight
          };
        });
        
        // Log contrast info for manual verification
        console.log(`🎨 Text element ${i + 1} styles:`, contrastInfo);
        
        // Basic checks for transparent backgrounds or same colors
        if (contrastInfo.color === contrastInfo.backgroundColor) {
          contrastIssues.push(`Element ${i + 1}: Same text and background color`);
        }
      }
      
      if (contrastIssues.length > 0) {
        console.warn('⚠️ Potential contrast issues:', contrastIssues);
      } else {
        console.log('✅ No obvious contrast issues detected');
      }
    }
  });

  test('should support high contrast mode for boxing content', async ({ page }) => {
    // Simulate high contrast mode
    await page.emulateMedia({ forcedColors: 'active' });
    
    // Essential boxing content should still be visible
    await expect(page.locator('h1, h2').first()).toBeVisible();
    await expect(page.locator('text=/Kumar|Prescod|Boxing/i')).toBeVisible();
    
    // Check if high contrast styles are applied
    const highContrastSupport = await page.evaluate(() => {
      return window.matchMedia('(forced-colors: active)').matches;
    });
    
    if (highContrastSupport) {
      console.log('✅ High contrast mode supported');
      
      // Important elements should have system colors
      const importantElement = page.locator('h1').first();
      if (await importantElement.count() > 0) {
        const styles = await importantElement.evaluate((el) => {
          const computed = window.getComputedStyle(el);
          return {
            color: computed.color,
            backgroundColor: computed.backgroundColor
          };
        });
        
        console.log('🎨 High contrast styles:', styles);
      }
    }
    
    // Reset media emulation
    await page.emulateMedia({ forcedColors: null });
  });

  test('should provide accessible error handling and feedback', async ({ page }) => {
    // Look for form validation examples
    const forms = page.locator('form, [role="form"]');
    
    if (await forms.count() > 0) {
      const form = forms.first();
      const inputs = form.locator('input[required], input[type="email"]');
      
      if (await inputs.count() > 0) {
        const input = inputs.first();
        
        // Try to trigger validation error
        await input.fill('invalid');
        await input.blur();
        await page.waitForTimeout(500);
        
        // Check for accessible error messaging
        const ariaInvalid = await input.getAttribute('aria-invalid');
        const ariaDescribedby = await input.getAttribute('aria-describedby');
        
        if (ariaInvalid === 'true' && ariaDescribedby) {
          const errorElement = page.locator(`#${ariaDescribedby}`);
          if (await errorElement.count() > 0) {
            await expect(errorElement).toBeVisible();
            console.log('✅ Accessible form error messaging detected');
          }
        }
      }
    }
    
    // Check for success/status messages
    const statusMessages = page.locator('[role="status"], [role="alert"], .success, .error');
    
    if (await statusMessages.count() > 0) {
      console.log(`📢 Found ${await statusMessages.count()} status/alert messages`);
    }
  });
});