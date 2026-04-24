import { motion } from 'framer-motion';
import { useEffect, useMemo, useState } from 'react';
import AudioButton from '../shared/AudioButton.jsx';
import Celebration from '../shared/Celebration.jsx';
import AnimalHost from '../shared/AnimalHost.jsx';
import GameShell from './GameShell.jsx';
import { SENTENCES_ROUNDS } from '../../data/sentences.js';
import { pickSession } from '../../data/session.js';
import { useAudio } from '../../hooks/useAudio.js';
import { useSpeech } from '../../hooks/useSpeech.js';
import { getGame } from '../../data/games.js';

// Sentence Builder (Gigi the Giraffe).  Three round shapes:
//   - fill   : fill the blank in a short sentence
//   - order  : tap word chips in the right order
//   - verb   : pick the correct verb form for the given subject
// The session picker mixes shapes; this component branches on `round.kind`.

const ROUNDS_PER_SESSION = 10;

export default function Sentences({ profile, totalStars, difficulty, recent, onExit, onFinish, onOpenSettings, audioEnabled, sfxEnabled, voiceURI, cloud }) {
  const game = getGame('sentences');

  const { rounds, nextRecent } = useMemo(() => {
    const pool = SENTENCES_ROUNDS[difficulty] ?? SENTENCES_ROUNDS.easy;
    return pickSession({ pool, recent, size: ROUNDS_PER_SESSION, getId: (r) => r.id });
  }, [difficulty, recent]);

  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);
  const [celebrateRound, setCelebrateRound] = useState(false);

  const { speak } = useSpeech({ enabled: audioEnabled, preferredVoiceURI: voiceURI, cloud });
  const { play } = useAudio({ enabled: sfxEnabled });
  const round = rounds[index];

  useEffect(() => {
    if (!round || done) return undefined;
    const t = setTimeout(() => {
      if (round.kind === 'fill') speak(`${round.before} (blank) ${round.after}`);
      else if (round.kind === 'verb') speak(`${round.subject}.  Pick the right form of ${round.verb}.`);
      else if (round.kind === 'order') speak('Put these words in order to make a sentence.');
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
      }, 1000);
    } else {
      play('wrong');
    }
  };

  const finish = (finalScore) => {
    setDone(true);
    play('celebrate');
    speak(`Sentence stars! ${finalScore} out of ${rounds.length}!`);
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
            <AnimalHost type="giraffe" size={160} happy={celebrateRound} />
          </div>
          <div className="max-w-xl rounded-[40px] bg-white/90 px-6 py-5 shadow-card">
            <p className="font-body text-sm font-bold uppercase tracking-wide text-terracotta-500">
              Gigi says...
            </p>
            <p className="mt-1 font-heading text-xl font-extrabold text-terracotta-600 sm:text-2xl">
              {round.kind === 'order'
                ? 'Tap the words in order to build a sentence.'
                : round.kind === 'verb'
                ? 'Pick the right form of the verb.'
                : 'Fill in the blank.'}
            </p>
          </div>
        </div>

        <div className="mt-2 flex items-center gap-4">
          <AudioButton
            onPress={() => {
              play('tap');
              if (round.kind === 'fill') speak(`${round.before} (blank) ${round.after}`);
              else if (round.kind === 'verb') speak(`${round.subject}`);
              else if (round.kind === 'order') speak(round.answer);
            }}
            label="Hear the sentence"
          />
          <p className="max-w-xs text-left font-body text-base text-terracotta-600/90 sm:text-lg">
            Read along with Gigi — then choose!
          </p>
        </div>

        <div className="mt-6 w-full">
          {round.kind === 'fill' && <FillMode round={round} onAnswer={advance} speak={speak} />}
          {round.kind === 'verb' && <VerbMode round={round} onAnswer={advance} speak={speak} />}
          {round.kind === 'order' && <OrderMode round={round} onAnswer={advance} speak={speak} />}
        </div>
      </div>

      <Celebration
        show={celebrateRound}
        emoji="🦒"
        title="Sentence star!"
        subtitle="That reads perfectly."
      />
    </GameShell>
  );
}

function FillMode({ round, onAnswer, speak }) {
  const [picked, setPicked] = useState(null);
  useEffect(() => setPicked(null), [round.id]);

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex flex-wrap items-center justify-center gap-2 rounded-3xl bg-white/70 p-4 text-center">
        <span className="font-heading text-2xl text-terracotta-600 sm:text-3xl">
          {round.before}
        </span>
        <span
          className={[
            'inline-flex min-w-[110px] items-center justify-center rounded-2xl border-4 px-4 py-2 font-letter text-2xl font-bold transition-colors',
            picked && picked === round.answer
              ? 'border-sage-400 bg-sage-100 text-sage-600'
              : picked
              ? 'border-parrot-400 bg-parrot-400/10 text-parrot-500'
              : 'border-dashed border-terracotta-300 bg-white/60 text-terracotta-400',
          ].join(' ')}
        >
          {picked ?? '_____'}
        </span>
        <span className="font-heading text-2xl text-terracotta-600 sm:text-3xl">
          {round.after}
        </span>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-3">
        {round.options.map((opt) => (
          <motion.button
            key={opt}
            onClick={() => {
              if (picked) return;
              setPicked(opt);
              speak?.(`${round.before} ${opt} ${round.after}`);
              setTimeout(() => onAnswer(opt === round.answer), 400);
            }}
            whileTap={{ scale: 0.93 }}
            whileHover={{ y: -3 }}
            className="focus-ring rounded-2xl border-4 border-terracotta-200 bg-white px-5 py-4 font-letter text-2xl font-bold text-terracotta-600 shadow-card hover:border-terracotta-300"
          >
            {opt}
          </motion.button>
        ))}
      </div>
    </div>
  );
}

function VerbMode({ round, onAnswer, speak }) {
  const [picked, setPicked] = useState(null);
  useEffect(() => setPicked(null), [round.id]);

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="rounded-3xl bg-white/70 p-4 text-center">
        <span className="font-heading text-2xl text-terracotta-600 sm:text-3xl">
          {round.subject}{' '}
        </span>
        <span
          className={[
            'inline-flex min-w-[110px] items-center justify-center rounded-2xl border-4 px-4 py-2 font-letter text-2xl font-bold',
            picked && picked === round.answer
              ? 'border-sage-400 bg-sage-100 text-sage-600'
              : picked
              ? 'border-parrot-400 bg-parrot-400/10 text-parrot-500'
              : 'border-dashed border-terracotta-300 bg-white/60 text-terracotta-400',
          ].join(' ')}
        >
          {picked ?? '_____'}
        </span>
        <span className="font-heading text-2xl text-terracotta-600 sm:text-3xl">.</span>
      </div>
      <p className="font-body text-base text-terracotta-500">
        verb root: <span className="font-letter font-bold">{round.verb}</span>
      </p>
      <div className="flex flex-wrap items-center justify-center gap-3">
        {round.options.map((opt) => (
          <motion.button
            key={opt}
            onClick={() => {
              if (picked) return;
              setPicked(opt);
              speak?.(`${round.subject} ${opt}.`);
              setTimeout(() => onAnswer(opt === round.answer), 400);
            }}
            whileTap={{ scale: 0.93 }}
            whileHover={{ y: -3 }}
            className="focus-ring rounded-2xl border-4 border-terracotta-200 bg-white px-5 py-4 font-letter text-2xl font-bold text-terracotta-600 shadow-card hover:border-terracotta-300"
          >
            {opt}
          </motion.button>
        ))}
      </div>
    </div>
  );
}

function OrderMode({ round, onAnswer, speak }) {
  const [placed, setPlaced] = useState([]);
  const [pool, setPool] = useState(() => shuffle(round.words));

  useEffect(() => {
    setPlaced([]);
    setPool(shuffle(round.words));
  }, [round.id, round.words]);

  const reset = () => {
    setPlaced([]);
    setPool(shuffle(round.words));
  };

  const handleTap = (word, i) => {
    const nextPlaced = [...placed, word];
    setPlaced(nextPlaced);
    setPool(pool.filter((_, idx) => idx !== i));
    if (nextPlaced.length === round.words.length) {
      const sentence = nextPlaced.join(' ');
      const correct = nextPlaced.every((w, idx) => w === round.words[idx]);
      speak?.(sentence);
      setTimeout(() => onAnswer(correct), 500);
    }
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex min-h-[68px] w-full flex-wrap items-center justify-center gap-2 rounded-3xl bg-white/70 p-3">
        {placed.length === 0 ? (
          <span className="font-body text-base italic text-terracotta-500">
            Your sentence appears here.
          </span>
        ) : (
          placed.map((w, i) => (
            <span
              key={i}
              className="rounded-2xl border-4 border-sage-300 bg-sage-50 px-3 py-2 font-letter text-xl font-bold text-sage-600"
            >
              {w}
            </span>
          ))
        )}
      </div>

      <div className="flex flex-wrap items-center justify-center gap-2">
        {pool.map((word, i) => (
          <motion.button
            key={`${word}-${i}`}
            onClick={() => handleTap(word, i)}
            whileTap={{ scale: 0.92 }}
            whileHover={{ y: -2 }}
            className="focus-ring rounded-2xl border-4 border-terracotta-200 bg-white px-4 py-3 font-letter text-xl font-bold text-terracotta-600 shadow-card hover:border-terracotta-300"
          >
            {word}
          </motion.button>
        ))}
      </div>

      <button
        type="button"
        onClick={reset}
        className="focus-ring rounded-full bg-white/70 px-4 py-2 font-heading text-sm font-extrabold text-terracotta-500"
      >
        Start over
      </button>
    </div>
  );
}

function shuffle(arr) {
  const out = [...arr];
  for (let i = out.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  if (out.length > 1 && out.every((v, i) => v === arr[i])) {
    [out[0], out[1]] = [out[1], out[0]];
  }
  return out;
}
