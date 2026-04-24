import { motion } from 'framer-motion';
import { useEffect, useMemo, useState } from 'react';
import AudioButton from '../shared/AudioButton.jsx';
import Celebration from '../shared/Celebration.jsx';
import AnimalHost from '../shared/AnimalHost.jsx';
import GameShell from './GameShell.jsx';
import { SYLLABLES_ROUNDS } from '../../data/syllables.js';
import { pickSession } from '../../data/session.js';
import { useAudio } from '../../hooks/useAudio.js';
import { useSpeech } from '../../hooks/useSpeech.js';
import { getGame } from '../../data/games.js';

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

  const { speak } = useSpeech({ enabled: audioEnabled, preferredVoiceURI: voiceURI, cloud });
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
      setScore((s) => s + 1);
      setCelebrateRound(true);
      setTimeout(() => {
        setCelebrateRound(false);
        if (index + 1 >= rounds.length) finish(score + 1);
        else setIndex((i) => i + 1);
      }, 900);
    } else {
      play('wrong');
    }
  };

  const finish = (finalScore) => {
    setDone(true);
    play('celebrate');
    speak(`Trumpeting trunks! ${finalScore} out of ${rounds.length}!`);
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
        <div className="relative flex h-44 w-full items-center justify-center">
          <div className="absolute left-2 top-0 sm:left-6">
            <AnimalHost type="elephant" size={150} happy={celebrateRound} />
          </div>
          <motion.div
            key={round.id}
            initial={{ scale: 0.7, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 220, damping: 18 }}
            className="flex flex-col items-center rounded-[40px] bg-white/90 px-8 py-5 shadow-card"
          >
            <span className="text-6xl" aria-hidden="true">{round.emoji}</span>
            <span className="mt-2 font-letter text-3xl font-bold text-terracotta-600 sm:text-4xl">
              {round.word}
            </span>
          </motion.div>
        </div>

        <div className="mt-2 flex items-center gap-4">
          <AudioButton
            onPress={async () => {
              play('tap');
              await speak(round.word, { rate: 0.85 });
              // Chant the syllables with pauses so the beats are obvious.
              for (const s of round.syllables) {
                // eslint-disable-next-line no-await-in-loop
                await speak(s, { rate: 0.8 });
                // eslint-disable-next-line no-await-in-loop
                await new Promise((r) => setTimeout(r, 260));
              }
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
          {round.type === 'count' ? (
            <CountMode round={round} onAnswer={advance} />
          ) : (
            <BuildMode round={round} onAnswer={advance} speak={speak} />
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
function CountMode({ round, onAnswer }) {
  const [picked, setPicked] = useState(null);
  useEffect(() => {
    setPicked(null);
  }, [round.id]);

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
function BuildMode({ round, onAnswer, speak }) {
  const [placed, setPlaced] = useState([]);
  const [pool, setPool] = useState(() => shuffleWithSeed(round.syllables));

  useEffect(() => {
    setPlaced([]);
    setPool(shuffleWithSeed(round.syllables));
  }, [round.id, round.syllables]);

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
