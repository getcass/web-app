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
import { useIsMobile } from './ui/use-mobile';
import { motion } from 'motion/react';

const SECTION_COUNT = 6;
const EASE_OUT = [0.22, 1, 0.36, 1] as const;
const HERO_CHROME_COLOR = '#9a274c';
const SCROLLED_CHROME_COLOR = '#050509';
const MOBILE_SWIPE_THRESHOLD = 6;
const MOBILE_SNAP_ZONE = 40;
const MOBILE_SNAP_LOCK_MS = 520;

function hexToRgb(hex: string) {
  const normalized = hex.replace('#', '');
  const value = Number.parseInt(normalized, 16);

  return {
    r: (value >> 16) & 255,
    g: (value >> 8) & 255,
    b: value & 255,
  };
}

function rgbToHex({ r, g, b }: { r: number; g: number; b: number }) {
  return `#${[r, g, b]
    .map((channel) => Math.max(0, Math.min(255, Math.round(channel))).toString(16).padStart(2, '0'))
    .join('')}`;
}

function mixHexColors(start: string, end: string, amount: number) {
  const startRgb = hexToRgb(start);
  const endRgb = hexToRgb(end);

  return rgbToHex({
    r: startRgb.r + (endRgb.r - startRgb.r) * amount,
    g: startRgb.g + (endRgb.g - startRgb.g) * amount,
    b: startRgb.b + (endRgb.b - startRgb.b) * amount,
  });
}

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
      id={index === 0 ? 'home' : `section-${index}`}
      className={cn('cass-snap-section relative flex w-full items-stretch', className)}
    >
      <div className="relative flex w-full items-stretch">
        <div
          className="flex w-full"
          style={{
            paddingLeft: 'env(safe-area-inset-left)',
            paddingRight: 'env(safe-area-inset-right)',
          }}
        >
          <div
            className={cn(
              'mx-auto flex min-h-[var(--cass-shell-height)] w-full max-w-6xl flex-col px-6 md:h-full md:min-h-0 md:justify-center md:px-10',
              index === SECTION_COUNT - 1 ? 'justify-start' : 'justify-center',
            )}
          >
            <div
              className={cn(
                'cass-section-scroll min-h-0 md:max-h-full md:overflow-y-auto',
                index === SECTION_COUNT - 1 && 'cass-section-scroll--no-scrollbar',
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
      className="fixed bottom-[calc(1rem+env(safe-area-inset-bottom))] left-1/2 z-50 flex -translate-x-1/2 flex-row items-center gap-3 md:bottom-auto md:left-auto md:right-[calc(1rem+env(safe-area-inset-right))] md:top-1/2 md:-translate-x-0 md:-translate-y-1/2 md:flex-col"
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
    <div className="cass-screen-bleed absolute overflow-hidden bg-[#050509]">
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
  const isMobile = useIsMobile();
  const sectionRefs = useRef<(HTMLElement | null)[]>(Array.from({ length: SECTION_COUNT }).fill(null));
  const themeColorMetaRef = useRef<HTMLMetaElement | null>(null);
  const initialThemeColorRef = useRef<string | null>(null);
  const mobileSwipeRef = useRef<{
    startIndex: number;
    startScrollY: number;
    startX: number;
    startY: number;
    shouldHandle: boolean;
  } | null>(null);
  const mobileSnapLockRef = useRef<number | null>(null);
  const mobileSnapInFlightRef = useRef(false);

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
    const previousScrollRestoration = window.history.scrollRestoration;
    window.history.scrollRestoration = 'manual';
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
    const raf = window.requestAnimationFrame(() => {
      window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
    });

    return () => {
      window.cancelAnimationFrame(raf);
      window.history.scrollRestoration = previousScrollRestoration;
    };
  }, []);

  const setSectionRef = useCallback(
    (index: number) => (element: HTMLElement | null) => {
      sectionRefs.current[index] = element;
    },
    [],
  );

  const getSectionTop = useCallback((index: number) => {
    const element = sectionRefs.current[index];
    if (!element) return null;

    return Math.max(0, element.getBoundingClientRect().top + window.scrollY);
  }, []);

  const getNearestSectionIndex = useCallback((scrollY: number) => {
    let nearestIndex = 0;
    let nearestDistance = Number.POSITIVE_INFINITY;

    for (let index = 0; index < SECTION_COUNT; index += 1) {
      const top = getSectionTop(index);
      if (top === null) continue;

      const distance = Math.abs(scrollY - top);
      if (distance < nearestDistance) {
        nearestDistance = distance;
        nearestIndex = index;
      }
    }

    return nearestIndex;
  }, [getSectionTop]);

  const releaseMobileSnapLock = useCallback(() => {
    mobileSnapInFlightRef.current = false;
    if (mobileSnapLockRef.current) {
      window.clearTimeout(mobileSnapLockRef.current);
      mobileSnapLockRef.current = null;
    }
  }, []);

  const lockMobileSnap = useCallback(() => {
    releaseMobileSnapLock();
    mobileSnapInFlightRef.current = true;
    mobileSnapLockRef.current = window.setTimeout(() => {
      mobileSnapInFlightRef.current = false;
      mobileSnapLockRef.current = null;
    }, reducedMotion ? 80 : MOBILE_SNAP_LOCK_MS);
  }, [reducedMotion, releaseMobileSnapLock]);

  const scrollToSection = useCallback((index: number, behavior: ScrollBehavior) => {
    const top = getSectionTop(index);
    if (top === null) return;

    window.scrollTo({ top: Math.max(0, top), left: 0, behavior });
  }, [getSectionTop]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const requestedSection = Number(params.get('section'));
    if (!Number.isInteger(requestedSection) || requestedSection < 0 || requestedSection >= SECTION_COUNT) {
      return;
    }

    if (!sectionRefs.current[requestedSection] || requestedSection === 0) return;

    const raf = window.requestAnimationFrame(() => {
      scrollToSection(requestedSection, 'auto');
    });

    return () => window.cancelAnimationFrame(raf);
  }, [scrollToSection]);

  useEffect(() => releaseMobileSnapLock, [releaseMobileSnapLock]);

  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      const height = window.innerHeight || document.documentElement.clientHeight || 1;
      const next = Math.max(0, Math.min(1, window.scrollY / height));
      setScrollProgress(next);
    };

    const onScroll = () => {
      if (raf) return;
      raf = window.requestAnimationFrame(update);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    update();

    return () => {
      window.removeEventListener('scroll', onScroll);
      if (raf) window.cancelAnimationFrame(raf);
    };
  }, []);

  const scrollToIndex = useCallback(
    (index: number) => {
      scrollToSection(index, reducedMotion ? 'auto' : 'smooth');
    },
    [reducedMotion, scrollToSection],
  );

  useEffect(() => {
    if (!isMobile) {
      mobileSwipeRef.current = null;
      releaseMobileSnapLock();
      return;
    }

    const isInteractiveTarget = (target: EventTarget | null) =>
      target instanceof HTMLElement &&
      Boolean(
        target.closest(
          'input, textarea, select, button, a, [role="button"], [role="link"], [contenteditable="true"]',
        ),
      );

    const onTouchStart = (event: TouchEvent) => {
      if (event.touches.length !== 1 || mobileSnapInFlightRef.current) {
        mobileSwipeRef.current = null;
        return;
      }

      const touch = event.touches[0];
      const startScrollY = window.scrollY;

      mobileSwipeRef.current = {
        startIndex: getNearestSectionIndex(startScrollY),
        startScrollY,
        startX: touch.clientX,
        startY: touch.clientY,
        shouldHandle: !isInteractiveTarget(event.target),
      };
    };

    const onTouchEnd = (event: TouchEvent) => {
      const gesture = mobileSwipeRef.current;
      mobileSwipeRef.current = null;

      if (!gesture?.shouldHandle || event.changedTouches.length !== 1 || mobileSnapInFlightRef.current) {
        return;
      }

      const anchorTop = getSectionTop(gesture.startIndex);
      if (anchorTop === null || Math.abs(gesture.startScrollY - anchorTop) > MOBILE_SNAP_ZONE) {
        return;
      }

      const touch = event.changedTouches[0];
      const deltaX = touch.clientX - gesture.startX;
      const deltaY = touch.clientY - gesture.startY;

      if (Math.abs(deltaY) < MOBILE_SWIPE_THRESHOLD || Math.abs(deltaY) <= Math.abs(deltaX)) {
        return;
      }

      const targetIndex = Math.max(
        0,
        Math.min(SECTION_COUNT - 1, gesture.startIndex + (deltaY < 0 ? 1 : -1)),
      );
      if (targetIndex === gesture.startIndex) return;

      lockMobileSnap();
      scrollToSection(targetIndex, reducedMotion ? 'auto' : 'smooth');
    };

    const onTouchCancel = () => {
      mobileSwipeRef.current = null;
    };

    window.addEventListener('touchstart', onTouchStart, { passive: true });
    window.addEventListener('touchend', onTouchEnd, { passive: true });
    window.addEventListener('touchcancel', onTouchCancel, { passive: true });

    return () => {
      window.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchend', onTouchEnd);
      window.removeEventListener('touchcancel', onTouchCancel);
    };
  }, [getNearestSectionIndex, getSectionTop, isMobile, lockMobileSnap, reducedMotion, releaseMobileSnapLock, scrollToSection]);

  useEffect(() => {
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
        root: null,
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
  const chromeBlend = reducedMotion
    ? scrollProgress
    : scrollProgress * scrollProgress * (3 - 2 * scrollProgress);
  const themeColor = useMemo(
    () => mixHexColors(HERO_CHROME_COLOR, SCROLLED_CHROME_COLOR, chromeBlend),
    [chromeBlend],
  );

  useEffect(() => {
    const meta = document.querySelector<HTMLMetaElement>('meta[name="theme-color"]');
    if (!meta) return;

    themeColorMetaRef.current = meta;
    if (initialThemeColorRef.current === null) {
      initialThemeColorRef.current = meta.content;
    }
  }, []);

  useEffect(() => {
    if (!themeColorMetaRef.current) return;
    themeColorMetaRef.current.content = themeColor;
  }, [themeColor]);

  useEffect(
    () => () => {
      if (!themeColorMetaRef.current || initialThemeColorRef.current === null) return;
      themeColorMetaRef.current.content = initialThemeColorRef.current;
    },
    [],
  );

  return (
    <div className="relative bg-[#050509]">
      <div className="cass-background-stage">
        <BackgroundLayer scrollProgress={scrollProgress} reducedMotion={reducedMotion} />
        <GrainOverlay />
      </div>

      <div className="cass-snap-container relative z-10">
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
