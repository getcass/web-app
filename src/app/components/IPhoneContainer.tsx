import { motion } from 'motion/react';
import { cn } from './ui/utils';
import feedImg from '../../assets/screenshot-feed.png';
import labsImg from '../../assets/screenshot-labs.png';
import profileImg from '../../assets/screenshot-profile.png';
import chatsImg from '../../assets/screenshot-chats.png';

type IPhoneContainerProps = {
  activeIndex: number;
  reducedMotion?: boolean;
  className?: string;
};

const PHONE_EASE = [0.16, 1, 0.3, 1] as const;

function getPhoneTransition(reducedMotion = false) {
  return reducedMotion
    ? { duration: 0.12, ease: 'linear' as const }
    : { duration: 0.95, ease: PHONE_EASE };
}

function getSceneState(isActive: boolean, offset = 18, reducedMotion = false) {
  return {
    opacity: isActive ? 1 : 0,
    scale: reducedMotion ? 1 : isActive ? 1 : 0.965,
    y: reducedMotion ? 0 : isActive ? 0 : offset,
    filter: reducedMotion || isActive ? 'blur(0px)' : 'blur(5px)',
  };
}

export function IPhoneContainer({ activeIndex, reducedMotion, className }: IPhoneContainerProps) {
  const isVisible = activeIndex >= 1 && activeIndex <= 3;
  const transition = getPhoneTransition(reducedMotion);

  return (
    <motion.div
      className={cn(
        'relative flex h-[650px] items-center justify-center',
        !isVisible && 'pointer-events-none',
        className
      )}
      initial={false}
      animate={{
        opacity: isVisible ? 1 : 0,
        scale: reducedMotion || isVisible ? 1 : 0.96,
        y: reducedMotion || isVisible ? 0 : 24,
        width: activeIndex === 2 ? 430 : 330,
      }}
      transition={transition}
      style={{ willChange: 'transform, opacity, width' }}
    >
      <motion.div
        className="absolute left-1/2 top-1/2 z-20 h-[624px] w-[292px] -translate-x-1/2 -translate-y-1/2"
        initial={false}
        animate={getSceneState(activeIndex === 1, activeIndex < 1 ? 20 : -18, reducedMotion)}
        transition={transition}
        style={{ willChange: 'transform, opacity, filter' }}
      >
        <PhoneShell src={feedImg} alt="Most compatible matches grid" />
      </motion.div>

      <motion.div
        className="absolute inset-0 z-30"
        initial={false}
        animate={getSceneState(activeIndex === 2, activeIndex < 2 ? 20 : -20, reducedMotion)}
        transition={transition}
        style={{ willChange: 'transform, opacity, filter' }}
      >
        <motion.div
          className="absolute left-1/2 top-1/2 z-10 h-[530px] w-[248px] -translate-x-1/2 -translate-y-1/2"
          initial={false}
          animate={{
            x: reducedMotion ? -70 : activeIndex === 2 ? -74 : -46,
            y: reducedMotion ? -42 : activeIndex === 2 ? -44 : -18,
            rotate: reducedMotion ? -10 : activeIndex === 2 ? -10 : -4,
            scale: reducedMotion ? 0.96 : activeIndex === 2 ? 0.96 : 0.9,
            opacity: activeIndex === 2 ? 0.76 : 0,
          }}
          transition={transition}
          style={{ willChange: 'transform, opacity' }}
        >
          <PhoneShell src={labsImg} alt="Cass Labs profile completion" />
        </motion.div>

        <motion.div
          className="absolute left-1/2 top-1/2 z-20 h-[530px] w-[248px] -translate-x-1/2 -translate-y-1/2"
          initial={false}
          animate={{
            x: reducedMotion ? 62 : activeIndex === 2 ? 62 : 34,
            y: reducedMotion ? 42 : activeIndex === 2 ? 44 : 18,
            rotate: reducedMotion ? -10 : activeIndex === 2 ? -10 : -4,
            scale: reducedMotion ? 1 : activeIndex === 2 ? 1 : 0.94,
            opacity: activeIndex === 2 ? 1 : 0,
          }}
          transition={transition}
          style={{ willChange: 'transform, opacity' }}
        >
          <PhoneShell src={profileImg} alt="Compatibility overlay details" />
        </motion.div>
      </motion.div>

      <motion.div
        className="absolute left-1/2 top-1/2 z-20 h-[624px] w-[292px] -translate-x-1/2 -translate-y-1/2"
        initial={false}
        animate={getSceneState(activeIndex === 3, activeIndex < 3 ? 20 : -18, reducedMotion)}
        transition={transition}
        style={{ willChange: 'transform, opacity, filter' }}
      >
        <PhoneShell src={chatsImg} alt="Clean connections chats list" />
      </motion.div>
    </motion.div>
  );
}

type PhoneShellProps = {
  src: string;
  alt: string;
  className?: string;
  variant?: 'default' | 'compact';
};

export function PhoneShell({ src, alt, className, variant = 'default' }: PhoneShellProps) {
  const isCompact = variant === 'compact';

  return (
    <div
      className={cn(
        'relative h-full w-full select-none',
        isCompact ? 'rounded-[30px]' : 'rounded-[48px]',
        className,
      )}
    >
      <div
        className={cn(
          'absolute inset-0 rounded-[inherit] bg-[linear-gradient(145deg,#3a3a40_0%,#060607_43%,#24252b_100%)] shadow-[0_34px_90px_rgba(18,18,23,0.22),0_10px_28px_rgba(18,18,23,0.16)] ring-1 ring-black/50',
          isCompact ? 'p-[1.5px]' : 'p-[2px]',
        )}
      >
        <div
          className={cn(
            'relative h-full w-full overflow-hidden bg-zinc-950 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.08),inset_0_0_20px_rgba(255,255,255,0.03)]',
            isCompact ? 'rounded-[28px] p-[6px]' : 'rounded-[46px] p-[11px]',
          )}
        >
          <div
            className={cn(
              'relative h-full w-full overflow-hidden bg-white ring-1 ring-black/80',
              isCompact ? 'rounded-[20px]' : 'rounded-[34px]',
            )}
          >
            <img src={src} alt={alt} draggable="false" className="h-full w-full object-cover" />
            <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.16)_0%,rgba(255,255,255,0.02)_26%,transparent_48%)] opacity-35" />
            <div className="pointer-events-none absolute inset-0 shadow-[inset_0_0_28px_rgba(0,0,0,0.08)]" />
          </div>
        </div>
      </div>
    </div>
  );
}
