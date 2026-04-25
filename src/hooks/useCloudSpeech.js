// Cloud TTS adapter — server-proxy only.
//
// All speech now flows through /api/tts → Microsoft Edge neural voices.
// There's no API key in the browser to manage and no provider to swap;
// the server function holds whatever credentials the underlying TTS
// service needs (Edge's case: none).
//
// Failures resolve with { played: false, isFallback: true } so
// useSpeech can silently drop to Web Speech — kids never see a broken
// UI.

import { voiceForSpeaker } from '../config/voices.js';

const audioCache = new Map();
let currentAudio = null;

export async function speakCloud(text, { speaker } = {}) {
  if (!text || !speaker) return { played: false, isFallback: true };

  const voice = voiceForSpeaker(speaker);
  if (!voice) {
    return { played: false, isFallback: true };
  }

  try {
    const cacheKey = `${voice.voiceId}:${text}`;
    let url = audioCache.get(cacheKey);
    if (!url) {
      url = await synthesiseViaProxy({ voice, text });
      audioCache.set(cacheKey, url);
    }

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
