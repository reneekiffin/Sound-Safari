# Audio pipeline

Pre-renders letter audio (and, later, blend / rhyme audio) to static
MP3s using Microsoft Edge neural TTS.  Once generated, the files live
under `public/audio/...` and the app plays them via the existing
`registerClipBundle` override layer in
`src/hooks/useAudioClips.js` — no runtime TTS call, no quota concerns,
deterministic playback.

## Letters — `letters.json` + `generate_letters.py`

Generates **two MP3 files per letter** (52 total for A-Z):

| Field | Example | Use |
| --- | --- | --- |
| `letter_name_tts_input` | `"ar"` | Spoken letter NAME (the name "R") |
| `letter_sound_tts_input` | `"rrrr"` | The letter SOUND (`/r/`) |
| `ipa_sound` | `"/ɹ/"` | Reference only — informs the spelling |
| `filename_name` | `letter-r-name.mp3` | Output filename for the name |
| `filename_sound` | `letter-r-sound.mp3` | Output filename for the sound |
| `example_word` | `"rabbit"` | Context word, used by the app at runtime |
| `voice` | `"en-US-DavisNeural"` | Edge neural voice (Leo's voice) |

The TTS-input strings are **phonetic spellings** so Edge produces the
correct sound rather than mis-reading single characters.  Following
the spec you provided:

```
A → "ay"        H → "aitch"     O → "oh"        V → "vee"
B → "bee"       I → "eye"       P → "pee"       W → "double you"
C → "see"       J → "jay"       Q → "cue"       X → "ex"
D → "dee"       K → "kay"       R → "ar"        Y → "why"
E → "ee"        L → "ell"       S → "ess"       Z → "zee"
F → "eff"       M → "em"        T → "tee"
G → "gee"       N → "en"        U → "you"
```

## How to run

```bash
cd audio-pipeline

# Set up an isolated Python env (recommended)
python3 -m venv .venv
source .venv/bin/activate          # macOS / Linux
# .venv\Scripts\activate           # Windows PowerShell

pip install edge-tts

python generate_letters.py
```

Output:

```
Generating audio for 26 letters…
  names  → /…/sound-safari/public/audio/letters/names
  sounds → /…/sound-safari/public/audio/letters/sounds

  [A] name  → letter-a-name.mp3 ✓
  [A] sound → letter-a-sound.mp3 ✓
  [B] name  → letter-b-name.mp3 ✓
  …

Done.  52 succeeded, 0 failed.
```

If a single letter fails (e.g. transient network blip) the script
continues with the rest and reports the count at the end.  Re-run to
fill any gaps.

## Voice assignments

Currently every letter uses Leo's voice (`en-US-DavisNeural`).  To
generate audio for the other games, add new JSON files alongside
`letters.json` and copy `generate_letters.py` as a starting point.
Voice mapping per the brief:

| Game | Host | Voice |
| --- | --- | --- |
| Letter Sounds | Leo | `en-US-DavisNeural` |
| Sound Blending | Momo | `en-US-AndrewNeural` |
| Rhyme Time | Polly | `en-AU-NatashaNeural` |
| Narrator | — | `en-US-AriaNeural` |

> **Note for runtime play:** the proxy at `api/tts.js` whitelists a
> different set of voices because Davis (and a few others) are
> Azure-only and unreliable on the public Read-Aloud endpoint.  That's
> a separate runtime concern — the `edge-tts` Python package used by
> this script *can* render those voices reliably because it talks to
> the same WebSocket the Edge browser uses.  Pre-rendered MP3s avoid
> the runtime issue entirely.

## Wiring the generated files into the app

After generation, register the clips at app boot so they play instead
of a runtime TTS call.  In `src/main.jsx`:

```js
import { registerClipBundle } from './hooks/useAudioClips.js';

const LETTERS = 'abcdefghijklmnopqrstuvwxyz';
const bundle = {};
for (const ch of LETTERS) {
  bundle[`letter:${ch}`] = `/audio/letters/sounds/letter-${ch}-sound.mp3`;
  bundle[`letter-name:${ch}`] = `/audio/letters/names/letter-${ch}-name.mp3`;
}
registerClipBundle(bundle);
```

The clip-priority chain in `useSpeech.js` already checks `letter:${x}`
before falling through to the proxy, so adding this bundle is
zero-touch on the games themselves.

## Re-generating after edits

If you change a TTS input in `letters.json`, just re-run
`python generate_letters.py` — it overwrites the affected files.
Browsers will pick up the new audio on next load (the files are
served from `public/` which gets a fresh hash on every Vite build).
