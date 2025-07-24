import React, { useEffect, useState } from 'react';
import { errorReporting } from '../../utils/errorReporting';

interface RUMProps {
  enabled?: boolean;
  debug?: boolean;
}

interface UserSession {
  sessionId: string;
  startTime: Date;
  pageViews: number;
  interactions: number;
  errors: number;
  performanceIssues: number;
}

const RealUserMonitoring: React.FC<RUMProps> = ({ 
  enabled = process.env.NODE_ENV === 'production',
  debug = process.env.NODE_ENV === 'development'
}) => {
  const [session, setSession] = useState<UserSession | null>(null);
  const [isVisible, setIsVisible] = useState(!document.hidden);
  const [connectionStatus, setConnectionStatus] = useState(navigator.onLine);

  useEffect(() => {
    if (!enabled) return;

    // Initialize session
    const sessionInfo = errorReporting.getSessionInfo();
    const newSession: UserSession = {
      sessionId: sessionInfo.sessionId,
      startTime: new Date(),
      pageViews: 1,
      interactions: 0,
      errors: 0,
      performanceIssues: 0
    };
    setSession(newSession);

    // Track page visibility changes
    const handleVisibilityChange = () => {
      const nowVisible = !document.hidden;
      setIsVisible(nowVisible);
      
      if (nowVisible) {
        // Page became visible - track re-engagement
        trackCustomEvent('page_visible', {
          previousState: 'hidden',
          duration: performance.now()
        });
      } else {
        // Page became hidden - track disengagement
        trackCustomEvent('page_hidden', {
          previousState: 'visible',
          duration: performance.now()
        });
      }
    };

    // Track online/offline status
    const handleOnline = () => {
      setConnectionStatus(true);
      trackCustomEvent('connection_restored', {
        previousState: 'offline',
        timestamp: new Date()
      });
    };

    const handleOffline = () => {
      setConnectionStatus(false);
      trackCustomEvent('connection_lost', {
        previousState: 'online',
        timestamp: new Date()
      });
    };

    // Track user interactions
    const trackInteraction = (event: Event) => {
      if (session) {
        setSession(prev => prev ? { ...prev, interactions: prev.interactions + 1 } : null);
      }
      
      const target = event.target as HTMLElement;
      trackCustomEvent('user_interaction', {
        type: event.type,
        element: target.tagName,
        className: target.className,
        id: target.id,
        text: target.textContent?.substring(0, 50),
        timestamp: new Date()
      });
    };

    // Track rage clicks (multiple clicks in short succession)
    let clickCount = 0;
    let clickTimer: NodeJS.Timeout;
    
    const trackRageClicks = (event: MouseEvent) => {
      clickCount++;
      
      if (clickTimer) {
        clearTimeout(clickTimer);
      }
      
      clickTimer = setTimeout(() => {
        if (clickCount >= 3) {
          const target = event.target as HTMLElement;
          trackCustomEvent('rage_click', {
            clickCount,
            element: target.tagName,
            className: target.className,
            id: target.id,
            coordinates: { x: event.clientX, y: event.clientY },
            timestamp: new Date()
          });
        }
        clickCount = 0;
      }, 1000);
    };

    // Track scroll depth
    let maxScrollDepth = 0;
    const trackScrollDepth = () => {
      const scrollTop = window.pageYOffset;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = Math.round((scrollTop / docHeight) * 100);
      
      if (scrollPercent > maxScrollDepth) {
        maxScrollDepth = scrollPercent;
        
        // Track milestone scroll depths
        if ([25, 50, 75, 90, 100].includes(scrollPercent)) {
          trackCustomEvent('scroll_depth', {
            depth: scrollPercent,
            timestamp: new Date()
          });
        }
      }
    };

    // Track form interactions
    const trackFormEvents = (event: Event) => {
      const target = event.target as HTMLInputElement;
      const form = target.closest('form');
      
      trackCustomEvent('form_interaction', {
        type: event.type,
        formId: form?.id,
        fieldName: target.name,
        fieldType: target.type,
        fieldValue: target.type === 'password' ? '[REDACTED]' : target.value?.substring(0, 20),
        timestamp: new Date()
      });
    };

    // Track JavaScript errors in real-time
    const trackJSError = (event: ErrorEvent) => {
      if (session) {
        setSession(prev => prev ? { ...prev, errors: prev.errors + 1 } : null);
      }
    };

    // Track performance issues
    const trackPerformanceIssues = () => {
      // Monitor long tasks (> 50ms)
      if ('PerformanceObserver' in window) {
        try {
          const longTaskObserver = new PerformanceObserver((entryList) => {
            const entries = entryList.getEntries();
            entries.forEach(entry => {
              if (entry.duration > 50) {
                trackCustomEvent('long_task', {
                  duration: entry.duration,
                  startTime: entry.startTime,
                  timestamp: new Date()
                });
                
                if (session) {
                  setSession(prev => prev ? { ...prev, performanceIssues: prev.performanceIssues + 1 } : null);
                }
              }
            });
          });
          longTaskObserver.observe({ entryTypes: ['longtask'] });
        } catch (error) {
          console.warn('Long task observer not supported:', error);
        }
      }

      // Monitor memory usage (if available)
      if ('memory' in performance) {
        const memory = (performance as any).memory;
        trackCustomEvent('memory_usage', {
          usedJSHeapSize: memory.usedJSHeapSize,
          totalJSHeapSize: memory.totalJSHeapSize,
          jsHeapSizeLimit: memory.jsHeapSizeLimit,
          timestamp: new Date()
        });
      }
    };

    // Add event listeners
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    window.addEventListener('click', trackInteraction);
    window.addEventListener('click', trackRageClicks);
    window.addEventListener('scroll', trackScrollDepth, { passive: true });
    window.addEventListener('error', trackJSError);
    
    // Form event listeners
    document.addEventListener('input', trackFormEvents, true);
    document.addEventListener('focus', trackFormEvents, true);
    document.addEventListener('blur', trackFormEvents, true);

    // Track initial performance issues
    trackPerformanceIssues();

    // Track session duration on unload
    const handleBeforeUnload = () => {
      if (session) {
        const sessionDuration = Date.now() - session.startTime.getTime();
        trackCustomEvent('session_end', {
          duration: sessionDuration,
          pageViews: session.pageViews,
          interactions: session.interactions,
          errors: session.errors,
          performanceIssues: session.performanceIssues,
          finalScrollDepth: maxScrollDepth,
          timestamp: new Date()
        });
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    // Cleanup
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('click', trackInteraction);
      window.removeEventListener('click', trackRageClicks);
      window.removeEventListener('scroll', trackScrollDepth);
      window.removeEventListener('error', trackJSError);
      window.removeEventListener('beforeunload', handleBeforeUnload);
      
      document.removeEventListener('input', trackFormEvents, true);
      document.removeEventListener('focus', trackFormEvents, true);
      document.removeEventListener('blur', trackFormEvents, true);
      
      if (clickTimer) {
        clearTimeout(clickTimer);
      }
    };
  }, [enabled, session]);

  // Helper function to track custom events
  const trackCustomEvent = (eventName: string, properties: Record<string, any>) => {
    // Send to error reporting service
    errorReporting.reportPerformanceMetric({
      name: `custom_${eventName}`,
      value: properties.duration || 0,
      rating: 'good', // Custom events don't have ratings
      timestamp: new Date(),
      url: window.location.href,
      deviceType: getDeviceType(),
      connectionType: getConnectionType(),
      sessionId: session?.sessionId || 'unknown',
      userId: errorReporting.getSessionInfo().userId
    });

    // Send to Google Analytics if available
    if (window.gtag) {
      window.gtag('event', eventName, {
        event_category: 'user_behavior',
        ...properties
      });
    }

    // Debug logging
    if (debug) {
      console.log(`🥊 RUM Event - ${eventName}:`, properties);
    }
  };

  const getDeviceType = (): 'mobile' | 'desktop' | 'tablet' => {
    const userAgent = navigator.userAgent.toLowerCase();
    const width = window.innerWidth;
    
    if (/mobile|android|iphone|ipod|blackberry|iemobile|opera mini/i.test(userAgent)) {
      return 'mobile';
    } else if (/tablet|ipad/i.test(userAgent) || (width >= 768 && width <= 1024)) {
      return 'tablet';
    } else {
      return 'desktop';
    }
  };

  const getConnectionType = (): string => {
    const connection = (navigator as any).connection || (navigator as any).mozConnection || (navigator as any).webkitConnection;
    return connection?.effectiveType || 'unknown';
  };

  // Debug panel for development
  if (debug && session) {
    return (
      <div className="fixed bottom-20 right-6 z-40 bg-black/90 text-white p-4 rounded-lg text-xs font-mono max-w-xs">
        <div className="text-yellow-400 font-bold mb-2">🥊 RUM Debug</div>
        <div>Session: {session.sessionId.split('_')[1]}</div>
        <div>Duration: {Math.round((Date.now() - session.startTime.getTime()) / 1000)}s</div>
        <div>Page Views: {session.pageViews}</div>
        <div>Interactions: {session.interactions}</div>
        <div>Errors: {session.errors}</div>
        <div>Perf Issues: {session.performanceIssues}</div>
        <div>Visible: {isVisible ? '✅' : '❌'}</div>
        <div>Online: {connectionStatus ? '🌐' : '📴'}</div>
        <div>Device: {getDeviceType()}</div>
        <div>Connection: {getConnectionType()}</div>
      </div>
    );
  }

  return null;
};

export default RealUserMonitoring;