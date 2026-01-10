import { useState } from 'react';
import { motion, useMotionValueEvent, useScroll, useTransform } from 'motion/react';

interface HeroProps {
  isLoaded: boolean;
}

export function Hero({ isLoaded }: HeroProps) {
  const { scrollY } = useScroll();
  const promptOpacity = useTransform(scrollY, [0, 40, 200], [1, 1, 0], { clamp: true });
  const promptY = useTransform(scrollY, [0, 40, 200], [0, 0, -10], { clamp: true });
  const [isPromptHidden, setIsPromptHidden] = useState(false);

  useMotionValueEvent(scrollY, 'change', (value) => {
    setIsPromptHidden((current) => {
      if (current) return value > 60;
      return value > 220;
    });
  });

  return (
    <section className="relative min-h-[100svh] flex items-center justify-center px-6">
      <div className="max-w-4xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isLoaded ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1, ease: 'easeOut' }}
        >
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={isLoaded ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 1, delay: 0.2 }}
        className="absolute bottom-[calc(5rem+env(safe-area-inset-bottom))] left-0 right-0 flex flex-col items-center gap-3"
      >
        {!isPromptHidden && (
          <motion.div style={{ opacity: promptOpacity, y: promptY }} className="flex flex-col items-center gap-3">
            <span className="text-white/40 text-sm uppercase tracking-wider">Scroll to begin</span>
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              className="text-white/60"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 5v14M19 12l-7 7-7-7" />
              </svg>
            </motion.div>
          </motion.div>
        )}
      </motion.div>
    </section>
  );
}
