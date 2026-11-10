/**
 * 損友三寶監測局 // 馬路神主牌防空星盤 v11.0
 * Sound Engine + Mandarin Voice Synth + Stardust Particle Engine + Ornate Gold SVG Cut-In
 */

class SoundEngine {
  constructor() {
    this.ctx = null;
    this.muted = false;
    this.bgmActive = false;
    this.bgmTimer = null;
    this.bgmStep = 0;
    this.bgmVolume = 0.35;
    this.masterBGMGain = null;
  }

  init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) this.ctx = new AudioCtx();
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    if (this.ctx && !this.masterBGMGain) {
      this.masterBGMGain = this.ctx.createGain();
      this.masterBGMGain.gain.setValueAtTime(this.bgmVolume * 0.65, this.ctx.currentTime);
      this.masterBGMGain.connect(this.ctx.destination);
    }
  }

  setBGMVolume(val) {
    this.bgmVolume = Math.max(0, Math.min(1, parseFloat(val)));
    if (this.masterBGMGain && this.ctx) {
      const now = this.ctx.currentTime;
      this.masterBGMGain.gain.cancelScheduledValues(now);
      this.masterBGMGain.gain.linearRampToValueAtTime(this.bgmVolume * 0.65, now + 0.05);
    }
    return this.bgmVolume;
  }

  toggleMute() {
    this.muted = !this.muted;
    if (this.muted && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    if (this.muted && this.bgmActive) {
      this.stopBGM();
    }
    if (!this.muted) {
      this.init();
      this.playClick(880);
    }
    return this.muted;
  }

  // Relaxed, Bouncy & Playful Comic Anime BGM Engine with Real-Time Volume Control
  toggleBGM() {
    if (this.bgmActive) {
      this.stopBGM();
      return false;
    } else {
      this.startBGM();
      return true;
    }
  }

  startBGM() {
    if (this.muted) return false;
    try {
      this.init();
      if (this.ctx && this.ctx.state === 'suspended') {
        this.ctx.resume();
      }
      this.bgmActive = true;
      this.bgmStep = 0;
      if (this.masterBGMGain && this.ctx) {
        this.masterBGMGain.gain.setValueAtTime(this.bgmVolume * 0.65, this.ctx.currentTime);
      }
      this._scheduleBGMNote();
      return true;
    } catch (e) {
      return false;
    }
  }

  stopBGM() {
    this.bgmActive = false;
    if (this.bgmTimer) {
      clearTimeout(this.bgmTimer);
      this.bgmTimer = null;
    }
  }

  _scheduleBGMNote() {
    if (!this.bgmActive || this.muted || !this.ctx || !this.masterBGMGain) return;
    try {
      const now = this.ctx.currentTime;

      // High-Fidelity Jazzy Anime City-Pop Chord Progression:
      // (Cmaj7 -> Am7 -> Dm7 -> G7 -> Em7 -> A7 -> Dm7 -> G7)
      const chordChimes = [
        [523.25, 659.25, 783.99, 987.77], // Cmaj7 (C5, E5, G5, B5)
        [440.00, 523.25, 659.25, 783.99], // Am7 (A4, C5, E5, G5)
        [587.33, 698.46, 880.00, 1046.50],// Dm7 (D5, F5, A5, C6)
        [392.00, 493.88, 587.33, 698.46], // G7 (G4, B4, D5, F5)
        [659.25, 783.99, 987.77, 1174.66],// Em7 (E5, G5, B5, D6)
        [440.00, 554.37, 659.25, 783.99], // A7 (A4, C#5, E5, G5)
        [587.33, 698.46, 880.00, 1046.50],// Dm7 (D5, F5, A5, C6)
        [392.00, 493.88, 587.33, 783.99]  // G9 (G4, B4, D5, G5)
      ];

      // Smooth Velvet Acoustic Bass (Warm, Deep, Round)
      const bassMelody = [
        130.81, 164.81, 196.00, 246.94, // C3
        110.00, 146.83, 164.81, 220.00, // A2
        146.83, 174.61, 220.00, 261.63, // D3
        98.00,  146.83, 196.00, 246.94, // G2
        164.81, 196.00, 246.94, 293.66, // E3
        110.00, 138.59, 164.81, 220.00, // A2
        146.83, 174.61, 220.00, 261.63, // D3
        98.00,  130.81, 196.00, 293.66  // G2
      ];

      // Cheerful Playful Anime Melody (Lighthearted, Sweet, Melodic)
      const leadMelody = [
        523.25, 0, 659.25, 783.99, 987.77, 783.99, 659.25, 523.25,
        440.00, 523.25, 659.25, 0, 783.99, 659.25, 523.25, 440.00,
        587.33, 0, 698.46, 880.00, 1046.5, 880.00, 698.46, 587.33,
        783.99, 0, 698.46, 587.33, 493.88, 587.33, 698.46, 0
      ];

      const step32 = this.bgmStep % 32;
      const step16 = this.bgmStep % 16;
      const chordIdx = Math.floor(step32 / 4) % 8;

      // 1. Velvet Acoustic Upright Bass (Dual Warm Sine Layer)
      const bFreq = bassMelody[step32];
      if (bFreq > 0) {
        const bOsc = this.ctx.createOscillator();
        const bGain = this.ctx.createGain();
        const bFilter = this.ctx.createBiquadFilter();

        bFilter.type = 'lowpass';
        bFilter.frequency.setValueAtTime(360, now);

        bOsc.type = 'sine';
        bOsc.frequency.setValueAtTime(bFreq, now);
        bOsc.frequency.exponentialRampToValueAtTime(bFreq * 0.985, now + 0.18);

        bGain.gain.setValueAtTime(0.001, now);
        bGain.gain.linearRampToValueAtTime(0.42, now + 0.015);
        bGain.gain.exponentialRampToValueAtTime(0.001, now + 0.26);

        bOsc.connect(bFilter);
        bFilter.connect(bGain);
        bGain.connect(this.masterBGMGain);

        bOsc.start(now);
        bOsc.stop(now + 0.28);
      }

      // 2. Warm Rhodes / Electric Piano Chords (Layered Detuned Warmth)
      if (step32 % 4 === 0) {
        const chordNotes = chordChimes[chordIdx];
        chordNotes.forEach((cFreq, cIdx) => {
          const cOsc = this.ctx.createOscillator();
          const cGain = this.ctx.createGain();
          const cFilter = this.ctx.createBiquadFilter();

          cFilter.type = 'lowpass';
          cFilter.frequency.setValueAtTime(1400, now);

          cOsc.type = 'triangle';
          cOsc.frequency.setValueAtTime(cFreq, now);

          cGain.gain.setValueAtTime(0.001, now + cIdx * 0.012);
          cGain.gain.linearRampToValueAtTime(0.12, now + cIdx * 0.012 + 0.02);
          cGain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);

          cOsc.connect(cFilter);
          cFilter.connect(cGain);
          cGain.connect(this.masterBGMGain);

          cOsc.start(now + cIdx * 0.012);
          cOsc.stop(now + 0.48);
        });
      }

      // 3. Sweet Playful Lead (Celesta / Vibraphone Bell Tone)
      const lFreq = leadMelody[step32];
      if (lFreq > 0) {
        const lOsc1 = this.ctx.createOscillator();
        const lOsc2 = this.ctx.createOscillator();
        const lGain = this.ctx.createGain();
        const lFilter = this.ctx.createBiquadFilter();

        lFilter.type = 'lowpass';
        lFilter.frequency.setValueAtTime(2200, now);

        lOsc1.type = 'sine';
        lOsc1.frequency.setValueAtTime(lFreq, now);

        lOsc2.type = 'triangle';
        lOsc2.frequency.setValueAtTime(lFreq * 2, now);

        const lGainSub = this.ctx.createGain();
        lGainSub.gain.setValueAtTime(0.08, now);
        lOsc2.connect(lGainSub);
        lGainSub.connect(lFilter);

        lGain.gain.setValueAtTime(0.001, now);
        lGain.gain.linearRampToValueAtTime(0.26, now + 0.015);
        lGain.gain.exponentialRampToValueAtTime(0.001, now + 0.24);

        lOsc1.connect(lFilter);
        lFilter.connect(lGain);
        lGain.connect(this.masterBGMGain);

        lOsc1.start(now);
        lOsc2.start(now);
        lOsc1.stop(now + 0.25);
        lOsc2.stop(now + 0.25);
      }

      this.bgmStep++;
      // Warm, bouncy swing rhythm (~180ms per 16th note step)
      const nextDelay = 180 + (this.bgmStep % 2 === 0 ? 12 : -12);
      this.bgmTimer = setTimeout(() => this._scheduleBGMNote(), nextDelay);
    } catch (e) {
      this.stopBGM();
    }
  }

  playClick(freq = 760) {
    if (this.muted) return;
    try {
      this.init();
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now);
      osc.frequency.exponentialRampToValueAtTime(freq * 1.35, now + 0.05);
      gain.gain.setValueAtTime(0.11, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.065);
    } catch (e) {}
  }

  playPing() {
    if (this.muted) return;
    try {
      this.init();
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(1240, now);
      osc.frequency.exponentialRampToValueAtTime(620, now + 0.26);
      gain.gain.setValueAtTime(0.16, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.28);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.3);
    } catch (e) {}
  }

  playHorn() {
    if (this.muted) return;
    try {
      this.init();
      const now = this.ctx.currentTime;
      [0, 0.18].forEach((offset) => {
        const osc1 = this.ctx.createOscillator();
        const osc2 = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc1.type = 'sawtooth';
        osc2.type = 'sawtooth';
        osc1.frequency.setValueAtTime(415, now + offset);
        osc2.frequency.setValueAtTime(523, now + offset);
        gain.gain.setValueAtTime(0.14, now + offset);
        gain.gain.exponentialRampToValueAtTime(0.001, now + offset + 0.14);
        osc1.connect(gain);
        osc2.connect(gain);
        gain.connect(this.ctx.destination);
        osc1.start(now + offset);
        osc2.start(now + offset);
        osc1.stop(now + offset + 0.15);
        osc2.stop(now + offset + 0.15);
      });
    } catch (e) {}
  }

  playRadarBeep(pitch = 1480) {
    if (this.muted) return;
    try {
      this.init();
      const now = this.ctx.currentTime;
      [0, 0.1, 0.2, 0.3].forEach((offset) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'square';
        osc.frequency.setValueAtTime(pitch, now + offset);
        gain.gain.setValueAtTime(0.09, now + offset);
        gain.gain.exponentialRampToValueAtTime(0.001, now + offset + 0.075);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now + offset);
        osc.stop(now + offset + 0.085);
      });
    } catch (e) {}
  }

  playStamp() {
    if (this.muted) return;
    try {
      this.init();
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(190, now);
      osc.frequency.exponentialRampToValueAtTime(55, now + 0.16);
      gain.gain.setValueAtTime(0.28, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.19);
    } catch (e) {}
  }

  playWinFanfare() {
    if (this.muted) return;
    try {
      this.init();
      const now = this.ctx.currentTime;
      const notes = [523.25, 659.25, 783.99, 1046.5];
      notes.forEach((freq, i) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + i * 0.09);
        gain.gain.setValueAtTime(0.16, now + i * 0.09);
        gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.09 + 0.25);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now + i * 0.09);
        osc.stop(now + i * 0.09 + 0.26);
      });
    } catch (e) {}
  }

  // Authentic Temple Woodfish Acoustic Synthesis (Authentic Tok sound with hollow body resonance)
  playWoodfish() {
    if (this.muted) return;
    try {
      this.init();
      const now = this.ctx.currentTime;

      // 1. Transient click (wooden striker tap)
      const clickOsc = this.ctx.createOscillator();
      const clickGain = this.ctx.createGain();
      clickOsc.type = 'triangle';
      clickOsc.frequency.setValueAtTime(680, now);
      clickOsc.frequency.exponentialRampToValueAtTime(320, now + 0.025);
      clickGain.gain.setValueAtTime(0.26, now);
      clickGain.gain.exponentialRampToValueAtTime(0.001, now + 0.035);
      clickOsc.connect(clickGain);
      clickGain.connect(this.ctx.destination);
      clickOsc.start(now);
      clickOsc.stop(now + 0.04);

      // 2. Hollow wood body resonance
      const bodyOsc = this.ctx.createOscillator();
      const bodyFilter = this.ctx.createBiquadFilter();
      const bodyGain = this.ctx.createGain();

      bodyOsc.type = 'sine';
      bodyOsc.frequency.setValueAtTime(420, now);
      bodyOsc.frequency.exponentialRampToValueAtTime(360, now + 0.14);

      bodyFilter.type = 'bandpass';
      bodyFilter.frequency.setValueAtTime(410, now);
      bodyFilter.Q.setValueAtTime(8, now);

      bodyGain.gain.setValueAtTime(0.38, now);
      bodyGain.gain.exponentialRampToValueAtTime(0.001, now + 0.16);

      bodyOsc.connect(bodyFilter);
      bodyFilter.connect(bodyGain);
      bodyGain.connect(this.ctx.destination);

      bodyOsc.start(now);
      bodyOsc.stop(now + 0.17);
    } catch (e) {}
  }

  // Futuristic Defense Forcefield Activation (hum + rising resonance)
  playShieldOn() {
    if (this.muted) return;
    try {
      this.init();
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(220, now);
      osc.frequency.exponentialRampToValueAtTime(660, now + 0.28);
      osc.frequency.linearRampToValueAtTime(520, now + 0.45);

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.18, now + 0.06);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(1400, now);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.52);
    } catch (e) {}
  }

  // Tactical Decoy Launch sound (whoosh + chirp)
  playDecoyLaunch() {
    if (this.muted) return;
    try {
      this.init();
      const now = this.ctx.currentTime;
      // Air burst whoosh
      const osc1 = this.ctx.createOscillator();
      const gain1 = this.ctx.createGain();
      osc1.type = 'triangle';
      osc1.frequency.setValueAtTime(180, now);
      osc1.frequency.exponentialRampToValueAtTime(820, now + 0.12);
      gain1.gain.setValueAtTime(0.22, now);
      gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.14);
      osc1.connect(gain1);
      gain1.connect(this.ctx.destination);
      osc1.start(now);
      osc1.stop(now + 0.15);

      // Electronic lock chirp
      const osc2 = this.ctx.createOscillator();
      const gain2 = this.ctx.createGain();
      osc2.type = 'square';
      osc2.frequency.setValueAtTime(1540, now + 0.1);
      osc2.frequency.setValueAtTime(2080, now + 0.16);
      gain2.gain.setValueAtTime(0.08, now + 0.1);
      gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.24);
      osc2.connect(gain2);
      gain2.connect(this.ctx.destination);
      osc2.start(now + 0.1);
      osc2.stop(now + 0.25);
    } catch (e) {}
  }

  // Mystical 3D Tarot Card Flip Shimmer (sparkling crystal arpeggio)
  playTarotFlip() {
    if (this.muted) return;
    try {
      this.init();
      const now = this.ctx.currentTime;
      const notes = [587.33, 739.99, 880.00, 1174.66, 1479.98];
      notes.forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.045);
        gain.gain.setValueAtTime(0.12, now + idx * 0.045);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.045 + 0.35);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now + idx * 0.045);
        osc.stop(now + idx * 0.045 + 0.36);
      });
    } catch (e) {}
  }

  // Cartoon Bite / Crunch Sound (for chicken drumstick decoy hit)
  playBiteCrunch() {
    if (this.muted) return;
    try {
      this.init();
      const now = this.ctx.currentTime;
      [0, 0.06].forEach((offset) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'square';
        osc.frequency.setValueAtTime(440, now + offset);
        osc.frequency.exponentialRampToValueAtTime(110, now + offset + 0.08);
        gain.gain.setValueAtTime(0.18, now + offset);
        gain.gain.exponentialRampToValueAtTime(0.001, now + offset + 0.085);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now + offset);
        osc.stop(now + offset + 0.09);
      });
    } catch (e) {}
  }

  // Deep Sonic Megaphone Blast (resonant shockwave)
  playSonicWave() {
    if (this.muted) return;
    try {
      this.init();
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(160, now);
      osc.frequency.exponentialRampToValueAtTime(45, now + 0.4);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(480, now);

      gain.gain.setValueAtTime(0.28, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.42);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.43);
    } catch (e) {}
  }

  // Bamboo Fortune Stick Shake & Clatter
  playBambooShake() {
    if (this.muted) return;
    try {
      this.init();
      const now = this.ctx.currentTime;
      [0, 0.04, 0.09, 0.14].forEach((offset, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(480 + idx * 75, now + offset);
        osc.frequency.exponentialRampToValueAtTime(260, now + offset + 0.035);
        gain.gain.setValueAtTime(0.15, now + offset);
        gain.gain.exponentialRampToValueAtTime(0.001, now + offset + 0.04);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now + offset);
        osc.stop(now + offset + 0.045);
      });
    } catch (e) {}
  }

  // Laser Tether / Tactical Hit Beam
  playLaserHit() {
    if (this.muted) return;
    try {
      this.init();
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(1450, now);
      osc.frequency.exponentialRampToValueAtTime(220, now + 0.12);
      gain.gain.setValueAtTime(0.16, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.14);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.15);
    } catch (e) {}
  }

  playWiperSlap() {
    if (this.muted) return;
    try {
      this.init();
      const now = this.ctx.currentTime;
      [0, 0.14, 0.28].forEach((offset, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(320 + idx * 110, now + offset);
        osc.frequency.exponentialRampToValueAtTime(140, now + offset + 0.11);
        gain.gain.setValueAtTime(0.14, now + offset);
        gain.gain.exponentialRampToValueAtTime(0.001, now + offset + 0.12);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now + offset);
        osc.stop(now + offset + 0.13);
      });
    } catch (e) {}
  }

  playSiren() {
    if (this.muted) return;
    try {
      this.init();
      const now = this.ctx.currentTime;
      for (let i = 0; i < 2; i++) {
        const start = now + i * 0.4;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(520, start);
        osc.frequency.linearRampToValueAtTime(920, start + 0.2);
        osc.frequency.linearRampToValueAtTime(500, start + 0.38);
        gain.gain.setValueAtTime(0.12, start);
        gain.gain.exponentialRampToValueAtTime(0.005, start + 0.38);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(start);
        osc.stop(start + 0.39);
      }
    } catch (e) {}
  }

  speak(text) {
    if (this.muted) return;
    try {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const utter = new SpeechSynthesisUtterance(text);
        utter.lang = 'zh-TW';
        utter.rate = 1.18;
        utter.pitch = 1.25;
        window.speechSynthesis.speak(utter);
      }
    } catch (e) {}
  }
}

window.soundEngine = new SoundEngine();

window.getAnimeCutInSVG = function (modeColor = '#D4AF37', label = 'SANBAO ALERT') {
  return `
  <svg viewBox="0 0 400 100" class="w-full h-full select-none pointer-events-none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stop-color="#070B19" stop-opacity="0.92"/>
        <stop offset="50%" stop-color="${modeColor}" stop-opacity="0.38"/>
        <stop offset="100%" stop-color="#070B19" stop-opacity="0.92"/>
      </linearGradient>
    </defs>
    <rect width="400" height="100" fill="url(#goldGrad)" />
    <circle cx="340" cy="50" r="38" fill="none" stroke="#FEF08A" stroke-opacity="0.28" stroke-dasharray="4 4" />
    <text x="50%" y="82" text-anchor="middle" fill="#FEF08A" fill-opacity="0.14" font-family="Cinzel Decorative, serif" font-weight="900" font-size="32" letter-spacing="3">${label}</text>
  </svg>`;
};

// Golden Stardust Particle Engine (Supports both Mouse & Mobile Touch!)
document.addEventListener('DOMContentLoaded', () => {
  const canvas = document.getElementById('stardust-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let particles = [];

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resize);
  resize();

  for (let i = 0; i < 26; i++) {
    particles.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: 0.8 + Math.random() * 1.8,
      vx: (Math.random() - 0.5) * 0.25,
      vy: -0.2 - Math.random() * 0.35,
      alpha: 0.2 + Math.random() * 0.55
    });
  }

  const reticle = document.getElementById('mouse-reticle');
  let cursorX = -100;
  let cursorY = -100;
  let hasMouse = false;
  let lastHoveredGw = null;

  function spawnSparkle(x, y) {
    if (particles.length < 60) {
      particles.push({
        x: x + (Math.random() - 0.5) * 16,
        y: y + (Math.random() - 0.5) * 16,
        r: 1.2 + Math.random() * 1.8,
        vx: (Math.random() - 0.5) * 0.6,
        vy: -0.5 - Math.random() * 0.5,
        alpha: 0.85,
        decay: true
      });
    }
  }

  window.addEventListener('mousemove', (e) => {
    cursorX = e.clientX;
    cursorY = e.clientY;
    hasMouse = true;

    // Tactical anime cursor follower
    if (reticle) {
      reticle.style.transform = `translate3d(${cursorX}px, ${cursorY}px, 0)`;
      const isInteractive = !!e.target.closest('button, a, input, select, .glass-window, .tarot-btn, .cursor-pointer, [role="button"]');
      reticle.classList.toggle('reticle-expand', isInteractive);
    }

    // Dynamic glass specular highlight tracking on ALL grid boxes & cards
    const path = e.composedPath ? e.composedPath() : [e.target];
    let topCard = null;
    path.forEach((node) => {
      if (node && node.nodeType === 1 && node.classList && (node.classList.contains('glass-window') || node.classList.contains('royal-card'))) {
        const rect = node.getBoundingClientRect();
        node.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`);
        node.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`);
        if (!topCard) topCard = node;
      }
    });

    if (topCard && topCard !== lastHoveredGw) {
      lastHoveredGw = topCard;
      if (window.soundEngine && !window.soundEngine.muted && topCard.classList.contains('glass-window')) {
        window.soundEngine.playClick(920);
      }
    } else if (!topCard) {
      lastHoveredGw = null;
    }

    if (Math.random() < 0.35) spawnSparkle(e.clientX, e.clientY);
  });

  window.addEventListener('touchmove', (e) => {
    if (e.touches?.[0]) {
      cursorX = e.touches[0].clientX;
      cursorY = e.touches[0].clientY;
      if (Math.random() < 0.4) {
        spawnSparkle(cursorX, cursorY);
      }
    }
  }, { passive: true });

  function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Moderate, soft ambient radial spotlight around mouse (not blinding, gentle cyber glow)
    if (hasMouse && cursorX >= 0 && cursorY >= 0) {
      const radGrad = ctx.createRadialGradient(cursorX, cursorY, 0, cursorX, cursorY, 130);
      radGrad.addColorStop(0, 'rgba(45, 212, 191, 0.04)');
      radGrad.addColorStop(0.5, 'rgba(254, 240, 138, 0.02)');
      radGrad.addColorStop(1, 'transparent');
      ctx.fillStyle = radGrad;
      ctx.fillRect(cursorX - 130, cursorY - 130, 260, 260);
    }

    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      p.x += p.vx;
      p.y += p.vy;
      if (p.decay) {
        p.alpha -= 0.018;
        if (p.alpha <= 0) {
          particles.splice(i, 1);
          continue;
        }
      } else {
        if (p.y < 0) p.y = canvas.height;
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
      }

      ctx.save();
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(254, 240, 138, ${p.alpha})`;
      ctx.shadowColor = '#F59E0B';
      ctx.shadowBlur = 8;
      ctx.fill();
      ctx.restore();
    }
    requestAnimationFrame(animateParticles);
  }
  requestAnimationFrame(animateParticles);
});
