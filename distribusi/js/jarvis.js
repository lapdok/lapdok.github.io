// jarvis.js - SAPDI Voice Guide
const Jarvis = {
    isMuted: localStorage.getItem('jarvis_muted') === 'true',
    synth: window.speechSynthesis,
    init() {
        const gate = document.getElementById('activation-gate');
        const btn = document.getElementById('btn-mute-toggle');
        const hasActivated = localStorage.getItem('jarvis_active') === '1';
        if (hasActivated) {
            if (gate) gate.style.display = 'none';
            if (btn) { btn.style.display = 'block'; this.updateBtnUI(); }
        }
    },
    say(text) {
        if (this.isMuted || !this.synth) return;
        this.synth.cancel();
        const u = new SpeechSynthesisUtterance(text);
        u.lang = 'id-ID'; u.rate = 1.3; u.pitch = 1.1; u.volume = 1.0;
        this.synth.speak(u);
    },
    toggleMute() {
        this.isMuted = !this.isMuted;
        localStorage.setItem('jarvis_muted', this.isMuted);
        if (this.isMuted) this.synth.cancel();
        this.updateBtnUI();
    },
    updateBtnUI() {
        const btn = document.getElementById('btn-mute-toggle');
        if (btn) {
            btn.innerHTML = this.isMuted ? '🔊 Nyalakan Suara' : '🔇 Matikan Suara';
            btn.style.background = this.isMuted ? '#22C55E' : '#EF4444';
        }
    },
    activate() {
        localStorage.setItem('jarvis_active', '1');
        this.isMuted = false;
        localStorage.setItem('jarvis_muted', 'false');
        this.say('DIS-NRW aktif. Mulai dokumentasi.');
        const btn = document.getElementById('btn-mute-toggle');
        if (btn) { btn.style.display = 'block'; this.updateBtnUI(); }
    },
    pandu(tahap) {
        const pesan = {
            'welcome': 'Selamat datang di SAPDI.',
            'pilih_pekerjaan': 'Pilih jenis pekerjaan Anda.',
            'tanggal': 'Pilih tanggal pelaksanaan.',
            'lokasi': 'Tentukan lokasi pekerjaan.',
            'foto_apel': 'Ambil foto di barisan apel.',
            'foto_sebelum': 'Ambil foto kondisi sebelum pekerjaan.',
            'foto_proses': 'Ambil foto saat proses pekerjaan.',
            'foto_sesudah': 'Ambil foto kondisi sesudah pekerjaan.',
            'foto_valve': 'Dokumentasikan posisi valve.',
            'foto_tekanan': 'Ambil foto pengukuran tekanan.',
            'keterangan': 'Isi keterangan pekerjaan.',
            'selesai': 'Laporan berhasil disimpan!',
            'hapus': 'Laporan berhasil dihapus.'
        };
        if (pesan[tahap]) this.say(pesan[tahap]);
    }
};
window.addEventListener('DOMContentLoaded', () => Jarvis.init());
