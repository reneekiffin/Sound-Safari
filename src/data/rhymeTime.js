// Rhyme Time (ages 7-9) — parrot says a word, kid picks the rhyme.
//
// Rhyming families are grouped by ending sound.  Distractors share at least
// one feature with the prompt (same starting consonant or close vowel) so
// the game rewards listening to the whole word rather than the first sound.
export const RHYME_TIME_ROUNDS = {
  easy: [
    {
      prompt: 'cat',
      answer: 'hat',
      options: [
        { word: 'hat', emoji: '🎩' },
        { word: 'dog', emoji: '🐕' },
        { word: 'cup', emoji: '🥤' },
      ],
    },
    {
      prompt: 'star',
      answer: 'car',
      options: [
        { word: 'car', emoji: '🚗' },
        { word: 'sun', emoji: '☀️' },
        { word: 'sand', emoji: '🏖️' },
      ],
    },
    {
      prompt: 'frog',
      answer: 'log',
      options: [
        { word: 'log', emoji: '🪵' },
        { word: 'frown', emoji: '😟' },
        { word: 'fish', emoji: '🐟' },
      ],
    },
    {
      prompt: 'bee',
      answer: 'tree',
      options: [
        { word: 'tree', emoji: '🌳' },
        { word: 'book', emoji: '📚' },
        { word: 'ball', emoji: '⚽' },
      ],
    },
    {
      prompt: 'moon',
      answer: 'spoon',
      options: [
        { word: 'spoon', emoji: '🥄' },
        { word: 'star', emoji: '⭐' },
        { word: 'mouse', emoji: '🐭' },
      ],
    },
  ],
  medium: [
    {
      prompt: 'snake',
      answer: 'lake',
      options: [
        { word: 'lake', emoji: '🏞️' },
        { word: 'snail', emoji: '🐌' },
        { word: 'bake', emoji: '🧁' },
        { word: 'snow', emoji: '❄️' },
      ],
    },
    {
      prompt: 'clock',
      answer: 'sock',
      options: [
        { word: 'sock', emoji: '🧦' },
        { word: 'cloud', emoji: '☁️' },
        { word: 'rock', emoji: '🪨' },
        { word: 'cloak', emoji: '🧥' },
      ],
    },
    {
      prompt: 'mouse',
      answer: 'house',
      options: [
        { word: 'house', emoji: '🏠' },
        { word: 'moon', emoji: '🌙' },
        { word: 'cheese', emoji: '🧀' },
        { word: 'mouth', emoji: '👄' },
      ],
    },
    {
      prompt: 'crown',
      answer: 'brown',
      options: [
        { word: 'brown', emoji: '🟫' },
        { word: 'crab', emoji: '🦀' },
        { word: 'town', emoji: '🏘️' },
        { word: 'cream', emoji: '🍦' },
      ],
    },
    {
      prompt: 'pink',
      answer: 'sink',
      options: [
        { word: 'sink', emoji: '🚰' },
        { word: 'pine', emoji: '🌲' },
        { word: 'wink', emoji: '😉' },
        { word: 'pan', emoji: '🍳' },
      ],
    },
  ],
  hard: [
    {
      prompt: 'giraffe',
      answer: 'laugh',
      options: [
        { word: 'laugh', emoji: '😂' },
        { word: 'graph', emoji: '📊' },
        { word: 'gift', emoji: '🎁' },
        { word: 'jaw', emoji: '🦷' },
      ],
    },
    {
      prompt: 'cake',
      answer: 'snake',
      options: [
        { word: 'snake', emoji: '🐍' },
        { word: 'clock', emoji: '🕰️' },
        { word: 'rake', emoji: '🍂' },
        { word: 'cow', emoji: '🐄' },
      ],
    },
    {
      prompt: 'knight',
      answer: 'kite',
      options: [
        { word: 'kite', emoji: '🪁' },
        { word: 'night', emoji: '🌃' },
        { word: 'knee', emoji: '🦵' },
        { word: 'nose', emoji: '👃' },
      ],
    },
  ],
};

// Notice: we ask for up to `count` rounds but cap at pool size so the
// session ends cleanly even for a small hard tier.
export function pickRhymeTimeSession(difficulty = 'easy', count = 10) {
  const pool = RHYME_TIME_ROUNDS[difficulty] ?? RHYME_TIME_ROUNDS.easy;
  return shuffle(pool).slice(0, Math.min(count, pool.length)).map(shuffleOptions);
}

function shuffle(arr) {
  return [...arr].sort(() => Math.random() - 0.5);
}

function shuffleOptions(round) {
  return { ...round, options: shuffle(round.options) };
}
