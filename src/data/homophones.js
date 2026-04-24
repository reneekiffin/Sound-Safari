// Homophones (Skippy the Squirrel) — ages 6-10.
//
// Two round shapes:
//
// 1. "picture"  — kid hears the word once and picks the right picture
//                 from two or three homophone options.
//                   prompt: { word, emoji }  — the word to hear
//                   answer: which option's word matches
//                   options: all the homophones with pictures
//
// 2. "sentence" — kid reads a short sentence with a homophone blank and
//                 picks the correct spelling.
//                   before / after / answer / options
//
// The category tag lets the session picker mix shapes within a session.

const PICTURE_PAIRS = [
  {
    id: 'bear-bare',
    kind: 'picture',
    category: 'picture',
    prompt: { word: 'bear' },
    answer: 'bear',
    options: [
      { word: 'bear', emoji: '🐻' },
      { word: 'bare', emoji: '👣' },
    ],
  },
  {
    id: 'deer-dear',
    kind: 'picture',
    category: 'picture',
    prompt: { word: 'deer' },
    answer: 'deer',
    options: [
      { word: 'deer', emoji: '🦌' },
      { word: 'dear', emoji: '💌' },
    ],
  },
  {
    id: 'dear-deer-reverse',
    kind: 'picture',
    category: 'picture',
    prompt: { word: 'dear' },
    answer: 'dear',
    options: [
      { word: 'deer', emoji: '🦌' },
      { word: 'dear', emoji: '💌' },
    ],
  },
  {
    id: 'sun-son',
    kind: 'picture',
    category: 'picture',
    prompt: { word: 'sun' },
    answer: 'sun',
    options: [
      { word: 'sun', emoji: '☀️' },
      { word: 'son', emoji: '👦' },
    ],
  },
  {
    id: 'sea-see',
    kind: 'picture',
    category: 'picture',
    prompt: { word: 'sea' },
    answer: 'sea',
    options: [
      { word: 'sea', emoji: '🌊' },
      { word: 'see', emoji: '👀' },
    ],
  },
  {
    id: 'pair-pear',
    kind: 'picture',
    category: 'picture',
    prompt: { word: 'pear' },
    answer: 'pear',
    options: [
      { word: 'pear', emoji: '🍐' },
      { word: 'pair', emoji: '🧦' },
    ],
  },
  {
    id: 'flower-flour',
    kind: 'picture',
    category: 'picture',
    prompt: { word: 'flower' },
    answer: 'flower',
    options: [
      { word: 'flower', emoji: '🌸' },
      { word: 'flour', emoji: '🌾' },
    ],
  },
  {
    id: 'hare-hair',
    kind: 'picture',
    category: 'picture',
    prompt: { word: 'hare' },
    answer: 'hare',
    options: [
      { word: 'hare', emoji: '🐇' },
      { word: 'hair', emoji: '💇' },
    ],
  },
  {
    id: 'knight-night',
    kind: 'picture',
    category: 'picture',
    prompt: { word: 'knight' },
    answer: 'knight',
    options: [
      { word: 'knight', emoji: '🛡️' },
      { word: 'night', emoji: '🌃' },
    ],
  },
  {
    id: 'eye-i',
    kind: 'picture',
    category: 'picture',
    prompt: { word: 'eye' },
    answer: 'eye',
    options: [
      { word: 'eye', emoji: '👁️' },
      { word: 'I', emoji: '🧍' },
    ],
  },
  {
    id: 'bee-be',
    kind: 'picture',
    category: 'picture',
    prompt: { word: 'bee' },
    answer: 'bee',
    options: [
      { word: 'bee', emoji: '🐝' },
      { word: 'be', emoji: '✨' },
    ],
  },
  {
    id: 'mail-male',
    kind: 'picture',
    category: 'picture',
    prompt: { word: 'mail' },
    answer: 'mail',
    options: [
      { word: 'mail', emoji: '📬' },
      { word: 'male', emoji: '🧔' },
    ],
  },
  {
    id: 'tail-tale',
    kind: 'picture',
    category: 'picture',
    prompt: { word: 'tale' },
    answer: 'tale',
    options: [
      { word: 'tale', emoji: '📖' },
      { word: 'tail', emoji: '🐕' },
    ],
  },
];

const SENTENCE_BLANKS = [
  { id: 'sen-bear-honey', kind: 'sentence', category: 'sentence', before: 'The ', after: ' ate honey.', answer: 'bear', options: ['bear', 'bare'] },
  { id: 'sen-bare-feet', kind: 'sentence', category: 'sentence', before: 'I love walking with ', after: ' feet.', answer: 'bare', options: ['bare', 'bear'] },
  { id: 'sen-deer-forest', kind: 'sentence', category: 'sentence', before: 'We saw a ', after: ' in the forest.', answer: 'deer', options: ['deer', 'dear'] },
  { id: 'sen-dear-grandma', kind: 'sentence', category: 'sentence', before: 'A letter starts with ', after: ' Grandma.', answer: 'Dear', options: ['Dear', 'Deer'] },
  { id: 'sen-sun-shines', kind: 'sentence', category: 'sentence', before: 'The ', after: ' shines brightly.', answer: 'sun', options: ['sun', 'son'] },
  { id: 'sen-son-grows', kind: 'sentence', category: 'sentence', before: 'Her ', after: ' is growing up.', answer: 'son', options: ['son', 'sun'] },
  { id: 'sen-sea-shells', kind: 'sentence', category: 'sentence', before: 'We found shells by the ', after: '.', answer: 'sea', options: ['sea', 'see'] },
  { id: 'sen-see-stars', kind: 'sentence', category: 'sentence', before: 'Can you ', after: ' the stars tonight?', answer: 'see', options: ['see', 'sea'] },
  { id: 'sen-two-cats', kind: 'sentence', category: 'sentence', before: 'I have ', after: ' cats.', answer: 'two', options: ['two', 'to', 'too'] },
  { id: 'sen-too-cold', kind: 'sentence', category: 'sentence', before: 'It is ', after: ' cold outside.', answer: 'too', options: ['too', 'to', 'two'] },
  { id: 'sen-their-toys', kind: 'sentence', category: 'sentence', before: 'The kids played with ', after: ' toys.', answer: 'their', options: ['their', 'there', "they're"] },
  { id: 'sen-there-is', kind: 'sentence', category: 'sentence', before: '', after: ' is a cat on the roof.', answer: 'There', options: ['There', 'Their', "They're"] },
  { id: 'sen-write-name', kind: 'sentence', category: 'sentence', before: 'Please ', after: ' your name.', answer: 'write', options: ['write', 'right'] },
  { id: 'sen-right-answer', kind: 'sentence', category: 'sentence', before: 'That is the ', after: ' answer.', answer: 'right', options: ['right', 'write'] },
  { id: 'sen-flower-garden', kind: 'sentence', category: 'sentence', before: 'The ', after: ' smells sweet.', answer: 'flower', options: ['flower', 'flour'] },
  { id: 'sen-flour-cake', kind: 'sentence', category: 'sentence', before: 'We need ', after: ' for the cake.', answer: 'flour', options: ['flour', 'flower'] },
];

export const HOMOPHONES_ROUNDS = {
  // Easy: picture-only rounds
  easy: [...PICTURE_PAIRS.slice(0, 8)],
  // Medium: picture + easy sentences
  medium: [...PICTURE_PAIRS.slice(5), ...SENTENCE_BLANKS.slice(0, 8)],
  // Hard: sentence-heavy including 3-way (their/there/they're, to/too/two)
  hard: [...SENTENCE_BLANKS, ...PICTURE_PAIRS.slice(-3)],
};
