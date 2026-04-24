// Word Builders (Penny the Panda) — ages 3-6 phonics.
//
// Kid sees a picture and a word with one letter-pair (or letter) missing,
// then picks the right pair to complete the word.  Teaches digraphs
// (sh/ch/th/ck), blends (bl/gr/sp), and simple vowel pairs (ee/oo/ai).
//
// Round shape:
//   {
//     id,         stable key for session picker
//     category,   'digraph-start' | 'digraph-end' | 'blend' | 'vowel-pair' | 'cvc'
//     before,     text before the blank (shown as-is)
//     after,      text after the blank
//     answer,     the correct pair
//     options,    choices including the answer
//     word,       the completed word (for audio + the completion flash)
//     emoji,      picture on the card
//   }
//
// Easy tier = simple CVC + initial digraphs; medium = final digraphs +
// common blends; hard = vowel pairs / longer words.

const EASY_INITIAL_DIGRAPHS = [
  { id: 'ship', category: 'digraph-start', before: '', after: 'ip', answer: 'sh', options: ['sh', 'ch', 'th'], word: 'ship', emoji: '🚢' },
  { id: 'sheep', category: 'digraph-start', before: '', after: 'eep', answer: 'sh', options: ['sh', 'ch', 'th'], word: 'sheep', emoji: '🐑' },
  { id: 'cheese', category: 'digraph-start', before: '', after: 'eese', answer: 'ch', options: ['ch', 'sh', 'th'], word: 'cheese', emoji: '🧀' },
  { id: 'chair', category: 'digraph-start', before: '', after: 'air', answer: 'ch', options: ['ch', 'sh', 'cl'], word: 'chair', emoji: '🪑' },
  { id: 'three', category: 'digraph-start', before: '', after: 'ree', answer: 'th', options: ['th', 'tr', 'sh'], word: 'three', emoji: '3️⃣' },
  { id: 'shoe', category: 'digraph-start', before: '', after: 'oe', answer: 'sh', options: ['sh', 'sn', 'ch'], word: 'shoe', emoji: '👟' },
];

const EASY_CVC = [
  // Classic "pick the vowel" CVC rounds — brilliant for 3-4 year olds.
  { id: 'cat', category: 'cvc', before: 'c', after: 't', answer: 'a', options: ['a', 'i', 'o'], word: 'cat', emoji: '🐈' },
  { id: 'dog', category: 'cvc', before: 'd', after: 'g', answer: 'o', options: ['o', 'a', 'u'], word: 'dog', emoji: '🐕' },
  { id: 'sun', category: 'cvc', before: 's', after: 'n', answer: 'u', options: ['u', 'a', 'i'], word: 'sun', emoji: '☀️' },
  { id: 'pig', category: 'cvc', before: 'p', after: 'g', answer: 'i', options: ['i', 'a', 'o'], word: 'pig', emoji: '🐖' },
  { id: 'bed', category: 'cvc', before: 'b', after: 'd', answer: 'e', options: ['e', 'a', 'i'], word: 'bed', emoji: '🛏️' },
  { id: 'bat', category: 'cvc', before: 'b', after: 't', answer: 'a', options: ['a', 'e', 'u'], word: 'bat', emoji: '🦇' },
  { id: 'hat', category: 'cvc', before: 'h', after: 't', answer: 'a', options: ['a', 'i', 'u'], word: 'hat', emoji: '🎩' },
  { id: 'fox', category: 'cvc', before: 'f', after: 'x', answer: 'o', options: ['o', 'a', 'i'], word: 'fox', emoji: '🦊' },
  { id: 'bus', category: 'cvc', before: 'b', after: 's', answer: 'u', options: ['u', 'o', 'a'], word: 'bus', emoji: '🚌' },
  { id: 'cup', category: 'cvc', before: 'c', after: 'p', answer: 'u', options: ['u', 'a', 'o'], word: 'cup', emoji: '🥤' },
];

const MEDIUM_FINAL_DIGRAPHS = [
  { id: 'duck', category: 'digraph-end', before: 'du', after: '', answer: 'ck', options: ['ck', 'sh', 'th'], word: 'duck', emoji: '🦆' },
  { id: 'sock', category: 'digraph-end', before: 'so', after: '', answer: 'ck', options: ['ck', 'sh', 'st'], word: 'sock', emoji: '🧦' },
  { id: 'ring', category: 'digraph-end', before: 'ri', after: '', answer: 'ng', options: ['ng', 'nk', 'mp'], word: 'ring', emoji: '💍' },
  { id: 'king', category: 'digraph-end', before: 'ki', after: '', answer: 'ng', options: ['ng', 'nk', 'gh'], word: 'king', emoji: '🤴' },
  { id: 'fish', category: 'digraph-end', before: 'fi', after: '', answer: 'sh', options: ['sh', 'ch', 'th'], word: 'fish', emoji: '🐟' },
  { id: 'bath', category: 'digraph-end', before: 'ba', after: '', answer: 'th', options: ['th', 'sh', 'ch'], word: 'bath', emoji: '🛁' },
];

const MEDIUM_BLENDS = [
  { id: 'frog', category: 'blend', before: '', after: 'og', answer: 'fr', options: ['fr', 'cr', 'tr'], word: 'frog', emoji: '🐸' },
  { id: 'grape', category: 'blend', before: '', after: 'ape', answer: 'gr', options: ['gr', 'tr', 'cr'], word: 'grape', emoji: '🍇' },
  { id: 'crab', category: 'blend', before: '', after: 'ab', answer: 'cr', options: ['cr', 'gr', 'dr'], word: 'crab', emoji: '🦀' },
  { id: 'tree', category: 'blend', before: '', after: 'ee', answer: 'tr', options: ['tr', 'fr', 'th'], word: 'tree', emoji: '🌳' },
  { id: 'star', category: 'blend', before: '', after: 'ar', answer: 'st', options: ['st', 'sp', 'sn'], word: 'star', emoji: '⭐' },
  { id: 'snail', category: 'blend', before: '', after: 'ail', answer: 'sn', options: ['sn', 'sl', 'st'], word: 'snail', emoji: '🐌' },
  { id: 'flag', category: 'blend', before: '', after: 'ag', answer: 'fl', options: ['fl', 'gl', 'pl'], word: 'flag', emoji: '🚩' },
  { id: 'plum', category: 'blend', before: '', after: 'um', answer: 'pl', options: ['pl', 'cl', 'fl'], word: 'plum', emoji: '🫐' },
];

const HARD_VOWEL_PAIRS = [
  { id: 'rain', category: 'vowel-pair', before: 'r', after: 'n', answer: 'ai', options: ['ai', 'ay', 'ei'], word: 'rain', emoji: '🌧️' },
  { id: 'boat', category: 'vowel-pair', before: 'b', after: 't', answer: 'oa', options: ['oa', 'ow', 'oe'], word: 'boat', emoji: '⛵' },
  { id: 'tree', category: 'vowel-pair', before: 'tr', after: '', answer: 'ee', options: ['ee', 'ea', 'ie'], word: 'tree', emoji: '🌳' },
  { id: 'moon', category: 'vowel-pair', before: 'm', after: 'n', answer: 'oo', options: ['oo', 'ou', 'ow'], word: 'moon', emoji: '🌙' },
  { id: 'cloud', category: 'vowel-pair', before: 'cl', after: 'd', answer: 'ou', options: ['ou', 'ow', 'oo'], word: 'cloud', emoji: '☁️' },
  { id: 'cake', category: 'vowel-pair', before: 'c', after: 'ke', answer: 'a', options: ['a', 'ai', 'ay'], word: 'cake', emoji: '🎂' },
  { id: 'seed', category: 'vowel-pair', before: 's', after: 'd', answer: 'ee', options: ['ee', 'ea', 'ei'], word: 'seed', emoji: '🌱' },
  { id: 'book', category: 'vowel-pair', before: 'b', after: 'k', answer: 'oo', options: ['oo', 'ou', 'u'], word: 'book', emoji: '📚' },
];

export const WORD_BUILDERS_ROUNDS = {
  easy: [...EASY_CVC, ...EASY_INITIAL_DIGRAPHS.slice(0, 4)],
  medium: [...MEDIUM_FINAL_DIGRAPHS, ...MEDIUM_BLENDS, ...EASY_INITIAL_DIGRAPHS.slice(4)],
  hard: [...HARD_VOWEL_PAIRS, ...MEDIUM_BLENDS],
};
