import { test, expect, Page } from '@playwright/test';

/**
 * SEO & Structured Data Tests - Kumar Prescod Boxing
 * Tests Schema.org structured data, meta tags, and SEO optimizations for boxing content
 */
test.describe('SEO & Structured Data - Boxing Search Optimization', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test('should have proper meta tags for boxing SEO', async ({ page }) => {
    // Test essential meta tags
    const title = await page.locator('title').textContent();
    expect(title).toMatch(/Kumar Prescod|Boxing|Professional Boxer/i);
    expect(title.length).toBeGreaterThan(10);
    expect(title.length).toBeLessThan(60); // SEO best practice
    
    console.log(`📄 Page title: "${title}"`);

    // Check meta description
    const metaDescription = await page.locator('meta[name="description"]').getAttribute('content');
    expect(metaDescription).toBeTruthy();
    expect(metaDescription!.length).toBeGreaterThan(120);
    expect(metaDescription!.length).toBeLessThan(160); // SEO best practice
    expect(metaDescription).toMatch(/Kumar Prescod|boxing|Oakland|professional/i);
    
    console.log(`📝 Meta description: "${metaDescription}"`);

    // Check Open Graph tags
    const ogTitle = await page.locator('meta[property="og:title"]').getAttribute('content');
    const ogDescription = await page.locator('meta[property="og:description"]').getAttribute('content');
    const ogImage = await page.locator('meta[property="og:image"]').getAttribute('content');
    const ogUrl = await page.locator('meta[property="og:url"]').getAttribute('content');

    if (ogTitle) {
      expect(ogTitle).toMatch(/Kumar Prescod|Boxing/i);
      console.log(`📱 OG title: "${ogTitle}"`);
    }

    if (ogImage) {
      expect(ogImage).toMatch(/\.(jpg|jpeg|png|webp)$/i);
      console.log(`🖼️ OG image: "${ogImage}"`);
    }

    // Check Twitter Card tags
    const twitterCard = await page.locator('meta[name="twitter:card"]').getAttribute('content');
    const twitterTitle = await page.locator('meta[name="twitter:title"]').getAttribute('content');
    
    if (twitterCard) {
      expect(twitterCard).toMatch(/summary|summary_large_image/);
      console.log(`🐦 Twitter card: "${twitterCard}"`);
    }
  });

  test('should have comprehensive structured data for boxing content', async ({ page }) => {
    // Check for JSON-LD structured data
    const jsonLdScripts = page.locator('script[type="application/ld+json"]');
    const jsonLdCount = await jsonLdScripts.count();
    
    expect(jsonLdCount).toBeGreaterThan(0);
    console.log(`📊 Found ${jsonLdCount} JSON-LD structured data blocks`);

    // Parse and validate structured data
    const structuredDataArray = [];
    
    for (let i = 0; i < jsonLdCount; i++) {
      const scriptContent = await jsonLdScripts.nth(i).textContent();
      
      try {
        const structuredData = JSON.parse(scriptContent || '{}');
        structuredDataArray.push(structuredData);
        
        // Validate basic structure
        expect(structuredData['@context']).toBe('https://schema.org');
        expect(structuredData['@type']).toBeTruthy();
        
        console.log(`📋 Structured data ${i + 1}: ${structuredData['@type']}`);
        
        // Validate specific schema types for boxing
        if (structuredData['@type'] === 'Person') {
          expect(structuredData.name).toMatch(/Kumar Prescod/i);
          expect(structuredData.jobTitle || structuredData.description).toMatch(/boxer|fighter/i);
          
          if (structuredData.address) {
            expect(structuredData.address.addressLocality).toMatch(/Oakland/i);
          }
          
          console.log(`👤 Person schema: "${structuredData.name}" - ${structuredData.jobTitle || structuredData.description}`);
        }
        
        if (structuredData['@type'] === 'SportsEvent') {
          expect(structuredData.name).toBeTruthy();
          expect(structuredData.sport).toMatch(/boxing/i);
          
          if (structuredData.competitor) {
            const hasKumar = structuredData.competitor.some((competitor: any) => 
              competitor.name && competitor.name.includes('Kumar Prescod')
            );
            expect(hasKumar).toBeTruthy();
          }
          
          console.log(`🥊 Sports event schema: "${structuredData.name}"`);
        }
        
        if (structuredData['@type'] === 'Organization') {
          expect(structuredData.name).toBeTruthy();
          expect(structuredData.description || structuredData.name).toMatch(/boxing/i);
          
          console.log(`🏢 Organization schema: "${structuredData.name}"`);
        }
        
        if (structuredData['@type'] === 'WebSite') {
          expect(structuredData.name).toMatch(/Kumar Prescod/i);
          expect(structuredData.url).toBeTruthy();
          
          if (structuredData.potentialAction) {
            expect(structuredData.potentialAction['@type']).toBe('SearchAction');
          }
          
          console.log(`🌐 Website schema: "${structuredData.name}"`);
        }
        
      } catch (error) {
        console.error(`❌ Invalid JSON-LD in script ${i + 1}:`, error);
        throw error;
      }
    }

    // Should have at least Person and WebSite schemas for Kumar Prescod
    const schemaTypes = structuredDataArray.map(data => data['@type']);
    expect(schemaTypes).toContain('Person');
    expect(schemaTypes).toContain('WebSite');
    
    console.log(`✅ Schema types found: ${schemaTypes.join(', ')}`);
  });

  test('should have boxing-specific microdata markup', async ({ page }) => {
    // Check for microdata attributes
    const microdataElements = page.locator('[itemscope], [itemtype], [itemprop]');
    const microdataCount = await microdataElements.count();
    
    if (microdataCount > 0) {
      console.log(`📝 Found ${microdataCount} elements with microdata`);
      
      // Check for Person microdata
      const personElements = page.locator('[itemtype*="schema.org/Person"]');
      if (await personElements.count() > 0) {
        const nameElement = page.locator('[itemprop="name"]').first();
        if (await nameElement.count() > 0) {
          const name = await nameElement.textContent();
          expect(name).toMatch(/Kumar Prescod/i);
          console.log(`👤 Person microdata name: "${name}"`);
        }
      }
      
      // Check for SportsEvent microdata
      const eventElements = page.locator('[itemtype*="schema.org/SportsEvent"]');
      if (await eventElements.count() > 0) {
        console.log(`🥊 Found ${await eventElements.count()} sports event microdata`);
      }
    }
  });

  test('should have proper semantic HTML structure for boxing content', async ({ page }) => {
    // Check for semantic HTML5 elements
    const header = page.locator('header');
    const nav = page.locator('nav');
    const main = page.locator('main');
    const footer = page.locator('footer');
    const articles = page.locator('article');
    const sections = page.locator('section');

    await expect(header).toHaveCount(1);
    await expect(main).toHaveCount(1);
    await expect(footer).toHaveCount(1);

    // Navigation should have proper ARIA labels
    const navCount = await nav.count();
    if (navCount > 0) {
      for (let i = 0; i < navCount; i++) {
        const navElement = nav.nth(i);
        const ariaLabel = await navElement.getAttribute('aria-label');
        const role = await navElement.getAttribute('role');
        
        expect(ariaLabel || role).toBeTruthy();
        console.log(`🧭 Navigation ${i + 1}: ${ariaLabel || role}`);
      }
    }

    // Sections should have headings or ARIA labels
    const sectionCount = await sections.count();
    if (sectionCount > 0) {
      for (let i = 0; i < Math.min(sectionCount, 5); i++) {
        const section = sections.nth(i);
        const hasHeading = await section.locator('h1, h2, h3, h4, h5, h6').count() > 0;
        const ariaLabel = await section.getAttribute('aria-label');
        const ariaLabelledBy = await section.getAttribute('aria-labelledby');
        
        expect(hasHeading || ariaLabel || ariaLabelledBy).toBeTruthy();
      }
    }

    console.log(`🏗️ Semantic structure: ${await header.count()} header, ${navCount} nav, ${await main.count()} main, ${sectionCount} sections, ${await footer.count()} footer`);
  });

  test('should have proper canonical URL and robots directives', async ({ page }) => {
    // Check canonical URL
    const canonical = page.locator('link[rel="canonical"]');
    if (await canonical.count() > 0) {
      const canonicalUrl = await canonical.getAttribute('href');
      expect(canonicalUrl).toBeTruthy();
      expect(canonicalUrl).toMatch(/^https?:\/\//);
      console.log(`🔗 Canonical URL: "${canonicalUrl}"`);
    }

    // Check robots meta tag
    const robotsMeta = page.locator('meta[name="robots"]');
    if (await robotsMeta.count() > 0) {
      const robotsContent = await robotsMeta.getAttribute('content');
      expect(robotsContent).toBeTruthy();
      
      // Should not have noindex for main boxing content
      expect(robotsContent).not.toMatch(/noindex/i);
      console.log(`🤖 Robots directive: "${robotsContent}"`);
    }

    // Check for viewport meta tag (important for mobile SEO)
    const viewport = page.locator('meta[name="viewport"]');
    await expect(viewport).toHaveCount(1);
    
    const viewportContent = await viewport.getAttribute('content');
    expect(viewportContent).toMatch(/width=device-width/);
    console.log(`📱 Viewport: "${viewportContent}"`);
  });

  test('should have proper language and accessibility declarations', async ({ page }) => {
    // Check html lang attribute
    const htmlLang = await page.locator('html').getAttribute('lang');
    expect(htmlLang).toBeTruthy();
    expect(htmlLang).toMatch(/^en/); // Should be English
    console.log(`🌐 Page language: "${htmlLang}"`);

    // Check for skip links and accessibility features
    const skipLinks = page.locator('a[href^="#"], .sr-only');
    if (await skipLinks.count() > 0) {
      console.log(`♿ Found ${await skipLinks.count()} accessibility navigation elements`);
    }

    // Check for ARIA landmarks
    const landmarks = page.locator('[role="banner"], [role="navigation"], [role="main"], [role="contentinfo"], [role="complementary"]');
    const landmarkCount = await landmarks.count();
    
    expect(landmarkCount).toBeGreaterThan(0);
    console.log(`🏷️ ARIA landmarks: ${landmarkCount}`);

    // Check for focus management
    const focusableElements = page.locator('a, button, input, textarea, select, [tabindex]:not([tabindex="-1"])');
    const focusableCount = await focusableElements.count();
    
    expect(focusableCount).toBeGreaterThan(0);
    console.log(`⌨️ Focusable elements: ${focusableCount}`);
  });

  test('should have optimized URLs and breadcrumb navigation', async ({ page }) => {
    // Check current URL structure
    const currentUrl = page.url();
    
    // URL should be clean and descriptive
    expect(currentUrl).not.toMatch(/\?.*=/); // No query parameters on main page
    expect(currentUrl).not.toMatch(/#/); // No hash fragments
    
    console.log(`🔗 Current URL: ${currentUrl}`);

    // Check for breadcrumb navigation
    const breadcrumbs = page.locator('[aria-label*="breadcrumb"], .breadcrumb, nav[role="navigation"] ol, nav[role="navigation"] ul');
    
    if (await breadcrumbs.count() > 0) {
      console.log(`🍞 Breadcrumb navigation found`);
      
      // Breadcrumbs should have proper schema markup
      const breadcrumbList = page.locator('[itemtype*="BreadcrumbList"]');
      if (await breadcrumbList.count() > 0) {
        console.log(`✅ Breadcrumb structured data found`);
      }
    }

    // Check internal links for proper structure
    const internalLinks = page.locator('a[href^="/"], a[href^="./"], a[href^="../"]');
    const internalLinkCount = await internalLinks.count();
    
    if (internalLinkCount > 0) {
      console.log(`🔗 Internal links: ${internalLinkCount}`);
      
      // Sample a few internal links to check structure
      for (let i = 0; i < Math.min(3, internalLinkCount); i++) {
        const link = internalLinks.nth(i);
        const href = await link.getAttribute('href');
        const linkText = await link.textContent();
        
        // Link should have descriptive text
        expect(linkText?.trim().length).toBeGreaterThan(2);
        console.log(`🔗 Link ${i + 1}: "${linkText}" → ${href}`);
      }
    }
  });

  test('should handle search engine optimization for boxing keywords', async ({ page }) => {
    // Check for boxing-related keywords in content
    const pageContent = await page.textContent('body');
    const boxingKeywords = [
      'kumar prescod',
      'boxing',
      'boxer',
      'fighter',
      'oakland',
      'professional',
      'undefeated',
      'knockout',
      'champion',
      'training'
    ];

    const foundKeywords = boxingKeywords.filter(keyword => 
      pageContent?.toLowerCase().includes(keyword.toLowerCase())
    );

    expect(foundKeywords.length).toBeGreaterThan(5); // Should have most boxing keywords
    console.log(`🎯 Boxing keywords found: ${foundKeywords.join(', ')}`);

    // Check keyword density (should be natural, not stuffed)
    const wordCount = pageContent?.split(/\s+/).length || 0;
    const keywordCount = foundKeywords.reduce((count, keyword) => {
      const matches = (pageContent?.toLowerCase().match(new RegExp(keyword.toLowerCase(), 'g')) || []).length;
      return count + matches;
    }, 0);

    const keywordDensity = (keywordCount / wordCount) * 100;
    
    // Keyword density should be reasonable (1-3%)
    expect(keywordDensity).toBeGreaterThan(0.5);
    expect(keywordDensity).toBeLessThan(5);
    
    console.log(`📊 Keyword density: ${keywordDensity.toFixed(2)}% (${keywordCount}/${wordCount} words)`);
  });

  test('should have proper image SEO optimization', async ({ page }) => {
    const images = page.locator('img');
    const imageCount = await images.count();
    
    if (imageCount > 0) {
      let optimizedCount = 0;
      
      for (let i = 0; i < Math.min(imageCount, 5); i++) {
        const image = images.nth(i);
        const alt = await image.getAttribute('alt');
        const src = await image.getAttribute('src');
        const title = await image.getAttribute('title');
        
        // Image should have alt text
        if (alt && alt.length > 3) {
          optimizedCount++;
          
          // Alt text should be descriptive for boxing content
          const hasBoxingTerms = /kumar|prescod|boxing|fighter|training|fight/i.test(alt);
          if (hasBoxingTerms) {
            console.log(`🖼️ SEO-optimized image: "${alt}"`);
          }
        }
        
        // Check for modern image formats
        if (src?.includes('.webp') || src?.includes('.avif')) {
          console.log(`⚡ Modern format image: ${src}`);
        }
      }
      
      const optimizationRate = (optimizedCount / Math.min(imageCount, 5)) * 100;
      expect(optimizationRate).toBeGreaterThan(70); // At least 70% should be optimized
      
      console.log(`📈 Image SEO optimization: ${optimizationRate.toFixed(1)}%`);
    }
  });

  test('should have performance-optimized SEO signals', async ({ page }) => {
    // Check for Core Web Vitals optimization
    const performanceEntries = await page.evaluate(() => {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      return {
        domContentLoaded: navigation.domContentLoadedEventEnd - navigation.navigationStart,
        loadComplete: navigation.loadEventEnd - navigation.navigationStart,
        firstByte: navigation.responseStart - navigation.requestStart
      };
    });

    // SEO-friendly performance thresholds
    expect(performanceEntries.domContentLoaded).toBeLessThan(3000); // 3 seconds
    expect(performanceEntries.firstByte).toBeLessThan(600); // 600ms TTFB
    
    console.log(`⚡ Performance metrics:`, performanceEntries);

    // Check for lazy loading implementation
    const lazyImages = page.locator('img[loading="lazy"]');
    const lazyImageCount = await lazyImages.count();
    
    if (lazyImageCount > 0) {
      console.log(`🚀 Lazy loading images: ${lazyImageCount}`);
    }

    // Check for service worker (PWA signals)
    const hasServiceWorker = await page.evaluate(() => 'serviceWorker' in navigator);
    if (hasServiceWorker) {
      console.log('✅ PWA-ready with service worker');
    }

    // Check for HTTP/2 or HTTP/3
    const protocol = await page.evaluate(() => {
      const entries = performance.getEntriesByType('navigation');
      return entries.length > 0 ? (entries[0] as any).nextHopProtocol : 'unknown';
    });
    
    if (protocol && protocol !== 'unknown') {
      console.log(`🌐 Protocol: ${protocol}`);
    }
  });
});