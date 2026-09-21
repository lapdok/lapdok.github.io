let itemCount = 0, map, marker, activeInputId, activeAddrId, tempCoords;
let cameraStream = null, activePreviewId = null, currentStage = null;
let wmInterval = null;
let editContextId = null;

// --- KONFIGURASI GEMINI AI API KEY (Encrypted for GitHub Protection) ---
let GEMINI_API_KEY = atob('QVEuQWI4Uk42S29XOGg3Z1N5UW94Y1JFWGVaQTZScG9ITGVVREFvRVRKcUhSZEp3YmwyUnc=');

function getGeminiApiKey() {
    return localStorage.getItem('gemini_api_key') || GEMINI_API_KEY;
}

function setGeminiApiKey(key) {
    localStorage.setItem('gemini_api_key', key);
    GEMINI_API_KEY = key;
}

function getWatermarkData(itemId) {
    const now = new Date();
    const dateStr = new Intl.DateTimeFormat('id-ID', { weekday: 'short', day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit' }).format(now);
    let gpsLat = "0.000000", gpsLng = "0.000000", addrText = "Alamat: Belum diset";
    
    if (itemId) {
        const gpsVal = document.getElementById(`gps-res-${itemId}`)?.value;
        const addrVal = document.getElementById(`addr-res-${itemId}`)?.innerText;
        if (gpsVal && gpsVal.includes('query=')) {
            const coords = gpsVal.split('query=')[1].split(',');
            gpsLat = parseFloat(coords[0]).toFixed(6);
            gpsLng = parseFloat(coords[1]).toFixed(6);
        }
        if (addrVal && addrVal !== "Alamat otomatis..." && !addrVal.includes("Menerjemahkan")) {
            addrText = addrVal;
        }
    }
    return { dateStr, gpsLat, gpsLng, addrText };
}

function applyWatermarkToCanvas(canvas, itemId) {
    const ctx = canvas.getContext('2d');
    const wm = getWatermarkData(itemId);
    
    ctx.shadowColor = 'rgba(0,0,0,0.8)';
    ctx.shadowBlur = 4;
    ctx.shadowOffsetX = 2;
    ctx.shadowOffsetY = 2;

    const padding = 20;

    const now = new Date();
    const hhmm = String(now.getHours()).padStart(2, '0') + ':' + String(now.getMinutes()).padStart(2, '0');
    const months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
    const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
    const ddMMyyyy = now.getDate() + ' ' + months[now.getMonth()] + ' ' + now.getFullYear();
    const dddd = days[now.getDay()];

    ctx.font = "bold 60px 'Arial Narrow', Arial, sans-serif";
    ctx.fillStyle = "white";
    let timeY = canvas.height - 70;
    ctx.fillText(hhmm, padding, timeY);

    let timeWidth = ctx.measureText(hhmm).width;

    let lineX = padding + timeWidth + 15;
    ctx.beginPath();
    ctx.moveTo(lineX, timeY - 50);
    ctx.lineTo(lineX, timeY + 2);
    ctx.strokeStyle = "#FFD700";
    ctx.lineWidth = 4;
    ctx.stroke();

    ctx.font = "bold 20px Arial";
    ctx.fillStyle = "white";
    let dateX = lineX + 15;
    ctx.fillText(ddMMyyyy, dateX, timeY - 25);
    ctx.fillText(dddd, dateX, timeY + 2);

    ctx.font = "14px Arial";
    ctx.fillStyle = "rgba(255, 255, 255, 0.9)";
    ctx.fillText(`GPS : ${wm.gpsLat}, ${wm.gpsLng}`, padding, timeY + 22);
    ctx.fillText(`Alamat: ${wm.addrText}`, padding, timeY + 40);
}

function formatIndoDate(dateString) {
    if (!dateString) return "Pilih tanggal...";
    return new Intl.DateTimeFormat('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }).format(new Date(dateString));
}

function getMonthYear(dateString) {
    if (!dateString) return "-";
    const d = new Date(dateString);
    const months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
    return months[d.getMonth()] + ' ' + d.getFullYear();
}

function updateMonthDisplay() {
    const firstDate = document.querySelector('.date-input')?.value;
    const display = document.getElementById('month-display');
    if (firstDate) {
        display.innerText = "Laporan Lembur Bulan: " + getMonthYear(firstDate);
    } else {
        display.innerText = "Laporan Lembur Bulan: -";
    }
}

function handleDateChange(id) {
    const val = document.getElementById(`date-in-${id}`).value;
    document.getElementById(`date-lbl-${id}`).innerText = formatIndoDate(val);
    updateMonthDisplay();
    saveDraft();
    Jarvis.pandu('lokasi');
}

function addNewJobItem() {
    itemCount++;
    const container = document.getElementById('job-container');
    const stages = ['sebelum', 'proses', 'sesudah'];
    let html = `
        <div class="job-item" id="item-${itemCount}">
            <div class="header-main" style="background:#e67e22;"><span>ITEM LEMBUR #${itemCount}</span><button onclick="this.closest('.job-item').remove(); saveDraft(); updateMonthDisplay();" style="background:none; border:1px solid white; color:white; font-size:9px;">Hapus</button></div>
            <div class="input-group">
                <div class="date-section">
                    <input type="date" class="date-input" id="date-in-${itemCount}" onchange="handleDateChange(${itemCount})">
                    <div id="date-lbl-${itemCount}" style="margin-top:5px; color:#e67e22; font-weight:bold;">Pilih tanggal...</div>
                    <div style="margin-top:10px;">
                        <label style="font-size:10px; font-weight:bold; color:#666;">NAMA PETUGAS:</label>
                        <input type="text" class="officer-input" id="officer-in-${itemCount}" oninput="saveDraft()" placeholder="Nama petugas..." style="width:100%; padding:8px; border:1px solid #ddd; border-radius:4px; font-size:11px;">
                    </div>
                    <div style="display:flex; gap:10px; margin-top:10px;">
                        <div style="flex:1;">
                            <label style="font-size:10px; font-weight:bold; color:#666;">WAKTU MULAI:</label>
                            <input type="time" class="time-input" id="time-start-${itemCount}" onchange="saveDraft()" style="width:100%; padding:8px; border:1px solid #ddd; border-radius:4px;">
                        </div>
                        <div style="flex:1;">
                            <label style="font-size:10px; font-weight:bold; color:#666;">WAKTU SELESAI:</label>
                            <input type="time" class="time-input" id="time-end-${itemCount}" onchange="saveDraft()" style="width:100%; padding:8px; border:1px solid #ddd; border-radius:4px;">
                        </div>
                    </div>
                </div>
                <button class="btn-map-trigger" onclick="openMap('gps-res-${itemCount}', 'addr-res-${itemCount}')">📍 Cari/Pusatkan Lokasi</button>
                <input type="text" class="gps-res" id="gps-res-${itemCount}" readonly placeholder="Koordinat...">
                <div class="address-output" id="addr-res-${itemCount}">Alamat otomatis...</div>
            </div>
            <div class="grid-header"><div>SEBELUM</div><div>PROSES</div><div>SESUDAH</div></div>
            <div class="grid-content">`;
    stages.forEach((s, idx) => {
        const labels = { 'sebelum': 'SEBELUM', 'proses': 'PROSES', 'sesudah': 'SESUDAH' };
        html += `
            <div class="column" data-label="${labels[s]}">
                <div class="photo-actions">
                    <button class="btn-photo" onclick="openCustomCamera('p${idx+1}-${itemCount}', '${s}')">📷</button>
                    <button class="btn-photo" onclick="document.getElementById('gal-${idx+1}-${itemCount}').click()">📁</button>
                </div>
                <input type="file" id="gal-${idx+1}-${itemCount}" accept="image/*" style="display:none" onchange="processGalleryImg(this, 'p${idx+1}-${itemCount}', '${s}')">
                <div class="image-preview" id="p${idx+1}-${itemCount}"><span>Preview</span></div>
            </div>`;
    });
    html += `</div>
            <div class="footer-section">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:6px;">
                    <label style="font-size:10px; font-weight:bold; color:#555;">KETERANGAN LEMBUR:</label>
                    <button type="button" onclick="triggerAiDescription(${itemCount})" style="background:#8e44ad; color:white; border:none; padding:4px 8px; border-radius:4px; font-size:10px; cursor:pointer; font-weight:bold;">✨ AI Deskripsi Gambar</button>
                </div>
                <textarea id="ta-${itemCount}" onfocus="Jarvis.pandu('keterangan')" oninput="saveDraft()" placeholder="Keterangan lembur akan terisi otomatis dari foto oleh AI Gemini, atau Anda bisa mengetiknya sendiri..."></textarea>
            </div>
        </div>`;
    container.insertAdjacentHTML('beforeend', html);
    Jarvis.pandu('tanggal');
}

function openMap(g, a) {
    activeInputId = g; activeAddrId = a;
    document.getElementById('map-modal').style.display = 'block';
    if (!map) {
        map = L.map('map-container').setView([-2.9691, 119.8972], 11);
        L.tileLayer('https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}', { maxZoom: 20 }).addTo(map);
        marker = L.marker([-2.9691, 119.8972], {draggable: true}).addTo(map);
        marker.on('dragend', (e) => setMapMarker(e.target.getLatLng().lat, e.target.getLatLng().lng));
        map.on('click', (e) => setMapMarker(e.latlng.lat, e.latlng.lng));
    }
    setTimeout(() => map.invalidateSize(), 300);
}

function getCurrentLocation() { if(map) map.locate({setView: true, maxZoom: 18}); }
function setMapMarker(lat, lng) {
    tempCoords = `${lat.toFixed(6)},${lng.toFixed(6)}`;
    if (marker) marker.setLatLng([lat, lng]);
}

async function confirmLocation() {
    if (!tempCoords) return;
    document.getElementById(activeInputId).value = `https://www.google.com/maps/search/?api=1&query=${tempCoords}`;
    document.getElementById(activeAddrId).innerText = "Menerjemahkan koordinat...";
    const [lat, lng] = tempCoords.split(',');
    fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`)
        .then(res => res.json())
        .then(data => document.getElementById(activeAddrId).innerText = data.display_name || "Lokasi tersimpan.")
        .catch(() => document.getElementById(activeAddrId).innerText = "Lokasi tersimpan.");
    saveDraft(); closeMap();
}

function closeMap() { document.getElementById('map-modal').style.display = 'none'; }

async function openCustomCamera(p, stage) { 
    activePreviewId = p; currentStage = stage;
    const itemId = p.split('-')[1];
    document.getElementById('cam-overlay').style.display = 'block';
    wmInterval = setInterval(() => {
        const wm = getWatermarkData(itemId);
        const now = new Date();
        const hhmm = String(now.getHours()).padStart(2, '0') + ':' + String(now.getMinutes()).padStart(2, '0');
        const months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
        const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
        document.getElementById('val-time').innerText = hhmm;
        document.getElementById('val-date').innerText = now.getDate() + ' ' + months[now.getMonth()] + ' ' + now.getFullYear();
        document.getElementById('val-day').innerText = days[now.getDay()];
        document.getElementById('val-gps').innerText = `GPS : ${wm.gpsLat}, ${wm.gpsLng}`;
        document.getElementById('val-addr').innerText = wm.addrText;
    }, 1000);

    try {
        cameraStream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
        document.getElementById('cam-video').srcObject = cameraStream;
        document.getElementById('cam-modal').style.display = 'block';
    } catch(e) { alert("Kamera tidak diizinkan."); }
}

function capturePhoto() {
    const video = document.getElementById('cam-video');
    const canvas = document.createElement('canvas');
    const MAX_DIM = 1000;
    let w = video.videoWidth, h = video.videoHeight;
    if (w > MAX_DIM || h > MAX_DIM) {
        if (w > h) { h = Math.floor(h * (MAX_DIM / w)); w = MAX_DIM; }
        else { w = Math.floor(w * (MAX_DIM / h)); h = MAX_DIM; }
    }
    canvas.width = w; canvas.height = h;
    const ctx = canvas.getContext('2d');
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    ctx.drawImage(video, 0, 0, w, h);
    
    const itemId = activePreviewId.split('-')[1];
    applyWatermarkToCanvas(canvas, itemId);

    const compressedDataUrl = (typeof SmartCompressor !== 'undefined') 
        ? SmartCompressor.compressCanvas(canvas, 1000, 0.75) 
        : canvas.toDataURL('image/jpeg', 0.8);

    document.getElementById(activePreviewId).innerHTML = `<img src="${compressedDataUrl}">`;
    saveDraft(); closeCamera();
    handleAutoNextStep(currentStage);

    // Auto-generate AI description only after stage 'sesudah' or when all photos are present
    const ta = document.getElementById(`ta-${itemId}`);
    if (currentStage === 'sesudah' && ta && (!ta.value.trim() || ta.value.startsWith('🤖'))) {
        triggerAiDescription(itemId);
    }
}

function processGalleryImg(input, p, stage) {
    const file = input.files[0];
    if(!file) return;
    const itemId = p.split('-')[1];
    
    if (typeof SmartCompressor !== 'undefined') {
        SmartCompressor.compressImageFile(file, 1000, 0.75).then(res => {
            const c = res.canvas;
            applyWatermarkToCanvas(c, itemId);
            const compressedDataUrl = SmartCompressor.compressCanvas(c, 1000, 0.75);
            document.getElementById(p).innerHTML = `<img src="${compressedDataUrl}">`;
            saveDraft(); handleAutoNextStep(stage);

            const ta = document.getElementById(`ta-${itemId}`);
            if (stage === 'sesudah' && ta && (!ta.value.trim() || ta.value.startsWith('🤖'))) {
                triggerAiDescription(itemId);
            }
        }).catch(err => {
            console.error("Kompresi galeri gagal:", err);
        });
    } else {
        const reader = new FileReader();
        reader.onload = (e) => {
            const img = new Image();
            img.onload = () => {
                const c = document.createElement('canvas');
                const maxDim = 1000;
                let w = img.width, h = img.height;
                if (w > h) { if (w > maxDim) { h *= maxDim / w; w = maxDim; } }
                else { if (h > maxDim) { w *= maxDim / h; h = maxDim; } }
                c.width = w; c.height = h;
                const ctx = c.getContext('2d');
                ctx.imageSmoothingEnabled = true;
                ctx.imageSmoothingQuality = 'high';
                ctx.drawImage(img, 0, 0, w, h);
                applyWatermarkToCanvas(c, itemId);
                document.getElementById(p).innerHTML = `<img src="${c.toDataURL('image/jpeg', 0.8)}">`;
                saveDraft(); handleAutoNextStep(stage);

                // Auto-generate AI description only after stage 'sesudah' or when all photos are present
                const ta = document.getElementById(`ta-${itemId}`);
                if (stage === 'sesudah' && ta && (!ta.value.trim() || ta.value.startsWith('🤖'))) {
                    triggerAiDescription(itemId);
                }
            };
            img.src = e.target.result;
        };
        reader.readAsDataURL(file);
    }
}

async function triggerAiDescription(itemId) {
    const ta = document.getElementById(`ta-${itemId}`);
    if (!ta) return;

    const imgElements = [
        document.getElementById(`p1-${itemId}`)?.querySelector('img'),
        document.getElementById(`p2-${itemId}`)?.querySelector('img'),
        document.getElementById(`p3-${itemId}`)?.querySelector('img')
    ].filter(img => img && img.src && img.src.startsWith('data:image'));

    if (imgElements.length === 0) {
        alert("Silakan ambil atau pilih foto terlebih dahulu!");
        return;
    }

    let key = getGeminiApiKey();
    if (!key) {
        alert("Fitur AI belum dikonfigurasi.");
        return;
    }

    // Pop-up input kata kunci pekerjaan terkait
    const userKeyword = prompt(
        "Masukkan kata kunci pekerjaan lembur (opsional):\nContoh: Perbaikan Pompa Air, Perawatan Generator, Pembenahan Kabel, dll."
    );

    let promptText = "Di bawah ini adalah foto-foto Rangkaian Kegiatan Pekerjaan Lembur (Sebelum, Proses, dan Sesudah).";
    if (userKeyword && userKeyword.trim()) {
        promptText += ` Fokus/kata kunci pekerjaan terkait: "${userKeyword.trim()}".`;
    }
    promptText += " Tugas Anda: Buatkan HANYA 1 (SATU) KALIMAT RINGKASAN UTUH yang merangkum keseluruhan kegiatan/pekerjaan tersebut untuk laporan lembur. DILARANG MEMBUAT POINT-POINT ATAU DESKRIPSI TERPISAH PER FOTO. Hasilkan HANYA 1 kalimat tunggal/majemuk yang padat, jelas, dan profesional dalam bahasa Indonesia.";

    const parts = [{ text: promptText }];

    imgElements.forEach(img => {
        const matches = img.src.match(/^data:(image\/\w+);base64,(.+)$/);
        if (matches) {
            parts.push({
                inline_data: {
                    mime_type: matches[1],
                    data: matches[2]
                }
            });
        }
    });

    const originalText = ta.value;
    ta.value = "🤖 Gemini AI sedang menganalisis foto...";
    ta.disabled = true;

    const candidateModels = ['gemini-flash-latest', 'gemini-2.5-flash', 'gemini-2.0-flash'];
    let lastError = null;
    let success = false;

    for (const model of candidateModels) {
        try {
            const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'X-goog-api-key': key 
                },
                body: JSON.stringify({ contents: [{ parts }] })
            });

            const data = await res.json();
            if (data.error) {
                lastError = data.error.message;
                console.warn(`Gemini Model [${model}] Error:`, data.error);
                continue;
            }

            const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
            if (text) {
                ta.value = text.trim();
                saveDraft();
                success = true;
                break;
            }
        } catch (err) {
            lastError = err.message;
        }
    }

    if (!success) {
        ta.value = originalText;
        if (lastError && (lastError.includes("not found") || lastError.includes("API key") || lastError.includes("INVALID_ARGUMENT"))) {
            alert("Gagal memanggil Gemini AI:\nAPI Key tidak valid atau belum diaktifkan.\n\nPastikan Anda mengambil API Key resmi dari Google AI Studio (https://aistudio.google.com/).");
            const newKey = prompt("Masukkan Gemini API Key resmi Anda (diawali 'AIzaSy...'):");
            if (newKey) setGeminiApiKey(newKey.trim());
        } else {
            alert("Gagal memanggil Gemini AI: " + (lastError || "Terjadi kesalahan jaringan."));
        }
    }

    ta.disabled = false;
}

function handleAutoNextStep(stage) {
    if(stage === 'sebelum') Jarvis.pandu('foto_proses');
    else if(stage === 'proses') Jarvis.pandu('foto_sesudah');
    else if(stage === 'sesudah') Jarvis.pandu('keterangan');
}

function closeCamera() { 
    if(cameraStream) cameraStream.getTracks().forEach(t => t.stop());
    if(wmInterval) clearInterval(wmInterval);
    document.getElementById('cam-modal').style.display = 'none'; 
}

async function saveDraft() {
    const items = [];
    document.querySelectorAll('.job-item').forEach(item => {
        const id = item.id.split('-')[1];
        items.push({
            workDate: document.getElementById(`date-in-${id}`).value,
            officer: document.getElementById(`officer-in-${id}`).value,
            timeStart: document.getElementById(`time-start-${id}`).value,
            timeEnd: document.getElementById(`time-end-${id}`).value,
            gps: document.getElementById(`gps-res-${id}`).value,
            addr: document.getElementById(`addr-res-${id}`).innerText,
            p1: document.getElementById(`p1-${id}`).querySelector('img')?.src || null,
            p2: document.getElementById(`p2-${id}`).querySelector('img')?.src || null,
            p3: document.getElementById(`p3-${id}`).querySelector('img')?.src || null,
            desc: document.getElementById(`ta-${id}`).value
        });
    });
    const subBidang = document.getElementById('sub-bidang').value;
    await localforage.setItem('lapdok_lembur_sub_bidang', subBidang);
    await localforage.setItem('lapdok_lembur_draft', items);
}

async function loadDraft() {
    editContextId = await localforage.getItem('lapdok_lembur_edit_context');
    if (editContextId) document.getElementById('edit-banner').style.display = 'block';
    
    const savedSub = await localforage.getItem('lapdok_lembur_sub_bidang');
    if (savedSub) document.getElementById('sub-bidang').value = savedSub;

    const saved = await localforage.getItem('lapdok_lembur_draft');
    if (!saved || saved.length === 0) { addNewJobItem(); return; }
    saved.forEach((data, index) => {
        addNewJobItem();
        const id = index + 1;
        document.getElementById(`date-in-${id}`).value = data.workDate || "";
        document.getElementById(`date-lbl-${id}`).innerText = formatIndoDate(data.workDate);
        if (document.getElementById(`officer-in-${id}`)) {
            document.getElementById(`officer-in-${id}`).value = data.officer || "";
        }
        document.getElementById(`time-start-${id}`).value = data.timeStart || "";
        document.getElementById(`time-end-${id}`).value = data.timeEnd || "";
        document.getElementById(`gps-res-${id}`).value = data.gps || "";
        document.getElementById(`addr-res-${id}`).innerText = data.addr || "Alamat otomatis...";
        document.getElementById(`ta-${id}`).value = data.desc || "";
        if(data.p1) document.getElementById(`p1-${id}`).innerHTML = `<img src="${data.p1}">`;
        if(data.p2) document.getElementById(`p2-${id}`).innerHTML = `<img src="${data.p2}">`;
        if(data.p3) document.getElementById(`p3-${id}`).innerHTML = `<img src="${data.p3}">`;
    });
    updateMonthDisplay();
}

async function saveToHistory() {
    const draft = await localforage.getItem('lapdok_lembur_draft') || [];
    if (!draft.length || draft.some(i => !i.workDate)) return alert("Mohon isi minimal satu item!");
    
    let history = await localforage.getItem('lapdok_history') || [];
    if (typeof history === 'string') history = JSON.parse(history);
    
    if (editContextId) history = history.filter(h => h.id !== parseFloat(editContextId));
    
    const monthLabel = getMonthYear(draft[0].workDate);
    const subBidang = document.getElementById('sub-bidang').value;
    
    history.push({ 
        id: Date.now(), 
        type: 'lembur',
        subBidang: subBidang,
        monthLabel: monthLabel,
        date: draft[0].workDate, 
        timestamp: formatIndoDate(new Date()), 
        data: draft 
    });
    
    await localforage.setItem('lapdok_history', history);
    await localforage.removeItem('lapdok_lembur_draft');
    await localforage.removeItem('lapdok_lembur_edit_context');
    alert("Laporan Lembur Berhasil disimpan!");
    location.href = "tampildata.html";
}

async function cancelEdit() { 
    await localforage.removeItem('lapdok_lembur_draft'); 
    await localforage.removeItem('lapdok_lembur_edit_context'); 
    location.reload(); 
}

window.onload = async () => { 
    await loadDraft(); 
    if(typeof Jarvis !== 'undefined') Jarvis.activate();
};
