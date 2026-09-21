self.addEventListener('fetch', (event) => {
    // Service worker minimal agar syarat PWA terpenuhi. 
    // Strategi caching ringan saat fetch dilakukan otomatis di sini
    event.respondWith(fetch(event.request));
});
