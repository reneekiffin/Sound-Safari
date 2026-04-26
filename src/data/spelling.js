// Spelling Test (Penny the Panda — bonus mode in Word Builders).
//
// Word list curated from Reading Rockets' "Basic Spelling Vocabulary
// List" (https://www.readingrockets.org/topics/writing/articles/
// basic-spelling-vocabulary-list).  Reading Rockets compiles the
// highest-frequency words from grade-1 through grade-3 spelling
// programs.  We pick the subset that:
//   - is recognisable to early readers,
//   - has an unambiguous emoji we can show as a clue, and
//   - covers common spelling patterns kids meet first (CVC, double
//     consonants, magic-e, basic digraphs).
//
// Round shape:
//   { id, word, emoji, sentence, distractors }
//   - `distractors` are extra letters added to the tile pool so the
//     kid can't just tap whatever's in front of them; shuffled with
//     the word's own letters at runtime.
//
// Difficulty tiers track length / complexity:
//   easy   3-letter CVC + a few 4-letter sight words
//   medium 4-5 letters with digraphs / blends / magic-e
//   hard   5-7 letters, multi-syllable, common irregulars

const EASY = [
  { id: 'cat',  word: 'cat',  emoji: '🐈',   sentence: 'The cat is soft.', distractors: ['o', 'b'] },
  { id: 'dog',  word: 'dog',  emoji: '🐕',   sentence: 'My dog likes to play.', distractors: ['a', 'p'] },
  { id: 'sun',  word: 'sun',  emoji: '☀️',  sentence: 'The sun is bright.', distractors: ['o', 'm'] },
  { id: 'bed',  word: 'bed',  emoji: '🛏️',  sentence: 'I sleep in my bed.', distractors: ['a', 't'] },
  { id: 'pig',  word: 'pig',  emoji: '🐖',   sentence: 'The pig is pink.', distractors: ['e', 'b'] },
  { id: 'cow',  word: 'cow',  emoji: '🐄',   sentence: 'A cow says moo.', distractors: ['a', 'k'] },
  { id: 'bee',  word: 'bee',  emoji: '🐝',   sentence: 'The bee buzzes.', distractors: ['a', 'p'] },
  { id: 'fox',  word: 'fox',  emoji: '🦊',   sentence: 'The fox runs fast.', distractors: ['a', 'b'] },
  { id: 'hat',  word: 'hat',  emoji: '🎩',   sentence: 'I wear a hat.', distractors: ['e', 'm'] },
  { id: 'bus',  word: 'bus',  emoji: '🚌',   sentence: 'The bus is yellow.', distractors: ['a', 'p'] },
  { id: 'map',  word: 'map',  emoji: '🗺️',  sentence: 'A map shows the way.', distractors: ['e', 't'] },
  { id: 'red',  word: 'red',  emoji: '🟥',   sentence: 'The apple is red.', distractors: ['o', 'p'] },
  { id: 'ten',  word: 'ten',  emoji: '🔟',   sentence: 'I can count to ten.', distractors: ['a', 'p'] },
  { id: 'big',  word: 'big',  emoji: '🐘',   sentence: 'An elephant is big.', distractors: ['a', 'p'] },
  { id: 'run',  word: 'run',  emoji: '🏃',   sentence: 'Run to the playground.', distractors: ['a', 'm'] },
  { id: 'mom',  word: 'mom',  emoji: '👩',   sentence: 'My mom is kind.', distractors: ['a', 'p'] },
  { id: 'dad',  word: 'dad',  emoji: '👨',   sentence: 'Dad reads to me.', distractors: ['e', 'p'] },
  { id: 'yes',  word: 'yes',  emoji: '✅',   sentence: 'Yes, I want some.', distractors: ['a', 'l'] },
  { id: 'six',  word: 'six',  emoji: '6️⃣', sentence: 'I am six years old.', distractors: ['e', 'l'] },
  { id: 'top',  word: 'top',  emoji: '🔝',   sentence: 'The bird is on top.', distractors: ['e', 'b'] },
  { id: 'play', word: 'play', emoji: '🎮',   sentence: 'I love to play.', distractors: ['e', 's'] },
  { id: 'look', word: 'look', emoji: '👀',   sentence: 'Look at the sky.', distractors: ['a', 'p'] },
  { id: 'book', word: 'book', emoji: '📚',   sentence: 'I read my book.', distractors: ['e', 'a'] },
  { id: 'fish', word: 'fish', emoji: '🐟',   sentence: 'The fish swims.', distractors: ['a', 'p'] },
  { id: 'jump', word: 'jump', emoji: '🤸',   sentence: 'Jump up high!', distractors: ['e', 's'] },
];

const MEDIUM = [
  { id: 'duck',  word: 'duck',  emoji: '🦆',   sentence: 'The duck swims.', distractors: ['a', 'p', 'm'] },
  { id: 'frog',  word: 'frog',  emoji: '🐸',   sentence: 'A frog hops.', distractors: ['a', 'p', 'b'] },
  { id: 'moon',  word: 'moon',  emoji: '🌙',   sentence: 'The moon shines at night.', distractors: ['a', 'p', 'l'] },
  { id: 'star',  word: 'star',  emoji: '⭐',   sentence: 'I see one bright star.', distractors: ['e', 'p', 'l'] },
  { id: 'tree',  word: 'tree',  emoji: '🌳',   sentence: 'The tree is tall.', distractors: ['a', 'p', 'l'] },
  { id: 'door',  word: 'door',  emoji: '🚪',   sentence: 'Open the door.', distractors: ['a', 'p', 'l'] },
  { id: 'baby',  word: 'baby',  emoji: '👶',   sentence: 'The baby is small.', distractors: ['e', 'p', 'l'] },
  { id: 'bike',  word: 'bike',  emoji: '🚲',   sentence: 'Ride your bike.', distractors: ['a', 'p', 'l'] },
  { id: 'ball',  word: 'ball',  emoji: '⚽',   sentence: 'Throw the ball.', distractors: ['e', 'p', 'm'] },
  { id: 'cake',  word: 'cake',  emoji: '🎂',   sentence: 'I love cake!', distractors: ['e', 'p', 't'] },
  { id: 'snow',  word: 'snow',  emoji: '❄️',  sentence: 'Snow is cold.', distractors: ['a', 'p', 'l'] },
  { id: 'rain',  word: 'rain',  emoji: '🌧️', sentence: 'The rain falls down.', distractors: ['e', 'p', 'l'] },
  { id: 'fire',  word: 'fire',  emoji: '🔥',   sentence: 'Fire is hot.', distractors: ['a', 'p', 'l'] },
  { id: 'milk',  word: 'milk',  emoji: '🥛',   sentence: 'I drink milk.', distractors: ['a', 'p', 's'] },
  { id: 'fish-m', word: 'fish', emoji: '🐟',  sentence: 'A fish swims in the pond.', distractors: ['o', 'p', 'l'] },
  { id: 'apple', word: 'apple', emoji: '🍎',   sentence: 'I eat an apple.', distractors: ['o', 'b', 's'] },
  { id: 'house', word: 'house', emoji: '🏠',   sentence: 'My house is warm.', distractors: ['a', 't', 'p'] },
  { id: 'mouse', word: 'mouse', emoji: '🐭',   sentence: 'The mouse is quiet.', distractors: ['a', 'p', 'b'] },
  { id: 'horse', word: 'horse', emoji: '🐴',   sentence: 'The horse runs fast.', distractors: ['a', 'p', 'l'] },
  { id: 'snake', word: 'snake', emoji: '🐍',   sentence: 'The snake slithers.', distractors: ['o', 'p', 'l'] },
  { id: 'snail', word: 'snail', emoji: '🐌',   sentence: 'A snail is slow.', distractors: ['o', 'p', 'm'] },
  { id: 'clock', word: 'clock', emoji: '🕰️', sentence: 'The clock ticks.', distractors: ['a', 'p', 'm'] },
  { id: 'green', word: 'green', emoji: '🟩',   sentence: 'The grass is green.', distractors: ['a', 'p', 'b'] },
];

const HARD = [
  { id: 'rainbow',  word: 'rainbow',  emoji: '🌈',   sentence: 'A rainbow has many colours.', distractors: ['e', 'p', 's'] },
  { id: 'monkey',   word: 'monkey',   emoji: '🐒',   sentence: 'The monkey climbs trees.', distractors: ['a', 'p', 'l'] },
  { id: 'pencil',   word: 'pencil',   emoji: '✏️',  sentence: 'Write with a pencil.', distractors: ['a', 'b', 's'] },
  { id: 'friend',   word: 'friend',   emoji: '👫',   sentence: 'My friend is kind.', distractors: ['a', 'p', 't'] },
  { id: 'garden',   word: 'garden',   emoji: '🌷',   sentence: 'Flowers grow in the garden.', distractors: ['o', 'p', 's'] },
  { id: 'school',   word: 'school',   emoji: '🏫',   sentence: 'I learn at school.', distractors: ['a', 'p', 't'] },
  { id: 'people',   word: 'people',   emoji: '🧑‍🤝‍🧑', sentence: 'People are friendly.', distractors: ['a', 'b', 's'] },
  { id: 'family',   word: 'family',   emoji: '👨‍👩‍👧', sentence: 'I love my family.', distractors: ['o', 'p', 's'] },
  { id: 'window',   word: 'window',   emoji: '🪟',   sentence: 'Look out the window.', distractors: ['a', 'p', 's'] },
  { id: 'flower',   word: 'flower',   emoji: '🌸',   sentence: 'The flower smells nice.', distractors: ['a', 'p', 's'] },
  { id: 'butter',   word: 'butter',   emoji: '🧈',   sentence: 'Spread butter on toast.', distractors: ['a', 'p', 's'] },
  { id: 'yellow',   word: 'yellow',   emoji: '🟡',   sentence: 'The sun is yellow.', distractors: ['a', 'p', 's'] },
  { id: 'orange',   word: 'orange',   emoji: '🍊',   sentence: 'I peel the orange.', distractors: ['a', 'p', 's'] },
  { id: 'turtle',   word: 'turtle',   emoji: '🐢',   sentence: 'The turtle is slow.', distractors: ['a', 'p', 's'] },
  { id: 'dragon',   word: 'dragon',   emoji: '🐉',   sentence: 'The dragon is brave.', distractors: ['e', 'p', 's'] },
  { id: 'guitar',   word: 'guitar',   emoji: '🎸',   sentence: 'Play the guitar.', distractors: ['e', 'p', 's'] },
];

export const SPELLING_ROUNDS = { easy: EASY, medium: MEDIUM, hard: HARD };
