// Similarities (Finn the Frog) — two round shapes mixed in each session:
//   - "synonym"  kid picks the word closest in meaning to the prompt
//   - "category" kid picks the word that belongs in the group
//
// Each round carries `type` (shape) and `category: 'synonym'|'category'`
// so the session picker can balance shapes AND the game can filter to
// synonyms-only / categories-only / mixed via the in-game mode toggle.
// Kids can drill one type if they want to practise synonyms specifically
// or see both types mixed for variety.

const SYN_EASY = [
  { id: 'syn-happy', type: 'synonym', category: 'synonym', prompt: { word: 'happy', emoji: '😀' }, answer: 'glad', options: [
    { word: 'glad', emoji: '😊' }, { word: 'angry', emoji: '😠' }, { word: 'sleepy', emoji: '😴' },
  ]},
  { id: 'syn-big', type: 'synonym', category: 'synonym', prompt: { word: 'big', emoji: '🐘' }, answer: 'large', options: [
    { word: 'large', emoji: '🦣' }, { word: 'small', emoji: '🐜' }, { word: 'loud', emoji: '📢' },
  ]},
  { id: 'syn-small', type: 'synonym', category: 'synonym', prompt: { word: 'small', emoji: '🐜' }, answer: 'tiny', options: [
    { word: 'tiny', emoji: '🐁' }, { word: 'huge', emoji: '🐋' }, { word: 'hot', emoji: '🔥' },
  ]},
  { id: 'syn-fast', type: 'synonym', category: 'synonym', prompt: { word: 'fast', emoji: '🏎️' }, answer: 'quick', options: [
    { word: 'quick', emoji: '⚡' }, { word: 'slow', emoji: '🐢' }, { word: 'wet', emoji: '💧' },
  ]},
  { id: 'syn-smart', type: 'synonym', category: 'synonym', prompt: { word: 'smart', emoji: '🧠' }, answer: 'clever', options: [
    { word: 'clever', emoji: '💡' }, { word: 'silly', emoji: '🤪' }, { word: 'tired', emoji: '😴' },
  ]},
  { id: 'syn-pretty', type: 'synonym', category: 'synonym', prompt: { word: 'pretty', emoji: '🌸' }, answer: 'beautiful', options: [
    { word: 'beautiful', emoji: '🌺' }, { word: 'rough', emoji: '🪨' }, { word: 'old', emoji: '👴' },
  ]},
  { id: 'syn-cold', type: 'synonym', category: 'synonym', prompt: { word: 'cold', emoji: '❄️' }, answer: 'chilly', options: [
    { word: 'chilly', emoji: '🥶' }, { word: 'warm', emoji: '🌤️' }, { word: 'red', emoji: '🔴' },
  ]},
  { id: 'syn-angry', type: 'synonym', category: 'synonym', prompt: { word: 'angry', emoji: '😠' }, answer: 'mad', options: [
    { word: 'mad', emoji: '😡' }, { word: 'happy', emoji: '😀' }, { word: 'kind', emoji: '🤗' },
  ]},
  { id: 'syn-funny', type: 'synonym', category: 'synonym', prompt: { word: 'funny', emoji: '🤣' }, answer: 'silly', options: [
    { word: 'silly', emoji: '🤪' }, { word: 'sad', emoji: '😢' }, { word: 'quiet', emoji: '🤫' },
  ]},
  { id: 'syn-begin-easy', type: 'synonym', category: 'synonym', prompt: { word: 'begin', emoji: '🚦' }, answer: 'start', options: [
    { word: 'start', emoji: '🏁' }, { word: 'stop', emoji: '✋' }, { word: 'end', emoji: '🛑' },
  ]},
];

const SYN_MEDIUM = [
  { id: 'syn-tired', type: 'synonym', category: 'synonym', prompt: { word: 'tired', emoji: '😴' }, answer: 'sleepy', options: [
    { word: 'sleepy', emoji: '🥱' }, { word: 'awake', emoji: '☕' }, { word: 'angry', emoji: '😠' }, { word: 'busy', emoji: '🏃' },
  ]},
  { id: 'syn-scared', type: 'synonym', category: 'synonym', prompt: { word: 'scared', emoji: '😨' }, answer: 'afraid', options: [
    { word: 'afraid', emoji: '🫣' }, { word: 'brave', emoji: '🦁' }, { word: 'happy', emoji: '😀' }, { word: 'loud', emoji: '📢' },
  ]},
  { id: 'syn-laugh', type: 'synonym', category: 'synonym', prompt: { word: 'laugh', emoji: '😂' }, answer: 'giggle', options: [
    { word: 'giggle', emoji: '🤭' }, { word: 'cry', emoji: '😭' }, { word: 'shout', emoji: '😤' }, { word: 'frown', emoji: '😟' },
  ]},
  { id: 'syn-tough', type: 'synonym', category: 'synonym', prompt: { word: 'tough', emoji: '💪' }, answer: 'strong', options: [
    { word: 'strong', emoji: '🏋️' }, { word: 'gentle', emoji: '🕊️' }, { word: 'weak', emoji: '🥀' }, { word: 'easy', emoji: '🧘' },
  ]},
  { id: 'syn-shut', type: 'synonym', category: 'synonym', prompt: { word: 'shut', emoji: '🚪' }, answer: 'close', options: [
    { word: 'close', emoji: '🔒' }, { word: 'open', emoji: '🚪' }, { word: 'push', emoji: '🫷' }, { word: 'leave', emoji: '🏃' },
  ]},
  { id: 'syn-yell', type: 'synonym', category: 'synonym', prompt: { word: 'yell', emoji: '📣' }, answer: 'shout', options: [
    { word: 'shout', emoji: '😤' }, { word: 'whisper', emoji: '🤫' }, { word: 'sing', emoji: '🎤' }, { word: 'sigh', emoji: '😮‍💨' },
  ]},
  { id: 'syn-kind', type: 'synonym', category: 'synonym', prompt: { word: 'kind', emoji: '🤗' }, answer: 'nice', options: [
    { word: 'nice', emoji: '💖' }, { word: 'mean', emoji: '😠' }, { word: 'sad', emoji: '😢' }, { word: 'busy', emoji: '🏃' },
  ]},
  { id: 'syn-under', type: 'synonym', category: 'synonym', prompt: { word: 'under', emoji: '⬇️' }, answer: 'below', options: [
    { word: 'below', emoji: '⬇️' }, { word: 'above', emoji: '⬆️' }, { word: 'near', emoji: '📍' }, { word: 'far', emoji: '🛣️' },
  ]},
  { id: 'syn-gift', type: 'synonym', category: 'synonym', prompt: { word: 'gift', emoji: '🎁' }, answer: 'present', options: [
    { word: 'present', emoji: '🎁' }, { word: 'party', emoji: '🎉' }, { word: 'wish', emoji: '⭐' }, { word: 'cake', emoji: '🍰' },
  ]},
  { id: 'syn-pick', type: 'synonym', category: 'synonym', prompt: { word: 'pick', emoji: '👉' }, answer: 'choose', options: [
    { word: 'choose', emoji: '✅' }, { word: 'drop', emoji: '⬇️' }, { word: 'throw', emoji: '🪀' }, { word: 'eat', emoji: '🍽️' },
  ]},
  { id: 'syn-small-m', type: 'synonym', category: 'synonym', prompt: { word: 'little', emoji: '🐁' }, answer: 'small', options: [
    { word: 'small', emoji: '🐜' }, { word: 'giant', emoji: '🦣' }, { word: 'loud', emoji: '📢' }, { word: 'new', emoji: '✨' },
  ]},
  { id: 'syn-begin', type: 'synonym', category: 'synonym', prompt: { word: 'begin', emoji: '🚦' }, answer: 'start', options: [
    { word: 'start', emoji: '🏁' }, { word: 'finish', emoji: '🏆' }, { word: 'end', emoji: '🛑' }, { word: 'stop', emoji: '✋' },
  ]},
  { id: 'syn-quiet', type: 'synonym', category: 'synonym', prompt: { word: 'quiet', emoji: '🤫' }, answer: 'silent', options: [
    { word: 'silent', emoji: '🔇' }, { word: 'loud', emoji: '📢' }, { word: 'busy', emoji: '🏃' }, { word: 'wild', emoji: '🌪️' },
  ]},
];

const SYN_HARD = [
  { id: 'syn-ancient', type: 'synonym', category: 'synonym', prompt: { word: 'ancient', emoji: '🏛️' }, answer: 'old', options: [
    { word: 'old', emoji: '👴' }, { word: 'new', emoji: '✨' }, { word: 'shiny', emoji: '💎' }, { word: 'bright', emoji: '💡' },
  ]},
  { id: 'syn-enormous', type: 'synonym', category: 'synonym', prompt: { word: 'enormous', emoji: '🦣' }, answer: 'huge', options: [
    { word: 'huge', emoji: '🐋' }, { word: 'tiny', emoji: '🐜' }, { word: 'round', emoji: '⚪' }, { word: 'narrow', emoji: '📏' },
  ]},
  { id: 'syn-nearly', type: 'synonym', category: 'synonym', prompt: { word: 'nearly', emoji: '🎯' }, answer: 'almost', options: [
    { word: 'almost', emoji: '🎯' }, { word: 'never', emoji: '🚫' }, { word: 'always', emoji: '♾️' }, { word: 'quickly', emoji: '⚡' },
  ]},
  { id: 'syn-rapid', type: 'synonym', category: 'synonym', prompt: { word: 'rapid', emoji: '⚡' }, answer: 'fast', options: [
    { word: 'fast', emoji: '🏎️' }, { word: 'slow', emoji: '🐢' }, { word: 'wet', emoji: '💧' }, { word: 'sharp', emoji: '🔪' },
  ]},
  { id: 'syn-gentle', type: 'synonym', category: 'synonym', prompt: { word: 'gentle', emoji: '🕊️' }, answer: 'soft', options: [
    { word: 'soft', emoji: '🧸' }, { word: 'harsh', emoji: '🌵' }, { word: 'loud', emoji: '📢' }, { word: 'tough', emoji: '💪' },
  ]},
  { id: 'syn-brave', type: 'synonym', category: 'synonym', prompt: { word: 'brave', emoji: '🦁' }, answer: 'courageous', options: [
    { word: 'courageous', emoji: '💪' }, { word: 'timid', emoji: '🐁' }, { word: 'tired', emoji: '😴' }, { word: 'cold', emoji: '❄️' },
  ]},
  { id: 'syn-tiny-h', type: 'synonym', category: 'synonym', prompt: { word: 'tiny', emoji: '🐁' }, answer: 'minuscule', options: [
    { word: 'minuscule', emoji: '🔬' }, { word: 'enormous', emoji: '🦣' }, { word: 'loud', emoji: '📢' }, { word: 'bright', emoji: '💡' },
  ]},
];

const CAT_EASY = [
  { id: 'cat-fruit', type: 'category', category: 'category', prompt: { group: ['apple', 'banana', 'grape'], emoji: '🍎🍌🍇' }, answer: 'pear', options: [
    { word: 'pear', emoji: '🍐' }, { word: 'chair', emoji: '🪑' }, { word: 'shoe', emoji: '👟' },
  ]},
  { id: 'cat-pets', type: 'category', category: 'category', prompt: { group: ['dog', 'cat', 'rabbit'], emoji: '🐕🐈🐇' }, answer: 'hamster', options: [
    { word: 'hamster', emoji: '🐹' }, { word: 'cloud', emoji: '☁️' }, { word: 'book', emoji: '📚' },
  ]},
  { id: 'cat-weather', type: 'category', category: 'category', prompt: { group: ['rain', 'snow', 'wind'], emoji: '🌧️❄️🌬️' }, answer: 'sun', options: [
    { word: 'sun', emoji: '☀️' }, { word: 'pencil', emoji: '✏️' }, { word: 'shirt', emoji: '👕' },
  ]},
];

const CAT_MEDIUM = [
  { id: 'cat-inst', type: 'category', category: 'category', prompt: { group: ['drum', 'guitar', 'piano'], emoji: '🥁🎸🎹' }, answer: 'violin', options: [
    { word: 'violin', emoji: '🎻' }, { word: 'sock', emoji: '🧦' }, { word: 'carrot', emoji: '🥕' }, { word: 'train', emoji: '🚂' },
  ]},
  { id: 'cat-veh', type: 'category', category: 'category', prompt: { group: ['car', 'bus', 'truck'], emoji: '🚗🚌🚚' }, answer: 'bike', options: [
    { word: 'bike', emoji: '🚲' }, { word: 'shoe', emoji: '👟' }, { word: 'cup', emoji: '🥛' }, { word: 'table', emoji: '🪑' },
  ]},
  { id: 'cat-body', type: 'category', category: 'category', prompt: { group: ['hand', 'foot', 'knee'], emoji: '🫳🦶🦵' }, answer: 'elbow', options: [
    { word: 'elbow', emoji: '💪' }, { word: 'door', emoji: '🚪' }, { word: 'rain', emoji: '🌧️' }, { word: 'shelf', emoji: '📚' },
  ]},
  { id: 'cat-tools', type: 'category', category: 'category', prompt: { group: ['hammer', 'saw', 'drill'], emoji: '🔨🪚🔩' }, answer: 'wrench', options: [
    { word: 'wrench', emoji: '🔧' }, { word: 'spoon', emoji: '🥄' }, { word: 'cloud', emoji: '☁️' }, { word: 'leaf', emoji: '🍃' },
  ]},
  { id: 'cat-colours', type: 'category', category: 'category', prompt: { group: ['red', 'blue', 'green'], emoji: '🔴🔵🟢' }, answer: 'yellow', options: [
    { word: 'yellow', emoji: '🟡' }, { word: 'piano', emoji: '🎹' }, { word: 'lake', emoji: '🏞️' }, { word: 'cat', emoji: '🐈' },
  ]},
];

// Pools per difficulty now mix synonym and category rounds, with category
// tags so the session picker balances both shapes automatically.
export const SIMILARITIES_ROUNDS = {
  easy: [...SYN_EASY, ...CAT_EASY],
  medium: [...SYN_MEDIUM, ...CAT_MEDIUM],
  hard: [...SYN_HARD, ...CAT_MEDIUM.slice(-2)],
};

// Filter helpers for the in-game mode toggle (Synonyms / Categories / Mixed).
export function filterSimilaritiesByMode(pool, mode) {
  if (!mode || mode === 'mixed') return pool;
  return pool.filter((r) => r.type === mode);
}
