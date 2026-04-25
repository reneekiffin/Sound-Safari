#!/usr/bin/env python3
"""
Batch-generate letter pronunciation MP3s for Sound Safari.

Reads `letters.json` and for each entry produces two MP3 files via
Microsoft Edge's neural TTS (`edge-tts` package):

  1. {filename_name}   — the letter NAME read by Edge (e.g. "ar" → "ar"
                          for the letter R).  These power the optional
                          letter-name audio in Leo's Letter Sounds game.
  2. {filename_sound}  — the letter SOUND (e.g. "rrrr" → /r/).  These
                          replace runtime TTS calls with pre-rendered
                          audio for snappier playback and consistent
                          quality.

Per-entry try/except so a single failure doesn't abort the whole batch.
Progress is printed to stdout.

Usage (from the audio-pipeline/ directory):

    python -m venv .venv
    source .venv/bin/activate          # macOS / Linux
    .venv\\Scripts\\activate            # Windows
    pip install edge-tts

    python generate_letters.py

Files land under:

    ../public/audio/letters/names/letter-{x}-name.mp3
    ../public/audio/letters/sounds/letter-{x}-sound.mp3

Vite serves /public/* as static assets, so the app can play them at
`/audio/letters/names/letter-r-name.mp3` etc.
"""
from __future__ import annotations

import asyncio
import json
import sys
from pathlib import Path

try:
    import edge_tts
except ImportError:
    sys.stderr.write(
        "edge-tts is not installed.  Run:\n\n    pip install edge-tts\n"
    )
    sys.exit(1)


HERE = Path(__file__).resolve().parent
JSON_PATH = HERE / "letters.json"
# /public/audio/letters/{names,sounds}/  (relative to the repo root).
OUT_ROOT = HERE.parent / "public" / "audio" / "letters"
NAMES_DIR = OUT_ROOT / "names"
SOUNDS_DIR = OUT_ROOT / "sounds"

# Slow, very deliberate delivery for letter pronunciations — kids need
# crisp sounds they can imitate.  These are passed to edge-tts as
# Communicate's `rate` / `pitch` / `volume` knobs.
RATE = "-15%"
PITCH = "+0Hz"
VOLUME = "+0%"


async def synthesise(text: str, voice: str, output: Path) -> None:
    """One synth call → one MP3 on disk.  Raises on failure."""
    output.parent.mkdir(parents=True, exist_ok=True)
    communicate = edge_tts.Communicate(
        text=text,
        voice=voice,
        rate=RATE,
        pitch=PITCH,
        volume=VOLUME,
    )
    await communicate.save(str(output))


async def generate_one(entry: dict) -> tuple[int, int]:
    """Generate the two MP3s for a single letter entry.

    Returns (succeeded, failed) so the caller can roll up totals.
    """
    letter = entry.get("letter", "?")
    voice = entry["voice"]

    succeeded = 0
    failed = 0

    name_path = NAMES_DIR / entry["filename_name"]
    sound_path = SOUNDS_DIR / entry["filename_sound"]

    # Letter NAME — e.g. "ar" → "ar".
    print(f"  [{letter}] name  → {name_path.name} ", end="", flush=True)
    try:
        await synthesise(entry["letter_name_tts_input"], voice, name_path)
        print("✓")
        succeeded += 1
    except Exception as err:  # noqa: BLE001 — keep going on any error
        print(f"✗ {err}")
        failed += 1

    # Letter SOUND — e.g. "rrrr" → /r/.
    print(f"  [{letter}] sound → {sound_path.name} ", end="", flush=True)
    try:
        await synthesise(entry["letter_sound_tts_input"], voice, sound_path)
        print("✓")
        succeeded += 1
    except Exception as err:  # noqa: BLE001
        print(f"✗ {err}")
        failed += 1

    return succeeded, failed


async def main() -> int:
    if not JSON_PATH.is_file():
        sys.stderr.write(f"Cannot find {JSON_PATH}\n")
        return 1

    with JSON_PATH.open("r", encoding="utf-8") as fp:
        entries = json.load(fp)

    print(f"Generating audio for {len(entries)} letters…")
    print(f"  names  → {NAMES_DIR}")
    print(f"  sounds → {SOUNDS_DIR}")
    print()

    total_ok = 0
    total_fail = 0

    for entry in entries:
        ok, fail = await generate_one(entry)
        total_ok += ok
        total_fail += fail

    print()
    print(f"Done.  {total_ok} succeeded, {total_fail} failed.")
    return 0 if total_fail == 0 else 2


if __name__ == "__main__":
    sys.exit(asyncio.run(main()))
