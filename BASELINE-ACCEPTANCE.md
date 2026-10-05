# Baseline and v1.0 acceptance matrix

Recorded: 5 October 2026. Step 1 evidence is static inspection only.

## Authoritative project and scope

Working directory: `C:\Users\Shadow\Desktop\VibeCoding\sprite-forge-windows-20261005T133711Z-1-001\sprite-forge-windows\SpriteForgeStudio-Windows-2026-10-05\SpriteForgeStudio`.

Use this existing checkout. The shorter paths in PROJECTS.md and the supplied START-HERE handoff are historical pointers, not alternate working directories. There is no project-local AGENTS.md; the applicable guidance is `C:\Users\Shadow\Desktop\VibeCoding\AGENTS.md`. The active board had no Sprite Forge claim before this session.

Studio v1.0 defines the desired authoring and future runtime behaviour. GECK, installed mods, Godot and other game projects are outside this task. Source Packs are prepared media and behaviour contracts, not installable mods. Execute one numbered plan step per session; older proposals do not add tasks to this plan.

## Frozen artifact identities

SHA-256 values identify files, independently of displayed application versions.

| Role | Exact project-relative file | Bytes | SHA-256 |
| --- | --- | ---: | --- |
| Stable 0.6.2 baseline | SpriteForge.html | 1,584,126 | 93ed65579cf1afb7d542f9975e362e90996a6ef0896059722d69af10fedad28b |
| Preserved stable backup | _backup-0.6.2/SpriteForge.html | 1,584,126 | 93ed65579cf1afb7d542f9975e362e90996a6ef0896059722d69af10fedad28b |
| Authoritative 0.7 appearance/workflow reference | Claude outputs/SpriteForge-0.7-preview.html | 1,803,375 | 908f06d476e40e004bcc499c6d5a62dfba267a4ddbc99802b1bfde26782307e3 |
| Existing Trial ZIP (0.6.2 HTML) | SpriteForge-Trial.zip | 1,088,079 | 85747568fc14d4004bc51c6615a122e66e10821761c5b08ab27ede5c286473db |

The supplied `C:\Users\Shadow\Downloads\SpriteForge-0.7-preview.html` matches the packaged 0.7 reference byte for byte. The loose Trial HTML and ZIP's HTML both match the stable baseline. ZIP CRC reading succeeds. Trial README and feature guide match their working files; its ALPHA-HANDOFF.md does **not** match the pre-existing edited working document. Do not claim the current documentation is packaged. Do not rebuild or repackage until the planned source integration.

Static inspection confirms all 17 build modules parse and their source text is embedded in stable SpriteForge.html. Preview module comparison: 14 unchanged; app, studio and action-controls differ; steps and roster are added (19 preview modules). This does not prove runtime equivalence or browser acceptance. build.mjs still builds the older shell. src/pack.js declares tool version 0.6.2, saves project schema 7, accepts schemas 1–7 and emits Source Pack schema 6.

## Repository and existing work

Confirmed destination: https://github.com/2Shay96/sprite-forge.git; branch main, upstream origin/main. GitHub repository metadata confirms owner/name 2Shay96/sprite-forge, public visibility and default branch main. Preserve that existing visibility. Initial local and fetched remote head: 43e6ec5; ahead/behind 0/0. No incoming changes required integration.

Initial worktree changes: modified ALPHA-HANDOFF.md; untracked CLOUD-HANDOFF.md, FILE-MANIFEST.json, START-HERE-WINDOWS.md, STATUS.md, plan.md and reference/. Preserve these. This checkpoint stages only the selected plan, its maintained status and this acceptance document. The other transfer/handoff files are outside the checkpoint.

Configured commit identity: 2Shay <327810178+2Shay96@users.noreply.github.com>. Command-line gh is unavailable, credential-manager github list returns no accounts, and noninteractive git push --dry-run fails: "could not read Username for 'https://github.com': terminal prompts disabled". Public fetch succeeds without establishing authenticated write access. GitHub Desktop Accounts visibly confirms sign-in as @2Shay96. The exact existing checkout was added to Desktop without copying files. Desktop push verification and the final checkpoint state belong in STATUS.md. Do not inspect stored credentials.

## Available fixtures and missing inputs

- Nine files in fixtures/: four numbered PNGs (1, 2, 3, 10); transparent-empty, opaque and deliberately broken PNGs; unsupported.txt; stereo-tone-48k.wav. make-fixtures.py creates the image fixtures with Pillow; it was read, not run.
- Built-in drift/action/tone generators exist in the source. Native media tests generate JPEG/PNG/WebP/GIF/AVIF/SVG and boundary cases when their dependencies are available; these are not supplied real recordings.
- evidence/ contains 32 historical ZIP archives, including fixture, legacy-v1, Salvatore front/eight-direction, placement, correction, action and audio projects/Source Packs. They are local historical evidence, ignored by Git, and are not newly accepted projects. Historical PNG screenshots and JSON reports are also present.
- No MP4/MOV/AVI/WebM or standalone animated GIF, JPEG or WebP fixtures were found in this project. Video container/codec combinations, portrait rotation, VFR, truncation, silent/audio-bearing and large-input cases must be established in Step 6 onward.
- The user's latest saved project, original main/idle/attack sequences, real idle voice takes, Emet footage and opaque cat video are not established inputs in this checkout. External paths in historical tests do not prove those inputs are available. Inventory optional configured locations in Step 2; record any missing real-media dependency before Step 19.

## Supported environment targets and evidence rules

Target release: offline standalone HTML on Windows in Chrome and Edge, with no server, CDN, account or Node requirement for end users. Development Node is available: v24.19.0; Git 2.53.0.windows.3. Installed browser files report Chrome 154.0.8037.98 and Edge 154.0.4258.53; these are inventory versions, not tested-browser evidence. Record actual versions again during acceptance.

Keep pure/component checks, native raster/archive checks, actual browser interaction, human listening, real-media acceptance and future game validation separate. Every acceptance record must name the exact artifact/hash, browser/runtime version, fixture provenance, command or click path, result and unresolved issue. A missing dependency/fixture is blocked, never passed. No behavioural suites, browser interactions in Studio or human listening were run in Step 1. Source syntax/hash/ZIP inspection is fresh static evidence only.

## Release acceptance matrix

All runtime rows are pending fresh acceptance. Historical reports are context only. Each applicable row must pass in offline Windows Chrome **and** Edge; automated suites supplement browser evidence. Listening and real-media rows require their own evidence.

| Required capability | Acceptance criterion | Evidence / planned steps |
| --- | --- | --- |
| Portable verification | One repeatable project-relative entry point; self-contained and external-media suites report pass/fail/blocked accurately | Automated inventory and regressions; Step 2 |
| Rebuildable 0.7 shell | Modular build retains supplied layout, embedded assets and control bindings without network access | Static comparison + browser; Steps 3–4 |
| Image/animated-image import | Numeric order, alpha/opaque pixels, native canvases, malformed input and bounds; main replacement differs from adding an animation | Native + browser; Steps 2, 5 |
| Timing and transport | Ping-pong 0,1,2,3,2,1; source FPS/speed alter duration; display FPS changes sampling; pause/seek/step remain coherent | Pure + browser; Steps 2, 5 |
| Placement | Per-clip roots/calibration/shape/inheritance survive switching/reopen; zoom does not change world size or Sunny proportions | Geometry + browser + PNG mapping; Steps 2, 5 |
| Corrections | Source-bound keys, draft/commit, interpolation, remapping/review, imported-track independence and history; saved corrections bake once | Native + browser; Steps 2, 5 |
| Directions/source facing | Eight views share phase; rooted Left/Right mirroring faces the correct target; player/enemy attacks remain separate | Native + browser; Steps 2, 5 |
| State playback/lifecycle | Continue/restart/once-return and bounded queue work; exit cancels; visual replay changes neither damage nor unrelated audio | Pure + browser lifecycle; Steps 2, 5, 19 |
| Sound banks | Empty banks silent; take weights/order/links/gaps/loops/cooldown/ownership correct; pause/hidden-tab/exit cancellation works | Scheduler + audio engine + browser + human listening; Steps 2, 5, 19 |
| Offline video decoding | Representative actual MP4/MOV/AVI combinations decode in both browsers; WebM investigated; dependency licence and bundle cost recorded | Decoder spike + codec fixture matrix; Step 6 |
| Video review/extraction | Choose start/end/FPS/resolution for main or extra; timestamp tolerance/endpoints/rotation/aspect correct; backgrounds retained; cancellation atomic | Numbered/timestamped native + browser fixtures; Steps 7–8, 10 |
| Video persistence | Original source deduplicated; segment/settings/timestamps/prepared frames reopen without decode; soundtrack muted/ignored unless explicitly imported | Archive + browser; Steps 9–10 |
| Colour look | Neutral legacy defaults; warmth/tint/vibrance persist with project scope and explicit overrides; history/reset work | Validation + migration + browser; Steps 11–12 |
| Colour output parity | Preview/export share one recipe; alpha and opaque backgrounds preserved; originals unchanged; processing applied once | Full-resolution PNG inspection; Step 13 |
| Engine-material effects | Flesh/glass/cloth defeat choices and new-project Mr Handy metallic hit default; stable semantics persist/export; legacy behaviour and banks preserved | Schema + browser + contract; Step 14; audible preview only with verified assets |
| Save/open reliability | Dirty edits tracked; cancellations/failures/corrupt/future archives preserve current project; originals/settings survive | Archive failure cases + browser; Step 15 |
| Export preflight | Blockers explain fixes; PNG/WAV/schedules/hashes consistent; video/colour/material intentions included; runtime-pending explicit | Archive/native + browser; Step 16 |
| Limits and cancellation | 2,000 frames, 512 MB originals, 128 MB decoded audio verified; extracted frames count; eight views/repeated operations bounded; cancellation permits reuse | Measured time/memory + browser; Step 17 |
| Accessibility/usability | Narrow/scaled windows, keyboard focus/dialogs/reduced motion; casual cat-video path clear; distinct authoring concepts labelled | Actual Windows browser interaction; Step 18 |
| Real-project sign-off | Real media exercises hostile→defeat→pickup→deploy→combat→idle/roam→repack; both targets/facing; save/close/reopen/export | Reproducible signed-off project/pack, visual review + listening; Step 19 |
| Release and GECK contract | Fresh package works offline; docs/sample/licences accurate; exact tested HTML packaged; versioned desired behaviour contract complete | Package hashes + fresh browser smoke + human sign-off; Steps 20–21 |

Release blockers: data loss, broken core workflows, missing offline dependencies, corrupt exports, unfulfilled required common-video cases or misleading claims. Optional DSP/retro effects/tracking/background removal/full media Undo/autosave/3D/GECK work remain outside v1.0 unless separately requested.

## Step 1 check record and next action

Read the plan, status, workspace instructions/board/index, supplied handoff, cloud/alpha handoffs, architecture, feature guide, README and work log. Inspected git status/remotes/branch/upstream/diff; fetched origin and compared heads; queried public repository metadata; checked file SHA-256/byte sizes and supplied-preview match; parsed 17 sources with node:vm; compared embedded module text; read Trial ZIP with vendored JSZip/CRC and compared HTML/docs; inventoried fixtures/evidence/tests and browser executable versions. No build, package, application edit or game operation occurred.

Next after the reviewed checkpoint: Step 2, portable Windows tests. Resolve any pending remote backup blocker recorded in STATUS.md alongside that work.
