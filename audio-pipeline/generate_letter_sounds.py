#!/usr/bin/env python3
"""
Batch-generate letter SOUND MP3s for Sound Safari from SSML input.

Reads `letter-sounds.json` and for each entry feeds the `ssml` field
to Microsoft Edge's neural TTS (`edge-tts` package) so the engine
produces the actual phoneme rather than reading the spelling
("ssss" → /s/, not "ess ess ess"; "kuh" with IPA `kʌ` → /kʌ/, not
"coo" with a long-u).

The previous plain-text approach ("kuh", "puh", "sss") was unreliable
on Edge: short letter strings got read as spelled-out letter names.
SSML <phoneme alphabet="ipa" ph="..."> is the authoritative way to
tell the engine which phoneme to render, and edge-tts (which talks to
the same Read-Aloud websocket the Edge browser uses) honours it.

All voices use Davis (Leo's voice) per the brief.

Output: ../public/audio/letters/sounds/letter-{x}-sound.mp3
        (path comes from the entry's `filename` field)

Usage (from the audio-pipeline/ directory):

    python -m venv .venv
    source .venv/bin/activate          # macOS / Linux
    .venv\\Scripts\\activate            # Windows
    pip install edge-tts

    python generate_letter_sounds.py
"""
from __future__ import annotations

import asyncio
import json
import re
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
JSON_PATH = HERE / "letter-sounds.json"
SOUNDS_DIR = HERE.parent / "public" / "audio" / "letters" / "sounds"

# Leo's voice — used for every letter sound per the brief.
VOICE = "en-US-DavisNeural"

# Slow, deliberate delivery — kids need crisp sounds they can imitate.
RATE = "-15%"
PITCH = "+0Hz"
VOLUME = "+0%"

# edge-tts wraps the supplied text inside its own SSML structure
# (<speak><voice><prosody>{text}</prosody></voice></speak>).  Passing a
# full <speak> document would double-wrap and the synth fails silently.
# Extract just the inner content (typically a <phoneme> tag) so it
# slots cleanly into edge-tts's auto-generated SSML.
_SPEAK_INNER = re.compile(r"<speak[^>]*>(.*)</speak>", re.DOTALL | re.IGNORECASE)


def ssml_inner(ssml: str) -> str:
    """Return the inner content of a <speak>...</speak> wrapper.

    If the input doesn't have a <speak> wrapper, return it as-is so
    the script also works with bare phoneme tags.
    """
    m = _SPEAK_INNER.search(ssml.strip())
    return m.group(1).strip() if m else ssml.strip()


async def synthesise(text: str, output: Path) -> None:
    """One synth call → one MP3 on disk.  Raises on failure."""
    output.parent.mkdir(parents=True, exist_ok=True)
    communicate = edge_tts.Communicate(
        text=text,
        voice=VOICE,
        rate=RATE,
        pitch=PITCH,
        volume=VOLUME,
    )
    await communicate.save(str(output))


async def generate_one(entry: dict) -> bool:
    """Generate one letter-sound MP3.  Returns True on success."""
    letter = entry.get("letter", "?")
    out = SOUNDS_DIR / entry["filename"]
    payload = ssml_inner(entry["ssml"])

    print(f"  [{letter}] → {out.name} ", end="", flush=True)
    try:
        await synthesise(payload, out)
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
