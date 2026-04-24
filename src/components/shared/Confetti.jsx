import { useMemo } from 'react';
import { motion } from 'framer-motion';

const PIECES = 36;
const PALETTE = ['#e24a3c', '#f2994a', '#e8bd4a', '#679148', '#2aa29a', '#fbf5e7'];

// Physics-ish confetti: each piece gets a randomised angle + distance so
// the burst looks organic without needing a library.
export default function Confetti({ show }) {
  const pieces = useMemo(
    () =>
      Array.from({ length: PIECES }).map((_, i) => ({
        id: i,
        color: PALETTE[i % PALETTE.length],
        angle: (Math.PI * 2 * i) / PIECES + (Math.random() - 0.5),
        distance: 180 + Math.random() * 240,
        size: 8 + Math.random() * 14,
        rotate: Math.random() * 360,
      })),
    [],
  );

  if (!show) return null;

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      {pieces.map((p) => {
        const x = Math.cos(p.angle) * p.distance;
        const y = Math.sin(p.angle) * p.distance;
        return (
          <motion.span
            key={p.id}
            className="absolute left-1/2 top-1/2 block rounded-sm"
            style={{
              width: p.size,
              height: p.size * 0.4,
              background: p.color,
              rotate: p.rotate,
            }}
            initial={{ x: 0, y: 0, opacity: 1, scale: 0.2 }}
            animate={{ x, y: y + 120, opacity: 0, scale: 1 }}
            transition={{ duration: 1.1 + Math.random() * 0.6, ease: 'easeOut' }}
          />
        );
      })}
    </div>
  );
}
