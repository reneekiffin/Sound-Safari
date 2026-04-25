import { motion } from 'framer-motion';
import { useEffect, useMemo, useRef, useState } from 'react';
import AudioButton from '../shared/AudioButton.jsx';
import Celebration from '../shared/Celebration.jsx';
import PromptHeader from '../shared/PromptHeader.jsx';
import GameShell from './GameShell.jsx';
import { VENN_ROUNDS } from '../../data/venn.js';
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

// Venn Diagrams (Ollie the Owl) — interactive drag-and-drop.
//
// Two overlapping circles sit at the top.  All the round's items sit in
// a tray below.  Kids drag each item into the right region (left /
// both / right).  On drag end we compute which region the item landed
// in by comparing the drop-point to each region's bounding box — so
// the intersection is a real, droppable area, not a separate button.
//
// Once every item is placed, a "Check answers" button appears.  On
// check: if everything is right we celebrate + advance; if anything is
// wrong the wrong items snap back to the tray after a brief highlight,
// leaving correct placements intact, so the kid tries again with a
// meaningful reduction in the problem.
//
// Tap a placed item before checking to send it back to the tray.

const DIAGRAMS_PER_SESSION = 3;

export default function VennDiagrams({ profile, totalStars, difficulty, recent, onExit, onFinish, onOpenSettings, audioEnabled, sfxEnabled, voiceURI, cloud }) {
  const game = getGame('venn-diagrams');

  const { rounds: diagrams, nextRecent } = useMemo(() => {
    const pool = VENN_ROUNDS[difficulty] ?? VENN_ROUNDS.easy;
    return pickSession({ pool, recent, size: DIAGRAMS_PER_SESSION, getId: (r) => r.id });
  }, [difficulty, recent]);

  const [diagramIndex, setDiagramIndex] = useState(0);
  const [placements, setPlacements] = useState({}); // word -> region
  const [checked, setChecked] = useState(false);
  const [totalCorrect, setTotalCorrect] = useState(0);
  const [totalItemsSeen, setTotalItemsSeen] = useState(0);
  const [celebrateRound, setCelebrateRound] = useState(false);
  const [celebrationPhrase, setCelebrationPhrase] = useState('');
  const [done, setDone] = useState(false);

  const { speak } = useSpeech({ enabled: audioEnabled, preferredVoiceURI: voiceURI, cloud, speaker: 'owl' });
  const { play } = useAudio({ enabled: sfxEnabled });

  const diagram = diagrams[diagramIndex];
  const totalItems = diagrams.reduce((n, d) => n + d.items.length, 0);

  useEffect(() => {
    if (!diagram || done) return undefined;
    setPlacements({});
    setChecked(false);
    const t = setTimeout(() => {
      speak(
        `Drag each picture into the right circle.  ${diagram.leftLabel} on the left, ${diagram.rightLabel} on the right, or both in the middle.`,
      );
    }, 400);
    return () => clearTimeout(t);
  }, [diagram, done, speak]);

  const allPlaced = diagram && diagram.items.every((it) => placements[it.word]);

  const placeItem = (word, region) => {
    play('tap');
    setPlacements((p) => ({ ...p, [word]: region }));
  };

  const unplaceItem = (word) => {
    setPlacements((p) => {
      const next = { ...p };
      delete next[word];
      return next;
    });
  };

  const handleCheck = () => {
    if (!diagram) return;
    const correctCount = diagram.items.filter(
      (it) => placements[it.word] === it.answer,
    ).length;
    const allCorrect = correctCount === diagram.items.length;

    setChecked(true);
    const nextItemsSeen = totalItemsSeen + diagram.items.length;
    const nextCorrect = totalCorrect + correctCount;
    setTotalItemsSeen(nextItemsSeen);
    setTotalCorrect(nextCorrect);

    if (allCorrect) {
      play('correct');
      const cheer = pickCheer(CORRECT_CHEERS);
      setCelebrationPhrase(cheer);
      speak(`${cheer} All correct!`);
      setCelebrateRound(true);
      setTimeout(() => {
        setCelebrateRound(false);
        if (diagramIndex + 1 < diagrams.length) {
          setDiagramIndex((d) => d + 1);
        } else {
          finish(nextCorrect, totalItems);
        }
      }, 2000);
    } else {
      play('wrong');
      speak(pickWrongCheer());
      // Snap wrong items back to the tray so the kid can reconsider.
      setTimeout(() => {
        setPlacements((p) => {
          const next = { ...p };
          for (const it of diagram.items) {
            if (next[it.word] && next[it.word] !== it.answer) {
              delete next[it.word];
            }
          }
          return next;
        });
        setChecked(false);
      }, 2000);
    }
  };

  const finish = (correct, total) => {
    setDone(true);
    play('celebrate');
    speak(`${pickFinishCheer()} ${correct} out of ${total}!`);
    const earnedStars = Math.ceil(correct / 2) + (correct === total ? 1 : 0);
    onFinish({ earnedStars, score: correct, total, newRecent: nextRecent });
  };

  if (done) return null;
  if (!diagram) return null;

  return (
    <GameShell
      game={game}
      profile={profile}
      totalStars={totalStars}
      round={diagramIndex + 1}
      totalRounds={diagrams.length}
      onExit={onExit}
      onOpenSettings={onOpenSettings}
    >
      <div className="flex flex-col items-center text-center">
        <PromptHeader animal="owl" happy={celebrateRound} hostLabel="Ollie says...">
          <p className="mt-1 font-heading text-lg font-extrabold text-terracotta-600 sm:text-xl">
            Drag each picture into the right circle.
          </p>
          <p className="mt-1 font-body text-sm text-terracotta-600/80">
            If it fits both labels, drop it in the middle!
          </p>
        </PromptHeader>

        <div className="mt-3 flex items-center gap-4">
          <AudioButton
            onPress={() => {
              play('tap');
              speak(
                `${diagram.leftLabel} on the left, ${diagram.rightLabel} on the right, both in the middle.`,
              );
            }}
            label="Hear the labels"
          />
          <p className="max-w-xs text-left font-body text-base text-terracotta-600/90 sm:text-lg">
            Tap a placed picture to send it back.
          </p>
        </div>

        <VennBoard
          diagram={diagram}
          placements={placements}
          checked={checked}
          onPlace={placeItem}
          onUnplace={unplaceItem}
          speak={speak}
        />

        {allPlaced && (
          <motion.button
            type="button"
            onClick={handleCheck}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            whileHover={{ y: -3 }}
            whileTap={{ scale: 0.95 }}
            className="focus-ring mt-4 rounded-full border-4 border-sage-500 bg-sage-400 px-8 py-3 font-heading text-lg font-extrabold text-white shadow-card"
          >
            Check answers
          </motion.button>
        )}
      </div>

      <Celebration
        show={celebrateRound}
        emoji="🦉"
        title={celebrationPhrase || 'Whooo!'}
        subtitle="Every picture in the right spot!"
      />
    </GameShell>
  );
}

function VennBoard({ diagram, placements, checked, onPlace, onUnplace, speak }) {
  const leftRef = useRef(null);
  const rightRef = useRef(null);
  const bothRef = useRef(null);

  // Detect which region a drop lands in.  The intersection wins when
  // it applies — it's the most specific zone.
  const detectRegion = (x, y) => {
    const inBounds = (ref) => {
      const el = ref.current;
      if (!el) return false;
      const r = el.getBoundingClientRect();
      return x >= r.left && x <= r.right && y >= r.top && y <= r.bottom;
    };
    if (inBounds(bothRef)) return 'both';
    if (inBounds(leftRef)) return 'left';
    if (inBounds(rightRef)) return 'right';
    return null;
  };

  const tray = diagram.items.filter((it) => !placements[it.word]);

  // Cluster placed items inside each region — a small row per region
  // so stacked items don't fully occlude each other.
  const placedByRegion = { left: [], both: [], right: [] };
  for (const it of diagram.items) {
    const r = placements[it.word];
    if (r) placedByRegion[r].push(it);
  }

  return (
    <div className="mt-5 w-full">
      <div className="relative mx-auto h-80 w-full max-w-2xl sm:h-96">
        {/* Left circle */}
        <div
          ref={leftRef}
          aria-label={diagram.leftLabel}
          className="absolute left-0 top-1/2 flex h-64 w-64 -translate-y-1/2 flex-col items-center justify-start rounded-full border-4 border-jungle-400 bg-jungle-400/25 pt-3 sm:h-72 sm:w-72"
        >
          <span className="font-heading text-base font-extrabold text-jungle-600 sm:text-lg">
            {diagram.leftLabel}
          </span>
          <RegionTray
            items={placedByRegion.left}
            region="left"
            checked={checked}
            onTapPlaced={onUnplace}
          />
        </div>

        {/* Right circle */}
        <div
          ref={rightRef}
          aria-label={diagram.rightLabel}
          className="absolute right-0 top-1/2 flex h-64 w-64 -translate-y-1/2 flex-col items-center justify-start rounded-full border-4 border-parrot-400 bg-parrot-400/25 pt-3 sm:h-72 sm:w-72"
        >
          <span className="font-heading text-base font-extrabold text-parrot-600 sm:text-lg">
            {diagram.rightLabel}
          </span>
          <RegionTray
            items={placedByRegion.right}
            region="right"
            checked={checked}
            onTapPlaced={onUnplace}
          />
        </div>

        {/* Intersection — sits on top.  Still a real drop zone. */}
        <div
          ref={bothRef}
          aria-label="Both"
          className="absolute left-1/2 top-1/2 flex h-28 w-28 -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center rounded-full border-4 border-terracotta-400 bg-white shadow-soft sm:h-32 sm:w-32"
        >
          <span className="font-heading text-sm font-extrabold text-terracotta-500 sm:text-base">
            Both
          </span>
          <RegionTray
            items={placedByRegion.both}
            region="both"
            checked={checked}
            onTapPlaced={onUnplace}
            compact
          />
        </div>
      </div>

      {/* Tray of draggable items below the diagram */}
      <div className="mx-auto mt-2 flex min-h-[120px] w-full max-w-2xl flex-wrap items-center justify-center gap-3 rounded-3xl bg-white/60 p-4">
        {tray.length === 0 && (
          <p className="font-body text-sm italic text-terracotta-500">
            All placed! Tap <strong>Check answers</strong> below.
          </p>
        )}
        {tray.map((it) => (
          <DraggableItem
            key={it.word}
            item={it}
            onDragEnd={(event, info) => {
              const region = detectRegion(info.point.x, info.point.y);
              if (region) onPlace(it.word, region);
            }}
            speak={speak}
          />
        ))}
      </div>
    </div>
  );
}

// Items placed in a given region, shown as small chips inside the
// circle.  Green/red borders appear after the kid hits Check.
function RegionTray({ items, region, checked, onTapPlaced, compact = false }) {
  return (
    <div
      className={[
        'flex flex-wrap items-center justify-center gap-1 p-1',
        compact ? 'max-w-[90px]' : 'max-w-[220px]',
      ].join(' ')}
    >
      {items.map((it) => {
        const correct = it.answer === region;
        const stateCls = checked
          ? correct
            ? 'border-sage-500 bg-sage-100'
            : 'border-parrot-500 bg-parrot-400/25'
          : 'border-terracotta-200 bg-white';
        return (
          <motion.button
            key={it.word}
            type="button"
            layoutId={`placed-${it.word}`}
            initial={{ scale: 0.7, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 280, damping: 22 }}
            onClick={checked ? undefined : () => onTapPlaced(it.word)}
            aria-label={`${it.word} in ${region}${checked ? (correct ? ', correct' : ', wrong') : ', tap to remove'}`}
            className={[
              'focus-ring flex flex-col items-center rounded-xl border-2 px-1.5 py-0.5 shadow',
              stateCls,
            ].join(' ')}
          >
            <span className={compact ? 'text-xl' : 'text-2xl'} aria-hidden="true">
              {it.emoji}
            </span>
            {!compact && (
              <span className="font-letter text-[10px] font-bold text-terracotta-600">
                {it.word}
              </span>
            )}
          </motion.button>
        );
      })}
    </div>
  );
}

// Draggable chip — uses Framer Motion's drag with dragSnapToOrigin so
// a missed drop animates back cleanly.  On successful drop the parent
// removes the chip from the tray (it moves into `placements`).
function DraggableItem({ item, onDragEnd, speak }) {
  return (
    <motion.div
      drag
      dragMomentum={false}
      dragSnapToOrigin
      whileDrag={{ scale: 1.15, zIndex: 30, boxShadow: '0 20px 40px -10px rgba(0,0,0,0.3)' }}
      whileHover={{ y: -3 }}
      onDragEnd={onDragEnd}
      onHoverStart={() => speak?.(item.word, { rate: 0.9 })}
      onFocus={() => speak?.(item.word, { rate: 0.9 })}
      tabIndex={0}
      role="button"
      aria-label={`Drag ${item.word}`}
      className="focus-ring flex cursor-grab touch-none select-none flex-col items-center rounded-2xl border-4 border-terracotta-200 bg-white px-3 py-2 shadow-card active:cursor-grabbing"
    >
      <span className="text-4xl" aria-hidden="true">{item.emoji}</span>
      <span className="mt-1 font-letter text-sm font-bold text-terracotta-600">
        {item.word}
      </span>
    </motion.div>
  );
}
