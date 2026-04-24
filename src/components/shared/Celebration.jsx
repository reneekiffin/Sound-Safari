import { AnimatePresence, motion } from 'framer-motion';
import { useEffect } from 'react';
import Confetti from './Confetti.jsx';
import Button from './Button.jsx';

// Unified celebration overlay: used for both per-round "correct" moments
// and end-of-game / milestone screens.  Driven entirely by props so it can
// be reused from any game or the global star-milestone trigger.
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
  useEffect(() => {
    if (!show) return undefined;
    // Short auto-dismiss safety for per-round cheers when no button.
    if (!onContinue && !onReplay) {
      const t = setTimeout(() => {}, 1200);
      return () => clearTimeout(t);
    }
    return undefined;
  }, [show, onContinue, onReplay]);

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
          <motion.div
            initial={{ scale: 0.6, rotate: -8, opacity: 0 }}
            animate={{ scale: 1, rotate: 0, opacity: 1 }}
            exit={{ scale: 0.8, rotate: 6, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 220, damping: 16 }}
            className="storybook-card relative z-10 w-full max-w-lg p-8 text-center"
          >
            <Confetti show={show} />
            <motion.div
              className="mx-auto mb-4 text-7xl"
              animate={{ y: [0, -10, 0], rotate: [-6, 6, -6] }}
              transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}
              aria-hidden="true"
            >
              {emoji}
            </motion.div>
            <h2 className="mb-2 font-display text-4xl text-terracotta-500 sm:text-5xl">
              {title}
            </h2>
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
