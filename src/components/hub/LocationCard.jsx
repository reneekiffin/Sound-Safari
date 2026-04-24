import { motion } from 'framer-motion';
import AnimalHost from '../shared/AnimalHost.jsx';

export default function LocationCard({ game, locked, stars, onPlay, onHover }) {
  const animal = game.animal ?? 'lion';

  return (
    <motion.button
      onClick={onPlay}
      onHoverStart={onHover}
      onFocus={onHover}
      disabled={locked}
      whileTap={!locked ? { scale: 0.96 } : undefined}
      whileHover={!locked ? { y: -6 } : undefined}
      transition={{ type: 'spring', stiffness: 320, damping: 18 }}
      className="focus-ring group relative flex flex-col items-center rounded-[36px] border-4 border-terracotta-200 bg-white/90 p-5 text-left shadow-card disabled:cursor-not-allowed disabled:opacity-70 sm:p-6"
      style={{ background: game.bg }}
      aria-label={`${game.title} with ${game.host.name}. ${game.subtitle}${locked ? '. Locked.' : ''}`}
    >
      <div className="flex w-full items-center justify-between">
        <span className="rounded-full bg-white/70 px-3 py-1 font-body text-xs font-bold uppercase tracking-wide text-terracotta-500">
          Ages {game.ageRange}
        </span>
        <span
          className="flex items-center gap-1 rounded-full bg-white/70 px-3 py-1 font-heading text-sm font-extrabold text-terracotta-600"
          aria-label={`${stars} stars earned here`}
        >
          <span aria-hidden="true">⭐</span>
          {stars}
        </span>
      </div>

      <div className="mt-2 flex h-36 w-full items-center justify-center sm:h-44">
        <AnimalHost type={animal} size={150} />
      </div>

      <div className="mt-3 w-full">
        <h3 className="font-display text-3xl leading-none text-terracotta-600 sm:text-4xl">
          {game.title}
        </h3>
        <p className="mt-1 font-body text-base text-terracotta-600/90">
          {game.subtitle}
        </p>
        <div className="mt-3 flex items-center justify-between">
          <span className="font-body text-sm font-bold text-terracotta-500">
            Hosted by {game.host.name}
          </span>
          {!locked ? (
            <motion.span
              className="inline-flex items-center gap-1 rounded-full bg-terracotta-400 px-4 py-2 font-heading text-base font-extrabold text-white shadow-soft"
              whileHover={{ x: 4 }}
            >
              Play
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M9 18l6-6-6-6" />
              </svg>
            </motion.span>
          ) : (
            <span className="inline-flex items-center gap-1 rounded-full bg-terracotta-100 px-4 py-2 font-heading text-base font-extrabold text-terracotta-500">
              <span aria-hidden="true">🔒</span>
              Locked
            </span>
          )}
        </div>
      </div>
    </motion.button>
  );
}
