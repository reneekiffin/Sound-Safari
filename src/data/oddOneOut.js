// Odd One Out (Zara the Zebra) — ages 3-6.
//
// Show a small row of items; three belong together by some rule and one
// is the odd one out.  Categories span shapes, colours, animals, food,
// vehicles, size, habitats, emotions, weather, and clothing.
//
// Large pools per tier (20+ rounds) so replays feel fresh — kids
// practise the concept of "which one doesn't belong" across varied
// contexts rather than memorising specific items.

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
  { id: 'sh4', category: 'shape', prompt: 'Which shape is different?', items: [
    { emoji: '💠', label: 'diamond' },
    { emoji: '💠', label: 'diamond' },
    { emoji: '⭕', label: 'circle', odd: true },
    { emoji: '💠', label: 'diamond' },
  ]},
  { id: 'sh5', category: 'shape', prompt: 'Which one does not belong?', items: [
    { emoji: '🟣', label: 'purple circle' },
    { emoji: '🟣', label: 'purple circle' },
    { emoji: '🟣', label: 'purple circle' },
    { emoji: '⬜', label: 'white square', odd: true },
  ]},
];

const COLOURS = [
  { id: 'co1', category: 'colour', prompt: 'Which colour is different?', items: [
    { emoji: '🔴', label: 'red' }, { emoji: '🔴', label: 'red' }, { emoji: '🟢', label: 'green', odd: true }, { emoji: '🔴', label: 'red' },
  ]},
  { id: 'co2', category: 'colour', prompt: 'Which one is different?', items: [
    { emoji: '🟡', label: 'yellow' }, { emoji: '🟡', label: 'yellow' }, { emoji: '🟡', label: 'yellow' }, { emoji: '🔵', label: 'blue', odd: true },
  ]},
  { id: 'co3', category: 'colour', prompt: 'Which one is different?', items: [
    { emoji: '🟣', label: 'purple' }, { emoji: '🟣', label: 'purple' }, { emoji: '🟠', label: 'orange', odd: true }, { emoji: '🟣', label: 'purple' },
  ]},
  { id: 'co4', category: 'colour', prompt: 'Which one is a different colour?', items: [
    { emoji: '🌲', label: 'green tree' }, { emoji: '🥬', label: 'green lettuce' }, { emoji: '🍎', label: 'red apple', odd: true }, { emoji: '🥒', label: 'green cucumber' },
  ]},
  { id: 'co5', category: 'colour', prompt: 'Which one is not red?', items: [
    { emoji: '🍎', label: 'red apple' }, { emoji: '🍓', label: 'red strawberry' }, { emoji: '🍋', label: 'yellow lemon', odd: true }, { emoji: '🍅', label: 'red tomato' },
  ]},
];

const ANIMALS = [
  { id: 'an1', category: 'animal', prompt: 'Which one is not a pet?', items: [
    { emoji: '🐱', label: 'cat' }, { emoji: '🐶', label: 'dog' }, { emoji: '🦁', label: 'lion', odd: true }, { emoji: '🐰', label: 'rabbit' },
  ]},
  { id: 'an2', category: 'animal', prompt: 'Which one cannot fly?', items: [
    { emoji: '🐦', label: 'bird' }, { emoji: '🦋', label: 'butterfly' }, { emoji: '🐠', label: 'fish', odd: true }, { emoji: '🦅', label: 'eagle' },
  ]},
  { id: 'an3', category: 'animal', prompt: 'Which one lives in water?', items: [
    { emoji: '🐴', label: 'horse' }, { emoji: '🐄', label: 'cow' }, { emoji: '🐟', label: 'fish', odd: true }, { emoji: '🐖', label: 'pig' },
  ]},
  { id: 'an4', category: 'animal', prompt: 'Which one is not a bird?', items: [
    { emoji: '🦜', label: 'parrot' }, { emoji: '🦉', label: 'owl' }, { emoji: '🦇', label: 'bat', odd: true }, { emoji: '🐤', label: 'chick' },
  ]},
  { id: 'an5', category: 'animal', prompt: 'Which one is not a mammal?', items: [
    { emoji: '🐄', label: 'cow' }, { emoji: '🐕', label: 'dog' }, { emoji: '🐍', label: 'snake', odd: true }, { emoji: '🐈', label: 'cat' },
  ]},
  { id: 'an6', category: 'animal', prompt: 'Which one does not hop?', items: [
    { emoji: '🐸', label: 'frog' }, { emoji: '🦘', label: 'kangaroo' }, { emoji: '🐰', label: 'rabbit' }, { emoji: '🐌', label: 'snail', odd: true },
  ]},
  { id: 'an7', category: 'animal', prompt: 'Which one is wild?', items: [
    { emoji: '🐄', label: 'cow' }, { emoji: '🐑', label: 'sheep' }, { emoji: '🐯', label: 'tiger', odd: true }, { emoji: '🐓', label: 'chicken' },
  ]},
];

const FOOD = [
  { id: 'fo1', category: 'food', prompt: 'Which one is not a fruit?', items: [
    { emoji: '🍎', label: 'apple' }, { emoji: '🍌', label: 'banana' }, { emoji: '🥕', label: 'carrot', odd: true }, { emoji: '🍇', label: 'grapes' },
  ]},
  { id: 'fo2', category: 'food', prompt: 'Which one is not a vegetable?', items: [
    { emoji: '🥦', label: 'broccoli' }, { emoji: '🥕', label: 'carrot' }, { emoji: '🍓', label: 'strawberry', odd: true }, { emoji: '🥬', label: 'lettuce' },
  ]},
  { id: 'fo3', category: 'food', prompt: 'Which one is sweet?', items: [
    { emoji: '🥒', label: 'cucumber' }, { emoji: '🧅', label: 'onion' }, { emoji: '🍰', label: 'cake', odd: true }, { emoji: '🥬', label: 'lettuce' },
  ]},
  { id: 'fo4', category: 'food', prompt: 'Which one is a drink?', items: [
    { emoji: '🍞', label: 'bread' }, { emoji: '🥛', label: 'milk', odd: true }, { emoji: '🍕', label: 'pizza' }, { emoji: '🍪', label: 'cookie' },
  ]},
  { id: 'fo5', category: 'food', prompt: 'Which one is dessert?', items: [
    { emoji: '🥗', label: 'salad' }, { emoji: '🍝', label: 'pasta' }, { emoji: '🍨', label: 'ice cream', odd: true }, { emoji: '🥔', label: 'potato' },
  ]},
];

const VEHICLES = [
  { id: 've1', category: 'vehicle', prompt: 'Which one is not a vehicle?', items: [
    { emoji: '🚗', label: 'car' }, { emoji: '🚌', label: 'bus' }, { emoji: '🪑', label: 'chair', odd: true }, { emoji: '🚚', label: 'truck' },
  ]},
  { id: 've2', category: 'vehicle', prompt: 'Which one does not fly?', items: [
    { emoji: '✈️', label: 'plane' }, { emoji: '🚁', label: 'helicopter' }, { emoji: '🚂', label: 'train', odd: true }, { emoji: '🚀', label: 'rocket' },
  ]},
  { id: 've3', category: 'vehicle', prompt: 'Which one goes in the water?', items: [
    { emoji: '🚗', label: 'car' }, { emoji: '🚁', label: 'helicopter' }, { emoji: '⛴️', label: 'boat', odd: true }, { emoji: '🚲', label: 'bike' },
  ]},
  { id: 've4', category: 'vehicle', prompt: 'Which one has wheels?', items: [
    { emoji: '⛵', label: 'sailboat' }, { emoji: '✈️', label: 'plane' }, { emoji: '🚗', label: 'car', odd: true }, { emoji: '🚀', label: 'rocket' },
  ]},
];

const SIZE = [
  { id: 'sz1', category: 'size', prompt: 'Which is the biggest?', items: [
    { emoji: '🐜', label: 'ant' }, { emoji: '🐘', label: 'elephant', odd: true }, { emoji: '🐁', label: 'mouse' }, { emoji: '🐞', label: 'ladybug' },
  ]},
  { id: 'sz2', category: 'size', prompt: 'Which is the smallest?', items: [
    { emoji: '🐋', label: 'whale' }, { emoji: '🐴', label: 'horse' }, { emoji: '🐁', label: 'mouse', odd: true }, { emoji: '🐅', label: 'tiger' },
  ]},
  { id: 'sz3', category: 'size', prompt: 'Which is tallest?', items: [
    { emoji: '🐕', label: 'dog' }, { emoji: '🐈', label: 'cat' }, { emoji: '🦒', label: 'giraffe', odd: true }, { emoji: '🐇', label: 'rabbit' },
  ]},
];

const HABITATS = [
  { id: 'ha1', category: 'habitat', prompt: 'Which one lives in the jungle?', items: [
    { emoji: '🐻‍❄️', label: 'polar bear' }, { emoji: '🐧', label: 'penguin' }, { emoji: '🦜', label: 'parrot', odd: true }, { emoji: '🦭', label: 'seal' },
  ]},
  { id: 'ha2', category: 'habitat', prompt: 'Which one does not live on a farm?', items: [
    { emoji: '🐄', label: 'cow' }, { emoji: '🐑', label: 'sheep' }, { emoji: '🐔', label: 'chicken' }, { emoji: '🦒', label: 'giraffe', odd: true },
  ]},
  { id: 'ha3', category: 'habitat', prompt: 'Which one lives in cold places?', items: [
    { emoji: '🦁', label: 'lion' }, { emoji: '🐪', label: 'camel' }, { emoji: '🐧', label: 'penguin', odd: true }, { emoji: '🦒', label: 'giraffe' },
  ]},
  { id: 'ha4', category: 'habitat', prompt: 'Which one lives underground?', items: [
    { emoji: '🐦', label: 'bird' }, { emoji: '🐛', label: 'worm', odd: true }, { emoji: '🦋', label: 'butterfly' }, { emoji: '🐝', label: 'bee' },
  ]},
];

const EMOTIONS = [
  { id: 'em1', category: 'emotion', prompt: 'Which face is different?', items: [
    { emoji: '😀', label: 'happy' }, { emoji: '😀', label: 'happy' }, { emoji: '😢', label: 'sad', odd: true }, { emoji: '😀', label: 'happy' },
  ]},
  { id: 'em2', category: 'emotion', prompt: 'Which one is happy?', items: [
    { emoji: '😠', label: 'angry' }, { emoji: '😢', label: 'sad' }, { emoji: '😀', label: 'happy', odd: true }, { emoji: '😱', label: 'scared' },
  ]},
];

const WEATHER = [
  { id: 'wx1', category: 'weather', prompt: 'Which one is wet weather?', items: [
    { emoji: '☀️', label: 'sun' }, { emoji: '🌤️', label: 'partly sunny' }, { emoji: '🌧️', label: 'rain', odd: true }, { emoji: '⛅', label: 'cloudy sun' },
  ]},
  { id: 'wx2', category: 'weather', prompt: 'Which one is cold weather?', items: [
    { emoji: '☀️', label: 'sun' }, { emoji: '🌈', label: 'rainbow' }, { emoji: '❄️', label: 'snow', odd: true }, { emoji: '🌻', label: 'sunflower' },
  ]},
];

const CLOTHING = [
  { id: 'cl1', category: 'clothing', prompt: 'Which one is not clothing?', items: [
    { emoji: '👕', label: 'shirt' }, { emoji: '👖', label: 'jeans' }, { emoji: '🍎', label: 'apple', odd: true }, { emoji: '🧦', label: 'socks' },
  ]},
  { id: 'cl2', category: 'clothing', prompt: 'Which one keeps your feet warm?', items: [
    { emoji: '🧢', label: 'cap' }, { emoji: '🧤', label: 'gloves' }, { emoji: '🧦', label: 'socks', odd: true }, { emoji: '🧣', label: 'scarf' },
  ]},
];

// Tiers: easy = shapes/colours/simple animals; medium = more categories;
// hard = wider mix.  Each tier still gets 20+ rounds because the picker
// will spread across category tags.
const EASY = [
  ...SHAPES,
  ...COLOURS,
  ...ANIMALS.slice(0, 3),
  ...SIZE.slice(0, 2),
  ...EMOTIONS,
  ...WEATHER.slice(0, 1),
  ...CLOTHING.slice(0, 1),
];

const MEDIUM = [
  ...ANIMALS,
  ...FOOD,
  ...VEHICLES,
  ...HABITATS.slice(0, 2),
  ...SIZE.slice(1),
  ...WEATHER,
  ...CLOTHING,
];

const HARD = [
  ...HABITATS,
  ...ANIMALS.slice(3),
  ...FOOD.slice(2),
  ...VEHICLES.slice(1),
  ...SIZE,
  ...EMOTIONS,
  ...CLOTHING,
];

export const ODD_ONE_OUT_ROUNDS = { easy: EASY, medium: MEDIUM, hard: HARD };
