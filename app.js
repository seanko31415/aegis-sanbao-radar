/**
 * AEGIS SANBAO // 國家級馬路三寶防空預警系統 v4.2 Pro Max (Anime Tactical Edition)
 * Core Application State, Canvas Tactical Radar, 6-Axis Hexagon Chart, Mini-Games & Interactive Logic
 */

const SCENARIOS = {
  home: {
    id: 'home',
    badge: 'DEFCON 5 // 歲月靜好',
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
    cardClass: 'glass-card-safe',
    bannerImg: 'assets/nerv_commander_banner.jpg',
    cutInTitle: 'SEALED AT HOME // 居家封印確認',
    cutInSub: '目標正在沙發上追番吃洋芋片，全台道路暫時恢復和平',
    ticker: '【國防部解除警報】目標車鑰匙目前掛在玄關掛鉤上，雙手正忙著抓洋芋片，方圓 50 公尺內用路人可安心呼吸。',
    osList: [
      '「這集動漫超好看，今天不出門買宵夜了～」',
      '「車子停在哪一格來著？算了明天再找！」',
      '「洋芋片吃完再睡覺好了，馬路和平交給大家了～」'
    ]
  },
  snack: {
    id: 'snack',
    badge: 'DEFCON 3 // 輕度警戒',
    level: 'LV.2 巷口買宵夜',
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
    cardClass: 'glass-card',
    bannerImg: 'assets/nerv_commander_banner.jpg',
    cutInTitle: 'NIGHT SNACK DRIFT // 雙腳滑行鬼切',
    cutInSub: '聞到鹽酥雞香味瞬間無預警右切！左方向燈已連閃 3.8 公里！',
    ticker: '【戰術偵測快訊】目標雙腳懸空放地面滑行中，左轉燈自上週四起未曾熄滅，聞到九層塔香味隨時可能 90 度急切！',
    osList: [
      '「左轉燈有亮嗎？管他的先往右靠買個甜不辣！」',
      '「雙腳伸出來滑行比較有安全感耶～」',
      '「咦？後面那台車幹嘛一直按我喇叭？是在跟我打招呼嗎？」',
      '「這條巷子是單行道嗎？我騎慢一點應該不算逆向吧！」'
    ]
  },
  roundabout: {
    id: 'roundabout',
    badge: 'DEFCON 2 // 高度威脅',
    level: 'LV.4 圓環迷航中',
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
    cardClass: 'glass-card-danger',
    bannerImg: 'assets/scenario_roundabout.jpg',
    cutInTitle: 'MOBIUS ROUNDABOUT // 圓環無限迷航',
    cutInSub: '霸佔內線時速 16km/h！打左轉燈卻往右偏、晴天雨刷全速乾刷中！',
    ticker: '【高危圓環警報】目標已於台灣大道圓環連續繞行第 7 圈！左轉燈狂閃、雨刷高速乾刷、車頭卻持續向右漂移！',
    osList: [
      '「救命啊！這個圓環怎麼出不去！我已經看到同一間超商四次了！」',
      '「想打右轉燈怎麼雨刷又自己動起來了啦！！」',
      '「Google 小姐不要再說『請在圓環第二個出口離開』了，哪個是第二個啦！」',
      '「不管了！我先在路中間停下來看手機地圖！」'
    ]
  },
  parking: {
    id: 'parking',
    badge: 'DEFCON 1 // 毀滅級警報',
    level: 'LV.5 倒車入庫魔王',
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
    cardClass: 'glass-card-danger',
    bannerImg: 'assets/scenario_parking.jpg',
    cutInTitle: 'FINAL BOSS: R-GEAR // 倒車入庫毀滅模式',
    cutInSub: 'R檔與D檔光速切換第 24 次！倒車雷達長鳴破音，後方排隊車流已回堵 1.2 公里！',
    ticker: '【國家級毀滅警報】目標正在好市多 B2 挑戰倒車入庫！左右兩側鄰車車主已棄車逃亡，請方圓 3 公里內人車立即就地掩護！',
    osList: [
      '「為什麼方向盤往左轉，車屁股卻往右邊柱子撞過去？！」',
      '「嗶嗶嗶嗶——這倒車雷達吵死了可以關掉嗎？！」',
      '「奇怪剛剛不是打 D 檔嗎？怎麼車子又往後衝了？！」',
      '「算了算了，斜斜地停跨兩格應該沒人會發現吧？」'
    ]
  }
};

const LANDMARKS = [
  { id: 'costco', name: '好市多 B2 停車場', tag: '倒車魔王關', x: 0.22, y: 0.25, risk: 'EXTREME', color: '#EF4444' },
  { id: 'roundabout', name: '台灣大道大圓環', tag: '迷航熱點', x: 0.52, y: 0.48, risk: 'HIGH', color: '#F59E0B' },
  { id: 'nightmarket', name: '逢甲夜市窄巷', tag: '逆向鬼切區', x: 0.78, y: 0.30, risk: 'HIGH', color: '#F97316' },
  { id: 'deptstore', name: '百貨螺旋車道', tag: '刮輪框聖地', x: 0.30, y: 0.74, risk: 'MEDIUM', color: '#EAB308' },
  { id: 'mrt', name: '高架捷運避難站', tag: '物理隔離區', x: 0.84, y: 0.78, risk: 'SAFE', color: '#10B981' }
];

const DEFAULT_SIGHTINGS = [
  {
    id: 's1',
    rank: 'S',
    location: '北屯好市多 B2 停車場入口處',
    time: '12 分鐘前',
    reporter: '隔壁車位逃生車主 陳先生',
    content: '目擊該車在完全沒有其他車的雙格寬車位前後嚕了 19 分鐘，期間大晴天雨刷狂刷了 40 幾下，最後直接放棄開走去停身障車位旁的安全島上！',
    likes: 128
  },
  {
    id: 's2',
    rank: 'S',
    location: '台灣大道 × 文心路大路口',
    time: '38 分鐘前',
    reporter: '後車行車紀錄器受害者 阿凱',
    content: '左轉燈從公益路一路閃到文心路整整 3.8 公里，正當所有後車以為他終於要左轉時，他突然一個大迴旋直接右轉進得來速買薯條！',
    likes: 94
  },
  {
    id: 's3',
    rank: 'A',
    location: '永豆宵夜店門口紅線區',
    time: '1 小時前',
    reporter: 'LINE 損友群組管理員 小林',
    content: '明明加油孔在左邊，卻堅持停在右邊加油島，拉油管拉到差點把加油機拔起來，還在車上狂按喇叭問店員為什麼油管這麼短。',
    likes: 76
  },
  {
    id: 's4',
    rank: 'A',
    location: '百貨公司 B4 螺旋上坡車道',
    time: '昨天 21:15',
    reporter: '副駕生還者 匿名親友',
    content: '要抽停車票卡時離機器足足有 1.5 公尺遠，手伸不出去竟然直接解開安全帶開門探半個身體出去抽票，車子還忘記打 P 檔緩緩往前滑！',
    likes: 162
  }
];

const BLACKBOX_INIT_LOGS = [
  { time: '12:56:48', tag: 'WIPER_ERR', text: '「奇怪，我想打右轉燈怎麼前擋玻璃雨刷一直在刷啦？！」', danger: true },
  { time: '12:55:19', tag: 'NAV_PANIC', text: '「Google 小姐說『請往東南東方行駛』，車上哪裡有指北針啦！」', danger: false },
  { time: '12:53:04', tag: 'MIRROR_0%', text: '「後照鏡折起來風阻比較小吧？反正我轉彎都靠直覺跟緣分～」', danger: true },
  { time: '12:50:32', tag: 'PARKING_OS', text: '「後面那台保時捷離我好近喔，我打 R 檔給他一點驚喜好了（誤觸）」', danger: true }
];

// Global App State
const appState = {
  activeTab: 'radar', // 'radar' | 'route' | 'dossier'
  scenario: 'roundabout',
  chaosIndex: 76,
  clickMode: 'sanbao', // 'sanbao' | 'user'
  radarPaused: false,
  profile: {
    name: '林小葵 (Aoi)',
    title: '特級移動路障 // 晴天雨刷宗師',
    plate: 'SBO-8888',
    vehicle: '巨型休旅裝甲坦克・視野盲區 85%',
    motto: '「我方向燈都打了 3 公里，是後面的車自己不讓我的！」'
  },
  // Normalized coordinates (0.08 to 0.92)
  sanbaoPos: { x: 0.52, y: 0.48, vx: 0.0016, vy: -0.0012, angle: 0.4, radarSweep: 0 },
  userPos: { x: 0.76, y: 0.72, targetX: 0.76, targetY: 0.72 },
  osIndex: 0,
  blackboxLogs: [...BLACKBOX_INIT_LOGS],
  sightings: [],
  sightingFilter: 'ALL',
  // Route check state
  routeForm: {
    origin: '西屯區・市政中心',
    dest: '北屯區・好市多賣場',
    transport: 'scooter' // 'walk' | 'scooter' | 'car' | 'mrt'
  },
  shareStyle: 'defense', // 'defense' | 'elder' | 'news'
  // Bonus: Co-pilot Survival Woodfish Counter
  copilotMode: false,
  meritCount: 108,
  heartRate: 138,
  // Bonus: Costco Parking Mini-game
  parkingGame: {
    active: false,
    carX: 90,
    carY: 120,
    carAngle: 0,
    wiperObstruction: 0,
    status: 'READY' // 'READY' | 'PLAYING' | 'WIN' | 'CRASH'
  }
};

// Load saved profile & sightings from localStorage with try/catch
function loadPersistedData() {
  try {
    const savedProfile = localStorage.getItem('aegis_sanbao_profile_v4');
    if (savedProfile) {
      appState.profile = { ...appState.profile, ...JSON.parse(savedProfile) };
    }
  } catch (e) {}

  try {
    const savedSightings = localStorage.getItem('aegis_sanbao_sightings_v4');
    if (savedSightings) {
      appState.sightings = JSON.parse(savedSightings);
    } else {
      appState.sightings = [...DEFAULT_SIGHTINGS];
    }
  } catch (e) {
    appState.sightings = [...DEFAULT_SIGHTINGS];
  }

  // Check URL Query Params (?name=...&plate=...&mode=...)
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
  try {
    localStorage.setItem('aegis_sanbao_profile_v4', JSON.stringify(appState.profile));
  } catch (e) {}
}

function saveSightingsToStorage() {
  try {
    localStorage.setItem('aegis_sanbao_sightings_v4', JSON.stringify(appState.sightings));
  } catch (e) {}
}

// Toast Notification System (Zero native alert/confirm/prompt)
function showToast(title, message, type = 'amber') {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const colorMap = {
    amber: 'border-amber-500/60 bg-slate-950/90 text-amber-300 shadow-[0_0_25px_rgba(245,158,11,0.28)]',
    red: 'border-red-500/70 bg-red-950/90 text-red-200 shadow-[0_0_30px_rgba(239,68,68,0.38)]',
    emerald: 'border-emerald-500/60 bg-slate-950/90 text-emerald-300 shadow-[0_0_25px_rgba(16,185,129,0.28)]',
    cyan: 'border-cyan-500/60 bg-slate-950/90 text-cyan-200 shadow-[0_0_25px_rgba(6,182,212,0.28)]'
  };

  const badgeMap = {
    amber: 'bg-amber-500 text-slate-950',
    red: 'bg-red-500 text-white',
    emerald: 'bg-emerald-500 text-slate-950',
    cyan: 'bg-cyan-400 text-slate-950'
  };

  const toast = document.createElement('div');
  toast.className = `pointer-events-auto flex items-start gap-3 px-4 py-3 rounded-xl border backdrop-blur-xl transition-all duration-300 transform translate-y-2 opacity-0 ${colorMap[type] || colorMap.amber}`;
  toast.innerHTML = `
    <span class="px-2 py-0.5 text-[10px] font-mono font-bold uppercase tracking-wider rounded ${badgeMap[type] || badgeMap.amber} shrink-0 mt-0.5">
      AEGIS // MSG
    </span>
    <div class="text-xs leading-relaxed">
      <div class="font-bold text-white mb-0.5">${title}</div>
      <div class="text-slate-300">${message}</div>
    </div>
  `;

  container.appendChild(toast);
  requestAnimationFrame(() => {
    toast.classList.remove('translate-y-2', 'opacity-0');
  });

  setTimeout(() => {
    toast.classList.add('translate-y-2', 'opacity-0');
    setTimeout(() => toast.remove(), 300);
  }, 3600);
}

// Anime Cut-In Banner Trigger
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

  banner.classList.remove('hidden');
  banner.classList.remove('animate-cutin');
  void banner.offsetWidth; // reflow
  banner.classList.add('animate-cutin');

  if (cutInTimeout) clearTimeout(cutInTimeout);
  cutInTimeout = setTimeout(() => {
    banner.classList.add('hidden');
  }, 2400);
}

// Distance & Survival Rate Calculation
function computeTacticalMetrics() {
  const sc = SCENARIOS[appState.scenario];
  const dx = (appState.sanbaoPos.x - appState.userPos.x) * 6.0; // Map scale ~ 6km x 4.2km
  const dy = (appState.sanbaoPos.y - appState.userPos.y) * 4.2;
  const distKm = Math.max(0.02, Math.sqrt(dx * dx + dy * dy));

  // Effective radius scales with Chaos Index
  const chaosScale = 0.55 + (appState.chaosIndex / 100) * 0.9;
  const effectiveRadius = +(sc.radiusKm * chaosScale).toFixed(2);

  let survival = 99.9;
  if (appState.scenario === 'home') {
    survival = 99.9;
  } else {
    const ratio = distKm / Math.max(0.25, effectiveRadius);
    const raw = Math.min(99.5, Math.max(1.2, ratio * 52 - (appState.chaosIndex * 0.18) + (5 - sc.levelNum) * 8));
    survival = +raw.toFixed(1);
  }

  return { distKm: +distKm.toFixed(2), effectiveRadius, survival };
}

// Sync All DOM Elements with Current State
function syncUI() {
  const sc = SCENARIOS[appState.scenario];
  const metrics = computeTacticalMetrics();

  // Top Header & Ticker
  const defconBadge = document.getElementById('header-defcon-badge');
  if (defconBadge) {
    defconBadge.textContent = sc.badge;
    defconBadge.style.backgroundColor = sc.color;
  }
  const tickerText = document.getElementById('header-ticker-text');
  if (tickerText) {
    tickerText.textContent = `[目標：${appState.profile.name}｜車牌：${appState.profile.plate}] ${sc.ticker}`;
  }

  // Profile VIP Card
  const vipName = document.getElementById('vip-name');
  const vipTitle = document.getElementById('vip-title');
  const vipPlate = document.getElementById('vip-plate');
  const vipVehicle = document.getElementById('vip-vehicle');
  const vipMotto = document.getElementById('vip-motto');
  const vipOsBubble = document.getElementById('vip-os-bubble');
  const commandBannerImg = document.getElementById('command-banner-img');
  if (commandBannerImg && sc.bannerImg) {
    commandBannerImg.src = sc.bannerImg;
  }

  if (vipName) vipName.textContent = appState.profile.name;
  if (vipTitle) vipTitle.textContent = appState.profile.title;
  if (vipPlate) vipPlate.textContent = appState.profile.plate;
  if (vipVehicle) vipVehicle.textContent = appState.profile.vehicle;
  if (vipMotto) vipMotto.textContent = appState.profile.motto;
  if (vipOsBubble) {
    const list = sc.osList;
    vipOsBubble.textContent = list[appState.osIndex % list.length];
  }

  // Threat & Survival Metrics Card
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
  if (survivalBar) {
    survivalBar.style.width = `${Math.min(100, Math.max(4, metrics.survival))}%`;
  }
  if (threatCard) {
    threatCard.className = `rounded-2xl p-4 transition-all duration-300 ${sc.cardClass}`;
  }

  // Scenario Switcher Buttons
  document.querySelectorAll('[data-scenario-btn]').forEach((btn) => {
    const key = btn.getAttribute('data-scenario-btn');
    const active = key === appState.scenario;
    btn.classList.toggle('ring-2', active);
    btn.classList.toggle('ring-amber-400', active);
    btn.classList.toggle('bg-slate-800/95', active);
    btn.classList.toggle('bg-slate-900/60', !active);
  });

  // OBD-II Telemetry Panel
  const obdSpeed = document.getElementById('obd-speed');
  const obdConfusion = document.getElementById('obd-confusion');
  const obdReroute = document.getElementById('obd-reroute');
  const leftTurnLamp = document.getElementById('lamp-left-turn');
  const rightTurnLamp = document.getElementById('lamp-right-turn');
  const wiperArmLeft = document.getElementById('wiper-arm-left');
  const wiperArmRight = document.getElementById('wiper-arm-right');
  const wiperStatusBadge = document.getElementById('wiper-status-badge');
  const carHeadingLabel = document.getElementById('car-heading-paradox');

  const jitter = appState.scenario === 'home' ? 0 : Math.round((Math.random() - 0.5) * 4);
  if (obdSpeed) obdSpeed.textContent = `${Math.max(0, sc.speedKmh + jitter)} / ${sc.speedLimit} km/h`;
  if (obdConfusion) {
    const conf = Math.min(99, Math.round(sc.brakeGasConfusion * (0.7 + appState.chaosIndex / 200)));
    obdConfusion.textContent = `${conf}%`;
  }
  if (obdReroute) obdReroute.textContent = `${sc.navRerouteCount} 次 (導航姊姊已放棄)`;

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
    wiperStatusBadge.textContent = isRapidWiper
      ? '☀️ 大晴天無雲 // 雨刷超頻乾刷 MAX'
      : appState.scenario === 'home'
      ? '🌙 熄火休眠中 // 雨刷靜止'
      : '☀️ 晴朗乾燥 // 偶發誤觸擺動中';
    wiperStatusBadge.className = isRapidWiper
      ? 'px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold bg-red-500/25 text-red-300 border border-red-500/50 animate-pulse'
      : 'px-2.5 py-0.5 rounded-full text-[11px] font-mono bg-amber-500/20 text-amber-300 border border-amber-500/40';
  }
  if (carHeadingLabel) {
    carHeadingLabel.textContent =
      appState.scenario === 'home'
        ? '方向盤鎖定・車輪靜止'
        : `左轉燈狂閃 ➔ 車頭卻向右偏 +${Math.abs(sc.carTiltDeg)}°`;
  }

  // Chaos Slider Label
  const chaosValEl = document.getElementById('chaos-slider-val');
  if (chaosValEl) chaosValEl.textContent = `${appState.chaosIndex}%`;

  // Update Share Message Generator if visible
  updateSharePreviewText();
}

// Switch Scenario Function
window.selectScenario = function (key) {
  if (!SCENARIOS[key]) return;
  window.soundEngine.playClick(640);
  appState.scenario = key;
  const sc = SCENARIOS[key];
  appState.chaosIndex = sc.baseChaos;
  const slider = document.getElementById('chaos-slider');
  if (slider) slider.value = sc.baseChaos;

  // Move Sanbao near relevant landmark for immersion
  if (key === 'parking') {
    appState.sanbaoPos.x = 0.24;
    appState.sanbaoPos.y = 0.27;
    window.soundEngine.playSiren();
  } else if (key === 'roundabout') {
    appState.sanbaoPos.x = 0.52;
    appState.sanbaoPos.y = 0.48;
    window.soundEngine.playPing();
  } else if (key === 'snack') {
    appState.sanbaoPos.x = 0.75;
    appState.sanbaoPos.y = 0.33;
    window.soundEngine.playPing();
  }

  triggerAnimeCutIn(sc.cutInTitle, sc.cutInSub, sc.color);
  syncUI();
  calculateRouteSafety(false);
};

// Tab Switching
window.switchTab = function (tabId) {
  window.soundEngine.playClick(780);
  appState.activeTab = tabId;

  ['radar', 'route', 'dossier'].forEach((id) => {
    const section = document.getElementById(`tab-panel-${id}`);
    const btn = document.getElementById(`tab-btn-${id}`);
    if (section) section.classList.toggle('hidden', id !== tabId);
    if (btn) {
      const isCurrent = id === tabId;
      btn.className = isCurrent
        ? 'px-4 py-2 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-2 bg-gradient-to-r from-amber-500 to-red-500 text-slate-950 shadow-[0_0_20px_rgba(245,158,11,0.45)] transition-all'
        : 'px-4 py-2 rounded-xl font-medium text-xs sm:text-sm flex items-center gap-2 text-slate-300 hover:text-white hover:bg-white/5 border border-white/10 transition-all';
    }
  });

  if (tabId === 'dossier') {
    requestAnimationFrame(() => drawHexagonChart());
  }
  if (tabId === 'route') {
    calculateRouteSafety(false);
    updateSharePreviewText();
  }
};

// Trigger "Want to Turn But Wiped Windshield" Button
window.triggerWiperParadox = function () {
  window.soundEngine.playWiperSlap();
  appState.wiperBoostActive = true;
  SCENARIOS[appState.scenario].navRerouteCount += 3;

  const nowStr = new Date().toTimeString().split(' ')[0];
  const funnyLines = [
    `「啊！！想打右轉燈為什麼雨刷又開到最快了啦！前擋玻璃要被刷破了！」`,
    `「副駕快幫我查一下雨刷怎麼關！我眼睛被雨刷晃到頭好暈！」`,
    `「奇怪今天太陽這麼大為什麼我的車會自己噴雨刷水？！」`,
    `「後面的機車騎士幹嘛一直看我的雨刷？沒看過晴天刷玻璃保養嗎！」`
  ];
  const line = funnyLines[Math.floor(Math.random() * funnyLines.length)];

  appState.blackboxLogs.unshift({
    time: nowStr,
    tag: 'WIPER_CRIT',
    text: line,
    danger: true
  });
  if (appState.blackboxLogs.length > 8) appState.blackboxLogs.pop();

  renderBlackboxLogs();
  triggerAnimeCutIn('PARADOX TRIGGERED // 轉彎誤刷雨刷！', '方向燈誠信度 -50%・前擋乾刷摩擦係數暴增！', '#F59E0B');
  showToast('🌧️ 晴天雨刷爆走觸發！', `${appState.profile.name} 想右轉卻把雨刷撥到 HI 檔高速乾刷！`, 'amber');
  syncUI();

  setTimeout(() => {
    appState.wiperBoostActive = false;
    syncUI();
  }, 4500);
};

function renderBlackboxLogs() {
  const container = document.getElementById('blackbox-log-list');
  if (!container) return;
  container.innerHTML = appState.blackboxLogs
    .map(
      (item) => `
      <div class="p-2.5 rounded-xl border ${
        item.danger
          ? 'bg-red-950/35 border-red-500/35 text-red-100'
          : 'bg-slate-900/70 border-white/10 text-slate-200'
      } text-xs transition-all">
        <div class="flex items-center justify-between mb-1 font-mono text-[10px]">
          <span class="px-1.5 py-0.5 rounded ${
            item.danger ? 'bg-red-500/30 text-red-300' : 'bg-amber-500/20 text-amber-300'
          } font-bold">${item.tag}</span>
          <span class="text-slate-400">${item.time} CST</span>
        </div>
        <p class="leading-relaxed">${item.text}</p>
      </div>
    `
    )
    .join('');
}

// One-Click Escape Calculation
window.calculateFarthestEscape = function () {
  window.soundEngine.playPing();
  const corners = [
    { x: 0.10, y: 0.12, label: '西北防空掩體 (高架橋下)' },
    { x: 0.90, y: 0.12, label: '東北山區避難點 (大坑步道口)' },
    { x: 0.10, y: 0.88, label: '西南高鐵站月台 (物理隔離層)' },
    { x: 0.88, y: 0.85, label: '東南高架捷運站 (絕對安全區)' }
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
  showToast('🏃 已啟動戰術撤離導引！', `系統已為您規劃距離三寶最遠的避難座標：【${best.label}】`, 'cyan');
};

// Click Mode Toggle on Radar
window.setRadarClickMode = function (mode) {
  window.soundEngine.playClick(700);
  appState.clickMode = mode;
  const btnSanbao = document.getElementById('mode-btn-sanbao');
  const btnUser = document.getElementById('mode-btn-user');
  if (btnSanbao && btnUser) {
    btnSanbao.className =
      mode === 'sanbao'
        ? 'px-3 py-1.5 rounded-lg text-xs font-bold bg-red-500 text-white shadow-[0_0_12px_rgba(239,68,68,0.5)] transition-all'
        : 'px-3 py-1.5 rounded-lg text-xs font-medium text-slate-300 hover:text-white bg-slate-900/80 border border-white/10 transition-all';
    btnUser.className =
      mode === 'user'
        ? 'px-3 py-1.5 rounded-lg text-xs font-bold bg-cyan-400 text-slate-950 shadow-[0_0_12px_rgba(6,182,212,0.5)] transition-all'
        : 'px-3 py-1.5 rounded-lg text-xs font-medium text-slate-300 hover:text-white bg-slate-900/80 border border-white/10 transition-all';
  }
};

window.toggleRadarPause = function () {
  window.soundEngine.playClick(540);
  appState.radarPaused = !appState.radarPaused;
  const btn = document.getElementById('radar-pause-btn');
  if (btn) {
    btn.innerHTML = appState.radarPaused ? '▶️ 恢復雷達追蹤' : '⏸️ 凍結時間軸';
  }
};

// ============================================================================
// HTML5 Canvas Live Tactical Radar Engine
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

  // Click to teleport Sanbao or User
  canvas.addEventListener('click', (e) => {
    const rect = canvas.getBoundingClientRect();
    const nx = Math.min(0.94, Math.max(0.06, (e.clientX - rect.left) / rect.width));
    const ny = Math.min(0.92, Math.max(0.08, (e.clientY - rect.top) / rect.height));

    window.soundEngine.playPing();
    if (appState.clickMode === 'sanbao') {
      appState.sanbaoPos.x = nx;
      appState.sanbaoPos.y = ny;
      showToast('🎯 三寶座標已強制瞬移', `衛星已重新鎖定 ${appState.profile.name} 於 (${(nx * 100).toFixed(0)}, ${(ny * 100).toFixed(0)})`, 'red');
    } else {
      appState.userPos.x = nx;
      appState.userPos.y = ny;
      appState.userPos.targetX = nx;
      appState.userPos.targetY = ny;
      showToast('🛡️ 避難者座標已更新', `您的位置已移動至新掩體座標，生還率已即時重算！`, 'cyan');
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

    // Update physics if not paused
    if (!appState.radarPaused && appState.scenario !== 'home') {
      const chaosFactor = (appState.chaosIndex / 100) * 0.0026;
      if (Math.random() < 0.04 + (appState.chaosIndex / 100) * 0.06) {
        // Sudden erratic turn!
        appState.sanbaoPos.angle += (Math.random() - 0.45) * 1.6;
      }
      appState.sanbaoPos.vx = Math.cos(appState.sanbaoPos.angle) * chaosFactor;
      appState.sanbaoPos.vy = Math.sin(appState.sanbaoPos.angle) * chaosFactor;

      appState.sanbaoPos.x += appState.sanbaoPos.vx;
      appState.sanbaoPos.y += appState.sanbaoPos.vy;

      // Bounce off boundaries
      if (appState.sanbaoPos.x < 0.08 || appState.sanbaoPos.x > 0.92) {
        appState.sanbaoPos.angle = Math.PI - appState.sanbaoPos.angle;
        appState.sanbaoPos.x = Math.min(0.92, Math.max(0.08, appState.sanbaoPos.x));
      }
      if (appState.sanbaoPos.y < 0.12 || appState.sanbaoPos.y > 0.88) {
        appState.sanbaoPos.angle = -appState.sanbaoPos.angle;
        appState.sanbaoPos.y = Math.min(0.88, Math.max(0.12, appState.sanbaoPos.y));
      }
    }

    // Smooth interpolate user position (for escape animation)
    appState.userPos.x += (appState.userPos.targetX - appState.userPos.x) * 0.08;
    appState.userPos.y += (appState.userPos.targetY - appState.userPos.y) * 0.08;

    appState.sanbaoPos.radarSweep = (appState.sanbaoPos.radarSweep + 0.032) % (Math.PI * 2);

    // 1. Deep Obsidian Tactical Background
    ctx.fillStyle = '#07090E';
    ctx.fillRect(0, 0, w, h);

    // 2. Tactical Grid (32px)
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.045)';
    ctx.lineWidth = 1;
    const gridSize = 32;
    for (let x = 0; x < w; x += gridSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, h);
      ctx.stroke();
    }
    for (let y = 0; y < h; y += gridSize) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(w, y);
      ctx.stroke();
    }

    // 3. City Arterial Roads & Central Roundabout
    const cx = w * 0.52;
    const cy = h * 0.48;

    ctx.strokeStyle = 'rgba(148, 163, 184, 0.16)';
    ctx.lineWidth = 8;
    // Boulevard 1 (Diagonal)
    ctx.beginPath();
    ctx.moveTo(0, h * 0.2);
    ctx.lineTo(w, h * 0.78);
    ctx.stroke();
    // Boulevard 2 (Horizontal)
    ctx.beginPath();
    ctx.moveTo(0, cy);
    ctx.lineTo(w, cy);
    ctx.stroke();
    // Boulevard 3 (Vertical)
    ctx.beginPath();
    ctx.moveTo(cx, 0);
    ctx.lineTo(cx, h);
    ctx.stroke();

    // Central Roundabout Ring
    ctx.beginPath();
    ctx.arc(cx, cy, 46, 0, Math.PI * 2);
    ctx.fillStyle = '#0B0F19';
    ctx.fill();
    ctx.lineWidth = 6;
    ctx.strokeStyle = 'rgba(245, 158, 11, 0.25)';
    ctx.stroke();

    // Concentric NERV-style Radar Rings around center
    [85, 165, 245].forEach((r) => {
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.lineWidth = 1;
      ctx.strokeStyle = 'rgba(6, 182, 212, 0.11)';
      ctx.stroke();
    });

    // 4. High-Risk Landmarks
    LANDMARKS.forEach((lm) => {
      const lx = lm.x * w;
      const ly = lm.y * h;

      ctx.save();
      ctx.beginPath();
      ctx.arc(lx, ly, 6, 0, Math.PI * 2);
      ctx.fillStyle = lm.color;
      ctx.fill();

      ctx.strokeStyle = lm.color;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(lx, ly, 12, 0, Math.PI * 2);
      ctx.stroke();

      ctx.font = '600 11px "Noto Sans TC", sans-serif';
      ctx.fillStyle = '#E2E8F0';
      ctx.fillText(lm.name, lx + 16, ly - 2);

      ctx.font = '700 9px "JetBrains Mono", monospace';
      ctx.fillStyle = lm.color;
      ctx.fillText(`[${lm.tag}]`, lx + 16, ly + 11);
      ctx.restore();
    });

    // 5. Sanbao Target Position & Dual Blast Zones
    const sx = appState.sanbaoPos.x * w;
    const sy = appState.sanbaoPos.y * h;
    const innerR = Math.max(22, metrics.effectiveRadius * 36);
    const outerR = innerR * 1.55;

    // Outer Amber Dashed Ring (Turn Signal Deception Zone)
    ctx.save();
    ctx.beginPath();
    ctx.setLineDash([7, 6]);
    ctx.arc(sx, sy, outerR, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(245, 158, 11, 0.65)';
    ctx.lineWidth = 1.8;
    ctx.stroke();
    ctx.fillStyle = 'rgba(245, 158, 11, 0.06)';
    ctx.fill();
    ctx.restore();

    // Inner Crimson Zone (Absolute Evacuation Zone)
    ctx.save();
    ctx.beginPath();
    ctx.arc(sx, sy, innerR, 0, Math.PI * 2);
    ctx.fillStyle = appState.scenario === 'home' ? 'rgba(16, 185, 129, 0.12)' : 'rgba(239, 68, 68, 0.16)';
    ctx.fill();
    ctx.strokeStyle = sc.color;
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.restore();

    // 360-degree Rotating Radar Sweep Sector
    ctx.save();
    ctx.translate(sx, sy);
    ctx.rotate(appState.sanbaoPos.radarSweep);
    const grad = ctx.createRadialGradient(0, 0, 2, 0, 0, outerR);
    grad.addColorStop(0, appState.scenario === 'home' ? 'rgba(16, 185, 129, 0.45)' : 'rgba(239, 68, 68, 0.45)');
    grad.addColorStop(1, 'rgba(239, 68, 68, 0)');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.arc(0, 0, outerR, -0.35, 0.35);
    ctx.closePath();
    ctx.fill();
    ctx.restore();

    // Schrödinger's Predicted Trajectory (Opposite to Turn Signal!)
    if (appState.scenario !== 'home') {
      ctx.save();
      ctx.setLineDash([5, 5]);
      ctx.lineWidth = 2.2;
      ctx.strokeStyle = '#EF4444';
      ctx.beginPath();
      ctx.moveTo(sx, sy);
      const pred1X = sx + Math.cos(appState.sanbaoPos.angle + 0.5) * 65;
      const pred1Y = sy + Math.sin(appState.sanbaoPos.angle + 0.5) * 65;
      const pred2X = pred1X + Math.cos(appState.sanbaoPos.angle - 0.9) * 55;
      const pred2Y = pred1Y + Math.sin(appState.sanbaoPos.angle - 0.9) * 55;
      ctx.lineTo(pred1X, pred1Y);
      ctx.lineTo(pred2X, pred2Y);
      ctx.stroke();

      ctx.font = '700 10px "JetBrains Mono", monospace';
      ctx.fillStyle = '#FCA5A5';
      ctx.fillText('⚠ 薛丁格鬼切預測軌跡', pred2X + 6, pred2Y);
      ctx.restore();
    }

    // 6. User Position (Cyan Evacuee Marker) & Distance Vector Line
    const ux = appState.userPos.x * w;
    const uy = appState.userPos.y * h;

    // Tactical tether line between User and Sanbao
    ctx.save();
    ctx.setLineDash([3, 4]);
    ctx.strokeStyle = 'rgba(6, 182, 212, 0.55)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(sx, sy);
    ctx.lineTo(ux, uy);
    ctx.stroke();

    // Distance pill at midpoint
    const mx = (sx + ux) / 2;
    const my = (sy + uy) / 2;
    ctx.fillStyle = 'rgba(7, 9, 14, 0.88)';
    ctx.strokeStyle = 'rgba(6, 182, 212, 0.6)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.roundRect(mx - 38, my - 11, 76, 22, 6);
    ctx.fill();
    ctx.stroke();

    ctx.font = '700 10px "JetBrains Mono", monospace';
    ctx.fillStyle = '#22D3EE';
    ctx.textAlign = 'center';
    ctx.fillText(`距 ${metrics.distKm} km`, mx, my + 4);
    ctx.restore();

    // Draw User Shield Marker
    ctx.save();
    ctx.beginPath();
    ctx.arc(ux, uy, 9, 0, Math.PI * 2);
    ctx.fillStyle = '#06B6D4';
    ctx.fill();
    ctx.lineWidth = 2.5;
    ctx.strokeStyle = '#ECFEFF';
    ctx.stroke();

    ctx.font = '700 11px "Noto Sans TC", sans-serif';
    ctx.fillStyle = '#67E8F9';
    ctx.fillText('🛡️ 您的位置 (避難者)', ux + 14, uy + 4);
    ctx.restore();

    // Draw Sanbao Marker & Floating Anime OS Speech Bubble
    ctx.save();
    ctx.beginPath();
    ctx.arc(sx, sy, 11, 0, Math.PI * 2);
    ctx.fillStyle = sc.color;
    ctx.fill();
    ctx.lineWidth = 2.5;
    ctx.strokeStyle = '#FFFFFF';
    ctx.stroke();

    // Target Crosshair around Sanbao
    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.moveTo(sx - 18, sy);
    ctx.lineTo(sx - 12, sy);
    ctx.moveTo(sx + 12, sy);
    ctx.lineTo(sx + 18, sy);
    ctx.moveTo(sx, sy - 18);
    ctx.lineTo(sx, sy - 12);
    ctx.moveTo(sx, sy + 12);
    ctx.lineTo(sx, sy + 18);
    ctx.stroke();

    // Target Plate Label
    ctx.font = '700 11px "JetBrains Mono", monospace';
    ctx.fillStyle = '#FFFFFF';
    ctx.fillText(`🎯 ${appState.profile.name} [${appState.profile.plate}]`, sx + 16, sy + 4);

    // Anime Speech Bubble above Sanbao
    const osText = sc.osList[appState.osIndex % sc.osList.length];
    ctx.font = '600 11px "Noto Sans TC", sans-serif';
    const textWidth = Math.min(260, ctx.measureText(osText).width + 22);
    const bx = Math.min(w - textWidth - 10, Math.max(10, sx - textWidth / 2));
    const by = Math.max(12, sy - 48);

    ctx.fillStyle = 'rgba(15, 23, 42, 0.92)';
    ctx.strokeStyle = sc.color;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.roundRect(bx, by, textWidth, 26, 8);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#F8FAFC';
    ctx.fillText(osText.slice(0, 22) + (osText.length > 22 ? '…' : ''), bx + 10, by + 17);
    ctx.restore();

    requestAnimationFrame(renderRadarFrame);
  }

  requestAnimationFrame(renderRadarFrame);
}

// ============================================================================
// Tab 2: Route Safety Calculator & LINE Group Share Generator
// ============================================================================
window.selectTransportMode = function (mode) {
  window.soundEngine.playClick(760);
  appState.routeForm.transport = mode;
  document.querySelectorAll('[data-transport-btn]').forEach((btn) => {
    const m = btn.getAttribute('data-transport-btn');
    const active = m === mode;
    btn.className = active
      ? 'p-3 rounded-xl border-2 border-amber-400 bg-amber-500/20 text-white font-bold text-xs flex flex-col items-center gap-1 shadow-[0_0_15px_rgba(245,158,11,0.3)] transition-all'
      : 'p-3 rounded-xl border border-white/10 bg-slate-900/70 text-slate-300 hover:text-white text-xs flex flex-col items-center gap-1 transition-all';
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

  const transportRiskBonus = {
    walk: 18,
    scooter: 42,
    car: 26,
    mrt: -65
  }[mode] || 20;

  let encounterProb = Math.min(99.4, Math.max(0.8, sc.levelNum * 16 + transportRiskBonus + (appState.chaosIndex * 0.15)));
  if (appState.scenario === 'home') encounterProb = 0.5;
  if (mode === 'mrt') encounterProb = Math.max(1.2, encounterProb * 0.15);

  let omen = '【大吉 // 天佑平安】';
  let omenColor = '#10B981';
  let safeDist = '正常保持 15 公尺車距即可';
  let blindSpot = '無明顯威脅，三寶目前不在高危移動圈';
  let gear = '太陽眼鏡 + 愉悅的心情 + 珍珠奶茶一杯';
  let advice = `目前 ${appState.profile.name} 威脅極低或您採用了高架物理隔離，請放心出門採買！`;

  if (encounterProb >= 70) {
    omen = '【大凶 // 諸事不宜・建議就地臥倒】';
    omenColor = '#EF4444';
    safeDist = '至少隔開 3 個紅綠燈（約 1.8 公里以上）或跨區繞道';
    blindSpot = `目標車牌 ${appState.profile.plate} 的 A柱、B柱、C柱及整個後照鏡（視線死角達 85%）`;
    gear = '全罩式安全帽 + 第三人超額責任險 3000 萬 + 雙鏡頭 4K 行車紀錄器 + 護身符';
    advice = `警告！您的目的地與 ${appState.profile.name} 的「${sc.level}」暴風圈高度重疊！若看到前方車輛晴天刷雨刷，請立即放棄原定行程改搭捷運！`;
  } else if (encounterProb >= 35) {
    omen = '【中平偏凶 // 步步驚心・嚴禁併行】';
    omenColor = '#F59E0B';
    safeDist = '至少保持 450 公尺以上，嚴禁行駛於目標左右兩側車道';
    blindSpot = '目標打左轉燈時，其右側車道為 92% 高機率鬼切熱區';
    gear = '高分貝防禦喇叭 + 前後行車紀錄器 + 隨時準備煞停的黃金右腳';
    advice = `偵測到 ${appState.profile.name} 正在路上活動。切記「三寶打左燈，必往右邊偏」之鐵律，絕對不要相信對方的方向燈！`;
  }

  const omenEl = document.getElementById('route-result-omen');
  const probEl = document.getElementById('route-result-prob');
  const distEl = document.getElementById('route-result-dist');
  const blindEl = document.getElementById('route-result-blindspot');
  const gearEl = document.getElementById('route-result-gear');
  const adviceEl = document.getElementById('route-result-advice');

  if (omenEl) {
    omenEl.textContent = omen;
    omenEl.style.color = omenColor;
  }
  if (probEl) {
    probEl.textContent = `${encounterProb.toFixed(1)}%`;
    probEl.style.color = omenColor;
  }
  if (distEl) distEl.textContent = safeDist;
  if (blindEl) blindEl.textContent = blindSpot;
  if (gearEl) gearEl.textContent = gear;
  if (adviceEl) adviceEl.textContent = advice;
};

window.selectShareStyle = function (style) {
  window.soundEngine.playClick(700);
  appState.shareStyle = style;
  document.querySelectorAll('[data-share-style-btn]').forEach((btn) => {
    const s = btn.getAttribute('data-share-style-btn');
    const active = s === style;
    btn.className = active
      ? 'px-3 py-1.5 rounded-lg text-xs font-bold bg-amber-500 text-slate-950 transition-all'
      : 'px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-900 text-slate-300 hover:text-white border border-white/10 transition-all';
  });
  updateSharePreviewText();
};

function updateSharePreviewText() {
  const box = document.getElementById('share-copy-textarea');
  if (!box) return;

  const sc = SCENARIOS[appState.scenario];
  const metrics = computeTacticalMetrics();
  const { name, plate, vehicle } = appState.profile;

  let text = '';
  if (appState.shareStyle === 'defense') {
    text = `🚨【AEGIS 國家級馬路三寶防空警報】🚨\n` +
      `偵測到特級移動路障「${name}」已發動引擎上路！\n` +
      `▪ 監控車牌：${plate}（${vehicle}）\n` +
      `▪ 當前狀態：${sc.level}（波及半徑 ${metrics.effectiveRadius} km）\n` +
      `▪ 戰術情報：${sc.ticker}\n` +
      `⚠️ 請群組內所有親友立即避開該時段路段，切勿與該車併行或相信其方向燈！平安是回家唯一的路！`;
  } else if (appState.shareStyle === 'elder') {
    text = `🌸早安平安喜樂🌸 認同請分享🙏\n` +
      `親愛的好友們注意囉！我們最可愛的朋友【${name}】今天開車出門了（車牌 ${plate}）🚗💨\n` +
      `目前正在體驗「${sc.level}」，方圓 ${metrics.effectiveRadius} 公里內的菩薩們請多加禮讓～\n` +
      `💡 溫馨提醒：看到他打左轉燈代表他可能想右轉，看到他刷雨刷代表他其實想轉彎喔！\n` +
      `轉發給 5 個群組，保佑今天行車平安、停車一次到位！💖🌺`;
  } else {
    text = `📺【突發新聞快訊 // 獨家路況插播】\n` +
      `記者現在位於第一線為您插播最新路況！知名用路傳奇「${name}」稍早駕駛車號 ${plate} 的「${vehicle}」現蹤街頭！\n` +
      `現場目擊指出，該車目前處於「${sc.level}」狀態，大晴天雨刷高速運轉中，預估暴風波及半徑達 ${metrics.effectiveRadius} 公里！\n` +
      `交通大隊呼籲附近民眾保持至少 3 個紅綠燈以上安全車距，本台將持續為您掌握最新逃難路線！`;
  }

  box.value = text;
}

window.copyShareText = function () {
  window.soundEngine.playClick(920);
  const box = document.getElementById('share-copy-textarea');
  if (!box) return;

  const content = box.value;
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(content).then(() => {
      showToast('📋 通報文案已複製！', '快去貼到 LINE 親友群組拯救大家的保險桿！', 'emerald');
    }).catch(() => fallbackCopy(box));
  } else {
    fallbackCopy(box);
  }
};

function fallbackCopy(textarea) {
  textarea.select();
  document.execCommand('copy');
  showToast('📋 通報文案已複製！', '快去貼到 LINE 親友群組拯救大家的保險桿！', 'emerald');
}

// ============================================================================
// Tab 3: 6-Axis Hexagon Radar Chart & Sightings Wall
// ============================================================================
function drawHexagonChart() {
  const canvas = document.getElementById('hexagon-chart-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const dpr = window.devicePixelRatio || 1;
  const rect = canvas.parentElement.getBoundingClientRect();
  const size = Math.min(rect.width, 340);
  canvas.width = size * dpr;
  canvas.height = size * dpr;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

  const cx = size / 2;
  const cy = size / 2;
  const maxR = size * 0.34;

  const axes = [
    { label: '雨刷誤觸力', val: 98 },
    { label: '謎之自信心', val: 100 },
    { label: '路邊停車耗時', val: 95 },
    { label: '方向燈誠信度', val: 12 },
    { label: '空間方向感', val: 15 },
    { label: '副駕驚嚇度', val: 96 }
  ];

  ctx.clearRect(0, 0, size, size);

  // Draw 4 concentric hexagon webs
  [0.25, 0.5, 0.75, 1.0].forEach((step) => {
    ctx.beginPath();
    axes.forEach((_, i) => {
      const angle = (Math.PI * 2 * i) / 6 - Math.PI / 2;
      const x = cx + Math.cos(angle) * maxR * step;
      const y = cy + Math.sin(angle) * maxR * step;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.closePath();
    ctx.strokeStyle = step === 1 ? 'rgba(245, 158, 11, 0.45)' : 'rgba(255, 255, 255, 0.1)';
    ctx.lineWidth = step === 1 ? 1.5 : 1;
    ctx.stroke();
  });

  // Draw axis spokes
  axes.forEach((axis, i) => {
    const angle = (Math.PI * 2 * i) / 6 - Math.PI / 2;
    const x = cx + Math.cos(angle) * maxR;
    const y = cy + Math.sin(angle) * maxR;
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(x, y);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
    ctx.stroke();

    // Labels
    const lx = cx + Math.cos(angle) * (maxR + 30);
    const ly = cy + Math.sin(angle) * (maxR + 22);
    ctx.font = '700 11px "Noto Sans TC", sans-serif';
    ctx.fillStyle = '#F8FAFC';
    ctx.textAlign = 'center';
    ctx.fillText(axis.label, lx, ly - 3);

    ctx.font = '700 10px "JetBrains Mono", monospace';
    ctx.fillStyle = axis.val >= 80 ? '#EF4444' : '#22D3EE';
    ctx.fillText(`${axis.val}/100`, lx, ly + 11);
  });

  // Draw Data Polygon
  ctx.beginPath();
  axes.forEach((axis, i) => {
    const angle = (Math.PI * 2 * i) / 6 - Math.PI / 2;
    const r = (axis.val / 100) * maxR;
    const x = cx + Math.cos(angle) * r;
    const y = cy + Math.sin(angle) * r;
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  });
  ctx.closePath();
  ctx.fillStyle = 'rgba(239, 68, 68, 0.32)';
  ctx.fill();
  ctx.strokeStyle = '#F59E0B';
  ctx.lineWidth = 2.5;
  ctx.stroke();

  // Draw Vertex Dots
  axes.forEach((axis, i) => {
    const angle = (Math.PI * 2 * i) / 6 - Math.PI / 2;
    const r = (axis.val / 100) * maxR;
    const x = cx + Math.cos(angle) * r;
    const y = cy + Math.sin(angle) * r;
    ctx.beginPath();
    ctx.arc(x, y, 4.5, 0, Math.PI * 2);
    ctx.fillStyle = '#FEF08A';
    ctx.fill();
    ctx.strokeStyle = '#EF4444';
    ctx.lineWidth = 1.5;
    ctx.stroke();
  });
}

window.filterSightings = function (filter) {
  window.soundEngine.playClick(680);
  appState.sightingFilter = filter;
  document.querySelectorAll('[data-sighting-filter]').forEach((btn) => {
    const f = btn.getAttribute('data-sighting-filter');
    const active = f === filter;
    btn.className = active
      ? 'px-3 py-1 rounded-lg text-xs font-bold bg-amber-500 text-slate-950 transition-all'
      : 'px-3 py-1 rounded-lg text-xs font-medium bg-slate-900 text-slate-300 hover:text-white border border-white/10 transition-all';
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
      <div class="p-4 rounded-xl border ${
        item.rank === 'S'
          ? 'bg-red-950/25 border-red-500/35 hover:border-red-500/60'
          : 'bg-slate-900/75 border-white/10 hover:border-amber-500/40'
      } transition-all">
        <div class="flex flex-wrap items-center justify-between gap-2 mb-2">
          <div class="flex items-center gap-2">
            <span class="px-2 py-0.5 rounded text-[11px] font-mono font-extrabold ${
              item.rank === 'S'
                ? 'bg-red-500 text-white shadow-[0_0_10px_rgba(239,68,68,0.45)]'
                : 'bg-amber-500 text-slate-950'
            }">
              ${item.rank === 'S' ? 'S級・毀滅災難' : 'A級・極度迷惑'}
            </span>
            <span class="font-bold text-sm text-white">📍 ${item.location}</span>
          </div>
          <span class="text-[11px] font-mono text-slate-400">${item.time}｜回報者：${item.reporter}</span>
        </div>
        <p class="text-xs sm:text-sm text-slate-200 leading-relaxed mb-3">${item.content}</p>
        <div class="flex items-center justify-between">
          <span class="text-[11px] font-mono text-slate-400">目標車號：${appState.profile.plate}</span>
          <button onclick="likeSighting('${item.id}')" class="px-3 py-1 rounded-lg bg-slate-800/90 hover:bg-amber-500/20 border border-white/10 hover:border-amber-400/50 text-xs font-mono text-amber-300 flex items-center gap-1.5 transition-all">
            🙏 感謝救命 <span class="font-bold text-white">+${item.likes}</span>
          </button>
        </div>
      </div>
    `
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
    showToast('🙏 功德無量！已感謝目擊回報', `這則戰報已累積拯救 ${target.likes} 位用路人的保桿！`, 'amber');
  }
};

window.submitNewSighting = function (e) {
  e.preventDefault();
  const rankEl = document.getElementById('new-sighting-rank');
  const locEl = document.getElementById('new-sighting-location');
  const contentEl = document.getElementById('new-sighting-content');

  const location = locEl ? locEl.value.trim() : '';
  const content = contentEl ? contentEl.value.trim() : '';
  const rank = rankEl ? rankEl.value : 'S';

  if (!location || !content) {
    showToast('⚠️ 欄位尚未填寫完整', '請輸入目擊地點與三寶事蹟，以便衛星廣播給親友團！', 'red');
    return;
  }

  window.soundEngine.playPing();
  const newEntry = {
    id: 's_' + Date.now(),
    rank,
    location,
    time: '剛剛',
    reporter: '熱心損友即時連線',
    content,
    likes: 1
  };

  appState.sightings.unshift(newEntry);
  saveSightingsToStorage();
  renderSightingsList();

  if (locEl) locEl.value = '';
  if (contentEl) contentEl.value = '';

  triggerAnimeCutIn('NEW SIGHTING // 目擊戰報登錄！', `地點：${location}`, '#F59E0B');
  showToast('📡 戰報已即時發送至全網！', `感謝回報 ${appState.profile.name} 於「${location}」的最新動態！`, 'emerald');
};

// ============================================================================
// Modals: Presidential Alert, Profile Settings, Co-pilot SOS Mode & Parking Game
// ============================================================================
window.openPresidentialAlert = function () {
  window.soundEngine.playSiren();
  const modal = document.getElementById('modal-presidential-alert');
  if (modal) modal.classList.remove('hidden');
  triggerAnimeCutIn('PRESIDENTIAL ALERT // 國家級防空警報', `目標 ${appState.profile.name} 已握住方向盤！`, '#EF4444');
};

window.closePresidentialAlert = function () {
  window.soundEngine.playClick(520);
  const modal = document.getElementById('modal-presidential-alert');
  if (modal) modal.classList.add('hidden');
};

window.openProfileModal = function () {
  window.soundEngine.playClick(740);
  document.getElementById('input-profile-name').value = appState.profile.name;
  document.getElementById('input-profile-title').value = appState.profile.title;
  document.getElementById('input-profile-plate').value = appState.profile.plate;
  document.getElementById('input-profile-vehicle').value = appState.profile.vehicle;
  document.getElementById('input-profile-motto').value = appState.profile.motto;
  document.getElementById('modal-profile-settings').classList.remove('hidden');
};

window.closeProfileModal = function () {
  window.soundEngine.playClick(520);
  document.getElementById('modal-profile-settings').classList.add('hidden');
};

window.saveProfileSettings = function (e) {
  e.preventDefault();
  window.soundEngine.playPing();
  appState.profile.name = document.getElementById('input-profile-name').value.trim() || '林小葵 (Aoi)';
  appState.profile.title = document.getElementById('input-profile-title').value.trim() || '特級移動路障';
  appState.profile.plate = document.getElementById('input-profile-plate').value.trim() || 'SBO-8888';
  appState.profile.vehicle = document.getElementById('input-profile-vehicle').value.trim() || '巨型休旅坦克';
  appState.profile.motto = document.getElementById('input-profile-motto').value.trim() || '「方向燈只是裝飾！」';

  saveProfileToStorage();
  syncUI();
  renderSightingsList();
  closeProfileModal();
  showToast('⚙️ 三寶監控檔案已更新！', `全站雷達與通報產生器已同步鎖定【${appState.profile.name} / ${appState.profile.plate}】`, 'emerald');
};

// Bonus Feature 1: Co-Pilot Survival Woodfish & Grab Handle Simulator
window.openCopilotModal = function () {
  window.soundEngine.playSiren();
  document.getElementById('modal-copilot-sos').classList.remove('hidden');
};

window.closeCopilotModal = function () {
  window.soundEngine.playClick(520);
  document.getElementById('modal-copilot-sos').classList.add('hidden');
};

window.knockCopilotWoodfish = function () {
  window.soundEngine.playWoodfish();
  appState.meritCount += 1;
  appState.heartRate = Math.min(210, appState.heartRate + Math.floor(Math.random() * 5));

  const meritEl = document.getElementById('copilot-merit-count');
  const hrEl = document.getElementById('copilot-heart-rate');
  const floatZone = document.getElementById('woodfish-float-zone');

  if (meritEl) meritEl.textContent = appState.meritCount;
  if (hrEl) hrEl.textContent = `${appState.heartRate} BPM`;

  if (floatZone) {
    const tag = document.createElement('div');
    const chants = ['🙏 保命功德 +1', '🛡️ 煞車靈光 +1', '📿 阿彌陀佛 +1', '✨ 遠離柱子 +1'];
    tag.className = 'text-xs font-mono font-bold text-amber-300 animate-bounce';
    tag.textContent = chants[appState.meritCount % chants.length];
    floatZone.innerHTML = '';
    floatZone.appendChild(tag);
  }
};

// Bonus Feature 2: Costco Inverted Steering + Wiper Blindness Mini-Game
window.startParkingMiniGame = function () {
  window.soundEngine.playPing();
  appState.parkingGame = {
    active: true,
    carX: 70,
    carY: 95,
    carAngle: 0,
    wiperObstruction: 35,
    status: 'PLAYING'
  };
  renderParkingMiniGame();
  showToast('🅿️ 好市多倒車魔王挑戰開始！', '注意：三寶視角「左右方向盤相反」且晴天雨刷會隨機擋住視線！', 'amber');
};

window.steerParkingCar = function (cmd) {
  const g = appState.parkingGame;
  if (g.status !== 'PLAYING') {
    window.startParkingMiniGame();
    return;
  }
  window.soundEngine.playClick(620);

  // Inverted controls intentionally!
  if (cmd === 'LEFT') g.carAngle += 22; // Turns right instead!
  if (cmd === 'RIGHT') g.carAngle -= 22; // Turns left instead!
  if (cmd === 'REV') {
    const rad = (g.carAngle * Math.PI) / 180;
    g.carX += Math.cos(rad) * 26;
    g.carY += Math.sin(rad) * 26;
  }
  if (cmd === 'FWD') {
    const rad = (g.carAngle * Math.PI) / 180;
    g.carX -= Math.cos(rad) * 18;
    g.carY -= Math.sin(rad) * 18;
  }

  g.wiperObstruction = Math.min(95, g.wiperObstruction + 12);

  // Target slot is around x: 215..275, y: 65..125
  if (g.carX >= 205 && g.carX <= 275 && g.carY >= 60 && g.carY <= 130) {
    g.status = 'WIN';
    window.soundEngine.playPing();
    showToast('🏆 奇蹟發生！竟然停進格子了！', '雖然壓線又刷了 30 下雨刷，但至少沒撞到柱子！', 'emerald');
  } else if (g.carX < 18 || g.carX > 305 || g.carY < 20 || g.carY > 170) {
    g.status = 'CRASH';
    window.soundEngine.playWiperSlap();
    showToast('💥 擦撞水泥柱警報！', '因為方向盤左右相反加上雨刷擋住視線，保險桿已親吻好市多柱子！', 'red');
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

  ctx.fillStyle = '#090D16';
  ctx.fillRect(0, 0, w, h);

  // Parking bay lines
  ctx.strokeStyle = '#F59E0B';
  ctx.lineWidth = 2.5;
  ctx.strokeRect(205, 55, 78, 80);
  ctx.font = '700 10px "JetBrains Mono", monospace';
  ctx.fillStyle = '#FCD34D';
  ctx.fillText('TARGET B2-88', 210, 48);

  // Concrete Pillars
  ctx.fillStyle = '#EF4444';
  ctx.fillRect(185, 35, 14, 14);
  ctx.fillRect(185, 140, 14, 14);

  // Draw Sanbao SUV
  ctx.save();
  ctx.translate(g.carX, g.carY);
  ctx.rotate((g.carAngle * Math.PI) / 180);
  ctx.fillStyle = g.status === 'CRASH' ? '#EF4444' : g.status === 'WIN' ? '#10B981' : '#38BDF8';
  ctx.beginPath();
  ctx.roundRect(-24, -14, 48, 28, 5);
  ctx.fill();
  ctx.strokeStyle = '#FFFFFF';
  ctx.lineWidth = 1.5;
  ctx.stroke();

  // Wipers frantic lines on windshield
  ctx.strokeStyle = '#FACC15';
  ctx.beginPath();
  ctx.moveTo(-10, -10);
  ctx.lineTo(-22, -18);
  ctx.moveTo(-10, 10);
  ctx.lineTo(-22, 18);
  ctx.stroke();
  ctx.restore();

  // Status banner
  ctx.font = '700 11px "Noto Sans TC", sans-serif';
  ctx.fillStyle = '#E2E8F0';
  const statusMsg =
    g.status === 'WIN'
      ? '✅ 奇蹟入庫成功！(點擊任意鍵重玩)'
      : g.status === 'CRASH'
      ? '💥 撞上柱子了！(點擊任意鍵重試)'
      : '🎮 方向盤左右相反模式・請把車倒進右側黃格';
  ctx.fillText(statusMsg, 12, 178);
}

// ============================================================================
// Initialize Everything on DOMContentLoaded
// ============================================================================
document.addEventListener('DOMContentLoaded', () => {
  loadPersistedData();
  renderBlackboxLogs();
  renderSightingsList();
  initTacticalRadarCanvas();
  renderParkingMiniGame();
  calculateRouteSafety(false);
  syncUI();

  // Live CST Clock & OS Speech Bubble Rotator
  setInterval(() => {
    const now = new Date();
    const clockEl = document.getElementById('header-live-clock');
    if (clockEl) {
      clockEl.textContent = now.toTimeString().split(' ')[0] + ' CST';
    }
  }, 1000);

  setInterval(() => {
    appState.osIndex = (appState.osIndex + 1) % 12;
    syncUI();
  }, 3800);

  // Chaos Slider Input Listener
  const slider = document.getElementById('chaos-slider');
  if (slider) {
    slider.value = appState.chaosIndex;
    slider.addEventListener('input', (e) => {
      appState.chaosIndex = parseInt(e.target.value, 10) || 0;
      syncUI();
    });
  }

  // Sound Mute Toggle Button
  const muteBtn = document.getElementById('sound-toggle-btn');
  if (muteBtn) {
    muteBtn.addEventListener('click', () => {
      const muted = window.soundEngine.toggleMute();
      muteBtn.innerHTML = muted ? '🔇 音效已靜音' : '🔊 戰術音效 ON';
      muteBtn.classList.toggle('text-slate-400', muted);
      muteBtn.classList.toggle('text-amber-300', !muted);
    });
  }
});

