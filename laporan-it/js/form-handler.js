function activateAndHide() {
    Jarvis.activate();
    document.getElementById('activation-gate').style.display = 'none';
}

const KPI_CATEGORIES = {
    'it_harian': {
        key: 'it_harian',
        title: 'Perawatan & Pemeliharaan Jaringan Internet, Perangkat Lunak/Keras, Edukasi Aplikasi',
        shortTitle: 'Pemeliharaan IT & Edukasi Aplikasi',
        frequency: 'Harian',
        beban: 'Sedang',
        target: '100 Persentase',
        unit: 'Persentase',
        defaultRealisasi: 100,
        badgeColor: '#27ae60',
        tupoksi: '1. Perawatan dan Penanganan Masalah Koneksi Internet\n2. Perawatan dan Penanganan Masalah Perangkat Komputasi\n3. Penanganan Kendala Teknis dan Pendampingan penggunaan sistem dan aplikasi semua pegawai (Kolaborasi TIM IT)\n4. Kolaborasi Tim IT dalam mengolah integrasi data sistem jika ada perubahan jadwal shift, struktur kerja dll.',
        photoLabels: ['SEBELUM', 'PROSES', 'SELESAI'],
        quickChips: [
            'Setting jadwal shift operator IPA dan pembaruan struktur sistem',
            'Troubleshooting koneksi internet dan optimalisasi WiFi kantor',
            'Pendampingan input aplikasi E-Kinerja dan fitur PDAMOne pada pegawai',
            'Perawatan PC kerja, update sistem operasi dan pembersihan sistem',
            'Konfigurasi printer jaringan dan sharing data internal'
        ],
        field1Label: 'PERANGKAT / APLIKASI YANG DITANGANI:',
        field1Placeholder: 'Contoh: PC Desktop, Router MikroTik, Aplikasi PDAM One, Presensi...',
        field2Label: 'PEGAWAI / UNIT YANG DIDAMPINGI:',
        field2Placeholder: 'Contoh: Operator IPA Bolu Rannu, Staf Keuangan, Unit Rantepao...',
        helpText: '💡 <strong>Indikator Harian</strong>: Laporkan pekerjaan pemeliharaan IT atau edukasi sistem per hari. Di form presensi, isi <strong>Realisasi: 100</strong>.'
    },
    'it_kendala_mingguan': {
        key: 'it_kendala_mingguan',
        title: 'Penanganan Kendala Komputasi/Jaringan dan Pelaporan Administrasi di Bidang Teknik & Unit',
        shortTitle: 'Kendala Jaringan & Administrasi Teknik',
        frequency: 'Mingguan',
        beban: 'Ringan',
        target: '100 Persentase',
        unit: 'Persentase',
        defaultRealisasi: 100,
        badgeColor: '#2980b9',
        tupoksi: 'Penanganan kendala komputasi dan jaringan serta penyusunan administrasi pelaporan kinerja di unit/bidang teknik secara mingguan.',
        photoLabels: ['SEBELUM', 'PROSES', 'SELESAI'],
        quickChips: [
            'Penanganan kendala komputasi dan jaringan di lingkungan Bidang Teknik',
            'Penyusunan dan rekapitulasi administrasi pelaporan kinerja bidang teknik mingguan',
            'Monitoring kestabilan transmisi data jaringan kantor pusat dan instalasi teknik',
            'Pemeriksaan log insiden jaringan dan penyelesaian kendala teknis 100%'
        ],
        field1Label: 'LINGKUP PENANGANAN & SISTEM:',
        field1Placeholder: 'Contoh: Jaringan LAN/WAN Bidang Teknik, Server Lokal, Database...',
        field2Label: 'DOKUMEN ADMINISTRASI YANG DISUSUN:',
        field2Placeholder: 'Contoh: Berkas rekapitulasi kinerja mingguan, laporan berkala bidang...',
        helpText: '💡 <strong>Indikator Mingguan</strong>: Laporan rekap penanganan gangguan dan administrasi per pekan. Di form presensi, isi <strong>Realisasi: 100</strong>.'
    },
    'cctv_mingguan': {
        key: 'cctv_mingguan',
        title: 'Pemantauan & Pemeliharaan & Pengembangan CCTV Perusahaan',
        shortTitle: 'Pemantauan & Maintenance CCTV',
        frequency: 'Mingguan',
        beban: 'Ringan',
        target: '3 Jumlah',
        unit: 'Jumlah',
        defaultRealisasi: 3,
        badgeColor: '#8e44ad',
        tupoksi: '1. Memantau keberfungsian CCTV Perusahaan\n2. Menyimpan/mengarsipkan data penting CCTV bila ada kejadian/urgensi\n3. Pengembangan dan pemeliharaan jaringan CCTV',
        photoLabels: ['SEBELUM', 'PROSES', 'SELESAI'],
        quickChips: [
            'Pemantauan status live view semua titik kamera CCTV kantor pusat & IPA',
            'Perbaikan gangguan tampilan kamera / resolusi warna / penataan koneksi NVR',
            'Pemeriksaan storage NVR dan pengarsipan rekaman video kejadian penting',
            'Pembersihan fisik lensa kamera dan optimalisasi sudut pandang pemantauan'
        ],
        field1Label: 'PERANGKAT CCTV / NVR:',
        field1Placeholder: 'Contoh: NVR Hikvision 16 Channel, Kamera IP IPA Buntu Pepasan...',
        field2Label: 'TITIK AREA / LOKASI PANTAUAN:',
        field2Placeholder: 'Contoh: Halaman Depan, Ruang Kasir, IPA Bolu, Pintu Masuk...',
        helpText: '💡 <strong>Indikator Mingguan (CCTV)</strong>: Mencakup 3 lingkup tupoksi CCTV (Monitoring, Backup, Maintenance). Di form presensi, isi <strong>Realisasi: 3</strong>.'
    },
    'insidentil_perusahaan': {
        key: 'insidentil_perusahaan',
        title: 'Tugas Lain-lain Perusahaan',
        shortTitle: 'Tugas Lain-lain (Insidentil)',
        frequency: 'Insidentil',
        beban: 'Sedang',
        target: '100 Persentase',
        unit: 'Persentase',
        defaultRealisasi: 100,
        badgeColor: '#d35400',
        tupoksi: 'Tugas tambahan yang dikerjakan diluar Tupoksi untuk mendukung kelancaran operasional dan pelayanan perusahaan atas instruksi khusus direktur/pimpinan.',
        photoLabels: ['SEBELUM', 'PROSES', 'SELESAI'],
        quickChips: [
            'Mengantar berkas surat dinas ke kantor ekspedisi TIKI untuk dikirim ke tujuan',
            'Mewakili perusahaan pada agenda rapat / kegiatan kedinasan Pemerintah Daerah',
            'Penugasan khusus operasional lapangan mendesak atas instruksi Direktur',
            'Pelaksanaan tugas tambahan kedinasan operasional perusahaan'
        ],
        field1Label: 'DASAR INSTRUKSI / DISPOSISI:',
        field1Placeholder: 'Contoh: Instruksi Direktur, Surat Tugas No. ..., Klausul 15 Tupoksi...',
        field2Label: 'TUJUAN / PIHAK PENERIMA:',
        field2Placeholder: 'Contoh: Kantor TIKI Rantepao (DAPENMA Pamsi), Kantor Bupati, Unit Pelayanan...',
        helpText: '💡 <strong>Indikator Insidentil</strong>: Diisi hanya saat ada instruksi tugas khusus dari Direksi/Perusahaan. Di form presensi, isi <strong>Realisasi: 100</strong>.'
    },
    'umum': {
        key: 'umum',
        title: 'Dokumentasi Fisik / Lapangan Umum',
        shortTitle: 'Dokumentasi Lapangan Umum',
        frequency: 'Fleksibel',
        beban: 'Standar',
        target: '100 Persentase',
        unit: 'Persentase',
        defaultRealisasi: 100,
        badgeColor: '#34495e',
        tupoksi: 'Dokumentasi kegiatan fisik operasional lapangan umum.',
        photoLabels: ['SEBELUM', 'PROSES', 'SELESAI'],
        quickChips: [
            'Perbaikan kebocoran pipa distribusi air minum',
            'Pemasangan sambungan baru pipa dinas pelanggan',
            'Pembersihan sedimentasi bak penampungan air IPA'
        ],
        field1Label: 'PERALATAN YANG DIGUNAKAN:',
        field1Placeholder: 'Contoh: Breaker, gergaji pipa, alat press...',
        field2Label: 'BAHAN MATERIAL:',
        field2Placeholder: 'Contoh: Pipa PVC 4", Clamp Saddle 4", Soket...',
        helpText: '💡 <strong>Mode Umum</strong>: Format dokumentasi 3 tahap klasik (Sebelum, Proses, Sesudah).'
    }
};

let currentKpiCategory = 'it_harian';

function getWeekRange(dateObj = new Date()) {
    const d = new Date(dateObj);
    const day = d.getDay();
    const diffToMonday = (day === 0 ? -6 : 1) - day;
    const monday = new Date(d);
    monday.setDate(d.getDate() + diffToMonday);
    monday.setHours(0, 0, 0, 0);

    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);
    sunday.setHours(23, 59, 59, 999);

    const nextMonday = new Date(monday);
    nextMonday.setDate(monday.getDate() + 7);

    const monDate = monday.getDate();
    const weekNum = Math.ceil(monDate / 7);

    const monthNames = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
    const monStr = `${monday.getDate()} ${monthNames[monday.getMonth()]} ${monday.getFullYear()}`;
    const sunStr = `${sunday.getDate()} ${monthNames[sunday.getMonth()]} ${sunday.getFullYear()}`;
    const rentang = `Senin, ${monStr} s/d Minggu, ${sunStr}`;
    const mingguKe = `Minggu ke-${weekNum} (${monthNames[monday.getMonth()]} ${monday.getFullYear()})`;
    const weekKey = `${monday.getFullYear()}-${String(monday.getMonth() + 1).padStart(2, '0')}-${String(monday.getDate()).padStart(2, '0')}`;
    const msDiff = nextMonday.getTime() - d.getTime();
    const daysRemaining = Math.max(1, Math.ceil(msDiff / (1000 * 60 * 60 * 24)));

    return { monday, sunday, nextMonday, rentang, mingguKe, weekKey, daysRemaining };
}

function getActiveKpiConfig() {
    return KPI_CATEGORIES[currentKpiCategory] || KPI_CATEGORIES['it_harian'];
}

function onKpiCategoryChange() {
    const sel = document.getElementById('kpi-category-select');
    if (!sel) return;
    currentKpiCategory = sel.value;
    updateKpiMetaDisplay();
    refreshJobItemLabels();
    checkWeeklyConfigVisibility();
    saveDraft();
}

function checkWeeklyConfigVisibility() {
    const cfg = getActiveKpiConfig();
    const weeklyBox = document.getElementById('weekly-config-card');
    if (weeklyBox) {
        if (cfg.frequency === 'Mingguan') {
            weeklyBox.style.display = 'block';
            
            // Set default minggu & rentang secara dinamis dari kalender
            const mKe = document.getElementById('weekly-minggu-ke');
            const rRentang = document.getElementById('weekly-rentang');
            const cEval = document.getElementById('weekly-catatan-evaluasi');

            const wr = getWeekRange(new Date());
            
            if (mKe && !mKe.value) {
                mKe.value = wr.mingguKe;
            }
            if (rRentang && !rRentang.value) {
                rRentang.value = wr.rentang;
            }
            if (cEval && !cEval.value) {
                cEval.value = cfg.key === 'cctv_mingguan' 
                    ? `Seluruh pemantauan kondisi live view kamera, pemeliharaan perangkat NVR/kabel, dan pengarsipan data CCTV telah diselesaikan sesuai target standar operasional.`
                    : `Seluruh laporan kinerja dan penanganan kendala komputasi/jaringan unit telah terekapitulasi dan tertangani dengan baik sehingga operasional pelayanan perusahaan berjalan normal.`;
            }
        } else {
            weeklyBox.style.display = 'none';
        }
    }
}

function updateKpiMetaDisplay() {
    const cfg = getActiveKpiConfig();
    const metaContainer = document.getElementById('kpi-meta-display');
    const helpContainer = document.getElementById('kpi-help-display');
    
    // Hitung periode berjalan (misal: Nov 2026)
    const now = new Date();
    const monthShort = now.toLocaleDateString('id-ID', { month: 'short', year: 'numeric' });
    
    if (metaContainer) {
        metaContainer.innerHTML = `
            <div class="kpi-meta-item">
                <span class="kpi-meta-label">Sifat Penugasan</span>
                <span class="kpi-badge" style="background:${cfg.badgeColor};">🔁 ${cfg.frequency}</span>
            </div>
            <div class="kpi-meta-item">
                <span class="kpi-meta-label">Beban Kerja</span>
                <span class="kpi-meta-val">${cfg.beban}</span>
            </div>
            <div class="kpi-meta-item">
                <span class="kpi-meta-label">Target Sistem</span>
                <span class="kpi-meta-val">${cfg.target}</span>
            </div>
            <div class="kpi-meta-item">
                <span class="kpi-meta-label">Default Realisasi</span>
                <span class="kpi-meta-val" style="color:#27ae60;">${cfg.defaultRealisasi} ${cfg.unit}</span>
            </div>
            <div class="kpi-meta-item">
                <span class="kpi-meta-label">Periode Aktif</span>
                <span class="kpi-meta-val">${monthShort}</span>
            </div>
            <div class="kpi-meta-item">
                <span class="kpi-meta-label">Pegawai</span>
                <span class="kpi-meta-val" style="color:#2c3e50;">DAVID PALIWAN, S.Kom</span>
            </div>
        `;
    }
    
    if (helpContainer) {
        helpContainer.innerHTML = cfg.helpText;
    }
}

function refreshJobItemLabels() {
    const cfg = getActiveKpiConfig();
    document.querySelectorAll('.job-item').forEach(item => {
        const id = item.id.split('-')[1];
        // Update header label tahapan foto
        const cols = item.querySelectorAll('.column');
        if (cols.length >= 3) {
            cols[0].setAttribute('data-label', cfg.photoLabels[0]);
            cols[1].setAttribute('data-label', cfg.photoLabels[1]);
            cols[2].setAttribute('data-label', cfg.photoLabels[2]);
        }
        const gridHeader = item.querySelector('.grid-header');
        if (gridHeader) {
            gridHeader.innerHTML = `<div>${cfg.photoLabels[0]}</div><div>${cfg.photoLabels[1]}</div><div>${cfg.photoLabels[2]}</div>`;
        }

        // Update label field 1 & 2
        const f1Lbl = document.getElementById(`lbl-field1-${id}`);
        if (f1Lbl) f1Lbl.innerText = cfg.field1Label;
        const f1In = document.getElementById(`alat-${id}`);
        if (f1In) f1In.placeholder = cfg.field1Placeholder;

        const f2Lbl = document.getElementById(`lbl-field2-${id}`);
        if (f2Lbl) f2Lbl.innerText = cfg.field2Label;
        const f2In = document.getElementById(`bahan-${id}`);
        if (f2In) f2In.placeholder = cfg.field2Placeholder;

        // Render quick chips
        renderQuickChips(id);
    });
}

function renderQuickChips(id) {
    const chipContainer = document.getElementById(`quick-chips-${id}`);
    if (!chipContainer) return;
    const cfg = getActiveKpiConfig();
    let chipsHtml = '';
    cfg.quickChips.forEach(chip => {
        chipsHtml += `<button type="button" class="quick-chip" onclick="applyQuickChip(${id}, '${chip.replace(/'/g, "\\'")}')">${chip}</button>`;
    });
    chipContainer.innerHTML = chipsHtml;
}

function applyQuickChip(id, text) {
    const ta = document.getElementById(`ta-${id}`);
    if (!ta) return;
    if (ta.value.trim() === '') {
        ta.value = text;
    } else {
        ta.value = ta.value.trim() + '. ' + text;
    }
    saveDraft();
}

let itemCount = 0, map, marker, activeInputId, activeAddrId, tempCoords;
let cameraStream = null, activePreviewId = null, currentStage = null;
let wmInterval = null;
let editContextId = null;
let currentFacingMode = 'environment'; // 'environment' = belakang, 'user' = depan

function getWatermarkData(itemId) {
    const now = new Date();
    const dateStr = new Intl.DateTimeFormat('id-ID', { weekday: 'short', day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit' }).format(now);
    let gpsLat = "0.000000", gpsLng = "0.000000", addrText = "Alamat: Belum diset";
    
    if (itemId) {
        const gpsVal = document.getElementById(`gps-res-${itemId}`)?.value;
        const addrVal = document.getElementById(`addr-res-${itemId}`)?.innerText;
        const lokasiVal = document.getElementById(`lokasi-objek-in-${itemId}`)?.value;
        if (gpsVal && gpsVal.includes('query=')) {
            const coords = gpsVal.split('query=')[1].split(',');
            gpsLat = parseFloat(coords[0]).toFixed(6);
            gpsLng = parseFloat(coords[1]).toFixed(6);
        }
        if (lokasiVal && lokasiVal.trim() && !lokasiVal.includes("Menerjemahkan")) {
            addrText = lokasiVal;
        } else if (addrVal && addrVal !== "Alamat otomatis..." && !addrVal.includes("Menerjemahkan")) {
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

    // Dapatkan Data Waktu
    const now = new Date();
    const hhmm = String(now.getHours()).padStart(2, '0') + ':' + String(now.getMinutes()).padStart(2, '0');
    const months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
    const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
    const ddMMyyyy = now.getDate() + ' ' + months[now.getMonth()] + ' ' + now.getFullYear();
    const dddd = days[now.getDay()];

    // 1. Gambar Waktu Besar (Kiri Bawah)
    ctx.font = "bold 60px 'Arial Narrow', Arial, sans-serif";
    ctx.fillStyle = "white";
    let timeY = canvas.height - 70; // Dinaikkan tinggi jembatannya agar muat 2 baris teks di bawah!
    ctx.fillText(hhmm, padding, timeY);

    // Mengukur lebar teks waktu untuk penentuan letak elemen berikutnya
    let timeWidth = ctx.measureText(hhmm).width;

    // 2. Gambar Garis Vertikal Kuning
    let lineX = padding + timeWidth + 15;
    ctx.beginPath();
    ctx.moveTo(lineX, timeY - 50); // Tarik atas
    ctx.lineTo(lineX, timeY + 2);  // Tarik bawah
    ctx.strokeStyle = "#FFD700";
    ctx.lineWidth = 4;
    ctx.stroke();

    // 3. Gambar Tanggal & Hari (Kanan)
    ctx.font = "bold 20px Arial";
    ctx.fillStyle = "white";
    let dateX = lineX + 15;
    ctx.fillText(ddMMyyyy, dateX, timeY - 25);
    ctx.fillText(dddd, dateX, timeY + 2);

    // 4. Gambar Keterangan GPS & Alamat (Kecil di bawah balok waktu)
    ctx.font = "14px Arial";
    ctx.fillStyle = "rgba(255, 255, 255, 0.9)";
    ctx.fillText(`GPS : ${wm.gpsLat}, ${wm.gpsLng}`, padding, timeY + 22);
    ctx.fillText(`Alamat: ${wm.addrText}`, padding, timeY + 40);
}

function formatIndoDate(dateString) {
    if (!dateString) return "Pilih tanggal...";
    return new Intl.DateTimeFormat('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }).format(new Date(dateString));
}

function handleDateChange(id) {
    const val = document.getElementById(`date-in-${id}`).value;
    document.getElementById(`date-lbl-${id}`).innerText = formatIndoDate(val);
    saveDraft();
    Jarvis.pandu('lokasi');
}

function addNewJobItem() {
    itemCount++;
    const container = document.getElementById('job-container');
    const cfg = getActiveKpiConfig();
    const today = new Date().toISOString().split('T')[0];
    const stages = ['sebelum', 'proses', 'sesudah'];

    let html = `
        <div class="job-item" id="item-${itemCount}">
            <div class="header-main">
                <span>ITEM #${itemCount} · <span style="font-weight:normal; opacity:0.9;">${cfg.shortTitle}</span></span>
                <button type="button" onclick="this.closest('.job-item').remove(); saveDraft();" style="background:none; border:1px solid white; color:white; font-size:9px; padding:3px 8px; border-radius:3px; cursor:pointer;">Hapus</button>
            </div>
            <div class="input-group">
                <div class="date-section">
                    <label style="font-size:10px; font-weight:bold; color:#2c3e50;">TANGGAL PELAKSANAAN:</label>
                    <input type="date" class="date-input" id="date-in-${itemCount}" value="${today}" onchange="handleDateChange(${itemCount})">
                    <div id="date-lbl-${itemCount}" style="margin-top:5px; color:#27ae60; font-weight:bold;">${formatIndoDate(today)}</div>
                    
                    <div class="item-officer-grid">
                        <div>
                            <label style="font-size:10px; font-weight:bold; color:#666;">NAMA PETUGAS / PELAPOR:</label>
                            <input type="text" class="officer-input" id="officer-in-${itemCount}" value="DAVID PALIWAN, S.Kom" oninput="saveDraft()" placeholder="Nama petugas..." style="width:100%; padding:8px; border:1px solid #ddd; border-radius:4px; font-size:11px; font-weight:bold; color:#2c3e50;">
                        </div>
                        <div>
                            <label style="font-size:10px; font-weight:bold; color:#27ae60;">REALISASI (*):</label>
                            <input type="number" id="realisasi-in-${itemCount}" value="${cfg.defaultRealisasi}" oninput="saveDraft()" style="width:100%; padding:8px; border:2px solid #27ae60; border-radius:4px; font-size:12px; font-weight:bold; color:#27ae60; text-align:center;">
                        </div>
                    </div>

                    <div class="item-submeta-grid">
                        <div>
                            <label style="font-size:10px; font-weight:bold; color:#666;">WAKTU (SEBELUM - SELESAI):</label>
                            <input type="text" id="waktu-in-${itemCount}" value="" oninput="saveDraft()" placeholder="Otomatis dari foto..." style="width:100%; padding:7px; border:1px solid #ddd; border-radius:4px; font-size:11px;">
                            <small style="font-size:8.5px; color:#27ae60; display:block; margin-top:2px;">⏱️ Terisi otomatis saat ambil foto</small>
                        </div>
                        <div>
                            <div style="display:flex; justify-content:space-between; align-items:center;">
                                <label style="font-size:10px; font-weight:bold; color:#2c3e50;">LOKASI / OBJEK:</label>
                                <button type="button" onclick="openMap('gps-res-${itemCount}', 'addr-res-${itemCount}')" style="background:none; border:none; color:#2980b9; font-size:9px; cursor:pointer; font-weight:bold; padding:0;">📍 Buka Peta</button>
                            </div>
                            <input type="text" id="lokasi-objek-in-${itemCount}" value="" oninput="saveDraft()" placeholder="📍 Otomatis dari titik peta lokasi..." style="width:100%; padding:7px; border:1px solid #ddd; border-radius:4px; font-size:11px;">
                            <small style="font-size:8.5px; color:#2980b9; display:block; margin-top:2px;">📍 Terisi otomatis berdasarkan titik yang ditandai di peta</small>
                        </div>
                        <div>
                            <label style="font-size:10px; font-weight:bold; color:#27ae60;">STATUS / HASIL:</label>
                            <input type="text" id="status-in-${itemCount}" value="Selesai & Normal" oninput="saveDraft()" placeholder="Status..." style="width:100%; padding:7px; border:1px solid #27ae60; border-radius:4px; font-size:11px; font-weight:bold; color:#27ae60;">
                        </div>
                    </div>
                </div>

                <button type="button" class="btn-map-trigger" onclick="openMap('gps-res-${itemCount}', 'addr-res-${itemCount}')">📍 Cari / Tandai Titik Lokasi Objek di Peta (GPS & Satelit)</button>
                <input type="text" class="gps-res" id="gps-res-${itemCount}" readonly placeholder="Koordinat GPS...">
                <div class="address-output" id="addr-res-${itemCount}">Alamat otomatis dari peta...</div>
            </div>

            ${currentKpiCategory === 'cctv_mingguan' ? `
            <div class="cctv-checklist-box" style="margin: 12px;">
                <div style="font-weight:bold; font-size:11px; color:#b7950b; margin-bottom:6px;">📋 CHECKLIST 3 POIN TUPOKSI CCTV MINGGUAN:</div>
                <label class="cctv-check-item">
                    <input type="checkbox" id="cctv-pt1-${itemCount}" checked onchange="saveDraft()">
                    <span><strong>Poin 1</strong>: Pemantauan Live View CCTV (Kantor Pusat, Gudang, IPA, Loket)</span>
                </label>
                <label class="cctv-check-item">
                    <input type="checkbox" id="cctv-pt2-${itemCount}" checked onchange="saveDraft()">
                    <span><strong>Poin 2</strong>: Pencadangan / Pengarsipan Rekaman Insiden Penting (Storage/NVR)</span>
                </label>
                <label class="cctv-check-item">
                    <input type="checkbox" id="cctv-pt3-${itemCount}" checked onchange="saveDraft()">
                    <span><strong>Poin 3</strong>: Pemeliharaan Fisik Kamera, Kebersihan Lensa & Koneksi Jaringan</span>
                </label>
            </div>
            ` : ''}

            <div class="grid-header">
                <div>${cfg.photoLabels[0]}</div>
                <div>${cfg.photoLabels[1]}</div>
                <div>${cfg.photoLabels[2]}</div>
            </div>
            <div class="grid-content">`;

    stages.forEach((s, idx) => {
        html += `
            <div class="column" data-label="${cfg.photoLabels[idx]}">
                <div class="photo-actions">
                    <button type="button" class="btn-photo" onclick="openCustomCamera('p${idx+1}-${itemCount}', '${s}')">📷 Kamera</button>
                    <button type="button" class="btn-photo" onclick="document.getElementById('gal-${idx+1}-${itemCount}').click()">📁 File</button>
                </div>
                <input type="file" id="gal-${idx+1}-${itemCount}" accept="image/*" style="display:none" onchange="processGalleryImg(this, 'p${idx+1}-${itemCount}', '${s}')">
                <div class="image-preview" id="p${idx+1}-${itemCount}"><span>Preview</span></div>
            </div>`;
    });

    html += `</div>
            <div class="footer-section">
                <div class="quick-fill-box">
                    <div class="quick-fill-title">⚡ CONTOH CEPAT (Klik untuk menambahkan keterangan):</div>
                    <div class="quick-chip-container" id="quick-chips-${itemCount}"></div>
                </div>

                <div style="margin-bottom:6px; display:flex; justify-content:space-between; align-items:center;">
                    <label style="font-size:10px; font-weight:bold; color:#555;">KETERANGAN REALISASI PEKERJAAN:</label>
                    <small style="color:#7f8c8d; font-size:9px;">(Teks ini akan diupload ke presensi.amertatoraya.com)</small>
                </div>
                <textarea id="ta-${itemCount}" onfocus="Jarvis.pandu('keterangan')" oninput="saveDraft()" placeholder="Masukkan uraian tindakan teknis pekerjaan..."></textarea>
                
                <div style="margin-top:8px;">
                    <label style="font-size:10px; font-weight:bold; color:#555;" id="lbl-field1-${itemCount}">${cfg.field1Label}</label>
                    <textarea id="alat-${itemCount}" oninput="saveDraft()" rows="2" placeholder="${cfg.field1Placeholder}" style="width:100%; padding:8px; border:1px solid #ddd; border-radius:4px; font-size:11px; resize:vertical; box-sizing:border-box; margin-top:4px;"></textarea>
                </div>
                <div style="margin-top:8px;">
                    <label style="font-size:10px; font-weight:bold; color:#555;" id="lbl-field2-${itemCount}">${cfg.field2Label}</label>
                    <textarea id="bahan-${itemCount}" oninput="saveDraft()" rows="2" placeholder="${cfg.field2Placeholder}" style="width:100%; padding:8px; border:1px solid #ddd; border-radius:4px; font-size:11px; resize:vertical; box-sizing:border-box; margin-top:4px;"></textarea>
                </div>
            </div>
        </div>`;

    container.insertAdjacentHTML('beforeend', html);
    renderQuickChips(itemCount);
    Jarvis.pandu('tanggal');
}

function openMap(g, a) {
    activeInputId = g; activeAddrId = a;
    const itemId = g.replace('gps-res-', '');
    document.getElementById('map-modal').style.display = 'block';

    // Periksa apakah item ini sudah memiliki koordinat sebelumnya
    const existingVal = document.getElementById(g)?.value || '';
    let initLat = -2.9691, initLng = 119.8972, initZoom = 13;
    if (existingVal && existingVal.includes('query=')) {
        const parts = existingVal.split('query=')[1].split(',');
        if (parts.length >= 2) {
            const pLat = parseFloat(parts[0]), pLng = parseFloat(parts[1]);
            if (!isNaN(pLat) && !isNaN(pLng)) {
                initLat = pLat; initLng = pLng; initZoom = 17;
            }
        }
    }

    if (!map) {
        map = L.map('map-container').setView([initLat, initLng], initZoom); // Center: Rantepao (Torut)

        L.tileLayer('https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}', {
            keepBuffer: 4,
            updateWhenIdle: true,
            maxZoom: 20
        }).addTo(map);

        // Fetch Data Poligon Wilayah Kabupaten Toraja Utara (OSM Nominatim)
        fetch('https://nominatim.openstreetmap.org/search.php?q=Toraja+Utara&polygon_geojson=1&format=jsonv2')
        .then(res => res.json())
        .then(data => {
            if(data && data.length > 0 && data[0].geojson) {
                L.geoJSON(data[0].geojson, {
                    style: {
                        color: '#ff3333', // Merah terang
                        weight: 3,        // Ketebalan garis pinggir
                        opacity: 0.8,     // Transparansi garis
                        fillColor: '#ff0000', 
                        fillOpacity: 0.08, // Sangat transparan (Arsiran dalam merah tipis)
                        dashArray: '5, 8'  // Garis putus-putus
                    }
                }).addTo(map);
            }
        }).catch(e => console.warn("Gagal merender poligon referensi:", e));

        marker = L.marker([initLat, initLng], {draggable: true}).addTo(map);
        marker.on('dragend', function(e) {
            const latlng = e.target.getLatLng();
            setMapMarker(latlng.lat, latlng.lng);
        });
        map.on('click', (e) => setMapMarker(e.latlng.lat, e.latlng.lng));

        map.on('locationfound', function(e) {
            setMapMarker(e.latlng.lat, e.latlng.lng);
            const statusEl = document.getElementById('map-status');
            if (statusEl) statusEl.innerText = `GPS Terdeteksi: ${e.latlng.lat.toFixed(6)}, ${e.latlng.lng.toFixed(6)}`;
        });
        map.on('locationerror', function(e) {
            const statusEl = document.getElementById('map-status');
            if (statusEl) statusEl.innerText = "GPS perangkat tidak dapat diakses.";
        });
    } else {
        map.setView([initLat, initLng], initZoom);
        if (marker) marker.setLatLng([initLat, initLng]);
    }

    setMapMarker(initLat, initLng);
    setTimeout(() => map.invalidateSize(), 300);
}

function getCurrentLocation() { 
    if(map) map.locate({setView: true, maxZoom: 18, enableHighAccuracy: true, maximumAge: 10000, timeout: 5000}); 
}

function setMapMarker(lat, lng) {
    tempCoords = `${lat.toFixed(6)},${lng.toFixed(6)}`;
    if (marker) marker.setLatLng([lat, lng]);
    else marker = L.marker([lat, lng]).addTo(map);
    const statusEl = document.getElementById('map-status');
    if (statusEl) statusEl.innerText = `Titik terpilih: ${tempCoords}`;
}

async function confirmLocation() {
    if (!tempCoords) return;
    const itemId = activeInputId.replace('gps-res-', '');
    const gpsInput = document.getElementById(activeInputId);
    const addrDiv = document.getElementById(activeAddrId);
    const lokasiInput = document.getElementById(`lokasi-objek-in-${itemId}`);

    if (gpsInput) gpsInput.value = `https://www.google.com/maps/search/?api=1&query=${tempCoords}`;
    if (addrDiv) addrDiv.innerText = "Menerjemahkan koordinat ke alamat...";
    if (lokasiInput) {
        lokasiInput.value = "Menerjemahkan alamat peta...";
    }

    closeMap();

    const [lat, lng] = tempCoords.split(',');
    try {
        const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`);
        const data = await res.json();
        
        let readableAddr = "";
        if (data && data.address) {
            const a = data.address;
            const parts = [];
            const place = a.amenity || a.building || a.office || a.shop || a.tourism || '';
            const road = a.road || a.pedestrian || a.path || '';
            const locality = a.village || a.suburb || a.neighbourhood || a.hamlet || '';
            const district = a.city_district || a.district || a.municipality || a.town || '';
            const regency = a.county || a.city || '';
            
            if (place) parts.push(place);
            if (road && road !== place) parts.push(road);
            if (locality && locality !== road) parts.push(locality);
            if (district && district !== locality) parts.push(district);
            if (regency && regency !== district) parts.push(regency);
            
            if (parts.length > 0) readableAddr = parts.join(', ');
        }
        
        const finalAddress = readableAddr || data.display_name || `Titik Koordinat: ${tempCoords}`;
        
        if (addrDiv) addrDiv.innerText = data.display_name || finalAddress;
        if (lokasiInput) {
            lokasiInput.value = finalAddress;
            lokasiInput.style.transition = 'all 0.3s';
            lokasiInput.style.backgroundColor = '#d4edda';
            lokasiInput.style.borderColor = '#27ae60';
            setTimeout(() => {
                lokasiInput.style.backgroundColor = '';
                lokasiInput.style.borderColor = '#ddd';
            }, 1800);
        }
    } catch(err) {
        console.error("Gagal reverse geocoding:", err);
        const fallback = `Koordinat: ${tempCoords}`;
        if (addrDiv) addrDiv.innerText = "Lokasi tersimpan (" + fallback + ")";
        if (lokasiInput && (lokasiInput.value.includes("Menerjemahkan") || !lokasiInput.value)) {
            lokasiInput.value = fallback;
        }
    }

    saveDraft();
    Jarvis.pandu('foto_sebelum');
}

function closeMap() { document.getElementById('map-modal').style.display = 'none'; }

async function openCustomCamera(p, stage) { 
    activePreviewId = p; currentStage = stage;
    Jarvis.pandu('foto_' + stage);
    const itemId = p.split('-')[1];

    document.getElementById('cam-overlay').style.display = 'block';
    wmInterval = setInterval(() => {
        const wm = getWatermarkData(itemId);
        const now = new Date();
        const hhmm = String(now.getHours()).padStart(2, '0') + ':' + String(now.getMinutes()).padStart(2, '0');
        
        const months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
        const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
        const ddMMyyyy = now.getDate() + ' ' + months[now.getMonth()] + ' ' + now.getFullYear();
        const dddd = days[now.getDay()];

        document.getElementById('val-time').innerText = hhmm;
        document.getElementById('val-date').innerText = ddMMyyyy;
        document.getElementById('val-day').innerText = dddd;
        document.getElementById('val-gps').innerText = `GPS : ${wm.gpsLat}, ${wm.gpsLng}`;
        document.getElementById('val-addr').innerText = wm.addrText;
    }, 1000);

    await startCameraStream();
    document.getElementById('cam-modal').style.display = 'block';
}

async function startCameraStream() {
    // Stop stream lama jika ada
    if (cameraStream) { cameraStream.getTracks().forEach(t => t.stop()); cameraStream = null; }
    try {
        cameraStream = await navigator.mediaDevices.getUserMedia({
            video: {
                facingMode: currentFacingMode,
                width: { ideal: 1920 },
                height: { ideal: 1080 }
            },
            audio: false
        });
        const video = document.getElementById('cam-video');
        video.srcObject = cameraStream;
        // Sesuaikan ukuran video setelah metadata dimuat
        video.onloadedmetadata = () => { adjustVideoSize(); };
    } catch(e) {
        // Jika kamera yang diminta tidak tersedia, coba fallback
        try {
            cameraStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
            document.getElementById('cam-video').srcObject = cameraStream;
        } catch(e2) {
            alert('Kamera tidak dapat diakses. Pastikan izin kamera telah diberikan.');
        }
    }
}

function adjustVideoSize() {
    const video = document.getElementById('cam-video');
    const modal = document.getElementById('cam-modal');
    if (!video.videoWidth || !video.videoHeight) return;

    const screenW = window.innerWidth;
    const screenH = window.innerHeight;
    const videoRatio = video.videoWidth / video.videoHeight;
    const screenRatio = screenW / screenH;

    if (videoRatio > screenRatio) {
        // Video lebih lebar dari layar
        video.style.width = '100%';
        video.style.height = 'auto';
    } else {
        // Video lebih tinggi dari layar
        video.style.width = 'auto';
        video.style.height = '100%';
    }
}

async function flipCamera() {
    currentFacingMode = (currentFacingMode === 'environment') ? 'user' : 'environment';
    await startCameraStream();
}

function updateItemWorkTime(itemId, stage, dateObj = new Date()) {
    const waktuInput = document.getElementById(`waktu-in-${itemId}`);
    if (!waktuInput) return;

    const pad = (n) => String(n).padStart(2, '0');
    const timeStr = `${pad(dateObj.getHours())}:${pad(dateObj.getMinutes())}`;

    if (stage === 'sebelum') {
        waktuInput.setAttribute('data-start-time', timeStr);
    } else if (stage === 'sesudah' || stage === 'selesai') {
        waktuInput.setAttribute('data-end-time', timeStr);
    }

    const start = waktuInput.getAttribute('data-start-time');
    const end = waktuInput.getAttribute('data-end-time');

    if (start && end) {
        waktuInput.value = `${start} - ${end} WITA`;
    } else if (start && !end) {
        if (waktuInput.value && waktuInput.value.includes('-')) {
            const parts = waktuInput.value.split('-');
            const oldEnd = parts[1]?.trim();
            if (oldEnd && oldEnd !== '...' && oldEnd !== 'Selesai') {
                waktuInput.value = `${start} - ${oldEnd}`;
            } else {
                waktuInput.value = `${start} - Selesai`;
            }
        } else {
            waktuInput.value = `${start} - Selesai`;
        }
    } else if (!start && end) {
        waktuInput.value = `08:00 - ${end} WITA`;
    }

    saveDraft();
}

function capturePhoto() {
    const video = document.getElementById('cam-video');
    const canvas = document.createElement('canvas');
    
    // Logika Aspect Ratio Murni
    const MAX_DIM = 1000; // Resolusi teroptimasi untuk kompresi cerdas
    let w = video.videoWidth;
    let h = video.videoHeight;
    
    if (w > MAX_DIM || h > MAX_DIM) {
        if (w > h) {
            h = Math.floor(h * (MAX_DIM / w));
            w = MAX_DIM;
        } else {
            w = Math.floor(w * (MAX_DIM / h));
            h = MAX_DIM;
        }
    }
    
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext('2d');
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    ctx.drawImage(video, 0, 0, w, h);
    
    const itemId = activePreviewId.split('-')[1];
    // Terapkan Stempel Watermark
    applyWatermarkToCanvas(canvas, itemId);

    // Otomatisasi Waktu Pengerjaan berdasarkan waktu pengambilan foto Sebelum - Selesai
    if (currentStage === 'sebelum' || currentStage === 'sesudah' || currentStage === 'selesai') {
        updateItemWorkTime(itemId, currentStage, new Date());
    }

    // Kompresi Cerdas
    const compressedDataUrl = (typeof SmartCompressor !== 'undefined') 
        ? SmartCompressor.compressCanvas(canvas, 1000, 0.75) 
        : canvas.toDataURL('image/jpeg', 0.8);

    document.getElementById(activePreviewId).innerHTML = `<img src="${compressedDataUrl}">`;
    saveDraft(); closeCamera();
    handleAutoNextStep(currentStage);
}

function processGalleryImg(input, p, stage) {
    const file = input.files[0];
    if(!file) return;
    const itemId = p.split('-')[1];
    const photoTime = (file.lastModified && !isNaN(file.lastModified)) ? new Date(file.lastModified) : new Date();

    // Otomatisasi Waktu Pengerjaan berdasarkan metadata foto galeri Sebelum - Selesai
    if (stage === 'sebelum' || stage === 'sesudah' || stage === 'selesai') {
        updateItemWorkTime(itemId, stage, photoTime);
    }
    
    if (typeof SmartCompressor !== 'undefined') {
        SmartCompressor.compressImageFile(file, 1000, 0.75).then(res => {
            const c = res.canvas;
            // Watermark dinonaktifkan untuk foto galeri agar tidak memunculkan timemark
            const compressedDataUrl = SmartCompressor.compressCanvas(c, 1000, 0.75);
            document.getElementById(p).innerHTML = `<img src="${compressedDataUrl}">`;
            saveDraft();
            handleAutoNextStep(stage);
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
                let w = img.width;
                let h = img.height;
                if (w > h) {
                    if (w > maxDim) { h *= maxDim / w; w = maxDim; }
                } else {
                    if (h > maxDim) { w *= maxDim / h; h = maxDim; }
                }
                c.width = w; 
                c.height = h;
                const ctx = c.getContext('2d');
                ctx.imageSmoothingEnabled = true;
                ctx.imageSmoothingQuality = 'high';
                ctx.drawImage(img, 0, 0, w, h);
                // Watermark dinonaktifkan untuk foto galeri agar tidak memunculkan timemark
                document.getElementById(p).innerHTML = `<img src="${c.toDataURL('image/jpeg', 0.8)}">`;
                saveDraft();
                handleAutoNextStep(stage);
            };
            img.src = e.target.result;
        };
        reader.readAsDataURL(file);
    }
}

function handleAutoNextStep(stage) {
    if(stage === 'sebelum') Jarvis.pandu('foto_proses');
    else if(stage === 'proses') Jarvis.pandu('foto_sesudah');
    else if(stage === 'sesudah' || stage === 'selesai') Jarvis.pandu('keterangan');
}

function closeCamera() { 
    if(cameraStream) cameraStream.getTracks().forEach(t => t.stop());
    cameraStream = null;
    if(wmInterval) clearInterval(wmInterval);
    document.getElementById('cam-modal').style.display = 'none';
    currentFacingMode = 'environment'; // Reset ke kamera belakang
}

async function saveDraft() {
    const items = [];
    const cfg = getActiveKpiConfig();
    document.querySelectorAll('.job-item').forEach(item => {
        const id = item.id.split('-')[1];
        const wEl = document.getElementById(`waktu-in-${id}`);
        items.push({
            workDate: document.getElementById(`date-in-${id}`)?.value || "",
            officer: document.getElementById(`officer-in-${id}`)?.value || "DAVID PALIWAN, S.Kom",
            realisasi: document.getElementById(`realisasi-in-${id}`)?.value || cfg.defaultRealisasi,
            waktu: wEl?.value || "08:30 - 14:15",
            waktuStart: wEl?.getAttribute('data-start-time') || "",
            waktuEnd: wEl?.getAttribute('data-end-time') || "",
            lokasiObjek: document.getElementById(`lokasi-objek-in-${id}`)?.value || "",
            statusHasil: document.getElementById(`status-in-${id}`)?.value || "Selesai & Normal",
            gps: document.getElementById(`gps-res-${id}`)?.value || "",
            addr: document.getElementById(`addr-res-${id}`)?.innerText || "Alamat otomatis...",
            p1: document.getElementById(`p1-${id}`)?.querySelector('img')?.src || null,
            p2: document.getElementById(`p2-${id}`)?.querySelector('img')?.src || null,
            p3: document.getElementById(`p3-${id}`)?.querySelector('img')?.src || null,
            desc: document.getElementById(`ta-${id}`)?.value || "",
            alat: document.getElementById(`alat-${id}`)?.value || "",
            bahan: document.getElementById(`bahan-${id}`)?.value || "",
            cctvPt1: document.getElementById(`cctv-pt1-${id}`) ? document.getElementById(`cctv-pt1-${id}`).checked : true,
            cctvPt2: document.getElementById(`cctv-pt2-${id}`) ? document.getElementById(`cctv-pt2-${id}`).checked : true,
            cctvPt3: document.getElementById(`cctv-pt3-${id}`) ? document.getElementById(`cctv-pt3-${id}`).checked : true
        });
    });
    await localforage.setItem('lapdok_draft', items);
    await localforage.setItem('lapdok_draft_kpi_cat', currentKpiCategory);
    
    // Simpan Pengaturan Mingguan
    const weeklyMeta = {
        mingguKe: document.getElementById('weekly-minggu-ke')?.value || '',
        rentang: document.getElementById('weekly-rentang')?.value || '',
        catatanEvaluasi: document.getElementById('weekly-catatan-evaluasi')?.value || ''
    };
    await localforage.setItem('lapdok_draft_weekly_meta', weeklyMeta);
}

async function loadDraft() {
    editContextId = await localforage.getItem('lapdok_edit_context');
    let editItem = null;
    if (editContextId) {
        document.getElementById('edit-banner').style.display = 'block';
        let historyRaw = await localforage.getItem('lapdok_history') || [];
        let history = Array.isArray(historyRaw) ? historyRaw : (typeof historyRaw === 'string' ? JSON.parse(historyRaw || '[]') : []);
        editItem = history.find(h => h.id === parseFloat(editContextId));
        if (editItem && editItem.kpiCategory) {
            currentKpiCategory = editItem.kpiCategory;
            const sel = document.getElementById('kpi-category-select');
            if (sel) sel.value = currentKpiCategory;
        }
    } else {
        const urlParams = new URLSearchParams(window.location.search);
        const kpiUrlParam = urlParams.get('kpi');
        if (kpiUrlParam && KPI_CATEGORIES[kpiUrlParam]) {
            currentKpiCategory = kpiUrlParam;
            const sel = document.getElementById('kpi-category-select');
            if (sel) sel.value = currentKpiCategory;
        } else {
            const savedCat = await localforage.getItem('lapdok_draft_kpi_cat');
            if (savedCat && KPI_CATEGORIES[savedCat]) {
                currentKpiCategory = savedCat;
                const sel = document.getElementById('kpi-category-select');
                if (sel) sel.value = currentKpiCategory;
            }
        }
    }

    updateKpiMetaDisplay();
    checkWeeklyConfigVisibility();

    // Pulihkan Pengaturan Mingguan
    const savedWeekly = editItem?.weeklyMeta || await localforage.getItem('lapdok_draft_weekly_meta');
    if (savedWeekly) {
        if (document.getElementById('weekly-minggu-ke') && savedWeekly.mingguKe) {
            document.getElementById('weekly-minggu-ke').value = savedWeekly.mingguKe;
        }
        if (document.getElementById('weekly-rentang') && savedWeekly.rentang) {
            document.getElementById('weekly-rentang').value = savedWeekly.rentang;
        }
        if (document.getElementById('weekly-catatan-evaluasi') && savedWeekly.catatanEvaluasi) {
            document.getElementById('weekly-catatan-evaluasi').value = savedWeekly.catatanEvaluasi;
        }
    }

    const saved = await localforage.getItem('lapdok_draft');
    if (!saved || saved.length === 0) { 
        addNewJobItem(); 
        return; 
    }

    saved.forEach((data, index) => {
        addNewJobItem();
        const id = index + 1;
        if (data.workDate) {
            document.getElementById(`date-in-${id}`).value = data.workDate;
            document.getElementById(`date-lbl-${id}`).innerText = formatIndoDate(data.workDate);
        }
        if (document.getElementById(`officer-in-${id}`)) {
            document.getElementById(`officer-in-${id}`).value = data.officer || "DAVID PALIWAN, S.Kom";
        }
        if (document.getElementById(`realisasi-in-${id}`)) {
            document.getElementById(`realisasi-in-${id}`).value = data.realisasi !== undefined ? data.realisasi : getActiveKpiConfig().defaultRealisasi;
        }
        if (document.getElementById(`waktu-in-${id}`)) {
            const wIn = document.getElementById(`waktu-in-${id}`);
            wIn.value = data.waktu || "";
            if (data.waktuStart) wIn.setAttribute('data-start-time', data.waktuStart);
            if (data.waktuEnd) wIn.setAttribute('data-end-time', data.waktuEnd);
        }
        if (document.getElementById(`lokasi-objek-in-${id}`)) {
            document.getElementById(`lokasi-objek-in-${id}`).value = data.lokasiObjek || (data.addr && data.addr !== "Alamat otomatis..." && !data.addr.includes("Menerjemahkan") ? data.addr : "");
        }
        if (document.getElementById(`status-in-${id}`)) {
            document.getElementById(`status-in-${id}`).value = data.statusHasil || "Selesai & Normal";
        }
        if (document.getElementById(`gps-res-${id}`)) document.getElementById(`gps-res-${id}`).value = data.gps || "";
        if (document.getElementById(`addr-res-${id}`)) document.getElementById(`addr-res-${id}`).innerText = data.addr || "Alamat otomatis...";
        if (document.getElementById(`ta-${id}`)) document.getElementById(`ta-${id}`).value = data.desc || "";
        if (document.getElementById(`alat-${id}`)) document.getElementById(`alat-${id}`).value = data.alat || "";
        if (document.getElementById(`bahan-${id}`)) document.getElementById(`bahan-${id}`).value = data.bahan || "";
        if (data.p1 && document.getElementById(`p1-${id}`)) document.getElementById(`p1-${id}`).innerHTML = `<img src="${data.p1}">`;
        if (data.p2 && document.getElementById(`p2-${id}`)) document.getElementById(`p2-${id}`).innerHTML = `<img src="${data.p2}">`;
        if (data.p3 && document.getElementById(`p3-${id}`)) document.getElementById(`p3-${id}`).innerHTML = `<img src="${data.p3}">`;
        if (document.getElementById(`cctv-pt1-${id}`)) document.getElementById(`cctv-pt1-${id}`).checked = data.cctvPt1 !== false;
        if (document.getElementById(`cctv-pt2-${id}`)) document.getElementById(`cctv-pt2-${id}`).checked = data.cctvPt2 !== false;
        if (document.getElementById(`cctv-pt3-${id}`)) document.getElementById(`cctv-pt3-${id}`).checked = data.cctvPt3 !== false;
    });
}

async function saveToHistory() {
    await saveDraft();
    const draft = await localforage.getItem('lapdok_draft') || [];
    if (!draft.length || draft.some(i => !i.workDate)) return alert("Mohon isi minimal satu item pekerjaan dengan tanggal valid!");
    
    let historyRaw = await localforage.getItem('lapdok_history');
    let history = [];
    if (typeof historyRaw === 'string') {
        try { history = JSON.parse(historyRaw); } catch(e) {}
    } else if (Array.isArray(historyRaw)) {
        history = historyRaw;
    }
    if (editContextId) history = history.filter(h => h.id !== parseFloat(editContextId));

    const cfg = getActiveKpiConfig();
    const firstDate = draft[0].workDate;
    const dateObj = new Date(firstDate);
    const monthShort = isNaN(dateObj.getTime()) ? 'Bulan Ini' : dateObj.toLocaleDateString('id-ID', { month: 'short', year: 'numeric' });
    const realisasiVal = draft[0].realisasi !== undefined ? draft[0].realisasi : cfg.defaultRealisasi;

    const weeklyMeta = {
        mingguKe: document.getElementById('weekly-minggu-ke')?.value || `Minggu ke-3 (${dateObj.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })})`,
        rentang: document.getElementById('weekly-rentang')?.value || `Senin, 16 November 2026 s/d Minggu, 22 November 2026`,
        catatanEvaluasi: document.getElementById('weekly-catatan-evaluasi')?.value || `Seluruh kegiatan penanganan kendala komputasi dan administrasi pelaporan kinerja bidang teknik telah diselesaikan 100% tuntas.`
    };

    const newEntry = { 
        id: Date.now(),
        type: 'kpi',
        kpiCategory: currentKpiCategory,
        kpiTitle: cfg.title,
        kpiShortTitle: cfg.shortTitle,
        kpiFrequency: cfg.frequency,
        kpiBeban: cfg.beban,
        kpiTarget: cfg.target,
        kpiUnit: cfg.unit,
        kpiTupoksi: cfg.tupoksi,
        realisasi: realisasiVal,
        officer: draft[0].officer || "DAVID PALIWAN, S.Kom",
        date: firstDate,
        monthLabel: monthShort,
        timestamp: formatIndoDate(firstDate),
        weeklyMeta: weeklyMeta,
        data: draft 
    };

    history.push(newEntry);
    await localforage.setItem('lapdok_history', history);

    if (cfg.frequency === 'Mingguan') {
        const wr = getWeekRange(dateObj);
        let uploaded = await localforage.getItem('lapdok_uploaded_kpi') || {};
        const isCctv = currentKpiCategory === 'cctv_mingguan';
        const isCompleted = isCctv ? (draft.length >= 3) : true;

        uploaded[`${currentKpiCategory}_${wr.weekKey}`] = {
            category: currentKpiCategory,
            weekKey: wr.weekKey,
            rentang: weeklyMeta.rentang,
            mingguKe: weeklyMeta.mingguKe,
            uploadedAt: Date.now(),
            reportId: newEntry.id,
            itemCount: draft.length,
            isUploaded: isCompleted
        };
        await localforage.setItem('lapdok_uploaded_kpi', uploaded);

        if (isCctv && draft.length < 3) {
            alert(`Laporan CCTV disimpan ke Riwayat (${draft.length} kegiatan).\n\n⚠️ Catatan: Target indikator ini adalah minimal 3 kegiatan agar dinyatakan TUNTAS (saat ini kurang ${3 - draft.length} kegiatan lagi).`);
        } else if (isCctv && draft.length >= 3) {
            alert(`✅ Laporan CCTV Mingguan berhasil disimpan!\nTarget minimal 3 kegiatan telah terpenuhi (${draft.length} kegiatan) dan dinyatakan TUNTAS.`);
        } else {
            alert("Laporan KPI berhasil disimpan ke Riwayat!");
        }
    } else {
        alert("Laporan KPI berhasil disimpan ke Riwayat!");
    }

    await localforage.removeItem('lapdok_draft');
    await localforage.removeItem('lapdok_draft_kpi_cat');
    await localforage.removeItem('lapdok_draft_weekly_meta');
    await localforage.removeItem('lapdok_edit_context');
    Jarvis.pandu('selesai');
    location.href = "tampildata.html";
}

async function cancelEdit() { 
    await localforage.removeItem('lapdok_draft'); 
    await localforage.removeItem('lapdok_edit_context'); 
    location.reload(); 
}

window.onload = async () => { 
    // --- SKRIP PENYELAMAT DATA ---
    const oldHistory = localStorage.getItem('lapdok_history');
    if (oldHistory) {
        try {
            const parsedOld = JSON.parse(oldHistory);
            if (parsedOld && parsedOld.length > 0) {
                let currentHistoryRaw = await localforage.getItem('lapdok_history');
                let currentHistory = [];
                if (typeof currentHistoryRaw === 'string') {
                    try { currentHistory = JSON.parse(currentHistoryRaw); } catch(e) {}
                } else if (Array.isArray(currentHistoryRaw)) {
                    currentHistory = currentHistoryRaw;
                }

                const currentIds = currentHistory.map(h => h.id);
                const dataToMigrate = parsedOld.filter(h => !currentIds.includes(h.id));
                if (dataToMigrate.length > 0) {
                    await localforage.setItem('lapdok_history', [...currentHistory, ...dataToMigrate]);
                    console.log(`[Form Handler] Berhasil menyelamatkan ${dataToMigrate.length} laporan lama dari pages/ scope.`);
                }
            }
        } catch(e) { console.error("Gagal migrasi rekam jejak:", e); }
    }
    // -----------------------------
    await loadDraft(); 
};

// Responsif saat rotasi perangkat: sesuaikan ukuran video kamera secara otomatis
window.addEventListener('resize', () => {
    if (document.getElementById('cam-modal').style.display !== 'none') {
        adjustVideoSize();
    }
});
window.addEventListener('orientationchange', () => {
    setTimeout(() => {
        if (document.getElementById('cam-modal').style.display !== 'none') {
            adjustVideoSize();
        }
    }, 300); // Beri jeda agar browser selesai merotasi layar
});

