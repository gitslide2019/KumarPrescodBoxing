import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Wifi, WifiOff, Download, CheckCircle, AlertCircle } from 'lucide-react';
import { designTokens } from '../../styles/design-tokens';

interface CacheStatus {
  isOnline: boolean;
  cacheSize: number;
  lastUpdated: Date | null;
  criticalContentCached: boolean;
  imagesLoaded: number;
  totalImages: number;
}

interface OfflineCacheManagerProps {
  showStatus?: boolean;
  autoCache?: boolean;
}

const OfflineCacheManager: React.FC<OfflineCacheManagerProps> = ({ 
  showStatus = false,
  autoCache = true 
}) => {
  const [cacheStatus, setCacheStatus] = useState<CacheStatus>({
    isOnline: navigator.onLine,
    cacheSize: 0,
    lastUpdated: null,
    criticalContentCached: false,
    imagesLoaded: 0,
    totalImages: 0
  });
  const [showCacheNotification, setShowCacheNotification] = useState(false);
  const [isCaching, setIsCaching] = useState(false);

  // Boxing-specific critical content to cache
  const criticalBoxingContent = [
    // Core pages
    '/',
    '/about',
    '/fights',
    '/journey',
    
    // Critical images
    '/images/profile/kumar-main.webp',
    '/images/profile/kumar-main.jpg',
    '/images/logo/boxing-logo.webp',
    '/images/logo/boxing-logo.png',
    
    // Fight photos
    '/images/fights/recent/fight-1.webp',
    '/images/fights/recent/fight-2.webp',
    '/images/fights/recent/fight-3.webp',
    
    // Training images
    '/images/training/daily/training-1.webp',
    '/images/training/daily/training-2.webp',
    
    // Essential assets
    '/static/css/main.css',
    '/static/js/bundle.js',
    '/manifest.json'
  ];

  useEffect(() => {
    // Monitor online/offline status
    const handleOnline = () => {
      setCacheStatus(prev => ({ ...prev, isOnline: true }));
      
      // Auto-cache when coming back online
      if (autoCache) {
        setTimeout(() => {
          cacheBoxingContent();
        }, 2000);
      }
    };

    const handleOffline = () => {
      setCacheStatus(prev => ({ ...prev, isOnline: false }));
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Initial cache status check
    checkCacheStatus();

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [autoCache]);

  const checkCacheStatus = async () => {
    if ('caches' in window) {
      try {
        // Calculate total cache size
        const cacheNames = await caches.keys();
        let totalSize = 0;
        let criticalCached = 0;

        for (const cacheName of cacheNames) {
          if (cacheName.includes('kumar-prescod-boxing')) {
            const cache = await caches.open(cacheName);
            const keys = await cache.keys();
            
            // Estimate cache size (rough calculation)
            totalSize += keys.length * 50; // ~50KB average per cached item
            
            // Check critical content
            for (const url of criticalBoxingContent) {
              const response = await cache.match(url);
              if (response) {
                criticalCached++;
              }
            }
          }
        }

        setCacheStatus(prev => ({
          ...prev,
          cacheSize: totalSize,
          criticalContentCached: criticalCached >= criticalBoxingContent.length * 0.8, // 80% cached
          lastUpdated: new Date()
        }));

      } catch (error) {
        console.warn('🥊 Error checking cache status:', error);
      }
    }
  };

  const cacheBoxingContent = async () => {
    if (!('caches' in window) || !('serviceWorker' in navigator)) {
      return;
    }

    setIsCaching(true);
    setShowCacheNotification(true);

    try {
      const cache = await caches.open('kumar-prescod-boxing-v1.2.0-critical');
      const cached = [];
      const failed = [];

      // Cache critical content
      for (const url of criticalBoxingContent) {
        try {
          const response = await fetch(url, { mode: 'cors' });
          if (response.ok) {
            await cache.put(url, response);
            cached.push(url);
            
            setCacheStatus(prev => ({
              ...prev,
              imagesLoaded: cached.filter(u => u.includes('/images/')).length,
              totalImages: criticalBoxingContent.filter(u => u.includes('/images/')).length
            }));
          } else {
            failed.push(url);
          }
        } catch (error) {
          console.warn(`🥊 Failed to cache: ${url}`, error);
          failed.push(url);
        }
      }

      // Update cache status
      await checkCacheStatus();

      // Track caching completion
      if (window.gtag) {
        window.gtag('event', 'offline_content_cached', {
          event_category: 'pwa',
          event_label: 'boxing_content',
          value: cached.length,
          custom_parameter_cached: cached.length,
          custom_parameter_failed: failed.length
        });
      }

      console.log(`🥊 Boxing content cached: ${cached.length} items`);
      if (failed.length > 0) {
        console.warn(`🥊 Failed to cache ${failed.length} items:`, failed);
      }

    } catch (error) {
      console.error('🥊 Error caching boxing content:', error);
    } finally {
      setIsCaching(false);
      
      // Hide notification after delay
      setTimeout(() => {
        setShowCacheNotification(false);
      }, 3000);
    }
  };

  const formatCacheSize = (sizeInKB: number): string => {
    if (sizeInKB < 1024) {
      return `${Math.round(sizeInKB)} KB`;
    } else {
      return `${(sizeInKB / 1024).toFixed(1)} MB`;
    }
  };

  const getCacheStatusColor = () => {
    if (!cacheStatus.isOnline) {
      return designTokens.colors.semantic.warning;
    }
    return cacheStatus.criticalContentCached 
      ? designTokens.colors.semantic.success 
      : designTokens.colors.semantic.info;
  };

  const getCacheStatusIcon = () => {
    if (!cacheStatus.isOnline) {
      return <WifiOff className="w-4 h-4" />;
    }
    return cacheStatus.criticalContentCached 
      ? <CheckCircle className="w-4 h-4" />
      : <Download className="w-4 h-4" />;
  };

  const getCacheStatusText = () => {
    if (!cacheStatus.isOnline) {
      return 'Offline Mode';
    }
    if (isCaching) {
      return 'Caching Boxing Content...';
    }
    return cacheStatus.criticalContentCached 
      ? 'Ready for Offline' 
      : 'Cache Boxing Content';
  };

  return (
    <>
      {/* Cache status indicator */}
      {showStatus && (
        <motion.div
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          className="fixed top-20 right-4 z-40"
        >
          <div 
            className="flex items-center space-x-2 px-3 py-2 rounded-lg text-sm backdrop-blur-sm"
            style={{ 
              background: `${getCacheStatusColor()}20`,
              border: `1px solid ${getCacheStatusColor()}40`,
              color: getCacheStatusColor()
            }}
          >
            {getCacheStatusIcon()}
            <span className="font-medium">{getCacheStatusText()}</span>
            {cacheStatus.cacheSize > 0 && (
              <span className="text-xs opacity-70">
                ({formatCacheSize(cacheStatus.cacheSize)})
              </span>
            )}
          </div>
        </motion.div>
      )}

      {/* Cache notification */}
      <AnimatePresence>
        {showCacheNotification && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed bottom-20 left-4 right-4 z-50 max-w-sm mx-auto"
          >
            <div 
              className="rounded-lg shadow-xl p-4 border backdrop-blur-sm"
              style={{ 
                background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(30, 41, 59, 0.95) 100%)',
                borderColor: designTokens.colors.semantic.info + '40'
              }}
            >
              <div className="flex items-center space-x-3">
                {/* Cache icon */}
                <div 
                  className="w-10 h-10 rounded-lg flex items-center justify-center"
                  style={{ 
                    background: designTokens.colors.semantic.info + '20',
                    border: `1px solid ${designTokens.colors.semantic.info}40`
                  }}
                >
                  {isCaching ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    >
                      <Download 
                        className="w-5 h-5" 
                        style={{ color: designTokens.colors.semantic.info }}
                      />
                    </motion.div>
                  ) : (
                    <CheckCircle 
                      className="w-5 h-5" 
                      style={{ color: designTokens.colors.semantic.success }}
                    />
                  )}
                </div>

                {/* Content */}
                <div className="flex-1">
                  <h4 className="text-sm font-semibold text-white">
                    🥊 {isCaching ? 'Caching Boxing Content' : 'Ready for Offline'}
                  </h4>
                  <p className="text-xs text-gray-300 mt-1">
                    {isCaching 
                      ? `Loading images... ${cacheStatus.imagesLoaded}/${cacheStatus.totalImages}`
                      : 'Boxing content cached for offline viewing'
                    }
                  </p>
                  
                  {/* Progress bar for caching */}
                  {isCaching && cacheStatus.totalImages > 0 && (
                    <div className="mt-2">
                      <div className="w-full bg-gray-700 rounded-full h-1.5">
                        <motion.div
                          className="h-1.5 rounded-full"
                          style={{ 
                            background: designTokens.colors.semantic.info,
                            width: `${(cacheStatus.imagesLoaded / cacheStatus.totalImages) * 100}%`
                          }}
                          initial={{ width: 0 }}
                          animate={{ 
                            width: `${(cacheStatus.imagesLoaded / cacheStatus.totalImages) * 100}%` 
                          }}
                          transition={{ duration: 0.3 }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Benefits */}
              {!isCaching && (
                <div className="mt-3 pt-3 border-t border-gray-700/50">
                  <div className="flex items-center justify-between text-xs text-gray-400">
                    <span>⚡ Faster loading</span>
                    <span>📱 Works offline</span>
                    <span>🥊 Full experience</span>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Manual cache button (development) */}
      {process.env.NODE_ENV === 'development' && (
        <button
          onClick={cacheBoxingContent}
          disabled={isCaching}
          className="fixed bottom-4 left-4 z-40 px-3 py-2 bg-blue-600 text-white text-xs rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          {isCaching ? 'Caching...' : 'Cache Boxing Content'}
        </button>
      )}
    </>
  );
};

export default OfflineCacheManager;