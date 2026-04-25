import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useMemo, useState } from 'react';
import AudioButton from '../shared/AudioButton.jsx';
import Celebration from '../shared/Celebration.jsx';
import PromptHeader from '../shared/PromptHeader.jsx';
import GameShell from './GameShell.jsx';
import { LETTER_SOUNDS_ROUNDS, SAMPLE_WORDS, getLetterExamples } from '../../data/letterSounds.js';
import { pickSession, shuffleOptions } from '../../data/session.js';
import { useAudio } from '../../hooks/useAudio.js';
import { useSpeech } from '../../hooks/useSpeech.js';
import { getGame } from '../../data/games.js';
import {
  pickCheer,
  pickWrongCheer,
  pickFinishCheer,
  pickNextPrompt,
  CORRECT_CHEERS,
} from '../../data/cheers.js';

// Letter Sounds (Leo the Lion).  See data/letterSounds.js for round shape.

const ROUNDS_PER_SESSION = 10;

export default function LetterSounds({ profile, totalStars, difficulty, recent, onExit, onFinish, onOpenSettings, audioEnabled, sfxEnabled, voiceURI, cloud }) {
  const game = getGame('letter-sounds');

  const { rounds, nextRecent } = useMemo(() => {
    const pool = LETTER_SOUNDS_ROUNDS[difficulty] ?? LETTER_SOUNDS_ROUNDS.easy;
    const { rounds: picked, nextRecent: updated } = pickSession({
      pool,
      recent,
      size: ROUNDS_PER_SESSION,
      getId: (r) => r.letter,
    });
    return { rounds: picked.map(shuffleOptions), nextRecent: updated };
  }, [difficulty, recent]);

  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [answered, setAnswered] = useState(false);
  const [celebrateRound, setCelebrateRound] = useState(false);
  const [celebrationPhrase, setCelebrationPhrase] = useState('Nice one!');
  const [wrongLetter, setWrongLetter] = useState(null);
  const [done, setDone] = useState(false);

  const { speak, speakLetterSound } = useSpeech({ enabled: audioEnabled, preferredVoiceURI: voiceURI, cloud, speaker: 'lion' });
  const { play } = useAudio({ enabled: sfxEnabled });

  const currentRound = rounds[index];

  useEffect(() => {
    if (!currentRound || done) return undefined;
    setAnswered(false);
    setWrongLetter(null);
    const t = setTimeout(() => {
      speakLetterSound(currentRound);
    }, 400);
    return () => clearTimeout(t);
  }, [currentRound, speakLetterSound, done]);

  const replaySound = () => {
    if (!currentRound) return;
    play('tap');
    speakLetterSound(currentRound, { rate: 0.7 });
  };

  const handlePick = (letter) => {
    if (answered || done) return;
    if (letter === currentRound.letter) {
      play('correct');
      const cheer = pickCheer(CORRECT_CHEERS);
      setCelebrationPhrase(cheer);
      // Speak the cheer, then the next-round nudge if more rounds remain.
      speak(`${cheer} ${index + 1 < rounds.length ? pickNextPrompt() : ''}`);
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
      }, 1800);
    } else {
      play('wrong');
      setWrongLetter(letter);
      speak(pickWrongCheer());
      setTimeout(() => setWrongLetter(null), 500);
    }
  };

  const finish = (finalScore) => {
    setDone(true);
    play('celebrate');
    speak(`${pickFinishCheer()} You got ${finalScore} out of ${rounds.length}!`);
    const earnedStars = finalScore + (finalScore === rounds.length ? 1 : 0);
    onFinish({ earnedStars, score: finalScore, total: rounds.length, newRecent: nextRecent });
  };

  if (done) return null;
  if (!currentRound) return null;

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
        <PromptHeader animal="lion" happy={celebrateRound} hostLabel="Leo says...">
          <p className="mt-1 font-display text-4xl text-terracotta-600 sm:text-5xl">
            “{currentRound.phoneme}”
          </p>
          <p className="mt-1 font-body text-sm text-terracotta-600/80">
            like {currentRound.sampleWord}
          </p>
        </PromptHeader>

        <div className="mt-2 flex items-center gap-4">
          <AudioButton onPress={replaySound} label="Play the sound again" />
          <p className="max-w-xs text-left font-body text-base text-terracotta-600/90 sm:text-lg">
            Tap a word to practise the sound — then tap the matching letter!
          </p>
        </div>

        {/* Example-word chips — kid taps each to hear the word.  Lets
            pre-readers practise the sound in context before picking a
            letter.  Emoji + word keeps it accessible for non-readers. */}
        <ExampleWords
          letter={currentRound.letter}
          onPreview={(word) => {
            play('tap');
            speak(word, { rate: 0.85 });
          }}
        />

        <div
          className={[
            'mt-5 grid w-full gap-4',
            currentRound.options.length > 3 ? 'grid-cols-2 sm:grid-cols-4' : 'grid-cols-3',
          ].join(' ')}
        >
          <AnimatePresence>
            {currentRound.options.map((letter) => (
              <LetterCard
                key={letter}
                letter={letter}
                state={
                  answered && letter === currentRound.letter
                    ? 'correct'
                    : wrongLetter === letter
                    ? 'wrong'
                    : 'idle'
                }
                onTap={() => handlePick(letter)}
                onPreview={() =>
                  speakLetterSound(
                    { letter, phoneme: currentRound.letter === letter ? currentRound.phoneme : letter, sampleWord: SAMPLE_WORDS[letter] },
                    { rate: 0.75 },
                  )
                }
              />
            ))}
          </AnimatePresence>
        </div>
      </div>

      <Celebration
        show={celebrateRound}
        emoji="🦁"
        title={celebrationPhrase}
        subtitle="You heard it just right."
      />
    </GameShell>
  );
}

// Three example-word chips that practise the current letter sound.  Tap
// (or hover) any chip and we say the word — encourages kids to sound it
// out themselves first, then compare.  Bounces when tapped for feedback.
function ExampleWords({ letter, onPreview }) {
  const examples = getLetterExamples(letter);
  if (!examples.length) return null;
  return (
    <div className="mt-5 w-full">
      <p className="mb-2 font-body text-sm font-bold uppercase tracking-widest text-terracotta-500">
        Tap a word to sound it out
      </p>
      <div className="flex flex-wrap items-center justify-center gap-3">
        {examples.map((ex) => (
          <motion.button
            key={ex.word}
            onClick={() => onPreview(ex.word)}
            // No onHoverStart / onFocus — on touch devices these fire
            // alongside onClick and the resulting double speak() races
            // cancelled the playback for the second/third chip taps.
            // onClick alone is reliable across mouse + touch.
            aria-label={`Hear the word ${ex.word}`}
            whileTap={{ scale: 0.92 }}
            whileHover={{ y: -4, rotate: -2 }}
            transition={{ type: 'spring', stiffness: 360, damping: 16 }}
            className="focus-ring flex items-center gap-2 rounded-3xl border-4 border-terracotta-200 bg-white px-4 py-3 font-letter text-lg font-bold text-terracotta-600 shadow-card hover:border-terracotta-300"
          >
            <span className="text-3xl" aria-hidden="true">{ex.emoji}</span>
            <span>{ex.word}</span>
          </motion.button>
        ))}
      </div>
    </div>
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
