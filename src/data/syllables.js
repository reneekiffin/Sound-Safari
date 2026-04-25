// Syllables (ages 5-8, hosted by Ellie the Elephant).
//
// Two complementary round shapes:
//
// 1. "count" — kid hears a word, sees its picture, picks how many syllables
//    are in it by tapping a number (1-4).  Teaches syllable awareness.
//
// 2. "build" — kid sees syllable chunks in random order and must tap them
//    in the right sequence to rebuild the word.  Teaches segmentation +
//    blending at the syllable level, which is the natural next step after
//    phoneme blending.
//
// We mix both shapes in every session so the game stays varied.  The
// session picker draws from the combined pool.

const EASY = [
  { id: 'cat', type: 'count', word: 'cat', emoji: '🐈', syllables: ['cat'], count: 1 },
  { id: 'dog', type: 'count', word: 'dog', emoji: '🐕', syllables: ['dog'], count: 1 },
  { id: 'apple', type: 'count', word: 'apple', emoji: '🍎', syllables: ['ap', 'ple'], count: 2 },
  { id: 'monkey', type: 'count', word: 'monkey', emoji: '🐒', syllables: ['mon', 'key'], count: 2 },
  { id: 'tiger', type: 'count', word: 'tiger', emoji: '🐅', syllables: ['ti', 'ger'], count: 2 },
  { id: 'banana', type: 'count', word: 'banana', emoji: '🍌', syllables: ['ba', 'na', 'na'], count: 3 },
  { id: 'elephant', type: 'count', word: 'elephant', emoji: '🐘', syllables: ['el', 'e', 'phant'], count: 3 },
  { id: 'sun', type: 'count', word: 'sun', emoji: '☀️', syllables: ['sun'], count: 1 },
  { id: 'rainbow', type: 'count', word: 'rainbow', emoji: '🌈', syllables: ['rain', 'bow'], count: 2 },
  { id: 'butterfly', type: 'count', word: 'butterfly', emoji: '🦋', syllables: ['but', 'ter', 'fly'], count: 3 },
  { id: 'dinosaur', type: 'count', word: 'dinosaur', emoji: '🦕', syllables: ['di', 'no', 'saur'], count: 3 },
  { id: 'pizza', type: 'count', word: 'pizza', emoji: '🍕', syllables: ['piz', 'za'], count: 2 },
  { id: 'flower', type: 'count', word: 'flower', emoji: '🌸', syllables: ['flow', 'er'], count: 2 },
  { id: 'cookie', type: 'count', word: 'cookie', emoji: '🍪', syllables: ['cook', 'ie'], count: 2 },
  { id: 'giraffe', type: 'count', word: 'giraffe', emoji: '🦒', syllables: ['gi', 'raffe'], count: 2 },

  { id: 'build-rabbit', type: 'build', word: 'rabbit', emoji: '🐇', syllables: ['rab', 'bit'] },
  { id: 'build-pencil', type: 'build', word: 'pencil', emoji: '✏️', syllables: ['pen', 'cil'] },
  { id: 'build-basket', type: 'build', word: 'basket', emoji: '🧺', syllables: ['bas', 'ket'] },

  // 1-syllable add-ons (clap-once words for the youngest kids).
  { id: 'bee', type: 'count', word: 'bee', emoji: '🐝', syllables: ['bee'], count: 1 },
  { id: 'frog', type: 'count', word: 'frog', emoji: '🐸', syllables: ['frog'], count: 1 },
  { id: 'fish', type: 'count', word: 'fish', emoji: '🐟', syllables: ['fish'], count: 1 },
  { id: 'star', type: 'count', word: 'star', emoji: '⭐', syllables: ['star'], count: 1 },
  { id: 'moon', type: 'count', word: 'moon', emoji: '🌙', syllables: ['moon'], count: 1 },
  { id: 'tree', type: 'count', word: 'tree', emoji: '🌳', syllables: ['tree'], count: 1 },
  { id: 'cup', type: 'count', word: 'cup', emoji: '🥤', syllables: ['cup'], count: 1 },
  { id: 'book', type: 'count', word: 'book', emoji: '📚', syllables: ['book'], count: 1 },
  { id: 'ball', type: 'count', word: 'ball', emoji: '⚽', syllables: ['ball'], count: 1 },
  { id: 'snake', type: 'count', word: 'snake', emoji: '🐍', syllables: ['snake'], count: 1 },

  // 2-syllable extras
  { id: 'baby', type: 'count', word: 'baby', emoji: '👶', syllables: ['ba', 'by'], count: 2 },
  { id: 'turtle', type: 'count', word: 'turtle', emoji: '🐢', syllables: ['tur', 'tle'], count: 2 },
  { id: 'lion', type: 'count', word: 'lion', emoji: '🦁', syllables: ['li', 'on'], count: 2 },
  { id: 'puppy', type: 'count', word: 'puppy', emoji: '🐶', syllables: ['pup', 'py'], count: 2 },
  { id: 'kitten', type: 'count', word: 'kitten', emoji: '🐱', syllables: ['kit', 'ten'], count: 2 },
  { id: 'panda', type: 'count', word: 'panda', emoji: '🐼', syllables: ['pan', 'da'], count: 2 },
  { id: 'tiger', type: 'count', word: 'tiger', emoji: '🐅', syllables: ['ti', 'ger'], count: 2 },
  { id: 'donut', type: 'count', word: 'donut', emoji: '🍩', syllables: ['do', 'nut'], count: 2 },
  { id: 'lemon', type: 'count', word: 'lemon', emoji: '🍋', syllables: ['le', 'mon'], count: 2 },
  { id: 'rocket', type: 'count', word: 'rocket', emoji: '🚀', syllables: ['rock', 'et'], count: 2 },
  { id: 'robot', type: 'count', word: 'robot', emoji: '🤖', syllables: ['ro', 'bot'], count: 2 },
  { id: 'doctor', type: 'count', word: 'doctor', emoji: '🩺', syllables: ['doc', 'tor'], count: 2 },
];

const MEDIUM = [
  { id: 'octopus', type: 'count', word: 'octopus', emoji: '🐙', syllables: ['oc', 'to', 'pus'], count: 3 },
  { id: 'kangaroo', type: 'count', word: 'kangaroo', emoji: '🦘', syllables: ['kan', 'ga', 'roo'], count: 3 },
  { id: 'crocodile', type: 'count', word: 'crocodile', emoji: '🐊', syllables: ['croc', 'o', 'dile'], count: 3 },
  { id: 'umbrella', type: 'count', word: 'umbrella', emoji: '☂️', syllables: ['um', 'brel', 'la'], count: 3 },
  { id: 'caterpillar', type: 'count', word: 'caterpillar', emoji: '🐛', syllables: ['cat', 'er', 'pil', 'lar'], count: 4 },
  { id: 'watermelon', type: 'count', word: 'watermelon', emoji: '🍉', syllables: ['wa', 'ter', 'mel', 'on'], count: 4 },
  { id: 'helicopter', type: 'count', word: 'helicopter', emoji: '🚁', syllables: ['hel', 'i', 'cop', 'ter'], count: 4 },
  { id: 'alligator', type: 'count', word: 'alligator', emoji: '🐊', syllables: ['al', 'li', 'ga', 'tor'], count: 4 },

  { id: 'build-spider', type: 'build', word: 'spider', emoji: '🕷️', syllables: ['spi', 'der'] },
  { id: 'build-pirate', type: 'build', word: 'pirate', emoji: '🏴‍☠️', syllables: ['pi', 'rate'] },
  { id: 'build-hamburger', type: 'build', word: 'hamburger', emoji: '🍔', syllables: ['ham', 'bur', 'ger'] },
  { id: 'build-computer', type: 'build', word: 'computer', emoji: '💻', syllables: ['com', 'pu', 'ter'] },
  { id: 'build-astronaut', type: 'build', word: 'astronaut', emoji: '👨‍🚀', syllables: ['as', 'tro', 'naut'] },
  { id: 'build-volcano', type: 'build', word: 'volcano', emoji: '🌋', syllables: ['vol', 'ca', 'no'] },

  // A couple of gentle "break" intro rounds for medium difficulty.
  { id: 'break-rabbit', type: 'break', word: 'rabbit', emoji: '🐇', syllables: ['rab', 'bit'], breaks: [3] },
  { id: 'break-tiger', type: 'break', word: 'tiger', emoji: '🐅', syllables: ['ti', 'ger'], breaks: [2] },
  { id: 'break-apple', type: 'break', word: 'apple', emoji: '🍎', syllables: ['ap', 'ple'], breaks: [2] },
];

const HARD = [
  { id: 'hippopotamus', type: 'count', word: 'hippopotamus', emoji: '🦛', syllables: ['hip', 'po', 'pot', 'a', 'mus'], count: 5 },
  { id: 'rhinoceros', type: 'count', word: 'rhinoceros', emoji: '🦏', syllables: ['rhi', 'no', 'ce', 'ros'], count: 4 },
  { id: 'invisible', type: 'count', word: 'invisible', emoji: '👻', syllables: ['in', 'vis', 'i', 'ble'], count: 4 },

  { id: 'build-kangaroo', type: 'build', word: 'kangaroo', emoji: '🦘', syllables: ['kan', 'ga', 'roo'] },
  { id: 'build-caterpillar', type: 'build', word: 'caterpillar', emoji: '🐛', syllables: ['cat', 'er', 'pil', 'lar'] },
  { id: 'build-hippopotamus', type: 'build', word: 'hippopotamus', emoji: '🦛', syllables: ['hip', 'po', 'pot', 'a', 'mus'] },
  { id: 'build-dinosaur', type: 'build', word: 'dinosaur', emoji: '🦕', syllables: ['di', 'no', 'saur'] },

  // "break" mode — kid taps the spaces between letters to insert
  // syllable breaks.  Richer than picking a number; tests that they
  // actually know where the beats fall.  `breaks` are the letter
  // indices AFTER which a break should appear (zero-indexed).
  //   e.g. "butterfly" → [3, 6] gives "but|ter|fly"
  { id: 'break-butterfly', type: 'break', word: 'butterfly', emoji: '🦋', syllables: ['but', 'ter', 'fly'], breaks: [3, 6] },
  { id: 'break-monkey', type: 'break', word: 'monkey', emoji: '🐒', syllables: ['mon', 'key'], breaks: [3] },
  { id: 'break-elephant', type: 'break', word: 'elephant', emoji: '🐘', syllables: ['el', 'e', 'phant'], breaks: [2, 3] },
  { id: 'break-dinosaur', type: 'break', word: 'dinosaur', emoji: '🦕', syllables: ['di', 'no', 'saur'], breaks: [2, 4] },
  { id: 'break-rainbow', type: 'break', word: 'rainbow', emoji: '🌈', syllables: ['rain', 'bow'], breaks: [4] },
  { id: 'break-umbrella', type: 'break', word: 'umbrella', emoji: '☂️', syllables: ['um', 'brel', 'la'], breaks: [2, 6] },
  { id: 'break-computer', type: 'break', word: 'computer', emoji: '💻', syllables: ['com', 'pu', 'ter'], breaks: [3, 5] },
  { id: 'break-watermelon', type: 'break', word: 'watermelon', emoji: '🍉', syllables: ['wa', 'ter', 'mel', 'on'], breaks: [2, 5, 8] },
  { id: 'break-alligator', type: 'break', word: 'alligator', emoji: '🐊', syllables: ['al', 'li', 'ga', 'tor'], breaks: [2, 4, 6] },
  { id: 'break-volcano', type: 'break', word: 'volcano', emoji: '🌋', syllables: ['vol', 'ca', 'no'], breaks: [3, 5] },
];

export const SYLLABLES_ROUNDS = { easy: EASY, medium: MEDIUM, hard: HARD };
