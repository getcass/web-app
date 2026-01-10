import { motion } from 'motion/react';
import { ShieldAlert, Shuffle, Lock, Activity, Bug, Users, Trophy, Gift, Calendar, Smartphone, MessageSquare, Search } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { SignUpForm } from './SignUpForm';

interface InvitationContentProps {
  isLoaded: boolean;
}

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.3
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: 'easeOut' }
  }
};

const itemVariantsNoOpacity = {
  hidden: { y: 30 },
  visible: {
    y: 0,
    transition: { duration: 0.6, ease: 'easeOut' }
  }
};

export function InvitationContent({ isLoaded }: InvitationContentProps) {
  return (
    <div className="relative bg-gradient-to-b from-transparent via-black/50 to-black">
      <div className="max-w-4xl mx-auto px-6 pt-0 pb-20">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {/* Introduction */}
          <motion.div variants={itemVariantsNoOpacity} className="mb-16">
            <Card className="p-8 md:p-12">
              <h2 className="text-3xl md:text-4xl text-foreground font-semibold tracking-tight text-balance">
                Welcome to the Cass Private Alpha
              </h2>
              <p className="mt-4 leading-relaxed text-foreground">
                Hi, I’m Zain, founder of Cass. Two years ago I met my wife on a dating app - she was actually the first date I set up. Stories like that should be normal, but they’re not. Here’s what I think most apps still get wrong:
              </p>
              
              <div className="mt-3 space-y-3">
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

              <div className="pearl-card mt-4 rounded-[var(--radius)] border border-border/60 bg-muted/25 p-5 shadow-sm">
                <p className="text-foreground leading-relaxed">
                  <strong className="text-foreground">Cass</strong> is our attempt to fix these problems: safer, more trustworthy, and free to use. Built around real compatibility instead of endless swiping. Before we launch, we want a small group of users to try it, tell us what feels off, and help shape the product.
                </p>
              </div>
            </Card>
          </motion.div>

          {/* Alpha Program */}
          <motion.div variants={itemVariantsNoOpacity} className="mb-16">
            <h2 className="text-3xl md:text-4xl mb-6 text-white tracking-tight">The Alpha Programme</h2>
            <Card className="p-8 md:p-12">
              <p className="text-foreground mb-1 leading-relaxed">
                As an Alpha Tester you will be a founding member of the community. Your feedback will directly influence the final UX/UI and feature set of the app.
              </p>
              
              <div className="grid md:grid-cols-3 gap-3">
                <InfoCard 
                  icon={<Calendar className="w-8 h-8" />}
                  title="Duration"
                  description="1 Week"
                />
                <InfoCard 
                  icon={<Smartphone className="w-8 h-8" />}
                  title="Platform"
                  description="iOS"
                />
                <InfoCard 
                  icon={<MessageSquare className="w-8 h-8" />}
                  title="Feedback"
                  description="2 Google forms (~10 minutes each)"
                />
              </div>
            </Card>
          </motion.div>

          {/* What's In It For You */}
          <motion.div variants={itemVariantsNoOpacity} className="mb-16">
            <h2 className="text-3xl md:text-4xl mb-6 text-white tracking-tight">What's In It For You?</h2>
            <Card className="p-8 md:p-12">
              <p className="text-foreground mb-1 leading-relaxed">
                We value your time and your insights. Beyond helping shape the next big thing in dating, Alpha Testers receive:
              </p>
              
              <div className="grid md:grid-cols-2 gap-3">
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

          {/* The Commitment */}
          <motion.div variants={itemVariantsNoOpacity} className="mb-16">
            <h2 className="text-3xl md:text-4xl mb-6 text-white tracking-tight">The Commitment</h2>
            <Card className="p-8 md:p-12">
              <p className="text-foreground mb-1 leading-relaxed">
                We ask for three simple things from our Alpha Testers:
              </p>
              
              <div className="space-y-3">
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

          {/* How to Join - Sign Up Form */}
          <motion.div variants={itemVariantsNoOpacity} className="mb-16">
            <h2 className="text-3xl md:text-4xl mb-6 text-white tracking-tight">Apply Now</h2>
            <SignUpForm />
          </motion.div>

          {/* Footer */}
          <motion.div variants={itemVariants} className="text-center">
            <p className="text-xl text-white/70 italic mb-4">
              For ever after 💕
            </p>
            <p className="text-white/80">
              <strong className="text-white">Zain</strong>
              <br />
              <span className="text-white/60">Founder, Cass</span>
            </p>
          </motion.div>
        </motion.div>
      </div>
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
    <motion.div
      whileHover={{ scale: 1.05, y: -5 }}
      transition={{ duration: 0.2 }}
      className="pearl-card rounded-[var(--radius)] p-5 border border-border/50 shadow-sm backdrop-blur-lg backdrop-saturate-150"
    >
      <div className="mb-2 text-foreground/70">{icon}</div>
      <h4 className="text-base font-medium text-foreground mb-1">{title}</h4>
      <p className="text-sm text-foreground">{description}</p>
    </motion.div>
  );
}

function RewardCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <motion.div
      whileHover={{ scale: 1.03 }}
      transition={{ duration: 0.2 }}
      className="pearl-card rounded-[var(--radius)] p-5 border border-border/50 shadow-sm backdrop-blur-lg backdrop-saturate-150"
    >
      <div className="mb-2 text-foreground/70">{icon}</div>
      <h4 className="text-base font-medium text-foreground mb-1">{title}</h4>
      <p className="text-sm text-foreground">{description}</p>
    </motion.div>
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
