# Archived scrolling homepage

This folder preserves the six-section snap-scroll homepage replaced by the
single-screen cinematic landing page in July 2026.

It contains the former `LandingDeck`, section copy, product showcase, hero,
all scroll-only imagery, and the matching stylesheet. Nothing in the active
application imports this archive.

To restore it, move `LandingDeck.tsx`, `AboutContent.tsx`, and
`ProductShowcase.tsx` back to `src/app/components/`, restore `index.css` to
`src/styles/index.css`, move the archived assets back to `src/assets/`, and
update the imports to their original relative paths.
