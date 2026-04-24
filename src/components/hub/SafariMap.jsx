import { motion } from 'framer-motion';
import LocationCard from './LocationCard.jsx';
import { GAMES, LEVELS, gamesForLevel } from '../../data/games.js';

// The "map" is a grid of storybook cards framed by a jungle backdrop.  A
// level filter at the top lets kids (or parents) scope the hub to an age
// band so the right games are surfaced for their reading level.
export default function SafariMap({ progress, onSelectGame, onHoverGame, level, onChangeLevel }) {
  const visibleGames = level === 'all' ? GAMES : gamesForLevel(level);

  return (
    <section className="relative flex-1 px-4 pb-12 sm:px-6">
      <Backdrop />

      <motion.div
        className="relative z-10 mx-auto max-w-5xl pt-2"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 140, damping: 22 }}
      >
        <div className="mb-4 text-center">
          <motion.h1
            className="font-display text-5xl leading-none text-terracotta-500 sm:text-6xl"
            animate={{ rotate: [-1.5, 1.5, -1.5] }}
            transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
          >
            Sound Safari
          </motion.h1>
          <p className="mt-2 font-body text-lg text-terracotta-600/80 sm:text-xl">
            Pick a friend to play with!
          </p>
        </div>

        <LevelBar level={level} onChange={onChangeLevel} />

        <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {visibleGames.map((game) => {
            const gameProgress = progress.games[game.id] ?? { stars: 0 };
            return (
              <LocationCard
                key={game.id}
                game={game}
                locked={false}
                stars={gameProgress.stars}
                onPlay={() => onSelectGame(game.id)}
                onHover={() => onHoverGame?.(game)}
              />
            );
          })}
        </div>

        {visibleGames.length === 0 && (
          <p className="mt-8 text-center font-body text-lg text-terracotta-600/80">
            No games for this level yet — try another.
          </p>
        )}
      </motion.div>
    </section>
  );
}

function LevelBar({ level, onChange }) {
  const options = [{ id: 'all', label: 'All games', age: 'everyone' }, ...LEVELS];
  return (
    <div
      role="tablist"
      aria-label="Choose your level"
      className="flex flex-wrap items-center justify-center gap-2"
    >
      {options.map((opt) => {
        const active = opt.id === level;
        return (
          <button
            key={opt.id}
            role="tab"
            aria-selected={active}
            onClick={() => onChange(opt.id)}
            className={[
              'focus-ring rounded-full border-4 px-4 py-2 font-heading text-sm font-extrabold transition-colors sm:text-base',
              active
                ? 'border-terracotta-500 bg-terracotta-400 text-white shadow-soft'
                : 'border-terracotta-200 bg-white/80 text-terracotta-600 hover:border-terracotta-300',
            ].join(' ')}
          >
            <span className="block leading-none">{opt.label}</span>
            <span
              className={[
                'mt-0.5 block text-[11px] font-bold leading-none',
                active ? 'text-white/90' : 'text-terracotta-500/80',
              ].join(' ')}
            >
              {opt.age}
            </span>
          </button>
        );
      })}
    </div>
  );
}

// Soft gradient hills + floating leaves — entirely CSS/SVG so it ships in
// the bundle with no external image requests.
function Backdrop() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      <svg
        className="absolute inset-x-0 bottom-0 h-80 w-full"
        viewBox="0 0 1440 320"
        preserveAspectRatio="none"
      >
        <path
          fill="#d9e8cf"
          d="M0 160 Q180 80 360 160 T720 160 T1080 160 T1440 160 V320 H0 Z"
        />
        <path
          fill="#b0cd9f"
          d="M0 220 Q180 140 360 220 T720 220 T1080 220 T1440 220 V320 H0 Z"
        />
        <path
          fill="#86b06e"
          d="M0 280 Q180 220 360 280 T720 280 T1080 280 T1440 280 V320 H0 Z"
        />
      </svg>
      {[
        { left: '8%', top: '10%', size: 44, delay: 0 },
        { left: '85%', top: '16%', size: 36, delay: 0.8 },
        { left: '72%', top: '70%', size: 40, delay: 1.6 },
        { left: '12%', top: '62%', size: 52, delay: 0.4 },
      ].map((leaf, i) => (
        <motion.div
          key={i}
          className="absolute"
          style={{ left: leaf.left, top: leaf.top }}
          animate={{ y: [0, -12, 0], rotate: [-6, 8, -6] }}
          transition={{
            duration: 7 + i,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: leaf.delay,
          }}
        >
          <Leaf size={leaf.size} />
        </motion.div>
      ))}
      <div className="absolute right-6 top-8 h-24 w-24 rounded-full bg-savanna-200/80 blur-md" />
      <div className="absolute right-10 top-12 h-16 w-16 rounded-full bg-savanna-300/80" />
    </div>
  );
}

function Leaf({ size = 40 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" aria-hidden="true">
      <path
        d="M5 30 Q5 5 35 5 Q35 35 5 30 Z"
        fill="#86b06e"
        stroke="#3b5728"
        strokeWidth="2"
      />
      <path d="M10 28 Q20 18 32 10" stroke="#3b5728" strokeWidth="1.8" fill="none" />
    </svg>
  );
}
