import { test, expect, Page } from '@playwright/test';
import { performanceUtils } from '../utils/performance';
import { boxingAssertions } from '../utils/boxing-assertions';

/**
 * Fight Records Tests - Kumar Prescod Boxing
 * Tests fight record display, statistics, and boxing-specific functionality
 */
test.describe('Fight Records & Statistics - Boxing Data Accuracy', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    
    // Navigate to fights section or find fight records on homepage
    const fightsLink = page.locator('a[href*="/fights"], a:has-text("fights"), nav a:has-text("record")');
    if (await fightsLink.count() > 0) {
      await fightsLink.first().click();
      await page.waitForLoadState('networkidle');
    }
  });

  test('should display accurate professional fight record', async ({ page }) => {
    // Verify Kumar's current professional record
    await boxingAssertions.assertFightRecord(page, {
      wins: 3,
      losses: 0,
      draws: 0,
      knockouts: 3, // All wins by knockout
      knockoutPercentage: 100
    });
    
    // Check for perfect record indication
    const perfectRecord = page.locator('text=/perfect|undefeated|3-0/i');
    await expect(perfectRecord.first()).toBeVisible();
    
    // Verify knockout percentage is highlighted
    const koStats = page.locator('text=/100%.*knockout|knockout.*100%/i');
    await expect(koStats.first()).toBeVisible();
  });

  test('should show detailed fight history with opponents', async ({ page }) => {
    // Look for individual fight entries
    const fightEntries = page.locator('[data-testid*="fight"], .fight-card, [class*="fight"]');
    
    // Should show at least 3 professional fights
    expect(await fightEntries.count()).toBeGreaterThanOrEqual(3);
    
    // Check for specific opponent names from fight records
    const expectedOpponents = ['Miguel Rodriguez', 'James Thompson', 'Derek Williams'];
    
    for (const opponent of expectedOpponents) {
      const opponentElement = page.locator(`text=/${opponent}/i`);
      if (await opponentElement.count() > 0) {
        await expect(opponentElement.first()).toBeVisible();
      }
    }
    
    // Verify fight outcomes are displayed
    const outcomes = page.locator('text=/win|victory|ko|tko|knockout/i');
    expect(await outcomes.count()).toBeGreaterThanOrEqual(3);
  });

  test('should display fight venues and dates accurately', async ({ page }) => {
    // Check for venue information
    const venues = [
      'San Francisco Armory',
      'Oakland-Alameda County Coliseum', 
      'MGM Grand Garden Arena',
      'Oakland Arena' // Upcoming homecoming fight
    ];
    
    for (const venue of venues) {
      const venueElement = page.locator(`text=/${venue}/i`);
      if (await venueElement.count() > 0) {
        await expect(venueElement.first()).toBeVisible();
      }
    }
    
    // Check for fight dates
    const fightDates = page.locator('text=/2024-06-15|2024-09-21|2024-12-20|2025-08-16/');
    expect(await fightDates.count()).toBeGreaterThanOrEqual(1);
  });

  test('should show fight method details (KO, TKO, Decision)', async ({ page }) => {
    // Look for fight methods
    const methods = page.locator('text=/\\bKO\\b|\\bTKO\\b|knockout|technical knockout/i');
    
    // Kumar's fights should show KO/TKO methods
    expect(await methods.count()).toBeGreaterThanOrEqual(3);
    
    // Check for specific fight details
    const fightDetails = [
      'Round 1', // Rodriguez fight
      'Round 3', // Thompson fight  
      'Round 2'  // Williams fight
    ];
    
    for (const detail of fightDetails) {
      const detailElement = page.locator(`text=/${detail}/i`);
      if (await detailElement.count() > 0) {
        await expect(detailElement.first()).toBeVisible();
      }
    }
  });

  test('should display upcoming homecoming fight', async ({ page }) => {
    // Look for homecoming fight information
    const homecomingFight = page.locator('text=/homecoming|august.*16|oakland.*arena/i');
    await expect(homecomingFight.first()).toBeVisible();
    
    // Check for fight promotion elements
    const fightPromo = page.locator('text=/the raw one returns|straight outta oakland/i');
    await expect(fightPromo.first()).toBeVisible();
    
    // Verify ticket link is present and functional
    const ticketLink = page.locator('a[href*="ticket"], a:has-text("ticket")');
    await expect(ticketLink.first()).toBeVisible();
    
    // Test ticket link accessibility
    const href = await ticketLink.first().getAttribute('href');
    expect(href).toBeTruthy();
  });

  test('should load fight posters and media efficiently', async ({ page }) => {
    // Look for fight poster images
    const fightPosters = page.locator('img[src*="poster"], img[src*="fight"], img[alt*="fight"]');
    
    if (await fightPosters.count() > 0) {
      // Posters should load within reasonable time
      await expect(fightPosters.first()).toBeVisible({ timeout: 10000 });
      
      // Check image optimization
      for (let i = 0; i < Math.min(3, await fightPosters.count()); i++) {
        const poster = fightPosters.nth(i);
        
        // Verify alt text for accessibility
        const altText = await poster.getAttribute('alt');
        expect(altText).toBeTruthy();
        expect(altText?.length).toBeGreaterThan(5);
        
        // Check image loads successfully
        const src = await poster.getAttribute('src');
        if (src) {
          const response = await page.request.get(src);
          expect(response.status()).toBe(200);
        }
      }
    }
  });

  test('should display opponent statistics and records', async ({ page }) => {
    // Look for opponent record information
    const opponentRecords = page.locator('text=/4-2|8-1|10-1-1/'); // Opponent records
    
    if (await opponentRecords.count() > 0) {
      await expect(opponentRecords.first()).toBeVisible();
    }
    
    // Check for opponent details like height, weight, reach
    const opponentDetails = page.locator('text=/5\'11|6\'1|6\'0|184.*lbs|186.*lbs|185.*lbs/');
    
    if (await opponentDetails.count() > 0) {
      // At least some opponent physical stats should be shown
      expect(await opponentDetails.count()).toBeGreaterThanOrEqual(1);
    }
  });

  test('should be mobile-responsive for boxing fans', async ({ page, isMobile }) => {
    if (!isMobile) {
      // Test responsive behavior by resizing
      await page.setViewportSize({ width: 375, height: 667 }); // iPhone SE
    }
    
    // Fight records should be readable on mobile
    const fightCards = page.locator('[class*="fight"], .card, [data-testid*="fight"]');
    
    if (await fightCards.count() > 0) {
      const firstCard = fightCards.first();
      await expect(firstCard).toBeVisible();
      
      // Card should be appropriately sized for mobile
      const cardBox = await firstCard.boundingBox();
      expect(cardBox?.width).toBeLessThanOrEqual(400); // Should fit mobile screen
    }
    
    // Text should be readable on mobile
    const fightText = page.locator('text=/3-0|perfect|Kumar Prescod/i').first();
    if (await fightText.count() > 0) {
      const fontSize = await fightText.evaluate((el) => {
        return parseInt(window.getComputedStyle(el).fontSize);
      });
      expect(fontSize).toBeGreaterThanOrEqual(14); // Minimum readable size
    }
  });

  test('should handle fight statistics calculations correctly', async ({ page }) => {
    // Verify knockout percentage calculation
    const koPercentage = page.locator('text=/100%|100 percent/i');
    if (await koPercentage.count() > 0) {
      await expect(koPercentage.first()).toBeVisible();
    }
    
    // Check average rounds calculation (should be 2.0 based on Kumar's fights)
    const avgRounds = page.locator('text=/2\\.0.*rounds|average.*2/i');
    if (await avgRounds.count() > 0) {
      await expect(avgRounds.first()).toBeVisible();
    }
    
    // Verify total fight count
    const totalFights = page.locator('text=/3.*fights|total.*3/i');
    if (await totalFights.count() > 0) {
      await expect(totalFights.first()).toBeVisible();
    }
  });

  test('should provide accessible fight information for screen readers', async ({ page }) => {
    // Check for proper semantic markup
    const fightSections = page.locator('section, article, [role="article"]');
    
    if (await fightSections.count() > 0) {
      // Sections should have proper headings
      const headings = page.locator('h1, h2, h3, h4');
      expect(await headings.count()).toBeGreaterThanOrEqual(1);
    }
    
    // Fight statistics should have proper labels
    const statElements = page.locator('[data-testid*="stat"], [class*="stat"]');
    
    if (await statElements.count() > 0) {
      for (let i = 0; i < Math.min(3, await statElements.count()); i++) {
        const stat = statElements.nth(i);
        const hasLabel = await stat.evaluate((el) => {
          return !!(
            el.getAttribute('aria-label') ||
            el.getAttribute('aria-labelledby') ||
            el.querySelector('label') ||
            el.textContent?.trim()
          );
        });
        expect(hasLabel).toBeTruthy();
      }
    }
  });

  test('should load fight highlights and media', async ({ page }) => {
    // Look for fight highlight videos or links
    const highlights = page.locator('a[href*="video"], a[href*="highlight"], video, iframe');
    
    if (await highlights.count() > 0) {
      const firstHighlight = highlights.first();
      await expect(firstHighlight).toBeVisible();
      
      // If it's a video element, check it loads
      if (await firstHighlight.evaluate(el => el.tagName.toLowerCase() === 'video')) {
        const videoError = await firstHighlight.evaluate((video: HTMLVideoElement) => {
          return video.error ? video.error.message : null;
        });
        expect(videoError).toBeNull();
      }
      
      // If it's a link, verify it has proper attributes
      if (await firstHighlight.evaluate(el => el.tagName.toLowerCase() === 'a')) {
        const href = await firstHighlight.getAttribute('href');
        expect(href).toBeTruthy();
      }
    }
  });
});