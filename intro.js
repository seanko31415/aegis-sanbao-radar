/* =============================================================================
   🎴 損友三寶監測局 — Cinematic 3D Tarot Carousel Intro / Login Splash
   v15.9: Separated 3D Cards, Zero Hitch Transition, Mobile/Tablet Sliding Lock
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
  // 1. Guaranteed Visitor Mode Enforcer
  // ---------------------------------------------------------------------------
  function performVisitorEntry() {
    try {
      sessionStorage.removeItem('aegis_active_session_login');
    } catch (e) {}

    try {
      if (window.appState && window.appState.myUser) {
        window.appState.myUser.loggedIn = false;
        if (window.saveMyUserToStorage) window.saveMyUserToStorage();
      }
    } catch (e) {}

    try {
      if (typeof window.enterVisitorMode === 'function') {
        window.enterVisitorMode();
      } else if (typeof window.logoutToVisitorPreview === 'function') {
        window.logoutToVisitorPreview();
      } else if (typeof window.syncUI === 'function') {
        window.syncUI();
      }
    } catch (e) {}
  }

  // ---------------------------------------------------------------------------
  // 2. Sound & BGM Trigger
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

  // ---------------------------------------------------------------------------
  // 3. Global introEnter Handler (Hitch-Free 60FPS Transition)
  // ---------------------------------------------------------------------------
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
          { duration: 220 }
        );
        input.placeholder = '⚠️ 請先輸入名字才能登入定位';
      }
      return;
    }

    exiting = true;
    startBGMFromGesture();

    // Trigger visual fade-out immediately without blocking on heavy map calculations
    warpFactor = 10;
    splash.classList.add('intro-exit');

    // Smooth teardown in 200ms
    setTimeout(() => {
      try {
        if (mainRAF) cancelAnimationFrame(mainRAF);
        window.removeEventListener('resize', resizeStars);
        window.removeEventListener('pointermove', onPointerMove);
        window.removeEventListener('touchmove', onTouchMove);
      } catch (err) {}

      try {
        splash.remove();
        document.body.classList.remove('intro-lock');
      } catch (err) {}

      // Defer heavy map marker and UI rendering to the next animation frame (Zero Hitch!)
      requestAnimationFrame(() => {
        try {
          if (mode === 'login') {
            const quick = document.getElementById('quick-login-name');
            if (quick) quick.value = name;
            if (typeof window.loginFromQuickBar === 'function') window.loginFromQuickBar();
          } else if (mode === 'visitor') {
            performVisitorEntry();
            if (window.leafletMap && window.leafletMap.invalidateSize) {
              window.leafletMap.invalidateSize();
            }
            if (typeof window.showToast === 'function') {
              window.showToast('👀 訪客即時預覽模式', '已為您載入全境防空雷達與地圖，可隨時預覽體驗！', 'teal');
            }
          } else if (mode === 'continue') {
            if (typeof window.showToast === 'function') {
              window.showToast('🟢 歡迎回來！', '已恢復你的連線與定位', 'teal');
            }
          }
          window.dispatchEvent(new Event('resize'));
        } catch (err) {
          console.warn(err);
        }
      });
    }, reduceMotion ? 50 : 200);
  };

  // ---------------------------------------------------------------------------
  // 4. Smooth Coherent Mouse & Touch Tracking (Zero Jitter, Fluid Lerp)
  // ---------------------------------------------------------------------------
  const tilt = document.getElementById('intro-tilt');
  const cursorAura = document.getElementById('intro-cursor-aura');

  let targetRotX = -6;
  let targetRotY = 0;
  let targetScale = 1;

  let currentRotX = -6;
  let currentRotY = 0;
  let currentScale = 1;

  let cursorX = window.innerWidth / 2;
  let cursorY = window.innerHeight / 2;
  let targetCursorX = cursorX;
  let targetCursorY = cursorY;

  let lastSparkleTime = 0;

  function onPointerMove(e) {
    if (exiting) return;
    const px = e.clientX;
    const py = e.clientY;
    const dx = px / (window.innerWidth || 1) - 0.5;
    const dy = py / (window.innerHeight || 1) - 0.5;

    // Natural 3D tilt: smooth, intuitive, continuous
    targetRotX = -6 - dy * 14;
    targetRotY = dx * 18;
    targetScale = 1 + (0.45 - Math.hypot(dx, dy)) * 0.04;

    targetCursorX = px;
    targetCursorY = py;

    const now = performance.now();
    if (now - lastSparkleTime > 45) {
      spawnCursorSparkle(px, py);
      lastSparkleTime = now;
    }
  }

  function onTouchMove(e) {
    if (exiting || !e.touches || !e.touches[0]) return;
    onPointerMove(e.touches[0]);
  }

  window.addEventListener('pointermove', onPointerMove, { passive: true });
  window.addEventListener('touchmove', onTouchMove, { passive: true });

  // Prevent accidental mobile screen dragging/sliding on the splash screen
  splash.addEventListener('touchmove', (e) => {
    if (e.target && (e.target.tagName === 'INPUT' || e.target.tagName === 'BUTTON')) return;
    if (e.cancelable) e.preventDefault();
  }, { passive: false });

  // ---------------------------------------------------------------------------
  // 5. High-Performance Canvas Stars & Cursor Stardust Engine
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
    const count = W < 640 ? 40 : 65;
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
    if (sparkles.length > 24) sparkles.shift();
    sparkles.push({
      x: x + (Math.random() - 0.5) * 12,
      y: y + (Math.random() - 0.5) * 12,
      vx: (Math.random() - 0.5) * 1.4,
      vy: (Math.random() - 0.5) * 1.4 - 0.3,
      alpha: 1,
      size: 1.5 + Math.random() * 2,
      gold: Math.random() < 0.65
    });
  }

  function renderFrame() {
    // 5.1 Snappy, buttery smooth Lerp interpolation (0.16)
    const lerp = 0.16;
    currentRotX += (targetRotX - currentRotX) * lerp;
    currentRotY += (targetRotY - currentRotY) * lerp;
    currentScale += (targetScale - currentScale) * lerp;

    cursorX += (targetCursorX - cursorX) * 0.25;
    cursorY += (targetCursorY - cursorY) * 0.25;

    if (tilt && !exiting) {
      tilt.style.transform = `rotateX(${currentRotX.toFixed(2)}deg) rotateY(${currentRotY.toFixed(2)}deg) scale(${currentScale.toFixed(3)})`;
    }

    if (cursorAura && !exiting) {
      cursorAura.style.transform = `translate3d(${cursorX.toFixed(1)}px, ${cursorY.toFixed(1)}px, 0)`;
    }

    // 5.2 GPU-accelerated Canvas Rendering
    if (ctx) {
      ctx.clearRect(0, 0, W, H);

      // Soft dynamic cursor spotlight on canvas
      if (!reduceMotion && cursorX > 0 && cursorY > 0) {
        const glow = ctx.createRadialGradient(cursorX, cursorY, 0, cursorX, cursorY, 200);
        glow.addColorStop(0, 'rgba(254, 240, 138, 0.09)');
        glow.addColorStop(0.4, 'rgba(45, 212, 191, 0.04)');
        glow.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = glow;
        ctx.fillRect(0, 0, W, H);
      }

      // Background warp stars
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

      // Cursor stardust particles
      for (let j = sparkles.length - 1; j >= 0; j--) {
        const p = sparkles[j];
        p.x += p.vx;
        p.y += p.vy;
        p.alpha -= 0.04;
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

    if (!exiting) {
      mainRAF = requestAnimationFrame(renderFrame);
    }
  }

  if (canvas && ctx) {
    resizeStars();
    window.addEventListener('resize', resizeStars, { passive: true });
    mainRAF = requestAnimationFrame(renderFrame);
  }

  // ---------------------------------------------------------------------------
  // 6. User Detection & Returning User Setup
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

    // Attach explicit click listener to visitor button
    const visitorBtn = document.getElementById('intro-visitor-btn');
    if (visitorBtn) {
      visitorBtn.addEventListener('click', (e) => window.introEnter(e, 'visitor'));
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => setTimeout(prepareReturningUser, 0));
  } else {
    setTimeout(prepareReturningUser, 0);
  }
})();
