/**
 * 損友三寶監測局 // 真人即時連線防空雷達 v12.0
 * 1. Real-Time Multi-Device Friend Login & Live GPS Sync (MQTT over WSS + BroadcastChannel + URL Invite)
 * 2. Zero Virtual People — Add Real Friends & Click "確定查看位置" to Track Their Real GPS
 * 3. Real 360° Interactive Google Street View Panorama (Not 2D tiles!)
 * 4. 3D Costco Reverse Parking Simulator with Continuous Keyboard & Touch Controls
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
    level: '🏠 平安在家',
    levelNum: 0,
    radiusKm: 0.05,
    baseChaos: 8,
    wiperRapid: false,
    leftSignal: false,
    rightSignal: false,
    carTiltDeg: 0,
    color: '#2DD4BF',
    cutInTitle: '🏠 平安休止符',
    cutInSub: '目前已熄火休息，馬路暫時安全！',
    osList: ['💭「已經平安停好車在家休息囉～」', '💭「今天不開車，大家放心出門！」']
  },
  snack: {
    id: 'snack',
    badge: 'LV.2',
    level: '🛵 買東西',
    levelNum: 2,
    radiusKm: 0.65,
    baseChaos: 48,
    wiperRapid: false,
    leftSignal: true,
    rightSignal: false,
    carTiltDeg: 14,
    color: '#F59E0B',
    cutInTitle: '🛵 外出買東西',
    cutInSub: '正在路上採買物品，請注意車距！',
    osList: ['💭「出門買點東西，看到我請保持車距～」', '💭「左轉燈亮著？我考慮一下要轉哪邊～」']
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
    cutInTitle: '🔄 圓環迷航中',
    cutInSub: '打左燈往右偏 + 大晴天狂刷雨刷！',
    osList: ['💭「救命！這個路口怎麼這麼複雜出不去！」', '💭「想打方向燈怎麼雨刷又在狂刷啦！」']
  },
  parking: {
    id: 'parking',
    badge: 'LV.5',
    level: '🅿️ 正在倒車',
    levelNum: 5,
    radiusKm: 3.0,
    baseChaos: 98,
    wiperRapid: true,
    leftSignal: true,
    rightSignal: true,
    carTiltDeg: -35,
    color: '#F43F5E',
    cutInTitle: '🅿️ 倒車大魔王',
    cutInSub: '正在倒車入庫中・方圓 3km 請注意！',
    osList: ['💭「方向盤往左打，車屁股怎麼往右邊柱子撞？！」', '💭「正在努力倒車入庫，後面的人別按我喇叭！」']
  }
};

const TAROT_CARDS = [
  { name: '🃏 逆位・雨刷之神', desc: '今日轉彎 100% 誤觸雨刷，前擋玻璃比臉還乾淨！' },
  { name: '🃏 正位・莫比烏斯圓環', desc: '一旦進入圓環將強制繞行 7 圈以上，導航姊姊已崩潰跳車！' },
  { name: '🃏 逆位・薛丁格方向燈', desc: '打左燈必往右轉，後車猜中機率 0%！' },
  { name: '🃏 正位・好市多雙格霸主', desc: '倒車入庫耗時 +19 分鐘，建議直接把車扛回家！' },
  { name: '🃏 隱藏SSR・黃金烤雞腿駕照', desc: '教練當年含淚送出駕照，拜託你別再開回駕訓班！' }
];

const DEFAULT_SIGHTINGS = [
  { id: 's1', location: '北屯好市多 B2', content: '雙格車位嚕了 19 分鐘，晴天雨刷狂刷 40 下，最後停在車道中間！', likes: 168, funny: 88, chicken: 66, warn: 42 },
  { id: 's2', location: '台灣大道圓環', content: '左轉燈連閃 3.8 公里，結果突然右切進得來速買大薯！', likes: 112, funny: 95, chicken: 45, warn: 38 }
];

const appState = {
  activeTab: 'radar',
  scenario: 'roundabout',
  chaosIndex: 76,
  avatarIndex: 0,
  bountyAmount: 88000,
  stamps: ['🍗 雞腿換駕照', '🌧️ 晴天刷雨刷'],
  shieldActive: false,
  shieldEnergy: 100,
  radarAngle: 0,
  // My Own Real Identity & GPS
  myUser: {
    id: 'u_' + Math.random().toString(36).slice(2, 9),
    name: '',
    plate: '',
    roomCode: '8888',
    avatar: 'assets/sanbao_chicken_avatar.jpg',
    loggedIn: false,
    lat: 24.1618,
    lng: 120.6469,
    accuracy: 10,
    hasRealGps: false,
    mode: 'roundabout',
    sosMsg: '🚗 剛登入上線，正在分享即時位置！'
  },
  // Currently Tracked Friend (or myself if no friend selected yet)
  selectedFriendId: null,
  // Real Friends Map (ZERO virtual people!)
  friends: [],
  pendingIncomingFriend: null,
  osIndex: 0,
  sightings: [],
  routeForm: { transport: 'scooter' },
  shareStyle: 'defense',
  meritCount: 108,
  heartRate: 138,
  beaconWatchId: null,
  streetViewOpen: false,
  // 3D Costco Reverse Parking Simulator State
  parkingGame: {
    active: false,
    viewMode: '3D',
    invertSteer: true,
    level: 1,
    carX: 82,
    carY: 125,
    carAngle: 0,
    steerWheelDeg: 0,
    gear: 'R',
    overlapPct: 0,
    rearDistCm: 180,
    status: 'READY',
    keys: { left: false, right: false, up: false, down: false },
    carts: [
      { x: 185, y: 65, vy: 1.15, label: '🛒大媽A' },
      { x: 162, y: 185, vy: -1.35, label: '🛒推車B' }
    ]
  }
};

let leafletMap = null;
let tileLayerGroup = null;
let targetMarker = null;
let userMarker = null;
let userAccuracyCircle = null;
let innerBlastCircle = null;
let outerDeceptionCircle = null;
let tetherPolyline = null;
let friendMarkers = [];

// Cloud MQTT Clients & Local BroadcastChannel for Instant Cross-Device & Cross-Tab Sync
let mqttClients = [];
let localBroadcast = null;

function getTrackedProfile() {
  if (appState.selectedFriendId) {
    const f = appState.friends.find((x) => x.id === appState.selectedFriendId);
    if (f) return f;
  }
  if (appState.myUser.loggedIn) {
    return {
      id: appState.myUser.id,
      name: appState.myUser.name + ' (我)',
      plate: appState.myUser.plate || '我的定位',
      avatar: appState.myUser.avatar,
      lat: appState.myUser.lat,
      lng: appState.myUser.lng,
      mode: appState.myUser.mode,
      sosMsg: appState.myUser.sosMsg
    };
  }
  return {
    id: 'preview',
    name: '訪客即時預覽中',
    plate: '未登入',
    avatar: appState.myUser.avatar || 'assets/sanbao_chicken_avatar.jpg',
    lat: appState.myUser.lat,
    lng: appState.myUser.lng,
    mode: appState.scenario,
    sosMsg: '💭 歡迎檢視！可在下方輸入暱稱開啟即時定位，或自由預覽地圖與3D遊戲！'
  };
}

// Universal Storage Helper (Robust fallback to SessionStorage + Cookie + In-Memory if localStorage quota/security blocks)
const SafeStorage = {
  memory: {},
  getItem(key) {
    try {
      const val = localStorage.getItem(key);
      if (val !== null && val !== undefined) return val;
    } catch (e) {}
    try {
      const sVal = sessionStorage.getItem(key);
      if (sVal !== null && sVal !== undefined) return sVal;
    } catch (e) {}
    try {
      const match = document.cookie.match(new RegExp('(^|;\\s*)' + encodeURIComponent(key) + '=([^;]*)'));
      if (match) return decodeURIComponent(match[2]);
    } catch (e) {}
    return this.memory[key] || null;
  },
  setItem(key, value) {
    this.memory[key] = value;
    try {
      localStorage.setItem(key, value);
    } catch (e) {}
    try {
      sessionStorage.setItem(key, value);
    } catch (e) {}
    try {
      if (value && value.length < 3500) {
        const expires = new Date(Date.now() + 365 * 864e5).toUTCString();
        document.cookie = `${encodeURIComponent(key)}=${encodeURIComponent(value)}; expires=${expires}; path=/; SameSite=Lax`;
      }
    } catch (e) {}
  },
  removeItem(key) {
    delete this.memory[key];
    try { localStorage.removeItem(key); } catch (e) {}
    try { sessionStorage.removeItem(key); } catch (e) {}
    try { document.cookie = `${encodeURIComponent(key)}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/;`; } catch (e) {}
  }
};

// Auto-request browser persistent storage permission
try {
  if (navigator.storage && navigator.storage.persist) {
    navigator.storage.persist().catch(() => {});
  }
} catch (e) {}

function loadPersistedData() {
  try {
    const savedMe = SafeStorage.getItem('aegis_sanbao_my_user_v14') ||
                    SafeStorage.getItem('aegis_sanbao_my_user_v13') ||
                    SafeStorage.getItem('aegis_sanbao_my_user');
    if (savedMe) {
      const parsed = JSON.parse(savedMe);
      // Preserve saved name & settings, but ALWAYS start in visitor preview mode (loggedIn: false)
      appState.myUser = { ...appState.myUser, ...parsed, loggedIn: false };
    }
  } catch (e) {}

  try {
    const savedFriends = SafeStorage.getItem('aegis_sanbao_real_friends_v14') ||
                         SafeStorage.getItem('aegis_sanbao_real_friends_v13') ||
                         SafeStorage.getItem('aegis_sanbao_friends');
    appState.friends = savedFriends ? JSON.parse(savedFriends) : [];
  } catch (e) {
    appState.friends = [];
  }

  try {
    const savedSightings = SafeStorage.getItem('aegis_sanbao_sightings_v14') ||
                           SafeStorage.getItem('aegis_sanbao_sightings');
    appState.sightings = savedSightings ? JSON.parse(savedSightings) : [...DEFAULT_SIGHTINGS];
  } catch (e) {
    appState.sightings = [...DEFAULT_SIGHTINGS];
  }

  try {
    const savedStamps = SafeStorage.getItem('aegis_sanbao_stamps_v14') ||
                        SafeStorage.getItem('aegis_sanbao_stamps');
    if (savedStamps) {
      appState.stamps = JSON.parse(savedStamps);
    }
  } catch (e) {}

  // Check URL parameters for friend invite / shared location link
  try {
    const params = new URLSearchParams(window.location.search);
    if (params.get('room')) {
      appState.myUser.roomCode = params.get('room').trim();
    }
    const friendName = params.get('name');
    const friendPlate = params.get('plate');
    const friendLat = parseFloat(params.get('lat'));
    const friendLng = parseFloat(params.get('lng'));
    const friendId = params.get('uid') || (friendName ? 'url_' + encodeURIComponent(friendName) : null);

    if (friendName && !isNaN(friendLat) && !isNaN(friendLng) && friendId !== appState.myUser.id) {
      handleIncomingFriendPacket({
        id: friendId,
        name: friendName,
        plate: friendPlate || '好友座駕',
        mode: params.get('mode') || 'roundabout',
        avatar: 'assets/sanbao_chicken_avatar.jpg',
        lat: friendLat,
        lng: friendLng,
        sosMsg: '📍 透過專屬連結分享的即時位置',
        updatedAt: Date.now()
      });
    }
  } catch (e) {}

  // Ensure my driver identity is initialized so live broadcast/subscription works immediately
  if (!appState.myUser.name) {
    const randomSuffix = Math.floor(100 + Math.random() * 900);
    appState.myUser.name = `三寶車神_${randomSuffix}`;
    appState.myUser.plate = `SAN-${randomSuffix}`;
    appState.myUser.loggedIn = true;
    saveMyUserToStorage();
  }

  // Populate inputs if saved
  const nameIn = document.getElementById('my-driver-name');
  const plateIn = document.getElementById('my-driver-plate');
  const roomIn = document.getElementById('my-room-code');
  if (nameIn && appState.myUser.name) nameIn.value = appState.myUser.name;
  if (plateIn && appState.myUser.plate) plateIn.value = appState.myUser.plate;
  if (roomIn && appState.myUser.roomCode) roomIn.value = appState.myUser.roomCode;
}

function saveMyUserToStorage() {
  SafeStorage.setItem('aegis_sanbao_my_user_v14', JSON.stringify(appState.myUser));
}
function saveFriendsToStorage() {
  SafeStorage.setItem('aegis_sanbao_real_friends_v14', JSON.stringify(appState.friends));
}
function saveSightingsToStorage() {
  SafeStorage.setItem('aegis_sanbao_sightings_v14', JSON.stringify(appState.sightings));
}
function saveStampsToStorage() {
  SafeStorage.setItem('aegis_sanbao_stamps_v14', JSON.stringify(appState.stamps));
}

// ============================================================================
// REAL-TIME CLOUD SYNC ENGINE (MQTT over WSS Port 443 + 8084 + BroadcastChannel)
// ============================================================================
function initRealtimeCloudSync() {
  const room = appState.myUser.roomCode || '8888';
  const topicPrefix = `sanbao-radar-v12/room/${room}/user/`;

  // 1. Local BroadcastChannel (for instant multi-tab sync on same device)
  try {
    if ('BroadcastChannel' in window) {
      if (localBroadcast) localBroadcast.close();
      localBroadcast = new BroadcastChannel(`sanbao_room_${room}`);
      localBroadcast.onmessage = (ev) => {
        if (ev.data && ev.data.id && ev.data.id !== appState.myUser.id) {
          handleIncomingFriendPacket(ev.data);
        }
      };
    }
  } catch (e) {}

  // 2. Cloud MQTT over Secure WebSockets (Port 443 & 8084 for cross-phone/PC real-time sync!)
  if (typeof mqtt === 'undefined') return;

  mqttClients.forEach((c) => {
    try { c.end(true); } catch (e) {}
  });
  mqttClients = [];

  const brokers = [
    'wss://mqtt.eclipseprojects.io:443/mqtt',
    'wss://broker.emqx.io:8084/mqtt'
  ];

  brokers.forEach((brokerUrl) => {
    try {
      const client = mqtt.connect(brokerUrl, {
        clientId: 'sanbao_' + appState.myUser.id + '_' + Math.random().toString(36).slice(2, 6),
        clean: true,
        connectTimeout: 6000,
        reconnectPeriod: 4000
      });

      client.on('connect', () => {
        const badge = document.getElementById('cloud-sync-badge');
        if (badge) {
          badge.textContent = `🟢 房號 #${room} 雲端即時連線中`;
        }
        client.subscribe(`${topicPrefix}+`, { qos: 0 });
        if (appState.myUser.loggedIn) {
          publishMyPresence();
        }
      });

      client.on('message', (topic, payload) => {
        try {
          const data = JSON.parse(payload.toString());
          if (data && data.id && data.id !== appState.myUser.id) {
            handleIncomingFriendPacket(data);
          }
        } catch (err) {}
      });

      mqttClients.push(client);
    } catch (e) {}
  });

  // Continuous Heartbeat Broadcast every 3 seconds for continuous real-time subscription!
  if (window._presenceHeartbeat) clearInterval(window._presenceHeartbeat);
  window._presenceHeartbeat = setInterval(() => {
    if (appState.myUser.loggedIn) {
      publishMyPresence();
    }
  }, 3000);
}

function publishMyPresence() {
  if (!appState.myUser.loggedIn || !appState.myUser.name) return;
  const room = appState.myUser.roomCode || '8888';
  const topic = `sanbao-radar-v12/room/${room}/user/${appState.myUser.id}`;
  const packet = {
    id: appState.myUser.id,
    name: appState.myUser.name,
    plate: appState.myUser.plate || '汽車/機車',
    avatar: appState.myUser.avatar,
    lat: appState.myUser.lat,
    lng: appState.myUser.lng,
    accuracy: appState.myUser.accuracy || 10,
    mode: appState.myUser.mode || appState.scenario,
    sosMsg: appState.myUser.sosMsg || '🚗 已登入網站並即時分享位置中',
    updatedAt: Date.now()
  };

  try {
    if (localBroadcast) localBroadcast.postMessage(packet);
  } catch (e) {}

  const str = JSON.stringify(packet);
  mqttClients.forEach((client) => {
    try {
      if (client.connected) {
        client.publish(topic, str, { qos: 0, retain: true });
      }
    } catch (e) {}
  });
}

function handleIncomingFriendPacket(packet) {
  if (!packet || !packet.name || !packet.id) return;
  if (packet.id === appState.myUser.id) return;
  // Ignore stale retained packets older than 6 hours
  if (packet.updatedAt && Date.now() - packet.updatedAt > 6 * 3600 * 1000) return;

  // Check if friend already exists by id or by name
  let friend = appState.friends.find((f) => f.id === packet.id || (f.name === packet.name && f.plate === packet.plate));
  const isBrandNew = !friend;

  if (friend) {
    friend.id = packet.id;
    friend.name = packet.name;
    friend.plate = packet.plate || friend.plate;
    friend.avatar = packet.avatar || friend.avatar;
    friend.lat = packet.lat;
    friend.lng = packet.lng;
    friend.accuracy = packet.accuracy || 10;
    friend.mode = packet.mode || friend.mode;
    friend.sosMsg = packet.sosMsg || friend.sosMsg;
    friend.online = true;
    friend.updatedAt = packet.updatedAt || Date.now();
  } else {
    friend = {
      id: packet.id,
      name: packet.name,
      plate: packet.plate || '好友座駕',
      avatar: packet.avatar || 'assets/sanbao_chicken_avatar.jpg',
      lat: packet.lat,
      lng: packet.lng,
      accuracy: packet.accuracy || 10,
      mode: packet.mode || 'roundabout',
      sosMsg: packet.sosMsg || '🚗 剛上線並分享即時位置！',
      online: true,
      confirmed: true, // auto-confirm so they appear on Google Map immediately!
      updatedAt: packet.updatedAt || Date.now()
    };
    appState.friends.unshift(friend);
    showToast(`🔔 好友【${friend.name}】上線！`, `已在 Google Map 上即時顯示其位置！`, 'emerald');
    if (!appState.selectedFriendId) {
      appState.selectedFriendId = friend.id;
    }
  }

  saveFriendsToStorage();
  renderSquadFriendsList();
  renderOnlineFriendPills();
  renderFriendMapMarkers();
  updateRealMapOverlays();
  syncUI();

  // If tracking this friend, pan smoothly with their movement
  if (appState.selectedFriendId === friend.id && leafletMap) {
    leafletMap.panTo([friend.lat, friend.lng], { animate: true, duration: 0.5 });
  }
}

function promptIncomingFriendConfirmation(friend) {
  appState.pendingIncomingFriend = friend;
  const banner = document.getElementById('incoming-friend-banner');
  const titleEl = document.getElementById('incoming-friend-title');
  const subEl = document.getElementById('incoming-friend-sub');
  const imgEl = document.getElementById('incoming-friend-avatar');
  const confirmBtn = document.getElementById('incoming-confirm-btn');
  if (!banner || !titleEl || !subEl || !confirmBtn) return;

  window.soundEngine.playPing();
  if (imgEl) imgEl.src = friend.avatar || 'assets/sanbao_chicken_avatar.jpg';
  titleEl.textContent = `好友【${friend.name} (${friend.plate})】已登入並分享定位！`;
  subEl.textContent = `${friend.sosMsg} ・ 點擊「確定」立即查看他的位置`;
  confirmBtn.onclick = () => confirmAndLocateFriend(friend.id);
  banner.classList.remove('hidden');
}

window.dismissIncomingFriendBanner = function () {
  document.getElementById('incoming-friend-banner')?.classList.add('hidden');
};

window.confirmAndLocateFriend = function (friendId) {
  const friend = appState.friends.find((f) => f.id === friendId);
  if (!friend) return;

  window.soundEngine.playWinFanfare();
  friend.confirmed = true;
  appState.selectedFriendId = friend.id;
  appState.scenario = friend.mode || 'roundabout';
  appState.chaosIndex = SCENARIOS[appState.scenario]?.baseChaos || 76;

  saveFriendsToStorage();
  dismissIncomingFriendBanner();
  renderSquadFriendsList();
  renderOnlineFriendPills();
  refreshMainMarkers();
  renderFriendMapMarkers();
  updateRealMapOverlays();
  syncUI();

  window.switchTab('radar');
  if (leafletMap && !isNaN(friend.lat) && !isNaN(friend.lng)) {
    leafletMap.flyTo([friend.lat, friend.lng], 17, { duration: 0.9 });
  }
  if (appState.streetViewOpen) {
    updateStreetViewIframe(friend.lat, friend.lng, `${friend.name} (${friend.plate})`);
  }

  triggerAnimeCutIn(`✅ 已鎖定好友：${friend.name}`, `正在追蹤他的即時位置 (${friend.lat.toFixed(4)}, ${friend.lng.toFixed(4)})`, '#2DD4BF');
  showToast(`📍 已顯示【${friend.name}】的位置！`, '地圖已自動飛往他的即時 GPS 座標！', 'emerald');
};

// ============================================================================
// LOGIN & MY REAL GPS BROADCAST
// ============================================================================
window.openLoginModal = function () {
  window.soundEngine.playClick(780);
  const m = document.getElementById('modal-login');
  if (!m) return;
  document.getElementById('modal-login-name').value = appState.myUser.name || '';
  document.getElementById('modal-login-plate').value = appState.myUser.plate || '';
  document.getElementById('modal-login-room').value = appState.myUser.roomCode || '8888';
  m.classList.remove('hidden');
};

window.closeLoginModal = function () {
  document.getElementById('modal-login')?.classList.add('hidden');
};

window.submitModalLogin = function () {
  const name = document.getElementById('modal-login-name')?.value.trim();
  const plate = document.getElementById('modal-login-plate')?.value.trim().toUpperCase() || '我的座駕';
  const room = document.getElementById('modal-login-room')?.value.trim() || '8888';
  if (!name) {
    showToast('⚠️ 請輸入你的名字', '輸入名字後好友才能看到是誰登入喔！', 'red');
    return;
  }

  const roomChanged = room !== appState.myUser.roomCode;
  appState.myUser.name = name;
  appState.myUser.plate = plate;
  appState.myUser.roomCode = room;
  appState.myUser.loggedIn = true;
  saveMyUserToStorage();

  const nameIn = document.getElementById('my-driver-name');
  const plateIn = document.getElementById('my-driver-plate');
  const roomIn = document.getElementById('my-room-code');
  if (nameIn) nameIn.value = name;
  if (plateIn) plateIn.value = plate;
  if (roomIn) roomIn.value = room;

  closeLoginModal();

  if (roomChanged) {
    initRealtimeCloudSync();
  }

  const headerBtn = document.getElementById('header-login-btn');
  if (headerBtn) {
    headerBtn.textContent = `🟢 ${name} (#${room})`;
  }
  const pill = document.getElementById('my-login-status-pill');
  if (pill) {
    pill.textContent = `🟢 已登入 #${room}`;
    pill.className = 'px-2.5 py-0.5 rounded-full bg-teal-400 text-slate-950 font-mono text-[10px] font-black';
  }

  syncUI();
  refreshMainMarkers();
  publishMyPresence();
  window.soundEngine.playWinFanfare();
  showToast(`✅ 登入成功！`, `歡迎【${name} (${plate})】，房號 #${room} 已連線！`, 'emerald');

  window.useRealBrowserGPS({ silent: false });
};

window.openEditMyNameDialog = function () {
  window.soundEngine.playClick(720);
  const m = document.getElementById('modal-edit-name');
  if (!m) return;
  const inName = document.getElementById('edit-dialog-name');
  const inPlate = document.getElementById('edit-dialog-plate');
  if (inName) inName.value = appState.myUser.name || '';
  if (inPlate) inPlate.value = appState.myUser.plate || '';
  m.classList.remove('hidden');
  setTimeout(() => inName?.focus(), 80);
};

window.closeEditMyNameDialog = function () {
  document.getElementById('modal-edit-name')?.classList.add('hidden');
};

window.saveEditedDriverName = function () {
  const inName = document.getElementById('edit-dialog-name')?.value.trim();
  const inPlate = document.getElementById('edit-dialog-plate')?.value.trim().toUpperCase() || '我的座駕';
  if (!inName) {
    showToast('⚠️ 名字不能為空', '請輸入您的駕駛暱稱！', 'red');
    return;
  }
  appState.myUser.name = inName;
  appState.myUser.plate = inPlate;
  appState.myUser.loggedIn = true;
  saveMyUserToStorage();
  closeEditMyNameDialog();

  const nameIn = document.getElementById('my-driver-name');
  const plateIn = document.getElementById('my-driver-plate');
  if (nameIn) nameIn.value = inName;
  if (plateIn) plateIn.value = inPlate;

  const headerBtn = document.getElementById('header-login-btn');
  if (headerBtn) {
    headerBtn.textContent = `🟢 ${inName} (#${appState.myUser.roomCode || '8888'})`;
  }

  syncUI();
  refreshMainMarkers();
  publishMyPresence();
  window.soundEngine.playWinFanfare();
  showToast('✅ 名字修改成功！', `您的暱稱已更新為【${inName} (${inPlate})】！`, 'emerald');
};

window.switchTrackingToSelf = function () {
  appState.selectedFriendId = null;
  saveFriendsToStorage();
  syncUI();
  refreshMainMarkers();
  updateRealMapOverlays();
  if (leafletMap) {
    leafletMap.flyTo([appState.myUser.lat, appState.myUser.lng], 17, { duration: 0.8 });
  }
  window.soundEngine.playPing();
  showToast('🛡️ 已切換為查看自己', `目前視野鎖定：${appState.myUser.name}`, 'teal');
};

window.syncDriverProfileFromTab2 = function () {
  const name = document.getElementById('my-driver-name')?.value.trim();
  const plate = document.getElementById('my-driver-plate')?.value.trim().toUpperCase();
  const room = document.getElementById('my-room-code')?.value.trim();
  if (name) appState.myUser.name = name;
  if (plate) appState.myUser.plate = plate;
  if (room && room !== appState.myUser.roomCode) {
    appState.myUser.roomCode = room;
    initRealtimeCloudSync();
  }
  saveMyUserToStorage();
  syncUI();
  refreshMainMarkers();
  publishMyPresence();
};

window.quickJumpToCity = function (lat, lng, name) {
  appState.myUser.lat = lat;
  appState.myUser.lng = lng;
  appState.myUser.hasRealGps = true;
  saveMyUserToStorage();
  if (appState.myUser.loggedIn) publishMyPresence();
  if (leafletMap) leafletMap.flyTo([lat, lng], 17, { duration: 0.8 });
  refreshMainMarkers();
  updateRealMapOverlays();
  syncUI();
  fetchAndDisplayReverseAddress(lat, lng);
  window.soundEngine.playPing();
  showToast(`📍 已精準定位至【${name}】！`, `座標: ${lat.toFixed(5)}, ${lng.toFixed(5)}`, 'emerald');
};

window.loginAndStartRealGpsBroadcast = function () {
  const name = document.getElementById('my-driver-name')?.value.trim() || appState.myUser.name;
  const plate = document.getElementById('my-driver-plate')?.value.trim().toUpperCase() || appState.myUser.plate || '我的座駕';
  const room = document.getElementById('my-room-code')?.value.trim() || appState.myUser.roomCode || '8888';

  if (!name) {
    window.openLoginModal();
    return;
  }

  const roomChanged = room !== appState.myUser.roomCode;
  appState.myUser.name = name;
  appState.myUser.plate = plate;
  appState.myUser.roomCode = room;
  appState.myUser.loggedIn = true;
  saveMyUserToStorage();

  if (roomChanged) {
    initRealtimeCloudSync();
  }

  const headerBtn = document.getElementById('header-login-btn');
  if (headerBtn) {
    headerBtn.textContent = `🟢 ${name} (#${room})`;
  }
  const pill = document.getElementById('my-login-status-pill');
  if (pill) {
    pill.textContent = `🟢 已登入 #${room}`;
    pill.className = 'px-2.5 py-0.5 rounded-full bg-teal-400 text-slate-950 font-mono text-[10px] font-black';
  }
  const beaconBtn = document.getElementById('btn-live-beacon');
  if (beaconBtn) {
    beaconBtn.textContent = `🟢 已登入【${name}】並持續向房號 #${room} 廣播真實定位`;
  }

  syncUI();
  refreshMainMarkers();
  publishMyPresence();
  window.soundEngine.playWinFanfare();
  showToast('🛰️ 正在開啟真實 GPS 定位...', `已登入為【${name}】，連線房號 #${room}`, 'emerald');

  // Start High-Accuracy Real GPS Watch with auto-failover
  window.useRealBrowserGPS({ silent: false });
};

window.loginFromQuickBar = function (e) {
  if (e && e.preventDefault) e.preventDefault();
  const input = document.getElementById('quick-login-name');
  const name = input?.value.trim();
  if (!name) {
    showToast('⚠️ 請輸入暱稱', '請手動輸入名字，即可啟動即時定位與連線！', 'amber');
    input?.focus();
    return;
  }

  appState.myUser.name = name;
  appState.myUser.loggedIn = true;
  saveMyUserToStorage();

  const nameIn = document.getElementById('my-driver-name');
  if (nameIn) nameIn.value = name;
  const modalName = document.getElementById('modal-login-name');
  if (modalName) modalName.value = name;

  syncUI();
  refreshMainMarkers();
  publishMyPresence();
  window.soundEngine.playWinFanfare();
  showToast('✅ 登入成功！', `歡迎【${name}】，房號 #${appState.myUser.roomCode || '8888'} 已連線！正在抓取真實 GPS...`, 'emerald');

  window.useRealBrowserGPS({ silent: false });
};

window.logoutToVisitorPreview = function () {
  window.soundEngine.playClick(600);
  appState.myUser.loggedIn = false;
  if (appState.beaconWatchId) {
    navigator.geolocation.clearWatch(appState.beaconWatchId);
    appState.beaconWatchId = null;
  }
  saveMyUserToStorage();
  syncUI();
  refreshMainMarkers();
  updateRealMapOverlays();
  showToast('👀 已切換為訪客預覽模式', '您可以自由檢視各項功能，隨時輸入名字即可重新登入！', 'slate');
};

// ============================================================================
// REAL 360° GOOGLE STREET VIEW PANORAMA (NOT 2D TILES!)
// ============================================================================
window.toggleRealStreetViewPanorama = function () {
  window.soundEngine.playClick(820);
  if (appState.streetViewOpen) {
    window.closeRealStreetViewPanorama();
    return;
  }
  const target = getTrackedProfile();
  const lat = target.lat || appState.myUser.lat;
  const lng = target.lng || appState.myUser.lng;
  const label = target.id !== 'none' ? `${target.name}` : '目前地圖中心';

  appState.streetViewOpen = true;
  const panel = document.getElementById('real-streetview-panel');
  if (panel) panel.classList.remove('hidden');

  const btn = document.getElementById('mapstyle-streetview');
  if (btn) {
    btn.className = 'px-2.5 py-1 rounded-xl text-[11px] font-black bg-gradient-to-r from-amber-300 to-amber-500 text-slate-950';
  }

  updateStreetViewIframe(lat, lng, label);
  showToast('🏙️ 已切換至 360° 真實街景！', `正在顯示【${label}】所在路口的 360° 實景畫面`, 'emerald');
};

function updateStreetViewIframe(lat, lng, labelText) {
  const iframe = document.getElementById('streetview-iframe');
  const label = document.getElementById('streetview-coord-label');
  const extLink = document.getElementById('streetview-external-link');
  if (label) {
    label.textContent = `🏙️ 360° 真實街景：${labelText} (${lat.toFixed(5)}, ${lng.toFixed(5)})`;
  }
  if (extLink) {
    extLink.href = `https://www.google.com/maps/@?api=1&map_action=pano&viewpoint=${lat},${lng}`;
  }
  if (iframe) {
    iframe.src = `https://maps.google.com/maps?q=&layer=c&cbll=${lat},${lng}&cbp=12,0,0,0,0&output=svembed`;
  }
}

window.closeRealStreetViewPanorama = function () {
  window.soundEngine.playClick(680);
  appState.streetViewOpen = false;
  document.getElementById('real-streetview-panel')?.classList.add('hidden');
  const btn = document.getElementById('mapstyle-streetview');
  if (btn) {
    btn.className = 'px-2.5 py-1 rounded-xl text-[11px] font-black bg-indigo-950 text-amber-200 border border-amber-300/50 hover:bg-indigo-900';
  }
};

// ============================================================================
// TOAST & ANIME CUT-IN
// ============================================================================
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
  }, 2800);
}

let cutInTimeout = null;
function triggerAnimeCutIn(title, subtitle, color = '#D4AF37') {
  const banner = document.getElementById('anime-cutin-banner');
  const bgSvg = document.getElementById('anime-cutin-svg');
  const titleEl = document.getElementById('anime-cutin-title');
  const subEl = document.getElementById('anime-cutin-sub');
  const cutinImg = document.getElementById('cutin-avatar-img');
  if (!banner || !bgSvg || !titleEl || !subEl) return;

  const target = getTrackedProfile();
  if (cutinImg) cutinImg.src = target.avatar || appState.myUser.avatar;
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
  appState.myUser.avatar = chosen.src;
  saveMyUserToStorage();

  if (appState.selectedFriendId) {
    const f = appState.friends.find((x) => x.id === appState.selectedFriendId);
    if (f) {
      f.avatar = chosen.src;
      saveFriendsToStorage();
    }
  }

  const vipImg = document.getElementById('vip-avatar-img');
  const vipBadge = document.getElementById('vip-avatar-badge');
  const modalImg = document.getElementById('alert-modal-avatar');
  if (vipImg) vipImg.src = chosen.src;
  if (vipBadge) vipBadge.textContent = chosen.badge;
  if (modalImg) modalImg.src = chosen.src;

  if (appState.myUser.loggedIn) publishMyPresence();
  refreshMainMarkers();
  renderSquadFriendsList();
  showToast(`🎭 已切換頭像：${chosen.badge}`, '雷達與好友清單頭像已同步更新！', 'amber');
};

window.speakCurrentSanbaoOS = function () {
  const target = getTrackedProfile();
  const sc = SCENARIOS[appState.scenario];
  const raw = (target.sosMsg || sc.osList[0]).replace(/[💭「」]/g, '');
  window.soundEngine.playPing();
  window.soundEngine.speak(`${target.name}說：${raw}`);
  triggerAnimeCutIn(`🎙️ ${target.name} 即時廣播`, raw, sc.color);
};

window.slapSanbaoStamp = function (stampText) {
  if (!stampText) return;
  window.soundEngine.playStamp();
  appState.bountyAmount += 15000;
  if (!appState.stamps.includes(stampText)) {
    appState.stamps.unshift(stampText);
    if (appState.stamps.length > 8) appState.stamps.pop();
  }
  saveStampsToStorage();
  renderVipStamps();
  syncUI();
  if (appState.myUser.loggedIn) {
    publishMyPresence();
  }
  const target = getTrackedProfile();
  triggerAnimeCutIn(`💮 蓋章認證：${stampText}`, `${target.name} 標籤已儲存！懸賞金暴增至 $${appState.bountyAmount.toLocaleString()}！`, '#F43F5E');
  showToast(`💮 已蓋上【${stampText}】違規章！`, `標籤已永久儲存！懸賞金 +$15,000`, 'red');
};

window.removeSanbaoStamp = function (idx) {
  if (idx >= 0 && idx < appState.stamps.length) {
    const removed = appState.stamps.splice(idx, 1)[0];
    saveStampsToStorage();
    renderVipStamps();
    syncUI();
    if (appState.myUser.loggedIn) {
      publishMyPresence();
    }
    showToast('🗑️ 已刪除標籤', `已移除「${removed}」違規標籤！`, 'amber');
  }
};

window.addCustomSanbaoStamp = function (e) {
  if (e && e.preventDefault) e.preventDefault();
  const input = document.getElementById('custom-stamp-input');
  if (!input) return;
  const val = input.value.trim();
  if (!val) {
    showToast('⚠️ 標籤不能為空', '請輸入搞笑三寶標籤名稱！', 'amber');
    return;
  }
  input.value = '';
  window.slapSanbaoStamp(val);
};

function renderVipStamps() {
  const row = document.getElementById('vip-stamps-row');
  if (!row) return;
  if (!appState.stamps || appState.stamps.length === 0) {
    row.innerHTML = `<span class="text-[10px] text-amber-200/60 italic">尚未貼上任何標籤（可在下方新增自訂標籤）</span>`;
    return;
  }
  row.innerHTML = appState.stamps
    .map(
      (s, idx) => `
        <span class="stamp-badge inline-flex items-center gap-1 px-2 py-0.5 rounded ${
          idx % 2 === 0
            ? 'bg-rose-600/90 border border-amber-200 text-white'
            : 'bg-amber-400/90 border border-white text-slate-950'
        } text-[10px] font-black shadow-sm group">
          <span>💮 ${s}</span>
          <button type="button" onclick="event.stopPropagation(); window.removeSanbaoStamp(${idx})" class="w-3.5 h-3.5 rounded-full bg-black/40 hover:bg-black/80 text-white flex items-center justify-center text-[9px] leading-none transition-colors ml-0.5 cursor-pointer" title="刪除此標籤">✕</button>
        </span>`
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
// HIGH-PRECISION GPS MAP ENGINE (NO FAKE DRIFT & NO CLICK-TO-MOVE SANBAO!)
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
  const sc = SCENARIOS[appState.scenario] || SCENARIOS.roundabout;
  const target = getTrackedProfile();
  const isLoggedIn = !!appState.myUser.loggedIn;
  const isTrackingFriend = !!appState.selectedFriendId;

  let distKm = 0.0;
  if (isTrackingFriend && target.id !== 'none' && target.id !== 'preview') {
    distKm = Math.max(0.01, calcGpsDistanceKm(target.lat, target.lng, appState.myUser.lat, appState.myUser.lng));
  }

  const chaosScale = 0.55 + (appState.chaosIndex / 100) * 0.9;
  const effectiveRadius = +(sc.radiusKm * chaosScale).toFixed(2);

  let survival = 99;
  if (isTrackingFriend && appState.scenario !== 'home') {
    const ratio = distKm / Math.max(0.2, effectiveRadius);
    survival = Math.min(99, Math.max(5, Math.round(ratio * 52 - appState.chaosIndex * 0.15 + (5 - sc.levelNum) * 8)));
  }
  return { distKm: +distKm.toFixed(2), effectiveRadius, survival, isLoggedIn, isTrackingFriend };
}

let lastGeocodeTime = 0;
async function fetchAndDisplayReverseAddress(lat, lng) {
  const coordDisplay = document.getElementById('live-coord-display');
  const addrEl = document.getElementById('live-location-address');

  // In visitor preview mode without a selected friend: protect privacy and do not locate stranger!
  if (!appState.myUser.loggedIn && !appState.selectedFriendId) {
    if (coordDisplay) coordDisplay.textContent = '🛰️ 個人定位未開啟 (無追蹤隱私保護中)';
    if (addrEl) addrEl.textContent = '🗺️ 全台防空即時雷達（訪客預覽模式）';
    return;
  }

  if (coordDisplay) {
    coordDisplay.textContent = `${lat.toFixed(6)}, ${lng.toFixed(6)} (±${appState.myUser.accuracy || 5}m)`;
  }
  if (!addrEl) return;

  const now = Date.now();
  if (now - lastGeocodeTime < 3000) return;
  lastGeocodeTime = now;

  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1&countrycodes=tw&accept-language=zh-TW`,
      { headers: { 'User-Agent': 'SanbaoRadarApp/14.0' } }
    );
    const data = await res.json();
    if (data && data.display_name) {
      const parts = data.display_name.split(',').map((s) => s.trim());
      addrEl.textContent = `📍 目前精確地址：${parts.slice(0, 3).join(' ')}`;
    }
  } catch (e) {
    addrEl.textContent = `📍 目前座標：${lat.toFixed(6)}, ${lng.toFixed(6)}`;
  }
}

appState.pinpointMode = false;
window.togglePinpointMode = function () {
  appState.pinpointMode = !appState.pinpointMode;
  updatePinpointBtnUI();
  if (appState.pinpointMode) {
    showToast('📍 釘選模式已開啟', '請在 Google 地圖上直接點擊您的精確位置！', 'cyan');
  } else {
    showToast('📍 已退出釘選模式', '', 'slate');
  }
};

function updatePinpointBtnUI() {
  const btn = document.getElementById('btn-pinpoint-mode');
  if (!btn) return;
  if (appState.pinpointMode) {
    btn.className = 'px-3 py-1 rounded-xl text-[11px] font-black bg-rose-500 text-white shadow-[0_0_15px_#F43F5E] animate-pulse';
    btn.innerHTML = '🎯 點地圖釘選中 (點擊取消)';
  } else {
    btn.className = 'px-3 py-1 rounded-xl text-[11px] font-black bg-slate-900 border border-amber-300/40 text-amber-200 hover:bg-slate-800';
    btn.innerHTML = '📍 地圖釘選校正';
  }
}

window.fitMapToAllPeople = function () {
  if (!leafletMap) return;
  const pts = [];
  if (appState.myUser.loggedIn) {
    pts.push([appState.myUser.lat, appState.myUser.lng]);
  }
  appState.friends.forEach((f) => {
    if (!isNaN(f.lat) && !isNaN(f.lng)) {
      pts.push([f.lat, f.lng]);
    }
  });

  if (pts.length === 0) {
    leafletMap.setView([23.9738, 120.9820], 8, { animate: true });
    showToast('🗺️ 全台預覽視圖', '目前無在線人員，已縮放至台灣全島！', 'cyan');
  } else if (pts.length === 1) {
    leafletMap.setView(pts[0], 16, { animate: true });
    showToast('📍 已置中目標位置', `${pts[0][0].toFixed(5)}, ${pts[0][1].toFixed(5)}`, 'cyan');
  } else {
    const bounds = L.latLngBounds(pts);
    leafletMap.fitBounds(bounds, { padding: [50, 50], maxZoom: 18, animate: true });
    showToast('🎯 已縮放至全體人員', `地圖已包含 ${pts.length} 位在線人員！`, 'emerald');
  }
};

function initRealGoogleMap() {
  const mapEl = document.getElementById('real-google-map');
  if (!mapEl || typeof L === 'undefined') return;

  // In preview mode: default overview of Taiwan! (Strangers are never tracked!)
  const initialCenter = appState.myUser.loggedIn
    ? [appState.myUser.lat, appState.myUser.lng]
    : [23.9738, 120.9820];
  const initialZoom = appState.myUser.loggedIn ? 16 : 8;

  leafletMap = L.map('real-google-map', {
    center: initialCenter,
    zoom: initialZoom,
    zoomControl: true
  });

  window.setMapStyle('tactical');

  outerDeceptionCircle = L.circle(initialCenter, {
    radius: 600,
    color: '#FEF08A',
    weight: 2,
    dashArray: '8, 6',
    fillColor: '#F59E0B',
    fillOpacity: 0,
    opacity: 0
  }).addTo(leafletMap);

  innerBlastCircle = L.circle(initialCenter, {
    radius: 320,
    color: '#F43F5E',
    weight: 2,
    fillColor: '#F43F5E',
    fillOpacity: 0,
    opacity: 0
  }).addTo(leafletMap);

  userAccuracyCircle = L.circle(initialCenter, {
    radius: 20,
    color: '#2DD4BF',
    weight: 1.5,
    fillColor: '#2DD4BF',
    fillOpacity: 0,
    opacity: 0
  }).addTo(leafletMap);

  tetherPolyline = L.polyline([], { color: '#2DD4BF', weight: 2.5, dashArray: '5, 6' }).addTo(leafletMap);

  leafletMap.on('click', (e) => {
    if (appState.pinpointMode) {
      const { lat, lng } = e.latlng;
      appState.myUser.lat = lat;
      appState.myUser.lng = lng;
      appState.myUser.hasRealGps = true;
      if (!appState.myUser.loggedIn) {
        appState.myUser.loggedIn = true;
        if (!appState.myUser.name) appState.myUser.name = '路人車神';
      }
      saveMyUserToStorage();
      publishMyPresence();
      refreshMainMarkers();
      updateRealMapOverlays();
      syncUI();
      fetchAndDisplayReverseAddress(lat, lng);
      window.soundEngine.playPing();
      showToast('📍 精確釘選完成！', `已將您的位置定位於點選處：${lat.toFixed(6)}, ${lng.toFixed(6)}`, 'emerald');
      appState.pinpointMode = false;
      updatePinpointBtnUI();
    }
  });

  refreshMainMarkers();
  renderFriendMapMarkers();
  updateRealMapOverlays();
  fetchAndDisplayReverseAddress(appState.myUser.lat, appState.myUser.lng);
}

function refreshMainMarkers() {
  if (!leafletMap) return;
  if (userMarker) {
    leafletMap.removeLayer(userMarker);
    userMarker = null;
  }

  // PRIVACY GUARANTEE: If user has not logged in, DO NOT put any user marker on the map!
  if (!appState.myUser.loggedIn) {
    renderFriendMapMarkers();
    return;
  }

  const userIcon = L.divIcon({
    className: 'custom-user-marker',
    html: `
      <div class="relative flex flex-col items-center cursor-pointer group" style="width:70px;">
        <div class="relative flex items-center justify-center">
          <div class="absolute inset-0 rounded-full bg-teal-400/40 marker-pulse"></div>
          <div class="w-11 h-11 rounded-full bg-teal-400 border-2 border-white flex items-center justify-center text-lg shadow-[0_0_20px_#2DD4BF] relative z-10">🛡️</div>
          <span class="absolute -top-1 -right-1 px-1 rounded bg-black/85 text-[8px] font-mono text-emerald-300 font-bold z-20 border border-emerald-400/50">🔒 定位鎖定</span>
        </div>
        <div class="whitespace-nowrap px-2 py-0.5 rounded-full bg-[#070B19]/95 border border-teal-300 text-[10px] font-bold text-teal-200 shadow mt-1 z-20">
          🛡️ ${appState.myUser.name} (我)
        </div>
      </div>`,
    iconSize: [70, 75],
    iconAnchor: [35, 38]
  });

  userMarker = L.marker([appState.myUser.lat, appState.myUser.lng], {
    icon: userIcon,
    zIndexOffset: 1200,
    draggable: false
  }).addTo(leafletMap);

  userMarker.bindTooltip(`<b>${appState.myUser.name} (您)</b><br/>🛰️ 衛星 GPS 即時定位鎖定中<br/><i>座標隨真實定位自動更新</i>`, { direction: 'top' });
  userMarker.on('click', () => {
    if (leafletMap) leafletMap.flyTo([appState.myUser.lat, appState.myUser.lng], 17, { duration: 0.6 });
    if (window.soundEngine) window.soundEngine.playPing();
  });

  renderFriendMapMarkers();
}

function renderFriendMapMarkers() {
  if (!leafletMap) return;
  friendMarkers.forEach((m) => leafletMap.removeLayer(m));
  friendMarkers = [];

  appState.friends.forEach((f) => {
    if (isNaN(f.lat) || isNaN(f.lng)) return;
    const isSelected = appState.selectedFriendId === f.id;
    const friendIcon = L.divIcon({
      className: 'custom-friend-map-marker',
      html: `
        <div class="relative flex flex-col items-center cursor-pointer group" style="width:70px;">
          <div class="relative flex items-center justify-center">
            ${isSelected ? '<div class="absolute inset-0 rounded-full bg-rose-500/60 marker-pulse"></div>' : ''}
            <img src="${f.avatar || 'assets/sanbao_chicken_avatar.jpg'}" onerror="this.src='assets/sanbao_avatar.jpg'" class="w-12 h-12 rounded-full object-cover border-2 ${isSelected ? 'border-amber-300 shadow-[0_0_22px_#F59E0B]' : 'border-rose-400 shadow-[0_0_12px_rgba(244,63,94,0.6)]'} bg-slate-900 relative z-10 transition-transform group-hover:scale-110" />
            <span class="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border border-white text-[8px] flex items-center justify-center font-bold text-white z-20">🟢</span>
          </div>
          <div class="whitespace-nowrap px-2 py-0.5 rounded-full bg-[#070B19]/95 border ${isSelected ? 'border-amber-300 text-amber-200' : 'border-rose-400/80 text-rose-200'} text-[10px] font-bold shadow-lg mt-1 z-20">
            ${f.name} (${f.plate || '好友'})
          </div>
        </div>`,
      iconSize: [70, 75],
      iconAnchor: [35, 38]
    });

    const m = L.marker([f.lat, f.lng], { icon: friendIcon, zIndexOffset: isSelected ? 1000 : 800 }).addTo(leafletMap);
    m.bindTooltip(`<b>${f.name} (${f.plate})</b><br/>${f.sosMsg}<br/><i>點擊鎖定追蹤此好友</i>`, { direction: 'top' });
    m.on('click', () => window.confirmAndLocateFriend(f.id));
    friendMarkers.push(m);
  });
}

function updateRealMapOverlays() {
  if (!leafletMap) return;
  const sc = SCENARIOS[appState.scenario] || SCENARIOS.roundabout;
  const metrics = computeTacticalMetrics();
  const isLoggedIn = !!appState.myUser.loggedIn;
  const isTrackingFriend = !!appState.selectedFriendId;

  // In Visitor Preview Mode without a selected friend:
  // Hide all user-specific blast and accuracy circles (privacy & clean preview guarantee!)
  if (!isLoggedIn && !isTrackingFriend) {
    if (userAccuracyCircle) userAccuracyCircle.setStyle({ opacity: 0, fillOpacity: 0 });
    if (innerBlastCircle) innerBlastCircle.setStyle({ opacity: 0, fillOpacity: 0 });
    if (outerDeceptionCircle) outerDeceptionCircle.setStyle({ opacity: 0, fillOpacity: 0 });
    if (tetherPolyline) tetherPolyline.setLatLngs([]);
    return;
  }

  const uPos = [appState.myUser.lat, appState.myUser.lng];

  if (userMarker && isLoggedIn) {
    userMarker.setLatLng(uPos);
  }

  if (userAccuracyCircle) {
    if (isLoggedIn) {
      userAccuracyCircle.setLatLng(uPos);
      userAccuracyCircle.setRadius(Math.max(12, appState.myUser.accuracy || 15));
      userAccuracyCircle.setStyle({ opacity: 1, fillOpacity: 0.15, color: '#2DD4BF', fillColor: '#2DD4BF' });
    } else {
      userAccuracyCircle.setStyle({ opacity: 0, fillOpacity: 0 });
    }
  }

  const target = getTrackedProfile();
  const tPos = [target.lat || uPos[0], target.lng || uPos[1]];

  if (targetMarker && isTrackingFriend) {
    targetMarker.setLatLng(tPos);
  }

  const innerMeters = Math.max(60, metrics.effectiveRadius * 320);
  if (innerBlastCircle) {
    innerBlastCircle.setLatLng(tPos);
    innerBlastCircle.setRadius(innerMeters);
    innerBlastCircle.setStyle({ color: sc.color, fillColor: sc.color, opacity: 1, fillOpacity: 0.15 });
  }

  if (outerDeceptionCircle) {
    outerDeceptionCircle.setLatLng(tPos);
    outerDeceptionCircle.setRadius(innerMeters * 1.45);
    outerDeceptionCircle.setStyle({ opacity: 1, fillOpacity: 0.05, color: '#FEF08A', fillColor: '#F59E0B' });
  }

  if (tetherPolyline) {
    tetherPolyline.setLatLngs(isTrackingFriend && isLoggedIn ? [tPos, uPos] : []);
  }
}

window.setMapStyle = function (style) {
  if (!leafletMap) return;
  window.closeRealStreetViewPanorama();
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

window.useRealBrowserGPS = function (options = {}) {
  const silent = typeof options === 'boolean' ? options : !!(options && options.silent);
  if (!navigator.geolocation) {
    if (!silent) showToast('⚠️ 瀏覽器不支援定位', '請使用搜尋欄輸入地標定位！', 'red');
    return;
  }
  if (!silent) {
    window.soundEngine.playPing();
    showToast('🛰️ 正在抓取最高精確度 GPS 定位...', '請在瀏覽器彈窗中點選「允許」位置權限', 'cyan');
  }

  const handlePosition = (pos, source = 'GPS') => {
    const { latitude, longitude, accuracy } = pos.coords;
    if (accuracy && accuracy > 5000) return; // filter obvious junk

    appState.myUser.lat = latitude;
    appState.myUser.lng = longitude;
    appState.myUser.accuracy = Math.round(accuracy || 5);
    appState.myUser.hasRealGps = true;
    saveMyUserToStorage();
    if (appState.myUser.loggedIn) publishMyPresence();

    // ALWAYS move map when GPS fix arrives or user explicitly requests GPS
    if (leafletMap && (!appState.selectedFriendId || !silent)) {
      leafletMap.setView([latitude, longitude], 17, { animate: true });
    }
    if (appState.streetViewOpen) {
      updateStreetViewIframe(latitude, longitude, '我的真實位置');
    }
    refreshMainMarkers();
    updateRealMapOverlays();
    syncUI();
    fetchAndDisplayReverseAddress(latitude, longitude);

    if (!silent && source === 'High-GPS') {
      showToast('🎯 GPS 衛星精準定位成功！', `座標: ${latitude.toFixed(6)}, ${longitude.toFixed(6)} (精度 ±${appState.myUser.accuracy}m)`, 'emerald');
    }
  };

  // 1. Try high accuracy satellite GPS first
  navigator.geolocation.getCurrentPosition(
    (pos) => handlePosition(pos, 'High-GPS'),
    (err) => {
      console.warn('High-accuracy GPS timeout/err, falling back to network triangulation:', err);
      // 2. Fallback to network/wifi/cell triangulation (fast & works indoors!)
      navigator.geolocation.getCurrentPosition(
        (pos) => handlePosition(pos, 'Network'),
        (err2) => {
          console.warn('All geolocation failed:', err2);
          if (!silent) {
            if (err2.code === 1) {
              showToast('🔒 位置權限未開啟', '請點擊網址列旁的鎖頭 🔒，開啟「位置」權限並重整，或點選下方城市按鈕進行定位！', 'red');
            } else {
              showToast('⚠️ 室內 GPS 信號較弱', '可點擊「GPS 即時重新校準」或點選下方城市按鈕定位！', 'amber');
            }
          }
        },
        { enableHighAccuracy: false, timeout: 8000, maximumAge: 60000 }
      );
    },
    { enableHighAccuracy: true, timeout: 7000, maximumAge: 0 }
  );

  // 3. Continuous high-frequency watch to keep live subscription streaming
  if (appState.beaconWatchId) {
    navigator.geolocation.clearWatch(appState.beaconWatchId);
  }
  appState.beaconWatchId = navigator.geolocation.watchPosition(
    (pos) => {
      handlePosition(pos, 'Watch');
    },
    () => {},
    { enableHighAccuracy: true, maximumAge: 3000 }
  );
};

window.searchMapLocation = async function (e) {
  e.preventDefault();
  const input = document.getElementById('map-search-input');
  const query = input?.value.trim();
  if (!query) return;

  window.soundEngine.playPing();
  showToast('🔍 正在搜尋台灣精確地址與路名...', `查詢：「${query}」`, 'cyan');

  try {
    // Strictly restrict search to Taiwan (countrycodes=tw, viewbox bounds)
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&countrycodes=tw&limit=1&accept-language=zh-TW`;
    const res = await fetch(url);
    const data = await res.json();
    if (data && data.length > 0) {
      const lat = parseFloat(data[0].lat);
      const lng = parseFloat(data[0].lon);
      appState.myUser.lat = lat;
      appState.myUser.lng = lng;
      appState.myUser.hasRealGps = true;
      saveMyUserToStorage();
      if (appState.myUser.loggedIn) publishMyPresence();

      if (leafletMap) leafletMap.flyTo([lat, lng], 17, { duration: 0.9 });
      if (appState.streetViewOpen) {
        updateStreetViewIframe(lat, lng, query);
      }
      refreshMainMarkers();
      updateRealMapOverlays();
      syncUI();
      fetchAndDisplayReverseAddress(lat, lng);
      showToast('🎯 搜尋定位成功！', `${data[0].display_name.slice(0, 42)}...`, 'emerald');
      return;
    }
  } catch (err) {}

  showToast('⚠️ 找不到該地標', '請嘗試輸入更確切的路名或縣市（例如：台北101、新北板橋車站）', 'red');
};

// ============================================================================
// WORKING DIRECT LINE SHARE & FRIEND INVITE
// ============================================================================
window.inviteFriendViaLine = function () {
  window.soundEngine.playClick(880);
  const room = appState.myUser.roomCode || '8888';
  const myName = appState.myUser.name || '你的好友';
  const inviteUrl = `https://seanko31415.github.io/aegis-sanbao-radar/?room=${encodeURIComponent(room)}&uid=${encodeURIComponent(appState.myUser.id)}&name=${encodeURIComponent(myName)}&plate=${encodeURIComponent(appState.myUser.plate || '汽車')}&mode=${appState.scenario}&lat=${appState.myUser.lat.toFixed(5)}&lng=${appState.myUser.lng.toFixed(5)}&openExternalBrowser=1`;
  const msg = `🚨【損友三寶即時監測邀請】${myName} 邀請你加入即時防空雷達（連線房號 #${room}）！\n點開網址並按下「登入我的定位」，我們就能在雷達地圖上互相看到彼此的真實位置：\n${inviteUrl}`;

  try { navigator.clipboard?.writeText(msg); } catch (e) {}
  window.open(`https://line.me/R/share?text=${encodeURIComponent(msg)}`, '_blank', 'noopener,noreferrer');
  showToast('💬 已開啟 LINE 邀請好友！', `好友點開連結並登入房號 #${room} 後，你就能按「確定」看到他的位置！`, 'emerald');
};

function buildCurrentAlertShareText() {
  const box = document.getElementById('share-copy-textarea');
  if (box && box.value) return box.value;
  const sc = SCENARIOS[appState.scenario];
  const metrics = computeTacticalMetrics();
  const target = getTrackedProfile();
  const room = appState.myUser.roomCode || '8888';
  const shareUrl = `https://seanko31415.github.io/aegis-sanbao-radar/?room=${encodeURIComponent(room)}&name=${encodeURIComponent(target.name)}&plate=${encodeURIComponent(target.plate)}&mode=${appState.scenario}&lat=${target.lat.toFixed(5)}&lng=${target.lng.toFixed(5)}&openExternalBrowser=1`;
  return `🚨【損友三寶出車警報】「${target.name}」(${target.plate}) 目前狀態：【${sc.level}】警戒半徑 ${metrics.effectiveRadius}km！\n📡 點開查看即時定位與連線：\n${shareUrl}`;
}

window.shareDirectlyToLine = function () {
  window.soundEngine.playClick(880);
  updateSharePreviewText();
  const text = buildCurrentAlertShareText();
  try { navigator.clipboard?.writeText(text); } catch (e) {}
  window.open(`https://line.me/R/share?text=${encodeURIComponent(text)}`, '_blank', 'noopener,noreferrer');
  showToast('💬 已開啟 LINE 分享視窗！', '可選擇好友或群組直接傳送即時定位！', 'emerald');
};

window.shareMyDrivingLink = function (openLine = false) {
  window.soundEngine.playClick(880);
  const myName = document.getElementById('my-driver-name')?.value.trim() || appState.myUser.name || '我';
  const myPlate = document.getElementById('my-driver-plate')?.value.trim().toUpperCase() || appState.myUser.plate || '汽車';
  const room = document.getElementById('my-room-code')?.value.trim() || appState.myUser.roomCode || '8888';
  const url = `https://seanko31415.github.io/aegis-sanbao-radar/?room=${encodeURIComponent(room)}&uid=${encodeURIComponent(appState.myUser.id)}&name=${encodeURIComponent(myName)}&plate=${encodeURIComponent(myPlate)}&mode=${appState.scenario}&lat=${appState.myUser.lat.toFixed(5)}&lng=${appState.myUser.lng.toFixed(5)}&openExternalBrowser=1`;
  const msg = `🚨【損友三寶出車通知】${myName} (${myPlate}) 正在線上分享即時位置（房號 #${room}）！\n點開按「確定」即可查看我的即時位置：\n${url}`;

  try { navigator.clipboard?.writeText(msg); } catch (e) {}
  if (openLine) {
    window.open(`https://line.me/R/share?text=${encodeURIComponent(msg)}`, '_blank', 'noopener,noreferrer');
    showToast('💬 已開啟 LINE 傳送定位！', '選擇群組即可發送即時連線網址！', 'emerald');
  } else {
    showToast('📋 已複製邀請連線網址！', '傳給朋友打開並登入，就能在網站上互相看到位置！', 'emerald');
  }
};

// ============================================================================
// EXTRA INTERACTIVE COCKPIT PRANKS & TAROT DRAW
// ============================================================================
window.triggerCockpitAction = function (type) {
  const target = getTrackedProfile();
  if (type === 'horn') {
    window.soundEngine.playHorn();
    window.soundEngine.speak('叭叭叭！讓開讓開！我也不知道我現在要轉哪邊！');
    triggerAnimeCutIn('📯 驚慌連按喇叭！', '想按雨刷怎麼按到喇叭了啦！', '#F43F5E');
    showToast('📯 叭叭——！！', `${target.name} 驚慌中把喇叭當方向燈按！`, 'red');
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

  for (const p of pillars) {
    const dist = Math.hypot(g.carX - p.x, g.carY - p.y);
    if (dist < p.r + 19) {
      return { status: 'CRASH', pct: 0, msg: `💥 撞爆好市多【${p.label}】水泥柱！賠慘了！` };
    }
  }

  if (g.level === 3) {
    if (g.carX > 310 && (g.carY < 58 || g.carY > 192)) {
      return { status: 'CRASH', pct: 0, msg: '💥 擦撞隔壁百萬進口休旅車！' };
    }
  }

  if (g.level >= 2) {
    for (const c of g.carts) {
      const dist = Math.hypot(g.carX - c.x, g.carY - c.y);
      if (dist < 24) {
        return { status: 'CRASH', pct: 0, msg: `💥 撞翻【${c.label}】的好市多烤雞推車了！` };
      }
    }
  }

  if (g.carX < 28 || g.carX > 432 || g.carY < 24 || g.carY > 226) {
    return { status: 'CRASH', pct: 0, msg: '💥 擦撞 B2 地下室車道牆壁！' };
  }

  const bayCx = PARKING_BAY.x + PARKING_BAY.w / 2;
  const bayCy = PARKING_BAY.y + PARKING_BAY.h / 2;
  const distToCenter = Math.hypot(g.carX - bayCx, g.carY - bayCy);
  const rawPct = Math.max(0, Math.min(100, Math.round((1 - distToCenter / 260) * 115)));

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

function projectIso3D(x, y, z = 0) {
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

  ctx.fillStyle = topColor;
  ctx.beginPath();
  ctx.moveTo(topPts[0].sx, topPts[0].sy);
  for (let i = 1; i < 4; i++) ctx.lineTo(topPts[i].sx, topPts[i].sy);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
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

  const bgGrad = ctx.createLinearGradient(0, 0, 0, h);
  bgGrad.addColorStop(0, '#050814');
  bgGrad.addColorStop(0.3, '#0B132B');
  bgGrad.addColorStop(1, '#060916');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, w, h);

  if (g.viewMode === '3D') {
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

    draw3DExtrudedBox(ctx, 375, 32, 82, 34, 16, 0, '#1E293B', '#0F172A', 'rgba(148,163,184,0.4)');
    draw3DExtrudedBox(ctx, 375, 218, 82, 34, 16, 0, '#1E293B', '#0F172A', 'rgba(148,163,184,0.4)');

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

    const bodyColor = g.status === 'CRASH' ? '#E11D48' : g.status === 'WIN' ? '#14B8A6' : '#2563EB';
    const sideColor = g.status === 'CRASH' ? '#881337' : g.status === 'WIN' ? '#0F766E' : '#1E3A8A';
    draw3DExtrudedBox(ctx, g.carX, g.carY, 52, 30, 12, g.carAngle, bodyColor, sideColor, '#FEF08A');
    draw3DExtrudedBox(ctx, g.carX - Math.cos(rad) * 3, g.carY - Math.sin(rad) * 3, 28, 22, 20, g.carAngle, '#0F172A', '#1E293B', '#93C5FD');

    const rearL = projectIso3D(g.carX + Math.cos(rad) * 26 - Math.sin(rad) * 10, g.carY + Math.sin(rad) * 26 + Math.cos(rad) * 10, 8);
    const rearR = projectIso3D(g.carX + Math.cos(rad) * 26 + Math.sin(rad) * 10, g.carY + Math.sin(rad) * 26 - Math.cos(rad) * 10, 8);
    ctx.fillStyle = '#FF2E4C';
    ctx.beginPath(); ctx.arc(rearL.sx, rearL.sy, 3.5, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(rearR.sx, rearR.sy, 3.5, 0, Math.PI * 2); ctx.fill();

    const carTopPt = projectIso3D(g.carX, g.carY, 26);
    ctx.font = '900 10px "JetBrains Mono", monospace';
    ctx.fillStyle = '#FEF08A';
    ctx.textAlign = 'center';
    ctx.fillText(`🚗 ${g.gear}檔`, carTopPt.sx, carTopPt.sy);

    pillars.forEach((p) => {
      draw3DExtrudedBox(ctx, p.x, p.y, p.r * 1.8, p.r * 1.8, 34, 0, '#F43F5E', '#9F1239', '#FECDD3');
      const topP = projectIso3D(p.x, p.y, 38);
      ctx.font = '900 9px "Noto Sans TC", sans-serif';
      ctx.fillStyle = '#FDA4AF';
      ctx.textAlign = 'center';
      ctx.fillText(p.label, topP.sx, topP.sy);
    });

    // Mini Top-Down Radar PIP
    ctx.save();
    ctx.fillStyle = 'rgba(6, 9, 22, 0.88)';
    ctx.strokeStyle = 'rgba(254, 240, 138, 0.5)';
    ctx.lineWidth = 1.5;
    ctx.fillRect(10, 10, 96, 56);
    ctx.strokeRect(10, 10, 96, 56);
    const sx = 96 / w;
    const sy = 56 / h;
    ctx.strokeStyle = '#FEF08A';
    ctx.strokeRect(10 + PARKING_BAY.x * sx, 10 + PARKING_BAY.y * sy, PARKING_BAY.w * sx, PARKING_BAY.h * sy);
    ctx.fillStyle = '#F43F5E';
    pillars.forEach((p) => {
      ctx.beginPath();
      ctx.arc(10 + p.x * sx, 10 + p.y * sy, 2.5, 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.fillStyle = '#38BDF8';
    ctx.fillRect(10 + g.carX * sx - 4, 10 + g.carY * sy - 2.5, 8, 5);
    ctx.restore();
  } else {
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

  // Steering Wheel HUD
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

  ctx.fillStyle = 'rgba(6, 9, 22, 0.86)';
  ctx.fillRect(62, h - 28, w - 70, 22);
  ctx.font = '700 11px "Noto Sans TC", sans-serif';
  ctx.fillStyle = res.status === 'CRASH' ? '#FDA4AF' : res.status === 'WIN' ? '#5EEAD4' : '#FDE68A';
  ctx.textAlign = 'left';
  ctx.fillText(`${res.msg} (後距: ${g.rearDistCm}cm)`, 68, h - 13);
}

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
// TAB 2: 👥 真人好友監測清單 (ZERO VIRTUAL PEOPLE!)
// ============================================================================
function renderOnlineFriendPills() {
  const bar = document.getElementById('map-online-friends-pills');
  const countBadge = document.getElementById('nav-friend-count');
  if (countBadge) countBadge.textContent = appState.friends.length;
  if (!bar) return;

  if (appState.friends.length === 0) {
    bar.innerHTML = `
      <span class="text-amber-200/70 font-bold">👥 線上好友定位：</span>
      <button onclick="switchTab('squad')" class="px-2.5 py-0.5 rounded-lg bg-teal-400/20 border border-teal-300/40 text-teal-300 font-bold text-[11px]">
        ➕ 點此新增好友或邀朋友登入連線
      </button>`;
    return;
  }

  bar.innerHTML =
    `<span class="text-amber-200/70 font-bold">👥 點擊查看好友位置：</span>` +
    appState.friends
      .map((f) => {
        const isSel = f.id === appState.selectedFriendId;
        return `<button onclick="confirmAndLocateFriend('${f.id}')" class="px-2.5 py-0.5 rounded-lg font-bold text-[11px] transition-all ${
          isSel
            ? 'bg-gradient-to-r from-amber-300 to-yellow-500 text-slate-950 font-black shadow'
            : 'bg-blue-950/90 text-amber-200 border border-amber-300/40 hover:border-amber-300'
        }">🟢 ${f.name} ${f.confirmed ? '📍' : '(按確定查看)'}</button>`;
      })
      .join('');
}

function renderSquadFriendsList() {
  const container = document.getElementById('squad-friends-list');
  if (!container) return;

  if (appState.friends.length === 0) {
    container.innerHTML = `
      <div class="sm:col-span-2 p-6 rounded-2xl bg-[#060916]/80 border border-dashed border-amber-300/35 text-center space-y-2">
        <div class="text-2xl">📡</div>
        <div class="text-sm font-black text-amber-200">目前清單中還沒有好友（已移除所有虛擬人物）</div>
        <p class="text-xs text-slate-300 max-w-md mx-auto">
          請在上方輸入好友名字新增，或請朋友打開這個網站、輸入相同房號 <span class="text-teal-300 font-mono font-bold">#${appState.myUser.roomCode}</span> 並按下「登入我的定位」，他就會即時出現在這裡！
        </p>
      </div>`;
    return;
  }

  container.innerHTML = appState.friends
    .map((f) => {
      const sc = SCENARIOS[f.mode] || SCENARIOS.roundabout;
      const isSelected = f.id === appState.selectedFriendId;
      const avatarSrc = f.avatar || 'assets/sanbao_chicken_avatar.jpg';
      return `
      <div class="tarot-btn p-3.5 ${
        isSelected ? 'ring-2 ring-teal-300' : ''
      } flex flex-col justify-between gap-2.5">
        <div class="flex items-center gap-3">
          <img src="${avatarSrc}" onerror="this.src='assets/sanbao_avatar.jpg'" class="w-12 h-12 rounded-xl object-cover border border-amber-300 shrink-0" />
          <div class="min-w-0 flex-1 space-y-0.5">
            <div class="flex items-center justify-between gap-1">
              <span class="font-black text-sm text-white truncate">${f.name}</span>
              <span class="px-2 py-0.5 rounded-full text-[10px] font-mono font-black text-slate-950 shrink-0" style="background:${sc.color}">
                ${sc.level}
              </span>
            </div>
            <div class="text-[11px] text-amber-300/90 font-mono">${f.plate} ・ ${f.online ? '🟢 線上定位中' : '⚪ 等待好友登入更新'}</div>
            <div class="text-xs text-amber-100 font-bold truncate">${f.sosMsg}</div>
          </div>
        </div>
        <div class="flex items-center gap-2 pt-1.5 border-t border-amber-300/20">
          <button onclick="confirmAndLocateFriend('${f.id}')" class="flex-1 py-1.5 rounded-xl bg-gradient-to-r from-teal-300 to-emerald-400 text-slate-950 font-black text-xs shadow active:scale-95">
            ✅ 確定查看他的位置
          </button>
          <button onclick="removeFriend('${f.id}')" class="px-2.5 py-1.5 rounded-xl bg-slate-900 border border-white/15 text-xs text-slate-400 hover:text-rose-400" title="移除好友">
            ✕
          </button>
        </div>
      </div>`;
    })
    .join('');
}

window.addFriendToSquad = async function (e) {
  e.preventDefault();
  const nameEl = document.getElementById('add-friend-name');
  const plateEl = document.getElementById('add-friend-plate');
  const locEl = document.getElementById('add-friend-location');

  const name = nameEl?.value.trim();
  const plate = plateEl?.value.trim().toUpperCase() || '好友座駕';
  const customLocation = locEl?.value.trim();

  if (!name) {
    showToast('⚠️ 請輸入好友名字', '請輸入好友的名字以新增至關注清單！', 'red');
    return;
  }

  window.soundEngine.playPing();
  const randomAvatar = DRIVER_AVATARS[Math.floor(Math.random() * DRIVER_AVATARS.length)].src;
  
  let targetLat = appState.myUser.lat;
  let targetLng = appState.myUser.lng;
  let statusNote = '📡 已加入關注（等待好友連線登入自動同步 GPS）';

  // If user provided a specific address or landmark, geocode it precisely
  if (customLocation) {
    showToast('🔍 解析好友所在位置...', `正在精確定位「${customLocation}」`, 'cyan');
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(customLocation)}&limit=1&accept-language=zh-TW`);
      const data = await res.json();
      if (data && data.length > 0) {
        targetLat = parseFloat(data[0].lat);
        targetLng = parseFloat(data[0].lon);
        statusNote = `📍 鎖定地標: ${customLocation}`;
      }
    } catch (err) {}
  }

  const newFriend = {
    id: 'f_' + Date.now(),
    name,
    plate,
    mode: 'roundabout',
    avatar: randomAvatar,
    lat: targetLat,
    lng: targetLng,
    sosMsg: statusNote,
    online: false,
    confirmed: true,
    updatedAt: Date.now()
  };

  appState.friends.unshift(newFriend);
  appState.selectedFriendId = newFriend.id;
  saveFriendsToStorage();
  renderSquadFriendsList();
  renderOnlineFriendPills();
  refreshMainMarkers();
  renderFriendMapMarkers();
  updateRealMapOverlays();
  syncUI();

  if (nameEl) nameEl.value = '';
  if (plateEl) plateEl.value = '';
  if (locEl) locEl.value = '';

  window.switchTab('radar');
  if (leafletMap) {
    leafletMap.flyTo([targetLat, targetLng], 17, { duration: 0.9 });
  }
  showToast(`✅ 好友【${name}】已精準鎖定！`, statusNote, 'emerald');
};

window.removeFriend = function (friendId) {
  window.soundEngine.playClick(600);
  appState.friends = appState.friends.filter((f) => f.id !== friendId);
  if (appState.selectedFriendId === friendId) {
    appState.selectedFriendId = appState.friends[0]?.id || null;
  }
  saveFriendsToStorage();
  renderSquadFriendsList();
  renderOnlineFriendPills();
  refreshMainMarkers();
  renderFriendMapMarkers();
  updateRealMapOverlays();
  syncUI();
};

window.clearAllFriends = function () {
  window.soundEngine.playClick(520);
  appState.friends = [];
  appState.selectedFriendId = null;
  saveFriendsToStorage();
  renderSquadFriendsList();
  renderOnlineFriendPills();
  refreshMainMarkers();
  renderFriendMapMarkers();
  updateRealMapOverlays();
  syncUI();
  showToast('🗑️ 已清空好友清單', '可隨時重新新增好友或等待朋友登入！', 'amber');
};

window.broadcastDriverSOS = function (sosType) {
  const myName = document.getElementById('my-driver-name')?.value.trim() || appState.myUser.name;
  const myPlate = document.getElementById('my-driver-plate')?.value.trim().toUpperCase() || appState.myUser.plate || '我的座駕';

  if (!myName) {
    window.openLoginModal();
    return;
  }

  appState.myUser.name = myName;
  appState.myUser.plate = myPlate;
  appState.myUser.loggedIn = true;

  const mapConfig = {
    parking: { mode: 'parking', msg: '🚨「我要開始倒車入庫了！方圓 3km 快移車！」' },
    lost: { mode: 'roundabout', msg: '🔄「救命我卡在圓環繞第 7 圈出不去！」' },
    wiper: { mode: 'snack', msg: '🌧️「我想轉彎卻一直刷雨刷！別看我方向燈！」' },
    safe: { mode: 'home', msg: '🏠「我終於平安停好車了！全城解除警報！」' }
  }[sosType];

  appState.scenario = mapConfig.mode;
  appState.myUser.mode = mapConfig.mode;
  appState.myUser.sosMsg = mapConfig.msg;
  appState.chaosIndex = SCENARIOS[mapConfig.mode].baseChaos;

  saveMyUserToStorage();
  publishMyPresence();
  refreshMainMarkers();
  updateRealMapOverlays();
  syncUI();

  if (sosType === 'safe') window.soundEngine.playPing();
  else window.soundEngine.playSiren();

  document.getElementById('presidential-alert-title').textContent = `${myName} (${myPlate}) 向全體好友發出警報！`;
  document.getElementById('presidential-alert-desc').textContent = mapConfig.msg;
  document.getElementById('modal-presidential-alert')?.classList.remove('hidden');
};

// ============================================================================
// UI SYNC & RESPONSIVE TABS
// ============================================================================
function syncUI() {
  const sc = SCENARIOS[appState.scenario] || SCENARIOS.roundabout;
  const metrics = computeTacticalMetrics();
  const target = getTrackedProfile();

  const isLoggedIn = !!appState.myUser.loggedIn;
  const isTrackingFriend = !!appState.selectedFriendId;

  // Header login button state
  const headerBtn = document.getElementById('header-login-btn');
  if (headerBtn) {
    if (isLoggedIn) {
      headerBtn.textContent = `🟢 ${appState.myUser.name} (#${appState.myUser.roomCode || '8888'})`;
      headerBtn.className = 'px-2.5 sm:px-3 py-1.5 rounded-xl bg-slate-900 border border-teal-300/40 text-teal-300 text-xs font-bold';
    } else {
      headerBtn.textContent = '👤 手動輸入名字登入';
      headerBtn.className = 'px-2.5 sm:px-3 py-1.5 rounded-xl bg-gradient-to-r from-teal-400 to-emerald-500 text-slate-950 text-xs font-black shadow-[0_0_14px_rgba(45,212,191,0.5)] animate-pulse';
    }
  }

  // Toggle quick visitor form vs logged in actions
  const visitorQuickForm = document.getElementById('visitor-quick-form');
  const loggedInActions = document.getElementById('logged-in-actions');
  if (visitorQuickForm) visitorQuickForm.classList.toggle('hidden', isLoggedIn);
  if (loggedInActions) loggedInActions.classList.toggle('hidden', !isLoggedIn);

  const switchSelfBtn = document.getElementById('vip-switch-self-btn');
  if (switchSelfBtn) {
    switchSelfBtn.classList.toggle('hidden', !isTrackingFriend);
  }

  const nameEl = document.getElementById('vip-name');
  const plateEl = document.getElementById('vip-plate');
  const avatarBadge = document.getElementById('vip-avatar-badge');
  if (nameEl && plateEl) {
    if (isTrackingFriend) {
      nameEl.textContent = target.name;
      nameEl.title = `正在追蹤好友 ${target.name}，點此可改自己的名字`;
      plateEl.textContent = `🚨 追蹤好友: ${target.plate}`;
      if (avatarBadge) avatarBadge.textContent = '🚨 鎖定好友';
    } else if (isLoggedIn) {
      nameEl.textContent = appState.myUser.name;
      nameEl.title = `點擊直接修改我的駕駛暱稱`;
      plateEl.textContent = `🛡️ 我的座駕: ${appState.myUser.plate || '未填寫'}`;
      if (avatarBadge) avatarBadge.textContent = DRIVER_AVATARS[appState.avatarIndex % DRIVER_AVATARS.length].badge;
    } else {
      nameEl.textContent = '訪客即時預覽中';
      nameEl.title = `點擊輸入暱稱登入`;
      plateEl.textContent = '👀 訪客預覽';
      if (avatarBadge) avatarBadge.textContent = '👀 訪客預覽';
    }
  }

  const bubbleEl = document.getElementById('vip-os-bubble');
  if (bubbleEl) {
    if (!isLoggedIn && !isTrackingFriend) {
      bubbleEl.textContent = '💭 自由預覽中・輸入暱稱可加入雷達';
    } else {
      bubbleEl.textContent = target.sosMsg || sc.osList[appState.osIndex % sc.osList.length];
    }
  }

  const vipImg = document.getElementById('vip-avatar-img');
  if (vipImg && target.avatar) vipImg.src = target.avatar;

  const bountyEl = document.getElementById('vip-bounty-badge');
  if (bountyEl) bountyEl.textContent = `懸賞 $${appState.bountyAmount.toLocaleString()}`;

  const coordEl = document.getElementById('gps-coord-readout');
  if (coordEl) {
    if (!isLoggedIn && !isTrackingFriend) {
      coordEl.textContent = '🛰️ 個人定位未開啟 (隱私保護中)';
    } else {
      coordEl.textContent = `🛰️ 座標: ${target.lat.toFixed(5)}°N, ${target.lng.toFixed(5)}°E`;
    }
  }
  const accEl = document.getElementById('gps-accuracy-badge');
  if (accEl) {
    if (!isLoggedIn && !isTrackingFriend) {
      accEl.textContent = `房號 #${appState.myUser.roomCode || '8888'} (訪客預覽)`;
    } else {
      accEl.textContent = `房號 #${appState.myUser.roomCode} (±${appState.myUser.accuracy || 8}m)`;
    }
  }

  document.getElementById('metric-blast-radius').textContent = `${metrics.effectiveRadius} km`;
  const userDistEl = document.getElementById('metric-user-dist');
  if (userDistEl) {
    if (!isLoggedIn && !isTrackingFriend) {
      userDistEl.textContent = '未定位';
      userDistEl.style.color = '#94A3B8';
    } else {
      userDistEl.textContent = `${metrics.distKm} km`;
      userDistEl.style.color = '#2DD4BF';
    }
  }

  const previewPill = document.getElementById('map-preview-floating-pill');
  if (previewPill) {
    previewPill.classList.toggle('hidden', isLoggedIn);
    previewPill.innerHTML = '<span class="w-2 h-2 rounded-full bg-teal-400 animate-pulse"></span><span>👀 訪客預覽・未定位</span>';
  }
  const survEl = document.getElementById('metric-survival-rate');
  survEl.textContent = `${metrics.survival}%`;
  survEl.style.color = metrics.survival < 40 ? '#F43F5E' : metrics.survival < 75 ? '#FEF08A' : '#2DD4BF';

  document.querySelectorAll('[data-scenario-btn]').forEach((btn) => {
    const active = btn.getAttribute('data-scenario-btn') === appState.scenario;
    btn.classList.toggle('ring-2', active);
    btn.classList.toggle('ring-amber-300', active);
    btn.classList.toggle('glass-active', active);
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

  if (appState.myUser.loggedIn) {
    appState.myUser.mode = key;
    appState.myUser.sosMsg = sc.osList[0].replace('💭', '');
    publishMyPresence();
  }

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
  const target = getTrackedProfile();
  const room = appState.myUser.roomCode || '8888';
  const shareUrl = `https://seanko31415.github.io/aegis-sanbao-radar/?room=${encodeURIComponent(room)}&name=${encodeURIComponent(target.name)}&plate=${encodeURIComponent(target.plate)}&mode=${appState.scenario}&lat=${target.lat.toFixed(5)}&lng=${target.lng.toFixed(5)}`;

  if (appState.shareStyle === 'defense') {
    box.value = `🚨【損友三寶出車警報】「${target.name}」(${target.plate}) 目前【${sc.level}】警戒半徑 ${metrics.effectiveRadius}km！\n📡 點開查看即時定位（房號 #${room}）：${shareUrl}`;
  } else if (appState.shareStyle === 'elder') {
    box.value = `🌸平安喜樂🌸 好友【${target.name}】開車出門囉 (${target.plate}) 🚗 看到他大晴天刷雨刷代表想轉彎，方圓 ${metrics.effectiveRadius}km 請多禮讓🙏\n📡 定位：${shareUrl}`;
  } else {
    box.value = `📺【快訊】馬路傳奇「${target.name}」(${target.plate}) 現蹤街頭！左轉燈連閃 3.8km + 晴天雨刷全開，請保持安全車距！\n📡 雷達：${shareUrl}`;
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

// ---------------------------------------------------------------------------
// 4. ANIMATED HIGH-TECH ANIME RADAR SCANNER & SIGHTINGS WALL
// ---------------------------------------------------------------------------
let hexagonAnimId = null;
let hexagonAngle = 0;

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
  const maxR = size * 0.35;
  const axes = [
    { label: '晴天雨刷', val: 98, color: '#38BDF8' },
    { label: '謎之自信', val: 100, color: '#FBBF24' },
    { label: '倒車時間', val: 96, color: '#FB7185' },
    { label: '方向燈誠信', val: 12, color: '#34D399' },
    { label: '絕對方向感', val: 15, color: '#818CF8' },
    { label: '副駕驚嚇度', val: 99, color: '#F43F5E' }
  ];

  function renderRadarFrame() {
    if (appState.activeTab !== 'dossier') {
      hexagonAnimId = null;
      return;
    }
    ctx.clearRect(0, 0, size, size);

    // 1. Concentric Hexagonal Grids
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
      ctx.strokeStyle = step === 1.0 ? 'rgba(254, 240, 138, 0.45)' : 'rgba(45, 212, 191, 0.12)';
      ctx.lineWidth = step === 1.0 ? 1.5 : 1;
      ctx.stroke();
    });

    // 2. Radial Axis Spokes
    axes.forEach((_, i) => {
      const a = (Math.PI * 2 * i) / 6 - Math.PI / 2;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(cx + Math.cos(a) * maxR, cy + Math.sin(a) * maxR);
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
      ctx.lineWidth = 1;
      ctx.stroke();
    });

    // 3. Rotating Cyber Radar Scanner Sweep
    hexagonAngle = (hexagonAngle + 0.026) % (Math.PI * 2);
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.arc(cx, cy, maxR, hexagonAngle - 0.45, hexagonAngle);
    ctx.closePath();
    const sweepGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, maxR);
    sweepGrad.addColorStop(0, 'rgba(45, 212, 191, 0.22)');
    sweepGrad.addColorStop(1, 'transparent');
    ctx.fillStyle = sweepGrad;
    ctx.fill();
    ctx.restore();

    // 4. Glowing Data Polygon with Subtle Vertex Pulse
    ctx.beginPath();
    axes.forEach((axis, i) => {
      const a = (Math.PI * 2 * i) / 6 - Math.PI / 2;
      const pulse = Math.sin(Date.now() * 0.003 + i) * 1.5;
      const r = Math.max(8, ((axis.val + pulse) / 100) * maxR);
      const x = cx + Math.cos(a) * r;
      const y = cy + Math.sin(a) * r;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.closePath();
    ctx.fillStyle = 'rgba(244, 63, 94, 0.32)';
    ctx.fill();
    ctx.strokeStyle = '#FEF08A';
    ctx.lineWidth = 2.2;
    ctx.shadowColor = '#F59E0B';
    ctx.shadowBlur = 9;
    ctx.stroke();
    ctx.shadowBlur = 0;

    // 5. High-Contrast Text Labels & Glowing Nodes
    axes.forEach((axis, i) => {
      const a = (Math.PI * 2 * i) / 6 - Math.PI / 2;
      const r = (axis.val / 100) * maxR;
      const vx = cx + Math.cos(a) * r;
      const vy = cy + Math.sin(a) * r;

      ctx.beginPath();
      ctx.arc(vx, vy, 3.5, 0, Math.PI * 2);
      ctx.fillStyle = '#FEF08A';
      ctx.fill();

      const lx = cx + Math.cos(a) * (maxR + 24);
      const ly = cy + Math.sin(a) * (maxR + 14);
      ctx.font = 'bold 10px "Noto Sans TC", sans-serif';
      ctx.fillStyle = axis.color;
      ctx.textAlign = 'center';
      ctx.fillText(`${axis.label} ${axis.val}`, lx, ly);
    });

    hexagonAnimId = requestAnimationFrame(renderRadarFrame);
  }

  if (hexagonAnimId) cancelAnimationFrame(hexagonAnimId);
  hexagonAnimId = requestAnimationFrame(renderRadarFrame);
}

function renderSightingsList() {
  const listEl = document.getElementById('sightings-wall-list');
  if (!listEl) return;
  listEl.innerHTML = appState.sightings
    .map(
      (item) => `
      <div class="p-3 rounded-xl bg-[#060916]/95 border border-amber-300/25 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 transition-all hover:border-amber-300/50">
        <div class="text-xs min-w-0">
          <div class="flex items-center gap-1.5 mb-0.5">
            <span class="font-black text-amber-300">📍 ${item.location}</span>
            <span class="text-[9px] font-mono text-teal-400/80">#即時爆料</span>
          </div>
          <p class="text-slate-200 font-medium leading-relaxed">${item.content}</p>
        </div>
        <div class="flex items-center gap-1.5 shrink-0">
          <button onclick="reactSighting('${item.id}', 'funny')" class="px-2 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 border border-amber-300/30 text-[11px] font-mono text-amber-200 active:scale-90 transition-transform" title="笑死">
            😂 ${item.funny || 0}
          </button>
          <button onclick="reactSighting('${item.id}', 'chicken')" class="px-2 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 border border-amber-300/30 text-[11px] font-mono text-yellow-300 active:scale-90 transition-transform" title="賠雞腿">
            🍗 ${item.chicken || 0}
          </button>
          <button onclick="reactSighting('${item.id}', 'warn')" class="px-2 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 border border-rose-400/40 text-[11px] font-mono text-rose-300 active:scale-90 transition-transform" title="快逃">
            ⚠️ ${item.warn || 0}
          </button>
        </div>
      </div>`
    )
    .join('');
}

window.reactSighting = function (id, type) {
  const target = appState.sightings.find((s) => s.id === id);
  if (!target) return;
  if (!target[type]) target[type] = 0;
  target[type] += 1;
  saveSightingsToStorage();
  renderSightingsList();

  if (type === 'funny') window.soundEngine.playClick(920);
  else if (type === 'chicken') window.soundEngine.playWoodfish();
  else window.soundEngine.playHorn();

  const labels = { funny: '😂 爆笑 +1', chicken: '🍗 賠雞腿 +1', warn: '⚠️ 避難 +1' };
  showToast(labels[type] || '👍 互動已記錄', target.content.slice(0, 20) + '...', 'amber');
};

window.likeSighting = function (id) {
  window.reactSighting(id, 'funny');
};

window.submitNewSighting = function (e) {
  e.preventDefault();
  const location = document.getElementById('new-sighting-location')?.value.trim();
  const content = document.getElementById('new-sighting-content')?.value.trim();
  if (!location || !content) return;
  window.soundEngine.playPing();
  appState.sightings.unshift({ id: 's_' + Date.now(), location, content, funny: 1, chicken: 1, warn: 0 });
  saveSightingsToStorage();
  renderSightingsList();
  document.getElementById('new-sighting-location').value = '';
  document.getElementById('new-sighting-content').value = '';
  showToast('📸 爆料已發布', '感謝提供真實三寶目擊情報！', 'teal');
};

// ---------------------------------------------------------------------------
// 5. BGM & TACTICAL DEFENSE SHIELD & DECOYS
// ---------------------------------------------------------------------------
window.toggleMusicBGM = function () {
  const active = window.soundEngine.toggleBGM();
  const btn = document.getElementById('bgm-toggle-btn');
  if (btn) {
    btn.textContent = active ? '🎵 BGM: 開' : '🎵 BGM: 關';
    btn.classList.toggle('border-teal-300', active);
    btn.classList.toggle('text-teal-300', active);
  }
  showToast(active ? '🎵 背景音樂已開啟' : '🔇 背景音樂已關閉', 'Procedural Lo-fi Cyber Ambient 模式', 'teal');
};

window.toggleDefenseShield = function () {
  appState.shieldActive = !appState.shieldActive;
  const active = appState.shieldActive;
  window.soundEngine.playShieldOn();

  const btn = document.getElementById('shield-toggle-btn');
  const readout = document.getElementById('shield-status-readout');
  const badge = document.getElementById('defense-mode-badge');
  const ring = document.getElementById('shield-energy-ring');

  if (btn) btn.textContent = active ? '🛑 關閉力場' : '🛡️ 展開力場';
  if (readout) readout.textContent = active ? '⚡ 全境力場運轉中' : '⚡ 防護罩 100% 充能';
  if (badge) badge.textContent = active ? '🛡️ 全境力場：開啟中' : '🟢 全境力場：就緒';
  if (ring) {
    ring.classList.toggle('border-amber-300', active);
    ring.classList.toggle('shadow-[0_0_25px_#FDE68A]', active);
  }

  if (active) {
    showToast('🛡️ 三寶全境防護罩已啟動', '方圓 1.5km 內三寶半徑自動偏折！', 'teal');
    window.soundEngine.speak('全境三寶防護罩啟動，三寶半徑自動偏折！');
  } else {
    showToast('🛑 防護罩已休眠', '轉為待命節能模式', 'slate');
  }
};

window.launchDecoy = function (type) {
  window.soundEngine.playDecoyLaunch();
  const decoys = {
    chicken: { title: '🍗 投擲黃金脆皮雞腿！', desc: '成功吸引三寶目光，爭取 30 秒避難時間！' },
    wiper: { title: '🌧️ 發射大晴天雨刷干擾彈！', desc: '三寶陷入手忙腳亂誤刷雨刷狀態！' },
    horn: { title: '📢 發射超音波避難警報！', desc: '全體路人與副駕獲得聽覺結界加護！' },
    parking: { title: '🧲 生成路邊雙格大車位！', desc: '吸引三寶自動緩慢入庫，道路恢復暢通！' }
  };
  const d = decoys[type] || decoys.chicken;
  showToast(d.title, d.desc, 'amber');
};

// ---------------------------------------------------------------------------
// 6. MODALS & AUTHENTIC HEALING WOODFISH
// ---------------------------------------------------------------------------
window.openPresidentialAlert = function () {
  window.soundEngine.playSiren();
  document.getElementById('modal-presidential-alert')?.classList.remove('hidden');
};
window.closePresidentialAlert = function () {
  window.soundEngine.playClick(520);
  document.getElementById('modal-presidential-alert')?.classList.add('hidden');
};

window.openCopilotModal = function () {
  window.soundEngine.playWoodfish();
  document.getElementById('modal-copilot-sos')?.classList.remove('hidden');
};
window.closeCopilotModal = function () {
  window.soundEngine.playClick(520);
  document.getElementById('modal-copilot-sos')?.classList.add('hidden');
};

// Authentic Healing Merit Woodfish
window.knockCopilotWoodfish = function () {
  window.soundEngine.playWoodfish();
  appState.meritCount += 1;
  const countEl = document.getElementById('copilot-merit-count');
  if (countEl) countEl.textContent = appState.meritCount;

  // Natural wooden bounce animation on icon
  const icon = document.getElementById('woodfish-icon');
  if (icon) {
    icon.style.transform = 'scale(0.86) rotate(-8deg)';
    setTimeout(() => { icon.style.transform = ''; }, 110);
  }

  const zone = document.getElementById('woodfish-float-zone');
  if (zone) {
    const blessings = ['✨ 功德 +1', '📿 行車平安 +1', '🕊️ 遠離三寶 +1', '🌸 心平氣和 +1', '🪷 福慧增長 +1'];
    const blessing = blessings[appState.meritCount % blessings.length];
    zone.innerHTML = `<span class="text-xs font-mono font-black text-amber-300 animate-bounce">${blessing}</span>`;
  }
};

document.addEventListener('DOMContentLoaded', () => {
  loadPersistedData();
  renderVipStamps();
  renderSquadFriendsList();
  renderOnlineFriendPills();
  renderSightingsList();
  initRealGoogleMap();
  initRealtimeCloudSync();
  renderParkingMiniGame();
  requestAnimationFrame(updateParkingGameLoop);
  calculateRouteSafety(false);
  syncUI();

  // Pre-fill input with last known name if available, for user's convenience
  const quickInput = document.getElementById('quick-login-name');
  if (quickInput && appState.myUser.name) {
    quickInput.value = appState.myUser.name;
  }
  const modalName = document.getElementById('modal-login-name');
  if (modalName && appState.myUser.name) {
    modalName.value = appState.myUser.name;
  }

  // Tablet & Mobile Orientation / Resize auto-invalidation for Leaflet map tiles
  let resizeTimer = null;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      if (leafletMap) leafletMap.invalidateSize();
    }, 120);
  });

  // Continuous Keyboard Arrow Support for 3D Costco Parking Simulator!
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
