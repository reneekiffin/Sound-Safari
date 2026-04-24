import { motion } from 'framer-motion';
import { useEffect, useMemo, useState } from 'react';
import AudioButton from '../shared/AudioButton.jsx';
import Celebration from '../shared/Celebration.jsx';
import AnimalHost from '../shared/AnimalHost.jsx';
import GameShell from './GameShell.jsx';
import { RHYME_TIME_ROUNDS } from '../../data/rhymeTime.js';
import { pickSession, shuffleOptions } from '../../data/session.js';
import { useAudio } from '../../hooks/useAudio.js';
import { useSpeech } from '../../hooks/useSpeech.js';
import { getGame } from '../../data/games.js';

// Rhyme Time (Polly the Parrot).  See data/rhymeTime.js for shape.

const ROUNDS_PER_SESSION = 10;

export default function RhymeTime({ profile, totalStars, difficulty, recent, onExit, onFinish, onOpenSettings, audioEnabled, sfxEnabled, voiceURI, cloud }) {
  const game = getGame('rhyme-time');

  const { rounds, nextRecent } = useMemo(() => {
    const pool = RHYME_TIME_ROUNDS[difficulty] ?? RHYME_TIME_ROUNDS.easy;
    const { rounds: picked, nextRecent: updated } = pickSession({ pool, recent, size: ROUNDS_PER_SESSION, getId: (r) => r.id });
    return { rounds: picked.map(shuffleOptions), nextRecent: updated };
  }, [difficulty, recent]);

  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [answered, setAnswered] = useState(false);
  const [wrongWord, setWrongWord] = useState(null);
  const [celebrateRound, setCelebrateRound] = useState(false);
  const [done, setDone] = useState(false);

  const { speak } = useSpeech({ enabled: audioEnabled, preferredVoiceURI: voiceURI, cloud });
  const { play } = useAudio({ enabled: sfxEnabled });

  const round = rounds[index];

  useEffect(() => {
    if (!round || done) return undefined;
    setAnswered(false);
    setWrongWord(null);
    const t = setTimeout(() => speak(`What rhymes with ${round.prompt}?`), 400);
    return () => clearTimeout(t);
  }, [round, speak, done]);

  const handlePick = (opt) => {
    if (answered || done) return;
    if (opt.word === round.answer) {
      play('correct');
      speak(`Squawk! ${round.prompt} and ${opt.word}!`);
      setAnswered(true);
      setCelebrateRound(true);
      setScore((s) => s + 1);
      setTimeout(() => {
        setCelebrateRound(false);
        if (index + 1 >= rounds.length) {
          finish(score + 1);
        } else {
          setIndex((i) => i + 1);
        }
      }, 1000);
    } else {
      play('wrong');
      setWrongWord(opt.word);
      speak(`${opt.word} does not rhyme with ${round.prompt}. Try again!`);
      setTimeout(() => setWrongWord(null), 600);
    }
  };

  const finish = (finalScore) => {
    setDone(true);
    play('celebrate');
    speak(`Fantastic rhyming! ${finalScore} out of ${rounds.length}!`);
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
          <div className="absolute left-2 top-0 sm:left-8">
            <AnimalHost type="parrot" size={140} happy={celebrateRound} />
          </div>
          <motion.div
            key={round.prompt}
            initial={{ rotate: -6, scale: 0.7, opacity: 0 }}
            animate={{ rotate: 0, scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 260, damping: 16 }}
            className="rounded-[40px] bg-white/90 px-8 py-5 shadow-card"
          >
            <p className="font-body text-sm font-bold uppercase tracking-wide text-terracotta-500">
              Polly says...
            </p>
            <p className="font-display text-4xl text-terracotta-600 sm:text-5xl">
              “{round.prompt}”
            </p>
          </motion.div>
        </div>

        <div className="mt-2 flex items-center gap-4">
          <AudioButton
            onPress={() => {
              play('tap');
              speak(`What rhymes with ${round.prompt}?`);
            }}
            label={`Hear the word ${round.prompt} again`}
          />
          <p className="max-w-xs text-left font-body text-base text-terracotta-600/90 sm:text-lg">
            Which of these rhymes with the parrot's word?
          </p>
        </div>

        <div
          className={[
            'mt-6 grid w-full gap-4',
            round.options.length > 3 ? 'grid-cols-2' : 'grid-cols-3',
          ].join(' ')}
        >
          {round.options.map((opt) => (
            <RhymeCard
              key={opt.word}
              option={opt}
              state={
                answered && opt.word === round.answer
                  ? 'correct'
                  : wrongWord === opt.word
                  ? 'wrong'
                  : 'idle'
              }
              onTap={() => handlePick(opt)}
              onPreview={() => speak(opt.word, { rate: 0.85 })}
            />
          ))}
        </div>
      </div>

      <Celebration
        show={celebrateRound}
        emoji="🦜"
        title="Rhymes-a-riffic!"
        subtitle="Your ear is on fire!"
      />
    </GameShell>
  );
}

function RhymeCard({ option, state, onTap, onPreview }) {
  return (
    <motion.button
      onClick={onTap}
      onHoverStart={onPreview}
      onFocus={onPreview}
      aria-label={option.word}
      whileTap={{ scale: 0.93 }}
      whileHover={{ y: -4, rotate: 1 }}
      animate={
        state === 'wrong'
          ? { x: [-10, 10, -6, 6, 0] }
          : state === 'correct'
          ? { scale: [1, 1.1, 1], rotate: [0, -6, 6, 0] }
          : undefined
      }
      transition={{ type: 'spring', stiffness: 320, damping: 18 }}
      className={[
        'focus-ring flex flex-col items-center rounded-[28px] border-4 bg-white p-4 text-center shadow-card',
        state === 'correct'
          ? 'border-sage-400 bg-sage-100'
          : state === 'wrong'
          ? 'border-parrot-400 bg-parrot-400/10'
          : 'border-terracotta-200 hover:border-terracotta-300',
      ].join(' ')}
    >
      <span className="text-6xl sm:text-7xl" aria-hidden="true">
        {option.emoji}
      </span>
      <span className="mt-2 font-letter text-2xl font-bold text-terracotta-600">
        {option.word}
      </span>
    </motion.button>
  );
}
