import {
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
} from 'react';
import {
  CASS_BLOB_POINT_COUNT,
  createCassBlobProfile,
  createCassBlobSeed,
  getCassLivingBlobPath,
} from '../../shared/cassBlobMotion';

type LivingBlobProps = {
  readonly onComplete: () => void;
};

const BLOB_MOTION_DURATION_MS = 2500;
const BLOB_FLOOD_DURATION_MS = 800;
const BLOB_FLOOD_FALLBACK_BUFFER_MS = 750;
const BLOB_FLOOD_ANIMATION_NAME = 'cass-cinematic-blob-flood';
const BLOB_CENTRE = { x: 750, y: 315 } as const;
const BLOB_INITIAL_SCALE = 0.55;

export function LivingBlob({ onComplete }: LivingBlobProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const shapeRef = useRef<SVGGElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const floodTargetRef = useRef<SVGPathElement>(null);
  const [isFlooding, setIsFlooding] = useState(false);
  const profile = useMemo(() => createCassBlobProfile(createCassBlobSeed()), []);
  const initialPath = useMemo(
    () => getCassLivingBlobPath(0, profile),
    [profile],
  );
  const floodTargetPath = useMemo(
    () =>
      getCassLivingBlobPath(
        (BLOB_MOTION_DURATION_MS + BLOB_FLOOD_DURATION_MS) / 1000,
        profile,
      ),
    [profile],
  );

  useLayoutEffect(() => {
    const svg = svgRef.current;
    const shape = shapeRef.current;
    const floodTarget = floodTargetRef.current;

    if (!svg || !shape || !floodTarget) {
      return;
    }

    const updateFloodScale = () => {
      const screenMatrix = svg.getScreenCTM();
      const home = svg.closest<HTMLElement>('.cass-cinematic-home');

      if (!screenMatrix || !home || typeof floodTarget.isPointInFill !== 'function') {
        return;
      }

      try {
        const inverseScreenMatrix = screenMatrix.inverse();
        const homeBounds = home.getBoundingClientRect();
        const corners = [
          new DOMPoint(homeBounds.left, homeBounds.top),
          new DOMPoint(homeBounds.right, homeBounds.top),
          new DOMPoint(homeBounds.right, homeBounds.bottom),
          new DOMPoint(homeBounds.left, homeBounds.bottom),
        ].map((corner) => corner.matrixTransform(inverseScreenMatrix));

        const coversViewport = (scale: number) =>
          corners.every((corner) =>
            floodTarget.isPointInFill(
              new DOMPoint(
                BLOB_CENTRE.x + (corner.x - BLOB_CENTRE.x) / scale,
                BLOB_CENTRE.y + (corner.y - BLOB_CENTRE.y) / scale,
              ),
            ),
          );

        let lowerScale = BLOB_INITIAL_SCALE;
        let upperScale = 12;

        while (!coversViewport(upperScale) && upperScale < 64) {
          upperScale *= 1.25;
        }

        if (!coversViewport(upperScale)) {
          return;
        }

        for (let iteration = 0; iteration < 24; iteration += 1) {
          const candidateScale = (lowerScale + upperScale) / 2;

          if (coversViewport(candidateScale)) {
            upperScale = candidateScale;
          } else {
            lowerScale = candidateScale;
          }
        }

        const endScale = upperScale * 1.04;

        shape.style.setProperty('--cass-blob-flood-scale-end', endScale.toFixed(3));
        svg.dataset.floodScale = endScale.toFixed(3);
      } catch {
        // The CSS aspect-ratio fallbacks remain in place if SVG geometry
        // measurement is unavailable in an older browser.
      }
    };

    updateFloodScale();
    window.addEventListener('resize', updateFloodScale);

    return () => window.removeEventListener('resize', updateFloodScale);
  }, [floodTargetPath]);

  useEffect(() => {
    let animationFrame: number | null = null;
    let floodTimer: number | null = null;
    let startedAt: number | null = null;
    let floodStartedAt: number | null = null;
    let flooding = false;
    let completed = false;
    const shape = shapeRef.current;

    const complete = () => {
      if (completed) {
        return;
      }

      completed = true;

      if (floodTimer !== null) {
        window.clearTimeout(floodTimer);
        floodTimer = null;
      }

      pathRef.current?.setAttribute('d', floodTargetPath);
      onComplete();
    };

    const handleAnimationEnd = (event: AnimationEvent) => {
      if (event.animationName === BLOB_FLOOD_ANIMATION_NAME) {
        complete();
      }
    };

    shape?.addEventListener('animationend', handleAnimationEnd);

    const animate = (timestamp: number) => {
      startedAt ??= timestamp;
      const elapsedMilliseconds = timestamp - startedAt;

      if (!flooding && elapsedMilliseconds >= BLOB_MOTION_DURATION_MS) {
        flooding = true;
        floodStartedAt = timestamp;
        setIsFlooding(true);
        floodTimer = window.setTimeout(
          complete,
          BLOB_FLOOD_DURATION_MS + BLOB_FLOOD_FALLBACK_BUFFER_MS,
        );
      }

      const morphMilliseconds = flooding && floodStartedAt !== null
        ? BLOB_MOTION_DURATION_MS + Math.min(
            timestamp - floodStartedAt,
            BLOB_FLOOD_DURATION_MS,
          )
        : Math.min(elapsedMilliseconds, BLOB_MOTION_DURATION_MS);

      pathRef.current?.setAttribute(
        'd',
        getCassLivingBlobPath(morphMilliseconds / 1000, profile),
      );

      if (!completed) {
        animationFrame = window.requestAnimationFrame(animate);
      }
    };

    animationFrame = window.requestAnimationFrame(animate);

    return () => {
      if (animationFrame !== null) {
        window.cancelAnimationFrame(animationFrame);
      }

      if (floodTimer !== null) {
        window.clearTimeout(floodTimer);
      }

      shape?.removeEventListener('animationend', handleAnimationEnd);
    };
  }, [floodTargetPath, onComplete, profile]);

  return (
    <svg
      ref={svgRef}
      aria-hidden="true"
      className="cass-cinematic-living-blob"
      data-blob-points={CASS_BLOB_POINT_COUNT}
      data-blob-seed={profile.seed}
      data-intro-phase={isFlooding ? 'flood' : 'blob'}
      data-motion-duration-ms={BLOB_MOTION_DURATION_MS}
      focusable="false"
      overflow="visible"
      preserveAspectRatio="xMidYMid meet"
      style={
        {
          '--cass-blob-flood-duration': `${BLOB_FLOOD_DURATION_MS}ms`,
        } as CSSProperties
      }
      viewBox="0 0 1500 630"
    >
      <g
        ref={shapeRef}
        className={`cass-cinematic-blob-shape${isFlooding ? ' is-flooding' : ''}`}
      >
        <path ref={pathRef} d={initialPath} fill="#ffffff" />
      </g>
      <path
        ref={floodTargetRef}
        aria-hidden="true"
        className="cass-cinematic-blob-measure"
        d={floodTargetPath}
        fill="#ffffff"
      />
    </svg>
  );
}
