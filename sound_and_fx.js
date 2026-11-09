/**
 * 損友三寶監測局 // 馬路神主牌防空星盤 v11.0
 * Sound Engine + Mandarin Voice Synth + Stardust Particle Engine + Ornate Gold SVG Cut-In
 */

class SoundEngine {
  constructor() {
    this.ctx = null;
    this.muted = false;
  }

  init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) this.ctx = new AudioCtx();
    }
    if (this.ctx && this.ctx.state === 'suspended') this.ctx.resume();
  }

  toggleMute() {
    this.muted = !this.muted;
    if (this.muted && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    if (!this.muted) this.playClick(880);
    return this.muted;
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

  playWoodfish() {
    if (this.muted) return;
    try {
      this.init();
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(520, now);
      osc.frequency.exponentialRampToValueAtTime(340, now + 0.1);
      gain.gain.setValueAtTime(0.24, now);
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

    // Dynamic glass specular highlight tracking on grid windows
    const hoveredGw = e.target.closest('.glass-window');
    if (hoveredGw) {
      const rect = hoveredGw.getBoundingClientRect();
      hoveredGw.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`);
      hoveredGw.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`);

      if (hoveredGw !== lastHoveredGw) {
        lastHoveredGw = hoveredGw;
        if (window.soundEngine && !window.soundEngine.muted) {
          window.soundEngine.playClick(920);
        }
      }
    } else {
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
