/**
 * TRIAMDOD 10 CONCERT — Master Application Coordinator
 * Coordinates all modular subsystems:
 * - Web Audio Synthesizer (js/audio-synth.js)
 * - Background Music Engine (js/bgm-player.js)
 * - Split-Flap Departure Board Countdown (js/splitflap.js)
 * - CRT TV Video Archive Controller (js/tv-controller.js)
 * - Nokia 3310 Timetable Controller (js/nokia-3310.js)
 * - Smooth Scroll Reveal Observer (js/scroll-reveal.js)
 * - Priority Ticket Waitlist Modal (js/modal.js)
 */

if ('scrollRestoration' in history) {
  history.scrollRestoration = 'manual';
}
window.scrollTo(0, 0);

document.addEventListener('DOMContentLoaded', () => {
  window.scrollTo(0, 0);

  // Initialize initial CRT TV Channel 01
  if (window.TD_TV && window.TD_TV.switchChannel) {
    window.TD_TV.switchChannel(0, false);
  }

  console.log('[TRIAMDOD 10] All modular subsystems initialized cleanly.');
});
