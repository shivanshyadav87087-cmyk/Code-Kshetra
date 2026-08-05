class SoundManager {
  constructor() {
    this.audioCtx = null;
    this.enabled = false; // MUTED BY DEFAULT to prevent irritating sound effects
  }

  init() {
    if (!this.audioCtx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.audioCtx = new AudioCtx();
      }
    }
  }

  setMuted(muted) {
    this.enabled = !muted;
  }

  toggleSound(forceState) {
    this.enabled = forceState !== undefined ? forceState : !this.enabled;
    return this.enabled;
  }

  playTone(freq, type = 'sine', duration = 0.08, gainVal = 0.01) {
    if (!this.enabled) return;
    try {
      this.init();
      if (!this.audioCtx) return;
      if (this.audioCtx.state === 'suspended') {
        this.audioCtx.resume();
      }

      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();

      osc.type = 'sine'; // Always use ultra-soft sine wave (no harsh square/sawtooth noise)
      osc.frequency.setValueAtTime(freq, this.audioCtx.currentTime);

      gain.gain.setValueAtTime(gainVal * 0.2, this.audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.00001, this.audioCtx.currentTime + duration);

      osc.connect(gain);
      gain.connect(this.audioCtx.destination);

      osc.start();
      osc.stop(this.audioCtx.currentTime + duration);
    } catch (e) {
      console.warn('Audio playback error:', e);
    }
  }

  playClick() {
    this.playTone(400, 'sine', 0.03, 0.005);
  }

  playRun() {
    this.playTone(350, 'sine', 0.05, 0.01);
  }

  playPass() {
    this.playTone(523.25, 'sine', 0.08, 0.01);
  }

  playFail() {
    this.playTone(220, 'sine', 0.08, 0.01);
  }

  playSubmitSuccess() {
    this.playTone(523.25, 'sine', 0.08, 0.01);
    setTimeout(() => this.playTone(659.25, 'sine', 0.08, 0.01), 70);
  }

  playTick() {
    this.playTone(600, 'sine', 0.02, 0.003);
  }

  playVictory() {
    this.playTone(523.25, 'sine', 0.12, 0.02);
  }

  playDefeat() {
    this.playTone(220, 'sine', 0.12, 0.01);
  }
}

export const sounds = new SoundManager();
