import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
} from 'react';
import logoUrl from '../../assets/logo.svg';
import posterUrl from '../../assets/cass-logo-reveal-poster.png';
import videoUrl from '../../assets/cass-logo-reveal.mp4';
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion';
import { LivingBlob } from './LivingBlob';

const LEGAL_LINKS = [
  { href: 'terms/', label: 'Terms' },
  { href: 'privacy/', label: 'Privacy' },
] as const;

type NetworkInformation = {
  readonly effectiveType?: string;
  readonly saveData?: boolean;
};

type Point = {
  x: number;
  y: number;
};

const BETA_PULSE_CLEANUP_DELAY = 420;
const BETA_REDUCED_PULSE_CLEANUP_DELAY = 220;
const CONTENT_REVEAL_AT_SECONDS = 5.55;

type VideoFrameMetadata = {
  readonly mediaTime: number;
};

export function LandingDeck() {
  const reducedMotion = usePrefersReducedMotion();
  const [shouldLoadVideo, setShouldLoadVideo] = useState(false);
  const [videoReady, setVideoReady] = useState(false);
  const [showLivingBlob, setShowLivingBlob] = useState(false);
  const [showStaticLogo, setShowStaticLogo] = useState(false);
  const [contentVisible, setContentVisible] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const videoStartedRef = useRef(false);
  const videoFrameCallbackRef = useRef<number | null>(null);
  const betaButtonRef = useRef<HTMLButtonElement>(null);
  const spotlightFrameRef = useRef<number | null>(null);
  const spotlightLastFrameRef = useRef<number | null>(null);
  const spotlightReadyRef = useRef(false);
  const spotlightCurrentRef = useRef<Point>({ x: 0, y: 0 });
  const spotlightTargetRef = useRef<Point>({ x: 0, y: 0 });
  const pulseFrameRef = useRef<number | null>(null);
  const pulseTimerRef = useRef<number | null>(null);

  const cancelVideoProgressMonitor = useCallback(() => {
    const video = videoRef.current;

    if (
      video &&
      videoFrameCallbackRef.current !== null &&
      typeof video.cancelVideoFrameCallback === 'function'
    ) {
      video.cancelVideoFrameCallback(videoFrameCallbackRef.current);
    }

    videoFrameCallbackRef.current = null;
  }, []);

  const monitorVideoProgress = useCallback(
    function monitor(_timestamp: number, metadata: VideoFrameMetadata) {
      const video = videoRef.current;

      if (!video) {
        videoFrameCallbackRef.current = null;
        return;
      }

      if (metadata.mediaTime >= CONTENT_REVEAL_AT_SECONDS) {
        setContentVisible(true);
        videoFrameCallbackRef.current = null;
        return;
      }

      videoFrameCallbackRef.current = video.requestVideoFrameCallback(monitor);
    },
    [],
  );

  const handleVideoError = useCallback(() => {
    cancelVideoProgressMonitor();
    videoStartedRef.current = false;
    setShouldLoadVideo(false);
    setVideoReady(false);
    setShowLivingBlob(false);
    setShowStaticLogo(true);
    setContentVisible(true);
  }, [cancelVideoProgressMonitor]);

  const handleVideoTimeUpdate = useCallback(() => {
    const video = videoRef.current;

    if (video && video.currentTime >= CONTENT_REVEAL_AT_SECONDS) {
      setContentVisible(true);
    }
  }, []);

  const handleVideoEnded = useCallback(() => {
    setShowLivingBlob(false);
    setContentVisible(true);
  }, []);

  const handleLivingBlobComplete = useCallback(() => {
    setShowLivingBlob(false);
  }, []);

  const handleVideoCanPlay = useCallback(() => {
    const video = videoRef.current;

    if (!video || videoStartedRef.current) {
      return;
    }

    videoStartedRef.current = true;
    cancelVideoProgressMonitor();
    video.pause();
    video.currentTime = 0;
    setContentVisible(false);
    setVideoReady(true);
    setShowLivingBlob(true);

    window.requestAnimationFrame(() => {
      if (typeof video.requestVideoFrameCallback === 'function') {
        videoFrameCallbackRef.current = video.requestVideoFrameCallback(
          monitorVideoProgress,
        );
      }

      void video.play().catch(handleVideoError);
    });
  }, [cancelVideoProgressMonitor, handleVideoError, monitorVideoProgress]);

  const animateBetaSpotlight = useCallback(
    function tick(timestamp: number) {
      const button = betaButtonRef.current;

      if (!button || reducedMotion) {
        spotlightFrameRef.current = null;
        spotlightLastFrameRef.current = null;
        return;
      }

      const previousTimestamp = spotlightLastFrameRef.current;
      const elapsed = previousTimestamp === null
        ? 1000 / 60
        : Math.min(timestamp - previousTimestamp, 50);
      const interpolation = 1 - Math.exp(-elapsed / 72);
      const current = spotlightCurrentRef.current;
      const target = spotlightTargetRef.current;

      current.x += (target.x - current.x) * interpolation;
      current.y += (target.y - current.y) * interpolation;
      spotlightLastFrameRef.current = timestamp;

      button.style.setProperty('--mouse-x', `${current.x.toFixed(2)}px`);
      button.style.setProperty('--mouse-y', `${current.y.toFixed(2)}px`);

      if (Math.hypot(target.x - current.x, target.y - current.y) < 0.12) {
        current.x = target.x;
        current.y = target.y;
        button.style.setProperty('--mouse-x', `${target.x.toFixed(2)}px`);
        button.style.setProperty('--mouse-y', `${target.y.toFixed(2)}px`);
        spotlightFrameRef.current = null;
        spotlightLastFrameRef.current = null;
        return;
      }

      spotlightFrameRef.current = window.requestAnimationFrame(tick);
    },
    [reducedMotion],
  );

  const moveBetaSpotlight = useCallback(
    (point: Point) => {
      spotlightTargetRef.current = point;

      if (spotlightFrameRef.current === null) {
        spotlightLastFrameRef.current = null;
        spotlightFrameRef.current = window.requestAnimationFrame(animateBetaSpotlight);
      }
    },
    [animateBetaSpotlight],
  );

  const handleBetaPointerMove = useCallback(
    (event: ReactPointerEvent<HTMLDivElement>) => {
      if (event.pointerType === 'touch') {
        return;
      }

      const button = betaButtonRef.current;

      if (!button) {
        return;
      }

      button.dataset.hovered = 'true';

      if (reducedMotion) {
        return;
      }

      const bounds = button.getBoundingClientRect();

      if (!spotlightReadyRef.current) {
        spotlightCurrentRef.current = {
          x: bounds.width / 2,
          y: bounds.height / 2,
        };
        spotlightReadyRef.current = true;
      }

      moveBetaSpotlight({
        x: Math.min(Math.max(event.clientX - bounds.left, 0), bounds.width),
        y: Math.min(Math.max(event.clientY - bounds.top, 0), bounds.height),
      });
    },
    [moveBetaSpotlight, reducedMotion],
  );

  const handleBetaPointerLeave = useCallback(() => {
    const button = betaButtonRef.current;

    if (!button) {
      return;
    }

    delete button.dataset.hovered;

    if (reducedMotion) {
      return;
    }

    moveBetaSpotlight({
      x: button.offsetWidth / 2,
      y: button.offsetHeight / 2,
    });
  }, [moveBetaSpotlight, reducedMotion]);

  const handleBetaPress = useCallback(
    (event: ReactPointerEvent<HTMLDivElement>) => {
      if (event.button !== 0) {
        return;
      }

      const button = betaButtonRef.current;

      if (!button) {
        return;
      }

      if (pulseFrameRef.current !== null) {
        window.cancelAnimationFrame(pulseFrameRef.current);
        pulseFrameRef.current = null;
      }

      if (pulseTimerRef.current !== null) {
        window.clearTimeout(pulseTimerRef.current);
        pulseTimerRef.current = null;
      }

      const startPulse = () => {
        button.dataset.pulsing = 'true';
        pulseFrameRef.current = null;
        pulseTimerRef.current = window.setTimeout(() => {
          delete button.dataset.pulsing;
          pulseTimerRef.current = null;
        }, reducedMotion ? BETA_REDUCED_PULSE_CLEANUP_DELAY : BETA_PULSE_CLEANUP_DELAY);
      };

      if (button.dataset.pulsing === 'true') {
        delete button.dataset.pulsing;
        pulseFrameRef.current = window.requestAnimationFrame(startPulse);
        return;
      }

      startPulse();
    },
    [reducedMotion],
  );

  useEffect(() => {
    const html = document.documentElement;
    const body = document.body;
    html.classList.add('cass-home-locked');
    body.classList.add('cass-home-locked');
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });

    return () => {
      html.classList.remove('cass-home-locked');
      body.classList.remove('cass-home-locked');
    };
  }, []);

  useEffect(() => {
    if (reducedMotion) {
      cancelVideoProgressMonitor();
      videoStartedRef.current = false;
      setShouldLoadVideo(false);
      setVideoReady(false);
      setShowLivingBlob(false);
      setShowStaticLogo(true);
      setContentVisible(true);
      return;
    }

    setShowStaticLogo(false);
    setContentVisible(false);
    setShowLivingBlob(false);

    const connection = (
      navigator as Navigator & { readonly connection?: NetworkInformation }
    ).connection;

    if (
      connection?.saveData ||
      connection?.effectiveType === 'slow-2g' ||
      connection?.effectiveType === '2g'
    ) {
      setShowStaticLogo(true);
      setContentVisible(true);
      setShowLivingBlob(false);
      return;
    }

    // The first-frame SVG is already on screen, so start loading immediately and
    // replace it only once the video has been rewound to frame zero.
    setShouldLoadVideo(true);
  }, [cancelVideoProgressMonitor, reducedMotion]);

  useEffect(() => cancelVideoProgressMonitor, [cancelVideoProgressMonitor]);

  useEffect(() => {
    if (reducedMotion) {
      const button = betaButtonRef.current;
      button?.style.removeProperty('--mouse-x');
      button?.style.removeProperty('--mouse-y');
      spotlightReadyRef.current = false;
    }

    return () => {
      if (spotlightFrameRef.current !== null) {
        window.cancelAnimationFrame(spotlightFrameRef.current);
        spotlightFrameRef.current = null;
      }

      if (pulseFrameRef.current !== null) {
        window.cancelAnimationFrame(pulseFrameRef.current);
        pulseFrameRef.current = null;
      }

      if (pulseTimerRef.current !== null) {
        window.clearTimeout(pulseTimerRef.current);
        pulseTimerRef.current = null;
      }

      spotlightLastFrameRef.current = null;
      delete betaButtonRef.current?.dataset.pulsing;
    };
  }, [reducedMotion]);

  return (
    <main
      className={`cass-cinematic-home${contentVisible ? ' is-content-visible' : ''}`}
    >
      <div className="cass-cinematic-backdrop" aria-hidden="true">
        {!showStaticLogo ? (
          <img
            src={posterUrl}
            alt=""
            className="cass-cinematic-media cass-cinematic-poster"
            draggable="false"
            loading="eager"
            decoding="sync"
          />
        ) : null}
        {showStaticLogo ? (
          <img
            src={logoUrl}
            alt=""
            className="cass-cinematic-static-logo"
            draggable="false"
            loading="eager"
            decoding="async"
          />
        ) : null}
        {shouldLoadVideo ? (
          <video
            ref={videoRef}
            className={`cass-cinematic-media cass-cinematic-video${videoReady ? ' is-ready' : ''}`}
            src={videoUrl}
            poster={posterUrl}
            autoPlay
            muted
            playsInline
            preload="auto"
            tabIndex={-1}
            onLoadedData={handleVideoCanPlay}
            onCanPlay={handleVideoCanPlay}
            onTimeUpdate={handleVideoTimeUpdate}
            onEnded={handleVideoEnded}
            onError={handleVideoError}
          />
        ) : null}
        {showLivingBlob && videoReady ? (
          <LivingBlob
            mediaRef={videoRef}
            onComplete={handleLivingBlobComplete}
          />
        ) : null}
        <div className="cass-cinematic-vignette" />
        <div className="cass-cinematic-colour-wash" />
        <div className="cass-cinematic-grain" />
        <div className="cass-cinematic-scrim" />
      </div>

      <section className="cass-cinematic-content" aria-label="Cass landing page">
        <div className="cass-cinematic-copy">
          <h1 className="cass-cinematic-headline cass-cinematic-enter cass-cinematic-enter-headline">
            find your person
          </h1>

          <p className="cass-cinematic-subcopy cass-cinematic-enter cass-cinematic-enter-intentional">
            A more intentional dating app
          </p>

          <p className="cass-cinematic-subcopy cass-cinematic-subcopy-followup cass-cinematic-enter cass-cinematic-enter-trust">
            Built around trust and safety
          </p>

          <div
            className="cass-cinematic-action-shell cass-cinematic-enter cass-cinematic-enter-action"
            onPointerEnter={handleBetaPointerMove}
            onPointerMove={handleBetaPointerMove}
            onPointerLeave={handleBetaPointerLeave}
            onPointerCancel={handleBetaPointerLeave}
            onPointerDown={handleBetaPress}
          >
            <button
              ref={betaButtonRef}
              type="button"
              disabled
              aria-disabled="true"
              aria-label="Join the Beta — currently unavailable"
              className="cass-cinematic-beta-button"
            >
              <span className="cass-cinematic-beta-fill" aria-hidden="true" />
              <span className="cass-cinematic-beta-energy" aria-hidden="true" />
              <span className="cass-cinematic-beta-pulse" aria-hidden="true" />
              <span className="cass-cinematic-beta-edge" aria-hidden="true" />
              <span className="cass-cinematic-beta-label">Join the Beta</span>
            </button>
          </div>
        </div>
      </section>

      <footer className="cass-cinematic-footer cass-cinematic-enter cass-cinematic-enter-footer">
        <nav className="cass-cinematic-legal-links" aria-label="Legal">
          {LEGAL_LINKS.map((link) => (
            <a key={link.href} href={link.href} className="cass-cinematic-legal-link">
              {link.label}
            </a>
          ))}
        </nav>
      </footer>
    </main>
  );
}
