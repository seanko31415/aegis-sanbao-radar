/* =============================================================================
   🎴 損友三寶監測局 — Cinematic 3D Tarot Carousel Intro / Login Splash
   Self-contained: works even if other scripts fail, so the splash can never
   trap the user. Hands off to app.js (loginFromQuickBar / logoutToVisitorPreview).
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
  // 1. Warp-speed starfield background
  // ---------------------------------------------------------------------------
  const canvas = document.getElementById('intro-stars');
  const ctx = canvas ? canvas.getContext('2d') : null;
  let stars = [];
  let W = 0;
  let H = 0;

  function resizeStars() {
    if (!canvas) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    W = window.innerWidth;
    H = window.innerHeight;
    canvas.width = W * dpr;
    canvas.height = H * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const count = W < 640 ? 140 : 260;
    stars = Array.from({ length: count }, () => spawnStar(true));
  }

  function spawnStar(randomZ) {
    return {
      x: (Math.random() - 0.5) * W * 1.6,
      y: (Math.random() - 0.5) * H * 1.6,
      z: randomZ ? Math.random() * W : W,
      gold: Math.random() < 0.28
    };
  }

  function drawStars() {
    if (!ctx) return;
    ctx.fillStyle = 'rgba(3, 5, 13, 0.35)';
    ctx.fillRect(0, 0, W, H);
    const cx = W / 2;
    const cy = H * 0.42;
    const speed = (reduceMotion ? 0.6 : 2.2) * warpFactor;
    for (let i = 0; i < stars.length; i++) {
      const s = stars[i];
      const pz = s.z;
      s.z -= speed;
      if (s.z <= 1) {
        stars[i] = spawnStar(false);
        continue;
      }
      const k = W / s.z;
      const sx = cx + s.x * k * 0.5;
      const sy = cy + s.y * k * 0.5;
      if (sx < -20 || sx > W + 20 || sy < -20 || sy > H + 20) {
        stars[i] = spawnStar(false);
        continue;
      }
      const pk = W / pz;
      const px = cx + s.x * pk * 0.5;
      const py = cy + s.y * pk * 0.5;
      const size = Math.max(0.4, (1 - s.z / W) * 2.2);
      ctx.strokeStyle = s.gold ? 'rgba(254, 240, 138, 0.85)' : 'rgba(186, 230, 253, 0.75)';
      ctx.lineWidth = size;
      ctx.beginPath();
      ctx.moveTo(px, py);
      ctx.lineTo(sx, sy);
      ctx.stroke();
    }
    starsRAF = requestAnimationFrame(drawStars);
  }

  if (canvas && ctx) {
    resizeStars();
    window.addEventListener('resize', resizeStars);
    starsRAF = requestAnimationFrame(drawStars);
  }

  // ---------------------------------------------------------------------------
  // 2. Mouse / touch parallax tilt on the 3D card ring
  // ---------------------------------------------------------------------------
  const tilt = document.getElementById('intro-tilt');
  function onPointerMove(e) {
    if (!tilt || exiting) return;
    const dx = e.clientX / window.innerWidth - 0.5;
    const dy = e.clientY / window.innerHeight - 0.5;
    tilt.style.transform = `rotateX(${-10 - dy * 12}deg) rotateY(${dx * 18}deg)`;
  }
  splash.addEventListener('pointermove', onPointerMove);

  // ---------------------------------------------------------------------------
  // 3. Boot sequence → reveal login actions
  // ---------------------------------------------------------------------------
  const bootLine = document.getElementById('intro-boot-line');
  const bar = document.getElementById('intro-progress-bar');
  const actions = document.getElementById('intro-actions');
  const BOOT_STEPS = [
    '> 校準塔羅星盤核心...',
    '> 連線全台三寶衛星雷達...',
    '> 載入雞腿駕照資料庫...',
    '> 啟動雨刷誤觸偵測模組...',
    '> 同步好友即時定位頻道...',
    '> ✦ 系統就緒 // WELCOME, COMMANDER ✦'
  ];
  let step = 0;
  const stepMs = reduceMotion ? 120 : 330;
  const bootTimer = setInterval(() => {
    if (bootLine) bootLine.textContent = BOOT_STEPS[step];
    if (bar) bar.style.width = `${Math.round(((step + 1) / BOOT_STEPS.length) * 100)}%`;
    step++;
    if (step >= BOOT_STEPS.length) {
      clearInterval(bootTimer);
      if (bootLine) bootLine.style.color = '#FEF08A';
      if (actions) actions.classList.add('ready');
    }
  }, stepMs);

  // Prefill and "continue" button for a returning, still-logged-in session
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
  // 4. Enter: warp the carousel, flash, hand off to the main app
  // ---------------------------------------------------------------------------
  function startBGMFromGesture() {
    const se = window.soundEngine;
    if (!se) return;
    try {
      se.init && se.init();
      if (se.ctx && se.ctx.state === 'suspended') se.ctx.resume();
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
          [{ transform: 'translateX(0)' }, { transform: 'translateX(-8px)' }, { transform: 'translateX(8px)' }, { transform: 'translateX(0)' }],
          { duration: 320 }
        );
        input.placeholder = '⚠️ 請先輸入名字才能登入定位';
      }
      return;
    }

    exiting = true;
    startBGMFromGesture();
    warpFactor = 14;
    splash.classList.add('intro-warp');

    setTimeout(() => splash.classList.add('intro-exit'), reduceMotion ? 50 : 650);

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

      const isLoggedIn = !!(window.appState && window.appState.myUser && window.appState.myUser.loggedIn);
      if (mode === 'login') {
        const quick = document.getElementById('quick-login-name');
        if (quick) quick.value = name;
        if (typeof window.loginFromQuickBar === 'function') window.loginFromQuickBar();
      } else if (mode === 'visitor' && isLoggedIn && typeof window.logoutToVisitorPreview === 'function') {
        window.logoutToVisitorPreview();
      } else if (typeof window.showToast === 'function') {
        window.showToast(
          mode === 'continue' ? '🟢 歡迎回來！' : '👀 訪客預覽模式',
          mode === 'continue' ? '已恢復你的連線與定位' : '不會定位你・輸入名字即可正式加入',
          'teal'
        );
      }
    }, reduceMotion ? 300 : 1400);
  };

  // Keyboard: Enter on the splash focuses the name field
  splash.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && document.activeElement === document.body) {
      document.getElementById('intro-name-input')?.focus();
    }
  });
})();
