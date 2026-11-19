// jarvis.js
const Jarvis = {
    isMuted: localStorage.getItem('jarvis_muted') === 'true',
    synth: window.speechSynthesis,

    init: function () {
        if (!this.synth) return;
        const btn = document.getElementById('btn-mute-toggle');
        const gate = document.getElementById('activation-gate');

        let hasActivated = localStorage.getItem('jarvis_active') === '1';

        if (hasActivated) {
            if (gate) gate.style.display = 'none';
            if (btn) {
                btn.style.display = 'block';
                this.updateBtnUI();
            }
        }
    },

    say: function (text) {
        if (this.isMuted || !this.synth) return;
        this.synth.cancel();

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'id-ID';
        utterance.rate = 1.3;
        utterance.pitch = 1.1;
        utterance.volume = 1.0; // Max volume

        this.synth.speak(utterance);
    },

    toggleMute: function () {
        this.isMuted = !this.isMuted;
        localStorage.setItem('jarvis_muted', this.isMuted);
        if (this.isMuted) this.synth.cancel();
        this.updateBtnUI();
    },

    updateBtnUI: function () {
        const btn = document.getElementById('btn-mute-toggle');
        if (btn) {
            btn.innerHTML = this.isMuted ? "🔊 Nyalakan Suara" : "🔇 Matikan Suara";
            btn.style.background = this.isMuted ? "#27ae60" : "#e74c3c";
        }
    },

    activate: function () {
        localStorage.setItem('jarvis_active', '1');
        this.isMuted = false;
        localStorage.setItem('jarvis_muted', 'false');

        this.say("Sistem aktif. Isi form.");

        const btn = document.getElementById('btn-mute-toggle');
        if (btn) {
            btn.style.display = 'block';
            this.updateBtnUI();
        }
    },

    pandu: function (tahap) {
        const pesan = {
            'home_welcome': "Halo! Selamat datang di aplikasi Lap Dok.",
            'tanggal': "Pilih tanggal.",
            'lokasi': "Set lokasi.",
            'foto_sebelum': "Masukkan foto sebelum.",
            'foto_proses': "Masukkan foto proses.",
            'foto_sesudah': "Masukkan sesudah.",
            'keterangan': "Isi keterangan.",
            'selesai': "Simpan riwayat.",
            'pilih_cetak': "Pilih laporan untuk dicetak.",
            'siap_cetak': "Laporan siap dicetak.",
            'memproses_pdf': "Memproses dokumen.",
            'hapus': "Laporan dihapus."
        };
        if (pesan[tahap]) this.say(pesan[tahap]);
    }
};

window.addEventListener('DOMContentLoaded', () => {
    Jarvis.init();
});