// Similarities (ages 6-9, hosted by Finn the Frog).
//
// Teaches synonyms and category matching — "which word means about the
// same as this word?" and "which of these goes together?"
//
// Round shapes:
//   - "synonym"  kid picks the word closest in meaning to the prompt.
//   - "category" kid picks the word that belongs in the same group as
//                three words shown (e.g. apple, banana, grape → pear,
//                not chair).
//
// The data structure is unified to keep the picker simple.

const EASY = [
  { id: 'happy', type: 'synonym', prompt: { word: 'happy', emoji: '😀' }, answer: 'glad', options: [
    { word: 'glad', emoji: '😊' }, { word: 'angry', emoji: '😠' }, { word: 'sleepy', emoji: '😴' },
  ]},
  { id: 'big', type: 'synonym', prompt: { word: 'big', emoji: '🐘' }, answer: 'large', options: [
    { word: 'large', emoji: '🦣' }, { word: 'small', emoji: '🐜' }, { word: 'loud', emoji: '📢' },
  ]},
  { id: 'small', type: 'synonym', prompt: { word: 'small', emoji: '🐜' }, answer: 'tiny', options: [
    { word: 'tiny', emoji: '🐁' }, { word: 'huge', emoji: '🐋' }, { word: 'hot', emoji: '🔥' },
  ]},
  { id: 'fast', type: 'synonym', prompt: { word: 'fast', emoji: '🏎️' }, answer: 'quick', options: [
    { word: 'quick', emoji: '⚡' }, { word: 'slow', emoji: '🐢' }, { word: 'wet', emoji: '💧' },
  ]},
  { id: 'smart', type: 'synonym', prompt: { word: 'smart', emoji: '🧠' }, answer: 'clever', options: [
    { word: 'clever', emoji: '💡' }, { word: 'silly', emoji: '🤪' }, { word: 'tired', emoji: '😴' },
  ]},
  { id: 'pretty', type: 'synonym', prompt: { word: 'pretty', emoji: '🌸' }, answer: 'beautiful', options: [
    { word: 'beautiful', emoji: '🌺' }, { word: 'rough', emoji: '🪨' }, { word: 'old', emoji: '👴' },
  ]},

  { id: 'fruit', type: 'category', prompt: { group: ['apple', 'banana', 'grape'], emoji: '🍎🍌🍇' }, answer: 'pear', options: [
    { word: 'pear', emoji: '🍐' }, { word: 'chair', emoji: '🪑' }, { word: 'shoe', emoji: '👟' },
  ]},
  { id: 'pets', type: 'category', prompt: { group: ['dog', 'cat', 'rabbit'], emoji: '🐕🐈🐇' }, answer: 'hamster', options: [
    { word: 'hamster', emoji: '🐹' }, { word: 'cloud', emoji: '☁️' }, { word: 'book', emoji: '📚' },
  ]},
  { id: 'weather', type: 'category', prompt: { group: ['rain', 'snow', 'wind'], emoji: '🌧️❄️🌬️' }, answer: 'sun', options: [
    { word: 'sun', emoji: '☀️' }, { word: 'pencil', emoji: '✏️' }, { word: 'shirt', emoji: '👕' },
  ]},
];

const MEDIUM = [
  { id: 'tired', type: 'synonym', prompt: { word: 'tired', emoji: '😴' }, answer: 'sleepy', options: [
    { word: 'sleepy', emoji: '🥱' }, { word: 'awake', emoji: '☕' }, { word: 'angry', emoji: '😠' }, { word: 'busy', emoji: '🏃' },
  ]},
  { id: 'scared', type: 'synonym', prompt: { word: 'scared', emoji: '😨' }, answer: 'afraid', options: [
    { word: 'afraid', emoji: '🫣' }, { word: 'brave', emoji: '🦁' }, { word: 'happy', emoji: '😀' }, { word: 'loud', emoji: '📢' },
  ]},
  { id: 'laugh', type: 'synonym', prompt: { word: 'laugh', emoji: '😂' }, answer: 'giggle', options: [
    { word: 'giggle', emoji: '🤭' }, { word: 'cry', emoji: '😭' }, { word: 'shout', emoji: '😤' }, { word: 'frown', emoji: '😟' },
  ]},
  { id: 'tough', type: 'synonym', prompt: { word: 'tough', emoji: '💪' }, answer: 'strong', options: [
    { word: 'strong', emoji: '🏋️' }, { word: 'gentle', emoji: '🕊️' }, { word: 'weak', emoji: '🥀' }, { word: 'easy', emoji: '🧘' },
  ]},
  { id: 'begin', type: 'synonym', prompt: { word: 'begin', emoji: '🚦' }, answer: 'start', options: [
    { word: 'start', emoji: '🏁' }, { word: 'finish', emoji: '🏆' }, { word: 'end', emoji: '🛑' }, { word: 'stop', emoji: '✋' },
  ]},

  { id: 'instruments', type: 'category', prompt: { group: ['drum', 'guitar', 'piano'], emoji: '🥁🎸🎹' }, answer: 'violin', options: [
    { word: 'violin', emoji: '🎻' }, { word: 'sock', emoji: '🧦' }, { word: 'carrot', emoji: '🥕' }, { word: 'train', emoji: '🚂' },
  ]},
  { id: 'vehicles', type: 'category', prompt: { group: ['car', 'bus', 'truck'], emoji: '🚗🚌🚚' }, answer: 'bike', options: [
    { word: 'bike', emoji: '🚲' }, { word: 'shoe', emoji: '👟' }, { word: 'cup', emoji: '🥛' }, { word: 'table', emoji: '🪑' },
  ]},
  { id: 'body', type: 'category', prompt: { group: ['hand', 'foot', 'knee'], emoji: '🫳🦶🦵' }, answer: 'elbow', options: [
    { word: 'elbow', emoji: '💪' }, { word: 'door', emoji: '🚪' }, { word: 'rain', emoji: '🌧️' }, { word: 'shelf', emoji: '📚' },
  ]},
];

const HARD = [
  { id: 'ancient', type: 'synonym', prompt: { word: 'ancient', emoji: '🏛️' }, answer: 'old', options: [
    { word: 'old', emoji: '👴' }, { word: 'new', emoji: '✨' }, { word: 'shiny', emoji: '💎' }, { word: 'bright', emoji: '💡' },
  ]},
  { id: 'enormous', type: 'synonym', prompt: { word: 'enormous', emoji: '🦣' }, answer: 'huge', options: [
    { word: 'huge', emoji: '🐋' }, { word: 'tiny', emoji: '🐜' }, { word: 'round', emoji: '⚪' }, { word: 'narrow', emoji: '📏' },
  ]},
  { id: 'nearly', type: 'synonym', prompt: { word: 'nearly', emoji: '🎯' }, answer: 'almost', options: [
    { word: 'almost', emoji: '🎯' }, { word: 'never', emoji: '🚫' }, { word: 'always', emoji: '♾️' }, { word: 'quickly', emoji: '⚡' },
  ]},
];

export const SIMILARITIES_ROUNDS = { easy: EASY, medium: MEDIUM, hard: HARD };
