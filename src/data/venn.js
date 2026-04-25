// Venn Diagrams (Ollie the Owl) — ages 6-10.
//
// Each round shows two overlapping circles with labels.  Kids place
// items one at a time into one of three regions:
//   'left'   — only the left label applies
//   'right'  — only the right label applies
//   'both'   — the item belongs in the intersection
//
// Teaches set intersection, exclusion, and union in a tangible way.
//
// Round shape:
//   {
//     id, leftLabel, rightLabel,
//     items: [{ word, emoji, answer: 'left'|'right'|'both' }, ...],
//   }
//
// Authoring notes (carried over from the user's feedback):
//   - The "both" region must contain items that genuinely fit both
//     labels — not borderline cases.  Strawberries-as-sweet-AND-sour
//     was confusing, replaced with land-and-water animals (frogs,
//     ducks, turtles, crocodiles) which obviously belong in both.
//   - We aim for ~3 "left only", ~3 "right only", ~2 "both" per
//     diagram so kids see a healthy mix.

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
    // Replaces sweet/sour — strawberries-and-green-apples-in-both was
    // confusing.  Land+water animals (frog, duck, turtle, crocodile)
    // genuinely belong in both regions.
    id: 'land-water',
    leftLabel: 'Lives on Land',
    rightLabel: 'Lives in Water',
    items: [
      { word: 'cat', emoji: '🐈', answer: 'left' },
      { word: 'tiger', emoji: '🐅', answer: 'left' },
      { word: 'fish', emoji: '🐟', answer: 'right' },
      { word: 'shark', emoji: '🦈', answer: 'right' },
      { word: 'frog', emoji: '🐸', answer: 'both' },
      { word: 'duck', emoji: '🦆', answer: 'both' },
      { word: 'turtle', emoji: '🐢', answer: 'both' },
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
  {
    // NEW — clothing per request.  "Both" = items worn year-round.
    id: 'summer-winter-clothes',
    leftLabel: 'Summer',
    rightLabel: 'Winter',
    items: [
      { word: 'flip flops', emoji: '🩴', answer: 'left' },
      { word: 'shorts', emoji: '🩳', answer: 'left' },
      { word: 'sunglasses', emoji: '🕶️', answer: 'left' },
      { word: 'coat', emoji: '🧥', answer: 'right' },
      { word: 'mittens', emoji: '🧤', answer: 'right' },
      { word: 'scarf', emoji: '🧣', answer: 'right' },
      { word: 't-shirt', emoji: '👕', answer: 'both' },
      { word: 'sneakers', emoji: '👟', answer: 'both' },
      { word: 'jeans', emoji: '👖', answer: 'both' },
    ],
  },
  {
    // NEW — vacation per request.  "Both" = items you'd pack on
    // either kind of trip.
    id: 'beach-mountain',
    leftLabel: 'Beach Trip',
    rightLabel: 'Mountain Trip',
    items: [
      { word: 'shell', emoji: '🐚', answer: 'left' },
      { word: 'wave', emoji: '🌊', answer: 'left' },
      { word: 'flip flops', emoji: '🩴', answer: 'left' },
      { word: 'tent', emoji: '⛺', answer: 'right' },
      { word: 'hiking boots', emoji: '🥾', answer: 'right' },
      { word: 'pine tree', emoji: '🌲', answer: 'right' },
      { word: 'backpack', emoji: '🎒', answer: 'both' },
      { word: 'camera', emoji: '📷', answer: 'both' },
      { word: 'sunscreen', emoji: '🧴', answer: 'both' },
    ],
  },
  {
    // NEW — kitchen/bathroom split with cleaner shared items than
    // most Venns. Soap, sponge, mirror genuinely belong in both rooms
    // so the intersection is unambiguous for kids.
    id: 'kitchen-bathroom',
    leftLabel: 'Kitchen',
    rightLabel: 'Bathroom',
    items: [
      { word: 'frying pan', emoji: '🍳', answer: 'left' },
      { word: 'spoon', emoji: '🥄', answer: 'left' },
      { word: 'plate', emoji: '🍽️', answer: 'left' },
      { word: 'toilet', emoji: '🚽', answer: 'right' },
      { word: 'toothbrush', emoji: '🪥', answer: 'right' },
      { word: 'bathtub', emoji: '🛁', answer: 'right' },
      { word: 'soap', emoji: '🧼', answer: 'both' },
      { word: 'mirror', emoji: '🪞', answer: 'both' },
      { word: 'sponge', emoji: '🧽', answer: 'both' },
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
  {
    // NEW — items used at home AND school (book, pencil, lunchbox)
    // make a clean intersection.
    id: 'home-school',
    leftLabel: 'At Home',
    rightLabel: 'At School',
    items: [
      { word: 'bed', emoji: '🛏️', answer: 'left' },
      { word: 'sofa', emoji: '🛋️', answer: 'left' },
      { word: 'bathtub', emoji: '🛁', answer: 'left' },
      { word: 'chalkboard', emoji: '🪧', answer: 'right' },
      { word: 'school bus', emoji: '🚌', answer: 'right' },
      { word: 'backpack', emoji: '🎒', answer: 'right' },
      { word: 'book', emoji: '📚', answer: 'both' },
      { word: 'pencil', emoji: '✏️', answer: 'both' },
      { word: 'lunchbox', emoji: '🥪', answer: 'both' },
    ],
  },
];

export const VENN_ROUNDS = { easy: EASY, medium: MEDIUM, hard: HARD };
