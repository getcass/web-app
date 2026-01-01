import { useEffect, useState } from 'react';
import { Link, Route, Routes, useLocation } from 'react-router-dom';
import { motion } from 'motion/react';
import backgroundImage from '../assets/cass_bg.png';
import { InvitationContent } from './components/InvitationContent';
import { Hero } from './components/Hero';
import { FloatingParticles } from './components/FloatingParticles';
import { GrainOverlay } from './components/GrainOverlay';
import { BackToTop } from './components/BackToTop';

function TopNav() {
  return (
    <div className="pointer-events-none fixed inset-x-0 top-0 z-20">
      <div className="pointer-events-auto flex items-center justify-between px-6 py-5">
        <Link
          to="/"
          className="text-white/70 hover:text-white text-xs tracking-wide"
        >
          Home
        </Link>

        <Link
          to="/private-alpha"
          className="text-white/70 hover:text-white text-xs tracking-wide"
        >
          Private Alpha
        </Link>
      </div>
    </div>
  );
}

function HomePage() {
  return <div className="relative z-10" />;
}

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
    <div className="relative min-h-screen overflow-x-hidden bg-black">
      {/* Grain Overlay */}
      <GrainOverlay />
      
      {/* Animated Background */}
      <motion.div className="fixed inset-0 z-0">
        <div className="absolute inset-0">
          <img 
            src={backgroundImage} 
            alt="" 
            className="w-full h-full object-cover object-center saturate-125 contrast-105"
          />
        </div>
        <FloatingParticles />
        {/* Gradient Overlay */}
        <div className={"absolute inset-0 " + overlayClassName} />
      </motion.div>

      <TopNav />

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/private-alpha" element={<PrivateAlphaPage />} />
      </Routes>
    </div>
  );
}