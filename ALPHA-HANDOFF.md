# Alpha sign-off and Salvatore handoff

Studio 0.6.2 · 1 October 2026. This records proposals and acceptance criteria, not additional implementation instructions.

## Tomorrow: A → B → C

**A — Freeze a tested Sprite Forge alpha.** Save a real Salvatore project and Source Pack using the finished HTML. Earlier 0.2.0 has browser interaction evidence; 0.6.2 has native raster/archive, pure scheduler and mocked decoder/audio/control checks, with fresh browser acceptance pending because local-file browser control is blocked. Complete the short checklist below before calling this build proven.

**B — Finish the Salvatore mod independently.** Treat the installed working behavior as the game reference. Keep a known-good copy and record what happens in each state, including edge cases. The HTML defines desired behavior, but a successful browser preview alone cannot establish FNV support.

**C — Give the bridging agent both reproducible projects.** Include the HTML, saved .spriteforge.zip, Source Pack and its manifest; the ESP plus referenced NIF/DDS/WAV/other assets; script sources, source media, build spec/profile, dependency versions, build receipts and installation/test notes. An ESP alone does not contain the complete media/build pipeline. Include a short gameplay capture or explicit acceptance checklist for the intended behavior. The agent should first report supported mappings and gaps, then implement the smallest adapter against a preserved baseline.

Use the spec-driven `salvatore_mod.json` profile as the builder reference and verify each app’s registration points at that profile. A mismatched older `projects/salvatore.json` is a separate configuration issue. This document does not assert it has been changed or start configuration edits.

## Browser alpha checks

Save the current project before refreshing the existing offline HTML. No installed mod changes are needed.

1. Import opaque JPEG, transparent PNG and a mixed-size image sequence; confirm numeric order and deliberate right/bottom padding. Test tiny media and one 8192² image. Confirm an unsupported format gives a conversion message.
2. Import a transparent animated GIF; confirm extraction (or the explicit unsupported-browser message), frame count, transparency and the Source FPS/delay warning. Save/reopen and confirm the GIF original survives. Native variable-delay playback is not implemented.
3. Confirm one clip displays Main clip without a picker. Import `idle` through States & test → Add / manage animations; choose both clips, change independent timing and assign idle to Neutral idle. Reopen and check both.
4. Run the four-frame fixture in ping-pong: 0,1,2,3,2,1, with no doubled endpoints. Change Display FPS without changing cycle duration; change speed without changing audio pitch. Pause, step and scrub.
5. Import main/idle/attack with different native canvases. In Ground & scale, override each root/calibration/scale and confirm switching keeps roots on the same floor. Test inheritance, copy/reset, compare, drag, linked/unlinked width/height, Wide/Tall, offsets, and Undo/Redo (one step per slider gesture). Change zoom: placement values and Sunny proportions must stay unchanged. Confirm an over-8192 transformed output warns/rejects; reducing shape permits export. Save/reopen preserves profiles/native canvases, and Source Pack v6 output roots/physical mapping match preview.
6. Animation → Frame corrections → Load drift test. Add first/last keys using the guide, compare Original/Corrected and insert middle keys. Check drag plus Add/update, Revert, Linear/Hold/Smooth, delete/reset/Undo, zoom independence, unchanged source indices after FPS/range changes and ping-pong endpoints. Check first/last seam without automatic blending. Try expand/crop, save/reopen, then export while Original is selected: PNGs must still use enabled saved keys. Import real Emet footage and tune manual keys while retaining desired jumps/crouches. Test independent imported-view tracks and explicit copy/link. Replacing footage must remap unique identities or flag retained keys for review; discard/Undo/disable is explicit.
7. States & test → Load action test. Test attack→idle return, first-frame start, Restart/Ignore/Queue one, pause/scrub/step/resume, per-clip grounding/corrections and source-bound informational strike. Play Encounter: actual attacks must trigger once, ongoing combat audio must not restart on visual replay, and defeat/pickup/repack/victory must cancel action/queue. Damage/cadence must remain unchanged with different source/display FPS. Save/reopen rules and inspect Source Pack v6 separate action schedules (one cycle, repeat=false, explicit return). Legacy projects should keep Continue until changed. Try actual user idle/attack footage after the fixture.
8. Audio → Add two test tones → Test bank. Hear alternating tones and random 1–2s end-relative pauses. Pause during a gap, wait, then resume: the remaining gap must be preserved. Stop before a delayed sound and verify it never returns. Test with 2 real idle voice takes in Neutral idle and Neutral roam; only the synthetic tones are supplied automatically.
9. Test fixed gaps (equal min/max), random gaps, weights, avoid-last, take order, first delay, Play on entry off and finite total plays. Leave neutral via combat/repack and verify cancellation. Test an entry line handing off to quips. Exercise attack/hit cooldown/restart/bounded overlap, empty-cue silence, explicit references, take replacement/remove/Undo/Redo. Defeat once/continuous/repeat and early pickup must behave as authored; release exits cleanly.
10. Save/reopen a real-media project and export its Source Pack. Confirm source settings, clips, originals, all original takes, edits, weights/IDs, bank settings/references and state assignments survive, and PNG/WAV assets and exact schedules are present.
11. Check gold text/contrast and narrow-window controls. Refresh after saving; confirm nothing depends on a network connection. Log browser/version and pass/fail evidence.

## Sound proposals

| Option | Why it would help | Where it belongs |
| --- | --- | --- |
| Voice/event variations with “avoid last take” | A few different ouches, taunts, greetings and attack lines prevent repetition. | Runtime selection; retain each original take. |
| Cooldown / retrigger policy | Avoid a voice or hit sound firing every frame; choose ignore, restart or overlap. | Shared behavior contract, preview and FNV. |
| Music ducking / fades | Briefly lower music under a defeat voice or release line; smooth state changes. | Runtime mixer/envelopes; needs game parity. |
| Loop crossfade | Reduce clicks at loop seams; retain an attack portion before the looping sustain. | Offline export plus repeat bounds. |
| Pitch shift / speed | Robot, deep voice or comic variations. Preserve intended sound duration when pitch-only. | Optional offline processing; distinguish pitch from speed. |
| Radio / speaker filter | A restrained band-pass, distortion and optional static mix for a wasteland prop. | Offline processing so exported WAV matches audition. |
| Reverb / echo | A supernatural release or muffled defeated voice. Tail handling matters at loop boundaries. | Optional baked effect; avoid double processing in FNV. |
| Distance, occlusion and ambient layer | Quieter distant voices, indoor/outdoor tone and a small idling hum. | Primarily game-side sound settings; preview approximations. |
| Loudness matching / limiter | Consistent level across voice takes and music without harsh peaks. | Optional offline processing with honest clipping/peak checks. |

Already implemented: trim, gain, mono/WAV conversion, loop boundaries, preview volume/mute, positional preview, multi-take banks, weighted/ordered selection, avoid-last, fixed/random pauses, counts/delays, cooldown/retrigger/overlap, state cancellation and attack/hit/victory event triggers. Loop crossfade, ducking and processing effects remain proposed in A5. FNV behavior remains unverified. Keep original audio editable and record whether an effect is baked into samples or applied at runtime.

## Future bridge context — deferred

The user deferred FNV bridge work to focus on Studio and chose A4 first. The ordering below is historical handoff context, not the active implementation sequence. See FEATURE-EXPANSION-PLAN.md for current progress.

## Proposed milestone order

1. **Alpha sign-off:** acceptance evidence and a stable versioned sample project. Small recovery/autosave and full media-history improvements can follow without expanding game scope.
2. **Bridge contract:** map each Studio state, clip, direction, anchor, cycle schedule and sound policy to the known-good Salvatore mod. Specify phase continuation versus restart and fallback behavior explicitly.
3. **One-character adapter:** reproduce the proven Salvatore behavior from one Source Pack. Retain upright billboard mode 5, −U/+V UV direction and Scene Root zero-offset attachment. Compare generated assets, then prove the lifecycle in FNV. Do not jump directly to universal framework generation.
4. **Runtime parity:** add only missing features that are proven feasible: direction switching, separate idle/attack clips, roaming interruptions and audio policies. Document any approximation or unsupported feature visibly.
5. **Framework and distribution:** independent character registrations, project shelf for multiple characters, bundled offline conversion, Windows/other-browser acceptance and repeatable install/uninstall validation.
6. **Optional authoring expansion:** native variable-delay animated images, audio effect chains and a richer encounter view after the core bridge works.

## Minimum bridge acceptance matrix

| Studio intention | Game evidence required |
| --- | --- |
| Source FPS, speed, display FPS and ping-pong | The exact timestamped schedule is reproduced; endpoints and cycle duration match. |
| Ground anchor / authored scale | Correct NIF size and attachment; feet remain grounded at movement and zoom changes. Preview zoom is excluded. |
| Main / idle / attack / defeated clip assignments | Each actual state chooses the assigned clip; missing assignments use Main clip. Phase policy is explicit. |
| Defeat transition and ground item | One actor/item identity, correct shrink/drop behavior, early pickup cancels world sounds. |
| Inventory, deployment and repack | No duplicate item/actor, no orphan sounds, repeat deployment behaves consistently. |
| Neutral idle/roam and combat interruption | Idle and roaming match intended behavior; newly detected combat interrupts both and resumes appropriately. |
| Once/loop and loop boundaries | A one-shot never retriggers accidentally; loops stop on owner exit. State duration and sound completion rules are explicit. |
| Directions | Real and generated views retain provenance; missing-view fallback is defined. Billboard remains a supported fallback. |
| Saved project → Source Pack → game output | Same stable IDs/settings, reproducible outputs and build receipt. |

The Studio scope is the desired contract. The finished mod provides executable evidence. The bridge should make differences visible rather than silently equating an HTML control with a game feature.

## Layout makeover handoff

The 0.6.2 pass clarifies wording only. Preserve control IDs, data-tab/data-panel values, data-setting attributes, option values, input bounds, script order and event bindings when rearranging the layout. The modular sources live in src/; build.mjs regenerates SpriteForge.html and package.mjs refreshes the Trial ZIP. Do not edit only the bundled HTML if the makeover should survive rebuilding.

Keep these distinctions visible: import/replace main versus add extra animation; selected animation versus assigned behavior state; fixed per-clip feet/root versus per-frame artwork corrections; scaling pivot versus ground root; sprite size versus preview zoom; Source FPS/speed versus Display FPS; original-facing artwork versus automatic target mirroring in Encounter; saved keyframes versus unsaved adjustments. Player attacks and companion attacks are separate state assignments. Save Project preserves editable originals; Export Source Pack prepares media and playback contracts. FNV bridge remains deferred.
