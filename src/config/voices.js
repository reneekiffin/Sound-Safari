// Character voice config — single source of truth for ElevenLabs TTS.
//
// Each of the six voiced characters is keyed by the same `animal` key
// the games already pass to useSpeech via `speaker: '<animal>'`, so
// the game code doesn't need to change.
//
// IMPORTANT: these `voiceId` values are placeholders.  Replace each one
// with the real ElevenLabs voice ID (found in VoiceLab → click a voice
// → "Copy Voice ID", looks like "21m00Tcm4TlvDq8ikWAM").  The server
// rejects any request for a voiceId not in this map — there's no way to
// request an arbitrary premium voice and run up the bill.
//
// Settings legend:
//   stability       higher = more consistent, lower = more expressive
//   similarity_boost how closely to match the reference voice
//   style            0.0 = neutral read, higher = more characterful
//   use_speaker_boost small clarity bump on short phrases

export const CHARACTER_VOICES = {
  elephant: {
    name: 'Ellie',
    description: 'Warm mother figure — welcomes + reassures',
    voiceId: 'ELLIE_VOICE_ID_PLACEHOLDER',
    settings: {
      stability: 0.6,
      similarity_boost: 0.8,
      style: 0.2,
      use_speaker_boost: true,
    },
  },
  lion: {
    name: 'Leo',
    description: 'Cool big brother — hypes correct answers',
    voiceId: 'LEO_VOICE_ID_PLACEHOLDER',
    settings: {
      stability: 0.4,
      similarity_boost: 0.75,
      style: 0.35,
      use_speaker_boost: true,
    },
  },
  zebra: {
    name: 'Zara',
    description: 'Bright, clear teacher voice',
    voiceId: 'ZARA_VOICE_ID_PLACEHOLDER',
    settings: {
      stability: 0.55,
      similarity_boost: 0.8,
      style: 0.25,
      use_speaker_boost: true,
    },
  },
  squirrel: {
    name: 'Skippy',
    description: 'Energetic, upbeat young voice',
    voiceId: 'SKIPPY_VOICE_ID_PLACEHOLDER',
    settings: {
      stability: 0.35,
      similarity_boost: 0.7,
      style: 0.45,
      use_speaker_boost: true,
    },
  },
  panda: {
    name: 'Penny',
    description: 'Sweet, gently musical voice',
    voiceId: 'PENNY_VOICE_ID_PLACEHOLDER',
    settings: {
      stability: 0.5,
      similarity_boost: 0.8,
      style: 0.3,
      use_speaker_boost: true,
    },
  },
  sloth: {
    name: 'Sofia',
    description: 'Slow, calm, low-pressure',
    voiceId: 'SOFIA_VOICE_ID_PLACEHOLDER',
    settings: {
      stability: 0.7,
      similarity_boost: 0.85,
      style: 0.15,
      use_speaker_boost: true,
    },
  },
};

// Whitelist of voice IDs the server will accept.  The server imports
// this so there's one source of truth and no way to add a voice in one
// place and forget to update the other.
export const VOICE_WHITELIST = Object.values(CHARACTER_VOICES).map(
  (c) => c.voiceId,
);

// Map a speaker key → voice config.  Returns null for speakers that
// don't have a voice configured; useSpeech falls back to Web Speech
// for those (e.g. Momo, Polly, Toby, Finn, Gigi, Ollie).
export function voiceForSpeaker(speaker) {
  return CHARACTER_VOICES[speaker] ?? null;
}
