import { useEffect, useState } from 'react';
import logoUrl from '../../assets/logo.svg';
import posterUrl from '../../assets/cass-sizzle-poster.jpg';
import videoUrl from '../../assets/cass-sizzle.mp4';
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion';

const LEGAL_LINKS = [
  { href: 'terms/', label: 'Terms' },
  { href: 'privacy/', label: 'Privacy' },
] as const;

type NetworkInformation = {
  readonly effectiveType?: string;
  readonly saveData?: boolean;
};

export function LandingDeck() {
  const reducedMotion = usePrefersReducedMotion();
  const [shouldLoadVideo, setShouldLoadVideo] = useState(false);
  const [videoReady, setVideoReady] = useState(false);

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
      setShouldLoadVideo(false);
      setVideoReady(false);
      return;
    }

    const connection = (
      navigator as Navigator & { readonly connection?: NetworkInformation }
    ).connection;

    if (
      connection?.saveData ||
      connection?.effectiveType === 'slow-2g' ||
      connection?.effectiveType === '2g'
    ) {
      return;
    }

    const startVideoLoad = () => setShouldLoadVideo(true);

    if (typeof window.requestIdleCallback === 'function') {
      const idleId = window.requestIdleCallback(startVideoLoad, { timeout: 700 });
      return () => window.cancelIdleCallback(idleId);
    }

    const timerId = window.setTimeout(startVideoLoad, 180);
    return () => window.clearTimeout(timerId);
  }, [reducedMotion]);

  return (
    <main className="cass-cinematic-home">
      <div className="cass-cinematic-backdrop" aria-hidden="true">
        <img
          src={posterUrl}
          alt=""
          className="cass-cinematic-media cass-cinematic-poster"
          draggable="false"
          loading="eager"
          fetchPriority="high"
          decoding="async"
        />
        {shouldLoadVideo ? (
          <video
            className={`cass-cinematic-media cass-cinematic-video${videoReady ? ' is-ready' : ''}`}
            src={videoUrl}
            poster={posterUrl}
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            tabIndex={-1}
            onPlaying={() => setVideoReady(true)}
            onError={() => setShouldLoadVideo(false)}
          />
        ) : null}
        <div className="cass-cinematic-vignette" />
        <div className="cass-cinematic-colour-wash" />
        <div className="cass-cinematic-grain" />
        <div className="cass-cinematic-scrim" />
      </div>

      <section className="cass-cinematic-content" aria-label="Cass landing page">
        <div className="cass-cinematic-copy">
          <img
            src={logoUrl}
            alt="Cass"
            className="cass-cinematic-logo cass-cinematic-enter cass-cinematic-enter-logo"
            draggable="false"
          />

          <h1 className="cass-cinematic-headline cass-cinematic-enter cass-cinematic-enter-headline">
            find your person
          </h1>

          <p className="cass-cinematic-subcopy cass-cinematic-enter cass-cinematic-enter-subcopy">
            A more intentional dating app, optimised for trust and safety
          </p>

          <div className="cass-cinematic-action-shell cass-cinematic-enter cass-cinematic-enter-action">
            <button
              type="button"
              disabled
              aria-disabled="true"
              aria-label="Join the Beta — currently unavailable"
              className="cass-cinematic-beta-button"
            >
              <span className="cass-cinematic-beta-fill" aria-hidden="true" />
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
