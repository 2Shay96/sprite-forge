# Sprite Forge: frame corrections, sound banks and export styling

Planning addendum · 1 October 2026 · baseline Studio 0.2.2

**Progress — Studio 0.6.0:** A4 sound banks, A1 per-clip grounding/sizing/shape, A2 frame correction keys and A3 action playback are implemented, with fresh browser acceptance pending. User chose A4 first, then authorized A1, A2 and A3. A5–A7 remain proposals; DSP and export filters are not implemented. FNV bridge stays deferred. See FEATURE-GUIDE.md and evidence/a3-results.json.

Status: roadmap with implemented A1/A2/A3/A4 recorded above; remaining scope is proposal only. This document does not authorize additional application, media or mod changes. It adds authoring work alongside the existing Milestones 3–6; it does not replace their FNV verification gates. Historical proposal documents remain background.

## Decisions at a glance

| Request | Recommendation | Current status |
| --- | --- | --- |
| Correct shifting dance footage | Non-destructive, per-clip position/scale keyframes with interpolation. | New work. |
| Separate idle and attack animations | Use the existing clip library and state assignments; add explicit attack-entry/return behavior. | Multiple clips exist; exact attack choreography and game mapping are pending. |
| Wide/tall distortion | Linked sizing by default; optional independent width and height around the feet pivot. | New work. |
| More audio control | Sound banks with optional takes, modes, intervals, effects and explicit ownership. | Basic single-file slots exist; banks/scheduling/effects are new. |
| Blank audio | Empty assignments mean silence for that layer; inheritance must be explicit. | Requires changing the current neutral-music fallback, with migration. |
| Export appearance | Add Export settings as tab 7; rename/move Export Source Pack to tab 8. | New work. |

## 1. Evidence from the Emet sequence

Inspected the supplied folder read-only:

`/Users/seamuswulff/Desktop/Salvatore gon_ getcha (main asset source folder for GECK modding)/assets/emet_sprite_animation/`

There are **611 PNG frames**, all **1080 × 1080 RGBA**, approximately **229.21 MiB** compressed. Every frame contains visible alpha content. Across the sequence, alpha-bounded height spans 631–1066 px, horizontal bounding-box center spans 381–554 px, and the lower alpha boundary spans Y=993–1080. These are image-bound measurements, not reliable body-height or feet-tracking measurements. Several frames reach the bottom boundary; inspection should flag possible edge contact, without assuming source pixels are missing.

Visual samples at filenames ending 86489, 86534 and 86941 show a crouching/turning pose as well as a substantially larger figure nearer the camera. Automatic bounding-box normalization would confuse pose changes with camera distance. It could enlarge a crouch, anchor an airborne foot incorrectly or react to an outstretched arm. Start with manual correction keys; offer automatic suggestions later, with review. Pixels already outside the source frame cannot be recovered by stabilization.

The sequence fits the present 2,000-frame / 512 MiB project limits by itself. Actual remaining capacity depends on the other clips/directions/audio. Generating eight export views increases output size; limits and memory estimates must be checked before export. Do not embed this media in the HTML distributable.

## Priority checklist — per-animation grounding and sizing (A1)

Completed in Studio 0.4.0 at the user’s request. Each clip now retains its own native canvas and can override inherited grounding/size. The implementation checklist below is checked; manual browser acceptance remains separate.

- [x] Give each animation clip its own source-space feet/root point (X/Y), source ground line, alignment offset and scale/height calibration. States use the profile of their assigned clip, including attack animations.
- [x] Default clips to **Inherit main grounding & scale**; permit an explicit override for each clip. Migrate existing saves to inherited values so their appearance stays unchanged.
- [x] Keep the encounter/world ground plane consistent. Register each clip's own root to that same plane, so changing main→idle→attack does not move the character through the floor. Local root/alignment must remain separate from preview zoom and intentional airborne motion.
- [x] Allow clips with different native canvas dimensions without forcing users to resize them externally. Preserve originals and native coordinates; map/pad into a validated output canvas with an explicit transformed root. Respect the 8192px ceiling and media budgets.
- [x] Make Ground & scale clearly show which clip is being edited; support copy/reset of its profile and a transition comparison. Shared clips use the same profile in every assigned state; a distinct placement needs a separate clip/profile, rather than a hidden state-dependent transform.
- [x] Preserve profiles in project save/reopen and Source Pack metadata. Preview and export must evaluate the same transform; physical size must not change merely because output is padded or resampled.
- [x] Verify main/idle/attack with deliberately different dimensions, roots and scales, including switching, grounding, Sunny comparison, save/reopen and export mapping.

A1 is implemented before A2's per-frame correction keys. A2 then adjusts position/size over time within each clip, around its authored root. A3 supplies action restart/return policies. Linked/unlinked width/height distortion is included in A1.

## 2. Position and scale keyframes

- [x] Per-clip source-identity keys, position/uniform scale/pivot, Linear/Hold/Smooth with no overshoot, nearest-key hold and no automatic seam blend.
- [x] Draft number/drag editing, Add/update/delete/reset, general Undo/Redo, Original/Corrected and first/last seam view.
- [x] Fixed full-sequence expand/crop bounds, 8192 output guard, original-byte schema 6 reopen and Source Pack v5 baked pixels/matrices.
- [x] Generated views use front keys; imported views are independent with explicit front copy/link. Replacement remaps unique identities or retains review keys.
- [x] Native pixel/math/archive and full handler tests with mocks; synthetic drift fixture and small read-only real Emet sample.
- [ ] Fresh browser/manual acceptance and real Emet pose tuning (user will test).


Add a collapsible **Frame corrections** editor within Animation, rather than another navigation tab. Its purpose is to correct source framing, while retaining intentional dancing motion.

Implemented A2 workflow (Studio 0.5.0):

1. Select a clip and scrub to a useful starting pose.
2. Position the character, choose the feet/reference pivot, and set correction scale.
3. Press **Add keyframe**. Go to a later frame, adjust again, and add another key.
4. Preview the interpolated result; insert intermediate keys where camera motion changes.
5. Toggle Original / Corrected, delete a key, reset the track, or undo an edit.

Each key records full-sequence source-frame identity/index, horizontal/vertical offset, correction scale, pivot and interpolation. Default correction scale is uniform, leaving stylistic distortion to Ground & scale. Default interpolation is linear; add Hold and optional Smooth. Smooth must not overshoot values. Hold the nearest key before the first/after the last key. Do not secretly blend the last key back to the first at loop boundaries; show a seam comparison and let the user match them.

Keys follow the source frame, not wall-clock time. Changing Source FPS, playback speed, display FPS or selected range does not move them. Ping-pong applies the same correction to the same source frame in either direction. Source replacement/reordering must remap identifiable keys or request review; never silently attach a correction to a different pose.

Allow direct dragging plus number fields, and editing every frame if needed. Per-frame offsets are evaluated relative to a stable output feet/reference pivot. Vertical correction is optional: a dancer jumping should remain airborne unless the user deliberately removes that motion. Two start/end keys correct gradual drift; they do not guarantee stable size throughout arbitrary footage.

Keep a fixed, sequence-wide output canvas. Show bounds for the full corrected sequence, with **Expand canvas** or deliberate clipping choices. Canvas expansion adds transparent padding, not recovered image data. Guard output dimensions at 8192 px per side. Positive correction scales only; explicit flip controls can be a later option. Preserve originals and correction recipes in project saves; bake corrections into prepared PNGs for Source Pack export.

For generated directions, correct the front art first and derive views from it. Real imported views may require their own correction/alignment tracks. Permit copy/link of a track explicitly, but do not assume that the same pixel offsets fit every camera view.

Later optional tools: suggested feet points, body reference measurements, smoothing and tracking. Full pose estimation, video import, chroma keying and generative reconstruction are outside this first correction milestone.

## 3. Idle and attack clips: what works now

The HTML already supports separate clips, independent timing, state assignment, saving/reopening and Source Pack output. Import idle/attack through **States & test → Clip library**. The picker above the preview selects the animation being inspected or edited; switching it does not itself tell the encounter to attack.

Suggested mapping:

| Existing state | Suggested clip |
| --- | --- |
| Hostile approach | Main dance, or an approach clip if available. |
| Hostile attack | Attack. |
| Companion combat | Attack as a temporary preview choice; split idle-between-attacks from actual attack actions for proper choreography. |
| Neutral idle | Idle. |
| Neutral roam | Idle, or a separate moving/walking clip. |
| Defeat transition / defeated item | Main fallback until separate defeat art exists. |
| Inventory / deployment / repack | Main fallback or bespoke clips when supplied. |

Clips can have different frame counts/FPS/durations. Real directions must match the frame count of their own clip. As of 0.5.0, extra clips retain native canvases and inherited/overridden root/calibration/scale/shape profiles. New idle/attack images have not been supplied here, so their alignment/dimensions cannot yet be validated. A1 alignment and A2 per-frame corrections are implemented.

A3 is implemented in Studio 0.6.0: Continue/Restart/one-cycle-return bindings, actual combat-event triggers, bounded Restart/Ignore/Queue one, immediate owner-exit cancellation and optional source-bound informational strike markers. Schema 7 saves rules and Source Pack v6 records exact action schedules/return behavior. Pure clock and full handler/native Canvas/ZIP tests pass; fresh browser acceptance with user idle/attack footage remains pending.

- [x] Per-binding Continue, Restart on entry and one-cycle-return clocks with explicit return clips.
- [x] Actual attack-event triggering for both combat roles; Restart/Ignore/Queue one and owner-exit cancellation.
- [x] Informational source-bound strike markers, gallery tests, synthetic idle/attack fixture and playback transport.
- [x] Per-clip placement/corrections/audio independence, general binding Undo/Redo, schema 7 and Source Pack v6 action schedules.
- [x] Pure seeded gameplay parity and full App/Studio handler/native Canvas/archive acceptance checks.
- [ ] Fresh browser/user idle/attack footage acceptance. Game combat events/semantics still require the deferred adapter and runtime parity milestones.

## 4. Width and height distortion

Keep the existing 1–200% **Sprite scale** as authored overall size. Add a linked **Shape** control: Width 100%, Height 100%. Link is on by default; unlink permits independent 1–400% multipliers, with typed values and sliders. These proposed ranges should be tested against output bounds; the 8192px export ceiling still applies.

Simple presets: Normal (100/100), Wide (250/100), Tall (100/175). Apply the shape around the feet pivot so the character stays grounded. Preview zoom remains independent. Sunny keeps her correct aspect ratio and receives none of these transformations.

Global shape is separate from per-frame footage correction: a deliberate Wide preset should not be undone by a stabilization track. Persist both. Record the intended physical width/height for the adapter, and bake artistic deformation once; never multiply it again accidentally in the game. Visual widening does not automatically widen gameplay collision or change AI reach.

## 5. Audio model and workflow

Keep Audio as one tab. Replace “one file per slot” with an optional **sound bank** for each cue. A bank contains one or more original takes, per-take edits and shared scheduling/effect settings. Existing single-file slots migrate to one-take banks without changing their sound.

Use three distinct layers:

- **Beds:** continuous music, ambient hum or a sustained defeated sound.
- **Entry/exit cues:** a deployment line, defeat sting, pickup or an idle-entry “hmm”.
- **Events/periodic quips:** attack, hurt, or occasional idle remarks.

Blank banks mean silence for that cue/layer. Blank idle/roam beds must not silently reuse combat music. If inheritance is offered, expose **Use this other bank** explicitly. Existing projects currently inherit music into neutral states when no idle file exists; migrate that behavior as an explicit reference so old saves do not change silently. An empty attack cue can coexist with an explicitly assigned combat music bed; “blank” does not remove unrelated layers.

Workflow: choose a cue → add takes → trim and balance them → choose playback mode/selection/interval → add optional effects → audition the processed take → test the cue in State Gallery/Encounter → save/export. Keep advanced controls collapsed. Test a whole bank over a short simulation so pauses and selection rules are audible, rather than only offering file solo.

### Playback modes

| Mode | Behavior |
| --- | --- |
| Play once | One take on the configured event/entry; no automatic retrigger. |
| Continuous loop | Repeat the loop region while its owner is active; optional overlap/crossfade at the seam. |
| Repeat after a pause | Finish a take, wait a fixed or random gap, then select/play another. |
| Periodic quips | Select among takes at fixed/random gaps; optional first quip on entry. |

Specify repeat counts (unlimited or N), first-play delay, minimum/maximum gap, weights and **Avoid last take**. Measure the gap from the end of the audible take/tail, not its start. Default to one simultaneous voice in a bank. Expose retrigger policies: ignore while playing, restart, or bounded overlap. Add cooldowns for frequent events such as hit/attack.

“Soft dissolve” has two meanings. A continuous hum can crossfade its loop end into its beginning. Discrete “hmm” quips with deliberate silence should instead use short fade-out/fade-in edges; crossfading across their pause would erase the requested silence. Fade/crossfade lengths must be bounded by take/loop length and audition the actual output.

### Two idle quips example

Add `hmm_1` and `hmm_2` to a shared **Neutral quips** bank, enabled in idle and roaming. Choose Periodic quips; Play on entry on; random gap 5–12 seconds; short fades, initially 30ms; no overlap; optional music ducking. These are proposed defaults, not edits to supplied audio.

On entering neutral behavior, pick a take and play it. After it finishes, wait a freshly drawn gap, then pick the next. Switching idle ↔ roam retains this bank’s timer and current sound, so every roam pause does not create another “hmm”. Combat, pickup or repack cancels its timer and sound according to its exit fade. Returning to neutral begins a new neutral session.

With exactly two takes and Avoid last take enabled, the takes alternate while the intervals remain random. Turn that option off for genuinely independent random selection, which can repeat a take. Weighted selection is optional. Use an audio random generator separate from the roam generator, so adding a sound does not change walking paths. A fixed preview seed makes failures reproducible; runtime must match policy, not necessarily the browser’s exact random sequence.

### Audio cues and states

All rows are optional; empty banks are silent. A state can own a bed while several events happen within it. These are the proposed full framework cues, not a claim that every game hook exists today.

| State/event | Proposed cue(s) | Default policy |
| --- | --- | --- |
| Hostile approach / detection | Hostile music bed; noticed-player/taunt entry. | Bed loops if assigned; entry once. |
| Hostile attack | Attack voice; attack/impact effects at action markers. | Once per actual action, with cooldown. |
| Taking damage / hit | Hurt voice or impact bank. | Once per hit, cooldown/ignore-overlap. Applies in hostile or companion states. |
| Defeat transition | Defeat sting/voice. | Once; optional repeat/loop chosen explicitly. |
| Defeated ground item | Ground groan/hum bank. | Once, continuous, or repeat-after-gap as selected. |
| Pickup | Pickup sound/line. | Once when the item is actually collected. |
| Stored in inventory | Optional UI/inventory cue; no world bed by default. | Silent by default; no world quip timers. |
| Pip-Boy summon / deployment | Summon/release line and effect. | Once on committed deployment, not menu opening/highlighting or a canceled selection. |
| Companion combat start | Combat entry line; companion music bed. | Entry once; bed continuous if assigned. |
| Companion attack | Attack bank, shared with hostile attack or explicitly overridden. | Once per actual attack. |
| Enemy defeated / combat finished | Victory line or stinger. | Once per resolved combat outcome, with cooldown. |
| Neutral idle entry | Idle entry cue. | Once per neutral session; avoid duplicating the periodic bank’s first play. |
| Neutral idle | Idle bed and/or periodic neutral quips. | Bed continuous; quips fixed/random gaps. |
| Neutral roaming | Roam bed/footsteps/quips. | Optional shared neutral bank, retaining timers across idle/roam. |
| New enemy noticed / combat interruption | Alert line/effect. | Once on detection; cancel incompatible neutral sounds. |
| Repack / dismissal | Return-to-inventory line/effect. | Once; cancel world banks and pending timers. |
| Optional interaction / repair | Greeting, inspect, repair/use cue. | Reserved extension points; actual gameplay support later. |

Hurt, detection and individual companion attack are events rather than new persistent gallery states. Do not inflate the state machine solely to add sounds. Looping defeat sting versus ground-loop priority should be explicit: default sting once → ground bank; choosing an indefinitely looping sting suppresses the subsequent ground bank until pickup. Summon completion should be gameplay-controlled, rather than hanging forever because its audio loops. Cosmetic audio does not prevent pickup/deployment.

### Complete proposed audio feature inventory

| Feature group | Existing baseline | Planned addition |
| --- | --- | --- |
| Import / provenance | Browser-decodable audio, originals, checksums and bounds. | Multiple takes per bank, rename/reorder/replace and bank copy/reference. |
| Editing | Trim, gain, mute, loop points, waveform. | Fade handles, loop-seam comparison, per-take undo/history and processed waveform. |
| Scheduling | Once/loop, slot ownership, cleanup. | Fixed/random gaps, counts, delayed entry, weighted choices, no-repeat, cooldowns, retrigger policy and explicit state-family ownership. |
| Balance | Master preview volume, per-take export gain, mono peak checks. | Voice/music/SFX buses, take loudness matching, automatic music ducking and crossfades on state changes. |
| Loop quality | Basic sample boundaries. | Click-free fades and crossfade loops; verify exact exported loop-region duration/sample indices. |
| Tone | No authored tone effects yet. | High/low-pass and radio/speaker filter, EQ, restrained distortion/saturation, optional static/noise layer. |
| Space | Positional pan/distance preview. | Reverb and echo, tail controls; declared game-side distance/occlusion settings where supported. |
| Pitch / texture | Playback independent of sprite speed. | Linked pitch+speed first; pitch-only/time-stretch later after an offline size/quality prototype. Optional bit depth/sample-rate reduction and tremolo. |
| Dynamics | Clipping rejection. | Optional loudness normalization, compressor/limiter; bypass and honest peak reporting. |
| Audition / diagnostics | Source and actual converted WAV listening. | A/B original/processed, bank simulation, trigger log, seed replay and active-voice/ducking readout. |
| Export | 44.1kHz mono PCM16 WAV, trim/gain baked, loop metadata. | Each bank take separately exported, effect recipes/processed hashes, scheduler rules, validated runtime capabilities and migration. |

Split processing from scheduling. Filters/fades/dynamics can be baked into each WAV and must match processed audition. Random choices, intervals, cooldowns, ownership and ducking require runtime policy; a WAV file alone cannot implement them. Effects are non-destructive recipes with order, parameters, bypass and presets. Tail handling must be explicit; loop points are recalculated after processing, never copied blindly from the source. Mono downmix, resampling, gain and limiter must not be applied twice. Blank banks export no sound file/record.

The first FNV adapter may only support the existing single-take sound contract. Source Packs can describe richer banks, but any unsupported game behavior must be reported before claiming a game-ready build. No silent flattening of two quips into one long baked recording with hidden timing compromises.

## 6. Export settings: eight tabs and a visual effect stack

Proposed navigation: **1 Import · 2 Animation · 3 Ground & scale · 4 Directions · 5 Audio · 6 States & test · 7 Export settings · 8 Export Source Pack.** Keep the top Export Source Pack button. Tab 8 holds validation, output summary, schedules and the export action; tab 7 edits appearance. Save Project preserves originals and recipes.

Offer an enabled checkbox and **Resolution 1–100%** slider, with resulting pixel dimensions shown. Add explicit Width/Height for exact dimensions and an aspect-ratio lock. A 1080² canvas at 20% is 216²; **200 × 200** needs approximately 18.52%, so an exact-size field/preset is necessary. Round to positive integer dimensions; 1% never means zero pixels. Non-square art keeps its aspect ratio unless the user deliberately unlocks it. Low resolution changes pixel density, not authored game height, feet position, animation timing or collision.

Label the preset **DOOM-style**, not a historically exact DOOM renderer. A proposed starting preset is roughly 200px on the long side, nearest-neighbor display, one shared limited palette, restrained contrast/posterization and optional ordered dithering. It remains editable and includes **Reset**. No outside game textures/assets are necessary.

Mixable controls:

| Effect | Proposed control / notes |
| --- | --- |
| Desaturate | 0–100%; retain alpha. |
| Shared low-color palette | Color count, e.g. 8/16/32/64/256; custom palette optional. Use one palette across frames/views to reduce flicker. |
| Posterize | Quantization levels per channel; distinct from an exact limited-color palette. |
| Hellish red | Tint amount, hue and retained shadow/highlight detail. |
| Sharpen | Amount/radius; clamp and protect soft alpha edges from halos. |
| Contrast / brightness / gamma | Separate restrained controls; preview clipping. |
| Warm gold / sepia | Tint intensity; useful alternative to red. |
| Hue / saturation | Small reversible adjustments or full-color stylization. |
| Ordered dithering | Off/Bayer-style pattern and strength; stable sprite-canvas coordinates across frames. |
| CRT/pixel scanlines | Optional baked alpha-safe art effect; clearly separate from preview-only Workbench grain. |
| Edge outline | Width/color/opacity; expand transparent bounds deliberately, preserving feet placement. |

Default every artistic effect off. Keep preset selection plus a compact fixed-order stack initially; arbitrary draggable order is later work because different orders produce different results. Show A/B original/processed, actual-size pixel preview, effective dimensions, enabled-effect summary and estimated export cost. Test multiple poses and all directions before accepting a look.

Proposed first order: frame correction/alignment → global shape → direction preparation → fixed common canvas → resolution resampling → optional restrained sharpening → color/tone → shared palette/posterization → dithering/outline/scanline finish. Alpha-aware operations and padding/gutters must prevent dark fringes. Decide resampler explicitly: alpha-aware smooth filtering versus nearest-neighbor pixelation. Frame-local automatic palettes/exposure are unsuitable defaults because they can flicker.

Generated views may use different colors due to rear darkening, but palette selection must remain shared. Cross-frame palette sampling should be bounded and deterministic; alpha-zero pixels must not dominate palette extraction. Transparent pixels stay transparent, and partially transparent edges need a deliberate policy rather than an accidental opaque box. No effect changes frame count or timestamps.

## 7. Data and bridge contract changes

Before adding controls, specify versioned project and Source Pack schemas for correction tracks, per-clip alignment, axis multipliers, output dimensions, effect recipes, audio banks and trigger policies. Old saves migrate to identity corrections, linked shape, bypassed visual effects and equivalent single-take audio/inheritance. Preserve old fields until the existing builder’s interpretation is explicit; do not silently repurpose `scalePercent` or an old sound-slot ID.

Have one evaluated render recipe used by preview and full-resolution export. Keep source coordinates and authored physical dimensions separate from processed output pixel coordinates. Export the transformed feet anchor, source-to-output mapping, output canvas, physical width/height and checksums. Padding, crop and low-res output must not recalibrate the character’s world size unintentionally. The adapter applies authored sizing once. Corrections/effects baked into PNG/WAV must not also be replayed as runtime effects.

Schedules continue referencing exact source poses and sampled holds. Correction tracks retain source-frame identity even when selected ranges, ping-pong or lower Display FPS repeat/skip poses. Preview zoom, Sunny, Workbench grain and master listening volume remain presentation settings. Export effects are explicitly authored and included in the processed assets.

Retain offline/no-server/no-CDN operation, bounded proxy caching, sequential export and Cancel. Add full undo for the new recipes/bank edits rather than copying every image buffer. Estimate expanded output bounds and processing/memory cost before building. These features do not authorize changes to the installed Salvatore mod.

## 8. Additional milestones alongside the existing roadmap

Keep original Milestone 3 (real FNV adapter), 4 (self-contained exporter), 5 (runtime parity/reusable characters) and 6 (additional games). Add separately named authoring milestones to avoid implying they are already included or complete.

| Add-on | Scope | Completion gate |
| --- | --- | --- |
| A1 — Per-clip grounding, sizing and shape | Per-clip ground/root/offset/scale and native canvas mapping; schema/migrations, transform order, linked/unlinked shape. | Different-height main/idle/attack clips stay registered to one ground plane; old projects unchanged; save/reopen/export mapping agree. |
| A2 — Keyframe workbench | Manual keys, interpolation, undo, bounds and original/corrected preview. | Emet drift is correctable without automatically flattening its crouches/jumps; keys behave identically in ping-pong and export. |
| A3 — Action clip policies | Idle/attack import acceptance, restart/continue/once-return and optional action markers. | Main↔idle↔attack transitions and interruptions are demonstrable; continuous audio remains independent. |
| A4 — Sound banks and scheduling | Blank-silence rules, takes, intervals, cooldowns, selection and cancellation. | Two idle quips work at random gaps; no doubled neutral-entry cue, repeated one-shot or orphan timer. |
| A5 — Audio processing | Fades/crossfade seams, balance/ducking, basic tone presets, processed audition. | Exported WAV matches audition; fades/tails/loop indices/peaks verified. Expensive pitch-only/reverb features gated by prototype. |
| A6 — Export look | Eighth tab, resolution/exact dimensions, first fixed-order visual stack and presets. | 200² output preserves timing, alpha, grounding and world dimensions; palette/dither do not flicker across frames. |
| A7 — Combined acceptance | Real Salvatore idle/attack plus Emet; old/new saves; source/output provenance; offline and performance checks. | One signed-off authoring release and clear capability list for the FNV bridge. |

Current sequence: A4, A1, A2 and A3 are implemented. Finish browser alpha checks with real footage. A5 audio processing and A6 export filters follow as separate releases; A7 verifies them together. Further implementation needs the user’s direction. The FNV bridge stays deferred.

Before execution, settle this plan’s proposed scope and defaults. No automatic tracking, video editor, pitch-only time-stretch engine, universal game exporter or project shelf is silently folded into A1–A6.

## 9. Acceptance checks to add

- **Keys:** exact key poses, interpolation/hold/smooth, no overshoot, source-index stability, loop seam, selected ranges, ping-pong and deliberate airborne motion.
- **Shape:** wide/tall presets, fixed feet pivot, unchanged Sunny and preview zoom, bounds/canvas expansion, no double application in prepared assets.
- **Clips:** independently timed idle/attack, alignment differences, actual action restarts/return, interruption and save/reopen. Verify in FNV separately.
- **Audio:** silent blanks, explicit inheritance migration, seeded selections, two-take alternation/random behavior, min/max gaps, no overlaps/retrigger spam, neutral idle/roam continuity, early pickup, pause/hidden-tab cleanup and reset.
- **DSP:** A/B rendered samples, mono/resampling consistency, clipping, limiter bypass, tail policy, seamless loop boundaries and correct processed sample indices.
- **Export look:** exact 200² versus 20%=216², 1% minimum dimensions, non-square aspect lock, stable palettes/dither, soft alpha edges and outline bounds. Physical size/timing unchanged by resolution.
- **Persistence:** legacy/new saves, original hashes, full recipes, stable IDs and explicitly unsupported target features.
- **Offline/performance:** large Emet inputs, cancellation, repeat exports and the combined project’s actual budget. Fresh browser interactions and game validation remain distinct acceptance stages.
