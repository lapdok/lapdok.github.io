// ============================================================
// Service Worker Terpusat - LapDok & Operator IPA
// Scope: / (seluruh lapdok.github.io)
// ============================================================
const CACHE_NAME = 'lapdok-cache-v2';

// Asset penting yang di-pre-cache
const PRECACHE_ASSETS = [
    '/',
    '/index.html',
    '/operator/index.html',
    '/operator/tampildata.html',
    '/operator/print-preview.html',
    '/operator/manifest.json',
    '/operator/icon-192.png',
    '/operator/icon-512.png',
    '/assets/manifest.json',
    '/assets/icons/icon-192.png',
    '/assets/icons/icon-512.png',
    '/js/image-compressor.js'
];

// ── Install: Pre-cache asset penting ──
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => cache.addAll(PRECACHE_ASSETS).catch(err => {
                console.warn('[SW] Sebagian asset gagal di-cache:', err);
            }))
            .then(() => self.skipWaiting())
    );
});

// ── Activate: Bersihkan cache versi lama ──
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then(keys => Promise.all(
            keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))
        )).then(() => self.clients.claim())
    );
});

// ── Fetch: Network-First untuk navigasi, Cache-First untuk assets ──
self.addEventListener('fetch', (event) => {
    if (event.request.method !== 'GET') return;
    if (event.request.url.startsWith('chrome-extension://')) return;

    const url = new URL(event.request.url);

    // Lewati request eksternal (CDN, API, dsb)
    if (url.origin !== self.location.origin) {
        event.respondWith(
            fetch(event.request).catch(() => caches.match(event.request))
        );
        return;
    }

    // Network-First untuk navigasi halaman
    if (event.request.mode === 'navigate') {
        event.respondWith(
            fetch(event.request)
                .then(res => {
                    const clone = res.clone();
                    caches.open(CACHE_NAME).then(c => c.put(event.request, clone));
                    return res;
                })
                .catch(() => caches.match(event.request))
        );
        return;
    }

    // Cache-First untuk asset statis
    event.respondWith(
        caches.match(event.request).then(cached => {
            if (cached) return cached;
            return fetch(event.request).then(res => {
                if (!res || res.status !== 200) return res;
                const clone = res.clone();
                caches.open(CACHE_NAME).then(c => c.put(event.request, clone));
                return res;
            }).catch(() => cached);
        })
    );
});
