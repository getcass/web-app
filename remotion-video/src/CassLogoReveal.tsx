import type { CSSProperties } from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { WORDMARK_PATHS } from "./logoPaths";

export const CASS_LOGO_REVEAL = {
  durationInFrames: 336,
  fps: 60,
  height: 630,
  width: 1500,
} as const;

const CLAMP = {
  extrapolateLeft: "clamp",
  extrapolateRight: "clamp",
} as const;

const TIMELINE = {
  motionAwake: 16,
  morphStart: 112,
  heartBuilt: 218,
  heartLiftStart: 232,
  wordmarkStart: 238,
  wordmarkEnd: 266,
  assembledHoldEnd: 286,
  finalMoveEnd: 322,
} as const;

const INTRO_SCALE = 0.62;
const FINAL_SCALE = 0.54;
const HEART_CENTER_OFFSET_Y = 224;
const LIQUID_SCALE_X = 1.552;
const LIQUID_SCALE_Y = 1.383;
const MOTION_TIME_SCALE = 1.18;
const TAU = Math.PI * 2;

type Point = {
  readonly x: number;
  readonly y: number;
};

type AnchorMotion = {
  readonly inertia: number;
  readonly phase: number;
  readonly radialAmplitude: number;
  readonly radialPeriod: number;
  readonly secondaryPeriod: number;
  readonly tangentialAmplitude: number;
  readonly tangentialPeriod: number;
};

type BulgeMotion = {
  readonly amplitude: number;
  readonly anchor: number;
  readonly drift: number;
  readonly endFrame: number;
  readonly peakFrame: number;
  readonly startFrame: number;
  readonly tangentialPull: number;
  readonly width: number;
};

const BASE_BLOB_RADII = [
  1, 1.018, 1.034, 1.012, 0.992, 1.02, 0.982, 1.01, 1.03, 1.002, 0.986, 1.014,
] as const;

// Each edge region has its own deliberately non-matching pace. The primary,
// secondary, and tangential periods never resolve together during the reveal,
// while the short sample history gives faster motion the drag of a dense gel.
const ANCHOR_MOTIONS: readonly AnchorMotion[] = [
  {
    inertia: 0.1,
    phase: 0.2,
    radialAmplitude: 16.2,
    radialPeriod: 4.1,
    secondaryPeriod: 7.4,
    tangentialAmplitude: 4.8,
    tangentialPeriod: 5.2,
  },
  {
    inertia: 0.13,
    phase: 2.17,
    radialAmplitude: 19.1,
    radialPeriod: 4.7,
    secondaryPeriod: 8.9,
    tangentialAmplitude: 5.8,
    tangentialPeriod: 5.8,
  },
  {
    inertia: 0.09,
    phase: 4.44,
    radialAmplitude: 21.8,
    radialPeriod: 3.8,
    secondaryPeriod: 6.8,
    tangentialAmplitude: 6.6,
    tangentialPeriod: 5.1,
  },
  {
    inertia: 0.15,
    phase: 1.29,
    radialAmplitude: 16.9,
    radialPeriod: 5.2,
    secondaryPeriod: 9.6,
    tangentialAmplitude: 5,
    tangentialPeriod: 6.7,
  },
  {
    inertia: 0.11,
    phase: 3.7,
    radialAmplitude: 20.7,
    radialPeriod: 4.3,
    secondaryPeriod: 7.9,
    tangentialAmplitude: 6.3,
    tangentialPeriod: 4.9,
  },
  {
    inertia: 0.16,
    phase: 5.58,
    radialAmplitude: 18,
    radialPeriod: 5.6,
    secondaryPeriod: 8.4,
    tangentialAmplitude: 4.9,
    tangentialPeriod: 7.2,
  },
  {
    inertia: 0.12,
    phase: 2.81,
    radialAmplitude: 22,
    radialPeriod: 4.5,
    secondaryPeriod: 9.1,
    tangentialAmplitude: 6.7,
    tangentialPeriod: 5.5,
  },
  {
    inertia: 0.1,
    phase: 4.96,
    radialAmplitude: 16.6,
    radialPeriod: 3.95,
    secondaryPeriod: 7.2,
    tangentialAmplitude: 5.1,
    tangentialPeriod: 6.2,
  },
  {
    inertia: 0.15,
    phase: 1.77,
    radialAmplitude: 21,
    radialPeriod: 5.35,
    secondaryPeriod: 9.8,
    tangentialAmplitude: 6.4,
    tangentialPeriod: 4.8,
  },
  {
    inertia: 0.12,
    phase: 4.05,
    radialAmplitude: 17.5,
    radialPeriod: 4.65,
    secondaryPeriod: 8.1,
    tangentialAmplitude: 5.4,
    tangentialPeriod: 7.4,
  },
  {
    inertia: 0.09,
    phase: 0.91,
    radialAmplitude: 21.4,
    radialPeriod: 3.75,
    secondaryPeriod: 6.9,
    tangentialAmplitude: 6.6,
    tangentialPeriod: 5.7,
  },
  {
    inertia: 0.14,
    phase: 3.22,
    radialAmplitude: 16.8,
    radialPeriod: 5.05,
    secondaryPeriod: 9.3,
    tangentialAmplitude: 4.9,
    tangentialPeriod: 6.5,
  },
];

// Shorter overlapping swells alternate around the perimeter, so the liquid is
// always redirecting rather than following one dominant expansion. Their eased
// envelopes still let each bulge gather, carry momentum, and settle softly.
const BULGE_MOTIONS: readonly BulgeMotion[] = [
  {
    amplitude: 18.5,
    anchor: 11.3,
    drift: 1.9,
    endFrame: 58,
    peakFrame: 22,
    startFrame: 0,
    tangentialPull: 3.5,
    width: 1.15,
  },
  {
    amplitude: 21,
    anchor: 6.6,
    drift: -1.8,
    endFrame: 96,
    peakFrame: 50,
    startFrame: 18,
    tangentialPull: -3.6,
    width: 1.25,
  },
  {
    amplitude: 19.5,
    anchor: 2.4,
    drift: 2,
    endFrame: 128,
    peakFrame: 78,
    startFrame: 44,
    tangentialPull: 3.4,
    width: 1.15,
  },
  {
    amplitude: 20,
    anchor: 9.4,
    drift: -1.7,
    endFrame: 164,
    peakFrame: 112,
    startFrame: 72,
    tangentialPull: -3.2,
    width: 1.3,
  },
  {
    amplitude: 17.5,
    anchor: 4.6,
    drift: 1.9,
    endFrame: 210,
    peakFrame: 146,
    startFrame: 104,
    tangentialPull: 3,
    width: 1.4,
  },
];

const BASE_BLOB_ANCHORS: readonly Point[] = BASE_BLOB_RADII.map(
  (radius, index) => {
    const angle = -Math.PI / 2 + (index / BASE_BLOB_RADII.length) * TAU;

    return {
      x: Math.cos(angle) * 74 * radius,
      y: Math.sin(angle) * 66 * radius,
    };
  },
);

// The supplied heart is one closed four-cubic path.
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

// These are the exact resolved paths used by the approved post-heart sequence.
// Keeping them from frame 218 onward makes every later frame pixel-identical.
const LEFT_HEART_POINTS: readonly Point[] = [
  { x: 748.469, y: 53.1686 },
  { x: 729.019, y: 8.55807 },
  { x: 683.105, y: -10.5204 },
  { x: 655.326, y: 19.1259 },
  { x: 605.756, y: 71.9278 },
  { x: 666.812, y: 131.087 },
  { x: 751.121, y: 200.078 },
  { x: 751.8, y: 176 },
  { x: 751.3, y: 150 },
  { x: 750.7, y: 126.6 },
  { x: 750.2, y: 102 },
  { x: 749.4, y: 77 },
  { x: 748.469, y: 53.1686 },
];

const RIGHT_HEART_POINTS: readonly Point[] = [
  { x: 748.469, y: 53.1686 },
  { x: 767.28, y: 6.45639 },
  { x: 815.156, y: -18.6227 },
  { x: 850.765, y: 16.4746 },
  { x: 916.955, y: 81.5301 },
  { x: 751.121, y: 200.078 },
  { x: 751.121, y: 200.078 },
  { x: 750.4, y: 176 },
  { x: 749.9, y: 150 },
  { x: 749.7, y: 126.6 },
  { x: 749.4, y: 102 },
  { x: 748.8, y: 77 },
  { x: 748.469, y: 53.1686 },
];

const svgStyle: CSSProperties = {
  height: CASS_LOGO_REVEAL.height,
  inset: 0,
  overflow: "visible",
  position: "absolute",
  width: CASS_LOGO_REVEAL.width,
};

const clamp01 = (value: number) => Math.min(Math.max(value, 0), 1);

const smootherstep = (value: number) => {
  const progress = clamp01(value);
  return progress * progress * progress * (progress * (progress * 6 - 15) + 10);
};

const timelineProgress = (frame: number, start: number, end: number) =>
  smootherstep((frame - start) / (end - start));

const lerp = (from: number, to: number, progress: number) =>
  from + (to - from) * progress;

const lerpPoint = (from: Point, to: Point, progress: number): Point => ({
  x: lerp(from.x, to.x, progress),
  y: lerp(from.y, to.y, progress),
});

const offsetPoints = (points: readonly Point[], yOffset: number) =>
  points.map(({ x, y }) => ({ x, y: y + yOffset }));

const splitCubicAt = (
  start: Point,
  controlA: Point,
  controlB: Point,
  end: Point,
  progress: number,
) => {
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

// Three exact subdivisions per original cubic produce twelve target segments,
// matching the twelve independently animated anchors of the gel shape.
const splitCubicsIntoThirds = (points: readonly Point[]) => {
  const split: Point[] = [points[0]];

  for (let segment = 0; segment < 4; segment += 1) {
    const first = splitCubicAt(
      points[segment * 3],
      points[segment * 3 + 1],
      points[segment * 3 + 2],
      points[segment * 3 + 3],
      1 / 3,
    );
    const remainder = splitCubicAt(
      first.right[0],
      first.right[1],
      first.right[2],
      first.right[3],
      0.5,
    );

    for (const cubic of [first.left, remainder.left, remainder.right]) {
      split.push(cubic[1], cubic[2], cubic[3]);
    }
  }

  return split;
};

const HEART_TARGET_POINTS = offsetPoints(
  splitCubicsIntoThirds(HEART_POINTS),
  HEART_CENTER_OFFSET_Y,
);

const buildCubicPath = (points: readonly Point[]) => {
  const point = (index: number) => `${points[index].x} ${points[index].y}`;
  const curves: string[] = [`M${point(0)}`];

  for (let index = 1; index < points.length; index += 3) {
    curves.push(`C${point(index)} ${point(index + 1)} ${point(index + 2)}`);
  }

  return `${curves.join("")}Z`;
};

const anchorsToCubics = (anchors: readonly Point[], smoothness: number) => {
  const points: Point[] = [anchors[0]];

  for (let index = 0; index < anchors.length; index += 1) {
    const previous = anchors[(index - 1 + anchors.length) % anchors.length];
    const current = anchors[index];
    const next = anchors[(index + 1) % anchors.length];
    const after = anchors[(index + 2) % anchors.length];
    const handleScale = smoothness / 6;

    points.push(
      {
        x: current.x + (next.x - previous.x) * handleScale,
        y: current.y + (next.y - previous.y) * handleScale,
      },
      {
        x: next.x - (after.x - current.x) * handleScale,
        y: next.y - (after.y - current.y) * handleScale,
      },
      next,
    );
  }

  return points;
};

const cycle = (seconds: number, period: number, phase: number) =>
  Math.sin((seconds / period) * TAU + phase);

const sampleWithInertia = (
  sample: (seconds: number) => number,
  seconds: number,
  drag: number,
) =>
  sample(seconds) * 0.56 +
  sample(seconds - drag) * 0.29 +
  sample(seconds - drag * 2.35) * 0.15;

const bulgeEnvelope = (frame: number, motion: BulgeMotion) => {
  if (frame <= motion.startFrame || frame >= motion.endFrame) {
    return 0;
  }

  if (frame < motion.peakFrame) {
    return smootherstep(
      (frame - motion.startFrame) / (motion.peakFrame - motion.startFrame),
    );
  }

  return (
    1 -
    smootherstep(
      (frame - motion.peakFrame) / (motion.endFrame - motion.peakFrame),
    )
  );
};

const circularDistance = (from: number, to: number, count: number) => {
  const normalizedTo = ((to % count) + count) % count;
  const direct = Math.abs(from - normalizedTo);

  return Math.min(direct, count - direct);
};

const getLocalBulge = (frame: number, anchorIndex: number) =>
  BULGE_MOTIONS.reduce(
    (total, motion) => {
      const envelope = bulgeEnvelope(frame, motion);

      if (envelope === 0) {
        return total;
      }

      const eventProgress = smootherstep(
        (frame - motion.startFrame) / (motion.endFrame - motion.startFrame),
      );
      const centre = motion.anchor + motion.drift * eventProgress;
      const distance = circularDistance(
        anchorIndex,
        centre,
        ANCHOR_MOTIONS.length,
      );
      const spatialWeight = Math.exp(
        -(distance * distance) / (2 * motion.width * motion.width),
      );

      return {
        radial: total.radial + motion.amplitude * envelope * spatialWeight,
        tangential:
          total.tangential + motion.tangentialPull * envelope * spatialWeight,
      };
    },
    { radial: 0, tangential: 0 },
  );

const getLiquidBlobPoints = (frame: number) => {
  const seconds = (frame / CASS_LOGO_REVEAL.fps) * MOTION_TIME_SCALE;
  const motionRamp = timelineProgress(frame, 0, TIMELINE.motionAwake);
  const heartProgress = timelineProgress(
    frame,
    TIMELINE.morphStart,
    TIMELINE.heartBuilt,
  );
  const stretch =
    sampleWithInertia(
      (time) => cycle(time, 3.9, 0.55) * 0.024 + cycle(time, 6.2, 2.1) * 0.009,
      seconds,
      0.14,
    ) * motionRamp;
  const scaleX = LIQUID_SCALE_X * Math.exp(stretch);
  const scaleY = LIQUID_SCALE_Y * Math.exp(-stretch);
  const rotation =
    sampleWithInertia(
      (time) => cycle(time, 6.6, 0.4) * 0.018 + cycle(time, 10.7, 2.2) * 0.006,
      seconds,
      0.2,
    ) * motionRamp;
  const centerX =
    750 +
    sampleWithInertia(
      (time) => cycle(time, 7.1, 1.1) * 0.55 + cycle(time, 11.3, 4.2) * 0.22,
      seconds,
      0.2,
    ) *
      motionRamp;
  const centerY =
    315 +
    sampleWithInertia(
      (time) => cycle(time, 7.8, 2.7) * 0.42 + cycle(time, 12.1, 0.3) * 0.18,
      seconds,
      0.22,
    ) *
      motionRamp;

  const rawMotion = ANCHOR_MOTIONS.map((motion, index) => {
    const radial = sampleWithInertia(
      (time) =>
        cycle(time, motion.radialPeriod, motion.phase) * 0.62 +
        cycle(time, motion.secondaryPeriod, motion.phase + 1.47) * 0.28 +
        cycle(
          time,
          (motion.radialPeriod + motion.secondaryPeriod) * 0.61,
          motion.phase * 1.27 + 3.76,
        ) *
          0.1,
      seconds,
      motion.inertia,
    );
    const tangential = sampleWithInertia(
      (time) =>
        cycle(time, motion.tangentialPeriod, motion.phase * 0.73 + 2.1) * 0.74 +
        cycle(time, motion.secondaryPeriod + 1.9, motion.phase + 3.05) * 0.26,
      seconds,
      motion.inertia * 1.18,
    );
    const bulge = getLocalBulge(frame, index);

    return {
      radial: radial * motion.radialAmplitude + bulge.radial,
      tangential: tangential * motion.tangentialAmplitude + bulge.tangential,
    };
  });

  // Neighbour blending gives every local deformation soft shoulders rather
  // than a kink. Removing the average radial displacement prevents the twelve
  // controls from collapsing into a uniform pulse.
  const softenedMotion = rawMotion.map((motion, index) => {
    const previous =
      rawMotion[(index - 1 + rawMotion.length) % rawMotion.length];
    const next = rawMotion[(index + 1) % rawMotion.length];
    const previousTwo =
      rawMotion[(index - 2 + rawMotion.length) % rawMotion.length];
    const nextTwo = rawMotion[(index + 2) % rawMotion.length];

    return {
      radial:
        motion.radial * 0.44 +
        previous.radial * 0.2 +
        next.radial * 0.2 +
        previousTwo.radial * 0.08 +
        nextTwo.radial * 0.08,
      tangential:
        motion.tangential * 0.44 +
        previous.tangential * 0.2 +
        next.tangential * 0.2 +
        previousTwo.tangential * 0.08 +
        nextTwo.tangential * 0.08,
    };
  });
  const meanRadial =
    softenedMotion.reduce((total, motion) => total + motion.radial, 0) /
    softenedMotion.length;
  const meanTangential =
    softenedMotion.reduce((total, motion) => total + motion.tangential, 0) /
    softenedMotion.length;
  const rawOffsets = softenedMotion.map((motion, index) => {
    const angle = -Math.PI / 2 + (index / softenedMotion.length) * TAU;
    const radial = motion.radial - meanRadial;
    const tangential = motion.tangential - meanTangential;

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
  const deformationScale = 1.16 * motionRamp;
  const cosine = Math.cos(rotation);
  const sine = Math.sin(rotation);

  const anchors = BASE_BLOB_ANCHORS.map((anchor, index) => {
    const offset = rawOffsets[index];
    const localX =
      anchor.x * scaleX + (offset.x - meanOffset.x) * deformationScale;
    const localY =
      anchor.y * scaleY + (offset.y - meanOffset.y) * deformationScale;

    return {
      x: centerX + localX * cosine - localY * sine,
      y: centerY + localX * sine + localY * cosine,
    };
  });
  const smoothness =
    1.015 +
    sampleWithInertia(
      (time) => cycle(time, 5.7, 1.6) * 0.02 + cycle(time, 9.4, 4.4) * 0.009,
      seconds,
      0.18,
    ) *
      motionRamp;
  const livingPoints = anchorsToCubics(anchors, smoothness);

  if (frame >= TIMELINE.heartBuilt) {
    return HEART_TARGET_POINTS;
  }

  return livingPoints.map((point, index) =>
    lerpPoint(point, HEART_TARGET_POINTS[index], heartProgress),
  );
};

const ResolvedHeart: React.FC = () => (
  <>
    <path
      d={buildCubicPath(offsetPoints(LEFT_HEART_POINTS, HEART_CENTER_OFFSET_Y))}
      fill="#000000"
    />
    <path
      d={buildCubicPath(
        offsetPoints(RIGHT_HEART_POINTS, HEART_CENTER_OFFSET_Y),
      )}
      fill="#000000"
    />
  </>
);

const LiquidHeart: React.FC = () => {
  const frame = useCurrentFrame();
  const lift = timelineProgress(
    frame,
    TIMELINE.heartLiftStart,
    TIMELINE.wordmarkEnd,
  );

  if (frame >= TIMELINE.heartBuilt) {
    return (
      <g transform={`translate(0 ${-HEART_CENTER_OFFSET_Y * lift})`}>
        <ResolvedHeart />
      </g>
    );
  }

  return (
    <g transform={`translate(0 ${-HEART_CENTER_OFFSET_Y * lift})`}>
      <path d={buildCubicPath(getLiquidBlobPoints(frame))} fill="#000000" />
    </g>
  );
};

const CassWordmark: React.FC = () => {
  const frame = useCurrentFrame();
  const reveal = interpolate(
    frame,
    [TIMELINE.wordmarkStart, TIMELINE.wordmarkEnd],
    [0, 1],
    { ...CLAMP, easing: Easing.bezier(0.16, 1, 0.3, 1) },
  );
  const translateY = interpolate(reveal, [0, 1], [18, 0], CLAMP);

  return (
    <g opacity={reveal} transform={`translate(0 ${translateY})`}>
      {WORDMARK_PATHS.map((path) => (
        <path key={path.slice(0, 24)} d={path} fill="#000000" />
      ))}
    </g>
  );
};

export const CassLogoReveal: React.FC = () => {
  const frame = useCurrentFrame();
  const finalMove = timelineProgress(
    frame,
    TIMELINE.assembledHoldEnd,
    TIMELINE.finalMoveEnd,
  );
  const stageScale = lerp(INTRO_SCALE, FINAL_SCALE, finalMove);
  const stageY = lerp(0, -62, finalMove);

  return (
    <AbsoluteFill style={{ backgroundColor: "#FFFFFF", overflow: "hidden" }}>
      <AbsoluteFill
        style={{
          transform: `translate3d(0, ${stageY}px, 0) scale(${stageScale})`,
          transformOrigin: "center center",
          willChange: "transform",
        }}
      >
        <svg
          aria-label="A living black form becoming the Cass heart and wordmark"
          height={CASS_LOGO_REVEAL.height}
          viewBox={`0 0 ${CASS_LOGO_REVEAL.width} ${CASS_LOGO_REVEAL.height}`}
          width={CASS_LOGO_REVEAL.width}
          style={svgStyle}
        >
          {/* Phase 1: one steady-mass gel body flows continuously into the exact heart. */}
          <LiquidHeart />

          {/* Phase 2: the approved wordmark choreography remains unchanged. */}
          <CassWordmark />
        </svg>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
