// Opposites (Toby the Toucan) — 20+ rounds per tier.
//
// Kid hears the prompt word, taps the option with the opposite meaning.
// Distractors include near-synonyms and same-category-different-direction
// traps so the kid has to think about meaning, not just association.
//
// Pools are deliberately large so the session picker can serve a fresh
// 10-round set on each replay — kids don't memorise answers, they
// practise the concept.

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
  { id: 'high', prompt: { word: 'high', emoji: '⛰️' }, answer: 'low', options: [
    { word: 'low', emoji: '🕳️' }, { word: 'tall', emoji: '🦒' }, { word: 'up', emoji: '⬆️' },
  ]},
  { id: 'in', prompt: { word: 'in', emoji: '📥' }, answer: 'out', options: [
    { word: 'out', emoji: '📤' }, { word: 'on', emoji: '🔛' }, { word: 'through', emoji: '➡️' },
  ]},
  { id: 'on', prompt: { word: 'on', emoji: '💡' }, answer: 'off', options: [
    { word: 'off', emoji: '🌑' }, { word: 'at', emoji: '📍' }, { word: 'up', emoji: '⬆️' },
  ]},
  { id: 'long', prompt: { word: 'long', emoji: '🦒' }, answer: 'short', options: [
    { word: 'short', emoji: '🐢' }, { word: 'tall', emoji: '🦒' }, { word: 'wide', emoji: '↔️' },
  ]},
  { id: 'first', prompt: { word: 'first', emoji: '🥇' }, answer: 'last', options: [
    { word: 'last', emoji: '🏁' }, { word: 'winner', emoji: '🏆' }, { word: 'next', emoji: '➡️' },
  ]},
  { id: 'light', prompt: { word: 'light', emoji: '💡' }, answer: 'dark', options: [
    { word: 'dark', emoji: '🌑' }, { word: 'shiny', emoji: '✨' }, { word: 'bright', emoji: '☀️' },
  ]},
  { id: 'new', prompt: { word: 'new', emoji: '✨' }, answer: 'old', options: [
    { word: 'old', emoji: '👴' }, { word: 'fresh', emoji: '🌱' }, { word: 'shiny', emoji: '💎' },
  ]},
  { id: 'left', prompt: { word: 'left', emoji: '⬅️' }, answer: 'right', options: [
    { word: 'right', emoji: '➡️' }, { word: 'back', emoji: '🔙' }, { word: 'front', emoji: '⏩' },
  ]},
  { id: 'yes', prompt: { word: 'yes', emoji: '✅' }, answer: 'no', options: [
    { word: 'no', emoji: '❌' }, { word: 'maybe', emoji: '🤷' }, { word: 'sure', emoji: '👍' },
  ]},
  { id: 'awake', prompt: { word: 'awake', emoji: '👀' }, answer: 'asleep', options: [
    { word: 'asleep', emoji: '😴' }, { word: 'tired', emoji: '🥱' }, { word: 'alert', emoji: '🔔' },
  ]},
  { id: 'clean', prompt: { word: 'clean', emoji: '🧼' }, answer: 'dirty', options: [
    { word: 'dirty', emoji: '🪱' }, { word: 'shiny', emoji: '✨' }, { word: 'wet', emoji: '💧' },
  ]},
  { id: 'front', prompt: { word: 'front', emoji: '👀' }, answer: 'back', options: [
    { word: 'back', emoji: '🔙' }, { word: 'top', emoji: '🔝' }, { word: 'side', emoji: '↔️' },
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
  { id: 'win', prompt: { word: 'win', emoji: '🏆' }, answer: 'lose', options: [
    { word: 'lose', emoji: '😞' }, { word: 'tie', emoji: '🤝' }, { word: 'score', emoji: '⚽' }, { word: 'play', emoji: '🎮' },
  ]},
  { id: 'remember', prompt: { word: 'remember', emoji: '🧠' }, answer: 'forget', options: [
    { word: 'forget', emoji: '🙈' }, { word: 'know', emoji: '💡' }, { word: 'learn', emoji: '📚' }, { word: 'think', emoji: '🤔' },
  ]},
  { id: 'buy', prompt: { word: 'buy', emoji: '💳' }, answer: 'sell', options: [
    { word: 'sell', emoji: '🏷️' }, { word: 'trade', emoji: '🤝' }, { word: 'pay', emoji: '💵' }, { word: 'keep', emoji: '🔒' },
  ]},
  { id: 'find', prompt: { word: 'find', emoji: '🔍' }, answer: 'lose', options: [
    { word: 'lose', emoji: '🫥' }, { word: 'look', emoji: '👀' }, { word: 'hunt', emoji: '🎯' }, { word: 'spot', emoji: '📍' },
  ]},
  { id: 'thick', prompt: { word: 'thick', emoji: '📚' }, answer: 'thin', options: [
    { word: 'thin', emoji: '📄' }, { word: 'round', emoji: '⚪' }, { word: 'fat', emoji: '🫃' }, { word: 'narrow', emoji: '📏' },
  ]},
  { id: 'strong', prompt: { word: 'strong', emoji: '💪' }, answer: 'weak', options: [
    { word: 'weak', emoji: '🥀' }, { word: 'tough', emoji: '🪨' }, { word: 'gentle', emoji: '🕊️' }, { word: 'firm', emoji: '🧱' },
  ]},
  { id: 'rich', prompt: { word: 'rich', emoji: '💰' }, answer: 'poor', options: [
    { word: 'poor', emoji: '🪙' }, { word: 'wealthy', emoji: '💎' }, { word: 'kind', emoji: '🤗' }, { word: 'busy', emoji: '🏃' },
  ]},
  { id: 'deep', prompt: { word: 'deep', emoji: '🌊' }, answer: 'shallow', options: [
    { word: 'shallow', emoji: '🏖️' }, { word: 'wide', emoji: '↔️' }, { word: 'wet', emoji: '💧' }, { word: 'low', emoji: '⬇️' },
  ]},
  { id: 'tight', prompt: { word: 'tight', emoji: '🎈' }, answer: 'loose', options: [
    { word: 'loose', emoji: '🪢' }, { word: 'firm', emoji: '🧱' }, { word: 'snug', emoji: '🤗' }, { word: 'free', emoji: '🕊️' },
  ]},
  { id: 'bent', prompt: { word: 'bent', emoji: '🪝' }, answer: 'straight', options: [
    { word: 'straight', emoji: '📏' }, { word: 'round', emoji: '⚪' }, { word: 'broken', emoji: '💔' }, { word: 'twisted', emoji: '🌀' },
  ]},
  { id: 'rise', prompt: { word: 'rise', emoji: '🌅' }, answer: 'fall', options: [
    { word: 'fall', emoji: '🍂' }, { word: 'climb', emoji: '🧗' }, { word: 'jump', emoji: '🤸' }, { word: 'grow', emoji: '🌱' },
  ]},
  { id: 'near', prompt: { word: 'near', emoji: '📍' }, answer: 'far', options: [
    { word: 'far', emoji: '🛣️' }, { word: 'close', emoji: '🤏' }, { word: 'next', emoji: '➡️' }, { word: 'under', emoji: '⬇️' },
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
  { id: 'cruel', prompt: { word: 'cruel', emoji: '😠' }, answer: 'kind', options: [
    { word: 'kind', emoji: '🤗' }, { word: 'rude', emoji: '😤' }, { word: 'mean', emoji: '😡' }, { word: 'loud', emoji: '📢' },
  ]},
  { id: 'reveal', prompt: { word: 'reveal', emoji: '👀' }, answer: 'hide', options: [
    { word: 'hide', emoji: '🫣' }, { word: 'show', emoji: '🪞' }, { word: 'tell', emoji: '🗣️' }, { word: 'cover', emoji: '🪶' },
  ]},
  { id: 'capture', prompt: { word: 'capture', emoji: '🥅' }, answer: 'release', options: [
    { word: 'release', emoji: '🕊️' }, { word: 'catch', emoji: '🎣' }, { word: 'hold', emoji: '🤲' }, { word: 'trap', emoji: '🪤' },
  ]},
  { id: 'polite', prompt: { word: 'polite', emoji: '🙇' }, answer: 'rude', options: [
    { word: 'rude', emoji: '😤' }, { word: 'kind', emoji: '🤗' }, { word: 'happy', emoji: '😀' }, { word: 'brave', emoji: '🦁' },
  ]},
  { id: 'scatter', prompt: { word: 'scatter', emoji: '🍃' }, answer: 'gather', options: [
    { word: 'gather', emoji: '🌾' }, { word: 'spread', emoji: '🌬️' }, { word: 'spill', emoji: '💦' }, { word: 'lose', emoji: '🫥' },
  ]},
  { id: 'cautious', prompt: { word: 'cautious', emoji: '🚧' }, answer: 'reckless', options: [
    { word: 'reckless', emoji: '🏃' }, { word: 'safe', emoji: '🛟' }, { word: 'careful', emoji: '👀' }, { word: 'silent', emoji: '🤫' },
  ]},
  { id: 'tame', prompt: { word: 'tame', emoji: '🐕' }, answer: 'wild', options: [
    { word: 'wild', emoji: '🦁' }, { word: 'calm', emoji: '🧘' }, { word: 'soft', emoji: '🧸' }, { word: 'loud', emoji: '📢' },
  ]},
];

export const OPPOSITES_ROUNDS = { easy: EASY, medium: MEDIUM, hard: HARD };
