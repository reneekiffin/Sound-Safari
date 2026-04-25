import { motion } from 'framer-motion';
import AnimalHost from './AnimalHost.jsx';

// Shared prompt header: mascot + speech-bubble-style card.
//
// Layout: flex column on phones, row on tablets+.  Mascot never floats
// in front of the question text.
//
// onTap (optional): if provided, the speech bubble itself becomes a
// big tappable target — kid taps it to replay the prompt audio.  Used
// in Letter Sounds so Leo's phoneme tile doubles as a "say it again"
// button without needing a separate speaker icon.
export default function PromptHeader({
  animal,
  happy = false,
  mascotSize = 110,
  hostLabel, // e.g. "Leo says..."
  children,
  onTap,
  className = '',
}) {
  const tappable = typeof onTap === 'function';
  const Card = tappable ? motion.button : motion.div;
  return (
    <div
      className={[
        'flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-5',
        className,
      ].join(' ')}
    >
      <AnimalHost
        type={animal}
        size={mascotSize}
        happy={happy}
        className="shrink-0"
      />
      <Card
        type={tappable ? 'button' : undefined}
        onClick={tappable ? onTap : undefined}
        initial={{ scale: 0.85, opacity: 0, y: 8 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        whileTap={tappable ? { scale: 0.97 } : undefined}
        whileHover={tappable ? { y: -3 } : undefined}
        transition={{ type: 'spring', stiffness: 240, damping: 20 }}
        aria-label={tappable ? 'Tap to hear it again' : undefined}
        className={[
          'focus-ring relative w-full max-w-xl rounded-[32px] border-4 border-terracotta-200 bg-white/95 px-5 py-4 text-center shadow-card sm:px-7 sm:py-5',
          tappable ? 'cursor-pointer hover:border-terracotta-400' : '',
        ].join(' ')}
      >
        {hostLabel && (
          <p className="font-body text-xs font-bold uppercase tracking-widest text-terracotta-500 sm:text-sm">
            {hostLabel}
          </p>
        )}
        {children}
      </Card>
    </div>
  );
}
