import { useMemo } from 'react';
import backgroundImage from '../../assets/cass_bg.png';
import backgroundImageVertical from '../../assets/cass-bg-vertical.png';
import { cn } from './ui/utils';
import { GrainOverlay } from './GrainOverlay';

const NAV_LINK_CLASS =
  'rounded-full border border-white/12 bg-black/25 px-3 py-1.5 text-[11px] font-medium uppercase tracking-[0.18em] text-white/72 backdrop-blur-md transition-[background-color,color,border-color] duration-150 hover:border-white/22 hover:bg-black/35 hover:text-white focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white/15';

function BackgroundLayer() {
  const baseGradient = useMemo(
    () =>
      'bg-[radial-gradient(1200px_700px_at_20%_10%,rgba(255,255,255,0.08),transparent_60%),radial-gradient(900px_600px_at_75%_35%,rgba(205,215,255,0.06),transparent_64%)]',
    [],
  );

  return (
    <div className="absolute inset-0 overflow-hidden bg-[#050509]">
      <div className="absolute inset-0">
        <img
          src={backgroundImageVertical}
          alt=""
          className="h-full w-full object-cover object-top saturate-110 contrast-105 lg:hidden"
        />
        <img
          src={backgroundImage}
          alt=""
          className="hidden h-full w-full object-cover object-center saturate-110 contrast-105 lg:block"
        />
      </div>
      <div className={cn('absolute inset-0', baseGradient)} />
      <div className="absolute inset-0 bg-black" style={{ opacity: 0.12 }} />
    </div>
  );
}

export function LandingDeck() {
  return (
    <div className="relative h-[var(--cass-shell-height)] overflow-hidden bg-[#050509]">
      <BackgroundLayer />
      <GrainOverlay />

      <a
        href="private-alpha/"
        className={cn(
          'fixed left-[calc(1rem+env(safe-area-inset-left))] top-[calc(1rem+env(safe-area-inset-top))] z-50',
          NAV_LINK_CLASS,
        )}
      >
        Alpha
      </a>

      <a
        href="privacy/"
        className={cn(
          'fixed right-[calc(1rem+env(safe-area-inset-right))] top-[calc(1rem+env(safe-area-inset-top))] z-50',
          NAV_LINK_CLASS,
        )}
      >
        Privacy
      </a>
    </div>
  );
}
