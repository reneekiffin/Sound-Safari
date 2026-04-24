import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useMemo, useRef, useState } from 'react';
import AudioButton from '../shared/AudioButton.jsx';
import Button from '../shared/Button.jsx';
import Celebration from '../shared/Celebration.jsx';
import AnimalHost from '../shared/AnimalHost.jsx';
import GameShell from './GameShell.jsx';
import { pickLetterSoundsSession, PHONEME_SCRIPTS } from '../../data/letterSounds.js';
import { useAudio } from '../../hooks/useAudio.js';
import { useSpeech } from '../../hooks/useSpeech.js';
import { getGame } from '../../data/games.js';

// Letter Sounds game (Leo the Lion).
//
// Round flow:
//   1. Lion speaks an instruction ("Tap the letter that makes the _ sound")
//   2. Kid can replay the sound any time via the big speaker button
//   3. Kid taps one of 3-4 letter cards
//   4. Correct -> lion cheers + card bounces + short confetti, then advance
//      Wrong -> card shakes, gentle "try again", cards stay tappable (no
//      time pressure).
const ROUNDS_PER_SESSION = 10;

export default function LetterSounds({ profile, totalStars, difficulty, onExit, onFinish, onOpenSettings, audioEnabled, sfxEnabled }) {
  const game = getGame('letter-sounds');
  const rounds = useMemo(
    () => pickLetterSoundsSession(difficulty, ROUNDS_PER_SESSION),
    [difficulty],
  );

  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [answered, setAnswered] = useState(false);
  const [celebrateRound, setCelebrateRound] = useState(false);
  const [wrongLetter, setWrongLetter] = useState(null);
  const [done, setDone] = useState(false);

  const { speak } = useSpeech({ enabled: audioEnabled });
  const { play } = useAudio({ enabled: sfxEnabled });

  const currentRound = rounds[index];
  const hasAutoSpoken = useRef(false);

  // Whenever the round changes, auto-play the sound after a short beat so
  // kids have something to respond to without needing to read instructions.
  useEffect(() => {
    if (!currentRound || done) return undefined;
    hasAutoSpoken.current = false;
    setAnswered(false);
    setWrongLetter(null);
    const t = setTimeout(() => {
      speak(`Tap the letter that says ${currentRound.sound}`);
      hasAutoSpoken.current = true;
    }, 400);
    return () => clearTimeout(t);
  }, [currentRound, speak, done]);

  const replaySound = () => {
    if (!currentRound) return;
    play('tap');
    speak(currentRound.sound, { rate: 0.7 });
  };

  const handlePick = (letter) => {
    if (answered || done) return;
    if (letter === currentRound.correctLetter) {
      play('correct');
      speak('Yes! Great job!');
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
      }, 900);
    } else {
      play('wrong');
      setWrongLetter(letter);
      speak(`Oops, try again!`);
      setTimeout(() => setWrongLetter(null), 500);
    }
  };

  const finish = (finalScore) => {
    setDone(true);
    play('celebrate');
    speak(`Amazing! You got ${finalScore} out of ${rounds.length}!`);
    // Stars: one per correct answer, plus a bonus star for perfect scores.
    const earnedStars = finalScore + (finalScore === rounds.length ? 1 : 0);
    onFinish({ earnedStars, score: finalScore, total: rounds.length });
  };

  if (done) return null;

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
        <div className="relative flex h-40 w-full items-center justify-center sm:h-48">
          <motion.div className="absolute left-2 top-0 sm:left-8">
            <AnimalHost type="lion" size={140} happy={celebrateRound} />
          </motion.div>
          <motion.div
            key={currentRound.sound}
            initial={{ scale: 0.6, y: 10, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 250, damping: 16 }}
            className="rounded-[40px] bg-white/90 px-8 py-5 shadow-card"
          >
            <p className="font-body text-sm font-bold uppercase tracking-wide text-terracotta-500">
              Leo says...
            </p>
            <p className="font-display text-4xl text-terracotta-600 sm:text-5xl">
              “{currentRound.sound}”
            </p>
          </motion.div>
        </div>

        <div className="mt-2 flex items-center gap-4">
          <AudioButton onPress={replaySound} label={`Play the sound ${currentRound.sound} again`} />
          <p className="max-w-xs text-left font-body text-base text-terracotta-600/90 sm:text-lg">
            Tap the speaker to hear it again. Then tap the matching letter!
          </p>
        </div>

        <div
          className={[
            'mt-6 grid w-full gap-4',
            currentRound.options.length > 3 ? 'grid-cols-2 sm:grid-cols-4' : 'grid-cols-3',
          ].join(' ')}
        >
          <AnimatePresence>
            {currentRound.options.map((letter) => (
              <LetterCard
                key={letter}
                letter={letter}
                state={
                  answered && letter === currentRound.correctLetter
                    ? 'correct'
                    : wrongLetter === letter
                    ? 'wrong'
                    : 'idle'
                }
                onTap={() => handlePick(letter)}
                onPreview={() =>
                  speak(PHONEME_SCRIPTS[letter] ?? letter, { rate: 0.7 })
                }
              />
            ))}
          </AnimatePresence>
        </div>
      </div>

      <Celebration
        show={celebrateRound}
        emoji="🦁"
        title="Nice one!"
        subtitle="You heard it just right."
      />
    </GameShell>
  );
}

function LetterCard({ letter, state, onTap, onPreview }) {
  return (
    <motion.button
      onClick={onTap}
      onHoverStart={onPreview}
      onFocus={onPreview}
      aria-label={`Letter ${letter}`}
      whileTap={{ scale: 0.92 }}
      whileHover={{ y: -4, rotate: -2 }}
      animate={
        state === 'wrong'
          ? { x: [-10, 10, -6, 6, 0] }
          : state === 'correct'
          ? { scale: [1, 1.12, 1], rotate: [0, -6, 6, 0] }
          : undefined
      }
      transition={{ type: 'spring', stiffness: 360, damping: 16 }}
      className={[
        'focus-ring relative aspect-square w-full rounded-[28px] border-4 bg-white text-center shadow-card transition-colors',
        state === 'correct'
          ? 'border-sage-400 bg-sage-100'
          : state === 'wrong'
          ? 'border-parrot-400 bg-parrot-400/10'
          : 'border-terracotta-200 hover:border-terracotta-300',
      ].join(' ')}
    >
      <span className="font-letter text-7xl font-bold leading-none text-terracotta-600 sm:text-8xl">
        {letter}
      </span>
    </motion.button>
  );
}
