/**
 * AEGIS SANBAO // 三寶防空雷達 v6.0 (真實 Google Map × OBD-II 寄生追蹤盒版)
 * Real Leaflet + Google Maps Tile Engine, Hardware IoT Simulator & Live Mobile GPS Beacon
 */

const SCENARIOS = {
  home: {
    id: 'home',
    badge: 'DEFCON 5',
    level: 'LV.0 居家封印',
    levelNum: 0,
    radiusKm: 0.08,
    baseChaos: 8,
    speedKmh: 0,
    brakeGasConfusion: 2,
    navRerouteCount: 0,
    wiperRapid: false,
    leftSignal: false,
    rightSignal: false,
    carTiltDeg: 0,
    color: '#10B981',
    panelClass: 'anime-box',
    bannerImg: 'assets/nerv_commander_banner.jpg',
    cgCaption: '基地封印・全城和平',
    cutInTitle: 'SEALED // 居家封印',
    cutInSub: '目標正在沙發追番吃洋芋片！',
    ticker: '車鑰匙掛在玄關・方圓 80m 解除警報',
    lat: 24.1632,
    lng: 120.6405,
    osList: [
      '💭「這集動漫超好看，今天不出門了～」',
      '💭「車停哪一格？算了明天再找！」'
    ]
  },
  snack: {
    id: 'snack',
    badge: 'DEFCON 3',
    level: 'LV.2 買鹹酥雞',
    levelNum: 2,
    radiusKm: 0.65,
    baseChaos: 45,
    speedKmh: 23,
    brakeGasConfusion: 38,
    navRerouteCount: 9,
    wiperRapid: false,
    leftSignal: true,
    rightSignal: false,
    carTiltDeg: 14,
    color: '#F59E0B',
    panelClass: 'anime-box',
    bannerImg: 'assets/nerv_commander_banner.jpg',
    cgCaption: '雙腳滑行・聞香鬼切',
    cutInTitle: 'SNACK DRIFT // 宵夜鬼切',
    cutInSub: '聞到鹽酥雞瞬間右切・左燈連閃 3.8km！',
    ticker: '雙腳懸空滑行中・聞到九層塔隨時 90 度急切',
    lat: 24.1788,
    lng: 120.6458,
    osList: [
      '💭「左燈亮著？管他的先右切買甜不辣！」',
      '💭「雙腳放地上滑行比較有安全感耶～」'
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
    brakeGasConfusion: 68,
    navRerouteCount: 34,
    wiperRapid: true,
    leftSignal: true,
    rightSignal: false,
    carTiltDeg: 28,
    color: '#F97316',
    panelClass: 'anime-box anime-box-danger',
    bannerImg: 'assets/scenario_roundabout.jpg',
    cgCaption: '圓環莫比烏斯迷航',
    cutInTitle: 'MOBIUS LOOP // 圓環迷航',
    cutInSub: '打左燈往右偏 + 晴天雨刷全速乾刷！',
    ticker: '圓環繞行第 7 圈・左燈狂閃卻持續向右漂移',
    lat: 24.1618,
    lng: 120.6469,
    osList: [
      '💭「救命！圓環怎麼出不去！看到超商四次了！」',
      '💭「想打右轉燈怎麼雨刷又自己動起來了！」'
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
    brakeGasConfusion: 94,
    navRerouteCount: 99,
    wiperRapid: true,
    leftSignal: true,
    rightSignal: true,
    carTiltDeg: -35,
    color: '#EF4444',
    panelClass: 'anime-box anime-box-danger',
    bannerImg: 'assets/scenario_parking.jpg',
    cgCaption: 'B2 倒車入庫大魔王',
    cutInTitle: 'FINAL BOSS // 倒車魔王',
    cutInSub: 'R/D檔切換第 24 次・後方回堵 1.2km！',
    ticker: '好市多 B2 倒車入庫中・鄰車車主已棄車逃亡',
    lat: 24.1896,
    lng: 120.6933,
    osList: [
      '💭「方向盤往左轉，車屁股怎往右邊柱子撞？！」',
      '💭「嗶嗶嗶——倒車雷達吵死了能關掉嗎？！」'
    ]
  }
};

const REAL_HOTSPOTS = {
  costco: { name: '北屯好市多 B2 (倒車魔王關)', lat: 24.1896, lng: 120.6933, color: '#EF4444' },
  roundabout: { name: '台灣大道 × 文心路口 (迷航熱點)', lat: 24.1618, lng: 120.6469, color: '#F59E0B' },
  fengjia: { name: '逢甲夜市窄巷 (買宵夜鬼切區)', lat: 24.1788, lng: 120.6458, color: '#F97316' },
  mrt: { name: '市政府高架捷運站 (絕對安全區)', lat: 24.1622, lng: 120.6492, color: '#10B981' }
};

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
  }
];

const appState = {
  activeTab: 'radar',
  scenario: 'roundabout',
  chaosIndex: 76,
  clickMode: 'sanbao',
  profile: {
    name: '林小葵 (Aoi)',
    title: '晴天雨刷宗師',
    plate: 'SBO-8888'
  },
  // Real-world GPS coordinates (Taichung City Center default)
  sanbaoLatLng: { lat: 24.1618, lng: 120.6469, heading: 45 },
  userLatLng: { lat: 24.1552, lng: 120.6625 },
  osIndex: 0,
  sightings: [],
  sightingFilter: 'ALL',
  routeForm: { origin: '西屯・市政中心', dest: '北屯好市多 B2 停車場', transport: 'scooter' },
  shareStyle: 'defense',
  meritCount: 108,
  heartRate: 138,
  beaconWatchId: null,
  parkingGame: { active: false, carX: 70, carY: 68, carAngle: 0, status: 'PLAYING' }
};

// Leaflet Map Instances
let leafletMap = null;
let tileLayerGroup = null;
let sanbaoMarker = null;
let userMarker = null;
let innerBlastCircle = null;
let outerDeceptionCircle = null;
let tetherPolyline = null;
let ghostTrajectoryLine = null;

function loadPersistedData() {
  try {
    const savedProfile = localStorage.getItem('aegis_sanbao_profile_v6');
    if (savedProfile) appState.profile = { ...appState.profile, ...JSON.parse(savedProfile) };
  } catch (e) {}

  try {
    const savedSightings = localStorage.getItem('aegis_sanbao_sightings_v6');
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
  } catch (e) {}
}

function saveProfileToStorage() {
  try { localStorage.setItem('aegis_sanbao_profile_v6', JSON.stringify(appState.profile)); } catch (e) {}
}
function saveSightingsToStorage() {
  try { localStorage.setItem('aegis_sanbao_sightings_v6', JSON.stringify(appState.sightings)); } catch (e) {}
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
    setTimeout(() => toast.remove(), 260);
  }, 2600);
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
  cutInTimeout = setTimeout(() => banner.classList.add('hidden'), 2100);
}

// Haversine Distance in km between two real GPS coordinates
function calcGpsDistanceKm(lat1, lng1, lat2, lng2) {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLng / 2) * Math.sin(dLng / 2);
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

  let survival = 99.9;
  if (appState.scenario !== 'home') {
    const ratio = distKm / Math.max(0.25, effectiveRadius);
    const raw = Math.min(99.5, Math.max(1.2, ratio * 52 - appState.chaosIndex * 0.18 + (5 - sc.levelNum) * 8));
    survival = +raw.toFixed(1);
  }
  return { distKm: +distKm.toFixed(2), effectiveRadius, survival };
}

// ============================================================================
// REAL GOOGLE MAPS + LEAFLET TACTICAL RADAR ENGINE
// ============================================================================
function initRealGoogleMap() {
  const mapEl = document.getElementById('real-google-map');
  if (!mapEl || typeof L === 'undefined') return;

  leafletMap = L.map('real-google-map', {
    center: [appState.sanbaoLatLng.lat, appState.sanbaoLatLng.lng],
    zoom: 14,
    zoomControl: true
  });

  // Default to Dark Tactical Google Maps Tile Layer
  window.setMapStyle('tactical');

  // Add High-Risk Hotspot Pins
  Object.values(REAL_HOTSPOTS).forEach((spot) => {
    L.circleMarker([spot.lat, spot.lng], {
      radius: 7,
      color: spot.color,
      fillColor: spot.color,
      fillOpacity: 0.85,
      weight: 2
    })
      .addTo(leafletMap)
      .bindTooltip(`<b>${spot.name}</b>`, { direction: 'top', offset: [0, -6] });
  });

  // Outer Amber Turn-Signal Deception Circle
  outerDeceptionCircle = L.circle([appState.sanbaoLatLng.lat, appState.sanbaoLatLng.lng], {
    radius: 1500,
    color: '#F59E0B',
    weight: 2,
    dashArray: '8, 6',
    fillColor: '#F59E0B',
    fillOpacity: 0.06
  }).addTo(leafletMap);

  // Inner Crimson Danger Circle
  innerBlastCircle = L.circle([appState.sanbaoLatLng.lat, appState.sanbaoLatLng.lng], {
    radius: 950,
    color: '#EF4444',
    weight: 2.5,
    fillColor: '#EF4444',
    fillOpacity: 0.18
  }).addTo(leafletMap);

  // Schrödinger's Ghost Trajectory Line
  ghostTrajectoryLine = L.polyline([], {
    color: '#EF4444',
    weight: 3,
    dashArray: '6, 6'
  }).addTo(leafletMap);

  // Tether Line between Sanbao & User
  tetherPolyline = L.polyline([], {
    color: '#06B6D4',
    weight: 2,
    dashArray: '4, 6'
  }).addTo(leafletMap);

  // Custom Anime Avatar Marker for Sanbao
  const createSanbaoIcon = () =>
    L.divIcon({
      className: 'custom-sanbao-marker',
      html: `
        <div class="relative flex items-center justify-center" style="width:54px;height:54px;">
          <div class="absolute inset-0 rounded-full bg-red-500/50 marker-pulse"></div>
          <img src="assets/sanbao_avatar.jpg" class="w-11 h-11 rounded-full object-cover border-2 border-amber-400 shadow-[0_0_15px_#EF4444] relative z-10" />
          <div class="absolute -bottom-5 whitespace-nowrap px-2 py-0.5 rounded bg-slate-950/95 border border-red-500 text-[10px] font-mono font-black text-white shadow z-20">
            🎯 ${appState.profile.name} (${appState.profile.plate})
          </div>
        </div>
      `,
      iconSize: [54, 54],
      iconAnchor: [27, 27]
    });

  const createUserIcon = () =>
    L.divIcon({
      className: 'custom-user-marker',
      html: `
        <div class="relative flex items-center justify-center" style="width:40px;height:40px;">
          <div class="w-8 h-8 rounded-full bg-cyan-500 border-2 border-white flex items-center justify-center text-sm shadow-[0_0_15px_#06B6D4]">
            🛡️
          </div>
          <div class="absolute -bottom-5 whitespace-nowrap px-1.5 py-0.5 rounded bg-slate-950/95 border border-cyan-400 text-[10px] font-bold text-cyan-300 shadow">
            您的位置
          </div>
        </div>
      `,
      iconSize: [40, 40],
      iconAnchor: [20, 20]
    });

  sanbaoMarker = L.marker([appState.sanbaoLatLng.lat, appState.sanbaoLatLng.lng], {
    icon: createSanbaoIcon(),
    zIndexOffset: 1000
  }).addTo(leafletMap);

  userMarker = L.marker([appState.userLatLng.lat, appState.userLatLng.lng], {
    icon: createUserIcon(),
    zIndexOffset: 900
  }).addTo(leafletMap);

  // Click on Real Map to Teleport Sanbao or User
  leafletMap.on('click', (e) => {
    window.soundEngine.playPing();
    if (appState.clickMode === 'sanbao') {
      appState.sanbaoLatLng.lat = e.latlng.lat;
      appState.sanbaoLatLng.lng = e.latlng.lng;
      showToast('🎯 三寶座標已移至此路段', `GPS: ${e.latlng.lat.toFixed(4)}, ${e.latlng.lng.toFixed(4)}`, 'red');
    } else {
      appState.userLatLng.lat = e.latlng.lat;
      appState.userLatLng.lng = e.latlng.lng;
      showToast('🛡️ 您的位置已更新', '已重新計算距離與生還率！', 'cyan');
    }
    updateRealMapOverlays();
    syncUI();
  });

  // Live Roaming Loop on Real Streets
  setInterval(() => {
    if (appState.scenario !== 'home' && !appState.beaconWatchId) {
      const step = (appState.chaosIndex / 100) * 0.00035;
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

function updateRealMapOverlays() {
  if (!leafletMap || !sanbaoMarker) return;
  const sc = SCENARIOS[appState.scenario];
  const metrics = computeTacticalMetrics();
  const sPos = [appState.sanbaoLatLng.lat, appState.sanbaoLatLng.lng];
  const uPos = [appState.userLatLng.lat, appState.userLatLng.lng];

  sanbaoMarker.setLatLng(sPos);
  userMarker.setLatLng(uPos);

  const innerMeters = Math.max(80, metrics.effectiveRadius * 650);
  const outerMeters = innerMeters * 1.5;

  innerBlastCircle.setLatLng(sPos);
  innerBlastCircle.setRadius(innerMeters);
  innerBlastCircle.setStyle({ color: sc.color, fillColor: sc.color });

  outerDeceptionCircle.setLatLng(sPos);
  outerDeceptionCircle.setRadius(outerMeters);

  tetherPolyline.setLatLngs([sPos, uPos]);

  // Ghost trajectory line
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
          ? 'px-2.5 py-1 rounded-lg text-[11px] font-black bg-amber-500 text-slate-950'
          : 'px-2.5 py-1 rounded-lg text-[11px] font-bold bg-slate-900 text-slate-300 border border-white/10';
    }
  });

  if (style === 'satellite') {
    // Real Google Hybrid Satellite & Roads
    tileLayerGroup = L.tileLayer('https://mt1.google.com/vt/lyrs=y&hl=zh-TW&x={x}&y={y}&z={z}', {
      maxZoom: 20,
      attribution: 'Google Maps Satellite'
    }).addTo(leafletMap);
  } else if (style === 'streets') {
    // Real Google Standard Streets
    tileLayerGroup = L.tileLayer('https://mt1.google.com/vt/lyrs=m&hl=zh-TW&x={x}&y={y}&z={z}', {
      maxZoom: 20,
      attribution: 'Google Maps'
    }).addTo(leafletMap);
  } else {
    // Anime Dark Tactical Filtered Google Streets
    tileLayerGroup = L.tileLayer('https://mt1.google.com/vt/lyrs=m&hl=zh-TW&x={x}&y={y}&z={z}', {
      maxZoom: 20,
      className: 'tactical-gmap-tiles',
      attribution: 'Google Maps // AEGIS Tactical Filter'
    }).addTo(leafletMap);
  }
};

window.flyToHotspot = function (key) {
  const spot = REAL_HOTSPOTS[key];
  if (!spot || !leafletMap) return;
  window.soundEngine.playPing();
  appState.sanbaoLatLng.lat = spot.lat;
  appState.sanbaoLatLng.lng = spot.lng;
  leafletMap.flyTo([spot.lat, spot.lng], 15, { duration: 0.9 });
  updateRealMapOverlays();
  syncUI();
  showToast('🛰️ 衛星鏡頭已切換', `已鎖定【${spot.name}】`, 'amber');
};

window.useRealBrowserGPS = function () {
  if (!navigator.geolocation) {
    showToast('⚠️ 瀏覽器不支援定位', '請允許瀏覽器讀取您的 GPS 位置', 'red');
    return;
  }
  window.soundEngine.playPing();
  showToast('📍 正在抓取您的真實 GPS...', '請在瀏覽器彈窗點選「允許」', 'cyan');

  navigator.geolocation.getCurrentPosition(
    (pos) => {
      const { latitude, longitude } = pos.coords;
      appState.userLatLng.lat = latitude;
      appState.userLatLng.lng = longitude;
      // Also bring Sanbao 800m nearby so user sees them in their own neighborhood!
      appState.sanbaoLatLng.lat = latitude + 0.0045;
      appState.sanbaoLatLng.lng = longitude + 0.0045;
      if (leafletMap) leafletMap.flyTo([latitude, longitude], 15, { duration: 1.0 });
      updateRealMapOverlays();
      syncUI();
      showToast('✅ 真實定位成功！', '驚！發現三寶就在您目前真實位置方圓 600 公尺內徘徊！', 'red');
    },
    () => {
      showToast('⚠️ 無法取得 GPS 權限', '您可直接點擊地圖任意位置設定座標！', 'amber');
    }
  );
};

window.openGoogleMapsNavigation = function () {
  const { lat, lng } = appState.sanbaoLatLng;
  window.open(`https://www.google.com/maps/search/?api=1&query=${lat},${lng}`, '_blank');
};

// ============================================================================
// TAB 2: HARDWARE VISION (SANBAO-TAG // MK-VI) & REAL PHONE BEACON
// ============================================================================
window.pairNewSanbaoTag = function () {
  window.soundEngine.playPing();
  const randomId = 'TAG-' + Math.floor(1000 + Math.random() * 9000) + 'X';
  const gForce = (1.8 + Math.random() * 2.5).toFixed(1) + ' G';
  document.getElementById('hw-tag-id').textContent = randomId;
  document.getElementById('hw-gforce').textContent = gForce;
  showToast('🔌 車載寄生晶片已連線', `成功劫持 ${appState.profile.plate} 的 OBD-II 電腦訊號！`, 'cyan');
};

window.simulateHardwareEvent = function (type) {
  if (type === 'ignition') {
    window.selectScenario('snack');
    window.switchTab('radar');
    showToast('🔑 寄生盒警報：引擎已點火！', `${appState.profile.name} 剛轉動鑰匙，全群組手機已同步震動！`, 'red');
  } else if (type === 'rgear') {
    window.selectScenario('parking');
    window.switchTab('radar');
    window.flyToHotspot('costco');
    showToast('🅿️ 寄生盒警報：打入 R 檔！', '偵測到方向盤狂轉 + 倒車雷達長鳴，暴風半徑擴大至 3km！', 'red');
  } else if (type === 'ghostcut') {
    window.selectScenario('roundabout');
    window.switchTab('radar');
    window.triggerWiperParadox();
  }
};

window.toggleRealGpsBeacon = function () {
  const btn = document.getElementById('btn-live-beacon');
  const statusEl = document.getElementById('beacon-status-text');

  if (appState.beaconWatchId) {
    navigator.geolocation.clearWatch(appState.beaconWatchId);
    appState.beaconWatchId = null;
    if (btn) btn.textContent = '🛰️ 啟動「真實手機 GPS 寄生發射器」模式';
    if (statusEl) statusEl.textContent = '已停止發射';
    showToast('⏹️ 已關閉手機信標模式', '恢復雷達模擬漫遊', 'amber');
    return;
  }

  if (!navigator.geolocation) {
    showToast('⚠️ 裝置不支援 GPS', '請在手機或開啟定位權限的瀏覽器使用', 'red');
    return;
  }

  window.soundEngine.playSiren();
  if (btn) btn.textContent = '🔴 正在即時發射此手機真實 GPS 座標 (點擊停止)';
  if (statusEl) statusEl.textContent = '● 衛星即時鎖定發射中';

  appState.beaconWatchId = navigator.geolocation.watchPosition(
    (pos) => {
      appState.sanbaoLatLng.lat = pos.coords.latitude;
      appState.sanbaoLatLng.lng = pos.coords.longitude;
      if (leafletMap) leafletMap.panTo([pos.coords.latitude, pos.coords.longitude]);
      updateRealMapOverlays();
      syncUI();
    },
    () => {
      showToast('⚠️ 請允許位置權限', '才能把這支手機當成三寶車載追蹤器！', 'red');
    },
    { enableHighAccuracy: true }
  );

  showToast('🛰️ 手機已變身車載寄生器！', '現在把這支手機放他車上，地圖就會跟著他的真車移動！', 'emerald');
};

// ============================================================================
// UI SYNC & INTERACTIONS
// ============================================================================
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

  document.getElementById('vip-name').textContent = appState.profile.name;
  document.getElementById('vip-title').textContent = appState.profile.title;
  document.getElementById('vip-plate').textContent = appState.profile.plate;
  document.getElementById('vip-os-bubble').textContent = sc.osList[appState.osIndex % sc.osList.length];

  const commandBannerImg = document.getElementById('command-banner-img');
  const cgCaption = document.getElementById('cg-card-caption');
  if (commandBannerImg && sc.bannerImg) commandBannerImg.src = sc.bannerImg;
  if (cgCaption) cgCaption.textContent = sc.cgCaption;

  document.getElementById('metric-blast-radius').textContent = `${metrics.effectiveRadius.toFixed(2)} km`;
  document.getElementById('metric-user-dist').textContent = `${metrics.distKm.toFixed(2)} km`;
  const survEl = document.getElementById('metric-survival-rate');
  survEl.textContent = `${metrics.survival.toFixed(1)}%`;
  survEl.style.color = metrics.survival < 40 ? '#EF4444' : metrics.survival < 75 ? '#F59E0B' : '#10B981';
  document.getElementById('metric-survival-bar').style.width = `${Math.min(100, Math.max(4, metrics.survival))}%`;

  document.querySelectorAll('[data-scenario-btn]').forEach((btn) => {
    const active = btn.getAttribute('data-scenario-btn') === appState.scenario;
    btn.classList.toggle('ring-2', active);
    btn.classList.toggle('ring-amber-400', active);
  });

  const jitter = appState.scenario === 'home' ? 0 : Math.round((Math.random() - 0.5) * 3);
  document.getElementById('obd-speed').textContent = `${Math.max(0, sc.speedKmh + jitter)} km/h`;
  document.getElementById('obd-confusion').textContent = `${Math.min(99, Math.round(sc.brakeGasConfusion * (0.7 + appState.chaosIndex / 200)))}%`;
  document.getElementById('obd-reroute').textContent = `${sc.navRerouteCount} 次`;

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
    appState.scenario === 'home' ? '車輪靜止' : `打左燈 ➔ 右偏 +${Math.abs(sc.carTiltDeg)}°`;

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

  ['radar', 'hardware', 'route', 'dossier'].forEach((id) => {
    const section = document.getElementById(`tab-panel-${id}`);
    const btn = document.getElementById(`tab-btn-${id}`);
    if (section) section.classList.toggle('hidden', id !== tabId);
    if (btn) {
      btn.className =
        id === tabId
          ? 'px-3.5 py-1.5 rounded-lg font-black text-xs flex items-center gap-1.5 bg-gradient-to-r from-amber-500 to-red-500 text-slate-950 shadow-[0_0_15px_rgba(245,158,11,0.4)] transition-all'
          : 'px-3.5 py-1.5 rounded-lg font-bold text-xs flex items-center gap-1.5 text-slate-400 hover:text-white transition-all';
    }
  });

  if (tabId === 'radar' && leafletMap) {
    setTimeout(() => leafletMap.invalidateSize(), 100);
  }
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
  triggerAnimeCutIn('PARADOX // 轉彎誤刷雨刷', 'OBD-II 寄生盒偵測雨刷超頻乾刷中！', '#F59E0B');
  showToast('🌧️ 寄生盒抓包！', `${appState.profile.name} 想右轉卻把雨刷開到最快！`, 'amber');
  syncUI();
  setTimeout(() => {
    appState.wiperBoostActive = false;
    syncUI();
  }, 4000);
};

window.calculateFarthestEscape = function () {
  window.soundEngine.playPing();
  appState.userLatLng.lat = REAL_HOTSPOTS.mrt.lat;
  appState.userLatLng.lng = REAL_HOTSPOTS.mrt.lng;
  if (leafletMap) leafletMap.flyTo([REAL_HOTSPOTS.mrt.lat, REAL_HOTSPOTS.mrt.lng], 14, { duration: 0.9 });
  updateRealMapOverlays();
  syncUI();
  showToast('🏃 已逃往高架捷運站！', '已進入物理高架隔離區，三寶爬不上來！', 'cyan');
};

window.setRadarClickMode = function (mode) {
  window.soundEngine.playClick(700);
  appState.clickMode = mode;
  document.getElementById('mode-btn-sanbao').className =
    mode === 'sanbao'
      ? 'px-2.5 py-1 rounded-lg text-[11px] font-black bg-red-500 text-white'
      : 'px-2.5 py-1 rounded-lg text-[11px] font-bold bg-slate-900 text-slate-300 border border-white/10';
  document.getElementById('mode-btn-user').className =
    mode === 'user'
      ? 'px-2.5 py-1 rounded-lg text-[11px] font-black bg-cyan-400 text-slate-950'
      : 'px-2.5 py-1 rounded-lg text-[11px] font-bold bg-slate-900 text-slate-300 border border-white/10';
};

// Route Check & Share
window.selectTransportMode = function (mode) {
  window.soundEngine.playClick(760);
  appState.routeForm.transport = mode;
  document.querySelectorAll('[data-transport-btn]').forEach((btn) => {
    const active = btn.getAttribute('data-transport-btn') === mode;
    btn.className = active
      ? 'p-2.5 rounded-xl border-2 border-amber-400 bg-amber-500/20 text-white text-xs font-black'
      : 'p-2.5 rounded-xl border border-white/10 bg-slate-900 text-slate-300 text-xs font-bold';
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

  let omen = '【大吉 // 天佑平安】';
  let color = '#10B981';
  if (prob >= 70) {
    omen = '【大凶 // 建議就地掩護】';
    color = '#EF4444';
  } else if (prob >= 35) {
    omen = '【中平偏凶 // 嚴禁併行】';
    color = '#F59E0B';
  }

  const omenEl = document.getElementById('route-result-omen');
  const probEl = document.getElementById('route-result-prob');
  if (omenEl) { omenEl.textContent = omen; omenEl.style.color = color; }
  if (probEl) { probEl.textContent = `${prob.toFixed(1)}% 遭遇率`; probEl.style.color = color; }
};

window.selectShareStyle = function (style) {
  window.soundEngine.playClick(700);
  appState.shareStyle = style;
  document.querySelectorAll('[data-share-style-btn]').forEach((btn) => {
    btn.className =
      btn.getAttribute('data-share-style-btn') === style
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
    box.value = `🚨【AEGIS 三寶防空警報】車上寄生盒回傳：「${name}」(${plate}) 已發動引擎！目前【${sc.level}】暴風半徑 ${metrics.effectiveRadius}km！\n📡 真實地圖雷達：${shareUrl}`;
  } else if (appState.shareStyle === 'elder') {
    box.value = `🌸早安平安🌸 好友【${name}】開車出門囉 (${plate}) 🚗 看到他晴天刷雨刷代表他想轉彎，方圓 ${metrics.effectiveRadius}km 請多禮讓🙏\n📡 平安雷達：${shareUrl}`;
  } else {
    box.value = `📺【快訊】用路傳奇「${name}」(${plate}) 現蹤街頭！左轉燈連閃 3.8km + 晴天雨刷全開，請保持 3 個紅綠燈車距！\n📡 現場雷達：${shareUrl}`;
  }
}

window.copyShareText = function () {
  window.soundEngine.playClick(920);
  const box = document.getElementById('share-copy-textarea');
  if (!box) return;
  navigator.clipboard?.writeText(box.value).then(() => {
    showToast('📋 已複製警報文案', '快貼到 LINE 群組拯救親友！', 'emerald');
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
    showToast('🔗 專屬網址已複製！', `丟給朋友點開即鎖定【${name}・${plate}】`, 'cyan');
  });
};

// Hexagon Chart & Sightings
function drawHexagonChart() {
  const canvas = document.getElementById('hexagon-chart-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const dpr = window.devicePixelRatio || 1;
  const size = 280;
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
    const lx = cx + Math.cos(a) * (maxR + 26);
    const ly = cy + Math.sin(a) * (maxR + 18);
    ctx.font = '700 11px "Noto Sans TC", sans-serif';
    ctx.fillStyle = '#F8FAFC';
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
  ctx.fillStyle = 'rgba(239, 68, 68, 0.32)';
  ctx.fill();
  ctx.strokeStyle = '#F59E0B';
  ctx.lineWidth = 2.2;
  ctx.stroke();
}

window.filterSightings = function (filter) {
  window.soundEngine.playClick(680);
  appState.sightingFilter = filter;
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
      <div class="p-3 rounded-xl border ${
        item.rank === 'S' ? 'bg-red-950/25 border-red-500/35' : 'bg-slate-900/75 border-white/10'
      } flex flex-col gap-1">
        <div class="flex items-center justify-between">
          <span class="font-bold text-xs text-white">📍 ${item.location}</span>
          <button onclick="likeSighting('${item.id}')" class="px-2 py-0.5 rounded bg-slate-800 text-[11px] font-mono text-amber-300">
            🙏 +${item.likes}
          </button>
        </div>
        <p class="text-xs text-slate-200">${item.content}</p>
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
  if (!location || !content) return;
  window.soundEngine.playPing();
  appState.sightings.unshift({ id: 's_' + Date.now(), rank, location, time: '剛剛', reporter: '損友', content, likes: 1 });
  saveSightingsToStorage();
  renderSightingsList();
  document.getElementById('new-sighting-location').value = '';
  document.getElementById('new-sighting-content').value = '';
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
  saveProfileToStorage();
  if (sanbaoMarker && leafletMap) {
    leafletMap.removeLayer(sanbaoMarker);
    initRealGoogleMap();
  }
  syncUI();
  closeProfileModal();
  showToast('⚙️ 已換人監控', `現在鎖定【${appState.profile.name}・${appState.profile.plate}】`, 'emerald');
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
  document.getElementById('woodfish-float-zone').innerHTML = `<span class="text-xs font-mono font-bold text-amber-300 animate-bounce">🙏 保命功德 +1</span>`;
};

window.startParkingMiniGame = function () {
  window.soundEngine.playPing();
  appState.parkingGame = { active: true, carX: 70, carY: 68, carAngle: 0, status: 'PLAYING' };
  renderParkingMiniGame();
};

window.steerParkingCar = function (cmd) {
  const g = appState.parkingGame;
  if (g.status !== 'PLAYING') { window.startParkingMiniGame(); return; }
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
  if (g.carX >= 205 && g.carX <= 275 && g.carY >= 40 && g.carY <= 98) {
    g.status = 'WIN';
    window.soundEngine.playPing();
    showToast('🏆 奇蹟停進去了！', '沒撞柱子！', 'emerald');
  } else if (g.carX < 18 || g.carX > 302 || g.carY < 16 || g.carY > 122) {
    g.status = 'CRASH';
    window.soundEngine.playWiperSlap();
    showToast('💥 撞上好市多水泥柱！', '左右相反太難了！', 'red');
  }
  renderParkingMiniGame();
};

function renderParkingMiniGame() {
  const canvas = document.getElementById('parking-game-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const g = appState.parkingGame;
  ctx.fillStyle = '#060911';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.strokeStyle = '#F59E0B';
  ctx.lineWidth = 2;
  ctx.strokeRect(205, 36, 75, 60);

  ctx.fillStyle = '#EF4444';
  ctx.fillRect(186, 22, 12, 12);
  ctx.fillRect(186, 102, 12, 12);

  ctx.save();
  ctx.translate(g.carX, g.carY);
  ctx.rotate((g.carAngle * Math.PI) / 180);
  ctx.fillStyle = g.status === 'CRASH' ? '#EF4444' : g.status === 'WIN' ? '#10B981' : '#38BDF8';
  ctx.beginPath();
  ctx.roundRect(-18, -10, 36, 20, 4);
  ctx.fill();
  ctx.strokeStyle = '#FFFFFF';
  ctx.stroke();
  ctx.restore();

  ctx.font = '700 10px "Noto Sans TC", sans-serif';
  ctx.fillStyle = '#94A3B8';
  ctx.fillText(g.status === 'WIN' ? '✅ 成功 (點按重玩)' : g.status === 'CRASH' ? '💥 撞柱 (點按重試)' : '方向盤左右相反・請倒車入黃格', 10, 128);
}

document.addEventListener('DOMContentLoaded', () => {
  loadPersistedData();
  renderSightingsList();
  initRealGoogleMap();
  renderParkingMiniGame();
  calculateRouteSafety(false);
  syncUI();

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
      muteBtn.innerHTML = muted ? '🔇 靜音' : '🔊 音效';
    });
  }
});
