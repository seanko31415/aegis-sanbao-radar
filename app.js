/**
 * 2027 SANBAO // 皇家交響防空星盤 v10.0
 * Real Google Map Radar + Friends Squad Sharing + Precision Costco Reverse Game + Tarot Oracle
 */

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
    cutInSub: '正在沙發追番吃洋芋片！',
    lat: 24.1632,
    lng: 120.6405,
    osList: ['💭「這集動漫超好看，今天不出門～」', '💭「車停哪格？算了明天再找！」']
  },
  snack: {
    id: 'snack',
    badge: 'LV.2',
    level: '🛵 買鹹酥雞',
    levelNum: 2,
    radiusKm: 0.65,
    baseChaos: 45,
    wiperRapid: false,
    leftSignal: true,
    rightSignal: false,
    carTiltDeg: 14,
    color: '#F59E0B',
    cutInTitle: '🛵 宵夜狂想曲',
    cutInSub: '左燈連閃 3.8km・聞香瞬間右切！',
    lat: 24.1788,
    lng: 120.6458,
    osList: ['💭「左燈亮著？先右切買甜不辣！」', '💭「雙腳放地上滑行比較安全～」']
  },
  roundabout: {
    id: 'roundabout',
    badge: 'LV.4',
    level: '🔄 圓環迷航',
    levelNum: 4,
    radiusKm: 1.50,
    baseChaos: 76,
    wiperRapid: true,
    leftSignal: true,
    rightSignal: false,
    carTiltDeg: 28,
    color: '#F97316',
    cutInTitle: '🔄 圓環圓舞曲',
    cutInSub: '打左燈往右偏 + 晴天刷雨刷！',
    lat: 24.1618,
    lng: 120.6469,
    osList: ['💭「救命！圓環怎麼出不去！」', '💭「想轉彎怎麼雨刷又動了！」']
  },
  parking: {
    id: 'parking',
    badge: 'LV.5',
    level: '🅿️ 倒車魔王',
    levelNum: 5,
    radiusKm: 3.00,
    baseChaos: 98,
    wiperRapid: true,
    leftSignal: true,
    rightSignal: true,
    carTiltDeg: -35,
    color: '#F43F5E',
    cutInTitle: '🅿️ 倒車魔王曲',
    cutInSub: 'R/D檔切換第 24 次・後方回堵 1.2km！',
    lat: 24.1896,
    lng: 120.6933,
    osList: ['💭「方向盤往左，車尾怎往右撞？！」', '💭「斜停跨兩格沒人發現吧？」']
  }
};

const REAL_HOTSPOTS = {
  costco: { name: '好市多 B2 (倒車魔王)', lat: 24.1896, lng: 120.6933, color: '#F43F5E' },
  roundabout: { name: '台灣大道圓環 (迷航熱點)', lat: 24.1618, lng: 120.6469, color: '#F59E0B' },
  fengjia: { name: '逢甲夜市 (鬼切窄巷)', lat: 24.1788, lng: 120.6458, color: '#F97316' },
  mrt: { name: '市政府捷運站 (安全區)', lat: 24.1622, lng: 120.6492, color: '#2DD4BF' }
};

const TAROT_CARDS = [
  { name: '🃏 逆位・雨刷之神', desc: '今日轉彎 100% 誤觸雨刷，前擋玻璃比臉還乾淨！' },
  { name: '🃏 正位・莫比烏斯圓環', desc: '一旦進入圓環將強制繞行 5 圈以上，導航姊姊已崩潰！' },
  { name: '🃏 逆位・薛丁格方向燈', desc: '打左燈必往右轉，後車猜中機率 0%！' },
  { name: '🃏 正位・好市多雙格王', desc: '路邊停車耗時 +18 分鐘，建議直接停去頂樓！' }
];

const DEFAULT_SQUAD = [
  { id: 'f1', name: '林小葵 (Aoi)', plate: 'SBO-8888', mode: 'roundabout', lat: 24.1618, lng: 120.6469, sosMsg: '🔄 卡在圓環第 7 圈出不去！' },
  { id: 'f2', name: '陳大明', plate: 'BBB-9999', mode: 'parking', lat: 24.1896, lng: 120.6933, sosMsg: '🅿️ 好市多 B2 倒車中，快逃！' },
  { id: 'f3', name: '張阿豪', plate: 'KKK-6666', mode: 'snack', lat: 24.1788, lng: 120.6458, sosMsg: '🛵 買鹹酥雞，雙腳滑行中' },
  { id: 'f4', name: '王小美', plate: 'AAA-5566', mode: 'home', lat: 24.1510, lng: 120.6410, sosMsg: '🏠 已停好車在家追劇' }
];

const DEFAULT_SIGHTINGS = [
  { id: 's1', location: '北屯好市多 B2', content: '雙格車位嚕了 19 分鐘，大晴天雨刷狂刷 40 下！', likes: 128 },
  { id: 's2', location: '台灣大道圓環', content: '左轉燈連閃 3.8 公里，結果突然右轉進得來速！', likes: 94 }
];

const appState = {
  activeTab: 'radar',
  scenario: 'roundabout',
  chaosIndex: 76,
  clickMode: 'sanbao',
  profile: { name: '林小葵 (Aoi)', plate: 'SBO-8888' },
  sanbaoLatLng: { lat: 24.1618, lng: 120.6469, heading: 45 },
  userLatLng: { lat: 24.1552, lng: 120.6625 },
  osIndex: 0,
  squad: [],
  sightings: [],
  routeForm: { transport: 'scooter' },
  shareStyle: 'defense',
  meritCount: 108,
  heartRate: 138,
  beaconWatchId: null,
  // Upgraded Costco B2 Parking Game State (Clear geometry & overlap %!)
  parkingGame: {
    carX: 72,
    carY: 82,
    carAngle: 0,
    overlapPct: 0,
    status: 'PLAYING' // 'PLAYING' | 'WIN' | 'CRASH'
  }
};

let leafletMap = null;
let tileLayerGroup = null;
let sanbaoMarker = null;
let userMarker = null;
let innerBlastCircle = null;
let outerDeceptionCircle = null;
let tetherPolyline = null;
let ghostTrajectoryLine = null;
let squadMarkers = [];

function loadPersistedData() {
  try {
    const savedSquad = localStorage.getItem('aegis_sanbao_squad_v10');
    appState.squad = savedSquad ? JSON.parse(savedSquad) : [...DEFAULT_SQUAD];
  } catch (e) {
    appState.squad = [...DEFAULT_SQUAD];
  }

  try {
    const savedSightings = localStorage.getItem('aegis_sanbao_sightings_v10');
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
      appState.sanbaoLatLng.lat = parseFloat(params.get('lat'));
      appState.sanbaoLatLng.lng = parseFloat(params.get('lng'));
    }
  } catch (e) {}
}

function saveSquadToStorage() {
  try { localStorage.setItem('aegis_sanbao_squad_v10', JSON.stringify(appState.squad)); } catch (e) {}
}
function saveSightingsToStorage() {
  try { localStorage.setItem('aegis_sanbao_sightings_v10', JSON.stringify(appState.sightings)); } catch (e) {}
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
  if (!banner || !bgSvg || !titleEl || !subEl) return;

  bgSvg.innerHTML = window.getAnimeCutInSVG(color, 'SYMPHONY');
  titleEl.textContent = title;
  subEl.textContent = subtitle;

  banner.classList.remove('hidden', 'animate-cutin');
  void banner.offsetWidth;
  banner.classList.add('animate-cutin');

  if (cutInTimeout) clearTimeout(cutInTimeout);
  cutInTimeout = setTimeout(() => banner.classList.add('hidden'), 2000);
}

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
  const effectiveRadius = +(sc.radiusKm * chaosScale).toFixed(1);

  let survival = 99;
  if (appState.scenario !== 'home') {
    const ratio = distKm / Math.max(0.25, effectiveRadius);
    const raw = Math.min(99, Math.max(2, Math.round(ratio * 52 - appState.chaosIndex * 0.18 + (5 - sc.levelNum) * 8)));
    survival = raw;
  }
  return { distKm: +distKm.toFixed(1), effectiveRadius, survival };
}

// ============================================================================
// REAL GOOGLE MAP ENGINE
// ============================================================================
function initRealGoogleMap() {
  const mapEl = document.getElementById('real-google-map');
  if (!mapEl || typeof L === 'undefined') return;

  leafletMap = L.map('real-google-map', {
    center: [appState.sanbaoLatLng.lat, appState.sanbaoLatLng.lng],
    zoom: 14,
    zoomControl: true
  });

  window.setMapStyle('tactical');

  outerDeceptionCircle = L.circle([appState.sanbaoLatLng.lat, appState.sanbaoLatLng.lng], {
    radius: 1500,
    color: '#FEF08A',
    weight: 2,
    dashArray: '8, 6',
    fillColor: '#F59E0B',
    fillOpacity: 0.06
  }).addTo(leafletMap);

  innerBlastCircle = L.circle([appState.sanbaoLatLng.lat, appState.sanbaoLatLng.lng], {
    radius: 950,
    color: '#F43F5E',
    weight: 2.5,
    fillColor: '#F43F5E',
    fillOpacity: 0.18
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
      showToast('🎯 已移動三寶座標', `${appState.profile.name} 已瞬移至此路段`, 'red');
    } else {
      appState.userLatLng.lat = e.latlng.lat;
      appState.userLatLng.lng = e.latlng.lng;
      showToast('🛡️ 已更新您的位置', '生還率已重算！', 'emerald');
    }
    updateRealMapOverlays();
    syncUI();
  });

  setInterval(() => {
    if (appState.scenario !== 'home' && !appState.beaconWatchId) {
      const step = (appState.chaosIndex / 100) * 0.00032;
      appState.sanbaoLatLng.heading += (Math.random() - 0.45) * 55;
      const rad = (appState.sanbaoLatLng.heading * Math.PI) / 180;
      appState.sanbaoLatLng.lat += Math.sin(rad) * step;
      appState.sanbaoLatLng.lng += Math.cos(rad) * step;
      updateRealMapOverlays();
      syncUI();
    }
  }, 900);

  updateRealMapOverlays();
}

function refreshMainMarkers() {
  if (!leafletMap) return;
  if (sanbaoMarker) leafletMap.removeLayer(sanbaoMarker);
  if (userMarker) leafletMap.removeLayer(userMarker);

  const sanbaoIcon = L.divIcon({
    className: 'custom-sanbao-marker',
    html: `
      <div class="relative flex items-center justify-center" style="width:56px;height:56px;">
        <div class="absolute inset-0 rounded-full bg-amber-400/50 marker-pulse"></div>
        <img src="assets/royal_conductor.jpg" class="w-12 h-12 rounded-full object-cover border-2 border-amber-300 shadow-[0_0_18px_#D4AF37] relative z-10" />
        <div class="absolute -bottom-5 whitespace-nowrap px-2 py-0.5 rounded-full bg-[#070B19]/95 border border-amber-300 text-[10px] font-mono font-black text-amber-200 shadow z-20">
          ✦ ${appState.profile.name}
        </div>
      </div>`,
    iconSize: [56, 56],
    iconAnchor: [28, 28]
  });

  const userIcon = L.divIcon({
    className: 'custom-user-marker',
    html: `
      <div class="relative flex items-center justify-center" style="width:40px;height:40px;">
        <div class="w-8 h-8 rounded-full bg-teal-400 border-2 border-white flex items-center justify-center text-sm shadow-[0_0_15px_#2DD4BF]">🛡️</div>
        <div class="absolute -bottom-5 whitespace-nowrap px-1.5 py-0.5 rounded bg-[#070B19]/95 border border-teal-300 text-[10px] font-bold text-teal-200 shadow">我</div>
      </div>`,
    iconSize: [40, 40],
    iconAnchor: [20, 20]
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
      radius: 7,
      color: '#FEF08A',
      fillColor: sc.color,
      fillOpacity: 0.9,
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

  const innerMeters = Math.max(80, metrics.effectiveRadius * 650);
  innerBlastCircle.setLatLng(sPos);
  innerBlastCircle.setRadius(innerMeters);
  innerBlastCircle.setStyle({ color: sc.color, fillColor: sc.color });

  outerDeceptionCircle.setLatLng(sPos);
  outerDeceptionCircle.setRadius(innerMeters * 1.5);

  tetherPolyline.setLatLngs([sPos, uPos]);

  const rad = (appState.sanbaoLatLng.heading * Math.PI) / 180;
  const p1 = [sPos[0] + Math.sin(rad + 0.5) * 0.004, sPos[1] + Math.cos(rad + 0.5) * 0.004];
  const p2 = [p1[0] + Math.sin(rad - 0.8) * 0.004, p1[1] + Math.cos(rad - 0.8) * 0.004];
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
          ? 'px-3 py-1 rounded-xl text-[11px] font-black bg-gradient-to-r from-amber-300 to-amber-500 text-slate-950'
          : 'px-3 py-1 rounded-xl text-[11px] font-bold bg-slate-900/90 text-amber-100 border border-amber-300/30';
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
  leafletMap.flyTo([spot.lat, spot.lng], 15, { duration: 0.8 });
  updateRealMapOverlays();
  syncUI();
};

window.useRealBrowserGPS = function () {
  if (!navigator.geolocation) return;
  window.soundEngine.playPing();
  showToast('📍 抓取真實定位中...', '請允許瀏覽器位置權限', 'cyan');
  navigator.geolocation.getCurrentPosition((pos) => {
    const { latitude, longitude } = pos.coords;
    appState.userLatLng.lat = latitude;
    appState.userLatLng.lng = longitude;
    appState.sanbaoLatLng.lat = latitude + 0.004;
    appState.sanbaoLatLng.lng = longitude + 0.004;
    if (leafletMap) leafletMap.flyTo([latitude, longitude], 15, { duration: 0.9 });
    updateRealMapOverlays();
    syncUI();
    showToast('✅ 定位成功！', '驚！三寶就在您附近 500 公尺徘徊！', 'red');
  });
};

// ============================================================================
// EXTRA INTERACTIVE COCKPIT PRANKS & TAROT DRAW
// ============================================================================
window.triggerCockpitAction = function (type) {
  if (type === 'horn') {
    window.soundEngine.playHorn();
    triggerAnimeCutIn('📯 驚慌連按喇叭！', '想按雨刷怎麼按到喇叭了啦！', '#F43F5E');
    showToast('📯 叭叭——！！', `${appState.profile.name} 被路邊小狗嚇到狂按喇叭！`, 'red');
  } else if (type === 'rgear') {
    window.soundEngine.playRadarBeep();
    triggerAnimeCutIn('🔊 倒車雷達破音！', '嗶嗶嗶嗶——離柱子只剩 3 公分！', '#2DD4BF');
    showToast('🔊 倒車雷達長鳴！', '後方車主已經嚇到棄車逃跑了！', 'amber');
  }
};

window.drawRandomTarotCard = function () {
  window.soundEngine.playPing();
  const card = TAROT_CARDS[Math.floor(Math.random() * TAROT_CARDS.length)];
  triggerAnimeCutIn(card.name, card.desc, '#FEF08A');
  showToast(card.name, card.desc, 'amber');
};

// ============================================================================
// RE-ENGINEERED COSTCO B2 PARKING GAME (Crystal Clear Bay, Guide Line & %!)
// ============================================================================
const PARKING_BAY = { x: 222, y: 42, w: 92, h: 80 };
const PILLARS = [
  { x: 204, y: 18, r: 9 },
  { x: 204, y: 146, r: 9 }
];

function computeParkingState(g) {
  // Check pillar collision
  for (const p of PILLARS) {
    const dist = Math.hypot(g.carX - p.x, g.carY - p.y);
    if (dist < p.r + 17) {
      return { status: 'CRASH', pct: 0, msg: '💥 撞上好市多紅柱了！(點任意鍵重試)' };
    }
  }
  // Check wall bounds
  if (g.carX < 24 || g.carX > 322 || g.carY < 20 || g.carY > 145) {
    return { status: 'CRASH', pct: 0, msg: '💥 擦撞地下室牆壁！(點任意鍵重試)' };
  }

  // Calculate how close car center is to bay center (268, 82)
  const bayCx = PARKING_BAY.x + PARKING_BAY.w / 2;
  const bayCy = PARKING_BAY.y + PARKING_BAY.h / 2;
  const distToCenter = Math.hypot(g.carX - bayCx, g.carY - bayCy);
  const rawPct = Math.max(0, Math.min(100, Math.round((1 - distToCenter / 185) * 115)));

  // Win condition: Car center inside bay inner region & reasonably straight
  const insideBay =
    g.carX >= PARKING_BAY.x + 22 &&
    g.carX <= PARKING_BAY.x + PARKING_BAY.w - 22 &&
    g.carY >= PARKING_BAY.y + 16 &&
    g.carY <= PARKING_BAY.y + PARKING_BAY.h - 16;

  if (insideBay) {
    return { status: 'WIN', pct: 100, msg: '🏆 完美停進 B2 金色車格！(點任意鍵再玩)' };
  }
  return {
    status: 'PLAYING',
    pct: rawPct,
    msg: `💡 方向盤左右相反・請按【⏪ 倒車】停進右側金框`
  };
}

window.startParkingMiniGame = function () {
  window.soundEngine.playPing();
  appState.parkingGame = {
    carX: 72,
    carY: 82,
    carAngle: 0,
    overlapPct: 12,
    status: 'PLAYING'
  };
  renderParkingMiniGame();
};

window.steerParkingCar = function (cmd) {
  const g = appState.parkingGame;
  if (g.status !== 'PLAYING') {
    window.startParkingMiniGame();
    return;
  }

  window.soundEngine.playClick(660);
  // Inverted steering!
  if (cmd === 'LEFT') g.carAngle += 18;
  if (cmd === 'RIGHT') g.carAngle -= 18;
  if (cmd === 'REV') {
    const rad = (g.carAngle * Math.PI) / 180;
    g.carX += Math.cos(rad) * 22;
    g.carY += Math.sin(rad) * 22;
  }
  if (cmd === 'FWD') {
    const rad = (g.carAngle * Math.PI) / 180;
    g.carX -= Math.cos(rad) * 18;
    g.carY -= Math.sin(rad) * 18;
  }

  const res = computeParkingState(g);
  g.status = res.status;
  g.overlapPct = res.pct;

  if (res.status === 'WIN') {
    window.soundEngine.playPing();
    triggerAnimeCutIn('🏆 奇蹟入庫成功！', '雖然刷了 20 下雨刷，但成功停進好市多車位了！', '#2DD4BF');
    showToast('🏆 入庫率 100%！', '恭喜通過好市多 B2 倒車考驗！', 'emerald');
  } else if (res.status === 'CRASH') {
    window.soundEngine.playWiperSlap();
    showToast('💥 擦撞警報！', res.msg, 'red');
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
  const res = computeParkingState(g);

  const badge = document.getElementById('parking-progress-badge');
  if (badge) {
    badge.textContent = `入庫率 ${res.pct}%`;
    badge.className =
      res.status === 'WIN'
        ? 'px-2 py-0.5 rounded-full bg-teal-400 text-slate-950 font-mono text-[10px] font-black'
        : 'px-2 py-0.5 rounded-full bg-amber-400/20 border border-amber-300/40 font-mono text-[10px] font-black text-amber-300';
  }

  // 1. Deep Royal Garage Floor
  ctx.fillStyle = '#060916';
  ctx.fillRect(0, 0, w, h);

  // Subtle lane markings
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
  ctx.lineWidth = 1;
  for (let x = 0; x < w; x += 28) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, h);
    ctx.stroke();
  }

  // 2. Target Golden Parking Bay (Clearly highlighted with glowing fill)
  ctx.save();
  ctx.fillStyle = res.status === 'WIN' ? 'rgba(45, 212, 191, 0.22)' : 'rgba(254, 240, 138, 0.10)';
  ctx.fillRect(PARKING_BAY.x, PARKING_BAY.y, PARKING_BAY.w, PARKING_BAY.h);

  ctx.strokeStyle = res.status === 'WIN' ? '#2DD4BF' : '#FEF08A';
  ctx.lineWidth = 2.5;
  ctx.strokeRect(PARKING_BAY.x, PARKING_BAY.y, PARKING_BAY.w, PARKING_BAY.h);

  ctx.font = '900 11px "JetBrains Mono", monospace';
  ctx.fillStyle = res.status === 'WIN' ? '#2DD4BF' : '#FEF08A';
  ctx.textAlign = 'center';
  ctx.fillText('🅿️ VIP B2-88', PARKING_BAY.x + PARKING_BAY.w / 2, PARKING_BAY.y + PARKING_BAY.h / 2 + 4);
  ctx.restore();

  // 3. Dashed Reversing Trajectory Guide Line from Car Rear to Bay
  if (g.status === 'PLAYING') {
    ctx.save();
    ctx.setLineDash([4, 4]);
    ctx.strokeStyle = 'rgba(45, 212, 191, 0.55)';
    ctx.lineWidth = 1.5;
    const rad = (g.carAngle * Math.PI) / 180;
    ctx.beginPath();
    ctx.moveTo(g.carX, g.carY);
    ctx.lineTo(g.carX + Math.cos(rad) * 85, g.carY + Math.sin(rad) * 85);
    ctx.stroke();
    ctx.restore();
  }

  // 4. Red Concrete Pillars (With clear circular boundary)
  PILLARS.forEach((p) => {
    ctx.save();
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fillStyle = '#F43F5E';
    ctx.fill();
    ctx.lineWidth = 2;
    ctx.strokeStyle = '#FECDD3';
    ctx.stroke();
    ctx.restore();
  });

  // 5. Top-Down SUV with Clear Front Headlights & Rear Red Taillights
  ctx.save();
  ctx.translate(g.carX, g.carY);
  ctx.rotate((g.carAngle * Math.PI) / 180);

  // Car body (-22 to +22, where +X is REAR for reversing into right bay, -X is FRONT)
  ctx.fillStyle = g.status === 'CRASH' ? '#F43F5E' : g.status === 'WIN' ? '#2DD4BF' : '#3B82F6';
  ctx.beginPath();
  ctx.roundRect(-22, -13, 44, 26, 6);
  ctx.fill();
  ctx.lineWidth = 1.8;
  ctx.strokeStyle = '#FEF08A';
  ctx.stroke();

  // Roof & Windshield (Left side is Front, Right side is Rear)
  ctx.fillStyle = '#0F172A';
  ctx.fillRect(-12, -9, 22, 18);

  // Rear Red Reverse Lights (Right side +X facing the parking bay!)
  ctx.fillStyle = '#EF4444';
  ctx.fillRect(19, -11, 3, 6);
  ctx.fillRect(19, 5, 3, 6);

  // Front Golden Headlights (Left side -X)
  ctx.fillStyle = '#FEF08A';
  ctx.fillRect(-22, -10, 3, 5);
  ctx.fillRect(-22, 5, 3, 5);

  ctx.font = '700 8px "JetBrains Mono", monospace';
  ctx.fillStyle = '#FEF08A';
  ctx.textAlign = 'center';
  ctx.fillText('R➔', 0, 3);
  ctx.restore();

  // 6. Bottom Status Tip
  ctx.font = '700 10px "Noto Sans TC", sans-serif';
  ctx.fillStyle = res.status === 'CRASH' ? '#FDA4AF' : res.status === 'WIN' ? '#5EEAD4' : '#FDE68A';
  ctx.fillText(res.msg, 10, 156);
}

// ============================================================================
// TAB 2: 🚗 好友出車共享
// ============================================================================
function renderSquadFriendsList() {
  const container = document.getElementById('squad-friends-list');
  if (!container) return;

  container.innerHTML = appState.squad
    .map((f) => {
      const sc = SCENARIOS[f.mode] || SCENARIOS.snack;
      const isSelected = f.name === appState.profile.name;
      return `
      <div onclick="focusSquadFriend('${f.id}')" class="cursor-pointer tarot-btn p-3.5 ${
        isSelected ? 'ring-2 ring-amber-300' : ''
      } flex flex-col justify-between gap-2">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2">
            <span class="w-2.5 h-2.5 rounded-full" style="background:${sc.color}"></span>
            <span class="font-black text-sm text-white">${f.name}</span>
            <span class="px-1.5 py-0.5 rounded bg-[#060916] border border-amber-300/30 font-mono text-[10px] text-amber-300 font-bold">${f.plate}</span>
          </div>
          <span class="px-2 py-0.5 rounded-full text-[10px] font-mono font-black text-slate-950" style="background:${sc.color}">
            ${sc.level}
          </span>
        </div>
        <div class="text-xs text-amber-100 font-bold truncate">${f.sosMsg}</div>
        <div class="flex items-center justify-between text-[11px] pt-1 border-t border-amber-300/15">
          <span class="text-slate-400">📍 點擊在星盤鎖定他</span>
          <span class="text-amber-300 font-bold">查看 ➔</span>
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
  appState.scenario = friend.mode;
  appState.chaosIndex = SCENARIOS[friend.mode].baseChaos;
  appState.sanbaoLatLng.lat = friend.lat;
  appState.sanbaoLatLng.lng = friend.lng;

  refreshMainMarkers();
  renderSquadMapMarkers();
  updateRealMapOverlays();
  renderSquadFriendsList();
  syncUI();

  window.switchTab('radar');
  if (leafletMap) leafletMap.flyTo([friend.lat, friend.lng], 15, { duration: 0.8 });
  triggerAnimeCutIn(`✦ 已鎖定：${friend.name}`, friend.sosMsg, SCENARIOS[friend.mode].color);
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
    showToast('⚠️ 請輸入好友名字', '輸入後即可加入星盤車隊！', 'red');
    return;
  }

  window.soundEngine.playPing();
  const sc = SCENARIOS[mode];
  appState.squad.unshift({
    id: 'f_' + Date.now(),
    name,
    plate,
    mode,
    lat: sc.lat + (Math.random() - 0.5) * 0.012,
    lng: sc.lng + (Math.random() - 0.5) * 0.012,
    sosMsg: sc.osList[0].replace('💭', '')
  });
  saveSquadToStorage();
  renderSquadFriendsList();
  renderSquadMapMarkers();

  nameEl.value = '';
  plateEl.value = '';
  showToast('➕ 好友已加入星盤！', `點擊【${name}】卡片即可在地圖追蹤他！`, 'emerald');
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
        refreshMainMarkers();
        updateRealMapOverlays();
        syncUI();
      },
      () => {},
      { enableHighAccuracy: true }
    );
  }
  showToast('🚗 出車定位已開啟！', `正在星盤上即時廣播【${myName}】的位置！`, 'red');
};

window.shareMyDrivingLink = function () {
  window.soundEngine.playClick(880);
  const myName = document.getElementById('my-driver-name')?.value.trim() || appState.profile.name;
  const myPlate = document.getElementById('my-driver-plate')?.value.trim().toUpperCase() || appState.profile.plate;
  const { lat, lng } = appState.sanbaoLatLng;
  const url = `https://seanko31415.github.io/aegis-sanbao-radar/?name=${encodeURIComponent(myName)}&plate=${encodeURIComponent(myPlate)}&mode=${appState.scenario}&lat=${lat.toFixed(4)}&lng=${lng.toFixed(4)}`;
  const msg = `🚨【三寶出車通知】${myName} (${myPlate}) 剛剛開車上路了！\n點開看他的即時防空雷達位置，快避開：\n${url}`;
  navigator.clipboard?.writeText(msg).then(() => {
    showToast('📲 已複製出車連結！', '快貼到 LINE 群組叫朋友閃開！', 'emerald');
  });
};

// ============================================================================
// UI SYNC & TABS
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
    ? '☀️ 晴天雨刷 MAX'
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
  if (leafletMap) leafletMap.flyTo([sc.lat, sc.lng], 15, { duration: 0.8 });

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
    if (section) section.classList.toggle('hidden', id !== tabId);
    if (btn) {
      btn.className =
        id === tabId
          ? 'px-4 py-1.5 rounded-xl font-black text-xs flex items-center gap-1.5 bg-gradient-to-r from-amber-300 via-yellow-400 to-amber-500 text-slate-950 shadow-[0_0_18px_rgba(251,191,36,0.5)] transition-all'
          : 'px-4 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 text-amber-100/75 hover:text-white transition-all';
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
  if (omenEl) { omenEl.textContent = omen; omenEl.style.color = color; }
  if (probEl) { probEl.textContent = `${prob.toFixed(1)}% 正面遭遇`; }
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
  const shareUrl = `https://seanko31415.github.io/aegis-sanbao-radar/?name=${encodeURIComponent(name)}&plate=${encodeURIComponent(plate)}&mode=${appState.scenario}`;

  if (appState.shareStyle === 'defense') {
    box.value = `🚨【三寶出車警報】「${name}」(${plate}) 已握住方向盤！目前【${sc.level}】暴風圈 ${metrics.effectiveRadius}km！\n📡 即時定位：${shareUrl}`;
  } else if (appState.shareStyle === 'elder') {
    box.value = `🌸平安喜樂🌸 好友【${name}】開車出門囉 (${plate}) 🚗 看到他晴天刷雨刷代表想轉彎，方圓 ${metrics.effectiveRadius}km 請多禮讓🙏\n📡 定位：${shareUrl}`;
  } else {
    box.value = `📺【快訊】用路傳奇「${name}」(${plate}) 現蹤街頭！左轉燈連閃 3.8km + 晴天雨刷全開，請保持 3 個紅綠燈車距！\n📡 雷達：${shareUrl}`;
  }
}

window.copyShareText = function () {
  window.soundEngine.playClick(920);
  const box = document.getElementById('share-copy-textarea');
  if (!box) return;
  navigator.clipboard?.writeText(box.value).then(() => {
    showToast('📋 已複製警報！', '快貼到 LINE 群組拯救好友！', 'emerald');
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
    { label: '停車耗時', val: 95 },
    { label: '方向燈誠信', val: 12 },
    { label: '方向感', val: 15 },
    { label: '副駕驚嚇', val: 96 }
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
  appState.heartRate = Math.min(210, appState.heartRate + 3);
  document.getElementById('copilot-merit-count').textContent = appState.meritCount;
  document.getElementById('copilot-heart-rate').textContent = `${appState.heartRate} BPM`;
  document.getElementById('woodfish-float-zone').innerHTML = `<span class="text-xs font-mono font-bold text-amber-300 animate-bounce">✨ 星光功德 +1</span>`;
};

document.addEventListener('DOMContentLoaded', () => {
  loadPersistedData();
  renderSquadFriendsList();
  renderSightingsList();
  initRealGoogleMap();
  renderParkingMiniGame();
  calculateRouteSafety(false);
  syncUI();

  // Keyboard Arrow Support for Costco Parking Game!
  window.addEventListener('keydown', (e) => {
    if (appState.activeTab !== 'radar') return;
    if (['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement?.tagName)) return;
    if (e.key === 'ArrowLeft') { e.preventDefault(); window.steerParkingCar('LEFT'); }
    if (e.key === 'ArrowRight') { e.preventDefault(); window.steerParkingCar('RIGHT'); }
    if (e.key === 'ArrowDown') { e.preventDefault(); window.steerParkingCar('REV'); }
    if (e.key === 'ArrowUp') { e.preventDefault(); window.steerParkingCar('FWD'); }
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
