// Cloud TTS adapter — supports OpenAI and ElevenLabs.
//
// Default flow for any spoken phrase:
//   1. If the parent configured a cloud provider + key, route there with
//      the mascot-appropriate voice.  Cached per (provider, voice, speed,
//      text) so repeat phrases don't cost extra.
//   2. If the cloud call fails (offline, bad key, rate limit), resolve
//      with `{ played: false, isFallback: true }` so the caller can drop
//      to Web Speech silently.  Never leave the kid in silence.
//
// Per-mascot voices: ElevenLabs shines when each animal has a distinct
// voice; OpenAI lets us pick from nine preset voices too.  See
// MASCOT_VOICES below for the mapping.
//
// The user's API key lives only in localStorage on their device and is
// sent only to the provider's endpoint.

const audioCache = new Map();
let currentAudio = null;

// ElevenLabs well-known preset voice IDs — picked for per-character fit.
// See https://elevenlabs.io/app/voice-library for the full set; these are
// the default library voices and are available on every account.
const EL_VOICES = {
  adam: 'pNInz6obpgDQGcFmaJgB', // deep, warm male
  antoni: 'ErXwobaYiN019PkySvjV', // well-rounded male
  arnold: 'VR6AewLTigWG4xSOukaG', // crisp, authoritative male
  bella: 'EXAVITQu4vr4xnSDxMaL', // young, bright female
  domi: 'AZnzlk1XvdvUeBnXmlld', // strong, confident female
  elli: 'MF3mGyEYCl7XYWbV9V6O', // young, emotional female
  josh: 'TxGEqnHWrfWFTfGW9XjX', // youthful, casual male
  rachel: '21m00Tcm4TlvDq8ikWAM', // calm, warm female
  sam: 'yoZ06aMxZJJ28mfd3POQ', // raspy, narration-friendly male
};

// Per-mascot voice map per provider.  Each key maps to a voice that
// matches the character's personality brief.  Unknown mascots fall back
// to the global default the parent picked in Parent Zone.
export const MASCOT_VOICES = {
  openai: {
    lion: 'onyx',       // Leo — deeper male
    monkey: 'ash',      // Momo — playful male
    parrot: 'shimmer',  // Polly — bright, fun
    elephant: 'coral',  // Ellie — warm, motherly
    toucan: 'fable',    // Toby — storyteller
    frog: 'sage',       // Finn — spunky female
    giraffe: 'nova',    // Gigi — gentle, teacherly
    zebra: 'shimmer',   // Zara — zippy, bright
    owl: 'sage',        // Ollie — wise, thoughtful
    panda: 'coral',     // Penny — cuddly, warm
    squirrel: 'shimmer',// Skippy — quick, clever
    sloth: 'sage',      // Sofia — soft, patient, low-pressure
  },
  elevenlabs: {
    lion: EL_VOICES.adam,        // Leo — deep male
    monkey: EL_VOICES.josh,      // Momo — playful male
    parrot: EL_VOICES.bella,     // Polly — bright, fun
    elephant: EL_VOICES.rachel,  // Ellie — warm, motherly
    toucan: EL_VOICES.antoni,    // Toby — well-rounded male
    frog: EL_VOICES.domi,        // Finn — spunky female
    giraffe: EL_VOICES.elli,     // Gigi — gentle teacher
    zebra: EL_VOICES.bella,      // Zara — bright, energetic
    owl: EL_VOICES.arnold,       // Ollie — wise, steady
    panda: EL_VOICES.rachel,     // Penny — cuddly, warm
    squirrel: EL_VOICES.josh,    // Skippy — fast, clever
    sloth: EL_VOICES.rachel,     // Sofia — calm, patient
  },
};

export function voiceFor({ provider, voice, speaker }) {
  const speakerMap = MASCOT_VOICES[provider] ?? {};
  return speakerMap[speaker] ?? voice ?? null;
}

export async function speakCloud(
  text,
  { provider, apiKey, voice, speaker, speed = 1 } = {},
) {
  if (!provider || !apiKey || !text) {
    return { played: false, isFallback: true };
  }

  const resolvedVoice = voiceFor({ provider, voice, speaker });
  if (!resolvedVoice) return { played: false, isFallback: true };

  try {
    const cacheKey = `${provider}:${resolvedVoice}:${speed}:${text}`;
    let url = audioCache.get(cacheKey);
    if (!url) {
      url = await synthesize({
        provider,
        apiKey,
        voice: resolvedVoice,
        speed,
        text,
      });
      audioCache.set(cacheKey, url);
    }

    // Cancel whatever is playing before starting new audio.
    if (currentAudio) {
      try { currentAudio.pause(); } catch {}
      currentAudio = null;
    }

    const audio = new Audio(url);
    currentAudio = audio;
    await new Promise((resolve) => {
      const done = () => {
        if (currentAudio === audio) currentAudio = null;
        resolve();
      };
      audio.addEventListener('ended', done, { once: true });
      audio.addEventListener('error', done, { once: true });
      audio.play().catch(done);
    });
    return { played: true, isFallback: false };
  } catch (err) {
    if (import.meta.env.DEV) console.warn('Cloud TTS error:', err);
    return { played: false, isFallback: true, error: err };
  }
}

export function cancelCloud() {
  if (currentAudio) {
    try { currentAudio.pause(); } catch {}
    currentAudio = null;
  }
}

async function synthesize({ provider, apiKey, voice, speed, text }) {
  if (provider === 'openai') return synthesizeOpenAI({ apiKey, voice, speed, text });
  if (provider === 'elevenlabs') return synthesizeElevenLabs({ apiKey, voice, speed, text });
  throw new Error(`Unknown TTS provider: ${provider}`);
}

async function synthesizeOpenAI({ apiKey, voice, speed, text }) {
  const res = await fetch('https://api.openai.com/v1/audio/speech', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini-tts',
      input: text,
      voice,
      response_format: 'mp3',
      speed,
    }),
  });
  if (!res.ok) {
    const body = await res.text().catch(() => '');
    throw new Error(`OpenAI TTS ${res.status}: ${body.slice(0, 200)}`);
  }
  const blob = await res.blob();
  return URL.createObjectURL(blob);
}

async function synthesizeElevenLabs({ apiKey, voice, speed, text }) {
  // eleven_flash_v2_5: the fastest + cheapest model; great for short
  // instructional phrases.  voice_settings tuned for stable, warm
  // delivery that reads well to kids.
  const res = await fetch(
    `https://api.elevenlabs.io/v1/text-to-speech/${voice}`,
    {
      method: 'POST',
      headers: {
        'xi-api-key': apiKey,
        'Content-Type': 'application/json',
        Accept: 'audio/mpeg',
      },
      body: JSON.stringify({
        text,
        model_id: 'eleven_flash_v2_5',
        voice_settings: {
          stability: 0.55,
          similarity_boost: 0.78,
          style: 0.25,
          use_speaker_boost: true,
        },
      }),
    },
  );
  if (!res.ok) {
    const body = await res.text().catch(() => '');
    throw new Error(`ElevenLabs ${res.status}: ${body.slice(0, 200)}`);
  }
  const blob = await res.blob();
  return URL.createObjectURL(blob);
}

// Friendly voice roster per provider, used by the Parent Zone picker.
// The mascot map above is what actually routes in-game; this picker is
// for the parent to override the default when no `speaker` is supplied.
export const OPENAI_VOICES = [
  { id: 'nova', label: 'Nova (warm, clear)' },
  { id: 'shimmer', label: 'Shimmer (bright, upbeat)' },
  { id: 'coral', label: 'Coral (friendly)' },
  { id: 'sage', label: 'Sage (soft, gentle)' },
  { id: 'fable', label: 'Fable (storyteller)' },
  { id: 'alloy', label: 'Alloy (neutral)' },
  { id: 'ash', label: 'Ash (calm)' },
  { id: 'echo', label: 'Echo (deep)' },
  { id: 'onyx', label: 'Onyx (deep, steady)' },
];

export const ELEVENLABS_VOICES = [
  { id: EL_VOICES.rachel, label: 'Rachel (warm female)' },
  { id: EL_VOICES.bella, label: 'Bella (bright female)' },
  { id: EL_VOICES.domi, label: 'Domi (confident female)' },
  { id: EL_VOICES.elli, label: 'Elli (young female)' },
  { id: EL_VOICES.adam, label: 'Adam (deep male)' },
  { id: EL_VOICES.antoni, label: 'Antoni (well-rounded male)' },
  { id: EL_VOICES.arnold, label: 'Arnold (authoritative male)' },
  { id: EL_VOICES.josh, label: 'Josh (youthful male)' },
  { id: EL_VOICES.sam, label: 'Sam (narration male)' },
];
