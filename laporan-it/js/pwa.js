// js/pwa.js - PWA Controller & Installation Manager
let deferredPrompt = null;

// 1. Registrasi Service Worker secara otomatis
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        // Deteksi path service worker (apakah dari root atau dari subfolder pages/)
        const inPagesFolder = window.location.pathname.includes('/pages/');
        const swPath = inPagesFolder ? '../sw.js' : 'sw.js';
        const scopePath = inPagesFolder ? '../' : './';

        navigator.serviceWorker.register(swPath, { scope: scopePath })
            .then((reg) => {
                console.log('[PWA] Service Worker terdaftar dengan scope:', reg.scope);
            })
            .catch((err) => {
                console.warn('[PWA] Registrasi Service Worker gagal (normal jika di file://):', err.message);
            });
    });
}

// 2. Tangkap event 'beforeinstallprompt' dari browser Chrome / Android / Edge
window.addEventListener('beforeinstallprompt', (e) => {
    // Cegah mini-infobar default browser agar kita bisa memunculkan tombol custom
    e.preventDefault();
    deferredPrompt = e;
    console.log('[PWA] Aplikasi siap dipasang (beforeinstallprompt fired)');

    // Tampilkan tombol instalasi di UI jika ada
    showInstallUI();
});

// 3. Tampilkan Banner / Tombol Install PWA di Antarmuka
function showInstallUI() {
    // Tombol di navbar (jika ada)
    const navBtn = document.getElementById('pwa-nav-install-btn');
    if (navBtn) {
        navBtn.style.display = 'inline-flex';
    }

    // Banner floating di bawah layar (jika belum pernah ditutup)
    const isDismissed = sessionStorage.getItem('pwa_banner_dismissed') === '1';
    if (!isDismissed && !window.matchMedia('(display-mode: standalone)').matches) {
        renderInstallBanner();
    }
}

// 4. Buat Banner Unduh / Pasang Aplikasi secara Dinamis
function renderInstallBanner() {
    if (document.getElementById('pwa-floating-banner')) return;

    const banner = document.createElement('div');
    banner.id = 'pwa-floating-banner';
    banner.style.cssText = `
        position: fixed;
        bottom: 15px;
        left: 50%;
        transform: translateX(-50%);
        width: calc(100% - 30px);
        max-width: 440px;
        background: #1a252f;
        color: white;
        border-radius: 12px;
        padding: 12px 16px;
        box-shadow: 0 10px 30px rgba(0,0,0,0.4);
        z-index: 100000;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 12px;
        box-sizing: border-box;
        border: 1px solid #34495e;
        animation: pwaSlideUp 0.3s ease-out;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    `;

    const iconPath = window.location.pathname.includes('/pages/') ? '../assets/icons/icon-192.png' : 'assets/icons/icon-192.png';

    banner.innerHTML = `
        <div style="display: flex; align-items: center; gap: 10px; overflow: hidden;">
            <img src="${iconPath}" alt="Logo LapDok" style="width: 38px; height: 38px; border-radius: 8px; flex-shrink: 0; box-shadow: 0 2px 5px rgba(0,0,0,0.2);">
            <div style="overflow: hidden;">
                <div style="font-weight: 700; font-size: 13px; color: #ffffff; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">Pasang LapDok Kinerja</div>
                <div style="font-size: 11px; color: #bdc3c7; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">Akses cepat &amp; offline di layar utama HP</div>
            </div>
        </div>
        <div style="display: flex; align-items: center; gap: 6px; flex-shrink: 0;">
            <button onclick="installLapDokPWA()" style="background: linear-gradient(135deg, #00d2ff, #005b96); color: white; border: none; padding: 7px 12px; border-radius: 6px; font-weight: 700; font-size: 11.5px; cursor: pointer; transition: 0.2s;">
                📲 Pasang
            </button>
            <button onclick="dismissInstallBanner()" style="background: none; border: none; color: #95a5a6; font-size: 18px; line-height: 1; padding: 4px; cursor: pointer;">
                &times;
            </button>
        </div>
    `;

    document.body.appendChild(banner);
}

// 5. Eksekusi Pemicu Instalasi PWA
function installLapDokPWA() {
    if (!deferredPrompt) {
        // Jika di iOS Safari
        const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
        if (isIOS) {
            alert("📱 Cara Pasang di iPhone/iPad:\n\n1. Ketuk ikon Bagikan (Share 📤) di bilah bawah Safari.\n2. Gulir ke bawah lalu pilih 'Tambahkan ke Layar Utama' (Add to Home Screen ➕).\n3. Ketuk 'Tambah' di pojok kanan atas.");
            return;
        }
        alert("💡 Aplikasi LapDok dapat dipasang melalui menu browser Chrome:\n\nKetuk titik tiga (⋮) di pojok kanan atas browser > lalu pilih 'Tambahkan ke Layar Utama' atau 'Pasang Aplikasi'.");
        return;
    }

    // Tampilkan prompt bawaan sistem
    deferredPrompt.prompt();

    // Tunggu pilihan pengguna
    deferredPrompt.userChoice.then((choiceResult) => {
        if (choiceResult.outcome === 'accepted') {
            console.log('[PWA] Pengguna menyetujui pemasangan LapDok');
        } else {
            console.log('[PWA] Pengguna menolak pemasangan');
        }
        deferredPrompt = null;
        dismissInstallBanner();
    });
}

// 6. Tutup banner sementara
function dismissInstallBanner() {
    const banner = document.getElementById('pwa-floating-banner');
    if (banner) {
        banner.remove();
        sessionStorage.setItem('pwa_banner_dismissed', '1');
    }
}

// 7. Event saat aplikasi sukses terpasang
window.addEventListener('appinstalled', () => {
    console.log('[PWA] Aplikasi LapDok sukses dipasang di perangkat!');
    dismissInstallBanner();
    const navBtn = document.getElementById('pwa-nav-install-btn');
    if (navBtn) navBtn.style.display = 'none';
    alert("✅ Selamat! Aplikasi LapDok Kinerja telah berhasil dipasang di layar utama perangkat Anda.");
});
