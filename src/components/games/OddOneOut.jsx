import { motion } from 'framer-motion';
import { useEffect, useMemo, useState } from 'react';
import AudioButton from '../shared/AudioButton.jsx';
import Celebration from '../shared/Celebration.jsx';
import PromptHeader from '../shared/PromptHeader.jsx';
import GameShell from './GameShell.jsx';
import { ODD_ONE_OUT_ROUNDS } from '../../data/oddOneOut.js';
import { pickSession } from '../../data/session.js';
import { useAudio } from '../../hooks/useAudio.js';
import { useSpeech } from '../../hooks/useSpeech.js';
import { getGame } from '../../data/games.js';

// Odd One Out (Zara the Zebra).  Simple "tap the one that's different"
// flow.  Rounds span shapes, colours, animals, food, vehicles, size, and
// habitats — the session picker balances categories so a session isn't
// all-one-topic.

const ROUNDS_PER_SESSION = 10;

export default function OddOneOut({ profile, totalStars, difficulty, recent, onExit, onFinish, onOpenSettings, audioEnabled, sfxEnabled, voiceURI, cloud }) {
  const game = getGame('odd-one-out');

  const { rounds, nextRecent } = useMemo(() => {
    const pool = ODD_ONE_OUT_ROUNDS[difficulty] ?? ODD_ONE_OUT_ROUNDS.easy;
    return pickSession({ pool, recent, size: ROUNDS_PER_SESSION, getId: (r) => r.id });
  }, [difficulty, recent]);

  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [answered, setAnswered] = useState(false);
  const [wrongId, setWrongId] = useState(null);
  const [celebrateRound, setCelebrateRound] = useState(false);
  const [done, setDone] = useState(false);

  const { speak } = useSpeech({ enabled: audioEnabled, preferredVoiceURI: voiceURI, cloud });
  const { play } = useAudio({ enabled: sfxEnabled });
  const round = rounds[index];

  // Shuffle items per round so the "odd" slot isn't always in the same
  // position.  We memoise so the layout is stable across re-renders of
  // the same round.
  const shuffledItems = useMemo(() => {
    if (!round) return [];
    return [...round.items]
      .map((item, i) => ({ ...item, key: `${round.id}-${i}` }))
      .sort(() => Math.random() - 0.5);
  }, [round]);

  useEffect(() => {
    if (!round || done) return undefined;
    setAnswered(false);
    setWrongId(null);
    const t = setTimeout(() => speak(round.prompt), 400);
    return () => clearTimeout(t);
  }, [round, done, speak]);

  const handlePick = (item) => {
    if (answered || done) return;
    if (item.odd) {
      play('correct');
      speak('Yes! That one is different!');
      setAnswered(true);
      setCelebrateRound(true);
      setScore((s) => s + 1);
      setTimeout(() => {
        setCelebrateRound(false);
        if (index + 1 >= rounds.length) finish(score + 1);
        else setIndex((i) => i + 1);
      }, 900);
    } else {
      play('wrong');
      setWrongId(item.key);
      speak('Try again!');
      setTimeout(() => setWrongId(null), 500);
    }
  };

  const finish = (finalScore) => {
    setDone(true);
    play('celebrate');
    speak(`Zippy work! ${finalScore} out of ${rounds.length}!`);
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
        <PromptHeader animal="zebra" happy={celebrateRound} hostLabel="Zara says...">
          <p className="mt-1 font-heading text-xl font-extrabold text-terracotta-600 sm:text-2xl">
            {round.prompt}
          </p>
        </PromptHeader>

        <div className="mt-4 flex items-center gap-4">
          <AudioButton
            onPress={() => {
              play('tap');
              speak(round.prompt);
            }}
            label="Hear the question again"
          />
          <p className="max-w-xs text-left font-body text-base text-terracotta-600/90 sm:text-lg">
            Tap the one that doesn't match the others!
          </p>
        </div>

        <div
          className={[
            'mt-6 grid w-full gap-4',
            shuffledItems.length > 3 ? 'grid-cols-2 sm:grid-cols-4' : 'grid-cols-3',
          ].join(' ')}
        >
          {shuffledItems.map((item) => (
            <ItemCard
              key={item.key}
              item={item}
              state={
                answered && item.odd
                  ? 'correct'
                  : wrongId === item.key
                  ? 'wrong'
                  : 'idle'
              }
              onTap={() => handlePick(item)}
              onPreview={() => speak(item.label, { rate: 0.9 })}
            />
          ))}
        </div>
      </div>

      <Celebration
        show={celebrateRound}
        emoji="🦓"
        title="Eagle eyes!"
        subtitle="You spotted the different one!"
      />
    </GameShell>
  );
}

function ItemCard({ item, state, onTap, onPreview }) {
  return (
    <motion.button
      onClick={onTap}
      onHoverStart={onPreview}
      onFocus={onPreview}
      aria-label={item.label}
      whileTap={{ scale: 0.93 }}
      whileHover={{ y: -4 }}
      animate={
        state === 'wrong'
          ? { x: [-10, 10, -6, 6, 0] }
          : state === 'correct'
          ? { scale: [1, 1.15, 1], rotate: [0, -6, 6, 0] }
          : undefined
      }
      transition={{ type: 'spring', stiffness: 320, damping: 18 }}
      className={[
        'focus-ring flex aspect-square flex-col items-center justify-center rounded-[28px] border-4 bg-white p-4 text-center shadow-card',
        state === 'correct'
          ? 'border-sage-400 bg-sage-100'
          : state === 'wrong'
          ? 'border-parrot-400 bg-parrot-400/10'
          : 'border-terracotta-200 hover:border-terracotta-300',
      ].join(' ')}
    >
      <span className="text-6xl sm:text-7xl" aria-hidden="true">{item.emoji}</span>
      <span className="mt-2 font-letter text-sm font-bold text-terracotta-600/80">
        {item.label}
      </span>
    </motion.button>
  );
}
