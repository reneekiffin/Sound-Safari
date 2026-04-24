// Cloud TTS adapter.
//
// Two paths, tried in order:
//
//   1. Server proxy at /api/tts — the default.  The server holds the
//      real ElevenLabs key in its own env, so nothing leaks to the
//      browser.  We just POST { text, voiceId, settings } and play the
//      audio blob we get back.  Responses are immutable-cached, so
//      repeat phrases hit the browser cache / Vercel edge and don't
//      cost another call.
//
//   2. Bring-your-own-key (BYOK) ElevenLabs — if a parent has pasted
//      their own key into the Parent Zone, we call ElevenLabs
//      directly from the browser with THEIR key.  Lets power users
//      run on their own quota; still opt-in.
//
// Failures resolve with { played: false, isFallback: true } so
// useSpeech can silently drop to Web Speech — the kid never sees a
// broken UI.

import { voiceForSpeaker } from '../config/voices.js';

const audioCache = new Map();
let currentAudio = null;

export async function speakCloud(
  text,
  { provider = 'proxy', apiKey, speaker } = {},
) {
  if (!text || !speaker) return { played: false, isFallback: true };

  const voice = voiceForSpeaker(speaker);
  if (!voice) {
    // No voice configured for this speaker (e.g. Momo / Polly / Toby).
    // Let the caller fall back to Web Speech.
    return { played: false, isFallback: true };
  }

  // Skip the proxy entirely if the voiceId is still a placeholder —
  // the server will 400 us anyway and we'd rather go straight to
  // Web Speech than hit the network.
  if (voice.voiceId.endsWith('_PLACEHOLDER')) {
    return { played: false, isFallback: true };
  }

  try {
    const cacheKey = `${provider}:${voice.voiceId}:${text}`;
    let url = audioCache.get(cacheKey);
    if (!url) {
      url =
        provider === 'elevenlabs' && apiKey
          ? await synthesiseDirect({ apiKey, voice, text })
          : await synthesiseViaProxy({ voice, text });
      audioCache.set(cacheKey, url);
    }

    // Cancel whatever's playing before we start new audio.
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

async function synthesiseViaProxy({ voice, text }) {
  const res = await fetch('/api/tts', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      text,
      voiceId: voice.voiceId,
      settings: voice.settings,
    }),
  });
  if (!res.ok) throw new Error(`proxy ${res.status}`);
  const blob = await res.blob();
  return URL.createObjectURL(blob);
}

async function synthesiseDirect({ apiKey, voice, text }) {
  const res = await fetch(
    `https://api.elevenlabs.io/v1/text-to-speech/${voice.voiceId}`,
    {
      method: 'POST',
      headers: {
        'xi-api-key': apiKey,
        'Content-Type': 'application/json',
        Accept: 'audio/mpeg',
      },
      body: JSON.stringify({
        text,
        model_id: 'eleven_multilingual_v2',
        voice_settings: voice.settings,
      }),
    },
  );
  if (!res.ok) throw new Error(`elevenlabs ${res.status}`);
  const blob = await res.blob();
  return URL.createObjectURL(blob);
}
