import { useCallback, useMemo } from 'react';

// Lightweight sfx player using the Web Audio API — no assets required.
// We synthesise short, kid-friendly tones for taps, correct, and incorrect
// feedback so the MVP has no external audio dependencies.  Real voice-over
// SFX can replace these later via the same hook interface.
let _ctx = null;
function getCtx() {
  if (typeof window === 'undefined') return null;
  if (!_ctx) {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return null;
    _ctx = new AudioCtx();
  }
  // Resume on first user gesture (iOS/Safari requirement).
  if (_ctx.state === 'suspended') _ctx.resume();
  return _ctx;
}

function playTone({ freq = 440, duration = 0.2, type = 'sine', gain = 0.2, slide }) {
  const ctx = getCtx();
  if (!ctx) return;
  const osc = ctx.createOscillator();
  const g = ctx.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, ctx.currentTime);
  if (slide) {
    osc.frequency.linearRampToValueAtTime(slide, ctx.currentTime + duration);
  }
  g.gain.setValueAtTime(0, ctx.currentTime);
  g.gain.linearRampToValueAtTime(gain, ctx.currentTime + 0.02);
  g.gain.linearRampToValueAtTime(0, ctx.currentTime + duration);
  osc.connect(g).connect(ctx.destination);
  osc.start();
  osc.stop(ctx.currentTime + duration + 0.05);
}

export function useAudio({ enabled = true } = {}) {
  const play = useCallback(
    (name) => {
      if (!enabled) return;
      switch (name) {
        case 'tap':
          // Per user feedback: the brief synthesised "ding" on every
          // button press was distracting.  No-op — the rest of the
          // SFX (correct / wrong / celebrate) still play.
          break;
        case 'correct':
          playTone({ freq: 523, duration: 0.12, type: 'triangle' });
          setTimeout(
            () => playTone({ freq: 784, duration: 0.18, type: 'triangle' }),
            110,
          );
          setTimeout(
            () => playTone({ freq: 1047, duration: 0.22, type: 'triangle' }),
            260,
          );
          break;
        case 'wrong':
          playTone({
            freq: 320,
            slide: 220,
            duration: 0.3,
            type: 'sine',
            gain: 0.15,
          });
          break;
        case 'celebrate':
          [523, 659, 784, 1047].forEach((f, i) =>
            setTimeout(
              () => playTone({ freq: f, duration: 0.2, type: 'triangle' }),
              i * 110,
            ),
          );
          break;
        case 'unlock':
          playTone({ freq: 440, slide: 880, duration: 0.4, type: 'sine' });
          break;
        default:
          playTone({ freq: 440, duration: 0.1, type: 'sine' });
      }
    },
    [enabled],
  );

  return useMemo(() => ({ play }), [play]);
}
