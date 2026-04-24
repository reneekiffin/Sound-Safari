import { motion } from 'framer-motion';
import { useEffect, useMemo, useState } from 'react';
import AudioButton from '../shared/AudioButton.jsx';
import Celebration from '../shared/Celebration.jsx';
import AnimalHost from '../shared/AnimalHost.jsx';
import GameShell from './GameShell.jsx';
import { OPPOSITES_ROUNDS } from '../../data/opposites.js';
import { pickSession, shuffleOptions } from '../../data/session.js';
import { useAudio } from '../../hooks/useAudio.js';
import { useSpeech } from '../../hooks/useSpeech.js';
import { getGame } from '../../data/games.js';

// Opposites (Toby the Toucan).  Simple "pick the word that means the
// other thing" flow, sharing the picture-card layout used elsewhere.

const ROUNDS_PER_SESSION = 10;

export default function Opposites({ profile, totalStars, difficulty, recent, onExit, onFinish, onOpenSettings, audioEnabled, sfxEnabled, voiceURI, cloud }) {
  const game = getGame('opposites');

  const { rounds, nextRecent } = useMemo(() => {
    const pool = OPPOSITES_ROUNDS[difficulty] ?? OPPOSITES_ROUNDS.easy;
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
    const t = setTimeout(() => {
      speak(`What's the opposite of ${round.prompt.word}?`);
    }, 400);
    return () => clearTimeout(t);
  }, [round, speak, done]);

  const handlePick = (opt) => {
    if (answered || done) return;
    if (opt.word === round.answer) {
      play('correct');
      speak(`Yes! The opposite of ${round.prompt.word} is ${opt.word}.`);
      setAnswered(true);
      setCelebrateRound(true);
      setScore((s) => s + 1);
      setTimeout(() => {
        setCelebrateRound(false);
        if (index + 1 >= rounds.length) finish(score + 1);
        else setIndex((i) => i + 1);
      }, 1000);
    } else {
      play('wrong');
      setWrongWord(opt.word);
      speak(`${opt.word} isn't the opposite. Try again!`);
      setTimeout(() => setWrongWord(null), 600);
    }
  };

  const finish = (finalScore) => {
    setDone(true);
    play('celebrate');
    speak(`Brilliant! ${finalScore} out of ${rounds.length}!`);
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
            <AnimalHost type="toucan" size={140} happy={celebrateRound} />
          </div>
          <motion.div
            key={round.id}
            initial={{ rotate: -4, scale: 0.7, opacity: 0 }}
            animate={{ rotate: 0, scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 240, damping: 18 }}
            className="flex flex-col items-center rounded-[40px] bg-white/90 px-8 py-5 shadow-card"
          >
            <p className="font-body text-sm font-bold uppercase tracking-wide text-terracotta-500">
              Toby says...
            </p>
            <span className="text-6xl" aria-hidden="true">{round.prompt.emoji}</span>
            <p className="mt-1 font-display text-4xl text-terracotta-600 sm:text-5xl">
              {round.prompt.word}
            </p>
          </motion.div>
        </div>

        <div className="mt-2 flex items-center gap-4">
          <AudioButton
            onPress={() => {
              play('tap');
              speak(`What's the opposite of ${round.prompt.word}?`);
            }}
            label="Hear the prompt again"
          />
          <p className="max-w-xs text-left font-body text-base text-terracotta-600/90 sm:text-lg">
            Pick the word that means the other thing!
          </p>
        </div>

        <div
          className={[
            'mt-6 grid w-full gap-4',
            round.options.length > 3 ? 'grid-cols-2' : 'grid-cols-3',
          ].join(' ')}
        >
          {round.options.map((opt) => (
            <PictureCard
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
              onPreview={() => speak(opt.word, { rate: 0.9 })}
            />
          ))}
        </div>
      </div>

      <Celebration
        show={celebrateRound}
        emoji="🦜"
        title="Flipped it!"
        subtitle="You found the opposite!"
      />
    </GameShell>
  );
}

function PictureCard({ option, state, onTap, onPreview }) {
  return (
    <motion.button
      onClick={onTap}
      onHoverStart={onPreview}
      onFocus={onPreview}
      aria-label={option.word}
      whileTap={{ scale: 0.93 }}
      whileHover={{ y: -4 }}
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
      <span className="text-5xl sm:text-6xl" aria-hidden="true">{option.emoji}</span>
      <span className="mt-2 font-letter text-xl font-bold text-terracotta-600">
        {option.word}
      </span>
    </motion.button>
  );
}
