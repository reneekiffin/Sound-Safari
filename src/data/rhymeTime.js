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
  // Brave-tier rhyme rounds.  Many words genuinely rhyme together
  // (light/bite/kite/night, ocean/motion/lotion/potion), so each round
  // here lists ALL the valid rhymes in `answers` and the game treats
  // any of them as correct.  Reinforces that rhymes are a property
  // of word *groups*, not single pairs.
  { id: 'giraffe', prompt: 'giraffe', answers: ['laugh', 'graph'], options: [
    { word: 'laugh', emoji: '😂' }, { word: 'graph', emoji: '📊' }, { word: 'gift', emoji: '🎁' }, { word: 'jaw', emoji: '🦷' },
  ]},
  { id: 'cake', prompt: 'cake', answers: ['snake', 'rake'], options: [
    { word: 'snake', emoji: '🐍' }, { word: 'rake', emoji: '🍂' }, { word: 'clock', emoji: '🕰️' }, { word: 'cow', emoji: '🐄' },
  ]},
  { id: 'knight', prompt: 'knight', answers: ['kite', 'night', 'bite'], options: [
    { word: 'kite', emoji: '🪁' }, { word: 'night', emoji: '🌃' }, { word: 'bite', emoji: '🦷' }, { word: 'knee', emoji: '🦵' },
  ]},
  { id: 'light', prompt: 'light', answers: ['bite', 'kite', 'night'], options: [
    { word: 'bite', emoji: '🦷' }, { word: 'kite', emoji: '🪁' }, { word: 'night', emoji: '🌃' }, { word: 'lamp', emoji: '💡' },
  ]},
  { id: 'phone', prompt: 'phone', answers: ['bone', 'stone', 'cone'], options: [
    { word: 'bone', emoji: '🦴' }, { word: 'stone', emoji: '🪨' }, { word: 'cone', emoji: '🍦' }, { word: 'foam', emoji: '🫧' },
  ]},
  { id: 'ocean', prompt: 'ocean', answers: ['lotion', 'motion', 'potion'], options: [
    { word: 'lotion', emoji: '🧴' }, { word: 'motion', emoji: '🏃' }, { word: 'potion', emoji: '🧪' }, { word: 'onion', emoji: '🧅' },
  ]},
  { id: 'snow', prompt: 'snow', answers: ['blow', 'glow', 'crow'], options: [
    { word: 'blow', emoji: '🌬️' }, { word: 'glow', emoji: '💡' }, { word: 'crow', emoji: '🐦‍⬛' }, { word: 'sun', emoji: '☀️' },
  ]},
  { id: 'spring', prompt: 'spring', answers: ['ring', 'king', 'wing'], options: [
    { word: 'ring', emoji: '💍' }, { word: 'king', emoji: '🤴' }, { word: 'wing', emoji: '🪶' }, { word: 'door', emoji: '🚪' },
  ]},
];

export const RHYME_TIME_ROUNDS = { easy: EASY, medium: MEDIUM, hard: HARD };
