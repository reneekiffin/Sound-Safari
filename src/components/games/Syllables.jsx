import { motion } from 'framer-motion';
import { useEffect, useMemo, useState } from 'react';
import AudioButton from '../shared/AudioButton.jsx';
import Celebration from '../shared/Celebration.jsx';
import PromptHeader from '../shared/PromptHeader.jsx';
import GameShell from './GameShell.jsx';
import { SYLLABLES_ROUNDS } from '../../data/syllables.js';
import { pickSession } from '../../data/session.js';
import { useAudio } from '../../hooks/useAudio.js';
import { useSpeech } from '../../hooks/useSpeech.js';
import { getGame } from '../../data/games.js';
import { pickCheer, pickWrongCheer, pickFinishCheer, CORRECT_CHEERS } from '../../data/cheers.js';

// Syllables (Ellie the Elephant).  Two round shapes mixed in each session:
// "count" (how many syllables?) and "build" (rebuild the word from chunks).

const ROUNDS_PER_SESSION = 10;

export default function Syllables({ profile, totalStars, difficulty, recent, onExit, onFinish, onOpenSettings, audioEnabled, sfxEnabled, voiceURI, cloud }) {
  const game = getGame('syllables');

  const { rounds, nextRecent } = useMemo(() => {
    const pool = SYLLABLES_ROUNDS[difficulty] ?? SYLLABLES_ROUNDS.easy;
    return pickSession({ pool, recent, size: ROUNDS_PER_SESSION, getId: (r) => r.id });
  }, [difficulty, recent]);

  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);
  const [celebrateRound, setCelebrateRound] = useState(false);
  // Bumped whenever a wrong answer is given, so child modes (CountMode,
  // BuildMode, BreakMode) can reset their local "picked" / "placed"
  // state and let the kid try again — fixing the "button stuck on the
  // wrong answer" bug.
  const [wrongKey, setWrongKey] = useState(0);

  const { speak } = useSpeech({ enabled: audioEnabled, preferredVoiceURI: voiceURI, cloud, speaker: 'elephant' });
  const { play } = useAudio({ enabled: sfxEnabled });
  const round = rounds[index];

  // Speak the word clearly when a new round arrives.  For "count" we also
  // chant the syllables with pauses so kids hear the beats.
  useEffect(() => {
    if (!round || done) return undefined;
    const t = setTimeout(async () => {
      await speak(round.word, { rate: 0.9 });
    }, 400);
    return () => clearTimeout(t);
  }, [round, speak, done]);

  const advance = (correct) => {
    if (correct) {
      play('correct');
      speak(pickCheer(CORRECT_CHEERS));
      setScore((s) => s + 1);
      setCelebrateRound(true);
      setTimeout(() => {
        setCelebrateRound(false);
        if (index + 1 >= rounds.length) finish(score + 1);
        else setIndex((i) => i + 1);
      }, 1800);
    } else {
      play('wrong');
      speak(pickWrongCheer());
      // Let child modes know to reset their local state so the kid can
      // try again rather than getting stuck on their wrong pick.
      setWrongKey((k) => k + 1);
    }
  };

  const finish = (finalScore) => {
    setDone(true);
    play('celebrate');
    speak(`${pickFinishCheer()} ${finalScore} out of ${rounds.length}!`);
    const earnedStars = finalScore + (finalScore === rounds.length ? 1 : 0);
    onFinish({ earnedStars, score: finalScore, total: rounds.length, newRecent: nextRecent });
  };

  if (done) return null;
  if (!round) return null;

  return (
    <GameShell
      game={game}
      profile={profile}
      totalStars={totalStars}
      round={index + 1}
      totalRounds={rounds.length}
      onExit={onExit}
      onOpenSettings={onOpenSettings}
    >
      <div className="flex flex-col items-center text-center">
        <PromptHeader animal="elephant" happy={celebrateRound} hostLabel="Ellie says...">
          <span className="mt-1 block text-5xl sm:text-6xl" aria-hidden="true">
            {round.emoji}
          </span>
          <span className="mt-2 block font-letter text-3xl font-bold text-terracotta-600 sm:text-4xl">
            {round.word}
          </span>
        </PromptHeader>

        <div className="mt-2 flex items-center gap-4">
          <AudioButton
            onPress={() => {
              play('tap');
              // Single utterance so Ellie's voice carries natural
              // prosody across the whole "word + syllable chant"
              // instead of pronouncing isolated syllables awkwardly
              // (e.g. "banana" then bare "ba", "na", "na" sounded off
              // because TTS voices have no context for fragments).
              const chant = round.syllables.join(' ... ');
              speak(`${round.word}. ${chant}.`, { rate: 0.8 });
            }}
            label="Hear the word and its syllables"
          />
          <p className="max-w-sm text-left font-body text-base text-terracotta-600/90 sm:text-lg">
            {round.type === 'count'
              ? 'Listen to the beats. How many syllables in this word?'
              : 'Tap the pieces in the right order to build the word.'}
          </p>
        </div>

        <div className="mt-6 w-full">
          {round.type === 'count' && (
            <CountMode round={round} onAnswer={advance} wrongKey={wrongKey} />
          )}
          {round.type === 'build' && (
            <BuildMode round={round} onAnswer={advance} speak={speak} wrongKey={wrongKey} />
          )}
          {round.type === 'break' && (
            <BreakMode round={round} onAnswer={advance} speak={speak} wrongKey={wrongKey} />
          )}
        </div>
      </div>

      <Celebration
        show={celebrateRound}
        emoji="🐘"
        title="Stomp-tastic!"
        subtitle="You felt the beats!"
      />
    </GameShell>
  );
}

// "count" mode — show number buttons 1..5.  We clamp to pool max (5).
function CountMode({ round, onAnswer, wrongKey }) {
  const [picked, setPicked] = useState(null);
  // Reset on new round OR after a wrong answer so the kid isn't locked
  // out of trying a different number.
  useEffect(() => {
    setPicked(null);
  }, [round.id, wrongKey]);

  const numbers = [1, 2, 3, 4, 5];
  return (
    <div className="grid grid-cols-5 gap-3 sm:gap-4">
      {numbers.map((n) => (
        <motion.button
          key={n}
          onClick={() => {
            if (picked !== null) return;
            setPicked(n);
            onAnswer(n === round.count);
          }}
          whileTap={{ scale: 0.9 }}
          whileHover={{ y: -4 }}
          animate={
            picked === n && n === round.count
              ? { scale: [1, 1.12, 1] }
              : picked === n
              ? { x: [-8, 8, -4, 4, 0] }
              : undefined
          }
          className={[
            'focus-ring aspect-square w-full rounded-[28px] border-4 bg-white font-display text-5xl shadow-card transition-colors',
            picked === n && n === round.count
              ? 'border-sage-400 bg-sage-100 text-sage-600'
              : picked === n
              ? 'border-parrot-400 bg-parrot-400/10 text-parrot-500'
              : 'border-terracotta-200 text-terracotta-600 hover:border-terracotta-300',
          ].join(' ')}
          aria-label={`${n} syllable${n === 1 ? '' : 's'}`}
        >
          {n}
        </motion.button>
      ))}
    </div>
  );
}

// "build" mode — show the syllables in shuffled order; the kid taps them
// one by one to fill the target word.
function BuildMode({ round, onAnswer, speak, wrongKey }) {
  const [placed, setPlaced] = useState([]);
  const [pool, setPool] = useState(() => shuffleWithSeed(round.syllables));

  // Reset on round change AND on wrong answer — kid gets a fresh
  // shuffled pool to try again instead of a stuck, wrong arrangement.
  useEffect(() => {
    setPlaced([]);
    setPool(shuffleWithSeed(round.syllables));
  }, [round.id, round.syllables, wrongKey]);

  const handleTap = (piece, i) => {
    const nextPlaced = [...placed, piece];
    setPlaced(nextPlaced);
    setPool(pool.filter((_, idx) => idx !== i));
    speak?.(piece, { rate: 0.85 });

    if (nextPlaced.length === round.syllables.length) {
      const correct = nextPlaced.every((p, idx) => p === round.syllables[idx]);
      setTimeout(() => onAnswer(correct), 300);
    }
  };

  const handleReset = () => {
    setPlaced([]);
    setPool(shuffleWithSeed(round.syllables));
  };

  return (
    <div className="flex flex-col items-center gap-4">
      {/* Assembled row — placeholders light up as kid fills them. */}
      <div className="flex flex-wrap items-center justify-center gap-2 rounded-3xl bg-white/70 p-3">
        {round.syllables.map((s, i) => (
          <span
            key={i}
            className={[
              'rounded-2xl border-4 px-4 py-3 font-letter text-2xl font-bold transition-colors',
              placed[i]
                ? 'border-sage-400 bg-sage-100 text-sage-600'
                : 'border-terracotta-200 bg-white/60 text-terracotta-300',
            ].join(' ')}
          >
            {placed[i] ?? '_____'}
          </span>
        ))}
      </div>

      <div className="flex flex-wrap items-center justify-center gap-2">
        {pool.map((piece, i) => (
          <motion.button
            key={`${piece}-${i}`}
            onClick={() => handleTap(piece, i)}
            whileTap={{ scale: 0.92 }}
            whileHover={{ y: -2 }}
            className="focus-ring rounded-2xl border-4 border-terracotta-200 bg-white px-5 py-4 font-letter text-2xl font-bold text-terracotta-600 shadow-card hover:border-terracotta-300"
          >
            {piece}
          </motion.button>
        ))}
      </div>

      <button
        type="button"
        onClick={handleReset}
        className="focus-ring rounded-full bg-white/70 px-4 py-2 font-heading text-sm font-extrabold text-terracotta-500"
      >
        Start over
      </button>
    </div>
  );
}

function shuffleWithSeed(arr) {
  const out = [...arr];
  for (let i = out.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  // If a shuffle happens to match original order, swap the first two.
  if (out.length > 1 && out.every((v, i) => v === arr[i])) {
    [out[0], out[1]] = [out[1], out[0]];
  }
  return out;
}

// "break" mode — the richer syllable activity.  Shows the word's letters
// in a row with a tappable gap between each pair.  Tap a gap to insert
// a syllable break (a vertical line).  Tap again to remove.  Hit "check"
// to verify.  Kids are actively deciding where the beats fall, not just
// counting them.
function BreakMode({ round, onAnswer, speak, wrongKey }) {
  // Set of "gap indices" where the kid has placed a break.  A gap at
  // index `i` means between letters `i` and `i+1`.
  const [breaks, setBreaks] = useState(new Set());

  useEffect(() => {
    setBreaks(new Set());
  }, [round.id, wrongKey]);

  const toggleBreak = (i) => {
    setBreaks((prev) => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i);
      else next.add(i);
      return next;
    });
  };

  const check = () => {
    const expected = new Set(round.breaks ?? []);
    const correct =
      breaks.size === expected.size &&
      [...breaks].every((b) => expected.has(b));
    onAnswer(correct);
  };

  const letters = round.word.split('');

  return (
    <div className="flex flex-col items-center gap-4">
      <p className="font-body text-sm font-bold text-terracotta-500">
        Tap between letters to mark each syllable break.
      </p>
      <div className="flex flex-wrap items-center justify-center gap-0 rounded-3xl bg-white/70 p-3">
        {letters.map((ch, i) => {
          const isLast = i === letters.length - 1;
          const hasBreak = breaks.has(i);
          return (
            <span key={i} className="flex items-center">
              <span className="font-letter text-3xl font-bold text-terracotta-600 sm:text-4xl">
                {ch}
              </span>
              {!isLast && (
                <button
                  type="button"
                  onClick={() => toggleBreak(i)}
                  aria-label={hasBreak ? `Remove break after ${ch}` : `Add break after ${ch}`}
                  className={[
                    'focus-ring mx-1 h-10 w-6 rounded-md border-4 transition-colors sm:mx-2 sm:h-12 sm:w-7',
                    hasBreak
                      ? 'border-sage-500 bg-sage-400'
                      : 'border-dashed border-terracotta-300 bg-white/60 hover:border-terracotta-400',
                  ].join(' ')}
                >
                  {hasBreak && (
                    <span aria-hidden="true" className="block text-white">
                      |
                    </span>
                  )}
                </button>
              )}
            </span>
          );
        })}
      </div>

      {/* Live preview with the current breaks applied. */}
      <p className="font-letter text-2xl font-bold text-terracotta-500">
        {letters
          .map((ch, i) => (breaks.has(i) ? `${ch} · ` : ch))
          .join('')}
      </p>

      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          onClick={() => speak?.(round.syllables.join(' ... '), { rate: 0.7 })}
          className="focus-ring rounded-full border-4 border-terracotta-200 bg-white px-4 py-2 font-heading text-sm font-extrabold text-terracotta-500"
        >
          Hear the beats
        </button>
        <button
          type="button"
          onClick={check}
          className="focus-ring rounded-full border-4 border-sage-500 bg-sage-400 px-4 py-2 font-heading text-sm font-extrabold text-white"
        >
          Check
        </button>
        <button
          type="button"
          onClick={() => setBreaks(new Set())}
          className="focus-ring rounded-full bg-white/70 px-4 py-2 font-heading text-sm font-extrabold text-terracotta-500"
        >
          Clear
        </button>
      </div>
    </div>
  );
}
