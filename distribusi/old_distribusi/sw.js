self.addEventListener('fetch', (event) => {
    // Service worker minimal agar syarat PWA terpenuhi
    event.respondWith(fetch(event.request));
});
