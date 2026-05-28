import type { CSSProperties, ReactNode } from 'react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { motion } from 'motion/react';
import findYourPersonLandscapeUrl from '../../assets/find-your-person-landscape.png';
import findYourPersonPortraitUrl from '../../assets/find-your-person-portrait.png';
import logoUrl from '../../assets/logo.svg';
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion';
import {
  ChatsSectionContent,
  ChemistrySectionContent,
  CompatibilitySectionContent,
  WaitlistCTASectionContent,
} from './AboutContent';
import { ProductShowcase } from './ProductShowcase';
import { cn } from './ui/utils';

const SECTION_COUNT = 5;
const EASE_OUT = [0.22, 1, 0.36, 1] as const;

type LandingDeckProps = {};

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
  backgroundColor: '#211b25',
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
              index === SECTION_COUNT - 1 ? 'justify-start' : 'justify-start md:justify-center',
            )}
          >
            <div
              className={cn(
                'cass-section-scroll min-h-0 md:max-h-full md:overflow-y-auto w-full',
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
      className="fixed bottom-[calc(1rem+env(safe-area-inset-bottom))] left-1/2 z-50 hidden -translate-x-1/2 flex-row items-center gap-3 md:bottom-auto md:left-auto md:right-[calc(1rem+env(safe-area-inset-right))] md:top-1/2 md:flex md:-translate-x-0 md:-translate-y-1/2 md:flex-col"
      aria-label="Section progress"
    >
      {Array.from({ length: SECTION_COUNT }).map((_, index) => {
        const isActive = index === activeIndex;
        // In sections 1-5 background is white (light section).
        const isLightSection = activeIndex >= 1;
        return (
          <button
            key={index}
            type="button"
            onClick={() => onSelect(index)}
            className={cn(
              'relative h-2.5 w-2.5 rounded-full transition-[transform,background-color,box-shadow] duration-200',
              'focus-visible:outline-none focus-visible:ring-4',
              isLightSection
                ? 'bg-black/15 hover:bg-black/35 focus-visible:ring-black/10'
                : 'bg-white/25 hover:bg-white/50 focus-visible:ring-white/20',
              isLightSection && isActive && 'bg-zinc-800 scale-125 shadow-[0_0_0_3px_rgba(0,0,0,0.08)]',
              !isLightSection && isActive && 'bg-white/80 scale-125 shadow-[0_0_0_3px_rgba(255,255,255,0.14)]',
              reducedMotion && isActive && 'scale-100',
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
  const eased = reducedMotion ? t : t * t * (3 - 2 * t);
  const heroWashOpacity = 1 - 0.38 * eased;
  const paperOpacity = 0.72 + 0.28 * eased;

  return (
    <div className="cass-screen-bleed absolute overflow-hidden bg-[#fbf8fb] transition-colors duration-500">
      <div className="absolute inset-0 bg-[#fbfaf8]" style={{ opacity: paperOpacity, willChange: 'opacity' }} />
      <div className="absolute inset-0 cass-page-wash" style={{ opacity: heroWashOpacity, willChange: 'opacity' }} />
      <div className="absolute inset-0 cass-page-grain" />
    </div>
  );
}

type HeroPromptProps = {
  isActive: boolean;
  reducedMotion: boolean;
  onNext?: () => void;
};

function HeroPrompt({ isActive, reducedMotion, onNext }: HeroPromptProps) {
  const visibleTransition = reducedMotion
    ? { duration: 0.12, ease: 'linear' as const }
    : { duration: 0.55, ease: EASE_OUT };
  const hiddenTransition = { duration: reducedMotion ? 0.08 : 0.12, ease: 'linear' as const };

  return (
    <motion.button
      type="button"
      onClick={onNext}
      disabled={!isActive}
      aria-hidden={!isActive}
      initial={{ opacity: 0, y: reducedMotion ? 0 : 10 }}
      animate={{ opacity: isActive ? 1 : 0, y: isActive || reducedMotion ? 0 : 10 }}
      transition={isActive ? visibleTransition : hiddenTransition}
      className="cass-hero-prompt-button"
      style={{ pointerEvents: isActive ? 'auto' : 'none' }}
    >
      <span>Explore Cass</span>
    </motion.button>
  );
}

function FindYourPersonImageSection() {
  return (
    <picture className="cass-find-person-picture">
      <source media="(min-width: 768px)" srcSet={findYourPersonLandscapeUrl} />
      <img
        src={findYourPersonPortraitUrl}
        alt="Find your person"
        className="cass-find-person-image"
        draggable="false"
      />
    </picture>
  );
}

function getLinkPrefix() {
  return '';
}

export function LandingDeck() {
  const reducedMotion = usePrefersReducedMotion();
  const sectionRefs = useRef<(HTMLElement | null)[]>(Array.from({ length: SECTION_COUNT }).fill(null));

  const [activeIndex, setActiveIndex] = useState(0);
  const [showcaseIndex, setShowcaseIndex] = useState(0);
  const [isAtPageTop, setIsAtPageTop] = useState(true);
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
    document.body.classList.add('bg-white-theme');
    document.documentElement.classList.add('bg-white-theme');
    return () => {
      document.body.classList.remove('bg-white-theme');
      document.documentElement.classList.remove('bg-white-theme');
    };
  }, [activeIndex]);

  useEffect(() => {
    if (window.location.hash) {
      const targetId = window.location.hash.slice(1);
      const raf = window.requestAnimationFrame(() => {
        document.getElementById(targetId)?.scrollIntoView({ block: 'start', inline: 'nearest', behavior: 'auto' });
      });

      return () => window.cancelAnimationFrame(raf);
    }

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

  const scrollToSection = useCallback((index: number, behavior: ScrollBehavior) => {
    const top = getSectionTop(index);
    if (top === null) return;
    window.scrollTo({ top: Math.max(0, top), left: 0, behavior });
  }, [getSectionTop]);

  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      const height = window.innerHeight || document.documentElement.clientHeight || 1;
      const scrollY = Math.max(0, window.scrollY);
      const next = Math.max(0, Math.min(1, scrollY / height));
      const nextIsAtPageTop = scrollY === 0;
      const section1Top = sectionRefs.current[1]?.getBoundingClientRect().top ?? height;
      const section2Top = sectionRefs.current[2]?.getBoundingClientRect().top ?? height * 2;
      const section3Top = sectionRefs.current[3]?.getBoundingClientRect().top ?? height * 3;
      let nextShowcaseIndex = 0;
      if (section3Top < height * 0.5) {
        nextShowcaseIndex = 3;
      } else if (section2Top < height * 0.5) {
        nextShowcaseIndex = 2;
      } else if (section1Top < height) {
        nextShowcaseIndex = 1;
      }
      setScrollProgress(next);
      setIsAtPageTop((current) => (current === nextIsAtPageTop ? current : nextIsAtPageTop));
      setShowcaseIndex((current) => (current === nextShowcaseIndex ? current : nextShowcaseIndex));
    };

    const onScroll = () => {
      if (raf) return;
      raf = window.requestAnimationFrame(update);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    update();

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
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
    () => ({ reducedMotion, scrollToIndex }),
    [reducedMotion, scrollToIndex],
  );

  const linkPrefix = getLinkPrefix();

  return (
    <main className="cass-landing-page">
      <div className="cass-background-stage">
        <BackgroundLayer scrollProgress={scrollProgress} reducedMotion={reducedMotion} />
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

            <div
              className={cn('cass-landing-footer', !isAtPageTop && 'cass-landing-footer--hidden')}
              aria-hidden={!isAtPageTop}
            >
              <nav className="cass-landing-links" aria-label="Homepage footer">
                {LEGAL_LINKS.map((link) => (
                  <a
                    key={link.href}
                    href={`${linkPrefix}${link.href}`}
                    className="cass-landing-footer-link"
                    tabIndex={isAtPageTop ? undefined : -1}
                  >
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

        <div className="cass-feature-showcase-boundary">
          <div className="cass-feature-showcase-sticky">
            <ProductShowcase activeIndex={showcaseIndex} reducedMotion={reducedMotion} mode="desktop" />
          </div>

          <div className="cass-feature-showcase-content">
            <LandingSection index={1} onRef={setSectionRef(1)}>
              <ChemistrySectionContent isActive={activeIndex === 1} hasEntered={entered[1]} {...sectionProps} />
            </LandingSection>

            <LandingSection index={2} onRef={setSectionRef(2)}>
              <CompatibilitySectionContent isActive={activeIndex === 2} hasEntered={entered[2]} {...sectionProps} />
            </LandingSection>

            <LandingSection index={3} onRef={setSectionRef(3)}>
              <ChatsSectionContent isActive={activeIndex === 3} hasEntered={entered[3]} {...sectionProps} />
            </LandingSection>
          </div>
        </div>

        <section
          ref={setSectionRef(4)}
          data-index={4}
          id="section-4"
          className="cass-snap-section cass-find-person-section"
          aria-label="Find your person and join the waitlist"
        >
          <FindYourPersonImageSection />
          <div className="cass-find-person-waitlist-overlay">
            <WaitlistCTASectionContent isActive={activeIndex === 4} hasEntered={entered[4]} {...sectionProps} />
          </div>
        </section>
      </div>

      {activeIndex > 0 && activeIndex < SECTION_COUNT - 1 && (
        <ProgressDots activeIndex={activeIndex} onSelect={scrollToIndex} reducedMotion={reducedMotion} />
      )}

      <HeroPrompt
        isActive={activeIndex === 0 && isAtPageTop}
        reducedMotion={reducedMotion}
        onNext={() => scrollToIndex(1)}
      />
    </main>
  );
}
