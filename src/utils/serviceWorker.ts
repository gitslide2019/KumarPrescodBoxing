// Kumar Prescod Boxing - Service Worker Registration & Management
// Enhanced PWA functionality for offline boxing content

interface ServiceWorkerConfig {
  onSuccess?: (registration: ServiceWorkerRegistration) => void;
  onUpdate?: (registration: ServiceWorkerRegistration) => void;
  onOffline?: () => void;
  onOnline?: () => void;
}

interface BoxingServiceWorkerState {
  isSupported: boolean;
  isRegistered: boolean;
  isUpdateAvailable: boolean;
  isOffline: boolean;
  registration: ServiceWorkerRegistration | null;
  cacheSizes: {
    static: number;
    dynamic: number;
    images: number;
  };
}

class BoxingServiceWorkerManager {
  private state: BoxingServiceWorkerState = {
    isSupported: false,
    isRegistered: false,
    isUpdateAvailable: false,
    isOffline: !navigator.onLine,
    registration: null,
    cacheSizes: {
      static: 0,
      dynamic: 0,
      images: 0
    }
  };

  private config: ServiceWorkerConfig = {};
  private updateCheckInterval: number | null = null;

  constructor(config: ServiceWorkerConfig = {}) {
    this.config = config;
    this.init();
  }

  private async init() {
    // Check service worker support
    this.state.isSupported = 'serviceWorker' in navigator;
    
    if (!this.state.isSupported) {
      console.warn('🥊 Service Workers not supported in this browser');
      return;
    }

    // Set up network status listeners
    this.setupNetworkListeners();
    
    // Set up periodic update checks
    this.setupUpdateChecker();
    
    // Initialize cache size monitoring
    this.updateCacheSizes();
  }

  /**
   * Register the boxing service worker
   */
  async register(): Promise<ServiceWorkerRegistration | null> {
    if (!this.state.isSupported) {
      console.warn('🥊 Cannot register SW: not supported');
      return null;
    }

    try {
      console.log('🥊 Registering Kumar Prescod Boxing Service Worker...');
      
      const registration = await navigator.serviceWorker.register('/sw.js', {
        scope: '/',
        updateViaCache: 'none' // Always check for updates
      });

      this.state.registration = registration;
      this.state.isRegistered = true;

      console.log('🥊 Service Worker registered successfully');

      // Set up registration event listeners
      this.setupRegistrationListeners(registration);

      // Call success callback
      if (this.config.onSuccess) {
        this.config.onSuccess(registration);
      }

      return registration;
    } catch (error) {
      console.error('🥊 Service Worker registration failed:', error);
      return null;
    }
  }

  /**
   * Unregister the service worker
   */
  async unregister(): Promise<boolean> {
    if (!this.state.registration) {
      return false;
    }

    try {
      const result = await this.state.registration.unregister();
      if (result) {
        this.state.isRegistered = false;
        this.state.registration = null;
        console.log('🥊 Service Worker unregistered successfully');
      }
      return result;
    } catch (error) {
      console.error('🥊 Service Worker unregistration failed:', error);
      return false;
    }
  }

  /**
   * Check for service worker updates
   */
  async checkForUpdates(): Promise<boolean> {
    if (!this.state.registration) {
      return false;
    }

    try {
      await this.state.registration.update();
      return true;
    } catch (error) {
      console.error('🥊 Service Worker update check failed:', error);
      return false;
    }
  }

  /**
   * Skip waiting and activate new service worker
   */
  async skipWaiting(): Promise<void> {
    if (!this.state.registration?.waiting) {
      return;
    }

    // Send skip waiting message to service worker
    this.state.registration.waiting.postMessage({ type: 'SKIP_WAITING' });
  }

  /**
   * Get current service worker state
   */
  getState(): BoxingServiceWorkerState {
    return { ...this.state };
  }

  /**
   * Preload critical boxing content
   */
  async preloadBoxingContent(urls: string[]): Promise<void> {
    if (!this.state.registration?.active) {
      console.warn('🥊 No active service worker for preloading');
      return;
    }

    this.state.registration.active.postMessage({
      type: 'PRELOAD_URLS',
      urls
    });
    
    console.log('🥊 Requested preload of boxing content:', urls);
  }

  /**
   * Clear all caches
   */
  async clearAllCaches(): Promise<void> {
    if (!('caches' in window)) {
      return;
    }

    try {
      const cacheNames = await caches.keys();
      const boxingCaches = cacheNames.filter(name => 
        name.includes('kumar-prescod-boxing')
      );

      await Promise.all(
        boxingCaches.map(cacheName => caches.delete(cacheName))
      );

      this.state.cacheSizes = { static: 0, dynamic: 0, images: 0 };
      console.log('🥊 All boxing caches cleared');
    } catch (error) {
      console.error('🥊 Error clearing caches:', error);
    }
  }

  /**
   * Get cache storage usage
   */
  async getCacheUsage(): Promise<{ used: number; quota: number }> {
    if (!('storage' in navigator) || !('estimate' in navigator.storage)) {
      return { used: 0, quota: 0 };
    }

    try {
      const estimate = await navigator.storage.estimate();
      return {
        used: estimate.usage || 0,
        quota: estimate.quota || 0
      };
    } catch (error) {
      console.error('🥊 Error getting cache usage:', error);
      return { used: 0, quota: 0 };
    }
  }

  /**
   * Request persistent storage for boxing content
   */
  async requestPersistentStorage(): Promise<boolean> {
    if (!('storage' in navigator) || !('persist' in navigator.storage)) {
      return false;
    }

    try {
      const persistent = await navigator.storage.persist();
      if (persistent) {
        console.log('🥊 Persistent storage granted for boxing content');
      }
      return persistent;
    } catch (error) {
      console.error('🥊 Error requesting persistent storage:', error);
      return false;
    }
  }

  /**
   * Schedule background sync for boxing data
   */
  async scheduleBackgroundSync(tag: string): Promise<void> {
    if (!this.state.registration?.sync) {
      console.warn('🥊 Background sync not supported');
      return;
    }

    try {
      await this.state.registration.sync.register(tag);
      console.log(`🥊 Background sync scheduled: ${tag}`);
    } catch (error) {
      console.error('🥊 Background sync scheduling failed:', error);
    }
  }

  private setupNetworkListeners(): void {
    window.addEventListener('online', () => {
      this.state.isOffline = false;
      console.log('🥊 Boxing app back online');
      
      if (this.config.onOnline) {
        this.config.onOnline();
      }

      // Schedule background sync when back online
      this.scheduleBackgroundSync('boxing-content-sync');
    });

    window.addEventListener('offline', () => {
      this.state.isOffline = true;
      console.log('🥊 Boxing app offline - cached content available');
      
      if (this.config.onOffline) {
        this.config.onOffline();
      }
    });
  }

  private setupRegistrationListeners(registration: ServiceWorkerRegistration): void {
    // Listen for waiting service worker (update available)
    registration.addEventListener('updatefound', () => {
      const newWorker = registration.installing;
      if (!newWorker) return;

      newWorker.addEventListener('statechange', () => {
        if (newWorker.state === 'installed') {
          if (navigator.serviceWorker.controller) {
            // New update available
            this.state.isUpdateAvailable = true;
            console.log('🥊 New boxing app update available');
            
            if (this.config.onUpdate) {
              this.config.onUpdate(registration);
            }
          }
        }
      });
    });

    // Listen for controller change (new SW activated)
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      console.log('🥊 New service worker activated - reloading page');
      window.location.reload();
    });

    // Listen for messages from service worker
    navigator.serviceWorker.addEventListener('message', event => {
      const { type, data } = event.data;
      
      switch (type) {
        case 'CACHE_UPDATED':
          console.log('🥊 Boxing content cache updated:', data);
          this.updateCacheSizes();
          break;
        case 'OFFLINE_FALLBACK':
          console.log('🥊 Serving offline boxing content:', data);
          break;
        default:
          console.log('🥊 SW message:', event.data);
      }
    });
  }

  private setupUpdateChecker(): void {
    // Check for updates every 30 minutes
    this.updateCheckInterval = window.setInterval(() => {
      this.checkForUpdates();
    }, 30 * 60 * 1000);
  }

  private async updateCacheSizes(): Promise<void> {
    if (!('caches' in window)) return;

    try {
      const cacheNames = await caches.keys();
      const sizes = { static: 0, dynamic: 0, images: 0 };

      for (const cacheName of cacheNames) {
        if (cacheName.includes('kumar-prescod-boxing')) {
          const cache = await caches.open(cacheName);
          const keys = await cache.keys();
          
          if (cacheName.includes('static')) {
            sizes.static = keys.length;
          } else if (cacheName.includes('images')) {
            sizes.images = keys.length;
          } else {
            sizes.dynamic = keys.length;
          }
        }
      }

      this.state.cacheSizes = sizes;
    } catch (error) {
      console.error('🥊 Error updating cache sizes:', error);
    }
  }

  /**
   * Cleanup - remove event listeners and intervals
   */
  cleanup(): void {
    if (this.updateCheckInterval) {
      clearInterval(this.updateCheckInterval);
      this.updateCheckInterval = null;
    }
  }
}

// Create global instance
let serviceWorkerManager: BoxingServiceWorkerManager | null = null;

/**
 * Initialize service worker for Kumar Prescod Boxing app
 */
export function initBoxingServiceWorker(config: ServiceWorkerConfig = {}): BoxingServiceWorkerManager {
  if (!serviceWorkerManager) {
    serviceWorkerManager = new BoxingServiceWorkerManager(config);
  }
  return serviceWorkerManager;
}

/**
 * Register service worker with boxing-specific optimizations
 */
export async function registerBoxingServiceWorker(config: ServiceWorkerConfig = {}): Promise<ServiceWorkerRegistration | null> {
  const manager = initBoxingServiceWorker(config);
  const registration = await manager.register();
  
  // Preload critical boxing content
  if (registration) {
    await manager.preloadBoxingContent([
      '/images/profile/kumar-main.webp',
      '/images/logo/kumar-logo.webp',
      '/api/fights',
      '/api/stats'
    ]);
  }
  
  return registration;
}

/**
 * Get service worker manager instance
 */
export function getBoxingServiceWorker(): BoxingServiceWorkerManager | null {
  return serviceWorkerManager;
}

/**
 * Legacy registration function for compatibility
 */
export async function register(config: ServiceWorkerConfig = {}): Promise<void> {
  await registerBoxingServiceWorker(config);
}

/**
 * Unregister service worker
 */
export async function unregister(): Promise<void> {
  if (serviceWorkerManager) {
    await serviceWorkerManager.unregister();
    serviceWorkerManager.cleanup();
    serviceWorkerManager = null;
  }
}

// Development helpers
if (process.env.NODE_ENV === 'development') {
  (window as any).boxingServiceWorker = {
    getManager: () => serviceWorkerManager,
    clearCaches: () => serviceWorkerManager?.clearAllCaches(),
    checkUpdates: () => serviceWorkerManager?.checkForUpdates(),
    getState: () => serviceWorkerManager?.getState(),
    getCacheUsage: () => serviceWorkerManager?.getCacheUsage()
  };
}

export default {
  register: registerBoxingServiceWorker,
  unregister,
  init: initBoxingServiceWorker,
  getManager: getBoxingServiceWorker
};