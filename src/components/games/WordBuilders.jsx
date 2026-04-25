import { motion } from 'framer-motion';
import { useEffect, useMemo, useState } from 'react';
import AudioButton from '../shared/AudioButton.jsx';
import Celebration from '../shared/Celebration.jsx';
import PromptHeader from '../shared/PromptHeader.jsx';
import GameShell from './GameShell.jsx';
import { WORD_BUILDERS_ROUNDS } from '../../data/wordBuilders.js';
import { pickSession, shuffleOptions } from '../../data/session.js';
import { useAudio } from '../../hooks/useAudio.js';
import { useSpeech } from '../../hooks/useSpeech.js';
import { getGame } from '../../data/games.js';
import {
  pickCheer,
  pickWrongCheer,
  pickFinishCheer,
  CORRECT_CHEERS,
} from '../../data/cheers.js';

// Word Builders (Penny the Panda).  Kid fills in the missing letter or
// letter-pair to complete a word.  Mixes simple CVC vowel picks ("c_t"),
// initial digraphs ("__ip"), final digraphs ("du__"), blends, and vowel
// pairs across the difficulty tiers.

const ROUNDS_PER_SESSION = 10;

export default function WordBuilders({ profile, totalStars, difficulty, recent, onExit, onFinish, onOpenSettings, audioEnabled, sfxEnabled, voiceURI, cloud }) {
  const game = getGame('word-builders');

  const { rounds, nextRecent } = useMemo(() => {
    const pool = WORD_BUILDERS_ROUNDS[difficulty] ?? WORD_BUILDERS_ROUNDS.easy;
    const { rounds: picked, nextRecent: updated } = pickSession({
      pool,
      recent,
      size: ROUNDS_PER_SESSION,
      getId: (r) => r.id,
      balanceBy: 'category',
    });
    return { rounds: picked.map(shuffleOptions), nextRecent: updated };
  }, [difficulty, recent]);

  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [picked, setPicked] = useState(null);
  const [wrong, setWrong] = useState(null);
  const [celebrateRound, setCelebrateRound] = useState(false);
  const [celebrationPhrase, setCelebrationPhrase] = useState('Nice one!');
  const [done, setDone] = useState(false);

  const { speak } = useSpeech({
    enabled: audioEnabled,
    preferredVoiceURI: voiceURI,
    cloud,
    speaker: 'panda',
  });
  const { play } = useAudio({ enabled: sfxEnabled });
  const round = rounds[index];

  useEffect(() => {
    if (!round || done) return undefined;
    setPicked(null);
    setWrong(null);
    const t = setTimeout(() => {
      speak(`Can you help me finish this word?  ${round.word}.`);
    }, 400);
    return () => clearTimeout(t);
  }, [round, done, speak]);

  const handlePick = (opt) => {
    if (picked || done) return;
    if (opt === round.answer) {
      play('correct');
      setPicked(opt);
      const cheer = pickCheer(CORRECT_CHEERS);
      setCelebrationPhrase(cheer);
      speak(`${cheer} That spells ${round.word}!`);
      setCelebrateRound(true);
      setScore((s) => s + 1);
      setTimeout(() => {
        setCelebrateRound(false);
        if (index + 1 >= rounds.length) finish(score + 1);
        else setIndex((i) => i + 1);
      }, 1900);
    } else {
      play('wrong');
      setWrong(opt);
      speak(pickWrongCheer());
      setTimeout(() => setWrong(null), 500);
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

  const solved = picked === round.answer;

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
        <PromptHeader animal="panda" happy={celebrateRound} hostLabel="Penny says...">
          <span className="mt-1 block text-6xl" aria-hidden="true">
            {round.emoji}
          </span>
          {/* The target word with a highlighted blank — becomes the
              completed word once the kid picks the right answer. */}
          <div className="mt-2 flex items-center justify-center gap-1 font-letter text-4xl font-bold text-terracotta-600 sm:text-5xl">
            {round.before && <span>{round.before}</span>}
            <span
              className={[
                'inline-flex min-w-[48px] items-center justify-center rounded-xl border-4 px-2 py-1 transition-colors',
                solved
                  ? 'border-sage-400 bg-sage-100 text-sage-600'
                  : 'border-dashed border-terracotta-300 bg-white/70 text-terracotta-400',
              ].join(' ')}
            >
              {picked ? round.answer : '_'}
            </span>
            {round.after && <span>{round.after}</span>}
          </div>
        </PromptHeader>

        <div className="mt-4 flex items-center gap-4">
          <AudioButton
            onPress={() => {
              play('tap');
              speak(round.word, { rate: 0.85 });
            }}
            label="Hear the word"
          />
          <p className="max-w-xs text-left font-body text-base text-terracotta-600/90 sm:text-lg">
            Tap the letters that finish the word!
          </p>
        </div>

        <div className="mt-6 grid w-full grid-cols-3 gap-4">
          {round.options.map((opt) => (
            <motion.button
              key={opt}
              onClick={() => handlePick(opt)}
              onHoverStart={() => speak(opt, { rate: 0.8 })}
              onFocus={() => speak(opt, { rate: 0.8 })}
              aria-label={opt}
              whileTap={{ scale: 0.93 }}
              whileHover={{ y: -4, rotate: -2 }}
              animate={
                wrong === opt
                  ? { x: [-10, 10, -6, 6, 0] }
                  : solved && opt === round.answer
                  ? { scale: [1, 1.2, 1], rotate: [0, -6, 6, 0] }
                  : undefined
              }
              transition={{ type: 'spring', stiffness: 320, damping: 18 }}
              className={[
                'focus-ring aspect-[4/3] w-full rounded-[28px] border-4 bg-white font-letter text-5xl font-bold text-terracotta-600 shadow-card transition-colors',
                solved && opt === round.answer
                  ? 'border-sage-400 bg-sage-100'
                  : wrong === opt
                  ? 'border-parrot-400 bg-parrot-400/10'
                  : 'border-terracotta-200 hover:border-terracotta-300',
              ].join(' ')}
            >
              {opt}
            </motion.button>
          ))}
        </div>
      </div>

      <Celebration
        show={celebrateRound}
        emoji="🐼"
        title={celebrationPhrase}
        subtitle={`That spells ${round.word}!`}
      />
    </GameShell>
  );
}
