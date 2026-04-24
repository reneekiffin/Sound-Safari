import { motion } from 'framer-motion';
import { useEffect, useMemo, useState } from 'react';
import AudioButton from '../shared/AudioButton.jsx';
import Celebration from '../shared/Celebration.jsx';
import PromptHeader from '../shared/PromptHeader.jsx';
import GameShell from './GameShell.jsx';
import { SOUND_BLENDING_ROUNDS } from '../../data/soundBlending.js';
import { pickSession } from '../../data/session.js';
import { useAudio } from '../../hooks/useAudio.js';
import { useSpeech } from '../../hooks/useSpeech.js';
import { getGame } from '../../data/games.js';
import { pickCheer, pickWrongCheer, pickFinishCheer, CORRECT_CHEERS } from '../../data/cheers.js';

// Sound Blending (Momo the Monkey). See data/soundBlending.js for shape.

const ROUNDS_PER_SESSION = 10;

export default function SoundBlending({ profile, totalStars, difficulty, recent, onExit, onFinish, onOpenSettings, audioEnabled, sfxEnabled, voiceURI, cloud }) {
  const game = getGame('sound-blending');

  const { rounds, nextRecent } = useMemo(() => {
    const pool = SOUND_BLENDING_ROUNDS[difficulty] ?? SOUND_BLENDING_ROUNDS.easy;
    return pickSession({ pool, recent, size: ROUNDS_PER_SESSION, getId: (r) => r.id });
  }, [difficulty, recent]);

  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [answered, setAnswered] = useState(false);
  const [wrongWord, setWrongWord] = useState(null);
  const [celebrateRound, setCelebrateRound] = useState(false);
  const [done, setDone] = useState(false);
  const [animatedIndex, setAnimatedIndex] = useState(-1);

  const { speak, speakPhonemeSequence } = useSpeech({ enabled: audioEnabled, preferredVoiceURI: voiceURI, cloud, speaker: 'monkey' });
  const { play } = useAudio({ enabled: sfxEnabled });

  const round = rounds[index];

  const playSequence = async ({ includeBlend = true } = {}) => {
    if (!round) return;
    setAnimatedIndex(-1);
    for (let i = 0; i < round.phonemes.length; i += 1) {
      setAnimatedIndex(i);
      // eslint-disable-next-line no-await-in-loop
      await speakPhonemeSequence([round.phonemes[i]], { gap: 0, stretched: true });
      // eslint-disable-next-line no-await-in-loop
      await new Promise((r) => setTimeout(r, 320));
    }
    setAnimatedIndex(-1);
    if (includeBlend) {
      await new Promise((r) => setTimeout(r, 250));
      await speak(round.answer, { rate: 0.85 });
    }
  };

  useEffect(() => {
    if (!round || done) return undefined;
    setAnswered(false);
    setWrongWord(null);
    const t = setTimeout(() => playSequence({ includeBlend: true }), 400);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [round, done]);

  const handlePick = (opt) => {
    if (answered || done) return;
    if (opt.word === round.answer) {
      play('correct');
      speak(`${pickCheer(CORRECT_CHEERS)} ${round.answer}!`);
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
      setWrongWord(opt.word);
      speak(pickWrongCheer());
      setTimeout(() => {
        setWrongWord(null);
        playSequence({ includeBlend: false });
      }, 600);
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
        <PromptHeader animal="monkey" happy={celebrateRound} hostLabel="Momo says...">
          <div className="mt-1 flex flex-wrap items-center justify-center gap-2">
            {round.phonemes.map((p, i) => (
              <motion.span
                key={`${round.id}-${i}`}
                animate={
                  animatedIndex === i
                    ? { scale: [1, 1.25, 1], color: '#679148' }
                    : { scale: 1, color: '#7a3214' }
                }
                transition={{ duration: 0.5 }}
                className="font-letter text-3xl font-bold sm:text-4xl"
              >
                {p}
              </motion.span>
            ))}
          </div>
        </PromptHeader>

        <div className="mt-2 flex items-center gap-4">
          <AudioButton
            onPress={() => {
              play('tap');
              playSequence({ includeBlend: true });
            }}
            label="Hear the sounds again"
          />
          <p className="max-w-xs text-left font-body text-base text-terracotta-600/90 sm:text-lg">
            Listen to each sound. Then tap the picture that matches!
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
        emoji="🐒"
        title="Blended!"
        subtitle="You smooshed those sounds together!"
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
      <span className="text-6xl sm:text-7xl" aria-hidden="true">
        {option.emoji}
      </span>
      <span className="mt-2 font-letter text-2xl font-bold text-terracotta-600">
        {option.word}
      </span>
    </motion.button>
  );
}
