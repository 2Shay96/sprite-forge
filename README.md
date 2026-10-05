# Sprite Forge Studio 0.6.2

> **Status: work-in-progress alpha, AI-assisted.** Free, offline, single-file HTML tool for turning image/video frames into game-ready sprite NPC source packs (built for Fallout: New Vegas modding, aimed at other Bethesda games later).
>
> - **Newest build:** `Claude outputs/SpriteForge-0.7-preview.html` — 0.7.0 graphical overhaul (screenshots in the same folder). Built HTML only; `src/` is still the 0.6.2 source.
> - **Stable build:** `SpriteForge.html` (0.6.2), built from `src/` with `node build.mjs`.
> - Not yet tested end-to-end in a browser; the GECK / Creation Kit bridge is not built yet.
> - Licence: MIT for the code (see `LICENSE`). JSZip, fonts and the Sunny Smiles reference image are third-party; see the bottom of `LICENSE`.

Open **SpriteForge.html** directly in Chrome. The offline Workbench contains its scripts, styles, ZIP library and Sunny reference: no server, installation, account or CDN. Save the current project before refreshing an existing tab.

## Try A3 action playback

1. Open **States & test → Load action test → Use this sequence**. The fixture supplies idle and attack clips with distinct native canvases; an existing project's originals remain intact.
2. Click **Test entry / action**. Watch frames 0–4, the strike cue at frame 2, then the idle return. The behavior state stays Hostile attack.
3. Try **Repeated trigger → Restart / Ignore / Queue one** and click Test again during playback. Queue one permits one pending replay. Pause/scrub/step, then resume.
4. **Play Encounter** uses actual attacks to trigger actions. Defeat/pickup/repack cancel actions and pending replays. Changing source/display FPS cannot change damage or attack frequency.

For your own animations, assign the attack clip to **Hostile attack** and **Companion combat**, choose **Play once, then return**, and choose your idle/main return. **Attack defaults** selects once-return/restart/main. Other states can use **Continue phase** or **Restart on entry**. One action means one authored cycle, including a full ping-pong cycle. Return clips resume their ongoing global phase; each keeps its own placement/corrections. Strike frame is optional and visual only, bound to its source pose. Old projects retain Continue phase unless edited. See FEATURE-GUIDE.md for details.

## Try A2 frame corrections

1. Save your open project, then refresh/open **SpriteForge.html**. Select your clip and open **Animation → Frame corrections**.
2. Choose **First frame**, set a useful pivot near the feet, adjust Move X/Y and Correction scale, then **Add keyframe**. Number edits and dragging are drafts until added.
3. Choose **Last frame**, adjust again and add it. Play **Corrected**, compare **Original**, and add middle keys where needed. Linear is the default; Hold and Smooth are available. The first/last comparison exposes a loop seam without blending it automatically.
4. Save/reopen preserves originals and keys. Source Pack export bakes enabled saved keys into PNGs with one fixed output canvas. Preview zoom and Original comparison do not change export.

**Load drift test** supplies 12 synthetic frames that grow and move. In an existing project it adds a clip. See FEATURE-GUIDE.md for example first/last values. Real imported directions have independent tracks; generated views use front keys. Replaced footage remaps keys by source identity or retains unmatched keys for review. Enabled tracks with unmatched keys block export until reviewed or explicitly bypassed.

## Try A1 per-clip placement

1. Load main frames. In **States & test → Clip library**, import another clip (such as `attack`). It can have a different native canvas and image height.
2. Select it above the preview, then **Ground & scale**. Uncheck **Inherit main grounding & scale**, or edit a placement value to create an override.
3. Set its root/feet, native canvas height and scale. Drag the cross in front view. Unlink Width/Height for Wide/Tall shapes; use offsets only for intentional displacement.
4. **Compare with main** and back against the same floor/reference. Assign the clip to a state; that state uses its placement profile. Save/reopen/export retain it.

Profiles inherit main by default, including old projects. Padding/shape/directions preserve the physical root and world size. Output above 8192 px per side is rejected with a clip-specific message. Per-frame keying (A2) is included. Action restart/return (A3) is included.

## Try A4 sound banks

1. Open **Audio → Add two test tones → Test bank**. Listen to the alternating tones with random 1–2 second pauses. Pause bank freezes the audio clock; Resume bank continues; Stop audio cancels it. The tones are synthetic, not Salvatore dialogue.
2. Choose **Idle / roaming quips**, add two real voice recordings, and set **Periodic quips → Weighted random → Avoid last take**. Set your pause range. Two takes alternate; turn off Avoid last take to allow repeats.
3. Load test frames or your character, then **States & test → State Gallery → Neutral idle → Play**. The same bank also runs in neutral roaming. Encounter combat, pickup and repack cancel its pending sounds.
4. Save/reopen the project; export its **Source Pack**. Original recordings/settings survive, and each take becomes a separate PCM WAV with scheduling rules in the manifest.

See **FEATURE-GUIDE.md** for every feature and cue. A4 adds 17 optional cues, multiple takes, once/continuous/repeat/periodic playback, fixed/random pauses, weighted selection, order, no-repeat selection, entry delay, finite counts, cooldowns, bounded event overlap, explicit references and audio Undo/Redo. Blank means silence. Attack/hit cues now trigger on actual encounter events.

## Existing features

- Image sequences: browser-decodable PNG/JPEG/WebP/GIF/AVIF/BMP/static SVG, transparent or opaque, 1–8192 pixels per side. Numeric ordering, validation and explicit common-canvas padding. Capability-gated animated image extraction retains original bytes and delays; authored Source FPS controls playback.
- Independent source FPS, playback speed and display FPS; forward, ping-pong and once, pause/scrub/step and exact cycle schedules.
- Per-clip native canvas, draggable feet/root, calibration, 1–200% scale, linked/unlinked 1–400% width/height, offsets, inheritance/copy/reset and placement Undo/Redo. Separate preview zoom, Sunny reference and transparency backgrounds.
- Per-clip source-frame position/uniform-scale/pivot keys, Linear/Hold/Smooth, draft dragging, Original/Corrected, seam comparison, fixed expand/crop bounds and Undo/Redo.
- Per-state Continue/Restart/once-return playback, actual attack triggers, bounded retrigger queue, source-bound visual markers, interruption cancellation and synthetic action test.
- Main and additional clips with state assignments; eight generated/imported directions, contact sheet and orbit.
- Ten-state gallery and seeded encounter: defeat, pickup, deployment, companion combat, idle/roam and repack.
- Non-destructive audio trim/loop regions/gain, source and converted-WAV audition, preview mute/volume and positional preview.
- Save Project schema 7 includes originals/settings/keys/playback rules and reads schemas 1–6. Source Pack schema 6 includes organized PNGs, exact frame schedules, separate WAV takes, hashes and behavior policies. It is source material, not an installable mod.

The warm palette, gold ink, local typography, static grain and vignette remain. Existing Godot assets and installed mod are untouched. The Salvatore front sequence and 560-view historical verification remain the regression reference.

## Verification and limits

A3 pure-clock and full App/Studio/action-control checks with mock DOM/native Canvas and controlled RAF/Web Audio pass entry/action/return, bounded retriggers, cancellation, transport, grounding/correction inheritance, unchanged damage/audio behavior and schema 7/Source Pack v6 schedules. A2 correction math, PNG/ZIP tests and full App/Studio/Keyer handlers with explicit DOM mocks/native Canvas pass interpolation, timing independence, ping-pong endpoints, zoom/mirrored-view dragging, Undo/Redo, imported copy/link, source replacement review, schema 7 original-byte/key reopen and Source Pack v6 matrices/baked PNGs. A small real Emet sample decodes/exports while preserving source hashes; manual pose tuning remains to be tested. A1 native Canvas/PNG/archive tests and full App/Studio handlers with mock controls pass different-canvas import, placement switching, independent X/Y drag inversion, inherited/override profiles, slider Undo/Redo, presets and state→Ground selection. Preview/output coordinate mapping matches for all eight views; transformed pixels, bounds, legacy migration and byte-exact schema 7 reopen are checked. A4 pure scheduler tests, component-control tests with mock elements/audio, bank ownership/event tests, native Canvas/archive round trips and WAV byte checks pass. Native media tests include six image formats, actual 8192² import, and reopening the real 70-frame Salvatore front project. Existing timeline (108 combinations), Sunny geometry and three-seed encounter tests pass. Evidence is in `evidence/a3-results.json`, `evidence/a3-playback-checks.json`, `evidence/a3-action-control-checks.json` and `evidence/media-0.6.0-checks.json`.

**Fresh browser acceptance is pending.** Local-file browser control was blocked by the browser tool's security policy. The controlled audio clock and component mocks do not prove audible browser behavior or visual layout. Historical 0.2.0 Chrome/macOS evidence includes 41 interactions and 560 Salvatore frames; it is not a fresh acceptance run of 0.6.0. Use the checklist in `ALPHA-HANDOFF.md` for this release. Other browsers/Windows remain unverified.

Audio export uses browser OfflineAudioContext for mono resampling to 44.1 kHz, trim/gain/clipping checks and deterministic PCM16 dither. The native tests verify output bytes using an explicit test resampler; actual browser resampling/decoding remains part of acceptance. All sound owns its timer/voices, and pause/hidden-tab freezes the audio clock.

Limits: 2,000 image frames, 512 MB original media, 16 takes/cue, 64/project, 128 MB decoded audio, and 40 MB/5 minutes/8 channels per audio file. ZIP save/export remains memory proportional to the media. Downloads are the dependable save path; unsaved tab contents are not persistent storage.

## Development

`build.mjs` bundles seventeen local modules, local styles, vendored JSZip and Sunny into one offline HTML. Run tests from this project directory:

```powershell
node tests/run.cjs
```

See [tests/README.md](tests/README.md) for native dependencies, explicit browser/media configuration, optional groups and Windows pass/fail/blocked evidence. Node is a developer tool, not a user prerequisite. The test runner never builds or repackages the application.

The sources still reproduce 0.6.2; preserve the supplied 0.7 preview until Steps 3–4 integrate it. Once integration is ready, `node build.mjs` and `node package.mjs` run from this directory. Do not rebuild the older shell merely to run tests.

## Completed and next

Milestones 1/2, A4 sound banks, A1 per-clip grounding/sizing/shape, A2 frame correction keys and A3 action playback are implemented in Studio. Fresh browser sign-off comes next. A5 audio processing/crossfades/ducking and A6 visual export filters remain planned in `FEATURE-EXPANSION-PLAN.md`. The FNV bridge is deferred at the user's request; architecture retains it as a future target. No bridge, game assets or server configuration was changed in A3. See `WORK_LOG.md` for completion records.
