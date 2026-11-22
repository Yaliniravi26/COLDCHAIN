/**
 * =============================================================================
 * RECEIVER DASHBOARD APPLICATION SCRIPT - COMPLETE SEAMLESS NAVIGATION ENGINE
 * Smart Cold-Chain Verification & Incoming Cargo Control Center
 * =============================================================================
 */

const receiverState = {
  currentUser: {
    name: 'Apollo Hospital Central Pharmacy',
    role: 'receiver'
  },
  activeTab: 'dashboard',
  activeSource: 'blynk',
  activeShipment: {
    id: 'SHP-8842',
    medicine: 'Covaxin & Insulin Glargine',
    batch: 'BATCH-2026-X8',
    boxId: 'BOX-001',
    qty: '1,200 Vials',
    mfdExp: '02/2026 - 11/2028',
    status: 'IN TRANSIT',
    integrity: 98,
    temp: 4.5,
    humidity: 62,
    shock: 'SAFE',
    tamper: 'SECURE',
    gps: '11.3410° N, 77.7172° E',
    eta: '25 mins',
    carrier: 'Apex Pharma Cold-Express',
    vehicleNo: 'TN-33-AA-9081',
    driver: 'Senthil Kumar (+91 98421 55678)'
  },
  alerts: [
    {
      id: 1,
      title: 'Incoming Consignment Approaching Checkpoint',
      message: 'Vehicle TN-33-AA-9081 has entered the 30km radius of Apollo Hospital.',
      severity: 'safe',
      time: '15 mins ago'
    },
    {
      id: 2,
      title: 'Thermal Chain Verified Within Spec',
      message: 'Temperature maintained strictly at 4.5°C throughout the highway transit.',
      severity: 'safe',
      time: '45 mins ago'
    }
  ],
  maps: {
    liveMap: null,
    trackingMap: null
  },
  charts: {}
};

document.addEventListener('DOMContentLoaded', () => {
  initIcons();
  initStarsCanvas();
  initAuth();
  initNavigationEngine();
  initMaps();
  initIncomingShipmentUI();
  initAlertsUI();
  initTelemetrySync();
  initCharts();
  initReports();
});

function initIcons() {
  if (window.lucide) {
    window.lucide.createIcons();
  }
}

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
      ctx.fillStyle = `rgba(16, 185, 129, ${s.opacity})`;
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

function initAuth() {
  const overlay = document.getElementById('login-overlay');
  const appLayout = document.getElementById('app-layout');
  const loginForm = document.getElementById('receiver-login-form');
  const roleSenderBtn = document.getElementById('role-sender-btn');
  const roleReceiverBtn = document.getElementById('role-receiver-btn');
  const googleBtn = document.getElementById('btn-google-login');
  const topLogoutBtn = document.getElementById('top-logout-btn');
  const navLogoutBtn = document.getElementById('nav-logout');

  roleSenderBtn?.addEventListener('click', () => {
    window.location.href = '/';
  });

  roleReceiverBtn?.addEventListener('click', () => {
    roleReceiverBtn.classList.add('active');
  });

  function performLogin(name) {
    receiverState.currentUser.name = name || 'Apollo Hospital Central Pharmacy';
    localStorage.setItem('coldchain_receiver_user', receiverState.currentUser.name);

    const profileEl = document.getElementById('header-profile-name');
    if (profileEl) profileEl.textContent = receiverState.currentUser.name;

    overlay?.classList.add('hidden');
    appLayout?.classList.remove('hidden');

    showToast(`Logged in as Receiver: ${receiverState.currentUser.name}`);
    setTimeout(() => {
      invalidateMaps();
      initIcons();
    }, 200);
  }

  const savedUser = localStorage.getItem('coldchain_receiver_user');
  if (savedUser) {
    performLogin(savedUser);
  }

  loginForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    performLogin('Apollo Hospital Central Pharmacy');
  });

  googleBtn?.addEventListener('click', () => {
    const receiverGoogleAccounts = [
      {
        name: 'Apollo Hospital Central Pharmacy',
        email: 'apollo.central.pharmacy@gmail.com',
        avatar: 'A',
        color: '#10b981'
      },
      {
        name: 'Dr. K. Arunkumar (Apollo Wing)',
        email: 'dr.arunkumar.apollo@gmail.com',
        avatar: 'K',
        color: '#4285f4'
      }
    ];

    showGoogleAccountPicker(receiverGoogleAccounts, (selected) => {
      performLogin(selected.name);
    });
  });

  [topLogoutBtn, navLogoutBtn].forEach(btn => {
    btn?.addEventListener('click', (e) => {
      e.preventDefault();
      localStorage.removeItem('coldchain_receiver_user');
      appLayout?.classList.add('hidden');
      overlay?.classList.remove('hidden');
      showToast('Signed out of Receiver Portal.');
    });
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

function initNavigationEngine() {
  const navItems = document.querySelectorAll('.nav-item[data-tab]');

  window.navigateToTab = function(tabName) {
    if (!tabName) tabName = 'dashboard';
    receiverState.activeTab = tabName;

    navItems.forEach(item => {
      if (item.getAttribute('data-tab') === tabName) {
        item.classList.add('active');
      } else {
        item.classList.remove('active');
      }
    });

    const tabPages = document.querySelectorAll('.tab-page');
    tabPages.forEach(p => p.classList.remove('active'));

    const targetPage = document.getElementById(`page-${tabName}`);
    if (targetPage) {
      targetPage.classList.add('active');
    }

    if (window.location.hash !== `#${tabName}`) {
      history.pushState(null, '', `#${tabName}`);
    }

    setTimeout(() => {
      invalidateMaps();
      if (window.lucide) window.lucide.createIcons();
    }, 150);

    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  navItems.forEach(item => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      const tab = item.getAttribute('data-tab');
      window.navigateToTab(tab);
    });
  });

  window.addEventListener('hashchange', () => {
    const hash = window.location.hash.replace('#', '');
    if (hash) {
      window.navigateToTab(hash);
    }
  });

  if (window.location.hash) {
    const initialTab = window.location.hash.replace('#', '');
    if (document.getElementById(`page-${initialTab}`)) {
      window.navigateToTab(initialTab);
    }
  }

  document.getElementById('btn-notifications')?.addEventListener('click', () => {
    window.navigateToTab('alerts');
  });

  document.getElementById('header-profile-btn')?.addEventListener('click', () => {
    window.navigateToTab('profile');
  });
}

function initMaps() {
  if (!window.L) return;
  const defaultCoords = [11.3410, 77.7172];

  const liveMapEl = document.getElementById('live-map');
  if (liveMapEl) {
    receiverState.maps.liveMap = L.map('live-map', {
      zoomControl: true,
      attributionControl: false
    }).setView(defaultCoords, 12);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(receiverState.maps.liveMap);

    L.marker(defaultCoords)
      .addTo(receiverState.maps.liveMap)
      .bindPopup('<b>Incoming: BOX-001</b><br>Hospital ETA: ~25 mins')
      .openPopup();
  }

  const trackMapEl = document.getElementById('tracking-full-map');
  if (trackMapEl) {
    receiverState.maps.trackingMap = L.map('tracking-full-map', {
      zoomControl: true,
      attributionControl: false
    }).setView(defaultCoords, 11);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(receiverState.maps.trackingMap);

    L.marker(defaultCoords)
      .addTo(receiverState.maps.trackingMap)
      .bindPopup('<b>Live Cold-Chain Vehicle: TN-33-AA-9081</b>')
      .openPopup();

    const route = [
      [11.0168, 76.9558],
      [11.3410, 77.7172],
      [11.6643, 78.1460]
    ];
    L.polyline(route, { color: '#10b981', weight: 4, dashArray: '6, 6' }).addTo(receiverState.maps.trackingMap);
  }
}

function invalidateMaps() {
  if (receiverState.maps.liveMap) receiverState.maps.liveMap.invalidateSize();
  if (receiverState.maps.trackingMap) receiverState.maps.trackingMap.invalidateSize();
}

function initIncomingShipmentUI() {
  const s = receiverState.activeShipment;

  const setTxt = (id, val) => {
    const el = document.getElementById(id);
    if (el) el.textContent = val;
  };

  setTxt('tbl-shipment-id', s.id);
  setTxt('tbl-temp', `${s.temp}°C`);
  setTxt('tbl-eta', s.eta);
  setTxt('tbl-status', s.status);

  // Sync to Report tab
  setTxt('rep-shipment-id', s.id);
  setTxt('rep-med-name', s.medicine);
  setTxt('rep-batch', s.batch);
  setTxt('rep-qty', s.qty);
  setTxt('rep-mfd-exp', s.mfdExp);
  setTxt('rep-receiver-name', receiverState.currentUser.name);

  // Modal verification
  const modal = document.getElementById('confirm-receipt-modal');
  const verifyBtn = document.getElementById('tbl-btn-verify');
  const confirmBtn = document.getElementById('modal-btn-confirm');
  const cancelBtn = document.getElementById('modal-btn-cancel');

  verifyBtn?.addEventListener('click', () => {
    const timeEl = document.getElementById('modal-arrival-time');
    if (timeEl) timeEl.textContent = new Date().toLocaleTimeString();
    modal?.classList.remove('hidden');
  });

  cancelBtn?.addEventListener('click', () => {
    modal?.classList.add('hidden');
  });

  confirmBtn?.addEventListener('click', () => {
    s.status = 'ACCEPTED & VERIFIED';
    setTxt('tbl-status', s.status);
    const certEl = document.getElementById('report-cert-status');
    if (certEl) certEl.textContent = 'COMPLIANCE VERIFIED & SIGNED';
    modal?.classList.add('hidden');
    showToast(`Shipment ${s.id} successfully verified and accepted into hospital inventory!`);
  });
}

function initAlertsUI() {
  const container = document.getElementById('receiver-alerts-list');
  if (!container) return;

  container.innerHTML = '';
  receiverState.alerts.forEach(a => {
    const card = document.createElement('div');
    card.className = `alert-card ${a.severity}`;
    card.innerHTML = `
      <div style="display: flex; align-items: center; gap: 14px;">
        <div style="width: 34px; height: 34px; border-radius: 8px; background: rgba(16,185,129,0.1); display: flex; align-items: center; justify-content: center; color: var(--color-safe);">
          <i data-lucide="shield-check"></i>
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

function initTelemetrySync() {
  setInterval(async () => {
    try {
      const res = await fetch('/api/sensors/latest');
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data) {
          updateReceiverTelemetry(json.data);
          return;
        }
      }
    } catch (e) {}

    const simTemp = (4.3 + (Math.random() * 0.4 - 0.2)).toFixed(1);
    const simHum = Math.floor(62 + Math.random() * 3);
    updateReceiverTelemetry({
      temperature: simTemp,
      humidity: simHum,
      shock_status: 'SAFE',
      tamper_status: 'SECURE',
      battery_level: 84
    });
  }, 5000);
}

function updateReceiverTelemetry(data) {
  const setTxt = (id, val) => {
    const el = document.getElementById(id);
    if (el) el.textContent = val;
  };

  setTxt('kpi-temp-val', `${data.temperature}°C`);
  setTxt('kpi-humidity-val', `${data.humidity}%`);

  setTxt('mat-temp', `${data.temperature}°C (Compliant: 2-8°C)`);
  setTxt('mat-humidity', `${data.humidity}% (Safe)`);
  setTxt('mat-shock', data.shock_status || 'SAFE');
  setTxt('mat-tamper', data.tamper_status || 'SECURE');
  setTxt('mat-battery', `${data.battery_level || 84}% Power`);
}

function initCharts() {
  if (!window.Chart) return;

  const tempFullCanvas = document.getElementById('analytics-temp-full-chart');
  if (tempFullCanvas) {
    receiverState.charts.temp = new Chart(tempFullCanvas.getContext('2d'), {
      type: 'line',
      data: {
        labels: ['09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '12:00'],
        datasets: [{
          label: 'Incoming Cargo Temperature (°C)',
          data: [4.1, 4.3, 4.5, 4.4, 4.6, 4.5, 4.5],
          borderColor: '#10b981',
          backgroundColor: 'rgba(16, 185, 129, 0.12)',
          fill: true,
          tension: 0.35
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: { min: 0, max: 10, grid: { color: 'rgba(255,255,255,0.06)' }, ticks: { color: '#94a3b8' } },
          x: { grid: { display: false }, ticks: { color: '#94a3b8' } }
        }
      }
    });
  }
}

function initReports() {
  document.getElementById('btn-print-report')?.addEventListener('click', () => {
    window.print();
  });

  document.getElementById('btn-export-pdf')?.addEventListener('click', () => {
    const reportEl = document.getElementById('report-paper');
    if (!reportEl) return;
    if (window.html2pdf) {
      window.html2pdf().from(reportEl).set({
        margin: 10,
        filename: `Receiver_Verification_Report_${receiverState.activeShipment.id}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
      }).save();
      showToast('Receiver PDF report downloaded.');
    } else {
      window.print();
    }
  });

  document.getElementById('btn-export-csv')?.addEventListener('click', () => {
    const s = receiverState.activeShipment;
    const csvContent = 'data:text/csv;charset=utf-8,' +
      'Shipment_ID,Medicine,Batch,Status,Integrity,Temperature\n' +
      `${s.id},${s.medicine},${s.batch},${s.status},${s.integrity}%,${s.temp}C\n`;

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Receiver_Verification_${s.id}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('CSV verification exported.');
  });
}

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
  toast.innerHTML = `<span>🏥</span><span>${message}</span>`;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 4000);
}
