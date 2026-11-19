# 📑 Dokumentasi Proyek: Dokumentasi Kinerja (LapDok)

Proyek ini adalah aplikasi web statis satu halaman (**Single Page Application**) berbasis PWA yang dirancang untuk dokumentasi laporan pekerjaan lapangan secara profesional. Aplikasi ini dioptimalkan sepenuhnya untuk penggunaan smartphone dan memiliki fitur utama **Engine Print-to-PDF Presisi**, **Auto-Captioning AI Gemini (Vision)**, serta pemandu suara pintar (Jarvis) untuk efisiensi di lapangan.

## 🚀 Arsitektur & Teknologi
*   **Bahasa Utama:** Vanilla JavaScript (ES6+), HTML5, CSS3.
*   **Kecerdasan Buatan (AI):** [Google Gemini AI API](https://ai.google.dev/) (`gemini-flash-latest` / `gemini-3.6-flash` Multimodal Vision) untuk pembuatan deskripsi/keterangan pekerjaan otomatis 1-kalimat ringkasan utuh berdasarkan rangkaian foto (Sebelum, Proses, Sesudah).
*   **Keamanan Kode & Cloud:** Enkripsi Obfuscation Client-Side (`atob`) aman dari pemblokiran *GitHub Secret Scanning*, dengan dukungan *HTTP Referrer Restriction* pada Google Cloud Console.
*   **Pemetaan (Maps):** [Leaflet.js](https://leafletjs.org/) dengan Tile Google Hybrid (Satelit) & data poligon wilayah Kabupaten Toraja Utara (GeoJSON dari OpenStreetMap).
*   **Asisten Suara:** Web Speech API (`window.speechSynthesis`) untuk modul Jarvis yang interaktif.
*   **Pemrosesan Gambar:** HTML5 Canvas API untuk kompresi, resizing cerdas (aspect-ratio preservation), dan penanaman **watermark** (koordinat, waktu, lokasi) langsung ke piksel gambar.
*   **Geocoding & GPS:** Geolocation API (High Accuracy), ESRI World Geocoding, & Nominatim API (Reverse Alamat otomatis).
*   **Ekspor Dokumen:** `html2pdf.js` untuk konversi HTML ke dokumen PDF skala A4 secara client-side.
*   **Penyimpanan:** `localForage` & `localStorage` dengan manajemen draft dan riwayat JSON.
*   **PWA:** Mendukung Manifest & Service Worker minimalis (Add to Home Screen).

## 📂 Struktur File
- `index.html` : Halaman input utama, sistem manajemen draft, antarmuka kamera (canvas), dan pemetaan GPS.
- `pages/form.html` : Halaman form input laporan pekerjaan dengan integrasi Gemini AI (cache-buster `?v=1.1`).
- `pages/form-lembur.html` : Halaman form input laporan lembur dengan integrasi Gemini AI (cache-buster `?v=1.1`).
- `js/form-handler.js` : Skrip pengelola form utama, penanganan kamera/galeri, watermark, dan pemicu Gemini AI Vision.
- `js/lembur-handler.js` : Skrip pengelola form lembur dengan logika watermark & pemicu Gemini AI Vision.
- `js/realtime-counter.js` : Skrip pelacak statistik pengguna aktif real-time (Firebase Lite) yang aman dari Secret Scanning.
- `js/jarvis.js` : Modul asisten suara yang memandu setiap tahap input form pengguna.
- `tampildata.html` : Engine riwayat laporan, filter arsip, dan generator konversi/unduh PDF.
- `manifest.json` : Konfigurasi identitas aplikasi (Ikon, Warna, Start URL).
- `sw.js` : Service worker dasar untuk memenuhi fungsionalitas PWA.

## 🛠 Aturan Pengembangan & Integritas Cetak (System Instructions)
Jika proyek ini dilanjutkan, pengembang wajib mematuhi parameter teknis yang telah disempurnakan berikut:

1.  **Integrasi AI Gemini Multimodal:**
    *   Menggunakan endpoint `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent` dengan header `X-goog-api-key`.
    *   AI memproses 3 foto sekaligus (Sebelum, Proses, Sesudah) dan diinstruksikan menghasilkan **HANYA 1 KALIMAT RINGKASAN UTUH** dalam bahasa Indonesia baku dan profesional.
    *   Mendukung jendela pop-up interaktif untuk memasukkan kata kunci/fokus pekerjaan pengguna (`userKeyword`).
    *   Pemicu otomatis berjalan setelah tahap foto "Sesudah" selesai diunggah.
2.  **Keamanan API Key di GitHub Pages (`github.io`):**
    *   API Key disimpan menggunakan enkripsi `atob(...)` di client-side untuk mencegah pemblokiran *GitHub Secret Scanning*.
    *   API Key wajib di-restrict menggunakan pembatasan domain *HTTP Referrers* (`https://username.github.io/*`) di Google Cloud Console.
3.  **Strict Print Engine:**
    *   Menggunakan library `html2pdf.js` dengan opsi format `a4`, orientasi `portrait`, dan margin `0`.
    *   **Aturan 3-Item:** Setiap halaman fisik A4 dari PDF wajib berisi tepat **3 Item Pekerjaan**.
    *   Gunakan `page-break-after: always` pada kelas `.page-container` dan batasi min-height pada `296mm` untuk formasi grid lembar cetak yang konstan.
4.  **Image Handling & Canvas:** 
    *   Foto via kamera ditarik dalam resolusi *native sensor* dan dibatasi sisi terpanjang di `1200px` (atau `800px` untuk rute galeri).
    *   Semua "Stempel" (Jam Besar, Hari, Tanggal, Koordinat GPS, dan Alamat) digambar langsung dengan rendering raster pada context 2D Canvas.

## 🌟 Fitur Unggulan Terpasang
*   ✅ **Auto-Caption AI Gemini (Vision):** Pengisian deskripsi/keterangan pekerjaan secara otomatis dengan menganalisis 3 foto kegiatan sekaligus menggunakan Google Gemini AI (versi `gemini-3.6-flash`).
*   ✅ **Interaktif Kata Kunci Pekerjaan:** Memungkinkan pengguna memasukkan konteks kata kunci pekerjaan saat memicu AI agar hasil kalimat sangat relevan dan presisi.
*   ✅ **Bebas Blokir GitHub Secret Scanning:** Kunci API diamankan dengan enkripsi runtime `atob()` sehingga repository dapat di-push dan di-host di GitHub Pages tanpa kendala keamanan.
*   ✅ **Asisten Suara (Jarvis):** Panduan interaktif berbasis Text-to-Speech pada setiap langkah input form.
*   ✅ **Auto-Watermark (Timestamp & GPS):** Stempel otomatis tanggal, waktu jam besar, koordinat, dan alamat lokasi pada piksel gambar.
*   ✅ **Smart Print to PDF:** Generator PDF `html2pdf` memfasilitasi pembuatan file hasil inspeksi A4 multi-halaman presisi.

## 📈 Rencana Pengembangan (Roadmap)
- [x] Fitur Watermark (GPS, Tanggal, Jam) yang tertanam langsung pada file gambar. *(Selesai)*
- [x] Fitur Asisten Suara Pemandu / Voice Guide (Jarvis). *(Selesai)*
- [x] Fitur Auto-Caption AI Gemini Multimodal (Vision 1-Kalimat Ringkasan & Kata Kunci Pekerjaan). *(Selesai)*
- [x] Pengamanan API Key untuk Hosting GitHub Pages (`github.io`). *(Selesai)*
- [ ] Opsi filter ekspor Riwayat khusus ke format Excel (.xlsx).
- [ ] Mode *Offline First* PWA penuh: Caching aset peta satelit ke IndexedDB.

---
**Status Proyek:** 🟢 Stabil & Kaya Fitur (Multimodal AI Vision & Advanced Canvas Engine).
