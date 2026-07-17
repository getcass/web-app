import { useEffect, useMemo, useRef, type RefObject } from 'react';
import {
  CASS_BLOB_POINT_COUNT,
  CASS_BLOB_TIMELINE,
  createCassBlobProfile,
  createCassBlobSeed,
  getCassBlobPath,
} from '../../shared/cassBlobMotion';

type LivingBlobProps = {
  readonly mediaRef: RefObject<HTMLVideoElement>;
  readonly onComplete: () => void;
};

type VideoFrameMetadata = {
  readonly mediaTime: number;
};

const HANDOFF_SECONDS = CASS_BLOB_TIMELINE.handoffFrame / 60;

export function LivingBlob({ mediaRef, onComplete }: LivingBlobProps) {
  const pathRef = useRef<SVGPathElement>(null);
  const profile = useMemo(() => createCassBlobProfile(createCassBlobSeed()), []);
  const initialPath = useMemo(() => getCassBlobPath(0, profile), [profile]);

  useEffect(() => {
    const video = mediaRef.current;

    if (!video) {
      return;
    }

    let animationFrame: number | null = null;
    let videoFrame: number | null = null;
    let completed = false;

    const update = (mediaTime: number) => {
      pathRef.current?.setAttribute('d', getCassBlobPath(mediaTime, profile));

      if (mediaTime >= HANDOFF_SECONDS && !completed) {
        completed = true;
        onComplete();
      }
    };

    const monitorVideoFrame = (_timestamp: number, metadata: VideoFrameMetadata) => {
      update(metadata.mediaTime);

      if (!completed) {
        videoFrame = video.requestVideoFrameCallback(monitorVideoFrame);
      }
    };

    const monitorAnimationFrame = () => {
      update(video.currentTime);

      if (!completed) {
        animationFrame = window.requestAnimationFrame(monitorAnimationFrame);
      }
    };

    update(video.currentTime);

    if (typeof video.requestVideoFrameCallback === 'function') {
      videoFrame = video.requestVideoFrameCallback(monitorVideoFrame);
    } else {
      animationFrame = window.requestAnimationFrame(monitorAnimationFrame);
    }

    return () => {
      if (videoFrame !== null && typeof video.cancelVideoFrameCallback === 'function') {
        video.cancelVideoFrameCallback(videoFrame);
      }

      if (animationFrame !== null) {
        window.cancelAnimationFrame(animationFrame);
      }
    };
  }, [mediaRef, onComplete, profile]);

  return (
    <svg
      aria-hidden="true"
      className="cass-cinematic-media cass-cinematic-living-blob"
      data-blob-points={CASS_BLOB_POINT_COUNT}
      data-blob-seed={profile.seed}
      focusable="false"
      preserveAspectRatio="xMidYMid meet"
      viewBox="0 0 1500 630"
    >
      <rect width="1500" height="630" fill="#ffffff" />
      <g transform="translate(750 315) scale(0.55) translate(-750 -315)">
        <path ref={pathRef} d={initialPath} fill="#000000" />
      </g>
    </svg>
  );
}
