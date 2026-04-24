import { Howl } from 'howler';

// Recorded-audio override layer.
//
// TTS — even with the best voice picker — sounds robotic for isolated letter
// sounds and phonemes.  This module lets parents / content authors drop a
// clip for a specific letter, phoneme, or whole word and have it take
// priority over TTS automatically.
//
// Usage:
//   registerClip('letter:a', '/audio/letters/a.mp3');
//   registerClip('phoneme:m', '/audio/phonemes/m.mp3');
//   registerClip('word:apple', '/audio/words/apple.mp3');
//
// To wire in a batch, call registerClipBundle({ 'letter:a': '/audio/a.mp3', ...}).
//
// playClipIfAvailable(key) returns a Promise<void> that resolves when the
// clip finishes, or null if no clip is registered (so callers fall back to
// TTS).

const _clips = new Map();
const _howls = new Map();

export function registerClip(key, src) {
  if (!key || !src) return;
  _clips.set(key, src);
  // Don't preload — Howler will load on first play.  Lets us register
  // hundreds of clips without paying for them up front.
  _howls.delete(key);
}

export function registerClipBundle(bundle) {
  Object.entries(bundle).forEach(([k, v]) => registerClip(k, v));
}

export function hasClip(key) {
  return _clips.has(key);
}

function getHowl(key) {
  if (_howls.has(key)) return _howls.get(key);
  const src = _clips.get(key);
  if (!src) return null;
  const howl = new Howl({ src: [src], preload: false });
  _howls.set(key, howl);
  return howl;
}

export function playClipIfAvailable(key) {
  if (!_clips.has(key)) return null;
  const howl = getHowl(key);
  if (!howl) return null;
  return new Promise((resolve) => {
    const id = howl.play();
    howl.once('end', () => resolve(), id);
    howl.once('loaderror', () => resolve(), id);
    howl.once('playerror', () => resolve(), id);
  });
}
