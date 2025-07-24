import React, { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAnalytics } from '../../contexts/AnalyticsContext';

interface WebVital {
  name: string;
  value: number;
  delta: number;
  entries: PerformanceEntry[];
  id: string;
  navigationType: string;
}

interface VitalMetrics {
  lcp?: WebVital;
  fid?: WebVital;
  cls?: WebVital;
  fcp?: WebVital;
  inp?: WebVital;
  ttfb?: WebVital;
}

interface WebVitalsReporterProps {
  reportToAnalytics?: boolean;
  showDebugPanel?: boolean;
  onVitalChange?: (vital: WebVital) => void;
  thresholds?: {
    lcp: { good: number; needsImprovement: number };
    fid: { good: number; needsImprovement: number };
    cls: { good: number; needsImprovement: number };
    fcp: { good: number; needsImprovement: number };
    inp: { good: number; needsImprovement: number };
    ttfb: { good: number; needsImprovement: number };
  };
}

// Default Core Web Vitals thresholds (as per Google)
const DEFAULT_THRESHOLDS = {
  lcp: { good: 2500, needsImprovement: 4000 }, // Largest Contentful Paint
  fid: { good: 100, needsImprovement: 300 },   // First Input Delay
  cls: { good: 0.1, needsImprovement: 0.25 },  // Cumulative Layout Shift
  fcp: { good: 1800, needsImprovement: 3000 }, // First Contentful Paint
  inp: { good: 200, needsImprovement: 500 },   // Interaction to Next Paint
  ttfb: { good: 800, needsImprovement: 1800 }  // Time to First Byte
};

// Performance observer for Core Web Vitals
const observeVitals = (callback: (vital: WebVital) => void) => {
  if (typeof window === 'undefined' || !('PerformanceObserver' in window)) {
    return [];
  }

  const observers: PerformanceObserver[] = [];

  // Largest Contentful Paint (LCP)
  try {
    const lcpObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const lastEntry = entries[entries.length - 1];
      
      if (lastEntry) {
        callback({
          name: 'LCP',
          value: lastEntry.startTime,
          delta: lastEntry.startTime,
          entries: [lastEntry],
          id: 'lcp',
          navigationType: getNavigationType()
        });
      }
    });
    
    lcpObserver.observe({ type: 'largest-contentful-paint', buffered: true });
    observers.push(lcpObserver);
  } catch (e) {
    console.warn('LCP observer not supported');
  }

  // First Input Delay (FID)
  try {
    const fidObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      entries.forEach((entry: any) => {
        callback({
          name: 'FID',
          value: entry.processingStart - entry.startTime,
          delta: entry.processingStart - entry.startTime,
          entries: [entry],
          id: 'fid',
          navigationType: getNavigationType()
        });
      });
    });
    
    fidObserver.observe({ type: 'first-input', buffered: true });
    observers.push(fidObserver);
  } catch (e) {
    console.warn('FID observer not supported');
  }

  // Cumulative Layout Shift (CLS)
  try {
    let clsValue = 0;
    const clsEntries: PerformanceEntry[] = [];
    
    const clsObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      entries.forEach((entry: any) => {
        if (!entry.hadRecentInput) {
          clsValue += entry.value;
          clsEntries.push(entry);
          
          callback({
            name: 'CLS',
            value: clsValue,
            delta: entry.value,
            entries: clsEntries,
            id: 'cls',
            navigationType: getNavigationType()
          });
        }
      });
    });
    
    clsObserver.observe({ type: 'layout-shift', buffered: true });
    observers.push(clsObserver);
  } catch (e) {
    console.warn('CLS observer not supported');
  }

  // First Contentful Paint (FCP)
  try {
    const fcpObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      entries.forEach((entry) => {
        if (entry.name === 'first-contentful-paint') {
          callback({
            name: 'FCP',
            value: entry.startTime,
            delta: entry.startTime,
            entries: [entry],
            id: 'fcp',
            navigationType: getNavigationType()
          });
        }
      });
    });
    
    fcpObserver.observe({ type: 'paint', buffered: true });
    observers.push(fcpObserver);
  } catch (e) {
    console.warn('FCP observer not supported');
  }

  // Interaction to Next Paint (INP) - newer metric
  try {
    const inpObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      entries.forEach((entry: any) => {
        callback({
          name: 'INP',
          value: entry.processingEnd - entry.startTime,
          delta: entry.processingEnd - entry.startTime,
          entries: [entry],
          id: 'inp',
          navigationType: getNavigationType()
        });
      });
    });
    
    inpObserver.observe({ type: 'event', buffered: true });
    observers.push(inpObserver);
  } catch (e) {
    console.warn('INP observer not supported');
  }

  // Time to First Byte (TTFB)
  try {
    const navigationEntries = performance.getEntriesByType('navigation');
    if (navigationEntries.length > 0) {
      const navEntry = navigationEntries[0] as PerformanceNavigationTiming;
      const ttfb = navEntry.responseStart - navEntry.requestStart;
      
      callback({
        name: 'TTFB',
        value: ttfb,
        delta: ttfb,
        entries: [navEntry],
        id: 'ttfb',
        navigationType: getNavigationType()
      });
    }
  } catch (e) {
    console.warn('TTFB measurement not supported');
  }

  return observers;
};

// Get navigation type for context
const getNavigationType = (): string => {
  if (typeof window === 'undefined') return 'unknown';
  
  const navEntry = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
  return navEntry?.type || 'navigate';
};

// Determine performance rating
const getVitalRating = (name: string, value: number, thresholds: any): 'good' | 'needs-improvement' | 'poor' => {
  const threshold = thresholds[name.toLowerCase()];
  if (!threshold) return 'good';
  
  if (value <= threshold.good) return 'good';
  if (value <= threshold.needsImprovement) return 'needs-improvement';
  return 'poor';
};

// Format value for display
const formatVitalValue = (name: string, value: number): string => {
  if (name === 'CLS') {
    return value.toFixed(3);
  }
  return Math.round(value).toString() + 'ms';
};

const WebVitalsReporter: React.FC<WebVitalsReporterProps> = ({
  reportToAnalytics = true,
  showDebugPanel = false,
  onVitalChange,
  thresholds = DEFAULT_THRESHOLDS
}) => {
  const [vitals, setVitals] = useState<VitalMetrics>({});
  const [isVisible, setIsVisible] = useState(showDebugPanel);
  const { trackEvent } = useAnalytics();

  const handleVitalUpdate = useCallback((vital: WebVital) => {
    setVitals(prev => ({
      ...prev,
      [vital.id]: vital
    }));

    // Report to analytics
    if (reportToAnalytics) {
      const rating = getVitalRating(vital.name, vital.value, thresholds);
      
      trackEvent('Web Vitals', vital.name, rating, Math.round(vital.value));
      
      // Additional boxing-specific performance tracking
      if (vital.name === 'LCP') {
        trackEvent('Boxing Performance', 'Hero Load Time', rating, Math.round(vital.value));
      } else if (vital.name === 'FID') {
        trackEvent('Boxing Performance', 'Interactive Response', rating, Math.round(vital.value));
      } else if (vital.name === 'CLS') {
        trackEvent('Boxing Performance', 'Layout Stability', rating, Math.round(vital.value * 1000));
      }
    }

    // Custom callback
    onVitalChange?.(vital);
  }, [reportToAnalytics, trackEvent, thresholds, onVitalChange]);

  useEffect(() => {
    const observers = observeVitals(handleVitalUpdate);
    
    return () => {
      observers.forEach(observer => observer.disconnect());
    };
  }, [handleVitalUpdate]);

  // Keyboard shortcut to toggle debug panel
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.ctrlKey && event.shiftKey && event.key === 'P') {
        setIsVisible(prev => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  if (!isVisible && !showDebugPanel) {
    return null;
  }

  const vitalsList = Object.entries(vitals).map(([key, vital]) => ({
    ...vital,
    rating: getVitalRating(vital.name, vital.value, thresholds)
  }));

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className="fixed bottom-4 right-4 z-50 max-w-sm"
        >
          <div className="bg-slate-900/95 backdrop-blur-sm rounded-xl border border-slate-700/50 shadow-2xl">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-slate-700/50">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                <h3 className="font-semibold text-white text-sm">Core Web Vitals</h3>
              </div>
              <button
                onClick={() => setIsVisible(false)}
                className="text-slate-400 hover:text-white transition-colors"
                aria-label="Close performance panel"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Vitals List */}
            <div className="p-4 space-y-3">
              {vitalsList.length === 0 ? (
                <div className="text-slate-400 text-sm text-center py-4">
                  Collecting performance metrics...
                </div>
              ) : (
                vitalsList.map((vital) => (
                  <motion.div
                    key={vital.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center space-x-3">
                      <div
                        className={`w-2 h-2 rounded-full ${
                          vital.rating === 'good'
                            ? 'bg-green-400'
                            : vital.rating === 'needs-improvement'
                            ? 'bg-yellow-400'
                            : 'bg-red-400'
                        }`}
                      />
                      <span className="text-slate-300 text-sm font-medium">
                        {vital.name}
                      </span>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <span className={`text-sm font-semibold ${
                        vital.rating === 'good'
                          ? 'text-green-400'
                          : vital.rating === 'needs-improvement'
                          ? 'text-yellow-400'
                          : 'text-red-400'
                      }`}>
                        {formatVitalValue(vital.name, vital.value)}
                      </span>
                      
                      <div className={`px-1.5 py-0.5 rounded text-xs font-medium ${
                        vital.rating === 'good'
                          ? 'bg-green-900/30 text-green-400'
                          : vital.rating === 'needs-improvement'
                          ? 'bg-yellow-900/30 text-yellow-400'
                          : 'bg-red-900/30 text-red-400'
                      }`}>
                        {vital.rating === 'good' ? '✓' : vital.rating === 'needs-improvement' ? '!' : '✗'}
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </div>

            {/* Footer */}
            <div className="px-4 py-3 border-t border-slate-700/50 bg-slate-800/50 rounded-b-xl">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>Boxing Performance Monitor</span>
                <span>Ctrl+Shift+P to toggle</span>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default WebVitalsReporter;

// Hook for consuming web vitals data
export const useWebVitals = (callback?: (vital: WebVital) => void) => {
  const [vitals, setVitals] = useState<VitalMetrics>({});

  useEffect(() => {
    const handleVitalUpdate = (vital: WebVital) => {
      setVitals(prev => ({
        ...prev,
        [vital.id]: vital
      }));
      callback?.(vital);
    };

    const observers = observeVitals(handleVitalUpdate);
    
    return () => {
      observers.forEach(observer => observer.disconnect());
    };
  }, [callback]);

  return vitals;
};

// Performance budget checker
export const checkPerformanceBudget = (vitals: VitalMetrics, budgets = DEFAULT_THRESHOLDS) => {
  const results = {
    passing: 0,
    failing: 0,
    details: {} as Record<string, { value: number; budget: number; passing: boolean }>
  };

  Object.entries(vitals).forEach(([key, vital]) => {
    if (vital) {
      const budget = budgets[key as keyof typeof budgets];
      if (budget) {
        const passing = vital.value <= budget.good;
        results.details[key] = {
          value: vital.value,
          budget: budget.good,
          passing
        };
        
        if (passing) {
          results.passing++;
        } else {
          results.failing++;
        }
      }
    }
  });

  return results;
};