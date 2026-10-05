# Sprite Forge Studio status

Updated: 5 October 2026.

## Current task

Step 2 tests complete. Follow-up: requested GitHub connector discovery and explicit pre-Step 3 media/package register complete locally; GitHub connection and push remain pending. Steps 3–21 remain pending. Application sources, HTML, supplied preview and packages are unchanged; no rebuild or GECK/mod work occurred.

## Changes

- Added tests/config.cjs and tests/run.cjs: project-relative paths independent of checkout name/current directory; explicitly configured dependencies/media/browser; isolated sequential processes; per-suite PASS/FAIL/BLOCKED, nonzero failure/block exits, logs and exact artifact hashes.
- Added private development package.json with the tested native/browser dependency versions. No installation was necessary: explicitly used the discovered bundled packages. A normal npm install route is documented, not claimed tested on this PC.
- Adapted existing tests to shared paths and separate generated output folders. No historical evidence or media was overwritten. Real Emet checks and historical archive reopen moved into optional suites; source-facing remains mandatory. Browser tests use encoded file URLs and configurable Chrome/Edge, without requiring a game/configuration repository.
- Separated mandatory source/bundle checks from optional Trial packaging checks. Kept obsolete historical browser workflows separately selectable; they are not current acceptance evidence.
- Corrected two pre-existing keyer-test wording assertions to the existing 0.6.2 labels, preserving their underlying draft/commit/history/crop checks. No application fix was needed.
- Updated README development instructions and tests/README.md with setup, commands, inputs, evidence distinctions and the Windows result summary.

## Checks and evidence

Baseline before edits: all 20 original executable scripts exited 1 before assertions due to Mac dependency paths or the assumed sprite-forge parent. Local report: evidence/windows-step2/pre-portability.json. After path adaptation, keyer-controls exposed old Draft/Crop to base wording; those expectations were corrected and the complete suite passed.

Final mandatory command: node tests/run.cjs, with SPRITE_FORGE_NODE_MODULES explicitly configured. **16/16 PASS**, exit 0 on Windows / Node v24.19.0; @napi-rs/canvas 0.1.100, sharp 0.35.4. Covers timing/reference/simulation, state playback, banks/audio clock, native placement/correction/archive/media pixels, mock-DOM controls, 8192² boundary, source facing and bundle/source integrity. Report: evidence/test-runs/2026-10-05T16-19-44-410Z-19072/results.json. Native/fake Web Audio/ImageDecoder results do not prove browser media decoding or audible output.

Optional historical-archives PASS: legacy schemas 1/2, actual 70-frame Salvatore front reopen and A4 banks. Initial combined report: evidence/test-runs/2026-10-05T14-53-11-040Z-18812/results.json (also records the earlier keyer failure and missing media; not the final mandatory verdict).

Offline headless smoke PASS in Chrome 154.0.8037.98 and Edge 154.0.4258.53 using Playwright 1.62.1: local-file startup, demo review/accept, transport, no page exceptions/HTTP requests. Reports: evidence/test-runs/2026-10-05T16-18-10-074Z-9156/smoke/browser-smoke.json and evidence/test-runs/2026-10-05T16-22-33-052Z-14660/smoke/browser-smoke.json. Fresh isolated browsers only; no user project tab refreshed. Full workflow/layout acceptance and human listening remain pending Step 5.

Runner verification PASS: absolute entry point from unrelated directory; nonexistent dependency explicitly BLOCKED with exit 2; existing stale package stays FAIL with exit 1 and actionable ALPHA-HANDOFF.md mismatch. All test sources parse. Application/source diff empty and stable/preview hashes unchanged.

Exact tested baseline: SpriteForge.html 0.6.2, SHA-256 93ed65579cf1afb7d542f9975e362e90996a6ef0896059722d69af10fedad28b. Preserved supplied 0.7 preview SHA-256 908f06d476e40e004bcc499c6d5a62dfba267a4ddbc99802b1bfde26782307e3. Project schema 7 / Source Pack schema 6 unchanged.

## Tracked limitations

- Salvatore original media located at C:\Users\Shadow\Desktop\VibeCoding\fnv\source\Salvatore: eight directions × 70 PNGs, all 1080²; four referenced MP3/WAV files present. Set SPRITE_FORGE_SALVATORE / SPRITE_FORGE_SALVATORE_DIRECTIONS explicitly. Read-only inventory of all 560 PNG headers/hashes; no import/export/listening acceptance claimed. Emet, latest user project, distinct idle/attack/voice and video inputs remain unresolved in inspected locations; see plan.md section 4.2. Older browser/milestone2 scripts still need assertion review before Step 5.
- Optional release packaging FAILS on the pre-existing packaged ALPHA-HANDOFF.md mismatch. Preserve the old Trial ZIP; reconcile it after source integration. Missing packaged artifacts on a fresh checkout are BLOCKED; default suites require no generated package or historical archives.
- Full browser workflow, listening, latest authored project, real idle/attack recordings and required video fixture acceptance remain outstanding later-plan work.

## GitHub checkpoint

Confirmed repository https://github.com/2Shay96/sprite-forge; main tracks origin/main. Last verified remote checkpoint before this step: 9b0f0dd2742facfd2faece107bcadaa3a212ef1a. Initial fetch showed 0/0 ahead/behind. Use verified @2Shay96 GitHub Desktop sign-in for pushes; CLI authentication remains unavailable. Step 2 local commit is fc577f6e155c9ae88e2c46ae866ccebd69f8f101, not yet on remote main (fresh fetch: 1 ahead / 0 behind). Its Desktop push was interrupted when the user stopped Computer Use. User now requests connector/API access instead of UI control. Plugin discovery confirms GitHub is available but not installed/connected; installation/connection was suggested and must be confirmed before its tools can be used. This documentation follow-up is also pending push. Public fetch succeeds but does not establish authenticated write access.

Preserved unrelated pre-existing ALPHA-HANDOFF.md modification and untracked CLOUD-HANDOFF.md, FILE-MANIFEST.json, START-HERE-WINDOWS.md and reference/. Generated test output stays ignored. Checkpoint scope is tests, package.json, README, plan and status only.

## Next action

Install/connect the GitHub integration and inspect its actual tools to finish the pending main-branch backup without desktop control. Media and Trial ZIP tasks are explicitly listed in plan.md section 4.2; Step 3 has not begun.
