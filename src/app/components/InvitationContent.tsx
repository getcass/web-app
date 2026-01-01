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
      <div className="max-w-4xl mx-auto px-6 py-20">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {/* Introduction */}
          <motion.div variants={itemVariantsNoOpacity} className="mb-16">
            <Card className="p-8 md:p-12">
              <h2 className="text-3xl md:text-4xl mb-4 text-foreground font-semibold tracking-tight">Welcome to the Cass Private Alpha</h2>
              <p className="text-foreground mb-4 leading-relaxed">
                Hello! I'm Zain, founder of Cass. Two years ago, I was lucky enough to meet my now wife on a dating app. She was actually the very first date I arranged on it. I've learned that stories like this seem to be the exception. In my view, there are three major problems with how dating apps work today:
              </p>
              
              <div className="space-y-2 mb-4">
                <ProblemItem 
                  icon={<ShieldAlert className="w-6 h-6" />}
                  text="They are unsafe and untrustworthy, particularly for women and vulnerable people."
                />
                <ProblemItem 
                  icon={<Shuffle className="w-6 h-6" />}
                  text="The swiping dynamics create inequality and fatigue."
                />
                <ProblemItem 
                  icon={<Lock className="w-6 h-6" />}
                  text="They are heavily paywalled."
                />
              </div>

              <div className="pearl-card rounded-[var(--radius)] p-5 border border-border/50">
                <p className="text-foreground leading-relaxed">
                  <strong className="text-foreground">Cass</strong> aims to be the antidote to these problems. We're building a safe, trustworthy, and free to use platform that prioritises real compatibility over endless swiping. Before we launch to the world, we need a select group of users to help us break things and build things.
                </p>
              </div>
            </Card>
          </motion.div>

          {/* Alpha Program */}
          <motion.div variants={itemVariantsNoOpacity} className="mb-16">
            <h2 className="text-3xl md:text-4xl mb-6 text-white tracking-tight">The Alpha Program</h2>
            <Card className="p-8 md:p-12">
              <p className="text-foreground mb-5 leading-relaxed">
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
              <p className="text-foreground mb-5 leading-relaxed">
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
              <p className="text-foreground mb-5 leading-relaxed">
                We ask for three simple things from our Alpha Testers:
              </p>
              
              <div className="space-y-4">
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
              Fairly ever after :)
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
    <div className="flex items-start gap-4 text-foreground">
      <div className="flex-shrink-0 w-10 h-10 rounded-[var(--radius)] bg-secondary/50 flex items-center justify-center text-primary border border-border/60">
        {icon}
      </div>
      <p className="flex-1 pt-1 text-foreground">{text}</p>
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
      <div className="text-primary mb-2">{icon}</div>
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
      <div className="text-primary mb-2">{icon}</div>
      <h4 className="text-base font-medium text-foreground mb-1">{title}</h4>
      <p className="text-sm text-foreground">{description}</p>
    </motion.div>
  );
}

function CommitmentItem({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="flex gap-4">
      <div className="flex-shrink-0 w-10 h-10 rounded-[var(--radius)] bg-secondary/50 text-primary flex items-center justify-center border border-border/60">
        {icon}
      </div>
      <div className="flex-1">
        <h4 className="text-base font-semibold mb-1 text-foreground">{title}</h4>
        <p className="text-sm text-foreground">{description}</p>
      </div>
    </div>
  );
}