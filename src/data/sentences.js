// Sentence Builder (Gigi the Giraffe) — 7 subject-verb lessons.
//
// Each lesson focuses on one grammar point and mixes three round shapes
// (fill, order, verb) so kids practise the concept from multiple angles.
// The picker pulls a fresh set of rounds from the selected lesson on
// every play, and a deep rotation across lessons keeps the game feeling
// new even after many sessions.
//
// Lessons (roughly gentle → brave):
//   1. "is" & "are"                      singular vs plural be-verb
//   2. "has" & "have"                    singular vs plural have
//   3. present tense -s ending           he runs, cats run
//   4. "was" & "were"                    past-tense be
//   5. "do" & "does"                     helper verb agreement
//   6. articles a / an / the             singular + vowel/consonant awareness
//   7. complex sentences & conjunctions  because / when / if / although
//
// Round shapes the session picker mixes:
//   fill  { before, blank:'', after, answer, options }
//   verb  { subject, verb, answer, options }
//   order { words, answer }
//
// Every round carries `id` (stable key) and `category` (one per lesson)
// so the session picker can balance content across sessions and avoid
// showing the same rounds the kid just saw.

const L1_IS_ARE = [
  { id: 'l1-fill-1', kind: 'fill', category: 'l1', before: 'She', blank: '', after: 'happy.', answer: 'is', options: ['is', 'are', 'am'] },
  { id: 'l1-fill-2', kind: 'fill', category: 'l1', before: 'They', blank: '', after: 'friends.', answer: 'are', options: ['are', 'is', 'am'] },
  { id: 'l1-fill-3', kind: 'fill', category: 'l1', before: 'I', blank: '', after: 'hungry.', answer: 'am', options: ['am', 'is', 'are'] },
  { id: 'l1-fill-4', kind: 'fill', category: 'l1', before: 'The cat', blank: '', after: 'on the mat.', answer: 'is', options: ['is', 'are', 'be'] },
  { id: 'l1-fill-5', kind: 'fill', category: 'l1', before: 'The dogs', blank: '', after: 'loud.', answer: 'are', options: ['are', 'is', 'am'] },
  { id: 'l1-fill-6', kind: 'fill', category: 'l1', before: 'We', blank: '', after: 'happy.', answer: 'are', options: ['are', 'is', 'am'] },
  { id: 'l1-fill-7', kind: 'fill', category: 'l1', before: 'My brother', blank: '', after: 'tall.', answer: 'is', options: ['is', 'are', 'am'] },
  { id: 'l1-order-1', kind: 'order', category: 'l1', words: ['The', 'sun', 'is', 'warm.'], answer: 'The sun is warm.' },
  { id: 'l1-order-2', kind: 'order', category: 'l1', words: ['We', 'are', 'a', 'team.'], answer: 'We are a team.' },
  { id: 'l1-verb-1', kind: 'verb', category: 'l1', subject: 'The lions', verb: 'be', answer: 'are', options: ['are', 'is', 'am'] },
  { id: 'l1-verb-2', kind: 'verb', category: 'l1', subject: 'The monkey', verb: 'be', answer: 'is', options: ['is', 'are', 'be'] },
];

const L2_HAS_HAVE = [
  { id: 'l2-fill-1', kind: 'fill', category: 'l2', before: 'She', blank: '', after: 'a new book.', answer: 'has', options: ['has', 'have', 'had'] },
  { id: 'l2-fill-2', kind: 'fill', category: 'l2', before: 'They', blank: '', after: 'two dogs.', answer: 'have', options: ['have', 'has', 'had'] },
  { id: 'l2-fill-3', kind: 'fill', category: 'l2', before: 'I', blank: '', after: 'a red hat.', answer: 'have', options: ['have', 'has', 'had'] },
  { id: 'l2-fill-4', kind: 'fill', category: 'l2', before: 'The giraffe', blank: '', after: 'a long neck.', answer: 'has', options: ['has', 'have', 'is'] },
  { id: 'l2-fill-5', kind: 'fill', category: 'l2', before: 'We', blank: '', after: 'lots of books.', answer: 'have', options: ['have', 'has', 'are'] },
  { id: 'l2-fill-6', kind: 'fill', category: 'l2', before: 'My friend', blank: '', after: 'a puppy.', answer: 'has', options: ['has', 'have', 'had'] },
  { id: 'l2-order-1', kind: 'order', category: 'l2', words: ['The', 'panda', 'has', 'bamboo.'], answer: 'The panda has bamboo.' },
  { id: 'l2-order-2', kind: 'order', category: 'l2', words: ['They', 'have', 'a', 'big', 'garden.'], answer: 'They have a big garden.' },
  { id: 'l2-verb-1', kind: 'verb', category: 'l2', subject: 'The elephants', verb: 'have', answer: 'have', options: ['have', 'has', 'had'] },
  { id: 'l2-verb-2', kind: 'verb', category: 'l2', subject: 'A turtle', verb: 'have', answer: 'has', options: ['has', 'have', 'had'] },
];

const L3_PRESENT_S = [
  { id: 'l3-fill-1', kind: 'fill', category: 'l3', before: 'The dog', blank: '', after: 'fast.', answer: 'runs', options: ['runs', 'run', 'running'] },
  { id: 'l3-fill-2', kind: 'fill', category: 'l3', before: 'The dogs', blank: '', after: 'fast.', answer: 'run', options: ['run', 'runs', 'ran'] },
  { id: 'l3-fill-3', kind: 'fill', category: 'l3', before: 'My cat', blank: '', after: 'on the roof.', answer: 'sleeps', options: ['sleeps', 'sleep', 'slept'] },
  { id: 'l3-fill-4', kind: 'fill', category: 'l3', before: 'Birds', blank: '', after: 'in the sky.', answer: 'fly', options: ['fly', 'flies', 'flew'] },
  { id: 'l3-fill-5', kind: 'fill', category: 'l3', before: 'My sister', blank: '', after: 'the piano.', answer: 'plays', options: ['plays', 'play', 'played'] },
  { id: 'l3-fill-6', kind: 'fill', category: 'l3', before: 'The children', blank: '', after: 'outside.', answer: 'play', options: ['play', 'plays', 'played'] },
  { id: 'l3-fill-7', kind: 'fill', category: 'l3', before: 'A bee', blank: '', after: 'honey.', answer: 'makes', options: ['makes', 'make', 'made'] },
  { id: 'l3-fill-8', kind: 'fill', category: 'l3', before: 'Ducks', blank: '', after: 'in water.', answer: 'swim', options: ['swim', 'swims', 'swam'] },
  { id: 'l3-verb-1', kind: 'verb', category: 'l3', subject: 'A monkey', verb: 'swing', answer: 'swings', options: ['swings', 'swing', 'swung'] },
  { id: 'l3-verb-2', kind: 'verb', category: 'l3', subject: 'The monkeys', verb: 'swing', answer: 'swing', options: ['swing', 'swings', 'swinging'] },
  { id: 'l3-verb-3', kind: 'verb', category: 'l3', subject: 'A frog', verb: 'hop', answer: 'hops', options: ['hops', 'hop', 'hopped'] },
  { id: 'l3-order-1', kind: 'order', category: 'l3', words: ['The', 'parrot', 'sings', 'loudly.'], answer: 'The parrot sings loudly.' },
];

const L4_WAS_WERE = [
  { id: 'l4-fill-1', kind: 'fill', category: 'l4', before: 'He', blank: '', after: 'reading.', answer: 'was', options: ['was', 'were', 'are'] },
  { id: 'l4-fill-2', kind: 'fill', category: 'l4', before: 'They', blank: '', after: 'at the park.', answer: 'were', options: ['were', 'was', 'is'] },
  { id: 'l4-fill-3', kind: 'fill', category: 'l4', before: 'I', blank: '', after: 'tired yesterday.', answer: 'was', options: ['was', 'were', 'am'] },
  { id: 'l4-fill-4', kind: 'fill', category: 'l4', before: 'The cookies', blank: '', after: 'warm.', answer: 'were', options: ['were', 'was', 'are'] },
  { id: 'l4-fill-5', kind: 'fill', category: 'l4', before: 'We', blank: '', after: 'at the beach.', answer: 'were', options: ['were', 'was', 'are'] },
  { id: 'l4-fill-6', kind: 'fill', category: 'l4', before: 'She', blank: '', after: 'happy to see us.', answer: 'was', options: ['was', 'were', 'is'] },
  { id: 'l4-order-1', kind: 'order', category: 'l4', words: ['We', 'were', 'at', 'the', 'zoo.'], answer: 'We were at the zoo.' },
  { id: 'l4-order-2', kind: 'order', category: 'l4', words: ['My', 'dog', 'was', 'sleeping.'], answer: 'My dog was sleeping.' },
  { id: 'l4-verb-1', kind: 'verb', category: 'l4', subject: 'The kids', verb: 'be (past)', answer: 'were', options: ['were', 'was', 'are'] },
  { id: 'l4-verb-2', kind: 'verb', category: 'l4', subject: 'My grandma', verb: 'be (past)', answer: 'was', options: ['was', 'were', 'is'] },
];

const L5_DO_DOES = [
  { id: 'l5-fill-1', kind: 'fill', category: 'l5', before: '', blank: '', after: 'she like apples?', answer: 'Does', options: ['Does', 'Do', 'Is'] },
  { id: 'l5-fill-2', kind: 'fill', category: 'l5', before: '', blank: '', after: 'they play outside?', answer: 'Do', options: ['Do', 'Does', 'Are'] },
  { id: 'l5-fill-3', kind: 'fill', category: 'l5', before: '', blank: '', after: 'the cat purr?', answer: 'Does', options: ['Does', 'Do', 'Is'] },
  { id: 'l5-fill-4', kind: 'fill', category: 'l5', before: 'I', blank: '', after: 'not know.', answer: 'do', options: ['do', 'does', 'am'] },
  { id: 'l5-fill-5', kind: 'fill', category: 'l5', before: 'She', blank: '', after: 'not eat meat.', answer: 'does', options: ['does', 'do', 'is'] },
  { id: 'l5-fill-6', kind: 'fill', category: 'l5', before: '', blank: '', after: 'elephants swim?', answer: 'Do', options: ['Do', 'Does', 'Are'] },
  { id: 'l5-order-1', kind: 'order', category: 'l5', words: ['Does', 'the', 'owl', 'hoot?'], answer: 'Does the owl hoot?' },
  { id: 'l5-order-2', kind: 'order', category: 'l5', words: ['Do', 'you', 'like', 'pizza?'], answer: 'Do you like pizza?' },
];

const L6_ARTICLES = [
  { id: 'l6-fill-1', kind: 'fill', category: 'l6', before: 'I see', blank: '', after: 'apple.', answer: 'an', options: ['an', 'a', 'the'] },
  { id: 'l6-fill-2', kind: 'fill', category: 'l6', before: 'There is', blank: '', after: 'cat.', answer: 'a', options: ['a', 'an', 'some'] },
  { id: 'l6-fill-3', kind: 'fill', category: 'l6', before: 'Look at', blank: '', after: 'moon!', answer: 'the', options: ['the', 'a', 'an'] },
  { id: 'l6-fill-4', kind: 'fill', category: 'l6', before: 'She ate', blank: '', after: 'orange.', answer: 'an', options: ['an', 'a', 'the'] },
  { id: 'l6-fill-5', kind: 'fill', category: 'l6', before: 'He has', blank: '', after: 'umbrella.', answer: 'an', options: ['an', 'a', 'the'] },
  { id: 'l6-fill-6', kind: 'fill', category: 'l6', before: 'We found', blank: '', after: 'bird.', answer: 'a', options: ['a', 'an', 'the'] },
  { id: 'l6-fill-7', kind: 'fill', category: 'l6', before: 'Close', blank: '', after: 'door, please.', answer: 'the', options: ['the', 'a', 'an'] },
  { id: 'l6-fill-8', kind: 'fill', category: 'l6', before: 'I want', blank: '', after: 'ice cream.', answer: 'an', options: ['an', 'a', 'the'] },
  { id: 'l6-order-1', kind: 'order', category: 'l6', words: ['I', 'have', 'an', 'ant.'], answer: 'I have an ant.' },
  { id: 'l6-order-2', kind: 'order', category: 'l6', words: ['The', 'sun', 'is', 'bright.'], answer: 'The sun is bright.' },
];

const L7_COMPLEX = [
  { id: 'l7-fill-1', kind: 'fill', category: 'l7', before: 'If it rains, we', blank: '', after: 'stay inside.', answer: 'will', options: ['will', 'was', 'are'] },
  { id: 'l7-fill-2', kind: 'fill', category: 'l7', before: 'She sang', blank: '', after: 'she was happy.', answer: 'because', options: ['because', 'but', 'or'] },
  { id: 'l7-fill-3', kind: 'fill', category: 'l7', before: '', blank: '', after: 'the rain stopped, we went out.', answer: 'When', options: ['When', 'If', 'Because'] },
  { id: 'l7-fill-4', kind: 'fill', category: 'l7', before: 'Everyone', blank: '', after: 'a snack.', answer: 'brings', options: ['brings', 'bring', 'brought'] },
  { id: 'l7-fill-5', kind: 'fill', category: 'l7', before: 'Neither cat', blank: '', after: 'asleep.', answer: 'is', options: ['is', 'are', 'were'] },
  { id: 'l7-fill-6', kind: 'fill', category: 'l7', before: 'Each child', blank: '', after: 'a turn.', answer: 'has', options: ['has', 'have', 'had'] },
  { id: 'l7-order-1', kind: 'order', category: 'l7', words: ['Although', 'it', 'was', 'late,', 'we', 'kept', 'reading.'], answer: 'Although it was late, we kept reading.' },
  { id: 'l7-order-2', kind: 'order', category: 'l7', words: ['Because', 'she', 'practised,', 'she', 'got', 'better.'], answer: 'Because she practised, she got better.' },
  { id: 'l7-order-3', kind: 'order', category: 'l7', words: ['When', 'the', 'bell', 'rings,', 'we', 'line', 'up.'], answer: 'When the bell rings, we line up.' },
];

// Public API: the seven lessons, metadata for the picker, and the
// back-compat easy/medium/hard buckets that the existing difficulty
// setting maps into.  We keep both so the simple difficulty picker
// keeps working and parents can also target a specific lesson.

export const SENTENCES_LESSONS = [
  { id: 'lesson1', label: 'Level 1 — is & are', short: 'is/are', rounds: L1_IS_ARE },
  { id: 'lesson2', label: 'Level 2 — has & have', short: 'has/have', rounds: L2_HAS_HAVE },
  { id: 'lesson3', label: 'Level 3 — he runs / they run', short: 'verb endings', rounds: L3_PRESENT_S },
  { id: 'lesson4', label: 'Level 4 — was & were', short: 'was/were', rounds: L4_WAS_WERE },
  { id: 'lesson5', label: 'Level 5 — do & does', short: 'do/does', rounds: L5_DO_DOES },
  { id: 'lesson6', label: 'Level 6 — a, an, the', short: 'articles', rounds: L6_ARTICLES },
  { id: 'lesson7', label: 'Level 7 — bigger sentences', short: 'conjunctions', rounds: L7_COMPLEX },
];

export function getLessonRounds(lessonId) {
  const lesson = SENTENCES_LESSONS.find((l) => l.id === lessonId);
  return lesson?.rounds ?? [];
}

export const SENTENCES_ROUNDS = {
  // Gentle tier: lessons 1+2 (is/are, has/have)
  easy: [...L1_IS_ARE, ...L2_HAS_HAVE],
  // Growing tier: lessons 3+4+5 (present-s, past be, do/does)
  medium: [...L3_PRESENT_S, ...L4_WAS_WERE, ...L5_DO_DOES],
  // Brave tier: lessons 6+7 (articles + complex)
  hard: [...L6_ARTICLES, ...L7_COMPLEX],
};
