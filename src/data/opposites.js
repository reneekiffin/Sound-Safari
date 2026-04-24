// Opposites (ages 5-8, hosted by Toby the Toucan).
//
// Kid hears and sees a word (plus a supporting emoji).  Taps the option
// with the opposite meaning.  Distractors include near-synonyms, unrelated
// words, and same-category-but-wrong-end-of-spectrum traps so the kid has
// to think about meaning, not just association.

const EASY = [
  { id: 'hot', prompt: { word: 'hot', emoji: '🔥' }, answer: 'cold', options: [
    { word: 'cold', emoji: '❄️' }, { word: 'warm', emoji: '🌤️' }, { word: 'spicy', emoji: '🌶️' },
  ]},
  { id: 'big', prompt: { word: 'big', emoji: '🐘' }, answer: 'small', options: [
    { word: 'small', emoji: '🐜' }, { word: 'large', emoji: '🦣' }, { word: 'tall', emoji: '🦒' },
  ]},
  { id: 'up', prompt: { word: 'up', emoji: '⬆️' }, answer: 'down', options: [
    { word: 'down', emoji: '⬇️' }, { word: 'over', emoji: '➡️' }, { word: 'top', emoji: '🔝' },
  ]},
  { id: 'happy', prompt: { word: 'happy', emoji: '😀' }, answer: 'sad', options: [
    { word: 'sad', emoji: '😢' }, { word: 'mad', emoji: '😠' }, { word: 'glad', emoji: '😊' },
  ]},
  { id: 'day', prompt: { word: 'day', emoji: '🌞' }, answer: 'night', options: [
    { word: 'night', emoji: '🌙' }, { word: 'sun', emoji: '☀️' }, { word: 'star', emoji: '⭐' },
  ]},
  { id: 'fast', prompt: { word: 'fast', emoji: '🏎️' }, answer: 'slow', options: [
    { word: 'slow', emoji: '🐢' }, { word: 'quick', emoji: '⚡' }, { word: 'speedy', emoji: '🏃' },
  ]},
  { id: 'wet', prompt: { word: 'wet', emoji: '💧' }, answer: 'dry', options: [
    { word: 'dry', emoji: '🏜️' }, { word: 'damp', emoji: '🌧️' }, { word: 'puddle', emoji: '💦' },
  ]},
  { id: 'loud', prompt: { word: 'loud', emoji: '📢' }, answer: 'quiet', options: [
    { word: 'quiet', emoji: '🤫' }, { word: 'noisy', emoji: '🔊' }, { word: 'shout', emoji: '😤' },
  ]},
  { id: 'full', prompt: { word: 'full', emoji: '🥛' }, answer: 'empty', options: [
    { word: 'empty', emoji: '🫙' }, { word: 'heavy', emoji: '🏋️' }, { word: 'spill', emoji: '💦' },
  ]},
  { id: 'old', prompt: { word: 'old', emoji: '👴' }, answer: 'young', options: [
    { word: 'young', emoji: '👶' }, { word: 'new', emoji: '✨' }, { word: 'wise', emoji: '🧠' },
  ]},
];

const MEDIUM = [
  { id: 'brave', prompt: { word: 'brave', emoji: '🦁' }, answer: 'scared', options: [
    { word: 'scared', emoji: '😨' }, { word: 'bold', emoji: '💪' }, { word: 'angry', emoji: '😠' }, { word: 'loud', emoji: '📢' },
  ]},
  { id: 'hard', prompt: { word: 'hard', emoji: '🪨' }, answer: 'soft', options: [
    { word: 'soft', emoji: '🧸' }, { word: 'bumpy', emoji: '🎢' }, { word: 'sharp', emoji: '🔪' }, { word: 'stiff', emoji: '📏' },
  ]},
  { id: 'early', prompt: { word: 'early', emoji: '🌅' }, answer: 'late', options: [
    { word: 'late', emoji: '🌆' }, { word: 'soon', emoji: '⏰' }, { word: 'fast', emoji: '🏃' }, { word: 'morning', emoji: '🌞' },
  ]},
  { id: 'heavy', prompt: { word: 'heavy', emoji: '🏋️' }, answer: 'light', options: [
    { word: 'light', emoji: '🪶' }, { word: 'thick', emoji: '📚' }, { word: 'weight', emoji: '⚖️' }, { word: 'solid', emoji: '🧱' },
  ]},
  { id: 'open', prompt: { word: 'open', emoji: '🚪' }, answer: 'closed', options: [
    { word: 'closed', emoji: '🚫' }, { word: 'door', emoji: '🚪' }, { word: 'wide', emoji: '↔️' }, { word: 'loose', emoji: '🪢' },
  ]},
  { id: 'push', prompt: { word: 'push', emoji: '🫷' }, answer: 'pull', options: [
    { word: 'pull', emoji: '🪢' }, { word: 'press', emoji: '👆' }, { word: 'shove', emoji: '💪' }, { word: 'lift', emoji: '🆙' },
  ]},
  { id: 'give', prompt: { word: 'give', emoji: '🎁' }, answer: 'take', options: [
    { word: 'take', emoji: '✋' }, { word: 'share', emoji: '🤝' }, { word: 'offer', emoji: '🤲' }, { word: 'keep', emoji: '🔒' },
  ]},
  { id: 'smooth', prompt: { word: 'smooth', emoji: '🪨' }, answer: 'rough', options: [
    { word: 'rough', emoji: '🪵' }, { word: 'slick', emoji: '🧊' }, { word: 'flat', emoji: '📃' }, { word: 'shiny', emoji: '✨' },
  ]},
  { id: 'sweet', prompt: { word: 'sweet', emoji: '🍭' }, answer: 'sour', options: [
    { word: 'sour', emoji: '🍋' }, { word: 'sugary', emoji: '🍬' }, { word: 'bitter', emoji: '☕' }, { word: 'tasty', emoji: '😋' },
  ]},
];

const HARD = [
  { id: 'arrive', prompt: { word: 'arrive', emoji: '🛬' }, answer: 'leave', options: [
    { word: 'leave', emoji: '🛫' }, { word: 'wait', emoji: '⏳' }, { word: 'come', emoji: '🚶' }, { word: 'enter', emoji: '🚪' },
  ]},
  { id: 'begin', prompt: { word: 'begin', emoji: '🚦' }, answer: 'end', options: [
    { word: 'end', emoji: '🏁' }, { word: 'start', emoji: '🏃' }, { word: 'open', emoji: '🚪' }, { word: 'new', emoji: '✨' },
  ]},
  { id: 'generous', prompt: { word: 'generous', emoji: '🎁' }, answer: 'selfish', options: [
    { word: 'selfish', emoji: '😒' }, { word: 'kind', emoji: '🤝' }, { word: 'sharing', emoji: '🫶' }, { word: 'greedy', emoji: '💰' },
  ]},
  { id: 'ancient', prompt: { word: 'ancient', emoji: '🏛️' }, answer: 'modern', options: [
    { word: 'modern', emoji: '🏙️' }, { word: 'old', emoji: '👴' }, { word: 'dusty', emoji: '🕸️' }, { word: 'tired', emoji: '😴' },
  ]},
  { id: 'expand', prompt: { word: 'expand', emoji: '🎈' }, answer: 'shrink', options: [
    { word: 'shrink', emoji: '🫧' }, { word: 'grow', emoji: '🌱' }, { word: 'stretch', emoji: '↔️' }, { word: 'pop', emoji: '💥' },
  ]},
];

export const OPPOSITES_ROUNDS = { easy: EASY, medium: MEDIUM, hard: HARD };
