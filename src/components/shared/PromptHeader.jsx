import { motion } from 'framer-motion';
import AnimalHost from './AnimalHost.jsx';

// Shared prompt header: mascot + speech-bubble-style card.
//
// Crucially, the mascot and the card live in a normal flex row (column on
// narrow screens), NOT absolute-positioned on top of each other, so the
// mascot never floats in front of the question text.  On mobile the mascot
// stacks above the card; on tablet+ they sit side by side.
export default function PromptHeader({
  animal,
  happy = false,
  mascotSize = 110,
  hostLabel, // e.g. "Leo says..."
  children,
  className = '',
}) {
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
      <motion.div
        initial={{ scale: 0.85, opacity: 0, y: 8 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 240, damping: 20 }}
        className="relative w-full max-w-xl rounded-[32px] border-4 border-terracotta-200 bg-white/95 px-5 py-4 text-center shadow-card sm:px-7 sm:py-5"
      >
        {hostLabel && (
          <p className="font-body text-xs font-bold uppercase tracking-widest text-terracotta-500 sm:text-sm">
            {hostLabel}
          </p>
        )}
        {children}
      </motion.div>
    </div>
  );
}
