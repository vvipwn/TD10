/**
 * TRIAMDOD 10 — Retro Coin-Operated Payphone Booth Controller
 * (ตู้โทรศัพท์สาธารณะหยอดเหรียญ พร้อมบัตรโทรศัพท์ข้างฝา & ทุกปุ่มใช้งานได้จริง)
 * Features:
 * - 3 Packages selection via Phonecards or Keypad (1: Espresso, 2: Sand, 3: VIP Box)
 * - Keypad 1-9, 0, *, #: All keys playable with authentic DTMF dual-tones & LCD dialing feedback
 * - Interactive Coin Slot: Adds coin credit with metallic clink & LCD alert
 * - Interactive Coin Return Cup (PUSH): Flap depression with coin rattle refund sound
 * - Interactive Handset Receiver: Clickable to lift receiver with dial tone burst
 * - T-Shirt Size picker (S, M, L, XL, 2XL) with instant LCD & dock summary updates
 * - Connect Call CTA: Proceeds to registration / Cassette Deck flow
 */

(function() {
  const payphoneModal = document.getElementById('payphoneModal');
  const closePayphoneBtn = document.getElementById('closePayphoneBtn');
  const btnInsertCoin = document.getElementById('btnInsertCoin');
  const coinCreditBadge = document.getElementById('coinCreditBadge');
  const lcdSelectedPackage = document.getElementById('lcdSelectedPackage');
  const lcdSizeAndCredit = document.getElementById('lcdSizeAndCredit');
  const lcdCallStatus = document.getElementById('lcdCallStatus');
  const selectedPkgSummaryText = document.getElementById('selectedPkgSummaryText');
  const btnPayphoneProceed = document.getElementById('btnPayphoneProceed');
  const payphoneCoinReturn = document.getElementById('payphoneCoinReturn');
  const payphoneHandset = document.getElementById('payphoneHandset');
  const dockSizeCluster = document.getElementById('dockSizeCluster');

  const pkgCards = document.querySelectorAll('.payphone-pkg-card');
  const keypadBtns = document.querySelectorAll('.keypad-btn');
  const sizeBtns = document.querySelectorAll('.size-choice-btn');
  const filterPills = document.querySelectorAll('.payphone-filter-pill');

  // Triggers for opening Payphone Package Modal
  const openPackageBtns = document.querySelectorAll('#btnDrawerReserve, #openInfoBtn, .btn-open-package-modal');
  // Trigger for opening Cassette Deck (Registration)
  const openWaitlistBtn = document.getElementById('openWaitlistBtn');

  const PACKAGES = {
    '1': {
      id: '1',
      role: 'student',
      name: 'บัตรเข้างาน',
      shortName: 'บัตรเข้างาน',
      price: 99,
      hasShirt: false,
      desc: 'บัตรเข้าชมคอนเสิร์ต TRIAMDOD 10 (1 ใบ)',
      note: 'รับของที่โรงเรียน',
      keyAlpha: '99.- บัตร'
    },
    '2': {
      id: '2',
      role: 'student',
      name: 'บัตรพร้อมของที่ระลึก',
      shortName: 'บัตร+ของที่ระลึก',
      price: 129,
      hasShirt: false,
      desc: 'บัตรเข้างาน + ของที่ระลึกประจำรุ่น',
      note: 'รับของที่โรงเรียน',
      keyAlpha: '129.- ที่ระลึก'
    },
    '3': {
      id: '3',
      role: 'student',
      name: 'บัตรพร้อมเสื้อพร้อมของที่ระลึก',
      shortName: 'บัตร+เสื้อ+ของที่ระลึก',
      price: 359,
      hasShirt: true,
      desc: 'บัตรเข้างาน + เสื้อยืดคอนเสิร์ต + ของที่ระลึก',
      note: 'รับของที่โรงเรียน',
      keyAlpha: '359.- บัตร+เสื้อ'
    },
    '4': {
      id: '4',
      role: 'alumni',
      name: 'เสื้ออย่างเดียว',
      shortName: 'เสื้อยืดคอนเสิร์ต',
      price: 329,
      hasShirt: true,
      desc: 'เสื้อยืดคอนเสิร์ต TRIAMDOD 10 (1 ตัว)',
      note: 'จัดส่งตามที่อยู่',
      keyAlpha: '329.- เสื้อยืด'
    },
    '5': {
      id: '5',
      role: 'alumni',
      name: 'เสื้อพร้อมของที่ระลึก',
      shortName: 'เสื้อ+ของที่ระลึก',
      price: 359,
      hasShirt: true,
      desc: 'เสื้อยืดคอนเสิร์ต + ชุดของที่ระลึกศิษย์เก่า',
      note: 'จัดส่งตามที่อยู่',
      keyAlpha: '359.- เสื้อ+ของ'
    }
  };

  // DTMF frequency map for telephone keypad
  const DTMF_MAP = {
    '1': [1209, 697],
    '2': [1336, 697],
    '3': [1477, 697],
    '4': [1209, 770],
    '5': [1336, 770],
    '6': [1477, 770],
    '7': [1209, 852],
    '8': [1336, 852],
    '9': [1477, 852],
    '*': [1209, 941],
    '0': [1336, 941],
    '#': [1477, 941]
  };

  const CHEST_MAP = {
    'S': 'รอบอก 38"',
    'M': 'รอบอก 40"',
    'L': 'รอบอก 42"',
    'XL': 'รอบอก 44"',
    '2XL': 'รอบอก 48"'
  };

  let currentPkgId = '1';
  let currentSize = 'L';
  let insertedCredit = 99;
  let dialedBuffer = '';
  let lcdRestoreTimer = null;
  let currentFilterRole = 'student';

  function filterRole(role) {
    currentFilterRole = role;
    filterPills.forEach(pill => {
      pill.classList.toggle('active', pill.dataset.filter === role);
    });
    pkgCards.forEach(card => {
      if (role === 'all' || card.dataset.role === role) {
        card.classList.remove('filtered-out');
      } else {
        card.classList.add('filtered-out');
      }
    });
    if (window.TD_Audio && window.TD_Audio.playCassetteClickSound) {
      window.TD_Audio.playCassetteClickSound();
    }
  }

  filterPills.forEach(pill => {
    pill.addEventListener('click', () => {
      filterRole(pill.dataset.filter);
    });
  });

  function refreshLcd() {
    const pkg = PACKAGES[currentPkgId];
    if (lcdSelectedPackage) {
      lcdSelectedPackage.textContent = `PKG [${pkg.id}]: ${pkg.shortName} ${pkg.price}.-`;
    }
    if (lcdSizeAndCredit) {
      if (pkg.hasShirt) {
        lcdSizeAndCredit.textContent = `SIZE: ${currentSize} (${CHEST_MAP[currentSize] || ''}) • เครดิต: ฿${insertedCredit}`;
      } else {
        lcdSizeAndCredit.textContent = `(ไม่ต้องระบุไซส์เสื้อ) • เครดิต: ฿${insertedCredit}`;
      }
    }
    if (coinCreditBadge) {
      coinCreditBadge.innerHTML = `เครดิตเหรียญ: <b>฿${insertedCredit}.00</b>`;
    }
    const dockChestBadge = document.getElementById('dockChestBadge');
    if (dockChestBadge) {
      dockChestBadge.textContent = CHEST_MAP[currentSize] || `ไซส์ ${currentSize}`;
    }
    if (dockSizeCluster) {
      dockSizeCluster.classList.toggle('no-shirt', !pkg.hasShirt);
    }
    if (selectedPkgSummaryText) {
      const roleText = pkg.role === 'student' ? 'นักเรียน' : 'ศิษย์เก่า';
      selectedPkgSummaryText.innerHTML = `
        <span class="summary-badge-pkg">PKG [${pkg.id}] [${roleText}]</span>
        <span class="summary-badge-name">${pkg.name}</span>
        <span class="summary-badge-price">${pkg.price}.-</span>
      `;
    }
  }

  function flashLcdMessage(mainMsg, subMsg = '', duration = 1400) {
    if (lcdRestoreTimer) clearTimeout(lcdRestoreTimer);
    if (lcdSelectedPackage) lcdSelectedPackage.textContent = mainMsg;
    if (subMsg && lcdSizeAndCredit) lcdSizeAndCredit.textContent = subMsg;

    lcdRestoreTimer = setTimeout(() => {
      refreshLcd();
    }, duration);
  }

  function selectPackage(pkgId, triggerSound = true) {
    if (!PACKAGES[pkgId]) return;
    currentPkgId = pkgId;
    const pkg = PACKAGES[pkgId];
    insertedCredit = pkg.price;
    dialedBuffer = '';

    // Switch role filter automatically if target card is filtered out
    if (currentFilterRole !== 'all' && pkg.role !== currentFilterRole) {
      filterRole(pkg.role);
    }

    // Update active package card
    pkgCards.forEach(card => {
      if (card.dataset.pkg === pkgId) {
        card.classList.add('active-pkg');
      } else {
        card.classList.remove('active-pkg');
      }
    });

    // Update active key on keypad
    keypadBtns.forEach(btn => {
      if (btn.dataset.pkg === pkgId) {
        btn.classList.add('active-key');
      } else if (btn.dataset.pkg) {
        btn.classList.remove('active-key');
      }
    });

    refreshLcd();

    if (triggerSound && window.TD_Audio && window.TD_Audio.playDTMFTone) {
      const freqs = DTMF_MAP[pkgId] || [1209, 697];
      window.TD_Audio.playDTMFTone(freqs[0], freqs[1]);
    }
  }

  function selectSize(size) {
    currentSize = size;
    sizeBtns.forEach(btn => {
      if (btn.dataset.size === size) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });
    refreshLcd();
    if (window.TD_Audio && window.TD_Audio.playCassetteClickSound) {
      window.TD_Audio.playCassetteClickSound();
    }
  }

  function openPayphoneModal(defaultPkg = '1') {
    if (!payphoneModal) return;
    if (window.TD_Audio) {
      if (window.TD_Audio.initAudioContext) window.TD_Audio.initAudioContext();
      if (window.TD_Audio.playCassetteClickSound) window.TD_Audio.playCassetteClickSound();
    }
    payphoneModal.classList.add('active');
    document.body.style.overflow = 'hidden';
    selectPackage(defaultPkg, false);
    if (lcdCallStatus) lcdCallStatus.textContent = '[READY]';
  }

  function closePayphoneModal() {
    if (!payphoneModal) return;
    if (window.TD_Audio && window.TD_Audio.playCassetteClickSound) {
      window.TD_Audio.playCassetteClickSound();
    }
    payphoneModal.classList.remove('active');
    document.body.style.overflow = '';
  }

  // Event Listeners for Package Cards
  pkgCards.forEach(card => {
    card.addEventListener('click', () => {
      const pkgId = card.dataset.pkg;
      selectPackage(pkgId, true);
    });
  });

  // Event Listeners for Keypad Buttons (ALL 12 BUTTONS FULLY FUNCTIONAL)
  keypadBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const key = btn.dataset.key;
      const freqs = DTMF_MAP[key] || [1209, 697];
      
      // Play authentic DTMF tone
      if (window.TD_Audio && window.TD_Audio.playDTMFTone) {
        window.TD_Audio.playDTMFTone(freqs[0], freqs[1]);
      }

      // Visual press animation
      btn.classList.add('active-key');
      if (!['1', '2', '3', '4', '5'].includes(key) || key !== currentPkgId) {
        setTimeout(() => btn.classList.remove('active-key'), 180);
      }

      // Keys 1 to 5: Select package
      if (['1', '2', '3', '4', '5'].includes(key)) {
        selectPackage(key, false);
      }
      // Key *: Reset dialed numbers and extra credit
      else if (key === '*') {
        dialedBuffer = '';
        insertedCredit = PACKAGES[currentPkgId].price;
        flashLcdMessage('[RESET] DIAL BUFFER CLEARED', `CREDIT: ฿${insertedCredit}.00`, 1200);
      }
      // Key #: Connect call
      else if (key === '#') {
        flashLcdMessage('CONNECTING CALL...', 'PREPARING REGISTRATION...', 800);
        setTimeout(() => {
          if (btnPayphoneProceed) btnPayphoneProceed.click();
        }, 300);
      }
      // Keys 6-9, 0: Dial numbers with live LCD feedback
      else {
        dialedBuffer += key;
        if (dialedBuffer.length > 10) dialedBuffer = dialedBuffer.slice(-10);
        flashLcdMessage(`DIAL: ${dialedBuffer}`, `TONE OK • CREDIT: ฿${insertedCredit}`, 1800);
      }
    });
  });

  // Event Listeners for Size Buttons
  sizeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      selectSize(btn.dataset.size);
    });
  });

  // Interactive Coin Insertion Slot (Adds +10 Baht & Clink sound)
  if (btnInsertCoin) {
    btnInsertCoin.addEventListener('click', () => {
      if (window.TD_Audio && window.TD_Audio.playCoinDropSound) {
        window.TD_Audio.playCoinDropSound();
      }
      insertedCredit += 10;
      refreshLcd();
      flashLcdMessage(`+10฿ COIN INSERTED`, `CREDIT: ฿${insertedCredit}.00`, 1400);
    });
  }

  // Interactive Coin Return Flap (Refunds extra coins)
  if (payphoneCoinReturn) {
    payphoneCoinReturn.addEventListener('click', () => {
      if (window.TD_Audio && window.TD_Audio.playCoinReturnSound) {
        window.TD_Audio.playCoinReturnSound();
      } else if (window.TD_Audio && window.TD_Audio.playCoinDropSound) {
        window.TD_Audio.playCoinDropSound();
      }
      payphoneCoinReturn.classList.add('flapped');
      setTimeout(() => payphoneCoinReturn.classList.remove('flapped'), 250);

      const refundAmount = Math.max(0, insertedCredit - PACKAGES[currentPkgId].price);
      insertedCredit = PACKAGES[currentPkgId].price;
      refreshLcd();
      flashLcdMessage(`COIN RETURN // คืนเหรียญ`, refundAmount > 0 ? `REFUNDED: ฿${refundAmount}.00` : `TRAY CHECKED (฿0)`, 1500);
    });
  }

  // Interactive Handset (Click to lift receiver & hear dial tone)
  if (payphoneHandset) {
    payphoneHandset.addEventListener('click', () => {
      if (window.TD_Audio && window.TD_Audio.playHandsetLiftSound) {
        window.TD_Audio.playHandsetLiftSound();
      }
      payphoneHandset.classList.add('lifted');
      setTimeout(() => payphoneHandset.classList.remove('lifted'), 600);
      flashLcdMessage(`HANDSET LIFTED // ยกหู`, `LINE READY • DIAL 1-5`, 1500);
    });
  }

  // Open Payphone Modal Triggers
  openPackageBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      let defaultPkg = '1';
      if (btn.id === 'btnDrawerReserve') {
        defaultPkg = '3';
      }
      openPayphoneModal(defaultPkg);
    });
  });

  // Open Waitlist / Register in Cassette Deck
  if (openWaitlistBtn) {
    openWaitlistBtn.addEventListener('click', (e) => {
      e.preventDefault();
      if (window.TD_Auth && window.TD_Auth.openAuth) {
        window.TD_Auth.openAuth('register');
      }
    });
  }

  // Close / Hangup
  if (closePayphoneBtn) closePayphoneBtn.addEventListener('click', closePayphoneModal);
  if (payphoneModal) {
    payphoneModal.addEventListener('click', (e) => {
      if (e.target === payphoneModal) closePayphoneModal();
    });
  }

  // Keyboard Navigation & Dialing
  document.addEventListener('keydown', (e) => {
    if (!payphoneModal || !payphoneModal.classList.contains('active')) return;

    if (e.key === 'Escape') {
      closePayphoneModal();
      return;
    }

    if (e.key === 'Enter') {
      if (btnPayphoneProceed) btnPayphoneProceed.click();
      return;
    }

    if (['1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '*', '#'].includes(e.key)) {
      const targetBtn = document.querySelector(`.keypad-btn[data-key="${e.key}"]`);
      if (targetBtn) {
        targetBtn.click();
      }
    }
  });

  // Proceed / Connect Call Button -> Opens Cassette Deck
  if (btnPayphoneProceed) {
    btnPayphoneProceed.addEventListener('click', () => {
      const pkg = PACKAGES[currentPkgId];
      if (window.TD_Audio && window.TD_Audio.playDTMFTone) {
        window.TD_Audio.playDTMFTone(1477, 941);
      }
      closePayphoneModal();

      setTimeout(() => {
        if (window.TD_Auth && window.TD_Auth.openAuth) {
          window.TD_Auth.openAuth('register');
        }
      }, 250);
    });
  }

  // Global export
  window.TD_Payphone = {
    openPayphoneModal,
    closePayphoneModal,
    selectPackage
  };

  // Legacy fallback
  window.TD_Modal = {
    openModal: openPayphoneModal,
    closeModal: closePayphoneModal
  };
})();
