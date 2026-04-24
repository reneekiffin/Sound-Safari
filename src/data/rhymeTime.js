// Rhyme Time (ages 7-9) — parrot says a word, kid picks the rhyme.
//
// Each round carries:
//   - id       stable identifier (the prompt) for the session picker
//   - prompt   the spoken word kids hear
//   - answer   the correct rhyming option
//   - options  picture+word cards; each round gets a mix of rhymes and
//              near-miss distractors (same start consonant, close vowel, etc.)

const EASY = [
  { id: 'cat', prompt: 'cat', answer: 'hat', options: [
    { word: 'hat', emoji: '🎩' }, { word: 'dog', emoji: '🐕' }, { word: 'cup', emoji: '🥤' },
  ]},
  { id: 'star', prompt: 'star', answer: 'car', options: [
    { word: 'car', emoji: '🚗' }, { word: 'sun', emoji: '☀️' }, { word: 'sand', emoji: '🏖️' },
  ]},
  { id: 'frog', prompt: 'frog', answer: 'log', options: [
    { word: 'log', emoji: '🪵' }, { word: 'frown', emoji: '😟' }, { word: 'fish', emoji: '🐟' },
  ]},
  { id: 'bee', prompt: 'bee', answer: 'tree', options: [
    { word: 'tree', emoji: '🌳' }, { word: 'book', emoji: '📚' }, { word: 'ball', emoji: '⚽' },
  ]},
  { id: 'moon', prompt: 'moon', answer: 'spoon', options: [
    { word: 'spoon', emoji: '🥄' }, { word: 'star', emoji: '⭐' }, { word: 'mouse', emoji: '🐭' },
  ]},
  { id: 'dog', prompt: 'dog', answer: 'frog', options: [
    { word: 'frog', emoji: '🐸' }, { word: 'cat', emoji: '🐈' }, { word: 'bone', emoji: '🦴' },
  ]},
  { id: 'sun', prompt: 'sun', answer: 'bun', options: [
    { word: 'bun', emoji: '🍞' }, { word: 'moon', emoji: '🌙' }, { word: 'sail', emoji: '⛵' },
  ]},
  { id: 'ball', prompt: 'ball', answer: 'wall', options: [
    { word: 'wall', emoji: '🧱' }, { word: 'bat', emoji: '🦇' }, { word: 'bell', emoji: '🔔' },
  ]},
  { id: 'pig', prompt: 'pig', answer: 'wig', options: [
    { word: 'wig', emoji: '👱' }, { word: 'pen', emoji: '🖊️' }, { word: 'peg', emoji: '📎' },
  ]},
  { id: 'bed', prompt: 'bed', answer: 'red', options: [
    { word: 'red', emoji: '🟥' }, { word: 'book', emoji: '📚' }, { word: 'bed', emoji: '🛏️' },
  ]},
];

const MEDIUM = [
  { id: 'snake', prompt: 'snake', answer: 'lake', options: [
    { word: 'lake', emoji: '🏞️' }, { word: 'snail', emoji: '🐌' }, { word: 'bake', emoji: '🧁' }, { word: 'snow', emoji: '❄️' },
  ]},
  { id: 'clock', prompt: 'clock', answer: 'sock', options: [
    { word: 'sock', emoji: '🧦' }, { word: 'cloud', emoji: '☁️' }, { word: 'rock', emoji: '🪨' }, { word: 'cloak', emoji: '🧥' },
  ]},
  { id: 'mouse', prompt: 'mouse', answer: 'house', options: [
    { word: 'house', emoji: '🏠' }, { word: 'moon', emoji: '🌙' }, { word: 'cheese', emoji: '🧀' }, { word: 'mouth', emoji: '👄' },
  ]},
  { id: 'crown', prompt: 'crown', answer: 'brown', options: [
    { word: 'brown', emoji: '🟫' }, { word: 'crab', emoji: '🦀' }, { word: 'town', emoji: '🏘️' }, { word: 'cream', emoji: '🍦' },
  ]},
  { id: 'pink', prompt: 'pink', answer: 'sink', options: [
    { word: 'sink', emoji: '🚰' }, { word: 'pine', emoji: '🌲' }, { word: 'wink', emoji: '😉' }, { word: 'pan', emoji: '🍳' },
  ]},
  { id: 'shark', prompt: 'shark', answer: 'park', options: [
    { word: 'park', emoji: '🏞️' }, { word: 'shake', emoji: '🥤' }, { word: 'spark', emoji: '⚡' }, { word: 'shell', emoji: '🐚' },
  ]},
  { id: 'rain', prompt: 'rain', answer: 'train', options: [
    { word: 'train', emoji: '🚂' }, { word: 'rainbow', emoji: '🌈' }, { word: 'brain', emoji: '🧠' }, { word: 'road', emoji: '🛣️' },
  ]},
  { id: 'whale', prompt: 'whale', answer: 'tail', options: [
    { word: 'tail', emoji: '🦎' }, { word: 'water', emoji: '💧' }, { word: 'sail', emoji: '⛵' }, { word: 'wheel', emoji: '🛞' },
  ]},
];

const HARD = [
  { id: 'giraffe', prompt: 'giraffe', answer: 'laugh', options: [
    { word: 'laugh', emoji: '😂' }, { word: 'graph', emoji: '📊' }, { word: 'gift', emoji: '🎁' }, { word: 'jaw', emoji: '🦷' },
  ]},
  { id: 'cake', prompt: 'cake', answer: 'snake', options: [
    { word: 'snake', emoji: '🐍' }, { word: 'clock', emoji: '🕰️' }, { word: 'rake', emoji: '🍂' }, { word: 'cow', emoji: '🐄' },
  ]},
  { id: 'knight', prompt: 'knight', answer: 'kite', options: [
    { word: 'kite', emoji: '🪁' }, { word: 'night', emoji: '🌃' }, { word: 'knee', emoji: '🦵' }, { word: 'nose', emoji: '👃' },
  ]},
  { id: 'light', prompt: 'light', answer: 'bite', options: [
    { word: 'bite', emoji: '🦷' }, { word: 'lamp', emoji: '💡' }, { word: 'kite', emoji: '🪁' }, { word: 'leaf', emoji: '🍃' },
  ]},
  { id: 'phone', prompt: 'phone', answer: 'bone', options: [
    { word: 'bone', emoji: '🦴' }, { word: 'phrase', emoji: '💬' }, { word: 'stone', emoji: '🪨' }, { word: 'foam', emoji: '🫧' },
  ]},
  { id: 'ocean', prompt: 'ocean', answer: 'lotion', options: [
    { word: 'lotion', emoji: '🧴' }, { word: 'ozone', emoji: '🌫️' }, { word: 'onion', emoji: '🧅' }, { word: 'motion', emoji: '🏃' },
  ]},
];

export const RHYME_TIME_ROUNDS = { easy: EASY, medium: MEDIUM, hard: HARD };
