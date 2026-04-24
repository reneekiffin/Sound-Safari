import { motion } from 'framer-motion';

export default function ProgressBar({ current, total, color = '#e8bd4a', label }) {
  const pct = total === 0 ? 0 : Math.max(0, Math.min(1, current / total));
  return (
    <div className="w-full" aria-label={label ?? `Progress ${current} of ${total}`}>
      <div className="mb-1 flex justify-between text-sm font-bold text-terracotta-600">
        <span>{label ?? 'Progress'}</span>
        <span>
          {current} / {total}
        </span>
      </div>
      <div className="h-4 w-full overflow-hidden rounded-full bg-white/70 shadow-inner">
        <motion.div
          className="h-full rounded-full"
          style={{ backgroundColor: color }}
          initial={false}
          animate={{ width: `${pct * 100}%` }}
          transition={{ type: 'spring', stiffness: 180, damping: 22 }}
        />
      </div>
    </div>
  );
}
