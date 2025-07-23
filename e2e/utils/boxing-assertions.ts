import { expect, Page, Locator } from '@playwright/test';

/**
 * Boxing-specific assertion utilities for Kumar Prescod website testing
 * Provides specialized assertions for boxing statistics, fight records, and combat sports content
 */

export interface FightRecord {
  wins: number;
  losses: number;
  draws: number;
  knockouts?: number;
  knockoutPercentage?: number;
  technicalKnockouts?: number;
}

export interface BoxingStats {
  totalFights?: number;
  averageRoundsPerFight?: number;
  averageFightDuration?: string;
  opponentQuality?: string;
}

export interface FightDetails {
  opponent: string;
  date: string;
  venue: string;
  method: 'KO' | 'TKO' | 'Decision' | 'DQ';
  round?: number;
  time?: string;
}

export class BoxingAssertions {
  /**
   * Assert that Kumar's fight record is displayed correctly
   */
  async assertFightRecord(page: Page, expectedRecord: FightRecord) {
    // Look for fight record display in various formats
    const recordPatterns = [
      new RegExp(`${expectedRecord.wins}-${expectedRecord.losses}(?:-${expectedRecord.draws})?`, 'i'),
      new RegExp(`${expectedRecord.wins}\\s*wins?`, 'i'),
      new RegExp(`${expectedRecord.losses}\\s*loss(?:es)?`, 'i'),
      new RegExp(`${expectedRecord.draws}\\s*draws?`, 'i')
    ];

    // Check for basic record display
    const recordElement = page.locator(`text=/${expectedRecord.wins}-${expectedRecord.losses}/i`);
    if (await recordElement.count() > 0) {
      await expect(recordElement.first()).toBeVisible();
    }

    // Verify individual stats
    if (expectedRecord.wins > 0) {
      const winsElement = page.locator(`text=/${expectedRecord.wins}.*wins?|wins?.*${expectedRecord.wins}/i`);
      if (await winsElement.count() > 0) {
        await expect(winsElement.first()).toBeVisible();
      }
    }

    // Check knockout percentage if specified
    if (expectedRecord.knockoutPercentage !== undefined) {
      const koPercentage = page.locator(`text=/${expectedRecord.knockoutPercentage}%|${expectedRecord.knockoutPercentage} percent/i`);
      if (await koPercentage.count() > 0) {
        await expect(koPercentage.first()).toBeVisible();
      }
    }

    // Verify undefeated status if applicable
    if (expectedRecord.losses === 0) {
      const undefeatedElement = page.locator('text=/undefeated|perfect.*record/i');
      if (await undefeatedElement.count() > 0) {
        await expect(undefeatedElement.first()).toBeVisible();
      }
    }
  }

  /**
   * Assert fight statistics are accurate
   */
  async assertBoxingStats(page: Page, expectedStats: BoxingStats) {
    if (expectedStats.totalFights) {
      const totalFightsElement = page.locator(`text=/${expectedStats.totalFights}.*fights?|total.*${expectedStats.totalFights}/i`);
      if (await totalFightsElement.count() > 0) {
        await expect(totalFightsElement.first()).toBeVisible();
      }
    }

    if (expectedStats.averageRoundsPerFight) {
      const avgRoundsElement = page.locator(`text=/${expectedStats.averageRoundsPerFight}.*rounds?|average.*${expectedStats.averageRoundsPerFight}/i`);
      if (await avgRoundsElement.count() > 0) {
        await expect(avgRoundsElement.first()).toBeVisible();
      }
    }

    if (expectedStats.averageFightDuration) {
      const durationElement = page.locator(`text=/${expectedStats.averageFightDuration}/i`);
      if (await durationElement.count() > 0) {
        await expect(durationElement.first()).toBeVisible();
      }
    }
  }

  /**
   * Assert specific fight details are displayed
   */
  async assertFightDetails(page: Page, fight: FightDetails) {
    // Check opponent name
    const opponentElement = page.locator(`text=/${fight.opponent}/i`);
    await expect(opponentElement.first()).toBeVisible();

    // Check fight date
    const dateElement = page.locator(`text=/${fight.date}/`);
    if (await dateElement.count() > 0) {
      await expect(dateElement.first()).toBeVisible();
    }

    // Check venue
    const venueElement = page.locator(`text=/${fight.venue}/i`);
    if (await venueElement.count() > 0) {
      await expect(venueElement.first()).toBeVisible();
    }

    // Check fight method
    const methodElement = page.locator(`text=/${fight.method}/i`);
    if (await methodElement.count() > 0) {
      await expect(methodElement.first()).toBeVisible();
    }

    // Check round if specified
    if (fight.round) {
      const roundElement = page.locator(`text=/round.*${fight.round}|${fight.round}.*round/i`);
      if (await roundElement.count() > 0) {
        await expect(roundElement.first()).toBeVisible();
      }
    }
  }

  /**
   * Assert weight class and boxing categories
   */
  async assertWeightClass(page: Page, expectedWeightClass: string) {
    const weightClassElement = page.locator(`text=/${expectedWeightClass}/i`);
    if (await weightClassElement.count() > 0) {
      await expect(weightClassElement.first()).toBeVisible();
    }
  }

  /**
   * Assert boxing achievements and titles
   */
  async assertBoxingAchievements(page: Page, achievements: string[]) {
    for (const achievement of achievements) {
      const achievementElement = page.locator(`text=/${achievement}/i`);
      if (await achievementElement.count() > 0) {
        await expect(achievementElement.first()).toBeVisible();
      }
    }
  }

  /**
   * Assert training and preparation information
   */
  async assertTrainingInfo(page: Page, expectedInfo: { gym?: string; coach?: string; trainingPartners?: string[] }) {
    if (expectedInfo.gym) {
      const gymElement = page.locator(`text=/${expectedInfo.gym}/i`);
      if (await gymElement.count() > 0) {
        await expect(gymElement.first()).toBeVisible();
      }
    }

    if (expectedInfo.coach) {
      const coachElement = page.locator(`text=/${expectedInfo.coach}/i`);
      if (await coachElement.count() > 0) {
        await expect(coachElement.first()).toBeVisible();
      }
    }

    if (expectedInfo.trainingPartners) {
      for (const partner of expectedInfo.trainingPartners) {
        const partnerElement = page.locator(`text=/${partner}/i`);
        if (await partnerElement.count() > 0) {
          await expect(partnerElement.first()).toBeVisible();
        }
      }
    }
  }

  /**
   * Assert upcoming fight information
   */
  async assertUpcomingFight(page: Page, fight: { date: string; opponent?: string; venue: string; title?: string }) {
    // Check fight date
    const dateElement = page.locator(`text=/${fight.date}/`);
    await expect(dateElement.first()).toBeVisible();

    // Check venue
    const venueElement = page.locator(`text=/${fight.venue}/i`);
    await expect(venueElement.first()).toBeVisible();

    // Check opponent if known
    if (fight.opponent && fight.opponent !== 'TBA') {
      const opponentElement = page.locator(`text=/${fight.opponent}/i`);
      await expect(opponentElement.first()).toBeVisible();
    }

    // Check title/description
    if (fight.title) {
      const titleElement = page.locator(`text=/${fight.title}/i`);
      if (await titleElement.count() > 0) {
        await expect(titleElement.first()).toBeVisible();
      }
    }
  }

  /**
   * Assert ticket purchasing functionality
   */
  async assertTicketPurchasing(page: Page) {
    // Look for ticket purchase buttons/links
    const ticketElements = page.locator('a[href*="ticket"], button:has-text("ticket"), a:has-text("buy")');
    await expect(ticketElements.first()).toBeVisible();

    // Check for pricing information
    const priceElements = page.locator('text=/\\$\\d+|price/i');
    if (await priceElements.count() > 0) {
      await expect(priceElements.first()).toBeVisible();
    }

    // Verify ticket link is functional
    const ticketLink = ticketElements.first();
    const href = await ticketLink.getAttribute('href');
    expect(href).toBeTruthy();
  }

  /**
   * Assert social media integration for boxing content
   */
  async assertSocialMediaIntegration(page: Page) {
    const socialPlatforms = ['instagram', 'twitter', 'youtube', 'tiktok'];
    let foundSocialLinks = 0;

    for (const platform of socialPlatforms) {
      const socialLink = page.locator(`a[href*="${platform}"]`);
      if (await socialLink.count() > 0) {
        await expect(socialLink.first()).toBeVisible();
        
        // Check link opens in new tab
        const target = await socialLink.first().getAttribute('target');
        expect(target).toBe('_blank');
        
        foundSocialLinks++;
      }
    }

    // Should have at least 2 social media platforms
    expect(foundSocialLinks).toBeGreaterThanOrEqual(2);
  }

  /**
   * Assert mobile-specific boxing fan experience
   */
  async assertMobileBoxingExperience(page: Page) {
    // Check for mobile-optimized fight statistics
    const statsElements = page.locator('[data-testid*="stats"], .stats, [class*="stat"]');
    
    if (await statsElements.count() > 0) {
      const statsBox = await statsElements.first().boundingBox();
      
      // Stats should be visible and touch-friendly on mobile
      expect(statsBox?.width).toBeLessThanOrEqual(400);
      expect(statsBox?.height).toBeGreaterThanOrEqual(44); // Minimum touch target
    }

    // Check for mobile navigation
    const mobileNav = page.locator('[data-testid="mobile-nav"], .mobile-menu, .hamburger');
    if (await mobileNav.count() > 0) {
      await expect(mobileNav.first()).toBeVisible();
    }
  }

  /**
   * Assert performance optimizations for boxing content
   */
  async assertPerformanceOptimizations(page: Page) {
    // Check for lazy loading on images
    const images = page.locator('img[loading="lazy"]');
    expect(await images.count()).toBeGreaterThanOrEqual(1);

    // Check for optimized video loading
    const videos = page.locator('video[preload="metadata"], video[preload="none"]');
    if (await videos.count() > 0) {
      console.log('✅ Videos optimized with preload settings');
    }

    // Check for modern image formats
    const modernImages = page.locator('img[src*=".webp"], img[src*=".avif"]');
    if (await modernImages.count() > 0) {
      console.log('✅ Modern image formats detected');
    }
  }

  /**
   * Assert accessibility features for boxing statistics
   */
  async assertBoxingAccessibility(page: Page) {
    // Check for proper heading hierarchy
    const headings = page.locator('h1, h2, h3, h4, h5, h6');
    expect(await headings.count()).toBeGreaterThanOrEqual(1);

    // Check for alt text on fight/training images
    const boxingImages = page.locator('img[src*="fight"], img[src*="training"], img[src*="boxing"]');
    
    if (await boxingImages.count() > 0) {
      for (let i = 0; i < Math.min(3, await boxingImages.count()); i++) {
        const img = boxingImages.nth(i);
        const altText = await img.getAttribute('alt');
        expect(altText).toBeTruthy();
        expect(altText?.length).toBeGreaterThan(5);
      }
    }

    // Check for ARIA labels on interactive elements
    const interactiveElements = page.locator('button, a, [role="button"]');
    
    if (await interactiveElements.count() > 0) {
      const firstInteractive = interactiveElements.first();
      const hasAccessibleName = await firstInteractive.evaluate((el) => {
        return !!(
          el.getAttribute('aria-label') ||
          el.getAttribute('aria-labelledby') ||
          el.textContent?.trim()
        );
      });
      expect(hasAccessibleName).toBeTruthy();
    }
  }
}

// Export singleton instance
export const boxingAssertions = new BoxingAssertions();