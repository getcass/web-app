import { motion } from 'motion/react';
import {
  CheckCircle2,
  Compass,
  Heart,
  Lock,
  MessageSquare,
  Shield,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import safetyNotVerifiedIcon from '../../assets/safety-not-verified.png';
import safetyTrustedIcon from '../../assets/safety-trusted.png';
import safetyVerifiedIcon from '../../assets/safety-verified.png';
import { ProductShowcase } from './ProductShowcase';

type SectionContentProps = {
  isActive: boolean;
  hasEntered: boolean;
  reducedMotion: boolean;
  scrollToIndex: (index: number) => void;
};

const EASE_OUT = [0.22, 1, 0.36, 1] as const;
const WAITLIST_REVEAL_DELAY = 0.65;

const SAFETY_LEVELS = [
  {
    step: '01',
    title: 'Approved',
    description: "All accounts complete SMS verification and a liveness check, so we know you're real.",
    tone: 'neutral',
    imageSrc: safetyNotVerifiedIcon,
  },
  {
    step: '02',
    title: 'Verified',
    description: <>Verified means you completed ID verification <strong>or</strong> were referred by an existing user.</>,
    tone: 'pink',
    imageSrc: safetyVerifiedIcon,
  },
  {
    step: '03',
    title: 'Trusted',
    description: <>Trusted means you completed ID verification <strong>and</strong> were referred by an existing user.</>,
    tone: 'purple',
    imageSrc: safetyTrustedIcon,
  },
] as const;

function useEnterMotion({ isActive, hasEntered, reducedMotion }: Pick<SectionContentProps, 'isActive' | 'hasEntered' | 'reducedMotion'>) {
  const shouldShow = isActive || hasEntered;
  const enterY = reducedMotion ? 0 : 24;
  const transition = reducedMotion
    ? { duration: 0.12, ease: 'linear' as const }
    : { duration: 0.75, ease: EASE_OUT };

  return { shouldShow, enterY, transition };
}

// Section 1: Safety / Trust
export function SafetySectionContent({ isActive, hasEntered, reducedMotion }: SectionContentProps) {
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
      className="cass-feature-copy cass-safety-feature-copy mx-auto w-full max-w-6xl text-zinc-950"
    >
      <div className="cass-safety-section-inner">
        <div className="cass-safety-section-header">
          <div>
            <motion.div variants={item} className="inline-flex items-center gap-2 rounded-full border border-zinc-950/10 bg-white/50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-zinc-700 shadow-[0_14px_40px_rgba(33,27,37,0.06)] backdrop-blur-md">
              <Shield className="h-3 w-3 text-zinc-700" />
              <span>Trust</span>
            </motion.div>

            <motion.h2
              variants={item}
              className="mt-6 text-balance text-4xl font-semibold tracking-tight text-zinc-900 md:text-5xl lg:text-6xl"
            >
              Safety first
            </motion.h2>

            <motion.p variants={item} className="mt-5 max-w-2xl text-pretty text-base leading-relaxed text-zinc-600 md:mt-6 md:text-xl">
              We're building a genuine community of trusted users looking to find their person. Cass uses verification tiers based on ID checks and referrals from existing users.
            </motion.p>
          </div>
        </div>

        <motion.div variants={item} className="cass-safety-flow-heading">
          <div className="cass-safety-flow-topline">
            <span>Verification levels</span>
          </div>
        </motion.div>

        <motion.div variants={item}>
          <SafetyVerificationFlow shouldShow={shouldShow} reducedMotion={reducedMotion} />
        </motion.div>

        <motion.div variants={item} className="cass-safety-assurance" aria-label="Safety operations">
          <p className="cass-safety-assurance-label">Intentional AI</p>
          <p className="cass-safety-assurance-copy">
            We use AI to detect bad actors, not to make dating decisions for you. Our advanced safety system works around the clock to help identify fake accounts, scams, and harmful behaviour before they become your problem.
          </p>
        </motion.div>
      </div>
    </motion.div>
  );
}

function SafetyVerificationFlow({ shouldShow, reducedMotion }: { shouldShow: boolean; reducedMotion: boolean }) {
  const stepTransition = (index: number) =>
    reducedMotion
      ? { duration: 0.14, ease: 'linear' as const }
      : { duration: 0.64, delay: 0.2 + index * 0.14, ease: EASE_OUT };

  return (
    <div className="cass-safety-flow" aria-label="Verification levels">
      <div className="cass-safety-flow-stage">
        {SAFETY_LEVELS.map(({ step, title, description, tone, imageSrc }, index) => (
          <motion.div
            key={title}
            className={`cass-safety-step cass-safety-step--${tone}`}
            initial={false}
            animate={{
              opacity: shouldShow ? 1 : 0,
              y: reducedMotion ? 0 : shouldShow ? 0 : 18,
              scale: reducedMotion ? 1 : shouldShow ? 1 : 0.97,
            }}
            transition={stepTransition(index)}
          >
            <div className="cass-safety-step-marker" aria-hidden="true">
              <span className="cass-safety-step-pulse" />
              <span className="cass-safety-step-icon">
                <img src={imageSrc} alt="" className="cass-safety-step-icon-image" draggable="false" />
              </span>
            </div>

            <div className="cass-safety-step-copy">
              <span className="cass-safety-step-number">{step}</span>
              <h3>{title}</h3>
              <p className="cass-safety-step-description">{description}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

// Section 2: Designed for Chemistry / The Cass Feed
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
          No more swiping
        </motion.h2>

        <motion.p variants={item} className="mt-5 text-pretty text-base leading-relaxed text-zinc-600 md:mt-6 md:text-xl">
          Cass shows you a small set of people we think you're most compatibile with, and your feed refreshes daily with new users.
        </motion.p>

        <motion.div variants={item} className="md:hidden">
          <ProductShowcase activeIndex={1} reducedMotion={reducedMotion} mode="mobile" className="cass-feature-mobile-showcase" />
        </motion.div>

        <motion.div variants={item} className="mt-8 space-y-4">
          <AboutBulletPoint
            icon={<Compass className="h-5 w-5 text-pink-600" />}
            title="Less noise, more meaning"
            description="A focused daily feed helps you spend more attention on people who feel worth meeting."
          />
          <AboutBulletPoint
            icon={<ShieldCheck className="h-5 w-5 text-pink-600" />}
            title="A transparent algorithm"
            description="Chemistry scores show you how compatible you are with someone and why we think that."
          />
        </motion.div>
      </div>
    </motion.div>
  );
}

// Section 3: Deep Compatibility & Calibration / Cass Labs
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
           Match based on compatibility
        </motion.h2>

        <motion.p variants={item} className="mt-5 text-pretty text-base leading-relaxed text-zinc-600 md:mt-6 md:text-xl">
          See where you naturally overlap with other users before you start a conversation.
        </motion.p>

        <motion.div variants={item} className="md:hidden">
          <ProductShowcase activeIndex={2} reducedMotion={reducedMotion} mode="mobile" className="cass-feature-mobile-showcase" />
        </motion.div>

        <motion.div variants={item} className="mt-8 space-y-4">
          <AboutBulletPoint
            icon={<CheckCircle2 className="h-5 w-5 text-purple-600" />}
            title="Signal building"
            description="Answer questions about how you think, connect, and show care, so we can improve your match quality."
          />
          <AboutBulletPoint
            icon={<CheckCircle2 className="h-5 w-5 text-purple-600" />}
            title="Natural Overlaps"
            description="Explore side-by-side comparisons and visualisations that show what is driving your chemistry score."
          />
        </motion.div>
      </div>
    </motion.div>
  );
}

// Section 4: Messaging on Cass / Chats
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
          Choose who to message
        </motion.h2>

        <motion.p variants={item} className="mt-5 text-pretty text-base leading-relaxed text-zinc-600 md:mt-6 md:text-xl">
          Send an opener when something feels right. New messages stay separate until both people choose to keep talking.
        </motion.p>

        <motion.div variants={item} className="md:hidden">
          <ProductShowcase activeIndex={3} reducedMotion={reducedMotion} mode="mobile" className="cass-feature-mobile-showcase cass-chats-mobile-showcase" />
        </motion.div>

        <motion.div variants={item} className="mt-8 space-y-4">
          <AboutBulletPoint
            icon={<CheckCircle2 className="h-5 w-5 text-[#b11236]" />}
            title="Open With Context"
            description="Use their profile and compatibility cues to write something personal from the start."
          />
          <AboutBulletPoint
            icon={<CheckCircle2 className="h-5 w-5 text-[#b11236]" />}
            title="Clear Conversation Flow"
            description="Sent messages, requests, and active chats stay organized so both people know where things stand."
          />
        </motion.div>
      </div>
    </motion.div>
  );
}

// Section 5: Waitlist Signup / CTA Card
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
