/**
 * TRIAMDOD 10 — Split-Flap Departure Board Countdown Engine
 * Airport Departure Board Mechanical Flipping & Countdown to 8 มกราคม 2570
 */

(function() {
  const TARGET_DATE = new Date('2027-01-08T16:30:00+07:00');

  const flapUnits = {
    months: {
      card: document.getElementById('cardMonths'),
      top: document.getElementById('cdMonthsTop'),
      bottom: document.getElementById('cdMonthsBottom'),
      leaf: document.getElementById('leafMonths'),
      leafFront: document.getElementById('leafMonthsFront'),
      leafBack: document.getElementById('leafMonthsBack'),
      currentVal: ''
    },
    days: {
      card: document.getElementById('cardDays'),
      top: document.getElementById('cdDaysTop'),
      bottom: document.getElementById('cdDaysBottom'),
      leaf: document.getElementById('leafDays'),
      leafFront: document.getElementById('leafDaysFront'),
      leafBack: document.getElementById('leafDaysBack'),
      currentVal: ''
    },
    hours: {
      card: document.getElementById('cardHours'),
      top: document.getElementById('cdHoursTop'),
      bottom: document.getElementById('cdHoursBottom'),
      leaf: document.getElementById('leafHours'),
      leafFront: document.getElementById('leafHoursFront'),
      leafBack: document.getElementById('leafHoursBack'),
      currentVal: ''
    },
    minutes: {
      card: document.getElementById('cardMinutes'),
      top: document.getElementById('cdMinutesTop'),
      bottom: document.getElementById('cdMinutesBottom'),
      leaf: document.getElementById('leafMinutes'),
      leafFront: document.getElementById('leafMinutesFront'),
      leafBack: document.getElementById('leafMinutesBack'),
      currentVal: ''
    },
    seconds: {
      card: document.getElementById('cardSeconds'),
      top: document.getElementById('cdSecondsTop'),
      bottom: document.getElementById('cdSecondsBottom'),
      leaf: document.getElementById('leafSeconds'),
      leafFront: document.getElementById('leafSecondsFront'),
      leafBack: document.getElementById('leafSecondsBack'),
      currentVal: ''
    }
  };

  function updateFlapUnit(unit, newVal, shouldPlaySound = true) {
    if (!unit.card) return;

    if (unit.currentVal === '') {
      // First initialization without animation
      unit.currentVal = newVal;
      if (unit.top) unit.top.textContent = newVal;
      if (unit.bottom) unit.bottom.textContent = newVal;
      if (unit.leafFront) unit.leafFront.textContent = newVal;
      if (unit.leafBack) unit.leafBack.textContent = newVal;
      return;
    }

    if (unit.currentVal !== newVal) {
      const oldVal = unit.currentVal;
      unit.currentVal = newVal;

      // Prepare flip leaf
      if (unit.leafFront) unit.leafFront.textContent = oldVal;
      if (unit.leafBack) unit.leafBack.textContent = newVal;
      if (unit.bottom) unit.bottom.textContent = newVal;

      // Animate flip forward
      unit.card.classList.add('flipping');
      if (shouldPlaySound && window.TD_Audio && window.TD_Audio.playSplitFlapSound) {
        window.TD_Audio.playSplitFlapSound();
      }

      setTimeout(() => {
        // Apply final values
        if (unit.top) unit.top.textContent = newVal;
        if (unit.leafFront) unit.leafFront.textContent = newVal;
        unit.card.classList.remove('flipping');
      }, 280);
    }
  }

  function updateCountdown() {
    const now = new Date();
    const diffMs = TARGET_DATE.getTime() - now.getTime();

    if (diffMs <= 0) {
      ['months', 'days', 'hours', 'minutes', 'seconds'].forEach(k => {
        updateFlapUnit(flapUnits[k], '00', false);
      });
      return;
    }

    let months = 0;
    let tempDate = new Date(now.getTime());

    while (true) {
      let nextMonth = new Date(tempDate.getTime());
      nextMonth.setMonth(nextMonth.getMonth() + 1);
      if (nextMonth <= TARGET_DATE) {
        months++;
        tempDate = nextMonth;
      } else {
        break;
      }
    }

    let remainingMs = TARGET_DATE.getTime() - tempDate.getTime();
    const oneDay = 1000 * 60 * 60 * 24;
    const oneHour = 1000 * 60 * 60;
    const oneMinute = 1000 * 60;

    const days = Math.floor(remainingMs / oneDay);
    remainingMs -= days * oneDay;

    const hours = Math.floor(remainingMs / oneHour);
    remainingMs -= hours * oneHour;

    const minutes = Math.floor(remainingMs / oneMinute);
    remainingMs -= minutes * oneMinute;

    const seconds = Math.floor(remainingMs / 1000);

    const pad = (n) => String(n).padStart(2, '0');

    updateFlapUnit(flapUnits.months, pad(months));
    updateFlapUnit(flapUnits.days, pad(days));
    updateFlapUnit(flapUnits.hours, pad(hours));
    updateFlapUnit(flapUnits.minutes, pad(minutes));
    updateFlapUnit(flapUnits.seconds, pad(seconds));
  }

  updateCountdown();
  setInterval(updateCountdown, 1000);

  window.TD_SplitFlap = {
    updateCountdown
  };
})();
