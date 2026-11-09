/**
 * 損友三寶監測局 // 雞腿駕照防空雷達 v11.0
 * High-Precision GPS & Search + Working LINE Share + 3D Costco Reverse Simulator + Interactive Stamp Gun & Voice
 */

const DRIVER_AVATARS = [
  { badge: '🍗 雞腿車神', src: 'assets/sanbao_chicken_avatar.jpg' },
  { badge: '😱 驚恐三寶', src: 'assets/sanbao_avatar.jpg' },
  { badge: '🅿️ B2大魔王', src: 'assets/scenario_parking.jpg' },
  { badge: '🎼 皇家雨刷手', src: 'assets/royal_conductor.jpg' }
];

const SCENARIOS = {
  home: {
    id: 'home',
    badge: 'LV.0',
    level: '🏠 封印在家',
    levelNum: 0,
    radiusKm: 0.08,
    baseChaos: 8,
    wiperRapid: false,
    leftSignal: false,
    rightSignal: false,
    carTiltDeg: 0,
    color: '#2DD4BF',
    cutInTitle: '🏠 封印休止符',
    cutInSub: '正在沙發追番啃雞腿，馬路暫時安全！',
    lat: 24.1632,
    lng: 120.6405,
    osList: ['💭「這集動漫超好看，今天不出門～」', '💭「車停在B2還B3？算了明天再找！」']
  },
  snack: {
    id: 'snack',
    badge: 'LV.2',
    level: '🛵 買鹹酥雞',
    levelNum: 2,
    radiusKm: 0.65,
    baseChaos: 48,
    wiperRapid: false,
    leftSignal: true,
    rightSignal: false,
    carTiltDeg: 14,
    color: '#F59E0B',
    cutInTitle: '🛵 宵夜鬼切曲',
    cutInSub: '左燈連閃 3.8km・聞到雞排香瞬間右切！',
    lat: 24.1788,
    lng: 120.6458,
    osList: ['💭「左燈亮著？不管了先右切買甜不辣！」', '💭「雙腳放地上滑行比較安全啦～」']
  },
  roundabout: {
    id: 'roundabout',
    badge: 'LV.4',
    level: '🔄 圓環迷航',
    levelNum: 4,
    radiusKm: 1.5,
    baseChaos: 76,
    wiperRapid: true,
    leftSignal: true,
    rightSignal: false,
    carTiltDeg: 28,
    color: '#F97316',
    cutInTitle: '🔄 圓環圓舞曲',
    cutInSub: '打左燈往右偏 + 大晴天狂刷雨刷！',
    lat: 24.1618,
    lng: 120.6469,
    osList: ['💭「救命！圓環繞第 7 圈怎麼出不去！」', '💭「想打方向燈怎麼雨刷又在狂刷啦！」']
  },
  parking: {
    id: 'parking',
    badge: 'LV.5',
    level: '🅿️ 倒車魔王',
    levelNum: 5,
    radiusKm: 3.0,
    baseChaos: 98,
    wiperRapid: true,
    leftSignal: true,
    rightSignal: true,
    carTiltDeg: -35,
    color: '#F43F5E',
    cutInTitle: '🅿️ 好市多倒車魔王',
    cutInSub: 'R/D檔切換第 24 次・後方回堵 1.2km！',
    lat: 24.1896,
    lng: 120.6933,
    osList: ['💭「方向盤往左打，車屁股怎麼往右邊柱子撞？！」', '💭「斜停跨兩格應該沒人發現吧？」']
  }
};

const REAL_HOTSPOTS = {
  costco: { name: '台中北屯好市多 B2', lat: 24.1896, lng: 120.6933, color: '#F43F5E' },
  roundabout: { name: '台灣大道圓環', lat: 24.1618, lng: 120.6469, color: '#F59E0B' },
  fengjia: { name: '逢甲夜市窄巷', lat: 24.1788, lng: 120.6458, color: '#F97316' },
  taipei101: { name: '台北信義區 101 圓環', lat: 25.0339, lng: 121.5645, color: '#2DD4BF' }
};

const TAROT_CARDS = [
  { name: '🃏 逆位・雨刷之神', desc: '今日轉彎 100% 誤觸雨刷，前擋玻璃比臉還乾淨！' },
  { name: '🃏 正位・莫比烏斯圓環', desc: '一旦進入圓環將強制繞行 7 圈以上，導航姊姊已崩潰跳車！' },
  { name: '🃏 逆位・薛丁格方向燈', desc: '打左燈必往右轉，後車猜中機率 0%！' },
  { name: '🃏 正位・好市多雙格霸主', desc: '倒車入庫耗時 +19 分鐘，建議直接把車扛回家！' },
  { name: '🃏 隱藏SSR・黃金烤雞腿駕照', desc: '教練當年含淚送出駕照，拜託你別再開回駕訓班！' }
];

const DEFAULT_SQUAD = [
  { id: 'f1', name: '林小葵 (Aoi)', plate: 'SBO-8888', mode: 'roundabout', avatar: 'assets/sanbao_chicken_avatar.jpg', lat: 24.1618, lng: 120.6469, sosMsg: '🔄 卡在圓環第 7 圈出不去！' },
  { id: 'f2', name: '陳大明', plate: 'BBB-9999', mode: 'parking', avatar: 'assets/scenario_parking.jpg', lat: 24.1896, lng: 120.6933, sosMsg: '🅿️ 好市多 B2 倒車中，方圓3km快逃！' },
  { id: 'f3', name: '張阿豪', plate: 'KKK-6666', mode: 'snack', avatar: 'assets/sanbao_avatar.jpg', lat: 24.1788, lng: 120.6458, sosMsg: '🛵 買鹹酥雞，雙腳滑行鬼切中' },
  { id: 'f4', name: '王小美', plate: 'AAA-5566', mode: 'home', avatar: 'assets/royal_conductor.jpg', lat: 24.1510, lng: 120.6410, sosMsg: '🏠 已平安停好車在家追劇' }
];

const DEFAULT_SIGHTINGS = [
  { id: 's1', location: '北屯好市多 B2', content: '雙格車位嚕了 19 分鐘，大晴天雨刷狂刷 40 下，最後乾脆停在車道中間！', likes: 168 },
  { id: 's2', location: '台灣大道圓環', content: '左轉燈連閃 3.8 公里，結果突然右切進得來速買大薯！', likes: 112 },
  { id: 's3', location: '逢甲夜市口', content: '想按喇叭提醒路人，結果按到噴水雨刷，路人被噴了一臉雨刷水！', likes: 95 }
];

const appState = {
  activeTab: 'radar',
  scenario: 'roundabout',
  chaosIndex: 76,
  clickMode: 'sanbao',
  avatarIndex: 0,
  bountyAmount: 88000,
  stamps: ['🍗 雞腿換駕照', '🌧️ 晴天刷雨刷'],
  profile: { name: '林小葵 (Aoi)', plate: 'SBO-8888', avatar: 'assets/sanbao_chicken_avatar.jpg' },
  sanbaoLatLng: { lat: 24.1618, lng: 120.6469, heading: 45 },
  userLatLng: { lat: 24.1552, lng: 120.6625, accuracy: 8 },
  osIndex: 0,
  squad: [],
  sightings: [],
  routeForm: { transport: 'scooter' },
  shareStyle: 'defense',
  meritCount: 108,
  heartRate: 138,
  beaconWatchId: null,
  // 3D Costco Reverse Parking Simulator State
  parkingGame: {
    active: false,       // Becomes true when user clicks "▶️ 點擊開始挑戰" or presses a control
    viewMode: '3D',      // '3D' (Perspective + Rear Cam + Radar PIP) | '2D' (Full Top-Down)
    invertSteer: true,   // Costco Sanbao Inverted Steering Mode
    level: 1,            // 1, 2, 3
    carX: 82,
    carY: 125,
    carAngle: 0,         // 0 deg = rear of car (+X) points right toward the bay
    steerWheelDeg: 0,    // Visual steering wheel angle (-45 to +45)
    gear: 'R',           // 'R' | 'D' | 'P'
    overlapPct: 0,
    rearDistCm: 180,
    status: 'READY',     // 'READY' | 'PLAYING' | 'WIN' | 'CRASH'
    keys: { left: false, right: false, up: false, down: false },
    carts: [
      { x: 185, y: 65, vy: 1.15, label: '🛒大媽A' },
      { x: 162, y: 185, vy: -1.35, label: '🛒推車B' }
    ]
  }
};

let leafletMap = null;
let tileLayerGroup = null;
let sanbaoMarker = null;
let userMarker = null;
let userAccuracyCircle = null;
let innerBlastCircle = null;
let outerDeceptionCircle = null;
let tetherPolyline = null;
let ghostTrajectoryLine = null;
let squadMarkers = [];

function loadPersistedData() {
  try {
    const savedSquad = localStorage.getItem('aegis_sanbao_squad_v11');
    appState.squad = savedSquad ? JSON.parse(savedSquad) : [...DEFAULT_SQUAD];
  } catch (e) {
    appState.squad = [...DEFAULT_SQUAD];
  }

  try {
    const savedSightings = localStorage.getItem('aegis_sanbao_sightings_v11');
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
      appState.sanbaoLatLng.lat = SCENARIOS[modeParam].lat;
      appState.sanbaoLatLng.lng = SCENARIOS[modeParam].lng;
    }
    if (params.get('lat') && params.get('lng')) {
      const parsedLat = parseFloat(params.get('lat'));
      const parsedLng = parseFloat(params.get('lng'));
      if (!isNaN(parsedLat) && !isNaN(parsedLng)) {
        appState.sanbaoLatLng.lat = parsedLat;
        appState.sanbaoLatLng.lng = parsedLng;
      }
    }
  } catch (e) {}
}

function saveSquadToStorage() {
  try { localStorage.setItem('aegis_sanbao_squad_v11', JSON.stringify(appState.squad)); } catch (e) {}
}
function saveSightingsToStorage() {
  try { localStorage.setItem('aegis_sanbao_sightings_v11', JSON.stringify(appState.sightings)); } catch (e) {}
}

function showToast(title, message, type = 'amber') {
  const container = document.getElementById('toast-container');
  if (!container) return;
  const styles = {
    amber: 'border-amber-300/70 bg-[#070B19]/95 text-amber-200',
    red: 'border-rose-500/70 bg-rose-950/95 text-rose-200',
    emerald: 'border-teal-400/70 bg-[#070B19]/95 text-teal-200',
    cyan: 'border-cyan-400/70 bg-[#070B19]/95 text-cyan-200'
  };
  const toast = document.createElement('div');
  toast.className = `pointer-events-auto px-3.5 py-2.5 rounded-2xl border backdrop-blur-xl shadow-2xl transition-all duration-300 transform translate-y-2 opacity-0 text-xs ${styles[type] || styles.amber}`;
  toast.innerHTML = `<div class="font-black text-white">${title}</div><div class="text-[11px] opacity-90 mt-0.5">${message}</div>`;
  container.appendChild(toast);
  requestAnimationFrame(() => toast.classList.remove('translate-y-2', 'opacity-0'));
  setTimeout(() => {
    toast.classList.add('translate-y-2', 'opacity-0');
    setTimeout(() => toast.remove(), 250);
  }, 2600);
}

let cutInTimeout = null;
function triggerAnimeCutIn(title, subtitle, color = '#D4AF37') {
  const banner = document.getElementById('anime-cutin-banner');
  const bgSvg = document.getElementById('anime-cutin-svg');
  const titleEl = document.getElementById('anime-cutin-title');
  const subEl = document.getElementById('anime-cutin-sub');
  const cutinImg = document.getElementById('cutin-avatar-img');
  if (!banner || !bgSvg || !titleEl || !subEl) return;

  if (cutinImg) cutinImg.src = appState.profile.avatar;
  bgSvg.innerHTML = window.getAnimeCutInSVG(color, 'SANBAO ALERT');
  titleEl.textContent = title;
  subEl.textContent = subtitle;

  banner.classList.remove('hidden', 'animate-cutin');
  void banner.offsetWidth;
  banner.classList.add('animate-cutin');

  if (cutInTimeout) clearTimeout(cutInTimeout);
  cutInTimeout = setTimeout(() => banner.classList.add('hidden'), 2100);
}

// ============================================================================
// AVATAR SWITCHER & INTERACTIVE STAMP GUN / CHICKEN ROULETTE / VOICE
// ============================================================================
window.cycleDriverAvatar = function () {
  window.soundEngine.playClick(840);
  appState.avatarIndex = (appState.avatarIndex + 1) % DRIVER_AVATARS.length;
  const chosen = DRIVER_AVATARS[appState.avatarIndex];
  appState.profile.avatar = chosen.src;

  const vipImg = document.getElementById('vip-avatar-img');
  const vipBadge = document.getElementById('vip-avatar-badge');
  const modalImg = document.getElementById('alert-modal-avatar');
  if (vipImg) vipImg.src = chosen.src;
  if (vipBadge) vipBadge.textContent = chosen.badge;
  if (modalImg) modalImg.src = chosen.src;

  refreshMainMarkers();
  showToast(`🎭 已切換三寶頭像：${chosen.badge}`, '地圖雷達與警報頭像已同步更新！', 'amber');
};

window.speakCurrentSanbaoOS = function () {
  const sc = SCENARIOS[appState.scenario];
  const raw = sc.osList[appState.osIndex % sc.osList.length].replace(/[💭「」]/g, '');
  window.soundEngine.playPing();
  window.soundEngine.speak(`${appState.profile.name}大喊：${raw}`);
  triggerAnimeCutIn(`🎙️ ${appState.profile.name} 崩潰廣播`, raw, sc.color);
};

window.slapSanbaoStamp = function (stampText) {
  window.soundEngine.playStamp();
  appState.bountyAmount += 15000;
  if (!appState.stamps.includes(stampText)) {
    appState.stamps.unshift(stampText);
    if (appState.stamps.length > 4) appState.stamps.pop();
  }
  renderVipStamps();
  syncUI();
  triggerAnimeCutIn(`💮 蓋章認證：${stampText}`, `${appState.profile.name} 懸賞金暴增至 $${appState.bountyAmount.toLocaleString()}！`, '#F43F5E');
  showToast(`💮 已蓋上【${stampText}】違規章！`, `三寶懸賞金 +$15,000！`, 'red');
};

function renderVipStamps() {
  const row = document.getElementById('vip-stamps-row');
  if (!row) return;
  row.innerHTML = appState.stamps
    .map(
      (s, idx) =>
        `<span class="stamp-badge px-1.5 py-0.5 rounded ${
          idx % 2 === 0
            ? 'bg-rose-600/90 border border-amber-200 text-white'
            : 'bg-amber-400/90 border border-white text-slate-950'
        } text-[9px] font-black">💮 ${s}</span>`
    )
    .join('');
}

window.spinChickenLicenseRoulette = function () {
  const results = [
    { text: '🍗 脆皮炸雞腿 x 99 支 (傳說級三寶)', voice: '鑑定結果：駕照是用九十九支脆皮炸雞腿換來的！' },
    { text: '🍗 夜市烤雞腿 x 50 支 (圓環包軌王)', voice: '鑑定結果：看到他打左轉燈請立刻往左邊閃！' },
    { text: '🍗 好市多烤雞 x 12 隻 (B2柱子殺手)', voice: '鑑定結果：好市多地下室的柱子看到他都會發抖！' },
    { text: '🛡️ 僅含雞翅 x 1 支 (偶爾誤刷雨刷)', voice: '鑑定結果：只有轉彎時會不小心刷兩下雨刷！' }
  ];
  const el = document.getElementById('roulette-result-text');
  if (!el) return;

  let ticks = 0;
  const timer = setInterval(() => {
    window.soundEngine.playClick(600 + ticks * 45);
    el.textContent = results[ticks % results.length].text;
    ticks++;
    if (ticks >= 10) {
      clearInterval(timer);
      const finalPick = results[Math.floor(Math.random() * results.length)];
      el.textContent = finalPick.text;
      window.soundEngine.playWinFanfare();
      window.soundEngine.speak(finalPick.voice);
      showToast('🎰 駕照雞腿鑑定完成！', finalPick.text, 'amber');
    }
  }, 65);
};

// ============================================================================
// HIGH-PRECISION GPS & LANDMARK SEARCH ENGINE
// ============================================================================
function calcGpsDistanceKm(lat1, lng1, lat2, lng2) {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function computeTacticalMetrics() {
  const sc = SCENARIOS[appState.scenario];
  const distKm = Math.max(
    0.02,
    calcGpsDistanceKm(appState.sanbaoLatLng.lat, appState.sanbaoLatLng.lng, appState.userLatLng.lat, appState.userLatLng.lng)
  );
  const chaosScale = 0.55 + (appState.chaosIndex / 100) * 0.9;
  const effectiveRadius = +(sc.radiusKm * chaosScale).toFixed(2);

  let survival = 99;
  if (appState.scenario !== 'home') {
    const ratio = distKm / Math.max(0.2, effectiveRadius);
    const raw = Math.min(99, Math.max(2, Math.round(ratio * 52 - appState.chaosIndex * 0.18 + (5 - sc.levelNum) * 8)));
    survival = raw;
  }
  return { distKm: +distKm.toFixed(2), effectiveRadius, survival };
}

function initRealGoogleMap() {
  const mapEl = document.getElementById('real-google-map');
  if (!mapEl || typeof L === 'undefined') return;

  leafletMap = L.map('real-google-map', {
    center: [appState.sanbaoLatLng.lat, appState.sanbaoLatLng.lng],
    zoom: 16,
    zoomControl: true
  });

  window.setMapStyle('tactical');

  outerDeceptionCircle = L.circle([appState.sanbaoLatLng.lat, appState.sanbaoLatLng.lng], {
    radius: 850,
    color: '#FEF08A',
    weight: 2,
    dashArray: '8, 6',
    fillColor: '#F59E0B',
    fillOpacity: 0.06
  }).addTo(leafletMap);

  innerBlastCircle = L.circle([appState.sanbaoLatLng.lat, appState.sanbaoLatLng.lng], {
    radius: 450,
    color: '#F43F5E',
    weight: 2.5,
    fillColor: '#F43F5E',
    fillOpacity: 0.18
  }).addTo(leafletMap);

  userAccuracyCircle = L.circle([appState.userLatLng.lat, appState.userLatLng.lng], {
    radius: 25,
    color: '#2DD4BF',
    weight: 1.5,
    fillColor: '#2DD4BF',
    fillOpacity: 0.15
  }).addTo(leafletMap);

  ghostTrajectoryLine = L.polyline([], { color: '#F43F5E', weight: 3, dashArray: '6, 6' }).addTo(leafletMap);
  tetherPolyline = L.polyline([], { color: '#2DD4BF', weight: 2, dashArray: '4, 6' }).addTo(leafletMap);

  refreshMainMarkers();
  renderSquadMapMarkers();

  leafletMap.on('click', (e) => {
    window.soundEngine.playPing();
    if (appState.clickMode === 'sanbao') {
      appState.sanbaoLatLng.lat = e.latlng.lat;
      appState.sanbaoLatLng.lng = e.latlng.lng;
      showToast('🎯 已精準釘選三寶位置', `座標: ${e.latlng.lat.toFixed(5)}, ${e.latlng.lng.toFixed(5)}`, 'red');
    } else {
      appState.userLatLng.lat = e.latlng.lat;
      appState.userLatLng.lng = e.latlng.lng;
      showToast('🛡️ 已更新您的避難位置', `座標: ${e.latlng.lat.toFixed(5)}, ${e.latlng.lng.toFixed(5)}`, 'emerald');
    }
    updateRealMapOverlays();
    syncUI();
  });

  setInterval(() => {
    if (appState.scenario !== 'home' && !appState.beaconWatchId) {
      const step = (appState.chaosIndex / 100) * 0.00018;
      appState.sanbaoLatLng.heading += (Math.random() - 0.45) * 50;
      const rad = (appState.sanbaoLatLng.heading * Math.PI) / 180;
      appState.sanbaoLatLng.lat += Math.sin(rad) * step;
      appState.sanbaoLatLng.lng += Math.cos(rad) * step;
      updateRealMapOverlays();
      syncUI();
    }
  }, 1000);

  updateRealMapOverlays();
}

function refreshMainMarkers() {
  if (!leafletMap) return;
  if (sanbaoMarker) leafletMap.removeLayer(sanbaoMarker);
  if (userMarker) leafletMap.removeLayer(userMarker);

  const sanbaoIcon = L.divIcon({
    className: 'custom-sanbao-marker',
    html: `
      <div class="relative flex items-center justify-center" style="width:60px;height:60px;">
        <div class="absolute inset-0 rounded-full bg-rose-500/55 marker-pulse"></div>
        <img src="${appState.profile.avatar}" onerror="this.src='assets/sanbao_avatar.jpg'" class="w-13 h-13 rounded-full object-cover border-2 border-amber-300 shadow-[0_0_18px_#D4AF37] relative z-10" style="width:50px;height:50px;" />
        <div class="absolute -bottom-5 whitespace-nowrap px-2 py-0.5 rounded-full bg-[#070B19]/95 border border-amber-300 text-[10px] font-mono font-black text-amber-200 shadow z-20">
          🚨 ${appState.profile.name}
        </div>
      </div>`,
    iconSize: [60, 60],
    iconAnchor: [30, 30]
  });

  const userIcon = L.divIcon({
    className: 'custom-user-marker',
    html: `
      <div class="relative flex items-center justify-center" style="width:42px;height:42px;">
        <div class="w-9 h-9 rounded-full bg-teal-400 border-2 border-white flex items-center justify-center text-sm shadow-[0_0_15px_#2DD4BF]">🛡️</div>
        <div class="absolute -bottom-5 whitespace-nowrap px-1.5 py-0.5 rounded bg-[#070B19]/95 border border-teal-300 text-[10px] font-bold text-teal-200 shadow">我的位置</div>
      </div>`,
    iconSize: [42, 42],
    iconAnchor: [21, 21]
  });

  sanbaoMarker = L.marker([appState.sanbaoLatLng.lat, appState.sanbaoLatLng.lng], { icon: sanbaoIcon, zIndexOffset: 1000 }).addTo(leafletMap);
  userMarker = L.marker([appState.userLatLng.lat, appState.userLatLng.lng], { icon: userIcon, zIndexOffset: 900 }).addTo(leafletMap);
}

function renderSquadMapMarkers() {
  if (!leafletMap) return;
  squadMarkers.forEach((m) => leafletMap.removeLayer(m));
  squadMarkers = [];

  appState.squad.forEach((f) => {
    if (f.name === appState.profile.name) return;
    const sc = SCENARIOS[f.mode] || SCENARIOS.snack;
    const m = L.circleMarker([f.lat, f.lng], {
      radius: 8,
      color: '#FEF08A',
      fillColor: sc.color,
      fillOpacity: 0.92,
      weight: 2
    })
      .addTo(leafletMap)
      .bindTooltip(`<b>${f.name} (${f.plate})</b><br/>${f.sosMsg}`, { direction: 'top' });

    m.on('click', () => focusSquadFriend(f.id));
    squadMarkers.push(m);
  });
}

function updateRealMapOverlays() {
  if (!leafletMap || !sanbaoMarker) return;
  const sc = SCENARIOS[appState.scenario];
  const metrics = computeTacticalMetrics();
  const sPos = [appState.sanbaoLatLng.lat, appState.sanbaoLatLng.lng];
  const uPos = [appState.userLatLng.lat, appState.userLatLng.lng];

  sanbaoMarker.setLatLng(sPos);
  userMarker.setLatLng(uPos);
  if (userAccuracyCircle) {
    userAccuracyCircle.setLatLng(uPos);
    userAccuracyCircle.setRadius(Math.max(12, appState.userLatLng.accuracy || 20));
  }

  const innerMeters = Math.max(60, metrics.effectiveRadius * 360);
  innerBlastCircle.setLatLng(sPos);
  innerBlastCircle.setRadius(innerMeters);
  innerBlastCircle.setStyle({ color: sc.color, fillColor: sc.color });

  outerDeceptionCircle.setLatLng(sPos);
  outerDeceptionCircle.setRadius(innerMeters * 1.45);

  tetherPolyline.setLatLngs([sPos, uPos]);

  const rad = (appState.sanbaoLatLng.heading * Math.PI) / 180;
  const p1 = [sPos[0] + Math.sin(rad + 0.5) * 0.0025, sPos[1] + Math.cos(rad + 0.5) * 0.0025];
  const p2 = [p1[0] + Math.sin(rad - 0.8) * 0.0025, p1[1] + Math.cos(rad - 0.8) * 0.0025];
  ghostTrajectoryLine.setLatLngs(appState.scenario === 'home' ? [] : [sPos, p1, p2]);
}

window.setMapStyle = function (style) {
  if (!leafletMap) return;
  window.soundEngine.playClick(720);
  if (tileLayerGroup) leafletMap.removeLayer(tileLayerGroup);

  ['tactical', 'streets', 'satellite'].forEach((s) => {
    const btn = document.getElementById(`mapstyle-${s}`);
    if (btn) {
      btn.className =
        s === style
          ? 'px-2.5 py-1 rounded-xl text-[11px] font-black bg-gradient-to-r from-amber-300 to-amber-500 text-slate-950'
          : 'px-2.5 py-1 rounded-xl text-[11px] font-bold bg-slate-900/90 text-amber-100 border border-amber-300/30';
    }
  });

  const lyrs = style === 'satellite' ? 'y' : 'm';
  const cls = style === 'tactical' ? 'tactical-gmap-tiles' : '';
  tileLayerGroup = L.tileLayer(`https://mt1.google.com/vt/lyrs=${lyrs}&hl=zh-TW&x={x}&y={y}&z={z}`, {
    maxZoom: 20,
    className: cls
  }).addTo(leafletMap);
};

window.flyToHotspot = function (key) {
  const spot = REAL_HOTSPOTS[key];
  if (!spot || !leafletMap) return;
  window.soundEngine.playPing();
  appState.sanbaoLatLng.lat = spot.lat;
  appState.sanbaoLatLng.lng = spot.lng;
  appState.userLatLng.lat = spot.lat - 0.0022;
  appState.userLatLng.lng = spot.lng + 0.0022;
  leafletMap.flyTo([spot.lat, spot.lng], 17, { duration: 0.85 });
  updateRealMapOverlays();
  syncUI();
  showToast(`📍 已瞬移至：${spot.name}`, `街角級精準鎖定 (${spot.lat.toFixed(4)}, ${spot.lng.toFixed(4)})`, 'amber');
};

window.useRealBrowserGPS = function () {
  if (!navigator.geolocation) {
    showToast('⚠️ 瀏覽器不支援定位', '請使用上方搜尋欄輸入地標定位！', 'red');
    return;
  }
  window.soundEngine.playPing();
  showToast('🛰️ 啟動高精準衛星定位...', '請在瀏覽器點選「允許」位置權限', 'cyan');

  navigator.geolocation.getCurrentPosition(
    (pos) => {
      const { latitude, longitude, accuracy } = pos.coords;
      appState.userLatLng.lat = latitude;
      appState.userLatLng.lng = longitude;
      appState.userLatLng.accuracy = Math.round(accuracy || 10);
      // Spawn Sanbao friend 160m away on nearby street for realistic street-level monitoring
      appState.sanbaoLatLng.lat = latitude + 0.0014;
      appState.sanbaoLatLng.lng = longitude + 0.0012;

      if (leafletMap) leafletMap.flyTo([latitude, longitude], 17, { duration: 0.9 });
      updateRealMapOverlays();
      syncUI();
      showToast(
        '✅ 街角級精準定位成功！',
        `誤差 ±${appState.userLatLng.accuracy}m・損友三寶就在離你 180 公尺處！`,
        'emerald'
      );
    },
    () => {
      showToast('⚠️ 無法取得衛星權限', '已為您切換至高精準預設街口，也可直接在搜尋框輸入路名！', 'amber');
      if (leafletMap) leafletMap.setZoom(17);
    },
    { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
  );
};

window.searchMapLocation = async function (e) {
  e.preventDefault();
  const input = document.getElementById('map-search-input');
  const query = input?.value.trim();
  if (!query) return;

  window.soundEngine.playPing();
  showToast('🔍 正在搜尋精準座標...', `查詢：「${query}」`, 'cyan');

  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=1&accept-language=zh-TW`
    );
    const data = await res.json();
    if (data && data.length > 0) {
      const lat = parseFloat(data[0].lat);
      const lng = parseFloat(data[0].lon);
      appState.sanbaoLatLng.lat = lat;
      appState.sanbaoLatLng.lng = lng;
      appState.userLatLng.lat = lat - 0.0018;
      appState.userLatLng.lng = lng + 0.0018;
      if (leafletMap) leafletMap.flyTo([lat, lng], 17, { duration: 0.9 });
      updateRealMapOverlays();
      syncUI();
      showToast('🛰️ 街角鎖定成功！', `${data[0].display_name.slice(0, 36)}...`, 'emerald');
      return;
    }
  } catch (err) {}

  showToast('⚠️ 找不到該路名', '請嘗試輸入更完整的地標（例如：台中好市多、台北101）', 'red');
};

// ============================================================================
// WORKING DIRECT LINE SHARE INTEGRATION
// ============================================================================
function buildCurrentAlertShareText() {
  const box = document.getElementById('share-copy-textarea');
  if (box && box.value) return box.value;
  const sc = SCENARIOS[appState.scenario];
  const metrics = computeTacticalMetrics();
  const { name, plate } = appState.profile;
  const { lat, lng } = appState.sanbaoLatLng;
  const shareUrl = `https://seanko31415.github.io/aegis-sanbao-radar/?name=${encodeURIComponent(name)}&plate=${encodeURIComponent(plate)}&mode=${appState.scenario}&lat=${lat.toFixed(5)}&lng=${lng.toFixed(5)}`;
  return `🚨【損友三寶出車警報】「${name}」(${plate}) 已經拿著雞腿駕照握住方向盤了！\n目前狀態：【${sc.level}】暴風半徑 ${metrics.effectiveRadius}km！\n📡 點開看他的即時防空雷達位置：\n${shareUrl}`;
}

window.shareDirectlyToLine = function () {
  window.soundEngine.playClick(880);
  updateSharePreviewText();
  const text = buildCurrentAlertShareText();

  // Copy to clipboard as backup AND open official LINE universal share link
  try {
    navigator.clipboard?.writeText(text);
  } catch (e) {}

  const lineShareUrl = `https://line.me/R/share?text=${encodeURIComponent(text)}`;
  window.open(lineShareUrl, '_blank', 'noopener,noreferrer');
  showToast('💬 已開啟 LINE 分享視窗！', '同時已複製警報文字，可直接選擇好友或群組傳送！', 'emerald');
};

window.shareMyDrivingLink = function (openLine = false) {
  window.soundEngine.playClick(880);
  const myName = document.getElementById('my-driver-name')?.value.trim() || appState.profile.name;
  const myPlate = document.getElementById('my-driver-plate')?.value.trim().toUpperCase() || appState.profile.plate;
  const { lat, lng } = appState.sanbaoLatLng;
  const url = `https://seanko31415.github.io/aegis-sanbao-radar/?name=${encodeURIComponent(myName)}&plate=${encodeURIComponent(myPlate)}&mode=${appState.scenario}&lat=${lat.toFixed(5)}&lng=${lng.toFixed(5)}`;
  const msg = `🚨【損友三寶出車通知】${myName} (${myPlate}) 剛剛開車上路了！\n點開看他的即時防空雷達位置，方圓 3km 快閃開：\n${url}`;

  try {
    navigator.clipboard?.writeText(msg);
  } catch (e) {}

  if (openLine) {
    const lineUrl = `https://line.me/R/share?text=${encodeURIComponent(msg)}`;
    window.open(lineUrl, '_blank', 'noopener,noreferrer');
    showToast('💬 已開啟 LINE 傳送定位！', '選擇群組即可一鍵發送即時雷達連結！', 'emerald');
  } else {
    showToast('📋 已複製出車定位連結！', '快貼到 LINE 群組叫朋友閃開！', 'emerald');
  }
};

// ============================================================================
// EXTRA INTERACTIVE COCKPIT PRANKS & TAROT DRAW
// ============================================================================
window.triggerCockpitAction = function (type) {
  if (type === 'horn') {
    window.soundEngine.playHorn();
    window.soundEngine.speak('叭叭叭！讓開讓開！我也不知道我現在要轉哪邊！');
    triggerAnimeCutIn('📯 驚慌連按喇叭！', '想按雨刷怎麼按到喇叭了啦！', '#F43F5E');
    showToast('📯 叭叭——！！', `${appState.profile.name} 驚慌中把喇叭當方向燈按！`, 'red');
  } else if (type === 'rgear') {
    window.soundEngine.playRadarBeep();
    window.soundEngine.speak('嗶嗶嗶！誰把好市多的柱子放在我車屁股後面啦！');
    triggerAnimeCutIn('🔊 倒車雷達破音！', '嗶嗶嗶嗶——離柱子只剩 3 公分！', '#2DD4BF');
    showToast('🔊 倒車雷達長鳴！', '後方排隊車主已經嚇到棄車逃跑了！', 'amber');
  }
};

window.drawRandomTarotCard = function () {
  window.soundEngine.playPing();
  const card = TAROT_CARDS[Math.floor(Math.random() * TAROT_CARDS.length)];
  window.soundEngine.speak(`${card.name}。${card.desc}`);
  triggerAnimeCutIn(card.name, card.desc, '#FEF08A');
  showToast(card.name, card.desc, 'amber');
};

// ============================================================================
// UPGRADED 3D / 2.5D COSTCO B2 REVERSE PARKING SIMULATOR
// (Supports "▶️ 點擊開始挑戰", Continuous Arrow Keys ↑↓←→, Touch Hold, 3D View + Radar PIP & Moving Carts!)
// ============================================================================
const PARKING_BAY = { x: 325, y: 75, w: 105, h: 100 };
const PILLARS_BY_LEVEL = {
  1: [
    { x: 295, y: 48, r: 12, label: '柱A' },
    { x: 295, y: 202, r: 12, label: '柱B' }
  ],
  2: [
    { x: 295, y: 48, r: 13, label: '柱A' },
    { x: 295, y: 202, r: 13, label: '柱B' }
  ],
  3: [
    { x: 290, y: 55, r: 14, label: '柱A' },
    { x: 290, y: 195, r: 14, label: '柱B' },
    { x: 195, y: 42, r: 12, label: '柱C' },
    { x: 195, y: 208, r: 12, label: '柱D' }
  ]
};

window.activateParkingChallenge = function () {
  window.soundEngine.playPing();
  const g = appState.parkingGame;
  g.active = true;
  g.status = 'PLAYING';
  g.carX = 88;
  g.carY = 125;
  g.carAngle = 0;
  g.steerWheelDeg = 0;
  g.gear = 'R';
  g.keys = { left: false, right: false, up: false, down: false };

  const overlay = document.getElementById('parking-start-overlay');
  if (overlay) overlay.classList.add('hidden');
  showToast('🎮 3D 好市多倒車挑戰開始！', '請使用鍵盤 ↑↓←→ 或按住下方方向盤與踏板倒車入庫！', 'emerald');
  renderParkingMiniGame();
};

function showParkingOverlay(badgeText, titleText, descText, btnText = '🔄 再挑戰一次') {
  const overlay = document.getElementById('parking-start-overlay');
  if (!overlay) return;
  document.getElementById('parking-overlay-badge').textContent = badgeText;
  document.getElementById('parking-overlay-title').textContent = titleText;
  document.getElementById('parking-overlay-desc').textContent = descText;
  const btn = overlay.querySelector('button');
  if (btn) btn.textContent = btnText;
  overlay.classList.remove('hidden');
}

window.toggleParkingCameraMode = function () {
  window.soundEngine.playClick(760);
  const g = appState.parkingGame;
  g.viewMode = g.viewMode === '3D' ? '2D' : '3D';
  const btn = document.getElementById('btn-parking-cam');
  if (btn) {
    btn.textContent = g.viewMode === '3D' ? '🎥 3D透視+雷達' : '🛸 2D上帝平面';
  }
  renderParkingMiniGame();
};

window.toggleParkingInvertMode = function () {
  window.soundEngine.playClick(720);
  const g = appState.parkingGame;
  g.invertSteer = !g.invertSteer;
  const btn = document.getElementById('btn-parking-invert');
  if (btn) {
    btn.textContent = g.invertSteer ? '🔀 左右相反: ON' : '🛞 正常方向: ON';
    btn.className = g.invertSteer
      ? 'px-2 py-0.5 rounded-lg bg-rose-600/30 border border-rose-400/50 text-[10px] font-black text-rose-200'
      : 'px-2 py-0.5 rounded-lg bg-teal-500/30 border border-teal-400/50 text-[10px] font-black text-teal-200';
  }
  showToast(
    g.invertSteer ? '🔀 已開啟「三寶左右相反」腦袋打結模式' : '🛞 已切換為「一般正常方向盤」模式',
    g.invertSteer ? '左打方向盤車尾會往右偏喔！' : '方向盤方向已恢復直覺模式！',
    'amber'
  );
};

window.selectParkingLevel = function (lvl) {
  window.soundEngine.playClick(820);
  appState.parkingGame.level = lvl;
  [1, 2, 3].forEach((n) => {
    const b = document.getElementById(`park-lvl-${n}`);
    if (b) {
      b.className =
        n === lvl
          ? 'py-1 rounded-lg bg-amber-400 text-slate-950 font-black'
          : 'py-1 rounded-lg bg-slate-900 text-amber-200 border border-amber-300/30 font-bold';
    }
  });
  window.activateParkingChallenge();
};

window.setParkingKey = function (dir, isDown) {
  const g = appState.parkingGame;
  if (isDown && (!g.active || g.status !== 'PLAYING')) {
    window.activateParkingChallenge();
  }
  g.keys[dir] = isDown;
};

window.stepParkingCar = function (cmd) {
  const g = appState.parkingGame;
  if (!g.active || g.status !== 'PLAYING') {
    window.activateParkingChallenge();
    return;
  }
  window.soundEngine.playClick(680);
  const mult = g.invertSteer ? 1 : -1;
  if (cmd === 'LEFT') {
    g.carAngle += 14 * mult;
    g.steerWheelDeg = Math.max(-45, g.steerWheelDeg - 18);
  }
  if (cmd === 'RIGHT') {
    g.carAngle -= 14 * mult;
    g.steerWheelDeg = Math.min(45, g.steerWheelDeg + 18);
  }
  if (cmd === 'REV') {
    g.gear = 'R';
    const rad = (g.carAngle * Math.PI) / 180;
    g.carX += Math.cos(rad) * 18;
    g.carY += Math.sin(rad) * 18;
  }
  if (cmd === 'FWD') {
    g.gear = 'D';
    const rad = (g.carAngle * Math.PI) / 180;
    g.carX -= Math.cos(rad) * 16;
    g.carY -= Math.sin(rad) * 16;
  }
  evaluateParkingCollision();
  renderParkingMiniGame();
};

function computeParkingState(g) {
  const pillars = PILLARS_BY_LEVEL[g.level] || PILLARS_BY_LEVEL[1];

  // Check pillar collision
  for (const p of pillars) {
    const dist = Math.hypot(g.carX - p.x, g.carY - p.y);
    if (dist < p.r + 19) {
      return { status: 'CRASH', pct: 0, msg: `💥 撞爆好市多【${p.label}】水泥柱！賠慘了！` };
    }
  }

  // Check neighboring parked cars in Lv.3
  if (g.level === 3) {
    if (g.carX > 310 && (g.carY < 58 || g.carY > 192)) {
      return { status: 'CRASH', pct: 0, msg: '💥 擦撞隔壁百萬進口休旅車！' };
    }
  }

  // Check moving Costco shopping carts in Lv.2 & Lv.3
  if (g.level >= 2) {
    for (const c of g.carts) {
      const dist = Math.hypot(g.carX - c.x, g.carY - c.y);
      if (dist < 24) {
        return { status: 'CRASH', pct: 0, msg: `💥 撞翻【${c.label}】的好市多烤雞推車了！` };
      }
    }
  }

  // Check wall bounds
  if (g.carX < 28 || g.carX > 432 || g.carY < 24 || g.carY > 226) {
    return { status: 'CRASH', pct: 0, msg: '💥 擦撞 B2 地下室車道牆壁！' };
  }

  const bayCx = PARKING_BAY.x + PARKING_BAY.w / 2;
  const bayCy = PARKING_BAY.y + PARKING_BAY.h / 2;
  const distToCenter = Math.hypot(g.carX - bayCx, g.carY - bayCy);
  const rawPct = Math.max(0, Math.min(100, Math.round((1 - distToCenter / 260) * 115)));

  // Normalize angle check (straight within ±28 deg)
  const normAngle = Math.abs((((g.carAngle % 360) + 540) % 360) - 180);
  const angleError = Math.min(Math.abs(g.carAngle % 360), 360 - Math.abs(g.carAngle % 360));

  const insideBay =
    g.carX >= PARKING_BAY.x + 26 &&
    g.carX <= PARKING_BAY.x + PARKING_BAY.w - 22 &&
    g.carY >= PARKING_BAY.y + 20 &&
    g.carY <= PARKING_BAY.y + PARKING_BAY.h - 20 &&
    (angleError < 32 || normAngle < 32);

  if (insideBay) {
    return { status: 'WIN', pct: 100, msg: '🏆 奇蹟！完美停進好市多 B2 金色皇室車位！' };
  }

  return {
    status: 'PLAYING',
    pct: rawPct,
    msg: `💡 按住【↓ 倒車】與【← → 方向盤】將車尾停入右側金框`
  };
}

function evaluateParkingCollision() {
  const g = appState.parkingGame;
  const res = computeParkingState(g);
  g.overlapPct = res.pct;
  g.rearDistCm = Math.max(0, Math.round((PARKING_BAY.x + PARKING_BAY.w - (g.carX + 24)) * 2.2));

  if (res.status === 'WIN' && g.status !== 'WIN') {
    g.status = 'WIN';
    g.active = false;
    g.keys = { left: false, right: false, up: false, down: false };
    window.soundEngine.playWinFanfare();
    window.soundEngine.speak('太神啦！雖然刷了二十下雨刷，但你成功停進好市多車格了！');
    triggerAnimeCutIn('🏆 B2 奇蹟入庫成功！', `恭喜通過 Lv.${g.level} 好市多倒車考驗！`, '#2DD4BF');
    showParkingOverlay('🏆 MISSION CLEAR // 入庫率 100%', '奇蹟入庫！教練看到都要哭了！', res.msg, '▶️ 挑戰下一趟 / 再玩一次');
  } else if (res.status === 'CRASH' && g.status !== 'CRASH') {
    g.status = 'CRASH';
    g.active = false;
    g.keys = { left: false, right: false, up: false, down: false };
    window.soundEngine.playWiperSlap();
    window.soundEngine.speak(res.msg.replace('💥', ''));
    showToast('💥 擦撞警報！', res.msg, 'red');
    showParkingOverlay('💥 CRASH ALERT // 擦撞事故', res.msg, '別灰心！三寶就是在一次次擦撞中成長的！', '🔄 點擊重新倒車');
  }
}

// 3D Perspective Projection Helper for 3D Mode
function projectIso3D(x, y, z = 0) {
  // Maps (0..460, 0..250, z) into a sleek 2.5D/3D tilted garage perspective
  const cx = 230;
  const cy = 125;
  const dx = x - cx;
  const dy = y - cy;
  const perspectiveScale = 0.78 + (y / 250) * 0.34;
  return {
    sx: cx + dx * perspectiveScale,
    sy: cy + dy * 0.72 - z * 1.15 + 14,
    scale: perspectiveScale
  };
}

function draw3DExtrudedBox(ctx, cx, cy, w, h, heightZ, angleDeg, topColor, sideColor, borderColor) {
  const rad = (angleDeg * Math.PI) / 180;
  const cos = Math.cos(rad);
  const sin = Math.sin(rad);
  const hw = w / 2;
  const hh = h / 2;
  const localCorners = [
    { x: -hw, y: -hh },
    { x: hw, y: -hh },
    { x: hw, y: hh },
    { x: -hw, y: hh }
  ];

  const basePts = localCorners.map((p) => projectIso3D(cx + p.x * cos - p.y * sin, cy + p.x * sin + p.y * cos, 0));
  const topPts = localCorners.map((p) => projectIso3D(cx + p.x * cos - p.y * sin, cy + p.x * sin + p.y * cos, heightZ));

  // Draw side faces
  ctx.fillStyle = sideColor;
  ctx.strokeStyle = borderColor;
  ctx.lineWidth = 1.2;
  for (let i = 0; i < 4; i++) {
    const next = (i + 1) % 4;
    ctx.beginPath();
    ctx.moveTo(basePts[i].sx, basePts[i].sy);
    ctx.lineTo(basePts[next].sx, basePts[next].sy);
    ctx.lineTo(topPts[next].sx, topPts[next].sy);
    ctx.lineTo(topPts[i].sx, topPts[i].sy);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
  }

  // Draw top face
  ctx.fillStyle = topColor;
  ctx.beginPath();
  ctx.moveTo(topPts[0].sx, topPts[0].sy);
  for (let i = 1; i < 4; i++) ctx.lineTo(topPts[i].sx, topPts[i].sy);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  return { basePts, topPts };
}

function renderParkingMiniGame() {
  const canvas = document.getElementById('parking-game-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const w = canvas.width;
  const h = canvas.height;
  const g = appState.parkingGame;
  const res = computeParkingState(g);
  const pillars = PILLARS_BY_LEVEL[g.level] || PILLARS_BY_LEVEL[1];

  const badge = document.getElementById('parking-progress-badge');
  if (badge) {
    badge.textContent = `入庫率 ${res.pct}%`;
    badge.className =
      res.status === 'WIN'
        ? 'px-2 py-0.5 rounded-full bg-teal-400 text-slate-950 font-mono text-[10px] font-black'
        : 'px-2 py-0.5 rounded-full bg-amber-400/20 border border-amber-300/40 font-mono text-[10px] font-black text-amber-300';
  }

  // Background Sky / Garage Ceiling Gradient
  const bgGrad = ctx.createLinearGradient(0, 0, 0, h);
  bgGrad.addColorStop(0, '#050814');
  bgGrad.addColorStop(0.3, '#0B132B');
  bgGrad.addColorStop(1, '#060916');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, w, h);

  if (g.viewMode === '3D') {
    // ========================================================================
    // 3D PERSPECTIVE GARAGE MODE + MINI RADAR PIP
    // ========================================================================
    // 1. 3D Perspective Floor Grid
    ctx.strokeStyle = 'rgba(254, 240, 138, 0.07)';
    ctx.lineWidth = 1;
    for (let gx = 20; gx <= 440; gx += 35) {
      const p1 = projectIso3D(gx, 15, 0);
      const p2 = projectIso3D(gx, 235, 0);
      ctx.beginPath();
      ctx.moveTo(p1.sx, p1.sy);
      ctx.lineTo(p2.sx, p2.sy);
      ctx.stroke();
    }
    for (let gy = 20; gy <= 235; gy += 30) {
      const p1 = projectIso3D(20, gy, 0);
      const p2 = projectIso3D(440, gy, 0);
      ctx.beginPath();
      ctx.moveTo(p1.sx, p1.sy);
      ctx.lineTo(p2.sx, p2.sy);
      ctx.stroke();
    }

    // 2. 3D Golden Target Parking Bay
    const bayCorners = [
      projectIso3D(PARKING_BAY.x, PARKING_BAY.y, 0),
      projectIso3D(PARKING_BAY.x + PARKING_BAY.w, PARKING_BAY.y, 0),
      projectIso3D(PARKING_BAY.x + PARKING_BAY.w, PARKING_BAY.y + PARKING_BAY.h, 0),
      projectIso3D(PARKING_BAY.x, PARKING_BAY.y + PARKING_BAY.h, 0)
    ];
    ctx.save();
    ctx.fillStyle = res.status === 'WIN' ? 'rgba(45, 212, 191, 0.28)' : 'rgba(254, 240, 138, 0.14)';
    ctx.strokeStyle = res.status === 'WIN' ? '#2DD4BF' : '#FEF08A';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(bayCorners[0].sx, bayCorners[0].sy);
    bayCorners.slice(1).forEach((p) => ctx.lineTo(p.sx, p.sy));
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    const bayCenter3D = projectIso3D(PARKING_BAY.x + PARKING_BAY.w / 2, PARKING_BAY.y + PARKING_BAY.h / 2, 0);
    ctx.font = '900 11px "JetBrains Mono", monospace';
    ctx.fillStyle = '#FEF08A';
    ctx.textAlign = 'center';
    ctx.fillText('🅿️ VIP B2-88', bayCenter3D.sx, bayCenter3D.sy + 4);
    ctx.restore();

    // 3. Neighboring 3D Parked Cars (in Lv.3 or decorative)
    draw3DExtrudedBox(ctx, 375, 32, 82, 34, 16, 0, '#1E293B', '#0F172A', 'rgba(148,163,184,0.4)');
    draw3DExtrudedBox(ctx, 375, 218, 82, 34, 16, 0, '#1E293B', '#0F172A', 'rgba(148,163,184,0.4)');

    // 4. 3D Curved Reversing Camera Guidelines (Red / Yellow / Green)
    const rad = (g.carAngle * Math.PI) / 180;
    [35, 65, 95].forEach((dist, idx) => {
      const gx = g.carX + Math.cos(rad) * dist;
      const gy = g.carY + Math.sin(rad) * dist;
      const leftPt = projectIso3D(gx - Math.sin(rad) * 18, gy + Math.cos(rad) * 18, 1);
      const rightPt = projectIso3D(gx + Math.sin(rad) * 18, gy - Math.cos(rad) * 18, 1);
      ctx.strokeStyle = idx === 0 ? '#F43F5E' : idx === 1 ? '#FEF08A' : '#2DD4BF';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(leftPt.sx, leftPt.sy);
      ctx.lineTo(rightPt.sx, rightPt.sy);
      ctx.stroke();
    });

    // 5. Moving 3D Costco Shopping Carts (Lv.2 & Lv.3)
    if (g.level >= 2) {
      g.carts.forEach((c) => {
        draw3DExtrudedBox(ctx, c.x, c.y, 22, 16, 14, 90, '#F59E0B', '#B45309', '#FEF08A');
        const lblPt = projectIso3D(c.x, c.y, 20);
        ctx.font = '900 9px "Noto Sans TC", sans-serif';
        ctx.fillStyle = '#FEF08A';
        ctx.textAlign = 'center';
        ctx.fillText(c.label, lblPt.sx, lblPt.sy);
      });
    }

    // 6. 3D Extruded Player SUV (Chassis + Cabin Roof + Headlights + Reverse Taillights!)
    const bodyColor = g.status === 'CRASH' ? '#E11D48' : g.status === 'WIN' ? '#14B8A6' : '#2563EB';
    const sideColor = g.status === 'CRASH' ? '#881337' : g.status === 'WIN' ? '#0F766E' : '#1E3A8A';
    draw3DExtrudedBox(ctx, g.carX, g.carY, 52, 30, 12, g.carAngle, bodyColor, sideColor, '#FEF08A');
    // SUV Cabin Roof
    draw3DExtrudedBox(ctx, g.carX - Math.cos(rad) * 3, g.carY - Math.sin(rad) * 3, 28, 22, 20, g.carAngle, '#0F172A', '#1E293B', '#93C5FD');

    // Rear Red Reverse Lights (+X direction)
    const rearL = projectIso3D(g.carX + Math.cos(rad) * 26 - Math.sin(rad) * 10, g.carY + Math.sin(rad) * 26 + Math.cos(rad) * 10, 8);
    const rearR = projectIso3D(g.carX + Math.cos(rad) * 26 + Math.sin(rad) * 10, g.carY + Math.sin(rad) * 26 - Math.cos(rad) * 10, 8);
    ctx.fillStyle = '#FF2E4C';
    ctx.beginPath(); ctx.arc(rearL.sx, rearL.sy, 3.5, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(rearR.sx, rearR.sy, 3.5, 0, Math.PI * 2); ctx.fill();

    // Car Roof Label
    const carTopPt = projectIso3D(g.carX, g.carY, 26);
    ctx.font = '900 10px "JetBrains Mono", monospace';
    ctx.fillStyle = '#FEF08A';
    ctx.textAlign = 'center';
    ctx.fillText(`🚗 ${g.gear}檔`, carTopPt.sx, carTopPt.sy);

    // 7. 3D Extruded Red Concrete Pillars
    pillars.forEach((p) => {
      draw3DExtrudedBox(ctx, p.x, p.y, p.r * 1.8, p.r * 1.8, 34, 0, '#F43F5E', '#9F1239', '#FECDD3');
      const topP = projectIso3D(p.x, p.y, 38);
      ctx.font = '900 9px "Noto Sans TC", sans-serif';
      ctx.fillStyle = '#FDA4AF';
      ctx.textAlign = 'center';
      ctx.fillText(p.label, topP.sx, topP.sy);
    });

    // 8. Top-Left Mini 2D Radar PIP (Picture-in-Picture)
    ctx.save();
    ctx.fillStyle = 'rgba(6, 9, 22, 0.88)';
    ctx.strokeStyle = 'rgba(254, 240, 138, 0.5)';
    ctx.lineWidth = 1.5;
    ctx.fillRect(10, 10, 96, 56);
    ctx.strokeRect(10, 10, 96, 56);
    const sx = 96 / w;
    const sy = 56 / h;
    // PIP Bay
    ctx.strokeStyle = '#FEF08A';
    ctx.strokeRect(10 + PARKING_BAY.x * sx, 10 + PARKING_BAY.y * sy, PARKING_BAY.w * sx, PARKING_BAY.h * sy);
    // PIP Pillars
    ctx.fillStyle = '#F43F5E';
    pillars.forEach((p) => {
      ctx.beginPath();
      ctx.arc(10 + p.x * sx, 10 + p.y * sy, 2.5, 0, Math.PI * 2);
      ctx.fill();
    });
    // PIP Car
    ctx.fillStyle = '#38BDF8';
    ctx.fillRect(10 + g.carX * sx - 4, 10 + g.carY * sy - 2.5, 8, 5);
    ctx.restore();
  } else {
    // ========================================================================
    // 2D TOP-DOWN PRECISION RADAR MODE
    // ========================================================================
    ctx.fillStyle = res.status === 'WIN' ? 'rgba(45, 212, 191, 0.22)' : 'rgba(254, 240, 138, 0.12)';
    ctx.fillRect(PARKING_BAY.x, PARKING_BAY.y, PARKING_BAY.w, PARKING_BAY.h);
    ctx.strokeStyle = res.status === 'WIN' ? '#2DD4BF' : '#FEF08A';
    ctx.lineWidth = 2.5;
    ctx.strokeRect(PARKING_BAY.x, PARKING_BAY.y, PARKING_BAY.w, PARKING_BAY.h);

    ctx.font = '900 11px "JetBrains Mono", monospace';
    ctx.fillStyle = '#FEF08A';
    ctx.textAlign = 'center';
    ctx.fillText('🅿️ VIP B2-88', PARKING_BAY.x + PARKING_BAY.w / 2, PARKING_BAY.y + PARKING_BAY.h / 2 + 4);

    if (g.level >= 2) {
      g.carts.forEach((c) => {
        ctx.fillStyle = '#F59E0B';
        ctx.fillRect(c.x - 10, c.y - 8, 20, 16);
        ctx.fillStyle = '#FEF08A';
        ctx.font = '700 9px "Noto Sans TC"';
        ctx.fillText(c.label, c.x, c.y - 11);
      });
    }

    pillars.forEach((p) => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = '#F43F5E';
      ctx.fill();
      ctx.lineWidth = 2;
      ctx.strokeStyle = '#FECDD3';
      ctx.stroke();
    });

    ctx.save();
    ctx.translate(g.carX, g.carY);
    ctx.rotate((g.carAngle * Math.PI) / 180);
    ctx.fillStyle = g.status === 'CRASH' ? '#F43F5E' : g.status === 'WIN' ? '#2DD4BF' : '#3B82F6';
    ctx.beginPath();
    ctx.roundRect(-26, -15, 52, 30, 6);
    ctx.fill();
    ctx.strokeStyle = '#FEF08A';
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.fillStyle = '#EF4444';
    ctx.fillRect(22, -12, 4, 7);
    ctx.fillRect(22, 5, 4, 7);
    ctx.fillStyle = '#FEF08A';
    ctx.font = '900 9px "JetBrains Mono"';
    ctx.textAlign = 'center';
    ctx.fillText('R➔', 0, 3);
    ctx.restore();
  }

  // ==========================================================================
  // COCKPIT HUD OVERLAY: STEERING WHEEL + GEAR + ULTRASONIC SENSOR BAR
  // ==========================================================================
  // Steering Wheel HUD (Bottom Left)
  ctx.save();
  ctx.translate(34, h - 32);
  ctx.rotate((g.steerWheelDeg * Math.PI) / 180);
  ctx.strokeStyle = '#FEF08A';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(0, 0, 16, 0, Math.PI * 2);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(-14, 0);
  ctx.lineTo(14, 0);
  ctx.moveTo(0, 0);
  ctx.lineTo(0, 14);
  ctx.stroke();
  ctx.restore();

  // Bottom Status Bar
  ctx.fillStyle = 'rgba(6, 9, 22, 0.86)';
  ctx.fillRect(62, h - 28, w - 70, 22);
  ctx.font = '700 11px "Noto Sans TC", sans-serif';
  ctx.fillStyle = res.status === 'CRASH' ? '#FDA4AF' : res.status === 'WIN' ? '#5EEAD4' : '#FDE68A';
  ctx.textAlign = 'left';
  ctx.fillText(`${res.msg} (後距: ${g.rearDistCm}cm)`, 68, h - 13);
}

// 60FPS Continuous Loop for 3D Costco Parking Game (Keyboard Hold + Touch Hold + Moving Shopping Carts!)
function updateParkingGameLoop() {
  const g = appState.parkingGame;
  if (g.active && g.status === 'PLAYING') {
    let changed = false;
    const mult = g.invertSteer ? 1 : -1;

    if (g.keys.left) {
      g.carAngle += 1.8 * mult;
      g.steerWheelDeg = Math.max(-55, g.steerWheelDeg - 3.5);
      changed = true;
    } else if (g.keys.right) {
      g.carAngle -= 1.8 * mult;
      g.steerWheelDeg = Math.min(55, g.steerWheelDeg + 3.5);
      changed = true;
    } else if (Math.abs(g.steerWheelDeg) > 1) {
      g.steerWheelDeg *= 0.88;
      changed = true;
    }

    if (g.keys.down) {
      g.gear = 'R';
      const rad = (g.carAngle * Math.PI) / 180;
      g.carX += Math.cos(rad) * 1.75;
      g.carY += Math.sin(rad) * 1.75;
      changed = true;
    }
    if (g.keys.up) {
      g.gear = 'D';
      const rad = (g.carAngle * Math.PI) / 180;
      g.carX -= Math.cos(rad) * 1.65;
      g.carY -= Math.sin(rad) * 1.65;
      changed = true;
    }

    // Move Costco Shopping Carts in Lv.2 & Lv.3
    if (g.level >= 2) {
      g.carts.forEach((c) => {
        c.y += c.vy * (g.level === 3 ? 1.35 : 1);
        if (c.y < 38 || c.y > 212) c.vy *= -1;
      });
      changed = true;
    }

    if (changed) {
      evaluateParkingCollision();
      renderParkingMiniGame();
    }
  }
  requestAnimationFrame(updateParkingGameLoop);
}

// ============================================================================
// TAB 2: 🚗 損友出車共享
// ============================================================================
function renderSquadFriendsList() {
  const container = document.getElementById('squad-friends-list');
  if (!container) return;

  container.innerHTML = appState.squad
    .map((f) => {
      const sc = SCENARIOS[f.mode] || SCENARIOS.snack;
      const isSelected = f.name === appState.profile.name;
      const avatarSrc = f.avatar || 'assets/sanbao_chicken_avatar.jpg';
      return `
      <div onclick="focusSquadFriend('${f.id}')" class="cursor-pointer tarot-btn p-3 ${
        isSelected ? 'ring-2 ring-amber-300' : ''
      } flex items-center gap-3">
        <img src="${avatarSrc}" onerror="this.src='assets/sanbao_avatar.jpg'" class="w-12 h-12 rounded-xl object-cover border border-amber-300 shrink-0" />
        <div class="min-w-0 flex-1 space-y-1">
          <div class="flex items-center justify-between gap-1">
            <span class="font-black text-sm text-white truncate">${f.name}</span>
            <span class="px-2 py-0.5 rounded-full text-[10px] font-mono font-black text-slate-950 shrink-0" style="background:${sc.color}">
              ${sc.level}
            </span>
          </div>
          <div class="text-xs text-amber-100 font-bold truncate">${f.sosMsg}</div>
          <div class="flex items-center justify-between text-[10px] text-amber-300/80 font-mono">
            <span>${f.plate}</span>
            <span>📍 點擊在地圖鎖定 ➔</span>
          </div>
        </div>
      </div>`;
    })
    .join('');
}

window.focusSquadFriend = function (id) {
  const friend = appState.squad.find((f) => f.id === id);
  if (!friend) return;
  window.soundEngine.playPing();

  appState.profile.name = friend.name;
  appState.profile.plate = friend.plate;
  if (friend.avatar) appState.profile.avatar = friend.avatar;
  appState.scenario = friend.mode;
  appState.chaosIndex = SCENARIOS[friend.mode].baseChaos;
  appState.sanbaoLatLng.lat = friend.lat;
  appState.sanbaoLatLng.lng = friend.lng;

  const vipImg = document.getElementById('vip-avatar-img');
  if (vipImg) vipImg.src = appState.profile.avatar;

  refreshMainMarkers();
  renderSquadMapMarkers();
  updateRealMapOverlays();
  renderSquadFriendsList();
  syncUI();

  window.switchTab('radar');
  if (leafletMap) leafletMap.flyTo([friend.lat, friend.lng], 17, { duration: 0.8 });
  triggerAnimeCutIn(`✦ 已鎖定損友：${friend.name}`, friend.sosMsg, SCENARIOS[friend.mode].color);
};

window.addFriendToSquad = function (e) {
  e.preventDefault();
  const nameEl = document.getElementById('add-friend-name');
  const plateEl = document.getElementById('add-friend-plate');
  const statusEl = document.getElementById('add-friend-status');

  const name = nameEl?.value.trim();
  const plate = plateEl?.value.trim().toUpperCase() || 'SAN-8888';
  const mode = statusEl?.value || 'parking';

  if (!name) {
    showToast('⚠️ 請輸入損友名字', '輸入後即可加入三寶監測網！', 'red');
    return;
  }

  window.soundEngine.playPing();
  const sc = SCENARIOS[mode];
  const randomAvatar = DRIVER_AVATARS[Math.floor(Math.random() * DRIVER_AVATARS.length)].src;
  appState.squad.unshift({
    id: 'f_' + Date.now(),
    name,
    plate,
    mode,
    avatar: randomAvatar,
    lat: sc.lat + (Math.random() - 0.5) * 0.008,
    lng: sc.lng + (Math.random() - 0.5) * 0.008,
    sosMsg: sc.osList[0].replace('💭', '')
  });
  saveSquadToStorage();
  renderSquadFriendsList();
  renderSquadMapMarkers();

  nameEl.value = '';
  plateEl.value = '';
  showToast('➕ 損友已加入監測！', `點擊【${name}】卡片即可在地圖追蹤他！`, 'emerald');
};

window.broadcastDriverSOS = function (sosType) {
  const myName = document.getElementById('my-driver-name')?.value.trim() || appState.profile.name;
  const myPlate = document.getElementById('my-driver-plate')?.value.trim().toUpperCase() || appState.profile.plate;

  appState.profile.name = myName;
  appState.profile.plate = myPlate;

  const mapConfig = {
    parking: { mode: 'parking', msg: '🚨「我要開始倒車入庫了！方圓 3km 快移車！」' },
    lost: { mode: 'roundabout', msg: '🔄「救命我卡在圓環繞第 7 圈出不去！」' },
    wiper: { mode: 'snack', msg: '🌧️「我想轉彎卻一直刷雨刷！別看我方向燈！」' },
    safe: { mode: 'home', msg: '🏠「我終於平安停好車了！全城解除警報！」' }
  }[sosType];

  appState.scenario = mapConfig.mode;
  appState.chaosIndex = SCENARIOS[mapConfig.mode].baseChaos;

  const existing = appState.squad.find((f) => f.name === myName);
  if (existing) {
    existing.plate = myPlate;
    existing.mode = mapConfig.mode;
    existing.sosMsg = mapConfig.msg;
    existing.lat = appState.sanbaoLatLng.lat;
    existing.lng = appState.sanbaoLatLng.lng;
  } else {
    appState.squad.unshift({
      id: 'me_' + Date.now(),
      name: myName,
      plate: myPlate,
      mode: mapConfig.mode,
      avatar: appState.profile.avatar,
      lat: appState.sanbaoLatLng.lat,
      lng: appState.sanbaoLatLng.lng,
      sosMsg: mapConfig.msg
    });
  }

  saveSquadToStorage();
  refreshMainMarkers();
  renderSquadFriendsList();
  updateRealMapOverlays();
  syncUI();

  if (sosType === 'safe') window.soundEngine.playPing();
  else window.soundEngine.playSiren();

  document.getElementById('presidential-alert-title').textContent = `${myName} (${myPlate}) 發出全城警報！`;
  document.getElementById('presidential-alert-desc').textContent = mapConfig.msg;
  document.getElementById('modal-presidential-alert')?.classList.remove('hidden');
};

window.toggleRealGpsBeacon = function () {
  const btn = document.getElementById('btn-live-beacon');
  const myName = document.getElementById('my-driver-name')?.value.trim() || appState.profile.name;
  const myPlate = document.getElementById('my-driver-plate')?.value.trim().toUpperCase() || appState.profile.plate;

  appState.profile.name = myName;
  appState.profile.plate = myPlate;

  if (appState.beaconWatchId) {
    navigator.geolocation.clearWatch(appState.beaconWatchId);
    appState.beaconWatchId = null;
    if (btn) btn.textContent = '🚨 我已握住方向盤！開始分享真實位置';
    showToast('⏹️ 已結束位置分享', '您已平安熄火下車！', 'emerald');
    return;
  }

  window.soundEngine.playSiren();
  if (btn) btn.textContent = '🔴 正在即時分享我的開車位置 (點擊結束)';

  if (navigator.geolocation) {
    appState.beaconWatchId = navigator.geolocation.watchPosition(
      (pos) => {
        appState.sanbaoLatLng.lat = pos.coords.latitude;
        appState.sanbaoLatLng.lng = pos.coords.longitude;
        appState.userLatLng.accuracy = Math.round(pos.coords.accuracy || 8);
        refreshMainMarkers();
        updateRealMapOverlays();
        syncUI();
      },
      () => {},
      { enableHighAccuracy: true, maximumAge: 0 }
    );
  }
  showToast('🚗 出車定位已開啟！', `正在雷達上即時廣播【${myName}】的精準位置！`, 'red');
};

// ============================================================================
// UI SYNC & RESPONSIVE TABS
// ============================================================================
function syncUI() {
  const sc = SCENARIOS[appState.scenario];
  const metrics = computeTacticalMetrics();

  const defconBadge = document.getElementById('header-defcon-badge');
  if (defconBadge) {
    defconBadge.textContent = sc.badge;
    defconBadge.style.backgroundColor = sc.color;
  }

  document.getElementById('vip-name').textContent = appState.profile.name;
  document.getElementById('vip-plate').textContent = appState.profile.plate;
  document.getElementById('vip-os-bubble').textContent = sc.osList[appState.osIndex % sc.osList.length];

  const bountyEl = document.getElementById('vip-bounty-badge');
  if (bountyEl) bountyEl.textContent = `懸賞 $${appState.bountyAmount.toLocaleString()}`;

  const coordEl = document.getElementById('gps-coord-readout');
  if (coordEl) {
    coordEl.textContent = `🛰️ 座標: ${appState.sanbaoLatLng.lat.toFixed(5)}°N, ${appState.sanbaoLatLng.lng.toFixed(5)}°E`;
  }
  const accEl = document.getElementById('gps-accuracy-badge');
  if (accEl) {
    accEl.textContent = `±${appState.userLatLng.accuracy || 8}m 街角鎖定`;
  }

  document.getElementById('metric-blast-radius').textContent = `${metrics.effectiveRadius} km`;
  document.getElementById('metric-user-dist').textContent = `${metrics.distKm} km`;
  const survEl = document.getElementById('metric-survival-rate');
  survEl.textContent = `${metrics.survival}%`;
  survEl.style.color = metrics.survival < 40 ? '#F43F5E' : metrics.survival < 75 ? '#FEF08A' : '#2DD4BF';

  document.querySelectorAll('[data-scenario-btn]').forEach((btn) => {
    const active = btn.getAttribute('data-scenario-btn') === appState.scenario;
    btn.classList.toggle('ring-2', active);
    btn.classList.toggle('ring-amber-300', active);
  });

  document.getElementById('lamp-left-turn').classList.toggle('signal-blink-active', sc.leftSignal);
  document.getElementById('lamp-right-turn').classList.toggle('signal-blink-active', sc.rightSignal);

  const isRapidWiper = sc.wiperRapid || appState.wiperBoostActive;
  const wL = document.getElementById('wiper-arm-left');
  const wR = document.getElementById('wiper-arm-right');
  if (wL && wR) {
    wL.classList.toggle('wiper-rapid', isRapidWiper);
    wR.classList.toggle('wiper-rapid', isRapidWiper);
    wL.classList.toggle('wiper-idle', !isRapidWiper && appState.scenario !== 'home');
    wR.classList.toggle('wiper-idle', !isRapidWiper && appState.scenario !== 'home');
  }
  document.getElementById('wiper-status-badge').textContent = isRapidWiper
    ? '☀️ 大晴天雨刷 MAX'
    : appState.scenario === 'home'
    ? '🌙 熄火休眠'
    : '☀️ 偶發誤觸';
  document.getElementById('car-heading-paradox').textContent =
    appState.scenario === 'home' ? '車輪靜止' : `左燈 ➔ 右偏 ${Math.abs(sc.carTiltDeg)}°`;

  document.getElementById('chaos-slider-val').textContent = `${appState.chaosIndex}%`;
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

  appState.sanbaoLatLng.lat = sc.lat;
  appState.sanbaoLatLng.lng = sc.lng;
  if (leafletMap) leafletMap.flyTo([sc.lat, sc.lng], 16, { duration: 0.8 });

  if (key === 'parking') window.soundEngine.playSiren();
  else window.soundEngine.playPing();

  triggerAnimeCutIn(sc.cutInTitle, sc.cutInSub, sc.color);
  updateRealMapOverlays();
  syncUI();
  calculateRouteSafety(false);
};

window.switchTab = function (tabId) {
  window.soundEngine.playClick(780);
  appState.activeTab = tabId;

  ['radar', 'squad', 'route', 'dossier'].forEach((id) => {
    const section = document.getElementById(`tab-panel-${id}`);
    const btn = document.getElementById(`tab-btn-${id}`);
    const mobBtn = document.getElementById(`mob-tab-${id}`);
    if (section) section.classList.toggle('hidden', id !== tabId);
    if (btn) {
      btn.className =
        id === tabId
          ? 'px-4 py-1.5 rounded-xl font-black text-xs flex items-center gap-1.5 bg-gradient-to-r from-amber-300 via-yellow-400 to-amber-500 text-slate-950 shadow-[0_0_18px_rgba(251,191,36,0.5)] transition-all'
          : 'px-4 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 text-amber-100/75 hover:text-white transition-all';
    }
    if (mobBtn) {
      mobBtn.className =
        id === tabId
          ? 'py-2 rounded-xl font-black text-[11px] flex flex-col items-center justify-center bg-gradient-to-r from-amber-300 to-yellow-500 text-slate-950'
          : 'py-2 rounded-xl font-bold text-[11px] flex flex-col items-center justify-center text-amber-100/80';
    }
  });

  if (tabId === 'radar' && leafletMap) setTimeout(() => leafletMap.invalidateSize(), 100);
  if (tabId === 'squad') renderSquadFriendsList();
  if (tabId === 'dossier') requestAnimationFrame(() => drawHexagonChart());
  if (tabId === 'route') {
    calculateRouteSafety(false);
    updateSharePreviewText();
  }
};

window.triggerWiperParadox = function () {
  window.soundEngine.playWiperSlap();
  window.soundEngine.speak('救命啊！我想打方向燈怎麼雨刷一直在刷啦！');
  appState.wiperBoostActive = true;
  triggerAnimeCutIn('🪄 轉彎誤刷雨刷！', '前擋玻璃快被刷破了！', '#FEF08A');
  syncUI();
  setTimeout(() => {
    appState.wiperBoostActive = false;
    syncUI();
  }, 3500);
};

window.setRadarClickMode = function (mode) {
  window.soundEngine.playClick(700);
  appState.clickMode = mode;
  document.getElementById('mode-btn-sanbao').className =
    mode === 'sanbao'
      ? 'px-2.5 py-1 rounded-xl text-[11px] font-black bg-rose-600 text-white'
      : 'px-2.5 py-1 rounded-xl text-[11px] font-bold bg-slate-900 text-amber-100 border border-amber-300/30';
  document.getElementById('mode-btn-user').className =
    mode === 'user'
      ? 'px-2.5 py-1 rounded-xl text-[11px] font-black bg-teal-400 text-slate-950'
      : 'px-2.5 py-1 rounded-xl text-[11px] font-bold bg-slate-900 text-amber-100 border border-amber-300/30';
};

// Route & Share
window.selectTransportMode = function (mode) {
  window.soundEngine.playClick(760);
  appState.routeForm.transport = mode;
  document.querySelectorAll('[data-transport-btn]').forEach((btn) => {
    const active = btn.getAttribute('data-transport-btn') === mode;
    btn.className = active
      ? 'tarot-btn p-3 text-xs font-black text-amber-300 ring-2 ring-amber-300'
      : 'tarot-btn p-3 text-xs font-bold text-slate-200';
  });
  calculateRouteSafety(true);
};

window.calculateRouteSafety = function (playSound = true) {
  if (playSound) window.soundEngine.playPing();
  const sc = SCENARIOS[appState.scenario];
  const mode = appState.routeForm.transport;
  const bonus = { walk: 18, scooter: 42, car: 26, mrt: -65 }[mode] || 20;
  let prob = Math.min(99.4, Math.max(0.8, sc.levelNum * 16 + bonus + appState.chaosIndex * 0.15));
  if (appState.scenario === 'home') prob = 0.5;
  if (mode === 'mrt') prob = Math.max(1.2, prob * 0.15);

  let omen = '【大吉 // 安心出門】';
  let color = '#2DD4BF';
  if (prob >= 70) {
    omen = '【大凶 // 建議就地掩護】';
    color = '#F43F5E';
  } else if (prob >= 35) {
    omen = '【偏凶 // 嚴禁與他併行】';
    color = '#FEF08A';
  }

  const omenEl = document.getElementById('route-result-omen');
  const probEl = document.getElementById('route-result-prob');
  if (omenEl) {
    omenEl.textContent = omen;
    omenEl.style.color = color;
  }
  if (probEl) {
    probEl.textContent = `${prob.toFixed(1)}% 正面遭遇`;
  }
};

window.selectShareStyle = function (style) {
  window.soundEngine.playClick(700);
  appState.shareStyle = style;
  document.querySelectorAll('[data-share-style-btn]').forEach((btn) => {
    btn.className =
      btn.getAttribute('data-share-style-btn') === style
        ? 'px-2.5 py-1 rounded-lg text-xs font-bold bg-amber-400 text-slate-950'
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
  const { lat, lng } = appState.sanbaoLatLng;
  const shareUrl = `https://seanko31415.github.io/aegis-sanbao-radar/?name=${encodeURIComponent(name)}&plate=${encodeURIComponent(plate)}&mode=${appState.scenario}&lat=${lat.toFixed(5)}&lng=${lng.toFixed(5)}`;

  if (appState.shareStyle === 'defense') {
    box.value = `🚨【損友三寶出車警報】「${name}」(${plate}) 已經拿著雞腿駕照握住方向盤了！目前【${sc.level}】暴風圈 ${metrics.effectiveRadius}km！\n📡 即時防空雷達：${shareUrl}`;
  } else if (appState.shareStyle === 'elder') {
    box.value = `🌸平安喜樂🌸 損友【${name}】開車出門囉 (${plate}) 🚗 看到他大晴天刷雨刷代表想轉彎，方圓 ${metrics.effectiveRadius}km 請多禮讓🙏\n📡 定位：${shareUrl}`;
  } else {
    box.value = `📺【快訊】馬路傳奇「${name}」(${plate}) 現蹤街頭！左轉燈連閃 3.8km + 晴天雨刷全開，請保持 3 個紅綠燈車距！\n📡 雷達：${shareUrl}`;
  }
}

window.copyShareText = function () {
  window.soundEngine.playClick(920);
  const box = document.getElementById('share-copy-textarea');
  if (!box) return;
  navigator.clipboard?.writeText(box.value).then(() => {
    showToast('📋 已複製三寶警報！', '可直接貼到 LINE 群組拯救好友！', 'emerald');
  });
};

// Hexagon & Sightings
function drawHexagonChart() {
  const canvas = document.getElementById('hexagon-chart-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const dpr = window.devicePixelRatio || 1;
  const size = 260;
  canvas.width = size * dpr;
  canvas.height = size * dpr;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

  const cx = size / 2;
  const cy = size / 2;
  const maxR = size * 0.34;
  const axes = [
    { label: '雨刷誤觸', val: 98 },
    { label: '謎之自信', val: 100 },
    { label: '停車耗時', val: 96 },
    { label: '方向燈誠信', val: 10 },
    { label: '方向感', val: 14 },
    { label: '副駕驚嚇', val: 99 }
  ];

  ctx.clearRect(0, 0, size, size);
  [0.33, 0.66, 1.0].forEach((step) => {
    ctx.beginPath();
    axes.forEach((_, i) => {
      const a = (Math.PI * 2 * i) / 6 - Math.PI / 2;
      const x = cx + Math.cos(a) * maxR * step;
      const y = cy + Math.sin(a) * maxR * step;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.closePath();
    ctx.strokeStyle = step === 1 ? 'rgba(254, 240, 138, 0.5)' : 'rgba(255, 255, 255, 0.1)';
    ctx.stroke();
  });

  axes.forEach((axis, i) => {
    const a = (Math.PI * 2 * i) / 6 - Math.PI / 2;
    const lx = cx + Math.cos(a) * (maxR + 26);
    const ly = cy + Math.sin(a) * (maxR + 18);
    ctx.font = '700 11px "Noto Sans TC", sans-serif';
    ctx.fillStyle = '#FEF08A';
    ctx.textAlign = 'center';
    ctx.fillText(axis.label, lx, ly);
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
  ctx.fillStyle = 'rgba(244, 63, 94, 0.35)';
  ctx.fill();
  ctx.strokeStyle = '#FEF08A';
  ctx.lineWidth = 2.2;
  ctx.stroke();
}

function renderSightingsList() {
  const listEl = document.getElementById('sightings-wall-list');
  if (!listEl) return;
  listEl.innerHTML = appState.sightings
    .map(
      (item) => `
      <div class="p-3 rounded-xl bg-[#060916] border border-amber-300/25 flex items-center justify-between gap-2">
        <div class="text-xs">
          <span class="font-black text-amber-300">📍 ${item.location}：</span>
          <span class="text-slate-200">${item.content}</span>
        </div>
        <button onclick="likeSighting('${item.id}')" class="px-2.5 py-1 rounded-lg bg-slate-900 border border-amber-300/30 text-[11px] font-mono text-amber-200 shrink-0">
          🙏 +${item.likes}
        </button>
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
  const location = document.getElementById('new-sighting-location')?.value.trim();
  const content = document.getElementById('new-sighting-content')?.value.trim();
  if (!location || !content) return;
  window.soundEngine.playPing();
  appState.sightings.unshift({ id: 's_' + Date.now(), location, content, likes: 1 });
  saveSightingsToStorage();
  renderSightingsList();
  document.getElementById('new-sighting-location').value = '';
  document.getElementById('new-sighting-content').value = '';
};

// Modals
window.openPresidentialAlert = function () {
  window.soundEngine.playSiren();
  document.getElementById('modal-presidential-alert')?.classList.remove('hidden');
};
window.closePresidentialAlert = function () {
  window.soundEngine.playClick(520);
  document.getElementById('modal-presidential-alert')?.classList.add('hidden');
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
  appState.heartRate = Math.min(220, appState.heartRate + 3);
  document.getElementById('copilot-merit-count').textContent = appState.meritCount;
  document.getElementById('copilot-heart-rate').textContent = `${appState.heartRate} BPM`;
  document.getElementById('woodfish-float-zone').innerHTML = `<span class="text-xs font-mono font-bold text-amber-300 animate-bounce">✨ 保命功德 +1</span>`;
};

document.addEventListener('DOMContentLoaded', () => {
  loadPersistedData();
  renderVipStamps();
  renderSquadFriendsList();
  renderSightingsList();
  initRealGoogleMap();
  renderParkingMiniGame();
  requestAnimationFrame(updateParkingGameLoop);
  calculateRouteSafety(false);
  syncUI();

  // Continuous Keyboard Arrow & WASD Support for 3D Costco Parking Simulator!
  window.addEventListener('keydown', (e) => {
    if (appState.activeTab !== 'radar') return;
    if (['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement?.tagName)) return;

    const g = appState.parkingGame;
    if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(e.key)) {
      if (g.active && g.status === 'PLAYING') {
        e.preventDefault();
        if (e.key === 'ArrowLeft') g.keys.left = true;
        if (e.key === 'ArrowRight') g.keys.right = true;
        if (e.key === 'ArrowDown') g.keys.down = true;
        if (e.key === 'ArrowUp') g.keys.up = true;
      }
    }
  });

  window.addEventListener('keyup', (e) => {
    const g = appState.parkingGame;
    if (e.key === 'ArrowLeft') g.keys.left = false;
    if (e.key === 'ArrowRight') g.keys.right = false;
    if (e.key === 'ArrowDown') g.keys.down = false;
    if (e.key === 'ArrowUp') g.keys.up = false;
  });

  setInterval(() => {
    appState.osIndex = (appState.osIndex + 1) % 10;
    syncUI();
  }, 3500);

  const slider = document.getElementById('chaos-slider');
  if (slider) {
    slider.value = appState.chaosIndex;
    slider.addEventListener('input', (e) => {
      appState.chaosIndex = parseInt(e.target.value, 10) || 0;
      updateRealMapOverlays();
      syncUI();
    });
  }

  const muteBtn = document.getElementById('sound-toggle-btn');
  if (muteBtn) {
    muteBtn.addEventListener('click', () => {
      const muted = window.soundEngine.toggleMute();
      muteBtn.innerHTML = muted ? '🔇' : '🔊';
    });
  }
});
