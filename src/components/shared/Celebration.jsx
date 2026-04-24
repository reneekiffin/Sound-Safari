import { AnimatePresence, motion } from 'framer-motion';
import { useMemo } from 'react';
import Confetti from './Confetti.jsx';
import Button from './Button.jsx';

// Unified celebration overlay.
//
// Two usage modes:
//   - Per-round: pass `show` + title/subtitle/emoji; no buttons — fades
//     out on its own driven by the parent's state timer.
//   - End-of-game or milestone: pass onContinue/onReplay to get buttons.
//
// The visuals scale with the win:
//   - A hero mascot emoji that bounces + spins
//   - Multiple radiating confetti layers
//   - A pulsing glow behind the card
//   - Sparkle emoji accents that dance across the card
//
// Kids get a clearly distinct "yes!" moment every correct answer.

const SPARKLE_POOL = ['⭐', '✨', '🌟', '💫', '🎉', '🎊'];

export default function Celebration({
  show,
  title,
  subtitle,
  emoji = '🎉',
  onContinue,
  onReplay,
  continueLabel = 'Keep exploring',
  replayLabel,
}) {
  // Sparkle positions recomputed each time the card appears so it feels
  // different on every trigger.  Memoised against `show` so the
  // animation runs from fresh positions each time.
  const sparkles = useMemo(() => {
    if (!show) return [];
    return Array.from({ length: 8 }).map((_, i) => ({
      key: `${Date.now()}-${i}`,
      emoji: SPARKLE_POOL[Math.floor(Math.random() * SPARKLE_POOL.length)],
      x: `${Math.random() * 100}%`,
      y: `${Math.random() * 100}%`,
      delay: Math.random() * 0.3,
      size: 18 + Math.random() * 16,
    }));
  }, [show]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-0 z-40 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          role="dialog"
          aria-live="polite"
        >
          <motion.div
            className="absolute inset-0 bg-gradient-to-b from-savanna-200/70 to-terracotta-200/70 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          {/* Radiating glow halo */}
          <motion.div
            className="pointer-events-none absolute h-96 w-96 rounded-full bg-savanna-200/60 blur-3xl"
            initial={{ scale: 0.4, opacity: 0 }}
            animate={{ scale: [0.6, 1.4, 1.2], opacity: [0.3, 0.8, 0.6] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
          />

          <motion.div
            initial={{ scale: 0.5, rotate: -12, opacity: 0 }}
            animate={{ scale: 1, rotate: 0, opacity: 1 }}
            exit={{ scale: 0.75, rotate: 8, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 260, damping: 14 }}
            className="storybook-card relative z-10 w-full max-w-lg overflow-hidden p-8 text-center"
          >
            {/* Background sparkles that dance while the card is open */}
            <div className="pointer-events-none absolute inset-0" aria-hidden="true">
              {sparkles.map((s) => (
                <motion.span
                  key={s.key}
                  className="absolute"
                  style={{ left: s.x, top: s.y, fontSize: s.size }}
                  initial={{ scale: 0, rotate: -30, opacity: 0 }}
                  animate={{
                    scale: [0, 1.2, 0.9, 1.1, 0],
                    rotate: [-30, 15, -10, 20, 30],
                    opacity: [0, 1, 1, 1, 0],
                  }}
                  transition={{
                    duration: 1.8,
                    delay: s.delay,
                    repeat: Infinity,
                    repeatDelay: 0.2,
                  }}
                >
                  {s.emoji}
                </motion.span>
              ))}
            </div>

            <Confetti show={show} />

            <motion.div
              className="mx-auto mb-4 text-8xl"
              animate={{
                y: [0, -14, 0],
                rotate: [-8, 10, -8],
                scale: [1, 1.1, 1],
              }}
              transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
              aria-hidden="true"
            >
              {emoji}
            </motion.div>
            <motion.h2
              className="mb-2 font-display text-4xl text-terracotta-500 sm:text-5xl"
              initial={{ scale: 0.9 }}
              animate={{ scale: [0.9, 1.08, 1] }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
            >
              {title}
            </motion.h2>
            {subtitle && (
              <p className="mb-6 font-body text-lg text-terracotta-600/90 sm:text-xl">
                {subtitle}
              </p>
            )}
            <div className="flex flex-wrap items-center justify-center gap-3">
              {onReplay && (
                <Button variant="sunshine" onClick={onReplay} size="lg">
                  {replayLabel ?? 'Play again'}
                </Button>
              )}
              {onContinue && (
                <Button variant="jungle" onClick={onContinue} size="lg">
                  {continueLabel}
                </Button>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
