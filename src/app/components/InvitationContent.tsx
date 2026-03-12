import { motion } from 'motion/react';
import { Activity, Bug, Calendar, Gift, Heart, Lock, MessageSquare, Smartphone, Trophy, User } from 'lucide-react';
import feedScreenshot from '../../assets/feed.jpeg';
import labsScreenshot from '../../assets/labs.jpeg';
import profileScreenshot from '../../assets/profile.jpeg';
import { SignUpForm } from './SignUpForm';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { cn } from './ui/utils';

type SectionContentProps = {
  isActive: boolean;
  hasEntered: boolean;
  reducedMotion: boolean;
  scrollToIndex: (index: number) => void;
};

const EASE_OUT = [0.22, 1, 0.36, 1] as const;

const WELCOME_VALUE_DETAILS = {
  Chemistry:
    "Through Cass Labs quizzes, we go deeper than surface-level preferences to uncover how you think, feel, and connect with others. These insights help us measure genuine compatibility and surface the people you're most likely to click with. This means you're meeting people who actually make sense for you and not endlessly swiping. In fact - there is no swiping mechanic in Cass.",
  Safety:
    "Cass uses a thorough verification process alongside a referral system that encourages genuine users and discourages bad actors. The result is a community built on trust, where you can feel confident the people you're talking to are real and here for the right reasons.",
  Alignment:
    "Most dating apps are designed to keep you swiping for as long as possible. Cass isn't. Our incentives are aligned with yours: to help you meet the right person and move on from the app. Nothing is locked behind paywalls. We believe finding the right connection shouldn't depend on how much you're willing to spend.",
} as const;

const WELCOME_SCREENSHOTS = [
  { src: feedScreenshot, alt: 'Cass feed screenshot' },
  { src: profileScreenshot, alt: 'Cass profile screenshot' },
  { src: labsScreenshot, alt: 'Cass Labs screenshot' },
] as const;

function useEnterMotion({ isActive, hasEntered, reducedMotion }: Pick<SectionContentProps, 'isActive' | 'hasEntered' | 'reducedMotion'>) {
  const shouldShow = isActive || hasEntered;
  const enterY = reducedMotion ? 0 : 18;
  const transition = reducedMotion
    ? { duration: 0.12, ease: 'linear' as const }
    : { duration: 0.65, ease: EASE_OUT };

  return { shouldShow, enterY, transition };
}

export function IntroSectionContent({ isActive, hasEntered, reducedMotion }: SectionContentProps) {
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
      className="mx-auto w-full max-w-6xl"
    >
      <motion.h2
        variants={item}
        className="text-balance text-4xl font-semibold tracking-tight text-white drop-shadow-[0_18px_48px_rgba(0,0,0,0.55)] md:text-6xl"
      >
        Welcome
      </motion.h2>

      <motion.p variants={item} className="mt-6 max-w-3xl text-pretty text-lg leading-relaxed text-white/75 md:text-xl">
        Hello! I’m Zain, the founder of Cass. Cass is an app designed to help you find your person. 
        It does things differently from traditional dating apps in three key ways:
      </motion.p>

      <motion.div variants={item}>
        <div className="mt-10 grid gap-10 sm:grid-cols-3 md:gap-16">
          <FeatureRow
            icon={<Heart className="h-4 w-4" />}
            label="Chemistry"
            title="We match based on compatibility"
            infoBody={WELCOME_VALUE_DETAILS.Chemistry}
          />
          <FeatureRow
            icon={<Lock className="h-4 w-4" />}
            label="Safety"
            title="We screen for genuine users"
            infoBody={WELCOME_VALUE_DETAILS.Safety}
          />
          <FeatureRow
            icon={<User className="h-4 w-4" />}
            label="Alignment"
            title="We want the same outcomes you do"
            infoBody={WELCOME_VALUE_DETAILS.Alignment}
          />
        </div>
      </motion.div>
    </motion.div>
  );
}

export function WelcomeScreenshotsSectionContent({ isActive, hasEntered, reducedMotion }: SectionContentProps) {
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
      className="mx-auto flex w-full max-w-6xl items-center"
    >
      <motion.div variants={item} className="w-full">
        <div className="-mx-6 flex snap-x snap-mandatory gap-4 overflow-x-auto px-6 pb-4 md:mx-0 md:grid md:grid-cols-3 md:overflow-visible md:px-0 md:pb-0">
          {WELCOME_SCREENSHOTS.map((screenshot) => (
            <div
              key={screenshot.alt}
              className="w-[78vw] max-w-[19rem] shrink-0 snap-center md:w-full md:max-w-none"
            >
              <div className="overflow-hidden rounded-[2rem] border border-white/10 bg-white/5 shadow-[0_24px_60px_rgba(0,0,0,0.35)]">
                <img
                  src={screenshot.src}
                  alt={screenshot.alt}
                  loading="lazy"
                  decoding="async"
                  className="h-[26rem] w-full object-cover object-top md:h-[30rem]"
                />
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}

export function AlphaProgrammeSectionContent({ isActive, hasEntered, reducedMotion }: SectionContentProps) {
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
      className="mx-auto w-full max-w-6xl"
    >
      <motion.h2
        variants={item}
        className="text-balance text-4xl font-semibold tracking-tight text-white drop-shadow-[0_18px_48px_rgba(0,0,0,0.55)] md:text-6xl"
      >
        The programme
      </motion.h2>

      <motion.p variants={item} className="mt-6 max-w-3xl text-pretty text-lg leading-relaxed text-white/75 md:text-xl">
        As an alpha tester, you’ll help us shape the very first iteration of the app. Your feedback will directly influence the UX and feature set before we launch.
      </motion.p>

      <motion.dl variants={item} className="mt-10 grid gap-6 sm:grid-cols-3">
        <StatItem icon={<Calendar className="h-4 w-4" />} label="Duration" value="1 week" />
        <StatItem icon={<Smartphone className="h-4 w-4" />} label="Platform" value="iOS" />
        <StatItem icon={<MessageSquare className="h-4 w-4" />} label="Feedback" value="2 short forms (15 mins)" />
      </motion.dl>
    </motion.div>
  );
}

export function WhatsInItForYouSectionContent({ isActive, hasEntered, reducedMotion }: SectionContentProps) {
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
      className="mx-auto w-full max-w-6xl"
    >
      <motion.h2
        variants={item}
        className="text-balance text-4xl font-semibold tracking-tight text-white drop-shadow-[0_18px_48px_rgba(0,0,0,0.55)] md:text-6xl"
      >
        What’s In It For You?
      </motion.h2>

      <motion.p variants={item} className="mt-6 max-w-3xl text-pretty text-lg leading-relaxed text-white/75 md:text-xl">
        We value your time and your insights, and on completion, you’ll get a couple of perks alongside early access:
      </motion.p>

      <motion.div variants={item} className="mt-10 grid gap-8 md:grid-cols-2">
        <BenefitItem
          icon={<Trophy className="h-5 w-5" />}
          title="Founding member status"
          description='A permanent “Alpha" verification badge post‑launch, making your profile more visible.'
        />
        <BenefitItem
          icon={<Gift className="h-5 w-5" />}
          title="Exclusive merch"
          description='A limited‑edition Cass tote bag delivered to you.'
        />
      </motion.div>
    </motion.div>
  );
}

export function CommitmentSectionContent({ isActive, hasEntered, reducedMotion }: SectionContentProps) {
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
      className="mx-auto w-full max-w-6xl"
    >
      <motion.h2
        variants={item}
        className="text-balance text-4xl font-semibold tracking-tight text-white drop-shadow-[0_18px_48px_rgba(0,0,0,0.55)] md:text-6xl"
      >
        The Commitment
      </motion.h2>

      <motion.p variants={item} className="mt-6 max-w-3xl text-pretty text-lg leading-relaxed text-white/75 md:text-xl">
        We ask for three simple things from you.
      </motion.p>

      <motion.ol variants={item} className="mt-10 space-y-6">
        <CommitmentRow
          icon={<Activity className="h-5 w-5" />}
          title="Use it daily"
          description="Open the app at least once a day during the test."
        />
        <CommitmentRow
          icon={<MessageSquare className="h-5 w-5" />}
          title="Share honest feedback"
          description="Complete two quick surveys about your experience."
        />
        <CommitmentRow
          icon={<Bug className="h-5 w-5" />}
          title="Report the weird moments"
          description="Flag bugs, glitches, and anything that feels off."
        />
      </motion.ol>
    </motion.div>
  );
}

export function ApplyNowSectionContent({ isActive, hasEntered, reducedMotion }: SectionContentProps) {
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
      className="mx-auto w-full max-w-6xl"
    >
      <motion.h2
        variants={item}
        className="text-balance text-4xl font-semibold tracking-tight text-white drop-shadow-[0_18px_48px_rgba(0,0,0,0.55)] md:text-6xl"
      >
        Apply Now
      </motion.h2>

      <motion.div variants={item} className="mt-10">
        <SignUpForm />
      </motion.div>

      <motion.div variants={item} className="mt-10 text-center">
        <p className="text-white/80">
          <span className="font-semibold text-white">Zain</span>
          <br />
          <span className="text-white/60">Founder, Cass</span>
        </p>
      </motion.div>
    </motion.div>
  );
}

function FeatureRow({
  icon,
  label,
  title,
  infoBody,
  className,
}: {
  icon: React.ReactNode;
  label: string;
  title: string;
  infoBody?: string;
  className?: string;
}) {
  return (
    <div className={cn('border-l border-white/10 pl-5', className)}>
      <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-[0.22em] text-white/55">
        <span className="text-white/60">{icon}</span>
        <span>{label}</span>
        {infoBody ? (
          <Dialog>
            <DialogTrigger asChild>
              <button
                type="button"
                aria-label={`Learn more about ${label}`}
                className="inline-flex h-5 w-5 items-center justify-center rounded-full border border-white/20 bg-white/5 text-[10px] font-semibold lowercase tracking-normal text-white/80 transition hover:border-white/40 hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
              >
                i
              </button>
            </DialogTrigger>
            <DialogContent className="max-h-[85vh] overflow-y-auto border-white/10 bg-[#101010] text-white shadow-[0_24px_80px_rgba(0,0,0,0.55)] sm:max-w-xl">
              <DialogHeader className="pr-8 text-left">
                <DialogTitle className="text-2xl tracking-tight text-white">{label}</DialogTitle>
                <DialogDescription className="text-base leading-relaxed text-white/70">
                  {infoBody}
                </DialogDescription>
              </DialogHeader>
            </DialogContent>
          </Dialog>
        ) : null}
      </div>
      <div className="mt-3 text-2xl font-semibold tracking-tight text-white md:text-3xl">{title}</div>
    </div>
  );
}

function StatItem({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="border-l border-white/10 pl-5">
      <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-[0.22em] text-white/55">
        <span className="text-white/60">{icon}</span>
        {label}
      </div>
      <div className="mt-3 text-2xl font-semibold tracking-tight text-white md:text-3xl">{value}</div>
    </div>
  );
}

function BenefitItem({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="border-l border-white/10 pl-6">
      <div className="flex items-center gap-3 text-white">
        <span className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/70">
          {icon}
        </span>
        <h4 className="text-xl font-semibold tracking-tight">{title}</h4>
      </div>
      <p className="mt-4 text-lg leading-relaxed text-white/70">{description}</p>
    </div>
  );
}

function CommitmentRow({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <li className="border-l border-white/10 pl-6">
      <div className="flex items-start gap-4">
        <div className="mt-0.5 flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/70">
          {icon}
        </div>
        <div className="flex-1">
          <p className="text-xl font-semibold tracking-tight text-white">{title}</p>
          <p className="mt-2 text-lg leading-relaxed text-white/70">{description}</p>
        </div>
      </div>
    </li>
  );
}
