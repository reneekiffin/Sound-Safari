// Character voice config — single source of truth for Microsoft Edge
// neural TTS.
//
// Each character is keyed by the same `animal` key the games already
// pass to useSpeech via `speaker: '<animal>'`, so the game code doesn't
// need to change.
//
// Voice IDs are Microsoft neural voice names (e.g. "en-US-AriaNeural").
// All voices are free via the Edge Read-Aloud endpoint — no API key,
// no quota.  Settings are rate / pitch / volume, all percentages
// (-100..+100) where 0 is the voice's default.
//
// IMPORTANT: keep VOICE_WHITELIST in api/tts.js in sync with the
// voiceId values below.  The server imports a duplicated list (Vercel
// quirk) so any change here must mirror in api/tts.js.

export const CHARACTER_VOICES = {
  lion: {
    name: 'Leo',
    description: 'Letter Sounds host — warm male, slightly slowed for clarity',
    voiceId: 'en-US-AndrewMultilingualNeural',
    settings: { rate: -8, pitch: -4, volume: 0 },
  },
  monkey: {
    name: 'Momo',
    description: 'Sound Blending host — bright, playful young male',
    voiceId: 'en-US-RyanMultilingualNeural',
    settings: { rate: -4, pitch: 6, volume: 0 },
  },
  parrot: {
    name: 'Polly',
    description: 'Rhyme Time host — bright, fun female',
    voiceId: 'en-US-AvaMultilingualNeural',
    settings: { rate: 0, pitch: 8, volume: 0 },
  },
  elephant: {
    name: 'Ellie',
    description: 'Syllable Stomp host — warm motherly female',
    voiceId: 'en-US-EmmaMultilingualNeural',
    settings: { rate: -6, pitch: -2, volume: 0 },
  },
  toucan: {
    name: 'Toby',
    description: 'Opposites host — well-rounded storyteller male',
    voiceId: 'en-US-BrianMultilingualNeural',
    settings: { rate: -2, pitch: 0, volume: 0 },
  },
  frog: {
    name: 'Finn',
    description: 'Same-Same host — spunky, lively female',
    voiceId: 'en-US-AshleyNeural',
    settings: { rate: 4, pitch: 8, volume: 0 },
  },
  giraffe: {
    name: 'Gigi',
    description: 'Sentence Safari host — gentle teacher female',
    voiceId: 'en-US-JennyNeural',
    settings: { rate: -4, pitch: 2, volume: 0 },
  },
  zebra: {
    name: 'Zara',
    description: 'Odd One Out host — bright, clear female',
    voiceId: 'en-US-AmberNeural',
    settings: { rate: 0, pitch: 4, volume: 0 },
  },
  owl: {
    name: 'Ollie',
    description: 'Venn Venn host — wise, steady male',
    voiceId: 'en-US-RogerNeural',
    settings: { rate: -8, pitch: -6, volume: 0 },
  },
  panda: {
    name: 'Penny',
    description: 'Word Builders host — Microsoft "Cute" voice (kid feel)',
    voiceId: 'en-US-AnaNeural',
    settings: { rate: -2, pitch: 4, volume: 0 },
  },
  squirrel: {
    name: 'Skippy',
    description: 'Sound-Alikes host — quick, casual male',
    voiceId: 'en-US-EricNeural',
    settings: { rate: 8, pitch: 4, volume: 0 },
  },
  sloth: {
    name: 'Sofia',
    description: '¡Hola! Spanish host — multilingual Spanish female',
    voiceId: 'es-ES-XimenaMultilingualNeural',
    settings: { rate: -4, pitch: 0, volume: 0 },
  },
};

// Whitelist of voice IDs the server will accept.  Imported by api/tts.js
// (well, duplicated — Vercel quirk).
export const VOICE_WHITELIST = Object.values(CHARACTER_VOICES).map(
  (c) => c.voiceId,
);

// Map a speaker key → voice config.  Returns null for speakers without
// a voice (none currently — every mascot has one).
export function voiceForSpeaker(speaker) {
  return CHARACTER_VOICES[speaker] ?? null;
}
