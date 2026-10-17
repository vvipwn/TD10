/**
 * TRIAMDOD 10 — Student Council Admin Backoffice Logic
 * Strict Zero-Emoji Policy | UTF-8 Thai Support | Full Slip Inspection
 */

(function () {
  'use strict';

  // Constants & Storage Keys
  const STORAGE_KEY_ORDERS = 'td10_orders';
  const STORAGE_KEY_ADMIN_AUTH = 'td10_admin_session';
  const MASTER_PASSCODE = 'tun10admin';

  // Default Mock Slip Data URL (Retro PromptPay Slip Graphic in SVG Data URI)
  const MOCK_SLIP_DATA_URL = 'data:image/svg+xml;utf8,' + encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" width="360" height="520" viewBox="0 0 360 520">
      <rect width="360" height="520" fill="#ffffff" rx="12"/>
      <rect x="0" y="0" width="360" height="70" fill="#003b70"/>
      <text x="180" y="44" font-family="'Space Grotesk', sans-serif" font-size="20" font-weight="bold" fill="#ffffff" text-anchor="middle">Thai QR Payment</text>
      <circle cx="180" cy="115" r="32" fill="#10b981"/>
      <path d="M168 115 l8 8 l16 -16" stroke="#ffffff" stroke-width="4" fill="none" stroke-linecap="round"/>
      <text x="180" y="170" font-family="'IBM Plex Sans Thai', sans-serif" font-size="16" font-weight="bold" fill="#0f172a" text-anchor="middle">โอนเงินสำเร็จ</text>
      <text x="180" y="195" font-family="'Space Grotesk', sans-serif" font-size="12" fill="#64748b" text-anchor="middle">17 ต.ค. 2569 - 14:28:15</text>
      <line x1="24" y1="220" x2="336" y2="220" stroke="#e2e8f0" stroke-width="1.5" stroke-dasharray="4 4"/>
      <text x="24" y="250" font-family="'IBM Plex Sans Thai', sans-serif" font-size="13" fill="#64748b">จาก :</text>
      <text x="336" y="250" font-family="'IBM Plex Sans Thai', sans-serif" font-size="13" font-weight="bold" fill="#0f172a" text-anchor="end">นาย วิภูวนัย (xxx-x-xx784-x)</text>
      <text x="24" y="285" font-family="'IBM Plex Sans Thai', sans-serif" font-size="13" fill="#64748b">ไปยัง :</text>
      <text x="336" y="285" font-family="'IBM Plex Sans Thai', sans-serif" font-size="13" font-weight="bold" fill="#0f172a" text-anchor="end">สภานักเรียน ต.อ.น. (099-400-0869)</text>
      <text x="24" y="320" font-family="'IBM Plex Sans Thai', sans-serif" font-size="13" fill="#64748b">เลขอ้างอิง :</text>
      <text x="336" y="320" font-family="'Space Grotesk', monospace" font-size="12" fill="#475569" text-anchor="end">202610178491028471</text>
      <line x1="24" y1="350" x2="336" y2="350" stroke="#e2e8f0" stroke-width="1.5"/>
      <rect x="24" y="375" width="312" height="60" fill="#f8fafc" rx="8" stroke="#cbd5e1"/>
      <text x="40" y="412" font-family="'IBM Plex Sans Thai', sans-serif" font-size="13" fill="#64748b">จำนวนเงิน :</text>
      <text x="320" y="414" font-family="'Space Grotesk', sans-serif" font-size="22" font-weight="bold" fill="#059669" text-anchor="end">359.00 บาท</text>
      <text x="180" y="475" font-family="'IBM Plex Sans Thai', sans-serif" font-size="11" fill="#94a3b8" text-anchor="middle">* สแกนตรวจสอบ QR Code บนสลิปเรียบร้อยแล้ว *</text>
      <rect x="150" y="490" width="60" height="6" fill="#cbd5e1" rx="3"/>
    </svg>
  `);

  // DOM Elements
  const adminLockScreen = document.getElementById('adminLockScreen');
  const adminApp = document.getElementById('adminApp');
  const adminLoginForm = document.getElementById('adminLoginForm');
  const adminPasscodeInput = document.getElementById('adminPasscodeInput');
  const btnLogoutAdmin = document.getElementById('btnLogoutAdmin');

  // KPI Elements
  const kpiTotalRevenue = document.getElementById('kpiTotalRevenue');
  const kpiTotalOrders = document.getElementById('kpiTotalOrders');
  const kpiOrdersRatioMeta = document.getElementById('kpiOrdersRatioMeta');
  const kpiPendingOrders = document.getElementById('kpiPendingOrders');
  const kpiPendingBadge = document.getElementById('kpiPendingBadge');
  const kpiRejectedOrders = document.getElementById('kpiRejectedOrders');
  const kpiTotalShirts = document.getElementById('kpiTotalShirts');

  // Shirt Size Elements
  const sumBrownTotal = document.getElementById('sumBrownTotal');
  const cntBrownS = document.getElementById('cntBrownS');
  const cntBrownM = document.getElementById('cntBrownM');
  const cntBrownL = document.getElementById('cntBrownL');
  const cntBrownXL = document.getElementById('cntBrownXL');
  const cntBrown2XL = document.getElementById('cntBrown2XL');

  const sumBeigeTotal = document.getElementById('sumBeigeTotal');
  const cntBeigeS = document.getElementById('cntBeigeS');
  const cntBeigeM = document.getElementById('cntBeigeM');
  const cntBeigeL = document.getElementById('cntBeigeL');
  const cntBeigeXL = document.getElementById('cntBeigeXL');
  const cntBeige2XL = document.getElementById('cntBeige2XL');

  // Filter & Search Controls
  const adminSearchInput = document.getElementById('adminSearchInput');
  const filterStatus = document.getElementById('filterStatus');
  const filterRole = document.getElementById('filterRole');
  const filterPackage = document.getElementById('filterPackage');
  const btnExportCsv = document.getElementById('btnExportCsv');
  const btnSeedDemoData = document.getElementById('btnSeedDemoData');
  const btnResetData = document.getElementById('btnResetData');

  // Table
  const ordersTableBody = document.getElementById('ordersTableBody');
  const tableCountInfo = document.getElementById('tableCountInfo');

  // Slip Inspector Modal Elements
  const slipModal = document.getElementById('slipModal');
  const btnCloseSlipModal = document.getElementById('btnCloseSlipModal');
  const slipInspectorImg = document.getElementById('slipInspectorImg');
  const slipInspectName = document.getElementById('slipInspectName');
  const slipInspectMeta = document.getElementById('slipInspectMeta');
  const slipInspectPackage = document.getElementById('slipInspectPackage');
  const slipInspectAmount = document.getElementById('slipInspectAmount');
  const slipInspectTime = document.getElementById('slipInspectTime');
  const slipInspectStatus = document.getElementById('slipInspectStatus');
  const btnInspectApprove = document.getElementById('btnInspectApprove');
  const btnInspectReject = document.getElementById('btnInspectReject');

  // Reject Reason Modal Elements
  const rejectModal = document.getElementById('rejectModal');
  const btnCloseRejectModal = document.getElementById('btnCloseRejectModal');
  const rejectReasonTextarea = document.getElementById('rejectReasonTextarea');
  const btnCancelReject = document.getElementById('btnCancelReject');
  const btnConfirmReject = document.getElementById('btnConfirmReject');
  const quickReasonButtons = document.querySelectorAll('.btn-quick-reason');

  // App State
  let ordersList = [];
  let currentInspectedOrderId = null;
  let orderPendingRejectId = null;

  // --------------------------------------------------------------------------
  // 1. AUTHENTICATION CONTROLS
  // --------------------------------------------------------------------------
  function checkAdminSession() {
    const isAuth = sessionStorage.getItem(STORAGE_KEY_ADMIN_AUTH) === 'true';
    if (isAuth) {
      if (adminLockScreen) adminLockScreen.style.display = 'none';
      if (adminApp) adminApp.style.display = 'flex';
      loadOrdersData();
    } else {
      if (adminLockScreen) adminLockScreen.style.display = 'flex';
      if (adminApp) adminApp.style.display = 'none';
      if (adminPasscodeInput) adminPasscodeInput.focus();
    }
  }

  if (adminLoginForm) {
    adminLoginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const enteredPass = adminPasscodeInput?.value.trim() || '';
      if (enteredPass === MASTER_PASSCODE) {
        sessionStorage.setItem(STORAGE_KEY_ADMIN_AUTH, 'true');
        if (adminLockScreen) adminLockScreen.style.display = 'none';
        if (adminApp) adminApp.style.display = 'flex';
        loadOrdersData();
      } else {
        alert('รหัสผ่านสภานักเรียนไม่ถูกต้อง กรุณาลองใหม่อีกครั้ง');
        if (adminPasscodeInput) {
          adminPasscodeInput.value = '';
          adminPasscodeInput.focus();
        }
      }
    });
  }

  if (btnLogoutAdmin) {
    btnLogoutAdmin.addEventListener('click', () => {
      if (confirm('คุณต้องการออกจากระบบสภานักเรียนใช่หรือไม่?')) {
        sessionStorage.removeItem(STORAGE_KEY_ADMIN_AUTH);
        checkAdminSession();
      }
    });
  }

  // --------------------------------------------------------------------------
  // 2. DATA STORAGE & SEEDING LOGIC
  // --------------------------------------------------------------------------
  function loadOrdersData() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_ORDERS);
      if (stored) {
        ordersList = JSON.parse(stored);
      } else {
        ordersList = [];
      }
    } catch (e) {
      console.error('Failed to load orders from localStorage:', e);
      ordersList = [];
    }

    // Check if there was an order submitted from index.html (td10_pending_user)
    importPendingUserFromFrontend();

    renderDashboard();
  }

  function saveOrdersData() {
    try {
      localStorage.setItem(STORAGE_KEY_ORDERS, JSON.stringify(ordersList));
    } catch (e) {
      console.error('Failed to save orders to localStorage:', e);
    }
    renderDashboard();
  }

  function importPendingUserFromFrontend() {
    try {
      const pendingRaw = localStorage.getItem('td10_pending_user');
      if (!pendingRaw) return;
      const pending = JSON.parse(pendingRaw);
      if (!pending || !pending.fullname) return;

      // Check if this pending order already exists in ordersList
      const exists = ordersList.some(o => 
        (o.email && o.email === pending.email) ||
        (o.studentId && o.studentId === pending.studentId)
      );

      if (!exists) {
        const newOrder = {
          id: `TD10-${pending.studentId || Math.floor(1000 + Math.random() * 9000)}`,
          submittedAt: pending.submittedAt || '17 ต.ค. 14:30 น.',
          role: pending.role || 'student-current',
          fullname: pending.fullname,
          rawGoogleName: pending.rawGoogleName || pending.fullname,
          email: pending.email || 'student@tun.ac.th',
          studentId: pending.studentId || '25784',
          grade: pending.grade || 'ม.6 / ห้อง 11 (เลขที่ 16)',
          phone: pending.phone || '08x-xxx-xxxx',
          address: pending.address || '',
          batch: pending.batch || '',
          packageName: pending.package || 'บัตรพร้อมเสื้อพร้อมของที่ระลึก',
          price: pending.price || 359,
          shirtColor: pending.shirtColor || 'สีน้ำตาลเข้ม Espresso',
          shirtSize: pending.shirtSize || 'L',
          hasShirt: Boolean(pending.shirtColor),
          slipUrl: MOCK_SLIP_DATA_URL,
          status: pending.status || 'pending',
          rejectReason: ''
        };
        ordersList.unshift(newOrder);
        saveOrdersData();
      }
    } catch (err) {
      console.error('Error importing pending user:', err);
    }
  }

  // Generate Demo Data for testing
  function seedRealisticDemoData() {
    const demoOrders = [
      {
        id: 'TD10-25784',
        submittedAt: '17 ต.ค. 14:30 น.',
        role: 'student-current',
        fullname: 'วิภูวนัย ตั้งจิตมั่นคงชัย',
        rawGoogleName: '611.16 วิภูวนัย(WIPUWANAI) ตั้งจิตมั่นคงชัย(TANGJITMANKONGCHAI)',
        email: '25784@tun.ac.th',
        studentId: '25784',
        grade: 'ม.6 / ห้อง 11 (เลขที่ 16)',
        phone: '081-400-0869',
        address: '',
        batch: '',
        packageName: 'บัตรพร้อมเสื้อพร้อมของที่ระลึก',
        price: 359,
        shirtColor: 'สีน้ำตาลเข้ม Espresso',
        shirtSize: 'L',
        hasShirt: true,
        slipUrl: MOCK_SLIP_DATA_URL,
        status: 'pending',
        rejectReason: ''
      },
      {
        id: 'TD10-26142',
        submittedAt: '17 ต.ค. 13:45 น.',
        role: 'student-current',
        fullname: 'ธีรภัทร อัครเสถียร',
        rawGoogleName: '504.12 ธีรภัทร(THEERAPHAT) อัครเสถียร(AKKHARASATHIAN)',
        email: '26142@tun.ac.th',
        studentId: '26142',
        grade: 'ม.5 / ห้อง 4 (เลขที่ 12)',
        phone: '089-112-3344',
        address: '',
        batch: '',
        packageName: 'บัตรเข้างาน',
        price: 99,
        shirtColor: null,
        shirtSize: null,
        hasShirt: false,
        slipUrl: MOCK_SLIP_DATA_URL,
        status: 'approved',
        rejectReason: ''
      },
      {
        id: 'TD10-27088',
        submittedAt: '17 ต.ค. 12:15 น.',
        role: 'student-current',
        fullname: 'ชญานิษฐ์ รัตนวิชัย',
        rawGoogleName: '401.23 ชญานิษฐ์(CHAYANIT) รัตนวิชัย(RATTANAWICHAI)',
        email: '27088@tun.ac.th',
        studentId: '27088',
        grade: 'ม.4 / ห้อง 1 (เลขที่ 23)',
        phone: '095-223-4455',
        address: '',
        batch: '',
        packageName: 'บัตรพร้อมของที่ระลึก',
        price: 129,
        shirtColor: null,
        shirtSize: null,
        hasShirt: false,
        slipUrl: MOCK_SLIP_DATA_URL,
        status: 'approved',
        rejectReason: ''
      },
      {
        id: 'TD10-ALM-032',
        submittedAt: '17 ต.ค. 11:30 น.',
        role: 'alumni',
        fullname: 'ก้องภพ จิตต์ปรีดา',
        rawGoogleName: 'ก้องภพ จิตต์ปรีดา',
        email: 'kongpob.alumni@gmail.com',
        studentId: '',
        grade: '',
        phone: '084-556-7788',
        address: '99/42 ซอยรามคำแหง 112 สะพานสูง กทม. 10240',
        batch: '32',
        packageName: 'เสื้อพร้อมของที่ระลึก',
        price: 359,
        shirtColor: 'สีเนื้อ Sand Beige',
        shirtSize: 'XL',
        hasShirt: true,
        slipUrl: MOCK_SLIP_DATA_URL,
        status: 'approved',
        rejectReason: ''
      },
      {
        id: 'TD10-ALM-028',
        submittedAt: '17 ต.ค. 10:20 น.',
        role: 'alumni',
        fullname: 'สุชาวดี วงศ์สวัสดิ์',
        rawGoogleName: 'สุชาวดี วงศ์สวัสดิ์',
        email: 'suchawadee.w@gmail.com',
        studentId: '',
        grade: '',
        phone: '082-334-5566',
        address: '15/2 หมู่ 3 ถ.นวมินทร์ คลองกุ่ม บึงกุ่ม กทม. 10240',
        batch: '28',
        packageName: 'เสื้ออย่างเดียว',
        price: 329,
        shirtColor: 'สีน้ำตาลเข้ม Espresso',
        shirtSize: 'M',
        hasShirt: true,
        slipUrl: MOCK_SLIP_DATA_URL,
        status: 'pending',
        rejectReason: ''
      },
      {
        id: 'TD10-26899',
        submittedAt: '16 ต.ค. 18:40 น.',
        role: 'student-current',
        fullname: 'สมหมาย ตั้งใจเรียน',
        rawGoogleName: '408.35 สมหมาย(SOMMAI) ตั้งใจเรียน(TANGJAI)',
        email: '26899@tun.ac.th',
        studentId: '26899',
        grade: 'ม.4 / ห้อง 8 (เลขที่ 35)',
        phone: '086-778-9900',
        address: '',
        batch: '',
        packageName: 'บัตรเข้างาน',
        price: 99,
        shirtColor: null,
        shirtSize: null,
        hasShirt: false,
        slipUrl: MOCK_SLIP_DATA_URL,
        status: 'rejected',
        rejectReason: 'ยอดเงินที่โอนไม่ตรงกับราคาแพ็กเกจ (โอนมาเพียง 50 บาท)'
      },
      {
        id: 'TD10-25801',
        submittedAt: '16 ต.ค. 17:10 น.',
        role: 'student-current',
        fullname: 'ปิยะวัฒน์ เจริญศิลป์',
        rawGoogleName: '602.05 ปิยะวัฒน์(PIYAWAT) เจริญศิลป์(CHAROENSIN)',
        email: '25801@tun.ac.th',
        studentId: '25801',
        grade: 'ม.6 / ห้อง 2 (เลขที่ 5)',
        phone: '081-889-0011',
        address: '',
        batch: '',
        packageName: 'บัตรพร้อมเสื้อพร้อมของที่ระลึก',
        price: 359,
        shirtColor: 'สีเนื้อ Sand Beige',
        shirtSize: '2XL',
        hasShirt: true,
        slipUrl: MOCK_SLIP_DATA_URL,
        status: 'approved',
        rejectReason: ''
      }
    ];

    ordersList = demoOrders;
    saveOrdersData();
    alert('สร้างข้อมูลจำลองเพื่อการทดสอบเรียบร้อยแล้ว (7 รายการ)');
  }

  // --------------------------------------------------------------------------
  // 3. STATS & KPI CALCULATION
  // --------------------------------------------------------------------------
  function calculateStats() {
    let totalRev = 0;
    let countTotal = ordersList.length;
    let countStudent = 0;
    let countAlumni = 0;
    let countPending = 0;
    let countApproved = 0;
    let countRejected = 0;

    // T-shirt counts
    let totalShirts = 0;
    const brownSizes = { S: 0, M: 0, L: 0, XL: 0, '2XL': 0 };
    const beigeSizes = { S: 0, M: 0, L: 0, XL: 0, '2XL': 0 };

    ordersList.forEach(order => {
      if (order.role === 'student-current') countStudent++;
      else countAlumni++;

      if (order.status === 'approved') {
        countApproved++;
        totalRev += Number(order.price) || 0;
      } else if (order.status === 'pending') {
        countPending++;
      } else if (order.status === 'rejected') {
        countRejected++;
      }

      // Count shirt only if package includes shirt and order is not rejected
      if (order.hasShirt && order.status !== 'rejected') {
        totalShirts++;
        const sz = order.shirtSize || 'L';
        const clr = order.shirtColor || '';

        if (clr.includes('น้ำตาล')) {
          if (brownSizes[sz] !== undefined) brownSizes[sz]++;
        } else {
          if (beigeSizes[sz] !== undefined) beigeSizes[sz]++;
        }
      }
    });

    // Update KPI UI
    if (kpiTotalRevenue) kpiTotalRevenue.textContent = `฿${totalRev.toLocaleString('th-TH', { minimumFractionDigits: 2 })}.-`;
    if (kpiTotalOrders) kpiTotalOrders.textContent = countTotal;
    if (kpiOrdersRatioMeta) kpiOrdersRatioMeta.textContent = `นักเรียน ${countStudent} คน • ศิษย์เก่า ${countAlumni} คน`;
    if (kpiPendingOrders) kpiPendingOrders.textContent = countPending;
    if (kpiPendingBadge) kpiPendingBadge.textContent = `${countPending} รายการ`;
    if (kpiRejectedOrders) kpiRejectedOrders.textContent = countRejected;

    // Update Shirt Panel UI
    if (kpiTotalShirts) kpiTotalShirts.textContent = `รวมสั่งผลิต: ${totalShirts} ตัว`;

    const brownTotal = Object.values(brownSizes).reduce((a, b) => a + b, 0);
    const beigeTotal = Object.values(beigeSizes).reduce((a, b) => a + b, 0);

    if (sumBrownTotal) sumBrownTotal.textContent = `${brownTotal} ตัว`;
    if (cntBrownS) cntBrownS.textContent = brownSizes.S;
    if (cntBrownM) cntBrownM.textContent = brownSizes.M;
    if (cntBrownL) cntBrownL.textContent = brownSizes.L;
    if (cntBrownXL) cntBrownXL.textContent = brownSizes.XL;
    if (cntBrown2XL) cntBrown2XL.textContent = brownSizes['2XL'];

    if (sumBeigeTotal) sumBeigeTotal.textContent = `${beigeTotal} ตัว`;
    if (cntBeigeS) cntBeigeS.textContent = beigeSizes.S;
    if (cntBeigeM) cntBeigeM.textContent = beigeSizes.M;
    if (cntBeigeL) cntBeigeL.textContent = beigeSizes.L;
    if (cntBeigeXL) cntBeigeXL.textContent = beigeSizes.XL;
    if (cntBeige2XL) cntBeige2XL.textContent = beigeSizes['2XL'];
  }

  // --------------------------------------------------------------------------
  // 4. FILTERING & TABLE RENDERING
  // --------------------------------------------------------------------------
  function getFilteredOrders() {
    const searchVal = (adminSearchInput?.value || '').trim().toLowerCase();
    const statusVal = filterStatus?.value || 'all';
    const roleVal = filterRole?.value || 'all';
    const pkgVal = filterPackage?.value || 'all';

    return ordersList.filter(order => {
      // Search matching
      if (searchVal) {
        const matchesName = (order.fullname || '').toLowerCase().includes(searchVal);
        const matchesId = (order.studentId || '').toLowerCase().includes(searchVal);
        const matchesEmail = (order.email || '').toLowerCase().includes(searchVal);
        const matchesPhone = (order.phone || '').toLowerCase().includes(searchVal);
        const matchesGrade = (order.grade || '').toLowerCase().includes(searchVal);
        const matchesOrder = (order.id || '').toLowerCase().includes(searchVal);

        if (!matchesName && !matchesId && !matchesEmail && !matchesPhone && !matchesGrade && !matchesOrder) {
          return false;
        }
      }

      // Status matching
      if (statusVal !== 'all' && order.status !== statusVal) {
        return false;
      }

      // Role matching
      if (roleVal !== 'all') {
        if (roleVal === 'student-current' && order.role !== 'student-current') return false;
        if (roleVal === 'alumni' && order.role !== 'alumni') return false;
        if (roleVal === 'student-m4' && (!order.grade || !order.grade.includes('ม.4'))) return false;
        if (roleVal === 'student-m5' && (!order.grade || !order.grade.includes('ม.5'))) return false;
        if (roleVal === 'student-m6' && (!order.grade || !order.grade.includes('ม.6'))) return false;
      }

      // Package matching
      if (pkgVal !== 'all') {
        if (pkgVal === '99' && order.price !== 99) return false;
        if (pkgVal === '129' && order.price !== 129) return false;
        if (pkgVal === '359' && (order.price !== 359 || order.role !== 'student-current')) return false;
        if (pkgVal === '329' && order.price !== 329) return false;
        if (pkgVal === '359-alumni' && (order.price !== 359 || order.role !== 'alumni')) return false;
      }

      return true;
    });
  }

  function renderDashboard() {
    calculateStats();

    const filtered = getFilteredOrders();
    if (tableCountInfo) {
      tableCountInfo.innerHTML = `แสดงผล: <b>${filtered.length}</b> จากทั้งหมด ${ordersList.length} รายการ`;
    }

    if (!ordersTableBody) return;
    ordersTableBody.innerHTML = '';

    if (filtered.length === 0) {
      ordersTableBody.innerHTML = `
        <tr class="table-empty-row">
          <td colspan="8">
            <div class="empty-state-box">
              <span class="empty-title">ไม่พบรายการคำขอตามเงื่อนไขที่กำหนด</span>
              <span>ลองเปลี่ยนคำค้นหา หรือคลิกปุ่ม "+ ข้อมูลจำลอง" เพื่อทดสอบระบบ</span>
            </div>
          </td>
        </tr>
      `;
      return;
    }

    filtered.forEach(order => {
      const tr = document.createElement('tr');
      const isStudent = order.role === 'student-current';

      // Status pill
      let statusBadge = '';
      if (order.status === 'approved') {
        statusBadge = '<span class="status-pill status-approved">[อนุมัติแล้ว]</span>';
      } else if (order.status === 'rejected') {
        const reasonText = order.rejectReason ? ` title="${order.rejectReason}"` : '';
        statusBadge = `<span class="status-pill status-rejected"${reasonText}>[ปฏิเสธสลิป]</span>`;
      } else {
        statusBadge = '<span class="status-pill status-pending">[รอตรวจสอบ]</span>';
      }

      // Role badge
      const roleBadge = isStudent
        ? `<span class="role-badge role-student">${order.grade ? order.grade.split('/')[0] : 'นักเรียน'}</span>`
        : `<span class="role-badge role-alumni">ศิษย์เก่า รุ่น ${order.batch || '-'}</span>`;

      // Shirt specification string
      let shirtSpec = '';
      if (order.hasShirt) {
        shirtSpec = `<span class="pkg-shirt-spec">${order.shirtColor || 'สีน้ำตาล'} / ไซส์ ${order.shirtSize || 'L'}</span>`;
      }

      tr.innerHTML = `
        <td>
          <div style="font-family: var(--font-mono); font-weight: 700; color: #cbd5e1;">${order.id}</div>
          <div style="font-size: 0.72rem; color: #64748b;">${order.submittedAt}</div>
        </td>
        <td>
          <div class="user-cell-wrap">
            <span class="user-cell-name">${order.fullname}</span>
            <span class="user-cell-meta">${isStudent ? order.grade : `จัดส่ง: ${order.address || '-'}`}</span>
            <span class="user-cell-contact">${isStudent ? `รหัส: ${order.studentId} • ${order.email}` : `โทร: ${order.phone || '-'} • ${order.email}`}</span>
          </div>
        </td>
        <td>${roleBadge}</td>
        <td>
          <div class="pkg-cell-wrap">
            <span class="pkg-cell-name">${order.packageName}</span>
            ${shirtSpec}
          </div>
        </td>
        <td>
          <span class="price-cell-val">฿${order.price}.-</span>
        </td>
        <td>
          <button type="button" class="slip-thumb-btn btn-view-slip" data-id="${order.id}">
            <img class="slip-mini-preview" src="${order.slipUrl || MOCK_SLIP_DATA_URL}" alt="สลิป">
            <span>ดูสลิป</span>
          </button>
        </td>
        <td>${statusBadge}</td>
        <td>
          <div class="table-actions-cell">
            ${order.status === 'pending' ? `
              <button type="button" class="btn-action btn-action-approve btn-row-approve" data-id="${order.id}" title="อนุมัติ">อนุมัติ</button>
              <button type="button" class="btn-action btn-action-reject btn-row-reject" data-id="${order.id}" title="ปฏิเสธสลิป">ปฏิเสธ</button>
            ` : order.status === 'approved' ? `
              <button type="button" class="btn-action btn-action-reject btn-row-reject" data-id="${order.id}" style="background: #475569;" title="เปลี่ยนเป็นปฏิเสธ">แก้สถานะ</button>
            ` : `
              <button type="button" class="btn-action btn-action-approve btn-row-approve" data-id="${order.id}" title="เปลี่ยนเป็นอนุมัติ">ตรวจใหม่</button>
            `}
            <button type="button" class="btn-action btn-action-del btn-row-del" data-id="${order.id}" title="ลบรายการ">ลบ</button>
          </div>
        </td>
      `;

      ordersTableBody.appendChild(tr);
    });

    // Attach Event Listeners to newly rendered action buttons
    attachTableEventListeners();
  }

  function attachTableEventListeners() {
    // View Slip Click
    document.querySelectorAll('.btn-view-slip').forEach(btn => {
      btn.addEventListener('click', () => {
        openSlipInspector(btn.dataset.id);
      });
    });

    // Row Approve Click
    document.querySelectorAll('.btn-row-approve').forEach(btn => {
      btn.addEventListener('click', () => {
        approveOrder(btn.dataset.id);
      });
    });

    // Row Reject Click
    document.querySelectorAll('.btn-row-reject').forEach(btn => {
      btn.addEventListener('click', () => {
        openRejectModal(btn.dataset.id);
      });
    });

    // Row Delete Click
    document.querySelectorAll('.btn-row-del').forEach(btn => {
      btn.addEventListener('click', () => {
        deleteOrder(btn.dataset.id);
      });
    });
  }

  // --------------------------------------------------------------------------
  // 5. ORDER ACTIONS (APPROVE, REJECT, DELETE)
  // --------------------------------------------------------------------------
  function approveOrder(orderId) {
    const order = ordersList.find(o => o.id === orderId);
    if (!order) return;

    order.status = 'approved';
    order.rejectReason = '';
    order.reviewedAt = new Date().toLocaleTimeString('th-TH');
    order.reviewedBy = 'สภานักเรียน';

    // Synchronize to frontend pending user record if matching
    syncFrontendPendingUser(order);

    saveOrdersData();
  }

  function openRejectModal(orderId) {
    orderPendingRejectId = orderId;
    if (rejectReasonTextarea) rejectReasonTextarea.value = '';
    if (rejectModal) rejectModal.classList.add('active');
  }

  function closeRejectModal() {
    orderPendingRejectId = null;
    if (rejectModal) rejectModal.classList.remove('active');
  }

  function confirmRejectOrder() {
    if (!orderPendingRejectId) return;
    const order = ordersList.find(o => o.id === orderPendingRejectId);
    if (!order) return;

    const reason = (rejectReasonTextarea?.value || '').trim() || 'ภาพสลิปไม่ชัดเจน หรือยอดเงินไม่ถูกต้อง กรุณาติดต่อสภานักเรียน';

    order.status = 'rejected';
    order.rejectReason = reason;
    order.reviewedAt = new Date().toLocaleTimeString('th-TH');
    order.reviewedBy = 'สภานักเรียน';

    syncFrontendPendingUser(order);

    closeRejectModal();
    saveOrdersData();
  }

  function deleteOrder(orderId) {
    const order = ordersList.find(o => o.id === orderId);
    if (!order) return;

    if (confirm(`คุณแน่ใจหรือไม่ว่าต้องการลบคำขอของ "${order.fullname}" (${order.id})?`)) {
      ordersList = ordersList.filter(o => o.id !== orderId);
      saveOrdersData();
    }
  }

  // Sync with frontend localStorage key `td10_pending_user` so login in index.html reflects immediately
  function syncFrontendPendingUser(order) {
    try {
      const stored = localStorage.getItem('td10_pending_user');
      if (stored) {
        const pending = JSON.parse(stored);
        if (
          (order.email && order.email === pending.email) ||
          (order.studentId && order.studentId === pending.studentId)
        ) {
          pending.status = order.status;
          pending.rejectReason = order.rejectReason || '';
          localStorage.setItem('td10_pending_user', JSON.stringify(pending));
        }
      }
    } catch (e) {
      console.error('Failed to sync frontend pending user:', e);
    }
  }

  // --------------------------------------------------------------------------
  // 6. SLIP INSPECTOR MODAL LOGIC
  // --------------------------------------------------------------------------
  function openSlipInspector(orderId) {
    const order = ordersList.find(o => o.id === orderId);
    if (!order) return;

    currentInspectedOrderId = orderId;

    if (slipInspectorImg) slipInspectorImg.src = order.slipUrl || MOCK_SLIP_DATA_URL;
    if (slipInspectName) slipInspectName.textContent = order.fullname;
    if (slipInspectMeta) {
      slipInspectMeta.textContent = order.role === 'student-current'
        ? `${order.grade} (รหัส ${order.studentId})`
        : `ศิษย์เก่า รุ่นที่ ${order.batch} (${order.phone})`;
    }
    if (slipInspectPackage) {
      const shirt = order.hasShirt ? ` [${order.shirtColor} / ${order.shirtSize}]` : '';
      slipInspectPackage.textContent = `${order.packageName}${shirt}`;
    }
    if (slipInspectAmount) slipInspectAmount.textContent = `฿${order.price}.00 บาท`;
    if (slipInspectTime) slipInspectTime.textContent = order.submittedAt;

    if (slipInspectStatus) {
      slipInspectStatus.textContent = order.status === 'approved' ? 'อนุมัติแล้ว' : order.status === 'rejected' ? `ปฏิเสธ: ${order.rejectReason}` : 'รอตรวจสอบ';
    }

    if (slipModal) slipModal.classList.add('active');
  }

  function closeSlipInspector() {
    currentInspectedOrderId = null;
    if (slipModal) slipModal.classList.remove('active');
  }

  if (btnCloseSlipModal) btnCloseSlipModal.addEventListener('click', closeSlipInspector);
  if (slipModal) {
    slipModal.addEventListener('click', (e) => {
      if (e.target === slipModal) closeSlipInspector();
    });
  }

  if (btnInspectApprove) {
    btnInspectApprove.addEventListener('click', () => {
      if (currentInspectedOrderId) {
        approveOrder(currentInspectedOrderId);
        closeSlipInspector();
      }
    });
  }

  if (btnInspectReject) {
    btnInspectReject.addEventListener('click', () => {
      if (currentInspectedOrderId) {
        const targetId = currentInspectedOrderId;
        closeSlipInspector();
        openRejectModal(targetId);
      }
    });
  }

  // --------------------------------------------------------------------------
  // 7. REJECT REASON MODAL CONTROLS
  // --------------------------------------------------------------------------
  if (btnCloseRejectModal) btnCloseRejectModal.addEventListener('click', closeRejectModal);
  if (btnCancelReject) btnCancelReject.addEventListener('click', closeRejectModal);
  if (btnConfirmReject) btnConfirmReject.addEventListener('click', confirmRejectOrder);

  quickReasonButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      if (rejectReasonTextarea) {
        rejectReasonTextarea.value = btn.dataset.reason || '';
      }
    });
  });

  // --------------------------------------------------------------------------
  // 8. EXPORT TO CSV LOGIC (UTF-8 with BOM for Excel Support)
  // --------------------------------------------------------------------------
  function exportOrdersToCsv() {
    if (ordersList.length === 0) {
      alert('ไม่มีข้อมูลคำขอสำหรับส่งออก');
      return;
    }

    const headers = [
      'Order ID',
      'วันที่ส่งคำขอ',
      'ชื่อ-นามสกุล',
      'กลุ่มผู้ใช้',
      'ระดับชั้น/ห้อง/รุ่น',
      'รหัสนักเรียน',
      'อีเมล',
      'เบอร์โทร',
      'ที่อยู่จัดส่ง',
      'แพ็กเกจ',
      'สีเสื้อ',
      'ไซส์เสื้อ',
      'ยอดเงิน (บาท)',
      'สถานะ',
      'เหตุผลที่ปฏิเสธ'
    ];

    const rows = ordersList.map(order => [
      `"${order.id}"`,
      `"${order.submittedAt}"`,
      `"${order.fullname.replace(/"/g, '""')}"`,
      `"${order.role === 'student-current' ? 'นักเรียนปัจจุบัน' : 'ศิษย์เก่า'}"`,
      `"${(order.grade || 'รุ่น ' + order.batch).replace(/"/g, '""')}"`,
      `"${order.studentId || '-'}"`,
      `"${order.email}"`,
      `"${order.phone || '-'}"`,
      `"${(order.address || '-').replace(/"/g, '""')}"`,
      `"${order.packageName.replace(/"/g, '""')}"`,
      `"${order.shirtColor || '-'}"`,
      `"${order.shirtSize || '-'}"`,
      order.price,
      `"${order.status === 'approved' ? 'อนุมัติแล้ว' : order.status === 'rejected' ? 'ปฏิเสธ' : 'รอตรวจสอบ'}"`,
      `"${(order.rejectReason || '-').replace(/"/g, '""')}"`
    ]);

    // Prepend UTF-8 BOM (\uFEFF) so Microsoft Excel opens Thai text properly without garbled characters
    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map(r => r.join(','))].join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const downloadLink = document.createElement('a');

    const dateStr = new Date().toISOString().slice(0, 10);
    downloadLink.href = url;
    downloadLink.download = `TRIAMDOD10_Orders_${dateStr}.csv`;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
    URL.revokeObjectURL(url);
  }

  // --------------------------------------------------------------------------
  // 9. EVENT LISTENERS SETUP
  // --------------------------------------------------------------------------
  if (adminSearchInput) adminSearchInput.addEventListener('input', renderDashboard);
  if (filterStatus) filterStatus.addEventListener('change', renderDashboard);
  if (filterRole) filterRole.addEventListener('change', renderDashboard);
  if (filterPackage) filterPackage.addEventListener('change', renderDashboard);

  if (btnExportCsv) btnExportCsv.addEventListener('click', exportOrdersToCsv);
  if (btnSeedDemoData) btnSeedDemoData.addEventListener('click', seedRealisticDemoData);

  if (btnResetData) {
    btnResetData.addEventListener('click', () => {
      if (confirm('คุณแน่ใจหรือไม่ว่าต้องการล้างข้อมูลคำขอทั้งหมด? การกระทำนี้ไม่สามารถย้อนกลับได้')) {
        ordersList = [];
        saveOrdersData();
      }
    });
  }

  // Initialize
  checkAdminSession();

})();
