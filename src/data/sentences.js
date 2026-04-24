// Sentence Builder (ages 7-10, hosted by Gigi the Giraffe).
//
// Mixes three teaching moments:
//
// 1. "fill"   — fill the blank with the right word (subject-verb agreement,
//               articles, prepositions).  Kid sees the whole sentence with
//               one word missing; options are contrasting pairs
//               (e.g. run / runs) or related words.
// 2. "order"  — tap word chips in the right order to form a sentence.
//               Great reading + grammar practice.
// 3. "verb"   — given a subject, pick the right verb form.
//
// The field `kind` lets the game component pick the right renderer.
// Everything lives in one pool so the session picker can mix shapes.

const EASY = [
  // subject-verb agreement basics
  { id: 'dog-runs', kind: 'fill', before: 'The dog', blank: '', after: 'fast.', answer: 'runs', options: ['runs', 'run', 'running'] },
  { id: 'dogs-run', kind: 'fill', before: 'The dogs', blank: '', after: 'fast.', answer: 'run', options: ['run', 'runs', 'ran'] },
  { id: 'she-is', kind: 'fill', before: 'She', blank: '', after: 'happy.', answer: 'is', options: ['is', 'are', 'am'] },
  { id: 'we-are', kind: 'fill', before: 'We', blank: '', after: 'friends.', answer: 'are', options: ['are', 'is', 'am'] },
  { id: 'i-am', kind: 'fill', before: 'I', blank: '', after: 'hungry.', answer: 'am', options: ['am', 'is', 'are'] },
  { id: 'cats-sit', kind: 'fill', before: 'Two cats', blank: '', after: 'on the mat.', answer: 'sit', options: ['sit', 'sits', 'sat'] },

  // articles
  { id: 'an-apple', kind: 'fill', before: 'I see', blank: '', after: 'apple.', answer: 'an', options: ['an', 'a', 'the'] },
  { id: 'a-cat', kind: 'fill', before: 'There is', blank: '', after: 'cat.', answer: 'a', options: ['a', 'an', 'some'] },

  // simple ordering
  { id: 'order-cat-sits', kind: 'order', words: ['The', 'cat', 'sits', 'down.'], answer: 'The cat sits down.' },
  { id: 'order-i-love-pizza', kind: 'order', words: ['I', 'love', 'pizza.'], answer: 'I love pizza.' },
  { id: 'order-the-sun-shines', kind: 'order', words: ['The', 'sun', 'shines', 'brightly.'], answer: 'The sun shines brightly.' },
];

const MEDIUM = [
  { id: 'birds-fly', kind: 'fill', before: 'The birds', blank: '', after: 'in the sky.', answer: 'fly', options: ['fly', 'flies', 'flew', 'flying'] },
  { id: 'child-goes', kind: 'fill', before: 'The child', blank: '', after: 'to school.', answer: 'goes', options: ['goes', 'go', 'went', 'going'] },
  { id: 'we-have', kind: 'fill', before: 'We', blank: '', after: 'two pets.', answer: 'have', options: ['have', 'has', 'had', 'having'] },
  { id: 'my-sister-has', kind: 'fill', before: 'My sister', blank: '', after: 'a new book.', answer: 'has', options: ['has', 'have', 'had'] },
  { id: 'they-were', kind: 'fill', before: 'They', blank: '', after: 'at the park.', answer: 'were', options: ['were', 'was', 'is'] },
  { id: 'he-was', kind: 'fill', before: 'He', blank: '', after: 'reading.', answer: 'was', options: ['was', 'were', 'are'] },

  { id: 'verb-lion-roars', kind: 'verb', subject: 'The lion', verb: 'roar', answer: 'roars', options: ['roars', 'roar', 'roared'] },
  { id: 'verb-lions-roar', kind: 'verb', subject: 'The lions', verb: 'roar', answer: 'roar', options: ['roar', 'roars', 'roaring'] },
  { id: 'verb-monkey-swings', kind: 'verb', subject: 'A monkey', verb: 'swing', answer: 'swings', options: ['swings', 'swing', 'swung'] },

  { id: 'order-elephants-drink', kind: 'order', words: ['Elephants', 'drink', 'a', 'lot', 'of', 'water.'], answer: 'Elephants drink a lot of water.' },
  { id: 'order-we-went', kind: 'order', words: ['We', 'went', 'to', 'the', 'beach.'], answer: 'We went to the beach.' },
  { id: 'order-parrots-are', kind: 'order', words: ['Parrots', 'are', 'very', 'colourful.'], answer: 'Parrots are very colourful.' },
];

const HARD = [
  { id: 'everyone-brings', kind: 'fill', before: 'Everyone', blank: '', after: 'a snack.', answer: 'brings', options: ['brings', 'bring', 'brought'] },
  { id: 'neither-is', kind: 'fill', before: 'Neither cat', blank: '', after: 'asleep.', answer: 'is', options: ['is', 'are', 'were'] },
  { id: 'each-has', kind: 'fill', before: 'Each child', blank: '', after: 'a turn.', answer: 'has', options: ['has', 'have', 'had'] },
  { id: 'if-it-rains', kind: 'fill', before: 'If it rains, we', blank: '', after: 'stay inside.', answer: 'will', options: ['will', 'are', 'was'] },

  { id: 'order-although', kind: 'order', words: ['Although', 'it', 'was', 'late,', 'we', 'kept', 'reading.'], answer: 'Although it was late, we kept reading.' },
  { id: 'order-because', kind: 'order', words: ['Because', 'she', 'practised,', 'she', 'got', 'better.'], answer: 'Because she practised, she got better.' },
];

export const SENTENCES_ROUNDS = { easy: EASY, medium: MEDIUM, hard: HARD };
