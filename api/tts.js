// Vercel serverless function: browser-facing proxy for Microsoft Edge
// neural TTS.
//
// Why Edge instead of ElevenLabs:
//   - Free.  No API key, no quota, no spending cap to manage.
//   - Microsoft's neural voices are high quality (Aria, Jenny, Andrew,
//     Davis, etc.) and span many languages.
//   - msedge-tts wraps the Read-Aloud WebSocket endpoint, which is
//     undocumented but stable enough that public packages have used
//     it for years.  If Microsoft ever changes the protocol, we can
//     swap providers without touching the client (the contract is
//     just { text, voice, settings } → audio/mpeg).
//
// Flow:
//   1. Browser POSTs { text, voiceId, settings } to /api/tts.
//   2. We validate, look up the voice in the whitelist.
//   3. Open a WebSocket to Microsoft's read-aloud endpoint via the
//      msedge-tts client, stream the audio chunks, concat into a
//      Buffer, and stream it back as audio/mpeg.
//   4. Long cache headers so repeat phrases come straight from the
//      browser/edge cache.
//
// Abuse prevention:
//   - POST-only (405 otherwise).
//   - Voice whitelist below — kids only get the configured voices,
//     can't request arbitrary voices off Microsoft's roster.
//   - text must be a short (<=300 char) string.
//   - In-memory rate limit: 60/min/IP.

import { MsEdgeTTS, OUTPUT_FORMAT } from 'msedge-tts';

// Whitelist of Edge neural voices the proxy will render.  Keep this in
// sync with src/config/voices.js — we duplicate (rather than import)
// because Vercel's serverless bundler can struggle with cross-directory
// ESM imports.
const VOICE_WHITELIST = [
  'en-US-GuyNeural',          // Leo    (lion)
  'en-US-AndrewNeural',       // Momo   (monkey)
  'en-US-AriaNeural',         // Polly  (parrot)
  'en-US-EmmaNeural',         // Ellie  (elephant)
  'en-US-BrianNeural',        // Toby   (toucan)
  'en-US-ChristopherNeural',  // Finn   (frog)
  'en-US-JennyNeural',        // Gigi   (giraffe)
  'en-US-AnaNeural',          // Zara   (zebra)
  'en-US-RogerNeural',        // Ollie  (owl)
  'en-US-MichelleNeural',     // Penny  (panda)
  'en-US-EricNeural',         // Skippy (squirrel)
  'es-MX-DaliaNeural',        // Sofia  (sloth) — Spanish
];

// 600 chars instead of 300 — SSML phoneme tags add overhead (a single
// `<phoneme alphabet="ipa" ph="æ">a</phoneme>` is ~40 chars for one
// letter sound, and Sound Blending sends 4-5 phonemes plus the answer
// word in one utterance).
const MAX_TEXT_LEN = 600;

// Sliding-window rate limit.  Map keyed by IP; value is timestamps
// within the current 60-second window.  Resets per serverless instance,
// so it's abuse-prevention not a hard global quota — fine because
// Edge TTS is free and the only real cost is request latency.
const RATE_WINDOW_MS = 60_000;
const RATE_MAX = 60;
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

  // Edge TTS prosody knobs.  msedge-tts accepts rate (-100..+100 as a
  // percentage), pitch (-100..+100 Hz roughly), and volume.  We map
  // the same `settings` shape the client already sends so the upgrade
  // is invisible to game code.
  const rate = clampPercent(settings?.rate, 0);
  const pitch = clampPercent(settings?.pitch, 0);
  const volume = clampPercent(settings?.volume, 0);

  try {
    const tts = new MsEdgeTTS();
    await tts.setMetadata(voiceId, OUTPUT_FORMAT.AUDIO_24KHZ_48KBITRATE_MONO_MP3);
    const { audioStream } = tts.toStream(text.trim(), {
      rate: signedPercent(rate),
      pitch: signedPercent(pitch),
      volume: signedPercent(volume),
    });

    const chunks = [];
    await new Promise((resolve, reject) => {
      audioStream.on('data', (chunk) => chunks.push(chunk));
      audioStream.on('end', resolve);
      audioStream.on('error', reject);
    });
    const buffer = Buffer.concat(chunks);

    res.setHeader('Content-Type', 'audio/mpeg');
    // Same (voice, text, prosody) → same audio.  Aggressive cache so
    // repeat phrases come from the browser/edge cache.
    res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
    return res.status(200).send(buffer);
  } catch (err) {
    console.error('[tts] edge synth error');
    return res.status(502).json({ error: 'tts_failed' });
  }
}

function clampPercent(value, fallback) {
  const n = Number(value);
  if (!Number.isFinite(n)) return fallback;
  return Math.max(-100, Math.min(100, n));
}

// msedge-tts wants rate/pitch/volume formatted like "+10%" or "-5%".
function signedPercent(n) {
  const sign = n >= 0 ? '+' : '';
  return `${sign}${n}%`;
}
