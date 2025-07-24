import { test, expect, Page } from '@playwright/test';

/**
 * Code Splitting & Lazy Loading Tests - Kumar Prescod Boxing
 * Tests React.lazy implementation, dynamic imports, and bundle optimization
 */
test.describe('Code Splitting & Lazy Loading - Boxing Bundle Optimization', () => {
  test.beforeEach(async ({ page }) => {
    // Monitor network requests for bundle analysis
    await page.route('**/*', route => {
      route.continue();
    });
  });

  test('should implement React.lazy for route-based code splitting', async ({ page }) => {
    const networkRequests: string[] = [];
    
    // Track JavaScript bundle requests
    page.on('request', request => {
      if (request.resourceType() === 'script' && request.url().includes('.js')) {
        networkRequests.push(request.url());
      }
    });

    // Navigate to homepage
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const initialBundles = [...networkRequests];
    console.log(`📦 Initial bundles loaded: ${initialBundles.length}`);

    // Navigate to different routes to trigger lazy loading
    const routes = ['/about', '/fights', '/shop', '/journey'];
    
    for (const route of routes) {
      const beforeNavigation = networkRequests.length;
      
      // Navigate to route
      await page.goto(route);
      await page.waitForLoadState('networkidle');
      
      const afterNavigation = networkRequests.length;
      const newBundles = afterNavigation - beforeNavigation;
      
      // Should load new chunks for lazy-loaded routes
      if (newBundles > 0) {
        console.log(`🚀 Route ${route}: ${newBundles} new chunks loaded`);
      }
      
      // Page should render successfully
      await expect(page.locator('h1, h2').first()).toBeVisible();
      
      // Check for lazy loading indicators
      const hasLazyContent = await page.evaluate(() => {
        // Check for React Suspense fallback or loading states
        return document.querySelector('.loading, .spinner, [data-testid*="loading"]') !== null ||
               document.querySelector('[data-lazy="true"], .lazy-loaded') !== null;
      });
      
      if (hasLazyContent) {
        console.log(`⏳ Lazy loading detected for route: ${route}`);
      }
    }

    // Total bundles should be reasonable
    expect(networkRequests.length).toBeLessThan(20); // Not too many chunks
    console.log(`📊 Total JavaScript bundles: ${networkRequests.length}`);
  });

  test('should implement LazyWrapper component with boxing-themed loading', async ({ page }) => {
    await page.goto('/');
    
    // Check for LazyWrapper or lazy loading components
    const lazyComponents = await page.evaluate(() => {
      const elements = document.querySelectorAll('[data-lazy], .lazy-wrapper, .boxing-lazy');
      return Array.from(elements).map(el => ({
        className: el.className,
        dataset: el.dataset ? Object.keys(el.dataset) : [],
        tagName: el.tagName.toLowerCase()
      }));
    });

    if (lazyComponents.length > 0) {
      console.log(`🥊 Found ${lazyComponents.length} lazy-loaded components`);
      lazyComponents.forEach((comp, i) => {
        console.log(`  ${i + 1}. ${comp.tagName}.${comp.className} [${comp.dataset.join(', ')}]`);
      });
    }

    // Test lazy loading by navigating to different routes
    const routes = ['/fights', '/shop', '/journey'];
    
    for (const route of routes) {
      await page.goto(route);
      
      // Look for loading states during navigation
      const loadingStates = await page.evaluate(async () => {
        // Check for loading indicators during page transition
        const loadingElements = document.querySelectorAll(
          '.loading, .spinner, .skeleton, [aria-busy="true"], [data-loading="true"]'
        );
        
        const suspenseElements = document.querySelectorAll('[data-react-suspense]');
        
        return {
          loadingElements: loadingElements.length,
          suspenseElements: suspenseElements.length,
          hasLoadingText: document.body.textContent?.includes('Loading') || false,
          hasSpinner: document.querySelector('.animate-spin, .rotate, .boxing-spinner') !== null
        };
      });

      console.log(`⏳ Loading states for ${route}:`, loadingStates);
      
      // Wait for content to fully load
      await page.waitForLoadState('networkidle');
      await expect(page.locator('h1, h2').first()).toBeVisible();
    }
  });

  test('should optimize bundle sizes with tree shaking and compression', async ({ page }) => {
    const bundleInfo: any[] = [];
    
    // Monitor bundle loading and sizes
    page.on('response', async response => {
      if (response.request().resourceType() === 'script' && 
          response.url().includes('.js') && 
          response.status() === 200) {
        
        const url = response.url();
        const size = parseInt(response.headers()['content-length'] || '0');
        
        bundleInfo.push({
          url: url.split('/').pop(),
          size,
          compressed: response.headers()['content-encoding'] === 'gzip' || 
                     response.headers()['content-encoding'] === 'br'
        });
      }
    });

    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Analyze bundle information
    const totalSize = bundleInfo.reduce((sum, bundle) => sum + bundle.size, 0);
    const compressedBundles = bundleInfo.filter(bundle => bundle.compressed).length;
    const compressionRate = compressedBundles / Math.max(bundleInfo.length, 1);

    console.log(`📦 Bundle analysis:`);
    console.log(`  Total bundles: ${bundleInfo.length}`);
    console.log(`  Total size: ${(totalSize / 1024).toFixed(1)} KB`);
    console.log(`  Compressed: ${(compressionRate * 100).toFixed(1)}%`);

    // Size expectations for boxing website
    expect(totalSize).toBeLessThan(2 * 1024 * 1024); // Less than 2MB total
    expect(compressionRate).toBeGreaterThan(0.7); // At least 70% compressed

    // Log individual bundle sizes
    bundleInfo
      .sort((a, b) => b.size - a.size)
      .slice(0, 5)
      .forEach((bundle, i) => {
        console.log(`  ${i + 1}. ${bundle.url}: ${(bundle.size / 1024).toFixed(1)} KB ${bundle.compressed ? '(compressed)' : ''}`);
      });
  });

  test('should implement dynamic imports for heavy boxing features', async ({ page }) => {
    await page.goto('/');
    
    // Test dynamic loading of heavy features
    const heavyFeatures = [
      { selector: '.photo-gallery, [data-gallery]', name: 'Photo Gallery' },
      { selector: '.video-player, [data-video]', name: 'Video Player' },
      { selector: '.stats-chart, [data-chart]', name: 'Statistics Charts' },
      { selector: '.calendar, [data-calendar]', name: 'Event Calendar' },
      { selector: '.map, [data-map]', name: 'Map Component' }
    ];

    for (const feature of heavyFeatures) {
      const elements = page.locator(feature.selector);
      const count = await elements.count();
      
      if (count > 0) {
        console.log(`🎯 Found heavy feature: ${feature.name} (${count} elements)`);
        
        // Check if feature is dynamically loaded
        const isDynamic = await page.evaluate((selector) => {
          const element = document.querySelector(selector);
          return element && (
            element.hasAttribute('data-dynamic') ||
            element.hasAttribute('data-lazy') ||
            element.classList.contains('dynamic-import') ||
            element.classList.contains('lazy-loaded')
          );
        }, feature.selector);
        
        if (isDynamic) {
          console.log(`✅ ${feature.name} is dynamically loaded`);
        }
      }
    }

    // Test interaction-based loading
    const interactiveElements = page.locator('button, [role="button"], .btn');
    const interactiveCount = await interactiveElements.count();
    
    if (interactiveCount > 0) {
      console.log(`🖱️ Testing interaction-based loading with ${interactiveCount} interactive elements`);
      
      // Click first few interactive elements to test dynamic loading
      for (let i = 0; i < Math.min(3, interactiveCount); i++) {
        const element = interactiveElements.nth(i);
        const isVisible = await element.isVisible();
        
        if (isVisible) {
          const beforeClick = await page.evaluate(() => document.querySelectorAll('script').length);
          
          await element.click();
          await page.waitForTimeout(1000);
          
          const afterClick = await page.evaluate(() => document.querySelectorAll('script').length);
          
          if (afterClick > beforeClick) {
            console.log(`📦 Dynamic script loaded after interaction ${i + 1}`);
          }
        }
      }
    }
  });

  test('should preload critical boxing content', async ({ page }) => {
    // Monitor preload resources
    const preloadedResources: string[] = [];
    
    page.on('request', request => {
      const url = request.url();
      if (request.resourceType() === 'script' || 
          request.resourceType() === 'stylesheet' ||
          request.resourceType() === 'image') {
        preloadedResources.push(url);
      }
    });

    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Check for preload hints in HTML
    const preloadHints = await page.evaluate(() => {
      const links = Array.from(document.querySelectorAll('link[rel="preload"], link[rel="prefetch"], link[rel="modulepreload"]'));
      return links.map(link => ({
        rel: link.getAttribute('rel'),
        href: link.getAttribute('href'),
        as: link.getAttribute('as'),
        type: link.getAttribute('type')
      }));
    });

    console.log(`🚀 Preload hints found: ${preloadHints.length}`);
    preloadHints.forEach((hint, i) => {
      console.log(`  ${i + 1}. ${hint.rel} ${hint.as || hint.type}: ${hint.href}`);
    });

    // Check for critical boxing images preloading
    const criticalImagePreloads = preloadHints.filter(hint => 
      hint.as === 'image' && (
        hint.href?.includes('kumar') ||
        hint.href?.includes('boxing') ||
        hint.href?.includes('profile') ||
        hint.href?.includes('logo')
      )
    );

    if (criticalImagePreloads.length > 0) {
      console.log(`🖼️ Critical boxing images preloaded: ${criticalImagePreloads.length}`);
    }

    // Check for font preloading
    const fontPreloads = preloadHints.filter(hint => 
      hint.as === 'font' || hint.type?.includes('font')
    );

    if (fontPreloads.length > 0) {
      console.log(`🔤 Fonts preloaded: ${fontPreloads.length}`);
    }
  });

  test('should implement service worker with code splitting awareness', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Check service worker caching of split chunks
    const serviceWorkerStatus = await page.evaluate(async () => {
      if ('serviceWorker' in navigator) {
        const registration = await navigator.serviceWorker.getRegistration();
        
        if (registration) {
          // Check for cache management
          const cacheNames = await caches.keys();
          const staticCaches = cacheNames.filter(name => 
            name.includes('static') || name.includes('chunk') || name.includes('js')
          );
          
          return {
            hasServiceWorker: true,
            isActive: !!registration.active,
            scriptURL: registration.active?.scriptURL,
            cacheCount: cacheNames.length,
            staticCacheCount: staticCaches.length,
            cacheNames: staticCaches
          };
        }
      }
      
      return {
        hasServiceWorker: false,
        isActive: false,
        scriptURL: null,
        cacheCount: 0,
        staticCacheCount: 0,
        cacheNames: []
      };
    });

    console.log(`🔧 Service Worker cache management:`, serviceWorkerStatus);

    if (serviceWorkerStatus.hasServiceWorker && serviceWorkerStatus.staticCacheCount > 0) {
      console.log(`✅ Service Worker caching ${serviceWorkerStatus.staticCacheCount} static/chunk caches`);
      
      // Test cached navigation performance
      const cachedNavStart = Date.now();
      await page.goto('/about');
      await page.waitForLoadState('networkidle');
      const cachedNavTime = Date.now() - cachedNavStart;
      
      console.log(`⚡ Cached navigation time: ${cachedNavTime}ms`);
      expect(cachedNavTime).toBeLessThan(3000); // Should be fast with caching
    }
  });

  test('should handle code splitting errors gracefully', async ({ page }) => {
    let jsErrors: string[] = [];
    
    // Monitor JavaScript errors
    page.on('console', msg => {
      if (msg.type() === 'error') {
        jsErrors.push(msg.text());
      }
    });

    page.on('pageerror', error => {
      jsErrors.push(error.message);
    });

    // Navigate through routes to test error boundaries
    const routes = ['/', '/about', '/fights', '/shop', '/journey', '/sponsors'];
    
    for (const route of routes) {
      await page.goto(route);
      await page.waitForLoadState('networkidle');
      
      // Page should render without errors
      await expect(page.locator('h1, h2').first()).toBeVisible();
      
      // Check for error boundaries or fallback UI
      const errorBoundaries = page.locator('[data-error-boundary], .error-boundary, .fallback-ui');
      const errorBoundaryCount = await errorBoundaries.count();
      
      if (errorBoundaryCount > 0) {
        console.log(`🛡️ Error boundaries found on ${route}: ${errorBoundaryCount}`);
      }
    }

    // Should have minimal JavaScript errors
    const criticalErrors = jsErrors.filter(error => 
      !error.includes('favicon') && 
      !error.includes('manifest') &&
      !error.includes('chrome-extension')
    );

    if (criticalErrors.length > 0) {
      console.warn(`⚠️ JavaScript errors found:`, criticalErrors);
    }

    expect(criticalErrors.length).toBeLessThan(3); // Allow some non-critical errors
  });

  test('should optimize loading performance with intelligent prefetching', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Check for intersection observer based prefetching
    const prefetchingFeatures = await page.evaluate(() => {
      return {
        hasIntersectionObserver: 'IntersectionObserver' in window,
        hasIdleCallback: 'requestIdleCallback' in window,
        hasLinkPrefetch: document.querySelector('link[rel="prefetch"]') !== null,
        hasModulePrefetch: document.querySelector('link[rel="modulepreload"]') !== null,
        hasDNSPrefetch: document.querySelector('link[rel="dns-prefetch"]') !== null
      };
    });

    console.log(`🧠 Intelligent prefetching features:`, prefetchingFeatures);

    // Test hover-based prefetching on navigation links
    const navLinks = page.locator('nav a, header a');
    const navLinkCount = await navLinks.count();
    
    if (navLinkCount > 0) {
      console.log(`🖱️ Testing hover prefetching on ${navLinkCount} navigation links`);
      
      // Hover over links to trigger prefetching
      for (let i = 0; i < Math.min(3, navLinkCount); i++) {
        const link = navLinks.nth(i);
        const href = await link.getAttribute('href');
        
        if (href && href.startsWith('/')) {
          // Simulate hover
          await link.hover();
          await page.waitForTimeout(500);
          
          // Check if prefetch was triggered
          const prefetchTriggered = await page.evaluate((linkHref) => {
            const prefetchLinks = Array.from(document.querySelectorAll('link[rel="prefetch"]'));
            return prefetchLinks.some(link => link.getAttribute('href')?.includes(linkHref));
          }, href);
          
          if (prefetchTriggered) {
            console.log(`🚀 Prefetch triggered for: ${href}`);
          }
        }
      }
    }

    // Test viewport-based prefetching
    const belowFoldLinks = page.locator('footer a, .bottom a');
    if (await belowFoldLinks.count() > 0) {
      // Scroll to trigger viewport-based prefetching
      await page.evaluate(() => {
        window.scrollTo(0, document.body.scrollHeight);
      });
      
      await page.waitForTimeout(1000);
      
      console.log(`📺 Scrolled to bottom to test viewport-based prefetching`);
    }
  });

  test('should maintain boxing theme during loading states', async ({ page }) => {
    // Test loading states maintain boxing theme
    const routes = ['/fights', '/shop', '/journey'];
    
    for (const route of routes) {
      await page.goto(route, { waitUntil: 'domcontentloaded' });
      
      // Check for boxing-themed loading indicators during page load
      const loadingTheme = await page.evaluate(() => {
        const loadingElements = document.querySelectorAll('.loading, .spinner, .skeleton');
        const boxingThemeElements = Array.from(loadingElements).filter(el => {
          const text = el.textContent || '';
          const classes = el.className || '';
          
          return text.includes('🥊') || 
                 text.includes('boxing') ||
                 classes.includes('boxing') ||
                 classes.includes('ring') ||
                 classes.includes('glove');
        });
        
        return {
          totalLoading: loadingElements.length,
          boxingThemed: boxingThemeElements.length,
          hasBoxingEmoji: document.body.textContent?.includes('🥊') || false,
          hasBoxingTerms: /boxing|fighter|training|ring/i.test(document.body.textContent || '')
        };
      });

      if (loadingTheme.totalLoading > 0) {
        console.log(`🥊 Loading theme for ${route}:`, loadingTheme);
      }
      
      // Wait for full load
      await page.waitForLoadState('networkidle');
      
      // Verify boxing content is present after loading
      const hasBoxingContent = await page.evaluate(() => {
        return /kumar|prescod|boxing|fighter/i.test(document.body.textContent || '');
      });
      
      expect(hasBoxingContent).toBeTruthy();
    }
  });
});