import { motion } from 'motion/react';

interface HeroProps {
  isActive: boolean;
  reducedMotion: boolean;
  onScrollNext?: () => void;
}

export function Hero({ isActive, reducedMotion, onScrollNext }: HeroProps) {
  void isActive;
  void reducedMotion;
  void onScrollNext;

  // Hero is intentionally background-only (the background art already contains the Cass wordmark).
  return <div className="h-full w-full" />;
}
