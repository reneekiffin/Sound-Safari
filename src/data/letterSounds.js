// Letter Sounds (ages 3-5) — hear a phoneme, pick the matching letter.
//
// Each round carries:
//   - `letter`      the grapheme displayed on the card
//   - `phoneme`     the stretched sound TTS should make (e.g. "aaa", "mmm")
//   - `sampleWord`  a kid-friendly example word, used by the TTS carrier
//                   phrase ("A says aaa, like apple") — this is what makes
//                   TTS pronounce phonemes correctly instead of robotically
//   - `options`     the letter choices, including the correct letter
//
// Difficulty curve:
//   easy   — 3 options, short vowels + common consonants, clear contrast
//   medium — 4 options, all consonants, harder contrasts
//   hard   — 4 options, digraphs (sh/ch/th/ng/qu) + easily-confused pairs

const EASY = [
  // Phoneme spellings are kept in sync with audio-pipeline/letter-sounds.json
  // (the `tts_input` field for each letter).  These have been tuned by ear
  // against Edge's en-US-DavisNeural — short open syllables for vowels,
  // CVC-shaped tokens for stops ("bub", "cup", "tut", "pup") so Edge says
  // them as one syllable instead of spelling out letters, and tripled
  // consonants for fricatives/continuants ("ssssss", "ffff", "mmm",
  // "nnn", "lll").  When the pipeline regenerates the MP3s the runtime
  // automatically picks them up via registerClipBundle.
  { letter: 'a', phoneme: 'aaa', sampleWord: 'apple', options: ['a', 'o', 'u'] },
  { letter: 'm', phoneme: 'mmm', sampleWord: 'monkey', options: ['m', 's', 't'] },
  { letter: 's', phoneme: 'ssssss', sampleWord: 'snake', options: ['s', 'f', 'm'] },
  { letter: 't', phoneme: 'tut', sampleWord: 'tiger', options: ['t', 'b', 'd'] },
  { letter: 'p', phoneme: 'pup', sampleWord: 'panda', options: ['p', 't', 'k'] },
  { letter: 'i', phoneme: 'ihh', sampleWord: 'igloo', options: ['i', 'e', 'a'] },
  { letter: 'n', phoneme: 'nnn', sampleWord: 'nest', options: ['n', 'm', 'r'] },
  { letter: 'o', phoneme: 'ahh', sampleWord: 'octopus', options: ['o', 'u', 'a'] },
  { letter: 'b', phoneme: 'bub', sampleWord: 'bear', options: ['b', 'd', 'p'] },
  { letter: 'g', phoneme: 'gut', sampleWord: 'goat', options: ['g', 'k', 'j'] },
  { letter: 'd', phoneme: 'dud', sampleWord: 'dog', options: ['d', 'b', 'p'] },
  { letter: 'c', phoneme: 'cup', sampleWord: 'cat', options: ['c', 'g', 't'] },
  { letter: 'e', phoneme: 'ehh', sampleWord: 'egg', options: ['e', 'a', 'i'] },
  { letter: 'l', phoneme: 'lll', sampleWord: 'lion', options: ['l', 'n', 'r'] },
  { letter: 'r', phoneme: 'rrr', sampleWord: 'rabbit', options: ['r', 'l', 'w'] },
  { letter: 'f', phoneme: 'ffff', sampleWord: 'fish', options: ['f', 's', 'v'] },
  { letter: 'h', phoneme: 'hut', sampleWord: 'hat', options: ['h', 'f', 'b'] },
  { letter: 'u', phoneme: 'uhh', sampleWord: 'umbrella', options: ['u', 'o', 'a'] },
];

const MEDIUM = [
  { letter: 'k', phoneme: 'cup', sampleWord: 'kite', options: ['k', 'c', 'g', 't'] },
  { letter: 'v', phoneme: 'vvv', sampleWord: 'vulture', options: ['v', 'f', 'w', 'b'] },
  { letter: 'w', phoneme: 'wut', sampleWord: 'water', options: ['w', 'v', 'y', 'r'] },
  { letter: 'y', phoneme: 'yut', sampleWord: 'yellow', options: ['y', 'j', 'w', 'i'] },
  { letter: 'j', phoneme: 'jut', sampleWord: 'jungle', options: ['j', 'g', 'y', 'z'] },
  { letter: 'z', phoneme: 'zzz', sampleWord: 'zebra', options: ['z', 's', 'x', 'j'] },
  { letter: 'x', phoneme: 'kss', sampleWord: 'box', options: ['x', 's', 'z', 'k'] },
  { letter: 'e', phoneme: 'ehh', sampleWord: 'elephant', options: ['e', 'i', 'a', 'u'] },
  { letter: 'i', phoneme: 'ihh', sampleWord: 'insect', options: ['i', 'e', 'a', 'u'] },
  { letter: 'u', phoneme: 'uhh', sampleWord: 'under', options: ['u', 'o', 'a', 'e'] },
  { letter: 'f', phoneme: 'ffff', sampleWord: 'frog', options: ['f', 'v', 's', 'h'] },
  { letter: 'r', phoneme: 'rrr', sampleWord: 'rainbow', options: ['r', 'w', 'l', 'n'] },
  { letter: 'l', phoneme: 'lll', sampleWord: 'leaf', options: ['l', 'r', 'n', 'w'] },
  { letter: 'g', phoneme: 'gut', sampleWord: 'giraffe (hard g)', options: ['g', 'k', 'c', 'j'] },
  { letter: 'n', phoneme: 'nnn', sampleWord: 'nut', options: ['n', 'm', 'r', 'l'] },
];

const HARD = [
  { letter: 'sh', phoneme: 'sh', sampleWord: 'shoe', options: ['sh', 's', 'ch', 'th'] },
  { letter: 'ch', phoneme: 'ch', sampleWord: 'cheese', options: ['ch', 'sh', 'j', 't'] },
  { letter: 'th', phoneme: 'th', sampleWord: 'three', options: ['th', 'f', 'sh', 'd'] },
  { letter: 'ng', phoneme: 'ng', sampleWord: 'ring', options: ['ng', 'n', 'g', 'nk'] },
  { letter: 'qu', phoneme: 'kwuh', sampleWord: 'queen', options: ['qu', 'kw', 'k', 'c'] },
  { letter: 'ai', phoneme: 'ay', sampleWord: 'rain', options: ['ai', 'ay', 'e', 'i'] },
  { letter: 'ee', phoneme: 'ee', sampleWord: 'tree', options: ['ee', 'e', 'i', 'ea'] },
  { letter: 'oo', phoneme: 'oo', sampleWord: 'moon', options: ['oo', 'u', 'o', 'ue'] },
  { letter: 'oa', phoneme: 'oh', sampleWord: 'boat', options: ['oa', 'o', 'ow', 'au'] },
  { letter: 'ou', phoneme: 'ow', sampleWord: 'cloud', options: ['ou', 'ow', 'o', 'au'] },
  { letter: 'ar', phoneme: 'ar', sampleWord: 'star', options: ['ar', 'a', 'or', 'er'] },
  { letter: 'or', phoneme: 'or', sampleWord: 'fork', options: ['or', 'ar', 'er', 'ur'] },
];

export const LETTER_SOUNDS_ROUNDS = {
  easy: EASY,
  medium: MEDIUM,
  hard: HARD,
};

// Also export a flat sample-word lookup so other games can ask TTS to say
// e.g. "the letter A, like apple".
export const SAMPLE_WORDS = Object.fromEntries(
  [...EASY, ...MEDIUM, ...HARD].map((r) => [r.letter, r.sampleWord]),
);

// (LETTER_IPA was removed — Edge's free Read-Aloud endpoint silently
// strips inline <phoneme alphabet="ipa"> SSML, so we keep all letter
// sounds as plain phonetic text instead.  See audio-pipeline/
// letter-sounds.json for the source-of-truth spellings.)

// Example-word chips shown beneath the phoneme so kids can tap each one
// to hear the word pronounced — reinforces the sound-in-context.  Each
// letter gets 3 kid-friendly examples with an emoji so pre-readers can
// recognise the word visually.
export const LETTER_EXAMPLES = {
  a: [
    { word: 'apple', emoji: '🍎' },
    { word: 'ant', emoji: '🐜' },
    { word: 'alligator', emoji: '🐊' },
  ],
  b: [
    { word: 'bear', emoji: '🐻' },
    { word: 'banana', emoji: '🍌' },
    { word: 'ball', emoji: '⚽' },
  ],
  c: [
    { word: 'cat', emoji: '🐈' },
    { word: 'cake', emoji: '🎂' },
    { word: 'cow', emoji: '🐄' },
  ],
  d: [
    { word: 'dog', emoji: '🐕' },
    { word: 'duck', emoji: '🦆' },
    { word: 'drum', emoji: '🥁' },
  ],
  e: [
    { word: 'egg', emoji: '🥚' },
    { word: 'elephant', emoji: '🐘' },
    { word: 'elbow', emoji: '💪' },
  ],
  f: [
    { word: 'fish', emoji: '🐟' },
    { word: 'frog', emoji: '🐸' },
    { word: 'fire', emoji: '🔥' },
  ],
  g: [
    { word: 'goat', emoji: '🐐' },
    { word: 'grape', emoji: '🍇' },
    { word: 'guitar', emoji: '🎸' },
  ],
  h: [
    { word: 'hat', emoji: '🎩' },
    { word: 'house', emoji: '🏠' },
    { word: 'hippo', emoji: '🦛' },
  ],
  i: [
    { word: 'igloo', emoji: '🏔️' },
    { word: 'insect', emoji: '🐞' },
    { word: 'ink', emoji: '🖊️' },
  ],
  j: [
    { word: 'jungle', emoji: '🌴' },
    { word: 'jam', emoji: '🫐' },
    { word: 'jump', emoji: '🤸' },
  ],
  k: [
    { word: 'kite', emoji: '🪁' },
    { word: 'king', emoji: '🤴' },
    { word: 'key', emoji: '🔑' },
  ],
  l: [
    { word: 'lion', emoji: '🦁' },
    { word: 'leaf', emoji: '🍃' },
    { word: 'lamp', emoji: '💡' },
  ],
  m: [
    { word: 'monkey', emoji: '🐒' },
    { word: 'moon', emoji: '🌙' },
    { word: 'milk', emoji: '🥛' },
  ],
  n: [
    { word: 'nest', emoji: '🪺' },
    { word: 'nut', emoji: '🥜' },
    { word: 'nose', emoji: '👃' },
  ],
  o: [
    { word: 'octopus', emoji: '🐙' },
    { word: 'orange', emoji: '🍊' },
    { word: 'ox', emoji: '🐂' },
  ],
  p: [
    { word: 'panda', emoji: '🐼' },
    { word: 'pizza', emoji: '🍕' },
    { word: 'pig', emoji: '🐷' },
  ],
  q: [
    { word: 'queen', emoji: '👸' },
    { word: 'quack', emoji: '🦆' },
    { word: 'quilt', emoji: '🛏️' },
  ],
  r: [
    { word: 'rabbit', emoji: '🐇' },
    { word: 'rainbow', emoji: '🌈' },
    { word: 'robot', emoji: '🤖' },
  ],
  s: [
    { word: 'snake', emoji: '🐍' },
    { word: 'sun', emoji: '☀️' },
    { word: 'sock', emoji: '🧦' },
  ],
  t: [
    { word: 'tiger', emoji: '🐅' },
    { word: 'tree', emoji: '🌳' },
    { word: 'turtle', emoji: '🐢' },
  ],
  u: [
    { word: 'umbrella', emoji: '☂️' },
    { word: 'up', emoji: '⬆️' },
    { word: 'uncle', emoji: '👨' },
  ],
  v: [
    { word: 'violin', emoji: '🎻' },
    { word: 'vegetable', emoji: '🥕' },
    { word: 'volcano', emoji: '🌋' },
  ],
  w: [
    { word: 'water', emoji: '💧' },
    { word: 'whale', emoji: '🐋' },
    { word: 'worm', emoji: '🪱' },
  ],
  x: [
    { word: 'box', emoji: '📦' },
    { word: 'fox', emoji: '🦊' },
    { word: 'six', emoji: '6️⃣' },
  ],
  y: [
    { word: 'yellow', emoji: '🟡' },
    { word: 'yak', emoji: '🐃' },
    { word: 'yo-yo', emoji: '🪀' },
  ],
  z: [
    { word: 'zebra', emoji: '🦓' },
    { word: 'zoo', emoji: '🦒' },
    { word: 'zipper', emoji: '🧥' },
  ],
  sh: [
    { word: 'shoe', emoji: '👟' },
    { word: 'sheep', emoji: '🐑' },
    { word: 'ship', emoji: '🚢' },
  ],
  ch: [
    { word: 'cheese', emoji: '🧀' },
    { word: 'chair', emoji: '🪑' },
    { word: 'cherry', emoji: '🍒' },
  ],
  th: [
    { word: 'three', emoji: '3️⃣' },
    { word: 'thumb', emoji: '👍' },
    { word: 'thin', emoji: '🪵' },
  ],
  ng: [
    { word: 'ring', emoji: '💍' },
    { word: 'king', emoji: '🤴' },
    { word: 'sing', emoji: '🎤' },
  ],
  qu: [
    { word: 'queen', emoji: '👸' },
    { word: 'quilt', emoji: '🛏️' },
    { word: 'quiet', emoji: '🤫' },
  ],
  ai: [
    { word: 'rain', emoji: '🌧️' },
    { word: 'train', emoji: '🚂' },
    { word: 'snail', emoji: '🐌' },
  ],
  ee: [
    { word: 'tree', emoji: '🌳' },
    { word: 'bee', emoji: '🐝' },
    { word: 'sheep', emoji: '🐑' },
  ],
  oo: [
    { word: 'moon', emoji: '🌙' },
    { word: 'spoon', emoji: '🥄' },
    { word: 'boot', emoji: '🥾' },
  ],
  oa: [
    { word: 'boat', emoji: '⛵' },
    { word: 'goat', emoji: '🐐' },
    { word: 'toast', emoji: '🍞' },
  ],
  ou: [
    { word: 'cloud', emoji: '☁️' },
    { word: 'house', emoji: '🏠' },
    { word: 'mouse', emoji: '🐭' },
  ],
  ar: [
    { word: 'star', emoji: '⭐' },
    { word: 'car', emoji: '🚗' },
    { word: 'shark', emoji: '🦈' },
  ],
  or: [
    { word: 'fork', emoji: '🍴' },
    { word: 'horn', emoji: '🎺' },
    { word: 'corn', emoji: '🌽' },
  ],
};

export function getLetterExamples(letter) {
  return LETTER_EXAMPLES[letter] ?? [];
}

// The picker is driven by shared utilities in data/session.js (which
// remembers recently-seen rounds per game, so each session feels fresh).
