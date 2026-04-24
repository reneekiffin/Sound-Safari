import { useCallback, useEffect, useRef, useState } from 'react';
import { playClipIfAvailable } from './useAudioClips.js';
import { speakCloud, cancelCloud } from './useCloudSpeech.js';

// Kid-friendly TTS wrapper with a three-tier strategy:
//
//   1. Recorded clip (useAudioClips)   — if a voice-actor mp3 has been
//      registered for this key, play it.  Always highest quality.
//   2. Cloud TTS (useCloudSpeech)       — if a provider+API key is set in
//      Parent Zone, synthesise via OpenAI's gpt-4o-mini-tts.  Very natural.
//      Cached so repeat phrases don't cost extra.
//   3. Web Speech API                   — the browser's built-in voices.
//      We rank available voices and prefer natural/neural/premium/enhanced
//      ones.  Parents can pin a specific voice in Parent Zone.
//
// For letter sounds we also wrap the bare phoneme in a contextual phrase
// ("A says aaah, like apple") — TTS pronounces real English much better
// than isolated phonemes, so this is what makes Letter Sounds usable.

const BAD_VOICE_PATTERNS = [/compact/i, /novelty/i, /sing/i, /whisper/i];

const VOICE_SCORES = [
  { pattern: /natural/i, score: 50 },
  { pattern: /neural/i, score: 50 },
  { pattern: /premium/i, score: 40 },
  { pattern: /enhanced/i, score: 40 },
  { pattern: /online/i, score: 20 },
  { pattern: /google/i, score: 18 },
  { pattern: /Samantha/i, score: 30 },
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
  cloud, // { provider, apiKey, voice, speed }
  speaker, // optional mascot key ('lion' | 'monkey' | ...) for per-voice routing
} = {}) {
  const [voices, setVoices] = useState([]);

  useEffect(() => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return undefined;
    const loadVoices = () => setVoices(window.speechSynthesis.getVoices());
    loadVoices();
    window.speechSynthesis.addEventListener('voiceschanged', loadVoices);
    return () =>
      window.speechSynthesis.removeEventListener('voiceschanged', loadVoices);
  }, []);

  const ranked = rankVoices(voices);

  const pickVoice = useCallback(() => {
    if (preferredVoiceURI) {
      const match = voices.find((v) => v.voiceURI === preferredVoiceURI);
      if (match) return match;
    }
    return ranked[0] ?? voices[0];
  }, [voices, ranked, preferredVoiceURI]);

  const cancel = useCallback(() => {
    cancelCloud();
    if (typeof window === 'undefined' || !window.speechSynthesis) return;
    window.speechSynthesis.cancel();
  }, []);

  // Route cloud TTS through the server proxy by default (no key
  // needed in the browser).  If a parent has pasted their own
  // ElevenLabs key into the Parent Zone, use that directly instead.
  const byokProvider = cloud?.provider === 'elevenlabs' && cloud?.apiKey
    ? { provider: 'elevenlabs', apiKey: cloud.apiKey }
    : null;

  const speak = useCallback(
    async (text, opts = {}) => {
      if (!enabled) return;
      if (typeof window === 'undefined') return;
      if (!text) return;

      // Priority 1: a registered recorded clip for this key.
      if (opts.clipKey) {
        const played = playClipIfAvailable(opts.clipKey);
        if (played) {
          await played;
          return;
        }
      }

      // Priority 2: cloud TTS.  Proxy by default; BYOK overrides.  The
      // adapter itself decides whether the speaker has a voice configured
      // — if not, it returns isFallback:true and we drop to Web Speech.
      const effectiveSpeaker = opts.speaker ?? speaker;
      if (effectiveSpeaker) {
        const { played, isFallback } = await speakCloud(text, {
          provider: byokProvider?.provider ?? 'proxy',
          apiKey: byokProvider?.apiKey,
          speaker: effectiveSpeaker,
        });
        if (played) return;
        if (!isFallback) return;
      }

      // Priority 3: Web Speech.
      if (!window.speechSynthesis) return;
      const utter = new SpeechSynthesisUtterance(String(text));
      // When a specific language was requested (e.g. Spanish rounds),
      // prefer a voice that matches it.  Falls back to the default
      // English voice picker if no matching voice is installed.
      const langPreferredVoice = opts.lang
        ? voices.find((v) => v.lang?.toLowerCase().startsWith(opts.lang.toLowerCase()))
        : null;
      const voice = langPreferredVoice ?? pickVoice();
      if (voice) utter.voice = voice;
      utter.rate = opts.rate ?? rate;
      utter.pitch = opts.pitch ?? pitch;
      utter.volume = opts.volume ?? 1;
      utter.lang = opts.lang ?? voice?.lang ?? 'en-US';

      if (opts.interrupt !== false) {
        window.speechSynthesis.cancel();
      }
      window.speechSynthesis.speak(utter);
      return new Promise((resolve) => {
        utter.onend = () => resolve();
        utter.onerror = () => resolve();
      });
    },
    [enabled, byokProvider?.provider, byokProvider?.apiKey, speaker, pickVoice, pitch, rate],
  );

  // Speak a phoneme followed by an example word.  TTS mangles bare
  // phonemes in isolation, but happily pronounces real English — so we
  // chain the stretched sound and the example word with a brief pause.
  //
  // Per user feedback: we used to say "U says uh, like umbrella" —
  // Leo's name + "says" is already in the surrounding UX, so dropping
  // the redundant letter-name announcement keeps the mascot's voice
  // focused on the sound itself.  Now it's just
  //   "uh ... umbrella."
  // which reads as "[sound] followed by [word]" — exactly what kids
  // need to map the sound onto a real word.
  const speakLetterSound = useCallback(
    async ({ letter, phoneme, sampleWord }, opts = {}) => {
      if (!enabled) return;
      const played = playClipIfAvailable(`letter:${letter}`);
      if (played) {
        await played;
        return;
      }
      // Send the phoneme + sample word as a single natural utterance so
      // ElevenLabs voices deliver it with proper prosody.  No doubling
      // (the old `phoneme.repeat(2)` made Leo say "aaaaaa, apple"); the
      // ellipsis already cues the voice to elongate slightly.
      const phrase = sampleWord ? `${phoneme}... ${sampleWord}.` : `${phoneme}.`;
      await speak(phrase, { rate: opts.rate ?? 0.85, ...opts });
    },
    [enabled, speak],
  );

  const speakPhonemeSequence = useCallback(
    async (phonemes, { gap = 420, stretched = true, ...opts } = {}) => {
      if (!enabled) return;
      cancel();
      for (let i = 0; i < phonemes.length; i += 1) {
        const p = phonemes[i];
        const clip = playClipIfAvailable(`phoneme:${p}`);
        if (clip) {
          // eslint-disable-next-line no-await-in-loop
          await clip;
        } else {
          const text = stretched ? stretchPhoneme(p) : p;
          // eslint-disable-next-line no-await-in-loop
          await speak(text, { interrupt: i === 0, rate: 0.8, ...opts });
        }
        if (i < phonemes.length - 1) {
          // eslint-disable-next-line no-await-in-loop
          await new Promise((r) => setTimeout(r, gap));
        }
      }
    },
    [cancel, enabled, speak],
  );

  // Stabilised references so consumers don't need to worry about identity
  // thrash.  The underlying functions are re-created whenever the settings
  // or voices change, but these wrappers keep a stable identity for the
  // lifetime of the component — so effects like "speak the prompt once per
  // round" can depend on round alone, not on speak.
  const speakRef = useRef(speak);
  useEffect(() => { speakRef.current = speak; }, [speak]);
  const speakLetterSoundRef = useRef(speakLetterSound);
  useEffect(() => { speakLetterSoundRef.current = speakLetterSound; }, [speakLetterSound]);
  const speakPhonemeSequenceRef = useRef(speakPhonemeSequence);
  useEffect(() => { speakPhonemeSequenceRef.current = speakPhonemeSequence; }, [speakPhonemeSequence]);

  const stableSpeak = useRef((...args) => speakRef.current?.(...args)).current;
  const stableSpeakLetterSound = useRef((...args) => speakLetterSoundRef.current?.(...args)).current;
  const stableSpeakPhonemeSequence = useRef((...args) => speakPhonemeSequenceRef.current?.(...args)).current;

  return {
    // Stable-identity wrappers: safe to put in useEffect deps.
    speak: stableSpeak,
    speakLetterSound: stableSpeakLetterSound,
    speakPhonemeSequence: stableSpeakPhonemeSequence,
    cancel,
    voices: ranked,
    allVoices: voices,
    // True when a BYOK ElevenLabs key is set.  Callers use this to
    // show a "using your key" indicator in the Parent Zone.
    byokActive: Boolean(byokProvider),
  };
}

// Exposed so other components (SoundBlending) can build their own
// composite utterances and send them in a single ElevenLabs call.
export function stretchPhoneme(p) {
  const MAP = {
    a: 'aaa', e: 'eh', i: 'ih', o: 'oh', u: 'uh',
    b: 'buh', c: 'kuh', d: 'duh', f: 'ffff', g: 'guh',
    h: 'huh', j: 'juh', k: 'kuh', l: 'luh', m: 'mmmm',
    n: 'nnnn', p: 'puh', r: 'rrr', s: 'sss', t: 'tuh',
    v: 'vvv', w: 'wuh', x: 'ks', y: 'yuh', z: 'zzz',
    sh: 'sh', ch: 'ch', th: 'th', ng: 'ng', qu: 'kwuh',
    ai: 'ay', oo: 'oo', ee: 'ee',
  };
  return MAP[p] ?? p;
}
