/**
 * Real-time Device Counter using Firebase (Lite)
 * Fitur ini memantau perangkat yang sedang aktif secara real-time.
 */

// CONFIGURATION:
// Step 1: Login to console.firebase.google.com
// Step 2: Regenerate your API key if it was leaked.
// Step 3: RESTRICT your API key to your domain (jarvis-id.github.io/*) in Google Cloud Console.
const firebaseConfig = {
    apiKey: atob("QUl6YVN5Q2g5UnNveV9tTHlLVXFJWmFRWGN4b3czUTc5ZHYwMFpF"), // Decoded automatically at runtime
    authDomain: "lapdok-live.firebaseapp.com",
    databaseURL: "https://lapdok-live-default-rtdb.asia-southeast1.firebasedatabase.app/",
    projectId: "lapdok-live",
    storageBucket: "lapdok-live.firebasestorage.app",
    messagingSenderId: "813384988119",
    appId: "1:813384988119:web:48ac10346d6920a7e78792"
};

// --- LOGIKA PRESENCE ---
let activeRef = null;
let myPresenceRef = null;

// Fungsi untuk mendapatkan informasi browser dan perangkat (LAMA & MODERN)
function getBaseBrowserInfo() {
    const ua = navigator.userAgent;
    let browser = "Browser";
    let device = "Desktop";
    let brand = "";
    let model = "";
    let os = "OS";

    // 1. Deteksi OS dasar
    if (ua.includes("Windows")) os = "Windows";
    else if (ua.includes("Macintosh")) os = "macOS";
    else if (ua.includes("Android")) os = "Android";
    else if (ua.includes("iPhone") || ua.includes("iPad")) os = "iOS";
    else if (ua.includes("Linux")) os = "Linux";

    // 2. Deteksi Browser
    if (ua.includes("Firefox")) browser = "Firefox";
    else if (ua.includes("SamsungBrowser")) browser = "Samsung";
    else if (ua.includes("Opera") || ua.includes("OPR")) browser = "Opera";
    else if (ua.includes("Edge")) browser = "Edge";
    else if (ua.includes("Chrome")) browser = "Chrome";
    else if (ua.includes("Safari")) browser = "Safari";

    // 3. Deteksi Tipe Perangkat
    if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(ua)) {
        device = "Mobile";
    }
    if (/iPad|tablet/i.test(ua)) {
        device = "Tablet";
    }

    // 4. Deteksi Merek & Model (Parsing Teks)
    if (os === "iOS") {
        brand = "Apple";
        model = ua.includes("iPhone") ? "iPhone" : "iPad";
    } else if (os === "Android") {
        // Ekstraksi model dari Android UA: (Linux; Android 10; SM-G960F)
        const match = ua.match(/Android\s+[^;]+;\s+([^;)]+)/);
        if (match) {
            model = match[1].split('Build')[0].trim();
            if (/SM-|GT-|SHV-/i.test(model)) brand = "Samsung";
            else if (/Mi |Redmi/i.test(model)) brand = "Xiaomi";
            else if (/CPH|PCH|PB|PA/i.test(model)) brand = "Oppo";
            else if (/V20|V21|V19/i.test(model)) brand = "Vivo";
            else if (/RMX/i.test(model)) brand = "Realme";
        }
    } else {
        brand = os; // Desktop menggunakan OS sebagai merek
        model = os;
    }

    return { browser, device, brand, model, os };
}

// Fungsi pembungkus (Async) untuk mendapatkan data lebih akurat jika browser mendukung
async function getEnhancedInfo() {
    let info = getBaseBrowserInfo();

    // Gunakan modern User-Agent Client Hints jika tersedia (lebih akurat)
    if (navigator.userAgentData && navigator.userAgentData.getHighEntropyValues) {
        try {
            const hints = await navigator.userAgentData.getHighEntropyValues(['model', 'platform', 'platformVersion']);
            if (hints.model) info.model = hints.model;
            if (hints.platform) info.os = hints.platform;
        } catch (e) {}
    }
    
    console.log("Full Deteksi:", info);
    return info;
}

// Fungsi untuk mendapatkan lokasi via GPS (HTML5 Geolocation) dengan Fallback IP
async function getAccurateLocation() {
    return new Promise((resolve) => {
        if (!navigator.geolocation) {
            console.log("Geolocation tidak didukung browser.");
            resolve(getIpFallbackLocation());
            return;
        }

        const options = {
            enableHighAccuracy: true,
            timeout: 10000, // Tambah waktu ke 10 detik agar Desktop lebih stabil mengunci lokasi via Wi-Fi
            maximumAge: 0
        };

        navigator.geolocation.getCurrentPosition(
            async (pos) => {
                const lat = pos.coords.latitude;
                const lon = pos.coords.longitude;
                
                // Sinkronisasi Alamat: Ambil nama lokasi asli berdasarkan Koordinat (Reverse Geocoding)
                const realAddress = await getReverseGeocoding(lat, lon);
                
                resolve({
                    text: `${realAddress} (LOKASI GPS)`,
                    lat: lat,
                    lon: lon,
                    source: "GPS"
                });
            },
            async (err) => {
                console.warn(`GPS Error (${err.code}): ${err.message}. Menggunakan IP Fallback.`);
                resolve(await getIpFallbackLocation());
            },
            options
        );
    });
}

// Fungsi untuk mengubah Koordinat menjadi Alamat Nyata (Nominatim OpenStreetMap - Gratis Tanpa Kartu Kredit)
async function getReverseGeocoding(lat, lon) {
    try {
        // Menggunakan Nominatim (OSM) yang 100% gratis selamanya
        const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=18&addressdetails=1`, {
            headers: { 'Accept-Language': 'id' } 
        });
        const data = await response.json();
        
        if (data && data.address) {
            const a = data.address;
            // Menyusun alamat yang lebih manusiawi dan detail
            const jalan = a.road || a.suburb || "";
            const area = a.village || a.neighbourhood || a.suburb || "";
            const kota = a.city || a.regency || a.state || "";
            
            const fullAddr = [jalan, area, kota].filter(Boolean).join(", ");
            return fullAddr || "Lokasi Spesifik";
        }
        return "Alamat Terkunci (OSM)";
    } catch (e) {
        console.error("OSM Geocoding Error:", e);
        return "Alamat Terkunci";
    }
}

// Fungsi Cadangan jika GPS Gagal
async function getIpFallbackLocation() {
    try {
        const response = await fetch('https://ipapi.co/json/');
        const data = await response.json();
        return {
            text: `${data.city}, ${data.country_name}`,
            lat: data.latitude,
            lon: data.longitude,
            source: "IP"
        };
    } catch (e) {
        return { text: "Lokasi Tidak Diketahui", lat: 0, lon: 0, source: "None" };
    }
}

async function initCounter() {
    // 1. CEK FIREBASE KUNCI
    if (firebaseConfig.apiKey === "YOUR_API_KEY") {
        simulateLiveCounter();
        return;
    }

    try {
        const { initializeApp } = await import("https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js");
        const { getDatabase, ref, onValue, push, onDisconnect, set, serverTimestamp } = await import("https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js");

        const app = initializeApp(firebaseConfig);
        const db = getDatabase(app);
        activeRef = ref(db, 'presence');

        // 2. SELALU REKAM KEHADIRAN (Global di semua halaman)
        const info = await getEnhancedInfo();
        const locationData = await getAccurateLocation();

        myPresenceRef = push(activeRef);
        onDisconnect(myPresenceRef).remove();
        
        set(myPresenceRef, {
            last_online: serverTimestamp(),
            device: info.device,
            brand: info.brand,
            model: info.model,
            os: info.os,
            browser: info.browser,
            location: locationData.text,
            lat: locationData.lat,
            lon: locationData.lon,
            loc_source: locationData.source
        });

        // 3. PEMBATASAN UI: Hanya tampilkan daftar/widget di halaman Home
        const hasLiveCard = document.querySelector('.live-card');
        const isHomePath = location.pathname === "/" || location.pathname.endsWith("index.html") || location.pathname.endsWith("/");
        
        if (!hasLiveCard && !isHomePath) {
            console.log("Presence aktif (Invisible), UI daftar hanya aktif di Home.");
            return;
        }

        onValue(activeRef, (snapshot) => {
            const data = snapshot.val() || {};
            const devices = Object.values(data);
            updateCounterUI(devices.length, devices);
        });

    } catch (error) {
        console.error("FIREBASE ERROR:", error);
        simulateLiveCounter();
    }
}

function updateCounterUI(count, devices = []) {
    let countEl = document.getElementById('active-devices');
    
    if (!countEl) {
        injectCounterWidget();
        countEl = document.getElementById('active-devices');
    }

    if (countEl) {
        countEl.innerText = count;
        countEl.style.transform = "scale(1.2)";
        setTimeout(() => countEl.style.transform = "scale(1)", 300);
    }

    // Update Daftar Detail
    let listEl = document.getElementById('device-list');
    if (!listEl && countEl) {
        listEl = document.createElement('div');
        listEl.id = 'device-list';
        listEl.style.cssText = "border-top: 1px solid rgba(0,0,0,0.1); margin-top: 10px; padding-top: 10px; width: 100%; position: relative; z-index: 10;";
        
        const parent = countEl.closest('.live-card') || countEl.parentElement.parentElement;
        parent.style.flexWrap = "wrap"; 
        parent.appendChild(listEl);
    }

    if (listEl) {
        window._activeDevices = devices; 
        if (devices.length > 0) {
            listEl.innerHTML = `<strong>Rincian Perangkat (Klik untuk Peta):</strong><ul style="list-style:none; padding:0; margin:10px 0 0 0;">` +
                devices.map((d, index) => `
                    <li onclick='window.openMapModalByIndex(${index})' 
                        style="margin-bottom:8px; padding:10px; background:rgba(0,0,0,0.03); border-radius:8px; font-size:11px; border:1px solid rgba(0,0,0,0.05); color: #2c3e50; cursor:pointer; transition:all 0.2s; position:relative; z-index:20;"
                        onmouseover="this.style.background='rgba(52,152,219,0.1)'; this.style.borderColor='#3498db'; this.style.boxShadow='0 2px 8px rgba(0,0,0,0.05)';"
                        onmouseout="this.style.background='rgba(0,0,0,0.03)'; this.style.borderColor='rgba(0,0,0,0.05)'; this.style.boxShadow='none';"
                    >
                        <div style="display:flex; justify-content:space-between; align-items:center;">
                            <strong>${d.brand || ''} ${d.model || d.device || 'Perangkat Online'}</strong>
                            <span style="font-size:9px; background:#3498db; color:white; padding:2px 8px; border-radius:10px;">${d.browser || 'Browser'}</span>
                        </div>
                        <div style="color:#7f8c8d; margin-top:4px;">📍 ${d.location || 'Lokasi Tersembunyi'}</div>
                    </li>
                `).join('') + `</ul>`;
            listEl.style.display = "block";
        } else {
            listEl.style.display = "none";
        }
    }
}

// Fitur Peta Modal (Lampirkan ke Window)
let mapInstance = null;
window.openMapModalByIndex = function(index) {
    const device = window._activeDevices[index];
    if (!device || !device.lat || !device.lon) {
        alert("Koordinat lokasi tidak tersedia untuk perangkat ini.");
        return;
    }

    injectMapStyles();
    let modal = document.getElementById('traffic-map-modal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'traffic-map-modal';
        modal.innerHTML = `
            <div class="modal-bg" onclick="window.closeTrafficMap()"></div>
            <div class="modal-content">
                <div class="modal-header">
                    <span id="map-device-name">Detail Lokasi</span>
                    <button onclick="window.closeTrafficMap()">✕</button>
                </div>
                <div id="traffic-map-container" style="height: 300px; background: #eee;"></div>
                <div class="modal-footer" id="map-device-info"></div>
            </div>
        `;
        document.body.appendChild(modal);
    }

    document.getElementById('map-device-name').innerText = `${device.brand || ''} ${device.model || device.device}`;
    document.getElementById('map-device-info').innerText = `🌍 ${device.location} | 🔍 ${device.lat}, ${device.lon}`;
    modal.style.display = 'flex';

    if (typeof L === 'undefined') {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
        document.head.appendChild(link);

        const script = document.createElement('script');
        script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
        script.onload = () => initLeafletMap(device.lat, device.lon);
        document.head.appendChild(script);
    } else {
        initLeafletMap(device.lat, device.lon);
    }
};

window.closeTrafficMap = function() {
    const modal = document.getElementById('traffic-map-modal');
    if (modal) modal.style.display = 'none';
};

function initLeafletMap(lat, lon) {
    if (mapInstance) mapInstance.remove();
    setTimeout(() => {
        mapInstance = L.map('traffic-map-container').setView([lat, lon], 17); // Zoom lebih dalam untuk tampilan satelit
        
        // Menggunakan Google Maps Satellite Hybrid (Satelit + Label)
        L.tileLayer('http://{s}.google.com/vt/lyrs=s,h&x={x}&y={y}&z={z}', {
            maxZoom: 20,
            subdomains:['mt0','mt1','mt2','mt3'],
            attribution: '© Google Maps'
        }).addTo(mapInstance);
        
        L.marker([lat, lon]).addTo(mapInstance)
            .bindPopup('Posisi Pengunjung')
            .openPopup();
    }, 100);
}

function injectMapStyles() {
    if (document.getElementById('map-modal-css')) return;
    const style = document.createElement('style');
    style.id = 'map-modal-css';
    style.innerHTML = `
        #traffic-map-modal {
            position: fixed; top: 0; left: 0; width: 100%; height: 100%;
            display: none; align-items: center; justify-content: center; z-index: 9999999;
        }
        .modal-bg { position: absolute; width: 100%; height: 100%; background: rgba(0,0,0,0.5); backdrop-filter: blur(5px); }
        .modal-content {
            position: relative; width: 90%; max-width: 500px; background: white;
            border-radius: 12px; overflow: hidden; box-shadow: 0 20px 60px rgba(0,0,0,0.3);
            animation: modalPop 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
            z-index: 1000;
        }
        .modal-header { padding: 15px; border-bottom: 1px solid #eee; display: flex; justify-content: space-between; align-items: center; }
        .modal-header span { font-weight: bold; font-size: 14px; color: #2c3e50; }
        .modal-header button { background: none; border: none; font-size: 20px; cursor: pointer; color: #95a5a6; }
        .modal-footer { padding: 12px; font-size: 11px; color: #7f8c8d; background: #f9f9f9; text-align: center; }
        @keyframes modalPop { from { transform: scale(0.8); opacity: 0; } to { transform: scale(1); opacity: 1; } }
    `;
    document.head.appendChild(style);
}

function injectCounterWidget() {
    const widgetHTML = `
        <div id="dynamic-live-counter" style="
            background: white; border-radius: 12px; padding: 15px; margin: 20px auto;
            max-width: 450px; box-shadow: 0 4px 15px rgba(0,0,0,0.1);
            font-family: sans-serif; border: 1px solid #eee;
        ">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px;">
                <div style="display:flex; align-items:center; gap:10px;">
                    <div style="width:10px; height:10px; background:#2ecc71; border-radius:50%; box-shadow:0 0 5px #2ecc71;"></div>
                    <span style="font-size:10px; font-weight:bold; color:#7f8c8d; text-transform:uppercase; letter-spacing:1px;">Aktivitas Real-time</span>
                </div>
                <div>
                    <span id="active-devices" style="font-size:20px; font-weight:bold; color:#2c3e50;">1</span>
                    <span style="font-size:12px; color:#95a5a6; margin-left:5px;">Online</span>
                </div>
            </div>
            <div id="device-list" style="border-top:1px solid #eee; padding-top:10px; display:none;"></div>
        </div>
    `;

    const container = document.querySelector('.main-content') || document.querySelector('.container') || document.body;
    const actionCard = document.querySelector('.action-card');
    const wrapper = document.createElement('div');
    wrapper.innerHTML = widgetHTML;
    const widget = wrapper.firstElementChild;
    
    if (actionCard && actionCard.parentNode === container) {
        // Jika ada kartu asisten suara, letakkan di bawahnya
        actionCard.parentNode.insertBefore(widget, actionCard.nextSibling);
    } else if (container.firstChild) {
        container.insertBefore(widget, container.firstChild);
    } else {
        container.appendChild(widget);
    }
}

function simulateLiveCounter() {
    updateCounterUI(1, [{ device: "Desktop", brand: "Windows", model: "PC", browser: "Chrome", location: "Jakarta, Indonesia", lat: -6.2, lon: 106.81 }]);
}

document.addEventListener('DOMContentLoaded', initCounter);
