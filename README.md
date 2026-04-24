# Sound Safari 🦁

A kid-friendly phonics & reading web app for ages 3–10, set in a warm
storybook safari world. A cast of animal friends hosts **seven interactive
games** that cover letter sounds, syllables, sound blending, rhyming,
opposites, similarities, and sentence building.

## Stack

- **React 18 + Vite**
- **Tailwind CSS** with a warm, hand-lettered design system
- **Framer Motion** for springy, playful micro-interactions
- **Web Speech API** for text-to-speech (with a voice picker — see
  audio notes below)
- **Howler.js** as an optional recorded-audio override layer
- **Web Audio API** for quick synthesized SFX (tap / correct / wrong /
  celebrate)
- **localStorage** for progress tracking (no backend in v1)

## Quick start

```bash
npm install
npm run dev     # start local dev server on port 5173
npm run build   # production build to ./dist
npm run preview # preview the production build locally
```

## The games

| Game | Ages | Level | Host | File |
| --- | --- | --- | --- | --- |
| Letter Sounds | 3–5 | little, growing | 🦁 Leo the Lion | `src/components/games/LetterSounds.jsx` |
| Syllable Stomp | 5–8 | little, growing, brave | 🐘 Ellie the Elephant | `src/components/games/Syllables.jsx` |
| Sound Blending | 5–7 | growing, brave | 🐒 Momo the Monkey | `src/components/games/SoundBlending.jsx` |
| Rhyme Time | 6–9 | growing, brave | 🦜 Polly the Parrot | `src/components/games/RhymeTime.jsx` |
| Opposites | 5–8 | growing, brave | 🦜 Toby the Toucan | `src/components/games/Opposites.jsx` |
| Same-Same (Similarities) | 6–9 | growing, brave, big | 🐸 Finn the Frog | `src/components/games/Similarities.jsx` |
| Sentence Safari | 7–10 | brave, big | 🦒 Gigi the Giraffe | `src/components/games/Sentences.jsx` |

Each session is 10 rounds by default. A star is earned per correct
answer, plus a bonus star for a perfect round. Every 5 stars triggers a
full-screen celebration.

### Age-band levels

The hub has a level filter at the top:

- **Little Explorer** (3–5) — letter sounds, easy syllables
- **Growing Reader** (5–7) — blending, rhyme, opposites, syllables
- **Brave Adventurer** (7–9) — rhyme, similarities, sentences
- **Big Explorer** (9+) — similarities hard tier, sentence hard tier

Parents can change the level (and see all games) from the Parent Zone.

### Round-picker freshness

Every game keeps a rolling "recently seen" list of round IDs per
difficulty.  When a new session starts, the picker prefers rounds the kid
*hasn't* just played. The memory window auto-shrinks if the pool is nearly
exhausted so kids never run out of content. This is what makes each
"Play Again" feel like a new set rather than a replay.

Add more rounds to any game by editing the matching file in `src/data/`
— no code changes required.

## Audio / voice quality

Three layers, in priority order, each falling through cleanly when the
layer above isn't configured:

### 1. Natural cloud voice (OpenAI TTS) — recommended

Open the **Parent Zone → Voice → Natural voice (OpenAI)**, paste an
OpenAI API key, and pick a voice (Nova / Shimmer / Coral / etc.).
From then on, every instruction, letter sound, and feedback line is
synthesised by OpenAI's `gpt-4o-mini-tts` model, which sounds
dramatically more natural than any browser voice.

- Audio is **cached per-voice-per-phrase on the device**, so repeated
  phrases ("Try again!", letter prompts, host greetings) cost nothing
  after the first time.
- Cost: ~$0.015 per 1k characters. A full 10-round session typically
  costs a fraction of a cent.
- The API key is stored **only in this browser's localStorage** and
  sent only to OpenAI's endpoint.
- If the call fails (offline, rate-limited, bad key), Sound Safari
  falls back to Web Speech silently so the game never stalls.

### 2. Browser voice (Web Speech)

If no cloud provider is configured, we use the Web Speech API and
auto-rank available voices to prefer `natural` / `neural` / `premium` /
`enhanced` ones. Parents can also pin a specific voice in the Parent
Zone. Recommended picks:

- **iPad / iPhone / macOS Safari**: "Samantha (Enhanced)" or any
  "Premium" / "Enhanced" voice.
- **Chrome / Edge**: any "Natural" / "Neural" voice, or "Google US
  English". Avoid anything labelled "Compact".
- **Firefox**: voices are OS-provided; pick the best English voice.

### 3. Recorded voice-over clips (optional override)

The highest quality is pre-recorded audio. Register clips with
`registerClipBundle` (see `src/hooks/useAudioClips.js`) and any matching
key plays the clip instead of going out to cloud or Web Speech:

```js
import { registerClipBundle } from './hooks/useAudioClips';

registerClipBundle({
  'letter:a': '/audio/letters/a.mp3',
  'phoneme:m': '/audio/phonemes/m.mp3',
  'word:apple': '/audio/words/apple.mp3',
});
```

### Contextual phonemes

Letter Sounds speaks a carrier phrase ("A says aaah, like apple") rather
than a bare phoneme. Every TTS model (browser, cloud) pronounces real
English correctly, so this completely side-steps the robotic
mis-readings of isolated phonemes.

## Parent Zone

Gear icon (top-right) → solve a one-digit + one-digit addition question
→ access the parent zone. From there you can:

- Change the child's name and avatar
- Change the age/level band the hub shows
- See per-game progress (stars, sessions played)
- Toggle voices & sound effects
- Pick the TTS voice
- Switch difficulty (Gentle / Growing / Brave)
- Reset all progress

## Project layout

```
src/
  components/
    hub/          safari map + location cards (game hub, level filter)
    games/        LetterSounds, Syllables, SoundBlending, RhymeTime,
                  Opposites, Similarities, Sentences + GameShell
    shared/       Button, Modal, ProgressBar, AudioButton, Celebration,
                  TopBar, Confetti, AnimalHost (emoji placeholders; real
                  illustrations will replace these once usability is
                  finalised — AnimalHost's props stay stable so swapping
                  is a one-file change)
    parent/       ParentGate (math question) + ParentZone (settings)
  hooks/          useSpeech (TTS + contextual phonemes + voice ranking),
                  useAudio (synthesized SFX), useAudioClips (recorded
                  override via Howler), useProgress (localStorage)
  data/           letterSounds, syllables, soundBlending, rhymeTime,
                  opposites, similarities, sentences, games metadata,
                  session picker
  styles/         global CSS, Tailwind layer, CSS variables
```

## Data shape

Every game has a simple per-difficulty data file. The shared session
picker works on any shape — each round just needs a stable `id` (or
`letter` for Letter Sounds). Example:

```js
export const LETTER_SOUNDS_ROUNDS = {
  easy: [
    {
      letter: 'a',
      phoneme: 'aaa',
      sampleWord: 'apple',
      options: ['a', 'o', 'u'],
    },
    // ...
  ],
};
```

## Adding new games

1. Add a new entry to `src/data/games.js` (including `animal`, `levels`,
   and `host`).
2. Create a data file under `src/data/yourGame.js` with `easy` / `medium`
   / `hard` tiers of round objects, each with a stable `id`.
3. Create `src/components/games/YourGame.jsx` — use `GameShell`, pull
   `{ rounds, nextRecent }` from `pickSession`, and call
   `onFinish({ earnedStars, score, total, newRecent: nextRecent })`.
4. Register the component in `GAME_COMPONENTS` in `src/App.jsx`.
5. (Optional) Add a new animal SVG in `src/components/shared/AnimalHost.jsx`.
