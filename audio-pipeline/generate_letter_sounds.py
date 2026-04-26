#!/usr/bin/env python3
"""
Batch-generate letter SOUND MP3s for Sound Safari.

Reads `letter-sounds.json` and feeds the `tts_input` field as plain
text to Microsoft Edge's neural TTS (`edge-tts` package).  We tried
SSML <phoneme alphabet="ipa"> earlier — Edge's free Read-Aloud
endpoint silently strips them and returns silence — so the JSON now
carries hand-tuned phonetic spellings instead.

Voice for every letter: en-US-DavisNeural (Leo's voice).
Output directory:        ../public/audio/letters/sounds/

Strategy table
--------------
The script is modular: each entry has an associated `STRATEGY` that
controls how the audio is rendered.  The default is `plain` (just
synthesise `tts_input` directly).  When a letter still sounds wrong
after this round, swap its strategy to `word_trim` and add a recipe
to the WORD_TRIM_RECIPES dict — the script will synthesise a real
word ("snake") and use ffmpeg to trim the audio to just the target
phoneme range.

To swap an individual letter, edit STRATEGIES[letter] without touching
the other entries — nothing else in the script changes.

Usage (from the audio-pipeline/ directory):

    python3 -m venv .venv
    source .venv/bin/activate          # macOS / Linux
    # .venv\\Scripts\\activate           # Windows
    pip install edge-tts

    python generate_letter_sounds.py
"""
from __future__ import annotations

import asyncio
import json
import shutil
import subprocess
import sys
import tempfile
from pathlib import Path

try:
    import edge_tts
except ImportError:
    sys.stderr.write(
        "edge-tts is not installed.  Run:\n\n    pip install edge-tts\n"
    )
    sys.exit(1)


HERE = Path(__file__).resolve().parent
JSON_PATH = HERE / "letter-sounds.json"
SOUNDS_DIR = HERE.parent / "public" / "audio" / "letters" / "sounds"

VOICE = "en-US-DavisNeural"
RATE = "-15%"
PITCH = "+0Hz"
VOLUME = "+0%"

# ---------------------------------------------------------------------------
# Per-letter strategy.
# ---------------------------------------------------------------------------
# 'plain'      → synth tts_input directly (default for every letter today).
# 'word_trim'  → synth a real word and ffmpeg-trim to a sub-range.  Add the
#                letter's key to WORD_TRIM_RECIPES below to use this.
#
# Swap individual letters here without rewriting the rest of the script.
STRATEGIES: dict[str, str] = {
    # "S": "word_trim",   # example — uncomment after listening
}

# Trim recipes for `word_trim` strategy.  Each entry tells the script
# what word to synthesise and what timestamp range (seconds) to keep.
# Tune by ear: render once with `plain`, listen to where the target
# sound sits, then plug numbers in here.
WORD_TRIM_RECIPES: dict[str, dict] = {
    # "S": {"word": "snake",  "start": 0.05, "end": 0.30},
    # "K": {"word": "kite",   "start": 0.00, "end": 0.20},
}


# ---------------------------------------------------------------------------
# Synth helpers.
# ---------------------------------------------------------------------------

async def synth_to_file(text: str, output: Path) -> None:
    """Synth one phrase to one MP3.  Raises on failure."""
    output.parent.mkdir(parents=True, exist_ok=True)
    communicate = edge_tts.Communicate(
        text=text,
        voice=VOICE,
        rate=RATE,
        pitch=PITCH,
        volume=VOLUME,
    )
    await communicate.save(str(output))


def have_ffmpeg() -> bool:
    return shutil.which("ffmpeg") is not None


async def render_plain(entry: dict, output: Path) -> None:
    """Strategy: synth tts_input directly."""
    await synth_to_file(entry["tts_input"], output)


async def render_word_trim(entry: dict, output: Path) -> None:
    """Strategy: synth a whole word, then ffmpeg-trim to a sub-range.

    Recipe lives in WORD_TRIM_RECIPES[letter] and looks like:
        { "word": "snake", "start": 0.05, "end": 0.30 }
    """
    if not have_ffmpeg():
        raise RuntimeError("ffmpeg not found in PATH (required for word_trim)")
    recipe = WORD_TRIM_RECIPES.get(entry["letter"])
    if not recipe:
        raise RuntimeError(f"no WORD_TRIM_RECIPES entry for {entry['letter']}")

    with tempfile.NamedTemporaryFile(suffix=".mp3", delete=False) as tmp:
        tmp_path = Path(tmp.name)
    try:
        await synth_to_file(recipe["word"], tmp_path)
        output.parent.mkdir(parents=True, exist_ok=True)
        cmd = [
            "ffmpeg", "-y",
            "-i", str(tmp_path),
            "-ss", str(recipe["start"]),
            "-to", str(recipe["end"]),
            "-acodec", "copy",
            str(output),
        ]
        # Suppress ffmpeg's normal stderr noise; show it on failure only.
        proc = subprocess.run(cmd, capture_output=True, text=True)
        if proc.returncode != 0:
            raise RuntimeError(f"ffmpeg failed: {proc.stderr.strip()[:200]}")
    finally:
        tmp_path.unlink(missing_ok=True)


RENDERERS = {
    "plain": render_plain,
    "word_trim": render_word_trim,
}


async def generate_one(entry: dict) -> bool:
    letter = entry.get("letter", "?")
    out = SOUNDS_DIR / entry["filename"]
    strategy = STRATEGIES.get(letter, "plain")
    renderer = RENDERERS[strategy]

    print(f"  [{letter}] ({strategy:10}) → {out.name} ", end="", flush=True)
    try:
        await renderer(entry, out)
        print("✓")
        return True
    except Exception as err:  # noqa: BLE001 — keep going on any error
        print(f"✗ {err}")
        return False


async def main() -> int:
    if not JSON_PATH.is_file():
        sys.stderr.write(f"Cannot find {JSON_PATH}\n")
        return 1

    with JSON_PATH.open("r", encoding="utf-8") as fp:
        data = json.load(fp)
    entries = data.get("letters") if isinstance(data, dict) else data
    if not entries:
        sys.stderr.write("letter-sounds.json has no entries\n")
        return 1

    print(f"Generating audio for {len(entries)} letter sounds…")
    print(f"  voice  : {VOICE}")
    print(f"  output : {SOUNDS_DIR}")
    print()

    ok = 0
    fail = 0
    for entry in entries:
        if await generate_one(entry):
            ok += 1
        else:
            fail += 1

    print()
    print(f"Done.  {ok} succeeded, {fail} failed.")
    return 0 if fail == 0 else 2


if __name__ == "__main__":
    sys.exit(asyncio.run(main()))
