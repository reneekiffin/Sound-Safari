import { motion } from 'framer-motion';
import { forwardRef } from 'react';

// A bouncy, high-contrast button with a hard bottom shadow ("pop" shadow)
// that compresses on press — feels physical and is instantly legible as a
// tap target for pre-readers.
const VARIANTS = {
  primary:
    'bg-terracotta-300 text-white border-terracotta-500 hover:bg-terracotta-400',
  sunshine:
    'bg-savanna-300 text-terracotta-600 border-savanna-500 hover:bg-savanna-400',
  jungle: 'bg-sage-300 text-white border-sage-500 hover:bg-sage-400',
  parrot: 'bg-parrot-400 text-white border-parrot-500 hover:bg-parrot-500',
  ghost:
    'bg-white/80 text-terracotta-500 border-terracotta-200 hover:bg-white',
};

const SIZES = {
  md: 'px-6 py-4 text-lg rounded-2xl',
  lg: 'px-8 py-5 text-2xl rounded-3xl',
  xl: 'px-10 py-6 text-3xl rounded-[28px]',
};

const Button = forwardRef(function Button(
  {
    children,
    variant = 'primary',
    size = 'md',
    className = '',
    onClick,
    type = 'button',
    disabled = false,
    ariaLabel,
    ...rest
  },
  ref,
) {
  return (
    <motion.button
      ref={ref}
      type={type}
      disabled={disabled}
      aria-label={ariaLabel}
      onClick={onClick}
      whileTap={!disabled ? { scale: 0.94, y: 4 } : undefined}
      whileHover={!disabled ? { y: -2 } : undefined}
      transition={{ type: 'spring', stiffness: 420, damping: 18 }}
      className={[
        'tap-target focus-ring inline-flex items-center justify-center gap-3 border-b-[6px] font-heading font-extrabold tracking-wide shadow-soft transition-colors',
        'disabled:opacity-60 disabled:cursor-not-allowed',
        VARIANTS[variant],
        SIZES[size],
        className,
      ].join(' ')}
      {...rest}
    >
      {children}
    </motion.button>
  );
});

export default Button;
