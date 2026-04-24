import { motion } from 'framer-motion';
import { useEffect, useMemo, useState } from 'react';
import AudioButton from '../shared/AudioButton.jsx';
import Celebration from '../shared/Celebration.jsx';
import PromptHeader from '../shared/PromptHeader.jsx';
import GameShell from './GameShell.jsx';
import { VENN_ROUNDS } from '../../data/venn.js';
import { pickSession } from '../../data/session.js';
import { useAudio } from '../../hooks/useAudio.js';
import { useSpeech } from '../../hooks/useSpeech.js';
import { getGame } from '../../data/games.js';
import { pickCheer, pickWrongCheer, pickFinishCheer, CORRECT_CHEERS } from '../../data/cheers.js';

// Venn Diagrams (Ollie the Owl).
//
// Each round is a themed Venn — two overlapping circles with labels.
// Items appear one at a time and the kid taps which region they belong
// in: left-only, both (intersection), or right-only.
//
// The "round" in this game is actually a whole diagram; the per-round
// progress bar tracks items within the diagram.  When all items are
// correctly placed we advance to the next diagram.

const DIAGRAMS_PER_SESSION = 3; // 3 diagrams × ~6 items = a solid session

export default function VennDiagrams({ profile, totalStars, difficulty, recent, onExit, onFinish, onOpenSettings, audioEnabled, sfxEnabled, voiceURI, cloud }) {
  const game = getGame('venn-diagrams');

  const { rounds: diagrams, nextRecent } = useMemo(() => {
    const pool = VENN_ROUNDS[difficulty] ?? VENN_ROUNDS.easy;
    return pickSession({ pool, recent, size: DIAGRAMS_PER_SESSION, getId: (r) => r.id });
  }, [difficulty, recent]);

  const [diagramIndex, setDiagramIndex] = useState(0);
  const [itemIndex, setItemIndex] = useState(0);
  const [placements, setPlacements] = useState({}); // itemKey -> region
  const [score, setScore] = useState(0);
  const [totalItemsSeen, setTotalItemsSeen] = useState(0);
  const [wrongRegion, setWrongRegion] = useState(null);
  const [done, setDone] = useState(false);
  const [celebrateRound, setCelebrateRound] = useState(false);

  const { speak } = useSpeech({ enabled: audioEnabled, preferredVoiceURI: voiceURI, cloud, speaker: 'owl' });
  const { play } = useAudio({ enabled: sfxEnabled });

  const diagram = diagrams[diagramIndex];
  const items = diagram?.items ?? [];
  const currentItem = items[itemIndex];
  const totalItems = diagrams.reduce((n, d) => n + d.items.length, 0);

  // Announce a new diagram whenever we switch.
  useEffect(() => {
    if (!diagram || done) return undefined;
    const t = setTimeout(() => {
      speak(`${diagram.leftLabel} or ${diagram.rightLabel}?  Or both?`);
    }, 400);
    return () => clearTimeout(t);
  }, [diagram, done, speak]);

  // Announce each new item — "where does banana go?"
  useEffect(() => {
    if (!currentItem || done) return undefined;
    const t = setTimeout(() => {
      speak(`Where does ${currentItem.word} go?`);
    }, 700);
    return () => clearTimeout(t);
  }, [currentItem, done, speak]);

  const handlePick = (region) => {
    if (!currentItem || done) return;
    const correct = region === currentItem.answer;

    if (correct) {
      play('correct');
      const phrase =
        region === 'both'
          ? `Yes! ${currentItem.word} belongs in both.`
          : `Yes! ${currentItem.word} is ${region === 'left' ? diagram.leftLabel : diagram.rightLabel}.`;
      speak(phrase);
      setScore((s) => s + 1);
      setPlacements((p) => ({ ...p, [`${diagram.id}:${currentItem.word}`]: region }));
      setTotalItemsSeen((n) => n + 1);
      setCelebrateRound(true);
      setTimeout(() => {
        setCelebrateRound(false);
        advance();
      }, 700);
    } else {
      play('wrong');
      setWrongRegion(region);
      speak(pickWrongCheer());
      setTimeout(() => setWrongRegion(null), 500);
    }
  };

  const advance = () => {
    if (itemIndex + 1 < items.length) {
      setItemIndex((i) => i + 1);
    } else if (diagramIndex + 1 < diagrams.length) {
      setDiagramIndex((d) => d + 1);
      setItemIndex(0);
    } else {
      finish();
    }
  };

  const finish = () => {
    setDone(true);
    play('celebrate');
    const final = score;
    speak(`${pickFinishCheer()} ${final} out of ${totalItems}!`);
    const earnedStars = Math.ceil(final / 2) + (final === totalItems ? 1 : 0);
    onFinish({ earnedStars, score: final, total: totalItems, newRecent: nextRecent });
  };

  if (done) return null;
  if (!diagram || !currentItem) return null;

  return (
    <GameShell
      game={game}
      profile={profile}
      totalStars={totalStars}
      round={totalItemsSeen + 1}
      totalRounds={totalItems}
      onExit={onExit}
      onOpenSettings={onOpenSettings}
    >
      <div className="flex flex-col items-center text-center">
        <PromptHeader animal="owl" happy={celebrateRound} hostLabel="Ollie says...">
          <p className="mt-1 font-heading text-lg font-extrabold text-terracotta-600 sm:text-xl">
            Where does{' '}
            <span className="font-display text-2xl text-sage-600 sm:text-3xl">
              {currentItem.word} {currentItem.emoji}
            </span>{' '}
            belong?
          </p>
        </PromptHeader>

        <div className="mt-4 flex items-center gap-4">
          <AudioButton
            onPress={() => {
              play('tap');
              speak(`Where does ${currentItem.word} go?  ${diagram.leftLabel}, ${diagram.rightLabel}, or both?`);
            }}
            label="Hear the question again"
          />
          <p className="max-w-xs text-left font-body text-base text-terracotta-600/90 sm:text-lg">
            Tap the region that fits.
          </p>
        </div>

        <VennVisual
          leftLabel={diagram.leftLabel}
          rightLabel={diagram.rightLabel}
          wrongRegion={wrongRegion}
          onPick={handlePick}
        />
      </div>

      <Celebration
        show={celebrateRound}
        emoji="🦉"
        title="Whooo! Nice!"
        subtitle="Great thinking."
      />
    </GameShell>
  );
}

// Clickable Venn diagram: two overlapping circles with an intersection.
// Each region is a separate button so the tap targets are generous.
function VennVisual({ leftLabel, rightLabel, wrongRegion, onPick }) {
  const base =
    'focus-ring absolute flex items-center justify-center font-heading font-extrabold text-terracotta-600 transition-transform';

  const glow = (region) =>
    wrongRegion === region
      ? 'ring-4 ring-parrot-400 animate-pulse'
      : '';

  return (
    <div className="mt-6 w-full max-w-2xl">
      <div className="relative mx-auto h-64 w-full max-w-xl sm:h-72">
        {/* Left circle */}
        <motion.button
          type="button"
          onClick={() => onPick('left')}
          whileTap={{ scale: 0.96 }}
          whileHover={{ scale: 1.02 }}
          aria-label={leftLabel}
          className={[
            base,
            'left-0 top-1/2 h-56 w-56 -translate-y-1/2 rounded-full border-4 border-jungle-400 bg-jungle-400/25 text-jungle-500 sm:h-64 sm:w-64',
            glow('left'),
          ].join(' ')}
        >
          <span className="mb-20 sm:mb-28">{leftLabel}</span>
        </motion.button>

        {/* Right circle */}
        <motion.button
          type="button"
          onClick={() => onPick('right')}
          whileTap={{ scale: 0.96 }}
          whileHover={{ scale: 1.02 }}
          aria-label={rightLabel}
          className={[
            base,
            'right-0 top-1/2 h-56 w-56 -translate-y-1/2 rounded-full border-4 border-parrot-400 bg-parrot-400/25 text-parrot-500 sm:h-64 sm:w-64',
            glow('right'),
          ].join(' ')}
        >
          <span className="mb-20 sm:mb-28">{rightLabel}</span>
        </motion.button>

        {/* Intersection — sits above both circles */}
        <motion.button
          type="button"
          onClick={() => onPick('both')}
          whileTap={{ scale: 0.93 }}
          whileHover={{ scale: 1.05 }}
          aria-label="Both"
          className={[
            base,
            'left-1/2 top-1/2 h-24 w-24 -translate-x-1/2 -translate-y-1/2 rounded-full border-4 border-terracotta-400 bg-white text-terracotta-500 sm:h-28 sm:w-28',
            glow('both'),
          ].join(' ')}
        >
          Both
        </motion.button>
      </div>
    </div>
  );
}
