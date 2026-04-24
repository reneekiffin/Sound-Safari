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
  {
    id: 'two-too',
    kind: 'picture',
    category: 'picture',
    prompt: { word: 'two' },
    answer: 'two',
    options: [
      { word: 'two', emoji: '2️⃣' },
      { word: 'too', emoji: '➕' },
    ],
  },
  {
    id: 'berry-bury',
    kind: 'picture',
    category: 'picture',
    prompt: { word: 'berry' },
    answer: 'berry',
    options: [
      { word: 'berry', emoji: '🫐' },
      { word: 'bury', emoji: '⛏️' },
    ],
  },
  {
    id: 'blue-blew',
    kind: 'picture',
    category: 'picture',
    prompt: { word: 'blue' },
    answer: 'blue',
    options: [
      { word: 'blue', emoji: '🟦' },
      { word: 'blew', emoji: '🌬️' },
    ],
  },
  {
    id: 'eight-ate',
    kind: 'picture',
    category: 'picture',
    prompt: { word: 'eight' },
    answer: 'eight',
    options: [
      { word: 'eight', emoji: '8️⃣' },
      { word: 'ate', emoji: '🍽️' },
    ],
  },
  {
    id: 'meat-meet',
    kind: 'picture',
    category: 'picture',
    prompt: { word: 'meat' },
    answer: 'meat',
    options: [
      { word: 'meat', emoji: '🥩' },
      { word: 'meet', emoji: '🤝' },
    ],
  },
  {
    id: 'week-weak',
    kind: 'picture',
    category: 'picture',
    prompt: { word: 'weak' },
    answer: 'weak',
    options: [
      { word: 'weak', emoji: '🥀' },
      { word: 'week', emoji: '📅' },
    ],
  },
  {
    id: 'sail-sale',
    kind: 'picture',
    category: 'picture',
    prompt: { word: 'sail' },
    answer: 'sail',
    options: [
      { word: 'sail', emoji: '⛵' },
      { word: 'sale', emoji: '🏷️' },
    ],
  },
  {
    id: 'pail-pale',
    kind: 'picture',
    category: 'picture',
    prompt: { word: 'pail' },
    answer: 'pail',
    options: [
      { word: 'pail', emoji: '🪣' },
      { word: 'pale', emoji: '😶' },
    ],
  },
  {
    id: 'peace-piece',
    kind: 'picture',
    category: 'picture',
    prompt: { word: 'piece' },
    answer: 'piece',
    options: [
      { word: 'piece', emoji: '🧩' },
      { word: 'peace', emoji: '☮️' },
    ],
  },
  {
    id: 'one-won',
    kind: 'picture',
    category: 'picture',
    prompt: { word: 'one' },
    answer: 'one',
    options: [
      { word: 'one', emoji: '1️⃣' },
      { word: 'won', emoji: '🏆' },
    ],
  },
  {
    id: 'wait-weight',
    kind: 'picture',
    category: 'picture',
    prompt: { word: 'weight' },
    answer: 'weight',
    options: [
      { word: 'weight', emoji: '🏋️' },
      { word: 'wait', emoji: '⏳' },
    ],
  },
  {
    id: 'witch-which',
    kind: 'picture',
    category: 'picture',
    prompt: { word: 'witch' },
    answer: 'witch',
    options: [
      { word: 'witch', emoji: '🧙' },
      { word: 'which', emoji: '❓' },
    ],
  },
  {
    id: 'wood-would',
    kind: 'picture',
    category: 'picture',
    prompt: { word: 'wood' },
    answer: 'wood',
    options: [
      { word: 'wood', emoji: '🪵' },
      { word: 'would', emoji: '💭' },
    ],
  },
  {
    id: 'new-knew',
    kind: 'picture',
    category: 'picture',
    prompt: { word: 'new' },
    answer: 'new',
    options: [
      { word: 'new', emoji: '✨' },
      { word: 'knew', emoji: '🧠' },
    ],
  },
  {
    id: 'hour-our',
    kind: 'picture',
    category: 'picture',
    prompt: { word: 'hour' },
    answer: 'hour',
    options: [
      { word: 'hour', emoji: '⏰' },
      { word: 'our', emoji: '👨‍👩‍👧' },
    ],
  },
  {
    id: 'role-roll',
    kind: 'picture',
    category: 'picture',
    prompt: { word: 'roll' },
    answer: 'roll',
    options: [
      { word: 'roll', emoji: '🥖' },
      { word: 'role', emoji: '🎭' },
    ],
  },
  {
    id: 'stair-stare',
    kind: 'picture',
    category: 'picture',
    prompt: { word: 'stair' },
    answer: 'stair',
    options: [
      { word: 'stair', emoji: '🪜' },
      { word: 'stare', emoji: '👀' },
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
  { id: 'sen-berry-pie', kind: 'sentence', category: 'sentence', before: 'I love ', after: ' pie.', answer: 'berry', options: ['berry', 'bury'] },
  { id: 'sen-bury-bone', kind: 'sentence', category: 'sentence', before: 'The dog will ', after: ' the bone.', answer: 'bury', options: ['bury', 'berry'] },
  { id: 'sen-blue-sky', kind: 'sentence', category: 'sentence', before: 'The sky is ', after: '.', answer: 'blue', options: ['blue', 'blew'] },
  { id: 'sen-blew-candles', kind: 'sentence', category: 'sentence', before: 'She ', after: ' out the candles.', answer: 'blew', options: ['blew', 'blue'] },
  { id: 'sen-ate-lunch', kind: 'sentence', category: 'sentence', before: 'I ', after: ' lunch at noon.', answer: 'ate', options: ['ate', 'eight'] },
  { id: 'sen-eight-kids', kind: 'sentence', category: 'sentence', before: 'There are ', after: ' kids here.', answer: 'eight', options: ['eight', 'ate'] },
  { id: 'sen-meat-dinner', kind: 'sentence', category: 'sentence', before: 'We had ', after: ' for dinner.', answer: 'meat', options: ['meat', 'meet'] },
  { id: 'sen-meet-friend', kind: 'sentence', category: 'sentence', before: 'Can we ', after: ' at the park?', answer: 'meet', options: ['meet', 'meat'] },
  { id: 'sen-weak-arm', kind: 'sentence', category: 'sentence', before: 'My arm feels ', after: '.', answer: 'weak', options: ['weak', 'week'] },
  { id: 'sen-week-vacation', kind: 'sentence', category: 'sentence', before: 'We go on vacation next ', after: '.', answer: 'week', options: ['week', 'weak'] },
  { id: 'sen-sail-boat', kind: 'sentence', category: 'sentence', before: 'We will ', after: ' the boat.', answer: 'sail', options: ['sail', 'sale'] },
  { id: 'sen-sale-shop', kind: 'sentence', category: 'sentence', before: 'The shop has a big ', after: '.', answer: 'sale', options: ['sale', 'sail'] },
  { id: 'sen-piece-cake', kind: 'sentence', category: 'sentence', before: 'Please pass me a ', after: ' of cake.', answer: 'piece', options: ['piece', 'peace'] },
  { id: 'sen-peace-quiet', kind: 'sentence', category: 'sentence', before: 'I love the ', after: ' and quiet.', answer: 'peace', options: ['peace', 'piece'] },
  { id: 'sen-one-apple', kind: 'sentence', category: 'sentence', before: 'I ate ', after: ' apple.', answer: 'one', options: ['one', 'won'] },
  { id: 'sen-won-prize', kind: 'sentence', category: 'sentence', before: 'She ', after: ' the prize.', answer: 'won', options: ['won', 'one'] },
  { id: 'sen-wait-turn', kind: 'sentence', category: 'sentence', before: 'Please ', after: ' your turn.', answer: 'wait', options: ['wait', 'weight'] },
  { id: 'sen-weight-box', kind: 'sentence', category: 'sentence', before: 'The box has a lot of ', after: '.', answer: 'weight', options: ['weight', 'wait'] },
  { id: 'sen-hour-ago', kind: 'sentence', category: 'sentence', before: 'He left an ', after: ' ago.', answer: 'hour', options: ['hour', 'our'] },
  { id: 'sen-our-home', kind: 'sentence', category: 'sentence', before: 'This is ', after: ' home.', answer: 'our', options: ['our', 'hour'] },
  { id: 'sen-knew-answer', kind: 'sentence', category: 'sentence', before: 'I ', after: ' the answer.', answer: 'knew', options: ['knew', 'new'] },
  { id: 'sen-new-toy', kind: 'sentence', category: 'sentence', before: 'I got a ', after: ' toy.', answer: 'new', options: ['new', 'knew'] },
  { id: 'sen-witch-hat', kind: 'sentence', category: 'sentence', before: 'The ', after: ' wore a tall hat.', answer: 'witch', options: ['witch', 'which'] },
  { id: 'sen-which-one', kind: 'sentence', category: 'sentence', before: '', after: ' one do you want?', answer: 'Which', options: ['Which', 'Witch'] },
  { id: 'sen-wood-fire', kind: 'sentence', category: 'sentence', before: 'We put ', after: ' on the fire.', answer: 'wood', options: ['wood', 'would'] },
  { id: 'sen-would-love', kind: 'sentence', category: 'sentence', before: 'I ', after: ' love some help.', answer: 'would', options: ['would', 'wood'] },
  { id: 'sen-roll-dice', kind: 'sentence', category: 'sentence', before: 'Please ', after: ' the dice.', answer: 'roll', options: ['roll', 'role'] },
  { id: 'sen-role-play', kind: 'sentence', category: 'sentence', before: 'She has an important ', after: ' in the play.', answer: 'role', options: ['role', 'roll'] },
];

export const HOMOPHONES_ROUNDS = {
  // Easy: picture rounds only — pre-readers match audio to picture.
  easy: [...PICTURE_PAIRS.slice(0, 16)],
  // Medium: rest of the picture pairs + gentler sentence rounds.
  medium: [...PICTURE_PAIRS.slice(12), ...SENTENCE_BLANKS.slice(0, 20)],
  // Hard: sentence-heavy, including 3-way choices (their/there/they're,
  // to/too/two) and harder spelling distinctions.
  hard: [...SENTENCE_BLANKS, ...PICTURE_PAIRS.slice(-10)],
};
