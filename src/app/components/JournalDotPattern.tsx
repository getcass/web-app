import { useLayoutEffect, useRef } from 'react';
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion';

const GRID_SIZE = 22;
const DOT_RADIUS = 1.05;
const TAU = Math.PI * 2;
const PINK = '#ff23b6';
const PURPLE = '#8f5fff';

type DotColor = 'pink' | 'purple';

type PatternDot = {
  readonly edgeThreshold: number;
  readonly normalizedX: number;
  readonly normalizedY: number;
  readonly x: number;
  readonly y: number;
};

type PatternField = {
  readonly anglePhase: number;
  readonly angleSpeed: number;
  readonly angleSwing: number;
  readonly baseAngle: number;
  readonly baseX: number;
  readonly baseY: number;
  readonly color: DotColor;
  readonly driftX: number;
  readonly driftY: number;
  readonly phaseX: number;
  readonly phaseY: number;
  readonly radiusX: number;
  readonly radiusY: number;
  readonly speedX: number;
  readonly speedY: number;
  cosine: number;
  currentX: number;
  currentY: number;
  sine: number;
};

type PatternScene = {
  readonly canvas: HTMLCanvasElement;
  readonly context: CanvasRenderingContext2D;
  readonly dots: readonly PatternDot[];
  readonly fields: readonly PatternField[];
  readonly height: number;
  readonly pinkDots: PatternDot[];
  readonly purpleDots: PatternDot[];
  readonly width: number;
};

const createRandom = (seed: number) => {
  let state = seed >>> 0;

  return () => {
    state += 0x6d2b79f5;
    let value = state;
    value = Math.imul(value ^ (value >>> 15), value | 1);
    value ^= value + Math.imul(value ^ (value >>> 7), value | 61);

    return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
  };
};

const randomBetween = (random: () => number, minimum: number, maximum: number) =>
  minimum + (maximum - minimum) * random();

const createSeed = () => {
  const values = new Uint32Array(1);

  if (globalThis.crypto?.getRandomValues) {
    globalThis.crypto.getRandomValues(values);

    return values[0];
  }

  return (Date.now() ^ Math.floor(Math.random() * 0xffffffff)) >>> 0;
};

const coordinateHash = (x: number, y: number, seed: number) => {
  let hash = Math.imul(x, 374761393) ^ Math.imul(y, 668265263) ^ seed;
  hash = Math.imul(hash ^ (hash >>> 13), 1274126177);

  return ((hash ^ (hash >>> 16)) >>> 0) / 4294967295;
};

const createFields = (
  random: () => number,
  count: number,
  extentX: number,
  extentY: number,
): PatternField[] =>
  Array.from({ length: count }, (_, index) => {
    const elongated = index % 3 === 0;
    const radiusX = randomBetween(random, 0.055, 0.11) * (elongated ? 1.28 : 1);
    const radiusY = randomBetween(random, 0.05, 0.1) * (elongated ? 0.78 : 1);

    return {
      anglePhase: randomBetween(random, 0, TAU),
      angleSpeed: randomBetween(random, 0.28, 0.48),
      angleSwing: randomBetween(random, 0.18, 0.5),
      baseAngle: randomBetween(random, 0, TAU),
      baseX: randomBetween(random, -extentX * 0.72, extentX * 0.72),
      baseY: randomBetween(random, -extentY * 0.72, extentY * 0.72),
      color: index % 2 === 0 ? 'pink' : 'purple',
      driftX: randomBetween(random, 0.035, Math.max(0.04, extentX * 0.3)),
      driftY: randomBetween(random, 0.035, Math.max(0.04, extentY * 0.3)),
      phaseX: randomBetween(random, 0, TAU),
      phaseY: randomBetween(random, 0, TAU),
      radiusX,
      radiusY,
      speedX: randomBetween(random, 0.65, 0.95),
      speedY: randomBetween(random, 0.55, 0.85),
      cosine: 1,
      currentX: 0,
      currentY: 0,
      sine: 0,
    };
  });

const buildScene = (canvas: HTMLCanvasElement, seed: number): PatternScene | null => {
  const context = canvas.getContext('2d');
  const bounds = canvas.getBoundingClientRect();
  const width = Math.ceil(bounds.width);
  const height = Math.ceil(bounds.height);

  if (!context || width <= 0 || height <= 0) {
    return null;
  }

  const pixelRatio = Math.min(window.devicePixelRatio || 1, 1.5);
  canvas.width = Math.ceil(width * pixelRatio);
  canvas.height = Math.ceil(height * pixelRatio);
  context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);

  const largestDimension = Math.max(width, height);
  const extentX = width / largestDimension / 2;
  const extentY = height / largestDimension / 2;
  const random = createRandom(seed);
  const fieldCount = width >= 1000 ? 6 : width >= 600 ? 5 : 4;
  const fields = createFields(random, fieldCount, extentX, extentY);
  const dots: PatternDot[] = [];

  for (let y = 0, row = 0; y <= height; y += GRID_SIZE, row += 1) {
    for (let x = 0, column = 0; x <= width; x += GRID_SIZE, column += 1) {
      dots.push({
        edgeThreshold: 0.86 + coordinateHash(column, row, seed ^ 0x9e3779b9) * 0.26,
        normalizedX: (x - width / 2) / largestDimension,
        normalizedY: (y - height / 2) / largestDimension,
        x,
        y,
      });
    }
  }

  return {
    canvas,
    context,
    dots,
    fields,
    height,
    pinkDots: [],
    purpleDots: [],
    width,
  };
};

const drawDots = (
  context: CanvasRenderingContext2D,
  dots: readonly PatternDot[],
  color: string,
) => {
  context.beginPath();

  dots.forEach(({ x, y }) => {
    context.moveTo(x + DOT_RADIUS, y);
    context.arc(x, y, DOT_RADIUS, 0, TAU);
  });

  context.fillStyle = color;
  context.fill();
};

const paintScene = (scene: PatternScene, elapsedSeconds: number) => {
  const { context, dots, fields, pinkDots, purpleDots, width, height } = scene;
  pinkDots.length = 0;
  purpleDots.length = 0;

  fields.forEach((field) => {
    field.currentX =
      field.baseX + Math.sin(elapsedSeconds * field.speedX + field.phaseX) * field.driftX;
    field.currentY =
      field.baseY + Math.sin(elapsedSeconds * field.speedY + field.phaseY) * field.driftY;
    const angle =
      field.baseAngle +
      Math.sin(elapsedSeconds * field.angleSpeed + field.anglePhase) * field.angleSwing;
    field.cosine = Math.cos(angle);
    field.sine = Math.sin(angle);
  });

  dots.forEach((dot) => {
    let closestDistance = Number.POSITIVE_INFINITY;
    let color: DotColor | null = null;

    fields.forEach((field) => {
      const offsetX = dot.normalizedX - field.currentX;
      const offsetY = dot.normalizedY - field.currentY;
      const localX = (offsetX * field.cosine + offsetY * field.sine) / field.radiusX;
      const localY = (-offsetX * field.sine + offsetY * field.cosine) / field.radiusY;
      const distance = localX * localX + localY * localY;

      if (distance <= dot.edgeThreshold && distance < closestDistance) {
        closestDistance = distance;
        color = field.color;
      }
    });

    if (color === 'pink') {
      pinkDots.push(dot);
    } else if (color === 'purple') {
      purpleDots.push(dot);
    }
  });

  context.clearRect(0, 0, width, height);
  context.globalAlpha = 1;
  drawDots(context, purpleDots, PURPLE);
  drawDots(context, pinkDots, PINK);
};

export function JournalDotPattern() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const seedRef = useRef<number | null>(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  if (seedRef.current === null) {
    seedRef.current = createSeed();
  }

  useLayoutEffect(() => {
    const canvas = canvasRef.current;

    if (!canvas) {
      return undefined;
    }

    let animationFrame: number | null = null;
    let elapsedMilliseconds = 0;
    let lastTimestamp: number | null = null;
    let resizePending = false;
    let scene = buildScene(canvas, seedRef.current ?? 0);

    if (scene) {
      paintScene(scene, 0);
    }

    const scheduleFrame = () => {
      if (animationFrame === null) {
        animationFrame = window.requestAnimationFrame(renderFrame);
      }
    };

    const renderFrame = (timestamp: number) => {
      animationFrame = null;

      if (resizePending) {
        scene = buildScene(canvas, seedRef.current ?? 0);
        resizePending = false;
      }

      if (!prefersReducedMotion && lastTimestamp !== null) {
        elapsedMilliseconds += Math.min(timestamp - lastTimestamp, 50);
      }

      lastTimestamp = timestamp;

      if (scene) {
        paintScene(scene, elapsedMilliseconds / 1000);
      }

      if (!prefersReducedMotion && !document.hidden) {
        scheduleFrame();
      }
    };

    const handleResize = () => {
      resizePending = true;
      scheduleFrame();
    };

    const handleVisibilityChange = () => {
      if (document.hidden) {
        if (animationFrame !== null) {
          window.cancelAnimationFrame(animationFrame);
          animationFrame = null;
        }

        lastTimestamp = null;
      } else {
        scheduleFrame();
      }
    };

    const resizeObserver = typeof ResizeObserver === 'undefined'
      ? null
      : new ResizeObserver(handleResize);

    resizeObserver?.observe(canvas);
    window.addEventListener('resize', handleResize, { passive: true });
    document.addEventListener('visibilitychange', handleVisibilityChange);

    if (!prefersReducedMotion) {
      scheduleFrame();
    }

    return () => {
      resizeObserver?.disconnect();
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('visibilitychange', handleVisibilityChange);

      if (animationFrame !== null) {
        window.cancelAnimationFrame(animationFrame);
      }
    };
  }, [prefersReducedMotion]);

  return <canvas ref={canvasRef} className="cass-dot-pattern" aria-hidden="true" />;
}
