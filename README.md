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

## Audio / voice architecture

Sound Safari speaks every mascot through Microsoft's Edge neural
voices via the `msedge-tts` package (free, no API key, no quota).
Every game host has a distinct voice configured in
`src/config/voices.js`.

### How the server proxy works

```
Browser  ──POST /api/tts──▶  Vercel serverless function  ──▶  Microsoft Edge TTS
{ text,                      · POST-only, 405 otherwise                  returns
  voiceId,                   · validates text (≤300 char) + voiceId       audio/mpeg
  settings }                 · 60 req/min/IP rate limit
                             · no API key needed — Edge TTS is free
```

- **No keys** to manage.  The Read-Aloud endpoint is unauthenticated.
- Voice names are whitelisted in `src/config/voices.js` — the server
  duplicates the list (Vercel quirk) so requests for arbitrary voices
  off Microsoft's roster are rejected.
- Responses use `Cache-Control: public, max-age=31536000, immutable`.
  Same `(voiceId, text, settings)` → same audio, so repeat phrases hit
  the browser / Vercel edge cache for free.

### Voices

Each of the 12 mascots maps to a Microsoft neural voice in
`src/config/voices.js` with appropriate `rate` / `pitch` settings
tuned to the character.  To swap a voice, change the `voiceId` value
and add the new name to the whitelist in `api/tts.js`.

Voices currently in use include `en-US-AndrewMultilingualNeural`
(Leo), `en-US-AvaMultilingualNeural` (Polly), `en-US-AnaNeural`
(Penny — Microsoft's "Cute" kid voice), `es-ES-XimenaMultilingualNeural`
(Sofia for Spanish), and others.

### Three TTS paths (in priority order)

1. **Recorded clip** — if a voice-over mp3 is registered via
   `registerClipBundle` in `src/hooks/useAudioClips.js`, it plays.
2. **Cloud TTS** (Microsoft Edge neural) — routed through the
   server proxy by default.  No configuration in the UI.
3. **Web Speech** — the browser's built-in voice.  Silent fallback
   if the proxy is unreachable (and used for any speech triggered
   without a `speaker` prop).

### Contextual phonemes

Letter Sounds speaks a carrier phrase ("uh… umbrella") rather than a
bare phoneme.  TTS pronounces real English correctly, so this
side-steps robotic mis-readings of isolated phonemes.

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
