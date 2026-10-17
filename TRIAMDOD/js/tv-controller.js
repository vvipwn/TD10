/**
 * TRIAMDOD 10 — CRT TV & Vintage Cassette Tape Controller
 * Features:
 * - 5 Channels video archive switching
 * - CRT static white noise canvas rendering
 * - Tactile TV power on/off button with complete CRT power-down
 * - Channel +/- navigation buttons
 * - Synced tape stack and spoiler bar active states
 */

(function() {
  const ARCHIVE_CHANNELS = [
    {
      year: "2022",
      channelLabel: "CH 01 // 2022",
      title: "TRIAMDOD10 : THE ORIGIN RECAP",
      description: "CONCERT ARCHIVE — MAIN STAGE CROWD WAVE",
      videoSrc: "https://assets.mixkit.co/videos/14084/14084-720.mp4",
      timeCode: "SP 0:24:19"
    },
    {
      year: "2023",
      channelLabel: "CH 02 // 2023",
      title: "TRIAMDOD10 : NIGHT GLOW MOSH",
      description: "CONCERT ARCHIVE — SLOW-MO MOSHING & LIGHTS",
      videoSrc: "https://assets.mixkit.co/videos/48507/48507-720.mp4",
      timeCode: "SP 0:42:08"
    },
    {
      year: "2024",
      channelLabel: "CH 03 // 2024",
      title: "TRIAMDOD10 : FREQUENCY OVERDRIVE",
      description: "CONCERT ARCHIVE — NIGHT FESTIVAL EUPHORIA",
      videoSrc: "https://assets.mixkit.co/videos/14088/14088-720.mp4",
      timeCode: "SP 1:12:45"
    },
    {
      year: "2025",
      channelLabel: "CH 04 // 2025",
      title: "TRIAMDOD10 : NEXT WAVE TEASER",
      description: "OFFICIAL TEASER — PREPARE FOR EDITION 10",
      videoSrc: "https://assets.mixkit.co/videos/48504/48504-720.mp4",
      timeCode: "SP 0:00:15"
    },
    {
      year: "2027",
      channelLabel: "CH 05 // 2027",
      title: "TRIAMDOD10 : LIVE CONCERT 2027",
      description: "MAIN STAGE — 8 มกราคม 2570 (2027)",
      videoSrc: "https://assets.mixkit.co/videos/22427/22427-720.mp4",
      timeCode: "SP 0:08:50"
    }
  ];

  let currentChannelIndex = 0;
  let isTvPoweredOn = true;

  const crtVideo = document.getElementById('crtVideo');
  const tvScreen = document.getElementById('tvScreen');
  const crtGlitch = document.getElementById('crtGlitch');
  const noiseCanvas = document.getElementById('noiseCanvas');
  const osdStatus = document.getElementById('osdStatus');
  const osdChannel = document.getElementById('osdChannel');
  const osdTitle = document.getElementById('osdTitle');
  const powerBtn = document.getElementById('powerBtn');
  const powerLed = document.getElementById('powerLed');
  const prevChBtn = document.getElementById('prevChBtn');
  const nextChBtn = document.getElementById('nextChBtn');

  const tapeItems = document.querySelectorAll('.tape-item');
  const spoilerItems = document.querySelectorAll('.spoiler-item');

  const noiseCtx = noiseCanvas ? noiseCanvas.getContext('2d') : null;
  let noiseAnimationId = null;

  function resizeNoiseCanvas() {
    if (!noiseCanvas) return;
    noiseCanvas.width = noiseCanvas.clientWidth || 320;
    noiseCanvas.height = noiseCanvas.clientHeight || 240;
  }
  window.addEventListener('resize', resizeNoiseCanvas);
  resizeNoiseCanvas();

  function renderNoiseFrame() {
    if (!noiseCtx || !noiseCanvas.classList.contains('visible')) return;
    const w = noiseCanvas.width;
    const h = noiseCanvas.height;
    if (w === 0 || h === 0) return;

    const imgData = noiseCtx.createImageData(w, h);
    const buffer32 = new Uint32Array(imgData.data.buffer);
    const len = buffer32.length;

    for (let i = 0; i < len; i++) {
      buffer32[i] = Math.random() < 0.5 ? 0xffffffff : 0xff101010;
    }

    noiseCtx.putImageData(imgData, 0, 0);
    noiseAnimationId = requestAnimationFrame(renderNoiseFrame);
  }

  function triggerStaticBurst(duration = 240) {
    if (!noiseCanvas) return;
    noiseCanvas.classList.add('visible');
    if (crtGlitch) crtGlitch.classList.add('glitch-active');
    if (window.TD_Audio && window.TD_Audio.playCRTStaticHum) {
      window.TD_Audio.playCRTStaticHum();
    }

    if (!noiseAnimationId) {
      renderNoiseFrame();
    }

    setTimeout(() => {
      noiseCanvas.classList.remove('visible');
      if (crtGlitch) crtGlitch.classList.remove('glitch-active');
      if (noiseAnimationId) {
        cancelAnimationFrame(noiseAnimationId);
        noiseAnimationId = null;
      }
    }, duration);
  }

  function switchChannel(index, soundEffect = true) {
    if (index < 0) index = ARCHIVE_CHANNELS.length - 1;
    if (index >= ARCHIVE_CHANNELS.length) index = 0;

    currentChannelIndex = index;
    const channelData = ARCHIVE_CHANNELS[index];

    if (soundEffect && window.TD_Audio && window.TD_Audio.playCassetteClickSound) {
      window.TD_Audio.playCassetteClickSound();
    }

    if (isTvPoweredOn) {
      triggerStaticBurst(260);
    }

    if (osdChannel) osdChannel.textContent = channelData.channelLabel;
    if (osdTitle) osdTitle.textContent = channelData.title;

    if (crtVideo) {
      crtVideo.src = channelData.videoSrc;
      crtVideo.load();
      if (isTvPoweredOn) {
        crtVideo.style.display = 'block';
        crtVideo.style.opacity = '0.3';
        crtVideo.play().catch(() => {});
        setTimeout(() => {
          if (isTvPoweredOn) crtVideo.style.opacity = '1';
        }, 200);
      } else {
        crtVideo.style.display = 'none';
        crtVideo.style.opacity = '0';
        crtVideo.pause();
      }
    }

    tapeItems.forEach((tape, i) => {
      if (i === index) {
        tape.classList.add('active-tape');
      } else {
        tape.classList.remove('active-tape');
      }
    });

    spoilerItems.forEach((sp) => {
      const spTape = parseInt(sp.getAttribute('data-tape'), 10);
      if (spTape === index) {
        sp.classList.add('active');
      } else {
        sp.classList.remove('active');
      }
    });
  }

  function initAudio() {
    if (window.TD_Audio && window.TD_Audio.initAudioContext) {
      window.TD_Audio.initAudioContext();
    }
  }

  tapeItems.forEach((tape, index) => {
    tape.addEventListener('click', () => {
      initAudio();
      switchChannel(index);
    });

    tape.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        initAudio();
        switchChannel(index);
      }
    });
  });

  spoilerItems.forEach((sp) => {
    sp.addEventListener('click', () => {
      initAudio();
      const tapeIdx = parseInt(sp.getAttribute('data-tape'), 10);
      switchChannel(tapeIdx);
    });
  });

  // Power Button
  if (powerBtn) {
    powerBtn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      initAudio();
      if (window.TD_Audio && window.TD_Audio.playCassetteClickSound) {
        window.TD_Audio.playCassetteClickSound();
      }
      isTvPoweredOn = !isTvPoweredOn;

      if (isTvPoweredOn) {
        if (tvScreen) {
          tvScreen.classList.remove('power-off');
          tvScreen.classList.add('crt-turning-on');
          setTimeout(() => {
            tvScreen.classList.remove('crt-turning-on');
          }, 400);
        }

        if (crtVideo) {
          crtVideo.style.display = 'block';
          crtVideo.style.opacity = '1';
          crtVideo.play().catch(() => {});
        }

        if (powerLed) powerLed.classList.remove('off');
        triggerStaticBurst(300);
        if (osdStatus) osdStatus.textContent = "PLAY";
      } else {
        if (tvScreen) {
          tvScreen.classList.add('crt-turning-off');
          setTimeout(() => {
            tvScreen.classList.remove('crt-turning-off');
            tvScreen.classList.add('power-off');
          }, 350);
        }

        if (crtVideo) {
          crtVideo.pause();
          crtVideo.style.display = 'none';
          crtVideo.style.opacity = '0';
        }

        if (powerLed) powerLed.classList.add('off');
        if (osdStatus) osdStatus.textContent = "OFF";
      }
    });
  }

  if (prevChBtn) {
    prevChBtn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      initAudio();
      switchChannel(currentChannelIndex - 1);
    });
  }

  if (nextChBtn) {
    nextChBtn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      initAudio();
      switchChannel(currentChannelIndex + 1);
    });
  }

  window.TD_TV = {
    switchChannel,
    triggerStaticBurst
  };
})();
