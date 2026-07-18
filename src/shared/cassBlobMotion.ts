const FRAME_RATE = 60;
const HEART_CENTER_OFFSET_Y = 224;
const LIQUID_SCALE_X = 1.552;
const LIQUID_SCALE_Y = 1.383;
const MOTION_TIME_SCALE = 1.28;
const TAU = Math.PI * 2;
const SOURCE_PERIMETER_POINT_COUNT = 12;
const PERIMETER_DENSITY_MULTIPLIER = 3;
export const CASS_BLOB_POINT_COUNT = SOURCE_PERIMETER_POINT_COUNT * PERIMETER_DENSITY_MULTIPLIER;
const HEART_CUBIC_COUNT = 4;
const HEART_SUBDIVISIONS_PER_CUBIC = CASS_BLOB_POINT_COUNT / HEART_CUBIC_COUNT;
const MOTION_SMOOTHING_RADIUS = 6;
const MOTION_SMOOTHING_SIGMA = 3;
// A soft support envelope keeps every live frame strictly convex without the
// temporal pops caused by vertices entering or leaving a hard convex hull.
const CONVEX_SUPPORT_TEMPERATURE = 4;
const CONVEX_ENVELOPE_SCALE = 0.96;

if (CONVEX_SUPPORT_TEMPERATURE <= 0 || CONVEX_ENVELOPE_SCALE <= 0) {
  throw new Error('The convex blob envelope requires positive tuning values.');
}

export const CASS_BLOB_TIMELINE = {
  exactHeartFrame: 218,
  handoffFrame: 224,
  morphStartFrame: 112,
} as const;

type Point = {
  readonly x: number;
  readonly y: number;
};

type AnchorMotion = {
  readonly phase: number;
  readonly radialAmplitude: number;
  readonly radialPeriod: number;
  readonly secondaryPeriod: number;
  readonly tangentialAmplitude: number;
  readonly tangentialPeriod: number;
};

type LobeMotion = {
  readonly amplitude: number;
  readonly harmonic: number;
  readonly phase: number;
  readonly speed: number;
};

type LocalMotion = {
  readonly amplitude: number;
  readonly anchor: number;
  readonly drift: number;
  readonly endFrame: number;
  readonly peakFrame: number;
  readonly startFrame: number;
  readonly tangentialPull: number;
  readonly width: number;
};

type MotionVector = {
  readonly radial: number;
  readonly tangential: number;
};

export type CassBlobProfile = {
  readonly anchors: readonly AnchorMotion[];
  readonly baseJitter: readonly number[];
  readonly localMotions: readonly LocalMotion[];
  readonly lobes: readonly LobeMotion[];
  readonly seed: string;
  readonly spin: {
    readonly baseRate: number;
    readonly phaseA: number;
    readonly phaseB: number;
    readonly strengthA: number;
    readonly strengthB: number;
    readonly speedA: number;
    readonly speedB: number;
  };
  readonly stretch: {
    readonly phaseA: number;
    readonly phaseB: number;
    readonly periodA: number;
    readonly periodB: number;
  };
};

const BASE_BLOB_RADII_TEMPLATE = [1, 1.018, 1.034, 1.012, 0.992, 1.02, 0.982, 1.01, 1.03, 1.002, 0.986, 1.014] as const;

const samplePeriodicCatmull = (values: readonly number[], position: number) => {
  const count = values.length;
  const index = Math.floor(position);
  const progress = position - index;
  const sample = (offset: number) => values[(((index + offset) % count) + count) % count];
  const previous = sample(-1);
  const current = sample(0);
  const next = sample(1);
  const after = sample(2);
  const progressSquared = progress * progress;
  const progressCubed = progressSquared * progress;

  return (
    0.5 *
    (2 * current +
      (-previous + next) * progress +
      (2 * previous - 5 * current + 4 * next - after) * progressSquared +
      (-previous + 3 * current - 3 * next + after) * progressCubed)
  );
};

const BASE_BLOB_RADII = Array.from({ length: CASS_BLOB_POINT_COUNT }, (_, index) =>
  samplePeriodicCatmull(BASE_BLOB_RADII_TEMPLATE, index / PERIMETER_DENSITY_MULTIPLIER),
);

const HEART_POINTS: readonly Point[] = [
  { x: 748.469, y: 53.1686 },
  { x: 767.28, y: 6.45639 },
  { x: 815.156, y: -18.6227 },
  { x: 850.765, y: 16.4746 },
  { x: 916.955, y: 81.5301 },
  { x: 751.121, y: 200.078 },
  { x: 751.121, y: 200.078 },
  { x: 666.812, y: 131.087 },
  { x: 605.756, y: 71.9278 },
  { x: 655.326, y: 19.1259 },
  { x: 683.105, y: -10.5204 },
  { x: 729.019, y: 8.55807 },
  { x: 748.469, y: 53.1686 },
];

const clamp01 = (value: number) => Math.min(Math.max(value, 0), 1);

const smootherstep = (value: number) => {
  const progress = clamp01(value);

  return progress * progress * progress * (progress * (progress * 6 - 15) + 10);
};

const timelineProgress = (frame: number, start: number, end: number) => smootherstep((frame - start) / (end - start));

const lerp = (from: number, to: number, progress: number) => from + (to - from) * progress;

const lerpPoint = (from: Point, to: Point, progress: number): Point => ({
  x: lerp(from.x, to.x, progress),
  y: lerp(from.y, to.y, progress),
});

const vectorBetween = (from: Point, to: Point): Point => ({
  x: to.x - from.x,
  y: to.y - from.y,
});

const vectorLength = (vector: Point) => Math.hypot(vector.x, vector.y);

const offsetPoints = (points: readonly Point[], yOffset: number) => points.map(({ x, y }) => ({ x, y: y + yOffset }));

const splitCubicAt = (start: Point, controlA: Point, controlB: Point, end: Point, progress: number) => {
  const firstA = lerpPoint(start, controlA, progress);
  const firstB = lerpPoint(controlA, controlB, progress);
  const firstC = lerpPoint(controlB, end, progress);
  const secondA = lerpPoint(firstA, firstB, progress);
  const secondB = lerpPoint(firstB, firstC, progress);
  const division = lerpPoint(secondA, secondB, progress);

  return {
    left: [start, firstA, secondA, division] as const,
    right: [division, secondB, firstC, end] as const,
  };
};

const splitCubicsEvenly = (points: readonly Point[], subdivisionsPerCubic: number) => {
  if ((points.length - 1) % 3 !== 0) {
    throw new Error('A cubic path must contain 1 + 3n points.');
  }

  if (!Number.isInteger(subdivisionsPerCubic) || subdivisionsPerCubic < 1) {
    throw new Error('Cubic subdivisions must be a positive integer.');
  }

  const split: Point[] = [points[0]];
  const cubicCount = (points.length - 1) / 3;

  for (let segment = 0; segment < cubicCount; segment += 1) {
    let remaining = [
      points[segment * 3],
      points[segment * 3 + 1],
      points[segment * 3 + 2],
      points[segment * 3 + 3],
    ] as const;

    for (let subdivisionsLeft = subdivisionsPerCubic; subdivisionsLeft > 1; subdivisionsLeft -= 1) {
      const current = splitCubicAt(remaining[0], remaining[1], remaining[2], remaining[3], 1 / subdivisionsLeft);

      split.push(current.left[1], current.left[2], current.left[3]);
      remaining = current.right;
    }

    split.push(remaining[1], remaining[2], remaining[3]);
  }

  return split;
};

const HEART_TARGET_POINTS = offsetPoints(
  splitCubicsEvenly(HEART_POINTS, HEART_SUBDIVISIONS_PER_CUBIC),
  HEART_CENTER_OFFSET_Y,
);
const EXPECTED_CUBIC_POINT_COUNT = 1 + CASS_BLOB_POINT_COUNT * 3;

if (HEART_TARGET_POINTS.length !== EXPECTED_CUBIC_POINT_COUNT) {
  throw new Error('The dense blob and heart paths must use matching point counts.');
}

const HEART_SMOOTH_JOIN_INDICES = [HEART_SUBDIVISIONS_PER_CUBIC, HEART_SUBDIVISIONS_PER_CUBIC * 3] as const;

const tangentAngle = (incoming: Point, outgoing: Point) => {
  const incomingLength = vectorLength(incoming);
  const outgoingLength = vectorLength(outgoing);
  const x = incoming.x / incomingLength + outgoing.x / outgoingLength;
  const y = incoming.y / incomingLength + outgoing.y / outgoingLength;

  return Math.atan2(y, x);
};

const morphCubicPaths = (from: readonly Point[], to: readonly Point[], progress: number) => {
  if (progress === 0) {
    return from;
  }

  const morphed = from.map((point, index) => lerpPoint(point, to[index], progress));

  // The two rounded side joins in the supplied heart are G1-continuous but
  // use unequal incoming and outgoing handle lengths. Interpolating those
  // controls independently can briefly misalign their tangents, so morph the
  // shared direction and the two lengths separately. The cleft and tip remain
  // untouched because their sharpness is intentional.
  HEART_SMOOTH_JOIN_INDICES.forEach((joinIndex) => {
    const anchorPointIndex = joinIndex * 3;
    const incomingPointIndex = anchorPointIndex - 1;
    const outgoingPointIndex = anchorPointIndex + 1;
    const fromAnchor = from[anchorPointIndex];
    const toAnchor = to[anchorPointIndex];
    const fromIncoming = vectorBetween(from[incomingPointIndex], fromAnchor);
    const fromOutgoing = vectorBetween(fromAnchor, from[outgoingPointIndex]);
    const toIncoming = vectorBetween(to[incomingPointIndex], toAnchor);
    const toOutgoing = vectorBetween(toAnchor, to[outgoingPointIndex]);
    const fromAngle = tangentAngle(fromIncoming, fromOutgoing);
    const toAngle = tangentAngle(toIncoming, toOutgoing);
    const angleDelta = Math.atan2(Math.sin(toAngle - fromAngle), Math.cos(toAngle - fromAngle));
    const angle = fromAngle + angleDelta * progress;
    const tangent = { x: Math.cos(angle), y: Math.sin(angle) };
    const incomingLength = lerp(vectorLength(fromIncoming), vectorLength(toIncoming), progress);
    const outgoingLength = lerp(vectorLength(fromOutgoing), vectorLength(toOutgoing), progress);
    const anchor = morphed[anchorPointIndex];

    morphed[incomingPointIndex] = {
      x: anchor.x - tangent.x * incomingLength,
      y: anchor.y - tangent.y * incomingLength,
    };
    morphed[outgoingPointIndex] = {
      x: anchor.x + tangent.x * outgoingLength,
      y: anchor.y + tangent.y * outgoingLength,
    };
  });

  return morphed;
};

const getConvexEnvelopeControls = (points: readonly Point[]) =>
  Array.from({ length: CASS_BLOB_POINT_COUNT }, (_, index) => {
    const angle = -Math.PI / 2 + (index / CASS_BLOB_POINT_COUNT) * TAU;
    const normal = { x: Math.cos(angle), y: Math.sin(angle) };
    const tangent = { x: -normal.y, y: normal.x };
    const samples = points.map((point) => {
      const x = point.x - 750;
      const y = point.y - 315;

      return {
        support: x * normal.x + y * normal.y,
        tangent: x * tangent.x + y * tangent.y,
      };
    });
    const maximumSupport = Math.max(...samples.map((sample) => sample.support));
    const weighted = samples.map((sample) => ({
      ...sample,
      weight: Math.exp((sample.support - maximumSupport) / CONVEX_SUPPORT_TEMPERATURE),
    }));
    const weightTotal = weighted.reduce((total, sample) => total + sample.weight, 0);
    // Do not normalize the log-sum-exp by the point count: its positive offset
    // is part of the strict h + h'' > 0 curvature guarantee.
    const support = maximumSupport + CONVEX_SUPPORT_TEMPERATURE * Math.log(weightTotal);
    const supportDerivative =
      weighted.reduce((total, sample) => total + sample.tangent * sample.weight, 0) / weightTotal;

    return {
      x: 750 + (normal.x * support + tangent.x * supportDerivative) * CONVEX_ENVELOPE_SCALE,
      y: 315 + (normal.y * support + tangent.y * supportDerivative) * CONVEX_ENVELOPE_SCALE,
    };
  });

const convexControlsToCubics = (controls: readonly Point[]) => {
  const pointAt = (index: number) => controls[((index % controls.length) + controls.length) % controls.length];
  const startPrevious = pointAt(-1);
  const startCurrent = pointAt(0);
  const startNext = pointAt(1);
  // A periodic uniform cubic B-spline is C2-continuous and
  // convexity-preserving, removing corners without reintroducing dents.
  const points: Point[] = [
    {
      x: (startPrevious.x + startCurrent.x * 4 + startNext.x) / 6,
      y: (startPrevious.y + startCurrent.y * 4 + startNext.y) / 6,
    },
  ];

  for (let index = 0; index < controls.length; index += 1) {
    const current = pointAt(index);
    const next = pointAt(index + 1);
    const after = pointAt(index + 2);

    points.push(
      {
        x: (current.x * 2 + next.x) / 3,
        y: (current.y * 2 + next.y) / 3,
      },
      {
        x: (current.x + next.x * 2) / 3,
        y: (current.y + next.y * 2) / 3,
      },
      {
        x: (current.x + next.x * 4 + after.x) / 6,
        y: (current.y + next.y * 4 + after.y) / 6,
      },
    );
  }

  return points;
};

const buildCubicPath = (points: readonly Point[]) => {
  const point = (index: number) => {
    const current = points[index];

    return `${current.x.toFixed(3)} ${current.y.toFixed(3)}`;
  };
  const curves: string[] = [`M${point(0)}`];

  for (let index = 1; index < points.length; index += 3) {
    curves.push(`C${point(index)} ${point(index + 1)} ${point(index + 2)}`);
  }

  return `${curves.join('')}Z`;
};

const xmur3 = (value: string) => {
  let hash = 1779033703 ^ value.length;

  for (let index = 0; index < value.length; index += 1) {
    hash = Math.imul(hash ^ value.charCodeAt(index), 3432918353);
    hash = (hash << 13) | (hash >>> 19);
  }

  return () => {
    hash = Math.imul(hash ^ (hash >>> 16), 2246822507);
    hash = Math.imul(hash ^ (hash >>> 13), 3266489909);

    return (hash ^= hash >>> 16) >>> 0;
  };
};

const sfc32 = (a: number, b: number, c: number, d: number) => () => {
  a |= 0;
  b |= 0;
  c |= 0;
  d |= 0;
  const result = (((a + b) | 0) + d) | 0;
  d = (d + 1) | 0;
  a = b ^ (b >>> 9);
  b = (c + (c << 3)) | 0;
  c = (c << 21) | (c >>> 11);
  c = (c + result) | 0;

  return (result >>> 0) / 4294967296;
};

const createRandom = (seed: string) => {
  const hash = xmur3(seed);

  return sfc32(hash(), hash(), hash(), hash());
};

const randomBetween = (random: () => number, min: number, max: number) => min + (max - min) * random();

const randomSign = (random: () => number) => (random() < 0.5 ? -1 : 1);

const unnormalizedMotionKernel = Array.from({ length: MOTION_SMOOTHING_RADIUS * 2 + 1 }, (_, index) => {
  const offset = index - MOTION_SMOOTHING_RADIUS;

  return {
    offset,
    weight: Math.exp(-(offset * offset) / (2 * MOTION_SMOOTHING_SIGMA * MOTION_SMOOTHING_SIGMA)),
  };
});
const motionKernelWeight = unnormalizedMotionKernel.reduce((total, entry) => total + entry.weight, 0);
const MOTION_SMOOTHING_KERNEL = unnormalizedMotionKernel.map((entry) => ({
  offset: entry.offset,
  weight: entry.weight / motionKernelWeight,
}));

const circularIndex = (index: number, count: number) => ((index % count) + count) % count;

const smoothCircularValues = (values: readonly number[]) =>
  values.map((_, index) =>
    MOTION_SMOOTHING_KERNEL.reduce(
      (total, entry) => total + values[circularIndex(index + entry.offset, values.length)] * entry.weight,
      0,
    ),
  );

const smoothCircularMotion = (motions: readonly MotionVector[]) =>
  motions.map((_, index) =>
    MOTION_SMOOTHING_KERNEL.reduce(
      (total, entry) => {
        const motion = motions[circularIndex(index + entry.offset, motions.length)];

        return {
          radial: total.radial + motion.radial * entry.weight,
          tangential: total.tangential + motion.tangential * entry.weight,
        };
      },
      { radial: 0, tangential: 0 },
    ),
  );

export const createCassBlobSeed = () => {
  const values = new Uint32Array(4);

  if (globalThis.crypto?.getRandomValues) {
    globalThis.crypto.getRandomValues(values);
  } else {
    const fallback = Date.now() ^ Math.floor(performance.now() * 1000);
    values.set([fallback, fallback * 2654435761, fallback ^ 0x9e3779b9, fallback >>> 7]);
  }

  return Array.from(values, (value) => value.toString(16).padStart(8, '0')).join('-');
};

export const createCassBlobProfile = (seed: string): CassBlobProfile => {
  const random = createRandom(seed);
  const lobeAmplitudes = [randomBetween(random, 34, 42), randomBetween(random, 26, 34)];
  const baseJitterDrivers = Array.from({ length: SOURCE_PERIMETER_POINT_COUNT }, () =>
    randomBetween(random, 0.97, 1.03),
  );
  const smoothedBaseJitter = smoothCircularValues(
    BASE_BLOB_RADII.map((_, index) => samplePeriodicCatmull(baseJitterDrivers, index / PERIMETER_DENSITY_MULTIPLIER)),
  );
  const meanBaseJitter = smoothedBaseJitter.reduce((total, value) => total + value, 0) / smoothedBaseJitter.length;
  const baseJitter = smoothedBaseJitter.map((value) => value / meanBaseJitter);

  return {
    seed,
    anchors: Array.from({ length: SOURCE_PERIMETER_POINT_COUNT }, () => ({
      phase: randomBetween(random, 0, TAU),
      radialAmplitude: randomBetween(random, 8, 14),
      radialPeriod: randomBetween(random, 1.55, 2.8),
      secondaryPeriod: randomBetween(random, 2.8, 4.6),
      tangentialAmplitude: randomBetween(random, 3, 6),
      tangentialPeriod: randomBetween(random, 2, 3.6),
    })),
    baseJitter,
    lobes: [2, 3].map((harmonic, index) => ({
      amplitude: lobeAmplitudes[index],
      harmonic,
      phase: randomBetween(random, 0, TAU),
      speed: randomSign(random) * randomBetween(random, index === 0 ? 0.8 : 0.5, index === 0 ? 1.25 : 0.9),
    })),
    localMotions: Array.from({ length: 8 }, (_, index) => {
      const startFrame = -12 + index * 19 + randomBetween(random, -5, 5);
      const duration = randomBetween(random, 64, 90);
      const isBulge = index % 2 === 0;

      return {
        amplitude: (isBulge ? 1 : -1) * randomBetween(random, isBulge ? 46 : 40, isBulge ? 60 : 52),
        anchor: randomBetween(random, 0, BASE_BLOB_RADII.length),
        drift: randomSign(random) * randomBetween(random, 3, 7.2),
        endFrame: startFrame + duration,
        peakFrame: startFrame + duration * randomBetween(random, 0.4, 0.58),
        startFrame,
        tangentialPull: randomSign(random) * randomBetween(random, 2.5, 5),
        width: randomBetween(random, 4.5, 6),
      };
    }),
    spin: {
      baseRate: randomSign(random) * randomBetween(random, 0.26, 0.46),
      phaseA: randomBetween(random, 0, TAU),
      phaseB: randomBetween(random, 0, TAU),
      strengthA: randomBetween(random, 0.18, 0.28),
      strengthB: randomBetween(random, 0.07, 0.12),
      speedA: randomBetween(random, 0.38, 0.65),
      speedB: randomBetween(random, 0.7, 1.05),
    },
    stretch: {
      phaseA: randomBetween(random, 0, TAU),
      phaseB: randomBetween(random, 0, TAU),
      periodA: randomBetween(random, 1.8, 2.8),
      periodB: randomBetween(random, 2.8, 4.2),
    },
  };
};

const circularDistance = (from: number, to: number, count: number) => {
  const normalizedTo = ((to % count) + count) % count;
  const direct = Math.abs(from - normalizedTo);

  return Math.min(direct, count - direct);
};

const localEnvelope = (frame: number, motion: LocalMotion) => {
  if (frame <= motion.startFrame || frame >= motion.endFrame) {
    return 0;
  }

  if (frame < motion.peakFrame) {
    return smootherstep((frame - motion.startFrame) / (motion.peakFrame - motion.startFrame));
  }

  return 1 - smootherstep((frame - motion.peakFrame) / (motion.endFrame - motion.peakFrame));
};

const getLocalMotion = (frame: number, anchorIndex: number, motions: readonly LocalMotion[]) =>
  motions.reduce(
    (total, motion) => {
      const envelope = localEnvelope(frame, motion);

      if (envelope === 0) {
        return total;
      }

      const travel = smootherstep((frame - motion.startFrame) / (motion.endFrame - motion.startFrame));
      const centre = motion.anchor + motion.drift * travel;
      const distance = circularDistance(anchorIndex, centre, BASE_BLOB_RADII.length);
      const spatialWeight = Math.exp(-(distance * distance) / (2 * motion.width * motion.width));

      return {
        radial: total.radial + motion.amplitude * envelope * spatialWeight,
        tangential: total.tangential + motion.tangentialPull * envelope * spatialWeight,
      };
    },
    { radial: 0, tangential: 0 },
  );

const softLimit = (value: number, limit: number) => limit * Math.tanh(value / limit);

const getLivingPoints = (
  mediaTime: number,
  profile: CassBlobProfile,
  morphToHeart: boolean,
) => {
  const frame = mediaTime * FRAME_RATE;
  const seconds = mediaTime * MOTION_TIME_SCALE;
  const entry = timelineProgress(frame, 0, 22);
  const heartProgress = morphToHeart
    ? timelineProgress(
        frame,
        CASS_BLOB_TIMELINE.morphStartFrame,
        CASS_BLOB_TIMELINE.exactHeartFrame,
      )
    : 0;

  if (morphToHeart && frame >= CASS_BLOB_TIMELINE.exactHeartFrame) {
    return HEART_TARGET_POINTS;
  }

  const stretch =
    (Math.sin((seconds / profile.stretch.periodA) * TAU + profile.stretch.phaseA) * 0.045 +
      Math.sin((seconds / profile.stretch.periodB) * TAU + profile.stretch.phaseB) * 0.018) *
    entry;
  const scaleX = LIQUID_SCALE_X * Math.exp(stretch);
  const scaleY = LIQUID_SCALE_Y * Math.exp(-stretch);
  const rawRotation =
    profile.spin.baseRate * mediaTime +
    profile.spin.strengthA *
      (Math.sin(mediaTime * profile.spin.speedA + profile.spin.phaseA) - Math.sin(profile.spin.phaseA)) +
    profile.spin.strengthB *
      (Math.sin(mediaTime * profile.spin.speedB + profile.spin.phaseB) - Math.sin(profile.spin.phaseB));
  // Settle the seeded spin as the heart morph begins. Rotating one shape while
  // linearly matching it to a fixed target can twist otherwise smooth cubics.
  const rotation = rawRotation * entry * (1 - heartProgress);

  // Twelve independently seeded motion drivers are interpolated around the
  // 36-point ring. The extra geometry increases contour resolution without
  // introducing tiny, uncorrelated ripples between neighbouring points.
  const driverMotion = profile.anchors.map((motion) => ({
    radial:
      Math.sin((seconds / motion.radialPeriod) * TAU + motion.phase) * motion.radialAmplitude +
      Math.sin((seconds / motion.secondaryPeriod) * TAU + motion.phase + 1.73) * motion.radialAmplitude * 0.42,
    tangential:
      Math.sin((seconds / motion.tangentialPeriod) * TAU + motion.phase * 0.71 + 2.2) * motion.tangentialAmplitude,
  }));
  const driverRadial = driverMotion.map((motion) => motion.radial);
  const driverTangential = driverMotion.map((motion) => motion.tangential);
  const rawMotion = BASE_BLOB_RADII.map((_, index) => {
    const angle = -Math.PI / 2 + (index / BASE_BLOB_RADII.length) * TAU;
    const driverPosition = index / PERIMETER_DENSITY_MULTIPLIER;
    const independentRadial = samplePeriodicCatmull(driverRadial, driverPosition);
    const lobeRadial = profile.lobes.reduce(
      (total, lobe) => total + Math.sin(lobe.harmonic * angle + lobe.speed * seconds + lobe.phase) * lobe.amplitude,
      0,
    );
    const independentTangential = samplePeriodicCatmull(driverTangential, driverPosition);
    const local = getLocalMotion(frame, index, profile.localMotions);

    return {
      radial: independentRadial + lobeRadial + local.radial,
      tangential: independentTangential + local.tangential,
    };
  });

  // The 13-tap Gaussian spans the same angular distance as the former
  // five-tap filter on a 12-point ring. This prevents the threefold denser
  // contour from introducing small, fast ripples between adjacent anchors.
  const softened = smoothCircularMotion(rawMotion);
  const meanRadial = softened.reduce((sum, motion) => sum + motion.radial, 0) / softened.length;
  const meanTangential = softened.reduce((sum, motion) => sum + motion.tangential, 0) / softened.length;
  const bounded = softened.map((motion) => ({
    radial: softLimit(motion.radial - meanRadial, 64),
    tangential: softLimit(motion.tangential - meanTangential, 14),
  }));
  const boundedMeanRadial = bounded.reduce((sum, motion) => sum + motion.radial, 0) / bounded.length;
  const boundedMeanTangential = bounded.reduce((sum, motion) => sum + motion.tangential, 0) / bounded.length;
  const rawOffsets = bounded.map((motion, index) => {
    const angle = -Math.PI / 2 + (index / bounded.length) * TAU;
    const radial = (motion.radial - boundedMeanRadial) * 1.18;
    const tangential = (motion.tangential - boundedMeanTangential) * 0.66;

    return {
      x: Math.cos(angle) * radial - Math.sin(angle) * tangential,
      y: Math.sin(angle) * radial + Math.cos(angle) * tangential,
    };
  });
  const meanOffset = rawOffsets.reduce(
    (total, point) => ({
      x: total.x + point.x / rawOffsets.length,
      y: total.y + point.y / rawOffsets.length,
    }),
    { x: 0, y: 0 },
  );
  const cosine = Math.cos(rotation);
  const sine = Math.sin(rotation);
  const anchors = BASE_BLOB_RADII.map((radius, index) => {
    const angle = -Math.PI / 2 + (index / BASE_BLOB_RADII.length) * TAU;
    const seededRadius = radius * lerp(1, profile.baseJitter[index], entry);
    const offset = rawOffsets[index];
    const localX = Math.cos(angle) * 74 * scaleX * seededRadius + (offset.x - meanOffset.x) * entry;
    const localY = Math.sin(angle) * 66 * scaleY * seededRadius + (offset.y - meanOffset.y) * entry;

    return {
      x: 750 + localX * cosine - localY * sine,
      y: 315 + localX * sine + localY * cosine,
    };
  });
  const livingPoints = convexControlsToCubics(getConvexEnvelopeControls(anchors));

  if (livingPoints.length !== HEART_TARGET_POINTS.length) {
    throw new Error('The living blob and heart paths must use matching point counts.');
  }

  return morphCubicPaths(livingPoints, HEART_TARGET_POINTS, heartProgress);
};

export const getCassBlobPath = (mediaTime: number, profile: CassBlobProfile) =>
  buildCubicPath(getLivingPoints(Math.max(mediaTime, 0), profile, true));

export const getCassLivingBlobPath = (
  mediaTime: number,
  profile: CassBlobProfile,
) => buildCubicPath(getLivingPoints(Math.max(mediaTime, 0), profile, false));
