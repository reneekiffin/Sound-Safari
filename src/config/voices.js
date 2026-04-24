// Character voice config — single source of truth for ElevenLabs TTS.
//
// Each voiced character is keyed by the same `animal` key the games
// already pass to useSpeech via `speaker: '<animal>'`, so the game
// code doesn't need to change.
//
// Current voiced roster:  Ellie, Leo, Polly, Zara
// On Web Speech:          everyone else (Momo, Toby, Finn, Gigi, Ellie's
//                         other-mascot teammates Ollie / Penny / Skippy /
//                         Sofia).  Commented entries below are kept so
//                         the extra characters can be re-enabled by
//                         uncommenting + pasting a voice ID.
//
// Settings legend:
//   stability          higher = more consistent, lower = more expressive
//   similarity_boost   how closely to match the reference voice
//   style              0.0 = neutral read, higher = more characterful
//   use_speaker_boost  small clarity bump on short phrases
//
// The server (api/tts.js) imports VOICE_WHITELIST from this file, so
// dropping a character from here also removes its voice ID from the
// server's accepted list — no way to get out of sync.

export const CHARACTER_VOICES = {
  elephant: {
    name: 'Ellie',
    description: 'Warm mother figure — welcomes + reassures',
    voiceId: 'kHbsDwAcjwdBlFpchxv4',
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
    voiceId: 'MYiFAKeVwcvm4z9VsFAR',
    settings: {
      stability: 0.4,
      similarity_boost: 0.75,
      style: 0.35,
      use_speaker_boost: true,
    },
  },
  parrot: {
    name: 'Polly',
    description: 'Bright, fun rhyme-time host',
    voiceId: 'PoHUWWWMHFrA8z7Q88pu',
    settings: {
      stability: 0.45,
      similarity_boost: 0.8,
      style: 0.4,
      use_speaker_boost: true,
    },
  },
  zebra: {
    name: 'Zara',
    description: 'Bright, clear teacher voice',
    voiceId: 'b8gbDO0ybjX1VA89pBdX',
    settings: {
      stability: 0.55,
      similarity_boost: 0.8,
      style: 0.25,
      use_speaker_boost: true,
    },
  },
  sloth: {
    name: 'Sofia',
    description: 'Spanish host — bright, friendly (shares Polly\'s voice for now)',
    // Reuses Polly's voice for the Spanish game.  Sharing a voice across
    // characters is fine — the server whitelist is derived from voice
    // IDs and duplicates are harmless.  Swap in a dedicated voice ID
    // here any time Sofia should sound distinct.
    voiceId: 'PoHUWWWMHFrA8z7Q88pu',
    settings: {
      stability: 0.55,
      similarity_boost: 0.8,
      style: 0.3,
      use_speaker_boost: true,
    },
  },

  // Intentionally not voiced right now — Web Speech fallback keeps
  // their games fully functional.  Un-comment the relevant block and
  // paste a voice ID to bring a character online.
  //
  // squirrel: { name: 'Skippy', voiceId: '_PLACEHOLDER', settings: { stability: 0.35, similarity_boost: 0.7, style: 0.45, use_speaker_boost: true } },
  // panda:    { name: 'Penny',  voiceId: '_PLACEHOLDER', settings: { stability: 0.5,  similarity_boost: 0.8, style: 0.3,  use_speaker_boost: true } },
  // monkey, toucan, frog, giraffe, owl — add here as you go.
};

// Whitelist of voice IDs the server will accept.  Imported by
// api/tts.js so there's a single source of truth.
export const VOICE_WHITELIST = Object.values(CHARACTER_VOICES).map(
  (c) => c.voiceId,
);

// Map a speaker key → voice config.  Returns null for speakers that
// don't have a voice configured; useSpeech falls back to Web Speech
// for those.
export function voiceForSpeaker(speaker) {
  return CHARACTER_VOICES[speaker] ?? null;
}
