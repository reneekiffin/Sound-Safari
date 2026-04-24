import { motion } from 'framer-motion';

// Placeholder mascot renderer using Apple-style emoji.
//
// We deliberately keep the component API stable (type / size / idle / happy)
// so we can swap this out for real illustrations later without touching any
// game or hub code.  The scaling is tuned so an emoji visually occupies
// roughly the same bounding box the SVGs used to.
//
// Toucan note: Unicode has no dedicated toucan emoji, so Toby falls back to
// the generic bird glyph — once real illustrations land this goes away.
const ANIMAL_EMOJI = {
  lion: '🦁',
  monkey: '🐒',
  parrot: '🦜',
  elephant: '🐘',
  toucan: '🐦',
  frog: '🐸',
  giraffe: '🦒',
};

export default function AnimalHost({
  type,
  size = 180,
  idle = true,
  happy = false,
  className = '',
}) {
  const emoji = ANIMAL_EMOJI[type] ?? '🐾';

  return (
    <motion.div
      className={['inline-flex items-center justify-center leading-none', className].join(' ')}
      style={{
        width: size,
        height: size,
        fontSize: Math.round(size * 0.82),
        // The default apple emoji font stack — keeps the rendering
        // consistent across platforms that have Apple's emoji installed,
        // and falls through gracefully on platforms that don't.
        fontFamily:
          '"Apple Color Emoji", "Segoe UI Emoji", "Noto Color Emoji", "Twemoji Mozilla", sans-serif',
      }}
      animate={
        happy
          ? { y: [0, -14, 0], rotate: [-8, 8, -8], scale: [1, 1.08, 1] }
          : idle
          ? { y: [0, -6, 0] }
          : undefined
      }
      transition={{
        duration: happy ? 0.9 : 3.5,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
      aria-hidden="true"
    >
      {emoji}
    </motion.div>
  );
}
