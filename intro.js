/* =============================================================================
   🎴 損友三寶監測局 — Cinematic 3D Tarot Carousel Intro / Login Splash
   Ultra-Smooth 60FPS Centered 3D Astrolabe Carousel + Instant Visitor Access
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
  let starsRAF = null;
  let exiting = false;

  // ---------------------------------------------------------------------------
  // 1. High-Performance Lightweight Stardust Engine (0.1ms/frame, zero stutter)
  // ---------------------------------------------------------------------------
  const canvas = document.getElementById('intro-stars');
  const ctx = canvas ? canvas.getContext('2d') : null;
  let stars = [];
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
      size: Math.random() < 0.3 ? 2 : 1.2,
      gold: Math.random() < 0.35
    };
  }

  function drawStars() {
    if (!ctx) return;
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
    starsRAF = requestAnimationFrame(drawStars);
  }

  if (canvas && ctx) {
    resizeStars();
    window.addEventListener('resize', resizeStars, { passive: true });
    starsRAF = requestAnimationFrame(drawStars);
  }

  // ---------------------------------------------------------------------------
  // 2. Buttery Smooth Gyro / Mouse Parallax Tilt
  // ---------------------------------------------------------------------------
  const tilt = document.getElementById('intro-tilt');
  function onPointerMove(e) {
    if (!tilt || exiting) return;
    const dx = e.clientX / window.innerWidth - 0.5;
    const dy = e.clientY / window.innerHeight - 0.5;
    tilt.style.transform = `rotateX(${-8 - dy * 14}deg) rotateY(${dx * 18}deg)`;
  }
  splash.addEventListener('pointermove', onPointerMove, { passive: true });

  // ---------------------------------------------------------------------------
  // 3. User Detection & Returning User Setup
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
  // 4. Guaranteed Visitor Mode Enforcer
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
  // 5. Sound & Exit Warp
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

    // Fast, responsive 160ms trigger to exit transition
    setTimeout(() => {
      splash.classList.add('intro-exit');
    }, 140);

    // Complete exit in 420ms (zero sluggish lag!)
    setTimeout(() => {
      cancelAnimationFrame(starsRAF);
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
