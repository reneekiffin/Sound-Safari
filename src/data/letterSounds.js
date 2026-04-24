// Letter Sounds (ages 3-5) — a single phoneme plays; kid picks the matching letter.
//
// Difficulty curve:
// - easy: 3 options, short vowel + common consonants, clear acoustic contrast
// - medium: 4 options, mixed vowels/consonants
// - hard: 4 options with near-similar sounds (b/p, m/n, f/v, s/z)
//
// `sound` is the phoneme label we say aloud (e.g. "ah" for short-a) and also
// the fallback for speech synthesis. `letter` is what appears on the card.
export const LETTER_SOUNDS_ROUNDS = {
  easy: [
    { sound: 'ah', correctLetter: 'a', options: ['a', 'o', 'u'] },
    { sound: 'mmm', correctLetter: 'm', options: ['m', 's', 't'] },
    { sound: 'sss', correctLetter: 's', options: ['s', 'f', 'm'] },
    { sound: 'tuh', correctLetter: 't', options: ['t', 'b', 'd'] },
    { sound: 'puh', correctLetter: 'p', options: ['p', 't', 'k'] },
    { sound: 'ih', correctLetter: 'i', options: ['i', 'e', 'a'] },
    { sound: 'nnn', correctLetter: 'n', options: ['n', 'm', 'r'] },
    { sound: 'oh', correctLetter: 'o', options: ['o', 'u', 'a'] },
    { sound: 'buh', correctLetter: 'b', options: ['b', 'd', 'p'] },
    { sound: 'guh', correctLetter: 'g', options: ['g', 'k', 'j'] },
  ],
  medium: [
    { sound: 'eh', correctLetter: 'e', options: ['e', 'i', 'a', 'u'] },
    { sound: 'kuh', correctLetter: 'k', options: ['k', 'c', 'g', 't'] },
    { sound: 'ffff', correctLetter: 'f', options: ['f', 'v', 's', 'h'] },
    { sound: 'ruh', correctLetter: 'r', options: ['r', 'w', 'l', 'n'] },
    { sound: 'luh', correctLetter: 'l', options: ['l', 'r', 'n', 'm'] },
    { sound: 'duh', correctLetter: 'd', options: ['d', 'b', 't', 'p'] },
    { sound: 'uh', correctLetter: 'u', options: ['u', 'o', 'a', 'e'] },
    { sound: 'juh', correctLetter: 'j', options: ['j', 'g', 'y', 'ch'] },
    { sound: 'huh', correctLetter: 'h', options: ['h', 'f', 'wh', 's'] },
    { sound: 'wuh', correctLetter: 'w', options: ['w', 'v', 'y', 'r'] },
  ],
  hard: [
    { sound: 'vvvv', correctLetter: 'v', options: ['v', 'f', 'w', 'b'] },
    { sound: 'zzzz', correctLetter: 'z', options: ['z', 's', 'sh', 'th'] },
    { sound: 'shh', correctLetter: 'sh', options: ['sh', 's', 'ch', 'th'] },
    { sound: 'ch', correctLetter: 'ch', options: ['ch', 'sh', 'j', 't'] },
    { sound: 'th', correctLetter: 'th', options: ['th', 'f', 'sh', 'd'] },
    { sound: 'yuh', correctLetter: 'y', options: ['y', 'j', 'w', 'i'] },
    { sound: 'x (ks)', correctLetter: 'x', options: ['x', 'ks', 'z', 'c'] },
    { sound: 'qu', correctLetter: 'qu', options: ['qu', 'kw', 'k', 'c'] },
    { sound: 'ng', correctLetter: 'ng', options: ['ng', 'n', 'g', 'nk'] },
    { sound: 'ai', correctLetter: 'ai', options: ['ai', 'ay', 'e', 'i'] },
  ],
};

// Human-readable phoneme scripts for speech synthesis.  Kids hear these
// as "say this sound" rather than the letter name.
export const PHONEME_SCRIPTS = {
  a: 'aaah',
  e: 'eh',
  i: 'ih',
  o: 'oh',
  u: 'uh',
  b: 'buh',
  c: 'kuh',
  d: 'duh',
  f: 'ffff',
  g: 'guh',
  h: 'huh',
  j: 'juh',
  k: 'kuh',
  l: 'lll',
  m: 'mmm',
  n: 'nnn',
  p: 'puh',
  r: 'rrr',
  s: 'sss',
  t: 'tuh',
  v: 'vvv',
  w: 'wuh',
  x: 'ks',
  y: 'yuh',
  z: 'zzz',
  sh: 'shhh',
  ch: 'ch',
  th: 'th',
  ng: 'ng',
  qu: 'kwuh',
  ai: 'ay',
};

// Pick N rounds for a session at the given difficulty.  Shuffle so kids
// don't memorise the order between sessions.
export function pickLetterSoundsSession(difficulty = 'easy', count = 10) {
  const pool = LETTER_SOUNDS_ROUNDS[difficulty] ?? LETTER_SOUNDS_ROUNDS.easy;
  return shuffle(pool).slice(0, count).map(shuffleOptions);
}

function shuffle(arr) {
  return [...arr].sort(() => Math.random() - 0.5);
}

function shuffleOptions(round) {
  return { ...round, options: shuffle(round.options) };
}
