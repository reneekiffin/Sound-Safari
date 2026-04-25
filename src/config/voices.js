// Character voice config — single source of truth for Microsoft Edge
// neural TTS.
//
// We use the *standard* neural voices only (no `*MultilingualNeural`
// variants).  The Read-Aloud endpoint is more reliable with the
// classic neural voice catalog; multilingual variants sometimes fall
// through and the client drops to Web Speech (Siri) — exactly what
// was happening to Momo before.
//
// Personality knobs:
//   rate     -100..+100 percent (negative = slower)
//   pitch    -100..+100 percent (negative = deeper)
//   volume   -100..+100 percent
// Edge defaults to 0 across the board.  The numbers below are tuned
// per character — Polly's preppy energy uses high rate+pitch, Finn's
// frog gets a deeper pitch, etc.

export const CHARACTER_VOICES = {
  lion: {
    name: 'Leo',
    description: 'Letter Sounds host — confident, warm male',
    voiceId: 'en-US-GuyNeural',
    settings: { rate: -8, pitch: -4, volume: 0 },
  },
  monkey: {
    name: 'Momo',
    description: 'Sound Blending host — playful, youthful male',
    voiceId: 'en-US-TonyNeural',
    settings: { rate: 4, pitch: 12, volume: 0 },
  },
  parrot: {
    name: 'Polly',
    description: 'Rhyme Time host — preppy, excited female',
    voiceId: 'en-US-AriaNeural',
    settings: { rate: 8, pitch: 14, volume: 0 },
  },
  elephant: {
    name: 'Ellie',
    description: 'Syllable Stomp host — warm motherly female',
    voiceId: 'en-US-NancyNeural',
    settings: { rate: -4, pitch: -2, volume: 0 },
  },
  toucan: {
    name: 'Toby',
    description: 'Opposites host — enthusiastic boy',
    voiceId: 'en-US-DavisNeural',
    settings: { rate: 6, pitch: 14, volume: 0 },
  },
  frog: {
    name: 'Finn',
    description: 'Same-Same host — deep, froggy male',
    voiceId: 'en-US-ChristopherNeural',
    settings: { rate: -6, pitch: -28, volume: 0 },
  },
  giraffe: {
    name: 'Gigi',
    description: 'Sentence Safari host — warm, friendly female',
    voiceId: 'en-US-JennyNeural',
    settings: { rate: -2, pitch: 4, volume: 0 },
  },
  zebra: {
    name: 'Zara',
    description: 'Odd One Out host — outgoing, bright female',
    voiceId: 'en-US-AshleyNeural',
    settings: { rate: 4, pitch: 8, volume: 0 },
  },
  owl: {
    name: 'Ollie',
    description: 'Venn Venn host — wise, steady male',
    voiceId: 'en-US-RogerNeural',
    settings: { rate: -12, pitch: -10, volume: 0 },
  },
  panda: {
    name: 'Penny',
    description: 'Word Builders host — calm, soothing female',
    voiceId: 'en-US-MichelleNeural',
    settings: { rate: -8, pitch: -2, volume: 0 },
  },
  squirrel: {
    name: 'Skippy',
    description: 'Sound-Alikes host — preppy, exciting, fun male',
    voiceId: 'en-US-JasonNeural',
    settings: { rate: 12, pitch: 10, volume: 0 },
  },
  sloth: {
    name: 'Sofia',
    description: '¡Hola! Spanish host — slow, calm, pleasant',
    voiceId: 'es-MX-DaliaNeural',
    settings: { rate: -12, pitch: 0, volume: 0 },
  },
};

// Whitelist of voice IDs the server will accept.  Imported by api/tts.js
// (well, duplicated — Vercel quirk).
export const VOICE_WHITELIST = Object.values(CHARACTER_VOICES).map(
  (c) => c.voiceId,
);

// Map a speaker key → voice config.  Returns null for unconfigured
// speakers; useSpeech then falls back to Web Speech.
export function voiceForSpeaker(speaker) {
  return CHARACTER_VOICES[speaker] ?? null;
}
