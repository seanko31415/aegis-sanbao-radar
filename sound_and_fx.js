/**
 * AEGIS SANBAO // 國家級馬路三寶防空預警系統 v4.2 Pro Max (Anime Tactical Edition)
 * Sound Engine & Custom SVG Anime Illustration Generator
 */

class SoundEngine {
  constructor() {
    this.ctx = null;
    this.muted = false;
  }

  init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  toggleMute() {
    this.muted = !this.muted;
    if (!this.muted) {
      this.playClick(880);
    }
    return this.muted;
  }

  playClick(freq = 720) {
    if (this.muted) return;
    try {
      this.init();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now);
      osc.frequency.exponentialRampToValueAtTime(freq * 1.4, now + 0.045);
      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.055);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.06);
    } catch (e) {}
  }

  playPing() {
    if (this.muted) return;
    try {
      this.init();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(1180, now);
      osc.frequency.exponentialRampToValueAtTime(580, now + 0.28);
      gain.gain.setValueAtTime(0.18, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.32);
    } catch (e) {}
  }

  playWoodfish() {
    if (this.muted) return;
    try {
      this.init();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(420, now);
      osc.frequency.exponentialRampToValueAtTime(290, now + 0.09);
      gain.gain.setValueAtTime(0.28, now);
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
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      [0, 0.16, 0.32].forEach((offset, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(240 + idx * 90, now + offset);
        osc.frequency.exponentialRampToValueAtTime(110, now + offset + 0.12);
        gain.gain.setValueAtTime(0.11, now + offset);
        gain.gain.exponentialRampToValueAtTime(0.001, now + offset + 0.13);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now + offset);
        osc.stop(now + offset + 0.14);
      });
    } catch (e) {}
  }

  playSiren() {
    if (this.muted) return;
    try {
      this.init();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      for (let i = 0; i < 3; i++) {
        const start = now + i * 0.42;
        const osc1 = this.ctx.createOscillator();
        const osc2 = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc1.type = 'sawtooth';
        osc2.type = 'square';
        osc1.frequency.setValueAtTime(520, start);
        osc1.frequency.linearRampToValueAtTime(960, start + 0.22);
        osc1.frequency.linearRampToValueAtTime(480, start + 0.4);

        osc2.frequency.setValueAtTime(526, start);
        osc2.frequency.linearRampToValueAtTime(968, start + 0.22);
        osc2.frequency.linearRampToValueAtTime(485, start + 0.4);

        gain.gain.setValueAtTime(0.14, start);
        gain.gain.exponentialRampToValueAtTime(0.005, start + 0.4);

        osc1.connect(gain);
        osc2.connect(gain);
        gain.connect(this.ctx.destination);
        osc1.start(start);
        osc2.start(start);
        osc1.stop(start + 0.41);
        osc2.stop(start + 0.41);
      }
    } catch (e) {}
  }
}

window.soundEngine = new SoundEngine();

/**
 * Generates an inline SVG fallback or overlay with crisp anime speedlines & HUD rings
 */
window.getAnimeCutInSVG = function (modeColor = '#EF4444', label = 'WARNING // SANBAO DETECTED') {
  return `
  <svg viewBox="0 0 600 130" class="w-full h-full select-none pointer-events-none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="cutinGrad" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stop-color="#07090E" stop-opacity="0.95"/>
        <stop offset="50%" stop-color="${modeColor}" stop-opacity="0.32"/>
        <stop offset="100%" stop-color="#07090E" stop-opacity="0.95"/>
      </linearGradient>
      <pattern id="halftone" width="8" height="8" patternUnits="userSpaceOnUse">
        <circle cx="2" cy="2" r="1.3" fill="${modeColor}" fill-opacity="0.22" />
      </pattern>
    </defs>
    <rect width="600" height="130" fill="url(#cutinGrad)" />
    <rect width="600" height="130" fill="url(#halftone)" />
    <!-- Manga Speed Lines -->
    <g stroke="${modeColor}" stroke-opacity="0.45" stroke-width="1.5">
      <line x1="0" y1="12" x2="240" y2="38" />
      <line x1="0" y1="95" x2="290" y2="75" />
      <line x1="600" y1="18" x2="350" y2="42" />
      <line x1="600" y1="112" x2="320" y2="85" />
      <line x1="40" y1="0" x2="180" y2="130" stroke-dasharray="6 4" />
      <line x1="540" y1="0" x2="420" y2="130" stroke-dasharray="6 4" />
    </g>
    <!-- Tactical Hazard Stripes -->
    <g fill="${modeColor}" fill-opacity="0.8">
      <polygon points="0,0 28,0 14,10 0,10" />
      <polygon points="38,0 66,0 52,10 38,10" />
      <polygon points="76,0 104,0 90,10 76,10" />
      <polygon points="500,120 528,120 514,130 500,130" />
      <polygon points="538,120 566,120 552,130 538,130" />
      <polygon points="576,120 600,120 590,130 576,130" />
    </g>
    <text x="50%" y="108" text-anchor="middle" fill="#ffffff" fill-opacity="0.16" font-family="JetBrains Mono, monospace" font-weight="900" font-size="42" letter-spacing="6">${label}</text>
  </svg>`;
};

