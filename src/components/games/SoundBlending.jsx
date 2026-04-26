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

// Spoken form of each phoneme/grapheme used in the data.  Tuned for
// Edge neural voices: vowels are short open syllables, stops keep the
// "uh" tail kids learn from phonics teachers ("buh, ah, tuh"), and
// sustainable consonants get tripled letters that Edge reads as a
// stretched sound rather than letter names.
//
//   ant ['a','n','t']   → "ah... nnn... tuh"
//   dog ['d','o','g']   → "duh... aw... guh"
//   frog ['f','r','og'] → "fff... rrr... awg"
const PHONEME_SPEECH = {
  // Short vowels
  a: 'ah', e: 'eh', i: 'ih', o: 'aw', u: 'uh',
  // Consonants — stops keep the schwa tail; continuants are stretched.
  b: 'buh', c: 'kuh', d: 'duh', f: 'fff', g: 'guh',
  h: 'huh', j: 'juh', k: 'kuh', l: 'lll', m: 'mmm',
  n: 'nnn', p: 'puh', r: 'rrr', s: 'sss', t: 'tuh',
  v: 'vvv', w: 'wuh', x: 'ks', y: 'yuh', z: 'zzz',
  // Digraphs / common rimes
  sh: 'sh', ch: 'ch', th: 'th', ng: 'ng', qu: 'kwuh',
  ai: 'ay', ee: 'ee', oo: 'oo', oa: 'oh', ou: 'ow',
  ar: 'ar', or: 'or', ow: 'ow', aw: 'aw', ck: 'kuh',
  er: 'er', ea: 'ee', og: 'awg', ake: 'ayk', nt: 'nt',
};

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

  const { speak } = useSpeech({ enabled: audioEnabled, preferredVoiceURI: voiceURI, cloud, speaker: 'monkey' });
  const { play } = useAudio({ enabled: sfxEnabled });

  const round = rounds[index];

  // Build the blend phrase as a SINGLE utterance so Momo's voice
  // carries natural prosody across all the sounds.  Plain text only —
  // we tried SSML <phoneme alphabet="ipa"> first but Edge ignored the
  // IPA tags and read "a-n-t" as the letter names "A, N, T".  The
  // map below converts each grapheme/rime to a syllable Edge will
  // speak as a recognisable sound:
  //   ant    → "ah... nnn... tuh... ant."
  //   dog    → "duh... aw... guh... dog."
  // Ellipsis between sounds gives the natural pause; the final "answer"
  // word is the smooth blended target so kids hear what to listen for.
  const playSequence = async ({ includeBlend = true } = {}) => {
    if (!round) return;

    const phonemeText = round.phonemes
      .map((p) => PHONEME_SPEECH[p] ?? p)
      .join('... ');
    const fullText = includeBlend
      ? `${phonemeText}... ${round.answer}.`
      : phonemeText;

    // Highlight phonemes on a timer that runs alongside the speech.
    // This isn't perfectly synced to ElevenLabs prosody, but visually
    // it tracks well enough — and crucially it's no longer blocking
    // the audio on per-phoneme await chains.
    const phonemeCount = round.phonemes.length;
    const stepMs = 700;
    setAnimatedIndex(0);
    let stepIdx = 0;
    const animTimer = setInterval(() => {
      stepIdx += 1;
      if (stepIdx >= phonemeCount) {
        clearInterval(animTimer);
        setAnimatedIndex(-1);
      } else {
        setAnimatedIndex(stepIdx);
      }
    }, stepMs);

    try {
      await speak(fullText, { rate: 0.78 });
    } finally {
      clearInterval(animTimer);
      setAnimatedIndex(-1);
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
      // Just the cheer — the answer word was being repeated AFTER the
      // celebration popup, which felt like a stutter.  The popup +
      // visual reinforcement is enough; the kid already heard the
      // blended word during the round prompt.
      speak(pickCheer(CORRECT_CHEERS));
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
      }, 2400);
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
      {/* Picture only — deliberately no word label underneath.  Kids have
          to blend the phonemes and identify the picture, not just match
          the written word.  Promotes genuine phonemic awareness over
          pattern-matching. */}
      <span className="text-7xl sm:text-8xl" aria-hidden="true">
        {option.emoji}
      </span>
    </motion.button>
  );
}
