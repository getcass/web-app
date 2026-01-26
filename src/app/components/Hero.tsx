import { motion } from 'motion/react';

interface HeroProps {
  isActive: boolean;
  reducedMotion: boolean;
  onScrollNext?: () => void;
}

const EASE_OUT = [0.22, 1, 0.36, 1] as const;

export function Hero({ isActive, reducedMotion, onScrollNext }: HeroProps) {
  const transition = reducedMotion
    ? { duration: 0.12, ease: 'linear' }
    : { duration: 0.65, ease: EASE_OUT };
  const chevronClassName = 'text-white/70';

  return (
    <div className="relative flex h-full w-full items-center justify-center">
      <motion.button
        type="button"
        onClick={onScrollNext}
        initial={{ opacity: 0, y: reducedMotion ? 0 : 10 }}
        animate={isActive ? { opacity: 1, y: 0 } : { opacity: 0, y: reducedMotion ? 0 : 10 }}
        transition={
          reducedMotion
            ? { duration: 0.12, ease: 'linear' }
            : { duration: 0.55, ease: EASE_OUT, delay: 0.12 }
        }
        className="group absolute left-1/2 top-[calc(1.25rem+env(safe-area-inset-top))] flex -translate-x-1/2 flex-col items-center gap-2 text-white/55 transition-[color] duration-150 hover:text-white/75 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white/15"
      >
        <span className="text-xs uppercase tracking-[0.22em]">Scroll to begin</span>
        <motion.span
          className={chevronClassName}
          aria-hidden="true"
          animate={isActive && !reducedMotion ? { y: [0, 6, 0] } : { y: 0 }}
          transition={
            isActive && !reducedMotion
              ? { duration: 1.6, repeat: Infinity, ease: 'easeInOut' }
              : { duration: 0 }
          }
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 5v14M19 12l-7 7-7-7" />
          </svg>
        </motion.span>
      </motion.button>
    </div>
  );
}
