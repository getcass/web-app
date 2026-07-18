import { useEffect } from 'react';
import logoUrl from '../../assets/logo.svg';
import { JournalDotPattern } from './JournalDotPattern';

const LEGAL_LINKS = [
  { href: 'terms/', label: 'Terms' },
  { href: 'privacy/', label: 'Privacy' },
] as const;

export function LandingDeck() {
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

  return (
    <main className="cass-cinematic-home">
      <div className="cass-cinematic-backdrop" aria-hidden="true">
        <div className="cass-journal-background" aria-hidden="true">
          <div className="cass-dot-field" />
          <JournalDotPattern />
        </div>
      </div>

      <div className="cass-cinematic-logo-layer">
        <img
          src={logoUrl}
          alt="Cass"
          className="cass-cinematic-static-logo"
          draggable="false"
          loading="eager"
          decoding="sync"
        />
      </div>

      <h1 className="cass-cinematic-headline cass-cinematic-enter cass-cinematic-enter-headline">
        find your person
      </h1>

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
