// Shared cheer phrases — pools the celebration copy so every game speaks
// something different and kids don't hear the same "Nice one!" every time.
//
// Three pools:
//   - CORRECT_CHEERS : said on a correct answer (fast, energetic)
//   - WRONG_CHEERS   : said on an incorrect answer (gentle, encouraging)
//   - FINISH_CHEERS  : said at the end of a full session (big, celebratory)
//
// `pickCheer(pool)` returns a random string; the `Celebration` component
// pulls both a title and a matching subtitle from `CELEBRATION_SCRIPTS`.
//
// We also pick a host-friendly emoji per pool so the confetti feels
// thematic.

export const CORRECT_CHEERS = [
  'You did it!',
  'You go!',
  'Yes! Amazing!',
  'Wow, nailed it!',
  'High five!',
  'Brilliant!',
  'Super star!',
  'Way to go!',
  'Fantastic!',
  'Boom! Got it!',
  "You're on fire!",
  'Nice one!',
  'Rock star!',
  'Wonderful!',
  'Incredible!',
];

export const WRONG_CHEERS = [
  'Oops — try again!',
  'Not quite, one more go!',
  'Close! Let\'s try again.',
  'Almost! You got this!',
  "Don't worry — have another go!",
  'Keep going!',
  'Try once more!',
];

export const FINISH_CHEERS = [
  'Safari superstar!',
  'You rocked it!',
  'What a brilliant round!',
  'Incredible work!',
  'High-five champion!',
  'Roar-some!',
  'Amazing adventuring!',
];

export const NEXT_PROMPTS = [
  "Let's try another one!",
  'Here comes another!',
  'Ready? Next up!',
  'Keep going — next one!',
  "You're flying through these!",
];

const CELEBRATION_SUBTITLES = [
  'You heard it just right.',
  'Your ears are super sharp!',
  'You\'re a phonics explorer!',
  'That was awesome!',
  'Look at you go!',
  'You\'re a reading rocket!',
  'Your brain is buzzing!',
  'Keep that streak alive!',
];

const CELEBRATION_EMOJI_POOL = ['🎉', '🌟', '✨', '🎊', '🏆', '🥳', '💫'];

export function pickCheer(pool = CORRECT_CHEERS) {
  return pool[Math.floor(Math.random() * pool.length)];
}

// One-shot random celebration payload for the Celebration overlay.
// Using the mascot's own emoji as the hero keeps the scene thematic;
// we rotate a supporting emoji pool for variety.
export function pickCelebration(mascotEmoji = '🎉') {
  return {
    emoji: mascotEmoji,
    title: pickCheer(CORRECT_CHEERS),
    subtitle:
      CELEBRATION_SUBTITLES[
        Math.floor(Math.random() * CELEBRATION_SUBTITLES.length)
      ],
    confettiEmoji:
      CELEBRATION_EMOJI_POOL[
        Math.floor(Math.random() * CELEBRATION_EMOJI_POOL.length)
      ],
  };
}

export function pickFinishCheer() {
  return pickCheer(FINISH_CHEERS);
}

export function pickNextPrompt() {
  return pickCheer(NEXT_PROMPTS);
}

export function pickWrongCheer() {
  return pickCheer(WRONG_CHEERS);
}
