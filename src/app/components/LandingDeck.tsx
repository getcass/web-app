import type { CSSProperties, ReactNode } from 'react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { motion } from 'motion/react';
import logoUrl from '../../assets/logo.svg';
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion';
import {
  AlphaProgrammeSectionContent,
  ApplyNowSectionContent,
  CommitmentSectionContent,
  IntroSectionContent,
  WhatsInItForYouSectionContent,
} from './InvitationContent';
import { useIsMobile } from './ui/use-mobile';
import { cn } from './ui/utils';

const SECTION_COUNT = 6;
const EASE_OUT = [0.22, 1, 0.36, 1] as const;
const MOBILE_SWIPE_THRESHOLD = 6;
const MOBILE_SNAP_ZONE = 40;
const MOBILE_SNAP_LOCK_MS = 520;

type LandingDeckProps = {
  initialAlphaExpanded?: boolean;
};

type LandingSectionProps = {
  index: number;
  className?: string;
  onRef: (element: HTMLElement | null) => void;
  children: ReactNode;
};

const LEGAL_LINKS = [
  { href: 'terms/', label: 'Terms' },
  { href: 'privacy/', label: 'Privacy' },
];

const LOGO_MASK_STYLE: CSSProperties = {
  WebkitMaskImage: `url(${logoUrl})`,
  maskImage: `url(${logoUrl})`,
  WebkitMaskRepeat: 'no-repeat',
  maskRepeat: 'no-repeat',
  WebkitMaskSize: 'contain',
  maskSize: 'contain',
  WebkitMaskPosition: 'center',
  maskPosition: 'center',
  backgroundColor: '#ffffff',
};

function LandingSection({ index, className, onRef, children }: LandingSectionProps) {
  return (
    <section
      ref={onRef}
      data-index={index}
      id={`section-${index}`}
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

function BackgroundLayer() {
  return <div className="cass-screen-bleed absolute overflow-hidden bg-black" />;
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
      className="fixed bottom-[calc(5.5rem+env(safe-area-inset-bottom))] left-1/2 z-50 flex -translate-x-1/2 flex-col items-center gap-2 text-white transition-[color] duration-150 hover:text-white focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white/15 md:bottom-[calc(1.75rem+env(safe-area-inset-bottom))]"
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

function getLinkPrefix() {
  if (typeof window === 'undefined') return '';
  return window.location.pathname.includes('/private-alpha') ? '../' : '';
}

export function LandingDeck({ initialAlphaExpanded = false }: LandingDeckProps) {
  const reducedMotion = usePrefersReducedMotion();
  const isMobile = useIsMobile();
  const sectionRefs = useRef<(HTMLElement | null)[]>(Array.from({ length: SECTION_COUNT }).fill(null));
  const mobileSwipeRef = useRef<{
    startIndex: number;
    startScrollY: number;
    startX: number;
    startY: number;
    shouldHandle: boolean;
  } | null>(null);
  const mobileSnapLockRef = useRef<number | null>(null);
  const mobileSnapInFlightRef = useRef(false);

  const [alphaExpanded, setAlphaExpanded] = useState(initialAlphaExpanded);
  const [activeIndex, setActiveIndex] = useState(0);
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

  useEffect(() => releaseMobileSnapLock, [releaseMobileSnapLock]);

  const scrollToIndex = useCallback(
    (index: number) => {
      scrollToSection(index, reducedMotion ? 'auto' : 'smooth');
    },
    [reducedMotion, scrollToSection],
  );

  useEffect(() => {
    if (!alphaExpanded || !isMobile) {
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
  }, [alphaExpanded, getNearestSectionIndex, getSectionTop, isMobile, lockMobileSnap, reducedMotion, releaseMobileSnapLock, scrollToSection]);

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
      { root: null, threshold: thresholds },
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, [alphaExpanded]);

  useEffect(() => {
    if (!alphaExpanded) return;

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
  }, [activeIndex, alphaExpanded, scrollToIndex]);

  const handleAlphaClick = useCallback(() => {
    setAlphaExpanded(true);
    window.scrollTo({ top: 0, left: 0, behavior: reducedMotion ? 'auto' : 'smooth' });
  }, [reducedMotion]);

  const sectionProps = useMemo(
    () => ({ reducedMotion, scrollToIndex }),
    [reducedMotion, scrollToIndex],
  );

  const linkPrefix = getLinkPrefix();

  return (
    <main className="cass-landing-page">
      <div className="cass-background-stage">
        <BackgroundLayer />
      </div>

      <div className="cass-snap-container relative z-10">
        <section
          ref={setSectionRef(0)}
          data-index={0}
          id="section-0"
          className="cass-snap-section cass-landing-poster"
          aria-label="Cass landing page"
        >
          <div className="cass-landing-content">
            <motion.div
              initial={reducedMotion ? false : { opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.82, delay: 0.08, ease: EASE_OUT }}
              className="cass-landing-copy"
            >
              <h1 className="cass-landing-headline">
                <span className="cass-landing-headline-line cass-landing-headline-line--stack-mobile">
                  <span>find</span>
                  <span>your</span>
                </span>
                <span className="cass-landing-headline-line">person</span>
              </h1>
            </motion.div>

            <div className="cass-landing-footer">
              <nav className="cass-landing-links" aria-label="Homepage footer">
                <button
                  type="button"
                  onClick={handleAlphaClick}
                  aria-pressed={alphaExpanded}
                  className={cn('cass-landing-footer-link', alphaExpanded && 'cass-landing-footer-link--active')}
                >
                  Alpha
                </button>

                {LEGAL_LINKS.map((link) => (
                  <a key={link.href} href={`${linkPrefix}${link.href}`} className="cass-landing-footer-link">
                    {link.label}
                  </a>
                ))}
              </nav>
            </div>

            <motion.div
              initial={reducedMotion ? false : { opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.82, delay: 0.18, ease: EASE_OUT }}
              className="cass-landing-logo-anchor"
            >
              <span role="img" aria-label="Cass" className="cass-landing-logo" style={LOGO_MASK_STYLE} />
            </motion.div>
          </div>
        </section>

        {alphaExpanded && (
          <>
            <LandingSection index={1} onRef={setSectionRef(1)}>
              <IntroSectionContent isActive={activeIndex === 1} hasEntered={entered[1]} {...sectionProps} />
            </LandingSection>

            <LandingSection index={2} onRef={setSectionRef(2)}>
              <AlphaProgrammeSectionContent isActive={activeIndex === 2} hasEntered={entered[2]} {...sectionProps} />
            </LandingSection>

            <LandingSection index={3} onRef={setSectionRef(3)}>
              <WhatsInItForYouSectionContent isActive={activeIndex === 3} hasEntered={entered[3]} {...sectionProps} />
            </LandingSection>

            <LandingSection index={4} onRef={setSectionRef(4)}>
              <CommitmentSectionContent isActive={activeIndex === 4} hasEntered={entered[4]} {...sectionProps} />
            </LandingSection>

            <LandingSection index={5} onRef={setSectionRef(5)}>
              <ApplyNowSectionContent isActive={activeIndex === 5} hasEntered={entered[5]} {...sectionProps} />
            </LandingSection>
          </>
        )}
      </div>

      {alphaExpanded && activeIndex > 0 && (
        <ProgressDots activeIndex={activeIndex} onSelect={scrollToIndex} reducedMotion={reducedMotion} />
      )}

      <HeroPrompt
        isActive={alphaExpanded && activeIndex === 0}
        reducedMotion={reducedMotion}
        onNext={alphaExpanded ? () => scrollToIndex(1) : undefined}
      />
    </main>
  );
}
