import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { LEVELS } from '../../data/games.js';

// A tap-to-open dropdown that replaces the tab-style level bar.
//
// Behaviour:
//   - Closed: shows the currently-selected level as one large pill.
//   - Open: shows all options below, along with "All games".
//   - Tap outside or press Escape to close.
//
// Kid-friendly tap targets (64+ px tall) and big chevron indicator.
const OPTIONS = [{ id: 'all', label: 'All games', age: 'everyone' }, ...LEVELS];

export default function LevelDropdown({ level, onChange }) {
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef(null);

  const current = OPTIONS.find((o) => o.id === level) ?? OPTIONS[0];

  useEffect(() => {
    if (!open) return undefined;

    const handleDown = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    const handleEsc = (e) => {
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('mousedown', handleDown);
    window.addEventListener('touchstart', handleDown);
    window.addEventListener('keydown', handleEsc);
    return () => {
      window.removeEventListener('mousedown', handleDown);
      window.removeEventListener('touchstart', handleDown);
      window.removeEventListener('keydown', handleEsc);
    };
  }, [open]);

  const pick = (id) => {
    onChange(id);
    setOpen(false);
  };

  return (
    <div
      ref={wrapperRef}
      className="relative mx-auto w-full max-w-sm"
    >
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={`Level: ${current.label}, ages ${current.age}. Tap to change.`}
        onClick={() => setOpen((o) => !o)}
        className={[
          'focus-ring flex w-full items-center justify-between gap-3 rounded-3xl border-4 px-5 py-3 text-left font-heading font-extrabold shadow-card transition-colors',
          open
            ? 'border-terracotta-500 bg-terracotta-400 text-white'
            : 'border-terracotta-200 bg-white text-terracotta-600 hover:border-terracotta-300',
        ].join(' ')}
      >
        <span className="flex flex-col">
          <span className="text-[11px] font-bold uppercase tracking-widest opacity-80">
            Level
          </span>
          <span className="text-lg leading-tight sm:text-xl">{current.label}</span>
          <span className="text-xs font-bold opacity-80">ages {current.age}</span>
        </span>
        <motion.span
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ type: 'spring', stiffness: 280, damping: 20 }}
          aria-hidden="true"
          className="text-2xl"
        >
          ▾
        </motion.span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.ul
            role="listbox"
            aria-label="Choose a level"
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.98 }}
            transition={{ type: 'spring', stiffness: 260, damping: 22 }}
            className="absolute left-0 right-0 top-full z-30 mt-2 flex flex-col gap-1 rounded-3xl border-4 border-terracotta-200 bg-white p-2 shadow-card"
          >
            {OPTIONS.map((opt) => {
              const active = opt.id === level;
              return (
                <li key={opt.id}>
                  <button
                    type="button"
                    role="option"
                    aria-selected={active}
                    onClick={() => pick(opt.id)}
                    className={[
                      'focus-ring flex w-full items-center justify-between gap-3 rounded-2xl px-4 py-3 text-left font-heading font-extrabold transition-colors',
                      active
                        ? 'bg-terracotta-400 text-white'
                        : 'bg-white text-terracotta-600 hover:bg-terracotta-100',
                    ].join(' ')}
                  >
                    <span className="flex flex-col">
                      <span className="text-base leading-tight sm:text-lg">
                        {opt.label}
                      </span>
                      <span
                        className={[
                          'text-xs font-bold',
                          active ? 'text-white/90' : 'text-terracotta-500/80',
                        ].join(' ')}
                      >
                        ages {opt.age}
                      </span>
                    </span>
                    {active && <span aria-hidden="true">✓</span>}
                  </button>
                </li>
              );
            })}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}
