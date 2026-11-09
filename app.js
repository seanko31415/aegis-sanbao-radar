/**
 * AEGIS SANBAO // 特務級三寶防空雷達 v5.0 (Anime Tactical Edition)
 * High-Detail City Map Engine, Non-overlapping HUD Layout, Concise Copy & Interactive Logic
 */

const SCENARIOS = {
  home: {
    id: 'home',
    badge: 'DEFCON 5',
    level: 'LV.0 居家封印',
    levelNum: 0,
    radiusKm: 0.05,
    baseChaos: 8,
    speedKmh: 0,
    speedLimit: 50,
    brakeGasConfusion: 2,
    navRerouteCount: 0,
    wiperRapid: false,
    leftSignal: false,
    rightSignal: false,
    carTiltDeg: 0,
    color: '#10B981',
    panelClass: 'anime-panel anime-panel-safe',
    bannerImg: 'assets/nerv_commander_banner.jpg',
    cgCaption: '基地封印・全城和平',
    cutInTitle: 'SEALED // 居家封印確認',
    cutInSub: '目標正在沙發追番吃洋芋片，道路暫時安全',
    ticker: '目標車鑰匙掛在玄關・方圓 50m 解除警報',
    osList: [
      '💭「這集動漫超好看，今天不出門了～」',
      '💭「車停哪一格？算了明天再找！」',
      '💭「洋芋片吃完再睡，馬路和平交給大家～」'
    ]
  },
  snack: {
    id: 'snack',
    badge: 'DEFCON 3',
    level: 'LV.2 巷口宵夜',
    levelNum: 2,
    radiusKm: 0.65,
    baseChaos: 42,
    speedKmh: 23,
    speedLimit: 40,
    brakeGasConfusion: 35,
    navRerouteCount: 7,
    wiperRapid: false,
    leftSignal: true,
    rightSignal: false,
    carTiltDeg: 14,
    color: '#F59E0B',
    panelClass: 'anime-panel',
    bannerImg: 'assets/nerv_commander_banner.jpg',
    cgCaption: '雙腳滑行・鹽酥雞鬼切',
    cutInTitle: 'SNACK DRIFT // 宵夜鬼切',
    cutInSub: '聞到鹽酥雞瞬間右切・左燈已連閃 3.8km',
    ticker: '雙腳懸空滑行中・聞到九層塔隨時 90 度急切',
    osList: [
      '💭「左燈亮著？管他的先右切買甜不辣！」',
      '💭「雙腳放地上滑行比較有安全感耶～」',
      '💭「後車一直按喇叭是在跟我打招呼嗎？」'
    ]
  },
  roundabout: {
    id: 'roundabout',
    badge: 'DEFCON 2',
    level: 'LV.4 圓環迷航',
    levelNum: 4,
    radiusKm: 1.50,
    baseChaos: 76,
    speedKmh: 16,
    speedLimit: 60,
    brakeGasConfusion: 68,
    navRerouteCount: 34,
    wiperRapid: true,
    leftSignal: true,
    rightSignal: false,
    carTiltDeg: 28,
    color: '#F97316',
    panelClass: 'anime-panel anime-panel-danger',
    bannerImg: 'assets/scenario_roundabout.jpg',
    cgCaption: '圓環莫比烏斯迷航',
    cutInTitle: 'MOBIUS LOOP // 圓環迷航',
    cutInSub: '內線時速 16km・打左燈往右偏 + 晴天刷雨刷',
    ticker: '圓環繞行第 7 圈・左燈狂閃卻持續向右漂移',
    osList: [
      '💭「救命！圓環怎麼出不去！看到超商四次了！」',
      '💭「想打右轉燈怎麼雨刷又自己動起來了！」',
      '💭「不管了！先在路中間停下來看地圖！」'
    ]
  },
  parking: {
    id: 'parking',
    badge: 'DEFCON 1',
    level: 'LV.5 倒車魔王',
    levelNum: 5,
    radiusKm: 3.00,
    baseChaos: 98,
    speedKmh: 8,
    speedLimit: 15,
    brakeGasConfusion: 94,
    navRerouteCount: 99,
    wiperRapid: true,
    leftSignal: true,
    rightSignal: true,
    carTiltDeg: -35,
    color: '#EF4444',
    panelClass: 'anime-panel anime-panel-danger',
    bannerImg: 'assets/scenario_parking.jpg',
    cgCaption: 'B2 倒車入庫大魔王',
    cutInTitle: 'FINAL BOSS // 倒車魔王',
    cutInSub: 'R/D檔切換第 24 次・後方車流已回堵 1.2km',
    ticker: '好市多 B2 倒車入庫中・鄰車車主已棄車逃亡',
    osList: [
      '💭「方向盤往左轉，車屁股怎往右邊柱子撞？！」',
      '💭「嗶嗶嗶——倒車雷達吵死了能關掉嗎？！」',
      '💭「斜斜停跨兩格應該沒人會發現吧？」'
    ]
  }
};

// Smart non-overlapping landmarks with custom label offsets
const LANDMARKS = [
  { id: 'costco', name: '好市多 B2', tag: '倒車魔王', x: 0.20, y: 0.23, color: '#EF4444', align: 'right' },
  { id: 'roundabout', name: '台灣大道圓環', tag: '迷航熱點', x: 0.50, y: 0.50, color: '#F59E0B', align: 'bottom' },
  { id: 'nightmarket', name: '逢甲窄巷', tag: '鬼切高危', x: 0.80, y: 0.25, color: '#F97316', align: 'left' },
  { id: 'deptstore', name: '百貨螺旋道', tag: '刮輪框區', x: 0.22, y: 0.78, color: '#EAB308', align: 'right' },
  { id: 'mrt', name: '高架捷運站', tag: '絕對安全', x: 0.84, y: 0.79, color: '#10B981', align: 'left' }
];

// Decorative City Blocks for ultra-detailed map architecture
const CITY_BLOCKS = [
  { x: 0.06, y: 0.08, w: 0.11, h: 0.12 },
  { x: 0.25, y: 0.08, w: 0.18, h: 0.10 },
  { x: 0.56, y: 0.08, w: 0.16, h: 0.11 },
  { x: 0.06, y: 0.30, w: 0.14, h: 0.14 },
  { x: 0.62, y: 0.32, w: 0.14, h: 0.12 },
  { x: 0.82, y: 0.35, w: 0.11, h: 0.11 },
  { x: 0.07, y: 0.56, w: 0.13, h: 0.15 },
  { x: 0.30, y: 0.62, w: 0.13, h: 0.14 },
  { x: 0.58, y: 0.60, w: 0.16, h: 0.13 },
  { x: 0.60, y: 0.78, w: 0.15, h: 0.12 }
];

const DEFAULT_SIGHTINGS = [
  {
    id: 's1',
    rank: 'S',
    location: '北屯好市多 B2 入口',
    time: '12m 前',
    reporter: '逃生車主 陳先生',
    content: '雙格寬車位前後嚕了 19 分鐘，大晴天雨刷狂刷 40 幾下，最後直接停在安全島上！',
    likes: 128
  },
  {
    id: 's2',
    rank: 'S',
    location: '台灣大道 × 文心路口',
    time: '38m 前',
    reporter: '後車苦主 阿凱',
    content: '左轉燈連閃 3.8 公里，結果在路口突然大迴旋右轉進得來速買薯條！',
    likes: 94
  },
  {
    id: 's3',
    rank: 'A',
    location: '永豆宵夜紅線區',
    time: '1h 前',
    reporter: '損友群組 小林',
    content: '加油孔在左邊卻停右邊，拉油管差點把加油機拔起來，還問店員油管怎這麼短。',
    likes: 76
  }
];

const BLACKBOX_INIT_LOGS = [
  { time: '12:56', tag: 'WIPER', text: '「想打右轉燈怎麼雨刷一直在刷啦？！」', danger: true },
  { time: '12:55', tag: 'NAV', text: '「導航說往東南東，車上哪有指北針！」', danger: false },
  { time: '12:53', tag: 'MIRROR', text: '「後照鏡折起來風阻比較小吧～」', danger: true }
];

const appState = {
  activeTab: 'radar',
  scenario: 'roundabout',
  chaosIndex: 76,
  clickMode: 'sanbao',
  radarPaused: false,
  profile: {
    name: '林小葵 (Aoi)',
    title: '晴天雨刷宗師',
    plate: 'SBO-8888',
    vehicle: '巨型休旅裝甲坦克・盲區 85%',
    motto: '「我方向燈打了 3 公里，是後車自己不讓的！」'
  },
  sanbaoPos: {
    x: 0.50,
    y: 0.50,
    vx: 0.0014,
    vy: -0.0011,
    angle: 0.4,
    radarSweep: 0,
    trail: []
  },
  userPos: { x: 0.78, y: 0.74, targetX: 0.78, targetY: 0.74 },
  // Ambient background traffic particles on avenues
  trafficCars: [
    { road: 'H', pos: 0.15, speed: 0.0018, laneOffset: -6 },
    { road: 'H', pos: 0.68, speed: -0.0015, laneOffset: 6 },
    { road: 'V', pos: 0.22, speed: 0.0016, laneOffset: 6 },
    { road: 'V', pos: 0.82, speed: -0.0019, laneOffset: -6 },
    { road: 'D', pos: 0.35, speed: 0.0014, laneOffset: -5 }
  ],
  osIndex: 0,
  blackboxLogs: [...BLACKBOX_INIT_LOGS],
  sightings: [],
  sightingFilter: 'ALL',
  routeForm: {
    origin: '西屯・市政中心',
    dest: '北屯好市多 B2 停車場',
    transport: 'scooter'
  },
  shareStyle: 'defense',
  meritCount: 108,
  heartRate: 138,
  parkingGame: {
    active: false,
    carX: 75,
    carY: 75,
    carAngle: 0,
    status: 'PLAYING'
  }
};

function loadPersistedData() {
  try {
    const savedProfile = localStorage.getItem('aegis_sanbao_profile_v5');
    if (savedProfile) appState.profile = { ...appState.profile, ...JSON.parse(savedProfile) };
  } catch (e) {}

  try {
    const savedSightings = localStorage.getItem('aegis_sanbao_sightings_v5');
    appState.sightings = savedSightings ? JSON.parse(savedSightings) : [...DEFAULT_SIGHTINGS];
  } catch (e) {
    appState.sightings = [...DEFAULT_SIGHTINGS];
  }

  try {
    const params = new URLSearchParams(window.location.search);
    if (params.get('name')) appState.profile.name = params.get('name');
    if (params.get('plate')) appState.profile.plate = params.get('plate');
    const modeParam = params.get('mode');
    if (modeParam && SCENARIOS[modeParam]) {
      appState.scenario = modeParam;
      appState.chaosIndex = SCENARIOS[modeParam].baseChaos;
    }
  } catch (e) {}
}

function saveProfileToStorage() {
  try { localStorage.setItem('aegis_sanbao_profile_v5', JSON.stringify(appState.profile)); } catch (e) {}
}

function saveSightingsToStorage() {
  try { localStorage.setItem('aegis_sanbao_sightings_v5', JSON.stringify(appState.sightings)); } catch (e) {}
}

function showToast(title, message, type = 'amber') {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const styles = {
    amber: 'border-amber-400/60 bg-slate-950/95 text-amber-200',
    red: 'border-red-500/70 bg-red-950/95 text-red-200',
    emerald: 'border-emerald-400/60 bg-slate-950/95 text-emerald-200',
    cyan: 'border-cyan-400/60 bg-slate-950/95 text-cyan-200'
  };

  const toast = document.createElement('div');
  toast.className = `pointer-events-auto px-3.5 py-2.5 rounded-xl border backdrop-blur-xl shadow-xl transition-all duration-300 transform translate-y-2 opacity-0 text-xs ${styles[type] || styles.amber}`;
  toast.innerHTML = `<div class="font-black text-white">${title}</div><div class="text-[11px] opacity-90 mt-0.5">${message}</div>`;

  container.appendChild(toast);
  requestAnimationFrame(() => toast.classList.remove('translate-y-2', 'opacity-0'));
  setTimeout(() => {
    toast.classList.add('translate-y-2', 'opacity-0');
    setTimeout(() => toast.remove(), 280);
  }, 2800);
}

let cutInTimeout = null;
function triggerAnimeCutIn(title, subtitle, color = '#EF4444') {
  const banner = document.getElementById('anime-cutin-banner');
  const bgSvg = document.getElementById('anime-cutin-svg');
  const titleEl = document.getElementById('anime-cutin-title');
  const subEl = document.getElementById('anime-cutin-sub');
  if (!banner || !bgSvg || !titleEl || !subEl) return;

  bgSvg.innerHTML = window.getAnimeCutInSVG(color, title.split('//')[0].trim());
  titleEl.textContent = title;
  titleEl.style.color = color;
  subEl.textContent = subtitle;

  banner.classList.remove('hidden', 'animate-cutin');
  void banner.offsetWidth;
  banner.classList.add('animate-cutin');

  if (cutInTimeout) clearTimeout(cutInTimeout);
  cutInTimeout = setTimeout(() => banner.classList.add('hidden'), 2150);
}

function computeTacticalMetrics() {
  const sc = SCENARIOS[appState.scenario];
  const dx = (appState.sanbaoPos.x - appState.userPos.x) * 6.0;
  const dy = (appState.sanbaoPos.y - appState.userPos.y) * 4.2;
  const distKm = Math.max(0.02, Math.sqrt(dx * dx + dy * dy));
  const chaosScale = 0.55 + (appState.chaosIndex / 100) * 0.9;
  const effectiveRadius = +(sc.radiusKm * chaosScale).toFixed(2);

  let survival = 99.9;
  if (appState.scenario !== 'home') {
    const ratio = distKm / Math.max(0.25, effectiveRadius);
    const raw = Math.min(99.5, Math.max(1.2, ratio * 52 - appState.chaosIndex * 0.18 + (5 - sc.levelNum) * 8));
    survival = +raw.toFixed(1);
  }
  return { distKm: +distKm.toFixed(2), effectiveRadius, survival };
}

function syncUI() {
  const sc = SCENARIOS[appState.scenario];
  const metrics = computeTacticalMetrics();

  const defconBadge = document.getElementById('header-defcon-badge');
  if (defconBadge) {
    defconBadge.textContent = sc.badge;
    defconBadge.style.backgroundColor = sc.color;
  }
  const tickerText = document.getElementById('header-ticker-text');
  if (tickerText) tickerText.textContent = `[${appState.profile.name}・${appState.profile.plate}] ${sc.ticker}`;

  const vipName = document.getElementById('vip-name');
  const vipTitle = document.getElementById('vip-title');
  const vipPlate = document.getElementById('vip-plate');
  const vipVehicle = document.getElementById('vip-vehicle');
  const vipOsBubble = document.getElementById('vip-os-bubble');
  const commandBannerImg = document.getElementById('command-banner-img');
  const cgCaption = document.getElementById('cg-card-caption');

  if (vipName) vipName.textContent = appState.profile.name;
  if (vipTitle) vipTitle.textContent = appState.profile.title;
  if (vipPlate) vipPlate.textContent = appState.profile.plate;
  if (vipVehicle) vipVehicle.textContent = appState.profile.vehicle;
  if (vipOsBubble) vipOsBubble.textContent = sc.osList[appState.osIndex % sc.osList.length];
  if (commandBannerImg && sc.bannerImg) commandBannerImg.src = sc.bannerImg;
  if (cgCaption) cgCaption.textContent = sc.cgCaption;

  const metricLevel = document.getElementById('metric-threat-level');
  const metricRadius = document.getElementById('metric-blast-radius');
  const metricDist = document.getElementById('metric-user-dist');
  const metricSurvival = document.getElementById('metric-survival-rate');
  const survivalBar = document.getElementById('metric-survival-bar');
  const threatCard = document.getElementById('threat-overview-card');

  if (metricLevel) {
    metricLevel.textContent = sc.level;
    metricLevel.style.color = sc.color;
  }
  if (metricRadius) metricRadius.textContent = `${metrics.effectiveRadius.toFixed(2)} km`;
  if (metricDist) metricDist.textContent = `${metrics.distKm.toFixed(2)} km`;
  if (metricSurvival) {
    metricSurvival.textContent = `${metrics.survival.toFixed(1)}%`;
    metricSurvival.style.color = metrics.survival < 40 ? '#EF4444' : metrics.survival < 75 ? '#F59E0B' : '#10B981';
  }
  if (survivalBar) survivalBar.style.width = `${Math.min(100, Math.max(4, metrics.survival))}%`;
  if (threatCard) threatCard.className = `lg:col-span-4 rounded-2xl p-4 flex flex-col justify-between transition-all duration-300 ${sc.panelClass}`;

  document.querySelectorAll('[data-scenario-btn]').forEach((btn) => {
    const key = btn.getAttribute('data-scenario-btn');
    const active = key === appState.scenario;
    btn.classList.toggle('ring-2', active);
    btn.classList.toggle('ring-amber-400', active);
    btn.classList.toggle('bg-slate-800/90', active);
  });

  const obdSpeed = document.getElementById('obd-speed');
  const obdConfusion = document.getElementById('obd-confusion');
  const obdReroute = document.getElementById('obd-reroute');
  const leftTurnLamp = document.getElementById('lamp-left-turn');
  const rightTurnLamp = document.getElementById('lamp-right-turn');
  const wiperArmLeft = document.getElementById('wiper-arm-left');
  const wiperArmRight = document.getElementById('wiper-arm-right');
  const wiperStatusBadge = document.getElementById('wiper-status-badge');
  const carHeadingLabel = document.getElementById('car-heading-paradox');

  const jitter = appState.scenario === 'home' ? 0 : Math.round((Math.random() - 0.5) * 3);
  if (obdSpeed) obdSpeed.textContent = `${Math.max(0, sc.speedKmh + jitter)} km/h`;
  if (obdConfusion) obdConfusion.textContent = `${Math.min(99, Math.round(sc.brakeGasConfusion * (0.7 + appState.chaosIndex / 200)))}%`;
  if (obdReroute) obdReroute.textContent = `${sc.navRerouteCount} 次`;

  if (leftTurnLamp) leftTurnLamp.classList.toggle('signal-blink-active', sc.leftSignal);
  if (rightTurnLamp) rightTurnLamp.classList.toggle('signal-blink-active', sc.rightSignal);

  const isRapidWiper = sc.wiperRapid || appState.wiperBoostActive;
  if (wiperArmLeft && wiperArmRight) {
    wiperArmLeft.classList.toggle('wiper-rapid', isRapidWiper);
    wiperArmRight.classList.toggle('wiper-rapid', isRapidWiper);
    wiperArmLeft.classList.toggle('wiper-idle', !isRapidWiper && appState.scenario !== 'home');
    wiperArmRight.classList.toggle('wiper-idle', !isRapidWiper && appState.scenario !== 'home');
  }
  if (wiperStatusBadge) {
    wiperStatusBadge.textContent = isRapidWiper ? '☀️ 晴天雨刷 MAX' : appState.scenario === 'home' ? '🌙 熄火休眠' : '☀️ 偶發誤觸';
  }
  if (carHeadingLabel) {
    carHeadingLabel.textContent = appState.scenario === 'home' ? '車輪靜止' : `打左燈 ➔ 右偏 +${Math.abs(sc.carTiltDeg)}°`;
  }

  const chaosValEl = document.getElementById('chaos-slider-val');
  if (chaosValEl) chaosValEl.textContent = `${appState.chaosIndex}%`;

  updateSharePreviewText();
}

window.selectScenario = function (key) {
  if (!SCENARIOS[key]) return;
  window.soundEngine.playClick(640);
  appState.scenario = key;
  const sc = SCENARIOS[key];
  appState.chaosIndex = sc.baseChaos;
  const slider = document.getElementById('chaos-slider');
  if (slider) slider.value = sc.baseChaos;

  if (key === 'parking') {
    appState.sanbaoPos.x = 0.22;
    appState.sanbaoPos.y = 0.25;
    window.soundEngine.playSiren();
  } else if (key === 'roundabout') {
    appState.sanbaoPos.x = 0.50;
    appState.sanbaoPos.y = 0.50;
    window.soundEngine.playPing();
  } else if (key === 'snack') {
    appState.sanbaoPos.x = 0.76;
    appState.sanbaoPos.y = 0.28;
    window.soundEngine.playPing();
  }

  triggerAnimeCutIn(sc.cutInTitle, sc.cutInSub, sc.color);
  syncUI();
  calculateRouteSafety(false);
};

window.switchTab = function (tabId) {
  window.soundEngine.playClick(780);
  appState.activeTab = tabId;

  ['radar', 'route', 'dossier'].forEach((id) => {
    const section = document.getElementById(`tab-panel-${id}`);
    const btn = document.getElementById(`tab-btn-${id}`);
    if (section) section.classList.toggle('hidden', id !== tabId);
    if (btn) {
      btn.className =
        id === tabId
          ? 'px-4 py-1.5 rounded-lg font-bold text-xs flex items-center gap-1.5 bg-gradient-to-r from-amber-500 to-red-500 text-slate-950 shadow-[0_0_15px_rgba(245,158,11,0.4)] transition-all'
          : 'px-4 py-1.5 rounded-lg font-medium text-xs flex items-center gap-1.5 text-slate-400 hover:text-white transition-all';
    }
  });

  if (tabId === 'dossier') requestAnimationFrame(() => drawHexagonChart());
  if (tabId === 'route') {
    calculateRouteSafety(false);
    updateSharePreviewText();
  }
};

window.triggerWiperParadox = function () {
  window.soundEngine.playWiperSlap();
  appState.wiperBoostActive = true;
  SCENARIOS[appState.scenario].navRerouteCount += 3;

  const nowStr = new Date().toTimeString().slice(0, 5);
  const lines = [
    '「想打右轉燈為什麼雨刷又開到最快了啦！」',
    '「副駕快幫我查雨刷怎麼關！眼睛好暈！」',
    '「太陽這麼大為什麼我的車會自己噴雨刷水？！」'
  ];

  appState.blackboxLogs.unshift({
    time: nowStr,
    tag: 'WIPER',
    text: lines[Math.floor(Math.random() * lines.length)],
    danger: true
  });
  if (appState.blackboxLogs.length > 6) appState.blackboxLogs.pop();

  renderBlackboxLogs();
  triggerAnimeCutIn('PARADOX // 轉彎誤刷雨刷', '方向燈誠信度 -50%・前擋乾刷暴走！', '#F59E0B');
  syncUI();

  setTimeout(() => {
    appState.wiperBoostActive = false;
    syncUI();
  }, 4000);
};

function renderBlackboxLogs() {
  const container = document.getElementById('blackbox-log-list');
  if (!container) return;
  container.innerHTML = appState.blackboxLogs
    .map(
      (item) => `
      <div class="px-3 py-2 rounded-xl border ${
        item.danger ? 'bg-red-950/30 border-red-500/30 text-red-100' : 'bg-slate-900/70 border-white/10 text-slate-200'
      } text-xs flex items-center justify-between gap-2">
        <span class="truncate">${item.text}</span>
        <span class="font-mono text-[10px] text-slate-400 shrink-0">${item.time}</span>
      </div>`
    )
    .join('');
}

window.calculateFarthestEscape = function () {
  window.soundEngine.playPing();
  const corners = [
    { x: 0.12, y: 0.14, label: '西北高架掩體' },
    { x: 0.88, y: 0.14, label: '東北山區步道' },
    { x: 0.12, y: 0.86, label: '西南高鐵月台' },
    { x: 0.84, y: 0.79, label: '高架捷運避難站' }
  ];

  let best = corners[0];
  let maxDist = -1;
  corners.forEach((c) => {
    const d = Math.hypot(c.x - appState.sanbaoPos.x, c.y - appState.sanbaoPos.y);
    if (d > maxDist) {
      maxDist = d;
      best = c;
    }
  });

  appState.userPos.targetX = best.x;
  appState.userPos.targetY = best.y;
  showToast('🏃 逃生導航啟動', `已鎖定最遠安全掩體：【${best.label}】`, 'cyan');
};

window.setRadarClickMode = function (mode) {
  window.soundEngine.playClick(700);
  appState.clickMode = mode;
  const btnSanbao = document.getElementById('mode-btn-sanbao');
  const btnUser = document.getElementById('mode-btn-user');
  if (btnSanbao && btnUser) {
    btnSanbao.className =
      mode === 'sanbao'
        ? 'px-3 py-1 rounded-lg text-xs font-bold bg-red-500 text-white shadow-[0_0_12px_rgba(239,68,68,0.45)] transition-all'
        : 'px-3 py-1 rounded-lg text-xs font-medium text-slate-300 hover:text-white bg-slate-900 border border-white/10 transition-all';
    btnUser.className =
      mode === 'user'
        ? 'px-3 py-1 rounded-lg text-xs font-bold bg-cyan-400 text-slate-950 shadow-[0_0_12px_rgba(6,182,212,0.45)] transition-all'
        : 'px-3 py-1 rounded-lg text-xs font-medium text-slate-300 hover:text-white bg-slate-900 border border-white/10 transition-all';
  }
};

window.toggleRadarPause = function () {
  window.soundEngine.playClick(540);
  appState.radarPaused = !appState.radarPaused;
  const btn = document.getElementById('radar-pause-btn');
  if (btn) btn.innerHTML = appState.radarPaused ? '▶️ 繼續' : '⏸️ 暫停';
};

// ============================================================================
// ULTRA-DETAILED ANIME TACTICAL CITY MAP ENGINE (Zero Overlapping Labels)
// ============================================================================
function initTacticalRadarCanvas() {
  const canvas = document.getElementById('tactical-radar-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  function resizeCanvas() {
    const rect = canvas.parentElement.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  window.addEventListener('resize', resizeCanvas);
  resizeCanvas();

  canvas.addEventListener('click', (e) => {
    const rect = canvas.getBoundingClientRect();
    const nx = Math.min(0.92, Math.max(0.08, (e.clientX - rect.left) / rect.width));
    const ny = Math.min(0.90, Math.max(0.10, (e.clientY - rect.top) / rect.height));

    window.soundEngine.playPing();
    if (appState.clickMode === 'sanbao') {
      appState.sanbaoPos.x = nx;
      appState.sanbaoPos.y = ny;
      appState.sanbaoPos.trail = [];
      showToast('🎯 三寶座標已瞬移', `已鎖定於 (${(nx * 100).toFixed(0)}, ${(ny * 100).toFixed(0)})`, 'red');
    } else {
      appState.userPos.x = nx;
      appState.userPos.y = ny;
      appState.userPos.targetX = nx;
      appState.userPos.targetY = ny;
      showToast('🛡️ 避難位置已更新', '生還率已即時重算！', 'cyan');
    }
    syncUI();
  });

  function renderRadarFrame() {
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    if (w === 0 || h === 0) {
      requestAnimationFrame(renderRadarFrame);
      return;
    }

    const sc = SCENARIOS[appState.scenario];
    const metrics = computeTacticalMetrics();
    const cx = w * 0.50;
    const cy = h * 0.50;

    // 1. Update Sanbao Movement & Breadcrumb Trail
    if (!appState.radarPaused && appState.scenario !== 'home') {
      const speed = (appState.chaosIndex / 100) * 0.0022;
      if (Math.random() < 0.035 + (appState.chaosIndex / 100) * 0.05) {
        appState.sanbaoPos.angle += (Math.random() - 0.45) * 1.45;
      }
      appState.sanbaoPos.vx = Math.cos(appState.sanbaoPos.angle) * speed;
      appState.sanbaoPos.vy = Math.sin(appState.sanbaoPos.angle) * speed;

      appState.sanbaoPos.x += appState.sanbaoPos.vx;
      appState.sanbaoPos.y += appState.sanbaoPos.vy;

      if (appState.sanbaoPos.x < 0.09 || appState.sanbaoPos.x > 0.91) {
        appState.sanbaoPos.angle = Math.PI - appState.sanbaoPos.angle;
        appState.sanbaoPos.x = Math.min(0.91, Math.max(0.09, appState.sanbaoPos.x));
      }
      if (appState.sanbaoPos.y < 0.12 || appState.sanbaoPos.y > 0.88) {
        appState.sanbaoPos.angle = -appState.sanbaoPos.angle;
        appState.sanbaoPos.y = Math.min(0.88, Math.max(0.12, appState.sanbaoPos.y));
      }

      // Record breadcrumb trail
      appState.sanbaoPos.trail.push({ x: appState.sanbaoPos.x, y: appState.sanbaoPos.y });
      if (appState.sanbaoPos.trail.length > 28) appState.sanbaoPos.trail.shift();
    }

    appState.userPos.x += (appState.userPos.targetX - appState.userPos.x) * 0.09;
    appState.userPos.y += (appState.userPos.targetY - appState.userPos.y) * 0.09;
    appState.sanbaoPos.radarSweep = (appState.sanbaoPos.radarSweep + 0.028) % (Math.PI * 2);

    // 2. Deep Anime Night City Base
    ctx.fillStyle = '#05070C';
    ctx.fillRect(0, 0, w, h);

    // 3. River / Canal Waterway (Adds rich geographical depth)
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(0, h * 0.82);
    ctx.bezierCurveTo(w * 0.35, h * 0.72, w * 0.55, h * 0.95, w, h * 0.62);
    ctx.lineWidth = 22;
    ctx.strokeStyle = 'rgba(6, 182, 212, 0.08)';
    ctx.stroke();
    ctx.lineWidth = 1.5;
    ctx.strokeStyle = 'rgba(6, 182, 212, 0.22)';
    ctx.stroke();
    ctx.restore();

    // 4. Fine Tactical Grid + Degree Ticks on Borders
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.035)';
    ctx.lineWidth = 1;
    const grid = 36;
    for (let x = 0; x < w; x += grid) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, h);
      ctx.stroke();
    }
    for (let y = 0; y < h; y += grid) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(w, y);
      ctx.stroke();
    }

    // 5. Architectural City Blocks (3D-style Blueprint Footprints)
    CITY_BLOCKS.forEach((b) => {
      const bx = b.x * w;
      const by = b.y * h;
      const bw = b.w * w;
      const bh = b.h * h;
      ctx.fillStyle = 'rgba(15, 23, 42, 0.55)';
      ctx.strokeStyle = 'rgba(148, 163, 184, 0.12)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.roundRect(bx, by, bw, bh, 4);
      ctx.fill();
      ctx.stroke();
    });

    // 6. Multi-Lane Arterial Highways with Center Dividers
    const drawHighway = (x1, y1, x2, y2, width = 14) => {
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.strokeStyle = '#0F172A';
      ctx.lineWidth = width;
      ctx.stroke();

      // Road edges
      ctx.strokeStyle = 'rgba(148, 163, 184, 0.25)';
      ctx.lineWidth = width;
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.strokeStyle = '#090D16';
      ctx.lineWidth = width - 2;
      ctx.stroke();

      // Dashed lane center line
      ctx.setLineDash([6, 6]);
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.strokeStyle = 'rgba(245, 158, 11, 0.28)';
      ctx.lineWidth = 1.2;
      ctx.stroke();
      ctx.restore();
    };

    // Horizontal Boulevard (Taiwan Blvd)
    drawHighway(0, cy, w, cy, 16);
    // Vertical Boulevard (Wenxin Rd)
    drawHighway(cx, 0, cx, h, 16);
    // Diagonal Expressway
    drawHighway(0, h * 0.14, w, h * 0.86, 12);

    // 7. Ambient Normal Traffic Dots Moving Along Roads
    appState.trafficCars.forEach((car) => {
      if (!appState.radarPaused) {
        car.pos = (car.pos + car.speed + 1) % 1;
      }
      let tx = 0;
      let ty = 0;
      if (car.road === 'H') {
        tx = car.pos * w;
        ty = cy + car.laneOffset;
      } else if (car.road === 'V') {
        tx = cx + car.laneOffset;
        ty = car.pos * h;
      } else {
        tx = car.pos * w;
        ty = h * (0.14 + car.pos * 0.72) + car.laneOffset;
      }
      ctx.fillStyle = 'rgba(226, 232, 240, 0.55)';
      ctx.beginPath();
      ctx.arc(tx, ty, 2.2, 0, Math.PI * 2);
      ctx.fill();
    });

    // 8. Central Roundabout Hub & Concentric NERV Telemetry Rings
    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, cy, 42, 0, Math.PI * 2);
    ctx.fillStyle = '#090D16';
    ctx.fill();
    ctx.lineWidth = 8;
    ctx.strokeStyle = '#1E293B';
    ctx.stroke();
    ctx.lineWidth = 1.5;
    ctx.strokeStyle = 'rgba(245, 158, 11, 0.4)';
    ctx.stroke();

    // Inner roundabout core
    ctx.beginPath();
    ctx.arc(cx, cy, 18, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(245, 158, 11, 0.12)';
    ctx.fill();
    ctx.strokeStyle = 'rgba(245, 158, 11, 0.45)';
    ctx.lineWidth = 1;
    ctx.stroke();
    ctx.restore();

    // NERV Range Rings with degree ticks
    [95, 180, 265].forEach((r, idx) => {
      ctx.save();
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(6, 182, 212, 0.10)';
      ctx.lineWidth = 1;
      ctx.stroke();

      ctx.font = '600 9px "JetBrains Mono", monospace';
      ctx.fillStyle = 'rgba(6, 182, 212, 0.45)';
      ctx.fillText(`R-${idx + 1} // ${(r * 0.012).toFixed(1)}km`, cx + 6, cy - r + 11);
      ctx.restore();
    });

    // 9. Landmarks (Cleanly aligned so they never collide)
    LANDMARKS.forEach((lm) => {
      const lx = lm.x * w;
      const ly = lm.y * h;

      ctx.save();
      // Outer diamond/hexagon marker
      ctx.beginPath();
      ctx.arc(lx, ly, 5, 0, Math.PI * 2);
      ctx.fillStyle = lm.color;
      ctx.fill();

      ctx.beginPath();
      ctx.arc(lx, ly, 10, 0, Math.PI * 2);
      ctx.strokeStyle = lm.color;
      ctx.lineWidth = 1.2;
      ctx.stroke();

      ctx.font = '700 11px "Noto Sans TC", sans-serif';
      let tx = lx + 14;
      let ty = ly + 4;
      if (lm.align === 'left') {
        ctx.textAlign = 'right';
        tx = lx - 14;
      } else if (lm.align === 'bottom') {
        ctx.textAlign = 'center';
        tx = lx;
        ty = ly + 24;
      }

      // Subtle pill backdrop behind landmark text so road lines never muddy the text
      const labelStr = `${lm.name} [${lm.tag}]`;
      const tw = ctx.measureText(labelStr).width + 10;
      let rx = tx - 5;
      if (lm.align === 'left') rx = tx - tw + 5;
      if (lm.align === 'bottom') rx = tx - tw / 2;

      ctx.fillStyle = 'rgba(5, 7, 12, 0.82)';
      ctx.beginPath();
      ctx.roundRect(rx, ty - 12, tw, 17, 4);
      ctx.fill();

      ctx.fillStyle = '#F1F5F9';
      ctx.fillText(labelStr, tx, ty);
      ctx.restore();
    });

    // 10. Sanbao Breadcrumb Trail + Blast Rings + Directional Car Vector
    const sx = appState.sanbaoPos.x * w;
    const sy = appState.sanbaoPos.y * h;
    const innerR = Math.max(24, metrics.effectiveRadius * 34);
    const outerR = innerR * 1.48;

    // Breadcrumb trail
    if (appState.sanbaoPos.trail.length > 1) {
      ctx.save();
      ctx.beginPath();
      appState.sanbaoPos.trail.forEach((pt, i) => {
        const px = pt.x * w;
        const py = pt.y * h;
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      });
      ctx.strokeStyle = 'rgba(245, 158, 11, 0.35)';
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.restore();
    }

    // Outer Amber Deception Ring
    ctx.save();
    ctx.setLineDash([6, 5]);
    ctx.beginPath();
    ctx.arc(sx, sy, outerR, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(245, 158, 11, 0.6)';
    ctx.lineWidth = 1.5;
    ctx.stroke();
    ctx.fillStyle = 'rgba(245, 158, 11, 0.05)';
    ctx.fill();
    ctx.restore();

    // Inner Crimson Danger Zone
    ctx.save();
    ctx.beginPath();
    ctx.arc(sx, sy, innerR, 0, Math.PI * 2);
    ctx.fillStyle = appState.scenario === 'home' ? 'rgba(16, 185, 129, 0.12)' : 'rgba(239, 68, 68, 0.15)';
    ctx.fill();
    ctx.strokeStyle = sc.color;
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.restore();

    // Rotating Radar Sweep Cone
    ctx.save();
    ctx.translate(sx, sy);
    ctx.rotate(appState.sanbaoPos.radarSweep);
    const sweepGrad = ctx.createRadialGradient(0, 0, 2, 0, 0, outerR);
    sweepGrad.addColorStop(0, appState.scenario === 'home' ? 'rgba(16, 185, 129, 0.4)' : 'rgba(239, 68, 68, 0.42)');
    sweepGrad.addColorStop(1, 'rgba(239, 68, 68, 0)');
    ctx.fillStyle = sweepGrad;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.arc(0, 0, outerR, -0.32, 0.32);
    ctx.closePath();
    ctx.fill();
    ctx.restore();

    // Schrödinger's Predicted Trajectory Vector
    if (appState.scenario !== 'home') {
      ctx.save();
      ctx.setLineDash([4, 4]);
      ctx.strokeStyle = '#EF4444';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(sx, sy);
      const p1x = sx + Math.cos(appState.sanbaoPos.angle + 0.45) * 55;
      const p1y = sy + Math.sin(appState.sanbaoPos.angle + 0.45) * 55;
      const p2x = p1x + Math.cos(appState.sanbaoPos.angle - 0.85) * 45;
      const p2y = p1y + Math.sin(appState.sanbaoPos.angle - 0.85) * 45;
      ctx.lineTo(p1x, p1y);
      ctx.lineTo(p2x, p2y);
      ctx.stroke();
      ctx.restore();
    }

    // 11. User Shield Marker & Escape Distance Line
    const ux = appState.userPos.x * w;
    const uy = appState.userPos.y * h;

    ctx.save();
    ctx.setLineDash([3, 4]);
    ctx.strokeStyle = 'rgba(6, 182, 212, 0.6)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(sx, sy);
    ctx.lineTo(ux, uy);
    ctx.stroke();

    // Midpoint Distance Tag
    const mx = (sx + ux) / 2;
    const my = (sy + uy) / 2;
    ctx.fillStyle = 'rgba(5, 7, 12, 0.92)';
    ctx.strokeStyle = 'rgba(6, 182, 212, 0.65)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.roundRect(mx - 34, my - 10, 68, 20, 5);
    ctx.fill();
    ctx.stroke();
    ctx.font = '700 10px "JetBrains Mono", monospace';
    ctx.fillStyle = '#22D3EE';
    ctx.textAlign = 'center';
    ctx.fillText(`${metrics.distKm} km`, mx, my + 4);
    ctx.restore();

    // User Marker (Smart label flip if near right edge)
    ctx.save();
    ctx.beginPath();
    ctx.arc(ux, uy, 8, 0, Math.PI * 2);
    ctx.fillStyle = '#06B6D4';
    ctx.fill();
    ctx.lineWidth = 2;
    ctx.strokeStyle = '#FFFFFF';
    ctx.stroke();

    ctx.font = '700 11px "Noto Sans TC", sans-serif';
    const userOnRight = ux > w * 0.75;
    ctx.textAlign = userOnRight ? 'right' : 'left';
    const ulx = userOnRight ? ux - 13 : ux + 13;
    ctx.fillStyle = '#67E8F9';
    ctx.fillText('🛡️ 您 (避難者)', ulx, uy + 4);
    ctx.restore();

    // 12. Sanbao Vehicle Icon + Smart Non-Clipped Callout Tag
    ctx.save();
    ctx.translate(sx, sy);
    ctx.rotate(appState.sanbaoPos.angle);
    // Top-down Anime Tactical Vehicle Arrow
    ctx.fillStyle = sc.color;
    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = 1.8;
    ctx.beginPath();
    ctx.roundRect(-11, -7, 22, 14, 4);
    ctx.fill();
    ctx.stroke();
    // Windshield highlight
    ctx.fillStyle = '#FEF08A';
    ctx.fillRect(3, -5, 4, 10);
    ctx.restore();

    // Smart Callout Pill for Sanbao (Automatically flips below if near top edge, or left if near right edge)
    ctx.save();
    const tagStr = `🎯 ${appState.profile.name} [${appState.profile.plate}]`;
    ctx.font = '700 11px "Noto Sans TC", sans-serif';
    const tagW = ctx.measureText(tagStr).width + 16;
    const bx = Math.min(w - tagW - 8, Math.max(8, sx - tagW / 2));
    const by = sy < 60 ? sy + 18 : sy - 38;

    ctx.fillStyle = 'rgba(15, 23, 42, 0.94)';
    ctx.strokeStyle = sc.color;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.roundRect(bx, by, tagW, 22, 6);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#FFFFFF';
    ctx.fillText(tagStr, bx + 8, by + 15);
    ctx.restore();

    // 13. Crisp Corner HUD Compass & Scale Bar (Top-Right & Bottom-Right inside Canvas)
    ctx.save();
    ctx.font = '700 10px "JetBrains Mono", monospace';
    ctx.fillStyle = 'rgba(148, 163, 184, 0.7)';
    ctx.textAlign = 'right';
    ctx.fillText(`SECTOR: TAICHUNG-04 // SCALE 1:25000`, w - 12, 20);
    ctx.restore();

    requestAnimationFrame(renderRadarFrame);
  }

  requestAnimationFrame(renderRadarFrame);
}

// ============================================================================
// Tab 2: Route Safety Check & Share URL Generator
// ============================================================================
window.selectTransportMode = function (mode) {
  window.soundEngine.playClick(760);
  appState.routeForm.transport = mode;
  document.querySelectorAll('[data-transport-btn]').forEach((btn) => {
    const m = btn.getAttribute('data-transport-btn');
    const active = m === mode;
    btn.className = active
      ? 'p-2.5 rounded-xl border-2 border-amber-400 bg-amber-500/20 text-white font-bold text-xs flex items-center gap-2 transition-all'
      : 'p-2.5 rounded-xl border border-white/10 bg-slate-900/70 text-slate-300 text-xs flex items-center gap-2 transition-all';
  });
  calculateRouteSafety(true);
};

window.calculateRouteSafety = function (playSound = true) {
  if (playSound) window.soundEngine.playPing();
  const originEl = document.getElementById('route-origin');
  const destEl = document.getElementById('route-dest');
  if (originEl) appState.routeForm.origin = originEl.value;
  if (destEl) appState.routeForm.dest = destEl.value;

  const sc = SCENARIOS[appState.scenario];
  const mode = appState.routeForm.transport;

  const bonus = { walk: 18, scooter: 42, car: 26, mrt: -65 }[mode] || 20;
  let prob = Math.min(99.4, Math.max(0.8, sc.levelNum * 16 + bonus + appState.chaosIndex * 0.15));
  if (appState.scenario === 'home') prob = 0.5;
  if (mode === 'mrt') prob = Math.max(1.2, prob * 0.15);

  let omen = '【大吉 // 天佑平安】';
  let color = '#10B981';
  let dist = '保持 15m 正常車距即可';
  let blind = '無明顯威脅，道路順暢';
  let gear = '太陽眼鏡 + 愉悅心情';
  let advice = `✅ 目前 ${appState.profile.name} 威脅極低或您已物理隔離，請安心出門！`;

  if (prob >= 70) {
    omen = '【大凶 // 建議就地掩護】';
    color = '#EF4444';
    dist = '隔開 3 個紅綠燈 (1.8km+)';
    blind = `車牌 ${appState.profile.plate} 全車周圍 85% 盲區`;
    gear = '全罩帽 + 超額險 3000 萬 + 4K 雙鏡頭';
    advice = `⚠️ 警告：目的地與三寶暴風圈重疊！看到前車晴天刷雨刷請立即改搭捷運！`;
  } else if (prob >= 35) {
    omen = '【中平偏凶 // 嚴禁併行】';
    color = '#F59E0B';
    dist = '保持 450m 以上，切勿併行';
    blind = '打左轉燈時，其右側為 92% 鬼切區';
    gear = '高分貝喇叭 + 行車紀錄器';
    advice = `⚡ 切記「三寶打左燈，必往右邊偏」鐵律，絕對別信他的方向燈！`;
  }

  const omenEl = document.getElementById('route-result-omen');
  const probEl = document.getElementById('route-result-prob');
  const distEl = document.getElementById('route-result-dist');
  const blindEl = document.getElementById('route-result-blindspot');
  const gearEl = document.getElementById('route-result-gear');
  const adviceEl = document.getElementById('route-result-advice');

  if (omenEl) { omenEl.textContent = omen; omenEl.style.color = color; }
  if (probEl) { probEl.textContent = `${prob.toFixed(1)}%`; probEl.style.color = color; }
  if (distEl) distEl.textContent = dist;
  if (blindEl) blindEl.textContent = blind;
  if (gearEl) gearEl.textContent = gear;
  if (adviceEl) adviceEl.textContent = advice;
};

window.selectShareStyle = function (style) {
  window.soundEngine.playClick(700);
  appState.shareStyle = style;
  document.querySelectorAll('[data-share-style-btn]').forEach((btn) => {
    const s = btn.getAttribute('data-share-style-btn');
    btn.className =
      s === style
        ? 'px-2.5 py-1 rounded-lg text-xs font-bold bg-amber-500 text-slate-950'
        : 'px-2.5 py-1 rounded-lg text-xs font-medium bg-slate-900 text-slate-300 border border-white/10';
  });
  updateSharePreviewText();
};

function updateSharePreviewText() {
  const box = document.getElementById('share-copy-textarea');
  if (!box) return;

  const sc = SCENARIOS[appState.scenario];
  const metrics = computeTacticalMetrics();
  const { name, plate } = appState.profile;
  const shareUrl = `https://seanko31415.github.io/aegis-sanbao-radar/?name=${encodeURIComponent(name)}&plate=${encodeURIComponent(plate)}&mode=${appState.scenario}`;

  if (appState.shareStyle === 'defense') {
    box.value = `🚨【AEGIS 國家級三寶警報】🚨\n目標「${name}」(${plate}) 已上路！\n當前狀態：${sc.level}（暴風半徑 ${metrics.effectiveRadius}km）\n情報：${sc.ticker}\n📡 即時防空雷達：${shareUrl}`;
  } else if (appState.shareStyle === 'elder') {
    box.value = `🌸早安平安喜樂🌸\n好友【${name}】今天開車出門囉 (${plate}) 🚗\n目前正在「${sc.level}」，方圓 ${metrics.effectiveRadius}km 請多禮讓～\n💡 看到他刷雨刷代表他想轉彎喔！\n📡 平安雷達：${shareUrl}`;
  } else {
    box.value = `📺【突發路況快訊】\n用路傳奇「${name}」駕駛 ${plate} 現蹤街頭！目前處於「${sc.level}」，大晴天雨刷高速運轉中，請保持 3 個紅綠燈車距！\n📡 現場雷達：${shareUrl}`;
  }
}

window.copyShareText = function () {
  window.soundEngine.playClick(920);
  const box = document.getElementById('share-copy-textarea');
  if (!box) return;
  navigator.clipboard?.writeText(box.value).then(() => {
    showToast('📋 已複製警報文案', '快貼到 LINE 群組拯救親友保桿！', 'emerald');
  });
};

window.copyCustomUrl = function () {
  window.soundEngine.playClick(880);
  const nameInput = document.getElementById('input-profile-name');
  const plateInput = document.getElementById('input-profile-plate');
  const name = (nameInput && nameInput.value.trim()) || appState.profile.name;
  const plate = (plateInput && plateInput.value.trim()) || appState.profile.plate;
  const url = `https://seanko31415.github.io/aegis-sanbao-radar/?name=${encodeURIComponent(name)}&plate=${encodeURIComponent(plate)}&mode=${appState.scenario}`;
  navigator.clipboard?.writeText(url).then(() => {
    showToast('🔗 專屬網址已複製！', `打開即自動鎖定【${name}・${plate}】`, 'cyan');
  });
};

// ============================================================================
// Tab 3: Hexagon Radar & Sightings
// ============================================================================
function drawHexagonChart() {
  const canvas = document.getElementById('hexagon-chart-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const dpr = window.devicePixelRatio || 1;
  const size = 300;
  canvas.width = size * dpr;
  canvas.height = size * dpr;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

  const cx = size / 2;
  const cy = size / 2;
  const maxR = size * 0.34;

  const axes = [
    { label: '雨刷誤觸', val: 98 },
    { label: '謎之自信', val: 100 },
    { label: '停車耗時', val: 95 },
    { label: '方向燈誠信', val: 12 },
    { label: '空間方向感', val: 15 },
    { label: '副駕驚嚇', val: 96 }
  ];

  ctx.clearRect(0, 0, size, size);

  [0.25, 0.5, 0.75, 1.0].forEach((step) => {
    ctx.beginPath();
    axes.forEach((_, i) => {
      const a = (Math.PI * 2 * i) / 6 - Math.PI / 2;
      const x = cx + Math.cos(a) * maxR * step;
      const y = cy + Math.sin(a) * maxR * step;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.closePath();
    ctx.strokeStyle = step === 1 ? 'rgba(245, 158, 11, 0.45)' : 'rgba(255, 255, 255, 0.1)';
    ctx.stroke();
  });

  axes.forEach((axis, i) => {
    const a = (Math.PI * 2 * i) / 6 - Math.PI / 2;
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(cx + Math.cos(a) * maxR, cy + Math.sin(a) * maxR);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
    ctx.stroke();

    const lx = cx + Math.cos(a) * (maxR + 28);
    const ly = cy + Math.sin(a) * (maxR + 20);
    ctx.font = '700 11px "Noto Sans TC", sans-serif';
    ctx.fillStyle = '#F8FAFC';
    ctx.textAlign = 'center';
    ctx.fillText(axis.label, lx, ly - 2);
    ctx.font = '700 10px "JetBrains Mono", monospace';
    ctx.fillStyle = axis.val >= 80 ? '#EF4444' : '#22D3EE';
    ctx.fillText(`${axis.val}`, lx, ly + 11);
  });

  ctx.beginPath();
  axes.forEach((axis, i) => {
    const a = (Math.PI * 2 * i) / 6 - Math.PI / 2;
    const r = (axis.val / 100) * maxR;
    const x = cx + Math.cos(a) * r;
    const y = cy + Math.sin(a) * r;
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  });
  ctx.closePath();
  ctx.fillStyle = 'rgba(239, 68, 68, 0.30)';
  ctx.fill();
  ctx.strokeStyle = '#F59E0B';
  ctx.lineWidth = 2.2;
  ctx.stroke();
}

window.filterSightings = function (filter) {
  window.soundEngine.playClick(680);
  appState.sightingFilter = filter;
  document.querySelectorAll('[data-sighting-filter]').forEach((btn) => {
    const f = btn.getAttribute('data-sighting-filter');
    btn.className =
      f === filter
        ? 'px-2.5 py-1 rounded-lg text-xs font-bold bg-amber-500 text-slate-950'
        : 'px-2.5 py-1 rounded-lg text-xs font-medium bg-slate-900 text-slate-300 border border-white/10';
  });
  renderSightingsList();
};

function renderSightingsList() {
  const listEl = document.getElementById('sightings-wall-list');
  if (!listEl) return;

  const filtered = appState.sightings.filter(
    (s) => appState.sightingFilter === 'ALL' || s.rank === appState.sightingFilter
  );

  listEl.innerHTML = filtered
    .map(
      (item) => `
      <div class="p-3.5 rounded-xl border ${
        item.rank === 'S' ? 'bg-red-950/20 border-red-500/35' : 'bg-slate-900/75 border-white/10'
      } flex flex-col gap-1.5">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2">
            <span class="px-2 py-0.5 rounded text-[10px] font-mono font-black ${
              item.rank === 'S' ? 'bg-red-500 text-white' : 'bg-amber-500 text-slate-950'
            }">${item.rank}級</span>
            <span class="font-bold text-xs text-white">📍 ${item.location}</span>
          </div>
          <span class="text-[10px] font-mono text-slate-400">${item.time}</span>
        </div>
        <p class="text-xs text-slate-200 leading-relaxed">${item.content}</p>
        <div class="flex items-center justify-between pt-1">
          <span class="text-[10px] text-slate-400">回報：${item.reporter}</span>
          <button onclick="likeSighting('${item.id}')" class="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-amber-500/20 border border-white/10 text-[11px] font-mono text-amber-300">
            🙏 感謝救命 +${item.likes}
          </button>
        </div>
      </div>`
    )
    .join('');
}

window.likeSighting = function (id) {
  window.soundEngine.playWoodfish();
  const target = appState.sightings.find((s) => s.id === id);
  if (target) {
    target.likes += 1;
    saveSightingsToStorage();
    renderSightingsList();
  }
};

window.submitNewSighting = function (e) {
  e.preventDefault();
  const rank = document.getElementById('new-sighting-rank')?.value || 'S';
  const location = document.getElementById('new-sighting-location')?.value.trim();
  const content = document.getElementById('new-sighting-content')?.value.trim();

  if (!location || !content) {
    showToast('⚠️ 請填寫地點與事蹟', '填寫後即可發布至戰報牆', 'red');
    return;
  }

  window.soundEngine.playPing();
  appState.sightings.unshift({
    id: 's_' + Date.now(),
    rank,
    location,
    time: '剛剛',
    reporter: '熱心損友',
    content,
    likes: 1
  });
  saveSightingsToStorage();
  renderSightingsList();

  document.getElementById('new-sighting-location').value = '';
  document.getElementById('new-sighting-content').value = '';
  showToast('📡 戰報已登錄', `已發布「${location}」目擊情報！`, 'emerald');
};

// Modals & Mini-Game
window.openPresidentialAlert = function () {
  window.soundEngine.playSiren();
  document.getElementById('modal-presidential-alert')?.classList.remove('hidden');
};
window.closePresidentialAlert = function () {
  window.soundEngine.playClick(520);
  document.getElementById('modal-presidential-alert')?.classList.add('hidden');
};

window.openProfileModal = function () {
  window.soundEngine.playClick(740);
  document.getElementById('input-profile-name').value = appState.profile.name;
  document.getElementById('input-profile-title').value = appState.profile.title;
  document.getElementById('input-profile-plate').value = appState.profile.plate;
  document.getElementById('input-profile-vehicle').value = appState.profile.vehicle;
  document.getElementById('input-profile-motto').value = appState.profile.motto;
  document.getElementById('modal-profile-settings')?.classList.remove('hidden');
};
window.closeProfileModal = function () {
  window.soundEngine.playClick(520);
  document.getElementById('modal-profile-settings')?.classList.add('hidden');
};

window.saveProfileSettings = function (e) {
  e.preventDefault();
  window.soundEngine.playPing();
  appState.profile.name = document.getElementById('input-profile-name').value.trim() || '林小葵 (Aoi)';
  appState.profile.title = document.getElementById('input-profile-title').value.trim() || '晴天雨刷宗師';
  appState.profile.plate = document.getElementById('input-profile-plate').value.trim() || 'SBO-8888';
  appState.profile.vehicle = document.getElementById('input-profile-vehicle').value.trim() || '巨型休旅坦克';
  appState.profile.motto = document.getElementById('input-profile-motto').value.trim() || '「方向燈只是裝飾！」';

  saveProfileToStorage();
  syncUI();
  renderSightingsList();
  closeProfileModal();
  showToast('⚙️ 監控對象已更新', `已鎖定【${appState.profile.name}・${appState.profile.plate}】`, 'emerald');
};

window.openCopilotModal = function () {
  window.soundEngine.playSiren();
  document.getElementById('modal-copilot-sos')?.classList.remove('hidden');
};
window.closeCopilotModal = function () {
  window.soundEngine.playClick(520);
  document.getElementById('modal-copilot-sos')?.classList.add('hidden');
};

window.knockCopilotWoodfish = function () {
  window.soundEngine.playWoodfish();
  appState.meritCount += 1;
  appState.heartRate = Math.min(210, appState.heartRate + Math.floor(Math.random() * 4));
  document.getElementById('copilot-merit-count').textContent = appState.meritCount;
  document.getElementById('copilot-heart-rate').textContent = `${appState.heartRate} BPM`;
  const floatZone = document.getElementById('woodfish-float-zone');
  if (floatZone) {
    floatZone.innerHTML = `<span class="text-xs font-mono font-bold text-amber-300 animate-bounce">🙏 保命功德 +1</span>`;
  }
};

window.startParkingMiniGame = function () {
  window.soundEngine.playPing();
  appState.parkingGame = { active: true, carX: 70, carY: 75, carAngle: 0, status: 'PLAYING' };
  renderParkingMiniGame();
};

window.steerParkingCar = function (cmd) {
  const g = appState.parkingGame;
  if (g.status !== 'PLAYING') {
    window.startParkingMiniGame();
    return;
  }
  window.soundEngine.playClick(620);
  if (cmd === 'LEFT') g.carAngle += 22;
  if (cmd === 'RIGHT') g.carAngle -= 22;
  if (cmd === 'REV') {
    const rad = (g.carAngle * Math.PI) / 180;
    g.carX += Math.cos(rad) * 24;
    g.carY += Math.sin(rad) * 24;
  }
  if (cmd === 'FWD') {
    const rad = (g.carAngle * Math.PI) / 180;
    g.carX -= Math.cos(rad) * 18;
    g.carY -= Math.sin(rad) * 18;
  }

  if (g.carX >= 205 && g.carX <= 275 && g.carY >= 45 && g.carY <= 105) {
    g.status = 'WIN';
    window.soundEngine.playPing();
    showToast('🏆 奇蹟停進去了！', '雖然壓線又刷雨刷，但沒撞柱子！', 'emerald');
  } else if (g.carX < 18 || g.carX > 302 || g.carY < 18 || g.carY > 135) {
    g.status = 'CRASH';
    window.soundEngine.playWiperSlap();
    showToast('💥 擦撞水泥柱！', '方向盤左右相反，保桿親吻柱子了！', 'red');
  }
  renderParkingMiniGame();
};

function renderParkingMiniGame() {
  const canvas = document.getElementById('parking-game-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const w = canvas.width;
  const h = canvas.height;
  const g = appState.parkingGame;

  ctx.fillStyle = '#060911';
  ctx.fillRect(0, 0, w, h);

  // Parking bay
  ctx.strokeStyle = '#F59E0B';
  ctx.lineWidth = 2;
  ctx.strokeRect(205, 42, 75, 66);
  ctx.font = '700 9px "JetBrains Mono", monospace';
  ctx.fillStyle = '#FCD34D';
  ctx.fillText('B2-88', 228, 36);

  // Pillars
  ctx.fillStyle = '#EF4444';
  ctx.fillRect(186, 26, 12, 12);
  ctx.fillRect(186, 112, 12, 12);

  // Car
  ctx.save();
  ctx.translate(g.carX, g.carY);
  ctx.rotate((g.carAngle * Math.PI) / 180);
  ctx.fillStyle = g.status === 'CRASH' ? '#EF4444' : g.status === 'WIN' ? '#10B981' : '#38BDF8';
  ctx.beginPath();
  ctx.roundRect(-20, -11, 40, 22, 4);
  ctx.fill();
  ctx.strokeStyle = '#FFFFFF';
  ctx.lineWidth = 1.5;
  ctx.stroke();
  ctx.restore();

  ctx.font = '700 10px "Noto Sans TC", sans-serif';
  ctx.fillStyle = '#94A3B8';
  const msg = g.status === 'WIN' ? '✅ 入庫成功 (點按重玩)' : g.status === 'CRASH' ? '💥 撞柱子了 (點按重試)' : '方向盤左右相反・請倒車入黃格';
  ctx.fillText(msg, 10, 142);
}

document.addEventListener('DOMContentLoaded', () => {
  loadPersistedData();
  renderBlackboxLogs();
  renderSightingsList();
  initTacticalRadarCanvas();
  renderParkingMiniGame();
  calculateRouteSafety(false);
  syncUI();

  setInterval(() => {
    const clockEl = document.getElementById('header-live-clock');
    if (clockEl) clockEl.textContent = new Date().toTimeString().split(' ')[0] + ' CST';
  }, 1000);

  setInterval(() => {
    appState.osIndex = (appState.osIndex + 1) % 12;
    syncUI();
  }, 3600);

  const slider = document.getElementById('chaos-slider');
  if (slider) {
    slider.value = appState.chaosIndex;
    slider.addEventListener('input', (e) => {
      appState.chaosIndex = parseInt(e.target.value, 10) || 0;
      syncUI();
    });
  }

  const muteBtn = document.getElementById('sound-toggle-btn');
  if (muteBtn) {
    muteBtn.addEventListener('click', () => {
      const muted = window.soundEngine.toggleMute();
      muteBtn.innerHTML = muted ? '🔇 靜音' : '🔊 音效';
    });
  }
});
