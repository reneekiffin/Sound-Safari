import { motion } from 'framer-motion';
import { useEffect, useMemo, useState } from 'react';
import AudioButton from '../shared/AudioButton.jsx';
import Celebration from '../shared/Celebration.jsx';
import PromptHeader from '../shared/PromptHeader.jsx';
import GameShell from './GameShell.jsx';
import { SPANISH_ROUNDS } from '../../data/spanish.js';
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

// Spanish (Sofia the Sloth) — a no-pressure bonus game.
//
// Two round kinds mixed in medium/hard tiers:
//   - "picture"  Spanish word at top, tap the emoji picture that matches.
//   - "letter"   Show the letter ("A") + English hint ("tree"), tap
//                matching picture.
//
// Speech: we pass `lang: 'es-ES'` when speaking Spanish so the TTS layer
// picks a Spanish voice when one is available.  Web Speech browsers
// usually have at least one Spanish voice on every device.

const ROUNDS_PER_SESSION = 10;

export default function Spanish({ profile, totalStars, difficulty, recent, onExit, onFinish, onOpenSettings, audioEnabled, sfxEnabled, voiceURI, cloud }) {
  const game = getGame('spanish');

  const { rounds, nextRecent } = useMemo(() => {
    const pool = SPANISH_ROUNDS[difficulty] ?? SPANISH_ROUNDS.easy;
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
  const [wrongWord, setWrongWord] = useState(null);
  const [celebrateRound, setCelebrateRound] = useState(false);
  const [celebrationPhrase, setCelebrationPhrase] = useState('Nice!');
  const [done, setDone] = useState(false);

  const { speak } = useSpeech({
    enabled: audioEnabled,
    preferredVoiceURI: voiceURI,
    cloud,
    speaker: 'sloth',
  });
  const { play } = useAudio({ enabled: sfxEnabled });
  const round = rounds[index];

  useEffect(() => {
    if (!round || done) return undefined;
    setAnswered(false);
    setWrongWord(null);
    const t = setTimeout(() => {
      // Say the Spanish word with a Spanish voice if available, then
      // a brief English scaffold so English-first kids stay oriented.
      speak(round.spanish, { rate: 0.85, lang: 'es-ES' });
    }, 400);
    return () => clearTimeout(t);
  }, [round, done, speak]);

  const handlePick = (opt) => {
    if (answered || done) return;
    if (opt.word === round.answer) {
      play('correct');
      const cheer = pickCheer(CORRECT_CHEERS);
      setCelebrationPhrase(cheer);
      // Say the Spanish word again (so kids hear it post-correct),
      // then the English translation at a gentle pace.
      speak(round.spanish, { rate: 0.85, lang: 'es-ES' });
      setTimeout(() => speak(`That's "${round.english}" in English!`), 500);
      setAnswered(true);
      setCelebrateRound(true);
      setScore((s) => s + 1);
      setTimeout(() => {
        setCelebrateRound(false);
        if (index + 1 >= rounds.length) finish(score + 1);
        else setIndex((i) => i + 1);
      }, 1300);
    } else {
      play('wrong');
      setWrongWord(opt.word);
      speak(pickWrongCheer());
      setTimeout(() => setWrongWord(null), 500);
    }
  };

  const finish = (finalScore) => {
    setDone(true);
    play('celebrate');
    speak(`${pickFinishCheer()} ${finalScore} out of ${rounds.length}!  ¡Muy bien!`);
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
        <PromptHeader animal="sloth" happy={celebrateRound} hostLabel="Sofia says...">
          {round.kind === 'letter' && (
            <p className="mt-1 font-display text-6xl text-terracotta-600 sm:text-7xl">
              {round.letter}
            </p>
          )}
          <p className={round.kind === 'letter' ? 'mt-1 font-display text-3xl text-terracotta-600 sm:text-4xl' : 'mt-1 font-display text-4xl text-terracotta-600 sm:text-5xl'}>
            ¡{round.spanish}!
          </p>
          <p className="mt-1 font-body text-sm font-bold text-terracotta-500">
            ({round.english})
          </p>
        </PromptHeader>

        <div className="mt-4 flex items-center gap-4">
          <AudioButton
            onPress={() => {
              play('tap');
              speak(round.spanish, { rate: 0.8, lang: 'es-ES' });
            }}
            label={`Hear ${round.spanish} again`}
          />
          <p className="max-w-xs text-left font-body text-base text-terracotta-600/90 sm:text-lg">
            Tap the picture that matches the Spanish word!
          </p>
        </div>

        <div
          className={[
            'mt-6 grid w-full gap-4',
            round.options.length > 3 ? 'grid-cols-2 sm:grid-cols-4' : 'grid-cols-3',
          ].join(' ')}
        >
          {round.options.map((opt) => (
            <motion.button
              key={opt.word}
              onClick={() => handlePick(opt)}
              onHoverStart={() => speak(opt.word, { rate: 0.85, lang: 'es-ES' })}
              onFocus={() => speak(opt.word, { rate: 0.85, lang: 'es-ES' })}
              aria-label={`${opt.word} (${opt.english})`}
              whileTap={{ scale: 0.93 }}
              whileHover={{ y: -4 }}
              animate={
                wrongWord === opt.word
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
                  : wrongWord === opt.word
                  ? 'border-parrot-400 bg-parrot-400/10'
                  : 'border-terracotta-200 hover:border-terracotta-300',
              ].join(' ')}
            >
              <span className="text-5xl sm:text-6xl" aria-hidden="true">{opt.emoji}</span>
              <span className="mt-2 font-letter text-lg font-bold text-terracotta-600">
                {opt.word}
              </span>
              <span className="font-body text-xs text-terracotta-500/80">
                {opt.english}
              </span>
            </motion.button>
          ))}
        </div>
      </div>

      <Celebration
        show={celebrateRound}
        emoji="🦥"
        title={celebrationPhrase}
        subtitle={`"${round.spanish}" means "${round.english}".`}
      />
    </GameShell>
  );
}
