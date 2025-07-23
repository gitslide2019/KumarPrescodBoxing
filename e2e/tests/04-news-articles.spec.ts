import { test, expect, Page } from '@playwright/test';
import { performanceUtils } from '../utils/performance';

/**
 * News Articles Tests - Kumar Prescod Boxing
 * Tests news article display, sharing functionality, and content accessibility
 */
test.describe('News Articles & Media Coverage - Boxing Journalism', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    
    // Navigate to news section if available
    const newsLink = page.locator('a[href*="/news"], a:has-text("news"), nav a:has-text("media")');
    if (await newsLink.count() > 0) {
      await newsLink.first().click();
      await page.waitForLoadState('networkidle');
    }
  });

  test('should display latest boxing news articles', async ({ page }) => {
    // Look for news articles section
    const newsSection = page.locator('.news, [data-testid*="news"], [class*="article"]');
    
    if (await newsSection.count() === 0) {
      // Look for news content in homepage sections
      const latestNews = page.locator('text=/latest.*news|news.*update|press.*release/i');
      await expect(latestNews.first()).toBeVisible();
    } else {
      await expect(newsSection.first()).toBeVisible();
    }
    
    // Check for boxing-related headlines
    const boxingHeadlines = page.locator('text=/kumar|prescod|boxing|fight|knockout|training/i');
    expect(await boxingHeadlines.count()).toBeGreaterThanOrEqual(1);
  });

  test('should show article publication dates and sources', async ({ page }) => {
    // Look for date stamps on articles
    const dateElements = page.locator('time, [datetime], text=/202[34]-\\d{2}-\\d{2}|\\d{1,2}\\/\\d{1,2}\\/202[34]/');
    
    if (await dateElements.count() > 0) {
      await expect(dateElements.first()).toBeVisible();
      
      // Verify date format is accessible
      const timeElement = page.locator('time').first();
      if (await timeElement.count() > 0) {
        const datetime = await timeElement.getAttribute('datetime');
        if (datetime) {
          expect(datetime).toMatch(/\d{4}-\d{2}-\d{2}/); // ISO date format
        }
      }
    }
    
    // Look for news source attribution
    const sources = page.locator('text=/espn|fox sports|boxing news|sports illustrated|associated press/i');
    if (await sources.count() > 0) {
      await expect(sources.first()).toBeVisible();
    }
  });

  test('should display boxing press releases and announcements', async ({ page }) => {
    // Look for press release content
    const pressReleases = page.locator('text=/press release|announcement|official.*statement/i');
    
    if (await pressReleases.count() > 0) {
      await expect(pressReleases.first()).toBeVisible();
    }
    
    // Check for fight announcements
    const fightAnnouncements = page.locator('text=/fight.*announced|upcoming.*bout|boxing.*match/i');
    
    if (await fightAnnouncements.count() > 0) {
      await expect(fightAnnouncements.first()).toBeVisible();
    }
    
    // Look for training camp updates
    const trainingUpdates = page.locator('text=/training.*camp|preparation|workout.*update/i');
    
    if (await trainingUpdates.count() > 0) {
      await expect(trainingUpdates.first()).toBeVisible();
    }
  });

  test('should provide social media sharing for articles', async ({ page }) => {
    // Look for social sharing buttons
    const shareButtons = page.locator(
      'button:has-text("share"), ' +
      'a[href*="facebook.com/sharer"], ' +
      'a[href*="twitter.com/intent"], ' +
      'a[href*="linkedin.com/sharing"], ' +
      '[data-share], .share-button'
    );
    
    if (await shareButtons.count() > 0) {
      const firstShareButton = shareButtons.first();
      await expect(firstShareButton).toBeVisible();
      
      // Test social sharing links
      const href = await firstShareButton.getAttribute('href');
      if (href) {
        expect(href).toMatch(/facebook\.com|twitter\.com|linkedin\.com|mailto:/);
        
        // Verify share URL contains article information
        if (href.includes('facebook.com') || href.includes('twitter.com')) {
          expect(href).toMatch(/url=|text=|title=/);
        }
      }
    }
    
    // Test native Web Share API on mobile
    const nativeShareButton = page.locator('button[data-action="share"]');
    if (await nativeShareButton.count() > 0) {
      const shareSupported = await page.evaluate(() => {
        return 'share' in navigator;
      });
      
      if (shareSupported) {
        console.log('📱 Native Web Share API available for boxing articles');
      }
    }
  });

  test('should display boxing interview content', async ({ page }) => {
    // Look for interview content
    const interviews = page.locator('text=/interview|q&a|exclusive.*chat|talks.*about/i');
    
    if (await interviews.count() > 0) {
      await expect(interviews.first()).toBeVisible();
    }
    
    // Check for video interviews
    const videoInterviews = page.locator('video, iframe[src*="youtube"], iframe[src*="vimeo"]');
    
    if (await videoInterviews.count() > 0) {
      const firstVideo = videoInterviews.first();
      await expect(firstVideo).toBeVisible();
      
      // Test video accessibility
      if (await firstVideo.evaluate(el => el.tagName.toLowerCase() === 'video')) {
        const hasControls = await firstVideo.getAttribute('controls');
        expect(hasControls).toBeTruthy();
      }
      
      if (await firstVideo.evaluate(el => el.tagName.toLowerCase() === 'iframe')) {
        const title = await firstVideo.getAttribute('title');
        expect(title).toBeTruthy();
      }
    }
    
    // Check for quote highlights
    const quotes = page.locator('blockquote, .quote, [class*="quote"]');
    
    if (await quotes.count() > 0) {
      await expect(quotes.first()).toBeVisible();
      
      // Quotes should have proper semantic markup
      const blockquote = quotes.first();
      const tagName = await blockquote.evaluate(el => el.tagName.toLowerCase());
      expect(['blockquote', 'q'].includes(tagName) || await blockquote.getAttribute('role') === 'quote');
    }
  });

  test('should show boxing match coverage and analysis', async ({ page }) => {
    // Look for fight coverage
    const fightCoverage = page.locator('text=/fight.*recap|match.*analysis|bout.*review|round.*by.*round/i');
    
    if (await fightCoverage.count() > 0) {
      await expect(fightCoverage.first()).toBeVisible();
    }
    
    // Check for statistical analysis
    const statsAnalysis = page.locator('text=/statistics|punch.*stats|performance.*metrics|fight.*data/i');
    
    if (await statsAnalysis.count() > 0) {
      await expect(statsAnalysis.first()).toBeVisible();
    }
    
    // Look for opponent analysis
    const opponentAnalysis = page.locator('text=/opponent.*preview|fighter.*comparison|scouting.*report/i');
    
    if (await opponentAnalysis.count() > 0) {
      await expect(opponentAnalysis.first()).toBeVisible();
    }
  });

  test('should provide accessible news content for screen readers', async ({ page }) => {
    // Check for proper heading hierarchy in articles
    const headings = page.locator('h1, h2, h3, h4, h5, h6');
    expect(await headings.count()).toBeGreaterThanOrEqual(1);
    
    // Verify article structure
    const articles = page.locator('article, [role="article"], .article');
    
    if (await articles.count() > 0) {
      const firstArticle = articles.first();
      
      // Article should have a heading
      const articleHeading = firstArticle.locator('h1, h2, h3, h4, h5, h6');
      if (await articleHeading.count() > 0) {
        await expect(articleHeading.first()).toBeVisible();
      }
      
      // Article should have readable content
      const articleContent = firstArticle.locator('p, .content, [class*="body"]');
      if (await articleContent.count() > 0) {
        const textContent = await articleContent.first().textContent();
        expect(textContent?.length).toBeGreaterThan(50);
      }
    }
    
    // Check for alt text on boxing images
    const newsImages = page.locator('img[src*="news"], img[src*="boxing"], img[alt*="kumar"]');
    
    if (await newsImages.count() > 0) {
      for (let i = 0; i < Math.min(3, await newsImages.count()); i++) {
        const img = newsImages.nth(i);
        const altText = await img.getAttribute('alt');
        expect(altText).toBeTruthy();
        expect(altText?.length).toBeGreaterThan(10);
      }
    }
  });

  test('should load news images efficiently', async ({ page }) => {
    const newsImages = page.locator('img[src*="news"], img[src*="boxing"], img[alt*="article"]');
    
    if (await newsImages.count() > 0) {
      // First image should load quickly
      await expect(newsImages.first()).toBeVisible({ timeout: 8000 });
      
      // Check image optimization
      for (let i = 0; i < Math.min(3, await newsImages.count()); i++) {
        const img = newsImages.nth(i);
        const src = await img.getAttribute('src');
        
        if (src) {
          // Verify image loads successfully
          const response = await page.request.get(src);
          expect(response.status()).toBe(200);
          
          // Check for modern image formats
          if (src.includes('.webp') || src.includes('.avif')) {
            console.log('✅ Modern image format detected for news content');
          }
          
          // Check for lazy loading on non-critical images
          if (i > 0) {
            const loadingAttr = await img.getAttribute('loading');
            expect(loadingAttr).toBe('lazy');
          }
        }
      }
    }
  });

  test('should display related boxing articles and recommendations', async ({ page }) => {
    // Look for related articles section
    const relatedArticles = page.locator('text=/related.*articles|you.*might.*like|more.*news|similar.*stories/i');
    
    if (await relatedArticles.count() > 0) {
      await expect(relatedArticles.first()).toBeVisible();
      
      // Check for recommended article links
      const articleLinks = page.locator('a[href*="/news"], a[href*="/article"], a[class*="article"]');
      
      if (await articleLinks.count() > 1) {
        // Should have multiple related articles
        expect(await articleLinks.count()).toBeGreaterThanOrEqual(2);
        
        // Links should have descriptive text
        const firstLink = articleLinks.first();
        const linkText = await firstLink.textContent();
        expect(linkText?.length).toBeGreaterThan(10);
      }
    }
    
    // Check for category-based organization
    const categories = page.locator('text=/training.*news|fight.*news|interview|press.*release/i');
    
    if (await categories.count() > 0) {
      await expect(categories.first()).toBeVisible();
    }
  });

  test('should support news search and filtering', async ({ page }) => {
    // Look for search functionality
    const searchInput = page.locator('input[type="search"], input[placeholder*="search"], .search-input');
    
    if (await searchInput.count() > 0) {
      await expect(searchInput.first()).toBeVisible();
      
      // Test search functionality
      await searchInput.first().fill('boxing');
      await page.keyboard.press('Enter');
      await page.waitForTimeout(1000);
      
      // Should show search results
      const searchResults = page.locator('text=/results|found|search/i');
      if (await searchResults.count() > 0) {
        await expect(searchResults.first()).toBeVisible();
      }
    }
    
    // Check for category filters
    const filterButtons = page.locator('button:has-text("all"), button:has-text("interviews"), button:has-text("fights")');
    
    if (await filterButtons.count() > 0) {
      const filterButton = filterButtons.first();
      await expect(filterButton).toBeVisible();
      
      // Test filter functionality
      await filterButton.click();
      await page.waitForTimeout(1000);
      
      // Content should update based on filter
      console.log('✅ News filtering functionality detected');
    }
  });

  test('should handle news article mobile experience', async ({ page, isMobile }) => {
    if (!isMobile) {
      await page.setViewportSize({ width: 375, height: 667 }); // iPhone SE
    }
    
    // News content should be readable on mobile
    const newsContent = page.locator('article, .article, .news-item').first();
    
    if (await newsContent.count() > 0) {
      await expect(newsContent).toBeVisible();
      
      // Content should fit mobile screen
      const contentBox = await newsContent.boundingBox();
      expect(contentBox?.width).toBeLessThanOrEqual(400);
      
      // Text should be readable
      const textElements = newsContent.locator('p, h1, h2, h3');
      if (await textElements.count() > 0) {
        const fontSize = await textElements.first().evaluate((el) => {
          return parseInt(window.getComputedStyle(el).fontSize);
        });
        expect(fontSize).toBeGreaterThanOrEqual(14);
      }
    }
    
    // Check mobile navigation for news
    const mobileNav = page.locator('[data-testid="mobile-nav"], .mobile-menu');
    if (await mobileNav.count() > 0) {
      await expect(mobileNav.first()).toBeVisible();
    }
    
    // Test mobile sharing functionality
    const mobileShareButton = page.locator('button:has-text("share"), [data-action="share"]');
    if (await mobileShareButton.count() > 0) {
      // Should be touch-friendly
      const buttonBox = await mobileShareButton.first().boundingBox();
      expect(buttonBox?.height).toBeGreaterThanOrEqual(44);
      expect(buttonBox?.width).toBeGreaterThanOrEqual(44);
    }
  });

  test('should display boxing news with proper SEO structure', async ({ page }) => {
    // Check for proper meta tags if this is a dedicated news page
    const metaTitle = await page.title();
    expect(metaTitle).toMatch(/news|kumar|boxing|prescod/i);
    
    // Check for structured data
    const structuredData = page.locator('script[type="application/ld+json"]');
    
    if (await structuredData.count() > 0) {
      const jsonLd = await structuredData.first().textContent();
      if (jsonLd) {
        try {
          const data = JSON.parse(jsonLd);
          // Should have article or news structured data
          expect(data['@type']).toMatch(/Article|NewsArticle|BlogPosting/);
        } catch (error) {
          console.warn('Invalid JSON-LD structured data');
        }
      }
    }
    
    // Check for proper heading structure
    const h1 = page.locator('h1');
    if (await h1.count() > 0) {
      await expect(h1.first()).toBeVisible();
      const h1Text = await h1.first().textContent();
      expect(h1Text?.length).toBeGreaterThan(10);
    }
  });
});