document.addEventListener('DOMContentLoaded', function () {
  const initialLat = CONFIG.INITIAL_COORDS.lat;
  const initialLng = CONFIG.INITIAL_COORDS.lng;
  const defaultZoom = CONFIG.INITIAL_COORDS.defaultZoom;
  const gpsZoom = CONFIG.INITIAL_COORDS.gpsZoom;

  // 1. Layer Google Hybrid (Foto Satelit Asli Google + Nama Jalan / Label)
  const googleHybrid = L.tileLayer('https://{s}.google.com/vt/lyrs=y&x={x}&y={y}&z={z}', {
    maxZoom: 20,
    subdomains: ['mt0', 'mt1', 'mt2', 'mt3']
  });

  // 2. Layer Google Peta Jalan Standar
  const googleRoadmap = L.tileLayer('https://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}', {
    maxZoom: 20,
    subdomains: ['mt0', 'mt1', 'mt2', 'mt3']
  });

  // 3. Layer Google Kontur & Topografi Medan (Terrain)
  const googleTerrain = L.tileLayer('https://{s}.google.com/vt/lyrs=p&x={x}&y={y}&z={z}', {
    maxZoom: 20,
    subdomains: ['mt0', 'mt1', 'mt2', 'mt3']
  });

  // Inisialisasi Peta
  const map = L.map('map', {
    center: [initialLat, initialLng],
    zoom: defaultZoom,
    zoomControl: false,
    layers: [googleHybrid] // Default langsung menampilkan Satelit Google
  });

  // Tombol zoom di kiri atas
  L.control.zoom({ position: 'topleft' }).addTo(map);

  // Pengalih mode peta di kanan atas (Satelit, Jalan, & Kontur Topografi)
  const baseMaps = {
    "Google Satelit": googleHybrid,
    "Google Jalan": googleRoadmap,
    "Google Kontur / Medan": googleTerrain
  };
  L.control.layers(baseMaps, null, { position: 'topright' }).addTo(map);

  // Pin Penanda yang bisa digeser
  const marker = L.marker([initialLat, initialLng], { draggable: true }).addTo(map);

  // Fungsi update koordinat ke input form & display badge
  function setCoordinates(lat, lng) {
    document.getElementById('latitude').value = lat.toFixed(6);
    document.getElementById('longitude').value = lng.toFixed(6);
    document.getElementById('displayLat').innerText = lat.toFixed(5);
    document.getElementById('displayLng').innerText = lng.toFixed(5);
  }
  setCoordinates(initialLat, initialLng);

  // Saat pin digeser
  marker.on('dragend', function () {
    const pos = marker.getLatLng();
    setCoordinates(pos.lat, pos.lng);
  });

  // Saat peta diklik
  map.on('click', function (e) {
    marker.setLatLng(e.latlng);
    setCoordinates(e.latlng.lat, e.latlng.lng);
  });

  // Tombol Deteksi GPS
  const btnGps = document.getElementById('btnGps');
  if (btnGps) {
    btnGps.addEventListener('click', function () {
      if (!navigator.geolocation) {
        alert("GPS tidak didukung oleh browser Anda.");
        return;
      }

      btnGps.innerText = "Mencari...";

      navigator.geolocation.getCurrentPosition(
        function (pos) {
          btnGps.innerHTML = `
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="3"/><line x1="12" y1="2" x2="12" y2="5"/><line x1="12" y1="19" x2="12" y2="22"/><line x1="2" y1="12" x2="5" y2="12"/><line x1="19" y1="12" x2="22" y2="12"/></svg>
            Lokasi Saya`;
          const lat = pos.coords.latitude;
          const lng = pos.coords.longitude;
          map.setView([lat, lng], gpsZoom);
          marker.setLatLng([lat, lng]);
          setCoordinates(lat, lng);
        },
        function () {
          btnGps.innerHTML = `
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="3"/><line x1="12" y1="2" x2="12" y2="5"/><line x1="12" y1="19" x2="12" y2="22"/><line x1="2" y1="12" x2="5" y2="12"/><line x1="19" y1="12" x2="22" y2="12"/></svg>
            Lokasi Saya`;
          alert("Gagal membaca GPS. Pastikan izin lokasi telah diaktifkan di browser/perangkat Anda.");
        },
        { enableHighAccuracy: true, timeout: 10000 }
      );
    });
  }

  // ==========================================
  // LOGIKA CHECKBOX PERUNTUKAN BANGUNAN
  // ==========================================
  const form = document.getElementById('customerForm');
  const submitBtn = document.getElementById('submitBtn');
  const statusMsg = document.getElementById('statusMessage');

  const peruntukanCheckboxes = document.querySelectorAll('.cb-peruntukan');
  const peruntukanHidden = document.getElementById('peruntukan_bangunan');
  const cbLainnya = document.getElementById('cbLainnya');
  const peruntukanLainnyaWrapper = document.getElementById('peruntukanLainnyaWrapper');
  const peruntukanLainnyaInput = document.getElementById('peruntukan_lainnya');

  function syncPeruntukan() {
    const selected = [];
    peruntukanCheckboxes.forEach(cb => {
      if (cb.checked) {
        if (cb.id === 'cbLainnya') {
          const extra = peruntukanLainnyaInput.value.trim();
          selected.push(extra ? `Lainnya (${extra})` : 'Lainnya');
        } else {
          selected.push(cb.value);
        }
      }
    });
    peruntukanHidden.value = selected.join(', ');
  }

  peruntukanCheckboxes.forEach(cb => {
    cb.addEventListener('change', function () {
      const parent = this.closest('.checkbox-label');
      if (parent) {
        parent.classList.toggle('is-checked', this.checked);
      }
      if (this.id === 'cbLainnya') {
        if (this.checked) {
          peruntukanLainnyaWrapper.style.display = 'block';
          peruntukanLainnyaInput.focus();
        } else {
          peruntukanLainnyaWrapper.style.display = 'none';
          peruntukanLainnyaInput.value = '';
        }
      }
      syncPeruntukan();
    });
  });

  if (peruntukanLainnyaInput) {
    peruntukanLainnyaInput.addEventListener('input', syncPeruntukan);
  }

  // Reset form handler
  form.addEventListener('reset', function () {
    setTimeout(() => {
      peruntukanCheckboxes.forEach(cb => {
        const parent = cb.closest('.checkbox-label');
        if (parent) parent.classList.remove('is-checked');
      });
      peruntukanHidden.value = '';
      if (peruntukanLainnyaWrapper) peruntukanLainnyaWrapper.style.display = 'none';
      if (peruntukanLainnyaInput) peruntukanLainnyaInput.value = '';
      setCoordinates(initialLat, initialLng);
      marker.setLatLng([initialLat, initialLng]);
      map.setView([initialLat, initialLng], defaultZoom);
    }, 0);
  });

  // ==========================================
  // PENGIRIMAN DATA FORMULIR KE BACKEND
  // ==========================================
  const successModal = document.getElementById('successModal');
  const btnModalClose = document.getElementById('btnModalClose');

  function showSuccessModal() {
    if (successModal) {
      successModal.style.display = 'flex';
    }
  }

  function hideSuccessModal() {
    if (successModal) {
      successModal.style.display = 'none';
    }
  }

  if (btnModalClose) {
    btnModalClose.addEventListener('click', hideSuccessModal);
  }

  if (successModal) {
    successModal.addEventListener('click', function (e) {
      if (e.target === successModal) {
        hideSuccessModal();
      }
    });
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    const scriptUrl = CONFIG.SCRIPT_URL;

    if (!scriptUrl || scriptUrl.includes("ISI_DENGAN_GOOGLE")) {
      alert("Harap masukkan SCRIPT_URL Google Apps Script Anda terlebih dahulu di file js/config.js!");
      return;
    }

    submitBtn.disabled = true;
    submitBtn.innerText = "Mengirim...";
    statusMsg.style.display = "none";

    const formData = new FormData(form);

    fetch(scriptUrl, {
      method: 'POST',
      body: formData
    })
    .then(res => {
      if (!res.ok && res.status !== 0) {
        throw new Error(`HTTP status: ${res.status}`);
      }
      return res.json().catch(() => ({ status: 'success', message: 'Data pendaftaran berhasil terkirim!' }));
    })
    .then(res => {
      submitBtn.disabled = false;
      submitBtn.innerText = "Kirim Pendaftaran";

      if (res.status === 'success') {
        showSuccessModal();
        form.reset();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        throw new Error(res.message || "Gagal menyimpan data");
      }
    })
    .catch(err => {
      submitBtn.disabled = false;
      submitBtn.innerText = "Kirim Pendaftaran";
      // Google Apps Script melakukan redirect 302 yang kadang memicu blokir CORS browser lokal,
      // padahal data sudah sukses diterima dan disimpan di Google Sheets.
      if (err.message && (err.message.includes("Failed to fetch") || err.message.includes("NetworkError") || err.message.includes("Load failed"))) {
        showSuccessModal();
        form.reset();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        statusMsg.className = "status-msg status-error";
        statusMsg.innerText = "Gagal mengirim: " + err.message;
        statusMsg.style.display = "block";
      }
    });
  });
});
