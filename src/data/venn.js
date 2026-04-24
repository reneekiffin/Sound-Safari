// Venn Diagrams (Ollie the Owl) — ages 6-10.
//
// Each round shows two overlapping circles with labels.  Kids place items
// one at a time into one of three regions:
//   'left'   — only the left label applies
//   'right'  — only the right label applies
//   'both'   — the item belongs in the intersection (both labels apply)
//
// Teaches set intersection, exclusion, and union in a tangible way.
//
// Round shape:
//   {
//     id, leftLabel, rightLabel,
//     items: [{ word, emoji, answer: 'left'|'right'|'both' }, ...],
//   }
//
// The game component shows the Venn diagram visually and presents items
// one at a time.

const EASY = [
  {
    id: 'swim-fly',
    leftLabel: 'Can Swim',
    rightLabel: 'Can Fly',
    items: [
      { word: 'dolphin', emoji: '🐬', answer: 'left' },
      { word: 'eagle', emoji: '🦅', answer: 'right' },
      { word: 'duck', emoji: '🦆', answer: 'both' },
      { word: 'fish', emoji: '🐠', answer: 'left' },
      { word: 'butterfly', emoji: '🦋', answer: 'right' },
      { word: 'seagull', emoji: '🕊️', answer: 'both' },
    ],
  },
  {
    id: 'sweet-sour',
    leftLabel: 'Sweet',
    rightLabel: 'Sour',
    items: [
      { word: 'honey', emoji: '🍯', answer: 'left' },
      { word: 'lemon', emoji: '🍋', answer: 'right' },
      { word: 'strawberry', emoji: '🍓', answer: 'both' },
      { word: 'candy', emoji: '🍬', answer: 'left' },
      { word: 'pickle', emoji: '🥒', answer: 'right' },
      { word: 'green apple', emoji: '🍏', answer: 'both' },
    ],
  },
  {
    id: 'day-night',
    leftLabel: 'Day',
    rightLabel: 'Night',
    items: [
      { word: 'sun', emoji: '☀️', answer: 'left' },
      { word: 'moon', emoji: '🌙', answer: 'right' },
      { word: 'stars', emoji: '⭐', answer: 'right' },
      { word: 'rainbow', emoji: '🌈', answer: 'left' },
      { word: 'sky', emoji: '🌥️', answer: 'both' },
      { word: 'clouds', emoji: '☁️', answer: 'both' },
    ],
  },
];

const MEDIUM = [
  {
    id: 'pets-wild',
    leftLabel: 'Pet',
    rightLabel: 'Wild Animal',
    items: [
      { word: 'dog', emoji: '🐶', answer: 'left' },
      { word: 'tiger', emoji: '🐅', answer: 'right' },
      { word: 'cat', emoji: '🐱', answer: 'left' },
      { word: 'elephant', emoji: '🐘', answer: 'right' },
      { word: 'rabbit', emoji: '🐇', answer: 'both' },
      { word: 'lion', emoji: '🦁', answer: 'right' },
      { word: 'goldfish', emoji: '🐠', answer: 'left' },
    ],
  },
  {
    id: 'hot-cold',
    leftLabel: 'Hot Food',
    rightLabel: 'Cold Food',
    items: [
      { word: 'soup', emoji: '🍲', answer: 'left' },
      { word: 'ice cream', emoji: '🍦', answer: 'right' },
      { word: 'pizza', emoji: '🍕', answer: 'left' },
      { word: 'salad', emoji: '🥗', answer: 'right' },
      { word: 'sandwich', emoji: '🥪', answer: 'both' },
      { word: 'tea', emoji: '🫖', answer: 'both' },
    ],
  },
  {
    id: 'indoor-outdoor',
    leftLabel: 'Indoor',
    rightLabel: 'Outdoor',
    items: [
      { word: 'bed', emoji: '🛏️', answer: 'left' },
      { word: 'tree', emoji: '🌳', answer: 'right' },
      { word: 'sofa', emoji: '🛋️', answer: 'left' },
      { word: 'playground', emoji: '🛝', answer: 'right' },
      { word: 'window', emoji: '🪟', answer: 'both' },
      { word: 'plant', emoji: '🪴', answer: 'both' },
    ],
  },
];

const HARD = [
  {
    id: 'round-red',
    leftLabel: 'Round',
    rightLabel: 'Red',
    items: [
      { word: 'ball', emoji: '⚽', answer: 'left' },
      { word: 'strawberry', emoji: '🍓', answer: 'both' },
      { word: 'tomato', emoji: '🍅', answer: 'both' },
      { word: 'ruler', emoji: '📏', answer: 'right' },
      { word: 'clock', emoji: '🕐', answer: 'left' },
      { word: 'stop sign', emoji: '🛑', answer: 'both' },
      { word: 'fire truck', emoji: '🚒', answer: 'right' },
    ],
  },
  {
    id: 'two-legs-four-legs',
    leftLabel: '2 Legs',
    rightLabel: '4 Legs',
    items: [
      { word: 'chicken', emoji: '🐔', answer: 'left' },
      { word: 'dog', emoji: '🐶', answer: 'right' },
      { word: 'person', emoji: '🧑', answer: 'left' },
      { word: 'cat', emoji: '🐱', answer: 'right' },
      { word: 'ostrich', emoji: '🦅', answer: 'left' },
      { word: 'horse', emoji: '🐴', answer: 'right' },
    ],
  },
  {
    id: 'plants-animals',
    leftLabel: 'Plant',
    rightLabel: 'Animal',
    items: [
      { word: 'rose', emoji: '🌹', answer: 'left' },
      { word: 'bee', emoji: '🐝', answer: 'right' },
      { word: 'tree', emoji: '🌳', answer: 'left' },
      { word: 'fish', emoji: '🐟', answer: 'right' },
      { word: 'mushroom', emoji: '🍄', answer: 'left' },
      { word: 'cat', emoji: '🐱', answer: 'right' },
    ],
  },
];

export const VENN_ROUNDS = { easy: EASY, medium: MEDIUM, hard: HARD };
