import { motion } from 'framer-motion';
import { useEffect, useMemo, useState } from 'react';
import AudioButton from '../shared/AudioButton.jsx';
import Celebration from '../shared/Celebration.jsx';
import PromptHeader from '../shared/PromptHeader.jsx';
import GameShell from './GameShell.jsx';
import { HOMOPHONES_ROUNDS } from '../../data/homophones.js';
import { pickSession } from '../../data/session.js';
import { useAudio } from '../../hooks/useAudio.js';
import { useSpeech } from '../../hooks/useSpeech.js';
import { getGame } from '../../data/games.js';
import {
  pickCheer,
  pickWrongCheer,
  pickFinishCheer,
  CORRECT_CHEERS,
} from '../../data/cheers.js';

// Homophones (Skippy the Squirrel).  Two round shapes mixed by the
// session picker:
//   - picture  : hear a word, pick the picture that matches
//   - sentence : fill the blank with the correct spelling
// Category-balanced so a session isn't all-pictures or all-sentences.

const ROUNDS_PER_SESSION = 10;

export default function Homophones({ profile, totalStars, difficulty, recent, onExit, onFinish, onOpenSettings, audioEnabled, sfxEnabled, voiceURI, cloud }) {
  const game = getGame('homophones');

  const { rounds, nextRecent } = useMemo(() => {
    const pool = HOMOPHONES_ROUNDS[difficulty] ?? HOMOPHONES_ROUNDS.easy;
    return pickSession({
      pool,
      recent,
      size: ROUNDS_PER_SESSION,
      getId: (r) => r.id,
      balanceBy: 'category',
    });
  }, [difficulty, recent]);

  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [answered, setAnswered] = useState(false);
  const [wrongPick, setWrongPick] = useState(null);
  const [celebrateRound, setCelebrateRound] = useState(false);
  const [celebrationPhrase, setCelebrationPhrase] = useState('Nice one!');
  const [done, setDone] = useState(false);

  const { speak } = useSpeech({
    enabled: audioEnabled,
    preferredVoiceURI: voiceURI,
    cloud,
    speaker: 'squirrel',
  });
  const { play } = useAudio({ enabled: sfxEnabled });
  const round = rounds[index];

  useEffect(() => {
    if (!round || done) return undefined;
    setAnswered(false);
    setWrongPick(null);
    const t = setTimeout(() => {
      if (round.kind === 'picture') {
        speak(`Tap the picture for ${round.prompt.word}.`);
      } else {
        // Sentence mode — read the sentence with "blank" where the
        // missing word goes.  Kids read along and pick.
        speak(`${round.before} blank ${round.after}`);
      }
    }, 400);
    return () => clearTimeout(t);
  }, [round, done, speak]);

  const handlePick = (opt) => {
    if (answered || done) return;
    const value = round.kind === 'picture' ? opt.word : opt;
    if (value === round.answer) {
      play('correct');
      const cheer = pickCheer(CORRECT_CHEERS);
      setCelebrationPhrase(cheer);
      speak(`${cheer} ${round.answer}!`);
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
      setWrongPick(value);
      speak(pickWrongCheer());
      setTimeout(() => setWrongPick(null), 500);
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
        <PromptHeader animal="squirrel" happy={celebrateRound} hostLabel="Skippy says...">
          {round.kind === 'picture' ? (
            <>
              <p className="mt-1 font-display text-4xl text-terracotta-600 sm:text-5xl">
                “{round.prompt.word}”
              </p>
              <p className="mt-1 font-body text-sm font-bold text-terracotta-500">
                which picture?
              </p>
            </>
          ) : (
            <>
              <p className="mt-1 font-heading text-lg font-extrabold text-terracotta-600 sm:text-xl">
                Fill in the right word
              </p>
              <p className="mt-2 font-body text-base text-terracotta-600/90 sm:text-lg">
                {round.before}
                <span className="mx-1 inline-block rounded-lg border-2 border-dashed border-terracotta-300 px-2 text-terracotta-400">
                  _____
                </span>
                {round.after}
              </p>
            </>
          )}
        </PromptHeader>

        <div className="mt-4 flex items-center gap-4">
          <AudioButton
            onPress={() => {
              play('tap');
              if (round.kind === 'picture') {
                speak(round.prompt.word);
              } else {
                speak(`${round.before} blank ${round.after}`);
              }
            }}
            label={round.kind === 'picture' ? 'Hear the word' : 'Hear the sentence'}
          />
          <p className="max-w-xs text-left font-body text-base text-terracotta-600/90 sm:text-lg">
            {round.kind === 'picture'
              ? 'Some words sound the same but mean different things!'
              : 'Pick the word that fits the sentence.'}
          </p>
        </div>

        {round.kind === 'picture' ? (
          <div
            className={[
              'mt-6 grid w-full gap-4',
              round.options.length > 2 ? 'grid-cols-3' : 'grid-cols-2',
            ].join(' ')}
          >
            {round.options.map((opt) => (
              <motion.button
                key={opt.word}
                onClick={() => handlePick(opt)}
                onHoverStart={() => speak(opt.word)}
                onFocus={() => speak(opt.word)}
                aria-label={opt.word}
                whileTap={{ scale: 0.93 }}
                whileHover={{ y: -4 }}
                animate={
                  wrongPick === opt.word
                    ? { x: [-10, 10, -6, 6, 0] }
                    : answered && opt.word === round.answer
                    ? { scale: [1, 1.15, 1], rotate: [0, -6, 6, 0] }
                    : undefined
                }
                transition={{ type: 'spring', stiffness: 320, damping: 18 }}
                className={[
                  'focus-ring flex flex-col items-center rounded-[28px] border-4 bg-white p-4 text-center shadow-card',
                  answered && opt.word === round.answer
                    ? 'border-sage-400 bg-sage-100'
                    : wrongPick === opt.word
                    ? 'border-parrot-400 bg-parrot-400/10'
                    : 'border-terracotta-200 hover:border-terracotta-300',
                ].join(' ')}
              >
                <span className="text-6xl sm:text-7xl" aria-hidden="true">{opt.emoji}</span>
                <span className="mt-2 font-letter text-xl font-bold text-terracotta-600">
                  {opt.word}
                </span>
              </motion.button>
            ))}
          </div>
        ) : (
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            {round.options.map((opt) => (
              <motion.button
                key={opt}
                onClick={() => handlePick(opt)}
                onHoverStart={() => speak(opt)}
                onFocus={() => speak(opt)}
                aria-label={opt}
                whileTap={{ scale: 0.93 }}
                whileHover={{ y: -3 }}
                animate={
                  wrongPick === opt
                    ? { x: [-10, 10, -6, 6, 0] }
                    : answered && opt === round.answer
                    ? { scale: [1, 1.15, 1] }
                    : undefined
                }
                transition={{ type: 'spring', stiffness: 320, damping: 18 }}
                className={[
                  'focus-ring rounded-2xl border-4 px-5 py-4 font-letter text-2xl font-bold shadow-card transition-colors',
                  answered && opt === round.answer
                    ? 'border-sage-400 bg-sage-100 text-sage-600'
                    : wrongPick === opt
                    ? 'border-parrot-400 bg-parrot-400/10 text-parrot-500'
                    : 'border-terracotta-200 bg-white text-terracotta-600 hover:border-terracotta-300',
                ].join(' ')}
              >
                {opt}
              </motion.button>
            ))}
          </div>
        )}
      </div>

      <Celebration
        show={celebrateRound}
        emoji="🐿️"
        title={celebrationPhrase}
        subtitle="Sound-alike sleuth!"
      />
    </GameShell>
  );
}
