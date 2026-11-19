// Service Worker - LapDok PWA (Progressive Web App)
const CACHE_NAME = 'lapdok-pwa-v1.1';
const CORE_ASSETS = [
    './',
    './index.html',
    './manifest.json',
    './pages/form.html',
    './pages/tampildata.html',
    './pages/print-preview.html',
    './css/form.css',
    './css/print-pdf.css',
    './js/form-handler.js',
    './js/pdf-engine.js',
    './js/jarvis.js',
    './js/nav.js',
    './js/pwa.js',
    './assets/icons/icon-192.png',
    './assets/icons/icon-512.png'
];

// Install: Cache core assets
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            console.log('[SW] Pre-caching core offline assets');
            return cache.addAll(CORE_ASSETS).catch((err) => {
                console.warn('[SW] Some assets could not be pre-cached:', err);
            });
        }).then(() => self.skipWaiting())
    );
});

// Activate: Clean up old caches
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((keys) => {
            return Promise.all(
                keys.map((key) => {
                    if (key !== CACHE_NAME) {
                        console.log('[SW] Deleting old cache:', key);
                        return caches.delete(key);
                    }
                })
            );
        }).then(() => self.clients.claim())
    );
});

// Fetch: Network-First with Cache Fallback for dynamic pages, Cache-First for static assets
self.addEventListener('fetch', (event) => {
    // Abaikan permintaan selain GET atau skema non-http(s) (misal chrome-extension)
    if (event.request.method !== 'GET' || !event.request.url.startsWith('http')) {
        return;
    }

    // Untuk Google AdSense, Analytics, OpenStreetMap, lewati cache agar selalu fresh
    const url = new URL(event.request.url);
    if (url.hostname.includes('googlesyndication') || 
        url.hostname.includes('google-analytics') || 
        url.hostname.includes('tile.openstreetmap.org') ||
        url.hostname.includes('nominatim.openstreetmap.org')) {
        return;
    }

    event.respondWith(
        fetch(event.request)
            .then((response) => {
                // Simpan copy response ke cache jika valid
                if (response && response.status === 200 && response.type === 'basic') {
                    const responseToCache = response.clone();
                    caches.open(CACHE_NAME).then((cache) => {
                        cache.put(event.request, responseToCache);
                    });
                }
                return response;
            })
            .catch(() => {
                // Offline fallback: Ambil dari cache
                return caches.match(event.request).then((cachedResponse) => {
                    if (cachedResponse) {
                        return cachedResponse;
                    }
                    if (event.request.headers.get('accept')?.includes('text/html')) {
                        return caches.match('./index.html');
                    }
                });
            })
    );
});
