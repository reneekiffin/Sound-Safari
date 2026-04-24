# Sound Safari 🦁

A kid-friendly phonics learning web app for ages 3–9, set in a warm storybook
safari world. A cast of animal friends — Leo the Lion, Momo the Monkey, Polly
the Parrot, and more — host three interactive games that cover letter sounds,
sound blending, and rhyming.

## Stack

- **React 18 + Vite**
- **Tailwind CSS** with a warm, hand-lettered design system
- **Framer Motion** for springy, playful micro-interactions
- **Web Speech API** for text-to-speech instructions and feedback
- **Web Audio API** for quick, synthesized SFX (tap / correct / wrong / celebrate)
- **localStorage** for progress tracking (no backend in v1)

## Quick start

```bash
npm install
npm run dev     # start local dev server on port 5173
npm run build   # production build to ./dist
npm run preview # preview the production build locally
```

## Project layout

```
src/
  components/
    hub/          safari map + location cards (game hub)
    games/        LetterSounds, SoundBlending, RhymeTime + GameShell
    shared/       Button, Modal, ProgressBar, AudioButton, Celebration,
                  TopBar, Confetti, AnimalHost (inline SVG characters)
    parent/       ParentGate (math question) + ParentZone (settings)
  hooks/          useSpeech, useAudio, useProgress
  data/           letterSounds, soundBlending, rhymeTime, games metadata
  styles/         global CSS, Tailwind layer, CSS variables
```

## The games

Each game uses the same data shape — add rounds to the matching file in
`src/data/` and they'll show up without any code changes:

```js
{
  gameId: "letter-sounds",
  rounds: [
    { sound: "ah", correctLetter: "a", options: ["a", "e", "i", "o"] },
    // ...
  ],
}
```

| Game | Ages | Host | File |
| --- | --- | --- | --- |
| Letter Sounds | 3–5 | 🦁 Leo the Lion | `src/components/games/LetterSounds.jsx` |
| Sound Blending | 5–7 | 🐒 Momo the Monkey | `src/components/games/SoundBlending.jsx` |
| Rhyme Time | 7–9 | 🦜 Polly the Parrot | `src/components/games/RhymeTime.jsx` |

Each session is 10 rounds (or fewer for the hardest tiers). A star is earned
per correct answer, plus a bonus star for a perfect round. Every 5 stars
triggers a full-screen celebration.

## Design system

- **Colors** — Savanna terracotta/golden/sage primaries with tropical
  parrot-red, toucan-orange, jungle-teal accents. Defined as Tailwind tokens
  *and* CSS variables in `src/styles/index.css` for easy theming.
- **Typography** —
  - Display: **Bagel Fat One** / Fraunces (hand-lettered feel)
  - Body: **Nunito** (friendly sans-serif)
  - Letter cards: **Andika** (clear single-story "a", kid-friendly letterforms)
- **Motion** — Framer Motion springs throughout. No linear easing.
- **Accessibility** — 64px minimum tap targets, focus rings, audio labels on
  every interactive element, no time pressure, kid-navigable with icons + audio
  alone.

## Parent zone

Tap the gear icon (top-right) → solve a one-digit + one-digit addition
question → access the parent zone. From there you can:

- Change the child's name and avatar
- See per-game progress (stars, sessions played)
- Toggle voices and sound effects
- Switch difficulty (Gentle / Growing / Brave)
- Reset all progress

## Adding new games

1. Add a new entry to `src/data/games.js`.
2. Create a data file in `src/data/yourGame.js` following the existing shape.
3. Create a component in `src/components/games/YourGame.jsx` that renders
   inside `<GameShell>`.
4. Wire it into the `<AnimatePresence>` block in `src/App.jsx`.

## Notes / follow-ups

- Animal art is inline SVG so the MVP needs no external assets. Swap to real
  illustrations by replacing the components in `src/components/shared/AnimalHost.jsx`.
- Voice-over audio currently uses the browser's default voice. A recorded voice
  actor can replace it by swapping the `speak()` call in `src/hooks/useSpeech.js`
  with a Howler.js-backed audio sprite.
