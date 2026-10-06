# Step 5 acceptance checkpoint — 6 October 2026

Status: automated checkpoint passed; human listening/visible-tab acceptance pending. Step 5 remains unchecked and Step 6 has not started.

Tested Windows 0.7.0 HTML: 1,803,511 bytes, SHA-256 `d2fcabbfcba3f9cd6fb9bd798b1deb1ad28cdc93e8468013b42cee0611d25032`. Project schema 7 and Source Pack schema 6 are unchanged. Chrome 154.0.8037.98 and Edge 154.0.4258.53; Playwright 1.62.1; Node 24.19.0. All browser runs use fresh isolated, offline headless profiles. They do not refresh a user's project tab.

One real defect was found and fixed in src/keyer.js: continuous preview redraws replaced the source-frame input while a user was typing. The focused browser regression holds a typed value for 200 ms across redraws, then commits it with Tab and verifies the selected frame/interpolated correction. No design or schema change was needed.

| Area | Evidence and limits |
| --- | --- |
| Main/extra imports and timing | Actual controls preserve main versus extra clips, cancelled replacement, explicit state links, separate attack targets, per-clip timing and source-facing. Workflow save/reopen/export checks pass in both browsers. |
| Placement and corrections | Actual pointer drag, draft versus committed keys, source-index interpolation, revert, Original/Corrected preview, committed Undo, extra-clip scale/unlinked width/height/Undo/Redo and preview zoom independence pass in both browsers. Native tests separately cover affine output/crop/expand and limits. |
| Actions | Native browser test entry completes into return; Pause freezes elapsed; Queue one and pause interruption pass. Detailed Restart/Ignore/event damage/victory cancellation is covered by component tests with controlled clocks, not claimed as additional live-browser game acceptance. |
| Image formats | Native JPEG/PNG/WebP/GIF/static SVG decode, alpha/natural ordering, mixed-canvas explicit padding consent, save/reopen and common-canvas PNG export pass. Actual ImageDecoder extracts two transparent GIF frames with 100/250 ms source provenance; Source FPS still controls playback. External-resource SVG is rejected offline. AVIF and 8192² decode are native-raster component evidence, not freshly demonstrated browser imports. |
| Eight real directions | All eight Salvatore directions × 70 frames (560 original 1080² PNGs) import, share phase, save/reopen and export. Ping-pong duration 5.75 s remains independent of display sampling. Bounded proxies, ZIP CRC, all prepared PNG hashes and unchanged original hashes pass in both browsers. |
| Real sound | Four actual Salvatore MP3/WAV recordings decode in each browser; original source bytes persist in editable archives. Native OfflineAudioContext produces non-silent/unclipped mono 44.1 kHz PCM16 WAVs. Actual AudioContext pause freezes its clock; periodic bank reaches its finite two-play limit; delayed Stop cancels pending/active playback. Original speed is 1. CRC-valid project round trips and four exported WAVs pass. Human audibility/loop quality pending. |
| Banks | Weighted/sequence/avoid-last, references, ownership, cooldown, bounded overlap, entry handoff and full lifecycle cancellation have passing component evidence. Focused native audio checks prove periodic limit/pause/stop. Human test tones and state listening supplement this coverage; component results do not establish perceptual audio quality. |
| Hidden tab | Headless bringToFront did not make document.hidden true. No simulated visibility event is presented as actual hidden-tab evidence. Both browsers require the visible-tab listening checklist. |
| Offline/layout | No page exceptions or HTTP requests in current browser suites; reference shell/font comparisons pass at three widths. Comprehensive accessibility remains Step 18. |

## Reproducible receipts

- Chrome: evidence/step5/final-chrome-full/results.json — 22/22 PASS (16 mandatory, smoke/shell/workflow/acceptance, two real-media suites). Added browser-media receipt: evidence/step5/passed-chrome-formats/results.json — PASS. Combined coverage: 23 suites.
- Edge: evidence/step5/final-edge-full/results.json — 6/6 PASS (four browser and two real-media suites). Added browser-media receipt: evidence/step5/passed-edge-formats/results.json — PASS. Combined coverage: 7 browser/real-media suites.
- Trial integrity: evidence/step5/final-package/results.json — PASS. ZIP 1,214,716 bytes / 14 entries; SHA-256 `31766fcb50a05d0fda5dec509fbacb40a301ad77b858a8eeaef2d776a75a7131`. Packaged HTML matches the tested hash. Previous Step 4 Trial ZIP/folder preserved under _backup-0.6.2/trial-before-step5-2026-10-06.
- Prepared listening project: evidence/step5/final-chrome-audio/salvatore-listening.spriteforge.zip, SHA-256 `fea4bc542429c68b22cd2c675228aa59db1552f8ed3fc70cfa9c7f0f2d9e82d4`. Prepared pack: evidence/step5/final-chrome-audio/salvatore-listening-source-pack.zip, SHA-256 `591247c2a8e885d67cbea7b38488960511a5c57a76728494c6232652e83b653e`.

Commands: configure SPRITE_FORGE_NODE_MODULES, SPRITE_FORGE_SALVATORE and SPRITE_FORGE_SALVATORE_DIRECTIONS, then `node tests/run.cjs --browser --real-media`; repeat browser suites with SPRITE_FORGE_BROWSER_CHANNEL=msedge. `node tests/run.cjs --suite release` verifies the separately generated Trial. Evidence/media/generated artifacts remain local and ignored; source/tests/docs are the public checkpoint.

## Missing inputs and remaining gate

The user asked Codex to search for the missing inputs. Inspected Desktop, Downloads, Documents, Pictures, Videos and local OneDrive (only desktop.ini). Found all 560 Salvatore originals and four recordings under the previously located source root. Existing .spriteforge.zip files are historical or generated evidence; none establishes a latest user-authored project. No Emet media or distinct original idle/attack/voice recordings were found. This local search does not inspect cloud-only media or other machines. No source or game files were modified.

The user agreed to check playback. Complete STEP5-LISTENING-CHECKLIST.md in Chrome and Edge, record observations, fix any failures and rerun affected checks before checking Step 5 off. Real Emet/latest authored project/idle/attack acceptance stays explicitly unavailable and must be revisited in Step 19 with representative media. Do not relabel Salvatore music or test tones as distinct real idle/attack recordings. No video implementation or FNV integration has begun.
