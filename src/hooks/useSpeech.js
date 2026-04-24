import { useCallback, useEffect, useRef, useState } from 'react';
import { playClipIfAvailable } from './useAudioClips.js';

// Kid-friendly TTS wrapper around the Web Speech API.
//
// Voice quality on Web Speech varies wildly by device/browser.  We rank the
// available voices and pick the best "natural" one we can find, then expose
// a setter so parents can override from the Parent Zone.
//
// For letter sounds specifically, we prefer contextual phrases over bare
// phonemes — TTS tends to mis-say "ah" as the letter "A", but pronounces
// "A says ah, like apple" correctly.  The speakLetterSound helper below
// formats those phrases consistently.
//
// Anywhere we have a recorded audio clip keyed by phoneme or word, we play
// that clip *instead* of TTS via playClipIfAvailable — that's the escape
// hatch for future voice-actor audio, and it falls back to TTS silently
// when no clip is present.

const BAD_VOICE_PATTERNS = [
  /compact/i, // Apple's "Compact" voices are the old robotic ones
  /novelty/i,
  /sing/i,
  /whisper/i,
];

// Higher score = better / more natural sound. We stack patterns so a
// voice that hits multiple wins.
const VOICE_SCORES = [
  { pattern: /natural/i, score: 50 },
  { pattern: /neural/i, score: 50 },
  { pattern: /premium/i, score: 40 },
  { pattern: /enhanced/i, score: 40 },
  { pattern: /online/i, score: 20 },
  { pattern: /google/i, score: 18 }, // Chrome's Google voices are decent
  { pattern: /Samantha/i, score: 30 }, // macOS/iOS Samantha (good quality)
  { pattern: /Ava/i, score: 30 },
  { pattern: /Karen/i, score: 22 },
  { pattern: /Moira/i, score: 20 },
  { pattern: /Serena/i, score: 20 },
  { pattern: /Zira/i, score: 18 },
  { pattern: /Jenny/i, score: 28 },
  { pattern: /Aria/i, score: 25 },
  { pattern: /en-US|en-GB|en-AU/i, score: 10 },
];

function scoreVoice(voice) {
  if (!voice) return -Infinity;
  if (BAD_VOICE_PATTERNS.some((r) => r.test(voice.name))) return -10;
  let score = 0;
  for (const { pattern, score: s } of VOICE_SCORES) {
    if (pattern.test(voice.name) || pattern.test(voice.lang)) score += s;
  }
  // Bonus for female voices by convention — kids' content typically uses
  // warmer, higher-pitched voices.  This is a soft preference only.
  if (/female|samantha|karen|moira|serena|ava|aria|zira|jenny|susan|allison|victoria/i.test(voice.name)) {
    score += 5;
  }
  return score;
}

function rankVoices(voices) {
  return [...voices]
    .filter((v) => /^en/i.test(v.lang))
    .map((v) => ({ voice: v, score: scoreVoice(v) }))
    .sort((a, b) => b.score - a.score)
    .map((v) => v.voice);
}

export function useSpeech({
  enabled = true,
  rate = 0.9,
  pitch = 1.1,
  preferredVoiceURI,
} = {}) {
  const [voices, setVoices] = useState([]);
  const currentUtter = useRef(null);

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

  // Ranked list once, so the Parent Zone picker can show best-first.
  const ranked = rankVoices(voices);

  const pickVoice = useCallback(() => {
    if (preferredVoiceURI) {
      const match = voices.find((v) => v.voiceURI === preferredVoiceURI);
      if (match) return match;
    }
    return ranked[0] ?? voices[0];
  }, [voices, ranked, preferredVoiceURI]);

  const cancel = useCallback(() => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;
    currentUtter.current = null;
    window.speechSynthesis.cancel();
  }, []);

  const speak = useCallback(
    (text, opts = {}) => {
      if (!enabled) return Promise.resolve();
      if (typeof window === 'undefined' || !window.speechSynthesis)
        return Promise.resolve();
      if (!text) return Promise.resolve();

      // Recorded clip override — if a phoneme/word audio file has been
      // registered, play it instead.
      if (opts.clipKey) {
        const playedClip = playClipIfAvailable(opts.clipKey);
        if (playedClip) return playedClip;
      }

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
      currentUtter.current = utter;
      window.speechSynthesis.speak(utter);
      return new Promise((resolve) => {
        utter.onend = () => resolve();
        utter.onerror = () => resolve();
      });
    },
    [enabled, pickVoice, pitch, rate],
  );

  // Speak a phoneme accurately by wrapping it in a carrier phrase.
  // TTS mishears bare phonemes — "ah" gets read as the letter "A" on many
  // devices.  "A says ah, like apple" is pronounced correctly by nearly
  // every voice because each word is real English.
  const speakLetterSound = useCallback(
    async ({ letter, phoneme, sampleWord }, opts = {}) => {
      if (!enabled) return;
      // If a recorded clip exists for this letter, just play it.
      const played = playClipIfAvailable(`letter:${letter}`);
      if (played) {
        await played;
        return;
      }
      const stretched = phoneme.repeat(2); // draw the sound out slightly
      const phrase = sampleWord
        ? `${letter.toUpperCase()} says ${stretched}, like ${sampleWord}.`
        : `${letter.toUpperCase()} says ${stretched}.`;
      await speak(phrase, { rate: opts.rate ?? 0.8, ...opts });
    },
    [enabled, speak],
  );

  // Speak phonemes one at a time with a pause between — used by Sound
  // Blending.  We wrap each phoneme in its contextual word ("m like monkey")
  // at the medium/hard tiers, and as a bare stretched phoneme ("mmmm") at
  // easy.  The bare sound is what the kid needs to learn to blend; the
  // context is only a crutch for the first round if they struggle.
  const speakPhonemeSequence = useCallback(
    async (phonemes, { gap = 420, stretched = true, ...opts } = {}) => {
      if (!enabled) return;
      cancel();
      for (let i = 0; i < phonemes.length; i += 1) {
        const p = phonemes[i];
        const played = playClipIfAvailable(`phoneme:${p}`);
        if (played) {
          // eslint-disable-next-line no-await-in-loop
          await played;
        } else {
          const text = stretched ? stretchPhoneme(p) : p;
          // eslint-disable-next-line no-await-in-loop
          await speak(text, { interrupt: i === 0, rate: 0.75, ...opts });
        }
        if (i < phonemes.length - 1) {
          // eslint-disable-next-line no-await-in-loop
          await new Promise((r) => setTimeout(r, gap));
        }
      }
    },
    [cancel, enabled, speak],
  );

  return {
    speak,
    speakLetterSound,
    speakPhonemeSequence,
    cancel,
    voices: ranked,
    allVoices: voices,
  };
}

// Turn a phoneme string into something TTS pronounces closer to the actual
// sound.  These are empirical fixes; no library does this perfectly.
function stretchPhoneme(p) {
  const MAP = {
    a: 'aaa',
    e: 'eh',
    i: 'ih',
    o: 'oh',
    u: 'uh',
    b: 'buh',
    c: 'kuh',
    d: 'duh',
    f: 'ffff',
    g: 'guh',
    h: 'huh',
    j: 'juh',
    k: 'kuh',
    l: 'luh',
    m: 'mmmm',
    n: 'nnnn',
    p: 'puh',
    r: 'rrr',
    s: 'sss',
    t: 'tuh',
    v: 'vvv',
    w: 'wuh',
    x: 'ks',
    y: 'yuh',
    z: 'zzz',
    sh: 'sh',
    ch: 'ch',
    th: 'th',
    ng: 'ng',
    qu: 'kwuh',
    ai: 'ay',
    oo: 'oo',
    ee: 'ee',
  };
  return MAP[p] ?? p;
}
