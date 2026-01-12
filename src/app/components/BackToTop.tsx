import { useState, useEffect, type CSSProperties } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowUp } from 'lucide-react';

export function BackToTop() {
  const [isVisible, setIsVisible] = useState(false);
  const containerStyle: CSSProperties = {
    bottom: 'calc(2rem + env(safe-area-inset-bottom))',
    paddingLeft: '2rem',
    paddingRight: 'calc(2rem + env(safe-area-inset-right))',
  };

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 500) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          className="fixed inset-x-0 z-50 flex justify-end pointer-events-none"
          style={containerStyle}
        >
          <motion.button
            onClick={scrollToTop}
            className="pointer-events-auto p-4 rounded-full pearl-card border border-border/60 text-foreground/80 shadow-lg hover:text-foreground hover:shadow-xl transition-[box-shadow,color]"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            aria-label="Back to top"
          >
            <ArrowUp className="w-6 h-6" />
          </motion.button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
