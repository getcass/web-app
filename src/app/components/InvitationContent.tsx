import { motion } from 'motion/react';
import { Activity, Bug, Calendar, Gift, Heart, Lock, MessageSquare, Smartphone, Trophy, User } from 'lucide-react';
import { SignUpForm } from './SignUpForm';
import { cn } from './ui/utils';

type SectionContentProps = {
  isActive: boolean;
  hasEntered: boolean;
  reducedMotion: boolean;
  scrollToIndex: (index: number) => void;
};

const EASE_OUT = [0.22, 1, 0.36, 1] as const;

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
        Hi, I’m Zain, founder of Cass. I met my wife on a dating app - she was actually my first date. That should be normal but it isn’t.
        Cass is built around a few simple principles:
      </motion.p>

      <motion.div variants={item} className="mt-10">
        <div className="max-w-3xl">
          <p className="text-sm font-medium uppercase tracking-[0.22em] text-white/55">What we’re building</p>
          <p className="mt-4 text-lg leading-relaxed text-white/75">
            <span className="font-semibold text-white">Cass</span> is safer, more trustworthy, and focused on compatibility scores.
            There is no swiping mechanic; you can see everyone at once and message anyone you like.
          </p>
        </div>

	        <div className="mt-10 grid gap-6 sm:grid-cols-3">
	          <FeatureRow
	            icon={<Lock className="h-4 w-4" />}
	            label="Trust"
	            title="Safer by design"
	          />
	          <FeatureRow
	            icon={<Heart className="h-4 w-4" />}
	            label="Chemistry"
	            title="Built on compatibility"
	          />
	          <FeatureRow
	            icon={<User className="h-4 w-4" />}
	            label="Accessibility"
	            title="Free without paywalls"
	          />
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
        As an alpha tester, you’ll be part of the first community. Your feedback will directly influence the UX and feature set before we launch.
      </motion.p>

      <motion.dl variants={item} className="mt-10 grid gap-6 sm:grid-cols-3">
        <StatItem icon={<Calendar className="h-4 w-4" />} label="Duration" value="1 week" />
        <StatItem icon={<Smartphone className="h-4 w-4" />} label="Platform" value="iOS" />
        <StatItem icon={<MessageSquare className="h-4 w-4" />} label="Feedback" value="2 short forms (~10 min)" />
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
        We value your time and your insights. In return, you’ll get a couple of perks alongside early access.
      </motion.p>

      <motion.div variants={item} className="mt-10 grid gap-8 md:grid-cols-2">
        <BenefitItem
          icon={<Trophy className="h-5 w-5" />}
          title="Founding member status"
          description='A permanent “Alpha Member” badge on your profile post‑launch.'
        />
        <BenefitItem
          icon={<Gift className="h-5 w-5" />}
          title="Exclusive merch"
          description='A limited‑edition Cass “Alpha Member” tote bag delivered to you.'
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
        We ask for three simple things from our alpha testers.
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

      <motion.p variants={item} className="mt-6 max-w-3xl text-pretty text-lg leading-relaxed text-white/75 md:text-xl">
        Fill this out to apply for early access.
      </motion.p>

      <motion.div variants={item} className="mt-10">
        <SignUpForm />
      </motion.div>

      <motion.div variants={item} className="mt-10 text-center">
        <p className="mb-4 text-lg italic text-white/70">For ever after 💕</p>
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
  className,
}: {
  icon: React.ReactNode;
  label: string;
  title: string;
  className?: string;
}) {
  return (
    <div className={cn('border-l border-white/10 pl-5', className)}>
      <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-[0.22em] text-white/55">
        <span className="text-white/60">{icon}</span>
        {label}
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
