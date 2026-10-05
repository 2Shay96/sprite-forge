# Architecture and data contracts — Studio 0.7.0

## Offline bundle

`build.mjs` injects the supplied 0.7 shell's local fonts/reset/theme, vendored JSZip, embedded Sunny reference and nineteen ordered modules into `src/index.html`. `src/fonts.css` references local TTF/WOFF assets; the builder embeds their exact bytes as data URLs. CSS textures remain embedded SVG data URLs. CSP disallows connections and permits data fonts and local blob/data media. The maintained HTML is about 1.80 MB, excluding user media. Building needs Node only. Preview workflow modules and reviewed app/studio/action-control hooks are integrated; exported tool metadata is 0.7.0 independently of schema versions. Plain JavaScript and explicit `SF` namespaces keep rebuilding dependency-free; target adapters remain separate from authoring.

| Module | Responsibility |
| --- | --- |
| `timeline.js` | Pure durations, ping-pong mapping, loop-local sampling and exact merged holds. |
| `store.js` | Authoritative settings/media, validation, dirty state and settings undo/redo. |
| `media.js` | Numeric image order, validation, alpha bounds, immutable originals, bounded proxies, common-canvas normalization. |
| `clips.js` | Base/extra clip access, per-clip timing, imported views and complete-project budgets. |
| `placement.js` | Per-clip root/physical calibration/scale/shape/offset, inheritance, validation, preview metrics and output bounds/mapping. |
| `corrections.js` | Source-identity key tracks, interpolation/remapping/review, fixed sequence output bounds, affine transforms and cache. |
| `keyer.js` | Frame correction UI, non-persistent draft edits/dragging, seam comparison and built-in drift fixture. |
| `directions.js` | Relative S/SE/E/NE/N/NW/W/SW convention, imported overrides, stylised recipes, shared-anchor drawing/export, contact sheets. |
| `banks.js` | Sound-bank schema, explicit references, bounds/migration and pure seeded end-relative scheduler. |
| `audio.js` | Browser decoding, slot ownership, trim/loop/gain, preview volume/mute, positional pan/attenuation, offline downmix/resampling and PCM WAV encoding/audition. |
| `simulator.js` | Pure seeded encounter, fixed-step movement, HP, transitions, inventory, neutral roaming/leash and event log. |
| `playback.js` | Pure state entry/action clocks, bounded retriggers, cancellation, source-bound visual markers and binding/export contracts. |
| `action-controls.js` | Playback-rule editing, gallery trigger tests, activity/status and synthetic idle/attack fixture. |
| `renderer.js` | Canvas 2D workbench, uniform Sunny reference, ground anchor, gallery and upright-sprite encounter arena. |
| `pack.js` | Project v1/v2/v3/v4/v5/v6/v7 migration, hashes/path/archive validation, source PNG/WAV/schedules/manifest ZIP. |
| `app.js` | UI, staged imports, timing/transport, progress/cancel, shared animation clock. |
| `studio.js` | Direction/audio/clip/gallery/encounter controls, fixed-step accumulator and keyboard interaction. |
| `steps.js` | Five-step routing, native-control proxies, animation chips, Tune progression, test-kit routes, menus and viewer FX preference. |
| `roster.js` | Animation checklist/import context, automatic versus explicit state links, coverage, cue/state lists, export preflight and summaries. |

Roster preferences live in the existing project.preview.roster bag; links and playback rules use store.commitPlayback. Import review is authoritative: cancelling does not replace frames. Extra import keeps main, while main replacement keeps extras. Preview FX is localStorage viewer state and is not written to authored project settings. Full real-media/listening validation remains separate from focused synthetic workflow checks.

## Project archive v7

`project.json` declares `schemaVersion: 7` and `kind: spriteforge_project`. Top-level `frames` retains the primary S sequence for v1 compatibility. `directions` stores imported primary overrides; `extraClips[id]` stores front frames, imported directions and its own six timing settings. Main keeps `canvas` and legacy root/scale/calibration fields in settings; each extra clip has its own native `canvas`. `placements[id]` stores explicit inherited/override profiles and `placementVersion` is 1. An override contains source-space root, native canvas height in units, uniform scale, linked/unlinked width/height and physical offsets. Existing schema 1–4 clips migrate to their historical shared canvas with inherited identity shape; new different-canvas clips map inherited roots by normalized canvas coordinates. Each frame retains a generated safe archive path, original filename, dimensions and SHA-256. Original bytes are saved unchanged with their MIME type; PNG normalization/generated views are Source Pack operations. Animated GIF/APNG/WebP use capability-gated ImageDecoder extraction. Extracted frames retain `origin`, `sourceFrameIndex` and `sourceDurationUs`. Save deduplicates original animated sources by SHA-256 into `imageSources` and links frames with `originKey`. Reopen requires no animated decoder for those already extracted PNGs. Source FPS remains the timing authority; native unequal delays are recorded but not automatically scheduled. SVG input must be self-contained and static.

`audio[cue]` contains `settings`, stable `nextTake` and a `takes` array. Each take records its original media path/name/hash, stable `take_N` ID, label, selection weight and non-destructive trim, loop region, exported gain and preview mute. `audioLinks` records explicit bank references; `audioBankVersion` is 1. Browser-decoded buffers are rebuilt on reopen. Schemas 1–3 remain readable: each old single recording becomes one bank/take with its authored once/loop mode. Old implicit neutral-music inheritance becomes explicit idle→music and roam→idle references. New absent cues are silent; cyclic references fail. `stateClips` contains explicit assignments; absent assignments use the primary clip. `simulation` stores configuration/seed. `preview` stores orbit and speaker volume, alongside preview settings such as zoom/background. A live encounter resumes from a reset rather than serializing transient positions/HP/audio nodes.

Schemas 1 and 2 remain readable and acquires default billboard, empty extra clips/audio, simulation settings and preview controls. Unsupported future schemas fail explicitly. Imports and reopen validate before replacing the current project; rejected operations retain active media. General settings history snapshots main settings, placement profiles and correction tracks together (100 edits, 16 MiB JSON cap), allowing placement Undo/Redo without copying media. Audio history remains separate. Audio history snapshots bank settings/take edits while sharing immutable blobs/buffers: at most 20 past edits, with retired media capped at 64 MB; it clears on project replacement. Clip imports still do not have full media history.

## Timing and direction contract

Effective source rate is source FPS × speed/100. Forward/once contain N steps; ping-pong contains 2(N−1) for N>1, one for N=1. Four-frame ping-pong is 0,1,2,3,2,1, without duplicated turning endpoints. Cycle duration is steps/effective rate. Samples occur at k/displayFPS strictly before that duration. Holds end at the next sample or exact cycle end; equal adjacent poses merge. The renderer/exporter consume the same mapping.

Directions never reset pose time. Orbit boundaries use 5° extra hysteresis. Imported views must match their clip’s frame count; mismatches fail instead of introducing drift. Generated views record width compression, mirroring and rear darkening; they are labelled approximations. Source Pack PNGs preserve a common evaluated output canvas/root per clip and alpha. Billboard exports S; generated mode prepares eight views with real imports overriding recipes; imported mode exports only supplied views plus S and reports completeness honestly.

Encounter bindings choose Continue phase (legacy global timeline), Restart on entry, or one authored cycle then return. Actual attack events own combat actions; non-combat actions start on entry. Gallery supplies test entries and resets its inspection timeline. Source Pack `statePlayback` records each rule; separate action schedules override repeat/return behavior. Audio always remains forward at rate 1, independent of sprite speed, display rate or reversal.

## Grounding, native canvases and shape

For the selected clip's source canvas height H, calibration C, uniform scale s and shape multipliers wx/wy:

`u = C/H * s`

`worldX = (sourceX-rootX) * u * wx + offsetXUnits`

`worldY = (rootY-sourceY) * u * wy + offsetYUnits`

Generated view width/mirroring multiplies the X term before world conversion. The same Placement metrics feed Workbench, gallery and encounter; Direction.draw accepts separate X/Y factors. Main calibration anchors the Workbench's world-to-screen scale, while per-clip overrides change only that sprite. Preview zoom never enters authored/export recipes. Zero offsets place each clip's root at the same floor, preserving jumps inside the original sequence rather than snapping each frame. Drag inversion freezes the image origin and divides pointer deltas by each independent axis factor; one commit/Undo step is made on release. Sliders similarly commit once per gesture. Ground editing forces front view for dragging; gallery/encounter placement uses the assigned clip's profile.

Shape is baked into PNG output about the source root, followed by direction width/mirroring/darkening. Output bounds union the full native canvas and root over all requested directions; each clip's views use one padded canvas and transformed root. Fractional roots remain fractional, avoiding spurious identity padding. Guard 8192 px per transformed side before exporting media. No authored uniform scale/calibration/offset is baked into PNGs.

Source Pack v6 stores each clip's placement, source/output canvas, source/output root, shape, per-frame affine `sourceToOutputMatrix`, per-frame mapped source origin, physical dimensions and `unitsPerOutputPixel`. That last value already includes uniform scale: apply it once. Physical coordinates are `(outputX-outputRootX)*u+offsetX` and `(outputRootY-outputY)*u+offsetY`. Preview and exported mapping agree; transparent padding must not alter physical size. Top-level visual fields are explicitly legacy main/source coordinates; per-clip placement is authoritative.

Inherited profiles map main root fractions to the local native canvas and inherit calibration/scale/shape/offsets. Editing creates a complete override; re-linking follows main again. Copy makes an independent snapshot; reset uses whole-clip alpha bounds and identity sizing. Old shared-canvas clips retain the old pixel calibration. General Undo filters removed clip profiles so it cannot resurrect orphan references. A2 adds source-frame correction tracks and imported-view alignment; A3 supplies per-binding playback clocks.

Sunny's crop uses one uniform factor on both axes and fixed ≈121.6-unit height (0.95 × nominal 128). She receives no sprite shape/offsets. See `assets/REFERENCE.md` for the read-only height evidence. Theme/reference remain preview-only.

## Source-frame corrections

Project schema 6 adds `correctionVersion:1` and `corrections[clipId] = {outputMode, tracks}`. Each S/imported track has `{enabled, keys, review}`; an imported track may link to S instead of owning keys. Keys store full-source `frame`, original `sha256`/`name`, `offsetX/Y`, uniform `scalePercent`, `pivotX/Y` and left-segment `interpolation` (linear/hold/smoothstep). Generated/fallback views evaluate S; imported views remain independent unless linked/copied. Source replacement remaps unique identity matches; ambiguous/missing keys move to review. A track with review evaluates identity; enabled review blocks source export, while project saves retain it. Undo remaps restored keys against current media instead of resurrecting obsolete frame bindings.

For q=correctionScale/100, `cx=q*x+(1-q)*pivotX+offsetX`, `cy=q*y+(1-q)*pivotY-offsetY`. Correction precedes the fixed clip root, shape/direction transforms and authored physical sizing. Pivot is independently interpolated; smoothstep stays within endpoint values. Nearest keys hold outside the keyed span, with no cycle-seam blending. Source indices remain independent of all playback clocks/ranges, including reversal.

Correction bounds union every original canvas through every source-frame affine transform and requested view with the base Placement bounds. One fixed canvas/root prevents per-frame padding jitter; crop mode uses base bounds deliberately. Maximum prepared side is 8192. Layout caches are invalidated by key/source edits and keyed by effective placement/direction settings. Drafts affect only the current matching clip/source frame/view; project saves/exports use committed keys. Original preview bypasses corrections only in preview. Source Pack v6 records track recipes, each frame's correction and original-source→prepared-PNG matrix; prepared PNGs bake correction/shape/direction once. Physical conversion remains based on original pixel calibration, so expanded canvases never double-apply authored scale.

Limits: offsets ±8192 source pixels, pivots 0–8192, correction scale 1–1000%, 2000 keys/review entries per track, 4000 per project. Native Canvas/PNG/ZIP and explicit DOM control tests verify the shared transform; fresh browser interaction remains a separate acceptance gate.

## State-owned playback — A3

Project schema 7 adds `playbackVersion:1` and `statePlayback[state] = {policy, returnClip, retrigger, marker}`. Policies are continue/restart/once_return; retriggers restart/ignore/queue (one pending replay). Empty legacy bindings resolve to Continue. Explicit return defaults to main and resumes shared global phase. Marker is null or `{clipId, frame, name, sha256}`; unique source remap is allowed, mismatched/range-excluded markers remain inactive. Assignment changes clear markers; main renaming/removal updates return/marker references. Bindings/assignments participate in general bounded Undo/Redo; live clocks/queues do not serialize.

Simulator entry IDs distinguish same-state re-entry. Events carry owner state/entry ID. Studio consumes attack events with a separate visual cursor; only events still belonging to the current state/entry can start an action. Fatal/victory transitions therefore cancel obsolete actions. Each fixed step processes entry/cancellation/ticks/events. A final visual tick uses simulation time plus at most its remaining 1/60s fraction, preserving exact visual completion without advancing gameplay through a backlog. Action timing is captured at trigger; authoring timing edits reset the visual runtime. Preview pause freezes both clocks. Runtime pose selects clip/frame/local elapsed for App transport and Renderer, preserving that clip's Placement/Corrections. Seeking changes a local start time and clears the queue; return/continue phases use the shared global clock.

Once-return plays one authored Timeline cycle, including a complete ping-pong cycle; repeat is disabled in its separate Source Pack action schedule. Replays start at the previous exact end, without accumulated timing drift. Owner exit clears the active action and queue. Marker timestamps use the first forward source visit, independent of display sampling, and are informational only. The playback module never calls Simulator or Audio mutators. Source Pack v6 stores resolved bindings, one-cycle schedules, return phase, queue limit and cancellation/trigger semantics; ordinary clip schedules remain unchanged. Grounding and source corrections are evaluated independently for action and return clips.

## Audio and simulation

Audio voices and scheduler timers belong to state families. Active music spans hostile approach/attack and companion combat; neutral quips span idle/roam without resetting the countdown. Separate idle/roam beds switch on that state change unless both resolve to the same bank. Family exit, pickup, reset or project replacement cancels pending delays and voices. New blanks are silent; legacy fallback is represented by explicit links.

Each bank has its own seeded LCG (1664525/1013904223), mixed with its cue key via FNV-1a; it never consumes the simulator's randomness. Weighted random chooses among unmuted eligible takes; avoid-last excludes the most recent ID when alternatives exist. Ordered mode cycles through takes. Once/loop select one take; repeat/periodic reschedule from its audible end plus a fixed/random gap. Counts include the first take; 0 is unlimited. Disabling play-on-entry adds the first sampled pause. First delay, gaps and cooldown use AudioContext.currentTime, so suspension freezes them. Scheduler decisions run on animation callbacks, with actual node end time bounding the next due timestamp; background tab is paused explicitly. No pitch or timeline coupling exists.

Event banks implement cooldown and ignore/restart or bounded overlap (once only, 1–4 voices/queued starts). Actual simulator events carry monotonic IDs; Studio consumes each once and resets its cursor with a new encounter. Attack, hit and victory now trigger preview cues. Defeat audio takes priority on a fatal hit. Inventory, pickup, release, repack, entry and alert cues follow their documented owners.

Neutral entry completion hands off to quips; defeat sting completion hands off to the defeated bank regardless of visual-state age reset. A looping entry/sting blocks its handoff until owner exit. One-shot completion never restarts each preview frame. Release transition uses first delay plus the longest trimmed audible take, with a 0.7s floor; repeat/loop intent does not make the visual state permanent. Spatial pan/attenuation follows actor/listener positions. Bank/solo/converted audition is non-positional and cancellation-token guarded, including asynchronous context resume. A5 fades, tails and crossfades are not implemented.

Conversion: decoded channels → arithmetic-average mono with headroom → OfflineAudioContext resampling to 44100 Hz → trim/gain/clipping check → deterministic TPDF dither → signed PCM16 LE RIFF/WAVE. Exported gain is already baked. Loop boundaries become converted sample indices. Preview volume/mute are excluded from assets; bank loop intent is retained. Source Pack v6 exports every take separately with weights, scheduling settings and references; runtime quips are not baked into a long WAV. Converted audition decodes and plays the actual output WAV. Manifest loop points do not automatically configure FNV sound records.

The deterministic simulator uses 1/60-second steps, a seeded LCG, arena bounds and explicit state entries. Rendering can drop frames without changing simulation speed. States cover hostile approach/attack, defeat transition/item, inventory, deployment, companion combat, neutral idle/roam and repack. Pickup removes the world actor; deployment restores exactly one. Roam targets change after seeded pauses and obey the return leash. Enemy appearance interrupts roaming. Audio and fixed-step time freeze on pause/hidden tab.

## Bounds and portability

Total original media: ≤512 MB, ≤2,000 imported image frames. Images: 1–8192 px per side (up to 8192²); 1080² recommended. Alpha bounds scan 128-row strips without another full-resolution RGBA allocation. Full-resolution frames decode sequentially. Proxies rebalance across all imported views/clips to ≤16 million pixels (about 64 MB RGBA); thumbnails, canvases, browser overhead and lazily cached darkened proxies consume additional memory. Original compressed blobs remain immutable. Export prepares full-resolution PNGs incrementally; ZIP STORE avoids recompressing PNGs, but packing is not streaming and still needs memory proportional to media.

Audio: ≤16 takes/cue, ≤64/project, ≤40 MB/≤5 minutes/≤8 channels per file, ≤128 MB decoded PCM per project. Cooperative checks and progress allow cancellation; an active browser decode/offline audio render completes before its cancellation check. ZIP reopen preflights compressed/expanded limits, rejects ZIP64/multipart/unsafe paths, checks CRC/SHA and validates authoring settings before replacement.

Historical 0.2.0 Chrome/macOS local-file operation is tested. Fresh 0.6.0 browser acceptance is pending; native archive/media and explicit Web Audio/component mocks cover A4; native Canvas/archive/geometry and mocked controls cover A1/A2; correction math, actual prepared PNGs and source identity/review round trips are verified. Additional browsers/Windows remain acceptance work. Canvas 2D provides the portable arena; a compact 3D scene renderer can consume the same simulation/timing APIs later. Direct folder export is not offered; ZIP download remains universal baseline for tested builds.

## FNV boundary

Source Pack v6 includes organized per-clip PNGs, WAV audio, exact schedules, source/output hashes, direction recipes, state clip assignments and simulation intent. It declares `fnvAssets:false` and `adapter_pending`. Camera orbit, reference imagery, zoom, preview speaker volume and mute are excluded from game assets.

The deferred adapter would extend the existing `sprite_flipbook.py` rather than replacing its validated conventions. It must honor explicit holds, anchor/scale, upright billboard mode 5, −U/+V offsets, alpha-aware resizing/DDS and Scene Root zero-offset attachment. See `fnv-reference-contract.json`. Actual DDS/NIF/WAV loading, ground/scale, animation timing, sound records, direction switching and roaming require independent GECK/FNV evidence before game-ready claims.
