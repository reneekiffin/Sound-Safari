// Letter Sounds (ages 3-5) — hear a phoneme, pick the matching letter.
//
// Each round carries:
//   - `letter`     the grapheme displayed on the answer cards (e.g. 'a')
//   - `display`    the on-screen phoneme label kids read in the prompt
//                  bubble (e.g. 'Aaa').  Intentionally distinct from
//                  `ttsSpeech` so we can re-tune what Edge speaks
//                  without touching what kids see.
//   - `ttsSpeech`  the string we feed to edge-tts to produce the
//                  correct sound (e.g. 'ah').  Tuned by ear against
//                  en-US-DavisNeural.
//   - `sampleWord` a kid-friendly example used in the carrier phrase
//                  ("ah... as in apple") so TTS pronounces real
//                  English instead of an isolated phoneme.
//   - `options`    the letter choices, including the correct letter
//
// The display/ttsSpeech split mirrors the source-of-truth JSON at
// audio-pipeline/letter-sounds.json — keep them in sync.
//
// Difficulty curve:
//   easy   — 3 options, short vowels + common consonants, clear contrast
//   medium — 4 options, all consonants, harder contrasts
//   hard   — 4 options, digraphs (sh/ch/th/ng/qu) + easily-confused pairs

const EASY = [
  { letter: 'a', display: 'Aaa',  ttsSpeech: 'ah',    sampleWord: 'apple',    options: ['a', 'o', 'u'] },
  { letter: 'm', display: 'Mmm',  ttsSpeech: 'mmm',   sampleWord: 'monkey',   options: ['m', 's', 't'] },
  { letter: 's', display: 'Sss',  ttsSpeech: 'hisss', sampleWord: 'snake',    options: ['s', 'f', 'm'] },
  { letter: 't', display: 'Tuh',  ttsSpeech: 'tut',   sampleWord: 'tiger',    options: ['t', 'b', 'd'] },
  { letter: 'p', display: 'Puh',  ttsSpeech: 'pup',   sampleWord: 'panda',    options: ['p', 't', 'k'] },
  { letter: 'i', display: 'Ih',   ttsSpeech: 'ih',    sampleWord: 'igloo',    options: ['i', 'e', 'a'] },
  { letter: 'n', display: 'Nnn',  ttsSpeech: 'nnn',   sampleWord: 'nest',     options: ['n', 'm', 'r'] },
  { letter: 'o', display: 'Ahh',  ttsSpeech: 'ah',    sampleWord: 'octopus',  options: ['o', 'u', 'a'] },
  { letter: 'b', display: 'Buh',  ttsSpeech: 'bub',   sampleWord: 'bear',     options: ['b', 'd', 'p'] },
  { letter: 'g', display: 'Guh',  ttsSpeech: 'gut',   sampleWord: 'goat',     options: ['g', 'k', 'j'] },
  { letter: 'd', display: 'Duh',  ttsSpeech: 'dud',   sampleWord: 'dog',      options: ['d', 'b', 'p'] },
  { letter: 'c', display: 'Cuh',  ttsSpeech: 'cup',   sampleWord: 'cat',      options: ['c', 'g', 't'] },
  { letter: 'e', display: 'Eh',   ttsSpeech: 'eh',    sampleWord: 'egg',      options: ['e', 'a', 'i'] },
  { letter: 'l', display: 'Lll',  ttsSpeech: 'elle',  sampleWord: 'lion',     options: ['l', 'n', 'r'] },
  { letter: 'r', display: 'Rrr',  ttsSpeech: 'err',   sampleWord: 'rabbit',   options: ['r', 'l', 'w'] },
  { letter: 'f', display: 'Fff',  ttsSpeech: 'fff',   sampleWord: 'fish',     options: ['f', 's', 'v'] },
  { letter: 'h', display: 'Huh',  ttsSpeech: 'hut',   sampleWord: 'hat',      options: ['h', 'f', 'b'] },
  { letter: 'u', display: 'Uh',   ttsSpeech: 'uh',    sampleWord: 'umbrella', options: ['u', 'o', 'a'] },
];

const MEDIUM = [
  { letter: 'k', display: 'Kuh',  ttsSpeech: 'cup',  sampleWord: 'kite',             options: ['k', 'c', 'g', 't'] },
  { letter: 'v', display: 'Vvv',  ttsSpeech: 'vvv',  sampleWord: 'vulture',          options: ['v', 'f', 'w', 'b'] },
  { letter: 'w', display: 'Wuh',  ttsSpeech: 'wut',  sampleWord: 'water',            options: ['w', 'v', 'y', 'r'] },
  { letter: 'y', display: 'Yuh',  ttsSpeech: 'yut',  sampleWord: 'yellow',           options: ['y', 'j', 'w', 'i'] },
  { letter: 'j', display: 'Juh',  ttsSpeech: 'jut',  sampleWord: 'jungle',           options: ['j', 'g', 'y', 'z'] },
  { letter: 'z', display: 'Zzz',  ttsSpeech: 'zzz',  sampleWord: 'zebra',            options: ['z', 's', 'x', 'j'] },
  { letter: 'x', display: 'Ks',   ttsSpeech: 'ex',   sampleWord: 'box',              options: ['x', 's', 'z', 'k'] },
  { letter: 'e', display: 'Eh',   ttsSpeech: 'eh',   sampleWord: 'elephant',         options: ['e', 'i', 'a', 'u'] },
  { letter: 'i', display: 'Ih',   ttsSpeech: 'ih',   sampleWord: 'insect',           options: ['i', 'e', 'a', 'u'] },
  { letter: 'u', display: 'Uh',   ttsSpeech: 'uh',   sampleWord: 'under',            options: ['u', 'o', 'a', 'e'] },
  { letter: 'f', display: 'Fff',  ttsSpeech: 'fff',  sampleWord: 'frog',             options: ['f', 'v', 's', 'h'] },
  { letter: 'r', display: 'Rrr',  ttsSpeech: 'err',  sampleWord: 'rainbow',          options: ['r', 'w', 'l', 'n'] },
  { letter: 'l', display: 'Lll',  ttsSpeech: 'elle', sampleWord: 'leaf',             options: ['l', 'r', 'n', 'w'] },
  { letter: 'g', display: 'Guh',  ttsSpeech: 'gut',  sampleWord: 'giraffe (hard g)', options: ['g', 'k', 'c', 'j'] },
  { letter: 'n', display: 'Nnn',  ttsSpeech: 'nnn',  sampleWord: 'nut',              options: ['n', 'm', 'r', 'l'] },
];

const HARD = [
  { letter: 'sh', display: 'Sh',   ttsSpeech: 'sh',   sampleWord: 'shoe',   options: ['sh', 's', 'ch', 'th'] },
  { letter: 'ch', display: 'Ch',   ttsSpeech: 'ch',   sampleWord: 'cheese', options: ['ch', 'sh', 'j', 't'] },
  { letter: 'th', display: 'Th',   ttsSpeech: 'th',   sampleWord: 'three',  options: ['th', 'f', 'sh', 'd'] },
  { letter: 'ng', display: 'Ng',   ttsSpeech: 'ng',   sampleWord: 'ring',   options: ['ng', 'n', 'g', 'nk'] },
  { letter: 'qu', display: 'Kwuh', ttsSpeech: 'kwut', sampleWord: 'queen',  options: ['qu', 'kw', 'k', 'c'] },
  { letter: 'ai', display: 'Ay',   ttsSpeech: 'ay',   sampleWord: 'rain',   options: ['ai', 'ay', 'e', 'i'] },
  { letter: 'ee', display: 'Ee',   ttsSpeech: 'ee',   sampleWord: 'tree',   options: ['ee', 'e', 'i', 'ea'] },
  { letter: 'oo', display: 'Oo',   ttsSpeech: 'oo',   sampleWord: 'moon',   options: ['oo', 'u', 'o', 'ue'] },
  { letter: 'oa', display: 'Oh',   ttsSpeech: 'oh',   sampleWord: 'boat',   options: ['oa', 'o', 'ow', 'au'] },
  { letter: 'ou', display: 'Ow',   ttsSpeech: 'ow',   sampleWord: 'cloud',  options: ['ou', 'ow', 'o', 'au'] },
  { letter: 'ar', display: 'Ar',   ttsSpeech: 'ar',   sampleWord: 'star',   options: ['ar', 'a', 'or', 'er'] },
  { letter: 'or', display: 'Or',   ttsSpeech: 'or',   sampleWord: 'fork',   options: ['or', 'ar', 'er', 'ur'] },
];

export const LETTER_SOUNDS_ROUNDS = {
  easy: EASY,
  medium: MEDIUM,
  hard: HARD,
};

// Cross-letter lookups for letter-card hover previews so we can speak
// any letter's tts_speech regardless of which round we're on.
const _ALL = [...EASY, ...MEDIUM, ...HARD];
export const SAMPLE_WORDS = Object.fromEntries(_ALL.map((r) => [r.letter, r.sampleWord]));
export const TTS_SPEECH = Object.fromEntries(_ALL.map((r) => [r.letter, r.ttsSpeech]));

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
