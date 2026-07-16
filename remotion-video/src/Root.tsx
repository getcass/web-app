import "./index.css";
import { Video } from "@remotion/media";
import {
  AbsoluteFill,
  Composition,
  Easing,
  interpolate,
  Sequence,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { CASS_LOGO_REVEAL, CassLogoReveal } from "./CassLogoReveal";

const FPS = 30;
const WIDTH = 1440;
const HEIGHT = 1080;
const DURATION_IN_FRAMES = 297;

type Shot = {
  readonly file: string;
  readonly label: string;
  readonly trimBeforeInFrames: number;
  readonly durationInFrames: number;
  readonly objectPosition: string;
  readonly scaleFrom: number;
  readonly scaleTo: number;
  readonly driftFrom: readonly [number, number];
  readonly driftTo: readonly [number, number];
  readonly brightness: number;
};

const newShots: readonly Shot[] = [
  {
    label: "Sunset flowers",
    file: "01.mp4",
    trimBeforeInFrames: 8,
    durationInFrames: 24,
    objectPosition: "45% 50%",
    scaleFrom: 1.04,
    scaleTo: 1.055,
    driftFrom: [0, 2],
    driftTo: [0, -3],
    brightness: 1.07,
  },
  {
    label: "London bus sweep",
    file: "02.mp4",
    trimBeforeInFrames: 35,
    durationInFrames: 21,
    objectPosition: "50% 50%",
    scaleFrom: 1.04,
    scaleTo: 1.045,
    driftFrom: [4, 0],
    driftTo: [-4, 0],
    brightness: 1.04,
  },
  {
    label: "Hands clasp",
    file: "07.mp4",
    trimBeforeInFrames: 27,
    durationInFrames: 24,
    objectPosition: "50% 50%",
    scaleFrom: 1.04,
    scaleTo: 1.06,
    driftFrom: [0, 2],
    driftTo: [0, -3],
    brightness: 1.04,
  },
  {
    label: "Crosswalk car wipe",
    file: "05.mp4",
    trimBeforeInFrames: 11,
    durationInFrames: 21,
    objectPosition: "50% 50%",
    scaleFrom: 1.04,
    scaleTo: 1.055,
    driftFrom: [0, 0],
    driftTo: [0, 0],
    brightness: 1.02,
  },
  {
    label: "Friends at night",
    file: "08.mp4",
    trimBeforeInFrames: 128,
    durationInFrames: 24,
    objectPosition: "58% 50%",
    scaleFrom: 1.04,
    scaleTo: 1.055,
    driftFrom: [-2, 0],
    driftTo: [2, 0],
    brightness: 1.04,
  },
  {
    label: "Restaurant overhead",
    file: "06.mp4",
    trimBeforeInFrames: 323,
    durationInFrames: 21,
    objectPosition: "50% 50%",
    scaleFrom: 1.04,
    scaleTo: 1.05,
    driftFrom: [0, 2],
    driftTo: [0, -3],
    brightness: 1.05,
  },
  {
    label: "Hands together",
    file: "07.mp4",
    trimBeforeInFrames: 197,
    durationInFrames: 24,
    objectPosition: "50% 50%",
    scaleFrom: 1.055,
    scaleTo: 1.04,
    driftFrom: [0, -2],
    driftTo: [0, 2],
    brightness: 1.04,
  },
  {
    label: "Crosswalk taxi beat",
    file: "05.mp4",
    trimBeforeInFrames: 68,
    durationInFrames: 24,
    objectPosition: "50% 50%",
    scaleFrom: 1.04,
    scaleTo: 1.055,
    driftFrom: [0, 0],
    driftTo: [0, 0],
    brightness: 1.02,
  },
  {
    label: "Rain traffic wipe",
    file: "03.mp4",
    trimBeforeInFrames: 26,
    durationInFrames: 21,
    objectPosition: "50% 50%",
    scaleFrom: 1.04,
    scaleTo: 1.05,
    driftFrom: [-3, 0],
    driftTo: [3, 0],
    brightness: 1.12,
  },
  {
    label: "London lights",
    file: "02.mp4",
    trimBeforeInFrames: 210,
    durationInFrames: 24,
    objectPosition: "50% 50%",
    scaleFrom: 1.04,
    scaleTo: 1.05,
    driftFrom: [2, 0],
    driftTo: [-2, 0],
    brightness: 1.04,
  },
  {
    label: "City bokeh",
    file: "04.mp4",
    trimBeforeInFrames: 297,
    durationInFrames: 21,
    objectPosition: "50% 50%",
    scaleFrom: 1.04,
    scaleTo: 1.05,
    driftFrom: [-5, 0],
    driftTo: [5, 0],
    brightness: 1.08,
  },
  {
    label: "Friends laughing",
    file: "08.mp4",
    trimBeforeInFrames: 227,
    durationInFrames: 24,
    objectPosition: "58% 50%",
    scaleFrom: 1.055,
    scaleTo: 1.04,
    driftFrom: [2, 0],
    driftTo: [-2, 0],
    brightness: 1.04,
  },
  {
    label: "Sunset flowers close",
    file: "01.mp4",
    trimBeforeInFrames: 263,
    durationInFrames: 24,
    objectPosition: "45% 50%",
    scaleFrom: 1.055,
    scaleTo: 1.04,
    driftFrom: [0, -2],
    driftTo: [0, 2],
    brightness: 1.07,
  },
];

const legacyShots: readonly Shot[] = [
  {
    label: "Sunset portrait",
    file: "sunset.mov",
    trimBeforeInFrames: 6,
    durationInFrames: 24,
    objectPosition: "50% 50%",
    scaleFrom: 1.04,
    scaleTo: 1.055,
    driftFrom: [0, 2],
    driftTo: [0, -3],
    brightness: 0.98,
  },
  {
    label: "London bus",
    file: "bus.mov",
    trimBeforeInFrames: 8,
    durationInFrames: 21,
    objectPosition: "55% 50%",
    scaleFrom: 1.04,
    scaleTo: 1.05,
    driftFrom: [4, 0],
    driftTo: [-4, 0],
    brightness: 0.96,
  },
  {
    label: "Night drive",
    file: "drive.mov",
    trimBeforeInFrames: 113,
    durationInFrames: 24,
    objectPosition: "50% 50%",
    scaleFrom: 1.04,
    scaleTo: 1.05,
    driftFrom: [-4, 0],
    driftTo: [4, 0],
    brightness: 1.08,
  },
  {
    label: "Urban lens flare",
    file: "flare.mov",
    trimBeforeInFrames: 123,
    durationInFrames: 21,
    objectPosition: "44% 50%",
    scaleFrom: 1.04,
    scaleTo: 1.05,
    driftFrom: [0, 0],
    driftTo: [0, 0],
    brightness: 1.02,
  },
  {
    label: "Street couple",
    file: "street.mov",
    trimBeforeInFrames: 6,
    durationInFrames: 24,
    objectPosition: "50% 50%",
    scaleFrom: 1.04,
    scaleTo: 1.06,
    driftFrom: [0, 0],
    driftTo: [0, 0],
    brightness: 1.04,
  },
  {
    label: "Candlelit dinner",
    file: "dinner.mov",
    trimBeforeInFrames: 20,
    durationInFrames: 21,
    objectPosition: "48% 50%",
    scaleFrom: 1.04,
    scaleTo: 1.055,
    driftFrom: [0, 2],
    driftTo: [0, -4],
    brightness: 1.02,
  },
  {
    label: "Reaching hands",
    file: "kitchen.mov",
    trimBeforeInFrames: 153,
    durationInFrames: 24,
    objectPosition: "50% 50%",
    scaleFrom: 1.04,
    scaleTo: 1.055,
    driftFrom: [3, 0],
    driftTo: [-4, 0],
    brightness: 1,
  },
  {
    label: "Rooftop silhouette",
    file: "rooftop.mov",
    trimBeforeInFrames: 32,
    durationInFrames: 24,
    objectPosition: "40% 50%",
    scaleFrom: 1.04,
    scaleTo: 1.05,
    driftFrom: [-4, 0],
    driftTo: [4, 0],
    brightness: 1.08,
  },
  {
    label: "Bus close pass",
    file: "bus.mov",
    trimBeforeInFrames: 96,
    durationInFrames: 21,
    objectPosition: "48% 50%",
    scaleFrom: 1.045,
    scaleTo: 1.045,
    driftFrom: [0, 0],
    driftTo: [0, 0],
    brightness: 0.96,
  },
  {
    label: "Late-night drive",
    file: "drive.mov",
    trimBeforeInFrames: 698,
    durationInFrames: 24,
    objectPosition: "50% 50%",
    scaleFrom: 1.04,
    scaleTo: 1.05,
    driftFrom: [2, 0],
    driftTo: [-2, 0],
    brightness: 1.08,
  },
  {
    label: "Kitchen spin",
    file: "kitchen.mov",
    trimBeforeInFrames: 603,
    durationInFrames: 21,
    objectPosition: "50% 50%",
    scaleFrom: 1.045,
    scaleTo: 1.045,
    driftFrom: [0, 0],
    driftTo: [0, 0],
    brightness: 1,
  },
  {
    label: "Near kiss",
    file: "street.mov",
    trimBeforeInFrames: 393,
    durationInFrames: 24,
    objectPosition: "50% 50%",
    scaleFrom: 1.04,
    scaleTo: 1.06,
    driftFrom: [0, 0],
    driftTo: [0, 0],
    brightness: 1.04,
  },
  {
    label: "Kitchen laughter",
    file: "kitchen.mov",
    trimBeforeInFrames: 716,
    durationInFrames: 24,
    objectPosition: "50% 50%",
    scaleFrom: 1.055,
    scaleTo: 1.04,
    driftFrom: [0, 0],
    driftTo: [0, 0],
    brightness: 1,
  },
];

const assertShotPlan = (name: string, shotPlan: readonly Shot[]) => {
  const totalFrames = shotPlan.reduce(
    (total, shot) => total + shot.durationInFrames,
    0,
  );

  if (totalFrames !== DURATION_IN_FRAMES) {
    throw new Error(
      `${name} shot plan is ${totalFrames} frames; expected ${DURATION_IN_FRAMES}.`,
    );
  }
};

assertShotPlan("New", newShots);
assertShotPlan("Legacy", legacyShots);

const getStarts = (shotPlan: readonly Shot[]) =>
  shotPlan.map((_, index) =>
    shotPlan
      .slice(0, index)
      .reduce((total, shot) => total + shot.durationInFrames, 0),
  );

const ShotLayer: React.FC<{ readonly shot: Shot }> = ({ shot }) => {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill style={{ backgroundColor: "#050607", overflow: "hidden" }}>
      <Video
        src={staticFile(`clips/${shot.file}`)}
        trimBefore={shot.trimBeforeInFrames}
        muted
        objectFit="cover"
        style={{
          width: "100%",
          height: "100%",
          objectPosition: shot.objectPosition,
          filter: `brightness(${shot.brightness}) contrast(1.07) saturate(0.9) sepia(0.035)`,
          scale: interpolate(
            frame,
            [0, shot.durationInFrames - 1],
            [shot.scaleFrom, shot.scaleTo],
            {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
              easing: Easing.bezier(0.22, 1, 0.36, 1),
            },
          ),
          translate: interpolate(
            frame,
            [0, shot.durationInFrames - 1],
            [
              `${shot.driftFrom[0]}px ${shot.driftFrom[1]}px`,
              `${shot.driftTo[0]}px ${shot.driftTo[1]}px`,
            ],
            {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
              easing: Easing.bezier(0.22, 1, 0.36, 1),
            },
          ),
        }}
      />
    </AbsoluteFill>
  );
};

type CassSizzleProps = {
  readonly shotPlan: "new" | "legacy";
  readonly webTreatment: boolean;
};

export const CassSizzle: React.FC<CassSizzleProps> = ({
  shotPlan,
  webTreatment,
}) => {
  const { fps } = useVideoConfig();
  const shots = shotPlan === "legacy" ? legacyShots : newShots;
  const starts = getStarts(shots);

  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      <AbsoluteFill
        style={
          webTreatment
            ? {
                filter: "blur(4px)",
                scale: 1.04,
              }
            : undefined
        }
      >
        {shots.map((shot, index) => (
          <Sequence
            key={`${shot.label}-${index}`}
            name={`${String(index + 1).padStart(2, "0")} — ${shot.label}`}
            from={starts[index]}
            durationInFrames={shot.durationInFrames}
            premountFor={fps}
          >
            <ShotLayer shot={shot} />
          </Sequence>
        ))}
      </AbsoluteFill>

      {webTreatment ? (
        <>
          <AbsoluteFill
            style={{
              background:
                "radial-gradient(ellipse at center, rgba(0,0,0,0) 0%, rgba(0,0,0,0.45) 60%, rgba(0,0,0,0.75) 100%)",
            }}
          />
          <AbsoluteFill style={{ mixBlendMode: "overlay", opacity: 0.18 }}>
            <svg
              aria-hidden="true"
              width="100%"
              height="100%"
              viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
              preserveAspectRatio="none"
            >
              <filter id="film-grain" x="0" y="0" width="100%" height="100%">
                <feTurbulence
                  type="fractalNoise"
                  baseFrequency="0.9"
                  numOctaves="2"
                  stitchTiles="stitch"
                />
                <feColorMatrix values="0 0 0 0 .5 0 0 0 0 .5 0 0 0 0 .5 0 0 0 .55 0" />
              </filter>
              <rect
                width={WIDTH}
                height={HEIGHT}
                fill="#808080"
                filter="url(#film-grain)"
              />
            </svg>
          </AbsoluteFill>
          <AbsoluteFill style={{ backgroundColor: "rgba(0, 0, 0, 0.55)" }} />
        </>
      ) : null}
    </AbsoluteFill>
  );
};

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="CassLogoReveal"
        component={CassLogoReveal}
        durationInFrames={CASS_LOGO_REVEAL.durationInFrames}
        fps={CASS_LOGO_REVEAL.fps}
        width={CASS_LOGO_REVEAL.width}
        height={CASS_LOGO_REVEAL.height}
      />
      <Composition
        id="CassSizzle"
        component={CassSizzle}
        durationInFrames={DURATION_IN_FRAMES}
        fps={FPS}
        width={WIDTH}
        height={HEIGHT}
        defaultProps={{ shotPlan: "new", webTreatment: false }}
      />
      <Composition
        id="CassSizzleWebPreview"
        component={CassSizzle}
        durationInFrames={DURATION_IN_FRAMES}
        fps={FPS}
        width={WIDTH}
        height={HEIGHT}
        defaultProps={{ shotPlan: "new", webTreatment: true }}
      />
      <Composition
        id="CassSizzleLegacy"
        component={CassSizzle}
        durationInFrames={DURATION_IN_FRAMES}
        fps={FPS}
        width={WIDTH}
        height={HEIGHT}
        defaultProps={{ shotPlan: "legacy", webTreatment: false }}
      />
    </>
  );
};
