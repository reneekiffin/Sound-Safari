// Sound Blending (ages 5-7) — three phonemes said separately, kid picks the
// picture that matches the blended word.
//
// Each option carries a tiny emoji so pre-readers can identify pictures
// without needing art assets.  Distractors share at least one sound with the
// target to make the game pedagogically meaningful (e.g. cat/cap/car share /c/
// + /a/).  `phonemes` drives the speech synthesiser — we pause between each.
export const SOUND_BLENDING_ROUNDS = {
  easy: [
    {
      phonemes: ['c', 'a', 't'],
      answer: 'cat',
      options: [
        { word: 'cat', emoji: '🐈' },
        { word: 'cap', emoji: '🧢' },
        { word: 'car', emoji: '🚗' },
      ],
    },
    {
      phonemes: ['d', 'o', 'g'],
      answer: 'dog',
      options: [
        { word: 'dog', emoji: '🐕' },
        { word: 'log', emoji: '🪵' },
        { word: 'fog', emoji: '🌫️' },
      ],
    },
    {
      phonemes: ['s', 'u', 'n'],
      answer: 'sun',
      options: [
        { word: 'sun', emoji: '☀️' },
        { word: 'bun', emoji: '🍞' },
        { word: 'run', emoji: '🏃' },
      ],
    },
    {
      phonemes: ['p', 'i', 'g'],
      answer: 'pig',
      options: [
        { word: 'pig', emoji: '🐖' },
        { word: 'wig', emoji: '👱' },
        { word: 'big', emoji: '🐘' },
      ],
    },
    {
      phonemes: ['b', 'e', 'd'],
      answer: 'bed',
      options: [
        { word: 'bed', emoji: '🛏️' },
        { word: 'red', emoji: '🟥' },
        { word: 'ten', emoji: '🔟' },
      ],
    },
    {
      phonemes: ['h', 'a', 't'],
      answer: 'hat',
      options: [
        { word: 'hat', emoji: '🎩' },
        { word: 'bat', emoji: '🦇' },
        { word: 'mat', emoji: '🧶' },
      ],
    },
    {
      phonemes: ['f', 'i', 'sh'],
      answer: 'fish',
      options: [
        { word: 'fish', emoji: '🐟' },
        { word: 'dish', emoji: '🍽️' },
        { word: 'wish', emoji: '✨' },
      ],
    },
    {
      phonemes: ['b', 'u', 's'],
      answer: 'bus',
      options: [
        { word: 'bus', emoji: '🚌' },
        { word: 'cup', emoji: '🥤' },
        { word: 'bug', emoji: '🐞' },
      ],
    },
    {
      phonemes: ['f', 'r', 'og'],
      answer: 'frog',
      options: [
        { word: 'frog', emoji: '🐸' },
        { word: 'log', emoji: '🪵' },
        { word: 'fog', emoji: '🌫️' },
      ],
    },
    {
      phonemes: ['s', 'n', 'ake'],
      answer: 'snake',
      options: [
        { word: 'snake', emoji: '🐍' },
        { word: 'cake', emoji: '🎂' },
        { word: 'lake', emoji: '🏞️' },
      ],
    },
  ],
  medium: [
    {
      phonemes: ['s', 't', 'ar'],
      answer: 'star',
      options: [
        { word: 'star', emoji: '⭐' },
        { word: 'car', emoji: '🚗' },
        { word: 'jar', emoji: '🫙' },
        { word: 'bar', emoji: '📏' },
      ],
    },
    {
      phonemes: ['t', 'r', 'ee'],
      answer: 'tree',
      options: [
        { word: 'tree', emoji: '🌳' },
        { word: 'bee', emoji: '🐝' },
        { word: 'key', emoji: '🔑' },
        { word: 'tea', emoji: '🫖' },
      ],
    },
    {
      phonemes: ['m', 'oo', 'n'],
      answer: 'moon',
      options: [
        { word: 'moon', emoji: '🌙' },
        { word: 'spoon', emoji: '🥄' },
        { word: 'noon', emoji: '🕛' },
        { word: 'balloon', emoji: '🎈' },
      ],
    },
    {
      phonemes: ['d', 'u', 'ck'],
      answer: 'duck',
      options: [
        { word: 'duck', emoji: '🦆' },
        { word: 'truck', emoji: '🚚' },
        { word: 'sock', emoji: '🧦' },
        { word: 'clock', emoji: '🕰️' },
      ],
    },
    {
      phonemes: ['c', 'l', 'ou', 'd'],
      answer: 'cloud',
      options: [
        { word: 'cloud', emoji: '☁️' },
        { word: 'crowd', emoji: '👥' },
        { word: 'loud', emoji: '📢' },
        { word: 'proud', emoji: '🏆' },
      ],
    },
  ],
};

// Gentle TTS helper: add a short dash between phonemes to create pauses.
export function phonemesToScript(phonemes) {
  return phonemes.join(' ... ');
}

export function pickSoundBlendingSession(difficulty = 'easy', count = 10) {
  const pool = SOUND_BLENDING_ROUNDS[difficulty] ?? SOUND_BLENDING_ROUNDS.easy;
  return shuffle(pool).slice(0, Math.min(count, pool.length));
}

function shuffle(arr) {
  return [...arr].sort(() => Math.random() - 0.5);
}
