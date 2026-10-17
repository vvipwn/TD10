/**
 * TRIAMDOD 10 — Site Global Navbar & Polaroid Footer Interactive System
 * Features:
 * - Smooth scroll with sticky navbar offset
 * - Mobile navigation drawer
 * - Interactive Auth Modal (Sign In / Register)
 * - Polaroid Tabletop Shuffle animation
 * - Camera Shutter Sound Synthesizer (Web Audio API)
 * - Polaroid Lightbox with memory details
 * - Back to Top scroll
 */

(function () {
  'use strict';

  // --------------------------------------------------------------------------
  // 1. Mechanical Camera Shutter Audio Synthesizer
  // --------------------------------------------------------------------------
  function playCameraShutterSound() {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const now = ctx.currentTime;

      // 1. Mirror slap transient (Low thump)
      const mirrorOsc = ctx.createOscillator();
      const mirrorGain = ctx.createGain();
      mirrorOsc.type = 'triangle';
      mirrorOsc.frequency.setValueAtTime(160, now);
      mirrorOsc.frequency.exponentialRampToValueAtTime(30, now + 0.04);
      mirrorGain.gain.setValueAtTime(0.2, now);
      mirrorGain.gain.exponentialRampToValueAtTime(0.001, now + 0.045);
      mirrorOsc.connect(mirrorGain);
      mirrorGain.connect(ctx.destination);
      mirrorOsc.start(now);
      mirrorOsc.stop(now + 0.05);

      // 2. High-speed shutter curtain click (Mechanical metallic snap)
      const bufferSize = ctx.sampleRate * 0.06;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (ctx.sampleRate * 0.015));
      }
      const noise = ctx.createBufferSource();
      noise.buffer = buffer;

      const noiseFilter = ctx.createBiquadFilter();
      noiseFilter.type = 'highpass';
      noiseFilter.frequency.setValueAtTime(1400, now + 0.01);

      const noiseGain = ctx.createGain();
      noiseGain.gain.setValueAtTime(0.3, now + 0.01);
      noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.07);

      noise.connect(noiseFilter);
      noiseFilter.connect(noiseGain);
      noiseGain.connect(ctx.destination);
      noise.start(now + 0.01);

      // 3. Film winder ratchet sound
      setTimeout(() => {
        try {
          const windNow = ctx.currentTime;
          const windOsc = ctx.createOscillator();
          const windGain = ctx.createGain();
          windOsc.type = 'sawtooth';
          windOsc.frequency.setValueAtTime(450, windNow);
          windOsc.frequency.exponentialRampToValueAtTime(320, windNow + 0.08);
          windGain.gain.setValueAtTime(0.08, windNow);
          windGain.gain.exponentialRampToValueAtTime(0.001, windNow + 0.09);
          windOsc.connect(windGain);
          windGain.connect(ctx.destination);
          windOsc.start(windNow);
          windOsc.stop(windNow + 0.1);
        } catch (e) {}
      }, 70);

    } catch (e) {
      // AudioContext fallback
    }
  }

  // --------------------------------------------------------------------------
  // 2. Mobile Navigation Toggle
  // --------------------------------------------------------------------------
  const mobileToggle = document.getElementById('mobileNavToggle');
  const navGroup = document.getElementById('navbarNavGroup');

  if (mobileToggle && navGroup) {
    mobileToggle.addEventListener('click', () => {
      const isOpen = navGroup.classList.contains('mobile-open');
      if (isOpen) {
        navGroup.classList.remove('mobile-open');
        mobileToggle.classList.remove('open');
        mobileToggle.setAttribute('aria-expanded', 'false');
      } else {
        navGroup.classList.add('mobile-open');
        mobileToggle.classList.add('open');
        mobileToggle.setAttribute('aria-expanded', 'true');
      }
    });

    // Close when clicking nav links
    navGroup.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        navGroup.classList.remove('mobile-open');
        mobileToggle.classList.remove('open');
        mobileToggle.setAttribute('aria-expanded', 'false');
      });
    });

    // Close when clicking outside
    document.addEventListener('click', (e) => {
      if (!navGroup.contains(e.target) && !mobileToggle.contains(e.target)) {
        navGroup.classList.remove('mobile-open');
        mobileToggle.classList.remove('open');
        mobileToggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // --------------------------------------------------------------------------
  // 3. Smooth Scroll with Sticky Navbar Compensation
  // --------------------------------------------------------------------------
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (!targetId || targetId === '#' || targetId === '#top') {
        if (targetId === '#top' || targetId === '#') {
          e.preventDefault();
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
        return;
      }

      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        e.preventDefault();
        const navHeight = document.getElementById('siteGlobalNavbar')?.offsetHeight || 70;
        const targetPos = targetEl.getBoundingClientRect().top + window.pageYOffset - navHeight - 15;
        window.scrollTo({
          top: targetPos,
          behavior: 'smooth'
        });
      }
    });
  });

  // --------------------------------------------------------------------------
  // 4. Retro Cassette Tape Deck Modal (A: Sign In, B: Google Sign-Up, C: Dynamic Packages & Payment)
  // --------------------------------------------------------------------------
  const authModal = document.getElementById('authModal');
  const openAuthBtns = document.querySelectorAll('#openAuthModalBtn, .btn-open-auth-trigger, #openWaitlistBtn');
  const closeAuthBtn = document.getElementById('closeAuthBtn');
  const tapeSelectBtns = document.querySelectorAll('.tape-select-btn');
  const tabTapeA = document.getElementById('tabTapeA');
  const tabTapeB = document.getElementById('tabTapeB');
  const tabTapeC = document.getElementById('tabTapeC');
  const tapeA = document.getElementById('tapeA');
  const tapeB = document.getElementById('tapeB');
  const tapeC = document.getElementById('tapeC');
  const loginForm = document.getElementById('loginForm');
  const btnLoginWithGoogle = document.getElementById('btnLoginWithGoogle');

  // Tape B: Google Sign-Up View Elements
  const tapeBStepGoogle = document.getElementById('tapeBStepGoogle');
  const btnSignUpWithGoogle = document.getElementById('btnSignUpWithGoogle');

  // Tape B: Current Student View Elements
  const tapeBStepStudent = document.getElementById('tapeBStepStudent');
  const stuDisplayFullname = document.getElementById('stuDisplayFullname');
  const stuDisplayGrade = document.getElementById('stuDisplayGrade');
  const stuDisplayId = document.getElementById('stuDisplayId');
  const stuDisplayEmail = document.getElementById('stuDisplayEmail');
  const stuDisplayGoogleRaw = document.getElementById('stuDisplayGoogleRaw');
  const btnStudentChangeAccount = document.getElementById('btnStudentChangeAccount');
  const btnStudentProceedPackages = document.getElementById('btnStudentProceedPackages');

  // Tape B: Alumni View Elements
  const tapeBStepAlumni = document.getElementById('tapeBStepAlumni');
  const alumniDisplayEmail = document.getElementById('alumniDisplayEmail');
  const alumniDetailsForm = document.getElementById('alumniDetailsForm');
  const alumniFullNameInput = document.getElementById('alumniFullNameInput');
  const alumniPhoneInput = document.getElementById('alumniPhoneInput');
  const alumniAddressInput = document.getElementById('alumniAddressInput');
  const alumniBatchSelect = document.getElementById('alumniBatchSelect');
  const btnAlumniChangeAccount = document.getElementById('btnAlumniChangeAccount');
  const btnAlumniProceedPackages = document.getElementById('btnAlumniProceedPackages');

  // Tape C: Package Selection & Payment Elements
  const tapeCPaymentView = document.getElementById('tapeCPaymentView');
  const tapeCApprovalView = document.getElementById('tapeCApprovalView');
  const pkgSelectionKicker = document.getElementById('pkgSelectionKicker');
  const pkgSelectionTitle = document.getElementById('pkgSelectionTitle');
  const pkgDeliveryBadge = document.getElementById('pkgDeliveryBadge');
  const pkgCardsMatrix = document.getElementById('pkgCardsMatrix');
  const shirtCustomizerBox = document.getElementById('shirtCustomizerBox');
  const custColorBrown = document.getElementById('custColorBrown');
  const custColorBeige = document.getElementById('custColorBeige');
  const pkgSizeChoiceGroup = document.getElementById('pkgSizeChoiceGroup');
  const ppDynamicAmount = document.getElementById('ppDynamicAmount');
  const tapeCPriceTag = document.getElementById('tapeCPriceTag');
  const regSlipInput = document.getElementById('regSlipInput');
  const slipDropzone = document.getElementById('slipDropzone');
  const slipEmptyState = document.getElementById('slipEmptyState');
  const slipPreviewState = document.getElementById('slipPreviewState');
  const slipPreviewImg = document.getElementById('slipPreviewImg');
  const slipFileName = document.getElementById('slipFileName');
  const btnReselectSlip = document.getElementById('btnReselectSlip');
  const btnBackToTapeB = document.getElementById('btnBackToTapeB');
  const btnSubmitPayment = document.getElementById('btnSubmitPayment');

  // Tape C: Approval View Elements
  const summaryFullname = document.getElementById('summaryFullname');
  const summaryRole = document.getElementById('summaryRole');
  const summaryIdOrYear = document.getElementById('summaryIdOrYear');
  const summaryContact = document.getElementById('summaryContact');
  const summaryPackageChosen = document.getElementById('summaryPackageChosen');
  const summaryDeliveryNote = document.getElementById('summaryDeliveryNote');
  const summaryPaidAmountText = document.getElementById('summaryPaidAmountText');
  const summarySlipThumbnail = document.getElementById('summarySlipThumbnail');
  const summarySubmitTime = document.getElementById('summarySubmitTime');
  const btnGoToLoginFromApproval = document.getElementById('btnGoToLoginFromApproval');
  const btnCloseFromApproval = document.getElementById('btnCloseFromApproval');

  // Google Account Selector Simulation Modal
  const googleAccountModal = document.getElementById('googleAccountModal');
  const optAccountStudent = document.getElementById('optAccountStudent');
  const optAccountAlumni = document.getElementById('optAccountAlumni');
  const customGoogleEmail = document.getElementById('customGoogleEmail');
  const btnSubmitCustomEmail = document.getElementById('btnSubmitCustomEmail');
  const btnCancelGoogleModal = document.getElementById('btnCancelGoogleModal');

  // Real Google OAuth 2.0 Elements
  const btnConnectRealGoogle = document.getElementById('btnConnectRealGoogle');
  const txtConnectRealGoogle = document.getElementById('txtConnectRealGoogle');
  const oauthStatusText = document.getElementById('oauthStatusText');
  const btnToggleOAuthConfig = document.getElementById('btnToggleOAuthConfig');
  const oauthConfigInputs = document.getElementById('oauthConfigInputs');
  const inputGoogleClientId = document.getElementById('inputGoogleClientId');
  const btnSaveClientId = document.getElementById('btnSaveClientId');
  const stuRealAvatarImg = document.getElementById('stuRealAvatarImg');

  // Packages Specification (3 for current students, 2 for alumni)
  const STUDENT_PACKAGES = [
    {
      id: 'stu-1',
      name: 'บัตรเข้างาน',
      price: 99,
      desc: 'บัตรเข้าชมคอนเสิร์ต TRIAMDOD 10 (1 ใบ)',
      hasShirt: false
    },
    {
      id: 'stu-2',
      name: 'บัตรพร้อมของที่ระลึก',
      price: 129,
      desc: 'บัตรเข้างาน + ของที่ระลึกประจำรุ่น Limited Edition',
      hasShirt: false
    },
    {
      id: 'stu-3',
      name: 'บัตรพร้อมเสื้อพร้อมของที่ระลึก',
      price: 359,
      desc: 'บัตรเข้างาน + เสื้อยืดคอนเสิร์ต 1 ตัว + ของที่ระลึกครบชุด',
      hasShirt: true
    }
  ];

  const ALUMNI_PACKAGES = [
    {
      id: 'alm-1',
      name: 'เสื้ออย่างเดียว',
      price: 329,
      desc: 'เสื้อยืดคอนเสิร์ต TRIAMDOD 10 (1 ตัว)',
      hasShirt: true
    },
    {
      id: 'alm-2',
      name: 'เสื้อพร้อมของที่ระลึก',
      price: 359,
      desc: 'เสื้อยืดคอนเสิร์ต 1 ตัว + ชุดของที่ระลึกศิษย์เก่า',
      hasShirt: true
    }
  ];

  // User State
  let currentUser = null;
  let selectedPackage = null;
  let selectedShirtColor = 'สีน้ำตาลเข้ม Espresso';
  let selectedShirtSize = 'L';
  let currentSlipDataUrl = null;
  let googleAuthInitiator = 'signup'; // 'signup' | 'login'

  // Populate Alumni Batch Select (1 - 37)
  if (alumniBatchSelect) {
    alumniBatchSelect.innerHTML = '<option value="" disabled selected>-- เลือกรุ่นที่จบ (รุ่นที่ 1 ถึง 37) --</option>';
    for (let b = 1; b <= 37; b++) {
      const opt = document.createElement('option');
      opt.value = String(b);
      opt.textContent = `เตรียมน้อม รุ่นที่ ${b}`;
      alumniBatchSelect.appendChild(opt);
    }
  }

  function openAuth(defaultTab = 'login') {
    if (!authModal) return;
    if (window.TD_Audio && window.TD_Audio.playCassetteClickSound) {
      window.TD_Audio.playCassetteClickSound();
    }
    authModal.classList.add('active');
    document.body.style.overflow = 'hidden';
    switchTape(defaultTab, false);
  }

  function closeAuth() {
    if (!authModal) return;
    if (window.TD_Audio && window.TD_Audio.playCassetteClickSound) {
      window.TD_Audio.playCassetteClickSound();
    }
    authModal.classList.remove('active');
    document.body.style.overflow = '';
  }

  function switchTape(tab, playSound = true) {
    if (playSound && window.TD_Audio && window.TD_Audio.playCassetteClickSound) {
      window.TD_Audio.playCassetteClickSound();
    }

    if (tab === 'payment' && tabTapeC) {
      tabTapeC.style.display = 'inline-flex';
    }

    tapeSelectBtns.forEach(b => {
      if (b.dataset.tab === tab) {
        b.classList.add('active');
      } else {
        b.classList.remove('active');
      }
    });

    [tapeA, tapeB, tapeC].forEach(tape => {
      if (!tape) return;
      tape.classList.remove('active-front', 'stacked-behind', 'stacked-behind-left', 'stacked-deep');
    });

    if (tab === 'login') {
      if (tapeA) tapeA.classList.add('active-front');
      if (tapeB) tapeB.classList.add('stacked-behind');
      if (tapeC) {
        tapeC.classList.add('stacked-behind');
        tapeC.classList.add('stacked-deep');
      }
    } else if (tab === 'register') {
      if (tapeB) tapeB.classList.add('active-front');
      if (tapeA) tapeA.classList.add('stacked-behind');
      if (tapeC) tapeC.classList.add('stacked-behind');
    } else if (tab === 'payment') {
      if (tapeC) tapeC.classList.add('active-front');
      if (tapeB) {
        tapeB.classList.add('stacked-behind');
        tapeB.classList.add('stacked-behind-left');
      }
      if (tapeA) {
        tapeA.classList.add('stacked-behind');
        tapeA.classList.add('stacked-deep');
      }
    }
  }

  // Google Account Modal Controls
  function openGoogleModal(initiator = 'signup') {
    googleAuthInitiator = initiator;
    if (googleAccountModal) {
      googleAccountModal.classList.add('active');
      if (customGoogleEmail) customGoogleEmail.value = '';
    }
    updateGoogleOAuthStatusUI();
    if (window.TD_Audio && window.TD_Audio.playCassetteClickSound) {
      window.TD_Audio.playCassetteClickSound();
    }
  }

  function closeGoogleModal() {
    if (googleAccountModal) {
      googleAccountModal.classList.remove('active');
    }
  }

  // Triam Udom Suksa Nomklao (@tun.ac.th) Student Directory & Pattern Parser
  const TUN_STUDENT_DIRECTORY = {
    '25784': {
      rawGoogleName: '611.16 วิภูวนัย(WIPUWANAI) ตั้งจิตมั่นคงชัย(TANGJITMANKONGCHAI)',
      fullname: 'วิภูวนัย ตั้งจิตมั่นคงชัย',
      englishName: 'WIPUWANAI TANGJITMANKONGCHAI',
      gradeLevel: '6',
      room: '11',
      seatNo: '16',
      grade: 'ม.6 / ห้อง 11 (เลขที่ 16)',
      studentId: '25784',
      email: '25784@tun.ac.th'
    }
  };

  /**
   * Parse school account naming convention:
   * Pattern: ระดับชั้น(1 หลัก)ห้อง(2 หลัก).เลขที่ ชื่อ(ENGLISH) นามสกุล(ENGLISH)
   * Example: "611.16 วิภูวนัย(WIPUWANAI) ตั้งจิตมั่นคงชัย(TANGJITMANKONGCHAI)"
   * Or email: "25784@tun.ac.th" / numeric ID: "25784"
   */
  function parseTunStudentAccount(input) {
    if (!input) return null;
    const clean = input.trim();

    // 1. Direct match in known directory by studentId or email
    const idOnly = clean.replace(/@tun\.ac\.th$/i, '').trim();
    if (TUN_STUDENT_DIRECTORY[idOnly]) {
      return {
        role: 'student-current',
        ...TUN_STUDENT_DIRECTORY[idOnly]
      };
    }

    // 2. Parse school naming pattern: e.g. "611.16 วิภูวนัย(WIPUWANAI) ตั้งจิตมั่นคงชัย(TANGJITMANKONGCHAI)"
    const patternRegex = /^(\d)(\d{2})\s*\.\s*(\d+)\s+([^\(\s]+)(?:\s*\(([^\)]+)\))?\s+([^\(\s]+)(?:\s*\(([^\)]+)\))?/;
    const match = clean.match(patternRegex);
    if (match) {
      const gradeLevel = match[1];
      const room = parseInt(match[2], 10);
      const seatNo = parseInt(match[3], 10);
      const thaiFirst = match[4];
      const engFirst = match[5] || '';
      const thaiLast = match[6];
      const engLast = match[7] || '';

      const fullname = `${thaiFirst} ${thaiLast}`;
      const englishName = engFirst && engLast ? `${engFirst} ${engLast}` : '';
      const gradeStr = `ม.${gradeLevel} / ห้อง ${room} (เลขที่ ${seatNo})`;

      let studentId = '25784';
      let email = '25784@tun.ac.th';
      if (thaiFirst.includes('วิภูวนัย') || clean.includes('25784')) {
        studentId = '25784';
        email = '25784@tun.ac.th';
      } else {
        studentId = `${gradeLevel}${String(room).padStart(2, '0')}${String(seatNo).padStart(2, '0')}`;
        email = `${studentId}@tun.ac.th`;
      }

      return {
        role: 'student-current',
        rawGoogleName: clean,
        fullname,
        englishName,
        gradeLevel: String(gradeLevel),
        room: String(room),
        seatNo: String(seatNo),
        grade: gradeStr,
        studentId,
        email
      };
    }

    // 3. Check if input is standard @tun.ac.th email
    if (clean.toLowerCase().endsWith('@tun.ac.th')) {
      const numericPart = idOnly.replace(/\D/g, '') || '25784';
      if (TUN_STUDENT_DIRECTORY[numericPart]) {
        return {
          role: 'student-current',
          ...TUN_STUDENT_DIRECTORY[numericPart]
        };
      }
      return {
        role: 'student-current',
        rawGoogleName: `นักเรียนเตรียมน้อม (รหัส ${numericPart})`,
        fullname: `นักเรียนเตรียมน้อม (รหัส ${numericPart})`,
        englishName: '',
        grade: 'นักเรียนเตรียมน้อม',
        studentId: numericPart,
        email: clean.toLowerCase()
      };
    }

    return null;
  }

  // Real Google OAuth 2.0 Integration (Google Identity Services)
  const STORAGE_KEY_CLIENT_ID = 'td10_google_client_id';
  const DEFAULT_GOOGLE_CLIENT_ID = '590527192984-n971crnelc9e936m1lfilrdf8cie69ib.apps.googleusercontent.com';

  function getSavedGoogleClientId() {
    try {
      return localStorage.getItem(STORAGE_KEY_CLIENT_ID) || DEFAULT_GOOGLE_CLIENT_ID;
    } catch (e) {
      return DEFAULT_GOOGLE_CLIENT_ID;
    }
  }

  function updateGoogleOAuthStatusUI() {
    const cid = getSavedGoogleClientId();
    if (!oauthStatusText) return;
    if (cid) {
      const masked = cid.length > 20 ? `${cid.slice(0, 14)}...${cid.slice(-10)}` : cid;
      oauthStatusText.innerHTML = `สถานะ Google OAuth: <b class="connected">ตั้งค่า Client ID แล้ว (${masked})</b>`;
      if (inputGoogleClientId && !inputGoogleClientId.value) inputGoogleClientId.value = cid;
    } else {
      oauthStatusText.innerHTML = `สถานะ Google OAuth: <b>ยังไม่ได้ตั้งค่า Client ID</b>`;
    }
  }

  function triggerRealGoogleSignIn() {
    const clientId = getSavedGoogleClientId();

    if (!clientId) {
      if (oauthConfigInputs) oauthConfigInputs.style.display = 'block';
      if (btnToggleOAuthConfig) btnToggleOAuthConfig.textContent = 'ซ่อนการตั้งค่า';
      if (inputGoogleClientId) inputGoogleClientId.focus();
      alert('กรุณากรอก Google Client ID ที่ได้จาก Google Cloud Console ก่อนเปิดหน้าต่าง Google accounts.google.com ของจริงครับ\n\n(หากต้องการทดสอบระบบดึงข้อมูลชื่อ-สกุล @tun.ac.th ทันที สามารถคลิกบัญชีจำลอง "วิภูวนัย" ด้านล่างได้เลยครับ)');
      return;
    }

    if (typeof window.google === 'undefined' || !window.google.accounts || !window.google.accounts.oauth2) {
      alert('กำลังโหลดสคริปต์ Google Identity Services... กรุณาตรวจสอบการเชื่อมต่ออินเทอร์เน็ตแล้วลองใหม่อีกครั้ง');
      return;
    }

    try {
      if (txtConnectRealGoogle) txtConnectRealGoogle.textContent = 'กำลังเปิดหน้าต่าง Google...';

      const tokenClient = window.google.accounts.oauth2.initTokenClient({
        client_id: clientId,
        scope: 'email profile openid',
        callback: async (tokenResponse) => {
          if (txtConnectRealGoogle) txtConnectRealGoogle.textContent = 'เปิดหน้าต่าง Google ลงชื่อเข้าใช้จริง (OAuth 2.0)';

          if (tokenResponse.error) {
            console.error('Google OAuth error:', tokenResponse);
            alert(`เข้าสู่ระบบ Google ไม่สำเร็จ: ${tokenResponse.error_description || tokenResponse.error}`);
            return;
          }

          if (tokenResponse.access_token) {
            try {
              // Fetch user info from Google's UserInfo API
              const res = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
                headers: {
                  Authorization: `Bearer ${tokenResponse.access_token}`
                }
              });

              if (!res.ok) {
                throw new Error(`Google UserInfo API HTTP ${res.status}`);
              }

              const profile = await res.json();
              handleRealGoogleProfile(profile);
            } catch (fetchErr) {
              console.error('Failed to fetch Google profile:', fetchErr);
              alert('ไม่สามารถดึงข้อมูลโปรไฟล์จาก Google ได้ กรุณาลองใหม่อีกครั้ง');
            }
          }
        },
        error_callback: (err) => {
          if (txtConnectRealGoogle) txtConnectRealGoogle.textContent = 'เปิดหน้าต่าง Google ลงชื่อเข้าใช้จริง (OAuth 2.0)';
          console.error('Google Token Client init error:', err);
          alert(`เกิดข้อผิดพลาดในการเปิด Google Sign-in: ${err.message || 'โปรดตรวจสอบ Authorized Origins'}`);
        }
      });

      // Prompt account selector window
      tokenClient.requestAccessToken({ prompt: 'select_account' });
    } catch (err) {
      if (txtConnectRealGoogle) txtConnectRealGoogle.textContent = 'เปิดหน้าต่าง Google ลงชื่อเข้าใช้จริง (OAuth 2.0)';
      console.error('Real Google sign in failed:', err);
      alert(`ไม่สามารถเปิดหน้าต่าง Google ได้: ${err.message}\nโปรดตรวจสอบว่า Client ID ถูกต้อง`);
    }
  }

  function handleRealGoogleProfile(profile) {
    if (!profile || !profile.email) {
      alert('ไม่พบข้อมูลอีเมลจากบัญชี Google');
      return;
    }

    const email = profile.email.toLowerCase();
    const rawName = (profile.name || '').trim();
    const avatarUrl = profile.picture || '';

    // Check if school account: ends with @tun.ac.th or hosted domain is tun.ac.th
    if (email.endsWith('@tun.ac.th') || (profile.hd && profile.hd === 'tun.ac.th')) {
      const parsed = parseTunStudentAccount(rawName) || parseTunStudentAccount(email);
      let studentData;
      if (parsed) {
        studentData = { ...parsed };
      } else {
        const idPart = email.split('@')[0].replace(/\D/g, '') || '25784';
        studentData = {
          role: 'student-current',
          rawGoogleName: rawName || `นักเรียนเตรียมน้อม (รหัส ${idPart})`,
          fullname: rawName || `นักเรียนเตรียมน้อม (รหัส ${idPart})`,
          englishName: '',
          grade: 'นักเรียนเตรียมน้อม',
          studentId: idPart,
          email: email
        };
      }
      studentData.avatarUrl = avatarUrl;
      applyGoogleAccount(studentData);
    } else {
      // Alumni account (@gmail.com or other domains)
      const alumniData = {
        role: 'alumni',
        rawGoogleName: rawName,
        fullname: rawName || email.split('@')[0],
        email: email,
        avatarUrl: avatarUrl
      };
      applyGoogleAccount(alumniData);
    }
  }

  function applyGoogleAccount(accountData) {
    closeGoogleModal();
    if (window.TD_Audio && window.TD_Audio.playCassetteClickSound) {
      window.TD_Audio.playCassetteClickSound();
    }

    if (googleAuthInitiator === 'login') {
      handleGoogleLogin(accountData);
      return;
    }

    currentUser = { ...accountData };

    if (currentUser.role === 'student-current') {
      if (stuDisplayFullname) stuDisplayFullname.textContent = currentUser.fullname;
      if (stuDisplayGoogleRaw) stuDisplayGoogleRaw.textContent = currentUser.rawGoogleName || currentUser.fullname;
      if (stuDisplayGrade) stuDisplayGrade.textContent = currentUser.grade;
      if (stuDisplayId) stuDisplayId.textContent = currentUser.studentId;
      if (stuDisplayEmail) stuDisplayEmail.textContent = currentUser.email;

      if (stuRealAvatarImg) {
        if (currentUser.avatarUrl) {
          stuRealAvatarImg.src = currentUser.avatarUrl;
          stuRealAvatarImg.style.display = 'block';
        } else {
          stuRealAvatarImg.style.display = 'none';
        }
      }

      if (tapeBStepGoogle) tapeBStepGoogle.style.display = 'none';
      if (tapeBStepStudent) tapeBStepStudent.style.display = 'block';
      if (tapeBStepAlumni) tapeBStepAlumni.style.display = 'none';
      switchTape('register', true);
    } else {
      if (alumniDisplayEmail) alumniDisplayEmail.textContent = currentUser.email;
      if (alumniFullNameInput && currentUser.fullname) alumniFullNameInput.value = currentUser.fullname;

      if (tapeBStepGoogle) tapeBStepGoogle.style.display = 'none';
      if (tapeBStepStudent) tapeBStepStudent.style.display = 'none';
      if (tapeBStepAlumni) tapeBStepAlumni.style.display = 'block';
      switchTape('register', true);
    }
  }

  function handleCustomGoogleEmailSubmit() {
    const rawVal = customGoogleEmail?.value.trim() || '';
    if (!rawVal) {
      alert('กรุณากรอกอีเมล Google (@tun.ac.th หรือ @gmail.com) หรือชื่อบัญชีนักเรียนครับ');
      return;
    }

    // Try parsing as student pattern or student email
    const studentData = parseTunStudentAccount(rawVal);
    if (studentData) {
      applyGoogleAccount(studentData);
      return;
    }

    const emailVal = rawVal.toLowerCase();
    if (emailVal.includes('@')) {
      if (emailVal.endsWith('@tun.ac.th')) {
        const idPart = emailVal.split('@')[0];
        const numericId = idPart.replace(/\D/g, '') || '25784';
        applyGoogleAccount({
          role: 'student-current',
          rawGoogleName: `นักเรียนเตรียมน้อม (รหัส ${numericId})`,
          fullname: `นักเรียนเตรียมน้อม (รหัส ${numericId})`,
          email: emailVal,
          grade: 'นักเรียนเตรียมน้อม',
          studentId: numericId
        });
      } else {
        const namePart = rawVal.split('@')[0];
        applyGoogleAccount({
          role: 'alumni',
          fullname: namePart,
          email: emailVal
        });
      }
      return;
    }

    alert('รูปแบบไม่ถูกต้อง กรุณากรอกอีเมล เช่น 25784@tun.ac.th หรือชื่อบัญชี 611.16 วิภูวนัย(WIPUWANAI) ตั้งจิตมั่นคงชัย(TANGJITMANKONGCHAI)');
  }

  // Google Modal Event Listeners
  if (btnConnectRealGoogle) {
    btnConnectRealGoogle.addEventListener('click', triggerRealGoogleSignIn);
  }
  if (btnToggleOAuthConfig) {
    btnToggleOAuthConfig.addEventListener('click', () => {
      if (!oauthConfigInputs) return;
      const isHidden = oauthConfigInputs.style.display === 'none';
      oauthConfigInputs.style.display = isHidden ? 'block' : 'none';
      btnToggleOAuthConfig.textContent = isHidden ? 'ซ่อนการตั้งค่า' : 'ตั้งค่า / เปลี่ยน ID';
    });
  }
  if (btnSaveClientId) {
    btnSaveClientId.addEventListener('click', () => {
      const val = inputGoogleClientId?.value.trim() || '';
      if (!val) {
        localStorage.removeItem(STORAGE_KEY_CLIENT_ID);
        alert('ล้างค่า Google Client ID เรียบร้อยแล้ว');
      } else {
        localStorage.setItem(STORAGE_KEY_CLIENT_ID, val);
        alert('บันทึก Google Client ID เรียบร้อยแล้ว!');
        if (oauthConfigInputs) oauthConfigInputs.style.display = 'none';
        if (btnToggleOAuthConfig) btnToggleOAuthConfig.textContent = 'ตั้งค่า / เปลี่ยน ID';
      }
      updateGoogleOAuthStatusUI();
    });
  }
  if (btnSignUpWithGoogle) {
    btnSignUpWithGoogle.addEventListener('click', () => openGoogleModal('signup'));
  }
  if (btnLoginWithGoogle) {
    btnLoginWithGoogle.addEventListener('click', () => openGoogleModal('login'));
  }
  if (optAccountStudent) {
    optAccountStudent.addEventListener('click', () => {
      applyGoogleAccount({
        role: 'student-current',
        rawGoogleName: '611.16 วิภูวนัย(WIPUWANAI) ตั้งจิตมั่นคงชัย(TANGJITMANKONGCHAI)',
        fullname: 'วิภูวนัย ตั้งจิตมั่นคงชัย',
        englishName: 'WIPUWANAI TANGJITMANKONGCHAI',
        email: '25784@tun.ac.th',
        grade: 'ม.6 / ห้อง 11 (เลขที่ 16)',
        studentId: '25784'
      });
    });
  }
  if (optAccountAlumni) {
    optAccountAlumni.addEventListener('click', () => {
      applyGoogleAccount({
        role: 'alumni',
        fullname: 'สมชาย นามสมมุติ',
        email: 'somchai.alumni@gmail.com'
      });
    });
  }
  if (btnSubmitCustomEmail) {
    btnSubmitCustomEmail.addEventListener('click', handleCustomGoogleEmailSubmit);
  }
  if (customGoogleEmail) {
    customGoogleEmail.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        handleCustomGoogleEmailSubmit();
      }
    });
  }
  if (btnCancelGoogleModal) {
    btnCancelGoogleModal.addEventListener('click', closeGoogleModal);
  }
  if (googleAccountModal) {
    googleAccountModal.addEventListener('click', (e) => {
      if (e.target === googleAccountModal) closeGoogleModal();
    });
  }

  // Change Account triggers in Tape B
  if (btnStudentChangeAccount) {
    btnStudentChangeAccount.addEventListener('click', () => {
      if (tapeBStepGoogle) tapeBStepGoogle.style.display = 'block';
      if (tapeBStepStudent) tapeBStepStudent.style.display = 'none';
      if (tapeBStepAlumni) tapeBStepAlumni.style.display = 'none';
      openGoogleModal('signup');
    });
  }
  if (btnAlumniChangeAccount) {
    btnAlumniChangeAccount.addEventListener('click', () => {
      if (tapeBStepGoogle) tapeBStepGoogle.style.display = 'block';
      if (tapeBStepStudent) tapeBStepStudent.style.display = 'none';
      if (tapeBStepAlumni) tapeBStepAlumni.style.display = 'none';
      openGoogleModal('signup');
    });
  }

  // Render Packages on Tape C
  function renderPackagesForRole(role) {
    if (!pkgCardsMatrix) return;
    pkgCardsMatrix.innerHTML = '';

    const packages = role === 'student-current' ? STUDENT_PACKAGES : ALUMNI_PACKAGES;

    if (pkgSelectionKicker) {
      pkgSelectionKicker.textContent = role === 'student-current' ? 'PACKAGES // นักเรียนปัจจุบัน' : 'PACKAGES // ศิษย์เก่าเตรียมน้อม';
    }
    if (pkgSelectionTitle) {
      pkgSelectionTitle.textContent = role === 'student-current' ? 'เลือกแพ็กเกจบัตรคอนเสิร์ตสำหรับนักเรียน' : 'เลือกแพ็กเกจเสื้อและของที่ระลึกศิษย์เก่า';
    }
    if (pkgDeliveryBadge) {
      pkgDeliveryBadge.textContent = role === 'student-current' ? '[รับของที่โรงเรียน]' : '[จัดส่งตามที่อยู่]';
    }

    packages.forEach((pkg, idx) => {
      const card = document.createElement('div');
      card.className = `pkg-choice-card ${idx === 0 ? 'active' : ''}`;
      card.dataset.pkgId = pkg.id;
      card.innerHTML = `
        <div class="pkg-choice-top">
          <span class="pkg-choice-name">${pkg.name}</span>
          <span class="pkg-choice-price">${pkg.price}.-</span>
        </div>
        <div class="pkg-choice-desc">${pkg.desc}</div>
      `;

      card.addEventListener('click', () => {
        selectTapeCPackage(pkg, card);
      });

      pkgCardsMatrix.appendChild(card);
    });

    selectTapeCPackage(packages[0], pkgCardsMatrix.firstElementChild);
  }

  function selectTapeCPackage(pkg, cardEl) {
    selectedPackage = pkg;

    pkgCardsMatrix?.querySelectorAll('.pkg-choice-card').forEach(c => c.classList.remove('active'));
    if (cardEl) cardEl.classList.add('active');

    if (shirtCustomizerBox) {
      shirtCustomizerBox.style.display = pkg.hasShirt ? 'block' : 'none';
    }

    if (ppDynamicAmount) ppDynamicAmount.textContent = pkg.price.toFixed(2);
    if (tapeCPriceTag) tapeCPriceTag.textContent = `฿${pkg.price}.-`;

    if (window.TD_Audio && window.TD_Audio.playCassetteClickSound) {
      window.TD_Audio.playCassetteClickSound();
    }
  }

  // Shirt Customizer Controls
  if (custColorBrown) {
    custColorBrown.addEventListener('click', () => {
      custColorBrown.classList.add('active');
      if (custColorBeige) custColorBeige.classList.remove('active');
      selectedShirtColor = 'สีน้ำตาลเข้ม Espresso';
      if (window.TD_Audio && window.TD_Audio.playCassetteClickSound) window.TD_Audio.playCassetteClickSound();
    });
  }

  if (custColorBeige) {
    custColorBeige.addEventListener('click', () => {
      custColorBeige.classList.add('active');
      if (custColorBrown) custColorBrown.classList.remove('active');
      selectedShirtColor = 'สีเนื้อ Sand Beige';
      if (window.TD_Audio && window.TD_Audio.playCassetteClickSound) window.TD_Audio.playCassetteClickSound();
    });
  }

  if (pkgSizeChoiceGroup) {
    pkgSizeChoiceGroup.querySelectorAll('.cust-pill').forEach(btn => {
      btn.addEventListener('click', () => {
        pkgSizeChoiceGroup.querySelectorAll('.cust-pill').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        selectedShirtSize = btn.dataset.size || 'L';
        if (window.TD_Audio && window.TD_Audio.playCassetteClickSound) window.TD_Audio.playCassetteClickSound();
      });
    });
  }

  // Tape B Proceed to Tape C: Current Student
  if (btnStudentProceedPackages) {
    btnStudentProceedPackages.addEventListener('click', () => {
      if (!currentUser || currentUser.role !== 'student-current') {
        currentUser = {
          role: 'student-current',
          rawGoogleName: '611.16 วิภูวนัย(WIPUWANAI) ตั้งจิตมั่นคงชัย(TANGJITMANKONGCHAI)',
          fullname: 'วิภูวนัย ตั้งจิตมั่นคงชัย',
          englishName: 'WIPUWANAI TANGJITMANKONGCHAI',
          email: '25784@tun.ac.th',
          grade: 'ม.6 / ห้อง 11 (เลขที่ 16)',
          studentId: '25784'
        };
      }
      renderPackagesForRole('student-current');
      switchTape('payment', true);
    });
  }

  // Tape B Proceed to Tape C: Alumni Form
  if (alumniDetailsForm) {
    alumniDetailsForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const fullname = alumniFullNameInput?.value.trim();
      const phone = alumniPhoneInput?.value.trim();
      const address = alumniAddressInput?.value.trim();
      const batch = alumniBatchSelect?.value;

      if (!fullname || !phone || !address || !batch) {
        alert('กรุณากรอกข้อมูลให้ครบทั้ง 4 ช่อง (ชื่อ-นามสกุล, เบอร์โทร, ที่อยู่จัดส่ง, รุ่นที่จบ)');
        return;
      }

      currentUser = {
        role: 'alumni',
        fullname,
        email: alumniDisplayEmail?.textContent || 'somchai.alumni@gmail.com',
        phone,
        address,
        batch
      };

      renderPackagesForRole('alumni');
      switchTape('payment', true);
    });
  }

  // Back from Tape C to Tape B
  if (btnBackToTapeB) {
    btnBackToTapeB.addEventListener('click', () => {
      switchTape('register', true);
    });
  }

  // Slip File Handler
  function handleSlipFile(file) {
    if (!file || !file.type.startsWith('image/')) {
      alert('กรุณาเลือกไฟล์ภาพสลิปที่ถูกต้อง (JPG, PNG)');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      currentSlipDataUrl = e.target.result;
      if (slipPreviewImg) slipPreviewImg.src = currentSlipDataUrl;
      if (slipFileName) slipFileName.textContent = file.name;
      if (slipEmptyState) slipEmptyState.style.display = 'none';
      if (slipPreviewState) slipPreviewState.style.display = 'flex';
      if (window.TD_Audio && window.TD_Audio.playCassetteClickSound) {
        window.TD_Audio.playCassetteClickSound();
      }
    };
    reader.readAsDataURL(file);
  }

  if (regSlipInput) {
    regSlipInput.addEventListener('change', (e) => {
      if (e.target.files && e.target.files[0]) {
        handleSlipFile(e.target.files[0]);
      }
    });
  }

  if (btnReselectSlip) {
    btnReselectSlip.addEventListener('click', (e) => {
      e.stopPropagation();
      currentSlipDataUrl = null;
      if (regSlipInput) regSlipInput.value = '';
      if (slipEmptyState) slipEmptyState.style.display = 'flex';
      if (slipPreviewState) slipPreviewState.style.display = 'none';
      if (regSlipInput) regSlipInput.click();
    });
  }

  if (slipDropzone) {
    ['dragenter', 'dragover'].forEach(eventName => {
      slipDropzone.addEventListener(eventName, (e) => {
        e.preventDefault();
        slipDropzone.classList.add('drag-over');
      });
    });

    ['dragleave', 'drop'].forEach(eventName => {
      slipDropzone.addEventListener(eventName, (e) => {
        e.preventDefault();
        slipDropzone.classList.remove('drag-over');
      });
    });

    slipDropzone.addEventListener('drop', (e) => {
      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
        handleSlipFile(e.dataTransfer.files[0]);
      }
    });
  }

  // Submit Payment & Slip -> Pending Approval View
  if (btnSubmitPayment) {
    btnSubmitPayment.addEventListener('click', () => {
      if (!currentSlipDataUrl) {
        alert('กรุณาแนบภาพสลิปหลักฐานการโอนเงินก่อนส่งขออนุมัติครับ');
        if (slipDropzone) {
          slipDropzone.style.borderColor = '#ef4444';
          setTimeout(() => { slipDropzone.style.borderColor = '#d97706'; }, 1500);
        }
        return;
      }

      if (!currentUser || !selectedPackage) {
        alert('กรุณาเลือกแพ็กเกจให้เรียบร้อยก่อนชำระเงิน');
        return;
      }

      if (window.TD_Audio && window.TD_Audio.playCassetteClickSound) {
        window.TD_Audio.playCassetteClickSound();
      }

      const nowStr = new Date().toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' }) + ' น.';
      const isStudent = currentUser.role === 'student-current';

      if (summaryFullname) summaryFullname.textContent = currentUser.fullname;
      if (summaryRole) summaryRole.textContent = isStudent ? 'นักเรียนปัจจุบัน' : `ศิษย์เก่าเตรียมน้อม (รุ่นที่ ${currentUser.batch})`;
      if (summaryIdOrYear) summaryIdOrYear.textContent = isStudent ? `รหัสประจำตัว: ${currentUser.studentId} (${currentUser.grade})` : `รุ่นที่ ${currentUser.batch}`;
      if (summaryContact) summaryContact.textContent = isStudent ? currentUser.email : `โทร: ${currentUser.phone} (${currentUser.email})`;

      const shirtDetail = selectedPackage.hasShirt ? ` [${selectedShirtColor} / ไซส์ ${selectedShirtSize}]` : '';
      if (summaryPackageChosen) {
        summaryPackageChosen.textContent = `${selectedPackage.name} (${selectedPackage.price}.-)${shirtDetail}`;
      }

      if (summaryDeliveryNote) {
        summaryDeliveryNote.textContent = isStudent
          ? '[การรับของ] รับที่โรงเรียน (วันเวลาจะแจ้งให้ทราบอีกครั้ง)'
          : `[การจัดส่ง] จัดส่งตามที่อยู่: ${currentUser.address}`;
      }

      if (summaryPaidAmountText) {
        summaryPaidAmountText.textContent = `[ยืนยัน] ยอดโอน ฿${selectedPackage.price}.00 (พร้อมเพย์)`;
      }

      if (summarySlipThumbnail) summarySlipThumbnail.src = currentSlipDataUrl;
      if (summarySubmitTime) summarySubmitTime.textContent = `ส่งคำขอเมื่อ: วันนี้ ${nowStr}`;

      const pendingRecord = {
        id: `TD10-${currentUser.studentId || Math.floor(1000 + Math.random() * 9000)}`,
        fullname: currentUser.fullname,
        rawGoogleName: currentUser.rawGoogleName || currentUser.fullname,
        role: currentUser.role,
        email: currentUser.email,
        studentId: currentUser.studentId || '',
        grade: currentUser.grade || '',
        phone: currentUser.phone || '',
        address: currentUser.address || '',
        batch: currentUser.batch || '',
        package: selectedPackage.name,
        packageName: selectedPackage.name,
        price: selectedPackage.price,
        shirtColor: selectedPackage.hasShirt ? selectedShirtColor : null,
        shirtSize: selectedPackage.hasShirt ? selectedShirtSize : null,
        hasShirt: Boolean(selectedPackage.hasShirt),
        slipUrl: currentSlipDataUrl,
        submittedAt: nowStr,
        status: 'pending',
        rejectReason: ''
      };

      try {
        localStorage.setItem('td10_pending_user', JSON.stringify(pendingRecord));

        // Sync with td10_orders for the Admin Backoffice
        let allOrders = [];
        try {
          const storedOrders = localStorage.getItem('td10_orders');
          if (storedOrders) allOrders = JSON.parse(storedOrders);
        } catch (e) {}

        // Remove older record for same user if exists, then prepend new
        allOrders = allOrders.filter(o => 
          !(o.email && o.email === pendingRecord.email) &&
          !(o.studentId && pendingRecord.studentId && o.studentId === pendingRecord.studentId)
        );
        allOrders.unshift(pendingRecord);
        localStorage.setItem('td10_orders', JSON.stringify(allOrders));
      } catch (err) {}

      if (tapeCPaymentView) tapeCPaymentView.style.display = 'none';
      if (tapeCApprovalView) tapeCApprovalView.style.display = 'flex';
    });
  }

  // Approval View Navigation
  if (btnGoToLoginFromApproval) {
    btnGoToLoginFromApproval.addEventListener('click', () => {
      switchTape('login', true);
    });
  }

  if (btnCloseFromApproval) {
    btnCloseFromApproval.addEventListener('click', closeAuth);
  }

  // Helper: Find user order in td10_orders or td10_pending_user
  function findUserOrderRecord(identifier, studentData) {
    try {
      const storedOrders = localStorage.getItem('td10_orders');
      if (storedOrders) {
        const list = JSON.parse(storedOrders);
        const match = list.find(o => 
          (o.email && (o.email === identifier || (studentData && o.email === studentData.email))) ||
          (o.studentId && (o.studentId === identifier || (studentData && o.studentId === studentData.studentId))) ||
          (o.fullname && o.fullname === identifier)
        );
        if (match) return match;
      }

      const singlePending = localStorage.getItem('td10_pending_user');
      if (singlePending) {
        const p = JSON.parse(singlePending);
        if (
          p.email === identifier ||
          p.studentId === identifier ||
          p.fullname === identifier ||
          (studentData && (p.email === studentData.email || p.studentId === studentData.studentId))
        ) {
          return p;
        }
      }
    } catch (e) {}
    return null;
  }

  // Handle Google Login Check
  function handleGoogleLogin(accountData) {
    const record = findUserOrderRecord(accountData.email, accountData);

    if (record) {
      if (record.status === 'approved') {
        alert(`[อนุมัติแล้ว - ยินดีต้อนรับ]\nคณะกรรมการสภานักเรียนได้อนุมัติคำขอของ "${record.fullname}" เรียบร้อยแล้ว!\nแพ็กเกจ: ${record.packageName || record.package}\n\nเข้าสู่ระบบ TRIAMDOD 10 เพื่อรับ OFFICIAL PASS เรียบร้อยแล้วครับ`);
        closeAuth();
        return;
      } else if (record.status === 'rejected') {
        alert(`[แจ้งเตือนสลิปไม่ผ่านการอนุมัติ]\nคำขอของ "${record.fullname}" ไม่ผ่านการตรวจสอบเนื่องจาก:\n"${record.rejectReason || 'ภาพสลิปไม่ชัดเจน หรือยอดเงินไม่ถูกต้อง'}"\n\nกรุณาติดต่อสภานักเรียน หรือลงทะเบียนแนบสลิปใหม่อีกครั้งครับ`);
        return;
      } else {
        alert(`[แจ้งเตือนการตรวจสอบ]\nคำขอของ "${record.fullname}" (${record.packageName || record.package})\nอยู่ระหว่างรอตรวจสอบและอนุมัติจากคณะกรรมการสภานักเรียน ปีการศึกษา 2569\n\n(บันทึกสลิปเมื่อ ${record.submittedAt})\nกรุณารอการอนุมัติภายใน 24 ชม.`);
        return;
      }
    }

    alert(`เข้าสู่ระบบสำเร็จด้วย Google Account:\n${accountData.fullname} (${accountData.email})`);
    closeAuth();
  }

  // Handle Manual Form Login Submission
  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      if (window.TD_Audio && window.TD_Audio.playCassetteClickSound) {
        window.TD_Audio.playCassetteClickSound();
      }

      const inputUser = document.getElementById('loginUsername')?.value.trim();
      const studentData = parseTunStudentAccount(inputUser);
      const record = findUserOrderRecord(inputUser, studentData);

      if (record) {
        if (record.status === 'approved') {
          alert(`[อนุมัติแล้ว - ยินดีต้อนรับ]\nคณะกรรมการสภานักเรียนได้อนุมัติคำขอของ "${record.fullname}" เรียบร้อยแล้ว!\nแพ็กเกจ: ${record.packageName || record.package}\n\nเข้าสู่ระบบ TRIAMDOD 10 เรียบร้อยแล้วครับ`);
          closeAuth();
          return;
        } else if (record.status === 'rejected') {
          alert(`[แจ้งเตือนสลิปไม่ผ่านการอนุมัติ]\nคำขอของ "${record.fullname}" ไม่ผ่านการตรวจสอบเนื่องจาก:\n"${record.rejectReason || 'สลิปไม่ถูกต้อง'}"\n\nกรุณาติดต่อสภานักเรียน หรือลงทะเบียนแนบสลิปใหม่อีกครั้งครับ`);
          return;
        } else {
          alert(`[แจ้งเตือนการตรวจสอบ]\nคำขอของ "${record.fullname}" อยู่ระหว่างรอตรวจสอบและอนุมัติจากคณะกรรมการสภานักเรียน ปีการศึกษา 2569\n\nคณะกรรมการกำลังตรวจสอบสลิปการโอนเงิน (บันทึกเมื่อ ${record.submittedAt})\nกรุณารอการอนุมัติภายใน 24 ชม.`);
          return;
        }
      }

      if (studentData) {
        currentUser = studentData;
        alert(`ยินดีต้อนรับคุณ ${studentData.fullname} (${studentData.grade} • รหัส ${studentData.studentId})\nเข้าสู่ระบบ TRIAMDOD 10 เรียบร้อยแล้ว!`);
        closeAuth();
        return;
      }

      const user = inputUser || 'สมาชิก';
      alert(`ยินดีต้อนรับคุณ ${user} เข้าสู่ระบบ TRIAMDOD 10 เรียบร้อยแล้ว!`);
      closeAuth();
    });
  }

  // Global auth helpers
  openAuthBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const tab = btn.dataset.authTab || (btn.id === 'openWaitlistBtn' ? 'register' : 'login');
      openAuth(tab);
    });
  });

  window.TD_Auth = {
    openAuth,
    closeAuth,
    switchTape,
    openGoogleModal,
    closeGoogleModal
  };

  if (closeAuthBtn) closeAuthBtn.addEventListener('click', closeAuth);
  if (authModal) {
    authModal.addEventListener('click', (e) => {
      if (e.target === authModal) closeAuth();
    });
  }

  tapeSelectBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      switchTape(btn.dataset.tab, true);
    });
  });

  if (tapeA) {
    tapeA.addEventListener('click', (e) => {
      if (!tapeA.classList.contains('active-front') && !e.target.closest('button, input, select')) {
        switchTape('login', true);
      }
    });
  }

  if (tapeB) {
    tapeB.addEventListener('click', (e) => {
      if (!tapeB.classList.contains('active-front') && !e.target.closest('button, input, select')) {
        switchTape('register', true);
      }
    });
  }

  if (tapeC) {
    tapeC.addEventListener('click', (e) => {
      if (!tapeC.classList.contains('active-front') && !e.target.closest('button, input, select')) {
        switchTape('payment', true);
      }
    });
  }

  const pencilInputs = document.querySelectorAll('.pencil-input, .pencil-select');
  pencilInputs.forEach(input => {
    input.addEventListener('input', () => {
      const card = input.closest('.cassette-tape-card');
      if (card) {
        card.classList.add('spinning');
        clearTimeout(card._spinTimer);
        card._spinTimer = setTimeout(() => {
          card.classList.remove('spinning');
        }, 800);
      }
    });
  });

  // --------------------------------------------------------------------------
  // 6. Polaroid Lightbox Modal (Click to View Photo Story)
  // --------------------------------------------------------------------------
  const lightboxModal = document.getElementById('polaroidLightboxModal');
  const lightboxCloseBtn = document.getElementById('lightboxCloseBtn');
  const lightboxTitle = document.getElementById('lightboxTitle');
  const lightboxStory = document.getElementById('lightboxStory');
  const lightboxDate = document.getElementById('lightboxDate');
  const lightboxCamera = document.getElementById('lightboxCamera');
  const lightboxFrame = document.getElementById('lightboxFrame');
  const polaroids = document.querySelectorAll('.polaroid-card');

  polaroids.forEach(card => {
    card.addEventListener('click', () => {
      playCameraShutterSound();

      const title = card.dataset.title || 'ความทรงจำ TRIAMDOD';
      const story = card.dataset.story || '';
      const date = card.dataset.date || '';
      const camera = card.dataset.camera || '35mm Film Camera';
      const svgArt = card.querySelector('.polaroid-photo-viewport')?.innerHTML || '';

      if (lightboxTitle) lightboxTitle.textContent = title;
      if (lightboxStory) lightboxStory.textContent = story;
      if (lightboxDate) lightboxDate.textContent = date;
      if (lightboxCamera) lightboxCamera.textContent = camera;
      if (lightboxFrame) lightboxFrame.innerHTML = svgArt;

      if (lightboxModal) {
        lightboxModal.classList.add('active');
        document.body.style.overflow = 'hidden';
      }
    });
  });

  function closeLightbox() {
    if (!lightboxModal) return;
    lightboxModal.classList.remove('active');
    document.body.style.overflow = '';
  }

  if (lightboxCloseBtn) lightboxCloseBtn.addEventListener('click', closeLightbox);
  if (lightboxModal) {
    lightboxModal.addEventListener('click', (e) => {
      if (e.target === lightboxModal) closeLightbox();
    });
  }

  // ESC key closes modals
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeAuth();
      closeLightbox();
      closeGoogleModal();
    }
  });

  // --------------------------------------------------------------------------
  // 7. Back To Top Button
  // --------------------------------------------------------------------------
  const backToTopBtn = document.getElementById('btnBackToTop');
  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      playCameraShutterSound();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

})();
