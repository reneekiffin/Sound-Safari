// Character voice config — single source of truth for Microsoft Edge
// neural TTS.
//
// IMPORTANT: only voices in the Edge Read-Aloud catalog work via the
// `msedge-tts` package.  Azure-only voices (Nancy, Davis, Ashley,
// Jason, Amber, Cora, Elizabeth, Monica, Tony) silently fail on this
// endpoint and the client drops to Web Speech.  Stick to the
// confirmed catalog: Andrew, Ana, Aria, Brian, Christopher, Emma,
// Eric, Guy, Jenny, Michelle, Roger, Steffan (en-US) plus Dalia,
// Alvaro, Elvira (Spanish).
//
// Personality knobs:
//   rate     -100..+100 percent (negative = slower)
//   pitch    -100..+100 percent (negative = deeper)
//   volume   -100..+100 percent

export const CHARACTER_VOICES = {
  lion: {
    name: 'Leo',
    description: 'Letter Sounds host — confident, warm male',
    voiceId: 'en-US-GuyNeural',
    settings: { rate: -8, pitch: -4, volume: 0 },
  },
  monkey: {
    name: 'Momo',
    description: 'Sound Blending host — preppy, engaging young male',
    voiceId: 'en-US-AndrewNeural',
    settings: { rate: 6, pitch: 12, volume: 0 },
  },
  parrot: {
    name: 'Polly',
    description: 'Rhyme Time host — preppy, excited female',
    voiceId: 'en-US-AriaNeural',
    settings: { rate: 8, pitch: 14, volume: 0 },
  },
  elephant: {
    name: 'Ellie',
    description: 'Syllable Stomp host — warm, calm, motherly female',
    voiceId: 'en-US-EmmaNeural',
    settings: { rate: -4, pitch: -2, volume: 0 },
  },
  toucan: {
    name: 'Toby',
    description: 'Opposites host — enthusiastic boy',
    voiceId: 'en-US-BrianNeural',
    settings: { rate: 6, pitch: 14, volume: 0 },
  },
  frog: {
    name: 'Finn',
    description: 'Same-Same host — slightly deeper male, neutral overall',
    voiceId: 'en-US-ChristopherNeural',
    settings: { rate: -4, pitch: -10, volume: 0 },
  },
  giraffe: {
    name: 'Gigi',
    description: 'Sentence Safari host — warm, friendly female',
    voiceId: 'en-US-JennyNeural',
    settings: { rate: -2, pitch: 4, volume: 0 },
  },
  zebra: {
    name: 'Zara',
    description: 'Odd One Out host — outgoing, bubbly kid female',
    voiceId: 'en-US-AnaNeural',
    settings: { rate: 4, pitch: 6, volume: 0 },
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
    voiceId: 'en-US-EricNeural',
    settings: { rate: 14, pitch: 10, volume: 0 },
  },
  sloth: {
    name: 'Sofia',
    description: '¡Hola! Spanish host — slow, calm, pleasant',
    voiceId: 'es-MX-DaliaNeural',
    settings: { rate: -12, pitch: 0, volume: 0 },
  },
};

export const VOICE_WHITELIST = Object.values(CHARACTER_VOICES).map(
  (c) => c.voiceId,
);

export function voiceForSpeaker(speaker) {
  return CHARACTER_VOICES[speaker] ?? null;
}
