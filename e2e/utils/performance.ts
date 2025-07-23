import { Page } from '@playwright/test';

/**
 * Performance monitoring utilities for Kumar Prescod Boxing website
 * Focuses on boxing-specific performance metrics and Core Web Vitals
 */

export interface PerformanceMetrics {
  coreWebVitals: {
    LCP?: number; // Largest Contentful Paint
    FID?: number; // First Input Delay
    CLS?: number; // Cumulative Layout Shift
    FCP?: number; // First Contentful Paint
    TTFB?: number; // Time to First Byte
  };
  boxingSpecific: {
    fightRecordLoadTime?: number;
    trainingMediaLoadTime?: number;
    fightVideosLoadTime?: number;
    heroSectionLoadTime?: number;
    ticketPurchaseFlowTime?: number;
  };
  networkMetrics: {
    totalRequests?: number;
    totalTransferSize?: number;
    imageOptimization?: {
      totalImages: number;
      webpImages: number;
      lazyLoadedImages: number;
    };
  };
  mobileMetrics: {
    responsiveBreakTime?: number;
    touchInteractionDelay?: number;
    viewportAdaptationTime?: number;
  };
}

export class PerformanceUtils {
  /**
   * Start performance monitoring for a page
   */
  async startMonitoring(page: Page): Promise<any> {
    // Enable performance monitoring
    await page.addInitScript(() => {
      // Track Core Web Vitals
      window.performanceMetrics = {
        startTime: performance.now(),
        coreWebVitals: {},
        boxingSpecific: {},
        networkMetrics: { requests: 0, transferSize: 0 },
        resourceTimings: []
      };

      // Monitor Largest Contentful Paint
      new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];
        window.performanceMetrics.coreWebVitals.LCP = lastEntry.startTime;
      }).observe({ entryTypes: ['largest-contentful-paint'] });

      // Monitor First Input Delay
      new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry) => {
          window.performanceMetrics.coreWebVitals.FID = entry.processingStart - entry.startTime;
        });
      }).observe({ entryTypes: ['first-input'] });

      // Monitor Cumulative Layout Shift
      let clsValue = 0;
      new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry) => {
          if (!entry.hadRecentInput) {
            clsValue += entry.value;
          }
        });
        window.performanceMetrics.coreWebVitals.CLS = clsValue;
      }).observe({ entryTypes: ['layout-shift'] });

      // Monitor First Contentful Paint
      new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry) => {
          if (entry.name === 'first-contentful-paint') {
            window.performanceMetrics.coreWebVitals.FCP = entry.startTime;
          }
        });
      }).observe({ entryTypes: ['paint'] });

      // Monitor resource loading
      new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry) => {
          window.performanceMetrics.resourceTimings.push({
            name: entry.name,
            duration: entry.duration,
            transferSize: entry.transferSize || 0,
            type: entry.initiatorType
          });
          
          window.performanceMetrics.networkMetrics.requests++;
          window.performanceMetrics.networkMetrics.transferSize += entry.transferSize || 0;
        });
      }).observe({ entryTypes: ['resource'] });

      // Monitor boxing-specific content loading
      const trackBoxingContent = () => {
        // Track fight record loading
        const fightRecord = document.querySelector('[data-testid*="fight"], .fight-record, [class*="record"]');
        if (fightRecord && !window.performanceMetrics.boxingSpecific.fightRecordLoadTime) {
          window.performanceMetrics.boxingSpecific.fightRecordLoadTime = performance.now() - window.performanceMetrics.startTime;
        }

        // Track training media loading
        const trainingMedia = document.querySelector('img[src*="training"], video[src*="training"]');
        if (trainingMedia && !window.performanceMetrics.boxingSpecific.trainingMediaLoadTime) {
          window.performanceMetrics.boxingSpecific.trainingMediaLoadTime = performance.now() - window.performanceMetrics.startTime;
        }

        // Track hero section loading
        const heroSection = document.querySelector('[class*="hero"], .hero-section');
        if (heroSection && !window.performanceMetrics.boxingSpecific.heroSectionLoadTime) {
          window.performanceMetrics.boxingSpecific.heroSectionLoadTime = performance.now() - window.performanceMetrics.startTime;
        }
      };

      // Check for boxing content periodically
      const checkInterval = setInterval(trackBoxingContent, 100);
      setTimeout(() => clearInterval(checkInterval), 10000); // Stop after 10 seconds
    });

    // Monitor network activity
    const responses: any[] = [];
    page.on('response', (response) => {
      responses.push({
        url: response.url(),
        status: response.status(),
        contentType: response.headers()['content-type'],
        timing: response.timing()
      });
    });

    return { responses, startTime: Date.now() };
  }

  /**
   * Capture comprehensive performance metrics
   */
  async captureMetrics(page: Page, monitoringData: any): Promise<PerformanceMetrics> {
    // Get client-side performance metrics
    const clientMetrics = await page.evaluate(() => {
      return window.performanceMetrics || {};
    });

    // Analyze network responses
    const imageRequests = monitoringData.responses.filter((r: any) => 
      r.contentType?.includes('image/')
    );
    
    const videoRequests = monitoringData.responses.filter((r: any) => 
      r.contentType?.includes('video/')
    );

    // Calculate boxing-specific metrics
    const boxingSpecificMetrics = await this.calculateBoxingMetrics(page);

    // Calculate mobile-specific metrics
    const mobileMetrics = await this.calculateMobileMetrics(page);

    const metrics: PerformanceMetrics = {
      coreWebVitals: {
        LCP: clientMetrics.coreWebVitals?.LCP,
        FID: clientMetrics.coreWebVitals?.FID,
        CLS: clientMetrics.coreWebVitals?.CLS,
        FCP: clientMetrics.coreWebVitals?.FCP,
        TTFB: this.calculateTTFB(monitoringData.responses)
      },
      boxingSpecific: {
        ...clientMetrics.boxingSpecific,
        ...boxingSpecificMetrics
      },
      networkMetrics: {
        totalRequests: monitoringData.responses.length,
        totalTransferSize: this.calculateTotalTransferSize(monitoringData.responses),
        imageOptimization: {
          totalImages: imageRequests.length,
          webpImages: imageRequests.filter((r: any) => r.url.includes('.webp')).length,
          lazyLoadedImages: await this.countLazyLoadedImages(page)
        }
      },
      mobileMetrics
    };

    return metrics;
  }

  /**
   * Calculate boxing-specific performance metrics
   */
  private async calculateBoxingMetrics(page: Page) {
    const startTime = Date.now();
    
    // Measure fight video loading performance
    const fightVideos = page.locator('video[src*="fight"], iframe[src*="youtube"]');
    let fightVideosLoadTime = null;
    
    if (await fightVideos.count() > 0) {
      const videoStartTime = Date.now();
      try {
        await fightVideos.first().waitFor({ state: 'visible', timeout: 5000 });
        fightVideosLoadTime = Date.now() - videoStartTime;
      } catch (error) {
        fightVideosLoadTime = 5000; // Timeout value
      }
    }

    // Measure ticket purchase flow performance
    const ticketButton = page.locator('a[href*="ticket"], button:has-text("ticket")');
    let ticketPurchaseFlowTime = null;
    
    if (await ticketButton.count() > 0) {
      const ticketStartTime = Date.now();
      try {
        await ticketButton.first().waitFor({ state: 'visible', timeout: 3000 });
        ticketPurchaseFlowTime = Date.now() - ticketStartTime;
      } catch (error) {
        ticketPurchaseFlowTime = 3000;
      }
    }

    return {
      fightVideosLoadTime,
      ticketPurchaseFlowTime
    };
  }

  /**
   * Calculate mobile-specific performance metrics
   */
  private async calculateMobileMetrics(page: Page) {
    const viewport = page.viewportSize();
    const isMobile = viewport && viewport.width < 768;
    
    if (!isMobile) {
      return {};
    }

    // Measure responsive design adaptation time
    const startTime = Date.now();
    
    // Check how quickly mobile navigation appears
    const mobileNav = page.locator('[data-testid="mobile-nav"], .mobile-menu, .hamburger');
    let viewportAdaptationTime = null;
    
    if (await mobileNav.count() > 0) {
      try {
        await mobileNav.first().waitFor({ state: 'visible', timeout: 2000 });
        viewportAdaptationTime = Date.now() - startTime;
      } catch (error) {
        viewportAdaptationTime = 2000;
      }
    }

    // Measure touch interaction responsiveness
    const interactiveElements = page.locator('button, a[href], [role="button"]');
    let touchInteractionDelay = null;
    
    if (await interactiveElements.count() > 0) {
      const touchStartTime = Date.now();
      try {
        await interactiveElements.first().tap({ timeout: 1000 });
        touchInteractionDelay = Date.now() - touchStartTime;
      } catch (error) {
        touchInteractionDelay = 1000;
      }
    }

    return {
      viewportAdaptationTime,
      touchInteractionDelay,
      responsiveBreakTime: viewportAdaptationTime
    };
  }

  /**
   * Calculate Time to First Byte from network responses
   */
  private calculateTTFB(responses: any[]): number | undefined {
    const htmlResponse = responses.find(r => 
      r.contentType?.includes('text/html') && r.url.includes(new URL(responses[0]?.url || '').origin)
    );
    
    return htmlResponse?.timing?.receiveHeadersEnd;
  }

  /**
   * Calculate total transfer size from responses
   */
  private calculateTotalTransferSize(responses: any[]): number {
    return responses.reduce((total, response) => {
      return total + (response.timing?.transferSize || 0);
    }, 0);
  }

  /**
   * Count lazy-loaded images on the page
   */
  private async countLazyLoadedImages(page: Page): Promise<number> {
    return await page.locator('img[loading="lazy"]').count();
  }

  /**
   * Simulate network conditions for boxing event traffic
   */
  async simulateSlowNetwork(page: Page, networkType: '3G' | '2G' | 'offline' = '3G') {
    const networkConditions = {
      '2G': { downloadThroughput: 250 * 1024, uploadThroughput: 50 * 1024, latency: 300 },
      '3G': { downloadThroughput: 1.5 * 1024 * 1024, uploadThroughput: 750 * 1024, latency: 150 },
      'offline': { downloadThroughput: 0, uploadThroughput: 0, latency: 0 }
    };

    const condition = networkConditions[networkType];
    
    await page.context().route('**/*', async (route) => {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, condition.latency));
      
      if (networkType === 'offline') {
        await route.abort();
      } else {
        await route.continue();
      }
    });
  }

  /**
   * Monitor Core Web Vitals continuously
   */
  async monitorCoreWebVitals(page: Page, duration: number = 30000): Promise<any> {
    const vitals: any = {};
    
    await page.addInitScript(() => {
      const vitalsData: any = {};
      
      // LCP Observer
      new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];
        vitalsData.LCP = lastEntry.startTime;
      }).observe({ entryTypes: ['largest-contentful-paint'] });

      // FID Observer
      new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry) => {
          vitalsData.FID = entry.processingStart - entry.startTime;
        });
      }).observe({ entryTypes: ['first-input'] });

      // CLS Observer
      let clsValue = 0;
      new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry) => {
          if (!entry.hadRecentInput) {
            clsValue += entry.value;
          }
        });
        vitalsData.CLS = clsValue;
      }).observe({ entryTypes: ['layout-shift'] });

      // Make vitals available globally
      (window as any).vitalsData = vitalsData;
    });

    // Wait for specified duration
    await page.waitForTimeout(duration);

    // Collect final vitals
    const finalVitals = await page.evaluate(() => (window as any).vitalsData || {});
    
    return finalVitals;
  }

  /**
   * Generate performance report for boxing website
   */
  generatePerformanceReport(metrics: PerformanceMetrics): any {
    const report = {
      overall: this.calculateOverallScore(metrics),
      coreWebVitals: this.evaluateCoreWebVitals(metrics.coreWebVitals),
      boxingSpecific: this.evaluateBoxingPerformance(metrics.boxingSpecific),
      recommendations: this.generateRecommendations(metrics),
      boxingFanExperience: this.evaluateBoxingFanExperience(metrics)
    };

    return report;
  }

  private calculateOverallScore(metrics: PerformanceMetrics): number {
    let score = 100;
    
    // Deduct points for poor Core Web Vitals
    if (metrics.coreWebVitals.LCP && metrics.coreWebVitals.LCP > 2500) score -= 20;
    if (metrics.coreWebVitals.FID && metrics.coreWebVitals.FID > 100) score -= 15;
    if (metrics.coreWebVitals.CLS && metrics.coreWebVitals.CLS > 0.1) score -= 15;
    
    // Deduct points for slow boxing content
    if (metrics.boxingSpecific.fightRecordLoadTime && metrics.boxingSpecific.fightRecordLoadTime > 3000) score -= 10;
    if (metrics.boxingSpecific.trainingMediaLoadTime && metrics.boxingSpecific.trainingMediaLoadTime > 5000) score -= 10;
    
    return Math.max(0, score);
  }

  private evaluateCoreWebVitals(vitals: PerformanceMetrics['coreWebVitals']) {
    return {
      LCP: { value: vitals.LCP, status: this.getLCPStatus(vitals.LCP) },
      FID: { value: vitals.FID, status: this.getFIDStatus(vitals.FID) },
      CLS: { value: vitals.CLS, status: this.getCLSStatus(vitals.CLS) }
    };
  }

  private evaluateBoxingPerformance(boxingMetrics: PerformanceMetrics['boxingSpecific']) {
    return {
      fightContent: boxingMetrics.fightRecordLoadTime ? 
        (boxingMetrics.fightRecordLoadTime < 3000 ? 'excellent' : 'needs_improvement') : 'not_measured',
      trainingMedia: boxingMetrics.trainingMediaLoadTime ?
        (boxingMetrics.trainingMediaLoadTime < 5000 ? 'excellent' : 'needs_improvement') : 'not_measured',
      videoStreaming: boxingMetrics.fightVideosLoadTime ?
        (boxingMetrics.fightVideosLoadTime < 8000 ? 'excellent' : 'needs_improvement') : 'not_measured'
    };
  }

  private evaluateBoxingFanExperience(metrics: PerformanceMetrics) {
    return {
      mobileOptimization: metrics.mobileMetrics.responsiveBreakTime ?
        (metrics.mobileMetrics.responsiveBreakTime < 1000 ? 'excellent' : 'needs_improvement') : 'not_measured',
      contentAccessibility: 'needs_manual_testing',
      fightNightReadiness: this.assessFightNightReadiness(metrics)
    };
  }

  private assessFightNightReadiness(metrics: PerformanceMetrics) {
    // Assess if site can handle fight night traffic
    const readinessScore = 100;
    
    // Factors that affect fight night performance
    const factors = {
      imageOptimization: metrics.networkMetrics?.imageOptimization?.webpImages || 0,
      lazyLoading: metrics.networkMetrics?.imageOptimization?.lazyLoadedImages || 0,
      videoPerformance: metrics.boxingSpecific.fightVideosLoadTime || 0,
      mobileReadiness: metrics.mobileMetrics.touchInteractionDelay || 0
    };
    
    return {
      score: readinessScore,
      factors,
      recommendation: readinessScore > 80 ? 'ready' : 'needs_optimization'
    };
  }

  private generateRecommendations(metrics: PerformanceMetrics): string[] {
    const recommendations = [];
    
    if (metrics.coreWebVitals.LCP && metrics.coreWebVitals.LCP > 2500) {
      recommendations.push('Optimize boxing hero images and videos for faster LCP');
    }
    
    if (metrics.boxingSpecific.trainingMediaLoadTime && metrics.boxingSpecific.trainingMediaLoadTime > 5000) {
      recommendations.push('Implement progressive loading for training media gallery');
    }
    
    if (metrics.networkMetrics?.imageOptimization?.webpImages === 0) {
      recommendations.push('Convert boxing images to WebP format for better compression');
    }
    
    if (metrics.mobileMetrics?.touchInteractionDelay && metrics.mobileMetrics.touchInteractionDelay > 300) {
      recommendations.push('Optimize touch interactions for mobile boxing fans');
    }
    
    return recommendations;
  }

  private getLCPStatus(lcp?: number): string {
    if (!lcp) return 'not_measured';
    if (lcp <= 2500) return 'good';
    if (lcp <= 4000) return 'needs_improvement';
    return 'poor';
  }

  private getFIDStatus(fid?: number): string {
    if (!fid) return 'not_measured';
    if (fid <= 100) return 'good';
    if (fid <= 300) return 'needs_improvement';
    return 'poor';
  }

  private getCLSStatus(cls?: number): string {
    if (!cls) return 'not_measured';
    if (cls <= 0.1) return 'good';
    if (cls <= 0.25) return 'needs_improvement';
    return 'poor';
  }
}

// Export singleton instance
export const performanceUtils = new PerformanceUtils();