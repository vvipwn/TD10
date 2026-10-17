/**
 * TRIAMDOD 10 — Clothes Rack & Merch Showcase Controller
 * Features:
 * - Interactive garment sways on click/hover with momentum
 * - Tactile fabric rustle audio feedback
 * - Shirt color switcher (Dark Espresso Brown vs Vintage Sand Beige)
 * - Quick-booking CTA pre-selecting shirt bundle in waitlist modal
 */

(function() {
  const hangers = document.querySelectorAll('.hanger-assembly');
  const colorChoiceBtns = document.querySelectorAll('.color-chip-btn, .color-choice-btn');
  const drawerTitle = document.getElementById('drawerShirtTitle');
  const drawerVariant = document.getElementById('drawerShirtVariant');
  const drawerBadge = document.getElementById('drawerColorBadge');
  const drawerDesc = document.getElementById('drawerShirtDesc');
  const btnDrawerReserve = document.getElementById('btnDrawerReserve');

  const SHIRT_DATA = {
    brown: {
      title: "เสื้อยืดที่ระลึก TRIAMDOD10",
      variant: "ESPRESSO WASH • HEAVY COTTON 240 GSM",
      badge: "COLOR: DARK ESPRESSO BROWN",
      desc: "ผ้าคอตตอนฟอกวินเทจสีน้ำตาลเข้มหนานุ่ม 240 GSM สกรีนลายสัญลักษณ์ TRIAMDOD10 โครเมียมสีเงินกลางอก พร้อมตราสัญลักษณ์งาน 8 มกราคม 2570 บรรจุในแพ็คเกจบัตรพิเศษ",
      phaseValue: "student-shirt"
    },
    beige: {
      title: "เสื้อยืดที่ระลึก TRIAMDOD10",
      variant: "SAND CREME • HEAVY COTTON 240 GSM",
      badge: "COLOR: VINTAGE SAND BEIGE",
      desc: "ผ้าคอตตอนสีเนื้อธรรมชาติสัมผัสนุ่มพิเศษ สกรีนลายกราฟิกเรโทร Y2K สีน้ำตาลช็อกโกแลตตัดลายเส้นเงิน 'THE SOUND OF YOUTH 2570' รุ่นพิเศษเฉพาะผู้ถือแพ็คเกจเสื้อ",
      phaseValue: "alumni-shirt"
    }
  };

  let activeColor = 'brown';

  function selectShirt(color, triggerSound = true) {
    activeColor = color;
    const data = SHIRT_DATA[color] || SHIRT_DATA.brown;

    if (drawerTitle) drawerTitle.textContent = data.title;
    if (drawerVariant) drawerVariant.textContent = data.variant;
    if (drawerBadge) drawerBadge.textContent = data.badge;
    if (drawerDesc) drawerDesc.textContent = data.desc;

    // Update active state on color choice buttons & chips
    colorChoiceBtns.forEach((btn) => {
      if (btn.getAttribute('data-color') === color) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });

    // Update active highlight on matching hanger
    hangers.forEach((hanger) => {
      if (hanger.getAttribute('data-color') === color) {
        hanger.classList.add('selected');
        hanger.classList.add('swaying-active');
        setTimeout(() => hanger.classList.remove('swaying-active'), 1400);
      } else {
        hanger.classList.remove('selected');
      }
    });

    if (triggerSound && window.TD_Audio && window.TD_Audio.playHangerSwaySound) {
      window.TD_Audio.playHangerSwaySound();
    }
  }

  // Hanger click & touch events
  hangers.forEach((hanger) => {
    hanger.addEventListener('click', () => {
      const color = hanger.getAttribute('data-color') || 'brown';
      selectShirt(color, true);
    });

    hanger.addEventListener('mouseenter', () => {
      if (window.TD_Audio && window.TD_Audio.playHangerSwaySound) {
        window.TD_Audio.playHangerSwaySound();
      }
    });
  });

  // Color Swatch buttons in Drawer
  colorChoiceBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const color = btn.getAttribute('data-color');
      selectShirt(color, true);
    });
  });

  // Pre-select shirt package and open Retro Payphone Booth
  if (btnDrawerReserve) {
    btnDrawerReserve.addEventListener('click', (e) => {
      e.preventDefault();
      const pkgId = activeColor === 'beige' ? '2' : '1';
      if (window.TD_Payphone && window.TD_Payphone.openPayphoneModal) {
        window.TD_Payphone.openPayphoneModal(pkgId);
      } else if (window.TD_Modal && window.TD_Modal.openModal) {
        window.TD_Modal.openModal(pkgId);
      }
    });
  }

  // Initialize with Dark Brown selected
  selectShirt('brown', false);

  window.TD_ClothesRack = {
    selectShirt
  };
})();
