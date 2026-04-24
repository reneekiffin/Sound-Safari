// Sound Blending (ages 5-7) — three+ phonemes said separately, kid picks
// the picture that matches the blended word.
//
// Each round carries:
//   - id          stable identifier (the target word) for the session picker
//   - phonemes    the sounds TTS should emit one at a time
//   - answer      the blended word
//   - options     picture cards: { word, emoji }
//
// Pool split by difficulty.  Distractors share at least one phoneme with
// the target so kids really must listen to the whole blend, not just the
// first or last sound.

const EASY = [
  { id: 'cat', phonemes: ['c', 'a', 't'], answer: 'cat', options: [
    { word: 'cat', emoji: '🐈' }, { word: 'cap', emoji: '🧢' }, { word: 'car', emoji: '🚗' },
  ]},
  { id: 'dog', phonemes: ['d', 'o', 'g'], answer: 'dog', options: [
    { word: 'dog', emoji: '🐕' }, { word: 'log', emoji: '🪵' }, { word: 'fog', emoji: '🌫️' },
  ]},
  { id: 'sun', phonemes: ['s', 'u', 'n'], answer: 'sun', options: [
    { word: 'sun', emoji: '☀️' }, { word: 'bun', emoji: '🍞' }, { word: 'run', emoji: '🏃' },
  ]},
  { id: 'pig', phonemes: ['p', 'i', 'g'], answer: 'pig', options: [
    { word: 'pig', emoji: '🐖' }, { word: 'wig', emoji: '👱' }, { word: 'big', emoji: '🐘' },
  ]},
  { id: 'bed', phonemes: ['b', 'e', 'd'], answer: 'bed', options: [
    { word: 'bed', emoji: '🛏️' }, { word: 'red', emoji: '🟥' }, { word: 'ten', emoji: '🔟' },
  ]},
  { id: 'hat', phonemes: ['h', 'a', 't'], answer: 'hat', options: [
    { word: 'hat', emoji: '🎩' }, { word: 'bat', emoji: '🦇' }, { word: 'mat', emoji: '🧶' },
  ]},
  { id: 'fish', phonemes: ['f', 'i', 'sh'], answer: 'fish', options: [
    { word: 'fish', emoji: '🐟' }, { word: 'dish', emoji: '🍽️' }, { word: 'wish', emoji: '✨' },
  ]},
  { id: 'bus', phonemes: ['b', 'u', 's'], answer: 'bus', options: [
    { word: 'bus', emoji: '🚌' }, { word: 'cup', emoji: '🥤' }, { word: 'bug', emoji: '🐞' },
  ]},
  { id: 'frog', phonemes: ['f', 'r', 'og'], answer: 'frog', options: [
    { word: 'frog', emoji: '🐸' }, { word: 'log', emoji: '🪵' }, { word: 'fog', emoji: '🌫️' },
  ]},
  { id: 'snake', phonemes: ['s', 'n', 'ake'], answer: 'snake', options: [
    { word: 'snake', emoji: '🐍' }, { word: 'cake', emoji: '🎂' }, { word: 'lake', emoji: '🏞️' },
  ]},
  { id: 'bee', phonemes: ['b', 'ee'], answer: 'bee', options: [
    { word: 'bee', emoji: '🐝' }, { word: 'tea', emoji: '🫖' }, { word: 'bow', emoji: '🎀' },
  ]},
  { id: 'cow', phonemes: ['c', 'ow'], answer: 'cow', options: [
    { word: 'cow', emoji: '🐄' }, { word: 'car', emoji: '🚗' }, { word: 'key', emoji: '🔑' },
  ]},
  { id: 'fox', phonemes: ['f', 'o', 'x'], answer: 'fox', options: [
    { word: 'fox', emoji: '🦊' }, { word: 'box', emoji: '📦' }, { word: 'fan', emoji: '🪭' },
  ]},
  { id: 'bat', phonemes: ['b', 'a', 't'], answer: 'bat', options: [
    { word: 'bat', emoji: '🦇' }, { word: 'ball', emoji: '⚽' }, { word: 'rat', emoji: '🐀' },
  ]},
  { id: 'ant', phonemes: ['a', 'n', 't'], answer: 'ant', options: [
    { word: 'ant', emoji: '🐜' }, { word: 'apple', emoji: '🍎' }, { word: 'axe', emoji: '🪓' },
  ]},
];

const MEDIUM = [
  { id: 'star', phonemes: ['s', 't', 'ar'], answer: 'star', options: [
    { word: 'star', emoji: '⭐' }, { word: 'car', emoji: '🚗' }, { word: 'jar', emoji: '🫙' }, { word: 'barn', emoji: '🏚️' },
  ]},
  { id: 'tree', phonemes: ['t', 'r', 'ee'], answer: 'tree', options: [
    { word: 'tree', emoji: '🌳' }, { word: 'bee', emoji: '🐝' }, { word: 'key', emoji: '🔑' }, { word: 'tea', emoji: '🫖' },
  ]},
  { id: 'moon', phonemes: ['m', 'oo', 'n'], answer: 'moon', options: [
    { word: 'moon', emoji: '🌙' }, { word: 'spoon', emoji: '🥄' }, { word: 'noon', emoji: '🕛' }, { word: 'balloon', emoji: '🎈' },
  ]},
  { id: 'duck', phonemes: ['d', 'u', 'ck'], answer: 'duck', options: [
    { word: 'duck', emoji: '🦆' }, { word: 'truck', emoji: '🚚' }, { word: 'sock', emoji: '🧦' }, { word: 'clock', emoji: '🕰️' },
  ]},
  { id: 'cloud', phonemes: ['c', 'l', 'ou', 'd'], answer: 'cloud', options: [
    { word: 'cloud', emoji: '☁️' }, { word: 'crowd', emoji: '👥' }, { word: 'loud', emoji: '📢' }, { word: 'proud', emoji: '🏆' },
  ]},
  { id: 'snail', phonemes: ['s', 'n', 'ai', 'l'], answer: 'snail', options: [
    { word: 'snail', emoji: '🐌' }, { word: 'snake', emoji: '🐍' }, { word: 'sail', emoji: '⛵' }, { word: 'nail', emoji: '🔨' },
  ]},
  { id: 'bread', phonemes: ['b', 'r', 'ea', 'd'], answer: 'bread', options: [
    { word: 'bread', emoji: '🍞' }, { word: 'red', emoji: '🟥' }, { word: 'bed', emoji: '🛏️' }, { word: 'bride', emoji: '👰' },
  ]},
  { id: 'book', phonemes: ['b', 'oo', 'k'], answer: 'book', options: [
    { word: 'book', emoji: '📚' }, { word: 'cook', emoji: '👨‍🍳' }, { word: 'hook', emoji: '🪝' }, { word: 'bike', emoji: '🚲' },
  ]},
  { id: 'shark', phonemes: ['sh', 'ar', 'k'], answer: 'shark', options: [
    { word: 'shark', emoji: '🦈' }, { word: 'shirt', emoji: '👕' }, { word: 'park', emoji: '🏞️' }, { word: 'dark', emoji: '🌑' },
  ]},
  { id: 'ship', phonemes: ['sh', 'i', 'p'], answer: 'ship', options: [
    { word: 'ship', emoji: '🚢' }, { word: 'chip', emoji: '🍟' }, { word: 'sheep', emoji: '🐑' }, { word: 'shop', emoji: '🛒' },
  ]},
  { id: 'crab', phonemes: ['c', 'r', 'a', 'b'], answer: 'crab', options: [
    { word: 'crab', emoji: '🦀' }, { word: 'cab', emoji: '🚕' }, { word: 'grab', emoji: '🫴' }, { word: 'crib', emoji: '🛏️' },
  ]},
  { id: 'queen', phonemes: ['qu', 'ee', 'n'], answer: 'queen', options: [
    { word: 'queen', emoji: '👸' }, { word: 'green', emoji: '🟩' }, { word: 'quick', emoji: '⚡' }, { word: 'keen', emoji: '👀' },
  ]},
];

const HARD = [
  { id: 'butterfly', phonemes: ['b', 'u', 't', 'er', 'f', 'l', 'y'], answer: 'butterfly', options: [
    { word: 'butterfly', emoji: '🦋' }, { word: 'butter', emoji: '🧈' }, { word: 'firefly', emoji: '✨' }, { word: 'fly', emoji: '🪰' },
  ]},
  { id: 'elephant', phonemes: ['e', 'l', 'e', 'f', 'a', 'nt'], answer: 'elephant', options: [
    { word: 'elephant', emoji: '🐘' }, { word: 'envelope', emoji: '✉️' }, { word: 'eleven', emoji: '1️⃣' }, { word: 'olive', emoji: '🫒' },
  ]},
  { id: 'rainbow', phonemes: ['r', 'ai', 'n', 'b', 'ow'], answer: 'rainbow', options: [
    { word: 'rainbow', emoji: '🌈' }, { word: 'ribbon', emoji: '🎀' }, { word: 'raincoat', emoji: '🧥' }, { word: 'window', emoji: '🪟' },
  ]},
  { id: 'dragon', phonemes: ['d', 'r', 'a', 'g', 'o', 'n'], answer: 'dragon', options: [
    { word: 'dragon', emoji: '🐉' }, { word: 'wagon', emoji: '🛺' }, { word: 'dinner', emoji: '🍽️' }, { word: 'drum', emoji: '🥁' },
  ]},
  { id: 'strawberry', phonemes: ['s', 't', 'r', 'aw', 'b', 'er', 'y'], answer: 'strawberry', options: [
    { word: 'strawberry', emoji: '🍓' }, { word: 'blueberry', emoji: '🫐' }, { word: 'straw', emoji: '🥤' }, { word: 'stranger', emoji: '👤' },
  ]},
];

export const SOUND_BLENDING_ROUNDS = { easy: EASY, medium: MEDIUM, hard: HARD };
