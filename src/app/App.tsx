import { useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import backgroundImage from '../assets/cass_bg.png';
import { InvitationContent } from './components/InvitationContent';
import { Hero } from './components/Hero';
import { FloatingParticles } from './components/FloatingParticles';
import { GrainOverlay } from './components/GrainOverlay';
import { BackToTop } from './components/BackToTop';
import { LoadingScreen } from './components/LoadingScreen';

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [isLoaded, setIsLoaded] = useState(false);
  const { scrollYProgress } = useScroll();
  
  // Fade effect for background
  const opacity = useTransform(scrollYProgress, [0, 0.3], [1, 0.3]);

  useEffect(() => {
    // Simulate loading time for dramatic effect
    const timer = setTimeout(() => {
      setIsLoading(false);
      setTimeout(() => setIsLoaded(true), 100);
    }, 2000);
    
    return () => clearTimeout(timer);
  }, []);
  
  return (
    <div className="relative min-h-screen overflow-x-hidden bg-black">
      {/* Grain Overlay */}
      <GrainOverlay />
      
      {/* Animated Background */}
      <motion.div 
        className="fixed inset-0 z-0"
        style={{ opacity }}
      >
        <div className="absolute inset-0">
          <img 
            src={backgroundImage} 
            alt="" 
            className="w-full h-full object-cover object-center"
          />
        </div>
        <FloatingParticles />
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/90" />
      </motion.div>

      {/* Content */}
      <div className="relative z-10">
        <Hero isLoaded={isLoaded} />
        <InvitationContent isLoaded={isLoaded} />
      </div>

      {/* Back to Top Button */}
      <BackToTop />
      
      {/* Loading Screen */}
      <LoadingScreen isLoading={isLoading} />
    </div>
  );
}