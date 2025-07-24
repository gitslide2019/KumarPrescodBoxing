/**
 * Error Reporting and Monitoring Utility
 * Centralized error tracking and real user monitoring for production
 */

export interface ErrorReport {
  message: string;
  stack?: string;
  url: string;
  line?: number;
  column?: number;
  timestamp: Date;
  userAgent: string;
  userId?: string;
  sessionId: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  context?: Record<string, any>;
  componentStack?: string;
  errorBoundary?: boolean;
}

export interface PerformanceMetric {
  name: string;
  value: number;
  rating: 'good' | 'needs-improvement' | 'poor';
  timestamp: Date;
  url: string;
  deviceType: 'mobile' | 'desktop' | 'tablet';
  connectionType?: string;
  userId?: string;
  sessionId: string;
}

class ErrorReportingService {
  private apiEndpoint: string = '';
  private enabled: boolean = false;
  private sessionId: string;
  private userId?: string;
  private errorQueue: ErrorReport[] = [];
  private performanceQueue: PerformanceMetric[] = [];
  private readonly maxQueueSize = 50;

  constructor() {
    this.sessionId = this.generateSessionId();
    this.setupGlobalErrorHandlers();
    this.setupPerformanceObserver();
    
    // Enable in production or when explicitly configured
    this.enabled = process.env.NODE_ENV === 'production' || !!process.env.REACT_APP_ERROR_REPORTING_ENABLED;
    this.apiEndpoint = process.env.REACT_APP_ERROR_REPORTING_ENDPOINT || '/api/errors';
  }

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
  }

  private setupGlobalErrorHandlers(): void {
    // Unhandled JavaScript errors
    window.addEventListener('error', (event) => {
      this.reportError({
        message: event.message,
        stack: event.error?.stack,
        url: event.filename || window.location.href,
        line: event.lineno,
        column: event.colno,
        timestamp: new Date(),
        userAgent: navigator.userAgent,
        userId: this.userId,
        sessionId: this.sessionId,
        severity: 'high',
        context: {
          type: 'javascript_error',
          target: event.target?.toString()
        }
      });
    });

    // Unhandled Promise rejections
    window.addEventListener('unhandledrejection', (event) => {
      this.reportError({
        message: `Unhandled Promise Rejection: ${event.reason}`,
        stack: event.reason?.stack,
        url: window.location.href,
        timestamp: new Date(),
        userAgent: navigator.userAgent,
        userId: this.userId,
        sessionId: this.sessionId,
        severity: 'high',
        context: {
          type: 'unhandled_promise_rejection',
          reason: event.reason
        }
      });
    });

    // Resource loading errors
    window.addEventListener('error', (event) => {
      if (event.target !== window && (event.target as any)?.tagName) {
        const element = event.target as HTMLElement;
        this.reportError({
          message: `Resource loading error: ${element.tagName}`,
          url: window.location.href,
          timestamp: new Date(),
          userAgent: navigator.userAgent,
          userId: this.userId,
          sessionId: this.sessionId,
          severity: 'medium',
          context: {
            type: 'resource_error',
            tagName: element.tagName,
            src: (element as any).src || (element as any).href,
            outerHTML: element.outerHTML?.substring(0, 200)
          }
        });
      }
    }, true);
  }

  private setupPerformanceObserver(): void {
    // Core Web Vitals monitoring
    if ('PerformanceObserver' in window) {
      try {
        // Largest Contentful Paint (LCP)
        const lcpObserver = new PerformanceObserver((entryList) => {
          const entries = entryList.getEntries() as PerformanceEntry[];
          const lastEntry = entries[entries.length - 1];
          
          this.reportPerformanceMetric({
            name: 'LCP',
            value: lastEntry.startTime,
            rating: lastEntry.startTime <= 2500 ? 'good' : 
                   lastEntry.startTime <= 4000 ? 'needs-improvement' : 'poor',
            timestamp: new Date(),
            url: window.location.href,
            deviceType: this.getDeviceType(),
            connectionType: this.getConnectionType(),
            userId: this.userId,
            sessionId: this.sessionId
          });
        });
        lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });

        // First Input Delay (FID)
        const fidObserver = new PerformanceObserver((entryList) => {
          const entries = entryList.getEntries() as PerformanceEventTiming[];
          entries.forEach(entry => {
            const fid = entry.processingStart - entry.startTime;
            this.reportPerformanceMetric({
              name: 'FID',
              value: fid,
              rating: fid <= 100 ? 'good' : fid <= 300 ? 'needs-improvement' : 'poor',
              timestamp: new Date(),
              url: window.location.href,
              deviceType: this.getDeviceType(),
              connectionType: this.getConnectionType(),
              userId: this.userId,
              sessionId: this.sessionId
            });
          });
        });
        fidObserver.observe({ entryTypes: ['first-input'] });

        // Cumulative Layout Shift (CLS)
        let clsValue = 0;
        const clsObserver = new PerformanceObserver((entryList) => {
          const entries = entryList.getEntries() as LayoutShift[];
          entries.forEach(entry => {
            if (!entry.hadRecentInput) {
              clsValue += entry.value;
            }
          });
        });
        clsObserver.observe({ entryTypes: ['layout-shift'] });

        // Report CLS on page unload
        window.addEventListener('beforeunload', () => {
          this.reportPerformanceMetric({
            name: 'CLS',
            value: clsValue,
            rating: clsValue <= 0.1 ? 'good' : clsValue <= 0.25 ? 'needs-improvement' : 'poor',
            timestamp: new Date(),
            url: window.location.href,
            deviceType: this.getDeviceType(),
            connectionType: this.getConnectionType(),
            userId: this.userId,
            sessionId: this.sessionId
          });
        });

        // Navigation timing
        window.addEventListener('load', () => {
          setTimeout(() => {
            const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
            
            // Time to First Byte (TTFB)
            const ttfb = navigation.responseStart - navigation.fetchStart;
            this.reportPerformanceMetric({
              name: 'TTFB',
              value: ttfb,
              rating: ttfb <= 800 ? 'good' : ttfb <= 1800 ? 'needs-improvement' : 'poor',
              timestamp: new Date(),
              url: window.location.href,
              deviceType: this.getDeviceType(),
              connectionType: this.getConnectionType(),
              userId: this.userId,
              sessionId: this.sessionId
            });

            // DOM Content Loaded
            const domContentLoaded = navigation.domContentLoadedEventEnd - navigation.fetchStart;
            this.reportPerformanceMetric({
              name: 'DCL',
              value: domContentLoaded,
              rating: domContentLoaded <= 1600 ? 'good' : domContentLoaded <= 2400 ? 'needs-improvement' : 'poor',
              timestamp: new Date(),
              url: window.location.href,
              deviceType: this.getDeviceType(),
              connectionType: this.getConnectionType(),
              userId: this.userId,
              sessionId: this.sessionId
            });

            // Full page load
            const loadComplete = navigation.loadEventEnd - navigation.fetchStart;
            this.reportPerformanceMetric({
              name: 'Load',
              value: loadComplete,
              rating: loadComplete <= 2500 ? 'good' : loadComplete <= 4000 ? 'needs-improvement' : 'poor',
              timestamp: new Date(),
              url: window.location.href,
              deviceType: this.getDeviceType(),
              connectionType: this.getConnectionType(),
              userId: this.userId,
              sessionId: this.sessionId
            });
          }, 100);
        });

      } catch (error) {
        console.warn('Performance Observer not supported or failed to initialize:', error);
      }
    }
  }

  private getDeviceType(): 'mobile' | 'desktop' | 'tablet' {
    const userAgent = navigator.userAgent.toLowerCase();
    const width = window.innerWidth;
    
    if (/mobile|android|iphone|ipod|blackberry|iemobile|opera mini/i.test(userAgent)) {
      return 'mobile';
    } else if (/tablet|ipad/i.test(userAgent) || (width >= 768 && width <= 1024)) {
      return 'tablet';
    } else {
      return 'desktop';
    }
  }

  private getConnectionType(): string {
    const connection = (navigator as any).connection || (navigator as any).mozConnection || (navigator as any).webkitConnection;
    return connection?.effectiveType || 'unknown';
  }

  public setUserId(userId: string): void {
    this.userId = userId;
  }

  public reportError(error: Partial<ErrorReport>): void {
    const errorReport: ErrorReport = {
      message: error.message || 'Unknown error',
      stack: error.stack,
      url: error.url || window.location.href,
      line: error.line,
      column: error.column,
      timestamp: error.timestamp || new Date(),
      userAgent: error.userAgent || navigator.userAgent,
      userId: error.userId || this.userId,
      sessionId: error.sessionId || this.sessionId,
      severity: error.severity || 'medium',
      context: error.context,
      componentStack: error.componentStack,
      errorBoundary: error.errorBoundary
    };

    // Add to queue
    this.errorQueue.push(errorReport);
    
    // Limit queue size
    if (this.errorQueue.length > this.maxQueueSize) {
      this.errorQueue = this.errorQueue.slice(-this.maxQueueSize);
    }

    // Send immediately for critical errors
    if (errorReport.severity === 'critical') {
      this.sendErrors([errorReport]);
    } else {
      // Batch send other errors
      this.scheduleBatchSend();
    }

    // Also send to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('🥊 Boxing App Error:', errorReport);
    }
  }

  public reportPerformanceMetric(metric: PerformanceMetric): void {
    this.performanceQueue.push(metric);
    
    // Limit queue size
    if (this.performanceQueue.length > this.maxQueueSize) {
      this.performanceQueue = this.performanceQueue.slice(-this.maxQueueSize);
    }

    this.scheduleBatchSend();

    // Log in development
    if (process.env.NODE_ENV === 'development') {
      console.log(`🥊 Boxing App Performance - ${metric.name}: ${metric.value.toFixed(2)}ms (${metric.rating})`);
    }
  }

  private batchSendTimeout?: NodeJS.Timeout;

  private scheduleBatchSend(): void {
    if (this.batchSendTimeout) {
      clearTimeout(this.batchSendTimeout);
    }

    this.batchSendTimeout = setTimeout(() => {
      this.sendBatch();
    }, 5000); // Send every 5 seconds
  }

  private async sendBatch(): void {
    if (!this.enabled || (!this.errorQueue.length && !this.performanceQueue.length)) {
      return;
    }

    const errors = [...this.errorQueue];
    const metrics = [...this.performanceQueue];
    
    // Clear queues
    this.errorQueue = [];
    this.performanceQueue = [];

    try {
      await this.sendToEndpoint({
        errors,
        metrics,
        sessionId: this.sessionId,
        userId: this.userId,
        timestamp: new Date().toISOString(),
        url: window.location.href,
        userAgent: navigator.userAgent
      });
    } catch (error) {
      // Re-add to queue on failure (with limit)
      this.errorQueue = [...errors.slice(-10), ...this.errorQueue];
      this.performanceQueue = [...metrics.slice(-10), ...this.performanceQueue];
      
      console.warn('🥊 Failed to send error/performance data:', error);
    }
  }

  private async sendErrors(errors: ErrorReport[]): Promise<void> {
    try {
      await this.sendToEndpoint({
        errors,
        metrics: [],
        sessionId: this.sessionId,
        userId: this.userId,
        timestamp: new Date().toISOString(),
        url: window.location.href,
        userAgent: navigator.userAgent
      });
    } catch (error) {
      console.warn('🥊 Failed to send critical error:', error);
    }
  }

  private async sendToEndpoint(data: any): Promise<void> {
    if (!this.enabled) return;

    // In development or if no endpoint configured, just log
    if (!this.apiEndpoint || this.apiEndpoint === '/api/errors') {
      console.log('🥊 Boxing App Monitoring Data:', data);
      return;
    }

    const response = await fetch(this.apiEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
  }

  public getSessionInfo(): { sessionId: string; userId?: string } {
    return {
      sessionId: this.sessionId,
      userId: this.userId
    };
  }
}

// Create singleton instance
export const errorReporting = new ErrorReportingService();

// React Error Boundary integration
export const reportReactError = (error: Error, errorInfo: { componentStack: string }): void => {
  errorReporting.reportError({
    message: error.message,
    stack: error.stack,
    componentStack: errorInfo.componentStack,
    severity: 'high',
    errorBoundary: true,
    context: {
      type: 'react_error_boundary'
    }
  });
};

// Manual error reporting helper
export const reportCustomError = (
  message: string, 
  context?: Record<string, any>, 
  severity: 'low' | 'medium' | 'high' | 'critical' = 'medium'
): void => {
  errorReporting.reportError({
    message,
    context: {
      type: 'custom_error',
      ...context
    },
    severity
  });
};