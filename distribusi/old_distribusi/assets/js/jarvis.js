const Jarvis = {
    activated: false,
    muted: localStorage.getItem('jarvis_muted') === 'true',
    synth: window.speechSynthesis,
    
    activate: function() {
        this.activated = true;
        console.log("Jarvis: Sistem suara diaktifkan.");
    },

    toggleMute: function() {
        this.muted = !this.muted;
        localStorage.setItem('jarvis_muted', this.muted);
        if (this.muted) this.synth.cancel();
        return this.muted;
    },
    
    say: function(text) {
        if (!this.activated || this.muted) {
            console.log("Jarvis: Suara diabaikan (Belum aktif/Muted).");
            return;
        }
        
        this.synth.cancel();
        
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'id-ID'; 
        utterance.pitch = 1;
        utterance.rate = 1.4;
        
        this.synth.speak(utterance);
    }
};

window.Jarvis = Jarvis;
