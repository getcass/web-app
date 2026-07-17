# Cass Remotion compositions

## Cass logo reveal

`CassLogoReveal` is the 6.27-second, 60 fps identity animation used by the
homepage. It renders at the logo's native 1500 × 630 aspect ratio. One flat
black gel form begins alone in the centre at a steady visual mass and flows
through twelve independently phased, spatially softened edge motions into the
heart. Five alternating eased swells overlap that quicker edge drift, while a
short deterministic sample history gives faster changes the drag and settling
of thick liquid. Its
twelve-cubic living outline is derived from the supplied four-cubic heart using
exact Bézier subdivision, so the same connected path resolves into the logo
without an opacity swap or a late geometry handoff. The resolved heart then
rises as the complete wordmark fades in below, before the assembled mark lifts
and scales down as one unit.

```bash
npm run render:logo
npm run render:logo:web
```

The first command writes the master to `out/cass-logo-reveal.mp4`. The second
writes a high-quality CRF 16 website asset directly to `src/assets/`. The
homepage buffers its first decoded frame before playback so the reveal always
starts from frame zero rather than fading in halfway through the animation. A
matching frame-zero PNG poster prevents a blank first paint while the MP4
decodes.

On the homepage, a live SVG covers the opening through frame 224 while this
MP4 plays underneath as the master clock. Each mount receives a cryptographic
motion seed, producing travelling asymmetric bulges and a smooth wandering
spin. Twelve broad motion drivers are interpolated across 36 anchors and
spatially softened. A smooth convex support envelope and periodic cubic
B-spline then turn those anchors into a fully outward-curving 36-cubic contour,
so the live blob stays rounded without dents, cusps, or small independent
ripples. The seeded geometry begins converging to the exact 36-cubic heart at
frame 112 and reaches it at frame 218; the SVG is then removed during the
stable-heart hold, leaving the approved wordmark choreography in the video
unchanged. Reduced-motion, data-saver, and playback-error paths continue to use
the static logo.

## Cass cinematic sizzle

A 9.9-second, 13-cut Remotion montage designed to match the pacing and
center-safe 4:3 framing of the Known website background video.

## Output

- New-footage composition: `CassSizzle`
- Original-footage composition: `CassSizzleLegacy`
- Size: 1440 × 1080
- Frame rate: 30 fps
- Duration: 297 frames / 9.9 seconds
- Edit: 13 hard cuts, no audio
- Render: H.264 MP4, CRF 18, `yuv420p`

The production homepage currently uses `out/cass-sizzle-legacy-web.mp4`, a
960 × 720, CRF 23 derivative of the original edit. The new numbered-clip edit
remains available as `out/cass-sizzle-web.mp4`. Both keep the same 297-frame
timeline while reducing download size and decode work.

`CassSizzleWebPreview` applies the blur, 4% overscale, vignette, SVG grain,
and 55% black scrim used to preview the montage as a website background.
Those effects are not baked into the main source render.

## Source clips

`public/clips` is a relative symlink to `../../../clips`, so the Remotion
project reads the existing files from `cass/clips/` without copying them into
the web app or its deployment bundle.

The `CassSizzle` composition uses the numbered MP4s. To swap a shot, overwrite
the matching file and keep its short name; no import or path changes are
needed. Replacement clips should be at least as long as the minimum shown
below so every existing trim remains valid.

| File     | Current scene              | Minimum length |
| -------- | -------------------------- | -------------: |
| `01.mp4` | Flowers at sunset          |          9.6 s |
| `02.mp4` | London Underground and bus |          7.8 s |
| `03.mp4` | Night traffic              |          1.6 s |
| `04.mp4` | Defocused city lights      |         10.6 s |
| `05.mp4` | Couple at a crosswalk      |          3.1 s |
| `06.mp4` | Overhead restaurant        |         11.5 s |
| `07.mp4` | Golden-hour hands          |          7.4 s |
| `08.mp4` | Friends walking at night   |          8.4 s |

The new numbered clips showed no visible watermark in sampled frames.
`CassSizzleLegacy` uses the original `sunset.mov`, `bus.mov`, `drive.mov`,
`flare.mov`, `street.mov`, `dinner.mov`, `kitchen.mov`, and `rooftop.mov`
previews. Their FilmSupply watermarks are baked in and remain visible. Replace
them with licensed clean masters before publishing.

## Commands

```bash
npm install
npm run dev
npm run lint
npm run render
npm run render:web-asset
npm run render:legacy-web-asset
```

The main render is written to `out/cass-sizzle.mp4`.

To render the fully treated website preview:

```bash
npm run render:web-preview
```
