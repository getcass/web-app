import { motion } from 'motion/react';
import { Heart, Lock, MessageSquare, Sparkles, ShieldCheck, Compass, CheckCircle2 } from 'lucide-react';
import { ProductShowcase } from './ProductShowcase';

type SectionContentProps = {
  isActive: boolean;
  hasEntered: boolean;
  reducedMotion: boolean;
  scrollToIndex: (index: number) => void;
};

const EASE_OUT = [0.22, 1, 0.36, 1] as const;
const WAITLIST_REVEAL_DELAY = 0.65;

function useEnterMotion({ isActive, hasEntered, reducedMotion }: Pick<SectionContentProps, 'isActive' | 'hasEntered' | 'reducedMotion'>) {
  const shouldShow = isActive || hasEntered;
  const enterY = reducedMotion ? 0 : 24;
  const transition = reducedMotion
    ? { duration: 0.12, ease: 'linear' as const }
    : { duration: 0.75, ease: EASE_OUT };

  return { shouldShow, enterY, transition };
}

// Section 1: Designed for Chemistry / The Cass Feed
export function ChemistrySectionContent({ isActive, hasEntered, reducedMotion }: SectionContentProps) {
  const { shouldShow, enterY, transition } = useEnterMotion({ isActive, hasEntered, reducedMotion });
  const container = {
    hidden: {},
    show: {
      transition: {
        staggerChildren: reducedMotion ? 0 : 0.08,
        delayChildren: reducedMotion ? 0 : 0.02,
      },
    },
  };
  const item = {
    hidden: { opacity: 0, y: enterY },
    show: { opacity: 1, y: 0, transition },
  };

  return (
    <motion.div
      initial="hidden"
      animate={shouldShow ? 'show' : 'hidden'}
      variants={container}
      className="cass-feature-copy mx-auto w-full max-w-6xl text-zinc-950"
    >
      <div className="max-w-2xl">
        <motion.div variants={item} className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-pink-500/10 bg-pink-500/5 text-xs font-semibold uppercase tracking-[0.18em] text-pink-700">
          <Heart className="h-3 w-3 fill-pink-600 stroke-pink-600" />
          <span>Feed</span>
        </motion.div>

        <motion.h2
          variants={item}
          className="mt-6 text-balance text-4xl font-semibold tracking-tight text-zinc-900 md:text-5xl lg:text-6xl"
        >
          Stop swiping, find your person
        </motion.h2>

        <motion.p variants={item} className="mt-5 text-pretty text-base leading-relaxed text-zinc-600 md:mt-6 md:text-xl">
          Most dating apps are designed to keep you swiping endlessly. Cass is built on a different premise: to help you meet the people you're most compatible with. We present a highly curated daily feed of matches, calculated across psychological dimensions.
        </motion.p>

        <motion.div variants={item} className="md:hidden">
          <ProductShowcase activeIndex={1} reducedMotion={reducedMotion} mode="mobile" className="cass-feature-mobile-showcase" />
        </motion.div>

        <motion.div variants={item} className="mt-8 space-y-4">
          <AboutBulletPoint
            icon={<Compass className="h-5 w-5 text-pink-600" />}
            title="Zero Swiping Mechanic"
            description="No infinite scroll or gamification. We focus your attention on people who actually make sense for you."
          />
          <AboutBulletPoint
            icon={<ShieldCheck className="h-5 w-5 text-pink-600" />}
            title="Screened Community"
            description="Referrals and active verifications ensure a trusted network of high-intent people."
          />
        </motion.div>
      </div>
    </motion.div>
  );
}

// Section 2: Deep Compatibility & Calibration / Cass Labs
export function CompatibilitySectionContent({ isActive, hasEntered, reducedMotion }: SectionContentProps) {
  const { shouldShow, enterY, transition } = useEnterMotion({ isActive, hasEntered, reducedMotion });
  const container = {
    hidden: {},
    show: {
      transition: {
        staggerChildren: reducedMotion ? 0 : 0.08,
        delayChildren: reducedMotion ? 0 : 0.02,
      },
    },
  };
  const item = {
    hidden: { opacity: 0, y: enterY },
    show: { opacity: 1, y: 0, transition },
  };

  return (
    <motion.div
      initial="hidden"
      animate={shouldShow ? 'show' : 'hidden'}
      variants={container}
      className="cass-feature-copy mx-auto w-full max-w-6xl text-zinc-950"
    >
      <div className="max-w-2xl">
        <motion.div variants={item} className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-purple-500/10 bg-purple-500/5 text-xs font-semibold uppercase tracking-[0.18em] text-purple-700">
          <Sparkles className="h-3 w-3 text-purple-600 fill-purple-200" />
          <span>Labs</span>
        </motion.div>

        <motion.h2
          variants={item}
          className="mt-6 text-balance text-4xl font-semibold tracking-tight text-zinc-900 md:text-5xl lg:text-6xl"
        >
          See how you overlap before chatting
        </motion.h2>

        <motion.p variants={item} className="mt-5 text-pretty text-base leading-relaxed text-zinc-600 md:mt-6 md:text-xl">
          Get real context from the start. Share how you think, communicate, and love. Complete bite-sized compatibility tiles in Cass Labs to unlock personality overlaps and daily habits with radar overlays and side-by-side matches.
        </motion.p>

        <motion.div variants={item} className="md:hidden">
          <ProductShowcase activeIndex={2} reducedMotion={reducedMotion} mode="mobile" className="cass-feature-mobile-showcase" />
        </motion.div>

        <motion.div variants={item} className="mt-8 space-y-4">
          <AboutBulletPoint
            icon={<CheckCircle2 className="h-5 w-5 text-purple-600" />}
            title="Love Languages & Traits Calibration"
            description="Map out how you give and receive love across key psychological dimensions to build a unique compatibility profile."
          />
          <AboutBulletPoint
            icon={<CheckCircle2 className="h-5 w-5 text-purple-600" />}
            title="Interactive Radar & Metrics Overlays"
            description="Visualize your relationship traits side-by-side to understand alignment and balance before sending the first message."
          />
        </motion.div>
      </div>
    </motion.div>
  );
}

// Section 3: Messaging on Cass / Chats
export function ChatsSectionContent({ isActive, hasEntered, reducedMotion }: SectionContentProps) {
  const { shouldShow, enterY, transition } = useEnterMotion({ isActive, hasEntered, reducedMotion });
  const container = {
    hidden: {},
    show: {
      transition: {
        staggerChildren: reducedMotion ? 0 : 0.08,
        delayChildren: reducedMotion ? 0 : 0.02,
      },
    },
  };
  const item = {
    hidden: { opacity: 0, y: enterY },
    show: { opacity: 1, y: 0, transition },
  };

  return (
    <motion.div
      initial="hidden"
      animate={shouldShow ? 'show' : 'hidden'}
      variants={container}
      className="cass-feature-copy mx-auto w-full max-w-6xl text-zinc-950"
    >
      <div className="max-w-2xl">
        <motion.div variants={item} className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#b11236]/10 bg-[#b11236]/5 text-xs font-semibold uppercase tracking-[0.18em] text-[#9f1239]">
          <MessageSquare className="h-3 w-3 text-[#b11236] fill-[#b11236]/10" />
          <span>Chats</span>
        </motion.div>

        <motion.h2
          variants={item}
          className="mt-6 text-balance text-4xl font-semibold tracking-tight text-zinc-900 md:text-5xl lg:text-6xl"
        >
          Message anyone, freely and safely
        </motion.h2>

        <motion.p variants={item} className="mt-5 text-pretty text-base leading-relaxed text-zinc-600 md:mt-6 md:text-xl">
          Message anyone you like. Your message will appear in your sent inbox and their received inbox. Once they reply, it'll become an active chat.
        </motion.p>

        <motion.div variants={item} className="md:hidden">
          <ProductShowcase activeIndex={3} reducedMotion={reducedMotion} mode="mobile" className="cass-feature-mobile-showcase cass-chats-mobile-showcase" />
        </motion.div>

        <motion.div variants={item} className="mt-8 space-y-4">
          <AboutBulletPoint
            icon={<CheckCircle2 className="h-5 w-5 text-[#b11236]" />}
            title="Start With Intent"
            description="Send a thoughtful opener, using their profile and compatibility cues to make it relevant."
          />
          <AboutBulletPoint
            icon={<CheckCircle2 className="h-5 w-5 text-[#b11236]" />}
            title="Clear Conversation Flow"
            description="Sent, received, and active chats stay separated so both people know where each conversation stands."
          />
        </motion.div>
      </div>
    </motion.div>
  );
}

// Section 4: Waitlist Signup / CTA Card
export function WaitlistCTASectionContent({ isActive, hasEntered, reducedMotion }: SectionContentProps) {
  const { shouldShow, enterY, transition } = useEnterMotion({ isActive, hasEntered, reducedMotion });
  const container = {
    hidden: {},
    show: {
      transition: {
        staggerChildren: reducedMotion ? 0 : 0.08,
        delayChildren: reducedMotion ? 0 : WAITLIST_REVEAL_DELAY,
      },
    },
  };
  const item = {
    hidden: { opacity: 0, y: enterY },
    show: { opacity: 1, y: 0, transition },
  };

  return (
    <motion.div
      initial="hidden"
      animate={shouldShow ? 'show' : 'hidden'}
      variants={container}
      className="mx-auto flex min-h-[min(620px,calc(var(--cass-shell-height)-8rem))] w-full max-w-4xl items-center justify-center text-zinc-950"
    >
      <motion.div
        variants={item}
        className="relative w-full overflow-hidden rounded-[2.75rem] border border-white/70 bg-white/30 p-8 text-center text-zinc-950 shadow-[0_32px_120px_rgba(119,92,134,0.18)] backdrop-blur-xl md:p-14 lg:px-16"
      >
        <div className="absolute inset-0 bg-[radial-gradient(900px_480px_at_50%_0%,rgba(255,184,213,0.18),transparent_64%),linear-gradient(135deg,rgba(244,239,255,0.42),rgba(255,247,250,0.38))] pointer-events-none" />

        <div className="relative z-10">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-[#211b25]/10 bg-white/70 text-[#211b25]/75 shadow-[0_18px_48px_rgba(119,92,134,0.16)]">
            <Lock className="h-6 w-6" aria-hidden="true" />
          </div>
          
          <p className="mt-8 text-xs font-semibold uppercase tracking-[0.25em] text-pink-600">London Beta</p>
          
          <h2 className="mt-4 text-balance text-3xl font-semibold tracking-tight text-zinc-950 md:text-5xl lg:text-6xl font-display">
            Join the waitlist
          </h2>
          
          <p className="mx-auto mt-6 max-w-xl text-pretty text-base leading-relaxed text-zinc-600 md:text-lg">
            Create an account directly in the mobile app to join the waitlist. Invitation codes are no longer required.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button
              type="button"
              disabled
              className="inline-flex cursor-not-allowed items-center gap-2 rounded-full bg-zinc-950/75 px-8 py-4 font-semibold text-white/80 shadow-[0_18px_48px_rgba(33,27,37,0.16)]"
            >
              <Lock className="h-4 w-4" aria-hidden="true" />
              <span>Download on TestFlight</span>
            </button>

            <button
              type="button"
              disabled
              className="inline-flex cursor-not-allowed items-center gap-2 rounded-full bg-zinc-950/75 px-8 py-4 font-semibold text-white/80 shadow-[0_18px_48px_rgba(33,27,37,0.16)]"
            >
              <Lock className="h-4 w-4" aria-hidden="true" />
              <span>Download on Google Play</span>
            </button>
          </div>
        </div>
      </motion.div>
      
      {/* Terms and Privacy Footer under waitlist card */}
      <motion.div 
        variants={item}
        className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-8 justify-center text-xs font-semibold tracking-[0.2em] uppercase text-zinc-400 hover:text-zinc-600 transition-colors pointer-events-auto"
      >
        <a href="terms/" className="hover:text-zinc-800 transition-colors">Terms</a>
        <a href="privacy/" className="hover:text-zinc-800 transition-colors">Privacy</a>
      </motion.div>
    </motion.div>
  );
}

// Bullet point component for about sections
function AboutBulletPoint({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="flex gap-4">
      <div className="flex-shrink-0 mt-1 flex h-9 w-9 items-center justify-center rounded-full border border-zinc-200 bg-zinc-50 text-zinc-700">
        {icon}
      </div>
      <div>
        <h4 className="text-base font-semibold text-zinc-900 tracking-tight">{title}</h4>
        <p className="mt-1 text-sm text-zinc-500 leading-relaxed">{description}</p>
      </div>
    </div>
  );
}
