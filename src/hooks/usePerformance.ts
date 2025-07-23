import { useEffect, useRef, useState, useCallback } from 'react';

// Hook for lazy loading images
export const useLazyLoad = (options: IntersectionObserverInit = {}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          setIsLoaded(true);
          observer.unobserve(element);
        }
      },
      {
        threshold: 0.1,
        rootMargin: '50px',
        ...options
      }
    );

    observer.observe(element);

    return () => {
      observer.unobserve(element);
    };
  }, [options]);

  return { ref, isLoaded, isInView };
};

// Hook for infinite scroll
export const useInfiniteScroll = (
  loadMore: () => void,
  hasMore: boolean,
  threshold: number = 0.8
) => {
  const [isFetching, setIsFetching] = useState(false);
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element || !hasMore) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isFetching) {
          setIsFetching(true);
          loadMore();
        }
      },
      { threshold }
    );

    observer.observe(element);

    return () => {
      observer.unobserve(element);
    };
  }, [loadMore, hasMore, threshold, isFetching]);

  useEffect(() => {
    if (isFetching) {
      const timer = setTimeout(() => {
        setIsFetching(false);
      }, 1000); // Prevent rapid firing
      return () => clearTimeout(timer);
    }
  }, [isFetching]);

  return { ref, isFetching };
};

// Hook for debounced values
export const useDebounce = <T>(value: T, delay: number): T => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

// Hook for throttled functions
export const useThrottle = <T extends (...args: any[]) => any>(
  func: T,
  delay: number
): T => {
  const [throttledFunc, setThrottledFunc] = useState<T>();
  const lastRan = useRef<number>();

  useEffect(() => {
    const handler = (...args: Parameters<T>) => {
      if (!lastRan.current) {
        func(...args);
        lastRan.current = Date.now();
      } else {
        clearTimeout(lastRan.current);
        setTimeout(() => {
          if (Date.now() - lastRan.current! >= delay) {
            func(...args);
            lastRan.current = Date.now();
          }
        }, delay - (Date.now() - lastRan.current));
      }
    };

    setThrottledFunc(() => handler as T);
  }, [func, delay]);

  return throttledFunc || func;
};

// Hook for prefetching resources
export const usePrefetch = (urls: string[]) => {
  const [prefetched, setPrefetched] = useState<Set<string>>(new Set());

  const prefetchResource = useCallback((url: string, type: 'image' | 'script' | 'style' = 'image') => {
    if (prefetched.has(url)) return;

    const link = document.createElement('link');
    link.rel = 'prefetch';
    link.href = url;
    
    if (type === 'image') {
      link.as = 'image';
    } else if (type === 'script') {
      link.as = 'script';
    } else if (type === 'style') {
      link.as = 'style';
    }

    document.head.appendChild(link);
    setPrefetched(prev => new Set(prev).add(url));
  }, [prefetched]);

  useEffect(() => {
    urls.forEach(url => prefetchResource(url));
  }, [urls, prefetchResource]);

  return { prefetchResource };
};

// Hook for viewport dimensions
export const useViewport = () => {
  const [viewport, setViewport] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 0,
    height: typeof window !== 'undefined' ? window.innerHeight : 0
  });

  useEffect(() => {
    const handleResize = () => {
      setViewport({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return viewport;
};

// Hook for measuring performance
export const usePerformanceObserver = (entryTypes: string[] = ['navigation', 'paint']) => {
  const [metrics, setMetrics] = useState<PerformanceEntry[]>([]);

  useEffect(() => {
    if (!('PerformanceObserver' in window)) return;

    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      setMetrics(prev => [...prev, ...entries]);
    });

    entryTypes.forEach(type => {
      try {
        observer.observe({ entryTypes: [type] });
      } catch (e) {
        console.warn(`Performance observer type ${type} not supported`);
      }
    });

    return () => observer.disconnect();
  }, [entryTypes]);

  return metrics;
};

// Hook for memory usage monitoring
export const useMemoryMonitor = () => {
  const [memory, setMemory] = useState<any | null>(null);

  useEffect(() => {
    if (!('memory' in performance)) return;

    const updateMemory = () => {
      setMemory((performance as any).memory);
    };

    updateMemory();
    const interval = setInterval(updateMemory, 5000);

    return () => clearInterval(interval);
  }, []);

  return memory;
};

// Hook for connection monitoring
export const useNetworkStatus = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [connection, setConnection] = useState<any | null>(
    (navigator as any).connection || null
  );

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    const conn = (navigator as any).connection;
    if (conn) {
      const handleConnectionChange = () => setConnection({ ...conn });
      conn.addEventListener('change', handleConnectionChange);
      
      return () => {
        window.removeEventListener('online', handleOnline);
        window.removeEventListener('offline', handleOffline);
        conn.removeEventListener('change', handleConnectionChange);
      };
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return { isOnline, connection };
};

// Hook for optimized image loading
export const useOptimizedImage = (src: string, options: {
  placeholder?: string;
  quality?: number;
  format?: 'webp' | 'avif' | 'jpeg' | 'png';
} = {}) => {
  const [currentSrc, setCurrentSrc] = useState(options.placeholder || '');
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const img = new Image();
    
    img.onload = () => {
      setCurrentSrc(src);
      setIsLoading(false);
    };
    
    img.onerror = () => {
      setHasError(true);
      setIsLoading(false);
    };

    // Try to load optimized format first
    if (options.format === 'webp' && src.includes('.jpg')) {
      img.src = src.replace('.jpg', '.webp');
    } else if (options.format === 'avif' && src.includes('.jpg')) {
      img.src = src.replace('.jpg', '.avif');
    } else {
      img.src = src;
    }
  }, [src, options.format]);

  return { currentSrc, isLoading, hasError };
};