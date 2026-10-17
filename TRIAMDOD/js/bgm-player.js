/**
 * TRIAMDOD 10 — Background Music Controller (TATTOO COLOUR Official MV)
 * Features:
 * - Continuous looping theme music playback
 * - Zero-delay autoplay with clean one-shot wake-up
 * - Synced TV console equalizer animation & OSD display
 * - Tactile manual sound toggle that reliably mutes and pauses
 */

(function() {
  const bgMusic = document.getElementById('bgMusic');
  const tvBgmStatus = document.getElementById('tvBgmStatus');
  const audioToggleBtn = document.getElementById('audioToggleBtn');
  let bgmUserPaused = false;
  let bgmPlaying = true;

  const iconSoundMuted = "M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73 4.27 3zM12 4L9.91 6.09 12 8.18V4z";
  const iconSoundActive = "M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z";

  function updateBgmUI(isPlaying) {
    bgmPlaying = isPlaying;
    if (tvBgmStatus) {
      if (isPlaying) {
        tvBgmStatus.classList.add('playing');
        tvBgmStatus.classList.remove('muted');
      } else {
        tvBgmStatus.classList.remove('playing');
        tvBgmStatus.classList.add('muted');
      }
    }
    const audioIconPath = document.getElementById('audioIconPath');
    if (audioIconPath) {
      audioIconPath.setAttribute('d', isPlaying ? iconSoundActive : iconSoundMuted);
    }
    const osdAudioTag = document.getElementById('osdAudioTag');
    if (osdAudioTag) {
      osdAudioTag.textContent = isPlaying ? "BGM: TATTOO COLOUR [OFFICIAL MV]" : "MUTE [OFF]";
      osdAudioTag.style.color = isPlaying ? "#38ef7d" : "#fde047";
    }
  }

  function startBgmPlayback() {
    if (!bgMusic || bgmUserPaused) return;
    bgMusic.volume = 0.85;
    bgMusic.muted = false;
    const playPromise = bgMusic.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          updateBgmUI(true);
          cleanupOneShotListeners();
        })
        .catch(() => {
          // Audio waiting for user gesture
        });
    }
  }

  // Attempt autoplay immediately
  startBgmPlayback();

  // Retry when audio buffer is ready
  if (bgMusic) {
    bgMusic.addEventListener('canplay', () => {
      if (!bgmUserPaused && bgMusic.paused) {
        startBgmPlayback();
      }
    });
    bgMusic.addEventListener('loadeddata', () => {
      if (!bgmUserPaused && bgMusic.paused) {
        startBgmPlayback();
      }
    });
  }

  // One-shot user gesture listeners to satisfy browser autoplay policy
  const gestureEvents = ['click', 'touchstart', 'keydown'];
  function onFirstUserGesture(e) {
    // If clicking the mute/audio button directly, don't trigger the auto-resume
    if (e && e.target && (e.target.closest('#audioToggleBtn') || e.target.closest('#tvBgmStatus'))) {
      cleanupOneShotListeners();
      return;
    }

    if (!bgmUserPaused && bgMusic && bgMusic.paused) {
      startBgmPlayback();
    }
    if (window.TD_Audio && window.TD_Audio.initAudioContext) {
      window.TD_Audio.initAudioContext();
    }
    cleanupOneShotListeners();
  }

  function cleanupOneShotListeners() {
    gestureEvents.forEach((evt) => {
      document.removeEventListener(evt, onFirstUserGesture, { capture: true });
    });
  }

  gestureEvents.forEach((evt) => {
    document.addEventListener(evt, onFirstUserGesture, { capture: true, once: true });
  });

  window.addEventListener('load', () => {
    if (!bgmUserPaused && bgMusic && bgMusic.paused) {
      startBgmPlayback();
    }
  });

  function toggleBgm() {
    if (!bgMusic) return;
    if (window.TD_Audio && window.TD_Audio.initAudioContext) {
      window.TD_Audio.initAudioContext();
    }

    const isCurrentlyPlaying = !bgMusic.paused && !bgMusic.muted && bgMusic.currentTime > 0;

    if (isCurrentlyPlaying) {
      // Pause & Mute
      bgmUserPaused = true;
      bgMusic.pause();
      bgMusic.muted = true;
      updateBgmUI(false);
    } else {
      // Resume & Unmute
      bgmUserPaused = false;
      bgMusic.muted = false;
      bgMusic.volume = 0.85;
      const playPromise = bgMusic.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => updateBgmUI(true))
          .catch(() => updateBgmUI(false));
      }
    }
  }

  if (tvBgmStatus) {
    tvBgmStatus.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (window.TD_Audio && window.TD_Audio.playCassetteClickSound) {
        window.TD_Audio.playCassetteClickSound();
      }
      toggleBgm();
    });
  }

  if (audioToggleBtn) {
    audioToggleBtn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (window.TD_Audio && window.TD_Audio.playCassetteClickSound) {
        window.TD_Audio.playCassetteClickSound();
      }
      toggleBgm();
    });
  }

  window.TD_Bgm = {
    startBgmPlayback,
    toggleBgm,
    updateBgmUI
  };
})();
