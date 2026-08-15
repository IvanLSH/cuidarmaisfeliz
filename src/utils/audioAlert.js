// Web Audio API Synthesizer for Emergency Alarm Siren
class EmergencyAudioAlert {
  constructor() {
    this.audioCtx = null;
    this.oscillator = null;
    this.gainNode = null;
    this.intervalId = null;
    this.isPlaying = false;
  }

  start() {
    if (this.isPlaying) return;
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      this.audioCtx = new AudioCtx();

      this.oscillator = this.audioCtx.createOscillator();
      this.gainNode = this.audioCtx.createGain();

      this.oscillator.type = 'sawtooth';
      this.oscillator.frequency.setValueAtTime(880, this.audioCtx.currentTime); // High A note

      this.gainNode.gain.setValueAtTime(0.3, this.audioCtx.currentTime);

      this.oscillator.connect(this.gainNode);
      this.gainNode.connect(this.audioCtx.destination);

      this.oscillator.start();
      this.isPlaying = true;

      // Oscillate siren frequency between 880Hz and 660Hz
      let highTone = true;
      this.intervalId = setInterval(() => {
        if (!this.audioCtx || !this.oscillator) return;
        const now = this.audioCtx.currentTime;
        const freq = highTone ? 660 : 880;
        this.oscillator.frequency.setValueAtTime(freq, now);
        highTone = !highTone;
      }, 400);

    } catch (err) {
      console.warn('Erro ao reproduzir áudio de alarme:', err.message);
    }
  }

  stop() {
    if (!this.isPlaying) return;
    try {
      if (this.intervalId) {
        clearInterval(this.intervalId);
        this.intervalId = null;
      }
      if (this.oscillator) {
        this.oscillator.stop();
        this.oscillator.disconnect();
        this.oscillator = null;
      }
      if (this.audioCtx) {
        this.audioCtx.close();
        this.audioCtx = null;
      }
    } catch (err) {
      console.warn('Erro ao parar áudio de alarme:', err.message);
    } finally {
      this.isPlaying = false;
    }
  }
}

export const alarmSound = new EmergencyAudioAlert();
