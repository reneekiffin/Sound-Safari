import { motion } from 'framer-motion';
import { useEffect, useMemo, useState } from 'react';
import AudioButton from '../shared/AudioButton.jsx';
import Celebration from '../shared/Celebration.jsx';
import PromptHeader from '../shared/PromptHeader.jsx';
import GameShell from './GameShell.jsx';
import { WORD_BUILDERS_ROUNDS } from '../../data/wordBuilders.js';
import { SPELLING_ROUNDS } from '../../data/spelling.js';
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

// Word Builders (Penny the Panda).  Two modes:
//   - 'build': fill in the missing letter/letter-pair to finish a word
//   - 'spell': spelling-test mode using Reading Rockets' high-frequency
//             vocabulary — kid hears the word + a sentence, then taps
//             letter tiles in order to spell it.
//
// Mode is a kid-facing toggle at the top of the game.  Switching modes
// remounts the session (via key bump in the wrapper) so state is clean.

const ROUNDS_PER_SESSION = 12;

export default function WordBuilders(props) {
  const [mode, setMode] = useState('build');
  // Bumped whenever mode changes so each mode mounts cleanly with fresh
  // state (round index, score, etc.) instead of carrying it across.
  const [modeSession, setModeSession] = useState(0);

  const switchMode = (next) => {
    if (next === mode) return;
    setMode(next);
    setModeSession((k) => k + 1);
  };

  if (mode === 'spell') {
    return (
      <SpellingTestMode
        key={`spell-${modeSession}`}
        mode={mode}
        onSwitchMode={switchMode}
        {...props}
      />
    );
  }
  return (
    <BuildAWordMode
      key={`build-${modeSession}`}
      mode={mode}
      onSwitchMode={switchMode}
      {...props}
    />
  );
}

// ---------------------------------------------------------------------------
// Mode: Build a Word (the original Word Builders gameplay)
// ---------------------------------------------------------------------------

function BuildAWordMode({
  profile,
  totalStars,
  difficulty,
  recent,
  onExit,
  onFinish,
  onOpenSettings,
  audioEnabled,
  sfxEnabled,
  voiceURI,
  cloud,
  mode,
  onSwitchMode,
}) {
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
      setCelebrateRound(true);
      setScore((s) => s + 1);
      const speechDone = speak(`${cheer} That spells ${round.word}!`);
      const minVisible = new Promise((r) => setTimeout(r, 2500));
      Promise.all([speechDone, minVisible]).then(() => {
        setCelebrateRound(false);
        if (index + 1 >= rounds.length) finish(score + 1);
        else setIndex((i) => i + 1);
      });
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
        <ModeToggle mode={mode} onSwitchMode={onSwitchMode} />

        <PromptHeader animal="panda" happy={celebrateRound} hostLabel="Penny says...">
          <span className="mt-1 block text-6xl" aria-hidden="true">
            {round.emoji}
          </span>
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

// ---------------------------------------------------------------------------
// Mode: Spelling Test
// ---------------------------------------------------------------------------
//
// Penny says the word + a kid-friendly sentence.  The kid sees an
// emoji clue and a row of empty slots (one per letter).  Below sits a
// shuffled tile pool: the word's own letters + a few distractors so
// "tap whatever's in front" doesn't work.  Tapping a tile fills the
// next empty slot and removes that tile; tapping a filled slot frees
// it back to the pool.  When every slot is filled, we evaluate the
// answer automatically.

function SpellingTestMode({
  profile,
  totalStars,
  difficulty,
  recent,
  onExit,
  onFinish,
  onOpenSettings,
  audioEnabled,
  sfxEnabled,
  voiceURI,
  cloud,
  mode,
  onSwitchMode,
}) {
  const game = getGame('word-builders');

  const { rounds, nextRecent } = useMemo(() => {
    const pool = SPELLING_ROUNDS[difficulty] ?? SPELLING_ROUNDS.easy;
    return pickSession({
      pool,
      recent,
      size: ROUNDS_PER_SESSION,
      getId: (r) => r.id,
    });
  }, [difficulty, recent]);

  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);
  const [celebrateRound, setCelebrateRound] = useState(false);
  const [celebrationPhrase, setCelebrationPhrase] = useState('Spelled it!');
  const [wrongFlash, setWrongFlash] = useState(false);
  const [resolved, setResolved] = useState(false);

  const { speak } = useSpeech({
    enabled: audioEnabled,
    preferredVoiceURI: voiceURI,
    cloud,
    speaker: 'panda',
  });
  const { play } = useAudio({ enabled: sfxEnabled });

  const round = rounds[index];

  // Tile pool + slots, derived from the current round.  Each tile gets
  // a stable id so React can track which one moved when a kid taps it.
  // Without this, tiles with duplicate letters (e.g. "moon") would
  // collapse to one slot and tapping behaviour got confused.
  const initialTiles = useMemo(() => {
    if (!round) return [];
    const letters = round.word.split('');
    const distractors = round.distractors ?? [];
    const all = [...letters, ...distractors].map((l, i) => ({
      id: `t-${i}`,
      letter: l,
    }));
    return shuffle(all);
  }, [round]);

  const [tiles, setTiles] = useState(initialTiles);
  const [slots, setSlots] = useState(() =>
    round ? Array.from({ length: round.word.length }, () => null) : [],
  );

  // Reset everything when the round changes.
  useEffect(() => {
    if (!round || done) return undefined;
    setTiles(initialTiles);
    setSlots(Array.from({ length: round.word.length }, () => null));
    setResolved(false);
    setWrongFlash(false);
    const t = setTimeout(() => {
      speak(`Spell this word: ${round.word}. ${round.sentence ?? ''}`);
    }, 400);
    return () => clearTimeout(t);
  }, [round, done, initialTiles, speak]);

  const handleTileTap = (tile) => {
    if (resolved || done) return;
    play('tap');
    // Place into the first empty slot.
    setSlots((cur) => {
      const next = [...cur];
      const firstEmpty = next.findIndex((s) => s === null);
      if (firstEmpty === -1) return cur;
      next[firstEmpty] = tile;
      // After placing, evaluate if every slot is full.
      if (next.every((s) => s !== null)) {
        // Defer eval to next microtask so React applies state first.
        Promise.resolve().then(() => evaluate(next));
      }
      return next;
    });
    setTiles((cur) => cur.filter((t) => t.id !== tile.id));
  };

  const handleSlotTap = (slotIdx) => {
    if (resolved || done) return;
    setSlots((cur) => {
      const next = [...cur];
      const tile = next[slotIdx];
      if (!tile) return cur;
      next[slotIdx] = null;
      setTiles((curT) => [...curT, tile]);
      return next;
    });
  };

  const handleClear = () => {
    if (resolved || done) return;
    setTiles((cur) => [...cur, ...slots.filter((s) => s !== null)]);
    setSlots((cur) => cur.map(() => null));
  };

  const evaluate = (filledSlots) => {
    if (!round) return;
    const guess = filledSlots.map((t) => t?.letter ?? '').join('');
    if (guess === round.word) {
      setResolved(true);
      play('correct');
      const cheer = pickCheer(CORRECT_CHEERS);
      setCelebrationPhrase(cheer);
      setCelebrateRound(true);
      setScore((s) => s + 1);
      const speechDone = speak(`${cheer} That spells ${round.word}!`);
      const minVisible = new Promise((r) => setTimeout(r, 2500));
      Promise.all([speechDone, minVisible]).then(() => {
        setCelebrateRound(false);
        if (index + 1 >= rounds.length) finish(score + 1);
        else setIndex((i) => i + 1);
      });
    } else {
      // Wrong guess — flash the slots, send tiles back, and let the kid
      // try again.  No score penalty; the goal is learning to spell.
      play('wrong');
      setWrongFlash(true);
      speak(`Hmm, almost! Listen again: ${round.word}.`);
      setTimeout(() => {
        setWrongFlash(false);
        setTiles((cur) => [...cur, ...filledSlots.filter((s) => s !== null)]);
        setSlots((cur) => cur.map(() => null));
      }, 800);
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
        <ModeToggle mode={mode} onSwitchMode={onSwitchMode} />

        <PromptHeader animal="panda" happy={celebrateRound} hostLabel="Spell with Penny...">
          <span className="mt-1 block text-7xl" aria-hidden="true">
            {round.emoji}
          </span>
          <p className="mt-1 font-body text-sm text-terracotta-500">
            Listen — then tap the letters in order!
          </p>
        </PromptHeader>

        <div className="mt-3 flex items-center gap-4">
          <AudioButton
            onPress={() => {
              play('tap');
              speak(`${round.word}. ${round.sentence ?? ''}`);
            }}
            label="Hear the word again"
          />
          <p className="max-w-xs text-left font-body text-base text-terracotta-600/90 sm:text-lg">
            Tap a tile to fill the next slot.  Tap a slot to send a letter
            back.
          </p>
        </div>

        {/* Letter slots — empty boxes the kid fills in order. */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
          {slots.map((tile, i) => (
            <motion.button
              key={i}
              onClick={() => handleSlotTap(i)}
              animate={wrongFlash ? { x: [-8, 8, -4, 4, 0] } : undefined}
              transition={{ duration: 0.4 }}
              className={[
                'focus-ring inline-flex h-16 w-14 items-center justify-center rounded-2xl border-4 font-letter text-3xl font-bold sm:h-20 sm:w-16 sm:text-4xl',
                tile
                  ? wrongFlash
                    ? 'border-parrot-400 bg-parrot-400/10 text-parrot-500'
                    : 'border-sage-400 bg-sage-100 text-sage-600'
                  : 'border-dashed border-terracotta-300 bg-white/70 text-terracotta-300',
              ].join(' ')}
              aria-label={tile ? `Slot ${i + 1}: ${tile.letter}` : `Slot ${i + 1}, empty`}
            >
              {tile?.letter ?? '_'}
            </motion.button>
          ))}
        </div>

        {/* Letter tile pool. */}
        <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
          {tiles.map((tile) => (
            <motion.button
              key={tile.id}
              onClick={() => handleTileTap(tile)}
              whileTap={{ scale: 0.92 }}
              whileHover={{ y: -3 }}
              transition={{ type: 'spring', stiffness: 320, damping: 18 }}
              className="focus-ring inline-flex h-14 w-12 items-center justify-center rounded-2xl border-4 border-terracotta-200 bg-white font-letter text-2xl font-bold text-terracotta-600 shadow-card hover:border-terracotta-300 sm:h-16 sm:w-14 sm:text-3xl"
              aria-label={`Letter ${tile.letter}`}
            >
              {tile.letter}
            </motion.button>
          ))}
        </div>

        <button
          type="button"
          onClick={handleClear}
          className="focus-ring mt-4 rounded-full bg-savanna-200 px-4 py-2 font-body text-sm font-bold text-terracotta-600 hover:bg-savanna-300"
        >
          Clear
        </button>
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

// ---------------------------------------------------------------------------
// Mode toggle pill — visible at the top of either mode so kids can
// switch between Build a Word and Spelling Test mid-session.
// ---------------------------------------------------------------------------
function ModeToggle({ mode, onSwitchMode }) {
  return (
    <div className="mb-3 inline-flex rounded-full bg-savanna-100 p-1 text-sm font-bold">
      <button
        type="button"
        onClick={() => onSwitchMode('build')}
        className={[
          'rounded-full px-4 py-1.5 transition-colors',
          mode === 'build'
            ? 'bg-terracotta-500 text-white shadow-sm'
            : 'text-terracotta-600 hover:bg-savanna-200',
        ].join(' ')}
      >
        Build a Word
      </button>
      <button
        type="button"
        onClick={() => onSwitchMode('spell')}
        className={[
          'rounded-full px-4 py-1.5 transition-colors',
          mode === 'spell'
            ? 'bg-terracotta-500 text-white shadow-sm'
            : 'text-terracotta-600 hover:bg-savanna-200',
        ].join(' ')}
      >
        Spelling Test
      </button>
    </div>
  );
}

function shuffle(arr) {
  const out = [...arr];
  for (let i = out.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}
