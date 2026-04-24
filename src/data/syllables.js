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
];

const HARD = [
  { id: 'hippopotamus', type: 'count', word: 'hippopotamus', emoji: '🦛', syllables: ['hip', 'po', 'pot', 'a', 'mus'], count: 5 },
  { id: 'caterpillar2', type: 'count', word: 'rhinoceros', emoji: '🦏', syllables: ['rhi', 'no', 'ce', 'ros'], count: 4 },
  { id: 'invisible', type: 'count', word: 'invisible', emoji: '👻', syllables: ['in', 'vis', 'i', 'ble'], count: 4 },

  { id: 'build-kangaroo', type: 'build', word: 'kangaroo', emoji: '🦘', syllables: ['kan', 'ga', 'roo'] },
  { id: 'build-caterpillar', type: 'build', word: 'caterpillar', emoji: '🐛', syllables: ['cat', 'er', 'pil', 'lar'] },
  { id: 'build-hippopotamus', type: 'build', word: 'hippopotamus', emoji: '🦛', syllables: ['hip', 'po', 'pot', 'a', 'mus'] },
  { id: 'build-dinosaur', type: 'build', word: 'dinosaur', emoji: '🦕', syllables: ['di', 'no', 'saur'] },
];

export const SYLLABLES_ROUNDS = { easy: EASY, medium: MEDIUM, hard: HARD };
