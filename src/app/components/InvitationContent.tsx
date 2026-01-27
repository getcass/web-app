import { motion } from 'motion/react';
import { Activity, Bug, Calendar, Gift, Lock, MessageSquare, ShieldAlert, Shuffle, Smartphone, Trophy } from 'lucide-react';
import { Card } from './ui/card';
import { SignUpForm } from './SignUpForm';

type SectionContentProps = {
  isActive: boolean;
  hasEntered: boolean;
  reducedMotion: boolean;
  scrollToIndex: (index: number) => void;
};

const EASE_OUT = [0.22, 1, 0.36, 1] as const;

function useEnterMotion({ isActive, hasEntered, reducedMotion }: Pick<SectionContentProps, 'isActive' | 'hasEntered' | 'reducedMotion'>) {
  const shouldShow = isActive || hasEntered;
  const enterY = reducedMotion ? 0 : 16;
  const transition = reducedMotion
    ? { duration: 0.12, ease: 'linear' as const }
    : { duration: 0.65, ease: EASE_OUT };

  return { shouldShow, enterY, transition };
}

export function IntroSectionContent({ isActive, hasEntered, reducedMotion }: SectionContentProps) {
  const { shouldShow, enterY, transition } = useEnterMotion({ isActive, hasEntered, reducedMotion });

  return (
    <div className="mx-auto w-full max-w-5xl">
      <motion.h2
        initial={{ opacity: 0, y: enterY }}
        animate={shouldShow ? { opacity: 1, y: 0 } : { opacity: 0, y: enterY }}
        transition={transition}
        className="text-3xl md:text-4xl text-white tracking-tight text-balance"
      >
        Welcome to the Cass Private Alpha
      </motion.h2>

      <motion.div
        initial={{ opacity: 0, y: enterY }}
        animate={shouldShow ? { opacity: 1, y: 0 } : { opacity: 0, y: enterY }}
        transition={{ ...transition, delay: reducedMotion ? 0 : 0.08 }}
        className="mt-6"
      >
        <Card className="p-6 md:p-10">
          <p className="leading-relaxed text-foreground">
            Hi, I’m Zain, founder of Cass. Two years ago I met my wife on a dating app - she was actually the first date I set up. Stories like that should be normal, but they’re not. Here’s what I think most apps still get wrong:
          </p>

          <div className="mt-5 grid gap-3 md:grid-cols-3">
            <ProblemItem
              icon={<ShieldAlert className="w-6 h-6" />}
              text="They can be unsafe and untrustworthy"
            />
            <ProblemItem
              icon={<Shuffle className="w-6 h-6" />}
              text="Endless swiping feels exhausting"
            />
            <ProblemItem
              icon={<Lock className="w-6 h-6" />}
              text="Everything is paywalled"
            />
          </div>

          <div className="mt-6 pearl-card rounded-[var(--radius)] border border-border/60 bg-muted/25 p-5 shadow-sm">
            <p className="text-foreground leading-relaxed">
              <strong className="text-foreground">Cass</strong> is our attempt to fix these problems: safer, more trustworthy, and free to use. Built around real compatibility instead of endless swiping. Before we launch, we want a small group of users to try it, tell us what feels off, and help shape the product.
            </p>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}

export function AlphaProgrammeSectionContent({ isActive, hasEntered, reducedMotion }: SectionContentProps) {
  const { shouldShow, enterY, transition } = useEnterMotion({ isActive, hasEntered, reducedMotion });

  return (
    <div className="mx-auto w-full max-w-5xl">
      <motion.h2
        initial={{ opacity: 0, y: enterY }}
        animate={shouldShow ? { opacity: 1, y: 0 } : { opacity: 0, y: enterY }}
        transition={transition}
        className="text-3xl md:text-4xl text-white tracking-tight text-balance"
      >
        The Alpha Programme
      </motion.h2>

      <motion.div
        initial={{ opacity: 0, y: enterY }}
        animate={shouldShow ? { opacity: 1, y: 0 } : { opacity: 0, y: enterY }}
        transition={{ ...transition, delay: reducedMotion ? 0 : 0.08 }}
        className="mt-6"
      >
        <Card className="p-6 md:p-10">
          <p className="text-foreground leading-relaxed">
            As an Alpha Tester you will be a founding member of the community. Your feedback will directly influence the final UX/UI and feature set of the app.
          </p>

          <div className="mt-5 grid gap-3 md:grid-cols-3">
            <InfoCard icon={<Calendar className="w-8 h-8" />} title="Duration" description="1 Week" />
            <InfoCard icon={<Smartphone className="w-8 h-8" />} title="Platform" description="iOS" />
            <InfoCard icon={<MessageSquare className="w-8 h-8" />} title="Feedback" description="2 Google forms (~10 minutes each)" />
          </div>
        </Card>
      </motion.div>
    </div>
  );
}

export function WhatsInItForYouSectionContent({ isActive, hasEntered, reducedMotion }: SectionContentProps) {
  const { shouldShow, enterY, transition } = useEnterMotion({ isActive, hasEntered, reducedMotion });

  return (
    <div className="mx-auto w-full max-w-5xl">
      <motion.h2
        initial={{ opacity: 0, y: enterY }}
        animate={shouldShow ? { opacity: 1, y: 0 } : { opacity: 0, y: enterY }}
        transition={transition}
        className="text-3xl md:text-4xl text-white tracking-tight text-balance"
      >
        What&apos;s In It For You?
      </motion.h2>

      <motion.div
        initial={{ opacity: 0, y: enterY }}
        animate={shouldShow ? { opacity: 1, y: 0 } : { opacity: 0, y: enterY }}
        transition={{ ...transition, delay: reducedMotion ? 0 : 0.08 }}
        className="mt-6"
      >
        <Card className="p-6 md:p-10">
          <p className="text-foreground leading-relaxed">
            We value your time and your insights. Beyond helping shape the next big thing in dating, Alpha Testers receive:
          </p>

          <div className="mt-5 grid gap-3 md:grid-cols-2">
            <RewardCard
              icon={<Trophy className="w-8 h-8" />}
              title="Founding Member Status"
              description='A permanent "Alpha Member" badge on your profile post-launch.'
            />
            <RewardCard
              icon={<Gift className="w-8 h-8" />}
              title="Exclusive Merch"
              description='A limited edition Cass "Alpha Member" tote bag delivered to you.'
            />
          </div>
        </Card>
      </motion.div>
    </div>
  );
}

export function CommitmentSectionContent({ isActive, hasEntered, reducedMotion }: SectionContentProps) {
  const { shouldShow, enterY, transition } = useEnterMotion({ isActive, hasEntered, reducedMotion });

  return (
    <div className="mx-auto w-full max-w-5xl">
      <motion.h2
        initial={{ opacity: 0, y: enterY }}
        animate={shouldShow ? { opacity: 1, y: 0 } : { opacity: 0, y: enterY }}
        transition={transition}
        className="text-3xl md:text-4xl text-white tracking-tight text-balance"
      >
        The Commitment
      </motion.h2>

      <motion.div
        initial={{ opacity: 0, y: enterY }}
        animate={shouldShow ? { opacity: 1, y: 0 } : { opacity: 0, y: enterY }}
        transition={{ ...transition, delay: reducedMotion ? 0 : 0.08 }}
        className="mt-6"
      >
        <Card className="p-6 md:p-10">
          <p className="text-foreground leading-relaxed">
            We ask for three simple things from our Alpha Testers:
          </p>

          <div className="mt-5 space-y-3">
            <CommitmentItem
              icon={<Activity className="w-6 h-6" />}
              title="Active Engagement"
              description="Use the app at least once a day during the testing period."
            />
            <CommitmentItem
              icon={<MessageSquare className="w-6 h-6" />}
              title="Honest Feedback"
              description="Participate in two brief surveys regarding your experience."
            />
            <CommitmentItem
              icon={<Bug className="w-6 h-6" />}
              title="Bug Hunting"
              description='Report any glitches or "weird" moments via our dedicated feedback portal.'
            />
          </div>
        </Card>
      </motion.div>
    </div>
  );
}

export function ApplyNowSectionContent({ isActive, hasEntered, reducedMotion }: SectionContentProps) {
  const { shouldShow, enterY, transition } = useEnterMotion({ isActive, hasEntered, reducedMotion });

  return (
    <div className="mx-auto w-full max-w-5xl">
      <motion.h2
        initial={{ opacity: 0, y: enterY }}
        animate={shouldShow ? { opacity: 1, y: 0 } : { opacity: 0, y: enterY }}
        transition={transition}
        className="text-3xl md:text-4xl text-white tracking-tight text-balance"
      >
        Apply Now
      </motion.h2>

      <motion.div
        initial={{ opacity: 0, y: enterY }}
        animate={shouldShow ? { opacity: 1, y: 0 } : { opacity: 0, y: enterY }}
        transition={{ ...transition, delay: reducedMotion ? 0 : 0.08 }}
        className="mt-6"
      >
        <SignUpForm />
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={shouldShow ? { opacity: 1 } : { opacity: 0 }}
        transition={{ ...transition, delay: reducedMotion ? 0 : 0.16 }}
        className="mt-6 text-center"
      >
        <p className="text-xl text-white/70 italic mb-4">
          For ever after 💕
        </p>
        <p className="text-white/80">
          <strong className="text-white">Zain</strong>
          <br />
          <span className="text-white/60">Founder, Cass</span>
        </p>
      </motion.div>
    </div>
  );
}

function ProblemItem({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <div className="grid grid-cols-[2.75rem_1fr] items-center gap-4 rounded-[calc(var(--radius)+0.25rem)] border border-border/60 bg-muted/20 p-4 text-foreground shadow-sm">
      <div className="flex h-11 w-11 items-center justify-center rounded-[calc(var(--radius)+0.25rem)] border border-border/70 bg-muted/50 text-foreground/70 shadow-sm">
        {icon}
      </div>
      <p className="leading-relaxed text-foreground">{text}</p>
    </div>
  );
}

function InfoCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="pearl-card cass-hover-lift rounded-[var(--radius)] p-5 border border-border/50 shadow-sm hover:shadow-md">
      <div className="mb-2 text-foreground/70">{icon}</div>
      <h4 className="text-base font-medium text-foreground mb-1">{title}</h4>
      <p className="text-sm text-foreground">{description}</p>
    </div>
  );
}

function RewardCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="pearl-card cass-hover-lift rounded-[var(--radius)] p-5 border border-border/50 shadow-sm hover:shadow-md">
      <div className="mb-2 text-foreground/70">{icon}</div>
      <h4 className="text-base font-medium text-foreground mb-1">{title}</h4>
      <p className="text-sm text-foreground">{description}</p>
    </div>
  );
}

function CommitmentItem({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="grid grid-cols-[2.75rem_1fr] items-center gap-4 rounded-[calc(var(--radius)+0.25rem)] border border-border/60 bg-muted/20 p-4 shadow-sm">
      <div className="flex h-11 w-11 items-center justify-center rounded-[calc(var(--radius)+0.25rem)] border border-border/70 bg-muted/50 text-foreground/70 shadow-sm">
        {icon}
      </div>
      <div>
        <h4 className="text-base font-semibold tracking-tight text-foreground">{title}</h4>
        <p className="mt-1 text-sm leading-relaxed text-foreground">{description}</p>
      </div>
    </div>
  );
}
