import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import backgroundImage from '../../assets/cass_bg.png';
import backgroundImageVertical from '../../assets/cass-bg-vertical.png';
import { cn } from './ui/utils';
import { GrainOverlay } from './GrainOverlay';
import { Hero } from './Hero';
import {
  IntroSectionContent,
  AlphaProgrammeSectionContent,
  WhatsInItForYouSectionContent,
  CommitmentSectionContent,
  ApplyNowSectionContent,
} from './InvitationContent';
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion';
import { motion } from 'motion/react';

const SECTION_COUNT = 6;
const EASE_OUT = [0.22, 1, 0.36, 1] as const;

type LandingSectionProps = {
  index: number;
  className?: string;
  onRef: (element: HTMLElement | null) => void;
  children: React.ReactNode;
};

function LandingSection({
  index,
  className,
  onRef,
  children,
}: LandingSectionProps) {
  return (
    <section
      ref={onRef}
      data-index={index}
      className={cn('cass-snap-section relative flex w-full items-stretch', className)}
    >
      <div className="relative flex w-full items-stretch">
        <div
          className="flex w-full"
          style={{
            paddingTop: 'env(safe-area-inset-top)',
            paddingBottom: 'env(safe-area-inset-bottom)',
            paddingLeft: 'env(safe-area-inset-left)',
            paddingRight: 'env(safe-area-inset-right)',
          }}
        >
          <div className="mx-auto flex h-full min-h-0 w-full max-w-6xl flex-col justify-center px-6 py-10 md:px-10">
            <div
              className={cn(
                'cass-section-scroll max-h-full min-h-0 overflow-y-auto overscroll-contain',
                index === 5 && 'cass-section-scroll--no-scrollbar',
              )}
            >
              {children}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

type ProgressDotsProps = {
  activeIndex: number;
  onSelect: (index: number) => void;
  reducedMotion: boolean;
};

function ProgressDots({ activeIndex, onSelect, reducedMotion }: ProgressDotsProps) {
  return (
    <div
      className="fixed right-[calc(1rem+env(safe-area-inset-right))] top-1/2 z-50 hidden -translate-y-1/2 flex-col items-center gap-3 md:flex"
      aria-label="Section progress"
    >
      {Array.from({ length: SECTION_COUNT }).map((_, index) => {
        const isActive = index === activeIndex;
        return (
          <button
            key={index}
            type="button"
            onClick={() => onSelect(index)}
            className={cn(
              'relative h-2.5 w-2.5 rounded-full bg-white/25 transition-[transform,background-color,box-shadow] duration-150',
              'focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white/20',
              isActive && 'bg-white/80 shadow-[0_0_0_3px_rgba(255,255,255,0.14)]',
              !reducedMotion && isActive && 'scale-125',
            )}
            aria-label={`Go to section ${index + 1}`}
          />
        );
      })}
    </div>
  );
}

type BackgroundLayerProps = {
  scrollProgress: number;
  reducedMotion: boolean;
};

function BackgroundLayer({ scrollProgress, reducedMotion }: BackgroundLayerProps) {
  const t = Math.max(0, Math.min(1, scrollProgress));
  const eased = reducedMotion ? t : t * t * (3 - 2 * t); // smoothstep
  const imageOpacity = 1 - 0.6 * eased;
  const dimmerOpacity = 0.8 * eased;
  const vignetteOpacity = 0.12 + 0.32 * eased;
  const baseGradient = useMemo(
    () =>
      'bg-[radial-gradient(1200px_700px_at_20%_10%,rgba(255,255,255,0.08),transparent_60%),radial-gradient(900px_600px_at_75%_35%,rgba(205,215,255,0.06),transparent_64%)]',
    [],
  );

  return (
    <div className="fixed inset-0 z-0 overflow-hidden bg-[#050509]">
      <div className="absolute inset-0">
        <img
          src={backgroundImageVertical}
          alt=""
          className={cn(
            'h-full w-full object-cover object-top saturate-110 contrast-105 lg:hidden',
          )}
          style={!reducedMotion ? { opacity: imageOpacity, willChange: 'opacity' } : { opacity: imageOpacity }}
        />
        <img
          src={backgroundImage}
          alt=""
          className={cn(
            'hidden h-full w-full object-cover object-center saturate-110 contrast-105 lg:block',
          )}
          style={!reducedMotion ? { opacity: imageOpacity, willChange: 'opacity' } : { opacity: imageOpacity }}
        />
      </div>

      <div className={cn('absolute inset-0', baseGradient)} />
      <div className="absolute inset-0 bg-black" style={{ opacity: dimmerOpacity }} />
      <div className="absolute inset-0 bg-black" style={{ opacity: vignetteOpacity }} />
    </div>
  );
}

type HeroPromptProps = {
  isActive: boolean;
  reducedMotion: boolean;
  onNext?: () => void;
};

function HeroPrompt({ isActive, reducedMotion, onNext }: HeroPromptProps) {
  if (!isActive) return null;

  const transition = reducedMotion
    ? { duration: 0.12, ease: 'linear' as const }
    : { duration: 0.55, ease: EASE_OUT };

  return (
    <motion.button
      type="button"
      onClick={onNext}
      initial={{ opacity: 0, y: reducedMotion ? 0 : 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: reducedMotion ? 0 : 10 }}
      transition={transition}
      className="fixed bottom-[calc(1.75rem+env(safe-area-inset-bottom))] left-1/2 z-50 flex -translate-x-1/2 flex-col items-center gap-2 text-white/55 transition-[color] duration-150 hover:text-white/80 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white/15"
    >
      <span className="text-xs uppercase tracking-[0.22em]">Scroll to begin</span>
      <motion.span
        className="text-white/70"
        aria-hidden="true"
        animate={!reducedMotion ? { y: [0, 6, 0] } : { y: 0 }}
        transition={!reducedMotion ? { duration: 1.6, repeat: Infinity, ease: 'easeInOut' } : { duration: 0 }}
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 5v14M19 12l-7 7-7-7" />
        </svg>
      </motion.span>
    </motion.button>
  );
}

export function LandingDeck() {
  const reducedMotion = usePrefersReducedMotion();
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const sectionRefs = useRef<(HTMLElement | null)[]>(Array.from({ length: SECTION_COUNT }).fill(null));

  const [activeIndex, setActiveIndex] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [entered, setEntered] = useState<boolean[]>(
    Array.from({ length: SECTION_COUNT }).map(() => false),
  );

  useEffect(() => {
    setEntered((prev) => {
      if (prev[activeIndex]) return prev;
      const next = [...prev];
      next[activeIndex] = true;
      return next;
    });
  }, [activeIndex]);

  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;
    container.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  }, []);

  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    let raf = 0;
    const update = () => {
      raf = 0;
      const height = container.clientHeight || 1;
      const range = height;
      const next = Math.max(0, Math.min(1, container.scrollTop / range));
      setScrollProgress(next);
    };

    const onScroll = () => {
      if (raf) return;
      raf = window.requestAnimationFrame(update);
    };

    container.addEventListener('scroll', onScroll, { passive: true });
    update();

    return () => {
      container.removeEventListener('scroll', onScroll);
      if (raf) window.cancelAnimationFrame(raf);
    };
  }, []);

  const setSectionRef = useCallback(
    (index: number) => (element: HTMLElement | null) => {
      sectionRefs.current[index] = element;
    },
    [],
  );

  const scrollToIndex = useCallback(
    (index: number) => {
      const el = sectionRefs.current[index];
      if (!el) return;
      el.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth', block: 'start' });
    },
    [reducedMotion],
  );

  useEffect(() => {
    const root = scrollRef.current;
    if (!root) return;

    const sections = sectionRefs.current.filter(Boolean) as HTMLElement[];
    if (!sections.length) return;

    const ratios = Array.from({ length: SECTION_COUNT }).map(() => 0);
    const thresholds = [0, 0.25, 0.5, 0.75, 1];

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const index = Number((entry.target as HTMLElement).dataset.index);
          if (Number.isNaN(index)) continue;
          ratios[index] = entry.intersectionRatio;
        }

        let bestIndex = 0;
        let bestRatio = -1;
        for (let i = 0; i < ratios.length; i += 1) {
          if (ratios[i] > bestRatio) {
            bestRatio = ratios[i];
            bestIndex = i;
          }
        }

        setActiveIndex(bestIndex);
      },
      {
        root,
        threshold: thresholds,
      },
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.defaultPrevented) return;
      if (event.metaKey || event.ctrlKey || event.altKey) return;

      const target = event.target as HTMLElement | null;
      if (
        target?.closest(
          'input, textarea, select, button, a, [role="button"], [role="link"], [contenteditable="true"]',
        )
      ) {
        return;
      }

      const key = event.key;
      const isSpace = key === ' ' || key === 'Spacebar';

      if (key === 'ArrowDown' || key === 'PageDown' || isSpace) {
        event.preventDefault();
        scrollToIndex(Math.min(activeIndex + 1, SECTION_COUNT - 1));
      }

      if (key === 'ArrowUp' || key === 'PageUp') {
        event.preventDefault();
        scrollToIndex(Math.max(activeIndex - 1, 0));
      }

      if (key === 'Home') {
        event.preventDefault();
        scrollToIndex(0);
      }

      if (key === 'End') {
        event.preventDefault();
        scrollToIndex(SECTION_COUNT - 1);
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [activeIndex, scrollToIndex]);

  const sectionProps = useMemo(
    () => ({
      reducedMotion,
      scrollToIndex,
    }),
    [reducedMotion, scrollToIndex],
  );

  return (
    <div className="relative bg-[#050509]">
      <GrainOverlay />
      <BackgroundLayer scrollProgress={scrollProgress} reducedMotion={reducedMotion} />

      <div ref={scrollRef} className="cass-snap-container relative z-10">
        <LandingSection
          index={0}
          onRef={setSectionRef(0)}
        >
          <Hero isActive={activeIndex === 0} onScrollNext={() => scrollToIndex(1)} reducedMotion={reducedMotion} />
        </LandingSection>

        <LandingSection
          index={1}
          onRef={setSectionRef(1)}
        >
          <IntroSectionContent isActive={activeIndex === 1} hasEntered={entered[1]} {...sectionProps} />
        </LandingSection>

        <LandingSection
          index={2}
          onRef={setSectionRef(2)}
        >
          <AlphaProgrammeSectionContent isActive={activeIndex === 2} hasEntered={entered[2]} {...sectionProps} />
        </LandingSection>

        <LandingSection
          index={3}
          onRef={setSectionRef(3)}
        >
          <WhatsInItForYouSectionContent isActive={activeIndex === 3} hasEntered={entered[3]} {...sectionProps} />
        </LandingSection>

        <LandingSection
          index={4}
          onRef={setSectionRef(4)}
        >
          <CommitmentSectionContent isActive={activeIndex === 4} hasEntered={entered[4]} {...sectionProps} />
        </LandingSection>

        <LandingSection
          index={5}
          onRef={setSectionRef(5)}
        >
          <ApplyNowSectionContent isActive={activeIndex === 5} hasEntered={entered[5]} {...sectionProps} />
        </LandingSection>
      </div>

      {activeIndex > 0 && (
        <ProgressDots activeIndex={activeIndex} onSelect={scrollToIndex} reducedMotion={reducedMotion} />
      )}

      <HeroPrompt isActive={activeIndex === 0} reducedMotion={reducedMotion} onNext={() => scrollToIndex(1)} />
    </div>
  );
}
