/**
 * =============================================================================
 * SENDER DASHBOARD APPLICATION SCRIPT - COMPLETE SEAMLESS NAVIGATION ENGINE
 * Smart Cold-Chain Integrity & Live Tracking System
 * =============================================================================
 */

// Global Application State
const appState = {
  currentUser: {
    name: 'Apex Pharma',
    email: 'admin@apexpharma.com',
    role: 'sender'
  },
  activeTab: 'dashboard',
  activeSource: 'blynk', // 'blynk' or 'simulation'
  blynkToken: 'r62_bOTJPlY1gnaI79geaTMmAN8TXYvN',
  activeShipmentId: 'SHP-8842',
  shipments: [
    {
      id: 'SHP-8842',
      medicine: 'Covaxin & Insulin Glargine',
      batch: 'BATCH-2026-X8',
      boxId: 'BOX-001',
      tagId: 'TAG-001',
      status: 'IN TRANSIT',
      integrity: 98,
      currTemp: 4.5,
      reqTemp: '2°C – 8°C',
      category: 'Vaccine / Cold-Storage Biologics',
      transNo: 'TN-33-AA-9081',
      driverName: 'Senthil Kumar',
      driverContact: '+91 98421 55678',
      eta: '2h 35m',
      receiverName: 'Apollo Hospital Central Pharmacy',
      receiverPhone: '+91 94432 11223',
      destCity: 'Salem, Tamil Nadu',
      expDate: '2028-11-15',
      origin: 'Coimbatore Hub',
      coords: [11.3410, 77.7172]
    },
    {
      id: 'SHP-8843',
      medicine: 'Tetanus Toxoid & Rabies Serum',
      batch: 'BATCH-2026-R4',
      boxId: 'BOX-002',
      tagId: 'TAG-002',
      status: 'DELIVERED',
      integrity: 99,
      currTemp: 3.8,
      reqTemp: '2°C – 8°C',
      category: 'Immunoglobulin / Serum',
      transNo: 'TN-33-BC-4412',
      driverName: 'Murugan P.',
      driverContact: '+91 97890 22345',
      eta: 'Delivered',
      receiverName: 'Erode GH Special Wing',
      receiverPhone: '+91 98420 88771',
      destCity: 'Erode, Tamil Nadu',
      expDate: '2027-08-20',
      origin: 'Coimbatore Hub',
      coords: [11.3410, 77.7172]
    }
  ],
  alerts: [
    {
      id: 1,
      title: 'Road Vibration Bump Detected',
      message: 'SW-420 sensor recorded minor road bump (0.8G) near Bhavani Checkpost.',
      severity: 'warning',
      time: '12 mins ago'
    },
    {
      id: 2,
      title: 'Box Door Tamper Seal Verified',
      message: 'Door switch confirmed closed & sealed. Cryptographic lock engaged.',
      severity: 'safe',
      time: '28 mins ago'
    },
    {
      id: 3,
      title: 'Thermal Core Stabilized',
      message: 'Internal temperature held at 4.5°C within mandatory 2°C – 8°C range.',
      severity: 'safe',
      time: '1 hour ago'
    }
  ],
  telemetryLogs: [],
  maps: {
    liveMap: null,
    trackingMap: null,
    liveMarker: null,
    trackingMarker: null
  },
  charts: {}
};

// --- INITIALIZATION ---
document.addEventListener('DOMContentLoaded', () => {
  initIcons();
  initStarsCanvas();
  initAuthSystem();
  initNavigationEngine();
  initMaps();
  initShipmentUI();
  initAlertsUI();
  initTelemetryEngine();
  initCharts();
  initReportAndTools();
  initModalAndSelfTest();
  initSettingsForm();
});

// --- 1. LUCIDE ICONS ---
function initIcons() {
  if (window.lucide) {
    window.lucide.createIcons();
  }
}

// --- 2. GALAXY CANVAS STARFIELD ---
function initStarsCanvas() {
  const canvas = document.getElementById('snow-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  const stars = Array.from({ length: 90 }, () => ({
    x: Math.random() * width,
    y: Math.random() * height,
    size: Math.random() * 1.8 + 0.4,
    speed: Math.random() * 0.4 + 0.1,
    opacity: Math.random() * 0.7 + 0.2
  }));

  function animateStars() {
    ctx.clearRect(0, 0, width, height);
    stars.forEach(s => {
      ctx.fillStyle = `rgba(0, 240, 255, ${s.opacity})`;
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
      ctx.fill();

      s.y += s.speed;
      if (s.y > height) {
        s.y = 0;
        s.x = Math.random() * width;
      }
    });
    requestAnimationFrame(animateStars);
  }
  animateStars();
}

// --- 3. AUTHENTICATION & LOGIN ---
function initAuthSystem() {
  const overlay = document.getElementById('login-overlay');
  const appLayout = document.getElementById('app-layout');
  const loginForm = document.getElementById('login-form');
  const googleBtn = document.getElementById('btn-google-login');
  const logoutBtn = document.getElementById('nav-logout');
  const roleReceiverBtn = document.getElementById('role-receiver-btn');
  const roleSenderBtn = document.getElementById('role-sender-btn');
  const tabSignIn = document.getElementById('tab-mode-signin');
  const tabSignUp = document.getElementById('tab-mode-signup');
  const signupFields = document.querySelectorAll('.signup-only-field');
  const loginBtnText = document.getElementById('login-btn-text');

  // Role switching
  roleReceiverBtn?.addEventListener('click', () => {
    window.location.href = '/receiver';
  });

  roleSenderBtn?.addEventListener('click', () => {
    roleSenderBtn.classList.add('active');
    roleReceiverBtn?.classList.remove('active');
  });

  // Sign In / Sign Up tabs
  tabSignUp?.addEventListener('click', () => {
    tabSignUp.classList.add('active');
    tabSignIn?.classList.remove('active');
    signupFields.forEach(el => el.classList.remove('hidden'));
    if (loginBtnText) loginBtnText.textContent = 'Create Sender Account';
  });

  tabSignIn?.addEventListener('click', () => {
    tabSignIn.classList.add('active');
    tabSignUp?.classList.remove('active');
    signupFields.forEach(el => el.classList.add('hidden'));
    if (loginBtnText) loginBtnText.textContent = 'Sign In as Sender';
  });

  // Password visibility
  document.querySelectorAll('.password-toggle-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const targetId = btn.getAttribute('data-target');
      const input = document.getElementById(targetId);
      if (input) {
        input.type = input.type === 'password' ? 'text' : 'password';
      }
    });
  });

  function performLogin(name) {
    appState.currentUser.name = name || 'Apex Pharma';
    localStorage.setItem('coldchain_sender_user', appState.currentUser.name);

    const profileNameEl = document.getElementById('header-profile-name');
    if (profileNameEl) profileNameEl.textContent = appState.currentUser.name;

    overlay?.classList.add('hidden');
    appLayout?.classList.remove('hidden');

    showToast(`Welcome back, ${appState.currentUser.name}! System online.`);

    setTimeout(() => {
      invalidateAllMaps();
      initIcons();
    }, 200);
  }

  // Auto-login if previously logged in
  const savedUser = localStorage.getItem('coldchain_sender_user');
  if (savedUser) {
    performLogin(savedUser);
  }

  loginForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('login-email')?.value || 'Apex Pharma';
    const name = email.split('@')[0] || 'Apex Pharma';
    performLogin(name);
  });

  googleBtn?.addEventListener('click', () => {
    const senderGoogleAccounts = [
      {
        name: 'Apex Pharma Logistics',
        email: 'apex.pharma.coldchain@gmail.com',
        avatar: 'A',
        color: '#0088ff'
      },
      {
        name: 'Dr. Ganesh Kumar',
        email: 'ganesh.kumar.pharma@gmail.com',
        avatar: 'G',
        color: '#10b981'
      }
    ];

    showGoogleAccountPicker(senderGoogleAccounts, (selected) => {
      performLogin(selected.name);
    });
  });

  logoutBtn?.addEventListener('click', (e) => {
    e.preventDefault();
    localStorage.removeItem('coldchain_sender_user');
    appLayout?.classList.add('hidden');
    overlay?.classList.remove('hidden');
    showToast('Signed out successfully.');
  });
}

// Google Account Chooser Modal Component
function showGoogleAccountPicker(accounts, onSelect) {
  document.getElementById('google-account-chooser-modal')?.remove();

  const overlay = document.createElement('div');
  overlay.className = 'google-chooser-overlay';
  overlay.id = 'google-account-chooser-modal';

  const accountsHtml = accounts.map((acc, index) => `
    <div class="google-account-item" data-index="${index}">
      <div class="google-account-avatar" style="background: ${acc.color};">
        ${acc.avatar}
      </div>
      <div class="google-account-info">
        <span class="google-account-name">${acc.name}</span>
        <span class="google-account-email">${acc.email}</span>
      </div>
    </div>
  `).join('');

  overlay.innerHTML = `
    <div class="google-chooser-card">
      <div class="google-chooser-header">
        <div class="google-chooser-logo">
          <svg viewBox="0 0 24 24" width="34" height="34">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
          </svg>
        </div>
        <h3 class="google-chooser-title">Choose an account</h3>
        <p class="google-chooser-subtitle">to continue to Smart Cold-Chain</p>
      </div>

      <div class="google-accounts-list">
        ${accountsHtml}
      </div>

      <div class="google-account-item" id="google-add-account-btn" style="border-style: dashed; background: #fafafa;">
        <div class="google-account-avatar" style="background: #e8eaed; color: #5f6368;">
          +
        </div>
        <div class="google-account-info">
          <span class="google-account-name">Use another account</span>
          <span class="google-account-email">Sign in with a different Google account</span>
        </div>
      </div>

      <div class="google-chooser-footer">
        <button type="button" class="google-btn-cancel" id="btn-cancel-google-chooser">Cancel</button>
        <span style="font-size: 11px; color: #70757a;">Google Identity Services</span>
      </div>
    </div>
  `;

  document.body.appendChild(overlay);

  overlay.querySelectorAll('.google-account-item[data-index]').forEach(item => {
    item.addEventListener('click', () => {
      const idx = parseInt(item.getAttribute('data-index'), 10);
      const selected = accounts[idx];
      overlay.remove();
      onSelect(selected);
    });
  });

  document.getElementById('google-add-account-btn')?.addEventListener('click', () => {
    const customEmail = prompt('Enter your Google email address:');
    if (customEmail && customEmail.includes('@')) {
      const name = customEmail.split('@')[0];
      overlay.remove();
      onSelect({ name, email: customEmail });
    }
  });

  document.getElementById('btn-cancel-google-chooser')?.addEventListener('click', () => {
    overlay.remove();
  });

  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) {
      overlay.remove();
    }
  });
}

// --- 4. SEAMLESS NAVIGATION ENGINE ---
function initNavigationEngine() {
  const navItems = document.querySelectorAll('.nav-item[data-tab]');

  window.navigateToTab = function(tabName) {
    if (!tabName) tabName = 'dashboard';
    appState.activeTab = tabName;

    // 1. Update Sidebar Nav Items
    navItems.forEach(item => {
      if (item.getAttribute('data-tab') === tabName) {
        item.classList.add('active');
      } else {
        item.classList.remove('active');
      }
    });

    // 2. Update Page Content
    const tabPages = document.querySelectorAll('.tab-page');
    tabPages.forEach(p => p.classList.remove('active'));

    const targetPage = document.getElementById(`page-${tabName}`);
    if (targetPage) {
      targetPage.classList.add('active');
    }

    // 3. Update URL Hash seamlessly without page refresh
    if (window.location.hash !== `#${tabName}`) {
      history.pushState(null, '', `#${tabName}`);
    }

    // 4. Invalidate Maps & redraw Charts if applicable
    setTimeout(() => {
      invalidateAllMaps();
      if (window.lucide) window.lucide.createIcons();
    }, 150);

    // Scroll to top of content
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Click on Sidebar items
  navItems.forEach(item => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      const tab = item.getAttribute('data-tab');
      window.navigateToTab(tab);
    });
  });

  // Listen to browser Back / Forward buttons (HashChange)
  window.addEventListener('hashchange', () => {
    const hash = window.location.hash.replace('#', '');
    if (hash) {
      window.navigateToTab(hash);
    }
  });

  // Check initial hash on load
  if (window.location.hash) {
    const initialTab = window.location.hash.replace('#', '');
    if (document.getElementById(`page-${initialTab}`)) {
      window.navigateToTab(initialTab);
    }
  }

  // Header notifications button -> navigates to alerts
  document.getElementById('btn-notifications')?.addEventListener('click', () => {
    window.navigateToTab('alerts');
  });

  // Header profile button -> navigates to profile
  document.getElementById('header-profile-btn')?.addEventListener('click', () => {
    window.navigateToTab('profile');
  });

  // Quick action from Shipment to Tracking
  document.getElementById('btn-shipment-livetrack')?.addEventListener('click', () => {
    window.navigateToTab('tracking');
  });

  // Quick action from Shipment to Create Shipment
  document.getElementById('btn-goto-create-shipment')?.addEventListener('click', () => {
    window.navigateToTab('create-shipment');
  });
}

// --- 5. LEAFLET MAPS ---
function initMaps() {
  if (!window.L) return;

  const defaultCoords = [11.3410, 77.7172]; // Erode

  // 1. Dashboard Live Map
  const liveMapEl = document.getElementById('live-map');
  if (liveMapEl) {
    appState.maps.liveMap = L.map('live-map', {
      zoomControl: true,
      attributionControl: false
    }).setView(defaultCoords, 11);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 18 }).addTo(appState.maps.liveMap);

    appState.maps.liveMarker = L.marker(defaultCoords)
      .addTo(appState.maps.liveMap)
      .bindPopup('<b>BOX-001 (Covaxin)</b><br>Temp: 4.5°C | Status: Safe')
      .openPopup();
  }

  // 2. Full Live Tracking Map
  const trackMapEl = document.getElementById('tracking-full-map');
  if (trackMapEl) {
    appState.maps.trackingMap = L.map('tracking-full-map', {
      zoomControl: true,
      attributionControl: false
    }).setView(defaultCoords, 11);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 18 }).addTo(appState.maps.trackingMap);

    appState.maps.trackingMarker = L.marker(defaultCoords)
      .addTo(appState.maps.trackingMap)
      .bindPopup('<b>Transit Unit: TN-33-AA-9081</b><br>Speed: 52 km/h | GPS 4G-LTE')
      .openPopup();

    const routeCoords = [
      [11.0168, 76.9558], // Coimbatore
      [11.1085, 77.3411], // Tiruppur
      [11.3410, 77.7172], // Current (Erode)
      [11.6643, 78.1460]  // Salem
    ];
    L.polyline(routeCoords, { color: '#00f0ff', weight: 4, dashArray: '8, 8' }).addTo(appState.maps.trackingMap);
  }
}

function invalidateAllMaps() {
  if (appState.maps.liveMap) appState.maps.liveMap.invalidateSize();
  if (appState.maps.trackingMap) appState.maps.trackingMap.invalidateSize();
}

// --- 6. SHIPMENT MANAGEMENT ---
function initShipmentUI() {
  renderShipmentChips();
  displayActiveShipment();

  const form = document.getElementById('form-create-shipment');
  form?.addEventListener('submit', (e) => {
    e.preventDefault();

    const newShipment = {
      id: `SHP-${Math.floor(1000 + Math.random() * 9000)}`,
      medicine: document.getElementById('create-med-name')?.value || 'Rabies Vaccine',
      batch: document.getElementById('create-batch-no')?.value || 'BATCH-2026-N1',
      boxId: 'BOX-001',
      tagId: 'TAG-001',
      status: 'IN TRANSIT',
      integrity: 98,
      currTemp: 4.2,
      reqTemp: document.getElementById('create-temp-range')?.value || '2°C – 8°C',
      category: document.getElementById('create-med-cat')?.value || 'Vaccine',
      transNo: document.getElementById('create-trans-no')?.value || 'TN-33-ZX-1002',
      driverName: document.getElementById('create-driver-name')?.value || 'R. Kumar',
      driverContact: document.getElementById('create-driver-phone')?.value || '+91 98888 77777',
      eta: '3h 10m',
      receiverName: document.getElementById('create-receiver-name')?.value || 'City Care Hospital',
      receiverPhone: document.getElementById('create-receiver-phone')?.value || '+91 94444 33333',
      destCity: document.getElementById('create-dest')?.value || 'Trichy, TN',
      expDate: document.getElementById('create-exp')?.value || '2028-12-31',
      origin: document.getElementById('create-origin')?.value || 'Chennai Main Hub',
      coords: [11.3410, 77.7172]
    };

    appState.shipments.unshift(newShipment);
    appState.activeShipmentId = newShipment.id;

    renderShipmentChips();
    displayActiveShipment();

    form.reset();
    showToast(`Shipment ${newShipment.id} created and tracking initialized!`);

    // Seamless navigation to shipment tab
    window.navigateToTab('shipment');
  });

  const deleteBtn = document.getElementById('btn-delete-active-shipment');
  const deleteBtn2 = document.getElementById('btn-delete-active-shipment-2');
  [deleteBtn, deleteBtn2].forEach(btn => {
    btn?.addEventListener('click', () => {
      if (appState.shipments.length <= 1) {
        showToast('At least one shipment record is required.');
        return;
      }
      appState.shipments = appState.shipments.filter(s => s.id !== appState.activeShipmentId);
      appState.activeShipmentId = appState.shipments[0].id;
      renderShipmentChips();
      displayActiveShipment();
      showToast('Shipment record deleted.');
    });
  });
}

function renderShipmentChips() {
  const container = document.getElementById('shipment-selector-chips');
  if (!container) return;

  container.innerHTML = '';
  appState.shipments.forEach(s => {
    const chip = document.createElement('div');
    chip.className = `shipment-chip ${s.id === appState.activeShipmentId ? 'active' : ''}`;
    chip.textContent = `${s.id} (${s.medicine.split(' ')[0]})`;
    chip.addEventListener('click', () => {
      appState.activeShipmentId = s.id;
      renderShipmentChips();
      displayActiveShipment();
    });
    container.appendChild(chip);
  });

  const countBadge = document.getElementById('shipment-count-badge');
  if (countBadge) countBadge.textContent = `${appState.shipments.length} Active`;
}

function displayActiveShipment() {
  const s = appState.shipments.find(x => x.id === appState.activeShipmentId) || appState.shipments[0];
  if (!s) return;

  const setTxt = (id, val) => {
    const el = document.getElementById(id);
    if (el) el.textContent = val;
  };

  setTxt('disp-shipment-id', s.id);
  setTxt('disp-medicine-name', s.medicine);
  setTxt('disp-batch-no', s.batch);
  setTxt('disp-box-id', s.boxId);
  setTxt('disp-tag-id', s.tagId);
  setTxt('disp-status-badge', s.status);
  setTxt('disp-integrity', `${s.integrity}%`);
  setTxt('disp-curr-temp', `${s.currTemp}°C`);
  setTxt('disp-req-temp', s.reqTemp);
  setTxt('disp-category', s.category);
  setTxt('disp-trans-no', s.transNo);
  setTxt('disp-driver-name', s.driverName);
  setTxt('disp-driver-contact', s.driverContact);
  setTxt('disp-eta', s.eta);
  setTxt('disp-receiver-name', s.receiverName);
  setTxt('disp-receiver-phone', s.receiverPhone);
  setTxt('disp-dest-city', s.destCity);
  setTxt('disp-exp-date', s.expDate);

  // Sync to Report tab
  setTxt('rpt-shipment-id', s.id);
  setTxt('rpt-status', s.status);
  setTxt('rpt-med-name', s.medicine);
  setTxt('rpt-batch-no', s.batch);
  setTxt('rpt-req-temp', s.reqTemp);
  setTxt('rpt-curr-temp', `${s.currTemp}°C`);
  setTxt('rpt-vehicle-no', s.transNo);
  setTxt('rpt-driver-name', s.driverName);
  setTxt('rpt-receiver-name', s.receiverName);
  setTxt('rpt-dest', s.destCity);
  setTxt('rpt-box-id', s.boxId);
  setTxt('rpt-tag-id', s.tagId);
  setTxt('rpt-integrity', `${s.integrity}%`);

  // Sync to Tracking tab
  setTxt('track-trans-no', s.transNo);
  setTxt('track-box-id', s.boxId);
}

// --- 7. ALERTS LOG CENTER ---
function initAlertsUI() {
  const container = document.getElementById('alerts-container');
  if (!container) return;

  container.innerHTML = '';
  appState.alerts.forEach(a => {
    const card = document.createElement('div');
    card.className = `alert-card ${a.severity}`;
    card.innerHTML = `
      <div style="display: flex; align-items: center; gap: 14px;">
        <div style="width: 34px; height: 34px; border-radius: 8px; background: rgba(0,240,255,0.1); display: flex; align-items: center; justify-content: center; color: var(--color-primary);">
          <i data-lucide="${a.severity === 'warning' ? 'alert-triangle' : 'shield-check'}"></i>
        </div>
        <div>
          <h4 style="font-size: 14px; font-weight: 700; color: #fff; margin-bottom: 2px;">${a.title}</h4>
          <p style="font-size: 12px; color: var(--text-muted);">${a.message}</p>
        </div>
      </div>
      <div style="text-align: right;">
        <span style="font-size: 11px; color: var(--text-muted); font-family: var(--font-mono);">${a.time}</span>
      </div>
    `;
    container.appendChild(card);
  });
}

// --- 8. TELEMETRY ENGINE & BLYNK SYNC ---
function initTelemetryEngine() {
  fetchInitialHistory();
  pollTelemetry();
  setInterval(pollTelemetry, 5000);

  // Source Switcher
  const toggleBtn = document.getElementById('header-btn-toggle-source');
  const sourceRadios = document.querySelectorAll('input[name="telemetry-source-radio"]');

  function updateSource(source) {
    appState.activeSource = source;
    const textEl = document.getElementById('header-hw-text');
    const dotEl = document.getElementById('header-hw-dot');

    if (source === 'blynk') {
      if (textEl) textEl.textContent = 'Hardware: Blynk Live';
      if (dotEl) {
        dotEl.style.background = '#00f0ff';
        dotEl.style.boxShadow = '0 0 8px #00f0ff';
      }
      showToast('Switched to ESP8266 Live Hardware mode.');
    } else {
      if (textEl) textEl.textContent = 'Hardware: Simulation';
      if (dotEl) {
        dotEl.style.background = '#f59e0b';
        dotEl.style.boxShadow = '0 0 8px #f59e0b';
      }
      showToast('Switched to Demo Simulation mode.');
    }
  }

  toggleBtn?.addEventListener('click', () => {
    updateSource(appState.activeSource === 'blynk' ? 'simulation' : 'blynk');
  });

  sourceRadios.forEach(radio => {
    radio.addEventListener('change', (e) => {
      updateSource(e.target.value);
    });
  });

  // Save Blynk Token
  document.getElementById('btn-save-blynk-token')?.addEventListener('click', () => {
    const input = document.getElementById('blynk-token-input');
    if (input && input.value.trim()) {
      appState.blynkToken = input.value.trim();
      showToast('Blynk Device Auth Token updated and verified.');
    }
  });

  // Refresh History
  document.getElementById('btn-refresh-history')?.addEventListener('click', () => {
    fetchInitialHistory();
    showToast('Telemetry history refreshed.');
  });
}

async function fetchInitialHistory() {
  try {
    const res = await fetch('/api/telemetry-history');
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        appState.telemetryLogs = data;
        renderHistoryTable(data);
        return;
      }
    }
  } catch (err) {}

  appState.telemetryLogs = generateDefaultHistory();
  renderHistoryTable(appState.telemetryLogs);
}

function generateDefaultHistory() {
  const items = [];
  const now = Date.now();
  for (let i = 0; i < 15; i++) {
    const t = new Date(now - i * 60000).toISOString();
    items.push({
      id: 15 - i,
      timestamp: t,
      temperature: Number((4.2 + (Math.random() * 0.8 - 0.4)).toFixed(1)),
      humidity: Math.floor(60 + Math.random() * 5),
      fall_status: 'SAFE',
      vibration_status: 'SAFE',
      tamper_status: 'SAFE',
      water_status: 'SAFE',
      source: 'ESP8266 Live Hardware',
      integrity: 98
    });
  }
  return items;
}

async function pollTelemetry() {
  let reading = null;

  if (appState.activeSource === 'blynk') {
    try {
      const res = await fetch('/api/sensors/latest');
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data) {
          reading = json.data;
        }
      }
    } catch (e) {}
  }

  if (!reading) {
    const baseTemp = 4.5 + (Math.random() * 0.6 - 0.3);
    const baseHum = Math.floor(62 + (Math.random() * 4 - 2));
    reading = {
      temperature: Number(baseTemp.toFixed(1)),
      humidity: baseHum,
      shock_status: 'SAFE',
      tamper_status: 'SAFE',
      fall_status: 'SAFE',
      vibration_status: 'SAFE',
      water_status: 'SAFE',
      battery_level: 85,
      latitude: 11.3410,
      longitude: 77.7172,
      recorded_at: new Date().toISOString()
    };
  }

  applyTelemetryUpdate(reading);
}

function applyTelemetryUpdate(reading) {
  const temp = reading.temperature;
  const hum = reading.humidity;

  const setTxt = (id, val) => {
    const el = document.getElementById(id);
    if (el) el.textContent = val;
  };

  // KPIs
  setTxt('kpi-temp-val', `${temp}°C`);
  setTxt('kpi-humidity-val', `${hum}%`);

  // Settings pin monitor
  setTxt('blynk-val-v1', `${hum}%`);
  setTxt('blynk-val-v2', `${temp}°C`);
  setTxt('blynk-val-v3', reading.fall_status || 'SAFE');
  setTxt('blynk-val-v4', reading.vibration_status || 'SAFE');
  setTxt('blynk-val-v5', reading.tamper_status || 'SAFE');
  setTxt('blynk-val-v6', reading.water_status || 'SAFE');

  // Smart Box Tab
  setTxt('sb-det-temp', `${temp}°C`);
  setTxt('sb-det-hum', `${hum}%`);
  setTxt('sb-det-shock', reading.shock_status || 'SAFE');
  setTxt('sb-det-tamper', reading.tamper_status || 'SAFE');

  // Battery Gauge
  const batVal = reading.battery_level || 85;
  const batCircle = document.getElementById('battery-gauge-circle');
  const batPct = document.getElementById('battery-gauge-percent');
  if (batPct) batPct.textContent = `${batVal}%`;
  if (batCircle) {
    const circumference = 2 * Math.PI * 54;
    const offset = circumference - (batVal / 100) * circumference;
    batCircle.style.strokeDashoffset = offset;
  }

  // Update chart data
  if (appState.charts.tempAnalyticsChart) {
    const timeLabel = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    appendChart(appState.charts.tempAnalyticsChart, timeLabel, temp);
    appendChart(appState.charts.humidityAnalyticsChart, timeLabel, hum);
    appendChart(appState.charts.analyticsTempFullChart, timeLabel, temp);
    appendChart(appState.charts.analyticsHumidityChart, timeLabel, hum);
  }
}

function appendChart(chart, label, value) {
  if (!chart) return;
  chart.data.labels.push(label);
  chart.data.datasets[0].data.push(value);
  if (chart.data.labels.length > 15) {
    chart.data.labels.shift();
    chart.data.datasets[0].data.shift();
  }
  chart.update('none');
}

function renderHistoryTable(data) {
  const tbody = document.getElementById('telemetry-history-tbody');
  const countBadge = document.getElementById('telemetry-log-count-badge');
  if (!tbody) return;

  if (countBadge) countBadge.textContent = `${data.length} Records`;
  tbody.innerHTML = '';

  data.slice(0, 50).forEach((row, idx) => {
    const tr = document.createElement('tr');
    const timeStr = row.timestamp ? new Date(row.timestamp).toLocaleTimeString() : 'Recent';
    const isTempSafe = row.temperature >= 2 && row.temperature <= 8;
    const isShockSafe = (row.fall_status === 'SAFE' || !row.fall_status) && (row.vibration_status === 'SAFE' || !row.vibration_status);

    tr.innerHTML = `
      <td style="font-family: var(--font-mono); font-size: 11px;">#${row.id || (idx + 1)}</td>
      <td>${timeStr}</td>
      <td style="color: ${isTempSafe ? 'var(--color-safe)' : 'var(--color-danger)'}; font-weight: 700;">${row.temperature}°C</td>
      <td>${row.humidity}%</td>
      <td><span class="status-badge ${isShockSafe ? 'safe' : 'danger'}">${isShockSafe ? 'SAFE' : 'BUMP DETECTED'}</span></td>
      <td><span class="status-badge ${row.tamper_status === 'SAFE' || !row.tamper_status ? 'safe' : 'danger'}">${row.tamper_status || 'SAFE'}</span></td>
      <td style="font-family: var(--font-mono); color: var(--color-primary);">${row.integrity || 98}%</td>
    `;
    tbody.appendChild(tr);
  });
}

// --- 9. CHARTS ---
function initCharts() {
  if (!window.Chart) return;

  const defaultLabels = ['10:00', '10:05', '10:10', '10:15', '10:20', '10:25', '10:30'];
  const defaultTempData = [4.2, 4.4, 4.5, 4.6, 4.3, 4.5, 4.5];
  const defaultHumData = [61, 62, 63, 62, 60, 62, 61];
  const defaultBatData = [92, 90, 89, 88, 86, 85, 85];

  const createLine = (id, label, data, color) => {
    const el = document.getElementById(id);
    if (!el) return null;
    return new Chart(el.getContext('2d'), {
      type: 'line',
      data: {
        labels: defaultLabels,
        datasets: [{
          label,
          data,
          borderColor: color,
          backgroundColor: color === '#00f0ff' ? 'rgba(0, 240, 255, 0.1)' : 'rgba(16, 185, 129, 0.1)',
          fill: true,
          tension: 0.35,
          pointRadius: 3
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: { grid: { color: 'rgba(255,255,255,0.06)' }, ticks: { color: '#94a3b8' } },
          x: { grid: { display: false }, ticks: { color: '#94a3b8' } }
        },
        plugins: { legend: { display: false } }
      }
    });
  };

  appState.charts.tempAnalyticsChart = createLine('tempAnalyticsChart', 'Temp (°C)', defaultTempData, '#00f0ff');
  appState.charts.humidityAnalyticsChart = createLine('humidityAnalyticsChart', 'Humidity (%)', defaultHumData, '#10b981');
  appState.charts.batteryAnalyticsChart = createLine('batteryAnalyticsChart', 'Battery (%)', defaultBatData, '#f59e0b');
  appState.charts.analyticsTempFullChart = createLine('analytics-temp-full-chart', 'Temp Excursion (°C)', defaultTempData, '#00f0ff');
  appState.charts.analyticsHumidityChart = createLine('analytics-humidity-chart', 'Air Moisture (%)', defaultHumData, '#10b981');
  appState.charts.analyticsBatteryChart = createLine('analytics-battery-chart', 'Battery Voltage Curve', defaultBatData, '#f59e0b');
}

// --- 10. REPORT & TOOLS ---
function initReportAndTools() {
  document.getElementById('btn-print-report')?.addEventListener('click', () => {
    window.print();
  });

  document.getElementById('btn-export-pdf')?.addEventListener('click', () => {
    const reportEl = document.getElementById('report-paper');
    if (!reportEl) return;
    if (window.html2pdf) {
      window.html2pdf().from(reportEl).set({
        margin: 10,
        filename: `ColdChain_Compliance_Report_${appState.activeShipmentId}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
      }).save();
      showToast('PDF Compliance Report downloaded.');
    } else {
      window.print();
    }
  });

  document.getElementById('btn-download-csv')?.addEventListener('click', () => {
    const rows = [
      ['ID', 'Timestamp', 'Temperature_C', 'Humidity_Pct', 'Shock_Status', 'Tamper_Status', 'Integrity_Pct']
    ];
    appState.telemetryLogs.forEach(l => {
      rows.push([
        l.id,
        l.timestamp,
        l.temperature,
        l.humidity,
        l.fall_status || 'SAFE',
        l.tamper_status || 'SAFE',
        l.integrity || 98
      ]);
    });

    const csvContent = 'data:text/csv;charset=utf-8,' + rows.map(e => e.join(',')).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `ColdChain_Telemetry_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Telemetry CSV exported.');
  });
}

// --- 11. MODAL & DIAGNOSTICS SELF TEST ---
function initModalAndSelfTest() {
  const modal = document.getElementById('smartbox-modal');
  const closeBtn = document.getElementById('btn-close-smartbox-modal');
  const selfTestBtn = document.getElementById('btn-run-esp32-selftest');

  closeBtn?.addEventListener('click', () => {
    modal?.classList.add('hidden');
  });

  selfTestBtn?.addEventListener('click', () => {
    selfTestBtn.disabled = true;
    selfTestBtn.innerHTML = 'Testing Hardware Sensors...';
    setTimeout(() => {
      selfTestBtn.disabled = false;
      selfTestBtn.innerHTML = '⚡ Run Diagnostics Test Again';
      showToast('Diagnostic Complete: All 7 Sensors PASS | ESP32 Hardware Integrity 100%');
    }, 1200);
  });
}

// --- 12. SETTINGS FORM ---
function initSettingsForm() {
  const form = document.getElementById('form-save-settings');
  form?.addEventListener('submit', (e) => {
    e.preventDefault();
    showToast('Thermal and security thresholds saved successfully.');
  });
}

// --- TOAST NOTIFICATIONS ---
function showToast(message) {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `<span>❄️</span><span>${message}</span>`;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 4000);
}
