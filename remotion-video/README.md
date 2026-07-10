# Cass cinematic sizzle

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

| File | Current scene | Minimum length |
| --- | --- | ---: |
| `01.mp4` | Flowers at sunset | 9.6 s |
| `02.mp4` | London Underground and bus | 7.8 s |
| `03.mp4` | Night traffic | 1.6 s |
| `04.mp4` | Defocused city lights | 10.6 s |
| `05.mp4` | Couple at a crosswalk | 3.1 s |
| `06.mp4` | Overhead restaurant | 11.5 s |
| `07.mp4` | Golden-hour hands | 7.4 s |
| `08.mp4` | Friends walking at night | 8.4 s |

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
