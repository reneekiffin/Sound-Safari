// Vercel serverless function: browser-facing proxy for ElevenLabs TTS.
//
// Flow:
//   1. Browser POSTs { text, voiceId, settings } to /api/tts.
//   2. We validate the payload, look up the voice in the whitelist, and
//      call ElevenLabs with our server-side API key.
//   3. We stream back the audio as audio/mpeg with long cache headers
//      so repeat phrases come straight from the CDN edge cache.
//
// The API key lives ONLY in process.env.ELEVENLABS_API_KEY on the
// server side.  It must never be prefixed with VITE_ (that would leak
// into the browser bundle).
//
// Abuse prevention:
//   - POST-only (405 otherwise)
//   - Voice whitelist imported from src/config/voices.js
//   - text must be a short (<=300 char) string
//   - In-memory sliding-window rate limit: 20 requests / minute / IP.
//     Note: serverless instances are ephemeral, so this limits bursts
//     per warm instance — it's abuse-prevention, not a hard global
//     quota.  Set a hard spending cap at ElevenLabs for real safety.
//
// Errors:
//   - Never echo the API key or provider stack-traces to the client.
//   - Generic { error: 'tts_failed' } on any provider problem.
//   - Client drops to Web Speech on any non-2xx.

// Whitelist of voice IDs the proxy will accept.
//
// This MUST mirror the voiceId values in src/config/voices.js.  We
// duplicate the list here (rather than importing from src/) because
// Vercel's serverless bundler can struggle with cross-directory ESM
// imports; duplicating keeps the function self-contained and the deploy
// rock-solid.  If you add or change a voice in src/config/voices.js,
// update this array too — it's the only hand-maintained sync point.
const VOICE_WHITELIST = [
  'kHbsDwAcjwdBlFpchxv4', // Ellie  (elephant)
  'MYiFAKeVwcvm4z9VsFAR', // Leo    (lion)
  'PoHUWWWMHFrA8z7Q88pu', // Polly  (parrot) + Sofia (sloth) — shared voice
  'b8gbDO0ybjX1VA89pBdX', // Zara   (zebra)
  '9yzdeviXkFddZ4Oz8Mok', // Gigi   (giraffe)
  'EaX6rnyDKjJx35tchi80', // Finn   (frog)
];

const ELEVENLABS_URL = 'https://api.elevenlabs.io/v1/text-to-speech';
const MODEL_ID = 'eleven_multilingual_v2';
const MAX_TEXT_LEN = 300;

// Simple sliding-window rate limiter.  Map keyed by IP; value is an
// array of request timestamps within the current window.
const RATE_WINDOW_MS = 60_000;
const RATE_MAX = 20;
const rateStore = new Map();

function rateLimited(ip) {
  const now = Date.now();
  const cutoff = now - RATE_WINDOW_MS;
  const bucket = (rateStore.get(ip) ?? []).filter((t) => t > cutoff);
  if (bucket.length >= RATE_MAX) {
    rateStore.set(ip, bucket);
    return true;
  }
  bucket.push(now);
  rateStore.set(ip, bucket);
  return false;
}

function clientIp(req) {
  // Vercel populates x-forwarded-for with the real client IP.  Fall
  // back to the socket address for local dev.
  const fwd = req.headers['x-forwarded-for'];
  if (typeof fwd === 'string' && fwd.length) return fwd.split(',')[0].trim();
  if (Array.isArray(fwd) && fwd.length) return fwd[0];
  return req.socket?.remoteAddress ?? 'unknown';
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'method_not_allowed' });
  }

  const ip = clientIp(req);
  if (rateLimited(ip)) {
    return res.status(429).json({ error: 'rate_limited' });
  }

  let body = req.body;
  // Some Vercel runtimes deliver the body as a Buffer — parse if needed.
  if (typeof body === 'string') {
    try { body = JSON.parse(body); } catch { body = null; }
  }

  const { text, voiceId, settings } = body ?? {};

  if (typeof text !== 'string' || !text.trim()) {
    return res.status(400).json({ error: 'bad_text' });
  }
  if (text.length > MAX_TEXT_LEN) {
    return res.status(400).json({ error: 'text_too_long' });
  }
  if (typeof voiceId !== 'string' || !VOICE_WHITELIST.includes(voiceId)) {
    return res.status(400).json({ error: 'bad_voice' });
  }

  const apiKey = process.env.ELEVENLABS_API_KEY;
  if (!apiKey) {
    // Misconfiguration — log a generic server note, return generic error.
    console.error('[tts] ELEVENLABS_API_KEY missing');
    return res.status(500).json({ error: 'tts_failed' });
  }

  // Sensible defaults; caller can override per character.
  const voiceSettings = {
    stability: clampNum(settings?.stability, 0.5, 0, 1),
    similarity_boost: clampNum(settings?.similarity_boost, 0.75, 0, 1),
    style: clampNum(settings?.style, 0.2, 0, 1),
    use_speaker_boost: Boolean(settings?.use_speaker_boost ?? true),
  };

  try {
    const elRes = await fetch(`${ELEVENLABS_URL}/${voiceId}`, {
      method: 'POST',
      headers: {
        'xi-api-key': apiKey,
        'Content-Type': 'application/json',
        Accept: 'audio/mpeg',
      },
      body: JSON.stringify({
        text: text.trim(),
        model_id: MODEL_ID,
        voice_settings: voiceSettings,
      }),
    });

    if (!elRes.ok) {
      // Don't leak provider detail to the client.
      console.error('[tts] upstream status', elRes.status);
      return res.status(502).json({ error: 'tts_failed' });
    }

    const buffer = Buffer.from(await elRes.arrayBuffer());
    res.setHeader('Content-Type', 'audio/mpeg');
    // Immutable: same (voice, text) always returns the same audio, so
    // browsers + Vercel's edge can cache forever.  Change the voiceId
    // or text and the URL key changes too.
    res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
    return res.status(200).send(buffer);
  } catch (err) {
    console.error('[tts] network error');
    return res.status(502).json({ error: 'tts_failed' });
  }
}

function clampNum(value, fallback, lo, hi) {
  const n = Number(value);
  if (!Number.isFinite(n)) return fallback;
  return Math.max(lo, Math.min(hi, n));
}
