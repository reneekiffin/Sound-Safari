import { useCallback, useEffect, useRef, useState } from 'react';

// Wrap the Web Speech API with a kid-friendly default voice.  We prefer an
// English female voice if one is available, at a slightly slower rate so
// phonemes are clear.  Safari on iPad is the primary target device, which
// needs voices loaded lazily after a user gesture — we still work without a
// preferred voice, falling back to the browser default.
export function useSpeech({ enabled = true, rate = 0.85, pitch = 1.1 } = {}) {
  const [voices, setVoices] = useState([]);
  const queueRef = useRef([]);

  useEffect(() => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return undefined;

    const loadVoices = () => {
      setVoices(window.speechSynthesis.getVoices());
    };
    loadVoices();
    window.speechSynthesis.addEventListener('voiceschanged', loadVoices);
    return () =>
      window.speechSynthesis.removeEventListener('voiceschanged', loadVoices);
  }, []);

  const pickVoice = useCallback(() => {
    const prefer = [
      /Samantha/i,
      /Karen/i,
      /Moira/i,
      /Google UK English Female/i,
      /Microsoft Zira/i,
      /en-GB/i,
      /en-US/i,
    ];
    for (const pattern of prefer) {
      const match = voices.find((v) => pattern.test(v.name) || pattern.test(v.lang));
      if (match) return match;
    }
    return voices[0];
  }, [voices]);

  const cancel = useCallback(() => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;
    queueRef.current = [];
    window.speechSynthesis.cancel();
  }, []);

  const speak = useCallback(
    (text, opts = {}) => {
      if (!enabled) return;
      if (typeof window === 'undefined' || !window.speechSynthesis) return;
      if (!text) return;

      const utter = new SpeechSynthesisUtterance(String(text));
      const voice = pickVoice();
      if (voice) utter.voice = voice;
      utter.rate = opts.rate ?? rate;
      utter.pitch = opts.pitch ?? pitch;
      utter.volume = opts.volume ?? 1;
      utter.lang = voice?.lang ?? 'en-US';

      if (opts.interrupt !== false) {
        window.speechSynthesis.cancel();
      }
      window.speechSynthesis.speak(utter);
      return new Promise((resolve) => {
        utter.onend = () => resolve();
        utter.onerror = () => resolve();
      });
    },
    [enabled, pickVoice, pitch, rate],
  );

  // Speak phonemes one at a time with a pause between — the building block
  // for both Letter Sounds ("ah") and Sound Blending ("c...a...t").
  const speakPhonemes = useCallback(
    async (phonemes, { gap = 450, ...opts } = {}) => {
      if (!enabled) return;
      cancel();
      for (let i = 0; i < phonemes.length; i += 1) {
        await speak(phonemes[i], { interrupt: i === 0, ...opts });
        if (i < phonemes.length - 1) {
          await new Promise((r) => setTimeout(r, gap));
        }
      }
    },
    [cancel, enabled, speak],
  );

  return { speak, speakPhonemes, cancel, voices };
}
