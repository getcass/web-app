import { useEffect, useState } from 'react';
import backgroundImage from '../assets/cass_bg.png';
import backgroundImageVertical from '../assets/cass-bg-vertical.png';
import { InvitationContent } from './components/InvitationContent';
import { Hero } from './components/Hero';
import { FloatingParticles } from './components/FloatingParticles';
import { GrainOverlay } from './components/GrainOverlay';
import { BackToTop } from './components/BackToTop';

function PrivateAlphaPage() {
  const [isHeroLoaded, setIsHeroLoaded] = useState(false);

  useEffect(() => {
    // Ensure we start at the top so the background is the initial screen.
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' as ScrollBehavior });

    // Trigger the scroll prompt fade-in on mount.
    const raf = requestAnimationFrame(() => setIsHeroLoaded(true));
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div className="relative z-10">
      <Hero isLoaded={isHeroLoaded} />
      <InvitationContent isLoaded={true} />
      <BackToTop />
    </div>
  );
}

export default function App() {
  const overlayClassName = 'bg-gradient-to-b from-black/10 via-transparent to-black/35';
  
  return (
    <div className="relative min-h-[100dvh] overflow-x-hidden">
      {/* Grain Overlay */}
      <GrainOverlay />
      
      {/* Animated Background */}
      <div className="fixed inset-0 z-0 overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={backgroundImageVertical}
            alt=""
            className="w-full h-full object-cover object-top saturate-125 contrast-105 md:hidden"
          />
          <img
            src={backgroundImage}
            alt=""
            className="w-full h-full object-cover object-center saturate-125 contrast-105 hidden md:block"
          />
        </div>
        <FloatingParticles />
        {/* Gradient Overlay */}
        <div className={"absolute inset-0 " + overlayClassName} />
      </div>
      <PrivateAlphaPage />
    </div>
  );
}
