import { motion } from 'framer-motion';

// A round speaker button that wiggles when idle — cues pre-readers that
// they can tap it to hear the word / sound / instruction.
export default function AudioButton({
  onPress,
  label = 'Play sound',
  size = 72,
  className = '',
  pulse = true,
}) {
  return (
    <motion.button
      onClick={onPress}
      aria-label={label}
      className={[
        'focus-ring tap-target inline-flex items-center justify-center rounded-full border-4 border-terracotta-300 bg-white text-terracotta-500 shadow-soft',
        className,
      ].join(' ')}
      style={{ width: size, height: size }}
      whileTap={{ scale: 0.9 }}
      animate={pulse ? { scale: [1, 1.06, 1] } : {}}
      transition={pulse ? { repeat: Infinity, duration: 2, ease: 'easeInOut' } : {}}
    >
      <SpeakerIcon size={size * 0.55} />
    </motion.button>
  );
}

function SpeakerIcon({ size }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.4}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M11 5 6 9H3v6h3l5 4V5z" />
      <path d="M16 8a5 5 0 0 1 0 8" />
      <path d="M19 5a9 9 0 0 1 0 14" />
    </svg>
  );
}
