import { motion } from 'framer-motion';
import ProgressBar from '../shared/ProgressBar.jsx';
import TopBar from '../shared/TopBar.jsx';

// Wraps every game in a consistent chrome: top bar (back + stars), a
// progress bar, and a pastel-gradient "stage" for the round content.
export default function GameShell({
  game,
  profile,
  totalStars,
  round,
  totalRounds,
  onExit,
  onOpenSettings,
  children,
}) {
  return (
    <div
      className="flex min-h-screen w-full flex-col"
      style={{ background: game.bg }}
    >
      <TopBar
        profile={profile}
        stars={totalStars}
        onBack={onExit}
        backLabel="Back to the Safari Map"
        onOpenSettings={onOpenSettings}
      />

      <div className="px-4 pb-2 sm:px-8">
        <div className="mx-auto max-w-3xl">
          <div className="mb-1 flex items-baseline justify-between">
            <h2 className="font-display text-3xl leading-none text-terracotta-600 sm:text-4xl">
              {game.title}
            </h2>
            <span className="font-heading text-base font-extrabold text-terracotta-600/80">
              with {game.host.name}
            </span>
          </div>
          <ProgressBar
            current={Math.min(round, totalRounds)}
            total={totalRounds}
            color={game.accent}
            label="Round"
          />
        </div>
      </div>

      <motion.main
        className="flex flex-1 items-center justify-center px-4 pb-10 sm:px-8"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 160, damping: 22 }}
      >
        <div className="w-full max-w-3xl">{children}</div>
      </motion.main>
    </div>
  );
}
