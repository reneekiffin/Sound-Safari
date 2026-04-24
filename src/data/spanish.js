// Spanish (Sofia the Sloth) — a no-pressure bonus game.
//
// Two gentle round shapes, matched to the "fun, not stressful" brief:
//
//   "picture" — kid sees a Spanish word and taps the picture that matches
//               it.  Good first step: hear the word, pattern-match to
//               the emoji.
//
//   "letter"  — kid sees a Spanish letter and an English translation
//               ("A is for Árbol"), and picks the right emoji.  Covers
//               the whole Spanish alphabet at easy tier.
//
// All rounds carry `lang: 'es-ES'` so the speech layer can pick a
// Spanish voice when one is available.

const LETTER_WORDS = [
  { id: 'a-arbol', letter: 'A', spanish: 'árbol', english: 'tree', emoji: '🌳' },
  { id: 'b-bebe', letter: 'B', spanish: 'bebé', english: 'baby', emoji: '👶' },
  { id: 'c-casa', letter: 'C', spanish: 'casa', english: 'house', emoji: '🏠' },
  { id: 'd-dinosaurio', letter: 'D', spanish: 'dinosaurio', english: 'dinosaur', emoji: '🦕' },
  { id: 'e-elefante', letter: 'E', spanish: 'elefante', english: 'elephant', emoji: '🐘' },
  { id: 'f-flor', letter: 'F', spanish: 'flor', english: 'flower', emoji: '🌸' },
  { id: 'g-gato', letter: 'G', spanish: 'gato', english: 'cat', emoji: '🐈' },
  { id: 'h-helado', letter: 'H', spanish: 'helado', english: 'ice cream', emoji: '🍦' },
  { id: 'i-iglu', letter: 'I', spanish: 'iglú', english: 'igloo', emoji: '🏔️' },
  { id: 'j-jirafa', letter: 'J', spanish: 'jirafa', english: 'giraffe', emoji: '🦒' },
  { id: 'k-koala', letter: 'K', spanish: 'koala', english: 'koala', emoji: '🐨' },
  { id: 'l-leon', letter: 'L', spanish: 'león', english: 'lion', emoji: '🦁' },
  { id: 'm-mama', letter: 'M', spanish: 'mamá', english: 'mom', emoji: '👩' },
  { id: 'n-nariz', letter: 'N', spanish: 'nariz', english: 'nose', emoji: '👃' },
  { id: 'ñ-nino', letter: 'Ñ', spanish: 'niño', english: 'boy', emoji: '👦' },
  { id: 'o-oso', letter: 'O', spanish: 'oso', english: 'bear', emoji: '🐻' },
  { id: 'p-perro', letter: 'P', spanish: 'perro', english: 'dog', emoji: '🐕' },
  { id: 'q-queso', letter: 'Q', spanish: 'queso', english: 'cheese', emoji: '🧀' },
  { id: 'r-rana', letter: 'R', spanish: 'rana', english: 'frog', emoji: '🐸' },
  { id: 's-sol', letter: 'S', spanish: 'sol', english: 'sun', emoji: '☀️' },
  { id: 't-tigre', letter: 'T', spanish: 'tigre', english: 'tiger', emoji: '🐅' },
  { id: 'u-uva', letter: 'U', spanish: 'uva', english: 'grape', emoji: '🍇' },
  { id: 'v-vaca', letter: 'V', spanish: 'vaca', english: 'cow', emoji: '🐄' },
  { id: 'x-xilofono', letter: 'X', spanish: 'xilófono', english: 'xylophone', emoji: '🎵' },
  { id: 'y-yogur', letter: 'Y', spanish: 'yogur', english: 'yogurt', emoji: '🥛' },
  { id: 'z-zapato', letter: 'Z', spanish: 'zapato', english: 'shoe', emoji: '👟' },
];

// Build a distractor pool for each round by sampling other entries.
function withDistractors(entry, pool, count = 3) {
  const others = pool.filter((p) => p.id !== entry.id);
  const distractors = [];
  const used = new Set();
  while (distractors.length < count - 1 && others.length) {
    const i = Math.floor(Math.random() * others.length);
    if (!used.has(i)) {
      used.add(i);
      distractors.push(others[i]);
    }
  }
  return [entry, ...distractors].sort(() => Math.random() - 0.5);
}

// "picture" rounds — show the Spanish word, kid taps the right picture.
const PICTURE_ROUNDS = LETTER_WORDS.map((entry) => ({
  id: `pic-${entry.id}`,
  kind: 'picture',
  category: 'picture',
  lang: 'es-ES',
  spanish: entry.spanish,
  english: entry.english,
  answer: entry.spanish,
  options: withDistractors(entry, LETTER_WORDS, 3).map((e) => ({
    word: e.spanish,
    english: e.english,
    emoji: e.emoji,
  })),
}));

// "letter" rounds — show the letter + an English hint, kid taps the
// matching picture.  Great for the alphabet walkthrough.
const LETTER_ROUNDS = LETTER_WORDS.map((entry) => ({
  id: `let-${entry.id}`,
  kind: 'letter',
  category: 'letter',
  lang: 'es-ES',
  letter: entry.letter,
  spanish: entry.spanish,
  english: entry.english,
  answer: entry.spanish,
  options: withDistractors(entry, LETTER_WORDS, 4).map((e) => ({
    word: e.spanish,
    english: e.english,
    emoji: e.emoji,
  })),
}));

// Export lookups for the game component and tier metadata.  "Easy" is
// the low-pressure tier with just picture rounds; medium & hard
// progressively mix in more letter rounds and bigger option sets.
export const SPANISH_LETTERS = LETTER_WORDS;

export const SPANISH_ROUNDS = {
  easy: PICTURE_ROUNDS.slice(0, 18),
  medium: [...PICTURE_ROUNDS, ...LETTER_ROUNDS.slice(0, 10)],
  hard: [...PICTURE_ROUNDS, ...LETTER_ROUNDS],
};
