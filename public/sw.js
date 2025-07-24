// Kumar Prescod Boxing - Service Worker
// Offline content caching for enhanced user experience

const CACHE_NAME = 'kumar-prescod-boxing-v1.2.0';
const STATIC_CACHE = `${CACHE_NAME}-static`;
const DYNAMIC_CACHE = `${CACHE_NAME}-dynamic`;
const IMAGE_CACHE = `${CACHE_NAME}-images`;

// Boxing-specific content to cache for offline access
const STATIC_ASSETS = [
  '/',
  '/static/js/bundle.js',
  '/static/css/main.css',
  '/manifest.json',
  '/favicon.ico',
  // Core boxing pages
  '/about',
  '/fights',
  '/journey',
  '/sponsors',
  // Essential fonts
  'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap',
  'https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800;900&display=swap'
];

// Boxing images and media to prioritize for caching
const BOXING_CONTENT_PATTERNS = [
  /\/images\/fights\//,
  /\/images\/training\//,
  /\/images\/gallery\//,
  /\/images\/profile\//,
  /\.webp$/,
  /\.avif$/,
  /\.jpg$/,
  /\.jpeg$/,
  /\.png$/,
  /\.gif$/
];

// API endpoints that should be cached
const API_CACHE_PATTERNS = [
  /\/api\/fights/,
  /\/api\/stats/,
  /\/api\/events/,
  /\/api\/media/
];

// Content that should never be cached
const NEVER_CACHE_PATTERNS = [
  /\/api\/auth/,
  /\/api\/payments/,
  /\/api\/admin/,
  /chrome-extension/,
  /\/sockjs-node/,
  /hot-update/
];

// Cache strategies enum
const CACHE_STRATEGIES = {
  NETWORK_FIRST: 'network-first',
  CACHE_FIRST: 'cache-first',
  STALE_WHILE_REVALIDATE: 'stale-while-revalidate',
  NETWORK_ONLY: 'network-only',
  CACHE_ONLY: 'cache-only'
};

// Service Worker Installation
self.addEventListener('install', event => {
  console.log('🥊 Kumar Prescod Boxing SW: Installing...');
  
  event.waitUntil(
    Promise.all([
      // Cache static assets
      caches.open(STATIC_CACHE).then(cache => {
        console.log('🥊 Caching static boxing assets...');
        return cache.addAll(STATIC_ASSETS.map(url => new Request(url, { credentials: 'same-origin' })));
      }),
      
      // Preload critical boxing images
      preloadCriticalBoxingContent(),
      
      // Skip waiting to activate immediately
      self.skipWaiting()
    ])
  );
});

// Service Worker Activation
self.addEventListener('activate', event => {
  console.log('🥊 Kumar Prescod Boxing SW: Activating...');
  
  event.waitUntil(
    Promise.all([
      // Clean up old caches
      cleanupOldCaches(),
      
      // Claim all clients immediately
      self.clients.claim(),
      
      // Initialize boxing content caching
      initializeBoxingCache()
    ])
  );
});

// Fetch Event Handler with Boxing-Optimized Caching
self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);
  
  // Skip non-HTTP requests
  if (!url.protocol.startsWith('http')) return;
  
  // Skip requests that should never be cached
  if (shouldNeverCache(request.url)) {
    return event.respondWith(fetch(request));
  }
  
  // Route requests based on content type and boxing-specific needs
  if (isStaticAsset(request.url)) {
    event.respondWith(handleStaticAsset(request));
  } else if (isBoxingImage(request.url)) {
    event.respondWith(handleBoxingImage(request));
  } else if (isAPIRequest(request.url)) {
    event.respondWith(handleAPIRequest(request));
  } else if (isNavigationRequest(request)) {
    event.respondWith(handleNavigation(request));
  } else {
    event.respondWith(handleDefault(request));
  }
});

// Background Sync for offline actions
self.addEventListener('sync', event => {
  console.log('🥊 Background sync triggered:', event.tag);
  
  switch (event.tag) {
    case 'boxing-content-sync':
      event.waitUntil(syncBoxingContent());
      break;
    case 'analytics-sync':
      event.waitUntil(syncAnalytics());
      break;
    case 'user-actions-sync':
      event.waitUntil(syncUserActions());
      break;
  }
});

// Push notifications for boxing events
self.addEventListener('push', event => {
  const options = {
    body: 'New boxing content available!',
    icon: '/images/icons/icon-192x192.png',
    badge: '/images/icons/badge-72x72.png',
    vibrate: [200, 100, 200],
    data: {
      url: '/',
      timestamp: Date.now()
    },
    actions: [
      {
        action: 'view',
        title: 'View Content',
        icon: '/images/icons/view-icon.png'
      },
      {
        action: 'dismiss',
        title: 'Dismiss'
      }
    ]
  };
  
  if (event.data) {
    const data = event.data.json();
    options.title = data.title || 'Kumar Prescod Boxing';
    options.body = data.body || options.body;
    options.data.url = data.url || options.data.url;
  }
  
  event.waitUntil(
    self.registration.showNotification('Kumar Prescod Boxing', options)
  );
});

// Notification click handler
self.addEventListener('notificationclick', event => {
  event.notification.close();
  
  if (event.action === 'view' || !event.action) {
    const url = event.notification.data.url || '/';
    event.waitUntil(
      clients.openWindow(url)
    );
  }
});

// ===== HELPER FUNCTIONS =====

async function preloadCriticalBoxingContent() {
  try {
    const imageCache = await caches.open(IMAGE_CACHE);
    const criticalImages = [
      '/images/profile/kumar-main.webp',
      '/images/profile/kumar-main.jpg',
      '/images/logo/kumar-logo.webp',
      '/images/logo/kumar-logo.png'
    ];
    
    for (const imageUrl of criticalImages) {
      try {
        const response = await fetch(imageUrl);
        if (response.ok) {
          await imageCache.put(imageUrl, response);
        }
      } catch (error) {
        console.warn(`🥊 Failed to preload image: ${imageUrl}`, error);
      }
    }
  } catch (error) {
    console.error('🥊 Error preloading critical boxing content:', error);
  }
}

async function cleanupOldCaches() {
  const cacheNames = await caches.keys();
  const oldCaches = cacheNames.filter(name => 
    name.startsWith('kumar-prescod-boxing-') && name !== CACHE_NAME
  );
  
  return Promise.all(
    oldCaches.map(cacheName => {
      console.log('🥊 Deleting old cache:', cacheName);
      return caches.delete(cacheName);
    })
  );
}

async function initializeBoxingCache() {
  // Set up periodic cache cleanup
  const now = Date.now();
  const lastCleanup = await getFromIDB('lastCacheCleanup');
  
  // Clean up cache every 24 hours
  if (!lastCleanup || now - lastCleanup > 24 * 60 * 60 * 1000) {
    await cleanupExpiredCache();
    await setInIDB('lastCacheCleanup', now);
  }
}

function shouldNeverCache(url) {
  return NEVER_CACHE_PATTERNS.some(pattern => pattern.test(url));
}

function isStaticAsset(url) {
  return /\.(js|css|woff|woff2|ttf|eot)$/.test(url) || 
         url.includes('/static/') ||
         url.includes('fonts.googleapis.com');
}

function isBoxingImage(url) {
  return BOXING_CONTENT_PATTERNS.some(pattern => pattern.test(url));
}

function isAPIRequest(url) {
  return url.includes('/api/') || API_CACHE_PATTERNS.some(pattern => pattern.test(url));
}

function isNavigationRequest(request) {
  return request.mode === 'navigate' || 
         (request.method === 'GET' && request.headers.get('accept').includes('text/html'));
}

// Static Asset Handler - Cache First Strategy
async function handleStaticAsset(request) {
  const cache = await caches.open(STATIC_CACHE);
  const cachedResponse = await cache.match(request);
  
  if (cachedResponse) {
    // Return cached version immediately, update in background
    updateStaticAssetInBackground(request, cache);
    return cachedResponse;
  }
  
  try {
    const networkResponse = await fetch(request);
    if (networkResponse.status === 200) {
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    console.warn('🥊 Static asset network failed:', request.url, error);
    return new Response('Offline - Asset not available', { status: 503 });
  }
}

// Boxing Image Handler - Stale While Revalidate
async function handleBoxingImage(request) {
  const cache = await caches.open(IMAGE_CACHE);
  const cachedResponse = await cache.match(request);
  
  // Always return cached version if available
  if (cachedResponse) {
    // Update in background for next time
    updateImageInBackground(request, cache);
    return cachedResponse;
  }
  
  try {
    const networkResponse = await fetch(request);
    if (networkResponse.status === 200) {
      // Cache successful responses
      cache.put(request, networkResponse.clone());
      
      // Cleanup old images to prevent cache bloat
      await cleanupImageCache(cache);
    }
    return networkResponse;
  } catch (error) {
    console.warn('🥊 Boxing image network failed:', request.url, error);
    
    // Return a placeholder boxing image for offline
    return createOfflineImageResponse();
  }
}

// API Request Handler - Network First with Offline Support
async function handleAPIRequest(request) {
  const cache = await caches.open(DYNAMIC_CACHE);
  
  try {
    const networkResponse = await fetch(request);
    if (networkResponse.status === 200) {
      // Cache successful API responses
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    console.warn('🥊 API network failed:', request.url, error);
    
    // Try to return cached version
    const cachedResponse = await cache.match(request);
    if (cachedResponse) {
      // Add offline header
      const response = cachedResponse.clone();
      response.headers.set('X-Served-By', 'ServiceWorker-Cache');
      return response;
    }
    
    // Return offline API response
    return createOfflineAPIResponse(request);
  }
}

// Navigation Handler - App Shell Strategy
async function handleNavigation(request) {
  try {
    const networkResponse = await fetch(request);
    return networkResponse;
  } catch (error) {
    console.warn('🥊 Navigation network failed:', request.url, error);
    
    // Return cached app shell
    const cache = await caches.open(STATIC_CACHE);
    const appShell = await cache.match('/');
    
    if (appShell) {
      return appShell;
    }
    
    // Fallback offline page
    return createOfflinePageResponse();
  }
}

// Default Handler
async function handleDefault(request) {
  const cache = await caches.open(DYNAMIC_CACHE);
  
  try {
    const networkResponse = await fetch(request);
    if (networkResponse.status === 200) {
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    const cachedResponse = await cache.match(request);
    return cachedResponse || new Response('Offline', { status: 503 });
  }
}

// Background update functions
async function updateStaticAssetInBackground(request, cache) {
  try {
    const networkResponse = await fetch(request);
    if (networkResponse.status === 200) {
      await cache.put(request, networkResponse);
    }
  } catch (error) {
    // Silent fail for background updates
  }
}

async function updateImageInBackground(request, cache) {
  try {
    const networkResponse = await fetch(request);
    if (networkResponse.status === 200) {
      await cache.put(request, networkResponse);
      await cleanupImageCache(cache);
    }
  } catch (error) {
    // Silent fail for background updates
  }
}

// Cache cleanup functions
async function cleanupImageCache(cache) {
  const cacheEntries = await cache.keys();
  if (cacheEntries.length > 100) { // Keep max 100 images
    const oldestEntries = cacheEntries.slice(0, cacheEntries.length - 80);
    await Promise.all(oldestEntries.map(entry => cache.delete(entry)));
  }
}

async function cleanupExpiredCache() {
  const cacheNames = await caches.keys();
  for (const cacheName of cacheNames) {
    if (cacheName.startsWith(CACHE_NAME)) {
      const cache = await caches.open(cacheName);
      const entries = await cache.keys();
      
      for (const request of entries) {
        const response = await cache.match(request);
        const cacheDate = response.headers.get('date');
        
        if (cacheDate) {
          const age = Date.now() - new Date(cacheDate).getTime();
          // Remove entries older than 7 days
          if (age > 7 * 24 * 60 * 60 * 1000) {
            await cache.delete(request);
          }
        }
      }
    }
  }
}

// Offline response creators
function createOfflineImageResponse() {
  // Create a simple SVG placeholder for boxing images
  const svg = `
    <svg width="400" height="300" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="#f3f4f6"/>
      <text x="50%" y="50%" font-family="Arial" font-size="16" fill="#6b7280" text-anchor="middle" dy=".3em">
        🥊 Boxing Image Offline
      </text>
    </svg>
  `;
  
  return new Response(svg, {
    headers: {
      'Content-Type': 'image/svg+xml',
      'Cache-Control': 'no-cache'
    }
  });
}

function createOfflineAPIResponse(request) {
  const url = new URL(request.url);
  const endpoint = url.pathname;
  
  let offlineData = { error: 'Offline', message: 'This content is not available offline' };
  
  // Provide boxing-specific offline data
  if (endpoint.includes('/fights')) {
    offlineData = {
      fights: [],
      message: 'Fight data not available offline'
    };
  } else if (endpoint.includes('/stats')) {
    offlineData = {
      wins: '3',
      losses: '0',
      draws: '0',
      ko: '3',
      message: 'Latest stats not available offline'
    };
  }
  
  return new Response(JSON.stringify(offlineData), {
    headers: {
      'Content-Type': 'application/json',
      'X-Served-By': 'ServiceWorker-Offline'
    }
  });
}

function createOfflinePageResponse() {
  const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Kumar Prescod Boxing - Offline</title>
      <style>
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
          color: white;
          margin: 0;
          padding: 0;
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          text-align: center;
        }
        .container {
          max-width: 400px;
          padding: 2rem;
        }
        .boxing-icon {
          font-size: 4rem;
          margin-bottom: 1rem;
        }
        h1 {
          color: #f59e0b;
          margin-bottom: 1rem;
        }
        .retry-btn {
          background: #dc2626;
          color: white;
          border: none;
          padding: 1rem 2rem;
          border-radius: 0.5rem;
          font-size: 1rem;
          cursor: pointer;
          margin-top: 1rem;
        }
        .retry-btn:hover {
          background: #ef4444;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="boxing-icon">🥊</div>
        <h1>Kumar Prescod Boxing</h1>
        <p>You're currently offline. Some content may not be available.</p>
        <p>Check your connection and try again.</p>
        <button class="retry-btn" onclick="window.location.reload()">
          Try Again
        </button>
      </div>
    </body>
    </html>
  `;
  
  return new Response(html, {
    headers: {
      'Content-Type': 'text/html',
      'Cache-Control': 'no-cache'
    }
  });
}

// Background sync functions
async function syncBoxingContent() {
  console.log('🥊 Syncing boxing content...');
  // Implement boxing-specific content sync
  // This could include fight updates, news, stats, etc.
}

async function syncAnalytics() {
  console.log('🥊 Syncing analytics data...');
  // Sync any queued analytics events
}

async function syncUserActions() {
  console.log('🥊 Syncing user actions...');
  // Sync any user interactions that happened offline
}

// IndexedDB helpers for persistent storage
function openIDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('KumarPrescodBoxing', 1);
    
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
    
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains('settings')) {
        db.createObjectStore('settings');
      }
      if (!db.objectStoreNames.contains('offline-actions')) {
        db.createObjectStore('offline-actions', { keyPath: 'id', autoIncrement: true });
      }
    };
  });
}

async function getFromIDB(key) {
  try {
    const db = await openIDB();
    const transaction = db.transaction(['settings'], 'readonly');
    const store = transaction.objectStore('settings');
    const request = store.get(key);
    
    return new Promise((resolve, reject) => {
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  } catch (error) {
    console.warn('🥊 IDB get failed:', error);
    return null;
  }
}

async function setInIDB(key, value) {
  try {
    const db = await openIDB();
    const transaction = db.transaction(['settings'], 'readwrite');
    const store = transaction.objectStore('settings');
    store.put(value, key);
  } catch (error) {
    console.warn('🥊 IDB set failed:', error);
  }
}

console.log('🥊 Kumar Prescod Boxing Service Worker loaded successfully!');