import { useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import feedImg from '../../assets/screenshot-feed.png';
import labsImg from '../../assets/screenshot-labs.png';
import profileImg from '../../assets/screenshot-profile.png';
import chatsImg from '../../assets/chats.png';
import { cn } from './ui/utils';

type ProductShowcaseProps = {
  activeIndex: number;
  reducedMotion: boolean;
  mode?: 'desktop' | 'mobile';
  className?: string;
};

type ProductRenderProps = {
  src: string;
  alt: string;
  className?: string;
  animate?: Record<string, number | string>;
  reducedMotion: boolean;
};

const SHOWCASE_EASE = [0.22, 1, 0.36, 1] as const;
const DESKTOP_DEPTH_PHONE_OFFSET = 144;
const MOBILE_DEPTH_PHONE_OFFSET = 82;
const STRAIGHT_PHONE_ROTATION = {
  rotate: 0,
  rotateY: 0,
  rotateX: 0,
};
const PRODUCT_IMAGE_SOURCES = [feedImg, labsImg, profileImg, chatsImg];

let productImagesPreloaded = false;

function preloadProductImages() {
  if (productImagesPreloaded || typeof window === 'undefined') return;

  productImagesPreloaded = true;
  for (const src of PRODUCT_IMAGE_SOURCES) {
    const image = new Image();
    image.src = src;
    if ('decode' in image) {
      void image.decode().catch(() => undefined);
    }
  }
}

function getTransition(reducedMotion: boolean) {
  return reducedMotion
    ? { duration: 0.14, ease: 'linear' as const }
    : { duration: 0.95, ease: SHOWCASE_EASE };
}

function getInstantTransition() {
  return { duration: 0, ease: 'linear' as const };
}

function sceneState(isActive: boolean, reducedMotion: boolean, y = 18) {
  return {
    opacity: isActive ? 1 : 0,
    y: reducedMotion ? 0 : isActive ? 0 : y,
    scale: reducedMotion ? 1 : isActive ? 1 : 0.97,
    filter: reducedMotion || isActive ? 'blur(0px)' : 'blur(4px)',
  };
}

function ProductRender({
  src,
  alt,
  className,
  animate,
  reducedMotion,
}: ProductRenderProps) {
  return (
    <motion.div
      className={cn('cass-product-render', className)}
      initial={false}
      animate={animate}
      transition={getTransition(reducedMotion)}
      style={{ transformStyle: 'preserve-3d', willChange: 'transform, opacity, filter' }}
    >
      <img
        src={src}
        alt={alt}
        draggable="false"
        loading="eager"
        decoding="async"
        className="cass-product-render-image"
      />
    </motion.div>
  );
}

function SinglePhoneScene({
  active,
  src,
  alt,
  reducedMotion,
  sceneTransition,
}: {
  active: boolean;
  src: string;
  alt: string;
  reducedMotion: boolean;
  sceneTransition?: ReturnType<typeof getTransition>;
}) {
  return (
    <motion.div
      className="cass-product-scene cass-product-scene--single"
      initial={false}
      animate={sceneState(active, reducedMotion)}
      transition={sceneTransition ?? getTransition(reducedMotion)}
      style={{ willChange: 'transform, opacity, filter' }}
    >
      <ProductRender
        src={src}
        alt={alt}
        reducedMotion={reducedMotion}
        className="cass-product-render--single cass-product-render--feed"
        animate={{
          ...STRAIGHT_PHONE_ROTATION,
          scale: 1,
        }}
      />
    </motion.div>
  );
}

function ChatsStackScene({
  active,
  reducedMotion,
  sceneTransition,
}: {
  active: boolean;
  reducedMotion: boolean;
  sceneTransition?: ReturnType<typeof getTransition>;
}) {
  return (
    <motion.div
      className="cass-product-scene cass-product-scene--chats-stack"
      initial={false}
      animate={sceneState(active, reducedMotion, 20)}
      transition={sceneTransition ?? getTransition(reducedMotion)}
      style={{ willChange: 'transform, opacity, filter' }}
    >
      <ProductRender
        src={chatsImg}
        alt="Messaging inbox with active, received, and sent chats"
        reducedMotion={reducedMotion}
        className="cass-product-render--chats-stack"
        animate={{
          ...STRAIGHT_PHONE_ROTATION,
          scale: 1,
        }}
      />
    </motion.div>
  );
}

function DepthRenderScene({
  active,
  reducedMotion,
  isDesktop,
  sceneTransition,
}: {
  active: boolean;
  reducedMotion: boolean;
  isDesktop: boolean;
  sceneTransition?: ReturnType<typeof getTransition>;
}) {
  const phoneOffset = isDesktop ? DESKTOP_DEPTH_PHONE_OFFSET : MOBILE_DEPTH_PHONE_OFFSET;

  return (
    <motion.div
      className="cass-product-scene cass-product-scene--depth"
      initial={false}
      animate={sceneState(active, reducedMotion, 20)}
      transition={sceneTransition ?? getTransition(reducedMotion)}
      style={{ willChange: 'transform, opacity, filter' }}
    >
      <div className="cass-product-depth-stage">
        <ProductRender
          src={labsImg}
          alt="Cass Labs profile completion"
          reducedMotion={reducedMotion}
          className="cass-product-render--depth cass-product-render--depth-back"
          animate={{
            x: reducedMotion ? -phoneOffset : active ? -phoneOffset : -Math.round(phoneOffset * 0.55),
            y: 0,
            z: 0,
            ...STRAIGHT_PHONE_ROTATION,
            scale: active ? 0.88 : 0.76,
            opacity: active ? 1 : 0,
          }}
        />
        <ProductRender
          src={profileImg}
          alt="Compatibility overlay details"
          reducedMotion={reducedMotion}
          className="cass-product-render--depth cass-product-render--depth-front"
          animate={{
            x: reducedMotion ? phoneOffset : active ? phoneOffset : Math.round(phoneOffset * 0.55),
            y: 0,
            z: 0,
            ...STRAIGHT_PHONE_ROTATION,
            scale: active ? 0.88 : 0.76,
            opacity: active ? 1 : 0,
          }}
        />
      </div>
    </motion.div>
  );
}

export function ProductShowcase({
  activeIndex,
  reducedMotion,
  mode = 'desktop',
  className,
}: ProductShowcaseProps) {
  const previousActiveIndexRef = useRef(activeIndex);
  const previousActiveIndex = previousActiveIndexRef.current;
  const isDesktop = mode === 'desktop';
  const isFeature = activeIndex >= 1 && activeIndex <= 3;
  const isInstantBoundary =
    (previousActiveIndex === 0 && activeIndex === 1) ||
    (previousActiveIndex === 1 && activeIndex === 0) ||
    (previousActiveIndex === 3 && activeIndex === 4) ||
    (previousActiveIndex === 4 && activeIndex === 3);
  const transition = getTransition(reducedMotion);
  const boundaryTransition = isInstantBoundary ? getInstantTransition() : transition;
  const showBackdrop = isDesktop ? isFeature : true;

  useEffect(() => {
    preloadProductImages();
  }, []);

  useEffect(() => {
    previousActiveIndexRef.current = activeIndex;
  }, [activeIndex]);

  return (
    <div
      className={cn(
        'cass-product-showcase pointer-events-none',
        isDesktop ? 'cass-product-showcase--desktop hidden md:block' : 'cass-product-showcase--mobile md:hidden',
        className,
      )}
      aria-hidden={isDesktop ? 'true' : undefined}
    >
      <motion.div
        className="cass-product-stage-panel"
        initial={false}
        animate={{
          opacity: showBackdrop ? (isDesktop ? 0.92 : 0.82) : 0,
          scale: reducedMotion ? 1 : isFeature ? 1 : 0.98,
          y: reducedMotion ? 0 : isFeature ? 0 : 10,
        }}
        transition={boundaryTransition}
      />
      <motion.div
        className="cass-product-stage-glow"
        initial={false}
        animate={{
          opacity: showBackdrop ? 0.72 : 0,
          scale: reducedMotion ? 1 : activeIndex === 2 ? 1.1 : 1,
        }}
        transition={boundaryTransition}
      />

      <SinglePhoneScene
        active={activeIndex === 1}
        src={feedImg}
        alt="Most compatible matches grid"
        reducedMotion={reducedMotion}
        sceneTransition={boundaryTransition}
      />
      <DepthRenderScene
        active={activeIndex === 2}
        reducedMotion={reducedMotion}
        isDesktop={isDesktop}
        sceneTransition={boundaryTransition}
      />
      <ChatsStackScene
        active={activeIndex === 3}
        reducedMotion={reducedMotion}
        sceneTransition={boundaryTransition}
      />
    </div>
  );
}
