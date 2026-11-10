/* =============================================================================
   🎴 損友三寶監測局 — Cinematic 3D Tarot Carousel Intro / Login Splash
   AAA-Grade Tactile Mouse Inertia, Cursor Stardust, 100% Opaque Cosmic Backdrop
   ============================================================================= */
(function () {
  'use strict';

  const splash = document.getElementById('intro-splash');
  if (!splash) {
    document.body.classList.remove('intro-lock');
    return;
  }

  const reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let warpFactor = 1;
  let mainRAF = null;
  let exiting = false;

  // ---------------------------------------------------------------------------
  // 1. High-Performance Lightweight Stardust & Cursor Particle Engine
  // ---------------------------------------------------------------------------
  const canvas = document.getElementById('intro-stars');
  const ctx = canvas ? canvas.getContext('2d') : null;
  let stars = [];
  let sparkles = [];
  let W = 0;
  let H = 0;

  function resizeStars() {
    if (!canvas) return;
    W = window.innerWidth;
    H = window.innerHeight;
    canvas.width = W;
    canvas.height = H;
    const count = W < 640 ? 45 : 75;
    stars = Array.from({ length: count }, () => spawnStar(true));
  }

  function spawnStar(randomZ) {
    return {
      x: (Math.random() - 0.5) * W * 1.5,
      y: (Math.random() - 0.5) * H * 1.5,
      z: randomZ ? Math.random() * W : W,
      size: Math.random() < 0.35 ? 2.2 : 1.2,
      gold: Math.random() < 0.38
    };
  }

  function spawnCursorSparkle(x, y) {
    if (sparkles.length > 28) sparkles.shift();
    sparkles.push({
      x: x + (Math.random() - 0.5) * 14,
      y: y + (Math.random() - 0.5) * 14,
      vx: (Math.random() - 0.5) * 1.6,
      vy: (Math.random() - 0.5) * 1.6 - 0.4,
      alpha: 1,
      size: 1.6 + Math.random() * 2,
      gold: Math.random() < 0.65
    });
  }

  // ---------------------------------------------------------------------------
  // 2. AAA-Grade Spring / Lerp Inertial Physics & Spotlight Tracking
  // ---------------------------------------------------------------------------
  const tilt = document.getElementById('intro-tilt');
  const cursorAura = document.getElementById('intro-cursor-aura');

  let targetRotX = -8;
  let targetRotY = 0;
  let targetScale = 1;
  let currentRotX = -8;
  let currentRotY = 0;
  let currentScale = 1;

  let targetCursorX = window.innerWidth / 2;
  let targetCursorY = window.innerHeight / 2;
  let currentCursorX = window.innerWidth / 2;
  let currentCursorY = window.innerHeight / 2;

  let lastSparkleTime = 0;

  function onPointerMove(e) {
    if (exiting) return;
    const px = e.clientX;
    const py = e.clientY;
    const dx = px / window.innerWidth - 0.5;
    const dy = py / window.innerHeight - 0.5;

    targetRotX = -8 - dy * 18;
    targetRotY = dx * 22;
    targetScale = 1 + (0.5 - Math.hypot(dx, dy)) * 0.06;

    targetCursorX = px;
    targetCursorY = py;

    const now = performance.now();
    if (now - lastSparkleTime > 40) {
      spawnCursorSparkle(px, py);
      lastSparkleTime = now;
    }
  }

  splash.addEventListener('pointermove', onPointerMove, { passive: true });

  // Mobile / Tablet touch support
  splash.addEventListener('touchmove', (e) => {
    if (e.touches && e.touches[0]) {
      onPointerMove(e.touches[0]);
    }
  }, { passive: true });

  // ---------------------------------------------------------------------------
  // 3. Unified 60FPS Render & Physics Loop
  // ---------------------------------------------------------------------------
  function renderFrame() {
    // 3.1 Physics Lerp
    currentRotX += (targetRotX - currentRotX) * 0.08;
    currentRotY += (targetRotY - currentRotY) * 0.08;
    currentScale += (targetScale - currentScale) * 0.08;

    currentCursorX += (targetCursorX - currentCursorX) * 0.16;
    currentCursorY += (targetCursorY - currentCursorY) * 0.16;

    if (tilt && !exiting) {
      tilt.style.transform = `rotateX(${currentRotX.toFixed(2)}deg) rotateY(${currentRotY.toFixed(2)}deg) scale(${currentScale.toFixed(3)})`;
    }

    if (cursorAura && !exiting) {
      cursorAura.style.transform = `translate3d(${currentCursorX.toFixed(1)}px, ${currentCursorY.toFixed(1)}px, 0)`;
    }

    splash.style.setProperty('--spot-x', `${currentCursorX.toFixed(1)}px`);
    splash.style.setProperty('--spot-y', `${currentCursorY.toFixed(1)}px`);

    // 3.2 Canvas Background Stars
    if (ctx) {
      ctx.clearRect(0, 0, W, H);
      const cx = W / 2;
      const cy = H / 2;
      const speed = (reduceMotion ? 0.6 : 2.0) * warpFactor;

      for (let i = 0; i < stars.length; i++) {
        const s = stars[i];
        s.z -= speed;
        if (s.z <= 2) {
          stars[i] = spawnStar(false);
          continue;
        }
        const k = W / s.z;
        const sx = cx + s.x * k * 0.45;
        const sy = cy + s.y * k * 0.45;
        if (sx < 0 || sx > W || sy < 0 || sy > H) {
          stars[i] = spawnStar(false);
          continue;
        }
        ctx.fillStyle = s.gold ? 'rgba(254, 240, 138, 0.85)' : 'rgba(186, 230, 253, 0.75)';
        ctx.fillRect(sx, sy, s.size, s.size);
      }

      // 3.3 Interactive Cursor Stardust Trail
      for (let j = sparkles.length - 1; j >= 0; j--) {
        const p = sparkles[j];
        p.x += p.vx;
        p.y += p.vy;
        p.alpha -= 0.035;
        if (p.alpha <= 0) {
          sparkles.splice(j, 1);
          continue;
        }
        ctx.fillStyle = p.gold
          ? `rgba(254, 240, 138, ${p.alpha.toFixed(2)})`
          : `rgba(56, 189, 248, ${p.alpha.toFixed(2)})`;
        ctx.fillRect(p.x, p.y, p.size, p.size);
      }
    }

    mainRAF = requestAnimationFrame(renderFrame);
  }

  if (canvas && ctx) {
    resizeStars();
    window.addEventListener('resize', resizeStars, { passive: true });
    mainRAF = requestAnimationFrame(renderFrame);
  }

  // ---------------------------------------------------------------------------
  // 4. User Detection & Returning User Setup
  // ---------------------------------------------------------------------------
  function prepareReturningUser() {
    let savedName = '';
    let activeSession = false;
    try {
      activeSession = sessionStorage.getItem('aegis_active_session_login') === '1';
      const raw = localStorage.getItem('aegis_sanbao_my_user_v14');
      if (raw) savedName = (JSON.parse(raw) || {}).name || '';
    } catch (e) {}
    if (!savedName && window.appState && window.appState.myUser) savedName = window.appState.myUser.name || '';
    if (window.appState && window.appState.myUser && window.appState.myUser.loggedIn) activeSession = true;

    const input = document.getElementById('intro-name-input');
    if (input && savedName && !input.value) input.value = savedName;
    const cont = document.getElementById('intro-continue-btn');
    if (cont && activeSession && savedName) {
      cont.textContent = `▶ 以【${savedName}】繼續進入`;
      cont.classList.remove('hidden');
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => setTimeout(prepareReturningUser, 0));
  } else {
    setTimeout(prepareReturningUser, 0);
  }

  // ---------------------------------------------------------------------------
  // 5. Guaranteed Visitor Mode Enforcer
  // ---------------------------------------------------------------------------
  function performVisitorEntry() {
    try {
      sessionStorage.removeItem('aegis_active_session_login');
    } catch (e) {}

    if (window.appState && window.appState.myUser) {
      window.appState.myUser.loggedIn = false;
      if (window.saveMyUserToStorage) window.saveMyUserToStorage();
    }
    if (typeof window.enterVisitorMode === 'function') {
      window.enterVisitorMode();
    } else if (typeof window.logoutToVisitorPreview === 'function') {
      window.logoutToVisitorPreview();
    } else if (typeof window.syncUI === 'function') {
      window.syncUI();
    }
  }

  // ---------------------------------------------------------------------------
  // 6. Sound & Exit Warp
  // ---------------------------------------------------------------------------
  function startBGMFromGesture() {
    const se = window.soundEngine;
    if (!se) return;
    try {
      se.init && se.init();
      if (se.ctx && se.ctx.state === 'suspended') se.ctx.resume();
      if (se.setBGMVolume) se.setBGMVolume(0.20);
      if (!se.bgmActive && se.startBGM) {
        se.startBGM();
        const btn = document.getElementById('bgm-toggle-btn');
        if (btn) {
          btn.textContent = '🎵 BGM: 播放中';
          btn.classList.add('border-teal-300', 'text-teal-300', 'bg-teal-400/30');
        }
      }
      se.playWinFanfare && se.playWinFanfare();
    } catch (e) {}
  }

  window.introEnter = function (e, mode) {
    if (e && e.preventDefault) e.preventDefault();
    if (exiting) return;

    const input = document.getElementById('intro-name-input');
    const name = (input && input.value.trim()) || '';

    if (mode === 'login' && !name) {
      if (input) {
        input.focus();
        input.animate(
          [
            { transform: 'translateX(0)' },
            { transform: 'translateX(-8px)' },
            { transform: 'translateX(8px)' },
            { transform: 'translateX(0)' }
          ],
          { duration: 260 }
        );
        input.placeholder = '⚠️ 請先輸入名字才能登入定位';
      }
      return;
    }

    exiting = true;
    startBGMFromGesture();

    // If visitor mode, set up visitor state IMMEDIATELY
    if (mode === 'visitor') {
      performVisitorEntry();
    }

    warpFactor = 10;
    splash.classList.add('intro-warp');

    // Fast, responsive 140ms trigger to exit transition
    setTimeout(() => {
      splash.classList.add('intro-exit');
    }, 140);

    // Complete exit in 420ms (zero sluggish lag!)
    setTimeout(() => {
      cancelAnimationFrame(mainRAF);
      window.removeEventListener('resize', resizeStars);
      splash.remove();
      document.body.classList.remove('intro-lock');

      document.querySelectorAll('body > header, body > main').forEach((el) => {
        el.classList.remove('main-enter');
        void el.offsetWidth;
        el.classList.add('main-enter');
      });

      window.dispatchEvent(new Event('resize'));

      if (mode === 'login') {
        const quick = document.getElementById('quick-login-name');
        if (quick) quick.value = name;
        if (typeof window.loginFromQuickBar === 'function') window.loginFromQuickBar();
      } else if (mode === 'visitor') {
        performVisitorEntry();
        if (window.leafletMap && window.leafletMap.invalidateSize) {
          window.leafletMap.invalidateSize();
        }
      } else if (mode === 'continue') {
        if (typeof window.showToast === 'function') {
          window.showToast('🟢 歡迎回來！', '已恢復你的連線與定位', 'teal');
        }
      }
    }, reduceMotion ? 120 : 420);
  };
})();
