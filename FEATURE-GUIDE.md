# Sprite Forge — feature walkthrough

Start with **Test kits → Numbered frames → Use this sequence → Play**, or import your main animation in **01 Animations**. This guide describes Studio 0.7.0. Everything stays on your computer.

The five workflow steps are **Animations → Tune → Sound → Field test → Export**. Tune contains Size & ground, Directions, Timing and Frame fixes. The sections below explain the underlying controls. Video import remains a later planned feature.

## Main clip and the clip picker

A **clip** is one ordered sequence of animation frames. Its Clip ID (for example, `dance`) is an internal export name, not a command to make the character dance. **Main clip** means it is the default animation for states that have no specific clip assigned. The older label was “dance · base”.

For example, tick Idle in Animations, choose its name and state chips, then import it. Selected state chips create explicit links; Auto-fill updates automatic links while preserving your choices. Coverage lists all ten states, including separate Attack player and Attack enemy assignments. Other unassigned states fall back to `dance`. Extra clips retain independent timing and native canvases and inherit main grounding/size unless overridden. Select an animation chip above the preview, then edit it in Tune. Next walks through the four Tune panels and then the next animation. Replacing main frames preserves extra clips; cancelling review keeps the current frames. Opening another project replaces it. Separate browser tabs must each be saved independently.

## 1. Import frames

**Choose images** accepts browser-decodable images: PNG, JPEG, WebP, GIF, AVIF, BMP and self-contained static SVG, including a single frame. Opaque images retain their backgrounds. Unsupported formats, such as PSD or a HEIC your browser cannot decode, need conversion. Drag-and-drop also works. The review shows order, sizes and warnings before you accept. Numeric order puts frame_2 before frame_10. Gaps do not create blank frames. Duplicate indices/names and unreadable images are rejected. Empty pause frames can be retained; an entirely empty animation is rejected. Mixed sizes need explicit transparent padding; they are not stretched. There is no minimum beyond 1 pixel per side. **1080 × 1080** is recommended; both dimensions may be up to **8192 pixels**. Large images need more memory and take longer to export, especially across eight views.

Animated GIF/APNG/WebP import extracts composited alpha-preserving frames when the browser provides [ImageDecoder](https://developer.mozilla.org/en-US/docs/Web/API/ImageDecoder). Without it, the file is rejected with an extraction message rather than silently becoming a still image. Original animated bytes and per-frame delays are preserved in the saved project. **Playback uses the clip’s chosen Source FPS**, so unequal original delays are not automatically reproduced. Full native-delay playback is a future enhancement. SVGs must have no scripts, animation or external resources. Source Packs always normalize images into actual PNGs.

- **Character name:** readable project/pack label, intended for the future NPC name.
- **Character ID:** stable output folder name, such as `sunny_smiles`.
- **Clip ID:** animation/schedule name, such as `dance`, `idle` or `attack`.

IDs use lower-case letters, digits and underscores and start with a letter. Changing names here does not rename the installed mod or create game records.

**Load test frames** supplies four synthetic poses numbered 0–3, coloured left/right markers and a fixed feet cross. Filenames 1, 2, 3 and 10 deliberately produce a gap warning. They are a diagnostic example, not another character preset.

## 2. Animation and playback

**Source FPS** tells the tool how many original frames belong in one second. **Playback speed** speeds/slows that timeline. **Display FPS** controls how often the visible pose updates; lowering it makes motion choppier without slowing the cycle. The six buttons are display-rate presets.

**Forward loop** repeats start to end. **Ping-pong** repeats forward and backward without doubling turning endpoints: 0,1,2,3,2,1. **Play once** holds the last pose. Reversing the sprite never reverses audio or movement.

First/last frame selects an inclusive range; frame indices start at zero. Full cycle is the duration of that selected mode/range. For 70 frames at 24 source FPS/100% speed: forward is 2.916667 seconds, ping-pong is 5.75 seconds. Display FPS changes neither duration.

**Play/Pause**, the timeline slider, frame thumbnails and stepping buttons let you inspect motion. Steps move through original source frames, bypassing display sampling. Reset returns to cycle start. Space toggles playback; left/right arrows step outside the encounter. The metrics show selected/total frames, effective timeline rate, complete cycle duration and display rate.

### Frame corrections — A2

This corrects changing camera framing within the selected clip. It does not track the person automatically or flatten jumps/crouches. Set the clip's normal feet/root and physical size in Ground & scale first, then open **Animation → Frame corrections**.

Choose a source frame, adjust **Move X/Y**, **Correction scale** and **Pivot X/Y**, and press **Add keyframe**. Move X is rightward; Move Y is upward, in original source pixels. The pivot is the source point that stays fixed while correction scale changes; use the visible feet on that frame when sizing around them. **Scale around the clip’s feet/root** copies the stable clip root. Correction scale is uniform (1–1000%); stylistic wide/tall distortion remains in Ground & scale.

Numbers, the scale slider and **Drag sprite to move this frame’s draft** preview a draft. **Add/Update keyframe** commits and enables it. **Revert draft** discards it; changing source frame also discards an uncommitted draft. Saved keys appear in the picker. Delete/reset/enable/bounds changes and saved keys use general Undo/Redo above the preview. A drag plus Add key is one committed edit; unsaved drafts are not exported or saved as keys.

**Linear** interpolates numbers between keys. **Hold** keeps the left key until the next one. **Smooth** eases without overshooting. The selected interpolation governs the segment to the next key. The nearest key holds before the first/after the last. There is no hidden last→first blending: the two-frame seam view compares the selected playback range's endpoints. Match them manually if needed.

Keys use zero-based indices in the full source sequence. FPS/speed/display rate/range changes do not move them. A pose receives the same correction on each ping-pong pass. The Source frame field and saved-key picker can inspect keys outside the current playback range.

**Original / Corrected** changes preview only. Export always uses enabled saved keys. **Expand to fit corrections** is the default: all frames/views share one fixed canvas/root including transparent padding. **Crop to base canvas** deliberately clips pixels outside the base shape/direction bounds; its readout warns when that happens. Neither padding nor cropping recalibrates world size. Expanded outputs over 8192 px per side are rejected before export; choose crop or reduce the correction/shape. Expansion cannot restore pixels already absent from the source image.

**View / track:** generated views follow the front track. Actual imported views start independently. **Copy front keys** makes a snapshot tied to that view's frames; **Link imported view** follows later front edits and disables independent editing. Unlink copies front values. Offsets suitable for one camera view may be wrong for another, so copy/link is explicit. Selecting an actual imported preview automatically selects its track.

Replacing footage matches keys to unique original hashes/names. Ambiguous or missing matches are retained for review and not applied. An enabled track with unmatched keys blocks Source Pack export. Discard those retained keys, reset the track, or explicitly disable it; Undo restores a discard. Save/reopen keeps the retained review keys. Imported media replacement itself still has no complete Undo history.

**Load drift test** makes 12 synthetic frames. In an existing project it adds a new clip without replacing main. Try these two keys:

| Source frame | Pivot X | Pivot Y | Move X | Move Y | Correction scale |
| --- | --- | --- | --- | --- | --- |
| 0 | 180 | 450 | 76 | −14 | 100% |
| 11 | 310 | 410 | −54 | −54 | 55.5556% |

Both endpoint feet meet the clip root at 256,464 and have the same visible height. The source grows linearly, so its inverse scale is not linear: add intermediate keys to normalize the middle precisely. This illustrates why two keys are a starting point for real Emet footage, rather than a promise to correct arbitrary motion perfectly.

## 3. Ground and scale — per animation clip

Choose the clip above the preview, then open Ground & scale. **The heading identifies the clip being edited and its native canvas dimensions.** Main is the base profile; an extra idle/attack/etc. clip can inherit it or use its own override. States automatically use the profile of the clip assigned to them.

**Inherit main grounding & scale** links the extra clip to main size/calibration/shape/offsets. Its root coordinates are mapped by the same fraction of its own canvas. Editing a placement value automatically makes that clip independent; unchecking the box also creates an override. Rechecking follows main again. **Copy main** makes an independent copy of the inherited values. **Reset clip** restores 100% scale/shape, zero offsets, a 128-unit native canvas and a root suggested from that clip's alpha bounds.

**Root X / Feet–ground Y** are source-pixel coordinates in this clip's canvas. The cross registers that root to the common world floor. Drag it in the front (S) Workbench view or type coordinates; returning to the floor on release changes the image placement, not its original pixels. Suggest feet considers the entire clip, not just the currently visible pose. This preserves intentional crouches, jumps and airborne motion; use A2 keys only where you deliberately want to correct framing.

**Sprite scale** is overall authored size, 1–200%. **Canvas height in world units** calibrates this clip's full image canvas in units, including transparent space. For example, an attack clip can have a different canvas and calibration from the main dance. **Width / Height** shape multipliers are 1–400%; linked by default. Unlink for Wide (250/100) or Tall (100/175), or enter your own values. Shape scales about the feet/root. **Offset X/Y** moves that root in physical units; positive Y raises it above the common floor. Leave Y at zero for grounded feet.

The size readout describes the full canvas's authored width/height, not the visible person's measured height. **Compare with main / Back to clip** switches the Workbench preview so you can compare placement against the same floor/reference. Undo/Redo above the preview includes profile edits, root dragging and sliders; each slider gesture is one history step. Clip imports/removal still have no complete media history.

**Preview zoom** is separate. Sunny remains approximately 121.6 units and keeps her width/height proportions even when you distort the sprite. Backgrounds/reference are preview-only.

Save/reopen retains original images, native canvases, main settings and overrides. Old shared-canvas projects migrate to inherited placement with identity shape and unchanged calibration. Source Pack v6 bakes shape and direction transforms into PNGs; uniform scale/calibration and offsets remain in the per-clip physical mapping. Each clip's exported views share one output canvas/root, padded to avoid clipping. Padding never changes the character's world size. The readout warns if transformed output exceeds 8192 px per side; reduce shape or change the direction selection before exporting. Eight views can need a larger canvas for off-centre mirrored roots. A2 supplies optional independent imported-view correction tracks.

## 4. Directions and eight views

New projects start with **Generate approximations**. Saved projects retain their mode.

- **Front-facing billboard:** one front image is reused from every angle.
- **Generate approximations:** locally squash/mirror/darken the front art into eight stylised views. Existing real views override generated ones.
- **Import real directions:** supply matching artwork for each angle. Missing views preview the front fallback; the pack reports which real views are available.

S means front, N rear, E/W sides, and the remaining labels diagonals relative to the character. They are not absolute compass directions. **Orbit camera** changes the relative view, with a small buffer at view boundaries to prevent flicker. Turning does not restart the animation. **Side width**, **rear darkening** and **mirror left approximations** adjust recipes. Mirroring reverses text and asymmetric details too.

The eight-view sheet compares the same pose across all angles and can be downloaded. Real sequences must match their clip’s frame count and fit its common canvas. Approximation is a useful preview default, but cannot invent accurate unseen anatomy/clothing. A full eight-view Source Pack can be roughly eight times the front-only PNG payload and takes longer to export; approximate views do not duplicate imported originals inside the saved project.

## 5. Audio — takes and sound banks

A **cue** describes when sound plays. Its **bank** holds one or more recordings, called takes. Empty cues are silent. The HTML can play the banks by themselves and in the gallery/encounter; it does not contain Salvatore's voice recordings automatically.

**Quick test:** Audio → **Add two test tones → Test bank**. You should hear two different tones separated by random 1–2 second pauses. These are diagnostic tones, not Salvatore voice lines. Pause bank freezes sound and the pending pause; Resume bank continues it. Stop audio cancels the entire session. Bank audition works without image frames.

**Your two “hmmms”:** choose **Idle / roaming quips → Add audio takes**, select both recordings, choose **Periodic quips**, **Weighted random**, and **Avoid immediate repeats**. Set Pause min/max, for example 5 and 15 seconds. Test bank, then States & test → State Gallery → Neutral idle → Play. With exactly two unmuted takes, Avoid immediate repeats alternates them; disabling it allows the same recording to be selected twice. Equal min/max gives a fixed pause. Pause lengths start at the end of the sound, independently of sprite FPS, speed or ping-pong.

| Cue | Preview trigger / ownership |
| --- | --- |
| Combat music | Shared by hostile approach/attack and companion combat. |
| Idle bed / Roaming bed | Background hum/music during that neutral state. Reference Idle bed from Roaming bed to keep the same bed continuous. |
| Idle / roaming quips | One shared session across idle and roaming; changing between them keeps the timer. Leaving neutral cancels voices and pending quips. |
| Neutral entry | Once per neutral session, followed by quips when it finishes. A looping entry keeps quips waiting. |
| Hostile entry / Attack enemy · companion entry | On entering the active combat family in that role. Switching hostile approach/attack does not retrigger it. |
| Defeat sting | On defeat transition, followed by Defeated item when it finishes. A continuous sting suppresses the following cue until pickup. |
| Defeated item | Ground-item groan/hum; can play once, continuously, or with pauses. Direct gallery inspection starts this cue immediately. |
| Summon / deployment | During deployment. The preview waits at least the first delay plus longest trimmed take; repeated/looping audio stops when deployment exits. |
| Attack / Hit | Actual encounter damage events; a fatal hit gives defeat audio priority. |
| Pickup / Inventory | On entering inventory; sound belongs to that stored session. |
| Repack | Repacking has its own cue instead of repeating Pickup. |
| Alert / Victory | Returning from neutral to combat / defeating the encounter enemy. |

**Use cue** offers Own takes or an explicit reference to another bank. Referenced settings are read-only here: select the original cue to edit them. A reference to an empty/disabled cue is silent. Circular references are rejected. Older projects that implicitly used combat music during neutral states reopen with explicit references to preserve that behavior; new blank neutral cues stay silent. Adding takes to a referenced cue switches it to its own bank.

Choose a take to rename it, replace its file, remove it, change its relative random weight or reorder it. **In take order** cycles through the listed order. With random selection, larger weights increase selection probability among the eligible takes; Avoid immediate repeats excludes the most recent one when another is available. Each take keeps its immutable original recording, stable ID, own trim/loop region and exported gain. Replacement retains its ID/weight/custom label but resets trim and gain. Audio Undo/Redo covers these edits and imports, with bounded local history; it is separate from general settings history and is cleared on reopening.

**Playback:**

- **Play once:** select one take on entry/event, with no automatic repeats.
- **Continuous loop:** select one take, play from trim start, then repeat its loop region until stopped. It does not randomly swap recordings at every seam.
- **Repeat after a pause / Periodic quips:** play complete trimmed takes, selecting again after each fixed/random pause. These share the same scheduler; the labels describe the intended use.

**First delay** precedes the first play. For repeat/periodic modes, disabling **Play on entry** adds a sampled pause before the first take. **Total plays** includes the first take; 0 means unlimited. Counts restart on a new bank session. **Enable cue** disables preview scheduling without removing its assets or authored settings.

**Trigger rules & seed:** cooldown limits accepted event triggers. When a cue is already playing, Ignore skips a new trigger; Restart stops it and begins again; Allow overlap permits up to 1–4 simultaneous or queued Play once voices. Other modes cannot overlap. The audio seed is separate from roaming randomness. The same seed/session reproduces choices, while random pauses are still sampled per play. The status shows the active take or remaining pause; Activity shows recent scheduler decisions.

The waveform shows the source, trim and loop boundaries. **Solo source** auditions the chosen decoded take; **Audition WAV** plays the actual converted result. Export gain is baked into that WAV. Preview mute affects listening/selection only, and master volume affects speakers only; neither deletes a take from export. The two transition tests exercise defeat→ground sound and deployment→combat. Encounter sounds pan/attenuate relative to the player marker.

Save/reopen preserves every original take, edit, weight, ID, bank setting and reference. Source Pack v6 exports separate 44.1 kHz mono signed PCM16 WAVs plus scheduling policies in its manifest; random quips are not baked into one long recording. Clipping blocks conversion. Audio stays forward at rate 1, independently of animation speed. No FNV runtime integration is implied.

**Still planned in A5:** seamless loop crossfades, state fades, ducking, loudness matching/limiting, pitch/speed effects, radio filtering, distortion, reverb and echo. A4 supports the playback workflow, but does not smooth seams or process these effects yet. Limits: 16 takes per cue, 64 per project, 40 MB/5 minutes/8 channels per file and 128 MB decoded audio overall.

## 6. States, clips and encounter

**State Gallery** exposes hostile approach/attack, defeat transition, defeated item, inventory, deployment, companion combat, neutral idle, neutral roam and repack. Choose a state, assign a clip or keep the visible main fallback, then press Play to inspect it. This is inspection without having to complete a fight.

**Add / manage animations** imports a separate image animation with its own Clip ID/timing. Use it above the preview, and assign it to states. Removing an extra clip restores the main fallback for affected states.

### Playback rules — A3

Each state assignment has its own **Playback rule**:

| Rule | How its clock works |
| --- | --- |
| Continue phase | Uses the ongoing global animation phase, as older projects did. |
| Restart on entry | Starts at the first selected source frame on every state entry. Uses the clip's authored loop/once mode afterward. |
| Play once, then return | Plays one authored cycle, then shows the Return animation. Forward and once play start→end; ping-pong completes one forward/back cycle with no doubled endpoints. |

In the encounter, Attack player · hostile and Attack enemy · companion actions start on **actual attack events**, rather than merely entering combat. While approaching/waiting, once-return bindings show the return animation. Other once-return states start on entry. Finishing an animation does not change the gameplay state, HP or attack cooldown. Return animation defaults to Main clip; select an idle/combat pose if desired. It resumes that clip's ongoing global phase, without resetting audio. A return clip authored as Play once eventually holds its last pose.

**Repeated trigger:** Restart begins the action again; Ignore lets the current action finish; Queue one retains a single pending replay, starting at completion. Additional queue requests do not build a backlog. Leaving the owner state cancels both action and queue immediately—including defeat, pickup, repack or neutral transitions. The next attack can start a fresh action. If a clip is longer than the game's attack interval, Restart may repeatedly interrupt it: shorten/speed up the clip or use Ignore/Queue one. Visual trigger policies never suppress or add gameplay damage.

**Attack defaults** selects once-return, Restart and Main return for the chosen combat state. **Test entry / action** auditions the rule in the State Gallery; repeated clicks during an action exercise retrigger behavior. Gallery inspection supplies a test entry/attack without causing damage. Reset rewinds visual playback; Pause/hidden tab freezes it. Scrubbing, stepping and thumbnails inspect the active action's local phase and resume there; seeking clears its pending replay. Visual timing uses the fixed simulation time plus the remaining fraction of a tick, so action completion does not wait for a display-FPS sample. The simulation remains fixed-step.

**Strike frame** is an optional visual cue, recorded on the first forward visit to that source index. It does not cause damage, change attack timing, trigger audio or wait for Display FPS to show the pose. The marker binds to the assigned clip's source hash/name. Identifiable reordered media remaps it; changed/ambiguous footage or a marker outside the selected range disables it visibly until reselected/cleared. Changing a state's assigned clip clears its marker.

**Load action test** supplies four idle and five attack poses with distinct native canvases, shared floor and a frame-2 strike cue. In an empty project idle becomes Main; in an existing project it adds clips and assigns test rules to both combat states and neutral idle/roam. Original media is preserved. General Undo restores the previous assignments/rules; imported test clips remain because complete media history is not implemented. Use this first, then assign your own idle/attack sequences. Each active/return clip uses its own A1 placement and A2 corrections.

Project schema 7 preserves assignments/rules/return references/markers and reads 1–6. Older projects keep Continue phase. Source Pack v6 records resolved bindings, triggers, cancellation, queue bounds and informational marker times. Each once-return binding has a separate exact one-cycle action schedule with repeat=false and explicit return behavior; ordinary clip schedules retain their authored loop rules. Live action clocks/queued plays are not saved—reopen resets the preview. General Undo/Redo includes assignments/rules. FNV integration remains deferred.

**Play Encounter** starts an interactive behavior test:

1. Move the player marker with WASD/arrows. The sprite approaches and attacks it.
2. **Attack sprite** reduces its HP; **Defeat now** skips the fight.
3. It shrinks to 20%, bounces/spins and plays defeat audio.
4. **Pick up** stores one item and stops its world sounds, even during the sting.
5. **Deploy near enemy**, or click the arena while stored, restores the sprite near the red block.
6. It defeats the block, becomes neutral, pauses and wanders.
7. **Spawn enemy** interrupts roaming with combat. **Repack** returns it to inventory; deploy again to repeat.

**Reset encounter** restores initial positions/health and pauses. **Pause all** freezes time and sound. Health meters, inventory count and the event log show what happened. Roaming settings control repeatable seed, radius, move speed, pause range and leash/return distance. Changing them resets the encounter. The same seed/configuration gives repeatable behavior.

The arena is a Canvas 2D behavior preview. These controls do not edit FNV factions, AI, collision or scripts; those require runtime integration.

## 7. Saving and export

**Save Project** preserves original image/audio bytes, directions, extra clips, timing, native canvases, root/sizing profiles and correction tracks/review keys, all audio takes/bank settings/references, state mappings/playback rules/return choices/strike markers, roaming seed and preview settings. **Open Project** restores that ZIP; it resets the live encounter. Browser downloads go to the browser’s chosen location. Save before refreshing/closing to preserve your work.

**Export Source Pack** prepares per-clip direction PNGs, converted WAVs, exact playback schedules, a contact sheet, manifest and checksums. View the schedule in the Source Pack panel. It is rebuildable source material for a future FNV adapter, not an installable mod. The reference, grain, zoom, orbit, speaker volume and preview mute are excluded from game assets.

General Undo/Redo covers settings, placement, committed correction edits and state playback bindings; Audio has its own bounded edit/import history. Extra clip/direction imports have no complete history. Unsaved status, import review, progress and Cancel help protect work. Hidden tabs pause preview playback/audio. The current build does not autosave a recovery project.

## Source facing

Select your attack clip above the preview, then open **Animation → Source faces**. Choose **Left** or **Right** to match the original artwork. In Encounter the same clip automatically mirrors toward the player or enemy, relative to the camera, around its saved feet/root. This uses the original S sequence and its correction track without generated squash/darkening. Workbench and Gallery keep the original orientation so you can edit consistently. **Front / use direction views** keeps the existing eight-view behavior and is the default for old and new clips.

The setting is independent per clip, supports Undo/Redo and survives project save/reopen. Source Packs retain original orientation and include the runtime facing policy; this does not implement the FNV bridge. Mirroring reverses text and asymmetry and cannot reconstruct a rear view.
