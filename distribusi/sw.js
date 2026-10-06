// 1. Versi cache dinaikkan ke v8 agar browser & PWA di Android otomatis membuang cache lama
const CACHE_NAME = 'dis-nrw-v8';

const ASSETS = [
  './',
  './index.html',
  './login.html',
  './css/main.css',
  './css/print-pdf.css',
  './js/skala.js',
  './js/auth-guard.js',
  './js/core.js',
  './js/jarvis.js',
  './js/image-compressor.js',
  './assets/manifest.json',
  './assets/icons/icon-192.png',
  './assets/icons/icon-512.png',
  './assets/icons/logo.png',
  './pages/status.html',
  './pages/tampildata.html',
  './pages/form-apel.html',
  './pages/form-perbaikan.html',
  './pages/form-tugaslain.html',
  './pages/form-uji-tekanan.html',
  './pages/form-valve.html',
  './pages/print-preview.html',
  './pages/panduan.html',
  './pages/privacy.html',
  './pages/pertanggungjawaban.html'
];

// 2. Install: Langsung download semua asset baru dan paksa aktif (skipWaiting)
self.addEventListener('install', e => {
  self.skipWaiting();
  e.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(ASSETS);
    }).catch(err => console.log('ServiceWorker cache addAll error:', err))
  );
});

// 3. Activate: Hapus cache v6 dan versi lama lainnya, lalu ambil kendali klien (clients.claim)
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.filter(k => k !== CACHE_NAME).map(k => {
          console.log('Menghapus cache lawas:', k);
          return caches.delete(k);
        })
      );
    }).then(() => self.clients.claim())
  );
});

// 4. Fetch: Strategi Stale-While-Revalidate untuk script (update di background) & Cache First untuk asset
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;

  e.respondWith(
    caches.match(e.request).then(cached => {
      // Ambil versi terbaru dari jaringan untuk memperbarui cache
      const networkFetch = fetch(e.request).then(networkResponse => {
        if (networkResponse && networkResponse.status === 200) {
          const responseClone = networkResponse.clone();
          caches.open(CACHE_NAME).then(cache => {
            cache.put(e.request, responseClone);
          });
        }
        return networkResponse;
      }).catch(() => cached);

      // Kembalikan cache yang ada terlebih dahulu jika offline/tersedia
      return cached || networkFetch;
    })
  );
});
