import { motion } from 'framer-motion';
import { useEffect, useMemo, useState } from 'react';
import AudioButton from '../shared/AudioButton.jsx';
import Celebration from '../shared/Celebration.jsx';
import PromptHeader from '../shared/PromptHeader.jsx';
import GameShell from './GameShell.jsx';
import { SENTENCES_LESSONS, SENTENCES_ROUNDS } from '../../data/sentences.js';
import { pickSession } from '../../data/session.js';
import { useAudio } from '../../hooks/useAudio.js';
import { useSpeech } from '../../hooks/useSpeech.js';
import { getGame } from '../../data/games.js';
import { pickCheer, pickWrongCheer, pickFinishCheer, CORRECT_CHEERS } from '../../data/cheers.js';

// Sentence Builder (Gigi the Giraffe).  Three round shapes:
//   - fill   : fill the blank in a short sentence
//   - order  : tap word chips in the right order
//   - verb   : pick the correct verb form for the given subject
// The session picker mixes shapes; this component branches on `round.kind`.
//
// Wrong-answer handling: we don't advance on an incorrect pick — we play
// the wrong SFX, say "Hmm, not quite — try again!", and bump a `wrongKey`
// that each child mode watches to reset its local state.  That lets the
// kid try again with a fresh board instead of being stuck on their wrong
// pick (the old behaviour was to just play a sound and do nothing else).

const ROUNDS_PER_SESSION = 10;

export default function Sentences({ profile, totalStars, difficulty, recent, onExit, onFinish, onOpenSettings, audioEnabled, sfxEnabled, voiceURI, cloud }) {
  const game = getGame('sentences');

  // Optional lesson override ('all' = mix from the current difficulty tier).
  // Reset the session key when the lesson changes so the board restarts.
  const [lessonId, setLessonId] = useState('all');
  const [lessonKey, setLessonKey] = useState(0);

  const { rounds, nextRecent } = useMemo(() => {
    const pool =
      lessonId === 'all'
        ? SENTENCES_ROUNDS[difficulty] ?? SENTENCES_ROUNDS.easy
        : SENTENCES_LESSONS.find((l) => l.id === lessonId)?.rounds ?? [];
    // balanceBy 'category' spreads the picks across lessons so "easy"
    // and "medium" tiers don't hand the kid 8 rounds of one lesson.
    return pickSession({
      pool,
      recent,
      size: ROUNDS_PER_SESSION,
      getId: (r) => r.id,
      balanceBy: 'category',
    });
  }, [difficulty, recent, lessonId, lessonKey]);

  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);
  const [celebrateRound, setCelebrateRound] = useState(false);
  // Bumped every time the kid gets it wrong — child modes watch this to
  // reset their picked/placed state so the kid can try again cleanly.
  const [wrongKey, setWrongKey] = useState(0);

  const { speak } = useSpeech({ enabled: audioEnabled, preferredVoiceURI: voiceURI, cloud, speaker: 'giraffe' });
  const { play } = useAudio({ enabled: sfxEnabled });
  const round = rounds[index];

  // Auto-speak the prompt when a new round arrives.  `speak` is stable
  // across voices loading, so the effect only runs once per round.
  useEffect(() => {
    if (!round || done) return undefined;
    const t = setTimeout(() => {
      if (round.kind === 'fill') speak(`${round.before} (blank) ${round.after}`);
      else if (round.kind === 'verb') speak(`${round.subject}. Pick the right form of ${round.verb}.`);
      else if (round.kind === 'order') speak('Put these words in order to make a sentence.');
    }, 400);
    return () => clearTimeout(t);
  }, [round, done, speak]);

  const advance = (correct) => {
    if (correct) {
      play('correct');
      speak(`${pickCheer(CORRECT_CHEERS)} Great sentence!`);
      setScore((s) => s + 1);
      setCelebrateRound(true);
      setTimeout(() => {
        setCelebrateRound(false);
        if (index + 1 >= rounds.length) finish(score + 1);
        else setIndex((i) => i + 1);
      }, 1000);
    } else {
      play('wrong');
      speak(pickWrongCheer());
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
        <LessonPicker
          value={lessonId}
          onChange={(id) => {
            setLessonId(id);
            setIndex(0);
            setScore(0);
            setLessonKey((k) => k + 1);
          }}
        />

        <PromptHeader animal="giraffe" mascotSize={110} happy={celebrateRound} hostLabel="Gigi says...">
          <p className="mt-1 font-heading text-lg font-extrabold text-terracotta-600 sm:text-xl">
            {round.kind === 'order'
              ? 'Tap the words in order to build a sentence.'
              : round.kind === 'verb'
              ? 'Pick the right form of the verb.'
              : 'Fill in the blank.'}
          </p>
        </PromptHeader>

        <div className="mt-4 flex items-center gap-4">
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
          {round.kind === 'fill' && <FillMode round={round} onAnswer={advance} speak={speak} wrongKey={wrongKey} />}
          {round.kind === 'verb' && <VerbMode round={round} onAnswer={advance} speak={speak} wrongKey={wrongKey} />}
          {round.kind === 'order' && <OrderMode round={round} onAnswer={advance} speak={speak} wrongKey={wrongKey} />}
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

function FillMode({ round, onAnswer, speak, wrongKey }) {
  const [picked, setPicked] = useState(null);
  // Reset on round change OR when the kid got it wrong (wrongKey bumped).
  useEffect(() => setPicked(null), [round.id, wrongKey]);

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
              setTimeout(() => onAnswer(opt === round.answer), 500);
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

function VerbMode({ round, onAnswer, speak, wrongKey }) {
  const [picked, setPicked] = useState(null);
  useEffect(() => setPicked(null), [round.id, wrongKey]);

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
              setTimeout(() => onAnswer(opt === round.answer), 500);
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

function OrderMode({ round, onAnswer, speak, wrongKey }) {
  const [placed, setPlaced] = useState([]);
  const [pool, setPool] = useState(() => shuffle(round.words));

  // Reset on new round OR wrong answer.  The kid gets a re-shuffled pool
  // so they can try again — not the same ordered-incorrectly board.
  useEffect(() => {
    setPlaced([]);
    setPool(shuffle(round.words));
  }, [round.id, round.words, wrongKey]);

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
      setTimeout(() => onAnswer(correct), 600);
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

// In-game lesson picker.  "Mixed" defers to the difficulty setting; the
// named options scope the session to a specific subject-verb lesson.
function LessonPicker({ value, onChange }) {
  const opts = [
    { id: 'all', label: 'Mixed' },
    ...SENTENCES_LESSONS.map((l) => ({ id: l.id, label: l.short })),
  ];
  return (
    <div className="mb-3 flex w-full flex-wrap items-center justify-center gap-2">
      <span className="font-body text-xs font-bold uppercase tracking-widest text-terracotta-500">
        Lesson
      </span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-label="Choose a grammar lesson"
        className="focus-ring rounded-full border-4 border-terracotta-200 bg-white px-3 py-1.5 font-heading text-sm font-extrabold text-terracotta-600"
      >
        {opts.map((opt) => (
          <option key={opt.id} value={opt.id}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}
