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
  const tabTapeD = document.getElementById('tabTapeD');
  const tapeA = document.getElementById('tapeA');
  const tapeB = document.getElementById('tapeB');
  const tapeC = document.getElementById('tapeC');
  const tapeD = document.getElementById('tapeD');
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
  const stuPhoneInput = document.getElementById('stuPhoneInput');
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

  // Tape D: User Profile & Edit Data Elements (Cassette Stack)
  const deckLogoutBtn = document.getElementById('deckLogoutBtn');
  const tapeDStatusBanner = document.getElementById('tapeDStatusBanner');
  const tapeDStatusBadge = document.getElementById('tapeDStatusBadge');
  const tapeDStatusContent = document.getElementById('tapeDStatusContent');
  const tapeDProfileForm = document.getElementById('tapeDProfileForm');
  const tapeDStudentView = document.getElementById('tapeDStudentView');
  const tapeDAlumniView = document.getElementById('tapeDAlumniView');
  const dStuFullname = document.getElementById('dStuFullname');
  const dStuId = document.getElementById('dStuId');
  const dStuGrade = document.getElementById('dStuGrade');
  const dStuEmail = document.getElementById('dStuEmail');
  const dStuPhoneInput = document.getElementById('dStuPhoneInput');
  const dAlumniEmail = document.getElementById('dAlumniEmail');
  const dAlumniFullnameInput = document.getElementById('dAlumniFullnameInput');
  const dAlumniPhoneInput = document.getElementById('dAlumniPhoneInput');
  const dAlumniAddressInput = document.getElementById('dAlumniAddressInput');
  const dAlumniBatchSelect = document.getElementById('dAlumniBatchSelect');
  const btnTapeDSave = document.getElementById('btnTapeDSave');
  const btnTapeDLogout = document.getElementById('btnTapeDLogout');

  // Modern In-App Notice Modal Elements
  const retroNoticeModal = document.getElementById('retroNoticeModal');
  const retroNoticeCard = document.getElementById('retroNoticeCard');
  const retroNoticeBadge = document.getElementById('retroNoticeBadge');
  const retroNoticeTitle = document.getElementById('retroNoticeTitle');
  const retroNoticeIcon = document.getElementById('retroNoticeIcon');
  const retroNoticeMessage = document.getElementById('retroNoticeMessage');
  const retroNoticeConfirmBtn = document.getElementById('retroNoticeConfirmBtn');
  const retroNoticeCancelBtn = document.getElementById('retroNoticeCancelBtn');
  const retroNoticeCloseX = document.getElementById('retroNoticeCloseX');
  const retroNoticeConfirmText = document.getElementById('retroNoticeConfirmText');

  // Real Google OAuth 2.0 Elements
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
  let pendingRegistrationUser = null;
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

  // Populate Tape D Alumni Batch Select (1 - 37)
  if (dAlumniBatchSelect) {
    dAlumniBatchSelect.innerHTML = '<option value="" disabled selected>-- เลือกรุ่นที่จบ (รุ่นที่ 1 ถึง 37) --</option>';
    for (let b = 1; b <= 37; b++) {
      const opt = document.createElement('option');
      opt.value = String(b);
      opt.textContent = `เตรียมน้อม รุ่นที่ ${b}`;
      dAlumniBatchSelect.appendChild(opt);
    }
  }

  // Navigation User Bar State
  function updateNavUser(user) {
    const navAuthBtn = document.getElementById('openAuthModalBtn');
    if (!navAuthBtn) return;
    const authTextSpan = navAuthBtn.querySelector('.auth-btn-text');

    if (user && (user.fullname || user.email)) {
      const displayName = user.fullname || user.email;
      if (authTextSpan) {
        authTextSpan.textContent = displayName;
      }
      navAuthBtn.classList.add('user-logged-in');
      navAuthBtn.setAttribute('title', `บัญชี: ${displayName} (คลิกเพื่อดูโปรไฟล์ / ตรวจสอบบัตร / แก้ไขข้อมูล)`);
      if (deckLogoutBtn) deckLogoutBtn.style.display = 'inline-flex';
      if (tabTapeD) tabTapeD.style.display = 'inline-flex';
      try {
        localStorage.setItem('td10_current_session', JSON.stringify(user));
      } catch (e) {}
    } else {
      if (authTextSpan) {
        authTextSpan.textContent = 'สมัครสมาชิก / เข้าสู่ระบบ';
      }
      navAuthBtn.classList.remove('user-logged-in');
      navAuthBtn.removeAttribute('title');
      if (deckLogoutBtn) deckLogoutBtn.style.display = 'none';
      if (tabTapeD) tabTapeD.style.display = 'none';
      if (tabTapeC) tabTapeC.style.display = 'none';
      try {
        localStorage.removeItem('td10_current_session');
      } catch (e) {}
    }
  }

  // Restore current session on page load
  try {
    const savedSession = localStorage.getItem('td10_current_session');
    if (savedSession) {
      currentUser = JSON.parse(savedSession);
      updateNavUser(currentUser);
    }
  } catch (e) {}

  function openAuth(defaultTab = 'login') {
    if (!authModal) return;
    if (window.TD_Audio && window.TD_Audio.playCassetteClickSound) {
      window.TD_Audio.playCassetteClickSound();
    }
    document.body.classList.add('modal-active');
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
    if (!retroNoticeModal || !retroNoticeModal.classList.contains('active')) {
      document.body.classList.remove('modal-active');
      document.body.style.overflow = '';
    }
  }

  function switchTape(tab, playSound = true) {
    if (playSound && window.TD_Audio && window.TD_Audio.playCassetteClickSound) {
      window.TD_Audio.playCassetteClickSound();
    }

    if (tab === 'payment' && tabTapeC) {
      tabTapeC.style.display = 'inline-flex';
    }
    if (tab === 'profile' && tabTapeD) {
      tabTapeD.style.display = 'inline-flex';
    }

    tapeSelectBtns.forEach(b => {
      if (b.dataset.tab === tab) {
        b.classList.add('active');
      } else {
        b.classList.remove('active');
      }
    });

    [tapeA, tapeB, tapeC, tapeD].forEach(tape => {
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
      if (tapeD) {
        tapeD.classList.add('stacked-behind');
        tapeD.classList.add('stacked-deep');
      }
    } else if (tab === 'register') {
      if (tapeB) tapeB.classList.add('active-front');
      if (tapeA) tapeA.classList.add('stacked-behind');
      if (tapeC) tapeC.classList.add('stacked-behind');
      if (tapeD) {
        tapeD.classList.add('stacked-behind');
        tapeD.classList.add('stacked-deep');
      }
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
      if (tapeD) {
        tapeD.classList.add('stacked-behind');
        tapeD.classList.add('stacked-deep');
      }
    } else if (tab === 'profile') {
      renderTapeDProfileData();
      if (tapeD) tapeD.classList.add('active-front');
      if (tapeA) {
        tapeA.classList.add('stacked-behind');
        tapeA.classList.add('stacked-deep');
      }
      if (tapeB) tapeB.classList.add('stacked-behind');
      if (tapeC) {
        tapeC.classList.add('stacked-behind');
        tapeC.classList.add('stacked-deep');
      }
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
   * Smart Parser for School Account & Student Credentials:
   * Accepts:
   * - Student ID: "25784"
   * - Thai Name: "วิภูวนัย", "วิภูวนัย ตั้งจิตมั่นคงชัย", "นายวิภูวนัย ตั้งจิตมั่นคงชัย"
   * - English Name: "Wipuwanai", "WIPUWANAI TANGJITMANKONGCHAI"
   * - School Code: "611.16", "6/11.16", "ม.6/11 เลขที่ 16 วิภูวนัย..."
   * - School Email: "25784@tun.ac.th"
   */
  function parseTunStudentAccount(input) {
    if (!input) return null;
    const clean = input.trim();
    const cleanLower = clean.toLowerCase();

    // 1. Direct match in known directory by studentId, name, or email
    for (const [id, s] of Object.entries(TUN_STUDENT_DIRECTORY)) {
      if (
        id === clean ||
        s.email.toLowerCase() === cleanLower ||
        cleanLower.includes(id) ||
        s.fullname.includes(clean) ||
        clean.includes(s.fullname) ||
        clean.includes(s.fullname.split(' ')[0]) ||
        (s.englishName && (s.englishName.toLowerCase().includes(cleanLower) || cleanLower.includes(s.englishName.toLowerCase().split(' ')[0]))) ||
        (s.rawGoogleName && s.rawGoogleName.includes(clean))
      ) {
        return {
          role: 'student-current',
          ...s
        };
      }
    }

    // 2. Parse school naming pattern:
    // e.g. "611.16 วิภูวนัย(WIPUWANAI) ตั้งจิตมั่นคงชัย(TANGJITMANKONGCHAI)"
    // or "ม.6/11 เลขที่ 16 วิภูวนัย ตั้งจิตมั่นคงชัย" or "6/11.16 วิภูวนัย"
    const patternRegex = /^(?:ม\.)?([1-6])[\/.]?(\d{1,2})[\s.]*(?:เลขที่\s*)?(\d+)\s+(.+)$/;
    const match = clean.match(patternRegex);
    if (match) {
      const gradeLevel = match[1];
      const room = parseInt(match[2], 10);
      const seatNo = parseInt(match[3], 10);
      const namePart = match[4].trim();

      // Extract Thai name and English in brackets if present
      let thaiFirst = '';
      let thaiLast = '';
      let engName = '';

      const bracketMatches = [...namePart.matchAll(/\(([^)]+)\)/g)].map(m => m[1]);
      if (bracketMatches.length > 0) {
        engName = bracketMatches.join(' ');
      }

      const stripped = namePart.replace(/\([^)]*\)/g, '').trim().split(/\s+/);
      thaiFirst = stripped[0] || 'นักเรียน';
      thaiLast = stripped.slice(1).join(' ') || '';

      const fullname = `${thaiFirst} ${thaiLast}`.trim();
      const gradeStr = `ม.${gradeLevel} / ห้อง ${room} (เลขที่ ${seatNo})`;
      const studentId = `${gradeLevel}${String(room).padStart(2, '0')}${String(seatNo).padStart(2, '0')}`;
      const email = `${studentId}@tun.ac.th`;

      return {
        role: 'student-current',
        rawGoogleName: clean,
        fullname,
        englishName: engName,
        gradeLevel: String(gradeLevel),
        room: String(room),
        seatNo: String(seatNo),
        grade: gradeStr,
        studentId,
        email
      };
    }

    // 3. 5-digit Student ID (e.g. 25784, 25123)
    if (/^\d{5}$/.test(clean)) {
      if (TUN_STUDENT_DIRECTORY[clean]) {
        return { role: 'student-current', ...TUN_STUDENT_DIRECTORY[clean] };
      }
      return {
        role: 'student-current',
        rawGoogleName: `นักเรียนเตรียมน้อม (รหัส ${clean})`,
        fullname: `นักเรียนเตรียมน้อม (รหัส ${clean})`,
        englishName: '',
        grade: 'นักเรียนเตรียมน้อม',
        studentId: clean,
        email: `${clean}@tun.ac.th`
      };
    }

    // 4. Standard @tun.ac.th school email
    if (cleanLower.endsWith('@tun.ac.th')) {
      const idOnly = cleanLower.replace(/@tun\.ac\.th$/i, '').trim();
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
        email: cleanLower
      };
    }

    // 5. Thai Name input (e.g. "วิภูวนัย ตั้งจิตมั่นคงชัย" or "ก้องภพ สมใจ")
    if (/[\u0E00-\u0E7F]/.test(clean)) {
      const cleanName = clean.replace(/^(นาย|นางสาว|ด\.ช\.|ด\.ญ\.|น\.ส\.)\s*/, '').trim();
      return {
        role: 'student-current',
        rawGoogleName: cleanName,
        fullname: cleanName,
        englishName: '',
        grade: 'นักเรียนเตรียมน้อม',
        studentId: '25784',
        email: '25784@tun.ac.th'
      };
    }

    return null;
  }

  // Real Google OAuth 2.0 Integration (Google Identity Services)
  const DEFAULT_GOOGLE_CLIENT_ID = '590527192984-n971crnelc9e936m1lfilrdf8cie69ib.apps.googleusercontent.com';
  let googleTokenClientInstance = null;

  function setGoogleButtonsLoading(loading) {
    const btnHero = document.getElementById('btnSignUpWithGoogle');
    const btnLogin = document.getElementById('btnLoginWithGoogle');
    
    if (btnHero) {
      const span = btnHero.querySelector('span');
      if (span) span.textContent = loading ? 'กำลังเชื่อมต่อกับ Google...' : 'ดำเนินการต่อด้วย Google Account';
      btnHero.disabled = loading;
      btnHero.style.opacity = loading ? '0.7' : '1';
    }
    if (btnLogin) {
      const span = btnLogin.querySelector('span');
      if (span) span.textContent = loading ? 'กำลังเชื่อมต่อ Google...' : 'เข้าสู่ระบบด้วย Google Account';
      btnLogin.disabled = loading;
      btnLogin.style.opacity = loading ? '0.7' : '1';
    }
  }

  // Format Thai Buddhist Era date for thermal receipt (e.g. 18/10/69 11:28)
  function formatReceiptThaiDate() {
    const now = new Date();
    const day = String(now.getDate()).padStart(2, '0');
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const yearBE = String((now.getFullYear() + 543) % 100).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const mins = String(now.getMinutes()).padStart(2, '0');
    return `${day}/${month}/${yearBE} ${hours}:${mins}`;
  }

  // Authentic 7-Eleven POS thermal printer motor sound synthesis
  function playThermalPrinterSound() {
    try {
      if (window.TD_Audio && window.TD_Audio.initAudioContext) {
        window.TD_Audio.initAudioContext();
      }
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const now = ctx.currentTime;
      [0, 0.035, 0.07, 0.105].forEach((offset, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(1700 + idx * 220, now + offset);
        osc.frequency.exponentialRampToValueAtTime(320, now + offset + 0.024);
        gain.gain.setValueAtTime(0.06, now + offset);
        gain.gain.exponentialRampToValueAtTime(0.001, now + offset + 0.024);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + offset);
        osc.stop(now + offset + 0.028);
      });
    } catch (e) {
      if (window.TD_Audio && window.TD_Audio.playCassetteClickSound) {
        window.TD_Audio.playCassetteClickSound();
      }
    }
  }

  // Official Council Receipt Rubber Stamp Badge (Zero emojis)
  function getReceiptStampBadge(type) {
    if (type === 'success' || type === 'pass') {
      return `<span class="stamp-border-inner"><span class="stamp-text-badge">[ APPROVED // อนุมัติ ]</span></span>`;
    }
    if (type === 'error' || type === 'rejected') {
      return `<span class="stamp-border-inner"><span class="stamp-text-badge">[ REJECTED // ไม่อนุมัติ ]</span></span>`;
    }
    if (type === 'warning') {
      return `<span class="stamp-border-inner"><span class="stamp-text-badge">[ WARNING // ข้อควรระวัง ]</span></span>`;
    }
    if (type === 'confirm') {
      return `<span class="stamp-border-inner"><span class="stamp-text-badge">[ CONFIRM // โปรดยืนยัน ]</span></span>`;
    }
    return `<span class="stamp-border-inner"><span class="stamp-text-badge">[ NOTICE // การแจ้งเตือน ]</span></span>`;
  }

  // Convenience Store Thermal Paper Receipt Dialog Controller
  let retroNoticeOnConfirm = null;
  let retroNoticeOnCancel = null;

  function showRetroAlert(title, message, type = 'info', onOk = null) {
    playThermalPrinterSound();

    if (!retroNoticeModal) {
      if (typeof onOk === 'function') onOk();
      return;
    }

    retroNoticeOnConfirm = onOk;
    retroNoticeOnCancel = null;

    const normType = (type === 'pass') ? 'success' : (type === 'rejected') ? 'error' : type;

    if (retroNoticeCard) {
      retroNoticeCard.dataset.noticeType = normType;
    }

    const receiptTs = document.getElementById('receiptTimestamp');
    if (receiptTs) {
      receiptTs.textContent = formatReceiptThaiDate();
    }

    if (retroNoticeBadge) {
      if (normType === 'success') retroNoticeBadge.textContent = 'ใบเสร็จรับเงิน/อนุมัติสิทธิ์อย่างย่อ';
      else if (normType === 'warning') retroNoticeBadge.textContent = 'ใบแจ้งเตือน/ตรวจสอบรายการ';
      else if (normType === 'error') retroNoticeBadge.textContent = 'ใบแจ้งข้อผิดพลาดรายการ';
      else retroNoticeBadge.textContent = 'ใบเสร็จรับเงิน/ใบแจ้งเตือนอย่างย่อ';
    }

    if (retroNoticeTitle) {
      retroNoticeTitle.textContent = title || 'การแจ้งเตือนจากระบบ';
    }

    if (retroNoticeMessage) {
      retroNoticeMessage.textContent = message || '';
    }

    if (retroNoticeIcon) {
      retroNoticeIcon.className = `receipt-ink-stamp type-${normType}`;
      retroNoticeIcon.innerHTML = getReceiptStampBadge(normType);
    }

    if (retroNoticeCancelBtn) retroNoticeCancelBtn.style.display = 'none';
    if (retroNoticeConfirmText) retroNoticeConfirmText.textContent = 'รับทราบ // ตกลง';

    document.body.classList.add('modal-active');
    retroNoticeModal.classList.add('active');
  }

  function showRetroConfirm(title, message, onConfirm = null, onCancel = null) {
    playThermalPrinterSound();

    if (!retroNoticeModal) {
      if (typeof onConfirm === 'function') onConfirm();
      return;
    }

    retroNoticeOnConfirm = onConfirm;
    retroNoticeOnCancel = onCancel;

    if (retroNoticeCard) {
      retroNoticeCard.dataset.noticeType = 'confirm';
    }

    const receiptTs = document.getElementById('receiptTimestamp');
    if (receiptTs) {
      receiptTs.textContent = formatReceiptThaiDate();
    }

    if (retroNoticeBadge) {
      retroNoticeBadge.textContent = 'ใบยืนยันการทำรายการอย่างย่อ';
    }

    if (retroNoticeTitle) {
      retroNoticeTitle.textContent = title || 'โปรดยืนยันการทำรายการ';
    }

    if (retroNoticeMessage) {
      retroNoticeMessage.textContent = message || '';
    }

    if (retroNoticeIcon) {
      retroNoticeIcon.className = 'receipt-ink-stamp type-confirm';
      retroNoticeIcon.innerHTML = getReceiptStampBadge('confirm');
    }

    if (retroNoticeCancelBtn) retroNoticeCancelBtn.style.display = 'inline-flex';
    if (retroNoticeConfirmText) retroNoticeConfirmText.textContent = 'ฉีกเก็บ // ยืนยัน';

    document.body.classList.add('modal-active');
    retroNoticeModal.classList.add('active');
  }

  function closeRetroNotice(isConfirmed = false) {
    if (window.TD_Audio && window.TD_Audio.playCassetteClickSound) {
      window.TD_Audio.playCassetteClickSound();
    }
    if (retroNoticeModal) {
      retroNoticeModal.classList.remove('active');
    }

    if (!authModal || !authModal.classList.contains('active')) {
      document.body.classList.remove('modal-active');
      document.body.style.overflow = '';
    }

    if (isConfirmed) {
      if (typeof retroNoticeOnConfirm === 'function') {
        const cb = retroNoticeOnConfirm;
        retroNoticeOnConfirm = null;
        cb();
      }
    } else {
      if (typeof retroNoticeOnCancel === 'function') {
        const cb = retroNoticeOnCancel;
        retroNoticeOnCancel = null;
        cb();
      }
    }
  }

  if (retroNoticeConfirmBtn) {
    retroNoticeConfirmBtn.addEventListener('click', () => closeRetroNotice(true));
  }
  if (retroNoticeCancelBtn) {
    retroNoticeCancelBtn.addEventListener('click', () => closeRetroNotice(false));
  }
  if (retroNoticeCloseX) {
    retroNoticeCloseX.addEventListener('click', () => closeRetroNotice(false));
  }
  if (retroNoticeModal) {
    retroNoticeModal.addEventListener('click', (e) => {
      if (e.target === retroNoticeModal) closeRetroNotice(false);
    });
  }

  window.showRetroAlert = showRetroAlert;
  window.showRetroConfirm = showRetroConfirm;

  function triggerRealGoogleSignIn(initiator = 'signup') {
    googleAuthInitiator = initiator;

    if (typeof window.google === 'undefined' || !window.google.accounts || !window.google.accounts.oauth2) {
      showRetroAlert('กำลังโหลดระบบ Google', 'กำลังโหลดสคริปต์ Google Identity Services... กรุณารอสักครู่แล้วกดใหม่อีกครั้ง', 'info');
      return;
    }

    try {
      setGoogleButtonsLoading(true);

      if (!googleTokenClientInstance) {
        googleTokenClientInstance = window.google.accounts.oauth2.initTokenClient({
          client_id: DEFAULT_GOOGLE_CLIENT_ID,
          scope: 'email profile openid',
          callback: async (tokenResponse) => {
            setGoogleButtonsLoading(false);
            if (tokenResponse.error) {
              console.error('Google OAuth error:', tokenResponse);
              showRetroAlert('เข้าสู่ระบบ Google ไม่สำเร็จ', tokenResponse.error_description || tokenResponse.error, 'error');
              return;
            }

            if (tokenResponse.access_token) {
              try {
                const res = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
                  headers: {
                    Authorization: `Bearer ${tokenResponse.access_token}`
                  }
                });
                if (!res.ok) throw new Error(`Google UserInfo API HTTP ${res.status}`);
                const profile = await res.json();
                handleRealGoogleProfile(profile);
              } catch (fetchErr) {
                console.error('Failed to fetch Google profile:', fetchErr);
                showRetroAlert('ไม่สามารถดึงข้อมูลได้', 'ไม่สามารถดึงข้อมูลโปรไฟล์จาก Google ได้ กรุณาลองใหม่อีกครั้ง', 'error');
              }
            }
          },
          error_callback: (err) => {
            setGoogleButtonsLoading(false);
            console.error('Google Token Client init error:', err);
            showRetroAlert('เกิดข้อผิดพลาดในการเปิด Google Sign-in', err.message || 'โปรดตรวจสอบการอนุญาต Origin ใน Google Cloud Console', 'error');
          }
        });
      }

      // Prompt account selector window directly
      googleTokenClientInstance.requestAccessToken({ prompt: 'select_account' });
    } catch (err) {
      setGoogleButtonsLoading(false);
      console.error('Real Google sign in failed:', err);
      showRetroAlert('ไม่สามารถเปิดหน้าต่าง Google ได้', err.message, 'error');
    }
  }

  function handleRealGoogleProfile(profile) {
    if (!profile || !profile.email) {
      showRetroAlert('ไม่พบข้อมูล', 'ไม่พบข้อมูลอีเมลจากบัญชี Google กรุณาลองใหม่อีกครั้ง', 'warning');
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
    if (window.TD_Audio && window.TD_Audio.playCassetteClickSound) {
      window.TD_Audio.playCassetteClickSound();
    }

    if (googleAuthInitiator === 'login') {
      handleGoogleLogin(accountData);
      return;
    }

    // SIGNUP FLOW: Do NOT create session or log user in yet!
    // Store in temporary pending state and populate Tape B form
    pendingRegistrationUser = { ...accountData };

    if (accountData.role === 'student-current') {
      if (stuDisplayFullname) stuDisplayFullname.textContent = accountData.fullname;
      if (stuDisplayGoogleRaw) stuDisplayGoogleRaw.textContent = accountData.rawGoogleName || accountData.fullname;
      if (stuDisplayGrade) stuDisplayGrade.textContent = accountData.grade;
      if (stuDisplayId) stuDisplayId.textContent = accountData.studentId;
      if (stuDisplayEmail) stuDisplayEmail.textContent = accountData.email;

      if (stuRealAvatarImg) {
        if (accountData.avatarUrl) {
          stuRealAvatarImg.src = accountData.avatarUrl;
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
      if (alumniDisplayEmail) alumniDisplayEmail.textContent = accountData.email;
      if (alumniFullNameInput && accountData.fullname) alumniFullNameInput.value = accountData.fullname;

      if (tapeBStepGoogle) tapeBStepGoogle.style.display = 'none';
      if (tapeBStepStudent) tapeBStepStudent.style.display = 'none';
      if (tapeBStepAlumni) tapeBStepAlumni.style.display = 'block';
      switchTape('register', true);
    }
  }

  // Tape D: Cassette User Profile & Pass Management
  function renderTapeDProfileData() {
    if (!currentUser) return;
    const isStudent = currentUser.role === 'student-current';

    if (isStudent) {
      if (tapeDStudentView) tapeDStudentView.style.display = 'block';
      if (tapeDAlumniView) tapeDAlumniView.style.display = 'none';

      if (dStuFullname) dStuFullname.textContent = currentUser.fullname || 'นักเรียนเตรียมน้อม';
      if (dStuId) dStuId.textContent = currentUser.studentId || '-';
      if (dStuGrade) dStuGrade.textContent = currentUser.grade || '-';
      if (dStuEmail) dStuEmail.textContent = currentUser.email || '-';
      if (dStuPhoneInput) dStuPhoneInput.value = currentUser.phone || '';
    } else {
      if (tapeDStudentView) tapeDStudentView.style.display = 'none';
      if (tapeDAlumniView) tapeDAlumniView.style.display = 'block';

      if (dAlumniEmail) dAlumniEmail.textContent = currentUser.email || '-';
      if (dAlumniFullnameInput) dAlumniFullnameInput.value = currentUser.fullname || '';
      if (dAlumniPhoneInput) dAlumniPhoneInput.value = currentUser.phone || '';
      if (dAlumniAddressInput) dAlumniAddressInput.value = currentUser.address || '';
      if (dAlumniBatchSelect && currentUser.batch) dAlumniBatchSelect.value = String(currentUser.batch);
    }

    // Real-time status banner
    const order = findUserOrderRecord(currentUser.email || currentUser.fullname, currentUser);
    if (tapeDStatusBanner && tapeDStatusBadge && tapeDStatusContent) {
      tapeDStatusBanner.className = 'tape-d-status-banner';
      if (order) {
        if (order.status === 'approved') {
          tapeDStatusBanner.classList.add('status-approved');
          tapeDStatusBadge.textContent = '[สถานะคำขอ: อนุมัติแล้ว // OFFICIAL PASS ACTIVE]';
          tapeDStatusContent.textContent = `ยินดีด้วย! คำขอสำหรับแพ็กเกจ "${order.packageName || order.package}" ได้รับการอนุมัติเรียบร้อยแล้ว สามารถนำบัตรไปแสดงหน้างานคอนเสิร์ตได้ทันที`;
        } else if (order.status === 'rejected') {
          tapeDStatusBanner.classList.add('status-rejected');
          tapeDStatusBadge.textContent = '[สถานะคำขอ: สลิปไม่ผ่านการอนุมัติ]';
          tapeDStatusContent.textContent = `สาเหตุ: "${order.rejectReason || 'ภาพสลิปไม่ชัดเจน หรือยอดเงินไม่ถูกต้อง'}" กรุณาติดต่อสภานักเรียน หรือลงทะเบียนแนบสลิปใหม่อีกครั้ง`;
        } else {
          tapeDStatusBanner.classList.add('status-pending');
          tapeDStatusBadge.textContent = '[สถานะคำขอ: รอการอนุมัติสลิป // PENDING REVIEW]';
          tapeDStatusContent.textContent = `คำขอสำหรับ "${order.packageName || order.package}" บันทึกเข้าระบบเมื่อ ${order.submittedAt} กำลังรอคณะกรรมการสภานักเรียนตรวจสอบสลิปภายใน 24 ชม.`;
        }
      } else {
        tapeDStatusBanner.classList.add('status-pending');
        tapeDStatusBadge.textContent = '[สถานะคำขอ: กำลังรอการบันทึกสลิป]';
        tapeDStatusContent.textContent = 'บัญชีนี้ยังไม่มีคำสั่งซื้อที่เสร็จสมบูรณ์ กรุณาเลือกแพ็กเกจและแนบสลิปชำระเงิน';
      }
    }
  }

  function handleUserLogout() {
    if (window.TD_Audio && window.TD_Audio.playCassetteClickSound) {
      window.TD_Audio.playCassetteClickSound();
    }

    showRetroConfirm('ยืนยันออกจากระบบ', 'คุณต้องการออกจากระบบ TRIAMDOD 10 หรือไม่?', () => {
      currentUser = null;
      updateNavUser(null);
      switchTape('login');
      closeAuth();

      // Reset Tape B views to initial Google step
      if (tapeBStepGoogle) tapeBStepGoogle.style.display = 'block';
      if (tapeBStepStudent) tapeBStepStudent.style.display = 'none';
      if (tapeBStepAlumni) tapeBStepAlumni.style.display = 'none';

      showRetroAlert('ออกจากระบบแล้ว', 'ออกจากระบบ TRIAMDOD 10 เรียบร้อยแล้ว', 'info');
    });
  }

  if (btnTapeDLogout) btnTapeDLogout.addEventListener('click', handleUserLogout);
  if (deckLogoutBtn) deckLogoutBtn.addEventListener('click', handleUserLogout);

  // Handle Tape D Profile Form Submission
  if (tapeDProfileForm) {
    tapeDProfileForm.addEventListener('submit', (e) => {
      e.preventDefault();
      if (!currentUser) return;
      if (window.TD_Audio && window.TD_Audio.playCassetteClickSound) {
        window.TD_Audio.playCassetteClickSound();
      }

      const isStudent = currentUser.role === 'student-current';
      const oldFullname = currentUser.fullname;

      if (isStudent) {
        const newPhone = dStuPhoneInput ? dStuPhoneInput.value.trim() : '';
        if (!newPhone) {
          showRetroAlert('กรุณากรอกเบอร์โทรศัพท์', 'กรุณากรอกเบอร์โทรศัพท์มือถือที่สามารถติดต่อได้', 'warning');
          return;
        }
        currentUser.phone = newPhone;
      } else {
        const newFullname = dAlumniFullnameInput ? dAlumniFullnameInput.value.trim() : '';
        const newPhone = dAlumniPhoneInput ? dAlumniPhoneInput.value.trim() : '';
        if (!newFullname) {
          showRetroAlert('ข้อมูลไม่ครบถ้วน', 'กรุณากรอกชื่อ-นามสกุลจริง', 'warning');
          return;
        }
        if (!newPhone) {
          showRetroAlert('ข้อมูลไม่ครบถ้วน', 'กรุณากรอกเบอร์โทรศัพท์มือถือ', 'warning');
          return;
        }
        currentUser.fullname = newFullname;
        currentUser.phone = newPhone;
        if (dAlumniAddressInput) currentUser.address = dAlumniAddressInput.value.trim();
        if (dAlumniBatchSelect) currentUser.batch = dAlumniBatchSelect.value;
      }

      // Save to localStorage session
      localStorage.setItem('td10_current_session', JSON.stringify(currentUser));

      // Sync with td10_orders and td10_pending_user
      try {
        const stored = localStorage.getItem('td10_orders');
        if (stored) {
          let orders = JSON.parse(stored);
          orders = orders.map(o => {
            if (
              (o.email && o.email === currentUser.email) ||
              (o.studentId && o.studentId === currentUser.studentId) ||
              (o.fullname && o.fullname === oldFullname)
            ) {
              return {
                ...o,
                fullname: currentUser.fullname,
                phone: currentUser.phone,
                address: currentUser.address || o.address,
                batch: currentUser.batch || o.batch
              };
            }
            return o;
          });
          localStorage.setItem('td10_orders', JSON.stringify(orders));
        }

        const pendingStored = localStorage.getItem('td10_pending_user');
        if (pendingStored) {
          const p = JSON.parse(pendingStored);
          if (p.email === currentUser.email || p.studentId === currentUser.studentId || p.fullname === oldFullname) {
            const updatedP = {
              ...p,
              fullname: currentUser.fullname,
              phone: currentUser.phone,
              address: currentUser.address || p.address,
              batch: currentUser.batch || p.batch
            };
            localStorage.setItem('td10_pending_user', JSON.stringify(updatedP));
          }
        }
      } catch (err) {}

      updateNavUser(currentUser);
      renderTapeDProfileData();
      showRetroAlert('บันทึกข้อมูลเรียบร้อย', 'ระบบอัปเดตข้อมูลของคุณใน TRIAMDOD 10 เรียบร้อยแล้ว', 'success');
    });
  }

  // Google Direct Event Listeners (No manual email prompt for sign up)
  if (btnSignUpWithGoogle) {
    btnSignUpWithGoogle.addEventListener('click', () => triggerRealGoogleSignIn('signup'));
  }
  if (btnLoginWithGoogle) {
    btnLoginWithGoogle.addEventListener('click', () => triggerRealGoogleSignIn('login'));
  }

  // Change Account triggers in Tape B
  if (btnStudentChangeAccount) {
    btnStudentChangeAccount.addEventListener('click', () => triggerRealGoogleSignIn('signup'));
  }
  if (btnAlumniChangeAccount) {
    btnAlumniChangeAccount.addEventListener('click', () => triggerRealGoogleSignIn('signup'));
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
      const studentData = pendingRegistrationUser || currentUser;
      if (!studentData || studentData.role !== 'student-current') {
        showRetroAlert('ยังไม่ได้เข้าสู่ระบบ Google', 'กรุณาเข้าสู่ระบบด้วยบัญชี Google (@tun.ac.th) ก่อน', 'warning');
        return;
      }

      const phone = stuPhoneInput ? stuPhoneInput.value.trim() : '';
      if (!phone) {
        showRetroAlert('กรุณากรอกเบอร์โทรศัพท์', 'กรุณากรอกเบอร์โทรศัพท์มือถือที่สามารถติดต่อได้ก่อนดำเนินการต่อ', 'warning');
        if (stuPhoneInput) stuPhoneInput.focus();
        return;
      }

      studentData.phone = phone;
      pendingRegistrationUser = studentData;

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
        showRetroAlert('ข้อมูลไม่ครบถ้วน', 'กรุณากรอกข้อมูลให้ครบทั้ง 4 ช่อง (ชื่อ-นามสกุล, เบอร์โทร, ที่อยู่จัดส่ง, รุ่นที่จบ)', 'warning');
        return;
      }

      const baseAlumni = pendingRegistrationUser || currentUser || {};
      pendingRegistrationUser = {
        ...baseAlumni,
        role: 'alumni',
        fullname,
        email: alumniDisplayEmail?.textContent || baseAlumni.email || '',
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
      showRetroAlert('ไฟล์ไม่ถูกต้อง', 'กรุณาเลือกไฟล์ภาพสลิปที่ถูกต้อง (JPG, PNG)', 'warning');
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
        showRetroAlert('ยังไม่ได้แนบสลิป', 'กรุณาแนบภาพสลิปหลักฐานการโอนเงินก่อนส่งขออนุมัติ', 'warning');
        if (slipDropzone) {
          slipDropzone.style.borderColor = '#ef4444';
          setTimeout(() => { slipDropzone.style.borderColor = '#d97706'; }, 1500);
        }
        return;
      }

      const activeUser = pendingRegistrationUser || currentUser;
      if (!activeUser || !selectedPackage) {
        showRetroAlert('ยังไม่ได้เลือกแพ็กเกจ', 'กรุณาเลือกแพ็กเกจให้เรียบร้อยก่อนชำระเงิน', 'warning');
        return;
      }

      if (window.TD_Audio && window.TD_Audio.playCassetteClickSound) {
        window.TD_Audio.playCassetteClickSound();
      }

      const nowStr = new Date().toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' }) + ' น.';
      const isStudent = activeUser.role === 'student-current';

      if (summaryFullname) summaryFullname.textContent = activeUser.fullname;
      if (summaryRole) summaryRole.textContent = isStudent ? 'นักเรียนปัจจุบัน' : `ศิษย์เก่าเตรียมน้อม (รุ่นที่ ${activeUser.batch})`;
      if (summaryIdOrYear) summaryIdOrYear.textContent = isStudent ? `รหัสประจำตัว: ${activeUser.studentId} (${activeUser.grade})` : `รุ่นที่ ${activeUser.batch}`;
      if (summaryContact) summaryContact.textContent = isStudent ? activeUser.email : `โทร: ${activeUser.phone} (${activeUser.email})`;

      const shirtDetail = selectedPackage.hasShirt ? ` [${selectedShirtColor} / ไซส์ ${selectedShirtSize}]` : '';
      if (summaryPackageChosen) {
        summaryPackageChosen.textContent = `${selectedPackage.name} (${selectedPackage.price}.-)${shirtDetail}`;
      }

      if (summaryDeliveryNote) {
        summaryDeliveryNote.textContent = isStudent
          ? '[การรับของ] รับที่โรงเรียน (วันเวลาจะแจ้งให้ทราบอีกครั้ง)'
          : `[การจัดส่ง] จัดส่งตามที่อยู่: ${activeUser.address}`;
      }

      if (summaryPaidAmountText) {
        summaryPaidAmountText.textContent = `[ยืนยัน] ยอดโอน ฿${selectedPackage.price}.00 (พร้อมเพย์)`;
      }

      if (summarySlipThumbnail) summarySlipThumbnail.src = currentSlipDataUrl;
      if (summarySubmitTime) summarySubmitTime.textContent = `ส่งคำขอเมื่อ: วันนี้ ${nowStr}`;

      const pendingRecord = {
        id: `TD10-${activeUser.studentId || Math.floor(1000 + Math.random() * 9000)}`,
        fullname: activeUser.fullname,
        rawGoogleName: activeUser.rawGoogleName || activeUser.fullname,
        role: activeUser.role,
        email: activeUser.email,
        studentId: activeUser.studentId || '',
        grade: activeUser.grade || '',
        phone: activeUser.phone || '',
        address: activeUser.address || '',
        batch: activeUser.batch || '',
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

      // Official user session activated upon payment submission!
      currentUser = { ...pendingRecord };
      try {
        localStorage.setItem('td10_current_session', JSON.stringify(currentUser));
      } catch (e) {}
      updateNavUser(currentUser);

      if (tapeCPaymentView) tapeCPaymentView.style.display = 'none';
      if (tapeCApprovalView) tapeCApprovalView.style.display = 'flex';

      showRetroAlert('ส่งหลักฐานเรียบร้อย', 'ระบบบันทึกข้อมูลการสมัครสมาชิกและหลักฐานการโอนเงินของท่านแล้ว\nขณะนี้อยู่ระหว่างรอคณะกรรมการสภานักเรียนตรวจสอบสลิปภายใน 24 ชม.', 'success');
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
    const rawInput = (identifier || '').trim();
    if (!rawInput && !studentData) return null;

    // If studentData not passed, try to parse
    const sData = studentData || parseTunStudentAccount(rawInput);

    // Build candidate identifiers
    const candLower = rawInput.toLowerCase();
    const candStudentId = (sData && sData.studentId) || (rawInput.replace(/\D/g, '') || null);
    const candEmail = (sData && sData.email ? sData.email.toLowerCase() : (rawInput.includes('@') ? candLower : null));

    // Thai and English name variations
    const candNames = [];
    if (rawInput && !rawInput.includes('@')) {
      candNames.push(rawInput);
      const cleanThai = rawInput.replace(/^(นาย|นางสาว|ด\.ช\.|ด\.ญ\.|น\.ส\.)\s*/, '').trim();
      if (cleanThai && cleanThai !== rawInput) candNames.push(cleanThai);
      const firstName = cleanThai.split(/\s+/)[0];
      if (firstName && firstName.length >= 2) candNames.push(firstName);
    }
    if (sData) {
      if (sData.fullname) {
        candNames.push(sData.fullname);
        const sFirst = sData.fullname.replace(/^(นาย|นางสาว|ด\.ช\.|ด\.ญ\.|น\.ส\.)\s*/, '').trim().split(/\s+/)[0];
        if (sFirst && sFirst.length >= 2) candNames.push(sFirst);
      }
      if (sData.englishName) candNames.push(sData.englishName);
      if (sData.rawGoogleName) candNames.push(sData.rawGoogleName);
    }

    function checkOrderMatch(o) {
      if (!o) return false;
      const oEmail = (o.email || '').toLowerCase().trim();
      const oId = (o.id || '').toLowerCase().trim();
      const oStudentId = (o.studentId || '').trim();
      const oFullname = (o.fullname || '').trim();
      const oRawGoogle = (o.rawGoogleName || '').trim();

      // 1. Direct Order ID match (e.g. TD10-25784)
      if (candLower && (oId === candLower || candLower.includes(oId))) return true;

      // 2. Email match (exact or school ID part)
      if (candEmail && oEmail) {
        if (oEmail === candEmail) return true;
        if (candEmail.endsWith('@tun.ac.th') && oEmail.endsWith('@tun.ac.th')) {
          const cId = candEmail.replace(/@tun\.ac\.th$/, '');
          const oEmailId = oEmail.replace(/@tun\.ac\.th$/, '');
          if (cId === oEmailId) return true;
        }
      }

      // 3. Student ID match
      if (candStudentId && oStudentId && candStudentId.length >= 4) {
        if (oStudentId === candStudentId) return true;
      }

      // 4. Name match (Thai or English)
      for (const name of candNames) {
        if (!name || name.length < 2) continue;
        const nLower = name.toLowerCase();
        if (oFullname && (oFullname.includes(name) || name.includes(oFullname))) return true;
        if (oRawGoogle && (oRawGoogle.toLowerCase().includes(nLower) || nLower.includes(oRawGoogle.toLowerCase()))) return true;

        // Compare first names
        const oFirstName = oFullname.replace(/^(นาย|นางสาว|ด\.ช\.|ด\.ญ\.|น\.ส\.)\s*/, '').trim().split(/\s+/)[0];
        const nFirstName = name.replace(/^(นาย|นางสาว|ด\.ช\.|ด\.ญ\.|น\.ส\.)\s*/, '').trim().split(/\s+/)[0];
        if (oFirstName && nFirstName && oFirstName.length >= 2 && oFirstName === nFirstName) return true;
      }

      return false;
    }

    try {
      const storedOrders = localStorage.getItem('td10_orders');
      if (storedOrders) {
        const list = JSON.parse(storedOrders);
        if (Array.isArray(list)) {
          const match = list.find(checkOrderMatch);
          if (match) return match;
        }
      }

      const singlePending = localStorage.getItem('td10_pending_user');
      if (singlePending) {
        const p = JSON.parse(singlePending);
        if (checkOrderMatch(p)) return p;
      }
    } catch (e) {}
    return null;
  }

  // Handle Google Login Check
  function handleGoogleLogin(accountData) {
    const record = findUserOrderRecord(accountData.email, accountData);

    if (record) {
      currentUser = record;
      updateNavUser(currentUser);
      if (record.status === 'approved') {
        showRetroAlert('[อนุมัติแล้ว - ยินดีต้อนรับ]', `คณะกรรมการสภานักเรียนได้อนุมัติคำขอของ "${record.fullname}" เรียบร้อยแล้ว!\nแพ็กเกจ: ${record.packageName || record.package}\n\nเข้าสู่ระบบ TRIAMDOD 10 เพื่อรับ OFFICIAL PASS เรียบร้อยแล้ว`, 'pass', () => closeAuth());
        return;
      } else if (record.status === 'rejected') {
        showRetroAlert('[แจ้งเตือนสลิปไม่ผ่านการอนุมัติ]', `คำขอของ "${record.fullname}" ไม่ผ่านการตรวจสอบเนื่องจาก:\n"${record.rejectReason || 'ภาพสลิปไม่ชัดเจน หรือยอดเงินไม่ถูกต้อง'}"\n\nกรุณาติดต่อสภานักเรียน หรือลงทะเบียนแนบสลิปใหม่อีกครั้ง`, 'error', () => {
          switchTape('profile');
        });
        return;
      } else {
        showRetroAlert('[แจ้งเตือนการตรวจสอบ]', `คำขอของ "${record.fullname}" (${record.packageName || record.package})\nอยู่ระหว่างรอตรวจสอบและอนุมัติจากคณะกรรมการสภานักเรียน ปีการศึกษา 2569\n\n(บันทึกสลิปเมื่อ ${record.submittedAt})\nกรุณารอการอนุมัติภายใน 24 ชม.`, 'info', () => closeAuth());
        return;
      }
    }

    // No existing completed registration/order: MUST purchase ticket first!
    showRetroAlert('ยังไม่ได้ลงทะเบียนซื้อบัตร', `ไม่พบบัญชีที่ลงทะเบียนและสั่งซื้อบัตรของ "${accountData.fullname || accountData.email}" ในระบบ TRIAMDOD 10\n\nการสมัครสมาชิกจำเป็นต้องเลือกแพ็กเกจบัตรและแนบสลิปชำระเงินก่อน\nระบบจะนำท่านไปยังหน้าสมัครสมาชิก (ตลับ B)`, 'warning', () => {
      googleAuthInitiator = 'signup';
      applyGoogleAccount(accountData);
      switchTape('register');
    });
  }

  // Handle Manual Form Login Submission
  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      if (window.TD_Audio && window.TD_Audio.playCassetteClickSound) {
        window.TD_Audio.playCassetteClickSound();
      }

      const inputUser = document.getElementById('loginUsername')?.value.trim();
      if (!inputUser) {
        showRetroAlert('กรุณากรอกข้อมูล', 'กรุณากรอกชื่อ-นามสกุล, รหัสนักเรียน หรืออีเมล', 'warning');
        return;
      }

      const studentData = parseTunStudentAccount(inputUser);
      const record = findUserOrderRecord(inputUser, studentData);

      if (record) {
        currentUser = record;
        updateNavUser(currentUser);
        if (record.status === 'approved') {
          showRetroAlert('[อนุมัติแล้ว - ยินดีต้อนรับ]', `คณะกรรมการสภานักเรียนได้อนุมัติคำขอของ "${record.fullname}" เรียบร้อยแล้ว!\nแพ็กเกจ: ${record.packageName || record.package}\n\nเข้าสู่ระบบ TRIAMDOD 10 เรียบร้อยแล้ว`, 'pass', () => closeAuth());
          return;
        } else if (record.status === 'rejected') {
          showRetroAlert('[แจ้งเตือนสลิปไม่ผ่านการอนุมัติ]', `คำขอของ "${record.fullname}" ไม่ผ่านการตรวจสอบเนื่องจาก:\n"${record.rejectReason || 'สลิปไม่ถูกต้อง'}"\n\nกรุณาติดต่อสภานักเรียน หรือลงทะเบียนแนบสลิปใหม่อีกครั้ง`, 'error', () => {
            switchTape('profile');
          });
          return;
        } else {
          showRetroAlert('[แจ้งเตือนการตรวจสอบ]', `คำขอของ "${record.fullname}" อยู่ระหว่างรอตรวจสอบและอนุมัติจากคณะกรรมการสภานักเรียน ปีการศึกษา 2569\n\nคณะกรรมการกำลังตรวจสอบสลิปการโอนเงิน (บันทึกเมื่อ ${record.submittedAt})\nกรุณารอการอนุมัติภายใน 24 ชม.`, 'info', () => closeAuth());
          return;
        }
      }

      // No record found: cannot log in!
      showRetroAlert('ยังไม่ได้ลงทะเบียนซื้อบัตร', 'ไม่พบบัญชีที่ลงทะเบียนและสั่งซื้อบัตรในระบบ TRIAMDOD 10\n\nการสมัครสมาชิกจำเป็นต้องเลือกแพ็กเกจบัตรและแนบสลิปชำระเงินก่อน\nระบบจะนำท่านไปยังหน้าสมัครสมาชิก (ตลับ B)', 'warning', () => {
        switchTape('register');
      });
    });
  }

  // Global auth helpers
  openAuthBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      if (btn.id === 'openAuthModalBtn' && currentUser) {
        openAuth('profile');
        return;
      }
      const tab = btn.dataset.authTab || (btn.id === 'openWaitlistBtn' ? 'register' : 'login');
      openAuth(tab);
    });
  });

  window.TD_Auth = {
    openAuth,
    closeAuth,
    switchTape,
    handleUserLogout,
    triggerRealGoogleSignIn,
    showRetroAlert,
    showRetroConfirm
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

  if (tapeD) {
    tapeD.addEventListener('click', (e) => {
      if (!tapeD.classList.contains('active-front') && !e.target.closest('button, input, select')) {
        switchTape('profile', true);
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
      closeRetroNotice(false);
      closeAuth();
      closeLightbox();
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
