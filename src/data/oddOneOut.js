// Odd One Out (Zara the Zebra) — ages 3-6.
//
// Show a small row of items.  Three belong together by some rule (colour,
// shape, category, size).  One is the odd one out.  Kid taps the odd one.
//
// Round shape:
//   { id, prompt, category, items: [{ emoji, label, odd? }, ...] }
//
// Category tags let the session picker serve a balanced mix — shapes,
// colours, animals, food, vehicles — so replays feel fresh even when the
// kid only sits for the easy tier.

const SHAPES = [
  { id: 'sh1', category: 'shape', prompt: 'Which shape is different?', items: [
    { emoji: '🟠', label: 'circle' },
    { emoji: '🟠', label: 'circle' },
    { emoji: '🟦', label: 'square', odd: true },
    { emoji: '🟠', label: 'circle' },
  ]},
  { id: 'sh2', category: 'shape', prompt: 'Which one does not belong?', items: [
    { emoji: '🔺', label: 'triangle' },
    { emoji: '🔺', label: 'triangle' },
    { emoji: '🔺', label: 'triangle' },
    { emoji: '⭐', label: 'star', odd: true },
  ]},
  { id: 'sh3', category: 'shape', prompt: 'Which shape is different?', items: [
    { emoji: '⬛', label: 'square' },
    { emoji: '⬛', label: 'square' },
    { emoji: '🔶', label: 'diamond', odd: true },
    { emoji: '⬛', label: 'square' },
  ]},
];

const COLOURS = [
  { id: 'co1', category: 'colour', prompt: 'Which colour is different?', items: [
    { emoji: '🔴', label: 'red' },
    { emoji: '🔴', label: 'red' },
    { emoji: '🟢', label: 'green', odd: true },
    { emoji: '🔴', label: 'red' },
  ]},
  { id: 'co2', category: 'colour', prompt: 'Which one is different?', items: [
    { emoji: '🟡', label: 'yellow' },
    { emoji: '🟡', label: 'yellow' },
    { emoji: '🟡', label: 'yellow' },
    { emoji: '🔵', label: 'blue', odd: true },
  ]},
  { id: 'co3', category: 'colour', prompt: 'Which one is different?', items: [
    { emoji: '🟣', label: 'purple' },
    { emoji: '🟣', label: 'purple' },
    { emoji: '🟠', label: 'orange', odd: true },
    { emoji: '🟣', label: 'purple' },
  ]},
];

const ANIMALS = [
  { id: 'an1', category: 'animal', prompt: 'Which one is not a pet?', items: [
    { emoji: '🐱', label: 'cat' },
    { emoji: '🐶', label: 'dog' },
    { emoji: '🦁', label: 'lion', odd: true },
    { emoji: '🐰', label: 'rabbit' },
  ]},
  { id: 'an2', category: 'animal', prompt: 'Which one cannot fly?', items: [
    { emoji: '🐦', label: 'bird' },
    { emoji: '🦋', label: 'butterfly' },
    { emoji: '🐠', label: 'fish', odd: true },
    { emoji: '🦅', label: 'eagle' },
  ]},
  { id: 'an3', category: 'animal', prompt: 'Which one lives in water?', items: [
    { emoji: '🐴', label: 'horse' },
    { emoji: '🐄', label: 'cow' },
    { emoji: '🐟', label: 'fish', odd: true },
    { emoji: '🐖', label: 'pig' },
  ]},
  { id: 'an4', category: 'animal', prompt: 'Which one is not a bird?', items: [
    { emoji: '🦜', label: 'parrot' },
    { emoji: '🦉', label: 'owl' },
    { emoji: '🦇', label: 'bat', odd: true },
    { emoji: '🐤', label: 'chick' },
  ]},
];

const FOOD = [
  { id: 'fo1', category: 'food', prompt: 'Which one is not a fruit?', items: [
    { emoji: '🍎', label: 'apple' },
    { emoji: '🍌', label: 'banana' },
    { emoji: '🥕', label: 'carrot', odd: true },
    { emoji: '🍇', label: 'grapes' },
  ]},
  { id: 'fo2', category: 'food', prompt: 'Which one is not a vegetable?', items: [
    { emoji: '🥦', label: 'broccoli' },
    { emoji: '🥕', label: 'carrot' },
    { emoji: '🍓', label: 'strawberry', odd: true },
    { emoji: '🥬', label: 'lettuce' },
  ]},
  { id: 'fo3', category: 'food', prompt: 'Which one is sweet?', items: [
    { emoji: '🥒', label: 'cucumber' },
    { emoji: '🧅', label: 'onion' },
    { emoji: '🍰', label: 'cake', odd: true },
    { emoji: '🥬', label: 'lettuce' },
  ]},
];

const VEHICLES = [
  { id: 've1', category: 'vehicle', prompt: 'Which one is not a vehicle?', items: [
    { emoji: '🚗', label: 'car' },
    { emoji: '🚌', label: 'bus' },
    { emoji: '🪑', label: 'chair', odd: true },
    { emoji: '🚚', label: 'truck' },
  ]},
  { id: 've2', category: 'vehicle', prompt: 'Which one does not fly?', items: [
    { emoji: '✈️', label: 'plane' },
    { emoji: '🚁', label: 'helicopter' },
    { emoji: '🚂', label: 'train', odd: true },
    { emoji: '🚀', label: 'rocket' },
  ]},
];

const SIZE = [
  { id: 'sz1', category: 'size', prompt: 'Which is the biggest?', items: [
    { emoji: '🐜', label: 'ant' },
    { emoji: '🐘', label: 'elephant', odd: true },
    { emoji: '🐁', label: 'mouse' },
    { emoji: '🐞', label: 'ladybug' },
  ]},
  { id: 'sz2', category: 'size', prompt: 'Which is the smallest?', items: [
    { emoji: '🐋', label: 'whale' },
    { emoji: '🐴', label: 'horse' },
    { emoji: '🐁', label: 'mouse', odd: true },
    { emoji: '🐅', label: 'tiger' },
  ]},
];

const HABITATS = [
  { id: 'ha1', category: 'habitat', prompt: 'Which one lives in the jungle?', items: [
    { emoji: '🐻‍❄️', label: 'polar bear' },
    { emoji: '🐧', label: 'penguin' },
    { emoji: '🦜', label: 'parrot', odd: true },
    { emoji: '🦭', label: 'seal' },
  ]},
  { id: 'ha2', category: 'habitat', prompt: 'Which one does not live on a farm?', items: [
    { emoji: '🐄', label: 'cow' },
    { emoji: '🐑', label: 'sheep' },
    { emoji: '🐔', label: 'chicken' },
    { emoji: '🦒', label: 'giraffe', odd: true },
  ]},
];

const EASY = [...SHAPES, ...COLOURS, ...SIZE.slice(0, 1)];
const MEDIUM = [...ANIMALS, ...FOOD, ...VEHICLES];
const HARD = [...HABITATS, ...SIZE.slice(1), ...ANIMALS.slice(2)];

export const ODD_ONE_OUT_ROUNDS = { easy: EASY, medium: MEDIUM, hard: HARD };
