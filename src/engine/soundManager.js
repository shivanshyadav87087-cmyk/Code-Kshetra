class SoundManager {
  constructor() {
    this.audioCtx = null;
    this.enabled = true; // Enabled by default for rich gaming immersion
    this.announcerEnabled = true;
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

  toggleAnnouncer(forceState) {
    this.announcerEnabled = forceState !== undefined ? forceState : !this.announcerEnabled;
    return this.announcerEnabled;
  }

  playTone(freq, type = 'sine', duration = 0.08, gainVal = 0.02) {
    if (!this.enabled) return;
    try {
      this.init();
      if (!this.audioCtx) return;
      if (this.audioCtx.state === 'suspended') {
        this.audioCtx.resume();
      }

      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, this.audioCtx.currentTime);

      gain.gain.setValueAtTime(gainVal * 0.3, this.audioCtx.currentTime);
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
    this.playTone(480, 'sine', 0.03, 0.01);
  }

  playRun() {
    this.playTone(380, 'sine', 0.06, 0.015);
  }

  playPass() {
    this.playTone(523.25, 'sine', 0.08, 0.02);
    setTimeout(() => this.playTone(659.25, 'sine', 0.08, 0.02), 60);
  }

  playFail() {
    this.playTone(220, 'triangle', 0.12, 0.025);
    setTimeout(() => this.playTone(180, 'triangle', 0.14, 0.025), 90);
  }

  playWarning() {
    this.playTone(880, 'square', 0.06, 0.01);
    setTimeout(() => this.playTone(440, 'square', 0.08, 0.01), 70);
  }

  playSubmitSuccess() {
    this.playTone(523.25, 'sine', 0.08, 0.02);
    setTimeout(() => this.playTone(659.25, 'sine', 0.08, 0.02), 70);
    setTimeout(() => this.playTone(783.99, 'sine', 0.1, 0.02), 140);
  }

  playTick() {
    this.playTone(700, 'sine', 0.02, 0.005);
  }

  playVictory() {
    if (!this.enabled) return;
    // Ascending C Major Fanfare (C5 -> E5 -> G5 -> C6)
    const notes = [523.25, 659.25, 783.99, 1046.50];
    notes.forEach((freq, idx) => {
      setTimeout(() => this.playTone(freq, 'triangle', 0.18, 0.03), idx * 100);
    });
    this.speakAnnouncer('Victory! Code क्षेत्र Champion!');
  }

  playDefeat() {
    if (!this.enabled) return;
    // Descending Minor Triad (C4 -> Ab3 -> F3)
    const notes = [261.63, 207.65, 174.61];
    notes.forEach((freq, idx) => {
      setTimeout(() => this.playTone(freq, 'sawtooth', 0.22, 0.015), idx * 120);
    });
    this.speakAnnouncer('Match Defeat!');
  }

  playMatchStart() {
    if (!this.enabled) return;
    this.playTone(440, 'sine', 0.1, 0.02);
    setTimeout(() => this.playTone(880, 'sine', 0.15, 0.025), 100);
    this.speakAnnouncer('Match Started! Begin coding!');
  }

  playStreakSound(streakCount = 1) {
    if (!this.enabled) return;
    const baseFreq = 523.25 + Math.min(streakCount * 50, 400);
    this.playTone(baseFreq, 'sine', 0.1, 0.02);
    setTimeout(() => this.playTone(baseFreq * 1.25, 'sine', 0.12, 0.02), 80);
    if (streakCount >= 3) {
      this.speakAnnouncer(`${streakCount} Match Win Streak!`);
    }
  }

  speakAnnouncer(text) {
    if (!this.announcerEnabled || typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    try {
      window.speechSynthesis.cancel(); // Clear previous queue
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.05;
      utterance.pitch = 1.1;
      utterance.volume = 0.8;
      window.speechSynthesis.speak(utterance);
    } catch (e) {
      console.warn('Speech synthesis error:', e);
    }
  }
}

export const sounds = new SoundManager();
