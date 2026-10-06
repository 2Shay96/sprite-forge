# Sprite Forge Studio status

Updated: 6 October 2026.

## Current task

Step 5 automated acceptance checkpoint passed; human listening and visible-tab checks pending. See STEP5-ACCEPTANCE.md and STEP5-LISTENING-CHECKLIST.md. Fixed source-frame typing being overwritten by preview redraws. Supplied 0.7 appearance and all 19 workflow modules are maintained in sources; refreshed Trial package consistency passes. Step 5 remains open; Steps 6–21 remain pending. Real-media/listening acceptance is not established by the synthetic integration fixtures. Supplied preview, known-good baseline and old Trial package are preserved. No GECK/mod work occurred.

## Step 5 listening feedback and fix

User confirmed guided Chrome Combat music original/exported WAV listening works well, then reported unintuitive continuously looping Listen controls. Implemented Listen/Pause/Resume toggles for each original/converted audition; second click suspends, third resumes the same voice without restarting/reconverting, Stop resets labels, and aria-pressed reflects playing state. Native browser tests cover both controls, audio clock freeze, one voice and reset. Latest 16 mandatory regressions, six browser/audio suites in each of Chrome/Edge and Trial integrity pass (evidence/step5/listen-fixed-regressions, listen-fixed-chrome, listen-fixed-edge, listen-fixed-package). Remaining human listening/toggle/visible-tab checks still pending. No schema/export behavior change.

## Step 5 checkpoint

Chrome: 23 passing mandatory/browser/real-media suites across final-chrome-full and passed-chrome-formats receipts; Edge: 7 passing browser/real-media suites across final-edge-full and passed-edge-formats. Trial release integrity passes after preserving/repackaging Step 4 artifacts. Latest Listen-toggle HTML 8c8d03aee4c55d78320372a5666a3b253d4bba4a0e7c859cf78b16d96c684660; Trial ZIP 2562486a2a452eafd17cd30f4339b9f7aa48bd90d305a00cdac3cde850a3cfc4. Initial full-direction receipts retain their earlier artifact hash. No schema change. Search of user media folders found no latest authored project, Emet or distinct idle/attack media. Source originals are unchanged. See STEP5-ACCEPTANCE.md for evidence distinctions and full local receipt paths.

Next action: collect the user's Chrome/Edge listening and actual-tab-visibility results using STEP5-LISTENING-CHECKLIST.md, resolve any failures and close Step 5's gate before Step 6.

## Shared integration context

Created C:\Users\Shadow\Desktop\VibeCoding\FNV-SPRITE-FORGE-INTEGRATION-PLAN.md on 6 October after finding the existing mod-specific pipeline plan but no root shared document. It links the actual Studio checkout and mod handoff, tracks Studio capabilities versus user-selected mod-v1.0 support, records haunting defaults/limits and timer questions, and gives both agents an update/acknowledgement log. Mod status is attributed to its existing dated documents, not fresh game tests; Opus acknowledged on 6 October and recorded the user-selected standalone Salvatore mod-v1.0 subset; broader adapter capabilities are deferred for that mod release. Updated root PROJECTS.md for discoverability and corrected its old Studio checkout path. No mod-owned files were changed.

Read/update this shared file during related sessions after meaningful scope/schema/status changes. It is a local canonical file outside Git; it does not automatically notify Opus or sync to GitHub. Studio's public source checkpoint includes its own plan/status links only; private mod context remains in the shared workspace document. Step 5 has begun; automated checkpoint and human checklist are available.

## Step 4 changes and evidence

Planning addition, 6 October: added required Step 14a for a haunting-start delay range, placed after engine-material settings and before save/export audits. User-confirmed default is 1–3 days; each bound can be set from 4 hours to 10 days, with hour-level precision and minimum ≤ maximum. Includes Studio controls, validation/history, persistence/migration, Source Pack timer semantics and later FNV scheduler/save-reload acceptance in plan section 8. Clock unit and start/reset trigger decisions are explicitly pending implementation design. This update changes documentation only; no setting or mod scheduling is implemented yet. Step 5 remains the next selected implementation step.

- Added src/steps.js and src/roster.js from the authoritative preview; reviewed/integrated app.js, studio.js and action-controls.js hooks and wording. Initial recovery rebuilt the supplied preview byte for byte at its recorded hash. Corrected inherited pack.js export tool metadata from 0.6.2 to 0.7.0, matching the UI; project schema 7 / Source Pack schema 6 and core timing/media/placement/correction/audio/playback behavior contracts are unchanged.
- Focused real-browser test uses existing numbered PNG and stereo WAV fixtures through real controls. Checks main/extra imports, explicit state chips versus auto-fill, separate player/enemy attack links and once-return rules, cancelled/main replacement preserving extras, animation chips and independent timing, Next/compass/segmented controls, cue selection/import and summaries, field-state/programmatic routes, FX, and valid project/Source Pack downloads. Reopen preserves authored roster, state rules, media and timing. Fresh test-kit page verifies accepted drift/action kits route to Frame fixes/Field test. No user project tab was refreshed.
- Final combined Chrome command node tests/run.cjs --browser --package: 20/20 PASS (16 mandatory plus smoke, shell, workflow, release), exit 0. Report: evidence/test-runs/2026-10-05T23-52-28-114Z-16528/results.json. Chrome 154.0.8037.98. Edge 154.0.4258.53 smoke/shell/workflow all PASS: evidence/test-runs/2026-10-05T23-53-00-730Z-18300/results.json. Both browser runs are offline with no page exceptions or HTTP requests; static shell comparisons retain the supplied appearance at three widths. UTC evidence timestamps fall on 5 October; the session date in Europe/London is 6 October.
- Added code LICENSE to the refreshed Trial alongside JSZip and both font licenses/notices, then reran release integrity: PASS, evidence/test-runs/2026-10-05T23-55-11-456Z-19096/results.json. ZIP CRC, ZIP/loose HTML, current documents and licenses match exact source inputs. Package consistency register PACK-1 is resolved; full fresh-release/browser acceptance remains later-plan work.
- Repeated node build.mjs produces 1,803,375-byte HTML, SHA-256 b626c94cce900b6f7df260626c7616b4bbbfce6d5ff60138aa36bdfe374b5556. Current Trial ZIP: 1,214,656 bytes / 14 files, SHA-256 f3e0528230579c49ef221324a88e3f9126a6c2b4b5c7232e005d35291913724c. HTML/ZIP are local generated artifacts excluded from the scoped source commit; rebuild and package after fresh checkout. Documentation/Trial guide reflects the five-step workflow.
- Preserved old Trial ZIP and loose folder under _backup-0.6.2/trial-before-step4-2026-10-06. Verified original ZIP hash 85747568fc14d4004bc51c6615a122e66e10821761c5b08ab27ede5c286473db. Supplied preview and known-good _backup-0.6.2/SpriteForge.html retain their recorded hashes. No source media or mod/game assets were copied or changed.

## Preserved Step 3 changes and evidence

- Recovered exact supplied shell into src/index.html; reset into src/style.css and terminal theme into src/theme.css. Added src/fonts.css with local asset references; build.mjs embeds Share Tech Mono TTF and three exact supplied Barlow WOFF payloads. Embedded SVG textures, JSZip and Sunny reference match the preview. Font notices/licenses accompany the source assets.
- No behavior module changed. Build order remains 17 modules; steps/roster and preview changes to app/studio/action-controls await Step 4. New Next/Tune routing, roster/coverage, summaries, animation chips, segmented controls, FX and duplicate actions are not claimed functional. Schema 7 and Source Pack 6 remain unchanged.
- Static bundle check verifies entire supplied shell/styles/font payload equality, JSZip/Sunny identity, syntax, source inclusion, unique IDs, offline CSP and embedded assets. The build was repeated with identical SHA-256: 57a1a9dc3c1fbff812af5eb0ef4dc5c14c6c32144cc06768e39395a41d3a8402 (1,774,339 bytes). Generated SpriteForge.html is retained locally and excluded from this source checkpoint under plan 4.1; on fresh checkout run node build.mjs before tests/opening the intermediate build.
- Optional shell browser check preserves all 230 baseline IDs/tags/input bounds/types/accept attributes/data-setting bindings/select values. Four font faces load offline. Script-disabled, reduced-motion reference/rebuilt screenshots match byte for byte at 1440×1050, 1000×900 and 720×1000. This is shell rendering evidence, not workflow acceptance. Screenshot review confirms the delivered terminal design.
- Chrome 154.0.8037.98 shell PASS: evidence/test-runs/2026-10-05T16-59-21-486Z-7212/shell/shell-browser.json. Chrome live smoke PASS: evidence/test-runs/2026-10-05T16-58-03-840Z-5476/smoke/browser-smoke.json. Edge 154.0.4258.53 live smoke and shell PASS: evidence/test-runs/2026-10-05T16-59-43-275Z-22944/results.json. Both browsers recorded no page errors or HTTP requests. Smoke opens the recovered Test kits menu before using the existing demo import; its prior direct click correctly timed out while that menu was closed. Reports remain preserved.
- Final node tests/run.cjs --browser: all 16 mandatory suites plus Chrome smoke/shell PASS, exit 0. Report: evidence/test-runs/2026-10-05T17-03-14-830Z-19928/results.json. Real media/listening and complete live workflow/layout sign-off remain Step 5. Neither shell screenshots nor synthetic smoke establish those gates.
- Preserved supplied preview SHA-256 908f06d476e40e004bcc499c6d5a62dfba267a4ddbc99802b1bfde26782307e3 and known-good _backup-0.6.2/SpriteForge.html SHA-256 93ed65579cf1afb7d542f9975e362e90996a6ef0896059722d69af10fedad28b. Trial packaging is intentionally unchanged pending Step 4; its HTML is now older than the intermediate build, in addition to the recorded stale handoff.

## Preserved Step 2 changes

- Added tests/config.cjs and tests/run.cjs: project-relative paths independent of checkout name/current directory; explicitly configured dependencies/media/browser; isolated sequential processes; per-suite PASS/FAIL/BLOCKED, nonzero failure/block exits, logs and exact artifact hashes.
- Added private development package.json with the tested native/browser dependency versions. No installation was necessary: explicitly used the discovered bundled packages. A normal npm install route is documented, not claimed tested on this PC.
- Adapted existing tests to shared paths and separate generated output folders. No historical evidence or media was overwritten. Real Emet checks and historical archive reopen moved into optional suites; source-facing remains mandatory. Browser tests use encoded file URLs and configurable Chrome/Edge, without requiring a game/configuration repository.
- Separated mandatory source/bundle checks from optional Trial packaging checks. Kept obsolete historical browser workflows separately selectable; they are not current acceptance evidence.
- Corrected two pre-existing keyer-test wording assertions to the existing 0.6.2 labels, preserving their underlying draft/commit/history/crop checks. No application fix was needed.
- Updated README development instructions and tests/README.md with setup, commands, inputs, evidence distinctions and the Windows result summary.

## Preserved Step 2 checks and evidence

Baseline before edits: all 20 original executable scripts exited 1 before assertions due to Mac dependency paths or the assumed sprite-forge parent. Local report: evidence/windows-step2/pre-portability.json. After path adaptation, keyer-controls exposed old Draft/Crop to base wording; those expectations were corrected and the complete suite passed.

Final mandatory command: node tests/run.cjs, with SPRITE_FORGE_NODE_MODULES explicitly configured. **16/16 PASS**, exit 0 on Windows / Node v24.19.0; @napi-rs/canvas 0.1.100, sharp 0.35.4. Covers timing/reference/simulation, state playback, banks/audio clock, native placement/correction/archive/media pixels, mock-DOM controls, 8192² boundary, source facing and bundle/source integrity. Report: evidence/test-runs/2026-10-05T16-19-44-410Z-19072/results.json. Native/fake Web Audio/ImageDecoder results do not prove browser media decoding or audible output.

Optional historical-archives PASS: legacy schemas 1/2, actual 70-frame Salvatore front reopen and A4 banks. Initial combined report: evidence/test-runs/2026-10-05T14-53-11-040Z-18812/results.json (also records the earlier keyer failure and missing media; not the final mandatory verdict).

Offline headless smoke PASS in Chrome 154.0.8037.98 and Edge 154.0.4258.53 using Playwright 1.62.1: local-file startup, demo review/accept, transport, no page exceptions/HTTP requests. Reports: evidence/test-runs/2026-10-05T16-18-10-074Z-9156/smoke/browser-smoke.json and evidence/test-runs/2026-10-05T16-22-33-052Z-14660/smoke/browser-smoke.json. Fresh isolated browsers only; no user project tab refreshed. Full workflow/layout acceptance and human listening remain pending Step 5.

Runner verification PASS: absolute entry point from unrelated directory; nonexistent dependency explicitly BLOCKED with exit 2; existing stale package stays FAIL with exit 1 and actionable ALPHA-HANDOFF.md mismatch. All test sources parse. Application/source diff empty and stable/preview hashes unchanged.

Exact Step 2 baseline: SpriteForge.html 0.6.2, SHA-256 93ed65579cf1afb7d542f9975e362e90996a6ef0896059722d69af10fedad28b. Preserved supplied 0.7 preview SHA-256 908f06d476e40e004bcc499c6d5a62dfba267a4ddbc99802b1bfde26782307e3. Project schema 7 / Source Pack schema 6 unchanged.

## Tracked limitations

- Salvatore original media located at C:\Users\Shadow\Desktop\VibeCoding\fnv\source\Salvatore: eight directions × 70 PNGs, all 1080²; four referenced MP3/WAV files present. Set SPRITE_FORGE_SALVATORE / SPRITE_FORGE_SALVATORE_DIRECTIONS explicitly. Current offline Chrome/Edge import/save/reopen/export of all 560 frames and native conversion of four original recordings pass; human listening remains pending. Emet, latest user project, distinct idle/attack/voice and video inputs remain unresolved in inspected locations; see plan.md section 4.2. Obsolete browser/milestone2 scripts remain historical; current Step 5 suites use reviewed 0.7 controls.
- Trial consistency now passes after Step 4 refresh; old package is preserved. Missing packaged artifacts on a fresh checkout are BLOCKED until generated; default suites require no Trial package or historical archives. Full fresh-package release acceptance remains Steps 20–21.
- Current offline workflow, native image/GIF, correction/placement/action and real Salvatore frame/audio browser checks pass. Human listening/actual hidden tabs remain Step 5; latest authored project, Emet and real idle/attack recordings remain missing dependencies. Video acceptance belongs to later steps.

## GitHub checkpoint

Confirmed public repository https://github.com/2Shay96/sprite-forge; main tracks origin/main and CLI authentication works. Latest verified remote checkpoint before Step 5 is 215311db965f581a358bad5cfdff32360dbbaf03; fresh fetch showed 0 ahead / 0 behind. GitHub connector read access and write permission were verified again without opening a browser/Desktop. Scoped Step 5 source/tests/acceptance/checklist/status documentation is pushed and verified before session completion; the new commit need not contain its own SHA. The root shared file/PROJECTS.md are local, outside Git, and not part of that public commit.

Earlier connector content backup remains on checkpoint/windows-step2-media-2026-10-05 at 90ddca5c7cb7c1ba4e481b4d2bff8154191d8547, with tree equality verified against local 67d469d. CLI authentication now works; the original main-branch history backup is complete. No force push, merge or history rewrite occurred.

Preserved unrelated pre-existing ALPHA-HANDOFF.md modification and untracked CLOUD-HANDOFF.md, FILE-MANIFEST.json, START-HERE-WINDOWS.md and reference/. The Trial includes the current working handoff bytes, but that existing modification is not staged. Generated test output and packages stay ignored. Step 4 checkpoint scope is workflow sources, builder/package scripts, meaningful integration/package tests, license and documentation. Generated SpriteForge.html remains a deliberate local modification outside this commit.

## Next action

Collect the user's Chrome/Edge results from STEP5-LISTENING-CHECKLIST.md, resolve failures and sign off Step 5 before Step 6.

## Latest human acceptance — 6 October

Chrome: user confirmed new Listen/Pause/Resume works, Combat music loop has no audible gaps, and actual tab switching pauses audio without automatic resume. These checks passed on refreshed app/reopened project. Next: listen to original/exported versions of Defeated sound, On defeat and Summon / deployment; check defeated loop seam. Remaining checklist and Edge listening still pending; Step 5 stays unchecked.

Chrome human follow-up: remaining Defeated sound / On defeat / Summon original/exported comparisons and defeated-loop seam all passed. All four real cue comparisons and both loop seams passed. Next: test-tone gap/pause/cancellation and animated-preview actual hidden-tab check; extracted WAV listening and Edge remain pending.

## Centered standalone audio — 6 October

User confirmed Chrome tone/gap/pause/Stop and animated hidden-tab checks passed, then reported left-ear music on main Play. Cause: standalone/gallery advance positioned audio against the hidden encounter player. Fixed src/studio.js to co-locate listener with actor outside encounter; encounter retains spatial audio. Exposed native pan/gain diagnostics and added real-audio assertions for centered workbench/gallery and panned encounter in both browsers. Chrome real-audio/bank-controls/source-facing and Edge real-audio/workflow PASS; Trial integrity PASS. Latest HTML 7483b29bef54cbe74668d9f2b291655f321e8872ec67d02e3664d7d6b34fc276 (1,804,659 bytes); Trial ca9a2e0d9b5c4b6925ab48da07dd5448888a5679e2f19dcd76b622d65887954d. Receipts evidence/step5/center-chrome, center-edge, center-package. Previous Trial ZIP preserved. Next: human centered-playback recheck, extracted WAV listening and Edge checks. Step 5 remains open; no schema/mod change.
