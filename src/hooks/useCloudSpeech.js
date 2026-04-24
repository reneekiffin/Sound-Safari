// Cloud TTS adapter.
//
// The browser's Web Speech API is the default, but it's inherently
// robotic.  This module lets us route speech through a cloud neural TTS
// service — right now OpenAI's gpt-4o-mini-tts, which sounds dramatically
// more natural and is cheap (~$0.015 per 1k characters).
//
// Design goals:
//   - Keyed, synchronous-feeling interface: speakCloud(text, opts) returns
//     a promise that resolves when playback finishes.
//   - Cache by (provider, voice, speed, text) so repeat phrases ("try
//     again", letter prompts) don't cost extra API calls.
//   - Fail soft: any network/auth error resolves with isFallback=true so
//     useSpeech can retry with Web Speech instead of leaving the kid
//     hanging in silence.
//   - Keys live only in localStorage on the user's own device.  We never
//     send them anywhere except the provider endpoint.

const audioCache = new Map();
let currentAudio = null;

export async function speakCloud(text, { provider, apiKey, voice = 'nova', speed = 1 } = {}) {
  if (!provider || !apiKey || !text) return { played: false, isFallback: true };

  try {
    const cacheKey = `${provider}:${voice}:${speed}:${text}`;
    let url = audioCache.get(cacheKey);
    if (!url) {
      url = await synthesize({ provider, apiKey, voice, speed, text });
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
    // Silent fail — caller falls back to Web Speech.
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
  if (provider === 'openai') {
    return synthesizeOpenAI({ apiKey, voice, speed, text });
  }
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
      // gpt-4o-mini-tts is the current kid-friendly, high-naturalness model.
      // tts-1 / tts-1-hd still work if the account doesn't have access.
      model: 'gpt-4o-mini-tts',
      input: text,
      voice, // alloy, ash, coral, echo, fable, nova, onyx, sage, shimmer
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

// Friendly voice roster, ordered by what tends to work best for kids'
// instructions.  Exposed so the Parent Zone can render a picker.
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
