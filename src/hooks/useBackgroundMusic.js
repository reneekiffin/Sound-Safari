import { useEffect, useRef } from 'react';

// Soft synthesised ambient pad — three sine oscillators forming a
// major triad (C-E-G), each modulated by a slow LFO so the texture
// breathes.  No external asset required, no quota to manage.
//
// Volume defaults to a low 0.04 so it sits comfortably under speech
// and SFX.  Tied to the bgmEnabled setting in the Parent Zone — flip
// off and the oscillators stop and the AudioContext is left in a
// quiet state ready to resume.
export function useBackgroundMusic({ enabled, volume = 0.04 } = {}) {
  const ctxRef = useRef(null);
  const cleanupRef = useRef(null);

  useEffect(() => {
    // Always tear down on disable or unmount.
    if (cleanupRef.current) {
      cleanupRef.current();
      cleanupRef.current = null;
    }

    if (!enabled) return undefined;
    if (typeof window === 'undefined') return undefined;
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return undefined;

    const ctx = ctxRef.current ?? new AudioCtx();
    ctxRef.current = ctx;
    if (ctx.state === 'suspended') {
      // Browsers require a user gesture; the call site is in App, which
      // mounts after a tap on the safari map.  If ctx is still
      // suspended here we still call resume() — it's a no-op until a
      // gesture lands but does no harm.
      ctx.resume().catch(() => {});
    }

    // Master gain so we can fade the whole pad in/out.
    const master = ctx.createGain();
    master.gain.value = 0;
    master.gain.linearRampToValueAtTime(volume, ctx.currentTime + 1.2);
    master.connect(ctx.destination);

    // Three sustained sines forming a warm major triad.  The LFO on
    // each oscillator's gain creates a subtle breathing motion so the
    // pad doesn't sit completely static.
    const triad = [261.63, 329.63, 392.00]; // C4, E4, G4
    const nodes = triad.map((freq, i) => {
      const osc = ctx.createOscillator();
      const oscGain = ctx.createGain();
      const lfo = ctx.createOscillator();
      const lfoGain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.value = freq;
      oscGain.gain.value = 0.7;
      lfo.type = 'sine';
      lfo.frequency.value = 0.08 + i * 0.02; // slow, slightly different per voice
      lfoGain.gain.value = 0.3;

      lfo.connect(lfoGain).connect(oscGain.gain);
      osc.connect(oscGain).connect(master);
      lfo.start();
      osc.start();
      return [osc, lfo];
    }).flat();

    cleanupRef.current = () => {
      try {
        master.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.6);
      } catch {}
      // Stop oscillators after the fade so we don't click off.
      setTimeout(() => {
        nodes.forEach((n) => {
          try { n.stop(); } catch {}
        });
      }, 700);
    };

    return cleanupRef.current;
  }, [enabled, volume]);
}
