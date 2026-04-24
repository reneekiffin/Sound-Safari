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
  { letter: 'a', phoneme: 'aaa', sampleWord: 'apple', options: ['a', 'o', 'u'] },
  { letter: 'm', phoneme: 'mmm', sampleWord: 'monkey', options: ['m', 's', 't'] },
  { letter: 's', phoneme: 'sss', sampleWord: 'snake', options: ['s', 'f', 'm'] },
  { letter: 't', phoneme: 'tuh', sampleWord: 'tiger', options: ['t', 'b', 'd'] },
  { letter: 'p', phoneme: 'puh', sampleWord: 'panda', options: ['p', 't', 'k'] },
  { letter: 'i', phoneme: 'ih', sampleWord: 'igloo', options: ['i', 'e', 'a'] },
  { letter: 'n', phoneme: 'nnn', sampleWord: 'nest', options: ['n', 'm', 'r'] },
  { letter: 'o', phoneme: 'oh', sampleWord: 'octopus', options: ['o', 'u', 'a'] },
  { letter: 'b', phoneme: 'buh', sampleWord: 'bear', options: ['b', 'd', 'p'] },
  { letter: 'g', phoneme: 'guh', sampleWord: 'goat', options: ['g', 'k', 'j'] },
  { letter: 'd', phoneme: 'duh', sampleWord: 'dog', options: ['d', 'b', 'p'] },
  { letter: 'c', phoneme: 'kuh', sampleWord: 'cat', options: ['c', 'g', 't'] },
  { letter: 'e', phoneme: 'eh', sampleWord: 'egg', options: ['e', 'a', 'i'] },
  { letter: 'l', phoneme: 'lll', sampleWord: 'lion', options: ['l', 'n', 'r'] },
  { letter: 'r', phoneme: 'rrr', sampleWord: 'rabbit', options: ['r', 'l', 'w'] },
  { letter: 'f', phoneme: 'ffff', sampleWord: 'fish', options: ['f', 's', 'v'] },
  { letter: 'h', phoneme: 'huh', sampleWord: 'hat', options: ['h', 'f', 'b'] },
  { letter: 'u', phoneme: 'uh', sampleWord: 'umbrella', options: ['u', 'o', 'a'] },
];

const MEDIUM = [
  { letter: 'k', phoneme: 'kuh', sampleWord: 'kite', options: ['k', 'c', 'g', 't'] },
  { letter: 'v', phoneme: 'vvv', sampleWord: 'vulture', options: ['v', 'f', 'w', 'b'] },
  { letter: 'w', phoneme: 'wuh', sampleWord: 'water', options: ['w', 'v', 'y', 'r'] },
  { letter: 'y', phoneme: 'yuh', sampleWord: 'yellow', options: ['y', 'j', 'w', 'i'] },
  { letter: 'j', phoneme: 'juh', sampleWord: 'jungle', options: ['j', 'g', 'y', 'z'] },
  { letter: 'z', phoneme: 'zzz', sampleWord: 'zebra', options: ['z', 's', 'x', 'j'] },
  { letter: 'x', phoneme: 'ks', sampleWord: 'box', options: ['x', 's', 'z', 'k'] },
  { letter: 'e', phoneme: 'eh', sampleWord: 'elephant', options: ['e', 'i', 'a', 'u'] },
  { letter: 'i', phoneme: 'ih', sampleWord: 'insect', options: ['i', 'e', 'a', 'u'] },
  { letter: 'u', phoneme: 'uh', sampleWord: 'under', options: ['u', 'o', 'a', 'e'] },
  { letter: 'f', phoneme: 'ffff', sampleWord: 'frog', options: ['f', 'v', 's', 'h'] },
  { letter: 'r', phoneme: 'rrr', sampleWord: 'rainbow', options: ['r', 'w', 'l', 'n'] },
  { letter: 'l', phoneme: 'lll', sampleWord: 'leaf', options: ['l', 'r', 'n', 'w'] },
  { letter: 'g', phoneme: 'guh', sampleWord: 'giraffe (hard g)', options: ['g', 'k', 'c', 'j'] },
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

// The picker is driven by shared utilities in data/session.js (which
// remembers recently-seen rounds per game, so each session feels fresh).
