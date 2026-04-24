import { motion } from 'framer-motion';

export default function TopBar({ profile, stars, onOpenSettings, onBack, backLabel }) {
  return (
    <header className="flex items-center justify-between gap-3 px-4 pb-2 pt-3 sm:px-6">
      <div className="flex items-center gap-3">
        {onBack && (
          <motion.button
            onClick={onBack}
            whileTap={{ scale: 0.9 }}
            aria-label={backLabel ?? 'Back to the safari map'}
            className="focus-ring tap-target flex h-14 w-14 items-center justify-center rounded-full border-4 border-terracotta-200 bg-white text-terracotta-500 shadow-soft"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </motion.button>
        )}
        <div className="flex items-center gap-2 rounded-full bg-white/80 px-4 py-2 shadow-soft">
          <span className="text-2xl" aria-hidden="true">
            {profile?.avatar ?? '🦁'}
          </span>
          <span className="font-heading text-base font-extrabold text-terracotta-600 sm:text-lg">
            {profile?.childName ?? 'Explorer'}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <div
          className="flex items-center gap-2 rounded-full bg-savanna-100 px-4 py-2 font-heading text-lg font-extrabold text-terracotta-600 shadow-soft"
          aria-label={`${stars} stars earned`}
        >
          <motion.span
            className="text-2xl"
            animate={{ rotate: [0, 12, -8, 0] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
            aria-hidden="true"
          >
            ⭐
          </motion.span>
          <span>{stars}</span>
        </div>
        {onOpenSettings && (
          <motion.button
            onClick={onOpenSettings}
            whileTap={{ scale: 0.9, rotate: 30 }}
            whileHover={{ rotate: 20 }}
            aria-label="Parent settings"
            className="focus-ring tap-target flex h-14 w-14 items-center justify-center rounded-full border-4 border-sage-200 bg-white text-sage-500 shadow-soft"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.4"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <circle cx="12" cy="12" r="3" />
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
            </svg>
          </motion.button>
        )}
      </div>
    </header>
  );
}
